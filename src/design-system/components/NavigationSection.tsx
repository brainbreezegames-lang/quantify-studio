import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import { Home, Box, Calendar, Settings, List, Menu, Search } from '../shared/Icons'

const navItems = [
  { icon: Home, label: 'Home' },
  { icon: Calendar, label: 'Reservations' },
  { icon: Box, label: 'Inventory' },
  { icon: List, label: 'Reports' },
  { icon: Settings, label: 'Settings' },
]

export default function NavigationSection() {
  const [activeBottom, setActiveBottom] = useState(0)
  const [activeRail, setActiveRail] = useState(1)
  const [activeDrawer, setActiveDrawer] = useState(2)

  return (
    <section id="navigation" className="ds-section">
      <SectionHeader
        label="Component"
        title="Navigation"
        description="Bottom nav, rail, and drawer patterns that adapt across device sizes."
      />

      {/* ── Bottom Navigation ── */}
      <SubSection
        title="Bottom Navigation"
        description="Bottom navigation displays 3-5 primary destinations at the bottom of the screen. Each item has an icon and label. The active destination is highlighted with color and an indicator pill."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: '5 Items',
              tag: 'Mobile',
              content: (
                <div className="ds-bottom-nav" style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  height: 80,
                  background: 'var(--av-surface, #FAFBFF)',
                  border: '1px solid var(--av-outline-variant, #CAC4D0)',
                  borderRadius: 12,
                  width: '100%',
                  maxWidth: 400,
                }}>
                  {navItems.map((item, i) => {
                    const Icon = item.icon
                    const isActive = activeBottom === i
                    return (
                      <div
                        key={i}
                        className="ds-bottom-nav-item"
                        onClick={() => setActiveBottom(i)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 4,
                          cursor: 'pointer',
                          padding: '0 12px',
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 56,
                          height: 32,
                          borderRadius: 16,
                          background: isActive ? 'var(--av-blue-light, rgba(41,98,255,0.12))' : 'transparent',
                          transition: 'all 200ms ease',
                        }}>
                          <Icon size={22} />
                        </div>
                        <span style={{
                          fontSize: 12,
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? 'var(--av-blue, #2962FF)' : 'var(--av-on-surface-variant, #49454F)',
                          transition: 'color 200ms ease',
                        }}>
                          {item.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ),
            },
            {
              label: '3 Items',
              tag: 'Minimal',
              content: (
                <div className="ds-bottom-nav" style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  height: 80,
                  background: 'var(--av-surface, #FAFBFF)',
                  border: '1px solid var(--av-outline-variant, #CAC4D0)',
                  borderRadius: 12,
                  width: '100%',
                  maxWidth: 320,
                }}>
                  {navItems.slice(0, 3).map((item, i) => {
                    const Icon = item.icon
                    const isActive = i === 0
                    return (
                      <div
                        key={i}
                        className="ds-bottom-nav-item"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 4,
                          cursor: 'pointer',
                          padding: '0 16px',
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 56,
                          height: 32,
                          borderRadius: 16,
                          background: isActive ? 'var(--av-blue-light, rgba(41,98,255,0.12))' : 'transparent',
                        }}>
                          <Icon size={22} />
                        </div>
                        <span style={{
                          fontSize: 12,
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? 'var(--av-blue, #2962FF)' : 'var(--av-on-surface-variant, #49454F)',
                        }}>
                          {item.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Navigation Rail ── */}
      <SubSection
        title="Navigation Rail"
        description="The navigation rail is a vertical bar for tablets and larger screens. It provides icon-and-label destinations along the left edge, freeing horizontal space for content."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Navigation Rail',
              tag: 'Tablet',
              content: (
                <div style={{ display: 'flex', gap: 0, width: '100%', maxWidth: 480, height: 360, border: '1px solid var(--av-outline-variant, #CAC4D0)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{
                    width: 80,
                    background: 'var(--av-surface, #FAFBFF)',
                    borderRight: '1px solid var(--av-outline-variant, #CAC4D0)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: 12,
                    gap: 4,
                  }}>
                    <button style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--av-blue, #2962FF)',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--av-bg, #fff)',
                      marginBottom: 12,
                    }}>
                      <Menu size={20} />
                    </button>
                    {navItems.map((item, i) => {
                      const Icon = item.icon
                      const isActive = activeRail === i
                      return (
                        <div
                          key={i}
                          onClick={() => setActiveRail(i)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                            padding: '8px 0',
                            cursor: 'pointer',
                            width: '100%',
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 32,
                            borderRadius: 16,
                            background: isActive ? 'var(--av-blue-light, rgba(41,98,255,0.12))' : 'transparent',
                            color: isActive ? 'var(--av-blue, #2962FF)' : 'var(--av-on-surface-variant, #49454F)',
                            transition: 'all 200ms ease',
                          }}>
                            <Icon size={20} />
                          </div>
                          <span style={{
                            fontSize: 11,
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? 'var(--av-blue, #2962FF)' : 'var(--av-on-surface-variant, #49454F)',
                          }}>
                            {item.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ flex: 1, padding: 24, background: 'var(--av-bg, #fff)' }}>
                    <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)', marginBottom: 8 }}>
                      {navItems[activeRail].label}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--av-on-surface-variant, #49454F)' }}>
                      Content area for {navItems[activeRail].label.toLowerCase()} screen.
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Navigation Drawer ── */}
      <SubSection
        title="Navigation Drawer"
        description="The navigation drawer is a full sidebar for desktop layouts. It displays destinations with icons and text labels, and supports grouping with section headers."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Navigation Drawer',
              tag: 'Desktop',
              content: (
                <div style={{ display: 'flex', gap: 0, width: '100%', maxWidth: 600, height: 400, border: '1px solid var(--av-outline-variant, #CAC4D0)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{
                    width: 240,
                    background: 'var(--av-surface, #FAFBFF)',
                    borderRight: '1px solid var(--av-outline-variant, #CAC4D0)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px 12px',
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--av-on-surface, #1C1B1F)', padding: '8px 12px', marginBottom: 8 }}>
                      Quantify
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--av-on-surface-variant, #49454F)', padding: '12px 12px 8px' }}>
                      Main
                    </div>
                    {navItems.slice(0, 3).map((item, i) => {
                      const Icon = item.icon
                      const isActive = activeDrawer === i
                      return (
                        <div
                          key={i}
                          onClick={() => setActiveDrawer(i)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '10px 12px',
                            borderRadius: 'var(--av-radius-full, 24px)',
                            cursor: 'pointer',
                            background: isActive ? 'var(--av-blue-light, rgba(41,98,255,0.12))' : 'transparent',
                            color: isActive ? 'var(--av-blue, #2962FF)' : 'var(--av-on-surface-variant, #49454F)',
                            fontWeight: isActive ? 600 : 400,
                            fontSize: 14,
                            transition: 'all 150ms ease',
                          }}
                        >
                          <Icon size={20} />
                          {item.label}
                        </div>
                      )
                    })}
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--av-on-surface-variant, #49454F)', padding: '16px 12px 8px' }}>
                      System
                    </div>
                    {navItems.slice(3).map((item, i) => {
                      const idx = i + 3
                      const Icon = item.icon
                      const isActive = activeDrawer === idx
                      return (
                        <div
                          key={idx}
                          onClick={() => setActiveDrawer(idx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '10px 12px',
                            borderRadius: 'var(--av-radius-full, 24px)',
                            cursor: 'pointer',
                            background: isActive ? 'var(--av-blue-light, rgba(41,98,255,0.12))' : 'transparent',
                            color: isActive ? 'var(--av-blue, #2962FF)' : 'var(--av-on-surface-variant, #49454F)',
                            fontWeight: isActive ? 600 : 400,
                            fontSize: 14,
                            transition: 'all 150ms ease',
                          }}
                        >
                          <Icon size={20} />
                          {item.label}
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ flex: 1, padding: 24, background: 'var(--av-bg, #fff)' }}>
                    <div style={{ fontSize: 24, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)', marginBottom: 8 }}>
                      {navItems[activeDrawer].label}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--av-on-surface-variant, #49454F)', lineHeight: 1.6 }}>
                      Main content area for the {navItems[activeDrawer].label.toLowerCase()} destination. The navigation drawer remains visible on desktop for quick switching.
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Do & Don't ── */}
      <SubSection title="Do & Don't">
        <DoDontGrid items={[
          {
            type: 'do',
            content: (
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                height: 64,
                background: 'var(--av-surface)',
                border: '1px solid var(--av-outline-variant)',
                borderRadius: 8,
                width: '100%',
              }}>
                {navItems.slice(0, 4).map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Icon size={20} />
                      <span style={{ fontSize: 10, color: i === 0 ? 'var(--av-blue)' : 'var(--av-on-surface-variant)' }}>{item.label}</span>
                    </div>
                  )
                })}
              </div>
            ),
            caption: 'Use 3-5 destinations in bottom navigation. Each should be a top-level destination.',
          },
          {
            type: 'dont',
            content: (
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                height: 64,
                background: 'var(--av-surface)',
                border: '1px solid var(--av-outline-variant)',
                borderRadius: 8,
                width: '100%',
              }}>
                {['Home', 'Res', 'Inv', 'Rep', 'Set', 'Help', 'Pro'].map((label, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--av-outline-variant)' }} />
                    <span style={{ fontSize: 8, color: 'var(--av-on-surface-variant)' }}>{label}</span>
                  </div>
                ))}
              </div>
            ),
            caption: "Don't use more than 5 destinations. Excess items crowd the bar and reduce tap targets.",
          },
          {
            type: 'do',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                {navItems.slice(0, 3).map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 20, background: i === 0 ? 'var(--av-blue-light, rgba(41,98,255,0.12))' : 'transparent' }}>
                      <Icon size={18} />
                      <span style={{ fontSize: 14, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--av-blue)' : 'var(--av-on-surface-variant)' }}>{item.label}</span>
                    </div>
                  )
                })}
              </div>
            ),
            caption: 'Show a clear active state using background highlight and color to indicate the current destination.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                {navItems.slice(0, 3).map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px' }}>
                      <Icon size={18} />
                      <span style={{ fontSize: 14, color: 'var(--av-on-surface-variant)' }}>{item.label}</span>
                    </div>
                  )
                })}
              </div>
            ),
            caption: "Don't omit the active state indicator. Users need to know where they are at all times.",
          },
        ]} />
      </SubSection>

      {/* ── Properties Table ── */}
      <PropsTable
          componentName="NavigationView"
          props={[
            {
              name: 'PaneDisplayMode',
              type: 'NavigationViewPaneDisplayMode',
              default: 'Auto',
              description: 'Display mode: Auto (responsive), Left (drawer), LeftCompact (rail), LeftMinimal (collapsed), or Bottom.',
            },
            {
              name: 'MenuItems',
              type: 'IList<object>',
              description: 'The collection of navigation items displayed in the pane.',
            },
            {
              name: 'SelectedItem',
              type: 'object',
              description: 'The currently selected navigation item. Supports two-way binding.',
            },
            {
              name: 'IsPaneOpen',
              type: 'bool',
              default: 'true',
              description: 'Whether the navigation pane is expanded (drawer) or collapsed (rail).',
            },
            {
              name: 'CompactModeThresholdWidth',
              type: 'double',
              default: '641',
              description: 'Screen width at which the pane switches from rail to drawer mode.',
            },
            {
              name: 'Header',
              type: 'object',
              description: 'Content displayed above the navigation items (logo, search, etc.).',
            },
            {
              name: 'PaneFooter',
              type: 'UIElement',
              description: 'Content displayed at the bottom of the pane (settings, profile).',
            },
            {
              name: 'SelectionChanged',
              type: 'event',
              description: 'Event raised when the selected navigation item changes.',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Bottom Navigation -->
<muxc:NavigationView PaneDisplayMode="Bottom"
                     SelectionChanged="OnNavChanged">
  <muxc:NavigationView.MenuItems>
    <muxc:NavigationViewItem Content="Home"
                             Icon="Home" />
    <muxc:NavigationViewItem Content="Reservations"
                             Icon="Calendar" />
    <muxc:NavigationViewItem Content="Inventory"
                             Icon="AllApps" />
    <muxc:NavigationViewItem Content="Reports"
                             Icon="List" />
    <muxc:NavigationViewItem Content="Settings"
                             Icon="Setting" />
  </muxc:NavigationView.MenuItems>
  <Frame x:Name="ContentFrame" />
</muxc:NavigationView>

<!-- Navigation Rail (Compact Left) -->
<muxc:NavigationView PaneDisplayMode="LeftCompact"
                     IsPaneOpen="False"
                     CompactPaneLength="80">
  <muxc:NavigationView.MenuItems>
    <muxc:NavigationViewItem Content="Home"
                             Icon="Home" />
    <muxc:NavigationViewItem Content="Reservations"
                             Icon="Calendar" />
    <muxc:NavigationViewItem Content="Inventory"
                             Icon="AllApps" />
  </muxc:NavigationView.MenuItems>
  <Frame x:Name="ContentFrame" />
</muxc:NavigationView>

<!-- Full Navigation Drawer (Desktop) -->
<muxc:NavigationView PaneDisplayMode="Left"
                     IsPaneOpen="True"
                     OpenPaneLength="280">
  <muxc:NavigationView.PaneHeader>
    <TextBlock Text="Quantify"
               Style="{StaticResource TitleLarge}"
               Margin="16,12" />
  </muxc:NavigationView.PaneHeader>
  <muxc:NavigationView.MenuItems>
    <muxc:NavigationViewItemHeader Content="Main" />
    <muxc:NavigationViewItem Content="Home"
                             Icon="Home" />
    <muxc:NavigationViewItem Content="Reservations"
                             Icon="Calendar" />
    <muxc:NavigationViewItem Content="Inventory"
                             Icon="AllApps" />
    <muxc:NavigationViewItemSeparator />
    <muxc:NavigationViewItemHeader Content="System" />
    <muxc:NavigationViewItem Content="Reports"
                             Icon="List" />
    <muxc:NavigationViewItem Content="Settings"
                             Icon="Setting" />
  </muxc:NavigationView.MenuItems>
  <Frame x:Name="ContentFrame" />
</muxc:NavigationView>`}
        />
      </SubSection>
    </section>
  )
}
