import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'

const TYPE_SCALE = [
  { name: 'Display Large', weight: 400, size: '57px', lineHeight: '64px', tracking: '-0.25px', sample: 'Reach New Heights' },
  { name: 'Display Medium', weight: 400, size: '45px', lineHeight: '52px', tracking: '0px', sample: 'Scaffold Solutions' },
  { name: 'Display Small', weight: 400, size: '36px', lineHeight: '44px', tracking: '0px', sample: 'Quantify Platform' },
  { name: 'Headline Large', weight: 400, size: '32px', lineHeight: '40px', tracking: '0px', sample: 'Reservation Management' },
  { name: 'Headline Medium', weight: 400, size: '28px', lineHeight: '36px', tracking: '0px', sample: 'Inventory Overview' },
  { name: 'Headline Small', weight: 400, size: '24px', lineHeight: '32px', tracking: '0px', sample: 'Ship Reservation' },
  { name: 'Title Large', weight: 500, size: '22px', lineHeight: '28px', tracking: '0px', sample: 'Project Details' },
  { name: 'Title Medium', weight: 600, size: '16px', lineHeight: '24px', tracking: '0.15px', sample: 'Equipment List' },
  { name: 'Title Small', weight: 600, size: '14px', lineHeight: '20px', tracking: '0.1px', sample: 'Filter Options' },
  { name: 'Body Large', weight: 400, size: '16px', lineHeight: '24px', tracking: '0.5px', sample: 'Manage your scaffold reservations efficiently with real-time tracking.' },
  { name: 'Body Medium', weight: 400, size: '14px', lineHeight: '20px', tracking: '0.25px', sample: 'Each reservation includes delivery dates, quantities, and site information.' },
  { name: 'Body Small', weight: 400, size: '12px', lineHeight: '16px', tracking: '0.4px', sample: 'Last updated 3 hours ago · Modified by John Smith' },
  { name: 'Label Large', weight: 600, size: '14px', lineHeight: '20px', tracking: '0.1px', sample: 'SAVE CHANGES' },
  { name: 'Label Medium', weight: 600, size: '12px', lineHeight: '16px', tracking: '0.5px', sample: 'QUANTITY' },
  { name: 'Label Small', weight: 600, size: '11px', lineHeight: '16px', tracking: '0.5px', sample: 'REQUIRED' },
]

const FONT_STACK = {
  primary: "'Helvetica Neue', 'Segoe UI', Helvetica, Arial, sans-serif",
  web: "'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace",
}

export default function TypographySection() {
  return (
    <section id="typography" className="ds-section">
      <SectionHeader
        label="Foundation"
        title="Typography"
        description="Type scale, weights, and sizing tokens for readable, consistent text."
      />

      <SubSection title="Font Families" description="The brand typeface is Neue Helvetica. For web applications, we use DM Sans as a high-quality substitute with similar proportions.">
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="ds-card ds-card-outlined" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)' }}>Primary — Brand</div>
              <div style={{ fontFamily: 'var(--av-font-mono)', fontSize: 11, color: 'var(--av-on-surface-variant)' }}>--av-font-primary</div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 300, fontFamily: FONT_STACK.primary, marginBottom: 4 }}>Neue Helvetica</div>
            <div style={{ fontSize: 14, color: 'var(--av-on-surface-variant)', fontFamily: 'var(--av-font-mono)' }}>{FONT_STACK.web}</div>
          </div>
          <div className="ds-card ds-card-outlined" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)' }}>Monospace — Code</div>
              <div style={{ fontFamily: 'var(--av-font-mono)', fontSize: 11, color: 'var(--av-on-surface-variant)' }}>--av-font-mono</div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 400, fontFamily: 'var(--av-font-mono)', marginBottom: 4 }}>JetBrains Mono</div>
            <div style={{ fontSize: 14, color: 'var(--av-on-surface-variant)', fontFamily: 'var(--av-font-mono)' }}>{FONT_STACK.mono}</div>
          </div>
        </div>
      </SubSection>

      <SubSection title="Type Scale" description="MD3 defines 15 type styles across 5 categories. Each style has a specific role in the visual hierarchy.">
        <div className="ds-type-specimen">
          {TYPE_SCALE.map(t => (
            <div key={t.name} className="ds-type-row">
              <div className="ds-type-meta">
                <div className="ds-type-variant-name">{t.name}</div>
                <div className="ds-type-specs">
                  {t.size} / {t.lineHeight}<br />
                  Weight {t.weight} · Tracking {t.tracking}
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
            <tr><td className="token-name">Display</td><td>Hero text, large numbers, splash screens</td><td className="token-value">TextBlock Style="Display"</td></tr>
            <tr><td className="token-name">Headline</td><td>Page titles, section headers, dialog titles</td><td className="token-value">TextBlock Style="Headline"</td></tr>
            <tr><td className="token-name">Title</td><td>Card titles, toolbar text, list headers</td><td className="token-value">TextBlock Style="Title"</td></tr>
            <tr><td className="token-name">Body</td><td>Paragraph text, descriptions, form labels</td><td className="token-value">TextBlock Style="Body"</td></tr>
            <tr><td className="token-name">Label</td><td>Buttons, chips, badges, navigation items</td><td className="token-value">TextBlock Style="Label"</td></tr>
          </tbody>
        </table>
      </SubSection>
    </section>
  )
}
