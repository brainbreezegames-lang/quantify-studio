import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import {
  Close, Settings, Share, Search, Delete, Edit,
  Bookmark, Heart, Star, StarOutline, Notification,
  More, Filter, Download, Refresh, Copy,
} from '../shared/Icons'

/* ── Reusable icon button style builders ── */
const iconBtnBase: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
  flexShrink: 0,
}

const styles = {
  standard: {
    ...iconBtnBase,
    background: 'transparent',
    color: 'var(--av-on-surface-variant)',
  } as React.CSSProperties,
  standardHover: {
    background: 'var(--av-surface-2)',
  },
  filled: {
    ...iconBtnBase,
    background: 'var(--av-blue)',
    color: 'var(--av-bg, #fff)',
  } as React.CSSProperties,
  tonal: {
    ...iconBtnBase,
    background: 'var(--av-blue-50)',
    color: 'var(--av-navy)',
  } as React.CSSProperties,
  outlined: {
    ...iconBtnBase,
    background: 'transparent',
    color: 'var(--av-on-surface-variant)',
    border: '1px solid var(--av-outline)',
  } as React.CSSProperties,
  disabled: {
    opacity: 0.38,
    cursor: 'not-allowed',
    pointerEvents: 'none' as const,
  },
}

/* ── Toggle icon button component ── */
function ToggleIconButton({
  unselectedIcon,
  selectedIcon,
  unselectedStyle,
  selectedStyle,
  label,
}: {
  unselectedIcon: React.ReactNode
  selectedIcon: React.ReactNode
  unselectedStyle: React.CSSProperties
  selectedStyle: React.CSSProperties
  label: string
}) {
  const [selected, setSelected] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <button
        style={selected ? selectedStyle : unselectedStyle}
        onClick={() => setSelected(!selected)}
        title={label}
      >
        {selected ? selectedIcon : unselectedIcon}
      </button>
      <span style={{ fontSize: 11, color: 'var(--av-on-surface-variant)' }}>
        {selected ? 'Selected' : 'Unselected'}
      </span>
    </div>
  )
}

export default function IconButtonsSection() {
  return (
    <section id="icon-buttons" className="ds-section">
      <SectionHeader
        label="Component"
        title="Icon Buttons"
        description="Compact action triggers for toolbars and app bars. Four variants: standard, filled, tonal, outlined."
      />

      {/* ── Variants ── */}
      <SubSection
        title="Variants"
        description="Standard icon buttons have no background fill. Filled, tonal, and outlined variants add visual weight for increased emphasis or grouping."
      >
        <ComponentShowcase items={[
          {
            label: 'Standard',
            tag: 'IconButton',
            content: (
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={styles.standard} title="Close"><Close size={20} /></button>
                <button style={styles.standard} title="Settings"><Settings size={20} /></button>
                <button style={styles.standard} title="Share"><Share size={20} /></button>
                <button style={styles.standard} title="Search"><Search size={20} /></button>
              </div>
            ),
          },
          {
            label: 'Filled',
            tag: 'IconButton',
            content: (
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={styles.filled} title="Close"><Close size={20} /></button>
                <button style={styles.filled} title="Edit"><Edit size={20} /></button>
                <button style={styles.filled} title="Delete"><Delete size={20} /></button>
                <button style={styles.filled} title="Download"><Download size={20} /></button>
              </div>
            ),
          },
          {
            label: 'Tonal',
            tag: 'IconButton',
            content: (
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={styles.tonal} title="Bookmark"><Bookmark size={20} /></button>
                <button style={styles.tonal} title="Filter"><Filter size={20} /></button>
                <button style={styles.tonal} title="Refresh"><Refresh size={20} /></button>
                <button style={styles.tonal} title="Copy"><Copy size={20} /></button>
              </div>
            ),
          },
          {
            label: 'Outlined',
            tag: 'IconButton',
            content: (
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={styles.outlined} title="Settings"><Settings size={20} /></button>
                <button style={styles.outlined} title="Share"><Share size={20} /></button>
                <button style={styles.outlined} title="More"><More size={20} /></button>
                <button style={styles.outlined} title="Notification"><Notification size={20} /></button>
              </div>
            ),
          },
        ]} />
      </SubSection>

      {/* ── Toggle States ── */}
      <SubSection
        title="Toggle States"
        description="Icon buttons can function as toggles, switching between selected and unselected states. Common uses include bookmarking, favoriting, and liking. The selected state uses a filled variant to indicate activation."
      >
        <ComponentShowcase items={[
          {
            label: 'Bookmark Toggle (Standard)',
            tag: 'Toggle',
            content: (
              <ToggleIconButton
                label="Bookmark"
                unselectedIcon={<Bookmark size={20} />}
                selectedIcon={<Bookmark size={20} />}
                unselectedStyle={styles.standard}
                selectedStyle={{
                  ...iconBtnBase,
                  background: 'var(--av-blue)',
                  color: 'var(--av-bg, #fff)',
                }}
                />
            ),
          },
          {
            label: 'Favorite Toggle (Standard)',
            tag: 'Toggle',
            content: (
              <ToggleIconButton
                label="Favorite"
                unselectedIcon={<Heart size={20} />}
                selectedIcon={<Heart size={20} />}
                unselectedStyle={styles.standard}
                selectedStyle={{
                  ...iconBtnBase,
                  background: 'var(--av-error)',
                  color: 'var(--av-bg, #fff)',
                }}
              />
            ),
          },
          {
            label: 'Star Toggle (Tonal)',
            tag: 'Toggle',
            content: (
              <ToggleIconButton
                label="Star"
                unselectedIcon={<StarOutline size={20} />}
                selectedIcon={<Star size={20} />}
                unselectedStyle={styles.tonal}
                selectedStyle={{
                  ...iconBtnBase,
                  background: 'var(--av-yellow)',
                  color: 'var(--av-navy-dark)',
                }}
              />
            ),
          },
          {
            label: 'Notification Toggle (Outlined)',
            tag: 'Toggle',
            content: (
              <ToggleIconButton
                label="Notifications"
                unselectedIcon={<Notification size={20} />}
                selectedIcon={<Notification size={20} />}
                unselectedStyle={styles.outlined}
                selectedStyle={{
                  ...iconBtnBase,
                  background: 'var(--av-blue)',
                  color: 'var(--av-bg, #fff)',
                  border: '1px solid var(--av-blue)',
                }}
              />
            ),
          },
        ]} />
      </SubSection>

      {/* ── Disabled State ── */}
      <SubSection
        title="Disabled State"
        description="Disabled icon buttons have reduced opacity (38%) and do not respond to pointer events."
      >
        <ComponentShowcase items={[
          {
            label: 'Standard (Disabled)',
            tag: 'IconButton',
            content: (
              <button style={{ ...styles.standard, ...styles.disabled }} title="Close">
                <Close size={20} />
              </button>
            ),
          },
          {
            label: 'Filled (Disabled)',
            tag: 'IconButton',
            content: (
              <button style={{ ...styles.filled, ...styles.disabled }} title="Edit">
                <Edit size={20} />
              </button>
            ),
          },
          {
            label: 'Tonal (Disabled)',
            tag: 'IconButton',
            content: (
              <button style={{ ...styles.tonal, ...styles.disabled }} title="Bookmark">
                <Bookmark size={20} />
              </button>
            ),
          },
          {
            label: 'Outlined (Disabled)',
            tag: 'IconButton',
            content: (
              <button style={{ ...styles.outlined, ...styles.disabled }} title="Settings">
                <Settings size={20} />
              </button>
            ),
          },
        ]} />
      </SubSection>

      {/* ── Sizes ── */}
      <SubSection
        title="Sizes"
        description="Icon buttons can be scaled to different sizes. The standard size is 40px. Use 48px for touch-friendly targets and 32px or 24px for compact toolbar actions."
      >
        <ComponentShowcase items={[
          {
            label: 'Large (48px)',
            tag: '48px',
            content: (
              <button style={{ ...styles.filled, width: 48, height: 48 }} title="Search">
                <Search size={24} />
              </button>
            ),
          },
          {
            label: 'Standard (40px)',
            tag: '40px',
            content: (
              <button style={styles.filled} title="Search">
                <Search size={20} />
              </button>
            ),
          },
          {
            label: 'Compact (32px)',
            tag: '32px',
            content: (
              <button style={{ ...styles.filled, width: 32, height: 32 }} title="Search">
                <Search size={16} />
              </button>
            ),
          },
          {
            label: 'Mini (24px)',
            tag: '24px',
            content: (
              <button style={{ ...styles.filled, width: 24, height: 24 }} title="Close">
                <Close size={14} />
              </button>
            ),
          },
        ]} />
      </SubSection>

      {/* ── Color Variations ── */}
      <SubSection
        title="Color Variations"
        description="Filled and tonal icon buttons can use brand-specific colors for contextual meaning."
      >
        <ComponentShowcase items={[
          {
            label: 'Blue (Default)',
            tag: 'Primary',
            content: (
              <button style={styles.filled} title="Edit"><Edit size={20} /></button>
            ),
          },
          {
            label: 'Navy',
            tag: 'Brand',
            content: (
              <button style={{ ...styles.filled, background: 'var(--av-navy)' }} title="Settings">
                <Settings size={20} />
              </button>
            ),
          },
          {
            label: 'Teal',
            tag: 'Success',
            content: (
              <button style={{ ...styles.filled, background: 'var(--av-teal)' }} title="Check">
                <Star size={20} />
              </button>
            ),
          },
          {
            label: 'Error',
            tag: 'Destructive',
            content: (
              <button style={{ ...styles.filled, background: 'var(--av-error)' }} title="Delete">
                <Delete size={20} />
              </button>
            ),
          },
        ]} />
      </SubSection>

      {/* ── Toolbar Pattern ── */}
      <SubSection
        title="Toolbar Pattern"
        description="Icon buttons are commonly used together in toolbars for actions like navigation, filtering, and contextual menus."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'App Bar Actions',
              tag: 'Pattern',
              content: (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px 4px',
                  background: 'var(--av-surface)',
                  borderRadius: 'var(--av-radius-md)',
                  border: '1px solid var(--av-outline-variant)',
                  width: '100%',
                }}>
                  <button style={styles.standard} title="Menu">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </button>
                  <span style={{ flex: 1, fontSize: 16, fontWeight: 600, paddingLeft: 8, color: 'var(--av-on-surface)' }}>
                    Equipment List
                  </span>
                  <button style={styles.standard} title="Search"><Search size={20} /></button>
                  <button style={styles.standard} title="Filter"><Filter size={20} /></button>
                  <button style={styles.standard} title="More"><More size={20} /></button>
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
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={styles.standard} title="Search"><Search size={20} /></button>
                <button style={styles.standard} title="Filter"><Filter size={20} /></button>
                <button style={styles.standard} title="More"><More size={20} /></button>
              </div>
            ),
            caption: 'Use standard (unfilled) icon buttons for toolbar actions where the surrounding context provides enough emphasis.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={styles.filled} title="Search"><Search size={20} /></button>
                <button style={styles.filled} title="Filter"><Filter size={20} /></button>
                <button style={styles.filled} title="More"><More size={20} /></button>
              </div>
            ),
            caption: "Don't use filled icon buttons for every toolbar action. Reserve filled style for the most important action.",
          },
          {
            type: 'do',
            content: (
              <button style={{ ...iconBtnBase, background: 'var(--av-error)', color: 'var(--av-bg, #fff)' }} title="Delete">
                <Delete size={20} />
              </button>
            ),
            caption: 'Use color to convey intent. Red for delete, teal for confirm, etc.',
          },
          {
            type: 'dont',
            content: (
              <button style={{ ...iconBtnBase, background: 'var(--av-blue)', color: 'var(--av-bg, #fff)', width: 24, height: 24 }} title="Delete">
                <Delete size={14} />
              </button>
            ),
            caption: "Don't make icon buttons too small for touch targets. Minimum recommended size is 32px; prefer 40px or larger.",
          },
        ]} />
      </SubSection>

      {/* ── Properties ── */}
      <PropsTable
          componentName="IconButton"
          props={[
            {
              name: 'Content',
              type: 'IconElement',
              description: 'The icon displayed inside the button, typically a SymbolIcon or FontIcon.',
            },
            {
              name: 'Style',
              type: 'StaticResource',
              default: 'StandardIconButtonStyle',
              description: 'The visual variant: StandardIconButtonStyle, FilledIconButtonStyle, TonalIconButtonStyle, or OutlinedIconButtonStyle.',
            },
            {
              name: 'IsEnabled',
              type: 'bool',
              default: 'true',
              description: 'Whether the icon button is interactive. Disabled state reduces opacity to 38%.',
            },
            {
              name: 'Command',
              type: 'ICommand',
              description: 'The command to execute when the button is clicked.',
            },
            {
              name: 'IsChecked',
              type: 'bool?',
              default: 'null',
              description: 'For toggle icon buttons, indicates whether the button is in the selected (checked) state.',
            },
            {
              name: 'Click',
              type: 'event',
              description: 'Event handler invoked when the icon button is tapped or clicked.',
            },
            {
              name: 'Width / Height',
              type: 'double',
              default: '40',
              description: 'The size of the icon button. Standard is 40px. Use 48px for touch-friendly, 32px for compact.',
            },
            {
              name: 'CornerRadius',
              type: 'CornerRadius',
              default: '20',
              description: 'The border radius. Icon buttons use a fully circular shape by default.',
            },
            {
              name: 'Foreground',
              type: 'Brush',
              description: 'Overrides the icon color.',
            },
            {
              name: 'Background',
              type: 'Brush',
              description: 'Overrides the background fill (relevant for filled and tonal variants).',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Standard Icon Button -->
<Button Style="{StaticResource StandardIconButtonStyle}"
        Width="40" Height="40">
  <SymbolIcon Symbol="Setting" />
</Button>

<!-- Filled Icon Button -->
<Button Style="{StaticResource FilledIconButtonStyle}"
        Width="40" Height="40">
  <SymbolIcon Symbol="Edit" />
</Button>

<!-- Tonal Icon Button -->
<Button Style="{StaticResource TonalIconButtonStyle}"
        Width="40" Height="40">
  <SymbolIcon Symbol="Bookmark" />
</Button>

<!-- Outlined Icon Button -->
<Button Style="{StaticResource OutlinedIconButtonStyle}"
        Width="40" Height="40">
  <SymbolIcon Symbol="Share" />
</Button>

<!-- Toggle Icon Button (Favorite) -->
<ToggleButton Style="{StaticResource IconToggleButtonStyle}"
              IsChecked="{Binding IsFavorite, Mode=TwoWay}">
  <SymbolIcon Symbol="Heart" />
</ToggleButton>

<!-- Icon Button with Tooltip -->
<Button Style="{StaticResource StandardIconButtonStyle}"
        ToolTipService.ToolTip="Delete Equipment"
        Command="{Binding DeleteCommand}">
  <SymbolIcon Symbol="Delete" />
</Button>

<!-- Compact Toolbar Group -->
<StackPanel Orientation="Horizontal" Spacing="4">
  <Button Style="{StaticResource StandardIconButtonStyle}"
          Width="40" Height="40">
    <SymbolIcon Symbol="Search" />
  </Button>
  <Button Style="{StaticResource StandardIconButtonStyle}"
          Width="40" Height="40">
    <SymbolIcon Symbol="Filter" />
  </Button>
  <Button Style="{StaticResource StandardIconButtonStyle}"
          Width="40" Height="40">
    <SymbolIcon Symbol="MoreVertical" />
  </Button>
</StackPanel>`}
        />
      </SubSection>
    </section>
  )
}
