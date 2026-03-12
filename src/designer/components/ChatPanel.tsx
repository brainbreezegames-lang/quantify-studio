import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { v4 as uuid } from 'uuid'
import { useDesigner } from '../designer-store'
import type { ChatMessage, ArtboardAction, QualityLens } from '../types'

function getOpenRouterKey(): string {
  return localStorage.getItem('openrouter_api_key') || ''
}

const SUGGESTED_PROMPTS = [
  'Design a reservation list screen',
  'Create a login screen',
  'Design a yard count screen with scanner',
  'Create a shipment detail screen',
  'Design a dashboard with today\'s stats',
  'Create a return count screen',
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

// ── Component ────────────────────────────────────────────────────────────

export default function ChatPanel() {
  const { state, dispatch } = useDesigner()
  const { messages, isGenerating, artboards, selectedArtboardId, activeLenses } = state

  const [input, setInput] = useState('')
  const [streamingStatus, setStreamingStatus] = useState<string | null>(null)
  const [isChatting, setIsChatting] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>(MODELS[0].id)
  const [showModelPicker, setShowModelPicker] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
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
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
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
    const lastArtboard = artboards.length > 0 ? artboards[artboards.length - 1] : null
    const x = lastArtboard ? lastArtboard.x + lastArtboard.width + 60 : 100
    const y = lastArtboard ? lastArtboard.y : 100

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendChat()
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#111114] border-l border-white/[0.06]" style={{ width: 380 }}>
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <span className="text-[13px] font-semibold text-white/90">Design chat</span>
        {messages.length > 0 && (
          <button
            onClick={() => dispatch({ type: 'CLEAR_CHAT' })}
            className="text-[10px] text-white/30 hover:text-white/50 px-2 py-1 rounded hover:bg-white/[0.05] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages — scrollable area takes remaining space */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
        {messages.length === 0 && !isBusy && (
          <div className="py-4">
            <div className="text-[11px] text-white/30 mb-3 leading-[1.5]">
              Chat to discuss your design idea first, then hit <strong className="text-white/50">Design screen</strong> when ready.
            </div>
            <div className="text-[11px] text-white/25 mb-2">Quick start:</div>
            <div className="space-y-1">
              {SUGGESTED_PROMPTS.map(q => (
                <button
                  key={q}
                  onClick={() => sendDesign(q)}
                  className="block w-full text-left text-[12px] text-[#0A3EFF]/60 hover:text-[#0A3EFF] px-3 py-2 rounded bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
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
              <div className="max-w-[85%] text-[12px] leading-[1.6] rounded-lg px-3 py-2 bg-[#0A3EFF]/15 text-white/90 whitespace-pre-wrap">
                {msg.content}
              </div>
            ) : (
              <div className="max-w-[90%] rounded-lg px-3 py-2 bg-white/[0.05] text-white/80">
                {msg.artboardActions && msg.artboardActions.length > 0 && (
                  <div className="mb-2 space-y-1">
                    {msg.artboardActions.map((action, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] text-[#0A3EFF]/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0A3EFF]/50" />
                        {action.type === 'create' ? 'Created' : 'Updated'}: {action.artboardName}
                      </div>
                    ))}
                  </div>
                )}
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h3 className="text-[13px] font-bold text-white/90 mt-3 mb-1.5 first:mt-0">{children}</h3>,
                    h2: ({ children }) => <h4 className="text-[12px] font-bold text-white/90 mt-2.5 mb-1 first:mt-0">{children}</h4>,
                    h3: ({ children }) => <h5 className="text-[12px] font-semibold text-white/90 mt-2 mb-1 first:mt-0">{children}</h5>,
                    p: ({ children }) => <p className="text-[12px] leading-[1.65] text-white/70 mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="text-[12px] leading-[1.65] mb-2 last:mb-0 pl-4 space-y-0.5 list-disc marker:text-white/30">{children}</ul>,
                    ol: ({ children }) => <ol className="text-[12px] leading-[1.65] mb-2 last:mb-0 pl-4 space-y-0.5 list-decimal marker:text-white/30">{children}</ol>,
                    li: ({ children }) => <li className="text-white/70 pl-0.5">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-white/90">{children}</strong>,
                    code: ({ children, className }) => {
                      const isBlock = className?.includes('language-')
                      if (isBlock) {
                        return <code className="block bg-black/30 text-white/60 text-[11px] leading-[1.5] rounded px-2.5 py-2 my-2 overflow-x-auto font-mono whitespace-pre">{children}</code>
                      }
                      return <code className="bg-black/30 text-[#0A3EFF] text-[11px] px-1 py-0.5 rounded font-mono">{children}</code>
                    },
                    pre: ({ children }) => <div className="my-2">{children}</div>,
                    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#0A3EFF] hover:underline">{children}</a>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {(isGenerating || isChatting) && (
          <div className="flex justify-start">
            <div className="bg-white/[0.05] text-white/40 text-[12px] rounded-lg px-3 py-2 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0A3EFF]/60 animate-pulse" />
              <span>{streamingStatus || (isChatting ? 'Thinking...' : 'Designing...')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Prompt area — pinned to bottom */}
      <div className="flex-shrink-0 border-t border-white/[0.06]">
        {/* Model selector + Quality lenses */}
        <div className="px-4 pt-3 pb-1.5 flex items-center gap-1.5 flex-wrap">
          {/* Model picker */}
          <div className="relative mr-1">
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="text-[10px] px-2 py-1 rounded bg-white/[0.06] text-white/50 hover:text-white/70 hover:bg-white/[0.1] transition-all flex items-center gap-1"
            >
              {MODELS.find(m => m.id === selectedModel)?.short || 'Model'}
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {showModelPicker && (
              <div className="absolute bottom-full left-0 mb-1 w-56 bg-[#1a1a1e] border border-white/[0.1] rounded-lg shadow-xl overflow-hidden z-50">
                {MODELS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m.id); setShowModelPicker(false) }}
                    className={`w-full text-left px-3 py-2 text-[11px] transition-colors flex items-center justify-between ${
                      selectedModel === m.id
                        ? 'bg-[#0A3EFF]/15 text-[#0A3EFF]'
                        : 'text-white/60 hover:bg-white/[0.06] hover:text-white/80'
                    }`}
                  >
                    <span>{m.label}</span>
                    {selectedModel === m.id && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-[10px] text-white/25 mr-1">Lenses</span>
          {LENS_OPTIONS.map(lens => {
            const active = activeLenses.includes(lens.id)
            return (
              <button
                key={lens.id}
                onClick={() => dispatch({ type: 'TOGGLE_LENS', lens: lens.id })}
                className={`text-[10px] px-2 py-1 rounded-full transition-all ${
                  active
                    ? 'bg-[#0A3EFF]/20 text-[#0A3EFF] ring-1 ring-[#0A3EFF]/30'
                    : 'bg-white/[0.04] text-white/30 hover:text-white/50 hover:bg-white/[0.06]'
                }`}
                title={`${lens.label} quality lens`}
              >
                <span className="mr-0.5">{lens.icon}</span> {lens.label}
              </button>
            )
          })}
        </div>

        <div className="px-4 pb-4 pt-1.5">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Discuss your design idea..."
              rows={2}
              className="w-full bg-white/[0.06] text-white/90 text-[13px] leading-[1.5] rounded-lg px-3.5 py-2.5 pr-10 resize-none outline-none placeholder:text-white/25 focus:ring-1 focus:ring-[#0A3EFF]/40 focus:bg-white/[0.08] transition-colors"
              style={{ minHeight: 52, maxHeight: 140 }}
              disabled={isBusy}
            />
            {/* Send chat button (inside textarea) */}
            <button
              onClick={() => sendChat()}
              disabled={!input.trim() || isBusy}
              className="absolute bottom-2 right-2 p-1.5 rounded-md bg-white/[0.08] text-white/50 hover:bg-white/[0.14] hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              aria-label="Send message"
              title="Chat (Enter)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Design screen button */}
          <button
            onClick={() => sendDesign()}
            disabled={!input.trim() || isBusy}
            className="w-full mt-2 py-2 rounded-lg text-[13px] font-medium bg-[#0A3EFF] text-white hover:bg-[#0835D9] disabled:opacity-25 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="0" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            Design screen
          </button>
        </div>
      </div>
    </div>
  )
}
