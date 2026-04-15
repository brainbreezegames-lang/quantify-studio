import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { v4 as uuid } from 'uuid'
import { useDesigner } from '../designer-store'
import type { ChatMessage, ArtboardAction, QualityLens } from '../types'

function getOpenRouterKey(): string {
  return localStorage.getItem('openrouter_api_key') || ''
}

const SUGGESTED_PROMPTS = [
  'Reservation list screen',
  'Login screen',
  'Yard count screen with scanner',
  'Shipment detail screen',
  'Dashboard with today\'s stats',
  'Return count screen',
]

const LENS_OPTIONS: { id: QualityLens; label: string; icon: string }[] = [
  { id: 'premium', label: 'Premium', icon: '✦' },
  { id: 'gestalt', label: 'Gestalt', icon: '◎' },
  { id: 'typography', label: 'Type', icon: 'Aa' },
  { id: 'accessibility', label: 'A11y', icon: '♿' },
]

const MODELS = [
  { id: 'google/gemini-3.1-flash-lite-preview', label: 'Gemini 3.1 Flash Lite (fast)', short: 'Flash' },
  { id: 'google/gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro (higher quality)', short: 'Gemini Pro' },
  { id: 'anthropic/claude-opus-4.6', label: 'Claude Opus 4.6', short: 'Opus 4.6' },
  { id: 'openai/gpt-5.4', label: 'GPT-5.4', short: 'GPT-5.4' },
] as const

// Hidden context appended to every design generation prompt (not shown to user)
const HIDDEN_DESIGN_CONTEXT = `

[CONTEXT — automatically included, not written by user]
You are designing for Quantify by Avontus — a scaffolding rental and inventory management app used by yard workers on tablets in harsh outdoor environments (direct sunlight, thick gloves, mud, competing with paper clipboards). The design system uses Switzer font, #0A3EFF primary blue, 0px border radius (sharp corners), no shadows, sentence case only. Products are scaffolding equipment: frames, braces, ledgers, jacks, planks, couplers. Users manage reservations, shipments, returns, yard counts, and inventory. Every screen needs an Online/Offline pill in the toolbar. Touch targets must be 48px+ for gloved hands. Think like a senior product designer who has spent years understanding industrial mobile UX — not a generic UI generator.`

// ── Smart artboard placement ───────────────────────────────────────────────
// Places next to existing artboards, wrapping to a new row when the row is full.
// Uses actual artboard positions so it works correctly after drag/delete.
import type { Artboard as ArtboardType } from '../types'

const COL_STRIDE = 450  // artboard width (390) + gap (60)
const MAX_COLS = 5
const ROW_GAP = 80      // vertical gap between rows
const ORIGIN_X = 100
const ORIGIN_Y = 100

function nextPositions(artboards: ArtboardType[], count = 1): { x: number; y: number }[] {
  const maxRowX = ORIGIN_X + MAX_COLS * COL_STRIDE

  if (artboards.length === 0) {
    return Array.from({ length: count }, (_, i) => ({ x: ORIGIN_X + i * COL_STRIDE, y: ORIGIN_Y }))
  }

  // Find the row with the highest Y (bottom row)
  const maxY = Math.max(...artboards.map(a => a.y))
  const bottomRow = artboards.filter(a => Math.abs(a.y - maxY) < 200)
  const rightmost = bottomRow.reduce((m, a) => (a.x + a.width > m.x + m.width ? a : m))
  const startX = rightmost.x + rightmost.width + 60

  // All requested artboards fit in the current row
  if (startX + count * COL_STRIDE - 60 <= maxRowX) {
    return Array.from({ length: count }, (_, i) => ({ x: startX + i * COL_STRIDE, y: maxY }))
  }

  // Start a new row just below the bottom of all artboards
  const overallBottom = Math.max(...artboards.map(a => a.y + a.height))
  const newY = overallBottom + ROW_GAP
  return Array.from({ length: count }, (_, i) => ({ x: ORIGIN_X + i * COL_STRIDE, y: newY }))
}

// ── Progressive HTML extraction from partial JSON ────────────────────────

function extractProgressiveHtml(accumulated: string): string | null {
  const marker = /"html"\s*:\s*"/
  const match = accumulated.match(marker)
  if (!match || match.index === undefined) return null

  const startIdx = match.index + match[0].length
  let result = ''
  let i = startIdx

  while (i < accumulated.length) {
    const ch = accumulated[i]
    if (ch === '\\' && i + 1 < accumulated.length) {
      const next = accumulated[i + 1]
      switch (next) {
        case 'n': result += '\n'; i += 2; continue
        case 't': result += '\t'; i += 2; continue
        case '"': result += '"'; i += 2; continue
        case '\\': result += '\\'; i += 2; continue
        case '/': result += '/'; i += 2; continue
        case 'r': result += '\r'; i += 2; continue
        default: result += ch; i++; continue
      }
    }
    if (ch === '"') break
    result += ch
    i++
  }

  return result || null
}

function extractProgressiveName(accumulated: string): string | null {
  const match = accumulated.match(/"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/)
  if (!match) return null
  return match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\')
}

// ── Status steps for progress tracking ──────────────────────────────────
const STATUS_STEPS = [
  { key: 'Planning', label: 'Plan' },
  { key: 'Designing', label: 'Design' },
  { key: 'Building', label: 'Build' },
  { key: 'Refin', label: 'Refine' },
  { key: 'Verif', label: 'Verify' },
  { key: 'Analyz', label: 'Analyze' },
  { key: 'Recreat', label: 'Recreate' },
]

function getActiveStep(status: string | null): number {
  if (!status) return -1
  for (let i = STATUS_STEPS.length - 1; i >= 0; i--) {
    if (status.includes(STATUS_STEPS[i].key)) return i
  }
  return 0
}

// ── Component ────────────────────────────────────────────────────────────

export default function ChatPanel() {
  const { state, dispatch } = useDesigner()
  const { messages, isGenerating, artboards, selectedArtboardId, activeLenses } = state

  const [input, setInput] = useState('')
  const [streamingStatus, setStreamingStatus] = useState<string | null>(null)
  const [isChatting, setIsChatting] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>(MODELS[0].id)
  const [showModelPicker, setShowModelPicker] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<{ dataUrl: string; name: string } | null>(null)
  const [generate3Options, setGenerate3Options] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const isBusy = isGenerating || isChatting

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }, [input])

  // ── Chat mode: discuss with AI (no artboards) ──────────────────────────
  const sendChat = useCallback(async (text?: string) => {
    const content = (text || input).trim()
    if (!content || isBusy) return

    const userMsg: ChatMessage = {
      id: uuid(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    dispatch({ type: 'ADD_MESSAGE', message: userMsg })
    setInput('')
    setIsChatting(true)
    dispatch({ type: 'SET_ERROR', error: null })

    try {
      const recentMessages = [...messages.slice(-14), userMsg].map(m => ({
        role: m.role, content: m.content,
      }))

      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'designer-chat',
          messages: recentMessages,
          model: selectedModel,
          openRouterApiKey: getOpenRouterKey(),
        }),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error || 'Something went wrong')
      }

      const data = await resp.json()
      const assistantMsg: ChatMessage = {
        id: uuid(),
        role: 'assistant',
        content: data.reply || 'No response.',
        timestamp: Date.now(),
      }
      dispatch({ type: 'ADD_MESSAGE', message: assistantMsg })
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: uuid(),
        role: 'assistant',
        content: `Error: ${err.message || 'Something went wrong.'}`,
        timestamp: Date.now(),
      }
      dispatch({ type: 'ADD_MESSAGE', message: errMsg })
    } finally {
      setIsChatting(false)
    }
  }, [input, messages, isBusy, selectedModel, dispatch])

  // ── Design mode: generate artboards (SSE streaming) ────────────────────
  const sendDesign = useCallback(async (text?: string) => {
    const content = (text || input).trim()
    if (!content || isBusy) return

    const userMsg: ChatMessage = {
      id: uuid(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    dispatch({ type: 'ADD_MESSAGE', message: userMsg })
    setInput('')
    dispatch({ type: 'SET_GENERATING', value: true })
    dispatch({ type: 'SET_ERROR', error: null })
    setStreamingStatus('Planning design...')

    // Create blank artboard immediately so user sees it on canvas
    const previewArtboardId = uuid()
    const [{ x, y }] = nextPositions(artboards, 1)

    dispatch({
      type: 'CREATE_ARTBOARD',
      artboard: {
        id: previewArtboardId,
        name: 'Generating...',
        x, y,
        width: 390, height: 844,
        html: '', css: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    })

    const abortController = new AbortController()
    abortRef.current = abortController

    try {
      const artboardContext = artboards.map(a => ({
        id: a.id, name: a.name, width: a.width, height: a.height,
        html: a.html.slice(0, 3000),
      }))

      const recentMessages = [...messages.slice(-14), userMsg].map(m => ({
        role: m.role, content: m.content,
      }))

      // Append hidden context + artboard info to the last user message
      let augmentedContent = content + HIDDEN_DESIGN_CONTEXT
      if (artboards.length > 0) {
        const selectedArtboard = selectedArtboardId
          ? artboards.find(a => a.id === selectedArtboardId)
          : null
        if (selectedArtboard) {
          augmentedContent += `\n\n[Currently selected artboard: "${selectedArtboard.name}" (id: ${selectedArtboard.id}, ${selectedArtboard.width}×${selectedArtboard.height})]`
          if (selectedArtboard.html) {
            augmentedContent += `\n[Current HTML of selected artboard:]\n${selectedArtboard.html}`
          }
        }
        augmentedContent += `\n\n[Existing artboards on canvas: ${artboards.map(a => `"${a.name}" (id: ${a.id})`).join(', ')}]`
      }

      const apiMessages = recentMessages.map((m, i) =>
        i === recentMessages.length - 1 && m.role === 'user'
          ? { ...m, content: augmentedContent }
          : m
      )

      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          action: 'designer',
          messages: apiMessages,
          artboards: artboardContext,
          model: selectedModel,
          openRouterApiKey: getOpenRouterKey(),
          activeLenses,
        }),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error || 'Something went wrong')
      }

      // Read SSE stream
      const reader = resp.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      let lastRenderTime = 0
      let sseBuffer = ''
      let artboardCreated = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        sseBuffer += decoder.decode(value, { stream: true })
        const events = sseBuffer.split('\n\n')
        sseBuffer = events.pop()!

        for (const event of events) {
          const lines = event.split('\n')
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6)

            try {
              const evt = JSON.parse(data)

              if (evt.type === 'status') {
                setStreamingStatus(evt.message || 'Designing...')
              } else if (evt.type === 'delta') {
                accumulated += evt.text

                const name = extractProgressiveName(accumulated)
                if (name) {
                  setStreamingStatus(`Building ${name}...`)
                  dispatch({ type: 'UPDATE_ARTBOARD', id: previewArtboardId, updates: { name } })
                }

                const now = Date.now()
                if (now - lastRenderTime >= 500) {
                  lastRenderTime = now
                  const html = extractProgressiveHtml(accumulated)
                  if (html && html.length > 40) {
                    dispatch({
                      type: 'UPDATE_ARTBOARD',
                      id: previewArtboardId,
                      updates: { html },
                    })
                    artboardCreated = true
                  }
                }
              } else if (evt.type === 'pass1_done') {
                const html = extractProgressiveHtml(accumulated)
                if (html) {
                  dispatch({
                    type: 'UPDATE_ARTBOARD',
                    id: previewArtboardId,
                    updates: { html },
                  })
                  artboardCreated = true
                }
                accumulated = ''
                lastRenderTime = 0
              } else if (evt.type === 'done') {
                setStreamingStatus(null)
                const actions: ArtboardAction[] = []

                if (evt.artboards && Array.isArray(evt.artboards)) {
                  for (let idx = 0; idx < evt.artboards.length; idx++) {
                    const ab = evt.artboards[idx]
                    if (ab.action === 'create') {
                      if (idx === 0) {
                        dispatch({
                          type: 'UPDATE_ARTBOARD',
                          id: previewArtboardId,
                          updates: {
                            html: ab.html || '',
                            css: ab.css || '',
                            name: ab.name || 'New screen',
                          },
                        })
                        actions.push({ type: 'create', artboardId: previewArtboardId, artboardName: ab.name || 'New screen' })
                      } else {
                        const newId = uuid()
                        dispatch({
                          type: 'CREATE_ARTBOARD',
                          artboard: {
                            id: newId,
                            name: ab.name || 'New screen',
                            x: x + 450 * idx, y,
                            width: ab.width || 390,
                            height: ab.height || 844,
                            html: ab.html || '',
                            css: ab.css || '',
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                          },
                        })
                        actions.push({ type: 'create', artboardId: newId, artboardName: ab.name || 'New screen' })
                      }
                    } else if (ab.action === 'update' && ab.id) {
                      dispatch({
                        type: 'UPDATE_ARTBOARD',
                        id: ab.id,
                        updates: {
                          html: ab.html,
                          css: ab.css || '',
                          ...(ab.name ? { name: ab.name } : {}),
                        },
                      })
                      actions.push({ type: 'update', artboardId: ab.id, artboardName: ab.name || '' })
                    }
                  }
                }

                if (actions.length === 0 && !artboardCreated) {
                  dispatch({ type: 'DELETE_ARTBOARD', id: previewArtboardId })
                }

                const assistantMsg: ChatMessage = {
                  id: uuid(),
                  role: 'assistant',
                  content: evt.reply || 'Done.',
                  timestamp: Date.now(),
                  artboardActions: actions.length > 0 ? actions : undefined,
                }
                dispatch({ type: 'ADD_MESSAGE', message: assistantMsg })
              } else if (evt.type === 'error') {
                throw new Error(evt.error || 'Generation failed')
              }
            } catch (parseErr: any) {
              if (parseErr instanceof Error && parseErr.message !== 'Unexpected end of JSON input'
                && !parseErr.message.includes('Unexpected token')
                && !parseErr.message.includes('JSON')) {
                throw parseErr
              }
            }
          }
        }
      }

      if (accumulated && !artboardCreated) {
        const html = extractProgressiveHtml(accumulated)
        if (html) {
          dispatch({ type: 'UPDATE_ARTBOARD', id: previewArtboardId, updates: { html } })
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return
      setStreamingStatus(null)
      dispatch({ type: 'DELETE_ARTBOARD', id: previewArtboardId })
      const errMsg: ChatMessage = {
        id: uuid(),
        role: 'assistant',
        content: `Error: ${err.message || 'Something went wrong.'}`,
        timestamp: Date.now(),
      }
      dispatch({ type: 'ADD_MESSAGE', message: errMsg })
    } finally {
      setStreamingStatus(null)
      dispatch({ type: 'SET_GENERATING', value: false })
      abortRef.current = null
    }
  }, [input, messages, isBusy, artboards, selectedArtboardId, activeLenses, selectedModel, dispatch])

  // ── Generate 3 design options (non-streaming) ───────────────────────────
  const sendVariants = useCallback(async () => {
    const content = input.trim()
    if (!content || isBusy) return

    const userMsg: ChatMessage = {
      id: uuid(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    dispatch({ type: 'ADD_MESSAGE', message: userMsg })
    setInput('')
    dispatch({ type: 'SET_GENERATING', value: true })
    dispatch({ type: 'SET_ERROR', error: null })
    setStreamingStatus('Generating 3 design options...')

    const OPTION_NAMES = ['Option A — Efficiency First', 'Option B — Information Rich', 'Option C — Guided Clarity']
    const artboardIds = [uuid(), uuid(), uuid()]
    const variantPositions = nextPositions(artboards, 3)

    for (let i = 0; i < 3; i++) {
      const { x, y } = variantPositions[i]
      dispatch({
        type: 'CREATE_ARTBOARD',
        artboard: {
          id: artboardIds[i],
          name: OPTION_NAMES[i],
          x,
          y,
          width: 390, height: 844,
          html: '', css: '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      })
    }

    try {
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'variants',
          prompt: content,
          model: selectedModel,
          openRouterApiKey: getOpenRouterKey(),
        }),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error || 'Something went wrong')
      }

      const data = await resp.json()
      const variants: Array<{
        label: string
        rationale?: { title: string; direction: string; uxPrinciple: string }
        title?: string
        direction?: string
        uxPrinciple?: string
        webDesign?: { html: string; css: string } | null
      }> = data.variants || []

      for (let i = 0; i < Math.min(variants.length, 3); i++) {
        const v = variants[i]
        const title = v.rationale?.title || v.title || ''
        dispatch({
          type: 'UPDATE_ARTBOARD',
          id: artboardIds[i],
          updates: {
            name: `Option ${v.label} — ${title}`,
            html: v.webDesign?.html || '',
            css: v.webDesign?.css || '',
          },
        })
      }

      const lines = variants.slice(0, 3).map(v => {
        const title = v.rationale?.title || v.title || ''
        const direction = v.rationale?.direction || v.direction || ''
        return `**${v.label} — ${title}:** ${direction}`
      })
      const assistantMsg: ChatMessage = {
        id: uuid(),
        role: 'assistant',
        content: `Here are 3 design options for "${content}":\n\n${lines.join('\n\n')}`,
        timestamp: Date.now(),
      }
      dispatch({ type: 'ADD_MESSAGE', message: assistantMsg })
    } catch (err: any) {
      for (const id of artboardIds) dispatch({ type: 'DELETE_ARTBOARD', id })
      const errMsg: ChatMessage = {
        id: uuid(),
        role: 'assistant',
        content: `Error: ${err.message || 'Something went wrong.'}`,
        timestamp: Date.now(),
      }
      dispatch({ type: 'ADD_MESSAGE', message: errMsg })
    } finally {
      setStreamingStatus(null)
      dispatch({ type: 'SET_GENERATING', value: false })
    }
  }, [input, isBusy, artboards, selectedModel, dispatch])

  // ── Image upload: recreate screenshot exactly ──────────────────────────
  const handleImageFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setUploadedImage({ dataUrl, name: file.name })
    }
    reader.readAsDataURL(file)
  }, [])

  const sendImageDesign = useCallback(async () => {
    if (!uploadedImage || isBusy) return

    const userMsg: ChatMessage = {
      id: uuid(),
      role: 'user',
      content: `Recreate this screen from image: ${uploadedImage.name}`,
      timestamp: Date.now(),
    }
    dispatch({ type: 'ADD_MESSAGE', message: userMsg })
    setUploadedImage(null)
    dispatch({ type: 'SET_GENERATING', value: true })
    dispatch({ type: 'SET_ERROR', error: null })
    setStreamingStatus('Analyzing image...')

    const previewArtboardId = uuid()
    const [{ x, y }] = nextPositions(artboards, 1)

    dispatch({
      type: 'CREATE_ARTBOARD',
      artboard: {
        id: previewArtboardId,
        name: 'Recreating...',
        x, y,
        width: 390, height: 844,
        html: '', css: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    })

    const abortController = new AbortController()
    abortRef.current = abortController

    try {
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          action: 'designer-image',
          imageUrl: uploadedImage.dataUrl,
          model: selectedModel,
          openRouterApiKey: getOpenRouterKey(),
        }),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error || 'Something went wrong')
      }

      // Read SSE stream (same as sendDesign)
      const reader = resp.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      let lastRenderTime = 0
      let sseBuffer = ''
      let artboardCreated = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        sseBuffer += decoder.decode(value, { stream: true })
        const events = sseBuffer.split('\n\n')
        sseBuffer = events.pop()!

        for (const event of events) {
          const lines = event.split('\n')
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6)

            try {
              const evt = JSON.parse(data)

              if (evt.type === 'status') {
                setStreamingStatus(evt.message || 'Recreating...')
              } else if (evt.type === 'delta') {
                accumulated += evt.text

                const name = extractProgressiveName(accumulated)
                if (name) {
                  dispatch({ type: 'UPDATE_ARTBOARD', id: previewArtboardId, updates: { name } })
                }

                const now = Date.now()
                if (now - lastRenderTime >= 500) {
                  lastRenderTime = now
                  const html = extractProgressiveHtml(accumulated)
                  if (html && html.length > 40) {
                    dispatch({ type: 'UPDATE_ARTBOARD', id: previewArtboardId, updates: { html } })
                    artboardCreated = true
                  }
                }
              } else if (evt.type === 'pass1_done') {
                const html = extractProgressiveHtml(accumulated)
                if (html) {
                  dispatch({ type: 'UPDATE_ARTBOARD', id: previewArtboardId, updates: { html } })
                  artboardCreated = true
                }
                accumulated = ''
                lastRenderTime = 0
              } else if (evt.type === 'done') {
                setStreamingStatus(null)
                const actions: ArtboardAction[] = []

                if (evt.artboards && Array.isArray(evt.artboards)) {
                  for (let idx = 0; idx < evt.artboards.length; idx++) {
                    const ab = evt.artboards[idx]
                    if (idx === 0) {
                      dispatch({
                        type: 'UPDATE_ARTBOARD',
                        id: previewArtboardId,
                        updates: { html: ab.html || '', css: ab.css || '', name: ab.name || 'Imported screen' },
                      })
                      actions.push({ type: 'create', artboardId: previewArtboardId, artboardName: ab.name || 'Imported screen' })
                    } else {
                      const newId = uuid()
                      dispatch({
                        type: 'CREATE_ARTBOARD',
                        artboard: {
                          id: newId,
                          name: ab.name || 'Imported screen',
                          x: x + 450 * idx, y,
                          width: ab.width || 390,
                          height: ab.height || 844,
                          html: ab.html || '',
                          css: ab.css || '',
                          createdAt: Date.now(),
                          updatedAt: Date.now(),
                        },
                      })
                      actions.push({ type: 'create', artboardId: newId, artboardName: ab.name || 'Imported screen' })
                    }
                  }
                }

                if (actions.length === 0 && !artboardCreated) {
                  dispatch({ type: 'DELETE_ARTBOARD', id: previewArtboardId })
                }

                const assistantMsg: ChatMessage = {
                  id: uuid(),
                  role: 'assistant',
                  content: evt.reply || 'Done.',
                  timestamp: Date.now(),
                  artboardActions: actions.length > 0 ? actions : undefined,
                }
                dispatch({ type: 'ADD_MESSAGE', message: assistantMsg })
              } else if (evt.type === 'error') {
                throw new Error(evt.error || 'Recreation failed')
              }
            } catch (parseErr: any) {
              if (parseErr instanceof Error && !parseErr.message.includes('JSON') && !parseErr.message.includes('Unexpected')) {
                throw parseErr
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return
      setStreamingStatus(null)
      dispatch({ type: 'DELETE_ARTBOARD', id: previewArtboardId })
      const errMsg: ChatMessage = {
        id: uuid(),
        role: 'assistant',
        content: `Error: ${err.message || 'Something went wrong.'}`,
        timestamp: Date.now(),
      }
      dispatch({ type: 'ADD_MESSAGE', message: errMsg })
    } finally {
      setStreamingStatus(null)
      dispatch({ type: 'SET_GENERATING', value: false })
      abortRef.current = null
    }
  }, [uploadedImage, isBusy, artboards, selectedModel, dispatch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendChat()
    }
  }

  const activeStep = getActiveStep(streamingStatus)
  const currentModel = MODELS.find(m => m.id === selectedModel)

  return (
    <div className="flex flex-col h-full" style={{ width: 320, background: '#0e0e11' }}>
      {/* ── Generation progress bar ── */}
      {isBusy && (
        <div className="flex-shrink-0">
          {/* Animated gradient bar */}
          <div className="h-[2px] w-full overflow-hidden">
            <div
              className="h-full w-full"
              style={{
                background: 'linear-gradient(90deg, transparent, #0A3EFF, #4d7fff, #0A3EFF, transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}
            />
          </div>
          {/* Status with step dots */}
          <div className="px-3 py-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {STATUS_STEPS.slice(0, 4).map((step, i) => (
                <div
                  key={step.key}
                  className="transition-all duration-300"
                  style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: i <= activeStep ? '#0A3EFF' : 'rgba(255,255,255,0.08)',
                    boxShadow: i === activeStep ? '0 0 6px #0A3EFF' : 'none',
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] text-white/40 truncate flex-1">
              {streamingStatus || (isChatting ? 'Thinking...' : 'Generating...')}
            </span>
            <button
              onClick={() => { abortRef.current?.abort(); setStreamingStatus(null) }}
              className="text-[9px] text-white/20 hover:text-white/50 transition-colors px-1.5 py-0.5 rounded hover:bg-white/[0.05]"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-2 min-h-0">
        {messages.length === 0 && !isBusy && (
          <div className="pt-2 pb-1">
            <div className="text-[10px] text-white/20 mb-2">Quick start</div>
            <div className="space-y-0.5">
              {SUGGESTED_PROMPTS.map(q => (
                <button
                  key={q}
                  onClick={() => sendDesign(q)}
                  className="block w-full text-left text-[11px] text-white/35 hover:text-white/70 px-2 py-1.5 rounded hover:bg-white/[0.04] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'user' ? (
              <div className="max-w-[88%] text-[11px] leading-[1.5] rounded-md px-2.5 py-1.5 bg-[#0A3EFF]/12 text-white/80 whitespace-pre-wrap">
                {msg.content}
              </div>
            ) : (
              <div className="max-w-[92%] rounded-md px-2.5 py-1.5 bg-white/[0.03]">
                {msg.artboardActions && msg.artboardActions.length > 0 && (
                  <div className="mb-1.5 space-y-0.5">
                    {msg.artboardActions.map((action, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[9px]">
                        <span
                          className="w-1 h-1 rounded-full flex-shrink-0"
                          style={{ background: action.type === 'create' ? '#22C55E' : '#0A3EFF' }}
                        />
                        <span className="text-white/30">
                          {action.type === 'create' ? 'Created' : 'Updated'}
                        </span>
                        <span className="text-white/50 truncate">{action.artboardName}</span>
                      </div>
                    ))}
                  </div>
                )}
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h3 className="text-[12px] font-bold text-white/85 mt-2 mb-1 first:mt-0">{children}</h3>,
                    h2: ({ children }) => <h4 className="text-[11px] font-bold text-white/85 mt-2 mb-1 first:mt-0">{children}</h4>,
                    h3: ({ children }) => <h5 className="text-[11px] font-semibold text-white/85 mt-1.5 mb-0.5 first:mt-0">{children}</h5>,
                    p: ({ children }) => <p className="text-[11px] leading-[1.55] text-white/55 mb-1.5 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="text-[11px] leading-[1.55] mb-1.5 last:mb-0 pl-3.5 space-y-0.5 list-disc marker:text-white/20">{children}</ul>,
                    ol: ({ children }) => <ol className="text-[11px] leading-[1.55] mb-1.5 last:mb-0 pl-3.5 space-y-0.5 list-decimal marker:text-white/20">{children}</ol>,
                    li: ({ children }) => <li className="text-white/55">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-white/80">{children}</strong>,
                    code: ({ children, className }) => {
                      const isBlock = className?.includes('language-')
                      if (isBlock) {
                        return <code className="block bg-black/30 text-white/50 text-[10px] leading-[1.5] rounded px-2 py-1.5 my-1.5 overflow-x-auto font-mono whitespace-pre">{children}</code>
                      }
                      return <code className="bg-black/30 text-[#4d7fff] text-[10px] px-1 py-0.5 rounded font-mono">{children}</code>
                    },
                    pre: ({ children }) => <div className="my-1">{children}</div>,
                    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#4d7fff] hover:underline">{children}</a>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Input area ── */}
      <div className="flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {/* Controls row: model + lenses — single tight line */}
        <div className="px-3 pt-2 pb-1 flex items-center gap-1 overflow-x-auto">
          <div className="relative">
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="text-[9px] px-1.5 py-[3px] rounded bg-white/[0.05] text-white/40 hover:text-white/60 hover:bg-white/[0.08] transition-all flex items-center gap-1 whitespace-nowrap"
            >
              {currentModel?.short || 'Model'}
              <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            {showModelPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowModelPicker(false)} />
                <div className="absolute bottom-full left-0 mb-1 w-52 bg-[#141418] border border-white/[0.08] rounded-md shadow-2xl overflow-hidden z-50">
                  {MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m.id); setShowModelPicker(false) }}
                      className={`w-full text-left px-2.5 py-1.5 text-[10px] transition-colors flex items-center justify-between ${
                        selectedModel === m.id
                          ? 'bg-[#0A3EFF]/12 text-[#4d7fff]'
                          : 'text-white/50 hover:bg-white/[0.04] hover:text-white/70'
                      }`}
                    >
                      <span>{m.label}</span>
                      {selectedModel === m.id && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="w-px h-3 bg-white/[0.06] mx-0.5" />

          {LENS_OPTIONS.map(lens => {
            const active = activeLenses.includes(lens.id)
            return (
              <button
                key={lens.id}
                onClick={() => dispatch({ type: 'TOGGLE_LENS', lens: lens.id })}
                className={`text-[9px] px-1.5 py-[3px] rounded transition-all whitespace-nowrap ${
                  active
                    ? 'bg-[#0A3EFF]/15 text-[#4d7fff]'
                    : 'text-white/25 hover:text-white/45 hover:bg-white/[0.04]'
                }`}
                title={lens.label}
              >
                {lens.icon}
              </button>
            )
          })}
        </div>

        {/* Input + buttons */}
        <div className="px-3 pb-3 pt-1">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleImageFile(file)
              e.target.value = ''
            }}
          />

          {/* Image preview */}
          {uploadedImage && (
            <div className="mb-1.5 flex items-center gap-2 bg-white/[0.04] rounded px-2 py-1.5">
              <img src={uploadedImage.dataUrl} alt="Upload preview" className="w-8 h-8 rounded object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-white/50 truncate">{uploadedImage.name}</div>
              </div>
              <button
                onClick={() => setUploadedImage(null)}
                className="text-white/20 hover:text-white/50 transition-colors flex-shrink-0 p-0.5"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          )}

          {/* Textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe a screen..."
              rows={1}
              className="w-full text-white/85 text-[12px] leading-[1.5] rounded-md px-3 py-2 pr-8 resize-none outline-none placeholder:text-white/20 transition-colors"
              style={{
                minHeight: 36, maxHeight: 120,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(10,62,255,0.3)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
              disabled={isBusy}
            />
            <button
              onClick={() => sendChat()}
              disabled={!input.trim() || isBusy}
              className="absolute bottom-[7px] right-[7px] p-1 rounded text-white/30 hover:text-white/60 disabled:opacity-0 transition-all"
              title="Chat (Enter)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-1.5 mt-1.5">
            {/* Import */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
              className="flex-shrink-0 px-2 py-[6px] rounded-md text-[10px] text-white/30 hover:text-white/55 hover:bg-white/[0.05] disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center gap-1"
              title="Upload a screenshot to recreate"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              Import
            </button>

            {uploadedImage ? (
              <button
                onClick={sendImageDesign}
                disabled={isBusy}
                className="flex-1 py-[6px] rounded-md text-[11px] font-medium text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
                style={{ background: '#0A3EFF' }}
              >
                Recreate from image
              </button>
            ) : (
              <>
                <button
                  onClick={generate3Options ? sendVariants : () => sendDesign()}
                  disabled={!input.trim() || isBusy}
                  className="flex-1 py-[6px] rounded-md text-[11px] font-medium text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
                  style={{
                    background: (!input.trim() || isBusy) ? 'rgba(10,62,255,0.3)' : '#0A3EFF',
                  }}
                >
                  {generate3Options ? (
                    <>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="6" height="18" rx="0" /><rect x="9" y="3" width="6" height="18" rx="0" /><rect x="16" y="3" width="6" height="18" rx="0" /></svg>
                      3 options
                    </>
                  ) : (
                    <>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="0" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                      Design
                    </>
                  )}
                </button>
                <button
                  onClick={() => setGenerate3Options(v => !v)}
                  disabled={isBusy}
                  title={generate3Options ? '3 options on' : 'Generate 3 design options'}
                  className={`flex-shrink-0 w-7 flex items-center justify-center rounded-md text-[10px] transition-all ${
                    generate3Options
                      ? 'bg-[#0A3EFF]/20 text-[#4d7fff] ring-1 ring-[#0A3EFF]/30'
                      : 'bg-white/[0.04] text-white/25 hover:bg-white/[0.07] hover:text-white/45'
                  } disabled:opacity-20 disabled:cursor-not-allowed`}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="6" height="18" rx="0" /><rect x="9" y="3" width="6" height="18" rx="0" /><rect x="16" y="3" width="6" height="18" rx="0" /></svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Shimmer animation keyframes */}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  )
}
