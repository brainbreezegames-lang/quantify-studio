import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'

const BRAND_COLORS = [
  { name: 'Avontus Blue', value: '#0005EE', variable: '--av-blue', textColor: '#fff', desc: 'Primary brand color. Used for CTAs, links, active states, and primary actions.' },
  { name: 'Navy', value: '#062175', variable: '--av-navy', textColor: '#fff', desc: 'Deep accent for headers, backgrounds, and high-contrast surfaces.' },
  { name: 'Light Blue', value: '#40ABFF', variable: '--av-light-blue', textColor: '#fff', desc: 'Secondary accent for illustrations, highlights, and secondary actions.' },
  { name: 'Teal', value: '#009B86', variable: '--av-teal', textColor: '#fff', desc: 'Success states, positive indicators, and environmental themes.' },
  { name: 'Green', value: '#6BE09E', variable: '--av-green', textColor: '#000', desc: 'Light positive accent for badges, tags, and completion states.' },
  { name: 'Yellow', value: '#FFD91A', variable: '--av-yellow', textColor: '#000', desc: 'Warning states, attention markers, and highlight accents.' },
]

const BLUE_SCALE = [
  { label: '50', value: '#E8E9FD', textColor: '#000' },
  { label: '100', value: '#C5C7FA', textColor: '#000' },
  { label: '200', value: '#9EA1F7', textColor: '#000' },
  { label: '300', value: '#678DF4', textColor: '#fff' },
  { label: '400', value: '#3344F1', textColor: '#fff' },
  { label: '500', value: '#0005EE', textColor: '#fff' },
  { label: '600', value: '#0004D6', textColor: '#fff' },
  { label: '700', value: '#0004B3', textColor: '#fff' },
  { label: '800', value: '#000390', textColor: '#fff' },
  { label: '900', value: '#000377', textColor: '#fff' },
]

const EXTENDED_PALETTES = [
  {
    name: 'Navy',
    steps: [
      { label: 'Light', value: '#384D91', textColor: '#fff' },
      { label: 'Default', value: '#062175', textColor: '#fff' },
      { label: 'Dark', value: '#03113B', textColor: '#fff' },
    ]
  },
  {
    name: 'Light Blue',
    steps: [
      { label: 'Light', value: '#8CCDFF', textColor: '#000' },
      { label: 'Default', value: '#40ABFF', textColor: '#fff' },
      { label: 'Dark', value: '#205680', textColor: '#fff' },
    ]
  },
  {
    name: 'Teal',
    steps: [
      { label: 'Light', value: '#66C3B6', textColor: '#000' },
      { label: 'Default', value: '#009B86', textColor: '#fff' },
      { label: 'Dark', value: '#004E43', textColor: '#fff' },
    ]
  },
  {
    name: 'Green',
    steps: [
      { label: 'Light', value: '#A6ECC5', textColor: '#000' },
      { label: 'Default', value: '#6BE09E', textColor: '#000' },
      { label: 'Dark', value: '#36704F', textColor: '#fff' },
    ]
  },
]

const SEMANTIC_COLORS = [
  { name: 'Error', value: '#D32F2F', container: '#FFDAD6', onContainer: '#5F1412', icon: '!' },
  { name: 'Warning', value: '#F9A825', container: '#FFF3CD', onContainer: '#5D4300', icon: '⚠' },
  { name: 'Info', value: '#0005EE', container: '#E8E9FD', onContainer: '#000377', icon: 'i' },
  { name: 'Success', value: '#009B86', container: '#C8F5ED', onContainer: '#004E43', icon: '✓' },
]

const SURFACE_COLORS = [
  { name: 'Background', value: '#FFFFFF', variable: '--av-bg' },
  { name: 'Surface', value: '#FAFBFF', variable: '--av-surface' },
  { name: 'Surface 2', value: '#F0F3FF', variable: '--av-surface-2' },
  { name: 'Surface 3', value: '#E3E8F9', variable: '--av-surface-3' },
  { name: 'On Surface', value: '#1C1B1F', variable: '--av-on-surface' },
  { name: 'On Surface Variant', value: '#49454F', variable: '--av-on-surface-variant' },
  { name: 'Outline', value: '#79747E', variable: '--av-outline' },
  { name: 'Outline Variant', value: '#CAC4D0', variable: '--av-outline-variant' },
]

function CopyableValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--av-font-mono)',
        fontSize: 12, color: copied ? 'var(--av-teal)' : 'var(--av-on-surface-variant)',
        padding: '2px 4px', borderRadius: 4, transition: 'color 150ms',
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
        description="Brand, semantic, and surface palettes organized for systematic use."
      />

      <SubSection title="Brand Colors" description="The six core brand colors form the foundation of the visual identity. Avontus Blue is the primary color used for all key interactive elements.">
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

      <SubSection title="Blue Scale" description="The primary blue expanded into a 10-step tonal scale. Use lighter values for backgrounds and containers, darker values for emphasis and active states.">
        <div className="ds-color-scale">
          {BLUE_SCALE.map(s => (
            <div key={s.label} className="ds-color-scale-step" style={{ background: s.value, color: s.textColor }}>
              <span className="step-label">{s.label}<br />{s.value}</span>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Extended Palettes" description="Light and dark variants for secondary brand colors, used for tinted surfaces, badges, and visual hierarchy.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {EXTENDED_PALETTES.map(palette => (
            <div key={palette.name}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--av-on-surface)' }}>{palette.name}</div>
              <div className="ds-color-scale" style={{ flexDirection: 'column' }}>
                {palette.steps.map(s => (
                  <div key={s.label} className="ds-color-scale-step" style={{ background: s.value, color: s.textColor, height: 48, flex: 'none' }}>
                    <span className="step-label">{s.label} · {s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Semantic Colors" description="Purpose-driven colors for communicating status, validation, and feedback. Each semantic color includes a container variant for backgrounds.">
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

      <SubSection title="Surface & Neutral Colors" description="Background, surface, and text colors that create visual depth and hierarchy. These remain consistent across the application.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {SURFACE_COLORS.map(c => {
            const isDark = c.value === '#1C1B1F' || c.value === '#49454F' || c.value === '#79747E'
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
