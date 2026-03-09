import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

const filters = ['All', 'Approvals', 'Deliveries', 'System']

const todayNotifications = [
  {
    type: 'approval',
    accentColor: 'var(--av-blue)',
    title: 'Reservation RES-2026-0134 requires your approval',
    subtitle: 'Morrison Construction — 450 items',
    time: '2h ago',
    unread: true,
    actions: [
      { label: 'Approve', style: 'tonal' },
      { label: 'Decline', style: 'text' },
    ],
  },
  {
    type: 'delivery',
    accentColor: 'var(--av-teal)',
    title: 'Delivery DEL-2026-0291 arrived at Riverside Tower',
    subtitle: 'All 450 items confirmed',
    time: '3h ago',
    unread: true,
    icon: 'check',
  },
  {
    type: 'damage',
    accentColor: 'var(--av-error)',
    title: 'Damage reported on Return #RTN-2026-0089',
    subtitle: '3 items flagged for review',
    time: '5h ago',
    unread: true,
    actions: [
      { label: 'Review', style: 'outlined' },
    ],
  },
]

const yesterdayNotifications = [
  {
    type: 'stock',
    accentColor: 'var(--av-warning)',
    title: 'Low stock: Standard Frame 48"',
    subtitle: 'Only 45 units remaining (threshold: 50)',
    time: 'Yesterday 2:15 PM',
    unread: false,
    actions: [
      { label: 'Reorder', style: 'text' },
    ],
  },
  {
    type: 'system',
    accentColor: 'var(--av-outline)',
    title: 'Sync completed — 12 reservations updated',
    subtitle: '',
    time: 'Yesterday 4:30 PM',
    unread: false,
  },
]

export default function NotificationsScreen() {
  const [activeFilter, setActiveFilter] = useState('All')

  const renderNotification = (notif: { type: string; accentColor: string; title: string; subtitle: string; time: string; unread: boolean; actions?: { label: string; style: string }[]; icon?: string }, i: number) => (
    <div key={i} style={{
      display: 'flex',
      gap: 10,
      padding: '12px 14px',
      borderLeft: `3px solid ${notif.accentColor}`,
      background: notif.unread ? 'var(--av-surface-2)' : 'var(--av-bg)',
      borderBottom: '1px solid var(--av-surface-3)',
    }}>
      {/* Unread dot */}
      <div style={{ paddingTop: 4, width: 10, flexShrink: 0 }}>
        {notif.unread && (
          <span className="ds-badge-dot" style={{
            width: 8,
            height: 8,
            borderRadius: 'var(--av-radius-full)',
            background: 'var(--av-blue)',
            display: 'block',
          }} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title */}
        <div style={{
          fontSize: 13,
          fontWeight: notif.unread ? 600 : 500,
          color: 'var(--av-on-surface)',
          fontFamily: 'var(--av-font-primary)',
          lineHeight: 1.4,
          marginBottom: 2,
        }}>{notif.title}</div>

        {/* Subtitle */}
        {notif.subtitle && (
          <div style={{
            fontSize: 12,
            color: 'var(--av-on-surface-variant)',
            fontFamily: 'var(--av-font-primary)',
            marginBottom: 4,
          }}>{notif.subtitle}</div>
        )}

        {/* Time */}
        <div style={{
          fontSize: 11,
          color: 'var(--av-outline)',
          fontFamily: 'var(--av-font-primary)',
          marginBottom: notif.actions ? 8 : 0,
        }}>{notif.time}</div>

        {/* Actions */}
        {notif.actions && (
          <div style={{ display: 'flex', gap: 8 }}>
            {notif.actions.map((action, j) => {
              let className = 'ds-btn'
              if (action.style === 'tonal') className += ' ds-btn-tonal'
              else if (action.style === 'outlined') className += ' ds-btn-outlined'
              else className += ' ds-btn-text'
              return (
                <button key={j} className={className} style={{
                  fontSize: 12,
                  height: 30,
                  padding: '0 14px',
                  fontFamily: 'var(--av-font-primary)',
                }}>{action.label}</button>
              )
            })}
          </div>
        )}
      </div>

      {/* Check icon for delivery confirmation */}
      {notif.icon === 'check' && (
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 'var(--av-radius-full)',
          background: 'var(--av-success-container)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 2,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--av-teal)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
      )}
    </div>
  )

  return (
    <PhoneFrame title="Notifications" description="Alert center showing approvals, delivery updates, damage reports, and system messages.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568 }}>
        {/* Toolbar */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
          </div>
          <div className="ds-toolbar-center">Notifications</div>
          <div className="ds-toolbar-end">
            <button className="ds-btn ds-btn-text" style={{
              fontSize: 11,
              height: 28,
              padding: '0 8px',
              color: 'var(--av-blue)',
              fontFamily: 'var(--av-font-primary)',
            }}>Mark All Read</button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          padding: '10px 12px',
          overflowX: 'auto',
          background: 'var(--av-bg)',
          borderBottom: '1px solid var(--av-surface-3)',
        }}>
          {filters.map((filter) => (
            <button
              key={filter}
              className={`ds-chip${activeFilter === filter ? ' selected' : ''}`}
              onClick={() => setActiveFilter(filter)}
              style={{ height: 28, fontSize: 12, padding: '0 12px', fontFamily: 'var(--av-font-primary)' }}
            >{filter}</button>
          ))}
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {/* Today Group */}
          <div style={{
            padding: '10px 14px 4px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: 'var(--av-on-surface-variant)',
            fontFamily: 'var(--av-font-primary)',
          }}>Today</div>
          {todayNotifications.map(renderNotification)}

          {/* Yesterday Group */}
          <div style={{
            padding: '14px 14px 4px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: 'var(--av-on-surface-variant)',
            fontFamily: 'var(--av-font-primary)',
          }}>Yesterday</div>
          {yesterdayNotifications.map(renderNotification)}
        </div>
      </div>
    </PhoneFrame>
  )
}
