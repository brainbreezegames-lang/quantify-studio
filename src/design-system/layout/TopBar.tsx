import React from 'react'

export default function TopBar() {
  return (
    <header className="ds-topbar">
      <div className="ds-topbar-brand">
        <span className="ds-topbar-logo">AVONTUS</span>
        <span className="ds-topbar-divider" />
        <span className="ds-topbar-title">Design System</span>
      </div>
      <a href="/" className="ds-topbar-link">
        Back to Studio
      </a>
    </header>
  )
}
