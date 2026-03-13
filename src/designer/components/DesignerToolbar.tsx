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
  const { viewport, projectName, artboards } = state
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(projectName)
  const [showPresets, setShowPresets] = useState(false)

  const addArtboard = (width = 390, height = 844) => {
    const GRID_COLS = 5
    const idx = artboards.length
    const x = 100 + (idx % GRID_COLS) * 450
    const y = 100 + Math.floor(idx / GRID_COLS) * 1060

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
    // Find bounding box of all artboards
    const minX = Math.min(...artboards.map(a => a.x))
    const minY = Math.min(...artboards.map(a => a.y))
    const maxX = Math.max(...artboards.map(a => a.x + a.width))
    const maxY = Math.max(...artboards.map(a => a.y + a.height))
    const contentW = maxX - minX + 200
    const contentH = maxY - minY + 200

    // Estimate available canvas area (toolbar=44, panels take ~620px)
    const canvasW = window.innerWidth - 620
    const canvasH = window.innerHeight - 44
    const zoom = Math.min(canvasW / contentW, canvasH / contentH, 1)

    const panX = (canvasW / 2) - ((minX + maxX) / 2) * zoom
    const panY = (canvasH / 2) - ((minY + maxY) / 2) * zoom

    dispatch({ type: 'SET_VIEWPORT', viewport: { panX, panY, zoom } })
  }

  return (
    <div className="h-11 bg-[#111114] border-b border-white/[0.06] flex items-center px-3 gap-3 flex-shrink-0">
      {/* Back */}
      <Link
        to="/"
        className="text-white/30 hover:text-white/60 transition-colors p-1"
        title="Back to studio"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </Link>

      {/* Divider */}
      <div className="w-px h-5 bg-white/[0.06]" />

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
          className="bg-transparent text-[13px] text-white/90 outline-none border-b border-[#0A3EFF]/50 px-1 py-0.5 w-48"
        />
      ) : (
        <button
          onClick={() => { setNameValue(projectName); setEditingName(true) }}
          className="text-[13px] text-white/70 hover:text-white/90 transition-colors truncate max-w-[200px]"
        >
          {projectName}
        </button>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => zoomTo(Math.max(0.1, viewport.zoom / 1.2))}
          className="text-white/30 hover:text-white/60 p-1 rounded hover:bg-white/[0.05] transition-colors"
          title="Zoom out"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={() => zoomTo(1)}
          className="text-[11px] text-white/40 hover:text-white/60 px-2 py-1 rounded hover:bg-white/[0.05] transition-colors font-mono min-w-[44px] text-center"
          title="Reset zoom to 100%"
        >
          {Math.round(viewport.zoom * 100)}%
        </button>
        <button
          onClick={() => zoomTo(Math.min(3, viewport.zoom * 1.2))}
          className="text-white/30 hover:text-white/60 p-1 rounded hover:bg-white/[0.05] transition-colors"
          title="Zoom in"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={fitToScreen}
          className="text-white/30 hover:text-white/60 p-1 rounded hover:bg-white/[0.05] transition-colors ml-1"
          title="Fit to screen"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M21 16v3a2 2 0 01-2 2h-3M3 16v3a2 2 0 002 2h3" />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-white/[0.06]" />

      {/* Add artboard */}
      <div className="relative">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="flex items-center gap-1.5 text-[12px] text-white/50 hover:text-white/80 px-2.5 py-1.5 rounded hover:bg-white/[0.05] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Artboard
        </button>

        {showPresets && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowPresets(false)} />
            <div className="absolute right-0 top-full mt-1 bg-[#1a1a1e] border border-white/[0.08] rounded-md shadow-xl z-20 py-1 min-w-[160px]">
              {DEVICE_PRESETS.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => addArtboard(preset.width, preset.height)}
                  className="w-full text-left px-3 py-2 text-[12px] text-white/60 hover:text-white/90 hover:bg-white/[0.05] transition-colors flex items-center justify-between"
                >
                  <span>{preset.label}</span>
                  <span className="text-[10px] text-white/20 font-mono">{preset.width}×{preset.height}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
