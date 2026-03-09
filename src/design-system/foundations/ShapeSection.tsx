import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'

const SHAPES = [
  { name: 'Default', value: '0px', variable: '--av-radius-none', desc: 'Sharp corners — the Probe default. Used for cards, buttons, inputs, containers, and all standard elements.' },
  { name: 'Extra Small', value: '0px', variable: '--av-radius-xs', desc: 'Same as default. Sharp corners for small elements.' },
  { name: 'Small', value: '0px', variable: '--av-radius-sm', desc: 'Same as default. Sharp corners for text fields, chips, outlined elements.' },
  { name: 'Medium', value: '0px', variable: '--av-radius-md', desc: 'Same as default. Sharp corners for cards, dialogs, menus.' },
  { name: 'Large', value: '0px', variable: '--av-radius-lg', desc: 'Same as default. Sharp corners for sheets, large cards, containers.' },
  { name: 'Extra Large', value: '0px', variable: '--av-radius-xl', desc: 'Same as default. Sharp corners for modals, bottom sheets.' },
  { name: 'Full', value: '9999px', variable: '--av-radius-full', desc: 'Fully rounded pills — only for badges, dot indicators, and avatar circles.' },
]

export default function ShapeSection() {
  return (
    <section id="shape" className="ds-section">
      <SectionHeader
        label="Foundation"
        title="Shape & Radius"
        description="Sharp geometric corners define the Probe aesthetic. 0px border-radius is the default for all elements."
      />

      <SubSection title="Radius Scale" description="The Probe design language uses 0px border-radius as its universal default. Sharp corners create a precise, confident, modern feel. Only badges and dot indicators use full rounding.">
        <div className="ds-shape-grid">
          {SHAPES.map(s => (
            <div key={s.name} style={{ textAlign: 'center' }}>
              <div className="ds-shape-item" style={{ borderRadius: s.value }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8 }}>{s.name}</div>
              <div style={{ fontFamily: 'var(--av-font-mono)', fontSize: 10, color: 'var(--av-blue)', marginTop: 2 }}>{s.variable}</div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Design Philosophy" description="Unlike rounded-corner design systems, Probe deliberately uses sharp geometry to convey precision and authority — reflecting the industrial nature of scaffold management software.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="ds-card ds-card-outlined" style={{ padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)', marginBottom: 12 }}>Probe — Sharp</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 80, height: 48, background: 'var(--av-blue)', borderRadius: 0 }} />
              <div style={{ width: 80, height: 48, border: '1px solid var(--av-outline)', borderRadius: 0 }} />
              <div style={{ width: 80, height: 48, background: 'var(--av-surface-2)', borderRadius: 0 }} />
            </div>
          </div>
          <div className="ds-card ds-card-outlined" style={{ padding: 24, opacity: 0.5 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-on-surface-variant)', marginBottom: 12 }}>Rounded (Not Used)</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 80, height: 48, background: 'var(--av-on-surface-variant)', borderRadius: 12 }} />
              <div style={{ width: 80, height: 48, border: '1px solid var(--av-outline)', borderRadius: 12 }} />
              <div style={{ width: 80, height: 48, background: 'var(--av-surface-3)', borderRadius: 12 }} />
            </div>
          </div>
        </div>
      </SubSection>

      <SubSection title="Shape Usage">
        <table className="ds-token-table">
          <thead>
            <tr><th>Token</th><th>Value</th><th>Usage</th></tr>
          </thead>
          <tbody>
            {SHAPES.map(s => (
              <tr key={s.name}>
                <td className="token-name">{s.variable}</td>
                <td className="token-value">{s.value}</td>
                <td>{s.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SubSection>
    </section>
  )
}
