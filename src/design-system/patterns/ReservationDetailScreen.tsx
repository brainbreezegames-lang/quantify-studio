import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

const items = [
  { name: 'Standard Frame 5\' x 6\'8"', qty: 120 },
  { name: 'Ledger 7\'', qty: 85 },
  { name: 'Cross Brace 7\' x 4\'', qty: 200 },
  { name: 'Base Plate', qty: 45 },
]

export default function ReservationDetailScreen() {
  const [status, setStatus] = useState<'pending' | 'shipped'>('pending')

  const statusConfig = {
    pending: {
      label: 'Pending',
      bg: 'var(--av-warning-container)',
      color: '#5D4300',
      dotColor: 'var(--av-warning)',
    },
    shipped: {
      label: 'Shipped',
      bg: 'var(--av-success-container)',
      color: 'var(--av-teal)',
      dotColor: 'var(--av-teal)',
    },
  }

  const currentStatus = statusConfig[status]

  return (
    <PhoneFrame title="Reservation Detail" description="Detail view with status badge, info card, items list, and actions.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568 }}>
        {/* Toolbar */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
          </div>
          <div className="ds-toolbar-center" style={{ fontSize: 14 }}>Reservation #10482</div>
          <div className="ds-toolbar-end">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
            </button>
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
          {/* Status Badge */}
          <div style={{ marginBottom: 12 }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 'var(--av-radius-full)',
              background: currentStatus.bg,
              color: currentStatus.color,
              fontSize: 12,
              fontWeight: 600,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: currentStatus.dotColor }} />
              {currentStatus.label}
            </span>
          </div>

          {/* Project Info Card */}
          <div className="ds-card ds-card-outlined" style={{ padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-on-surface)', marginBottom: 10 }}>Project Information</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Project</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--av-on-surface)' }}>Highrise Tower West</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Site Address</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--av-on-surface)' }}>1200 Commerce Blvd, Denver, CO</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Contact</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--av-on-surface)' }}>Mike Torres &middot; (303) 555-0142</div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-on-surface)', marginBottom: 8 }}>Items ({items.length})</div>
            <div style={{ border: '1px solid var(--av-outline-variant)', borderRadius: 'var(--av-radius-md)', overflow: 'hidden' }}>
              {items.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderBottom: i < items.length - 1 ? '1px solid var(--av-surface-3)' : 'none',
                  fontSize: 13,
                }}>
                  <span style={{ color: 'var(--av-on-surface)', fontWeight: 500 }}>{item.name}</span>
                  <span style={{ color: 'var(--av-on-surface-variant)', fontFamily: 'var(--av-font-mono)', fontSize: 12 }}>x{item.qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dates Section */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-on-surface)', marginBottom: 8 }}>Dates</div>
            <div className="ds-card ds-card-filled" style={{ padding: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Created', value: 'Feb 20, 2026' },
                  { label: 'Delivery', value: 'Mar 5, 2026' },
                  { label: 'Return', value: 'Apr 15, 2026' },
                ].map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--av-on-surface-variant)' }}>{d.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--av-on-surface)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, paddingBottom: 16 }}>
            <button
              className="ds-btn ds-btn-filled"
              style={{ flex: 1, height: 40, fontSize: 13 }}
              onClick={() => setStatus(status === 'pending' ? 'shipped' : 'pending')}
            >
              {status === 'pending' ? 'Ship' : 'Unship'}
            </button>
            <button className="ds-btn ds-btn-outlined" style={{ flex: 1, height: 40, fontSize: 13 }}>Edit</button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}
