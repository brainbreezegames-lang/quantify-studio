import { useState } from 'react'
import { useDesigner } from '../designer-store'

export default function LayerPanel() {
  const { state, dispatch } = useDesigner()
  const { artboards, selectedArtboardId, editMode, rightPanel } = state
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

  const selectedArtboard = artboards.find(a => a.id === selectedArtboardId)

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
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 opacity-40">
              <rect x="2" y="2" width="12" height="12" rx="1" />
            </svg>

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

            <span className="text-[9px] text-white/20 font-mono flex-shrink-0">
              {artboard.width}×{artboard.height}
            </span>

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

      {/* Bottom toolbar — Edit mode + Code view */}
      {selectedArtboard && selectedArtboard.html && (
        <div className="flex-shrink-0 border-t border-white/[0.06] px-3 py-2 flex items-center gap-1.5">
          {/* Edit mode toggle */}
          <button
            onClick={() => dispatch({ type: 'SET_EDIT_MODE', value: !editMode })}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-[11px] font-medium transition-all ${
              editMode
                ? 'bg-[#0A3EFF]/20 text-[#0A3EFF] ring-1 ring-[#0A3EFF]/30'
                : 'bg-white/[0.04] text-white/40 hover:text-white/60 hover:bg-white/[0.06]'
            }`}
            title={editMode ? 'Exit edit mode' : 'Edit elements'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            {editMode ? 'Editing' : 'Edit'}
          </button>

          {/* Code view toggle */}
          <button
            onClick={() => dispatch({ type: 'SET_RIGHT_PANEL', panel: rightPanel === 'code' ? 'chat' : 'code' })}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-[11px] font-medium transition-all ${
              rightPanel === 'code'
                ? 'bg-[#0A3EFF]/20 text-[#0A3EFF] ring-1 ring-[#0A3EFF]/30'
                : 'bg-white/[0.04] text-white/40 hover:text-white/60 hover:bg-white/[0.06]'
            }`}
            title="View HTML code"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Code
          </button>
        </div>
      )}
    </div>
  )
}
