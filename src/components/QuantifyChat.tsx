import { useState, useRef, useEffect, useCallback } from 'react'
import { getOpenRouterKey } from '../services/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const STORAGE_KEY = 'quantify-chat-history'

function loadHistory(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(msgs: Message[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-50)))
}

export default function QuantifyChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(loadHistory)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          messages: next,
          openRouterApiKey: getOpenRouterKey(),
        }),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Something went wrong.' }))
        throw new Error(err.error)
      }

      const data = await resp.json()
      const assistantMsg: Message = { role: 'assistant', content: data.reply }
      const updated = [...next, assistantMsg]
      setMessages(updated)
      saveHistory(updated)
    } catch (err: any) {
      const errMsg: Message = { role: 'assistant', content: `Error: ${err.message || 'Something went wrong.'}` }
      const updated = [...next, errMsg]
      setMessages(updated)
      saveHistory(updated)
    } finally {
      setLoading(false)
    }
  }, [input, messages, loading])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const clearHistory = () => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <>
      {/* Floating trigger button — bottom-right, subtle */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-5 right-5 z-[9999] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
          open
            ? 'bg-studio-surface-3 text-studio-text rotate-0'
            : 'bg-studio-surface-2 text-studio-text-dim hover:text-studio-text-muted hover:bg-studio-surface-3'
        }`}
        title="Quantify Knowledge Base"
        aria-label="Toggle Quantify assistant"
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.2 6L12 22l-3.8-7C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z" />
            <circle cx="12" cy="9" r="2" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-16 right-5 z-[9998] w-[360px] max-h-[520px] rounded-lg border border-studio-border bg-studio-surface shadow-2xl flex flex-col overflow-hidden"
          style={{ fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-studio-border flex items-center justify-between flex-shrink-0">
            <div>
              <div className="text-[13px] font-semibold text-studio-text">Quantify Assistant</div>
              <div className="text-[11px] text-studio-text-dim">Ask anything about Quantify</div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-[10px] text-studio-text-dim hover:text-studio-text-muted px-2 py-1 rounded hover:bg-studio-surface-2 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px]">
            {messages.length === 0 && !loading && (
              <div className="text-center py-8">
                <div className="text-studio-text-dim text-[12px] leading-relaxed">
                  <p className="mb-3 text-[13px] text-studio-text-muted">Your Quantify mentor</p>
                  <p className="mb-2">Try asking:</p>
                  <div className="space-y-1.5">
                    {[
                      'What is a DEL vs RET?',
                      'How does FATA billing work?',
                      'Explain the location hierarchy',
                      'What are the 3 ways to send equipment?',
                    ].map(q => (
                      <button
                        key={q}
                        onClick={() => { setInput(q); inputRef.current?.focus() }}
                        className="block w-full text-left text-[11px] text-studio-accent/80 hover:text-studio-accent px-3 py-1.5 rounded bg-studio-surface-2/50 hover:bg-studio-surface-2 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] text-[12px] leading-[1.6] rounded-lg px-3 py-2 whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-studio-accent/15 text-studio-text'
                      : 'bg-studio-surface-2 text-studio-text'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-studio-surface-2 text-studio-text-dim text-[12px] rounded-lg px-3 py-2 flex items-center gap-1.5">
                  <span className="inline-block w-1 h-1 rounded-full bg-studio-text-dim animate-pulse" />
                  <span className="inline-block w-1 h-1 rounded-full bg-studio-text-dim animate-pulse" style={{ animationDelay: '0.15s' }} />
                  <span className="inline-block w-1 h-1 rounded-full bg-studio-text-dim animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-studio-border px-3 py-2 flex-shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Quantify..."
                rows={1}
                className="flex-1 bg-studio-surface-2 text-studio-text text-[12px] rounded-md px-3 py-2 resize-none outline-none placeholder:text-studio-text-dim/50 focus:ring-1 focus:ring-studio-accent/30 max-h-[80px] overflow-y-auto"
                style={{ minHeight: '36px' }}
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="p-2 rounded-md text-studio-text-dim hover:text-studio-text hover:bg-studio-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                aria-label="Send message"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
