import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
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
        <div className="fixed bottom-16 right-5 z-[9998] w-[380px] max-h-[540px] rounded-lg border border-studio-border bg-studio-surface shadow-2xl flex flex-col overflow-hidden"
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
                {msg.role === 'user' ? (
                  <div className="max-w-[85%] text-[12px] leading-[1.6] rounded-lg px-3 py-2 bg-studio-accent/15 text-studio-text whitespace-pre-wrap">
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-[90%] rounded-lg px-3 py-2 bg-studio-surface-2 text-studio-text qchat-prose">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h3 className="text-[13px] font-bold text-studio-text mt-3 mb-1.5 first:mt-0">{children}</h3>,
                        h2: ({ children }) => <h4 className="text-[12px] font-bold text-studio-text mt-2.5 mb-1 first:mt-0">{children}</h4>,
                        h3: ({ children }) => <h5 className="text-[12px] font-semibold text-studio-text mt-2 mb-1 first:mt-0">{children}</h5>,
                        p: ({ children }) => <p className="text-[12px] leading-[1.65] text-studio-text mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="text-[12px] leading-[1.65] mb-2 last:mb-0 pl-4 space-y-0.5 list-disc marker:text-studio-text-dim">{children}</ul>,
                        ol: ({ children }) => <ol className="text-[12px] leading-[1.65] mb-2 last:mb-0 pl-4 space-y-0.5 list-decimal marker:text-studio-text-dim">{children}</ol>,
                        li: ({ children }) => <li className="text-studio-text pl-0.5">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold text-studio-text">{children}</strong>,
                        em: ({ children }) => <em className="italic text-studio-text-muted">{children}</em>,
                        code: ({ children, className }) => {
                          const isBlock = className?.includes('language-')
                          if (isBlock) {
                            return <code className="block bg-studio-bg text-studio-text-muted text-[11px] leading-[1.5] rounded px-2.5 py-2 my-2 overflow-x-auto font-mono whitespace-pre">{children}</code>
                          }
                          return <code className="bg-studio-bg text-studio-accent text-[11px] px-1 py-0.5 rounded font-mono">{children}</code>
                        },
                        pre: ({ children }) => <div className="my-2">{children}</div>,
                        blockquote: ({ children }) => <blockquote className="border-l-2 border-studio-accent/30 pl-3 my-2 text-studio-text-muted italic">{children}</blockquote>,
                        hr: () => <hr className="border-studio-border my-3" />,
                        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-studio-accent hover:underline">{children}</a>,
                        table: ({ children }) => <div className="overflow-x-auto my-2"><table className="text-[11px] w-full border-collapse">{children}</table></div>,
                        thead: ({ children }) => <thead className="bg-studio-bg">{children}</thead>,
                        th: ({ children }) => <th className="text-left text-[11px] font-semibold text-studio-text-muted px-2 py-1 border-b border-studio-border">{children}</th>,
                        td: ({ children }) => <td className="text-[11px] text-studio-text px-2 py-1 border-b border-studio-border/50">{children}</td>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
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
