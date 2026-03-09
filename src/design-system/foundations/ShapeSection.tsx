import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'

const SHAPES = [
  { name: 'None', value: '0px', variable: '--av-radius-none', desc: 'Sharp corners for dividers and flat elements' },
  { name: 'Extra Small', value: '2px', variable: '--av-radius-xs', desc: 'Subtle rounding for small elements' },
  { name: 'Small', value: '4px', variable: '--av-radius-sm', desc: 'Text fields, chips, outlined elements' },
  { name: 'Medium', value: '8px', variable: '--av-radius-md', desc: 'Cards, dialogs, menus' },
  { name: 'Large', value: '12px', variable: '--av-radius-lg', desc: 'Sheets, large cards, containers' },
  { name: 'Extra Large', value: '16px', variable: '--av-radius-xl', desc: 'Modals, bottom sheets' },
  { name: 'Full', value: '9999px', variable: '--av-radius-full', desc: 'Buttons, pills, avatars, FABs' },
]

export default function ShapeSection() {
  return (
    <section id="shape" className="ds-section">
      <SectionHeader
        label="Foundation"
        title="Shape & Radius"
        description="Border radius tokens from sharp corners to fully rounded pills."
      />

      <SubSection title="Radius Scale" description="Seven radius values from sharp corners to fully circular. Match the radius to the component size — larger elements use larger radii.">
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

      <SubSection title="Shape Usage">
        <table className="ds-token-table">
          <thead>
            <tr><th>Token</th><th>Value</th><th>Components</th></tr>
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
