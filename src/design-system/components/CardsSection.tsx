import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'

/* ── Shared inline styles for card demos ── */
const imagePlaceholder: React.CSSProperties = {
  height: 160,
  background: 'linear-gradient(135deg, var(--av-blue-100) 0%, var(--av-blue-300) 100%)',
  borderRadius: 'var(--av-radius-lg) var(--av-radius-lg) 0 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--av-blue-600)',
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: 0.5,
}

const cardTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: 'var(--av-on-surface)',
  marginBottom: 4,
}

const cardDesc: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.5,
  color: 'var(--av-on-surface-variant)',
}

const cardActions: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
  marginTop: 16,
}

const badge = (color: string, bg: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: 11,
  fontWeight: 600,
  padding: '2px 10px',
  borderRadius: 'var(--av-radius-full)',
  color,
  background: bg,
})

const metaRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 12,
  color: 'var(--av-on-surface-variant)',
  marginTop: 6,
}

/* ── Simple card content helper ── */
function SimpleCard({ variant }: { variant: string }) {
  return (
    <div className={`ds-card ${variant}`} style={{ maxWidth: 300, width: '100%' }}>
      <div style={cardTitle}>Riverside Tower Project</div>
      <div style={cardDesc}>Scaffold rental reservation for the east wing renovation, floors 8-14.</div>
    </div>
  )
}

/* ── Card with image placeholder ── */
function ImageCard({ variant }: { variant: string }) {
  return (
    <div className={`ds-card ${variant}`} style={{ maxWidth: 300, width: '100%', padding: 0, overflow: 'hidden' }}>
      <div style={imagePlaceholder}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <div style={{ padding: 16 }}>
        <div style={cardTitle}>Site Photo — East Wing</div>
        <div style={cardDesc}>Captured March 12, 2026. Scaffolding installation progress at 68%.</div>
      </div>
    </div>
  )
}

/* ── Card with action buttons ── */
function ActionCard({ variant }: { variant: string }) {
  return (
    <div className={`ds-card ${variant}`} style={{ maxWidth: 300, width: '100%' }}>
      <div style={cardTitle}>Equipment Return</div>
      <div style={cardDesc}>45 scaffold frames due for return to warehouse by March 20, 2026.</div>
      <div style={cardActions}>
        <button className="ds-btn ds-btn-text" style={{ height: 36, fontSize: 13 }}>Dismiss</button>
        <button className="ds-btn ds-btn-filled" style={{ height: 36, fontSize: 13 }}>Process Return</button>
      </div>
    </div>
  )
}

/* ── Clickable / hoverable card ── */
function ClickableCard({ variant }: { variant: string }) {
  return (
    <div
      className={`ds-card ${variant}`}
      style={{ maxWidth: 300, width: '100%', cursor: 'pointer' }}
      role="button"
      tabIndex={0}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={cardTitle}>View All Reservations</div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--av-on-surface-variant)" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
      <div style={cardDesc}>Browse and manage all active equipment reservations for your projects.</div>
    </div>
  )
}

/* ── Complex reservation card ── */
function ReservationCard({ variant }: { variant: string }) {
  return (
    <div className={`ds-card ${variant}`} style={{ maxWidth: 340, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={cardTitle}>Riverside Tower Project</div>
          <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)' }}>RSV-2026-0847</div>
        </div>
        <span style={badge('#004E43', 'var(--av-success-container)')}>Active</span>
      </div>

      <div style={{ borderTop: '1px solid var(--av-outline-variant)', paddingTop: 12 }}>
        <div style={metaRow}>
          <span>Qty: 450 frames</span>
          <span>12 braces</span>
        </div>
        <div style={metaRow}>
          <span>Delivery: March 15, 2026</span>
        </div>
        <div style={metaRow}>
          <span>Return: June 30, 2026</span>
        </div>
      </div>

      <div style={{ marginTop: 12, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--av-on-surface-variant)', marginBottom: 4 }}>
          <span>Fulfillment</span>
          <span>72%</span>
        </div>
        <div style={{ width: '100%', height: 4, background: 'var(--av-blue-50)', borderRadius: 2 }}>
          <div style={{ width: '72%', height: '100%', background: 'var(--av-blue)', borderRadius: 2 }} />
        </div>
      </div>

      <div style={cardActions}>
        <button className="ds-btn ds-btn-text" style={{ height: 36, fontSize: 13 }}>Details</button>
        <button className="ds-btn ds-btn-filled" style={{ height: 36, fontSize: 13 }}>Track Shipment</button>
      </div>
    </div>
  )
}

export default function CardsSection() {
  return (
    <section id="cards" className="ds-section">
      <SectionHeader
        label="Component"
        title="Cards"
        description="Content containers in three variants: elevated, filled, and outlined."
      />

      {/* ── Variant Overview ── */}
      <SubSection
        title="Card Variants"
        description="Choose the card variant based on context. Elevated cards sit above the surface with a shadow for emphasis. Filled cards blend into the layout using a tinted background. Outlined cards use a border to define boundaries without elevation."
      >
        <ComponentShowcase items={[
          {
            label: 'Elevated',
            tag: 'Surface + Shadow',
            content: <SimpleCard variant="ds-card-elevated" />,
          },
          {
            label: 'Filled',
            tag: 'Surface-2 BG',
            content: <SimpleCard variant="ds-card-filled" />,
          },
          {
            label: 'Outlined',
            tag: 'Border',
            content: <SimpleCard variant="ds-card-outlined" />,
          },
        ]} />
      </SubSection>

      {/* ── With Image ── */}
      <SubSection
        title="With Image"
        description="Cards can display media at the top. Images fill the full width of the card with no padding, while text content sits below with standard 16px padding."
      >
        <ComponentShowcase items={[
          {
            label: 'Elevated + Image',
            tag: 'Card',
            content: <ImageCard variant="ds-card-elevated" />,
          },
          {
            label: 'Filled + Image',
            tag: 'Card',
            content: <ImageCard variant="ds-card-filled" />,
          },
          {
            label: 'Outlined + Image',
            tag: 'Card',
            content: <ImageCard variant="ds-card-outlined" />,
          },
        ]} />
      </SubSection>

      {/* ── With Action Buttons ── */}
      <SubSection
        title="With Actions"
        description="Cards can include action buttons at the bottom, aligned to the right. Use a text button for the secondary action and a filled button for the primary action."
      >
        <ComponentShowcase items={[
          {
            label: 'Elevated + Actions',
            tag: 'Card',
            content: <ActionCard variant="ds-card-elevated" />,
          },
          {
            label: 'Filled + Actions',
            tag: 'Card',
            content: <ActionCard variant="ds-card-filled" />,
          },
          {
            label: 'Outlined + Actions',
            tag: 'Card',
            content: <ActionCard variant="ds-card-outlined" />,
          },
        ]} />
      </SubSection>

      {/* ── Clickable / Hoverable ── */}
      <SubSection
        title="Clickable Cards"
        description="Cards that act as navigation targets or tappable areas. On hover, elevated cards increase their shadow level while outlined and filled cards gain a subtle background tint."
      >
        <ComponentShowcase items={[
          {
            label: 'Elevated (Hover)',
            tag: 'Interactive',
            content: <ClickableCard variant="ds-card-elevated" />,
          },
          {
            label: 'Filled (Hover)',
            tag: 'Interactive',
            content: <ClickableCard variant="ds-card-filled" />,
          },
          {
            label: 'Outlined (Hover)',
            tag: 'Interactive',
            content: <ClickableCard variant="ds-card-outlined" />,
          },
        ]} />
      </SubSection>

      {/* ── Complex Content ── */}
      <SubSection
        title="Complex Content"
        description="Real-world cards often contain structured data. This reservation card shows project details, quantity metrics, date ranges, status badges, and a progress bar -- typical for Quantify workflows."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Reservation Card — Elevated',
              tag: 'Quantify Pattern',
              content: (
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  <ReservationCard variant="ds-card-elevated" />
                  <ReservationCard variant="ds-card-outlined" />
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Card List Pattern ── */}
      <SubSection
        title="Card List Pattern"
        description="Cards displayed as a list of related items. Use a consistent variant within a single list to maintain visual rhythm."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Outlined Card List',
              tag: 'Pattern',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
                  {[
                    { name: 'Riverside Tower', qty: '450 frames', status: 'Active', statusColor: '#004E43', statusBg: 'var(--av-success-container)' },
                    { name: 'Harbor Bridge Repair', qty: '120 frames', status: 'Pending', statusColor: '#5D4300', statusBg: 'var(--av-warning-container)' },
                    { name: 'Metro Station B2', qty: '280 frames', status: 'Shipped', statusColor: '#000377', statusBg: 'var(--av-info-container)' },
                  ].map((item) => (
                    <div key={item.name} className="ds-card ds-card-outlined" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface)' }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant)', marginTop: 2 }}>{item.qty}</div>
                      </div>
                      <span style={badge(item.statusColor, item.statusBg)}>{item.status}</span>
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
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 240 }}>
                <div className="ds-card ds-card-outlined" style={{ padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Riverside Tower</div>
                  <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)' }}>450 frames</div>
                </div>
                <div className="ds-card ds-card-outlined" style={{ padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Harbor Bridge</div>
                  <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)' }}>120 frames</div>
                </div>
              </div>
            ),
            caption: 'Use a consistent card variant within the same list. Outlined cards work well for browsable lists of items.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 240 }}>
                <div className="ds-card ds-card-elevated" style={{ padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Riverside Tower</div>
                  <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)' }}>450 frames</div>
                </div>
                <div className="ds-card ds-card-filled" style={{ padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Harbor Bridge</div>
                  <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)' }}>120 frames</div>
                </div>
              </div>
            ),
            caption: 'Don\'t mix card types within the same list. Inconsistent elevation and borders create visual noise.',
          },
          {
            type: 'do',
            content: (
              <div className="ds-card ds-card-elevated" style={{ padding: 16, maxWidth: 220 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Equipment Return</div>
                <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', lineHeight: 1.4 }}>45 frames due March 20</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                  <button className="ds-btn ds-btn-filled" style={{ height: 32, fontSize: 12 }}>Process</button>
                </div>
              </div>
            ),
            caption: 'Keep card content concise. Show only the most relevant information and provide a clear primary action.',
          },
          {
            type: 'dont',
            content: (
              <div className="ds-card ds-card-elevated" style={{ padding: 16, maxWidth: 220 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Equipment Return Notice</div>
                <div style={{ fontSize: 10, color: 'var(--av-on-surface-variant)', lineHeight: 1.3 }}>
                  You have 45 frames, 12 braces, 8 base plates, and 4 ladders due for return to the main warehouse facility no later than March 20, 2026. Please contact dispatch.
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                  <button className="ds-btn ds-btn-filled" style={{ height: 28, fontSize: 10, padding: '0 8px' }}>Process</button>
                  <button className="ds-btn ds-btn-outlined" style={{ height: 28, fontSize: 10, padding: '0 8px' }}>Delay</button>
                  <button className="ds-btn ds-btn-text" style={{ height: 28, fontSize: 10, padding: '0 6px' }}>Info</button>
                </div>
              </div>
            ),
            caption: 'Don\'t overload cards with excessive text or too many actions. Move details to a detail view.',
          },
        ]} />
      </SubSection>

      {/* ── Properties ── */}
      <PropsTable
          componentName="Card"
          props={[
            {
              name: 'Style',
              type: 'StaticResource',
              default: 'ElevatedCardStyle',
              description: 'The visual variant: ElevatedCardStyle, FilledCardStyle, or OutlinedCardStyle.',
            },
            {
              name: 'CornerRadius',
              type: 'CornerRadius',
              default: '0',
              description: 'Border radius of the card container. Defaults to sharp corners per Probe design language.',
            },
            {
              name: 'Padding',
              type: 'Thickness',
              default: '20',
              description: 'Internal padding of the card. Set to 0 for cards with edge-to-edge media.',
            },
            {
              name: 'Background',
              type: 'Brush',
              description: 'Override the background color. Defaults to Surface for elevated, Surface-2 for filled, and white for outlined.',
            },
            {
              name: 'BorderBrush',
              type: 'Brush',
              default: 'OutlineVariant',
              description: 'Border color for outlined cards. Not applicable to elevated or filled variants.',
            },
            {
              name: 'BorderThickness',
              type: 'Thickness',
              default: '1',
              description: 'Border width for outlined cards.',
            },
            {
              name: 'Shadow',
              type: 'Shadow',
              default: 'Shadow1',
              description: 'Box shadow for elevated cards. Increases on hover for interactive cards.',
            },
            {
              name: 'IsClickable',
              type: 'bool',
              default: 'false',
              description: 'When true, the card responds to pointer events with hover elevation changes and ripple effects.',
            },
            {
              name: 'Command',
              type: 'ICommand',
              description: 'Command to execute when the card is clicked. Only applies when IsClickable is true.',
            },
            {
              name: 'Content',
              type: 'UIElement',
              description: 'The child content displayed inside the card container.',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Elevated Card (default) -->
<Border Style="{StaticResource ElevatedCardStyle}">
  <StackPanel Spacing="4">
    <TextBlock Text="Riverside Tower Project"
               Style="{StaticResource TitleMedium}" />
    <TextBlock Text="Scaffold rental reservation for the east wing."
               Style="{StaticResource BodyMedium}"
               Foreground="{ThemeResource OnSurfaceVariantBrush}" />
  </StackPanel>
</Border>

<!-- Filled Card -->
<Border Style="{StaticResource FilledCardStyle}">
  <StackPanel Spacing="4">
    <TextBlock Text="Equipment Summary"
               Style="{StaticResource TitleMedium}" />
    <TextBlock Text="Qty: 450 frames, 12 braces"
               Style="{StaticResource BodyMedium}"
               Foreground="{ThemeResource OnSurfaceVariantBrush}" />
  </StackPanel>
</Border>

<!-- Outlined Card -->
<Border Style="{StaticResource OutlinedCardStyle}">
  <StackPanel Spacing="4">
    <TextBlock Text="Harbor Bridge Repair"
               Style="{StaticResource TitleMedium}" />
    <TextBlock Text="120 frames - Pending approval"
               Style="{StaticResource BodyMedium}"
               Foreground="{ThemeResource OnSurfaceVariantBrush}" />
  </StackPanel>
</Border>

<!-- Card with Image -->
<Border Style="{StaticResource ElevatedCardStyle}"
        Padding="0">
  <StackPanel>
    <Image Source="ms-appx:///Assets/site-photo.jpg"
           Height="160"
           Stretch="UniformToFill" />
    <StackPanel Padding="16" Spacing="4">
      <TextBlock Text="Site Photo — East Wing"
                 Style="{StaticResource TitleMedium}" />
      <TextBlock Text="Installation progress at 68%."
                 Style="{StaticResource BodyMedium}"
                 Foreground="{ThemeResource OnSurfaceVariantBrush}" />
    </StackPanel>
  </StackPanel>
</Border>

<!-- Card with Actions -->
<Border Style="{StaticResource OutlinedCardStyle}">
  <StackPanel Spacing="12">
    <TextBlock Text="Equipment Return"
               Style="{StaticResource TitleMedium}" />
    <TextBlock Text="45 scaffold frames due for return."
               Style="{StaticResource BodyMedium}"
               Foreground="{ThemeResource OnSurfaceVariantBrush}" />
    <StackPanel Orientation="Horizontal"
                HorizontalAlignment="Right"
                Spacing="8">
      <Button Content="Dismiss"
              Style="{StaticResource TextButtonStyle}" />
      <Button Content="Process Return"
              Style="{StaticResource FilledButtonStyle}" />
    </StackPanel>
  </StackPanel>
</Border>

<!-- Clickable Card -->
<Button Style="{StaticResource CardButtonStyle}"
        Command="{Binding NavigateToReservationsCommand}">
  <Border Style="{StaticResource ElevatedCardStyle}">
    <StackPanel Spacing="4">
      <TextBlock Text="View All Reservations"
                 Style="{StaticResource TitleMedium}" />
      <TextBlock Text="Browse active equipment reservations."
                 Style="{StaticResource BodyMedium}"
                 Foreground="{ThemeResource OnSurfaceVariantBrush}" />
    </StackPanel>
  </Border>
</Button>`}
        />
      </SubSection>
    </section>
  )
}
