import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Send, Loader2, AlertCircle, Layout, ChevronRight, ImagePlus, X, Plus, ArrowLeft, Upload, Sparkles, Wand2, Trash2, ChevronDown, Check, Mic, MicOff, Image as ImageIcon, Layers } from 'lucide-react'
import Tooltip from '@mui/material/Tooltip'
import { useAppState, useAppDispatch } from '../store'
import { generateScreen, generateVariants, enhancePrompt, improveDesign, generateImageScreen, getOpenRouterKey, setOpenRouterKey as saveOpenRouterKey } from '../services/api'
import { useDeepgram } from '../hooks/useDeepgram'
import { WIREFRAME_SCREENS } from '../data/wireframe-screens'
import type { WireframeScreen } from '../data/wireframe-screens'
import type { QualityToggles, ComponentNode } from '../types'

// ─── Tooltip ───

function Tip({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <Tooltip
      title={title}
      placement="top"
      arrow
      enterDelay={400}
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: 'rgb(var(--studio-tooltip-bg) / 1)',
            color: 'rgb(var(--studio-tooltip-text) / 1)',
            border: '1px solid rgb(var(--studio-tooltip-border) / 1)',
            fontSize: '11px',
            fontWeight: 500,
            px: 1.2,
            py: 0.6,
            borderRadius: '6px',
            '& .MuiTooltip-arrow': { color: 'rgb(var(--studio-tooltip-bg) / 1)' },
          },
        },
      }}
    >
      {children}
    </Tooltip>
  )
}

// ─── Constants ───

const LOADER_MESSAGES = [
  'Analyzing your design brief…',
  'Building component layout…',
  'Applying design tokens…',
  'Arranging visual hierarchy…',
  'Finalizing screen…',
]

const WIREFRAME_LOADER_MESSAGES = [
  'Reading sketch layout…',
  'Identifying UI regions…',
  'Mapping elements to components…',
  'Applying design system…',
  'Assembling screen…',
]

const VARIANTS_LOADER_MESSAGES = [
  'Exploring 3 design directions…',
  'Generating Efficiency First option…',
  'Generating Information Rich option…',
  'Generating Guided Clarity option…',
  'Finalizing all 3 options…',
]

// Improve loader: context-aware messages based on active quality lenses
const IMPROVE_LENS_MESSAGES: Record<string, string[]> = {
  avontusBrand: [
    'Checking Probe Blue #0A3EFF usage…',
    'Verifying Switzer typography hierarchy…',
    'Applying brand-tinted elevation system…',
  ],
  tokenEnforcement: [
    'Mapping raw values to semantic tokens…',
    'Removing generic fallback styles…',
  ],
  componentRegistry: [
    'Matching elements to component registry…',
  ],
  designDna: [
    'Analyzing design system DNA…',
    'Enforcing detected patterns throughout…',
  ],
  designSystem: [
    'Enforcing atomic design hierarchy…',
    'Verifying 8pt spacing grid…',
    'Checking all component states…',
  ],
  materialDesign: [
    'Applying MD3 tonal color system…',
    'Checking dynamic color roles…',
  ],
  visualExcellence: [
    'Refining depth and light direction…',
    'Tuning micro-spacing for visual tension…',
    'Pushing past generic aesthetics…',
  ],
  typography: [
    'Auditing type scale and line-heights…',
    'Checking measure (45–75ch) and contrast…',
  ],
  designStandards: [
    'Checking 60-30-10 color distribution…',
    'Scanning WCAG 2.2 AA contrast ratios…',
    'Running Nielsen heuristics audit…',
  ],
  uxPsychology: [
    'Applying Hick\'s Law — simplifying choices…',
    'Checking Fitts\'s Law — sizing touch targets…',
    'Framing copy for loss aversion…',
  ],
  gestalt: [
    'Applying proximity grouping…',
    'Checking figure-ground contrast…',
    'Verifying focal point hierarchy…',
  ],
  interaction: [
    'Reviewing interaction feedback loops…',
    'Adding user steering affordances…',
  ],
  microcopy: [
    'Rewriting button labels to verb+object…',
    'Improving empty states and error copy…',
  ],
  accessibility: [
    'Checking contrast ratios (4.5:1 min)…',
    'Verifying touch targets (44px min)…',
  ],
  dataHeavyDesign: [
    'Applying 5-metric dashboard rule…',
    'Aligning table columns by data type…',
  ],
}

function buildImproveMessages(toggles: QualityToggles): string[] {
  const messages: string[] = ['Scanning current design for improvements…']
  const activeKeys = (Object.entries(toggles) as [string, boolean][]).filter(([, v]) => v).map(([k]) => k)
  for (const key of activeKeys) {
    const lens = IMPROVE_LENS_MESSAGES[key]
    if (lens) messages.push(...lens)
  }
  messages.push('Applying final polish…')
  // Cap at 8 messages for good pacing — pick evenly spaced subset
  if (messages.length > 8) {
    const step = (messages.length - 2) / 6
    const picked = [messages[0]]
    for (let i = 1; i <= 6; i++) picked.push(messages[Math.min(Math.round(i * step), messages.length - 2)])
    picked.push(messages[messages.length - 1])
    return picked
  }
  return messages
}

const CATEGORY_META: Record<WireframeScreen['category'], { label: string; icon: typeof Layout; color: string }> = {
  core: { label: 'Core Screens', icon: Layout, color: 'text-blue-400' },
  jobsite: { label: 'Jobsite', icon: Layout, color: 'text-green-400' },
  settings: { label: 'Settings & Lists', icon: Layout, color: 'text-orange-400' },
  patterns: { label: 'UI Patterns', icon: Layout, color: 'text-purple-400' },
}

const CATEGORIES: WireframeScreen['category'][] = ['core', 'jobsite', 'settings', 'patterns']

const MODELS = [
  { id: 'google/gemini-3.1-flash-lite-preview', label: 'Gemini 3.1 Flash Lite (fast)', short: 'Gemini Flash' },
  { id: 'google/gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro (slower, higher quality)', short: 'Gemini Pro' },
  { id: 'anthropic/claude-opus-4.6', label: 'Claude Opus 4.6', short: 'Opus 4.6' },
  { id: 'openai/gpt-5.4', label: 'GPT-5.4', short: 'GPT-5.4' },
] as const

function cloneTreeSnapshot(tree: ComponentNode | null): ComponentNode | null {
  return tree ? JSON.parse(JSON.stringify(tree)) : null
}

function cloneJsonSnapshot<T>(value: T): T {
  return value == null ? value : JSON.parse(JSON.stringify(value))
}

function isUndoVoiceCommand(text: string): boolean {
  const lower = text.toLowerCase()
  if (/\b(undo|revert|go back)\b/.test(lower)) return true
  const complaint = /\b(not that|no no|wrong|you did not do what i asked)\b/.test(lower)
  if (!complaint) return false
  return !/\b(add|remove|delete|move|put|place|make|change|edit|update|fix|align|create|build|stretch|expand|full width|bigger|smaller|left|right|top|bottom)\b/.test(lower)
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const MAX_IMPORT_DATA_URL_CHARS = 2_800_000
const IMPORT_MAX_DIMENSION = 1800

// ─── Image helpers ───

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.readAsDataURL(file)
  })
}

async function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to decode uploaded image'))
    img.src = dataUrl
  })
}

async function compressImageForImport(file: File): Promise<string> {
  const src = await fileToDataUrl(file)
  const img = await loadImageFromDataUrl(src)

  const scale = Math.min(1, IMPORT_MAX_DIMENSION / Math.max(img.width, img.height))
  const targetW = Math.max(1, Math.round(img.width * scale))
  const targetH = Math.max(1, Math.round(img.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to process uploaded image')
  ctx.drawImage(img, 0, 0, targetW, targetH)

  const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  let quality = 0.9
  let out = canvas.toDataURL(mime, quality)

  while (out.length > MAX_IMPORT_DATA_URL_CHARS && quality > 0.45 && mime === 'image/jpeg') {
    quality -= 0.1
    out = canvas.toDataURL('image/jpeg', quality)
  }

  if (out.length > MAX_IMPORT_DATA_URL_CHARS) {
    throw new Error('Image is too large. Use a smaller screenshot (under ~1800px wide) and try again.')
  }

  return out
}

// ─── Collapsible Prompt Bubble ───

function PromptBubble({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > 120

  return (
    <div className="flex justify-end">
      <div
        className={`bg-studio-accent/10 text-studio-text text-[12px] px-3 py-2 rounded-xl rounded-br-sm max-w-[90%] leading-relaxed ${
          !expanded && isLong ? 'cursor-pointer' : ''
        }`}
        onClick={isLong && !expanded ? () => setExpanded(true) : undefined}
      >
        {isLong && !expanded ? (
          <>
            <span>{text.slice(0, 110).trim()}…</span>
            <button
              onClick={() => setExpanded(true)}
              className="ml-1 text-[10px] text-studio-accent hover:underline font-medium"
            >
              Show more
            </button>
          </>
        ) : (
          <>
            <span>{text}</span>
            {isLong && (
              <button
                onClick={() => setExpanded(false)}
                className="ml-1 text-[10px] text-studio-accent hover:underline font-medium"
              >
                Show less
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Inline Loader ───

function InlineLoader({ messages = LOADER_MESSAGES }: { messages?: string[] }) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    setStep(0)
    const timer = setInterval(() => setStep((s) => (s + 1) % messages.length), 2500)
    return () => clearInterval(timer)
  }, [messages])

  return (
    <div role="status" aria-live="polite" className="flex gap-2.5 items-start text-sm px-3 py-2.5 bg-studio-accent/5 rounded-xl border border-studio-accent/20">
      <Loader2 size={14} className="animate-spin text-studio-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
      <div className="flex-1">
        <span className="text-xs text-studio-text-muted">{messages[step]}</span>
        <div className="flex gap-1 mt-1.5" aria-hidden="true">
          {messages.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-studio-accent w-4' : 'bg-studio-surface-3 w-2'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Improve Loader ───

function ImproveLoader({ toggles }: { toggles: QualityToggles }) {
  const messages = buildImproveMessages(toggles)
  const [step, setStep] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const activeCount = (Object.values(toggles) as boolean[]).filter(Boolean).length
  const total = messages.length

  useEffect(() => {
    setStep(0)
    setElapsed(0)
    // Pace: slower at start (analysis), faster at end (polish) — Goal Gradient
    const timer = setInterval(() => {
      setStep((s) => {
        if (s < total - 1) return s + 1
        return s // hold on last message
      })
    }, 3000)
    const clock = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => { clearInterval(timer); clearInterval(clock) }
  }, [total])

  const pct = Math.min(Math.round(((step + 1) / total) * 100), 100)
  const isLast = step === total - 1

  return (
    <div role="status" aria-live="polite" className="px-3 py-3 bg-studio-accent/5 rounded-xl border border-studio-accent/20 space-y-2.5">
      {/* Header: lens count + elapsed */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={13} className="text-studio-accent animate-pulse" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-studio-accent">
            Improving with {activeCount} quality lens{activeCount !== 1 ? 'es' : ''}
          </span>
        </div>
        <span className="text-[10px] text-studio-text-dim tabular-nums">
          {elapsed}s
        </span>
      </div>

      {/* Current phase message */}
      <div className="flex items-start gap-2">
        <Loader2 size={12} className="animate-spin text-studio-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
        <span className={`text-xs leading-snug transition-opacity duration-300 ${isLast ? 'text-studio-accent font-medium' : 'text-studio-text-muted'}`}>
          {messages[step]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-1.5 rounded-full bg-studio-surface-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-studio-accent transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1" aria-hidden="true">
            {messages.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i < step ? 'bg-studio-accent/60 w-2' : i === step ? 'bg-studio-accent w-4' : 'bg-studio-surface-3 w-2'
                }`}
              />
            ))}
          </div>
          <span className="text-[9px] text-studio-text-dim tabular-nums">{pct}%</span>
        </div>
      </div>

      {/* Reassurance — Loss Aversion: your design is safe */}
      <p className="text-[9px] text-studio-text-dim leading-snug">
        Your current design is preserved — you can always compare or revert.
      </p>
    </div>
  )
}

// ─── Views ───

type View = 'home' | 'library' | 'category' | 'editing'

// ─── Main Component ───

export default function PromptPanel() {
  const { designTokens, designBrief, currentTree, currentWebDesign, isGenerating, isImproving, promptHistory, screenHistory, error, qualityToggles, currentImageDataUri } = useAppState()
  const dispatch = useAppDispatch()

  // Detect image mode: check state first, fallback to checking webDesign HTML structure
  const isImageMode = Boolean(currentImageDataUri) || Boolean(currentWebDesign?.html?.includes('img-screen'))

  const [prompt, setPrompt] = useState('')
  const [view, setView] = useState<View>('home')
  const [activeCategory, setActiveCategory] = useState<WireframeScreen['category'] | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [importUrl, setImportUrl] = useState('')
  const [importContext, setImportContext] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [importError, setImportError] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [isWireframeMode, setIsWireframeMode] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>(MODELS[0].id)
  const [showModelPicker, setShowModelPicker] = useState(false)
  const [openRouterKey, setOpenRouterKey] = useState<string>(() => localStorage.getItem('openrouter_api_key') || '')
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [modelPickerAnchor, setModelPickerAnchor] = useState<{ bottom: number; left: number } | null>(null)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [variantsMode, setVariantsMode] = useState(false)
  const [isGeneratingVariants, setIsGeneratingVariants] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const historyEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modelBtnRef = useRef<HTMLButtonElement>(null)

  // ─── Voice wireframing state ───
  const deepgramKey = (import.meta.env.VITE_DEEPGRAM_API_KEY || '').trim()
  const isVoiceMode = false // voice mode disabled
  // Voice states
  type VoicePhase = 'idle' | 'listening' | 'queued' | 'thinking' | 'done'
  const [voicePhase, setVoicePhase] = useState<VoicePhase>('idle')
  const [voiceQueued, setVoiceQueued] = useState('')
  const [voiceAction, setVoiceAction] = useState<string | null>(null) // "Added hero image"
  const [voiceHint, setVoiceHint] = useState<string | null>(null) // "Try: add product cards"
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const voiceQueueRef = useRef<string[]>([])
  const voiceProcessingRef = useRef(false)
  const voiceBatchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const voiceActionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const treeRef = useRef<ComponentNode | null>(currentTree)
  const voiceHistoryRef = useRef<string[]>([])
  const voiceTreeHistoryRef = useRef<Array<ComponentNode | null>>([])
  const voiceSessionRef = useRef<any | null>(null)
  const voiceSessionHistoryRef = useRef<any[]>([])
  const voiceTargetIdsRef = useRef<string[]>([])
  const voiceTargetHistoryRef = useRef<string[][]>([])

  useEffect(() => { treeRef.current = currentTree }, [currentTree])

  // When switching to Mercury 2 voice mode, clear the canvas for a fresh wireframe
  const prevModelRef = useRef(selectedModel)
  useEffect(() => {
    if (selectedModel === 'mercury-2' && prevModelRef.current !== 'mercury-2') {
      dispatch({ type: 'CLEAR_SCREEN' })
      voiceHistoryRef.current = []
      voiceTreeHistoryRef.current = []
      voiceSessionRef.current = null
      voiceSessionHistoryRef.current = []
      voiceTargetIdsRef.current = []
      voiceTargetHistoryRef.current = []
      setVoicePhase('idle')
      setVoiceAction(null)
      setVoiceHint(null)
    }
    prevModelRef.current = selectedModel
  }, [selectedModel, dispatch])

  // Voice queue processor — batches sentences, sends with full history
  const processVoiceQueue = useCallback(async () => {
    if (voiceProcessingRef.current || voiceQueueRef.current.length === 0) return
    voiceProcessingRef.current = true
    setVoicePhase('thinking')
    setVoiceError(null)

    const batch = voiceQueueRef.current.join(' ').trim()
    voiceQueueRef.current = []
    setVoiceQueued('')
    if (!batch) { voiceProcessingRef.current = false; setVoicePhase('listening'); return }

    if (isUndoVoiceCommand(batch) && voiceTreeHistoryRef.current.length > 0) {
      const previous = voiceTreeHistoryRef.current.pop() ?? null
      const previousSession = voiceSessionHistoryRef.current.pop() ?? null
      const previousTargetIds = voiceTargetHistoryRef.current.pop() ?? []
      voiceSessionRef.current = previousSession
      voiceTargetIdsRef.current = Array.isArray(previousTargetIds) ? previousTargetIds : []

      if (previous) {
        treeRef.current = previous
        dispatch({ type: 'SET_TREE', tree: previous, prompt: `[Voice] ${batch}`, webDesign: null })
        setVoiceAction('Undid last voice change')
        setVoiceHint(null)
        setVoicePhase('done')
      } else {
        treeRef.current = null
        dispatch({ type: 'CLEAR_SCREEN' })
        setVoiceAction('Cleared the last voice change')
        setVoiceHint(null)
        setVoicePhase('done')
      }
      if (voiceActionTimeout.current) clearTimeout(voiceActionTimeout.current)
      voiceActionTimeout.current = setTimeout(() => {
        setVoicePhase(prev => prev === 'done' ? 'listening' : prev)
      }, 4000)
      voiceProcessingRef.current = false
      return
    }

    if (isUndoVoiceCommand(batch)) {
      if (voiceSessionRef.current) {
        voiceSessionRef.current = null
      }
      if (voiceTargetIdsRef.current.length > 0) {
        voiceTargetIdsRef.current = []
      }
      if (treeRef.current) {
        treeRef.current = null
        dispatch({ type: 'CLEAR_SCREEN' })
        setVoiceAction('Cleared the current voice wireframe')
        setVoiceHint(null)
        setVoicePhase('done')
        if (voiceActionTimeout.current) clearTimeout(voiceActionTimeout.current)
        voiceActionTimeout.current = setTimeout(() => {
          setVoicePhase(prev => prev === 'done' ? 'listening' : prev)
        }, 4000)
      } else {
        setVoicePhase('listening')
      }
      voiceProcessingRef.current = false
      return
    }

    voiceHistoryRef.current.push(batch)
    voiceHistoryRef.current = voiceHistoryRef.current.slice(-8)

    try {
      const currentSnapshot = cloneTreeSnapshot(treeRef.current)
      const currentSessionSnapshot = cloneJsonSnapshot(voiceSessionRef.current)
      const currentTargetSnapshot = [...voiceTargetIdsRef.current]
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: batch,
          currentTree: treeRef.current,
          previousTree: voiceTreeHistoryRef.current[voiceTreeHistoryRef.current.length - 1] || null,
          lastTargetIds: voiceTargetIdsRef.current,
          history: voiceHistoryRef.current.slice(-6),
          voiceSession: voiceSessionRef.current,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.tree) {
          voiceTreeHistoryRef.current.push(currentSnapshot)
          voiceTreeHistoryRef.current = voiceTreeHistoryRef.current.slice(-12)
          voiceSessionHistoryRef.current.push(currentSessionSnapshot)
          voiceSessionHistoryRef.current = voiceSessionHistoryRef.current.slice(-12)
          voiceTargetHistoryRef.current.push(currentTargetSnapshot)
          voiceTargetHistoryRef.current = voiceTargetHistoryRef.current.slice(-12)

          treeRef.current = data.tree
          voiceSessionRef.current = data.voiceSession ?? voiceSessionRef.current
          voiceTargetIdsRef.current = Array.isArray(data.targetIds) ? data.targetIds : voiceTargetIdsRef.current
          dispatch({ type: 'SET_TREE', tree: data.tree, prompt: `[Voice] ${data.transcript || batch}`, webDesign: null })
          setVoiceAction(data.action || 'Updated wireframe')
          setVoiceHint(data.hint || null)
          setVoicePhase('done')
          // Auto-clear action after 4s and go back to listening
          if (voiceActionTimeout.current) clearTimeout(voiceActionTimeout.current)
          voiceActionTimeout.current = setTimeout(() => {
            setVoicePhase(prev => prev === 'done' ? 'listening' : prev)
          }, 4000)
        }
      } else {
        setVoiceError('Mercury couldn\'t process that — try rephrasing')
        setVoicePhase('listening')
      }
    } catch {
      setVoiceError('Connection issue — try again')
      setVoicePhase('listening')
    } finally {
      voiceProcessingRef.current = false
      if (voiceQueueRef.current.length > 0) processVoiceQueue()
    }
  }, [dispatch])

  // 3-second debounce: wait for user to finish their thought before processing
  const onVoiceTranscript = useCallback((text: string, isFinal: boolean) => {
    if (!isFinal) return
    const trimmed = text.trim()
    if (!trimmed) return
    voiceQueueRef.current.push(trimmed)
    setVoiceQueued(voiceQueueRef.current.join(' '))
    setVoicePhase('queued')
    if (voiceBatchTimeout.current) clearTimeout(voiceBatchTimeout.current)
    voiceBatchTimeout.current = setTimeout(() => { processVoiceQueue() }, 3000)
  }, [processVoiceQueue])

  const deepgram = useDeepgram({ apiKey: deepgramKey, onTranscript: onVoiceTranscript })

  const handleToggleVoice = () => {
    if (deepgram.isListening) {
      deepgram.stopListening()
      setVoicePhase('idle')
      setVoiceAction(null)
      setVoiceHint(null)
    } else {
      deepgram.startListening()
      setVoicePhase('listening')
      setVoiceAction(null)
      setVoiceError(null)
    }
  }

  const isEditing = Boolean(currentTree)

  useEffect(() => {
    if (currentTree) setView('editing')
    else if (promptHistory.length === 0) setView('home')
  }, [currentTree, promptHistory.length])

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [promptHistory])

  // ─── Handlers ───

  const requireApiKey = (): boolean => {
    if (getOpenRouterKey()) return true
    setShowApiKeyModal(true)
    return false
  }

  const handleSubmit = async () => {
    const trimmed = prompt.trim()
    if (!trimmed || isGenerating) return
    if (!requireApiKey()) return
    dispatch({ type: 'SET_GENERATING', value: true })
    setPrompt('')
    try {
      const result = await generateScreen({ prompt: trimmed, designTokens, designBrief, currentTree, qualityToggles, model: selectedModel })
      dispatch({ type: 'SET_TREE', tree: result.tree, webDesign: result.webDesign ?? null, prompt: trimmed })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : 'Generation failed' })
    } finally {
      dispatch({ type: 'SET_GENERATING', value: false })
    }
  }

  const handleGenerateVariants = async () => {
    const trimmed = prompt.trim()
    if (!trimmed || isGenerating) return
    if (!requireApiKey()) return
    dispatch({ type: 'SET_GENERATING', value: true })
    setIsGeneratingVariants(true)
    setPrompt('')
    try {
      const result = await generateVariants({ prompt: trimmed, designTokens, designBrief, currentTree, qualityToggles, model: selectedModel })
      const variants = result.variants.map((v, i) => ({
        ...v,
        id: `variant-${i}-${Date.now()}`,
      }))
      dispatch({ type: 'SET_VARIANTS', variants })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : 'Variants generation failed' })
    } finally {
      dispatch({ type: 'SET_GENERATING', value: false })
      setIsGeneratingVariants(false)
    }
  }

  const handleImprove = async () => {
    if (!currentWebDesign || isImproving || isGenerating) return
    if (!requireApiKey()) return
    const activeCount = Object.values(qualityToggles).filter(Boolean).length
    if (activeCount === 0) return
    dispatch({ type: 'SET_IMPROVING', value: true })
    try {
      const result = await improveDesign({ currentWebDesign, qualityToggles, designTokens, designBrief, model: selectedModel })
      dispatch({ type: 'SET_IMPROVE_RESULT', previousWebDesign: currentWebDesign, webDesign: result.webDesign, decisions: result.decisions, lensCount: activeCount })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : 'Improvement failed' })
    } finally {
      dispatch({ type: 'SET_IMPROVING', value: false })
    }
  }

  const handleConvertToCode = async () => {
    if (!isImageMode || isGenerating) return
    // Extract image URI from state or from the webDesign HTML
    let imageUri = currentImageDataUri
    if (!imageUri && currentWebDesign?.html) {
      const m = currentWebDesign.html.match(/src="(data:[^"]+)"/)
      imageUri = m?.[1] ?? null
    }
    if (!imageUri) return
    if (!requireApiKey()) return
    dispatch({ type: 'SET_GENERATING', value: true })
    try {
      const result = await generateScreen({
        prompt: 'Convert this design image into editable HTML/CSS code. Recreate the exact same UI layout, colors, typography, spacing, and visual hierarchy. Make it production-ready and pixel-perfect to the original image.',
        designTokens,
        designBrief,
        currentTree: null,
        imageUrl: imageUri,
        qualityToggles,
        model: selectedModel,
      })
      dispatch({ type: 'SET_TREE', tree: result.tree, webDesign: result.webDesign ?? null, prompt: promptHistory[promptHistory.length - 1] || 'Image to code' })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : 'Conversion failed' })
    } finally {
      dispatch({ type: 'SET_GENERATING', value: false })
    }
  }

  const handleWireframeClick = (screen: WireframeScreen) => {
    dispatch({ type: 'SET_TREE', tree: screen.tree, prompt: `[Wireframe] ${screen.label}` })
  }

  const handleNewScreen = () => {
    dispatch({ type: 'CLEAR_SCREEN' })
    setView('home')
  }

  const clearSketch = () => {
    setUploadedFileName('')
    setImportUrl('')
    setImportContext('')
    setImportError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setImportError('Please drop an image file (PNG, JPG, WEBP).')
      return
    }
    setImportError('')
    compressImageForImport(file)
      .then((dataUrl) => { setImportUrl(dataUrl); setUploadedFileName(file.name) })
      .catch((err) => { setImportError(err instanceof Error ? err.message : 'Failed to process image') })
  }

  const handleImportWireframe = async () => {
    const imageValue = importUrl.trim()
    if (!imageValue || isGenerating) return
    setImportError('')
    dispatch({ type: 'SET_GENERATING', value: true })
    setIsWireframeMode(true)
    setShowImport(false)
    const savedUrl = imageValue
    const savedContext = importContext.trim()
    clearSketch()
    try {
      const importPrompt = savedContext || 'Convert this wireframe to our design system. Keep the same content, hierarchy, and flow; only improve visual quality and usability.'
      const result = await generateScreen({
        prompt: importPrompt,
        designTokens, designBrief, currentTree: null, imageUrl: savedUrl, qualityToggles, model: selectedModel,
      })
      dispatch({ type: 'SET_TREE', tree: result.tree, webDesign: result.webDesign ?? null, prompt: `[Sketch] ${savedContext || 'Wireframe import'}` })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : 'Import failed' })
    } finally {
      dispatch({ type: 'SET_GENERATING', value: false })
      setIsWireframeMode(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setImportError('Please upload an image file (PNG, JPG, WEBP, etc).')
      return
    }
    setImportError('')
    compressImageForImport(file)
      .then((dataUrl) => { setImportUrl(dataUrl); setUploadedFileName(file.name) })
      .catch((err) => { setImportError(err instanceof Error ? err.message : 'Failed to process image file') })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
  }

  const handleEnhance = async () => {
    const trimmed = prompt.trim()
    if (!trimmed || isEnhancing || isGenerating) return
    if (!requireApiKey()) return
    setIsEnhancing(true)
    try {
      const enhanced = await enhancePrompt(trimmed, designBrief, {
        designTokens,
        qualityToggles,
        currentTree,
      })
      setPrompt(enhanced)
      textareaRef.current?.focus()
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleGenerateImage = async () => {
    const trimmed = prompt.trim()
    if (!trimmed || isGeneratingImage || isGenerating) return
    dispatch({ type: 'SET_GENERATING', value: true })
    setIsGeneratingImage(true)
    setPrompt('')
    try {
      const result = await generateImageScreen({
        prompt: trimmed,
        designTokens,
        designBrief,
        qualityToggles,
      })
      // Create a minimal tree so the canvas shows the image via webDesign
      const tree = { id: 'page-root', type: 'Page' as const, properties: { Background: '#FFFFFF' }, children: [] }
      dispatch({ type: 'SET_TREE', tree, webDesign: result.webDesign, prompt: `[Image] ${trimmed}`, imageDataUri: result.imageDataUri })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : 'Image generation failed' })
    } finally {
      dispatch({ type: 'SET_GENERATING', value: false })
      setIsGeneratingImage(false)
    }
  }

  const goBack = () => {
    if (view === 'category') setView('library')
    else if (view === 'library') setView(currentTree ? 'editing' : 'home')
    else if (view === 'editing') setView('home')
  }

  // ─── Render ───

  return (
    <nav className="flex flex-col h-full" aria-label="Design panel">
      {/* Sub-navigation (only for library/category/editing views) */}
      {(view === 'library' || view === 'category' || view === 'editing') && (
        <div className="px-3 py-1.5 border-b border-studio-border flex items-center justify-between">
          {view === 'library' ? (
            <button onClick={goBack} className="flex items-center gap-1 text-[11px] text-studio-text-dim hover:text-studio-text transition-colors py-1 px-0.5" aria-label="Go back">
              <ArrowLeft size={13} aria-hidden="true" />
              <span>Back</span>
            </button>
          ) : view === 'category' ? (
            <button onClick={goBack} className="flex items-center gap-1 text-[11px] text-studio-text-dim hover:text-studio-text transition-colors py-1 px-0.5" aria-label="Back to library">
              <ArrowLeft size={13} aria-hidden="true" />
              <span>{activeCategory ? CATEGORY_META[activeCategory].label : 'Library'}</span>
            </button>
          ) : (
            <button
              onClick={() => setView('library')}
              className="flex items-center gap-1 text-[11px] text-studio-text-dim hover:text-studio-text transition-colors py-1 px-0.5"
              aria-label="Open screen library"
            >
              <Layout size={13} aria-hidden="true" />
              <span>Library</span>
            </button>
          )}

          <div className="flex items-center gap-0.5">
            {view === 'editing' && (
              <>
                <Tip title="Import sketch">
                  <button
                    onClick={() => setShowImport(!showImport)}
                    className={`p-1.5 rounded-md transition-colors flex items-center justify-center ${showImport ? 'text-studio-accent bg-studio-accent/10' : 'text-studio-text-dim hover:text-studio-accent hover:bg-studio-accent/10'}`}
                    aria-label="Import wireframe"
                    aria-pressed={showImport}
                  >
                    <ImagePlus size={13} aria-hidden="true" />
                  </button>
                </Tip>
                <Tip title="New screen">
                  <button
                    onClick={handleNewScreen}
                    className="p-1.5 rounded-md text-studio-text-dim hover:text-studio-accent hover:bg-studio-accent/10 transition-colors flex items-center justify-center"
                    aria-label="New screen"
                  >
                    <Plus size={13} aria-hidden="true" />
                  </button>
                </Tip>
              </>
            )}
          </div>
        </div>
      )}

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">

        {/* ─── HOME VIEW — hero prompt experience ─── */}
        {view === 'home' && (
          <>
            {isGenerating && <InlineLoader messages={isGeneratingVariants ? VARIANTS_LOADER_MESSAGES : isWireframeMode ? WIREFRAME_LOADER_MESSAGES : LOADER_MESSAGES} />}

            {error && !isGenerating && (
              <div role="alert" className="flex gap-2 items-start text-sm px-3 py-2.5 bg-studio-error/10 rounded-xl border border-studio-error/20">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0 text-studio-error" aria-hidden="true" />
                <span className="flex-1 text-studio-error text-xs">{error}</span>
                <button onClick={() => dispatch({ type: 'SET_ERROR', error: null })} className="p-1 rounded-lg hover:bg-studio-error/20 text-studio-error/60 hover:text-studio-error transition-colors flex-shrink-0 min-w-[28px] min-h-[28px] flex items-center justify-center" aria-label="Dismiss error">
                  <X size={12} aria-hidden="true" />
                </button>
              </div>
            )}

          </>
        )}

        {/* ─── SKETCH & HISTORY — visible in home + editing ─── */}
        {(view === 'home' || view === 'editing') && !isGenerating && !error && (
          <>
              <div className="pt-2 pb-2">

                {/* ─── FROM SKETCH ─── */}
                <div className="mt-4">
                  <p className="text-[10px] font-medium text-studio-text-dim uppercase tracking-wider px-0.5 mb-1.5">Start from a sketch</p>

                  {uploadedFileName ? (
                    /* Preview state — image uploaded, ready to generate */
                    <div className="rounded-xl border border-studio-accent/30 bg-studio-accent/5 overflow-hidden">
                      <div className="relative">
                        <img
                          src={importUrl}
                          alt="Wireframe preview"
                          className="w-full rounded-t-xl"
                          style={{ maxHeight: 130, objectFit: 'cover', objectPosition: 'top' }}
                        />
                        <button
                          onClick={clearSketch}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"
                          aria-label="Remove sketch"
                        >
                          <X size={11} aria-hidden="true" />
                        </button>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="flex items-center gap-1.5">
                          <ImagePlus size={11} className="text-studio-accent flex-shrink-0" aria-hidden="true" />
                          <span className="text-[11px] text-studio-text truncate">{uploadedFileName}</span>
                        </div>
                        <label className="sr-only" htmlFor="home-sketch-context">Describe this sketch</label>
                        <textarea
                          id="home-sketch-context"
                          value={importContext}
                          onChange={(e) => setImportContext(e.target.value)}
                          placeholder="What does this sketch show? e.g. 'Settings page with user profile and notification toggles'"
                          rows={2}
                          className="w-full bg-studio-surface border border-studio-border rounded-lg px-3 py-2 text-xs text-studio-text placeholder-studio-text-dim focus:border-studio-accent/50 focus:ring-1 focus:ring-studio-accent/20 resize-none transition-all"
                        />
                        <button
                          onClick={handleImportWireframe}
                          disabled={isGenerating}
                          className="w-full py-2.5 rounded-xl bg-studio-accent text-white text-xs font-semibold hover:bg-studio-accent-hover transition-all min-h-[40px] flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Sparkles size={13} aria-hidden="true" />
                          Generate from sketch
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Drop zone */
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false) }}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      aria-label="Upload a wireframe sketch — drop image here or click to browse"
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click() } }}
                      className={`cursor-pointer rounded-xl border-2 border-dashed px-4 py-5 flex flex-col items-center gap-2.5 text-center transition-all select-none ${
                        isDragging
                          ? 'border-studio-accent bg-studio-accent/10 scale-[1.01]'
                          : 'border-studio-border/60 hover:border-studio-accent/40 hover:bg-studio-accent/5'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDragging ? 'bg-studio-accent/20' : 'bg-studio-surface-3'}`}>
                        <ImagePlus size={18} className={isDragging ? 'text-studio-accent' : 'text-studio-text-dim'} aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-studio-text-muted">
                          {isDragging ? 'Drop to upload' : 'Drop a wireframe here'}
                        </p>
                        <p className="text-[11px] text-studio-text-dim mt-0.5">
                          Works great with Balsamiq · PNG, JPG
                        </p>
                      </div>
                    </div>
                  )}

                  {importError && (
                    <div role="alert" className="mt-2 text-xs text-studio-error bg-studio-error/10 border border-studio-error/30 rounded-lg px-3 py-2">
                      {importError}
                    </div>
                  )}
                </div>
              </div>

            {screenHistory.length > 0 && (
              <div className="pt-3">
                <button
                  onClick={() => setHistoryOpen(v => !v)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-studio-surface-3/50 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <ChevronRight size={11} className={`text-studio-text-dim transition-transform duration-200 ${historyOpen ? 'rotate-90' : ''}`} aria-hidden="true" />
                    <h4 className="text-[10px] font-medium text-studio-text-dim tracking-wide">Previous designs</h4>
                    <span className="text-[9px] text-studio-text-dim/50 bg-studio-surface-3 rounded-full px-1.5 py-0.5 leading-none">{screenHistory.length}</span>
                  </div>
                  {screenHistory.length > 2 && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); dispatch({ type: 'CLEAR_ALL_HISTORY' }) }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); dispatch({ type: 'CLEAR_ALL_HISTORY' }) } }}
                      className="text-[10px] text-studio-text-dim/60 hover:text-studio-error transition-colors"
                    >
                      Clear all
                    </span>
                  )}
                </button>
                {historyOpen && (
                  <ul className="flex flex-col mt-1 max-h-[200px] overflow-y-auto" role="list">
                    {[...screenHistory].reverse().map((entry) => (
                      <li key={entry.id} className="group">
                        <div className="flex items-center rounded-md hover:bg-studio-surface-3/70 transition-colors">
                          <button
                            onClick={() => dispatch({ type: 'RESTORE_HISTORY', entry })}
                            className="flex-1 flex items-center gap-2 px-2 py-1 text-left min-w-0"
                            aria-label={`Restore: ${entry.prompt}`}
                          >
                            <div className="flex-1 min-w-0">
                              <span className="text-[11px] text-studio-text-muted truncate block leading-tight">{entry.prompt}</span>
                              <span className="text-[10px] text-studio-text-dim/60 leading-tight">{relativeTime(entry.timestamp)}</span>
                            </div>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DELETE_HISTORY_ENTRY', id: entry.id }) }}
                            className="p-1.5 rounded-md text-studio-text-dim/40 hover:text-studio-error hover:bg-studio-error/10 transition-colors flex-shrink-0 mr-1"
                            aria-label={`Delete: ${entry.prompt}`}
                          >
                            <Trash2 size={11} aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}

        {/* ─── LIBRARY VIEW ─── */}
        {view === 'library' && (
          <>
            <h3 className="text-[11px] font-semibold text-studio-text-dim uppercase tracking-wider px-1">Screen Library</h3>
            {CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat]
              const Icon = meta.icon
              const count = WIREFRAME_SCREENS.filter(s => s.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setView('category') }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-studio-border hover:border-studio-accent/40 hover:bg-studio-accent/5 transition-all group min-h-[56px]"
                  aria-label={`${meta.label} — ${count} screens`}
                >
                  <div className="w-8 h-8 rounded-lg bg-studio-surface-3 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <Icon size={16} className={meta.color} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-studio-text">{meta.label}</p>
                    <p className="text-xs text-studio-text-dim">{count} screen{count !== 1 ? 's' : ''}</p>
                  </div>
                  <ChevronRight size={16} className="text-studio-text-dim group-hover:text-studio-accent transition-colors" aria-hidden="true" />
                </button>
              )
            })}
          </>
        )}

        {/* ─── CATEGORY VIEW ─── */}
        {view === 'category' && activeCategory && (
          <>
            {WIREFRAME_SCREENS.filter(s => s.category === activeCategory).map((screen) => (
              <button
                key={screen.id}
                onClick={() => handleWireframeClick(screen)}
                className="w-full text-left px-4 py-3 rounded-xl border border-studio-border hover:border-studio-accent/40 hover:bg-studio-accent/5 transition-all group min-h-[56px]"
                aria-label={`Load ${screen.label}`}
              >
                <p className="text-sm font-medium text-studio-text-muted group-hover:text-studio-text">{screen.label}</p>
                <p className="text-xs text-studio-text-dim mt-0.5 leading-relaxed">{screen.description}</p>
              </button>
            ))}
          </>
        )}

        {/* ─── EDITING VIEW ─── */}
        {view === 'editing' && (
          <>
            {promptHistory.map((p, i) => (
              <PromptBubble key={i} text={p} />
            ))}

            {isGenerating && <InlineLoader />}

            {error && (
              <div role="alert" className="flex gap-2 items-start text-sm px-3 py-2.5 bg-studio-error/10 rounded-xl border border-studio-error/20">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0 text-studio-error" aria-hidden="true" />
                <span className="flex-1 text-studio-error text-xs">{error}</span>
                <button onClick={() => dispatch({ type: 'SET_ERROR', error: null })} className="p-1 rounded-lg hover:bg-studio-error/20 text-studio-error/60 hover:text-studio-error transition-colors flex-shrink-0 min-w-[28px] min-h-[28px] flex items-center justify-center" aria-label="Dismiss error">
                  <X size={12} aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}

        <div ref={historyEndRef} />
      </div>

      {/* ─── Import panel (slides open above prompt) ─── */}
      {showImport && (
        <div className="border-t border-studio-border p-3" role="region" aria-label="Import wireframe">
          <div className="p-3 rounded-xl border border-studio-accent/30 bg-studio-accent/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-studio-text-muted">Import wireframe</span>
              <button
                onClick={() => { setShowImport(false); setUploadedFileName(''); setImportUrl(''); setImportError(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                className="p-1 rounded-lg hover:bg-studio-surface-3 text-studio-text-dim min-w-[28px] min-h-[28px] flex items-center justify-center"
                aria-label="Close import panel"
              >
                <X size={12} aria-hidden="true" />
              </button>
            </div>

            {!uploadedFileName ? (
              <div className="flex items-center gap-2 mb-2">
                <label className="sr-only" htmlFor="import-url-input">Image URL</label>
                <input
                  id="import-url-input"
                  type="text"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="Paste image URL…"
                  className="flex-1 bg-studio-surface border border-studio-border rounded-lg px-3 py-2.5 text-xs text-studio-text placeholder-studio-text-dim focus:border-studio-accent/50 focus:ring-1 focus:ring-studio-accent/20 transition-all min-h-[36px]"
                />
                <span className="text-xs text-studio-text-dim" aria-hidden="true">or</span>
                {/* file input is rendered outside showImport — see bottom of component */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-studio-surface border border-studio-border hover:border-studio-accent/40 text-xs text-studio-text transition-colors whitespace-nowrap min-h-[36px]"
                  aria-label="Upload image file"
                >
                  <Upload size={14} className="text-studio-text-dim" aria-hidden="true" />
                  Upload
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-studio-surface border border-studio-border mb-2 min-h-[36px]">
                <ImagePlus size={14} className="text-studio-accent flex-shrink-0" aria-hidden="true" />
                <span className="text-xs text-studio-text flex-1 truncate">{uploadedFileName}</span>
                <button
                  onClick={() => { setUploadedFileName(''); setImportUrl(''); setImportError(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                  className="text-studio-error/80 hover:text-studio-error p-1 rounded-lg transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
                  aria-label="Remove uploaded file"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </div>
            )}

            {importError && (
              <div role="alert" className="mb-2 text-xs text-studio-error bg-studio-error/10 border border-studio-error/30 rounded-lg px-3 py-2">
                {importError}
              </div>
            )}

            <label className="sr-only" htmlFor="import-context-input">Describe this wireframe</label>
            <textarea
              id="import-context-input"
              value={importContext}
              onChange={(e) => setImportContext(e.target.value)}
              placeholder='What does this show? e.g. "Settings page"'
              rows={2}
              className="w-full bg-studio-surface border border-studio-border rounded-lg px-3 py-2.5 text-xs text-studio-text placeholder-studio-text-dim focus:border-studio-accent/50 focus:ring-1 focus:ring-studio-accent/20 mb-2 resize-none transition-all min-h-[36px]"
            />
            <button
              onClick={handleImportWireframe}
              disabled={!importUrl.trim() || isGenerating}
              className="w-full py-2.5 rounded-xl bg-studio-accent text-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-studio-accent-hover transition-all min-h-[40px]"
            >
              {isGenerating ? 'Converting…' : 'Import wireframe'}
            </button>
          </div>
        </div>
      )}

      {/* ─── PROMPT INPUT — the hero element ─── */}
      <div className="border-t border-studio-border p-3">
        {isVoiceMode ? (
          /* ─── VOICE MODE (Mercury 2) — phase-aware interactive panel ─── */
          <div className="relative bg-studio-surface-2 rounded-xl border border-studio-border overflow-hidden">

            {/* ── Status strip ── */}
            <div className="px-3 pt-2.5 pb-1">
              {/* Phase: IDLE — not listening yet */}
              {voicePhase === 'idle' && !deepgram.isConnecting && (
                <div className="flex items-center gap-2 min-h-[20px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-studio-text-dim/30 flex-shrink-0" />
                  <span className="text-[11px] text-studio-text-dim/50 font-medium">Ready</span>
                </div>
              )}
              {/* Phase: Connecting */}
              {deepgram.isConnecting && (
                <div className="flex items-center gap-2 min-h-[20px]">
                  <Loader2 size={10} className="animate-spin text-studio-accent flex-shrink-0" />
                  <span className="text-[11px] text-studio-accent font-medium">Connecting microphone…</span>
                </div>
              )}
              {/* Phase: LISTENING — mic is on, waiting for speech */}
              {voicePhase === 'listening' && !deepgram.isConnecting && (
                <div className="flex items-center gap-2 min-h-[20px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
                  <span className="text-[11px] text-red-400/80 font-medium">Listening</span>
                </div>
              )}
              {/* Phase: QUEUED — heard you, collecting your thought */}
              {voicePhase === 'queued' && (
                <div className="flex items-center gap-2 min-h-[20px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                  <span className="text-[11px] text-amber-400/80 font-medium">Heard you — keep going or pause to apply</span>
                </div>
              )}
              {/* Phase: THINKING — Mercury is processing */}
              {voicePhase === 'thinking' && (
                <div className="flex items-center gap-2 min-h-[20px]">
                  <Loader2 size={10} className="animate-spin text-studio-accent flex-shrink-0" />
                  <span className="text-[11px] text-studio-accent font-medium">Building wireframe…</span>
                </div>
              )}
              {/* Phase: DONE — shows what AI did */}
              {voicePhase === 'done' && voiceAction && (
                <div className="flex items-center gap-2 min-h-[20px]">
                  <Check size={10} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-[11px] text-emerald-400/90 font-medium truncate">{voiceAction}</span>
                </div>
              )}
            </div>

            {/* ── Live transcript area ── */}
            <div className="px-3 pb-1 min-h-[28px]">
              {/* Show interim (live typing) */}
              {deepgram.interimTranscript && (
                <p className="text-[13px] text-studio-text/70 italic truncate">{deepgram.interimTranscript}</p>
              )}
              {/* Show queued batch (what we collected so far) */}
              {voiceQueued && !deepgram.interimTranscript && voicePhase !== 'thinking' && (
                <p className="text-[13px] text-studio-text truncate">"{voiceQueued}"</p>
              )}
              {/* Show hint from AI */}
              {voiceHint && voicePhase === 'done' && !voiceQueued && !deepgram.interimTranscript && (
                <p className="text-[11px] text-studio-text-dim/50 italic">{voiceHint}</p>
              )}
              {/* Idle suggestions */}
              {voicePhase === 'idle' && !deepgram.isConnecting && (
                <p className="text-[12px] text-studio-text-dim/40 leading-relaxed">
                  Describe your app and watch it build in real time
                </p>
              )}
              {/* Listening but nothing said yet */}
              {voicePhase === 'listening' && !deepgram.interimTranscript && !voiceQueued && !voiceHint && (
                <p className="text-[12px] text-studio-text-dim/40">
                  Try: "I want an ecommerce app with a hero image…"
                </p>
              )}
            </div>

            {/* ── Error ── */}
            {(voiceError || deepgram.error) && (
              <p className="text-[11px] text-red-400/80 px-3 pb-1">{voiceError || deepgram.error}</p>
            )}

            {/* ── Action row ── */}
            <div className="flex items-center justify-between px-3 pb-2 pt-0.5">
              {/* Model picker */}
              <div>
                <button
                  ref={modelBtnRef}
                  type="button"
                  onClick={() => {
                    if (modelBtnRef.current) {
                      const rect = modelBtnRef.current.getBoundingClientRect()
                      setModelPickerAnchor({ bottom: window.innerHeight - rect.top + 6, left: rect.left })
                    }
                    setShowModelPicker(v => !v)
                  }}
                  className="flex items-center gap-1 text-[10px] text-studio-text-dim/60 hover:text-studio-text-muted transition-colors py-0.5 select-none"
                  title="Select AI model"
                >
                  <span>{MODELS.find(m => m.id === selectedModel)?.short ?? 'Gemini Flash'}</span>
                  <ChevronDown size={9} className="opacity-60" aria-hidden="true" />
                </button>
                {showModelPicker && modelPickerAnchor && createPortal(
                  <>
                    <div className="fixed inset-0 z-[200]" onClick={() => setShowModelPicker(false)} />
                    <div
                      className="fixed z-[201] bg-studio-surface-2 border border-studio-border rounded-xl shadow-2xl py-1 min-w-[170px] max-h-72 overflow-y-auto"
                      style={{ bottom: modelPickerAnchor.bottom, left: modelPickerAnchor.left }}
                    >
                      {MODELS.map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => { setSelectedModel(m.id); setShowModelPicker(false) }}
                          className={`w-full text-left px-3 py-2 text-[11px] transition-colors flex items-center justify-between gap-3 ${
                            selectedModel === m.id
                              ? 'text-studio-accent bg-studio-accent/8'
                              : 'text-studio-text-muted hover:text-studio-text hover:bg-studio-surface-3'
                          }`}
                        >
                          <span>{m.label}</span>
                          {selectedModel === m.id && <Check size={10} aria-hidden="true" />}
                        </button>
                      ))}
                    </div>
                  </>,
                  document.body
                )}
              </div>
              {/* Mic button — large, prominent, phase-colored */}
              <button
                type="button"
                onClick={handleToggleVoice}
                disabled={deepgram.isConnecting || voicePhase === 'thinking'}
                className={`relative p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center ${
                  deepgram.isListening
                    ? 'bg-red-500/15 text-red-400'
                    : 'bg-studio-accent/10 text-studio-accent hover:bg-studio-accent/20'
                }`}
                style={deepgram.isListening ? { boxShadow: '0 0 16px rgba(239,68,68,0.2), 0 0 4px rgba(239,68,68,0.1)' } : undefined}
                aria-label={deepgram.isListening ? 'Stop voice wireframing' : 'Start voice wireframing'}
              >
                {deepgram.isConnecting
                  ? <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  : deepgram.isListening
                    ? <MicOff size={18} aria-hidden="true" />
                    : <Mic size={18} aria-hidden="true" />
                }
              </button>
            </div>
          </div>
        ) : (
          /* ─── TEXT MODE (Gemini / Opus) ─── */
          <div className={`relative rounded-xl transition-all duration-200 ${
            isFocused
              ? 'ring-1 ring-studio-accent/30'
              : ''
          }`}>
            <div className="relative bg-studio-surface-2 rounded-xl border border-studio-border overflow-hidden">
              <label className="sr-only" htmlFor="prompt-input">
                {isEditing ? 'Describe changes to your screen' : 'Describe a screen to generate'}
              </label>
              <textarea
                id="prompt-input"
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={isEditing ? 'Describe changes…' : 'Describe a screen…'}
                rows={2}
                className="w-full bg-transparent px-3 py-2.5 text-[13px] text-studio-text placeholder-studio-text-dim/50 resize-none focus:outline-none"
                disabled={isGenerating}
              />
              {/* Action row */}
              <div className="flex items-center justify-between px-3 pb-2">
                {/* Model picker */}
                <div>
                  <button
                    ref={modelBtnRef}
                    type="button"
                    onClick={() => {
                      if (modelBtnRef.current) {
                        const rect = modelBtnRef.current.getBoundingClientRect()
                        setModelPickerAnchor({ bottom: window.innerHeight - rect.top + 6, left: rect.left })
                      }
                      setShowModelPicker(v => !v)
                    }}
                    className="flex items-center gap-1 text-[10px] text-studio-text-dim/60 hover:text-studio-text-muted transition-colors py-0.5 select-none"
                    title="Select AI model"
                  >
                    <span>{MODELS.find(m => m.id === selectedModel)?.short ?? 'Gemini Flash'}</span>
                    <ChevronDown size={9} className="opacity-60" aria-hidden="true" />
                  </button>
                  {showModelPicker && modelPickerAnchor && createPortal(
                    <>
                      <div className="fixed inset-0 z-[200]" onClick={() => setShowModelPicker(false)} />
                      <div
                        className="fixed z-[201] bg-studio-surface-2 border border-studio-border rounded-xl shadow-2xl py-1 min-w-[170px] max-h-72 overflow-y-auto"
                        style={{ bottom: modelPickerAnchor.bottom, left: modelPickerAnchor.left }}
                      >
                        {MODELS.map(m => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => { setSelectedModel(m.id); setShowModelPicker(false) }}
                            className={`w-full text-left px-3 py-2 text-[11px] transition-colors flex items-center justify-between gap-3 ${
                              selectedModel === m.id
                                ? 'text-studio-accent bg-studio-accent/8'
                                : 'text-studio-text-muted hover:text-studio-text hover:bg-studio-surface-3'
                            }`}
                          >
                            <span>{m.label}</span>
                            {selectedModel === m.id && <Check size={10} aria-hidden="true" />}
                          </button>
                        ))}
                      </div>
                    </>,
                    document.body
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {/* Enhance prompt button — only visible when there's text */}
                  {prompt.trim() && (
                    <Tip title="Enhance prompt">
                      <button
                        type="button"
                        onClick={handleEnhance}
                        disabled={isEnhancing || isGenerating}
                        className={`p-1.5 rounded-lg transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center ${
                          isEnhancing
                            ? 'text-studio-accent'
                            : 'text-studio-text-dim hover:text-studio-text-muted'
                        }`}
                        aria-label="Enhance prompt"
                      >
                        {isEnhancing
                          ? <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                          : <Wand2 size={14} aria-hidden="true" />
                        }
                      </button>
                    </Tip>
                  )}
                  {/* Generate as image button — only visible when there's text */}
                  {prompt.trim() && (
                    <Tip title="Generate as image">
                      <button
                        type="button"
                        onClick={handleGenerateImage}
                        disabled={isGeneratingImage || isGenerating}
                        className={`p-1.5 rounded-lg transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center ${
                          isGeneratingImage
                            ? 'text-studio-accent'
                            : 'text-studio-text-dim hover:text-studio-text-muted'
                        }`}
                        aria-label="Generate as image"
                      >
                        {isGeneratingImage
                          ? <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                          : <ImageIcon size={14} aria-hidden="true" />
                        }
                      </button>
                    </Tip>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Single context-adaptive action button (Hick's Law: one choice at a time) */}
      {(() => {
        const hasPrompt = prompt.trim().length > 0
        const hasDesign = Boolean(currentWebDesign)
        const activeCount = Object.values(qualityToggles).filter(Boolean).length

        // Improving → show improve loader
        if (isImproving) {
          return (
            <div className="px-3 pb-3">
              <ImproveLoader toggles={qualityToggles} />
            </div>
          )
        }

        // Generating → show inline generate indicator
        if (isGenerating) return null

        // Prompt typed → Generate / Update action
        if (hasPrompt) {
          return (
            <div className="px-3 pb-3 flex flex-col gap-1.5">
              <div className="flex gap-1.5">
                <button
                  onClick={variantsMode ? handleGenerateVariants : handleSubmit}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-medium bg-studio-accent text-white hover:bg-studio-accent-hover active:scale-[0.99] transition-all"
                >
                  {variantsMode ? <Layers size={12} /> : <Send size={12} />}
                  {variantsMode ? 'Generate 3 Options' : hasDesign ? 'Update Screen' : 'Generate Screen'}
                </button>
                <Tip title={variantsMode ? 'Generating 3 design options — click to turn off' : 'Generate 3 design options with different UX approaches'}>
                  <button
                    type="button"
                    onClick={() => setVariantsMode(v => !v)}
                    className={`w-9 flex items-center justify-center rounded-lg text-[11px] transition-all border ${
                      variantsMode
                        ? 'bg-studio-accent/10 border-studio-accent/40 text-studio-accent'
                        : 'border-studio-border text-studio-text-dim hover:text-studio-text hover:border-studio-border-hover'
                    }`}
                    aria-label="Toggle 3 design options mode"
                    aria-pressed={variantsMode}
                  >
                    <Layers size={13} />
                  </button>
                </Tip>
              </div>
              {variantsMode && (
                <p className="text-[10px] text-studio-text-secondary text-center leading-tight">
                  3 directions: Efficiency · Information · Clarity
                </p>
              )}
            </div>
          )
        }

        // No prompt + design exists → Improve action
        if (hasDesign) {
          return (
            <div className="px-3 pb-3">
              <button
                onClick={handleImprove}
                disabled={activeCount === 0}
                title={activeCount === 0 ? 'Enable at least one quality toggle to improve the design' : `Improve using ${activeCount} lens${activeCount !== 1 ? 'es' : ''}`}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-medium transition-all border ${
                  activeCount === 0
                    ? 'border-studio-border text-studio-text-dim cursor-not-allowed opacity-50'
                    : 'border-studio-accent/20 text-studio-accent hover:bg-studio-accent/5 hover:border-studio-accent/40'
                }`}
              >
                <Sparkles size={12} />
                Improve Design{activeCount > 0 ? ` · ${activeCount} lens${activeCount !== 1 ? 'es' : ''}` : ''}
              </button>
            </div>
          )
        }

        // No prompt + no design → nothing
        return null
      })()}
      {/* Always-mounted hidden file input — shared by home drop zone and editing import panel */}
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" aria-label="Upload wireframe image" />

      {/* API Key Modal — shown once on first use */}
      {showApiKeyModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowApiKeyModal(false)}>
          <div className="bg-studio-surface rounded-xl border border-studio-border shadow-2xl w-[380px] p-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col gap-1">
              <h3 className="text-[15px] font-semibold text-studio-text">Enter your OpenRouter API key</h3>
              <p className="text-[12px] text-studio-text-secondary leading-relaxed">
                Get your key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-studio-accent underline">openrouter.ai/keys</a>. It will be saved locally in your browser.
              </p>
            </div>
            <input
              type="password"
              placeholder="sk-or-..."
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && apiKeyInput.trim()) {
                  saveOpenRouterKey(apiKeyInput.trim())
                  setOpenRouterKey(apiKeyInput.trim())
                  setShowApiKeyModal(false)
                  setApiKeyInput('')
                }
              }}
              className="w-full h-10 px-3 rounded-lg bg-studio-surface-2 border border-studio-border text-studio-text text-[13px] placeholder:text-studio-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-studio-accent"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowApiKeyModal(false); setApiKeyInput('') }}
                className="flex-1 h-9 rounded-lg text-[12px] font-medium text-studio-text-secondary hover:bg-studio-surface-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!apiKeyInput.trim()) return
                  saveOpenRouterKey(apiKeyInput.trim())
                  setOpenRouterKey(apiKeyInput.trim())
                  setShowApiKeyModal(false)
                  setApiKeyInput('')
                }}
                disabled={!apiKeyInput.trim()}
                className="flex-1 h-9 rounded-lg text-[12px] font-medium bg-studio-accent text-white hover:bg-studio-accent-hover disabled:opacity-40 transition-colors"
              >
                Save key
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </nav>
  )
}
