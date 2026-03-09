import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

const kpis = [
  { label: 'Active Reservations', value: '47', change: '+12%', changeColor: 'var(--av-teal)' },
  { label: 'Equipment Out', value: '2,840', subtitle: 'of 4,200 total' },
  { label: 'Revenue MTD', value: '$142,500', change: '+8%', changeColor: 'var(--av-teal)' },
  { label: 'Avg Utilization', value: '67.6%', circular: true },
]

const chartData = [
  { month: 'Oct', value: 32 },
  { month: 'Nov', value: 41 },
  { month: 'Dec', value: 28 },
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 38 },
  { month: 'Mar', value: 52 },
]

const topEquipment = [
  { name: 'Standard Frame', pct: 78 },
  { name: 'Scaffold Plank', pct: 65 },
  { name: 'Standard Brace', pct: 54 },
  { name: 'Base Plate', pct: 41 },
]

const maxChartValue = 60

const periods = ['Mar 2026', 'Feb 2026', 'Jan 2026']

export default function ReportScreen() {
  const [activePeriod, setActivePeriod] = useState(0)
  const [activeTab, setActiveTab] = useState(2)

  const handleCyclePeriod = () => {
    setActivePeriod((prev) => (prev + 1) % periods.length)
  }

  return (
    <PhoneFrame title="Reports" description="Analytics dashboard with KPIs, reservation trends chart, and equipment utilization.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568 }}>
        {/* Toolbar */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
          </div>
          <div className="ds-toolbar-center">Reports</div>
          <div className="ds-toolbar-end">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" /></svg>
            </button>
            <span
              className="ds-chip"
              style={{
                height: 26,
                fontSize: 11,
                padding: '0 10px',
                fontFamily: 'var(--av-font-primary)',
                cursor: 'pointer',
              }}
              onClick={handleCyclePeriod}
            >
              {periods[activePeriod]}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 12px 0' }}>

          {/* KPI Cards - 2x2 Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            marginBottom: 16,
          }}>
            {kpis.map((kpi, i) => (
              <div key={i} className="ds-card ds-card-outlined" style={{
                padding: '12px 10px',
                borderRadius: 'var(--av-radius-md)',
              }}>
                <div style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: 'var(--av-on-surface-variant)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.3,
                  marginBottom: 4,
                  fontFamily: 'var(--av-font-primary)',
                }}>{kpi.label}</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--av-on-surface)',
                    fontFamily: 'var(--av-font-primary)',
                  }}>{kpi.value}</span>

                  {kpi.change && (
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: kpi.changeColor,
                      fontFamily: 'var(--av-font-mono)',
                    }}>{kpi.change}</span>
                  )}

                  {kpi.circular && (
                    <svg width="28" height="28" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
                      <circle cx="18" cy="18" r="14" fill="none" stroke="var(--av-surface-3)" strokeWidth="4" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="var(--av-blue)" strokeWidth="4"
                        strokeDasharray={`${67.6 * 0.88} ${88 - 67.6 * 0.88}`}
                        strokeDashoffset="22"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </div>

                {kpi.subtitle && (
                  <div style={{
                    fontSize: 11,
                    color: 'var(--av-on-surface-variant)',
                    marginTop: 2,
                    fontFamily: 'var(--av-font-primary)',
                  }}>{kpi.subtitle}</div>
                )}
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          <div className="ds-card ds-card-outlined" style={{
            padding: 12,
            borderRadius: 'var(--av-radius-lg)',
            marginBottom: 16,
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--av-on-surface)',
              marginBottom: 12,
              fontFamily: 'var(--av-font-primary)',
            }}>Monthly Reservations</div>

            <div style={{ display: 'flex', gap: 2, height: 100 }}>
              {/* Y-axis labels */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                paddingBottom: 18,
                width: 24,
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 9, color: 'var(--av-outline)', fontFamily: 'var(--av-font-mono)', textAlign: 'right' }}>60</span>
                <span style={{ fontSize: 9, color: 'var(--av-outline)', fontFamily: 'var(--av-font-mono)', textAlign: 'right' }}>30</span>
                <span style={{ fontSize: 9, color: 'var(--av-outline)', fontFamily: 'var(--av-font-mono)', textAlign: 'right' }}>0</span>
              </div>

              {/* Bars */}
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-around',
                borderBottom: '1px solid var(--av-surface-3)',
                paddingBottom: 0,
              }}>
                {chartData.map((d, i) => {
                  const isCurrentMonth = d.month === 'Mar'
                  const heightPct = (d.value / maxChartValue) * 100
                  return (
                    <div key={i} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      flex: 1,
                    }}>
                      {/* Value label on top */}
                      <span style={{
                        fontSize: 9,
                        fontWeight: 500,
                        color: 'var(--av-on-surface-variant)',
                        fontFamily: 'var(--av-font-mono)',
                      }}>{d.value}</span>
                      {/* Bar */}
                      <div style={{
                        width: 20,
                        height: `${heightPct * 0.65}px`,
                        background: isCurrentMonth ? 'var(--av-light-blue)' : 'var(--av-blue)',
                        borderRadius: 'var(--av-radius-sm) var(--av-radius-sm) 0 0',
                        minHeight: 4,
                      }} />
                      {/* Month label */}
                      <span style={{
                        fontSize: 9,
                        color: 'var(--av-on-surface-variant)',
                        fontFamily: 'var(--av-font-primary)',
                        fontWeight: isCurrentMonth ? 600 : 400,
                      }}>{d.month}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Top Equipment Table */}
          <div style={{ marginBottom: 12 }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--av-on-surface)',
              marginBottom: 10,
              fontFamily: 'var(--av-font-primary)',
            }}>Most Reserved Equipment</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topEquipment.map((eq, i) => (
                <div key={i}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}>
                    <span style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--av-on-surface)',
                      fontFamily: 'var(--av-font-primary)',
                    }}>{eq.name}</span>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--av-blue)',
                      fontFamily: 'var(--av-font-mono)',
                    }}>{eq.pct}%</span>
                  </div>
                  <div style={{
                    height: 6,
                    background: 'var(--av-surface-3)',
                    borderRadius: 'var(--av-radius-full)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${eq.pct}%`,
                      background: 'var(--av-blue)',
                      borderRadius: 'var(--av-radius-full)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom spacer for nav */}
          <div style={{ height: 8 }} />
        </div>

        {/* Bottom Nav */}
        <div className="ds-bottom-nav" style={{ height: 64, borderRadius: 0 }}>
          <button className={`ds-bottom-nav-item${activeTab === 0 ? ' active' : ''}`} onClick={() => setActiveTab(0)}>
            {activeTab === 0 ? (
              <div className="nav-indicator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
              </div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
            )}
            <span style={{ fontSize: 11, fontFamily: 'var(--av-font-primary)' }}>Home</span>
          </button>
          <button className={`ds-bottom-nav-item${activeTab === 1 ? ' active' : ''}`} onClick={() => setActiveTab(1)}>
            {activeTab === 1 ? (
              <div className="nav-indicator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
              </div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
            )}
            <span style={{ fontSize: 11, fontFamily: 'var(--av-font-primary)' }}>Reservations</span>
          </button>
          <button className={`ds-bottom-nav-item${activeTab === 2 ? ' active' : ''}`} onClick={() => setActiveTab(2)}>
            {activeTab === 2 ? (
              <div className="nav-indicator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
              </div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
            )}
            <span style={{ fontSize: 11, fontFamily: 'var(--av-font-primary)' }}>Reports</span>
          </button>
          <button className={`ds-bottom-nav-item${activeTab === 3 ? ' active' : ''}`} onClick={() => setActiveTab(3)}>
            {activeTab === 3 ? (
              <div className="nav-indicator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
              </div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
            )}
            <span style={{ fontSize: 11, fontFamily: 'var(--av-font-primary)' }}>Settings</span>
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}
