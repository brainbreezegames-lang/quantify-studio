import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'

const DURATIONS = [
  { name: 'Fast', value: '150ms', variable: '--av-duration-fast', use: 'Hover states, ripples, small toggles' },
  { name: 'Medium', value: '300ms', variable: '--av-duration-medium', use: 'Page transitions, expand/collapse, card flips' },
  { name: 'Slow', value: '500ms', variable: '--av-duration-slow', use: 'Complex animations, stagger sequences, page loads' },
]

const EASINGS = [
  { name: 'Standard', value: 'cubic-bezier(0.2, 0, 0, 1)', variable: '--av-ease', desc: 'MD3 standard easing. Used for most transitions. Starts quickly, decelerates naturally.' },
  { name: 'Emphasized', value: 'cubic-bezier(0.05, 0.7, 0.1, 1)', desc: 'Dramatic deceleration for attention-grabbing entrances.' },
  { name: 'Linear', value: 'linear', desc: 'Constant speed for progress bars and spinners.' },
]

export default function MotionSection() {
  const [demoKey, setDemoKey] = useState(0)
  const [expanded, setExpanded] = useState(false)

  return (
    <section id="motion" className="ds-section">
      <SectionHeader
        label="Foundation"
        title="Motion"
        description="Easing curves, durations, and animation tokens for purposeful motion."
      />

      <SubSection title="Duration Tokens" description="Three duration levels cover all animation needs. Faster for micro-interactions, slower for complex transitions.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {DURATIONS.map(d => (
            <div key={d.name} className="ds-card ds-card-outlined" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--av-blue)', marginBottom: 4 }}>{d.value}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{d.name}</div>
              <div style={{ fontFamily: 'var(--av-font-mono)', fontSize: 11, color: 'var(--av-blue)', marginBottom: 8 }}>{d.variable}</div>
              <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)' }}>{d.use}</div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Easing Curves" description="Easing controls the rate of change. The standard MD3 easing feels natural and responsive.">
        <div style={{ display: 'grid', gap: 16 }}>
          {EASINGS.map(e => (
            <div key={e.name} className="ds-card ds-card-outlined" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ width: 80, height: 80, borderRadius: 'var(--av-radius-md)', background: 'var(--av-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', background: 'var(--av-blue)',
                  animation: `ease-demo-${e.name.toLowerCase()} 2s ${e.value} infinite alternate`,
                }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{e.name}</div>
                <div style={{ fontFamily: 'var(--av-font-mono)', fontSize: 11, color: 'var(--av-blue)', margin: '4px 0' }}>{e.value}</div>
                <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)' }}>{e.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Animation Patterns" description="Common animation patterns used throughout the design system.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          <div className="ds-card ds-card-outlined" style={{ padding: 20, overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Fade In Up</div>
            <div
              key={demoKey}
              style={{
                padding: 16, background: 'var(--av-blue-50)', borderRadius: 'var(--av-radius-md)',
                textAlign: 'center', fontSize: 13, fontWeight: 500, color: 'var(--av-blue)',
                animation: 'fadeInUp 0.5s var(--av-ease) both',
              }}
            >
              Content appears
            </div>
            <button
              onClick={() => setDemoKey(k => k + 1)}
              className="ds-btn ds-btn-text"
              style={{ marginTop: 12, fontSize: 12, height: 32, padding: '0 12px' }}
            >
              Replay
            </button>
          </div>
          <div className="ds-card ds-card-outlined" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Expand / Collapse</div>
            <div style={{
              overflow: 'hidden',
              maxHeight: expanded ? 120 : 0,
              transition: 'max-height var(--av-duration-medium) var(--av-ease)',
              background: 'var(--av-blue-50)',
              borderRadius: 'var(--av-radius-md)',
            }}>
              <div style={{ padding: 16, fontSize: 13, color: 'var(--av-blue)' }}>
                Hidden content revealed with smooth height transition.
              </div>
            </div>
            <button
              onClick={() => setExpanded(e => !e)}
              className="ds-btn ds-btn-text"
              style={{ marginTop: 12, fontSize: 12, height: 32, padding: '0 12px' }}
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
          <div className="ds-card ds-card-outlined" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Spinner</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="ds-progress-circular" />
              <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)' }}>Infinite rotation at constant speed (linear easing)</div>
            </div>
          </div>
        </div>
      </SubSection>

      <SubSection title="Motion Principles">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {[
            { title: 'Purposeful', desc: 'Every animation should serve a function — guide focus, show relationships, or confirm actions. Never animate purely for decoration.' },
            { title: 'Quick', desc: 'Animations should feel instantaneous. Users should never wait for an animation to complete before they can act.' },
            { title: 'Natural', desc: 'Use easing curves that mimic real-world physics. Elements should accelerate and decelerate naturally.' },
            { title: 'Consistent', desc: 'Similar interactions should have similar animations. Consistent motion builds user confidence and reduces cognitive load.' },
          ].map(p => (
            <div key={p.title} className="ds-card ds-card-filled" style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{p.title}</div>
              <p style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </SubSection>
    </section>
  )
}
