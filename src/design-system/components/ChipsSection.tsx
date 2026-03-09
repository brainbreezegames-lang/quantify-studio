import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'

/* ── Inline SVG icons ── */
const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)

const DirectionsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
)

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function ChipsSection() {
  /* Filter chip toggle state */
  const [filters, setFilters] = useState({
    all: true,
    pending: false,
    shipped: false,
    delivered: false,
  })

  /* Input chip removal state */
  const [inputChips, setInputChips] = useState(['React', 'TypeScript', 'Tailwind', 'Vite'])

  /* Assist chip demo */
  const [assistSelected, setAssistSelected] = useState<string | null>(null)

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const removeInputChip = (chip: string) => {
    setInputChips(prev => prev.filter(c => c !== chip))
  }

  return (
    <div className="ds-section" id="chips">
      <SectionHeader
        label="Selection Controls"
        title="Chips"
        description="Compact interactive elements — assist, filter, input, and suggestion types."
      />

      {/* ── Chip Types ── */}
      <SubSection title="Chip Types" description="Each chip type serves a distinct purpose. Assist chips trigger smart actions, Filter chips narrow content, Input chips represent user-entered data, and Suggestion chips offer dynamic recommendations.">
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Assist Chip',
              tag: 'Action',
              content: (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="ds-chip">
                    <ShareIcon />
                    Share
                  </button>
                  <button className="ds-chip">
                    <DirectionsIcon />
                    Directions
                  </button>
                </div>
              ),
            },
            {
              label: 'Filter Chip',
              tag: 'Toggle',
              content: (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="ds-chip selected">
                    <CheckIcon />
                    Active
                  </button>
                  <button className="ds-chip">
                    Inactive
                  </button>
                </div>
              ),
            },
            {
              label: 'Input Chip',
              tag: 'Removable',
              content: (
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="ds-chip selected">
                    React
                    <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: 2 }}>
                      <CloseIcon />
                    </span>
                  </span>
                  <span className="ds-chip selected">
                    TypeScript
                    <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: 2 }}>
                      <CloseIcon />
                    </span>
                  </span>
                </div>
              ),
            },
            {
              label: 'Suggestion Chip',
              tag: 'Text-only',
              content: (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="ds-chip">Try scaffolding</button>
                  <button className="ds-chip">View inventory</button>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Assist Chips ── */}
      <SubSection title="Assist Chips" description="Assist chips represent smart or contextual actions related to primary content. They often include a leading icon.">
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Assist Chip Examples',
              tag: 'Interactive',
              content: (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { id: 'share', label: 'Share', icon: <ShareIcon /> },
                    { id: 'directions', label: 'Get directions', icon: <DirectionsIcon /> },
                    { id: 'calendar', label: 'Add to calendar', icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    )},
                  ].map(chip => (
                    <button
                      key={chip.id}
                      className={`ds-chip${assistSelected === chip.id ? ' selected' : ''}`}
                      onClick={() => setAssistSelected(assistSelected === chip.id ? null : chip.id)}
                    >
                      {chip.icon}
                      {chip.label}
                    </button>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Filter Chips — Interactive Bar ── */}
      <SubSection title="Filter Chips" description="Filter chips use a toggleable selected state. When selected, they display a filled background and a checkmark icon. Use them to filter content such as lists or tables.">
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Order Status Filter Bar',
              tag: 'Interactive',
              content: (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(Object.keys(filters) as (keyof typeof filters)[]).map(key => (
                    <button
                      key={key}
                      className={`ds-chip${filters[key] ? ' selected' : ''}`}
                      onClick={() => toggleFilter(key)}
                    >
                      {filters[key] && <CheckIcon />}
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Input Chips ── */}
      <SubSection title="Input Chips" description="Input chips represent user-provided data such as tags, contacts, or search terms. They include a close button for removal.">
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Technology Tags',
              tag: 'Interactive',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 420 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {inputChips.map(chip => (
                      <span key={chip} className="ds-chip selected">
                        {chip}
                        <span
                          onClick={() => removeInputChip(chip)}
                          style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: 4,
                            borderRadius: '50%',
                            padding: 2,
                            transition: 'background 150ms',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <CloseIcon />
                        </span>
                      </span>
                    ))}
                  </div>
                  {inputChips.length === 0 && (
                    <div style={{ fontSize: 13, color: 'var(--av-on-surface-variant, #49454F)', fontStyle: 'italic' }}>
                      All chips removed. Refresh to reset.
                    </div>
                  )}
                  {inputChips.length > 0 && (
                    <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant, #49454F)' }}>
                      Click the x on any chip to remove it.
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Suggestion Chips ── */}
      <SubSection title="Suggestion Chips" description="Suggestion chips offer dynamically generated recommendations. They are text-only, outlined, and help users discover actions or refine queries.">
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Search Suggestions',
              content: (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="ds-chip">Scaffolding parts</button>
                  <button className="ds-chip">Recent orders</button>
                  <button className="ds-chip">Inventory status</button>
                  <button className="ds-chip">Safety reports</button>
                  <button className="ds-chip">Customer accounts</button>
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
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="ds-chip selected"><CheckIcon /> Pending</button>
                  <button className="ds-chip">Shipped</button>
                  <button className="ds-chip">Delivered</button>
                </div>
              ),
              caption: 'Use filter chips for toggleable, category-based filtering that shows active selections clearly.',
            },
            {
              type: 'dont',
              content: (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="ds-chip selected">Save</button>
                  <button className="ds-chip selected">Delete</button>
                </div>
              ),
              caption: 'Don\'t use chips for primary actions. Use buttons instead for critical operations like save or delete.',
            },
            {
              type: 'do',
              content: (
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="ds-chip selected">
                    React <span style={{ marginLeft: 4, display: 'flex' }}><CloseIcon /></span>
                  </span>
                  <span className="ds-chip selected">
                    Vue <span style={{ marginLeft: 4, display: 'flex' }}><CloseIcon /></span>
                  </span>
                </div>
              ),
              caption: 'Use input chips to display removable user-entered values like tags or search terms.',
            },
            {
              type: 'dont',
              content: (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="ds-chip" style={{ height: 48, fontSize: 16 }}>Large Chip</button>
                  <button className="ds-chip" style={{ height: 20, fontSize: 10 }}>Tiny</button>
                </div>
              ),
              caption: 'Don\'t vary chip sizes inconsistently. Keep chip height and typography uniform within a group.',
            },
          ]}
        />
      </SubSection>

      {/* ── Props Table ── */}
      <PropsTable
          componentName="Chip (Custom Control)"
          props={[
            { name: 'Content', type: 'string', description: 'The text label displayed inside the chip.' },
            { name: 'ChipType', type: 'enum', default: 'Suggestion', description: 'The chip variant: Assist, Filter, Input, or Suggestion.' },
            { name: 'IsSelected', type: 'bool', default: 'false', description: 'Whether the chip is in the selected/active state (primarily for Filter chips).' },
            { name: 'Icon', type: 'IconElement', default: '--', description: 'Leading icon element (for Assist chips).' },
            { name: 'IsClosable', type: 'bool', default: 'false', description: 'Whether the chip shows a close/remove button (for Input chips).' },
            { name: 'IsEnabled', type: 'bool', default: 'true', description: 'Whether the chip is interactive.' },
            { name: 'Click', type: 'event', description: 'Fires when the chip is clicked or tapped.' },
            { name: 'Close', type: 'event', description: 'Fires when the close button is clicked (Input chips).' },
          ]}
        />

      {/* ── XAML Code ── */}
      <SubSection title="Uno Platform XAML" description="Chips do not have a built-in Uno Platform control. Below is an example custom control implementation using standard primitives.">
        <CodeSnippet
          title="CHIP CUSTOM CONTROL (XAML)"
          code={`<!-- NOTE: There is no built-in Chip control in Uno Platform.
     Chips should be implemented as a custom control. -->

<!-- Assist Chip (custom) -->
<Border BorderBrush="{ThemeResource SystemControlForegroundBaseMediumBrush}"
        BorderThickness="1"
        CornerRadius="4"
        Padding="0,0,16,0"
        Height="32">
  <StackPanel Orientation="Horizontal"
              Spacing="6"
              VerticalAlignment="Center">
    <FontIcon Glyph="&#xE72D;" FontSize="16"
              Margin="12,0,0,0" />
    <TextBlock Text="Share"
               VerticalAlignment="Center"
               Style="{StaticResource BodySmall}" />
  </StackPanel>
</Border>

<!-- Filter Chip (custom, selected state) -->
<Border Background="{ThemeResource SystemAccentColorLight3}"
        BorderBrush="{ThemeResource SystemAccentColor}"
        BorderThickness="1"
        CornerRadius="4"
        Padding="12,0"
        Height="32">
  <StackPanel Orientation="Horizontal"
              Spacing="6"
              VerticalAlignment="Center">
    <FontIcon Glyph="&#xE73E;" FontSize="14" />
    <TextBlock Text="Pending"
               Style="{StaticResource BodySmall}" />
  </StackPanel>
</Border>

<!-- Input Chip (custom, removable) -->
<Border Background="{ThemeResource SystemAccentColorLight3}"
        BorderBrush="{ThemeResource SystemAccentColor}"
        BorderThickness="1"
        CornerRadius="4"
        Padding="12,0,4,0"
        Height="32">
  <StackPanel Orientation="Horizontal"
              Spacing="6"
              VerticalAlignment="Center">
    <TextBlock Text="React"
               Style="{StaticResource BodySmall}" />
    <Button Style="{StaticResource TextButtonStyle}"
            Padding="4"
            Click="OnChipRemoved">
      <FontIcon Glyph="&#xE711;" FontSize="12" />
    </Button>
  </StackPanel>
</Border>

<!-- Suggestion Chip (custom) -->
<Border BorderBrush="{ThemeResource SystemControlForegroundBaseMediumBrush}"
        BorderThickness="1"
        CornerRadius="4"
        Padding="12,0"
        Height="32">
  <TextBlock Text="Recent orders"
             VerticalAlignment="Center"
             Style="{StaticResource BodySmall}" />
</Border>

<!-- Filter bar using ItemsControl -->
<ItemsControl ItemsSource="{x:Bind Filters}">
  <ItemsControl.ItemsPanel>
    <ItemsPanelTemplate>
      <StackPanel Orientation="Horizontal"
                  Spacing="8" />
    </ItemsPanelTemplate>
  </ItemsControl.ItemsPanel>
</ItemsControl>`}
        />
      </SubSection>
    </div>
  )
}
