import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'

const STATES = [
  { name: 'Enabled', opacity: 0, desc: 'Default resting state. No overlay.' },
  { name: 'Hover', opacity: 0.08, desc: 'Mouse over. Subtle highlight to indicate interactivity.' },
  { name: 'Focus', opacity: 0.12, desc: 'Keyboard focus. Clear visual ring for accessibility.' },
  { name: 'Pressed', opacity: 0.12, desc: 'Active click/tap. Ripple-like feedback.' },
  { name: 'Dragged', opacity: 0.16, desc: 'Being dragged. Elevated with stronger overlay.' },
  { name: 'Disabled', opacity: 0.38, desc: 'Not interactive. Reduced opacity across entire element.' },
]

export default function StatesSection() {
  return (
    <section id="states" className="ds-section">
      <SectionHeader
        label="Foundation"
        title="State Layers"
        description="Hover, focus, press, and disabled visual feedback layers."
      />

      <SubSection title="State Opacity Levels" description="Each state applies a white overlay at a specific opacity on top of the element's background color.">
        <div className="ds-state-grid">
          {STATES.map(s => (
            <div key={s.name} className="ds-state-item" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', background: '#fff', opacity: s.opacity, pointerEvents: 'none' }} />
              <div className="state-label">{s.name}</div>
              <div className="state-value">{s.opacity === 0 ? '0%' : `${Math.round(s.opacity * 100)}%`} overlay</div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Interactive Demo" description="Hover and click the buttons below to see state layers in action.">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <button className="ds-btn ds-btn-filled" style={{ cursor: 'pointer' }}>Hover Me</button>
          <button className="ds-btn ds-btn-outlined" style={{ cursor: 'pointer' }}>Hover Me</button>
          <button className="ds-btn ds-btn-tonal" style={{ cursor: 'pointer' }}>Hover Me</button>
          <button className="ds-btn ds-btn-text" style={{ cursor: 'pointer' }}>Hover Me</button>
        </div>
      </SubSection>

      <SubSection title="State Tokens">
        <table className="ds-token-table">
          <thead>
            <tr><th>State</th><th>Overlay Opacity</th><th>Description</th></tr>
          </thead>
          <tbody>
            {STATES.map(s => (
              <tr key={s.name}>
                <td className="token-name">{s.name}</td>
                <td className="token-value">{s.opacity}</td>
                <td>{s.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SubSection>
    </section>
  )
}
