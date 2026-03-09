import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

const summaryCards = [
  { label: 'Active Reservations', value: '12', color: 'var(--av-blue)' },
  { label: 'Items Out', value: '1,450', color: 'var(--av-teal)' },
  { label: 'Due This Week', value: '3', color: 'var(--av-warning)' },
]

const recentActivity = [
  { action: 'Reservation #10482 shipped', project: 'Highrise Tower West', time: '2 hrs ago', icon: 'ship' },
  { action: 'New reservation created', project: 'Metro Station Retrofit', time: '5 hrs ago', icon: 'add' },
  { action: 'Return completed', project: 'Central Plaza Phase 2', time: 'Yesterday', icon: 'check' },
  { action: 'Items added to #10468', project: 'Riverside Office Park', time: 'Yesterday', icon: 'edit' },
]

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <PhoneFrame title="Dashboard" description="Overview with summary metrics, recent activity feed, and navigation.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568 }}>
        {/* Toolbar */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start" style={{ paddingLeft: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--av-on-surface)' }}>Dashboard</span>
          </div>
          <div className="ds-toolbar-center" />
          <div className="ds-toolbar-end">
            <button className="ds-toolbar-btn" style={{ position: 'relative' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
              {/* Badge */}
              <span style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--av-error)',
                border: '2px solid var(--av-surface)',
              }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 12px 0' }}>
          {/* Summary Cards */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {summaryCards.map((card, i) => (
              <div key={i} className="ds-card ds-card-outlined" style={{
                flex: 1,
                padding: '12px 10px',
                textAlign: 'center',
                borderRadius: 'var(--av-radius-md)',
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: card.color, marginBottom: 4 }}>{card.value}</div>
                <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--av-on-surface-variant)', lineHeight: 1.3 }}>{card.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-on-surface)', marginBottom: 10 }}>Recent Activity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {recentActivity.map((item, i) => {
                let iconSvg
                let iconBg = 'var(--av-blue-50)'
                let iconColor = 'var(--av-blue)'
                if (item.icon === 'ship') {
                  iconBg = 'var(--av-success-container)'
                  iconColor = 'var(--av-teal)'
                  iconSvg = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2"><path d="M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1"/><path d="M12 15l5 6H7l5-6z"/></svg>
                } else if (item.icon === 'add') {
                  iconSvg = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                } else if (item.icon === 'check') {
                  iconBg = 'var(--av-success-container)'
                  iconColor = 'var(--av-teal)'
                  iconSvg = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                } else {
                  iconBg = 'var(--av-warning-container)'
                  iconColor = '#5D4300'
                  iconSvg = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2"><path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
                }
                return (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '10px 0',
                    borderBottom: i < recentActivity.length - 1 ? '1px solid var(--av-surface-3)' : 'none',
                  }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--av-radius-full)',
                      background: iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}>
                      {iconSvg}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--av-on-surface)' }}>{item.action}</div>
                      <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', marginTop: 2 }}>{item.project}</div>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--av-outline)', whiteSpace: 'nowrap', marginTop: 2 }}>{item.time}</span>
                  </div>
                )
              })}
            </div>
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
