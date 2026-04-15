import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDesigner } from '../designer-store'
import { htmlToXaml } from '../utils/html-to-xaml'
import { DESIGN_SYSTEM_CSS } from '../utils/build-artboard-doc'

// ── Style field config ───

interface StyleField {
  key: string
  label: string
  type: 'color' | 'text' | 'select'
  options?: string[]
}

const TEXT_FIELDS: StyleField[] = [
  { key: 'color', label: 'Color', type: 'color' },
  { key: 'fontSize', label: 'Size', type: 'text' },
  { key: 'fontWeight', label: 'Weight', type: 'select', options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  { key: 'textAlign', label: 'Align', type: 'select', options: ['left', 'center', 'right'] },
  { key: 'lineHeight', label: 'Line H.', type: 'text' },
]

const BG_FIELDS: StyleField[] = [
  { key: 'backgroundColor', label: 'BG', type: 'color' },
  { key: 'opacity', label: 'Opacity', type: 'text' },
]

const SPACING_FIELDS: StyleField[] = [
  { key: 'padding', label: 'Padding', type: 'text' },
  { key: 'margin', label: 'Margin', type: 'text' },
  { key: 'gap', label: 'Gap', type: 'text' },
]

const LAYOUT_FIELDS: StyleField[] = [
  { key: 'display', label: 'Display', type: 'select', options: ['block', 'flex', 'grid', 'inline-flex', 'none'] },
  { key: 'width', label: 'Width', type: 'text' },
  { key: 'height', label: 'Height', type: 'text' },
]

const FLEX_CONTAINER_FIELDS: StyleField[] = [
  { key: 'flexDirection', label: 'Direction', type: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
  { key: 'justifyContent', label: 'Justify', type: 'select', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] },
  { key: 'alignItems', label: 'Align', type: 'select', options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'] },
  { key: 'flexWrap', label: 'Wrap', type: 'select', options: ['nowrap', 'wrap', 'wrap-reverse'] },
]

const FLEX_CHILD_FIELDS: StyleField[] = [
  { key: 'flexGrow', label: 'Grow', type: 'select', options: ['0', '1'] },
  { key: 'flexShrink', label: 'Shrink', type: 'select', options: ['0', '1'] },
  { key: 'alignSelf', label: 'Self', type: 'select', options: ['auto', 'flex-start', 'center', 'flex-end', 'stretch'] },
]

// ── Helpers ───

function rgbToHex(rgb: string): string {
  if (rgb.startsWith('#')) return rgb
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return '#000000'
  const [, r, g, b] = match
  return '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('')
}

function isTransparent(color: string): boolean {
  return color === 'rgba(0, 0, 0, 0)' || color === 'transparent'
}

// ── Field Component ───

function StyleFieldInput({ field, value, onChange }: { field: StyleField; value: string; onChange: (key: string, val: string) => void }) {
  const [localVal, setLocalVal] = useState(value)
  useEffect(() => { setLocalVal(value) }, [value])

  const commit = () => { if (localVal !== value) onChange(field.key, localVal) }

  if (field.type === 'color') {
    const hexVal = isTransparent(value) ? '#ffffff' : rgbToHex(value)
    return (
      <div className="flex items-center gap-2">
        <label className="text-[10px] text-white/35 w-14 shrink-0">{field.label}</label>
        <input type="color" value={hexVal} onChange={e => onChange(field.key, e.target.value)}
          className="w-5 h-5 rounded border border-white/10 cursor-pointer bg-transparent p-0" />
        <input type="text" value={isTransparent(value) ? 'transparent' : hexVal}
          onChange={e => setLocalVal(e.target.value)}
          onBlur={() => onChange(field.key, localVal)}
          onKeyDown={e => { if (e.key === 'Enter') onChange(field.key, localVal) }}
          className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded px-1.5 py-0.5 text-[10px] text-white/70 font-mono" />
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <div className="flex items-center gap-2">
        <label className="text-[10px] text-white/35 w-14 shrink-0">{field.label}</label>
        <select value={value} onChange={e => onChange(field.key, e.target.value)}
          className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded px-1.5 py-0.5 text-[10px] text-white/70">
          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-[10px] text-white/35 w-14 shrink-0">{field.label}</label>
      <input type="text" value={localVal} onChange={e => setLocalVal(e.target.value)}
        onBlur={commit} onKeyDown={e => { if (e.key === 'Enter') commit() }}
        className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded px-1.5 py-0.5 text-[10px] text-white/70 font-mono" />
    </div>
  )
}

// ── Section ───

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-white/[0.06]">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-2 text-[10px] font-semibold text-white/50 hover:text-white/70 transition-colors">
        <span className="text-white/30">{icon}</span>
        <span>{title}</span>
        <span className="ml-auto text-white/20">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-4 pb-3 space-y-1.5">{children}</div>}
    </div>
  )
}

// ── Code View ───

function highlightHtml(code: string): string {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="text-[#0A3EFF]">$2</span>')
    .replace(/([\w-]+)=(&quot;|")/g, '<span class="text-[#22C55E]">$1</span>=<span class="text-white/40">"</span>')
    .replace(/class="/g, '<span class="text-[#22C55E]">class</span>=<span class="text-white/40">"</span>')
}

function highlightXaml(code: string): string {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(&lt;\/?)([\w:.]+)/g, '$1<span class="text-[#C084FC]">$2</span>')
    .replace(/([\w:.]+)=(")/g, '<span class="text-[#22C55E]">$1</span>=<span class="text-white/40">"</span>')
    .replace(/&lt;!--(.+?)--&gt;/g, '<span class="text-white/25">&lt;!--$1--&gt;</span>')
}

function formatHtml(html: string): string {
  try {
    let indent = 0
    return html.replace(/></g, '>\n<').split('\n').map(line => {
      const trimmed = line.trim()
      if (trimmed.startsWith('</')) indent = Math.max(0, indent - 1)
      const result = '  '.repeat(indent) + trimmed
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</')) indent++
      return result
    }).join('\n')
  } catch {
    return html
  }
}

type CodeTab = 'html' | 'xaml'

function CodeView() {
  const { state } = useDesigner()
  const { artboards, selectedArtboardId } = state
  const artboard = artboards.find(a => a.id === selectedArtboardId)
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<CodeTab>('html')

  const html = artboard?.html || ''
  const formatted = useMemo(() => formatHtml(html), [html])
  const xaml = useMemo(() => htmlToXaml(html), [html])

  const activeCode = tab === 'html' ? html : xaml
  const activeFormatted = tab === 'html' ? formatted : xaml

  const copy = useCallback(() => {
    if (tab === 'html') {
      // Self-contained HTML for Figma import — fonts, CSS, no JS
      const selfContained = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
<style>
html,body{margin:0;width:100%;height:100%;background:#FFFFFF;color:#202020;font-family:"Switzer","Segoe UI",Roboto,system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;}
#app{width:100%;height:100%;overflow:auto;}
${DESIGN_SYSTEM_CSS}
${artboard?.css || ''}
</style></head><body><div id="app">${html}</div></body></html>`
      navigator.clipboard.writeText(selfContained)
    } else {
      navigator.clipboard.writeText(xaml)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [tab, html, xaml, artboard?.css])

  if (!artboard) {
    return <div className="p-4 text-[11px] text-white/25">Select an artboard to view code</div>
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-white/[0.06] flex items-center gap-2">
        {/* Tab toggle */}
        <div className="flex bg-white/[0.04] rounded p-0.5">
          <button
            onClick={() => setTab('html')}
            className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
              tab === 'html'
                ? 'bg-white/[0.1] text-white/80'
                : 'text-white/30 hover:text-white/50'
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => setTab('xaml')}
            className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
              tab === 'xaml'
                ? 'bg-[#C084FC]/20 text-[#C084FC]'
                : 'text-white/30 hover:text-white/50'
            }`}
          >
            XAML
          </button>
        </div>

        <span className="flex-1 text-[11px] text-white/30 truncate">{artboard.name}</span>

        <button onClick={copy}
          className="text-[10px] px-2 py-1 rounded bg-white/[0.06] text-white/40 hover:text-white/70 transition-colors flex-shrink-0">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-3">
        <pre
          className="text-[10px] leading-[1.6] text-white/60 font-mono whitespace-pre-wrap break-all"
          dangerouslySetInnerHTML={{
            __html: tab === 'html' ? highlightHtml(activeFormatted) : highlightXaml(activeFormatted)
          }}
        />
      </div>
    </div>
  )
}

// ── Main InspectorPanel ───

export default function InspectorPanel() {
  const { state, dispatch } = useDesigner()
  const { selectedElement, rightPanel, selectedArtboardId } = state

  const sendToIframe = useCallback((type: string, data: Record<string, unknown>) => {
    const fn = (window as any).__designerSendToIframe
    if (fn) fn(type, data)
  }, [])

  const handleStyleChange = useCallback((key: string, value: string) => {
    sendToIframe('updateStyle', { property: key, value })
  }, [sendToIframe])

  const handleTextChange = useCallback((text: string) => {
    sendToIframe('updateText', { text })
  }, [sendToIframe])

  // Code view
  if (rightPanel === 'code') {
    return (
      <div className="flex flex-col h-full" style={{ width: 320, background: '#0e0e11' }}>
        <div className="flex-shrink-0 px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-[13px] font-semibold text-white/90">Code</span>
          <button onClick={() => dispatch({ type: 'SET_RIGHT_PANEL', panel: 'chat' })}
            className="text-[10px] text-white/30 hover:text-white/50 px-2 py-1 rounded hover:bg-white/[0.05] transition-colors">
            Back
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <CodeView />
        </div>
      </div>
    )
  }

  // Inspector view (element selected)
  if (rightPanel === 'inspect' && selectedElement) {
    return (
      <div className="flex flex-col h-full" style={{ width: 320, background: '#0e0e11' }}>
        <div className="flex-shrink-0 px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-white/90">Inspector</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0A3EFF]/15 text-[#0A3EFF] font-mono">
              {selectedElement.tag}
            </span>
          </div>
          <button onClick={() => { dispatch({ type: 'SELECT_ELEMENT', element: null }); dispatch({ type: 'SET_RIGHT_PANEL', panel: 'chat' }) }}
            className="text-[10px] text-white/30 hover:text-white/50 px-2 py-1 rounded hover:bg-white/[0.05] transition-colors">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Element info */}
          <div className="px-4 py-2 border-b border-white/[0.06]">
            {selectedElement.classes && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedElement.classes.split(' ').filter(Boolean).map((cls, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40 font-mono">.{cls}</span>
                ))}
              </div>
            )}
            <div className="text-[9px] text-white/20 font-mono truncate">{selectedElement.path}</div>
          </div>

          {/* Text content (if leaf element) */}
          {selectedElement.text !== null && (
            <Section title="Content" icon="T">
              <textarea
                value={selectedElement.text}
                onChange={e => {
                  handleTextChange(e.target.value)
                  dispatch({ type: 'SELECT_ELEMENT', element: { ...selectedElement, text: e.target.value } })
                }}
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded px-2 py-1.5 text-[11px] text-white/80 resize-none outline-none focus:border-[#0A3EFF]/40"
                rows={2}
              />
            </Section>
          )}

          {/* Typography */}
          <Section title="Typography" icon="Aa">
            {TEXT_FIELDS.map(f => (
              <StyleFieldInput key={f.key} field={f} value={selectedElement.styles[f.key] || ''} onChange={handleStyleChange} />
            ))}
          </Section>

          {/* Background */}
          <Section title="Background" icon="◻">
            {BG_FIELDS.map(f => (
              <StyleFieldInput key={f.key} field={f} value={selectedElement.styles[f.key] || ''} onChange={handleStyleChange} />
            ))}
          </Section>

          {/* Spacing */}
          <Section title="Spacing" icon="⊞">
            {SPACING_FIELDS.map(f => (
              <StyleFieldInput key={f.key} field={f} value={selectedElement.styles[f.key] || ''} onChange={handleStyleChange} />
            ))}
          </Section>

          {/* Layout */}
          <Section title="Layout" icon="▦">
            {LAYOUT_FIELDS.map(f => (
              <StyleFieldInput key={f.key} field={f} value={selectedElement.styles[f.key] || ''} onChange={handleStyleChange} />
            ))}
          </Section>

          {/* Flex Container — shown when display is flex/inline-flex */}
          {(selectedElement.styles.display === 'flex' || selectedElement.styles.display === 'inline-flex') && (
            <Section title="Auto-Layout" icon="⇄">
              {FLEX_CONTAINER_FIELDS.map(f => (
                <StyleFieldInput key={f.key} field={f} value={selectedElement.styles[f.key] || ''} onChange={handleStyleChange} />
              ))}
            </Section>
          )}

          {/* Flex Child — always shown (parent may be flex) */}
          <Section title="Flex Child" icon="↔">
            {FLEX_CHILD_FIELDS.map(f => (
              <StyleFieldInput key={f.key} field={f} value={selectedElement.styles[f.key] || ''} onChange={handleStyleChange} />
            ))}
          </Section>

          {/* Size info */}
          <div className="px-4 py-3 border-t border-white/[0.06]">
            <div className="text-[9px] text-white/25 font-mono">
              {Math.round(selectedElement.rect.w)} × {Math.round(selectedElement.rect.h)} px
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default: return null — ChatPanel will render instead
  return null
}
