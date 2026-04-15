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
    <div className="flex flex-col h-full" style={{ width: 200, background: '#0e0e11', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
      {/* Header */}
      <div className="px-3 py-2 flex-shrink-0 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="text-[11px] font-medium text-white/50">Layers</span>
        <span className="text-[9px] text-white/20 font-mono">{artboards.length}</span>
      </div>

      {/* Artboard list */}
      <div className="flex-1 overflow-y-auto py-0.5">
        {artboards.length === 0 && (
          <div className="px-3 py-6 text-center text-[10px] text-white/15">
            No artboards
          </div>
        )}

        {artboards.map(artboard => (
          <div
            key={artboard.id}
            className={`group flex items-center gap-1.5 px-2 py-[5px] mx-0.5 rounded cursor-pointer transition-colors ${
              artboard.id === selectedArtboardId
                ? 'bg-[#0A3EFF]/10 text-white/80'
                : 'text-white/40 hover:bg-white/[0.03] hover:text-white/60'
            }`}
            onClick={() => dispatch({ type: 'SELECT_ARTBOARD', id: artboard.id })}
            onDoubleClick={() => startRename(artboard.id, artboard.name)}
          >
            {/* Status dot */}
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: artboard.html ? (artboard.id === selectedArtboardId ? '#0A3EFF' : '#22C55E') : 'rgba(255,255,255,0.1)',
              }}
            />

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
                className="flex-1 bg-transparent text-[10px] text-white/80 outline-none border-b border-[#0A3EFF]/40 py-0.5 min-w-0"
              />
            ) : (
              <span className="flex-1 text-[10px] truncate">{artboard.name}</span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation()
                dispatch({ type: 'DELETE_ARTBOARD', id: artboard.id })
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 text-white/20 hover:text-red-400 transition-all flex-shrink-0"
              title="Delete"
            >
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Bottom toolbar */}
      {selectedArtboard && selectedArtboard.html && (
        <div className="flex-shrink-0 px-2 py-1.5 flex items-center gap-1" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <button
            onClick={() => dispatch({ type: 'SET_EDIT_MODE', value: !editMode })}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[9px] font-medium transition-all ${
              editMode
                ? 'bg-[#0A3EFF]/15 text-[#4d7fff]'
                : 'text-white/30 hover:text-white/50 hover:bg-white/[0.04]'
            }`}
            title={editMode ? 'Exit edit mode' : 'Edit elements'}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            {editMode ? 'Editing' : 'Edit'}
          </button>

          <button
            onClick={() => dispatch({ type: 'SET_RIGHT_PANEL', panel: rightPanel === 'code' ? 'chat' : 'code' })}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[9px] font-medium transition-all ${
              rightPanel === 'code'
                ? 'bg-[#0A3EFF]/15 text-[#4d7fff]'
                : 'text-white/30 hover:text-white/50 hover:bg-white/[0.04]'
            }`}
            title="View code"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
