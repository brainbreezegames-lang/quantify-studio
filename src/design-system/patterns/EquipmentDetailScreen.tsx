import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

const specs = [
  { label: 'Weight', value: '35 lbs' },
  { label: 'Dimensions', value: '48" x 60"' },
  { label: 'Material', value: 'Galvanized Steel' },
  { label: 'Max Load', value: '2,000 lbs' },
]

const stockBreakdown = [
  { label: 'Available', count: 185, color: 'var(--av-teal)' },
  { label: 'Reserved', count: 180, color: 'var(--av-blue)' },
  { label: 'In Transit', count: 35, color: 'var(--av-light-blue)' },
  { label: 'Damaged', count: 20, color: 'var(--av-error)' },
]

const totalUnits = 420

const recentActivity = [
  {
    action: 'Shipped to Riverside Tower',
    date: 'Mar 1, 2026',
    units: '45 units',
    color: 'var(--av-teal)',
    icon: 'ship',
  },
  {
    action: 'Returned from Harbor View',
    date: 'Feb 28, 2026',
    units: '30 units',
    color: 'var(--av-blue)',
    icon: 'return',
  },
  {
    action: 'Damage report filed',
    date: 'Feb 27, 2026',
    units: '2 units',
    color: 'var(--av-error)',
    icon: 'alert',
  },
]

const tabs = ['Details', 'Stock', 'Activity']

export default function EquipmentDetailScreen() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <PhoneFrame title="Equipment Detail" description="Single equipment item view with specs, stock breakdown, and recent activity.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568 }}>
        {/* Toolbar */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
          </div>
          <div className="ds-toolbar-center">Equipment Details</div>
          <div className="ds-toolbar-end">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5z" /></svg>
            </button>
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>

          {/* Hero Image Area */}
          <div style={{
            height: 140,
            background: 'var(--av-surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            {/* Geometric scaffold icon */}
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="8" y="12" width="4" height="40" rx="1" fill="var(--av-outline-variant)" />
              <rect x="52" y="12" width="4" height="40" rx="1" fill="var(--av-outline-variant)" />
              <rect x="8" y="12" width="48" height="4" rx="1" fill="var(--av-outline-variant)" />
              <rect x="8" y="30" width="48" height="3" rx="1" fill="var(--av-outline-variant)" />
              <rect x="8" y="48" width="48" height="4" rx="1" fill="var(--av-outline-variant)" />
              <line x1="12" y1="16" x2="52" y2="30" stroke="var(--av-outline)" strokeWidth="2" />
              <line x1="52" y1="16" x2="12" y2="30" stroke="var(--av-outline)" strokeWidth="2" />
            </svg>
            {/* Tag ID overlay */}
            <span style={{
              position: 'absolute',
              bottom: 8,
              right: 12,
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--av-on-surface-variant)',
              background: 'var(--av-bg)',
              padding: '3px 8px',
              borderRadius: 'var(--av-radius-sm)',
              fontFamily: 'var(--av-font-mono)',
              border: '1px solid var(--av-outline-variant)',
            }}>TAG-02156</span>
          </div>

          {/* Info Section */}
          <div style={{ padding: '14px 16px 0' }}>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--av-on-surface)',
              fontFamily: 'var(--av-font-primary)',
              marginBottom: 6,
            }}>Standard Frame 48"</div>

            <span className="ds-chip selected" style={{
              height: 24,
              fontSize: 11,
              padding: '0 10px',
              marginBottom: 8,
              display: 'inline-flex',
              fontFamily: 'var(--av-font-primary)',
            }}>Frames</span>

            <div style={{
              fontSize: 12,
              color: 'var(--av-on-surface-variant)',
              lineHeight: 1.5,
              fontFamily: 'var(--av-font-primary)',
              marginTop: 6,
            }}>
              Standard 48-inch scaffold frame. Galvanized steel construction. Compatible with all standard scaffold systems.
            </div>
          </div>

          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            gap: 0,
            padding: '12px 16px 0',
            borderBottom: '1px solid var(--av-surface-3)',
          }}>
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  fontSize: 12,
                  fontWeight: activeTab === i ? 600 : 500,
                  color: activeTab === i ? 'var(--av-blue)' : 'var(--av-on-surface-variant)',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === i ? '2px solid var(--av-blue)' : '2px solid transparent',
                  cursor: 'pointer',
                  fontFamily: 'var(--av-font-primary)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content: Details */}
          {activeTab === 0 && (
            <div style={{ padding: '14px 16px 0' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
              }}>
                {specs.map((spec, i) => (
                  <div key={i} style={{
                    padding: '8px 10px',
                    background: 'var(--av-surface-2)',
                    borderRadius: 'var(--av-radius-md)',
                  }}>
                    <div style={{
                      fontSize: 10,
                      fontWeight: 500,
                      color: 'var(--av-on-surface-variant)',
                      textTransform: 'uppercase',
                      letterSpacing: 0.3,
                      marginBottom: 2,
                      fontFamily: 'var(--av-font-primary)',
                    }}>{spec.label}</div>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--av-on-surface)',
                      fontFamily: 'var(--av-font-primary)',
                    }}>{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Stock */}
          {activeTab === 1 && (
            <div style={{ padding: '14px 16px 0' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
                <span style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--av-on-surface)',
                  fontFamily: 'var(--av-font-primary)',
                }}>Stock Status</span>
                <span style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--av-on-surface)',
                  fontFamily: 'var(--av-font-mono)',
                }}>{totalUnits} units</span>
              </div>

              {/* Stacked bar */}
              <div style={{
                display: 'flex',
                height: 10,
                borderRadius: 'var(--av-radius-full)',
                overflow: 'hidden',
                marginBottom: 10,
              }}>
                {stockBreakdown.map((seg, i) => (
                  <div key={i} style={{
                    flex: seg.count,
                    background: seg.color,
                  }} />
                ))}
              </div>

              {/* Legend */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 6,
                marginBottom: 4,
              }}>
                {stockBreakdown.map((seg, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: 'var(--av-radius-full)',
                      background: seg.color,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 11,
                      color: 'var(--av-on-surface-variant)',
                      fontFamily: 'var(--av-font-primary)',
                    }}>{seg.label}</span>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: seg.color,
                      fontFamily: 'var(--av-font-mono)',
                      marginLeft: 'auto',
                    }}>{seg.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Activity */}
          {activeTab === 2 && (
            <div style={{ padding: '14px 16px 0' }}>
              {recentActivity.map((evt, i) => {
                let iconSvg
                if (evt.icon === 'ship') {
                  iconSvg = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={evt.color} strokeWidth="2"><path d="M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1" /><path d="M12 15l5 6H7l5-6z" /></svg>
                } else if (evt.icon === 'return') {
                  iconSvg = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={evt.color} strokeWidth="2"><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
                } else {
                  iconSvg = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={evt.color} strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" /></svg>
                }

                const bgMap: Record<string, string> = {
                  'var(--av-teal)': 'var(--av-success-container)',
                  'var(--av-blue)': 'var(--av-blue-50)',
                  'var(--av-error)': 'var(--av-error-container)',
                }

                return (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '8px 0',
                    borderBottom: i < recentActivity.length - 1 ? '1px solid var(--av-surface-3)' : 'none',
                  }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 'var(--av-radius-full)',
                      background: bgMap[evt.color] || 'var(--av-surface-3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}>
                      {iconSvg}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--av-on-surface)',
                        fontFamily: 'var(--av-font-primary)',
                      }}>{evt.action}</div>
                      <div style={{
                        fontSize: 11,
                        color: 'var(--av-on-surface-variant)',
                        marginTop: 1,
                        fontFamily: 'var(--av-font-primary)',
                      }}>{evt.date}</div>
                    </div>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: evt.color,
                      fontFamily: 'var(--av-font-mono)',
                      whiteSpace: 'nowrap',
                      marginTop: 2,
                    }}>{evt.units}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Bottom spacer */}
          <div style={{ height: 16 }} />
        </div>

        {/* Reserve Button */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--av-surface-3)',
          background: 'var(--av-bg)',
        }}>
          <button className="ds-btn ds-btn-filled" style={{
            width: '100%',
            height: 44,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'var(--av-font-primary)',
            borderRadius: 'var(--av-radius-lg)',
          }}>Reserve Equipment</button>
        </div>
      </div>
    </PhoneFrame>
  )
}
