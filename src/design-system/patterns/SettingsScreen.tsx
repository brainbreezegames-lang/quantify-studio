import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true)
  const [autoSync, setAutoSync] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <PhoneFrame title="Settings" description="App preferences with toggle switches, text fields, and info links.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568 }}>
        {/* Toolbar */}
        <div className="ds-toolbar" style={{ borderRadius: 0, padding: '0 4px' }}>
          <div className="ds-toolbar-start">
            <button className="ds-toolbar-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
          </div>
          <div className="ds-toolbar-center">Settings</div>
          <div className="ds-toolbar-end" />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
          {/* Preferences Section */}
          <div style={{ padding: '12px 16px 4px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--av-blue)', marginBottom: 8 }}>
              Preferences
            </div>
          </div>

          {/* Notifications Toggle */}
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer' }}
            onClick={() => setNotifications(!notifications)}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface)' }}>Notifications</div>
              <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', marginTop: 2 }}>Receive push notifications</div>
            </div>
            <div className="ds-toggle" style={{ gap: 0 }}>
              <div className={`ds-toggle-track${notifications ? ' on' : ''}`} style={{ width: 44, height: 26 }}>
                <div className="ds-toggle-thumb" style={{ width: 20, height: 20, left: notifications ? 19 : undefined }} />
              </div>
            </div>
          </div>

          {/* Auto-sync Toggle */}
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer' }}
            onClick={() => setAutoSync(!autoSync)}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface)' }}>Auto-sync</div>
              <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', marginTop: 2 }}>Sync data when connected</div>
            </div>
            <div className="ds-toggle" style={{ gap: 0 }}>
              <div className={`ds-toggle-track${autoSync ? ' on' : ''}`} style={{ width: 44, height: 26 }}>
                <div className="ds-toggle-thumb" style={{ width: 20, height: 20, left: autoSync ? 19 : undefined }} />
              </div>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--av-surface-3)', cursor: 'pointer' }}
            onClick={() => setDarkMode(!darkMode)}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface)' }}>Dark Mode</div>
              <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', marginTop: 2 }}>Use dark theme</div>
            </div>
            <div className="ds-toggle" style={{ gap: 0 }}>
              <div className={`ds-toggle-track${darkMode ? ' on' : ''}`} style={{ width: 44, height: 26 }}>
                <div className="ds-toggle-thumb" style={{ width: 20, height: 20, left: darkMode ? 19 : undefined }} />
              </div>
            </div>
          </div>

          {/* Connection Section */}
          <div style={{ padding: '16px 16px 4px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--av-blue)', marginBottom: 12 }}>
              Connection
            </div>
          </div>

          <div style={{ padding: '0 16px 12px' }}>
            <div className="ds-textfield" style={{ maxWidth: '100%', marginBottom: 12 }}>
              <input type="url" defaultValue="https://api.quantify.avontus.com" style={{ height: 48, fontSize: 12, padding: '20px 12px 6px' }} readOnly />
              <label style={{ left: 12, top: 6, fontSize: 11 }}>Server URL</label>
            </div>
            <button className="ds-btn ds-btn-outlined" style={{ fontSize: 13, height: 36, width: '100%' }}>
              Test Connection
            </button>
          </div>

          <div className="ds-divider" />

          {/* About Section */}
          <div style={{ padding: '16px 16px 4px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--av-blue)', marginBottom: 8 }}>
              About
            </div>
          </div>

          <div style={{ padding: '0 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--av-surface-3)' }}>
              <span style={{ fontSize: 14, color: 'var(--av-on-surface)' }}>App Version</span>
              <span style={{ fontSize: 13, color: 'var(--av-on-surface-variant)', fontFamily: 'var(--av-font-mono)' }}>4.2.1</span>
            </div>
            <div style={{ padding: '12px 0', borderBottom: '1px solid var(--av-surface-3)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: 'var(--av-blue)' }}>Terms of Service</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--av-outline)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </div>
            <div style={{ padding: '12px 0', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: 'var(--av-blue)' }}>Privacy Policy</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--av-outline)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}
