import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'

export default function BrandSection() {
  return (
    <section id="brand" className="ds-section">
      <SectionHeader
        label="Foundation"
        title="Brand Identity"
        description="Logo, colors, and voice guidelines for consistent Quantify branding."
      />

      <SubSection title="Brand Overview" description="Quantify is the leading scaffold and access management platform by Avontus, helping scaffold companies plan, manage, and optimize their operations.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          <div className="ds-card ds-card-outlined" style={{ padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)', marginBottom: 8 }}>Design Language</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--av-on-surface-variant)', margin: 0 }}>
              <strong>Probe</strong> — Sharp geometric aesthetic with monochromatic blue palette, 0px border radius default, and Switzer typeface.
            </p>
          </div>
          <div className="ds-card ds-card-outlined" style={{ padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)', marginBottom: 8 }}>Aesthetic</div>
            <p style={{ fontSize: 24, fontWeight: 500, color: 'var(--av-navy)', margin: 0, letterSpacing: '-0.5px', fontFamily: 'var(--av-font-primary)' }}>
              Sharp · Clean · Precise
            </p>
          </div>
          <div className="ds-card ds-card-outlined" style={{ padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)', marginBottom: 8 }}>Product</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--av-on-surface-variant)', margin: 0 }}>
              <strong>Quantify</strong> — Mobile and web application for scaffold reservation management, inventory tracking, and field operations.
            </p>
          </div>
        </div>
      </SubSection>

      <SubSection title="Brand Voice" description="Quantify communicates with clarity, confidence, and precision. These three pillars guide all written and visual communication.">
        <div className="ds-voice-grid">
          <div className="ds-voice-card">
            <h4>Professional</h4>
            <p>Expert, reliable, authoritative. We speak from deep industry knowledge. Technical accuracy is paramount — we never oversimplify critical information.</p>
          </div>
          <div className="ds-voice-card">
            <h4>Approachable</h4>
            <p>Clear, friendly, supportive. Complex software should feel simple. We guide users with patience and avoid jargon unless it's industry standard.</p>
          </div>
          <div className="ds-voice-card">
            <h4>Forward-thinking</h4>
            <p>Innovative, ambitious, growth-oriented. We help companies reach new heights. Our language reflects modern technology and continuous improvement.</p>
          </div>
        </div>
      </SubSection>

      <SubSection title="Logo Usage" description="The Quantify wordmark uses the brand's primary Blue Main. Always maintain clear space around the logo.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="ds-card ds-card-filled" style={{ padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 32, fontWeight: 500, color: 'var(--av-blue)', letterSpacing: '-1px', fontFamily: 'var(--av-font-primary)' }}>QUANTIFY</span>
          </div>
          <div style={{ padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--av-navy)', borderRadius: 'var(--av-radius-lg)' }}>
            <span style={{ fontSize: 32, fontWeight: 500, color: '#fff', letterSpacing: '-1px', fontFamily: 'var(--av-font-primary)' }}>QUANTIFY</span>
          </div>
        </div>
      </SubSection>

      <SubSection title="Design Principles" description="The Probe design language is built on sharp geometry, generous whitespace, and a monochromatic blue palette that creates a confident, modern interface.">
        <div style={{
          height: 160,
          background: 'var(--av-blue)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, transparent 0%, transparent 50%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.04) 100%)',
          }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 48, color: '#fff', fontFamily: 'var(--av-font-primary)', fontSize: 14, fontWeight: 500, letterSpacing: '-0.02em' }}>
            <span style={{ opacity: 0.7 }}>0px radius</span>
            <span style={{ opacity: 0.7 }}>Switzer 500</span>
            <span style={{ opacity: 0.7 }}>Monochromatic Blue</span>
            <span style={{ opacity: 0.7 }}>Sharp Geometry</span>
          </div>
        </div>
      </SubSection>
    </section>
  )
}
