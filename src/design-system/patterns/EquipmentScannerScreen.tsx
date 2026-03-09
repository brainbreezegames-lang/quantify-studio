import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

const scannedItems = [
  { name: '48" Standard Frame', tagId: 'TAG-00847', time: 'Just now' },
  { name: 'Standard Brace 7\'', tagId: 'TAG-01293', time: '2 min ago' },
  { name: 'Base Plate', tagId: 'TAG-00512', time: '4 min ago' },
]

export default function EquipmentScannerScreen() {
  const [mode, setMode] = useState<'out' | 'in'>('out')

  return (
    <PhoneFrame title="Equipment Scanner" description="Barcode/QR scanner for checking equipment in and out at job sites.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568, background: 'var(--av-bg)' }}>
        {/* Toolbar */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
          </div>
          <div className="ds-toolbar-center" style={{ fontSize: 14 }}>Scan Equipment</div>
          <div className="ds-toolbar-end">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                <path d="M12 2v1M12 5v1M5 10H3M5 6l-1-1M19 6l1-1" strokeWidth="0" />
                <path d="M13 3h-2v2h2zM8 2H6v4h2zM18 2h-2v4h2z" fill="currentColor" stroke="none" />
                <line x1="12" y1="1" x2="12" y2="7" />
                <line x1="4" y1="12" x2="4" y2="22" strokeWidth="0" />
              </svg>
            </button>
            <button className="ds-toolbar-btn">
              {/* Flashlight icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6l-3 3M6 6l3 3M12 2v4M4.93 4.93l2.83 2.83M19.07 4.93l-2.83 2.83" />
                <rect x="9" y="9" width="6" height="13" rx="1" />
                <line x1="12" y1="13" x2="12" y2="15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div style={{ display: 'flex', gap: 8, padding: '10px 16px', justifyContent: 'center' }}>
          <button
            className={`ds-chip${mode === 'out' ? ' selected' : ''}`}
            style={{ fontSize: 12, padding: '0 16px', height: 32 }}
            onClick={() => setMode('out')}
          >
            Check Out
          </button>
          <button
            className={`ds-chip${mode === 'in' ? ' selected' : ''}`}
            style={{ fontSize: 12, padding: '0 16px', height: 32 }}
            onClick={() => setMode('in')}
          >
            Check In
          </button>
        </div>

        {/* Camera Viewfinder */}
        <div style={{
          margin: '0 16px',
          height: 180,
          background: 'var(--av-navy)',
          borderRadius: 'var(--av-radius-lg)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Corner Brackets */}
          <div style={{ position: 'absolute', inset: 20, pointerEvents: 'none' }}>
            {/* Top-left */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: 24, height: 24, borderTop: '3px solid var(--av-green)', borderLeft: '3px solid var(--av-green)', borderRadius: '4px 0 0 0' }} />
            {/* Top-right */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: 24, height: 24, borderTop: '3px solid var(--av-green)', borderRight: '3px solid var(--av-green)', borderRadius: '0 4px 0 0' }} />
            {/* Bottom-left */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 24, height: 24, borderBottom: '3px solid var(--av-green)', borderLeft: '3px solid var(--av-green)', borderRadius: '0 0 0 4px' }} />
            {/* Bottom-right */}
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderBottom: '3px solid var(--av-green)', borderRight: '3px solid var(--av-green)', borderRadius: '0 0 4px 0' }} />
          </div>

          {/* Animated Scan Line */}
          <div style={{
            position: 'absolute',
            left: 20,
            right: 20,
            height: 2,
            background: 'var(--av-green)',
            opacity: 0.8,
            boxShadow: '0 0 8px var(--av-green)',
            animation: 'scanLine 2s ease-in-out infinite',
          }} />

          {/* Hint Text */}
          <span style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.7)',
            fontFamily: 'var(--av-font-primary)',
            zIndex: 1,
            marginTop: 60,
          }}>
            Point camera at barcode
          </span>

          {/* CSS Animation */}
          <style>{`
            @keyframes scanLine {
              0%, 100% { top: 25px; }
              50% { top: calc(100% - 25px); }
            }
          `}</style>
        </div>

        {/* Recently Scanned */}
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px 0' }}>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--av-on-surface-variant)',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: 8,
          }}>
            Recently Scanned
          </div>
          {scannedItems.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 0',
              borderBottom: i < scannedItems.length - 1 ? '1px solid var(--av-surface-3)' : 'none',
            }}>
              {/* Equipment icon */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--av-radius-md)',
                background: 'var(--av-surface-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--av-blue)" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a4 4 0 00-8 0v2" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--av-on-surface)' }}>{item.name}</div>
                <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', fontFamily: 'var(--av-font-mono)', marginTop: 1 }}>{item.tagId}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--av-teal)" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span style={{ fontSize: 10, color: 'var(--av-outline)' }}>{item.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Summary Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderTop: '1px solid var(--av-outline-variant)',
          background: 'var(--av-surface)',
        }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--av-on-surface)' }}>
            3 items scanned
          </span>
          <button className="ds-btn ds-btn-filled" style={{ fontSize: 13 }}>
            Complete Session
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}
