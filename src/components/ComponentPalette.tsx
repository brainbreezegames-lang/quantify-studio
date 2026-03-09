import { useState } from 'react'
import {
  Search, Plus, ChevronDown, ChevronRight,
  LayoutGrid, Navigation, TextCursorInput, Square, MousePointerClick,
  Layers, CheckSquare, Eye, ListOrdered, MessageSquare, Monitor,
} from 'lucide-react'
import { useAppDispatch } from '../store'
import { COMPONENT_PALETTE_CATEGORIES, type PaletteItem as PaletteItemType } from '../types'
import ComponentThumbnail from './ComponentThumbnail'
import { PALETTE_PRESETS, PATTERN_PRESETS } from '../palette-presets'

// ─── Category icons ───

const CATEGORY_ICONS: Record<string, typeof LayoutGrid> = {
  actions: MousePointerClick,
  input: TextCursorInput,
  selection: CheckSquare,
  navigation: Navigation,
  containers: Square,
  display: Eye,
  data: ListOrdered,
  feedback: MessageSquare,
  layout: LayoutGrid,
}

// ─── Draggable palette item (supports variants) ───

function PaletteItemCard({ item }: { item: PaletteItemType }) {
  const handleDragStart = (e: React.DragEvent) => {
    // Encode both the type and optional variant properties
    const data = item.props
      ? JSON.stringify({ type: item.type, props: item.props })
      : JSON.stringify({ type: item.type })
    e.dataTransfer.setData('application/x-uno-component', data)
    // Keep backwards compat: also set plain type
    e.dataTransfer.setData('text/plain', item.type)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg border border-studio-border bg-studio-surface-2 cursor-grab active:cursor-grabbing hover:border-studio-accent/40 hover:bg-studio-accent/5 transition-all select-none group"
      role="option"
      aria-label={`Drag ${item.label} component`}
    >
      <ComponentThumbnail type={item.type} variant={item.props} />
      <span className="text-[10px] font-medium text-studio-text-muted group-hover:text-studio-accent transition-colors text-center leading-tight">
        {item.label}
      </span>
    </div>
  )
}

// ─── Draggable preset item ───

function PresetItem({ preset }: { preset: typeof PALETTE_PRESETS[number] }) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/x-uno-preset', preset.id)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center gap-2.5 p-2 rounded-lg border border-studio-border bg-studio-surface-2 cursor-grab active:cursor-grabbing hover:border-studio-accent/40 hover:bg-studio-accent/5 transition-all select-none group"
      role="option"
      aria-label={`Drag ${preset.label} preset`}
    >
      <ComponentThumbnail type={preset.rootType} />
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] font-medium text-studio-text-muted group-hover:text-studio-accent transition-colors leading-tight truncate">
          {preset.label}
        </span>
        <span className="text-[9px] text-studio-text-dim leading-tight truncate">
          {preset.description}
        </span>
      </div>
    </div>
  )
}

// ─── Category section ───

function CategorySection({
  id,
  label,
  items,
  search,
  defaultExpanded = false,
}: {
  id: string
  label: string
  items: PaletteItemType[]
  search: string
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const Icon = CATEGORY_ICONS[id] || Square

  const filtered = search
    ? items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()) || item.type.toLowerCase().includes(search.toLowerCase()))
    : items

  if (filtered.length === 0) return null

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-studio-surface-3 transition-colors"
        aria-expanded={expanded}
      >
        <Icon size={13} className="text-studio-text-dim flex-shrink-0" aria-hidden="true" />
        <span className="text-[11px] font-semibold text-studio-text-muted uppercase tracking-wider flex-1 text-left">
          {label}
        </span>
        {expanded ? (
          <ChevronDown size={12} className="text-studio-text-dim" aria-hidden="true" />
        ) : (
          <ChevronRight size={12} className="text-studio-text-dim" aria-hidden="true" />
        )}
      </button>
      {expanded && (
        <div className="grid grid-cols-2 gap-1.5 mt-1.5 px-0.5">
          {filtered.map((item, i) => (
            <PaletteItemCard key={`${item.type}-${item.label}-${i}`} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Presets section ───

function PresetsSection({ search }: { search: string }) {
  const [expanded, setExpanded] = useState(false)

  const filtered = search
    ? PALETTE_PRESETS.filter(
        (p) =>
          p.label.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      )
    : PALETTE_PRESETS

  if (filtered.length === 0) return null

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-studio-surface-3 transition-colors"
        aria-expanded={expanded}
      >
        <Layers size={13} className="text-studio-text-dim flex-shrink-0" aria-hidden="true" />
        <span className="text-[11px] font-semibold text-studio-text-muted uppercase tracking-wider flex-1 text-left">
          Presets
        </span>
        {expanded ? (
          <ChevronDown size={12} className="text-studio-text-dim" aria-hidden="true" />
        ) : (
          <ChevronRight size={12} className="text-studio-text-dim" aria-hidden="true" />
        )}
      </button>
      {expanded && (
        <div className="flex flex-col gap-1.5 mt-1.5 px-0.5">
          {filtered.map((preset) => (
            <PresetItem key={preset.id} preset={preset} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Patterns section (full screen templates) ───

function PatternsSection({ search }: { search: string }) {
  const [expanded, setExpanded] = useState(false)

  const filtered = search
    ? PATTERN_PRESETS.filter(
        (p) =>
          p.label.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      )
    : PATTERN_PRESETS

  if (filtered.length === 0) return null

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-studio-surface-3 transition-colors"
        aria-expanded={expanded}
      >
        <Monitor size={13} className="text-studio-accent flex-shrink-0" aria-hidden="true" />
        <span className="text-[11px] font-semibold text-studio-accent uppercase tracking-wider flex-1 text-left">
          Patterns
        </span>
        {expanded ? (
          <ChevronDown size={12} className="text-studio-accent" aria-hidden="true" />
        ) : (
          <ChevronRight size={12} className="text-studio-accent" aria-hidden="true" />
        )}
      </button>
      {expanded && (
        <div className="flex flex-col gap-1.5 mt-1.5 px-0.5">
          {filtered.map((preset) => (
            <PresetItem key={preset.id} preset={preset} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main palette ───

export default function ComponentPalette() {
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState('')

  const noResults =
    search &&
    COMPONENT_PALETTE_CATEGORIES.every((cat) =>
      cat.items.every((item) => !item.label.toLowerCase().includes(search.toLowerCase()) && !item.type.toLowerCase().includes(search.toLowerCase())),
    ) &&
    PALETTE_PRESETS.every(
      (p) =>
        !p.label.toLowerCase().includes(search.toLowerCase()) &&
        !p.description.toLowerCase().includes(search.toLowerCase()),
    ) &&
    PATTERN_PRESETS.every(
      (p) =>
        !p.label.toLowerCase().includes(search.toLowerCase()) &&
        !p.description.toLowerCase().includes(search.toLowerCase()),
    )

  return (
    <div className="flex flex-col h-full">
      {/* Header with blank canvas button */}
      <div className="px-3 py-2.5 border-b border-studio-border flex items-center justify-between min-h-[42px]">
        <h2 className="text-xs font-semibold text-studio-text-muted uppercase tracking-wider">Components</h2>
        <button
          onClick={() => dispatch({ type: 'START_BLANK_CANVAS' })}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-studio-accent bg-studio-accent/10 hover:bg-studio-accent/20 text-[11px] font-medium transition-colors"
          aria-label="Start a new blank canvas"
        >
          <Plus size={12} aria-hidden="true" />
          Blank
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-1">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-studio-text-dim pointer-events-none" aria-hidden="true" />
          <label className="sr-only" htmlFor="palette-search">Search components</label>
          <input
            id="palette-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search components…"
            className="w-full bg-studio-surface-2 border border-studio-border rounded-lg pl-8 pr-3 py-2 text-xs text-studio-text placeholder-studio-text-dim focus:outline-none focus:border-studio-accent/50 transition-colors"
          />
        </div>
      </div>

      {/* Drag hint */}
      <p className="px-3 pt-1 pb-2 text-[10px] text-studio-text-dim">
        Drag onto the preview to place
      </p>

      {/* Presets + Categories + Patterns */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3" role="listbox" aria-label="Component palette">
        <PresetsSection search={search} />
        {COMPONENT_PALETTE_CATEGORIES.map((cat) => (
          <CategorySection
            key={cat.id}
            id={cat.id}
            label={cat.label}
            items={cat.items}
            search={search}
          />
        ))}
        <PatternsSection search={search} />

        {/* No results */}
        {noResults && (
          <p className="text-xs text-studio-text-dim text-center py-4">
            No components match "{search}"
          </p>
        )}
      </div>
    </div>
  )
}
