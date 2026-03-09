import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'

const ELEVATIONS = [
  { level: 0, shadow: 'none', desc: 'Flat. No elevation. Used for backgrounds and inline content.' },
  { level: 1, shadow: 'var(--av-shadow-1)', desc: 'Cards, raised surfaces. Subtle depth separation.' },
  { level: 2, shadow: 'var(--av-shadow-2)', desc: 'Hover states, active cards. Medium emphasis.' },
  { level: 3, shadow: 'var(--av-shadow-3)', desc: 'FABs, elevated buttons. Strong visual lift.' },
  { level: 4, shadow: 'var(--av-shadow-4)', desc: 'Navigation drawers, side sheets.' },
  { level: 5, shadow: 'var(--av-shadow-5)', desc: 'Dialogs, modals. Maximum depth.' },
]

export default function ElevationSection() {
  return (
    <section id="elevation" className="ds-section">
      <SectionHeader
        label="Foundation"
        title="Elevation"
        description="Blue-tinted shadow levels that create depth and visual hierarchy."
      />

      <SubSection title="Shadow Levels" description="Six levels of elevation from flat (0) to modal (5). Higher elevations draw more attention and indicate interactive or overlaid content.">
        <div className="ds-elevation-grid">
          {ELEVATIONS.map(e => (
            <div key={e.level} style={{ textAlign: 'center' }}>
              <div className="ds-elevation-card" style={{
                boxShadow: e.shadow,
                border: e.level === 0 ? '1px solid var(--av-outline-variant)' : 'none',
              }}>
                Level {e.level}
              </div>
              <p style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', marginTop: 8, lineHeight: 1.4 }}>{e.desc}</p>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Elevation Tokens">
        <table className="ds-token-table">
          <thead>
            <tr><th>Token</th><th>Value</th><th>Usage</th></tr>
          </thead>
          <tbody>
            <tr><td className="token-name">--av-shadow-1</td><td className="token-value">0 1px 3px rgba(0,5,238,0.06)</td><td>Cards, list items</td></tr>
            <tr><td className="token-name">--av-shadow-2</td><td className="token-value">0 4px 12px rgba(0,5,238,0.08)</td><td>Hover, active cards</td></tr>
            <tr><td className="token-name">--av-shadow-3</td><td className="token-value">0 8px 24px rgba(0,5,238,0.10)</td><td>FABs, elevated buttons</td></tr>
            <tr><td className="token-name">--av-shadow-4</td><td className="token-value">0 16px 40px rgba(0,5,238,0.12)</td><td>Drawers, sheets</td></tr>
            <tr><td className="token-name">--av-shadow-5</td><td className="token-value">0 24px 56px rgba(0,5,238,0.14)</td><td>Dialogs, modals</td></tr>
          </tbody>
        </table>
      </SubSection>
    </section>
  )
}
