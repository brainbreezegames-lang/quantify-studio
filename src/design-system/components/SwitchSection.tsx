import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'

export default function SwitchSection() {
  /* Interactive demo toggles */
  const [notifications, setNotifications] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [gps, setGps] = useState(true)

  /* Single interactive demo */
  const [demoOn, setDemoOn] = useState(false)

  return (
    <div className="ds-section" id="switches">
      <SectionHeader
        label="Selection Controls"
        title="Toggle Switch"
        description="Instant on/off toggles for settings that apply immediately."
      />

      {/* ── States ── */}
      <SubSection title="States" description="A toggle switch has two visual states: off (track is outlined) and on (track is filled with the primary color).">
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Off',
              tag: 'Default',
              content: (
                <div className="ds-toggle">
                  <div className="ds-toggle-track">
                    <div className="ds-toggle-thumb" />
                  </div>
                  <span className="ds-toggle-label">Setting off</span>
                </div>
              ),
            },
            {
              label: 'On',
              tag: 'Active',
              content: (
                <div className="ds-toggle">
                  <div className="ds-toggle-track on">
                    <div className="ds-toggle-thumb" />
                  </div>
                  <span className="ds-toggle-label">Setting on</span>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── With Labels ── */}
      <SubSection title="With Labels" description="Labels clarify what the toggle controls. Place the label to the right of the switch track.">
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Labeled Toggles',
              content: (
                <div style={{ display: 'flex', gap: 40 }}>
                  <div className="ds-toggle">
                    <div className="ds-toggle-track on">
                      <div className="ds-toggle-thumb" />
                    </div>
                    <span className="ds-toggle-label">Notifications</span>
                  </div>
                  <div className="ds-toggle">
                    <div className="ds-toggle-track">
                      <div className="ds-toggle-thumb" />
                    </div>
                    <span className="ds-toggle-label">Auto-refresh</span>
                  </div>
                  <div className="ds-toggle">
                    <div className="ds-toggle-track">
                      <div className="ds-toggle-thumb" />
                    </div>
                    <span className="ds-toggle-label">Dark mode</span>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Without Icons ── */}
      <SubSection title="Without Icons" description="Toggle switches in this system do not include icons on the thumb or track. The visual distinction relies on track fill color and thumb position alone.">
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Off (No Icon)',
              content: (
                <div className="ds-toggle">
                  <div className="ds-toggle-track">
                    <div className="ds-toggle-thumb" />
                  </div>
                </div>
              ),
            },
            {
              label: 'On (No Icon)',
              content: (
                <div className="ds-toggle">
                  <div className="ds-toggle-track on">
                    <div className="ds-toggle-thumb" />
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Disabled ── */}
      <SubSection title="Disabled States" description="Disabled toggles indicate settings that cannot currently be changed. They retain their on/off visual but reduce opacity.">
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Disabled Off',
              content: (
                <div className="ds-toggle" style={{ opacity: 0.38, pointerEvents: 'none' }}>
                  <div className="ds-toggle-track">
                    <div className="ds-toggle-thumb" />
                  </div>
                  <span className="ds-toggle-label">Unavailable</span>
                </div>
              ),
            },
            {
              label: 'Disabled On',
              content: (
                <div className="ds-toggle" style={{ opacity: 0.38, pointerEvents: 'none' }}>
                  <div className="ds-toggle-track on">
                    <div className="ds-toggle-thumb" />
                  </div>
                  <span className="ds-toggle-label">Locked on</span>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Interactive Demo (single) ── */}
      <SubSection title="Interactive Demo" description="Click the toggle to switch its state. The change is immediate and visual feedback is instant.">
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Try It',
              tag: 'Interactive',
              content: (
                <div className="ds-toggle" onClick={() => setDemoOn(!demoOn)} style={{ cursor: 'pointer' }}>
                  <div className={`ds-toggle-track${demoOn ? ' on' : ''}`}>
                    <div className="ds-toggle-thumb" />
                  </div>
                  <span className="ds-toggle-label">{demoOn ? 'Enabled' : 'Disabled'}</span>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Settings List ── */}
      <SubSection title="Settings List" description="A practical settings panel demonstrating multiple toggle switches in a list layout, similar to a mobile settings page.">
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Application Settings',
              tag: 'Interactive',
              content: (
                <div
                  style={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: 'var(--av-radius-lg, 12px)',
                    border: '1px solid var(--av-outline-variant, #CAC4D0)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      padding: '12px 16px',
                      background: 'var(--av-surface, #FAFBFF)',
                      borderBottom: '1px solid var(--av-outline-variant, #CAC4D0)',
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--av-on-surface, #1C1B1F)',
                    }}
                  >
                    Preferences
                  </div>

                  {/* Toggle rows */}
                  {[
                    { label: 'Notifications', desc: 'Receive push notifications', value: notifications, set: setNotifications },
                    { label: 'Auto-refresh', desc: 'Update data automatically', value: autoRefresh, set: setAutoRefresh },
                    { label: 'Dark mode', desc: 'Switch to dark color scheme', value: darkMode, set: setDarkMode },
                    { label: 'GPS tracking', desc: 'Enable location services', value: gps, set: setGps },
                  ].map((item, i, arr) => (
                    <div
                      key={item.label}
                      onClick={() => item.set(!item.value)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        cursor: 'pointer',
                        background: 'var(--av-bg, #fff)',
                        borderBottom: i < arr.length - 1 ? '1px solid var(--av-surface-3, #E3E8F9)' : 'none',
                        transition: 'background 150ms',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)' }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant, #49454F)', marginTop: 2 }}>
                          {item.desc}
                        </div>
                      </div>
                      <div className="ds-toggle" style={{ pointerEvents: 'none' }}>
                        <div className={`ds-toggle-track${item.value ? ' on' : ''}`}>
                          <div className="ds-toggle-thumb" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Do / Don't ── */}
      <SubSection title="Usage Guidelines">
        <DoDontGrid
          items={[
            {
              type: 'do',
              content: (
                <div className="ds-toggle">
                  <div className="ds-toggle-track on">
                    <div className="ds-toggle-thumb" />
                  </div>
                  <span className="ds-toggle-label">Notifications</span>
                </div>
              ),
              caption: 'Use toggles for settings that take effect immediately without a confirmation step.',
            },
            {
              type: 'dont',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="ds-toggle">
                    <div className="ds-toggle-track on">
                      <div className="ds-toggle-thumb" />
                    </div>
                    <span className="ds-toggle-label">I agree to terms</span>
                  </div>
                </div>
              ),
              caption: 'Don\'t use a toggle for consent or agreement actions. Use a checkbox instead.',
            },
            {
              type: 'do',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="ds-toggle">
                    <div className="ds-toggle-track on">
                      <div className="ds-toggle-thumb" />
                    </div>
                    <span className="ds-toggle-label">Wi-Fi</span>
                  </div>
                  <div className="ds-toggle">
                    <div className="ds-toggle-track">
                      <div className="ds-toggle-thumb" />
                    </div>
                    <span className="ds-toggle-label">Bluetooth</span>
                  </div>
                </div>
              ),
              caption: 'Use clear, concise labels that describe the setting being controlled.',
            },
            {
              type: 'dont',
              content: (
                <div className="ds-toggle">
                  <div className="ds-toggle-track on">
                    <div className="ds-toggle-thumb" />
                  </div>
                  <span className="ds-toggle-label">Do not disable auto-refresh feature</span>
                </div>
              ),
              caption: 'Don\'t use double negatives in toggle labels. Keep the language positive and direct.',
            },
          ]}
        />
      </SubSection>

      {/* ── Props Table ── */}
      <PropsTable
          componentName="ToggleSwitch"
          props={[
            { name: 'Header', type: 'string', description: 'The label text displayed alongside the toggle.' },
            { name: 'IsOn', type: 'bool', default: 'false', description: 'Whether the toggle is in the on position.' },
            { name: 'IsEnabled', type: 'bool', default: 'true', description: 'Whether the toggle is interactive.' },
            { name: 'OnContent', type: 'string', default: '"On"', description: 'Text shown when the toggle is on.' },
            { name: 'OffContent', type: 'string', default: '"Off"', description: 'Text shown when the toggle is off.' },
            { name: 'Toggled', type: 'event', description: 'Fires when the toggle state changes.' },
          ]}
        />

      {/* ── XAML Code ── */}
      <SubSection title="Uno Platform XAML" description="Copy-ready XAML snippets for implementing toggle switches in your Uno Platform application.">
        <CodeSnippet
          title="TOGGLESWITCH EXAMPLES"
          code={`<!-- Basic toggle (off) -->
<ToggleSwitch Header="Auto-refresh" />

<!-- Toggle on -->
<ToggleSwitch Header="Notifications" IsOn="True" />

<!-- Disabled toggle -->
<ToggleSwitch Header="GPS tracking"
              IsOn="True"
              IsEnabled="False" />

<!-- Custom on/off labels -->
<ToggleSwitch Header="Dark mode"
              OnContent="Enabled"
              OffContent="Disabled" />

<!-- Settings list layout -->
<StackPanel Spacing="8">
  <ToggleSwitch Header="Notifications" IsOn="True" />
  <ToggleSwitch Header="Auto-refresh" />
  <ToggleSwitch Header="Dark mode" />
  <ToggleSwitch Header="GPS tracking" IsOn="True" />
</StackPanel>

<!-- With event handler -->
<ToggleSwitch Header="Notifications"
              IsOn="True"
              Toggled="OnNotificationsToggled" />`}
        />
      </SubSection>
    </div>
  )
}
