import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'

export default function BrandSection() {
  return (
    <section id="brand" className="ds-section">
      <SectionHeader
        label="Foundation"
        title="Brand Identity"
        description="Logo, colors, and voice guidelines for consistent Avontus branding."
      />

      <SubSection title="Brand Overview" description="Avontus is the world leader in scaffold and access solutions, providing software that helps scaffold companies plan, manage, and optimize their operations.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          <div className="ds-card ds-card-outlined" style={{ padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)', marginBottom: 8 }}>Mission</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--av-on-surface-variant)', margin: 0 }}>
              Empowering scaffold companies worldwide with intelligent software solutions that streamline operations and drive growth.
            </p>
          </div>
          <div className="ds-card ds-card-outlined" style={{ padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)', marginBottom: 8 }}>Tagline</div>
            <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--av-navy)', margin: 0, letterSpacing: '-0.5px' }}>
              "Reach New Heights"
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

      <SubSection title="Brand Voice" description="Avontus communicates with clarity, confidence, and approachability. These three pillars guide all written and visual communication.">
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

      <SubSection title="Logo Usage" description="The Avontus logo uses the brand's primary blue. Always maintain clear space around the logo equal to the height of the 'A' character.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="ds-card ds-card-filled" style={{ padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--av-blue)', letterSpacing: '-1px' }}>AVONTUS</span>
          </div>
          <div style={{ padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--av-navy)', borderRadius: 'var(--av-radius-lg)' }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>AVONTUS</span>
          </div>
        </div>
      </SubSection>

      <SubSection title="The 107° Motif" description="A signature diagonal element used at 107° throughout the brand. It appears in backgrounds, dividers, and graphic treatments to create dynamic visual energy.">
        <div style={{
          height: 160,
          background: 'var(--av-blue)',
          borderRadius: 'var(--av-radius-lg)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: '70%',
            height: '180%',
            background: 'linear-gradient(107deg, transparent 0%, transparent 40%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.06) 100%)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20%',
            left: '30%',
            width: '60%',
            height: '160%',
            background: 'linear-gradient(107deg, transparent 0%, transparent 45%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.03) 100%)',
          }} />
          <span style={{ position: 'relative', zIndex: 1, color: '#fff', fontSize: 48, fontWeight: 300, opacity: 0.4, fontFamily: 'var(--av-font-mono)' }}>107°</span>
        </div>
      </SubSection>
    </section>
  )
}
