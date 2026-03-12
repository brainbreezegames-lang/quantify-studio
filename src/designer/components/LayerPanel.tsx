import { useState } from 'react'
import { useDesigner } from '../designer-store'

export default function LayerPanel() {
  const { state, dispatch } = useDesigner()
  const { artboards, selectedArtboardId } = state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const startRename = (id: string, currentName: string) => {
    setEditingId(id)
    setEditValue(currentName)
  }

  const commitRename = () => {
    if (editingId && editValue.trim()) {
      dispatch({ type: 'UPDATE_ARTBOARD', id: editingId, updates: { name: editValue.trim() } })
    }
    setEditingId(null)
  }

  return (
    <div className="flex flex-col h-full bg-[#111114] border-r border-white/[0.06]" style={{ width: 240 }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="text-[13px] font-semibold text-white/90">Layers</div>
        <div className="text-[11px] text-white/30 mt-0.5">{artboards.length} artboard{artboards.length !== 1 ? 's' : ''}</div>
      </div>

      {/* Artboard list */}
      <div className="flex-1 overflow-y-auto py-1">
        {artboards.length === 0 && (
          <div className="px-4 py-8 text-center text-[11px] text-white/20">
            No artboards yet
          </div>
        )}

        {artboards.map(artboard => (
          <div
            key={artboard.id}
            className={`group flex items-center gap-2 px-3 py-1.5 mx-1 rounded cursor-pointer transition-colors ${
              artboard.id === selectedArtboardId
                ? 'bg-[#0A3EFF]/15 text-white/90'
                : 'text-white/50 hover:bg-white/[0.04] hover:text-white/70'
            }`}
            onClick={() => dispatch({ type: 'SELECT_ARTBOARD', id: artboard.id })}
            onDoubleClick={() => startRename(artboard.id, artboard.name)}
          >
            {/* Artboard icon */}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 opacity-40">
              <rect x="2" y="2" width="12" height="12" rx="1" />
            </svg>

            {/* Name */}
            {editingId === artboard.id ? (
              <input
                autoFocus
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={commitRename}
                onKeyDown={e => {
                  if (e.key === 'Enter') commitRename()
                  if (e.key === 'Escape') setEditingId(null)
                }}
                className="flex-1 bg-transparent text-[12px] text-white/90 outline-none border-b border-[#0A3EFF]/50 py-0.5"
              />
            ) : (
              <span className="flex-1 text-[12px] truncate">{artboard.name}</span>
            )}

            {/* Dimensions */}
            <span className="text-[9px] text-white/20 font-mono flex-shrink-0">
              {artboard.width}×{artboard.height}
            </span>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                dispatch({ type: 'DELETE_ARTBOARD', id: artboard.id })
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 text-white/30 hover:text-red-400 transition-all flex-shrink-0"
              title="Delete artboard"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
