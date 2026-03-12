import { useRef, useCallback, useEffect, useState } from 'react'
import { useDesigner } from '../designer-store'
import Artboard from './Artboard'

export default function Canvas() {
  const { state, dispatch } = useDesigner()
  const { artboards, selectedArtboardId, viewport } = state

  const containerRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [spaceHeld, setSpaceHeld] = useState(false)
  const panStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)

  // Pan: spacebar + drag or middle mouse
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Middle mouse button or spacebar held
    if (e.button === 1 || (e.button === 0 && spaceHeld)) {
      e.preventDefault()
      setIsPanning(true)
      panStart.current = {
        x: e.clientX,
        y: e.clientY,
        panX: viewport.panX,
        panY: viewport.panY,
      }
    }
    // Click on canvas background = deselect
    if (e.button === 0 && !spaceHeld && e.target === containerRef.current) {
      dispatch({ type: 'SELECT_ARTBOARD', id: null })
    }
  }, [spaceHeld, viewport.panX, viewport.panY, dispatch])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning || !panStart.current) return
    const dx = e.clientX - panStart.current.x
    const dy = e.clientY - panStart.current.y
    dispatch({
      type: 'SET_VIEWPORT',
      viewport: {
        panX: panStart.current.panX + dx,
        panY: panStart.current.panY + dy,
      },
    })
  }, [isPanning, dispatch])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
    panStart.current = null
  }, [])

  // Two-finger scroll = pan, pinch (ctrlKey) = zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()

    if (e.ctrlKey || e.metaKey) {
      // Pinch-to-zoom on trackpad (macOS sends ctrlKey=true for pinch)
      // or Ctrl+scroll on mouse
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const cursorX = e.clientX - rect.left
      const cursorY = e.clientY - rect.top

      const zoomFactor = e.deltaY < 0 ? 1.04 : 1 / 1.04
      const newZoom = Math.min(3, Math.max(0.1, viewport.zoom * zoomFactor))

      // Zoom toward cursor position
      const newPanX = cursorX - (cursorX - viewport.panX) * (newZoom / viewport.zoom)
      const newPanY = cursorY - (cursorY - viewport.panY) * (newZoom / viewport.zoom)

      dispatch({
        type: 'SET_VIEWPORT',
        viewport: { zoom: newZoom, panX: newPanX, panY: newPanY },
      })
    } else {
      // Two-finger scroll = pan
      dispatch({
        type: 'SET_VIEWPORT',
        viewport: {
          panX: viewport.panX - e.deltaX,
          panY: viewport.panY - e.deltaY,
        },
      })
    }
  }, [viewport, dispatch])

  // Spacebar for pan mode
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        setSpaceHeld(true)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpaceHeld(false)
        setIsPanning(false)
        panStart.current = null
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  // Global mouseup for pan release
  useEffect(() => {
    const onUp = () => {
      setIsPanning(false)
      panStart.current = null
    }
    window.addEventListener('mouseup', onUp)
    return () => window.removeEventListener('mouseup', onUp)
  }, [])

  const cursor = isPanning ? 'grabbing' : spaceHeld ? 'grab' : 'default'

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden"
      style={{
        background: '#1a1a1e',
        cursor,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
        backgroundPosition: `${viewport.panX}px ${viewport.panY}px`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Transform layer */}
      <div
        style={{
          transform: `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {artboards.map(artboard => (
          <Artboard
            key={artboard.id}
            artboard={artboard}
            isSelected={artboard.id === selectedArtboardId}
            onSelect={() => dispatch({ type: 'SELECT_ARTBOARD', id: artboard.id })}
          />
        ))}
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 text-[11px] text-white/30 font-mono select-none pointer-events-none">
        {Math.round(viewport.zoom * 100)}%
      </div>

      {/* Empty state */}
      {artboards.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-white/20">
            <div className="text-[14px] font-medium mb-1">No artboards yet</div>
            <div className="text-[12px]">Click "+ Artboard" or ask the AI to create a screen</div>
          </div>
        </div>
      )}
    </div>
  )
}
