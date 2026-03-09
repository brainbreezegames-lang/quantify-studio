import React from 'react'
import PhoneFrame from '../shared/PhoneFrame'

export default function EmptyStateScreen() {
  return (
    <PhoneFrame title="Empty State" description="Shown when no data exists, guiding users to take their first action.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568 }}>
        {/* Toolbar */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start" style={{ paddingLeft: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--av-on-surface)' }}>Reservations</span>
          </div>
          <div className="ds-toolbar-center" />
          <div className="ds-toolbar-end" />
        </div>

        {/* Empty State Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 32px 64px', textAlign: 'center' }}>
          {/* Illustration - clipboard with empty checklist */}
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ marginBottom: 24, opacity: 0.7 }}>
            {/* Clipboard body */}
            <rect x="25" y="20" width="70" height="85" rx="6" fill="var(--av-surface-2)" stroke="var(--av-outline-variant)" strokeWidth="2" />
            {/* Clipboard clip */}
            <rect x="42" y="14" width="36" height="16" rx="4" fill="var(--av-surface-3)" stroke="var(--av-outline-variant)" strokeWidth="2" />
            <circle cx="60" cy="22" r="3" fill="var(--av-outline)" />
            {/* Empty lines */}
            <rect x="38" y="44" width="44" height="4" rx="2" fill="var(--av-outline-variant)" opacity="0.5" />
            <rect x="38" y="56" width="36" height="4" rx="2" fill="var(--av-outline-variant)" opacity="0.4" />
            <rect x="38" y="68" width="40" height="4" rx="2" fill="var(--av-outline-variant)" opacity="0.3" />
            <rect x="38" y="80" width="28" height="4" rx="2" fill="var(--av-outline-variant)" opacity="0.2" />
            {/* Checkboxes (empty) */}
            <rect x="32" y="43" width="4" height="4" rx="1" stroke="var(--av-outline-variant)" strokeWidth="1" fill="none" opacity="0.5" />
            <rect x="32" y="55" width="4" height="4" rx="1" stroke="var(--av-outline-variant)" strokeWidth="1" fill="none" opacity="0.4" />
            <rect x="32" y="67" width="4" height="4" rx="1" stroke="var(--av-outline-variant)" strokeWidth="1" fill="none" opacity="0.3" />
            <rect x="32" y="79" width="4" height="4" rx="1" stroke="var(--av-outline-variant)" strokeWidth="1" fill="none" opacity="0.2" />
          </svg>

          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--av-on-surface)', marginBottom: 8 }}>
            No Reservations Yet
          </div>
          <div style={{ fontSize: 13, color: 'var(--av-on-surface-variant)', lineHeight: 1.5, marginBottom: 28, maxWidth: 240 }}>
            Create your first reservation to get started tracking your equipment.
          </div>
          <button className="ds-btn ds-btn-filled" style={{ fontSize: 14, height: 44, paddingLeft: 20, paddingRight: 24, gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            Create Reservation
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}
