import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

const inventoryItems = [
  { name: 'Standard Frame 5\' x 6\'8"', available: 1240, total: 1500, status: 'In Stock' },
  { name: 'Ledger 7\'', available: 890, total: 1200, status: 'In Stock' },
  { name: 'Cross Brace 7\' x 4\'', available: 62, total: 800, status: 'Low Stock' },
  { name: 'Base Plate', available: 450, total: 600, status: 'In Stock' },
  { name: 'Screw Jack', available: 0, total: 300, status: 'Out of Stock' },
]

const categories = ['All', 'Frames', 'Ledgers', 'Braces']

export default function InventoryScreen() {
  const [activeCategory, setActiveCategory] = useState('All')

  return (
    <PhoneFrame title="Inventory" description="Searchable inventory list with category filters and stock status.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568 }}>
        {/* Toolbar */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start" style={{ paddingLeft: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--av-on-surface)' }}>Inventory</span>
          </div>
          <div className="ds-toolbar-center" />
          <div className="ds-toolbar-end">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>
          </div>
        </div>

        {/* Search Field */}
        <div style={{ padding: '8px 12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 12px',
            height: 40,
            background: 'var(--av-surface-2)',
            borderRadius: 'var(--av-radius-full)',
            border: '1px solid var(--av-outline-variant)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--av-outline)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <span style={{ fontSize: 13, color: 'var(--av-on-surface)', fontWeight: 400 }}>frame</span>
            <span style={{ fontSize: 13, color: 'transparent' }}>|</span>
          </div>
        </div>

        {/* Category Chips */}
        <div style={{ display: 'flex', gap: 8, padding: '6px 12px', overflowX: 'auto' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`ds-chip${activeCategory === cat ? ' selected' : ''}`}
              style={{ height: 28, fontSize: 12, padding: '0 12px' }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Inventory List */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {inventoryItems.map((item, i) => {
            const statusColor = item.status === 'Out of Stock'
              ? 'var(--av-error)'
              : item.status === 'Low Stock'
                ? 'var(--av-warning)'
                : 'var(--av-teal)'
            const pct = Math.round((item.available / item.total) * 100)
            return (
              <div key={i} style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--av-surface-3)',
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--av-on-surface)', flex: 1 }}>{item.name}</div>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: statusColor,
                    whiteSpace: 'nowrap',
                    marginLeft: 8,
                  }}>{item.status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 4, background: 'var(--av-surface-3)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: statusColor, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', fontFamily: 'var(--av-font-mono)', whiteSpace: 'nowrap' }}>
                    {item.available.toLocaleString()} / {item.total.toLocaleString()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Card */}
        <div style={{ padding: '0 12px 12px' }}>
          <div className="ds-card ds-card-filled" style={{ padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Available</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--av-on-surface)' }}>2,642</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Items</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--av-on-surface)' }}>4,400</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}
