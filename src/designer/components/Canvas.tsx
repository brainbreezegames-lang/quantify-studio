import { useRef, useCallback, useEffect, useState } from 'react'
import { useDesigner } from '../designer-store'
import Artboard from './Artboard'

export default function Canvas() {
  const { state, dispatch } = useDesigner()
  const { artboards, selectedArtboardId, viewport, history, future } = state

  const containerRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [spaceHeld, setSpaceHeld] = useState(false)
  const panStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)

  // Keep a stable ref to viewport so wheel/pan handlers don't need it as dep
  const viewportRef = useRef(viewport)
  useEffect(() => { viewportRef.current = viewport }, [viewport])

  // Non-passive wheel listener so e.preventDefault() actually works
  // (React synthetic onWheel is passive in Chrome, so ctrl+scroll leaks to browser zoom)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      const { panX, panY, zoom } = viewportRef.current

      if (e.ctrlKey || e.metaKey) {
        // Figma-like zoom: cap deltaY to ±10 so trackpad is smooth (1-3% per event)
        // and mouse wheel is snappy (~10% per notch). Both feel natural.
        const capped = Math.max(-10, Math.min(10, e.deltaY))
        const zoomFactor = Math.pow(0.99, capped) // -10→+10.5%, +10→-9.6%
        const newZoom = Math.min(4, Math.max(0.05, zoom * zoomFactor))

        const rect = container.getBoundingClientRect()
        const cursorX = e.clientX - rect.left
        const cursorY = e.clientY - rect.top

        const newPanX = cursorX - (cursorX - panX) * (newZoom / zoom)
        const newPanY = cursorY - (cursorY - panY) * (newZoom / zoom)

        dispatch({ type: 'SET_VIEWPORT', viewport: { zoom: newZoom, panX: newPanX, panY: newPanY } })
      } else {
        dispatch({
          type: 'SET_VIEWPORT',
          viewport: { panX: panX - e.deltaX, panY: panY - e.deltaY },
        })
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [dispatch])

  // Pan: spacebar + drag or middle mouse
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
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

  // Keyboard: space = pan mode, Delete = delete selected, Cmd+Z = undo, Cmd+Shift+Z = redo
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement
      if (isInput) return

      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault()
        setSpaceHeld(true)
        return
      }

      if ((e.code === 'Delete' || e.code === 'Backspace') && selectedArtboardId) {
        dispatch({ type: 'DELETE_ARTBOARD', id: selectedArtboardId })
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyZ') {
        e.preventDefault()
        if (e.shiftKey) {
          dispatch({ type: 'REDO' })
        } else {
          dispatch({ type: 'UNDO' })
        }
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
  }, [selectedArtboardId, dispatch])

  // Global mouseup for pan release
  useEffect(() => {
    const onUp = () => { setIsPanning(false); panStart.current = null }
    window.addEventListener('mouseup', onUp)
    return () => window.removeEventListener('mouseup', onUp)
  }, [])

  // Auto-pan to newly created artboards
  const prevArtboardIdsRef = useRef<Set<string>>(new Set(artboards.map(a => a.id)))
  useEffect(() => {
    const prevIds = prevArtboardIdsRef.current
    const newArts = artboards.filter(a => !prevIds.has(a.id))
    prevArtboardIdsRef.current = new Set(artboards.map(a => a.id))

    if (newArts.length === 0 || !containerRef.current) return

    const target = newArts[0]
    const { zoom } = viewportRef.current
    const rect = containerRef.current.getBoundingClientRect()
    const newPanX = rect.width / 2 - (target.x + target.width / 2) * zoom
    const newPanY = rect.height / 2 - (target.y + target.height / 2) * zoom

    dispatch({ type: 'SET_VIEWPORT', viewport: { panX: newPanX, panY: newPanY } })
  }, [artboards, dispatch])

  const cursor = isPanning ? 'grabbing' : spaceHeld ? 'grab' : 'default'

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden"
      style={{
        background: '#161619',
        cursor,
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
        backgroundPosition: `${viewport.panX}px ${viewport.panY}px`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
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

      {/* Bottom-left: zoom */}
      <div className="absolute bottom-3 left-3 select-none pointer-events-none">
        <span className="text-[10px] text-white/20 font-mono">
          {Math.round(viewport.zoom * 100)}%
        </span>
      </div>

      {/* Bottom-center: keyboard hints */}
      {selectedArtboardId && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 select-none pointer-events-none">
          <div className="flex items-center gap-3 text-[9px] text-white/15">
            <span>Del delete</span>
            <span>Drag move</span>
            <span>Cmd+Z undo</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {artboards.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            {/* Subtle glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(10,62,255,0.04) 0%, transparent 70%)' }}
            />
            <div className="relative">
              <div className="text-[13px] font-medium text-white/15 mb-1">Empty canvas</div>
              <div className="text-[11px] text-white/10">Type a prompt or add an artboard to start</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
