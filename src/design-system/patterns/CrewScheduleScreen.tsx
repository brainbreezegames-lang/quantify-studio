import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

const days = [
  { short: 'Mon', date: 24 },
  { short: 'Tue', date: 25 },
  { short: 'Wed', date: 26 },
  { short: 'Thu', date: 27 },
  { short: 'Fri', date: 28 },
]

const scheduleData = [
  {
    time: '8:00 AM',
    type: 'Delivery',
    project: 'Riverside Tower Project',
    team: 'Team Alpha — Marcus R., James W.',
    equipment: ['450 Frames', '120 Braces'],
    status: 'Confirmed',
    statusColor: 'var(--av-blue)',
    statusBg: 'var(--av-blue-50)',
  },
  {
    time: '10:30 AM',
    type: 'Pickup',
    project: 'Harbor View Complex',
    team: 'Team Beta — Sarah K., David L.',
    equipment: ['200 Frames', '60 Planks'],
    status: 'Pending Approval',
    statusColor: '#5D4300',
    statusBg: 'var(--av-warning-container)',
  },
  {
    time: '2:00 PM',
    type: 'Delivery',
    project: 'Downtown Office Tower',
    team: 'Team Alpha — Marcus R., James W.',
    equipment: ['300 Frames'],
    status: 'Unassigned',
    statusColor: 'var(--av-outline)',
    statusBg: 'var(--av-surface-3)',
    unassigned: true,
  },
]

export default function CrewScheduleScreen() {
  const [selectedDay, setSelectedDay] = useState(26)

  return (
    <PhoneFrame title="Crew Schedule" description="Dispatcher view for assigning crews to equipment delivery and pickup jobs.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568 }}>
        {/* Toolbar */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
          </div>
          <div className="ds-toolbar-center">Crew Schedule</div>
          <div className="ds-toolbar-end">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>
            </button>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--av-blue)',
              background: 'var(--av-blue-50)',
              padding: '4px 10px',
              borderRadius: 'var(--av-radius-full)',
              marginRight: 4,
              fontFamily: 'var(--av-font-primary)',
            }}>Today</span>
          </div>
        </div>

        {/* Date Strip */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px 12px',
          background: 'var(--av-bg)',
          borderBottom: '1px solid var(--av-surface-3)',
        }}>
          {days.map((day) => {
            const isSelected = day.date === selectedDay
            return (
              <button
                key={day.date}
                onClick={() => setSelectedDay(day.date)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'var(--av-font-primary)',
                }}
              >
                <span style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: isSelected ? 'var(--av-blue)' : 'var(--av-on-surface-variant)',
                }}>{day.short}</span>
                <span style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--av-radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? '#FFFFFF' : 'var(--av-on-surface)',
                  background: isSelected ? 'var(--av-blue)' : 'transparent',
                }}>{day.date}</span>
              </button>
            )
          })}
        </div>

        {/* Schedule List */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 12px', position: 'relative' }}>
          {scheduleData.map((job, i) => (
            <div key={i} style={{ marginTop: 14 }}>
              {/* Time Slot Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8,
              }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--av-on-surface)',
                  fontFamily: 'var(--av-font-primary)',
                }}>{job.time}</span>
                <span style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: job.type === 'Delivery' ? 'var(--av-teal)' : 'var(--av-light-blue)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>{job.type}</span>
                <div style={{ flex: 1, height: 1, background: 'var(--av-surface-3)' }} />
              </div>

              {/* Job Card */}
              <div className="ds-card ds-card-outlined" style={{
                padding: 12,
                borderRadius: 'var(--av-radius-lg)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--av-on-surface)',
                      fontFamily: 'var(--av-font-primary)',
                      marginBottom: 2,
                    }}>{job.project}</div>
                    <div style={{
                      fontSize: 12,
                      color: 'var(--av-on-surface-variant)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                      {/* People icon */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--av-on-surface-variant)" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                      </svg>
                      {job.team}
                    </div>
                  </div>
                  {/* Truck icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--av-outline)" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>

                {/* Equipment chips */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                  {job.equipment.map((eq, j) => (
                    <span key={j} className="ds-chip" style={{
                      height: 24,
                      fontSize: 11,
                      padding: '0 10px',
                      fontFamily: 'var(--av-font-primary)',
                    }}>{eq}</span>
                  ))}
                </div>

                {/* Status badge + optional assign button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: job.statusColor,
                    background: job.statusBg,
                    padding: '3px 10px',
                    borderRadius: 'var(--av-radius-full)',
                    fontFamily: 'var(--av-font-primary)',
                  }}>{job.status}</span>
                  {job.unassigned && (
                    <button className="ds-btn ds-btn-text" style={{
                      fontSize: 12,
                      height: 28,
                      padding: '0 8px',
                      color: 'var(--av-blue)',
                      fontFamily: 'var(--av-font-primary)',
                    }}>Assign Crew</button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* FAB */}
          <div style={{ position: 'absolute', bottom: 16, right: 4 }}>
            <button className="ds-fab primary" style={{ width: 48, height: 48 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            </button>
          </div>

          {/* Bottom spacer for FAB */}
          <div style={{ height: 72 }} />
        </div>
      </div>
    </PhoneFrame>
  )
}
