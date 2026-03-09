import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import { Check, List, Grid, Calendar, Clock, Star } from '../shared/Icons'

/* ── Shared inline styles for segmented buttons ── */
const segmentedGroup: React.CSSProperties = {
  display: 'inline-flex',
  borderRadius: 'var(--av-radius-full)',
  overflow: 'hidden',
  border: '1px solid var(--av-outline)',
}

const segmentBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  height: 40,
  padding: '0 20px',
  fontSize: 14,
  fontWeight: 600,
  fontFamily: 'var(--av-font-primary)',
  letterSpacing: '0.1px',
  border: 'none',
  borderRight: '1px solid var(--av-outline)',
  cursor: 'pointer',
  transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
  whiteSpace: 'nowrap' as const,
  position: 'relative' as const,
  background: 'transparent',
  color: 'var(--av-on-surface)',
}

const segmentSelected: React.CSSProperties = {
  ...segmentBase,
  background: 'var(--av-blue)',
  color: 'var(--av-bg, #fff)',
}

const segmentLastChild: React.CSSProperties = {
  borderRight: 'none',
}

/* ── Single-select segmented button ── */
function SingleSelectSegmented({
  options,
  defaultIndex = 0,
  withIcons = false,
  icons,
  size = 'standard',
}: {
  options: string[]
  defaultIndex?: number
  withIcons?: boolean
  icons?: React.ReactNode[]
  size?: 'small' | 'standard' | 'large'
}) {
  const [selected, setSelected] = useState(defaultIndex)

  const sizeStyles: Record<string, React.CSSProperties> = {
    small: { height: 32, padding: '0 14px', fontSize: 12 },
    standard: { height: 40, padding: '0 20px', fontSize: 14 },
    large: { height: 48, padding: '0 28px', fontSize: 15 },
  }

  return (
    <div style={segmentedGroup}>
      {options.map((option, i) => {
        const isSelected = selected === i
        const isLast = i === options.length - 1
        return (
          <button
            key={option}
            onClick={() => setSelected(i)}
            style={{
              ...(isSelected ? segmentSelected : segmentBase),
              ...(isLast ? segmentLastChild : {}),
              ...sizeStyles[size],
            }}
          >
            {isSelected && <Check size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />}
            {withIcons && icons && icons[i]}
            {option}
          </button>
        )
      })}
    </div>
  )
}

/* ── Multi-select segmented button ── */
function MultiSelectSegmented({
  options,
  defaultSelected = [],
  withIcons = false,
  icons,
}: {
  options: string[]
  defaultSelected?: number[]
  withIcons?: boolean
  icons?: React.ReactNode[]
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set(defaultSelected))

  const toggleSelection = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div style={segmentedGroup}>
      {options.map((option, i) => {
        const isSelected = selected.has(i)
        const isLast = i === options.length - 1
        return (
          <button
            key={option}
            onClick={() => toggleSelection(i)}
            style={{
              ...(isSelected ? segmentSelected : segmentBase),
              ...(isLast ? segmentLastChild : {}),
            }}
          >
            {isSelected && <Check size={16} />}
            {withIcons && icons && icons[i]}
            {option}
          </button>
        )
      })}
    </div>
  )
}

/* ── Icon-only segmented button ── */
function IconOnlySegmented({
  icons,
  labels,
  defaultIndex = 0,
}: {
  icons: React.ReactNode[]
  labels: string[]
  defaultIndex?: number
}) {
  const [selected, setSelected] = useState(defaultIndex)

  return (
    <div style={segmentedGroup}>
      {icons.map((icon, i) => {
        const isSelected = selected === i
        const isLast = i === icons.length - 1
        return (
          <button
            key={labels[i]}
            onClick={() => setSelected(i)}
            title={labels[i]}
            style={{
              ...(isSelected ? segmentSelected : segmentBase),
              ...(isLast ? segmentLastChild : {}),
              padding: '0 14px',
              width: 48,
            }}
          >
            {icon}
          </button>
        )
      })}
    </div>
  )
}

export default function SegmentedButtonSection() {
  return (
    <section id="segmented-buttons" className="ds-section">
      <SectionHeader
        label="Component"
        title="Segmented Buttons"
        description="Connected button groups for toggling views or selecting options."
      />

      {/* ── Single-Select ── */}
      <SubSection
        title="Single-Select"
        description="Single-select segmented buttons allow choosing exactly one option from a group. When a segment is selected, it fills with the primary color and shows a check icon. Only one segment can be active at a time."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'View Mode',
              tag: 'Single-Select',
              content: (
                <SingleSelectSegmented
                  options={['Day', 'Week', 'Month']}
                  defaultIndex={1}
                />
              ),
            },
            {
              label: 'Equipment Status',
              tag: 'Single-Select',
              content: (
                <SingleSelectSegmented
                  options={['Available', 'Reserved', 'Shipped', 'Returned']}
                  defaultIndex={0}
                />
              ),
            },
            {
              label: 'Sort Order',
              tag: 'Single-Select',
              content: (
                <SingleSelectSegmented
                  options={['Newest', 'Oldest', 'A-Z']}
                  defaultIndex={0}
                />
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Multi-Select ── */}
      <SubSection
        title="Multi-Select"
        description="Multi-select segmented buttons allow choosing one or more options simultaneously. Each segment toggles independently. Use this pattern when multiple filters or categories can be active at once."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Equipment Filters',
              tag: 'Multi-Select',
              content: (
                <MultiSelectSegmented
                  options={['Scaffolding', 'Shoring', 'Accessories']}
                  defaultSelected={[0, 2]}
                />
              ),
            },
            {
              label: 'Export Formats',
              tag: 'Multi-Select',
              content: (
                <MultiSelectSegmented
                  options={['PDF', 'Excel', 'CSV']}
                  defaultSelected={[0]}
                />
              ),
            },
            {
              label: 'Notification Channels',
              tag: 'Multi-Select',
              content: (
                <MultiSelectSegmented
                  options={['Email', 'SMS', 'Push', 'In-App']}
                  defaultSelected={[0, 3]}
                />
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── With Icons ── */}
      <SubSection
        title="With Icons"
        description="Segments can include leading icons to reinforce their meaning. Icons appear alongside the label and are replaced by a check icon when the segment is selected."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'View Toggle',
              tag: 'Single + Icons',
              content: (
                <SingleSelectSegmented
                  options={['List', 'Grid', 'Calendar']}
                  defaultIndex={0}
                  withIcons
                  icons={[
                    <List size={16} />,
                    <Grid size={16} />,
                    <Calendar size={16} />,
                  ]}
                />
              ),
            },
            {
              label: 'Time Range',
              tag: 'Single + Icons',
              content: (
                <SingleSelectSegmented
                  options={['Recent', 'Scheduled', 'Starred']}
                  defaultIndex={1}
                  withIcons
                  icons={[
                    <Clock size={16} />,
                    <Calendar size={16} />,
                    <Star size={16} />,
                  ]}
                />
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Icon Only ── */}
      <SubSection
        title="Icon Only"
        description="When labels are not needed or space is limited, icon-only segmented buttons provide a compact selection interface. Always include tooltips for accessibility."
      >
        <ComponentShowcase items={[
          {
            label: 'View Toggle',
            tag: 'Icon-Only',
            content: (
              <IconOnlySegmented
                icons={[<List size={18} />, <Grid size={18} />, <Calendar size={18} />]}
                labels={['List View', 'Grid View', 'Calendar View']}
                defaultIndex={0}
              />
            ),
          },
          {
            label: 'Density',
            tag: 'Icon-Only',
            content: (
              <IconOnlySegmented
                icons={[
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="3" y1="5" x2="21" y2="5" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="3" y1="20" x2="21" y2="20" /></svg>,
                ]}
                labels={['Comfortable', 'Compact']}
                defaultIndex={0}
              />
            ),
          },
        ]} />
      </SubSection>

      {/* ── Sizes ── */}
      <SubSection
        title="Sizes"
        description="Segmented buttons support three height sizes: small (32px) for compact toolbars, standard (40px) for most contexts, and large (48px) for touch-heavy interfaces."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Small (32px)',
              tag: '32px',
              content: (
                <SingleSelectSegmented
                  options={['Day', 'Week', 'Month']}
                  defaultIndex={0}
                  size="small"
                />
              ),
            },
            {
              label: 'Standard (40px)',
              tag: '40px',
              content: (
                <SingleSelectSegmented
                  options={['Day', 'Week', 'Month']}
                  defaultIndex={0}
                  size="standard"
                />
              ),
            },
            {
              label: 'Large (48px)',
              tag: '48px',
              content: (
                <SingleSelectSegmented
                  options={['Day', 'Week', 'Month']}
                  defaultIndex={0}
                  size="large"
                />
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Disabled State ── */}
      <SubSection
        title="Disabled State"
        description="Individual segments or the entire group can be disabled. Disabled segments appear at 38% opacity and do not respond to interaction."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Entire Group Disabled',
              tag: 'Disabled',
              content: (
                <div style={{ ...segmentedGroup, opacity: 0.38, pointerEvents: 'none' }}>
                  {['Available', 'Reserved', 'Shipped'].map((label, i) => (
                    <button
                      key={label}
                      style={{
                        ...(i === 0 ? segmentSelected : segmentBase),
                        ...(i === 2 ? segmentLastChild : {}),
                      }}
                      disabled
                    >
                      {i === 0 && <Check size={16} />}
                      {label}
                    </button>
                  ))}
                </div>
              ),
            },
            {
              label: 'Individual Segment Disabled',
              tag: 'Partial',
              content: (
                <div style={segmentedGroup}>
                  <button style={segmentSelected}>
                    <Check size={16} /> Active
                  </button>
                  <button style={segmentBase}>
                    Pending
                  </button>
                  <button
                    style={{
                      ...segmentBase,
                      ...segmentLastChild,
                      opacity: 0.38,
                      cursor: 'not-allowed',
                    }}
                    disabled
                  >
                    Archived
                  </button>
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
              <SingleSelectSegmented
                options={['Day', 'Week', 'Month']}
                defaultIndex={1}
              />
            ),
            caption: 'Use segmented buttons for 2-5 related options. They work best for switching views, filtering, or selecting modes.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ ...segmentedGroup, fontSize: 11 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                  <button
                    key={d}
                    style={{
                      ...(i === 2 ? segmentSelected : segmentBase),
                      ...(i === 6 ? segmentLastChild : {}),
                      padding: '0 8px',
                      fontSize: 11,
                    }}
                  >
                    {i === 2 && <Check size={12} />}
                    {d}
                  </button>
                ))}
              </div>
            ),
            caption: "Don't use too many segments. Beyond 5 options, consider a dropdown or chip group instead.",
          },
          {
            type: 'do',
            content: (
              <SingleSelectSegmented
                options={['List', 'Grid', 'Calendar']}
                defaultIndex={0}
                withIcons
                icons={[<List size={16} />, <Grid size={16} />, <Calendar size={16} />]}
              />
            ),
            caption: 'Keep segment labels short and consistent in length. Add icons when they reinforce meaning.',
          },
          {
            type: 'dont',
            content: (
              <div style={segmentedGroup}>
                <button style={{ ...segmentSelected }}>
                  <Check size={16} /> OK
                </button>
                <button style={{ ...segmentBase, ...segmentLastChild, padding: '0 10px', fontSize: 12 }}>
                  Show All Available Equipment Items
                </button>
              </div>
            ),
            caption: "Don't mix very short and very long labels. It creates visual imbalance and makes the group harder to scan.",
          },
        ]} />
      </SubSection>

      {/* ── Properties ── */}
      <PropsTable
          componentName="SegmentedButton"
          props={[
            {
              name: 'Items',
              type: 'IList<SegmentedItem>',
              description: 'The collection of segment options, each with a label, optional icon, and selected state.',
            },
            {
              name: 'SelectionMode',
              type: 'enum',
              default: 'Single',
              description: "The selection behavior: 'Single' (radio-like, one at a time) or 'Multiple' (checkbox-like, any combination).",
            },
            {
              name: 'SelectedIndex',
              type: 'int',
              default: '0',
              description: 'The index of the currently selected segment (single-select mode). Supports two-way binding.',
            },
            {
              name: 'SelectedIndices',
              type: 'IList<int>',
              description: 'The indices of all selected segments (multi-select mode). Supports two-way binding.',
            },
            {
              name: 'SelectionChanged',
              type: 'event',
              description: 'Event raised when the selection changes. Provides old and new selection values.',
            },
            {
              name: 'IsEnabled',
              type: 'bool',
              default: 'true',
              description: 'Whether the entire segmented button group is interactive.',
            },
            {
              name: 'CornerRadius',
              type: 'CornerRadius',
              default: '20',
              description: 'The border radius of the outer container. Uses fully rounded (pill) shape by default.',
            },
            {
              name: 'Height',
              type: 'double',
              default: '40',
              description: 'The height of the segmented button group. Small: 32px, Standard: 40px, Large: 48px.',
            },
            {
              name: 'BorderBrush',
              type: 'Brush',
              default: 'Outline',
              description: 'The outline color for the group container and segment dividers.',
            },
            {
              name: 'SelectedBackground',
              type: 'Brush',
              default: 'Primary',
              description: 'The fill color for selected segments.',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Single-Select Segmented Button -->
<muxc:SegmentedButton SelectionMode="Single"
                      SelectedIndex="{Binding ViewMode, Mode=TwoWay}">
  <muxc:SegmentedButtonItem Content="Day" />
  <muxc:SegmentedButtonItem Content="Week" />
  <muxc:SegmentedButtonItem Content="Month" />
</muxc:SegmentedButton>

<!-- Multi-Select Segmented Button -->
<muxc:SegmentedButton SelectionMode="Multiple"
                      SelectionChanged="OnFilterChanged">
  <muxc:SegmentedButtonItem Content="Scaffolding" />
  <muxc:SegmentedButtonItem Content="Shoring" />
  <muxc:SegmentedButtonItem Content="Accessories" />
</muxc:SegmentedButton>

<!-- With Icons -->
<muxc:SegmentedButton SelectionMode="Single"
                      SelectedIndex="0">
  <muxc:SegmentedButtonItem>
    <StackPanel Orientation="Horizontal" Spacing="8">
      <SymbolIcon Symbol="List" FontSize="16" />
      <TextBlock Text="List" />
    </StackPanel>
  </muxc:SegmentedButtonItem>
  <muxc:SegmentedButtonItem>
    <StackPanel Orientation="Horizontal" Spacing="8">
      <SymbolIcon Symbol="GridView" FontSize="16" />
      <TextBlock Text="Grid" />
    </StackPanel>
  </muxc:SegmentedButtonItem>
  <muxc:SegmentedButtonItem>
    <StackPanel Orientation="Horizontal" Spacing="8">
      <SymbolIcon Symbol="Calendar" FontSize="16" />
      <TextBlock Text="Calendar" />
    </StackPanel>
  </muxc:SegmentedButtonItem>
</muxc:SegmentedButton>

<!-- Icon-Only Segmented Button -->
<muxc:SegmentedButton SelectionMode="Single"
                      SelectedIndex="0">
  <muxc:SegmentedButtonItem
      ToolTipService.ToolTip="List View">
    <SymbolIcon Symbol="List" />
  </muxc:SegmentedButtonItem>
  <muxc:SegmentedButtonItem
      ToolTipService.ToolTip="Grid View">
    <SymbolIcon Symbol="GridView" />
  </muxc:SegmentedButtonItem>
</muxc:SegmentedButton>

<!-- Disabled Segmented Button -->
<muxc:SegmentedButton SelectionMode="Single"
                      SelectedIndex="0"
                      IsEnabled="False">
  <muxc:SegmentedButtonItem Content="Available" />
  <muxc:SegmentedButtonItem Content="Reserved" />
  <muxc:SegmentedButtonItem Content="Shipped" />
</muxc:SegmentedButton>

<!-- Bound to ViewModel -->
<muxc:SegmentedButton SelectionMode="Single"
                      SelectedIndex="{Binding SortMode, Mode=TwoWay}"
                      Height="40">
  <muxc:SegmentedButtonItem Content="Newest" />
  <muxc:SegmentedButtonItem Content="Oldest" />
  <muxc:SegmentedButtonItem Content="A-Z" />
</muxc:SegmentedButton>`}
        />
      </SubSection>
    </section>
  )
}
