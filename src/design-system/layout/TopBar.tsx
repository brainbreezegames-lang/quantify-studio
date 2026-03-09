import React from 'react'

export default function TopBar() {
  return (
    <header className="ds-topbar">
      <div className="ds-topbar-brand">
        <span className="ds-topbar-logo">QUANTIFY</span>
        <span className="ds-topbar-divider" />
        <span className="ds-topbar-title">Design System</span>
      </div>
      <div className="ds-topbar-link" style={{ cursor: 'default' }}>
        Probe Design Language
      </div>
    </header>
  )
}
