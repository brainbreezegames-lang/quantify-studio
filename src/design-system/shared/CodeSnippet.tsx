import React, { useState } from 'react'

interface CodeSnippetProps {
  code: string
  language?: string
  title?: string
}

function highlightXaml(code: string): string {
  // Escape HTML entities first
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Highlight string values (must come before attribute matching)
  // Match "..." strings that are attribute values
  escaped = escaped.replace(
    /&quot;([^&]*)&quot;|"([^"]*)"/g,
    (match) => `<span class="xaml-string">${match}</span>`
  )

  // Highlight attribute names (word followed by =)
  escaped = escaped.replace(
    /(\s)([a-zA-Z_][\w.:]*)(=)/g,
    '$1<span class="xaml-attr">$2</span>$3'
  )

  // Highlight tag names after < or </
  escaped = escaped.replace(
    /(&lt;\/?)([\w.:]+)/g,
    '$1<span class="xaml-tag">$2</span>'
  )

  return escaped
}

function highlightGeneric(code: string): string {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export default function CodeSnippet({ code, language = 'xaml', title }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const highlighted = language === 'xaml' ? highlightXaml(code) : highlightGeneric(code)
  const lineCount = code.split('\n').length

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="ds-code-snippet" data-expanded={expanded}>
      {/* Clickable header — toggle expand/collapse */}
      <button
        className="ds-code-snippet-header"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <div className="ds-code-snippet-header-left">
          <svg
            className="ds-code-snippet-chevron"
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
          <span className="ds-code-snippet-title">{title || language.toUpperCase()}</span>
          <span className="ds-code-snippet-meta">{lineCount} lines</span>
        </div>
        <div className="ds-code-snippet-actions" onClick={e => e.stopPropagation()}>
          <button
            onClick={handleCopy}
            className="ds-code-snippet-copy"
            type="button"
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                Copied
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                Copy
              </>
            )}
          </button>
        </div>
      </button>

      {/* Collapsible code block */}
      <div className="ds-code-snippet-body" style={{ display: expanded ? 'block' : 'none' }}>
        <pre
          style={{
            margin: 0,
            padding: 16,
            fontFamily: 'var(--av-font-mono, "JetBrains Mono", monospace)',
            fontSize: 13,
            lineHeight: 1.6,
            color: 'var(--av-on-surface, #1C1B1F)',
            overflowX: 'auto',
            tabSize: 2,
          }}
        >
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      </div>
    </div>
  )
}
