import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import { Home, Box, Calendar, List } from '../shared/Icons'

export default function TabsSection() {
  const [primaryTab, setPrimaryTab] = useState(0)
  const [secondaryTab, setSecondaryTab] = useState(0)
  const [iconTab, setIconTab] = useState(0)
  const [scrollTab, setScrollTab] = useState(2)

  const primaryTabs = ['All', 'Active', 'Completed', 'Cancelled']
  const secondaryTabs = ['Details', 'Equipment', 'History', 'Notes']
  const iconTabs = [
    { icon: Home, label: 'Overview' },
    { icon: Calendar, label: 'Schedule' },
    { icon: Box, label: 'Equipment' },
    { icon: List, label: 'Reports' },
  ]
  const scrollableTabs = ['Scaffolding', 'Safety', 'Formwork', 'Shoring', 'Planks', 'Accessories', 'Couplers', 'Braces']

  const tabBarStyle: React.CSSProperties = {
    display: 'flex',
    borderBottom: '1px solid var(--av-outline-variant, #CAC4D0)',
    width: '100%',
    maxWidth: 400,
  }

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '12px 16px',
    fontSize: 14,
    fontWeight: isActive ? 600 : 500,
    color: isActive ? 'var(--av-blue, #2962FF)' : 'var(--av-on-surface-variant, #49454F)',
    background: 'transparent',
    border: 'none',
    borderBottom: isActive ? '3px solid var(--av-blue, #2962FF)' : '3px solid transparent',
    cursor: 'pointer',
    textAlign: 'center' as const,
    transition: 'all 200ms ease',
    fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
    whiteSpace: 'nowrap' as const,
  })

  return (
    <section id="tabs" className="ds-section">
      <SectionHeader
        label="Component"
        title="Tabs"
        description="Switch between content groups without leaving the current screen."
      />

      {/* ── Primary Tabs ── */}
      <SubSection
        title="Primary Tabs"
        description="Primary tabs use a bold underline indicator and are used for top-level content categories. They are the main navigation within a screen."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Primary Tabs',
              tag: 'Interactive',
              content: (
                <div style={{ width: '100%', maxWidth: 400 }}>
                  <div style={tabBarStyle}>
                    {primaryTabs.map((tab, i) => (
                      <button
                        key={i}
                        onClick={() => setPrimaryTab(i)}
                        style={tabStyle(primaryTab === i)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div style={{ padding: 16, fontSize: 14, color: 'var(--av-on-surface-variant, #49454F)' }}>
                    Showing {primaryTabs[primaryTab].toLowerCase()} reservations.
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Primary Tabs with Icons ── */}
      <SubSection
        title="Primary Tabs with Icons"
        description="Icons can be added above the label for stronger visual association. Use consistently across all tabs in a group."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Icon + Text Tabs',
              tag: 'Interactive',
              content: (
                <div style={{ width: '100%', maxWidth: 440 }}>
                  <div style={tabBarStyle}>
                    {iconTabs.map((tab, i) => {
                      const Icon = tab.icon
                      const isActive = iconTab === i
                      return (
                        <button
                          key={i}
                          onClick={() => setIconTab(i)}
                          style={{
                            ...tabStyle(isActive),
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                            padding: '8px 16px 10px',
                          }}
                        >
                          <Icon size={20} />
                          {tab.label}
                        </button>
                      )
                    })}
                  </div>
                  <div style={{ padding: 16, fontSize: 14, color: 'var(--av-on-surface-variant, #49454F)' }}>
                    Content for {iconTabs[iconTab].label.toLowerCase()} tab.
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Secondary Tabs ── */}
      <SubSection
        title="Secondary Tabs"
        description="Secondary tabs are text-only and are used for sub-navigation within a section. They have a thinner underline and less visual weight than primary tabs."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Secondary Tabs',
              tag: 'Interactive',
              content: (
                <div style={{ width: '100%', maxWidth: 400 }}>
                  <div style={{ ...tabBarStyle, borderBottom: '1px solid var(--av-outline-variant, #CAC4D0)' }}>
                    {secondaryTabs.map((tab, i) => {
                      const isActive = secondaryTab === i
                      return (
                        <button
                          key={i}
                          onClick={() => setSecondaryTab(i)}
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            fontSize: 13,
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? 'var(--av-on-surface, #1C1B1F)' : 'var(--av-on-surface-variant, #49454F)',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: isActive ? '2px solid var(--av-on-surface, #1C1B1F)' : '2px solid transparent',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 200ms ease',
                            fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
                          }}
                        >
                          {tab}
                        </button>
                      )
                    })}
                  </div>
                  <div style={{ padding: 16, fontSize: 14, color: 'var(--av-on-surface-variant, #49454F)' }}>
                    Reservation {secondaryTabs[secondaryTab].toLowerCase()} content.
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Active / Inactive States ── */}
      <SubSection
        title="Active & Inactive States"
        description="Active tabs are visually distinct with a colored underline and bold text. Inactive tabs use muted text. Only one tab can be active at a time."
      >
        <ComponentShowcase items={[
          {
            label: 'Active State',
            tag: 'State',
            content: (
              <div style={{ display: 'inline-flex', borderBottom: '1px solid var(--av-outline-variant, #CAC4D0)' }}>
                <div style={{
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--av-blue, #2962FF)',
                  borderBottom: '3px solid var(--av-blue, #2962FF)',
                }}>
                  Active
                </div>
              </div>
            ),
          },
          {
            label: 'Inactive State',
            tag: 'State',
            content: (
              <div style={{ display: 'inline-flex', borderBottom: '1px solid var(--av-outline-variant, #CAC4D0)' }}>
                <div style={{
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--av-on-surface-variant, #49454F)',
                  borderBottom: '3px solid transparent',
                }}>
                  Inactive
                </div>
              </div>
            ),
          },
        ]} />
      </SubSection>

      {/* ── Scrollable Tabs ── */}
      <SubSection
        title="Scrollable Tabs"
        description="When there are too many tabs to fit in the viewport, use scrollable tabs. Tabs are not equally sized and can be scrolled horizontally."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Scrollable Tabs',
              tag: 'Overflow',
              content: (
                <div style={{ width: '100%', maxWidth: 400, overflow: 'hidden' }}>
                  <div style={{
                    display: 'flex',
                    overflowX: 'auto',
                    borderBottom: '1px solid var(--av-outline-variant, #CAC4D0)',
                    scrollbarWidth: 'none',
                  }}>
                    {scrollableTabs.map((tab, i) => {
                      const isActive = scrollTab === i
                      return (
                        <button
                          key={i}
                          onClick={() => setScrollTab(i)}
                          style={{
                            padding: '12px 20px',
                            fontSize: 14,
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? 'var(--av-blue, #2962FF)' : 'var(--av-on-surface-variant, #49454F)',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: isActive ? '3px solid var(--av-blue, #2962FF)' : '3px solid transparent',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
                            transition: 'all 200ms ease',
                          }}
                        >
                          {tab}
                        </button>
                      )
                    })}
                  </div>
                  <div style={{ padding: 16, fontSize: 14, color: 'var(--av-on-surface-variant, #49454F)' }}>
                    Showing {scrollableTabs[scrollTab].toLowerCase()} equipment category.
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
              <div style={{ display: 'flex', borderBottom: '1px solid var(--av-outline-variant)', width: '100%' }}>
                {['All', 'Active', 'Completed'].map((t, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', padding: '10px 0', fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--av-blue)' : 'var(--av-on-surface-variant)', borderBottom: i === 0 ? '3px solid var(--av-blue)' : 'none' }}>{t}</div>
                ))}
              </div>
            ),
            caption: 'Use short, clear tab labels that describe the content category. Keep them to 1-2 words.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ display: 'flex', borderBottom: '1px solid var(--av-outline-variant)', width: '100%' }}>
                {['All Reservations List', 'Currently Active Items', 'Previously Completed'].map((t, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', padding: '10px 0', fontSize: 11, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--av-blue)' : 'var(--av-on-surface-variant)', borderBottom: i === 0 ? '3px solid var(--av-blue)' : 'none' }}>{t}</div>
                ))}
              </div>
            ),
            caption: "Don't use long labels. They cause text truncation and make tabs harder to scan.",
          },
          {
            type: 'do',
            content: (
              <div style={{ display: 'flex', borderBottom: '1px solid var(--av-outline-variant)', width: '100%' }}>
                {['Overview', 'Schedule', 'Equipment'].map((t, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', padding: '10px 0', fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--av-blue)' : 'var(--av-on-surface-variant)', borderBottom: i === 0 ? '3px solid var(--av-blue)' : 'none' }}>{t}</div>
                ))}
              </div>
            ),
            caption: 'Use a minimum of 2 tabs. If there is only one category, tabs are unnecessary.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ display: 'flex', borderBottom: '1px solid var(--av-outline-variant)', width: '100%' }}>
                <div style={{ flex: 1, textAlign: 'center', padding: '10px 0', fontSize: 13, fontWeight: 600, color: 'var(--av-blue)', borderBottom: '3px solid var(--av-blue)' }}>Everything</div>
              </div>
            ),
            caption: "Don't use a single tab. If there is only one view, show the content directly without tabs.",
          },
        ]} />
      </SubSection>

      {/* ── Properties Table ── */}
      <PropsTable
          componentName="TabView / Pivot"
          props={[
            {
              name: 'TabItems',
              type: 'IList<TabViewItem>',
              description: 'The collection of tab items displayed in the tab bar.',
            },
            {
              name: 'SelectedIndex',
              type: 'int',
              default: '0',
              description: 'The zero-based index of the currently selected tab.',
            },
            {
              name: 'SelectedItem',
              type: 'object',
              description: 'The currently selected tab item. Supports two-way binding.',
            },
            {
              name: 'TabStripPlacement',
              type: 'TabStripPlacement',
              default: 'Top',
              description: 'Where the tab strip is positioned: Top or Bottom.',
            },
            {
              name: 'IsSwipeEnabled',
              type: 'bool',
              default: 'true',
              description: 'Whether swiping between tab content is enabled on touch devices.',
            },
            {
              name: 'TabWidthMode',
              type: 'TabViewWidthMode',
              default: 'Equal',
              description: 'How tab width is calculated: Equal (fill width), SizeToContent (fit label), or Compact.',
            },
            {
              name: 'SelectionChanged',
              type: 'event',
              description: 'Event raised when the selected tab changes.',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Primary Tabs -->
<muxc:TabView SelectedIndex="0"
              TabWidthMode="Equal">
  <muxc:TabViewItem Header="All">
    <ListView ItemsSource="{Binding AllReservations}" />
  </muxc:TabViewItem>
  <muxc:TabViewItem Header="Active">
    <ListView ItemsSource="{Binding ActiveReservations}" />
  </muxc:TabViewItem>
  <muxc:TabViewItem Header="Completed">
    <ListView ItemsSource="{Binding CompletedReservations}" />
  </muxc:TabViewItem>
  <muxc:TabViewItem Header="Cancelled">
    <ListView ItemsSource="{Binding CancelledReservations}" />
  </muxc:TabViewItem>
</muxc:TabView>

<!-- Tabs with Icons -->
<muxc:TabView SelectedIndex="0">
  <muxc:TabViewItem>
    <muxc:TabViewItem.HeaderTemplate>
      <DataTemplate>
        <StackPanel Spacing="4" HorizontalAlignment="Center">
          <SymbolIcon Symbol="Home" />
          <TextBlock Text="Overview" />
        </StackPanel>
      </DataTemplate>
    </muxc:TabViewItem.HeaderTemplate>
    <!-- Tab content -->
  </muxc:TabViewItem>
</muxc:TabView>

<!-- Pivot (Alternative Tab Control) -->
<Pivot SelectedIndex="{Binding SelectedTabIndex, Mode=TwoWay}">
  <PivotItem Header="Details">
    <ScrollViewer>
      <!-- Detail fields -->
    </ScrollViewer>
  </PivotItem>
  <PivotItem Header="Equipment">
    <ListView ItemsSource="{Binding Equipment}" />
  </PivotItem>
  <PivotItem Header="History">
    <ListView ItemsSource="{Binding AuditLog}" />
  </PivotItem>
</Pivot>`}
        />
      </SubSection>
    </section>
  )
}
