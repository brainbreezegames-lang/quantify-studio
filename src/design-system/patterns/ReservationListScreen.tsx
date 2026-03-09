import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

const reservations = [
  { project: 'Highrise Tower West', resNum: '10482', items: 450, date: 'Feb 28', status: 'shipped', statusColor: 'var(--av-teal)' },
  { project: 'Metro Station Retrofit', resNum: '10479', items: 280, date: 'Feb 27', status: 'pending', statusColor: 'var(--av-warning)' },
  { project: 'Harbor Bridge Repair', resNum: '10475', items: 1120, date: 'Feb 25', status: 'shipped', statusColor: 'var(--av-teal)' },
  { project: 'Central Plaza Phase 2', resNum: '10471', items: 630, date: 'Feb 24', status: 'delivered', statusColor: 'var(--av-blue)' },
  { project: 'Riverside Office Park', resNum: '10468', items: 340, date: 'Feb 22', status: 'pending', statusColor: 'var(--av-warning)' },
]

const filters = ['All', 'Pending', 'Shipped', 'Delivered']

export default function ReservationListScreen() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [activeTab, setActiveTab] = useState(0)

  const filteredReservations = activeFilter === 'All'
    ? reservations
    : reservations.filter(r => r.status.toLowerCase() === activeFilter.toLowerCase())

  return (
    <PhoneFrame title="Reservation List" description="Main list view with filter chips, FAB, and bottom navigation.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568 }}>
        {/* Toolbar */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
          <div className="ds-toolbar-center">Reservations</div>
          <div className="ds-toolbar-end">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: 8, padding: '10px 12px', overflowX: 'auto', background: 'var(--av-bg)' }}>
          {filters.map((filter) => (
            <button
              key={filter}
              className={`ds-chip${activeFilter === filter ? ' selected' : ''}`}
              style={{ height: 28, fontSize: 12, padding: '0 12px' }}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          {filteredReservations.map((res, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderBottom: '1px solid var(--av-surface-3)',
                cursor: 'pointer',
                background: 'var(--av-bg)',
              }}
            >
              {/* Status dot */}
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: res.statusColor, flexShrink: 0 }} />
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {res.project}
                </div>
                <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', marginTop: 2 }}>
                  Res #{res.resNum} &middot; {res.items} items
                </div>
              </div>
              {/* Date + chevron */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: 'var(--av-on-surface-variant)' }}>{res.date}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--av-outline)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </div>
          ))}

          {/* FAB */}
          <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
            <button className="ds-fab primary" style={{ width: 48, height: 48 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="ds-bottom-nav" style={{ height: 64, borderRadius: 0 }}>
          <button className={`ds-bottom-nav-item${activeTab === 0 ? ' active' : ''}`} onClick={() => setActiveTab(0)}>
            {activeTab === 0 ? (
              <div className="nav-indicator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              </div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            )}
            <span style={{ fontSize: 11 }}>Home</span>
          </button>
          <button className={`ds-bottom-nav-item${activeTab === 1 ? ' active' : ''}`} onClick={() => setActiveTab(1)}>
            {activeTab === 1 ? (
              <div className="nav-indicator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
              </div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
            )}
            <span style={{ fontSize: 11 }}>Reservations</span>
          </button>
          <button className={`ds-bottom-nav-item${activeTab === 2 ? ' active' : ''}`} onClick={() => setActiveTab(2)}>
            {activeTab === 2 ? (
              <div className="nav-indicator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
              </div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
            )}
            <span style={{ fontSize: 11 }}>Inventory</span>
          </button>
          <button className={`ds-bottom-nav-item${activeTab === 3 ? ' active' : ''}`} onClick={() => setActiveTab(3)}>
            {activeTab === 3 ? (
              <div className="nav-indicator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              </div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            )}
            <span style={{ fontSize: 11 }}>Settings</span>
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}
