import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

const initialShipItems = [
  { name: 'Standard Frame 5\' x 6\'8"', qty: 120 },
  { name: 'Ledger 7\'', qty: 85 },
  { name: 'Cross Brace 7\' x 4\'', qty: 200 },
  { name: 'Base Plate', qty: 45 },
]

export default function ShipReservationScreen() {
  const [step, setStep] = useState(2)
  const [quantities, setQuantities] = useState(initialShipItems.map(item => item.qty))

  const updateQty = (index: number, delta: number) => {
    setQuantities(prev => {
      const next = [...prev]
      next[index] = Math.max(0, Math.min(initialShipItems[index].qty, next[index] + delta))
      return next
    })
  }

  const totalSteps = 3
  const progressPct = Math.round((step / totalSteps) * 100)

  return (
    <PhoneFrame title="Ship Reservation" description="Multi-step form with validation bar, item steppers, and navigation.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568 }}>
        {/* Toolbar — Edit mode: X left, verb button right */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start">
            <button className="ds-toolbar-btn" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface)', paddingLeft: 4 }}>Ship reservation</div>
          <div className="ds-toolbar-end" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--av-on-surface-variant)' }}>Step {step}/{totalSteps}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="ds-progress-linear" style={{ borderRadius: 0 }}>
          <div className="ds-progress-linear-fill" style={{ width: `${progressPct}%`, transition: 'width 0.3s ease' }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
          {/* Validation Bar */}
          <div className="ds-validation-bar info" style={{ padding: '10px 12px', fontSize: 12, marginBottom: 12, borderRadius: 'var(--av-radius-sm)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            {step === 1 ? 'Select items to ship' : step === 2 ? 'Review items before shipping' : 'Confirm shipment details'}
          </div>

          {/* Items with Steppers */}
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-on-surface)', marginBottom: 8 }}>Items to Ship</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {initialShipItems.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: i < initialShipItems.length - 1 ? '1px solid var(--av-surface-3)' : 'none',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--av-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', marginTop: 2 }}>
                    Available: {item.qty}
                  </div>
                </div>
                <div className="ds-stepper" style={{ transform: 'scale(0.85)', transformOrigin: 'right center' }}>
                  <button
                    className="ds-stepper-btn"
                    style={{ width: 30, height: 30, fontSize: 16 }}
                    onClick={() => updateQty(i, -5)}
                  >-</button>
                  <div className="ds-stepper-value" style={{ width: 44, fontSize: 12, padding: '6px 0' }}>{quantities[i]}</div>
                  <button
                    className="ds-stepper-btn"
                    style={{ width: 30, height: 30, fontSize: 16 }}
                    onClick={() => updateQty(i, 5)}
                  >+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Date */}
          <div className="ds-textfield" style={{ maxWidth: '100%', marginBottom: 16 }}>
            <input type="text" defaultValue="Mar 5, 2026" style={{ height: 48, fontSize: 13, padding: '20px 12px 6px' }} readOnly />
            <label style={{ left: 12, top: 6, fontSize: 11 }}>Delivery Date</label>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--av-on-surface-variant)', marginBottom: 6 }}>Notes</div>
            <div style={{
              width: '100%',
              minHeight: 72,
              padding: '10px 12px',
              border: '1px solid var(--av-outline)',
              borderRadius: 'var(--av-radius-sm)',
              fontSize: 13,
              color: 'var(--av-on-surface)',
              background: 'transparent',
              lineHeight: 1.5,
            }}>
              Deliver to gate B on the west side. Contact foreman on arrival.
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderTop: '1px solid var(--av-outline-variant)',
          background: 'var(--av-surface)',
        }}>
          <button
            className="ds-btn ds-btn-text"
            style={{ fontSize: 13, opacity: step <= 1 ? 0.5 : 1 }}
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
          >
            Back
          </button>
          <button
            className="ds-btn ds-btn-filled"
            style={{ fontSize: 13 }}
            onClick={() => setStep(prev => Math.min(totalSteps, prev + 1))}
          >
            {step >= totalSteps ? 'Ship' : 'Next'}
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}
