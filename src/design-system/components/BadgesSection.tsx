import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import { Notification, Mail, Settings, Box, Person } from '../shared/Icons'

function BadgeIcon({ icon, badge, color }: { icon: React.ReactNode; badge?: string | null; color?: string }) {
  return (
    <div className="ds-badge-icon">
      {icon}
      {badge === 'dot' && <span className="ds-badge-dot" />}
      {badge && badge !== 'dot' && (
        <span className="ds-badge-num" style={color ? { background: color } : undefined}>
          {badge}
        </span>
      )}
    </div>
  )
}

function BadgeIconButton({ icon, badge, color }: { icon: React.ReactNode; badge?: string | null; color?: string }) {
  return (
    <div className="ds-badge-icon-btn">
      {icon}
      {badge === 'dot' && <span className="ds-badge-dot" />}
      {badge && badge !== 'dot' && (
        <span className="ds-badge-num" style={color ? { background: color } : undefined}>
          {badge}
        </span>
      )}
    </div>
  )
}

export default function BadgesSection() {
  return (
    <section id="badges" className="ds-section">
      <SectionHeader
        label="Component"
        title="Badges"
        description="Small count or dot indicators on icons and buttons for status updates."
      />

      {/* ── Dot Badge ── */}
      <SubSection
        title="Dot Badge"
        description="A small colored dot indicating new or unread content. Use when the exact count is not important."
      >
        <ComponentShowcase items={[
          {
            label: 'Notification Dot',
            tag: 'Indicator',
            content: <BadgeIcon icon={<Notification size={24} />} badge="dot" />,
          },
          {
            label: 'Mail Dot',
            tag: 'Indicator',
            content: <BadgeIcon icon={<Mail size={24} />} badge="dot" />,
          },
          {
            label: 'Settings Dot',
            tag: 'Indicator',
            content: <BadgeIcon icon={<Settings size={24} />} badge="dot" />,
          },
        ]} />
      </SubSection>

      {/* ── Numbered Badge ── */}
      <SubSection
        title="Numbered Badge"
        description="Shows a specific count. Single digits display as a circle; counts above 99 display as '99+' in a pill shape."
      >
        <ComponentShowcase items={[
          {
            label: 'Count: 3',
            tag: 'Low',
            content: <BadgeIcon icon={<Notification size={24} />} badge="3" />,
          },
          {
            label: 'Count: 9',
            tag: 'Medium',
            content: <BadgeIcon icon={<Notification size={24} />} badge="9" />,
          },
          {
            label: 'Count: 24',
            tag: 'High',
            content: <BadgeIcon icon={<Notification size={24} />} badge="24" />,
          },
          {
            label: 'Count: 99+',
            tag: 'Overflow',
            content: <BadgeIcon icon={<Mail size={24} />} badge="99+" />,
          },
        ]} />
      </SubSection>

      {/* ── On Icon Buttons ── */}
      <SubSection
        title="On Icon Buttons"
        description="Badges placed on icon buttons in toolbars and navigation bars, offset to the top-right of the icon."
      >
        <ComponentShowcase items={[
          {
            label: 'Notification Bell',
            tag: 'Toolbar',
            content: <BadgeIconButton icon={<Notification size={22} />} badge="5" />,
          },
          {
            label: 'Messages',
            tag: 'Toolbar',
            content: <BadgeIconButton icon={<Mail size={22} />} badge="12" />,
          },
          {
            label: 'Inventory Alerts',
            tag: 'Toolbar',
            content: <BadgeIconButton icon={<Box size={22} />} badge="3" />,
          },
          {
            label: 'User Profile',
            tag: 'Toolbar',
            content: <BadgeIconButton icon={<Person size={22} />} badge="dot" />,
          },
        ]} />
      </SubSection>

      {/* ── Color Variants ── */}
      <SubSection
        title="Color Variants"
        description="Different badge colors convey urgency or category. Error red is default; blue and teal for informational or success states."
      >
        <ComponentShowcase items={[
          {
            label: 'Error (Default)',
            tag: 'Urgent',
            content: <BadgeIcon icon={<Notification size={24} />} badge="7" />,
          },
          {
            label: 'Blue',
            tag: 'Info',
            content: <BadgeIcon icon={<Notification size={24} />} badge="4" color="var(--av-blue, #2962FF)" />,
          },
          {
            label: 'Teal',
            tag: 'Success',
            content: <BadgeIcon icon={<Notification size={24} />} badge="2" color="var(--av-teal, #009B86)" />,
          },
          {
            label: 'Navy',
            tag: 'Brand',
            content: <BadgeIcon icon={<Notification size={24} />} badge="1" color="var(--av-navy, #0A1F44)" />,
          },
        ]} />
      </SubSection>

      {/* ── In Context ── */}
      <SubSection
        title="In Context: Navigation Bar"
        description="Badges in bottom navigation indicate pending items, unread messages, or required actions."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Bottom Nav with Badges',
              tag: 'Pattern',
              content: (
                <div className="ds-badge-nav-bar">
                  {[
                    { icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>, label: 'Home', badge: null, active: true },
                    { icon: <Box size={24} />, label: 'Inventory', badge: '3', active: false },
                    { icon: <Mail size={24} />, label: 'Messages', badge: '12', active: false },
                    { icon: <Notification size={24} />, label: 'Alerts', badge: 'dot', active: false },
                    { icon: <Person size={24} />, label: 'Profile', badge: null, active: false },
                  ].map((item, i) => (
                    <div key={i} className="ds-badge-nav-item">
                      <div className="ds-badge-nav-icon-wrap">
                        <div className={`ds-badge-nav-icon ${item.active ? 'active' : ''}`}>
                          {item.icon}
                        </div>
                        {item.badge === 'dot' && <span className="ds-badge-dot" />}
                        {item.badge && item.badge !== 'dot' && (
                          <span className="ds-badge-num">{item.badge}</span>
                        )}
                      </div>
                      <span className={`ds-badge-nav-label ${item.active ? 'active' : ''}`}>{item.label}</span>
                    </div>
                  ))}
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
            content: <BadgeIcon icon={<Notification size={24} />} badge="3" />,
            caption: 'Use badges to show real, dynamic counts that reflect actual data.',
          },
          {
            type: 'dont',
            content: <BadgeIcon icon={<Notification size={24} />} badge="0" />,
            caption: "Don't show a badge with zero. Remove it entirely when there are no items.",
          },
          {
            type: 'do',
            content: <BadgeIcon icon={<Notification size={24} />} badge="99+" />,
            caption: 'Cap the number at 99+ to prevent badges from becoming too wide.',
          },
          {
            type: 'dont',
            content: <BadgeIcon icon={<Notification size={24} />} badge="1,247" />,
            caption: "Don't display very large numbers. They break the badge shape.",
          },
        ]} />
      </SubSection>

      {/* ── Properties Table ── */}
      <PropsTable
        componentName="InfoBadge"
        props={[
          {
            name: 'Value',
            type: 'int',
            default: '-1',
            description: 'The numeric value to display. Set to -1 for a dot-only badge.',
          },
          {
            name: 'Style',
            type: 'StaticResource',
            default: 'AttentionDotInfoBadgeStyle',
            description: 'AttentionDotInfoBadgeStyle (dot) or AttentionValueInfoBadgeStyle (numbered).',
          },
          {
            name: 'Background',
            type: 'Brush',
            default: 'ErrorBrush',
            description: 'The fill color of the badge. Default is error red.',
          },
          {
            name: 'Foreground',
            type: 'Brush',
            default: 'OnErrorBrush',
            description: 'The text color inside the badge.',
          },
          {
            name: 'HorizontalAnchor',
            type: 'BadgeAnchor',
            default: 'Right',
            description: 'Horizontal positioning relative to the parent element.',
          },
          {
            name: 'VerticalAnchor',
            type: 'BadgeAnchor',
            default: 'Top',
            description: 'Vertical positioning relative to the parent element.',
          },
        ]}
      />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Dot Badge on Icon Button -->
<Grid>
  <Button Style="{StaticResource IconButtonStyle}">
    <SymbolIcon Symbol="Alert" />
  </Button>
  <InfoBadge Style="{StaticResource AttentionDotInfoBadgeStyle}"
             HorizontalAlignment="Right"
             VerticalAlignment="Top"
             Margin="0,-4,-4,0" />
</Grid>

<!-- Numbered Badge on Notification Bell -->
<Grid>
  <Button Style="{StaticResource IconButtonStyle}">
    <SymbolIcon Symbol="Alert" />
  </Button>
  <InfoBadge Value="{Binding UnreadCount}"
             Style="{StaticResource AttentionValueInfoBadgeStyle}"
             HorizontalAlignment="Right"
             VerticalAlignment="Top"
             Margin="0,-4,-4,0" />
</Grid>

<!-- Badge with Custom Color -->
<Grid>
  <Button Style="{StaticResource IconButtonStyle}">
    <SymbolIcon Symbol="Mail" />
  </Button>
  <InfoBadge Value="12"
             Background="{StaticResource QuantifyBlueBrush}"
             HorizontalAlignment="Right"
             VerticalAlignment="Top" />
</Grid>

<!-- Badge in Bottom Navigation -->
<muxc:NavigationView PaneDisplayMode="Bottom">
  <muxc:NavigationViewItem Content="Messages"
                           Icon="Mail">
    <muxc:NavigationViewItem.InfoBadge>
      <InfoBadge Value="{Binding MessageCount}" />
    </muxc:NavigationViewItem.InfoBadge>
  </muxc:NavigationViewItem>
</muxc:NavigationView>`}
        />
      </SubSection>
    </section>
  )
}
