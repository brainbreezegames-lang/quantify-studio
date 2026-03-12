import { useMemo } from 'react'
import { buildArtboardDoc } from '../utils/build-artboard-doc'
import type { Artboard as ArtboardType } from '../types'

interface Props {
  artboard: ArtboardType
  isSelected: boolean
  onSelect: () => void
}

export default function Artboard({ artboard, isSelected, onSelect }: Props) {
  const srcDoc = useMemo(
    () => buildArtboardDoc(artboard.html, artboard.css),
    [artboard.html, artboard.css]
  )

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
      {/* Artboard name */}
      <div
        className="select-none"
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: isSelected ? '#0A3EFF' : 'rgba(255,255,255,0.5)',
          marginBottom: 8,
          letterSpacing: '-0.01em',
          fontFamily: '"Switzer", system-ui, sans-serif',
        }}
      >
        {artboard.name}
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
            srcDoc={srcDoc}
            title={artboard.name}
            style={{
              width: artboard.width,
              height: artboard.height,
              border: 'none',
              display: 'block',
              pointerEvents: 'none',
            }}
            sandbox="allow-scripts"
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B5B5B5',
              fontSize: 13,
              fontFamily: '"Switzer", system-ui, sans-serif',
            }}
          >
            Empty artboard
          </div>
        )}
      </div>

      {/* Dimensions */}
      <div
        className="select-none"
        style={{
          fontSize: 10,
          color: 'rgba(255,255,255,0.25)',
          marginTop: 6,
          textAlign: 'center',
          fontFamily: 'monospace',
        }}
      >
        {artboard.width} × {artboard.height}
      </div>
    </div>
  )
}
