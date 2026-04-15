import { useState } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { useDesigner } from '../designer-store'

const DEVICE_PRESETS = [
  { label: 'Phone', width: 390, height: 844 },
  { label: 'Tablet', width: 768, height: 1024 },
  { label: 'Desktop', width: 1280, height: 800 },
] as const

export default function DesignerToolbar() {
  const { state, dispatch } = useDesigner()
  const { viewport, projectName, artboards, isGenerating } = state
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(projectName)
  const [showPresets, setShowPresets] = useState(false)

  const addArtboard = (width = 390, height = 844) => {
    const GRID_COLS = 5
    const idx = artboards.length
    const x = 100 + (idx % GRID_COLS) * 450
    const y = 100 + Math.floor(idx / GRID_COLS) * 960

    dispatch({
      type: 'CREATE_ARTBOARD',
      artboard: {
        id: uuid(),
        name: `Artboard ${artboards.length + 1}`,
        x,
        y,
        width,
        height,
        html: '',
        css: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    })
    setShowPresets(false)
  }

  const commitName = () => {
    if (nameValue.trim()) {
      dispatch({ type: 'SET_PROJECT_NAME', name: nameValue.trim() })
    }
    setEditingName(false)
  }

  const zoomTo = (level: number) => {
    dispatch({ type: 'SET_VIEWPORT', viewport: { zoom: level } })
  }

  const fitToScreen = () => {
    if (artboards.length === 0) {
      dispatch({ type: 'SET_VIEWPORT', viewport: { panX: 0, panY: 0, zoom: 0.7 } })
      return
    }
    const minX = Math.min(...artboards.map(a => a.x))
    const minY = Math.min(...artboards.map(a => a.y))
    const maxX = Math.max(...artboards.map(a => a.x + a.width))
    const maxY = Math.max(...artboards.map(a => a.y + a.height))
    const contentW = maxX - minX + 200
    const contentH = maxY - minY + 200

    const canvasW = window.innerWidth - 520
    const canvasH = window.innerHeight - 40
    const zoom = Math.min(canvasW / contentW, canvasH / contentH, 1)

    const panX = (canvasW / 2) - ((minX + maxX) / 2) * zoom
    const panY = (canvasH / 2) - ((minY + maxY) / 2) * zoom

    dispatch({ type: 'SET_VIEWPORT', viewport: { panX, panY, zoom } })
  }

  return (
    <div className="flex-shrink-0 flex items-center px-2 gap-2" style={{ height: 40, background: '#0c0c0f', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      {/* Back */}
      <Link
        to="/"
        className="text-white/25 hover:text-white/50 transition-colors p-1"
        title="Back to studio"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </Link>

      {/* Project name */}
      {editingName ? (
        <input
          autoFocus
          value={nameValue}
          onChange={e => setNameValue(e.target.value)}
          onBlur={commitName}
          onKeyDown={e => {
            if (e.key === 'Enter') commitName()
            if (e.key === 'Escape') { setNameValue(projectName); setEditingName(false) }
          }}
          className="bg-transparent text-[12px] text-white/85 outline-none border-b border-[#0A3EFF]/40 px-1 py-0.5 w-40"
        />
      ) : (
        <button
          onClick={() => { setNameValue(projectName); setEditingName(true) }}
          className="text-[12px] text-white/55 hover:text-white/80 transition-colors truncate max-w-[180px]"
        >
          {projectName}
        </button>
      )}

      {/* Generation indicator in toolbar */}
      {isGenerating && (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(10,62,255,0.1)' }}>
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: '#0A3EFF',
              boxShadow: '0 0 6px #0A3EFF',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          <span className="text-[9px] text-[#4d7fff] font-medium">Generating</span>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Zoom controls */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => zoomTo(Math.max(0.1, viewport.zoom / 1.2))}
          className="text-white/25 hover:text-white/50 p-1 rounded hover:bg-white/[0.04] transition-colors"
          title="Zoom out"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={() => zoomTo(1)}
          className="text-[10px] text-white/30 hover:text-white/50 px-1.5 py-0.5 rounded hover:bg-white/[0.04] transition-colors font-mono min-w-[38px] text-center"
          title="Reset zoom"
        >
          {Math.round(viewport.zoom * 100)}%
        </button>
        <button
          onClick={() => zoomTo(Math.min(3, viewport.zoom * 1.2))}
          className="text-white/25 hover:text-white/50 p-1 rounded hover:bg-white/[0.04] transition-colors"
          title="Zoom in"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={fitToScreen}
          className="text-white/25 hover:text-white/50 p-1 rounded hover:bg-white/[0.04] transition-colors ml-0.5"
          title="Fit to screen"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M21 16v3a2 2 0 01-2 2h-3M3 16v3a2 2 0 002 2h3" />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-white/[0.04]" />

      {/* Add artboard */}
      <div className="relative">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="flex items-center gap-1 text-[10px] text-white/35 hover:text-white/60 px-2 py-1 rounded hover:bg-white/[0.04] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add
        </button>

        {showPresets && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowPresets(false)} />
            <div className="absolute right-0 top-full mt-1 bg-[#141418] border border-white/[0.06] rounded-md shadow-2xl z-20 py-0.5 min-w-[140px]">
              {DEVICE_PRESETS.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => addArtboard(preset.width, preset.height)}
                  className="w-full text-left px-2.5 py-1.5 text-[10px] text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-colors flex items-center justify-between"
                >
                  <span>{preset.label}</span>
                  <span className="text-[9px] text-white/15 font-mono">{preset.width}x{preset.height}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pulse animation */}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  )
}
