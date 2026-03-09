import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

const initialTimelineSteps = [
  { label: 'Loaded at Warehouse', time: '8:30 AM', status: 'completed' as const },
  { label: 'Departed Warehouse', time: '9:15 AM', status: 'completed' as const },
  { label: 'In Transit', time: 'Now', status: 'current' as const },
  { label: 'Arrive at Riverside Tower', time: 'Est. 12:45 PM', status: 'pending' as const },
]

export default function DeliveryTrackingScreen() {
  const [currentStepIndex, setCurrentStepIndex] = useState(2)

  const timelineSteps = initialTimelineSteps.map((step, i) => ({
    ...step,
    status: i < currentStepIndex ? 'completed' as const
      : i === currentStepIndex ? 'current' as const
      : 'pending' as const,
  }))

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index)
  }

  return (
    <PhoneFrame title="Delivery Tracking" description="Real-time delivery tracking with timeline, map placeholder, and driver info.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568, background: 'var(--av-bg)' }}>
        {/* Toolbar */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
          </div>
          <div className="ds-toolbar-center" style={{ fontSize: 13 }}>Delivery #DEL-2026-0291</div>
          <div className="ds-toolbar-end">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
          {/* Status Card */}
          <div className="ds-card ds-card-filled" style={{ padding: '14px 16px', marginBottom: 12, borderRadius: 'var(--av-radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#fff',
                  background: currentStepIndex >= 3 ? 'var(--av-blue)' : 'var(--av-teal)',
                  borderRadius: 'var(--av-radius-full)',
                  padding: '3px 10px',
                  marginBottom: 6,
                }}>
                  {currentStepIndex >= 3 ? 'Delivered' : 'In Transit'}
                </span>
                <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', marginTop: 4 }}>
                  {currentStepIndex >= 3 ? 'Delivery complete' : 'Arriving in ~23 min'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', textTransform: 'uppercase', letterSpacing: 0.5 }}>ETA</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--av-on-surface)', fontFamily: 'var(--av-font-primary)' }}>12:45 PM</div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div style={{
            height: 120,
            borderRadius: 'var(--av-radius-lg)',
            background: 'linear-gradient(135deg, var(--av-navy) 0%, var(--av-blue) 100%)',
            opacity: 0.12,
            position: 'relative',
            marginBottom: 12,
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 1,
            }}>
              {/* Dashed path */}
              <svg width="200" height="60" viewBox="0 0 200 60" fill="none" style={{ opacity: 8 }}>
                <path d="M30 40 Q70 10, 100 30 Q130 50, 170 20" stroke="var(--av-blue)" strokeWidth="2" strokeDasharray="6 4" fill="none" />
                {/* Truck icon */}
                <rect x="20" y="32" width="18" height="12" rx="2" fill="var(--av-blue)" />
                <rect x="14" y="38" width="8" height="6" rx="1" fill="var(--av-blue)" />
                <circle cx="20" cy="46" r="3" fill="var(--av-navy)" />
                <circle cx="34" cy="46" r="3" fill="var(--av-navy)" />
                {/* Pin icon */}
                <circle cx="170" cy="14" r="6" fill="var(--av-error)" />
                <circle cx="170" cy="14" r="3" fill="white" />
                <path d="M170 20 L170 26" stroke="var(--av-error)" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Delivery Timeline */}
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-on-surface)', marginBottom: 10 }}>
            Delivery Timeline
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 16 }}>
            {timelineSteps.map((step, i) => {
              const isCompleted = step.status === 'completed'
              const isCurrent = step.status === 'current'
              const isPending = step.status === 'pending'
              const isLast = i === timelineSteps.length - 1

              return (
                <div
                  key={i}
                  style={{ display: 'flex', gap: 12, minHeight: 48, cursor: 'pointer' }}
                  onClick={() => handleStepClick(i)}
                >
                  {/* Timeline column */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 24,
                    flexShrink: 0,
                  }}>
                    {/* Dot / check */}
                    {isCompleted ? (
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: 'var(--av-radius-full)',
                        background: 'var(--av-teal)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                    ) : isCurrent ? (
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: 'var(--av-radius-full)',
                        background: 'var(--av-blue)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 0 0 4px var(--av-blue-50)',
                        animation: 'pulseBlue 2s ease-in-out infinite',
                      }}>
                        <div style={{ width: 8, height: 8, borderRadius: 'var(--av-radius-full)', background: 'white' }} />
                      </div>
                    ) : (
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: 'var(--av-radius-full)',
                        border: '2px solid var(--av-outline-variant)',
                        background: 'var(--av-bg)',
                        flexShrink: 0,
                      }} />
                    )}
                    {/* Line */}
                    {!isLast && (
                      <div style={{
                        flex: 1,
                        width: 2,
                        background: isCompleted ? 'var(--av-teal)' : 'var(--av-outline-variant)',
                        minHeight: 20,
                      }} />
                    )}
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1, paddingBottom: 12 }}>
                    <div style={{
                      fontSize: 13,
                      fontWeight: isCurrent ? 600 : 500,
                      color: isPending ? 'var(--av-outline)' : 'var(--av-on-surface)',
                    }}>
                      {step.label}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: isPending ? 'var(--av-outline)' : 'var(--av-on-surface-variant)',
                      marginTop: 2,
                    }}>
                      {initialTimelineSteps[i].time}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Items Summary */}
          <div style={{
            padding: '8px 12px',
            background: 'var(--av-surface-2)',
            borderRadius: 'var(--av-radius-md)',
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--av-on-surface-variant)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Items</div>
            <div style={{ fontSize: 12, color: 'var(--av-on-surface)', fontFamily: 'var(--av-font-primary)' }}>
              450 Frames, 120 Braces, 80 Planks
            </div>
          </div>

          {/* Driver Card */}
          <div className="ds-card ds-card-outlined" style={{ padding: '12px 14px', borderRadius: 'var(--av-radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Avatar */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--av-radius-full)',
                background: 'var(--av-blue-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--av-blue)' }}>MR</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-on-surface)' }}>Marcus Rodriguez</div>
                <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', fontFamily: 'var(--av-font-mono)', marginTop: 1 }}>(555) 012-3456</div>
              </div>
              <button className="ds-btn ds-btn-outlined" style={{ fontSize: 12, padding: '0 12px', height: 32 }}>
                Call Driver
              </button>
            </div>
          </div>
        </div>

        {/* Pulse animation */}
        <style>{`
          @keyframes pulseBlue {
            0%, 100% { box-shadow: 0 0 0 4px var(--av-blue-50); }
            50% { box-shadow: 0 0 0 8px transparent; }
          }
        `}</style>
      </div>
    </PhoneFrame>
  )
}
