import { useState, useRef } from 'react'
import { X, Trash2, GripVertical, ChevronRight, Plus, Send, Loader2 } from 'lucide-react'
import Tooltip from '@mui/material/Tooltip'
import { useAppState, useAppDispatch } from '../store'
import { COMPONENT_EDITABLE_PROPS } from '../types'
import type { ComponentNode, EditableProperty } from '../types'
import { generateScreen } from '../services/api'
import { v4 as uuid } from 'uuid'

// ─── Helpers ───

function findNode(tree: ComponentNode, id: string): ComponentNode | null {
  if (tree.id === id) return tree
  if (tree.children) {
    for (const child of tree.children) {
      const found = findNode(child, id)
      if (found) return found
    }
  }
  return null
}

function findParent(tree: ComponentNode, id: string): ComponentNode | null {
  if (tree.children) {
    for (const child of tree.children) {
      if (child.id === id) return tree
      const found = findParent(child, id)
      if (found) return found
    }
  }
  return null
}

function getNodeLabel(node: ComponentNode): string {
  return node.properties.Text
    || node.properties.Content
    || node.properties.Header
    || node.properties.PlaceholderText
    || node.properties.DisplayName
    || node.type
}

const CONTAINER_TYPES = new Set([
  'Page', 'StackPanel', 'Grid', 'ScrollViewer', 'Border', 'Card', 'ListView', 'GridView',
])

const TYPE_COLORS: Record<string, string> = {
  Page: 'bg-blue-500/20 text-blue-400',
  StackPanel: 'bg-violet-500/20 text-violet-400',
  Grid: 'bg-violet-500/20 text-violet-400',
  ScrollViewer: 'bg-violet-500/20 text-violet-400',
  TextBlock: 'bg-emerald-500/20 text-emerald-400',
  Button: 'bg-sky-500/20 text-sky-400',
  TextBox: 'bg-amber-500/20 text-amber-400',
  PasswordBox: 'bg-amber-500/20 text-amber-400',
  Image: 'bg-pink-500/20 text-pink-400',
  Card: 'bg-indigo-500/20 text-indigo-400',
  Border: 'bg-gray-500/20 text-gray-400',
  Icon: 'bg-cyan-500/20 text-cyan-400',
  NavigationBar: 'bg-teal-500/20 text-teal-400',
  BottomNavigationBar: 'bg-teal-500/20 text-teal-400',
  Divider: 'bg-gray-500/20 text-gray-400',
}

const PROP_TOOLTIPS: Record<string, string> = {
  Text: 'The visible text content',
  Content: 'The label or content displayed',
  Header: 'Field label shown above the input',
  Style: 'Visual style variant',
  Foreground: 'Text or icon color',
  Background: 'Background fill color',
  HorizontalAlignment: 'Horizontal positioning within parent',
  Orientation: 'Layout direction for children',
  Spacing: 'Space between child elements (px)',
  Padding: 'Inner spacing (e.g. "16" or "16,8")',
  PlaceholderText: 'Hint text shown when empty',
  IsEnabled: 'Whether the element is interactive',
  IsOn: 'Toggle switch state',
  IsChecked: 'Checkbox or radio selection state',
  Source: 'URL for the image source',
  Width: 'Element width in pixels',
  Height: 'Element height in pixels',
  Stretch: 'How the image fills its container',
  Minimum: 'Minimum slider value',
  Maximum: 'Maximum slider value',
  Value: 'Current value',
  CornerRadius: 'Border rounding in pixels',
  Glyph: 'Material icon name',
  FontSize: 'Text size in pixels',
  DisplayName: 'Name shown in avatar',
  MainCommand: 'Navigation bar leading button',
  RowSpacing: 'Vertical gap between grid rows',
  ColumnSpacing: 'Horizontal gap between grid columns',
  IsIndeterminate: 'Show indeterminate animation',
  IsActive: 'Whether the ring is animating',
  Icon: 'Icon name for navigation item',
}

// ─── Tooltip Wrapper ───

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

// ─── Property Field ───

interface PropertyFieldProps {
  prop: EditableProperty
  value: string
  onChange: (key: string, value: string) => void
  tokenColors?: string[]
}

function PropertyField({ prop, value, onChange, tokenColors }: PropertyFieldProps) {
  const tooltip = PROP_TOOLTIPS[prop.key] || prop.label

  const label = (
    <Tip title={tooltip}>
      <label className="text-[11px] text-studio-text-dim font-medium uppercase tracking-wider cursor-help">
        {prop.label}
      </label>
    </Tip>
  )

  switch (prop.type) {
    case 'text':
      return (
        <div className="space-y-1">
          {label}
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(prop.key, e.target.value)}
            className="w-full bg-studio-surface-2 border border-studio-border rounded-lg px-2.5 py-1.5 text-sm text-studio-text focus:outline-none focus:border-studio-accent/50 transition-colors"
          />
        </div>
      )

    case 'number':
      return (
        <div className="space-y-1">
          {label}
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(prop.key, e.target.value)}
            className="w-full bg-studio-surface-2 border border-studio-border rounded-lg px-2.5 py-1.5 text-sm text-studio-text focus:outline-none focus:border-studio-accent/50 transition-colors"
          />
        </div>
      )

    case 'color':
      return (
        <div className="space-y-1.5">
          {label}
          <div className="flex gap-2">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(prop.key, e.target.value)}
              className="w-8 h-8 rounded border border-studio-border cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(prop.key, e.target.value)}
              placeholder="#000000"
              className="flex-1 bg-studio-surface-2 border border-studio-border rounded-lg px-2.5 py-1.5 text-sm text-studio-text font-mono focus:outline-none focus:border-studio-accent/50 transition-colors"
            />
          </div>
          {tokenColors && tokenColors.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tokenColors.map((c) => (
                <Tip key={c} title={c}>
                  <button
                    onClick={() => onChange(prop.key, c)}
                    className={`w-5 h-5 rounded border transition-all ${
                      value?.toUpperCase() === c.toUpperCase()
                        ? 'border-studio-accent ring-1 ring-studio-accent scale-110'
                        : 'border-studio-border hover:border-studio-text-dim'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                </Tip>
              ))}
            </div>
          )}
        </div>
      )

    case 'select':
      return (
        <div className="space-y-1">
          {label}
          <select
            value={value || ''}
            onChange={(e) => onChange(prop.key, e.target.value)}
            className="w-full bg-studio-surface-2 border border-studio-border rounded-lg px-2.5 py-1.5 text-sm text-studio-text focus:outline-none focus:border-studio-accent/50 transition-colors"
          >
            <option value="">Default</option>
            {prop.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )

    case 'boolean':
      return (
        <div className="flex items-center justify-between">
          {label}
          <button
            onClick={() => onChange(prop.key, value === 'True' ? 'False' : 'True')}
            className={`w-9 h-5 rounded-full transition-colors relative ${
              value === 'True' ? 'bg-studio-accent' : 'bg-studio-surface-3'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-full bg-studio-surface border border-studio-border absolute top-[3px] transition-transform ${
              value === 'True' ? 'translate-x-[18px]' : 'translate-x-[3px]'
            }`} />
          </button>
        </div>
      )

    default:
      return null
  }
}

// ─── Children List Item ───

interface ChildItemProps {
  child: ComponentNode
  index: number
  isDragging: boolean
  isDragOver: boolean
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
  onDrop: (e: React.DragEvent) => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

function ChildItem({
  child, index, isDragging, isDragOver,
  onDragStart, onDragOver, onDragEnd, onDrop,
  onSelect, onDelete,
}: ChildItemProps) {
  const label = getNodeLabel(child)
  const colorClass = TYPE_COLORS[child.type] || 'bg-gray-500/20 text-gray-400'

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      className={`flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg transition-all cursor-grab active:cursor-grabbing group ${
        isDragging ? 'opacity-30' : ''
      } ${isDragOver ? 'border-t-2 border-studio-accent' : 'border-t-2 border-transparent'}`}
    >
      <GripVertical size={12} className="text-studio-text-dim flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />

      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${colorClass} flex-shrink-0`}>
        {child.type.length > 8 ? child.type.slice(0, 7) + '.' : child.type}
      </span>

      <span className="text-xs text-studio-text-muted truncate flex-1 min-w-0">
        {label !== child.type ? label : ''}
      </span>

      <Tip title="Select this element">
        <button
          onClick={() => onSelect(child.id)}
          className="p-0.5 rounded text-studio-text-dim hover:text-studio-accent hover:bg-studio-accent/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
        >
          <ChevronRight size={12} />
        </button>
      </Tip>

      <Tip title="Delete element">
        <button
          onClick={() => onDelete(child.id)}
          className="p-0.5 rounded text-studio-text-dim hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
        >
          <Trash2 size={11} />
        </button>
      </Tip>
    </div>
  )
}

// ─── Component Tree Browser ───

function ComponentTreeNode({ node, depth, onSelect }: { node: ComponentNode; depth: number; onSelect: (id: string) => void }) {
  const [collapsed, setCollapsed] = useState(depth > 1)
  const hasChildren = Boolean(node.children && node.children.length > 0)
  const colorClass = TYPE_COLORS[node.type] || 'bg-gray-500/20 text-gray-400'
  const label = getNodeLabel(node)

  return (
    <div>
      <div
        className="flex items-center gap-1.5 py-1 rounded-md hover:bg-studio-surface-3 cursor-pointer group transition-colors"
        style={{ paddingLeft: `${8 + depth * 14}px`, paddingRight: 8 }}
        onClick={() => onSelect(node.id)}
      >
        <button
          onClick={(e) => { e.stopPropagation(); if (hasChildren) setCollapsed(c => !c) }}
          className="w-3 h-3 flex items-center justify-center text-studio-text-dim flex-shrink-0"
        >
          {hasChildren && (
            <svg width="7" height="7" viewBox="0 0 8 8" fill="currentColor">
              {collapsed ? <polygon points="2,1 7,4 2,7" /> : <polygon points="1,2 7,2 4,7" />}
            </svg>
          )}
        </button>
        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 ${colorClass}`}>
          {node.type.length > 9 ? node.type.slice(0, 8) + '…' : node.type}
        </span>
        <span className="text-xs text-studio-text-muted truncate flex-1 min-w-0">
          {label !== node.type ? label : ''}
        </span>
        <ChevronRight size={10} className="text-studio-text-dim opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" />
      </div>
      {!collapsed && hasChildren && node.children!.map(child => (
        <ComponentTreeNode key={child.id} node={child} depth={depth + 1} onSelect={onSelect} />
      ))}
    </div>
  )
}

// ─── Main Component ───

export default function PropertyEditor() {
  const { currentTree, selectedComponentId, designTokens, designBrief, qualityToggles } = useAppState()
  const dispatch = useAppDispatch()

  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [addPrompt, setAddPrompt] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const addInputRef = useRef<HTMLInputElement>(null)

  // Token colors for quick-pick swatches
  const tokenColors = [
    designTokens.colors.primary,
    designTokens.colors.secondary,
    designTokens.colors.tertiary,
    designTokens.colors.error,
    designTokens.colors.onSurface,
    designTokens.colors.onSurfaceVariant,
    designTokens.colors.outline,
    designTokens.colors.surface,
    designTokens.colors.surfaceVariant,
    designTokens.colors.background,
  ].filter((c, i, arr) => arr.indexOf(c) === i) // dedupe

  // ─── Empty state ───
  if (!currentTree || !selectedComponentId) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 py-2.5 border-b border-studio-border flex-shrink-0">
          <h2 className="text-xs font-semibold text-studio-text-muted uppercase tracking-wider">Components</h2>
        </div>
        {currentTree ? (
          <>
            <div className="px-3 py-1.5 border-b border-studio-border flex-shrink-0">
              <p className="text-[10px] text-studio-text-dim">Select a component to edit — changes update XAML output instantly.</p>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              <ComponentTreeNode
                node={currentTree}
                depth={0}
                onSelect={(id) => dispatch({ type: 'SELECT_COMPONENT', id })}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-studio-surface-3 mx-auto mb-3 flex items-center justify-center">
                <ChevronRight size={18} className="text-studio-text-dim" />
              </div>
              <p className="text-xs text-studio-text-dim leading-relaxed">Generate a screen to see components</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  const node = findNode(currentTree, selectedComponentId)
  if (!node) return null

  const parent = findParent(currentTree, selectedComponentId)
  const isRoot = currentTree.id === selectedComponentId
  const editableProps = COMPONENT_EDITABLE_PROPS[node.type] || []
  const hasChildren = node.children && node.children.length > 0
  const isContainer = CONTAINER_TYPES.has(node.type)
  const colorClass = TYPE_COLORS[node.type] || 'bg-gray-500/20 text-gray-400'

  const handleChange = (key: string, value: string) => {
    dispatch({ type: 'UPDATE_COMPONENT', id: node.id, properties: { [key]: value } })
  }

  const handleDelete = () => {
    if (isRoot) return
    dispatch({ type: 'DELETE_COMPONENT', id: node.id })
  }

  const handleDeleteChild = (childId: string) => {
    dispatch({ type: 'DELETE_COMPONENT', id: childId })
  }

  const handleSelectChild = (childId: string) => {
    dispatch({ type: 'SELECT_COMPONENT', id: childId })
  }

  const handleSelectParent = () => {
    if (parent) {
      dispatch({ type: 'SELECT_COMPONENT', id: parent.id })
    }
  }

  // ─── Drag and Drop ───
  const handleDragStart = (index: number) => setDragIndex(index)
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }
  const handleDragEnd = () => {
    setDragIndex(null)
    setDragOverIndex(null)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      dispatch({
        type: 'REORDER_CHILDREN',
        parentId: node.id,
        fromIndex: dragIndex,
        toIndex: dragOverIndex,
      })
    }
    setDragIndex(null)
    setDragOverIndex(null)
  }

  // ─── Add Component via AI ───
  const handleAddComponent = async () => {
    const trimmed = addPrompt.trim()
    if (!trimmed || isAdding) return
    setIsAdding(true)
    setAddError('')
    try {
      const result = await generateScreen({
        prompt: `Generate a single component: ${trimmed}. Return only the component, not a full page.`,
        designTokens,
        designBrief,
        currentTree: null,
        qualityToggles,
      })
      const newChild = result.tree.children?.[0] || result.tree
      const reIdChild = { ...newChild, id: uuid() }
      dispatch({ type: 'ADD_CHILD', parentId: node.id, child: reIdChild })
      setAddPrompt('')
    } catch {
      setAddError('Could not generate that element. Try rephrasing.')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* ─── A. Header ─── */}
      <div className="px-3 py-2.5 border-b border-studio-border">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 ${colorClass}`}>
              {node.type}
            </span>
            {parent && (
              <Tip title="Select parent element">
                <button
                  onClick={handleSelectParent}
                  className="text-[10px] text-studio-text-dim hover:text-studio-accent font-mono truncate transition-colors"
                >
                  in {parent.type}
                </button>
              </Tip>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {!isRoot && (
              <Tip title="Delete this element">
                <button
                  onClick={handleDelete}
                  className="p-1 rounded text-studio-text-dim hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </Tip>
            )}
            <Tip title="Deselect">
              <button
                onClick={() => dispatch({ type: 'SELECT_COMPONENT', id: null })}
                className="p-1 rounded text-studio-text-dim hover:text-studio-text hover:bg-studio-surface-3 transition-colors"
              >
                <X size={13} />
              </button>
            </Tip>
          </div>
        </div>
        <span className="text-[10px] text-studio-text-dim font-mono">{node.id.slice(0, 8)}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ─── B. Properties ─── */}
        <div className="p-3 space-y-3">
          {editableProps.length === 0 ? (
            <p className="text-[11px] text-studio-text-dim">This is a layout container. Select a child element to edit its content.</p>
          ) : (
            editableProps.map((prop) => (
              <PropertyField
                key={prop.key}
                prop={prop}
                value={node.properties[prop.key] || ''}
                onChange={handleChange}
                tokenColors={prop.type === 'color' ? tokenColors : undefined}
              />
            ))
          )}

          {/* Canvas position fields */}
          {(node.properties['Canvas.Left'] !== undefined || node.properties['Canvas.Top'] !== undefined) && (
            <div className="pt-2 border-t border-studio-border space-y-3">
              <p className="text-[10px] font-semibold text-studio-text-dim uppercase tracking-wider">Position</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Tip title="Horizontal position on canvas">
                    <label className="text-[11px] text-studio-text-dim font-medium uppercase tracking-wider cursor-help">X</label>
                  </Tip>
                  <input
                    type="number"
                    value={node.properties['Canvas.Left'] || '0'}
                    onChange={(e) => handleChange('Canvas.Left', e.target.value)}
                    className="w-full bg-studio-surface-2 border border-studio-border rounded-lg px-2.5 py-1.5 text-sm text-studio-text focus:outline-none focus:border-studio-accent/50 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <Tip title="Vertical position on canvas">
                    <label className="text-[11px] text-studio-text-dim font-medium uppercase tracking-wider cursor-help">Y</label>
                  </Tip>
                  <input
                    type="number"
                    value={node.properties['Canvas.Top'] || '0'}
                    onChange={(e) => handleChange('Canvas.Top', e.target.value)}
                    className="w-full bg-studio-surface-2 border border-studio-border rounded-lg px-2.5 py-1.5 text-sm text-studio-text focus:outline-none focus:border-studio-accent/50 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── C. Children List ─── */}
        {hasChildren && (
          <div className="border-t border-studio-border">
            <div className="px-3 pt-2.5 pb-1.5">
              <p className="text-[10px] font-semibold text-studio-text-dim uppercase tracking-wider">
                Children ({node.children!.length})
              </p>
            </div>
            <div className="px-2 pb-2">
              {node.children!.map((child, i) => (
                <ChildItem
                  key={child.id}
                  child={child}
                  index={i}
                  isDragging={dragIndex === i}
                  isDragOver={dragOverIndex === i && dragIndex !== i}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  onSelect={handleSelectChild}
                  onDelete={handleDeleteChild}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── D. Add Component ─── */}
        {isContainer && (
          <div className="border-t border-studio-border p-3">
            <p className="text-[10px] font-semibold text-studio-text-dim uppercase tracking-wider mb-2">
              Add Element
            </p>
            <div className="relative">
              <input
                ref={addInputRef}
                type="text"
                value={addPrompt}
                onChange={(e) => setAddPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddComponent() }}
                placeholder='e.g. "Save button" or "Email field"'
                disabled={isAdding}
                className="w-full bg-studio-surface-2 border border-studio-border rounded-lg pl-3 pr-9 py-2 text-xs text-studio-text placeholder-studio-text-dim focus:outline-none focus:border-studio-accent/50 transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleAddComponent}
                disabled={!addPrompt.trim() || isAdding}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-md bg-studio-accent text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-studio-accent-hover transition-colors"
              >
                {isAdding ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              </button>
            </div>
            {isAdding && (
              <div className="flex items-center gap-2 mt-2 px-2 py-1.5 rounded-lg bg-studio-accent/5 border border-studio-accent/15">
                <Loader2 size={10} className="text-studio-accent animate-spin flex-shrink-0" />
                <p className="text-[10px] text-studio-accent">
                  AI is building your element...
                </p>
              </div>
            )}
            {addError && (
              <p className="text-[10px] text-red-400 mt-1.5">{addError}</p>
            )}
          </div>
        )}

        {/* Leaf nodes — no extra noise */}
      </div>
    </div>
  )
}
