import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

type Condition = 'good' | 'minor' | 'major' | 'missing' | null

const previousInspections = [
  { name: '48" Ledger', condition: 'Good', color: 'var(--av-teal)', bg: 'var(--av-success-container)' },
  { name: 'Standard Brace', condition: 'Minor Damage', color: '#5D4300', bg: 'var(--av-warning-container)' },
  { name: 'Base Plate', condition: 'Good', color: 'var(--av-teal)', bg: 'var(--av-success-container)' },
]

export default function ReturnInspectionScreen() {
  const [selectedCondition, setSelectedCondition] = useState<Condition>('good')

  const conditions: { key: Condition; label: string; color: string; bg: string }[] = [
    { key: 'good', label: 'Good', color: 'var(--av-teal)', bg: 'var(--av-success-container)' },
    { key: 'minor', label: 'Minor Damage', color: '#5D4300', bg: 'var(--av-warning-container)' },
    { key: 'major', label: 'Major Damage', color: 'var(--av-error)', bg: 'var(--av-error-container)' },
    { key: 'missing', label: 'Missing', color: 'var(--av-outline)', bg: 'var(--av-surface-3)' },
  ]

  return (
    <PhoneFrame title="Return Inspection" description="Equipment return inspection checklist with condition assessment and notes.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568, background: 'var(--av-bg)' }}>
        {/* Toolbar */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
          </div>
          <div className="ds-toolbar-center" style={{ fontSize: 14 }}>Return Inspection</div>
          <div className="ds-toolbar-end" style={{ paddingRight: 8 }}>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--av-blue)',
              background: 'var(--av-blue-50)',
              borderRadius: 'var(--av-radius-full)',
              padding: '3px 8px',
              fontFamily: 'var(--av-font-mono)',
            }}>
              RES-2024-0847
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ padding: '10px 16px 4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--av-on-surface)' }}>12 of 18 items inspected</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--av-blue)', fontFamily: 'var(--av-font-mono)' }}>67%</span>
          </div>
          <div className="ds-progress-linear" style={{ borderRadius: 'var(--av-radius-full)' }}>
            <div className="ds-progress-linear-fill" style={{ width: '67%' }} />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '10px 16px' }}>
          {/* Current Item Card */}
          <div className="ds-card ds-card-outlined" style={{ padding: '14px 16px', borderRadius: 'var(--av-radius-lg)', marginBottom: 14 }}>
            {/* Item header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface)' }}>48" Standard Frame</div>
                <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', fontFamily: 'var(--av-font-mono)', marginTop: 2 }}>TAG-02156</div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', fontWeight: 500 }}>Item 13 of 18</span>
            </div>

            {/* Photo placeholder */}
            <div style={{
              height: 72,
              background: 'var(--av-surface-2)',
              borderRadius: 'var(--av-radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              border: '1px dashed var(--av-outline-variant)',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--av-outline)" strokeWidth="2">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span style={{ fontSize: 10, color: 'var(--av-outline)' }}>Tap to add photo</span>
              </div>
            </div>

            {/* Condition selection */}
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--av-on-surface-variant)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Condition
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
              {conditions.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setSelectedCondition(c.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 10px',
                    borderRadius: 'var(--av-radius-md)',
                    border: selectedCondition === c.key ? `2px solid ${c.color}` : '1px solid var(--av-outline-variant)',
                    background: selectedCondition === c.key ? c.bg : 'transparent',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: selectedCondition === c.key ? 600 : 400,
                    color: selectedCondition === c.key ? c.color : 'var(--av-on-surface)',
                    fontFamily: 'var(--av-font-primary)',
                  }}
                >
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: 'var(--av-radius-full)',
                    border: selectedCondition === c.key ? 'none' : '2px solid var(--av-outline-variant)',
                    background: selectedCondition === c.key ? c.color : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {selectedCondition === c.key && (
                      <div style={{ width: 6, height: 6, borderRadius: 'var(--av-radius-full)', background: 'white' }} />
                    )}
                  </div>
                  {c.label}
                </button>
              ))}
            </div>

            {/* Notes field */}
            <div style={{
              width: '100%',
              minHeight: 40,
              padding: '8px 12px',
              border: '1px solid var(--av-outline-variant)',
              borderRadius: 'var(--av-radius-sm)',
              fontSize: 12,
              color: 'var(--av-outline)',
              background: 'transparent',
              fontFamily: 'var(--av-font-primary)',
            }}>
              Add inspection notes...
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button className="ds-btn ds-btn-text" style={{ fontSize: 12 }}>Skip</button>
              <button className="ds-btn ds-btn-outlined" style={{ fontSize: 12 }}>Flag for Review</button>
              <button className="ds-btn ds-btn-filled" style={{ fontSize: 12 }}>Next Item</button>
            </div>
          </div>

          {/* Previous Inspections */}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--av-on-surface-variant)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
            Previous Inspections
          </div>
          {previousInspections.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: i < previousInspections.length - 1 ? '1px solid var(--av-surface-3)' : 'none',
            }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--av-on-surface)' }}>{item.name}</span>
              <span style={{
                fontSize: 10,
                fontWeight: 600,
                color: item.color,
                background: item.bg,
                borderRadius: 'var(--av-radius-full)',
                padding: '2px 8px',
              }}>
                {item.condition}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  )
}
