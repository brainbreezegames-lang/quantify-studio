import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'

const BRAND_COLORS = [
  { name: 'Blue Main', value: '#0A3EFF', variable: '--av-blue', textColor: '#fff', desc: 'Primary brand color. Used for CTAs, links, active states, and primary actions.' },
  { name: 'Blue Medium', value: '#6F9DFF', variable: '--av-light-blue', textColor: '#10296E', desc: 'Secondary accent for illustrations, highlights, tinted surfaces, and hover states.' },
  { name: 'Blue Dark', value: '#10296E', variable: '--av-navy', textColor: '#fff', desc: 'Deep accent for headers, high-contrast surfaces, and authoritative elements.' },
]

const BLUE_SCALE = [
  { label: 'Lightest', value: '#E8EEFF', textColor: '#10296E' },
  { label: '100', value: '#C5D4FF', textColor: '#10296E' },
  { label: '200', value: '#9DB5FF', textColor: '#10296E' },
  { label: 'Medium', value: '#6F9DFF', textColor: '#10296E' },
  { label: '400', value: '#3A6BFF', textColor: '#fff' },
  { label: 'Main', value: '#0A3EFF', textColor: '#fff' },
  { label: '600', value: '#0835D6', textColor: '#fff' },
  { label: '700', value: '#062BB3', textColor: '#fff' },
  { label: 'Dark', value: '#10296E', textColor: '#fff' },
  { label: 'Darkest', value: '#0A1A4A', textColor: '#fff' },
]

const GRAY_SCALE = [
  { label: 'White', value: '#FFFFFF', textColor: '#202020' },
  { label: '50', value: '#F8F8F8', textColor: '#202020' },
  { label: '100', value: '#EEEEEE', textColor: '#202020' },
  { label: '200', value: '#D4D4D4', textColor: '#202020' },
  { label: '300', value: '#ABABAB', textColor: '#202020' },
  { label: '400', value: '#787878', textColor: '#fff' },
  { label: '500', value: '#545454', textColor: '#fff' },
  { label: '600', value: '#363636', textColor: '#fff' },
  { label: 'Black', value: '#202020', textColor: '#fff' },
]

const SEMANTIC_COLORS = [
  { name: 'Error', value: '#E64059', container: '#FFE5E9', onContainer: '#5F1422', icon: '!' },
  { name: 'Warning', value: '#F9A825', container: '#FFF3CD', onContainer: '#5D4300', icon: '⚠' },
  { name: 'Info', value: '#0A3EFF', container: '#E8EEFF', onContainer: '#10296E', icon: 'i' },
  { name: 'Success', value: '#22C55E', container: '#DCFCE7', onContainer: '#14532D', icon: '✓' },
]

const SURFACE_COLORS = [
  { name: 'Background', value: '#FFFFFF', variable: '--av-bg' },
  { name: 'Surface', value: '#F8F8F8', variable: '--av-surface' },
  { name: 'Surface 2', value: '#EEEEEE', variable: '--av-surface-2' },
  { name: 'Surface 3', value: '#D4D4D4', variable: '--av-surface-3' },
  { name: 'On Surface', value: '#202020', variable: '--av-on-surface' },
  { name: 'On Surface Variant', value: '#545454', variable: '--av-on-surface-variant' },
  { name: 'Outline', value: '#ABABAB', variable: '--av-outline' },
  { name: 'Outline Variant', value: '#D4D4D4', variable: '--av-outline-variant' },
]

function CopyableValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--av-font-mono)',
        fontSize: 12, color: copied ? 'var(--av-success)' : 'var(--av-on-surface-variant)',
        padding: '2px 4px', transition: 'color 150ms',
      }}
      title="Click to copy"
    >
      {copied ? 'Copied!' : value}
    </button>
  )
}

export default function ColorSection() {
  return (
    <section id="colors" className="ds-section">
      <SectionHeader
        label="Foundation"
        title="Color System"
        description="Monochromatic blue palette with neutral gray surfaces. Clean, focused, precise."
      />

      <SubSection title="Brand Colors" description="Three core brand colors form the Probe visual identity. Blue Main is the primary color for all interactive elements. The palette is intentionally monochromatic.">
        <div className="ds-color-grid">
          {BRAND_COLORS.map(c => (
            <div key={c.name} className="ds-color-card">
              <div className="ds-color-swatch" style={{ background: c.value }}>
                <span className="ds-color-swatch-label" style={{ color: c.textColor, background: c.textColor === '#fff' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.6)' }}>
                  {c.name}
                </span>
              </div>
              <div className="ds-color-info">
                <div className="ds-color-name">{c.name}</div>
                <CopyableValue value={c.value} />
                <p style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', margin: '6px 0 0', lineHeight: 1.4 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Blue Scale" description="The primary blue expanded into a 10-step tonal scale. Lighter values for backgrounds and containers, darker values for emphasis and depth.">
        <div className="ds-color-scale">
          {BLUE_SCALE.map(s => (
            <div key={s.label} className="ds-color-scale-step" style={{ background: s.value, color: s.textColor }}>
              <span className="step-label">{s.label}<br />{s.value}</span>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Gray Scale" description="Nine-step neutral gray scale from pure white to light black. Used for surfaces, text, borders, and visual hierarchy. No blue tint — pure neutral.">
        <div className="ds-color-scale">
          {GRAY_SCALE.map(s => (
            <div key={s.label} className="ds-color-scale-step" style={{ background: s.value, color: s.textColor }}>
              <span className="step-label">{s.label}<br />{s.value}</span>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Semantic Colors" description="Purpose-driven colors for communicating status, validation, and feedback. Each includes a container variant for backgrounds.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {SEMANTIC_COLORS.map(c => (
            <div key={c.name} className="ds-card ds-card-outlined" style={{ overflow: 'hidden' }}>
              <div style={{ height: 48, background: c.value, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{c.icon}</span>
              </div>
              <div style={{ padding: '12px 16px', background: c.container }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: c.onContainer }}>{c.name} Container</div>
                <div style={{ fontFamily: 'var(--av-font-mono)', fontSize: 11, color: c.onContainer, opacity: 0.8 }}>{c.container}</div>
              </div>
              <div style={{ padding: '12px 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                <CopyableValue value={c.value} />
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Surface & Neutral Colors" description="Background, surface, and text colors that create visual depth. Pure neutral grays with no color tint.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {SURFACE_COLORS.map(c => {
            const isDark = c.value === '#202020' || c.value === '#545454' || c.value === '#ABABAB'
            return (
              <div key={c.name} className="ds-card ds-card-outlined" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ height: 56, background: c.value, border: c.value === '#FFFFFF' ? '1px solid var(--av-outline-variant)' : 'none', borderBottom: 'none' }} />
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontFamily: 'var(--av-font-mono)', fontSize: 11, color: 'var(--av-on-surface-variant)' }}>{c.value}</div>
                  <div style={{ fontFamily: 'var(--av-font-mono)', fontSize: 10, color: 'var(--av-blue)', marginTop: 2 }}>{c.variable}</div>
                </div>
              </div>
            )
          })}
        </div>
      </SubSection>
    </section>
  )
}
