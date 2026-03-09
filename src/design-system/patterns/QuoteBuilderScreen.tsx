import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

const initialLineItems = [
  { name: 'Standard Frame 48"', qty: 450, rate: 2.50 },
  { name: 'Standard Brace', qty: 120, rate: 1.80 },
  { name: 'Scaffold Plank 10\'', qty: 80, rate: 3.20 },
]

export default function QuoteBuilderScreen() {
  const [quantities, setQuantities] = useState(initialLineItems.map(item => item.qty))

  const updateQty = (index: number, delta: number) => {
    setQuantities(prev => {
      const next = [...prev]
      next[index] = Math.max(0, next[index] + delta)
      return next
    })
  }

  const lineItems = initialLineItems.map((item, i) => ({
    ...item,
    qty: quantities[i],
    subtotal: quantities[i] * item.rate,
  }))

  const dailyRate = lineItems.reduce((sum, item) => sum + item.subtotal, 0)
  const duration = 30
  const deliveryFee = 450
  const total = dailyRate * duration + deliveryFee

  return (
    <PhoneFrame title="Quote Builder" description="Rental price quote builder with line items, quantity steppers, and summary.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568, background: 'var(--av-bg)' }}>
        {/* Toolbar */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="ds-toolbar-center" style={{ fontSize: 14 }}>New Quote</div>
          <div className="ds-toolbar-end" style={{ paddingRight: 4 }}>
            <button className="ds-btn ds-btn-text" style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-blue)' }}>Send</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
          {/* Client Info Card */}
          <div className="ds-card ds-card-filled" style={{ padding: '12px 14px', marginBottom: 14, borderRadius: 'var(--av-radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface)' }}>Riverside Tower Project</div>
                <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', marginTop: 2 }}>Morrison Construction</div>
              </div>
              <span style={{
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--av-blue)',
                background: 'var(--av-blue-50)',
                borderRadius: 'var(--av-radius-full)',
                padding: '3px 8px',
                fontFamily: 'var(--av-font-mono)',
                whiteSpace: 'nowrap',
              }}>
                QT-2026-0089
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-on-surface)', marginBottom: 10 }}>Line Items</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 8 }}>
            {lineItems.map((item, i) => (
              <div key={i} style={{
                padding: '10px 0',
                borderBottom: '1px solid var(--av-surface-3)',
              }}>
                {/* Row 1: Name + delete */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--av-on-surface)' }}>{item.name}</span>
                  <button style={{
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: 'var(--av-radius-sm)',
                    padding: 0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--av-outline)" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
                {/* Row 2: Qty stepper + rate + subtotal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="ds-stepper" style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}>
                    <button
                      className="ds-stepper-btn"
                      style={{ width: 28, height: 28, fontSize: 14 }}
                      onClick={() => updateQty(i, -10)}
                    >-</button>
                    <div className="ds-stepper-value" style={{ width: 40, fontSize: 11, padding: '4px 0' }}>{item.qty}</div>
                    <button
                      className="ds-stepper-btn"
                      style={{ width: 28, height: 28, fontSize: 14 }}
                      onClick={() => updateQty(i, 10)}
                    >+</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--av-on-surface-variant)' }}>
                      ${item.rate.toFixed(2)}/day
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--av-on-surface)', fontFamily: 'var(--av-font-mono)' }}>
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Line Item */}
          <button className="ds-btn ds-btn-text" style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--av-blue)',
            padding: '4px 0',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Add Line Item
          </button>

          {/* Duration Section */}
          <div style={{
            padding: '10px 12px',
            background: 'var(--av-surface-2)',
            borderRadius: 'var(--av-radius-md)',
            marginBottom: 14,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--av-on-surface-variant)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Rental Period</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-on-surface)' }}>{duration} days</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)' }}>Mar 15 - Apr 14, 2026</div>
          </div>

          {/* Summary Card */}
          <div className="ds-card ds-card-elevated" style={{ padding: '14px 16px', borderRadius: 'var(--av-radius-lg)' }}>
            {/* Daily Rate */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--av-on-surface-variant)' }}>Daily Rate</span>
              <span style={{ fontSize: 12, color: 'var(--av-on-surface)', fontFamily: 'var(--av-font-mono)' }}>${dailyRate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            {/* Duration */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--av-on-surface-variant)' }}>Duration</span>
              <span style={{ fontSize: 12, color: 'var(--av-on-surface)', fontFamily: 'var(--av-font-mono)' }}>{duration} days</span>
            </div>
            {/* Delivery Fee */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--av-on-surface-variant)' }}>Delivery Fee</span>
              <span style={{ fontSize: 12, color: 'var(--av-on-surface)', fontFamily: 'var(--av-font-mono)' }}>${deliveryFee.toFixed(2)}</span>
            </div>
            {/* Divider */}
            <div className="ds-divider" style={{ margin: '0 0 10px' }} />
            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--av-on-surface)' }}>Total</span>
              <span style={{
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--av-navy)',
                fontFamily: 'var(--av-font-primary)',
              }}>
                ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}
