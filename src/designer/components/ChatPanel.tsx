import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { v4 as uuid } from 'uuid'
import { useDesigner } from '../designer-store'
import { DESIGNER_SYSTEM_PROMPT } from '../utils/designer-system-prompt'
import type { ChatMessage, ArtboardAction } from '../types'

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

export default function ChatPanel() {
  const { state, dispatch } = useDesigner()
  const { messages, isGenerating, artboards, selectedArtboardId } = state

  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const send = useCallback(async (text?: string) => {
    const content = (text || input).trim()
    if (!content || isGenerating) return

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

    try {
      // Build context about current artboards
      const artboardContext = artboards.map(a => ({
        id: a.id,
        name: a.name,
        width: a.width,
        height: a.height,
        html: a.html.slice(0, 3000), // truncate for context window
      }))

      // Build conversation history for the API
      const recentMessages = [...messages.slice(-14), userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }))

      // Add artboard context to the user message
      let augmentedContent = content
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

      // Replace the last user message content with augmented version
      const apiMessages = recentMessages.map((m, i) =>
        i === recentMessages.length - 1 && m.role === 'user'
          ? { ...m, content: augmentedContent }
          : m
      )

      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'designer',
          messages: apiMessages,
          artboards: artboardContext,
          openRouterApiKey: getOpenRouterKey(),
        }),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error || 'Something went wrong')
      }

      const data = await resp.json()

      // Process artboard actions
      const actions: ArtboardAction[] = []
      if (data.artboards && Array.isArray(data.artboards)) {
        for (const ab of data.artboards) {
          if (ab.action === 'create') {
            const newId = uuid()
            // Position new artboards next to existing ones
            const lastArtboard = artboards.length > 0 ? artboards[artboards.length - 1] : null
            const x = lastArtboard ? lastArtboard.x + lastArtboard.width + 60 : 100
            const y = lastArtboard ? lastArtboard.y : 100

            dispatch({
              type: 'CREATE_ARTBOARD',
              artboard: {
                id: newId,
                name: ab.name || 'New screen',
                x,
                y,
                width: ab.width || 390,
                height: ab.height || 844,
                html: ab.html || '',
                css: ab.css || '',
                createdAt: Date.now(),
                updatedAt: Date.now(),
              },
            })
            actions.push({ type: 'create', artboardId: newId, artboardName: ab.name || 'New screen' })
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

      const assistantMsg: ChatMessage = {
        id: uuid(),
        role: 'assistant',
        content: data.reply || 'Done.',
        timestamp: Date.now(),
        artboardActions: actions.length > 0 ? actions : undefined,
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
      dispatch({ type: 'SET_GENERATING', value: false })
    }
  }, [input, messages, isGenerating, artboards, selectedArtboardId, dispatch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#111114] border-l border-white/[0.06]" style={{ width: 380 }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0">
        <div>
          <div className="text-[13px] font-semibold text-white/90">Design chat</div>
          <div className="text-[11px] text-white/30">Describe screens to generate</div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => dispatch({ type: 'CLEAR_CHAT' })}
            className="text-[10px] text-white/30 hover:text-white/50 px-2 py-1 rounded hover:bg-white/[0.05] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
        {messages.length === 0 && !isGenerating && (
          <div className="py-6">
            <div className="text-[12px] text-white/30 mb-3">Try asking:</div>
            <div className="space-y-1.5">
              {SUGGESTED_PROMPTS.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="block w-full text-left text-[12px] text-[#0A3EFF]/70 hover:text-[#0A3EFF] px-3 py-2 rounded bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
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
                {/* Artboard action indicators */}
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

        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-white/[0.05] text-white/40 text-[12px] rounded-lg px-3 py-2 flex items-center gap-1.5">
              <span className="inline-block w-1 h-1 rounded-full bg-white/40 animate-pulse" />
              <span className="inline-block w-1 h-1 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '0.15s' }} />
              <span className="inline-block w-1 h-1 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] px-3 py-2 flex-shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe a screen to design..."
            rows={1}
            className="flex-1 bg-white/[0.05] text-white/90 text-[12px] rounded-md px-3 py-2 resize-none outline-none placeholder:text-white/20 focus:ring-1 focus:ring-[#0A3EFF]/30 max-h-[100px] overflow-y-auto"
            style={{ minHeight: 36 }}
            disabled={isGenerating}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || isGenerating}
            className="p-2 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            aria-label="Send"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
