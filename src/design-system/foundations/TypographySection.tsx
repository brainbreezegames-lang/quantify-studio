import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'

const TYPE_SCALE = [
  { name: 'H1', weight: 500, size: '76px', lineHeight: '1.05', tracking: '-0.04em', sample: 'Quantify Platform' },
  { name: 'H2', weight: 500, size: '49px', lineHeight: '1.1', tracking: '-0.04em', sample: 'Scaffold Solutions' },
  { name: 'H3', weight: 500, size: '39px', lineHeight: '1.15', tracking: '-0.02em', sample: 'Reservation Management' },
  { name: 'H4', weight: 500, size: '31px', lineHeight: '1.2', tracking: '-0.02em', sample: 'Inventory Overview' },
  { name: 'H5', weight: 500, size: '25px', lineHeight: '1.25', tracking: '-0.02em', sample: 'Ship Reservation' },
  { name: 'H6', weight: 500, size: '20px', lineHeight: '1.3', tracking: '-0.02em', sample: 'Project Details' },
  { name: 'Body', weight: 400, size: '16px', lineHeight: '1.5', tracking: '-0.02em', sample: 'Manage your scaffold reservations efficiently with real-time tracking and field operations.' },
  { name: 'Small', weight: 400, size: '13px', lineHeight: '1.45', tracking: '-0.01em', sample: 'Last updated 3 hours ago · Modified by John Smith' },
]

const FONT_STACK = {
  primary: "'Switzer', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace",
}

export default function TypographySection() {
  return (
    <section id="typography" className="ds-section">
      <SectionHeader
        label="Foundation"
        title="Typography"
        description="Switzer typeface with tight letter-spacing. Eight styles from H1 to Small."
      />

      <SubSection title="Font Families" description="Switzer is the primary typeface — a clean geometric sans-serif with excellent readability. Weight 400 for body text, 500 for headings and emphasis.">
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="ds-card ds-card-outlined" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)' }}>Primary</div>
              <div style={{ fontFamily: 'var(--av-font-mono)', fontSize: 11, color: 'var(--av-on-surface-variant)' }}>--av-font-primary</div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 500, fontFamily: 'var(--av-font-primary)', marginBottom: 4, letterSpacing: '-0.04em' }}>Switzer</div>
            <div style={{ fontSize: 14, color: 'var(--av-on-surface-variant)', fontFamily: 'var(--av-font-mono)' }}>{FONT_STACK.primary}</div>
          </div>
          <div className="ds-card ds-card-outlined" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)' }}>Monospace</div>
              <div style={{ fontFamily: 'var(--av-font-mono)', fontSize: 11, color: 'var(--av-on-surface-variant)' }}>--av-font-mono</div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 400, fontFamily: 'var(--av-font-mono)', marginBottom: 4 }}>JetBrains Mono</div>
            <div style={{ fontSize: 14, color: 'var(--av-on-surface-variant)', fontFamily: 'var(--av-font-mono)' }}>{FONT_STACK.mono}</div>
          </div>
        </div>
      </SubSection>

      <SubSection title="Type Scale" description="Eight type styles across two categories — Headings (H1–H6) and Body (Body, Small). All use tight negative letter-spacing for a modern, precise feel.">
        <div className="ds-type-specimen">
          {TYPE_SCALE.map(t => (
            <div key={t.name} className="ds-type-row">
              <div className="ds-type-meta">
                <div className="ds-type-variant-name">{t.name}</div>
                <div className="ds-type-specs">
                  {t.size} / {t.lineHeight}<br />
                  Weight {t.weight} · {t.tracking}
                </div>
              </div>
              <div className="ds-type-sample" style={{
                fontSize: t.size,
                fontWeight: t.weight,
                lineHeight: t.lineHeight,
                letterSpacing: t.tracking,
              }}>
                {t.sample}
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Usage Guidelines">
        <table className="ds-token-table">
          <thead>
            <tr>
              <th>Style</th>
              <th>Use For</th>
              <th>XAML Element</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="token-name">H1</td><td>Hero text, splash screens, large numbers</td><td className="token-value">TextBlock Style="H1"</td></tr>
            <tr><td className="token-name">H2</td><td>Page titles, major section headers</td><td className="token-value">TextBlock Style="H2"</td></tr>
            <tr><td className="token-name">H3</td><td>Section headers, dialog titles</td><td className="token-value">TextBlock Style="H3"</td></tr>
            <tr><td className="token-name">H4</td><td>Card titles, subsection headers</td><td className="token-value">TextBlock Style="H4"</td></tr>
            <tr><td className="token-name">H5</td><td>Toolbar text, list headers, small titles</td><td className="token-value">TextBlock Style="H5"</td></tr>
            <tr><td className="token-name">H6</td><td>Labels, tags, navigation items, badges</td><td className="token-value">TextBlock Style="H6"</td></tr>
            <tr><td className="token-name">Body</td><td>Paragraph text, descriptions, form labels</td><td className="token-value">TextBlock Style="Body"</td></tr>
            <tr><td className="token-name">Small</td><td>Captions, timestamps, helper text</td><td className="token-value">TextBlock Style="Small"</td></tr>
          </tbody>
        </table>
      </SubSection>
    </section>
  )
}
