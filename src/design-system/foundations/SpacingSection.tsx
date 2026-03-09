import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'

const SPACING = [
  { name: 'space-1', px: 4 },
  { name: 'space-2', px: 8 },
  { name: 'space-3', px: 12 },
  { name: 'space-4', px: 16 },
  { name: 'space-5', px: 20 },
  { name: 'space-6', px: 24 },
  { name: 'space-8', px: 32 },
  { name: 'space-10', px: 40 },
  { name: 'space-12', px: 48 },
  { name: 'space-16', px: 64 },
  { name: 'space-20', px: 80 },
]

export default function SpacingSection() {
  return (
    <section id="spacing" className="ds-section">
      <SectionHeader
        label="Foundation"
        title="Spacing"
        description="4px-grid spacing tokens for padding, margins, and gaps."
      />

      <SubSection title="Spacing Scale" description="The scale uses a 4px base unit. Common values: 8px for tight spacing, 16px for standard, 24px for generous, 32px+ for section-level gaps.">
        <div className="ds-card ds-card-outlined" style={{ padding: 24 }}>
          {SPACING.map(s => (
            <div key={s.name} className="ds-spacing-row">
              <div className="ds-spacing-label">--av-{s.name}</div>
              <div className="ds-spacing-value">{s.px}px</div>
              <div className="ds-spacing-bar" style={{ width: s.px * 3, background: 'var(--av-blue)' }} />
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Usage Guidelines">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          <div className="ds-card ds-card-filled" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Inline Spacing</div>
            <p style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', margin: 0, lineHeight: 1.5 }}>
              Use <code style={{ fontFamily: 'var(--av-font-mono)', fontSize: 11, color: 'var(--av-blue)' }}>space-2</code> (8px) between icons and text.
              Use <code style={{ fontFamily: 'var(--av-font-mono)', fontSize: 11, color: 'var(--av-blue)' }}>space-3</code> (12px) between form elements.
            </p>
          </div>
          <div className="ds-card ds-card-filled" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Component Padding</div>
            <p style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', margin: 0, lineHeight: 1.5 }}>
              Use <code style={{ fontFamily: 'var(--av-font-mono)', fontSize: 11, color: 'var(--av-blue)' }}>space-4</code> (16px) for card and dialog padding.
              Use <code style={{ fontFamily: 'var(--av-font-mono)', fontSize: 11, color: 'var(--av-blue)' }}>space-6</code> (24px) for generous containers.
            </p>
          </div>
          <div className="ds-card ds-card-filled" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Section Gaps</div>
            <p style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', margin: 0, lineHeight: 1.5 }}>
              Use <code style={{ fontFamily: 'var(--av-font-mono)', fontSize: 11, color: 'var(--av-blue)' }}>space-8</code> (32px) between sections.
              Use <code style={{ fontFamily: 'var(--av-font-mono)', fontSize: 11, color: 'var(--av-blue)' }}>space-16</code> (64px) for page-level gaps.
            </p>
          </div>
        </div>
      </SubSection>
    </section>
  )
}
