import { useMemo, useRef, useEffect, useCallback, useState } from 'react'
import { buildArtboardDoc } from '../utils/build-artboard-doc'
import { useDesigner } from '../designer-store'
import type { Artboard as ArtboardType } from '../types'

interface Props {
  artboard: ArtboardType
  isSelected: boolean
  onSelect: () => void
}

export default function Artboard({ artboard, isSelected, onSelect }: Props) {
  const { state: { viewport }, dispatch } = useDesigner()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const initializedRef = useRef(false)
  const lastDocRef = useRef('')
  const [isResizing, setIsResizing] = useState(false)

  const fullDoc = useMemo(
    () => artboard.html ? buildArtboardDoc(artboard.html, artboard.css) : '',
    [artboard.html, artboard.css]
  )

  // Update iframe content — use contentDocument.write() to avoid flash/flicker
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || !fullDoc) return

    if (!initializedRef.current) {
      // First render: set srcdoc
      iframe.srcdoc = fullDoc
      initializedRef.current = true
      lastDocRef.current = fullDoc
    } else if (fullDoc !== lastDocRef.current) {
      // Subsequent updates: use contentDocument.write() for flicker-free updates
      lastDocRef.current = fullDoc
      try {
        const doc = iframe.contentDocument
        if (doc) {
          doc.open()
          doc.write(fullDoc)
          doc.close()
        } else {
          iframe.srcdoc = fullDoc
        }
      } catch {
        iframe.srcdoc = fullDoc
      }
    }
  }, [fullDoc])

  // Reset when artboard ID changes entirely
  useEffect(() => {
    initializedRef.current = false
    lastDocRef.current = ''
  }, [artboard.id])

  // Resize drag handler
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    const startY = e.clientY
    const startHeight = artboard.height
    const zoom = viewport.zoom

    const onMove = (me: MouseEvent) => {
      const dy = (me.clientY - startY) / zoom
      dispatch({
        type: 'UPDATE_ARTBOARD',
        id: artboard.id,
        updates: { height: Math.max(200, Math.round(startHeight + dy)) },
      })
    }
    const onUp = () => {
      setIsResizing(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [artboard.id, artboard.height, viewport.zoom, dispatch])

  // Fit content height
  const fitContent = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    try {
      const scrollHeight = iframe.contentDocument?.body?.scrollHeight
      if (scrollHeight && scrollHeight > 100) {
        dispatch({
          type: 'UPDATE_ARTBOARD',
          id: artboard.id,
          updates: { height: scrollHeight + 16 },
        })
      }
    } catch { /* cross-origin */ }
  }, [artboard.id, dispatch])

  return (
    <div
      style={{
        position: 'absolute',
        left: artboard.x,
        top: artboard.y,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      {/* Artboard name + fit button */}
      <div
        className="select-none"
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: isSelected ? '#0A3EFF' : 'rgba(255,255,255,0.5)',
          marginBottom: 8,
          letterSpacing: '-0.01em',
          fontFamily: '"Switzer", system-ui, sans-serif',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{artboard.name}</span>
        {isSelected && artboard.html && (
          <button
            onClick={(e) => { e.stopPropagation(); fitContent() }}
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: 3,
              padding: '2px 6px',
              cursor: 'pointer',
            }}
            title="Fit to content height"
          >
            Fit height
          </button>
        )}
      </div>

      {/* Artboard frame */}
      <div
        style={{
          width: artboard.width,
          height: artboard.height,
          border: isSelected ? '2px solid #0A3EFF' : '1px solid rgba(255,255,255,0.08)',
          borderRadius: 2,
          overflow: 'hidden',
          background: '#fff',
          boxShadow: isSelected
            ? '0 0 0 1px rgba(10,62,255,0.3), 0 8px 32px rgba(0,0,0,0.4)'
            : '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      >
        {artboard.html ? (
          <iframe
            ref={iframeRef}
            title={artboard.name}
            style={{
              width: artboard.width,
              height: artboard.height,
              border: 'none',
              display: 'block',
              pointerEvents: 'none',
            }}
            sandbox="allow-same-origin allow-scripts"
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              background: '#FAFAFA',
            }}
          >
            {/* Loading skeleton */}
            <div style={{ width: '70%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ height: 44, borderRadius: 0, background: '#F0F0F0' }} />
              <div style={{ height: 12, width: '60%', borderRadius: 2, background: '#F0F0F0' }} />
              <div style={{ height: 12, width: '80%', borderRadius: 2, background: '#F0F0F0' }} />
              <div style={{ height: 60, borderRadius: 0, background: '#F0F0F0', marginTop: 8 }} />
              <div style={{ height: 12, width: '50%', borderRadius: 2, background: '#F0F0F0' }} />
              <div style={{ height: 48, borderRadius: 0, background: '#F0F0F0', marginTop: 8 }} />
              <div style={{ height: 48, borderRadius: 0, background: '#F0F0F0' }} />
              <div style={{ height: 48, borderRadius: 0, background: '#F0F0F0' }} />
            </div>
            <div style={{ color: '#C5C5C5', fontSize: 12, fontFamily: '"Switzer", system-ui, sans-serif' }}>
              Generating...
            </div>
          </div>
        )}
      </div>

      {/* Resize handle */}
      {isSelected && (
        <div
          onMouseDown={handleResizeStart}
          style={{
            width: 40,
            height: 6,
            borderRadius: 3,
            background: isResizing ? '#0A3EFF' : 'rgba(255,255,255,0.2)',
            margin: '6px auto 0',
            cursor: 'ns-resize',
            transition: 'background 0.15s',
          }}
          title="Drag to resize height"
        />
      )}

      {/* Dimensions */}
      <div
        className="select-none"
        style={{
          fontSize: 10,
          color: 'rgba(255,255,255,0.25)',
          marginTop: 4,
          textAlign: 'center',
          fontFamily: 'monospace',
        }}
      >
        {artboard.width} × {artboard.height}
      </div>
    </div>
  )
}
