import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

export default function ConnectionSettingsScreen() {
  const [ssl, setSsl] = useState(true)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleTest = () => {
    setStatus(status === 'success' ? 'error' : 'success')
  }

  return (
    <PhoneFrame title="Connection Settings" description="Server URL, SSL toggle, and connection test — edit-mode toolbar with X and Save.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568 }}>
        {/* Toolbar — Edit mode: X + Save */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start">
            <button className="ds-toolbar-btn" aria-label="Close without saving">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface)', paddingLeft: 4 }}>Connection settings</div>
          <div className="ds-toolbar-end">
            <button className="ds-btn ds-btn-filled" style={{ height: 32, fontSize: 12, padding: '0 14px' }}>Save</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '20px 16px' }}>
          {/* Server URL */}
          <div className="ds-textfield" style={{ maxWidth: '100%', marginBottom: 20 }}>
            <input
              type="text"
              defaultValue="https://quantify.app"
              style={{ height: 48, fontSize: 13, padding: '20px 12px 6px' }}
              readOnly
            />
            <label style={{ left: 12, top: 6, fontSize: 11 }}>Server URL</label>
          </div>

          {/* SSL Toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 0',
            borderBottom: '1px solid var(--av-outline-variant)',
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface)' }}>Use SSL</div>
              <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', marginTop: 2 }}>Encrypt connection with TLS</div>
            </div>
            <button
              role="switch"
              aria-checked={ssl}
              aria-label="Use SSL"
              onClick={() => setSsl(!ssl)}
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                border: 'none',
                cursor: 'pointer',
                background: ssl ? 'var(--av-blue, #0005EE)' : 'var(--av-outline-variant, #CAC4D0)',
                position: 'relative',
                transition: 'background 200ms',
              }}
            >
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'var(--av-bg, #fff)',
                position: 'absolute',
                top: 3,
                left: ssl ? 23 : 3,
                transition: 'left 200ms',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>

          {/* Test Connection */}
          <div style={{ marginTop: 24 }}>
            <button
              className="ds-btn ds-btn-outlined"
              style={{ width: '100%', height: 40, fontSize: 13 }}
              onClick={handleTest}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Test connection
            </button>
          </div>

          {/* Status Bar */}
          {status !== 'idle' && (
            <div style={{
              marginTop: 16,
              padding: '10px 14px',
              borderRadius: 'var(--av-radius-sm)',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: status === 'success' ? 'rgba(0,155,134,0.08)' : 'rgba(211,47,47,0.08)',
              color: status === 'success' ? 'var(--av-success, #009B86)' : 'var(--av-error, #D32F2F)',
              border: `1px solid ${status === 'success' ? 'var(--av-success)' : 'var(--av-error)'}`,
            }}>
              {status === 'success' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
              )}
              {status === 'success' ? 'Connected successfully' : 'Connection failed — check server URL'}
            </div>
          )}
        </div>

      </div>
    </PhoneFrame>
  )
}
