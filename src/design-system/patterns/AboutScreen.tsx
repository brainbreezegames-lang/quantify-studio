import React from 'react'
import PhoneFrame from '../shared/PhoneFrame'

export default function AboutScreen() {
  return (
    <PhoneFrame title="About Quantify" description="App info, version, copyright in canonical format, and legal links.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568 }}>
        {/* Toolbar — Read-only mode: back arrow */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start">
            <button className="ds-toolbar-btn" aria-label="Go back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
          </div>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface)', paddingLeft: 4 }}>About Quantify</div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Logo */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'var(--av-blue, #0005EE)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>Q</span>
          </div>

          {/* App Name */}
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--av-on-surface)', letterSpacing: '-0.5px' }}>
            Quantify
          </div>
          <div style={{ fontSize: 13, color: 'var(--av-on-surface-variant)', marginTop: 4, letterSpacing: '0.2px' }}>
            by Quantify Software
          </div>

          {/* Version */}
          <div style={{
            marginTop: 16,
            padding: '6px 16px',
            borderRadius: 20,
            background: 'var(--av-surface-2)',
            fontSize: 13,
            fontFamily: 'var(--av-font-mono, monospace)',
            color: 'var(--av-on-surface-variant)',
          }}>
            Version 4.2.1 (Build 2026.03.01)
          </div>

          {/* Copyright */}
          <div style={{
            marginTop: 24,
            fontSize: 13,
            color: 'var(--av-on-surface-variant)',
            textAlign: 'center',
          }}>
            © Quantify 2008–2025. All rights reserved.
          </div>

          {/* Divider */}
          <div style={{
            width: '100%',
            height: 1,
            background: 'var(--av-outline-variant)',
            margin: '28px 0',
          }} />

          {/* Legal Links */}
          <div style={{ width: '100%' }}>
            {['Terms of service', 'Privacy policy', 'Open-source licenses'].map((label, i) => (
              <button key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: i < 2 ? '1px solid var(--av-outline-variant)' : 'none',
                cursor: 'pointer',
                width: '100%',
                background: 'none',
                border: i < 2 ? undefined : 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                fontFamily: 'inherit',
              }}>
                <span style={{ fontSize: 14, color: 'var(--av-on-surface)' }}>{label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--av-on-surface-variant)' }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}
