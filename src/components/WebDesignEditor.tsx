import { useState, useEffect, useCallback } from 'react'
import { Type, Palette, Square, Move, MousePointer, Trash2 } from 'lucide-react'
import { useWebEdit } from '../contexts/WebEditContext'

// ─── Style field config ───

interface StyleField {
  key: string
  label: string
  type: 'color' | 'text' | 'select' | 'number'
  options?: string[]
  suffix?: string
}

const TEXT_FIELDS: StyleField[] = [
  { key: 'color', label: 'Color', type: 'color' },
  { key: 'fontSize', label: 'Size', type: 'text' },
  { key: 'fontWeight', label: 'Weight', type: 'select', options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  { key: 'textAlign', label: 'Align', type: 'select', options: ['left', 'center', 'right', 'justify'] },
  { key: 'lineHeight', label: 'Line Height', type: 'text' },
  { key: 'letterSpacing', label: 'Spacing', type: 'text' },
]

const BG_FIELDS: StyleField[] = [
  { key: 'backgroundColor', label: 'Background', type: 'color' },
  { key: 'opacity', label: 'Opacity', type: 'text' },
]

const SPACING_FIELDS: StyleField[] = [
  { key: 'padding', label: 'Padding', type: 'text' },
  { key: 'margin', label: 'Margin', type: 'text' },
  { key: 'gap', label: 'Gap', type: 'text' },
  { key: 'borderRadius', label: 'Radius', type: 'text' },
]

const LAYOUT_FIELDS: StyleField[] = [
  { key: 'display', label: 'Display', type: 'select', options: ['block', 'flex', 'grid', 'inline-flex', 'inline-block', 'none'] },
  { key: 'width', label: 'Width', type: 'text' },
  { key: 'height', label: 'Height', type: 'text' },
]

// ─── Helpers ───

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

// ─── Field Component ───

function StyleFieldInput({ field, value, onChange }: { field: StyleField; value: string; onChange: (key: string, val: string) => void }) {
  const [localVal, setLocalVal] = useState(value)

  useEffect(() => { setLocalVal(value) }, [value])

  const commit = () => {
    if (localVal !== value) onChange(field.key, localVal)
  }

  if (field.type === 'color') {
    const hexVal = isTransparent(value) ? '#ffffff' : rgbToHex(value)
    return (
      <div className="flex items-center gap-2">
        <label className="text-[10px] text-studio-text-dim w-20 shrink-0">{field.label}</label>
        <div className="flex items-center gap-1.5 flex-1">
          <input
            type="color"
            value={hexVal}
            onChange={e => onChange(field.key, e.target.value)}
            className="w-6 h-6 rounded border border-studio-border cursor-pointer bg-transparent p-0"
          />
          <input
            type="text"
            value={isTransparent(value) ? 'transparent' : hexVal}
            onChange={e => setLocalVal(e.target.value)}
            onBlur={() => onChange(field.key, localVal)}
            onKeyDown={e => { if (e.key === 'Enter') onChange(field.key, localVal) }}
            className="flex-1 bg-studio-surface-3 border border-studio-border rounded px-1.5 py-0.5 text-[11px] text-studio-text font-mono"
          />
        </div>
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <div className="flex items-center gap-2">
        <label className="text-[10px] text-studio-text-dim w-20 shrink-0">{field.label}</label>
        <select
          value={value}
          onChange={e => onChange(field.key, e.target.value)}
          className="flex-1 bg-studio-surface-3 border border-studio-border rounded px-1.5 py-0.5 text-[11px] text-studio-text"
        >
          {field.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-[10px] text-studio-text-dim w-20 shrink-0">{field.label}</label>
      <input
        type="text"
        value={localVal}
        onChange={e => setLocalVal(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit() }}
        className="flex-1 bg-studio-surface-3 border border-studio-border rounded px-1.5 py-0.5 text-[11px] text-studio-text font-mono"
      />
    </div>
  )
}

// ─── Section ───

function Section({ icon: Icon, label, fields, styles, onChange }: {
  icon: React.ElementType
  label: string
  fields: StyleField[]
  styles: Record<string, string>
  onChange: (key: string, value: string) => void
}) {
  return (
    <div className="border-b border-studio-border pb-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon size={12} className="text-studio-text-dim" />
        <span className="text-[10px] font-semibold text-studio-text-muted uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {fields.map(f => (
          <StyleFieldInput key={f.key} field={f} value={styles[f.key] || ''} onChange={onChange} />
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ───

export default function WebDesignEditor() {
  const { selectedWebElement, sendToIframe } = useWebEdit()

  const handleStyleChange = useCallback((property: string, value: string) => {
    sendToIframe('updateStyle', { property, value })
  }, [sendToIframe])

  const handleTextChange = useCallback((text: string) => {
    sendToIframe('updateText', { text })
  }, [sendToIframe])

  const handleDelete = useCallback(() => {
    if (selectedWebElement) {
      sendToIframe('updateStyle', { property: 'display', value: 'none' })
    }
  }, [sendToIframe, selectedWebElement])

  if (!selectedWebElement) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-3">
        <MousePointer size={28} className="text-studio-text-dim opacity-40" />
        <div>
          <p className="text-[12px] font-medium text-studio-text-muted mb-1">Click to Select</p>
          <p className="text-[10px] text-studio-text-dim leading-relaxed">
            Switch to <span className="font-semibold text-studio-accent">Edit</span> mode and click any element in the preview to select it. Then edit its styles here.
          </p>
        </div>
        <div className="mt-4 text-[10px] text-studio-text-dim space-y-1">
          <p><kbd className="px-1 py-0.5 rounded bg-studio-surface-3 border border-studio-border text-[9px]">Click</kbd> Select element</p>
          <p><kbd className="px-1 py-0.5 rounded bg-studio-surface-3 border border-studio-border text-[9px]">Click again</kbd> Edit text inline</p>
          <p><kbd className="px-1 py-0.5 rounded bg-studio-surface-3 border border-studio-border text-[9px]">Esc</kbd> Deselect</p>
          <p><kbd className="px-1 py-0.5 rounded bg-studio-surface-3 border border-studio-border text-[9px]">Delete</kbd> Remove element</p>
        </div>
      </div>
    )
  }

  const { tag, classes, text, styles } = selectedWebElement
  const displayName = classes ? `${tag}.${classes.split(' ')[0]}` : tag

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Element header */}
      <div className="px-3 py-1.5 border-b border-studio-border flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="px-1.5 py-0.5 rounded bg-studio-accent/12 text-studio-accent text-[10px] font-semibold shrink-0">
            {tag}
          </div>
          {classes && (
            <span className="text-[10px] text-studio-text-dim truncate">.{classes.split(' ').slice(0, 2).join('.')}</span>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="p-1 rounded hover:bg-red-500/10 text-studio-text-dim hover:text-red-400 transition-colors"
          title="Hide element"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="px-3 py-3 flex flex-col gap-3">
        {/* Text content (only for leaf elements) */}
        {text !== null && (
          <div className="border-b border-studio-border pb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Type size={12} className="text-studio-text-dim" />
              <span className="text-[10px] font-semibold text-studio-text-muted uppercase tracking-wider">Content</span>
            </div>
            <textarea
              value={text}
              onChange={e => handleTextChange(e.target.value)}
              rows={2}
              className="w-full bg-studio-surface-3 border border-studio-border rounded px-2 py-1.5 text-[11px] text-studio-text resize-none"
            />
          </div>
        )}

        <Section icon={Type} label="Typography" fields={TEXT_FIELDS} styles={styles} onChange={handleStyleChange} />
        <Section icon={Palette} label="Background" fields={BG_FIELDS} styles={styles} onChange={handleStyleChange} />
        <Section icon={Square} label="Spacing & Border" fields={SPACING_FIELDS} styles={styles} onChange={handleStyleChange} />
        <Section icon={Move} label="Layout" fields={LAYOUT_FIELDS} styles={styles} onChange={handleStyleChange} />

        {/* Raw style inspector */}
        <details className="border-b border-studio-border pb-3">
          <summary className="text-[10px] text-studio-text-dim cursor-pointer hover:text-studio-text-muted select-none">
            All computed styles
          </summary>
          <div className="mt-2 max-h-48 overflow-y-auto">
            {Object.entries(styles).map(([k, v]) => (
              <div key={k} className="flex justify-between text-[9px] py-0.5 border-b border-studio-border/30">
                <span className="text-studio-text-dim">{k}</span>
                <span className="text-studio-text font-mono truncate max-w-[120px]">{v}</span>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  )
}
