import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import { Edit, Delete, Share, Check, Info } from '../shared/Icons'

export default function TooltipsSection() {
  const plainTooltipStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--av-bg, #fff)',
    background: 'var(--av-on-surface, #1C1B1F)',
    borderRadius: 4,
    whiteSpace: 'nowrap',
    fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
  }

  const iconBtnStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--av-surface, #FAFBFF)',
    border: '1px solid var(--av-outline-variant, #CAC4D0)',
    cursor: 'pointer',
    color: 'var(--av-on-surface, #1C1B1F)',
  }

  const arrowUp: React.CSSProperties = {
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderBottom: '6px solid var(--av-on-surface, #1C1B1F)',
    margin: '0 auto',
  }

  const arrowDown: React.CSSProperties = {
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid var(--av-on-surface, #1C1B1F)',
    margin: '0 auto',
  }

  const arrowLeft: React.CSSProperties = {
    width: 0,
    height: 0,
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    borderRight: '6px solid var(--av-on-surface, #1C1B1F)',
  }

  const arrowRight: React.CSSProperties = {
    width: 0,
    height: 0,
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    borderLeft: '6px solid var(--av-on-surface, #1C1B1F)',
  }

  const richTooltipStyle: React.CSSProperties = {
    padding: 16,
    background: 'var(--av-surface, #FAFBFF)',
    border: '1px solid var(--av-outline-variant, #CAC4D0)',
    borderRadius: 12,
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    maxWidth: 320,
    fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
  }

  return (
    <section id="tooltips" className="ds-section">
      <SectionHeader
        label="Component"
        title="Tooltips"
        description="Contextual labels for icon buttons — plain text or rich with actions."
      />

      {/* ── Plain Tooltip ── */}
      <SubSection
        title="Plain Tooltip"
        description="Simple text labels that appear on hover or focus. Used for icon buttons and actions that need text clarification. Keep tooltips to a few words."
      >
        <ComponentShowcase items={[
          {
            label: 'Edit',
            tag: 'ToolTip',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={plainTooltipStyle}>Edit reservation</div>
                <div style={arrowDown} />
                <button style={iconBtnStyle}><Edit size={20} /></button>
              </div>
            ),
          },
          {
            label: 'Delete',
            tag: 'ToolTip',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={plainTooltipStyle}>Delete</div>
                <div style={arrowDown} />
                <button style={iconBtnStyle}><Delete size={20} /></button>
              </div>
            ),
          },
          {
            label: 'Share',
            tag: 'ToolTip',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={plainTooltipStyle}>Share report</div>
                <div style={arrowDown} />
                <button style={iconBtnStyle}><Share size={20} /></button>
              </div>
            ),
          },
          {
            label: 'Save',
            tag: 'ToolTip',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={plainTooltipStyle}>Save</div>
                <div style={arrowDown} />
                <button style={{ ...iconBtnStyle, background: 'var(--av-blue, #2962FF)', border: 'none', color: 'var(--av-bg, #fff)' }}><Check size={20} /></button>
              </div>
            ),
          },
        ]} />
      </SubSection>

      {/* ── Rich Tooltip ── */}
      <SubSection
        title="Rich Tooltip"
        description="Rich tooltips include a title, description, and optional action. Use for complex information or learning moments like onboarding hints and keyboard shortcuts."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Title + Description',
              tag: 'TeachingTip',
              content: (
                <div style={richTooltipStyle}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface, #1C1B1F)', marginBottom: 6 }}>
                    Reservation Status
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--av-on-surface-variant, #49454F)', margin: 0, lineHeight: 1.5 }}>
                    This reservation is currently pending review. Once approved, it will be moved to the "Ready to Ship" queue.
                  </p>
                </div>
              ),
            },
            {
              label: 'With Action',
              tag: 'TeachingTip',
              content: (
                <div style={richTooltipStyle}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface, #1C1B1F)', marginBottom: 6 }}>
                    Keyboard Shortcut
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--av-on-surface-variant, #49454F)', margin: '0 0 12px', lineHeight: 1.5 }}>
                    Press{' '}
                    <kbd style={{
                      fontFamily: 'var(--av-font-mono, monospace)',
                      fontSize: 12,
                      padding: '2px 6px',
                      background: 'var(--av-outline-variant, #CAC4D0)',
                      borderRadius: 4,
                      border: '1px solid var(--av-outline-variant, #CAC4D0)',
                    }}>
                      Ctrl+S
                    </kbd>{' '}
                    to save your changes quickly.
                  </p>
                  <button className="ds-btn ds-btn-text" style={{ height: 28, fontSize: 12, padding: '0 8px' }}>
                    Got it
                  </button>
                </div>
              ),
            },
            {
              label: 'With Icon',
              tag: 'TeachingTip',
              content: (
                <div style={richTooltipStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Info size={20} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface, #1C1B1F)' }}>
                      Stock Information
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--av-on-surface-variant, #49454F)', margin: 0, lineHeight: 1.5 }}>
                    120 units available in Warehouse A. 45 units reserved for other projects. Lead time is 3-5 business days.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Positioned Tooltips ── */}
      <SubSection
        title="Positioned Tooltips"
        description="Tooltips can be positioned above, below, left, or right of the trigger element. The position should ensure the tooltip remains fully visible within the viewport."
      >
        <ComponentShowcase items={[
          {
            label: 'Above',
            tag: 'Position',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={plainTooltipStyle}>Above tooltip</div>
                <div style={arrowDown} />
                <button style={iconBtnStyle}><Edit size={18} /></button>
              </div>
            ),
          },
          {
            label: 'Below',
            tag: 'Position',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <button style={iconBtnStyle}><Delete size={18} /></button>
                <div style={arrowUp} />
                <div style={plainTooltipStyle}>Below tooltip</div>
              </div>
            ),
          },
          {
            label: 'Left',
            tag: 'Position',
            content: (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={plainTooltipStyle}>Left tooltip</div>
                <div style={arrowRight} />
                <button style={iconBtnStyle}><Share size={18} /></button>
              </div>
            ),
          },
          {
            label: 'Right',
            tag: 'Position',
            content: (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button style={iconBtnStyle}><Info size={18} /></button>
                <div style={arrowLeft} />
                <div style={plainTooltipStyle}>Right tooltip</div>
              </div>
            ),
          },
        ]} />
      </SubSection>

      {/* ── Do & Don't ── */}
      <SubSection title="Do & Don't">
        <DoDontGrid items={[
          {
            type: 'do',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={plainTooltipStyle}>Edit reservation</div>
                <div style={arrowDown} />
                <button style={iconBtnStyle}><Edit size={18} /></button>
              </div>
            ),
            caption: 'Use concise, descriptive text that clarifies the icon action. Keep it under 5 words.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ ...plainTooltipStyle, whiteSpace: 'normal', maxWidth: 200, textAlign: 'center' }}>Click this button to edit the current reservation details including project name, dates, and equipment assignments</div>
                <div style={arrowDown} />
                <button style={iconBtnStyle}><Edit size={18} /></button>
              </div>
            ),
            caption: "Don't put long descriptions in plain tooltips. Use a rich tooltip or help text instead.",
          },
          {
            type: 'do',
            content: (
              <div style={{ display: 'flex', gap: 8 }}>
                {['Edit', 'Delete', 'Share'].map((label, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ ...plainTooltipStyle, fontSize: 11 }}>{label}</div>
                    <div style={arrowDown} />
                    <button style={{ ...iconBtnStyle, width: 32, height: 32 }}>
                      {i === 0 ? <Edit size={16} /> : i === 1 ? <Delete size={16} /> : <Share size={16} />}
                    </button>
                  </div>
                ))}
              </div>
            ),
            caption: 'Add tooltips to all icon-only buttons for accessibility and clarity.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={plainTooltipStyle}>Save Reservation</div>
                <div style={arrowDown} />
                <button className="ds-btn ds-btn-filled" style={{ fontSize: 13 }}>Save Reservation</button>
              </div>
            ),
            caption: "Don't add tooltips to buttons that already have visible text labels. The tooltip would be redundant.",
          },
        ]} />
      </SubSection>

      {/* ── Properties Table ── */}
      <PropsTable
          componentName="ToolTip / TeachingTip"
          props={[
            {
              name: 'Content',
              type: 'string | UIElement',
              description: 'The content displayed inside the tooltip (text or rich content).',
            },
            {
              name: 'Placement',
              type: 'PlacementMode',
              default: 'Top',
              description: 'Position relative to the target: Top, Bottom, Left, Right, or Auto.',
            },
            {
              name: 'IsOpen',
              type: 'bool',
              default: 'false',
              description: 'Whether the tooltip is visible. Managed automatically for ToolTip, manually for TeachingTip.',
            },
            {
              name: 'Title',
              type: 'string',
              description: 'The title text (TeachingTip only).',
            },
            {
              name: 'Subtitle',
              type: 'string',
              description: 'The description text (TeachingTip only).',
            },
            {
              name: 'CloseButtonContent',
              type: 'string',
              description: 'Text for the close/dismiss button (TeachingTip only).',
            },
            {
              name: 'Target',
              type: 'FrameworkElement',
              description: 'The element the tooltip is attached to (TeachingTip only).',
            },
            {
              name: 'IsLightDismissEnabled',
              type: 'bool',
              default: 'false',
              description: 'Whether clicking outside dismisses the tooltip (TeachingTip only).',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Plain Tooltip on Icon Button -->
<Button Style="{StaticResource IconButtonStyle}">
  <SymbolIcon Symbol="Edit" />
  <ToolTipService.ToolTip>
    <ToolTip Content="Edit reservation"
             Placement="Top" />
  </ToolTipService.ToolTip>
</Button>

<!-- Tooltip with Placement -->
<Button Style="{StaticResource IconButtonStyle}">
  <SymbolIcon Symbol="Delete" />
  <ToolTipService.ToolTip>
    <ToolTip Content="Delete"
             Placement="Bottom" />
  </ToolTipService.ToolTip>
</Button>

<!-- Rich Tooltip (TeachingTip) -->
<muxc:TeachingTip x:Name="StatusTip"
                  Title="Reservation Status"
                  Subtitle="This reservation is pending review.
                  Once approved, it will move to Ready to Ship."
                  IsOpen="{Binding ShowStatusTip}"
                  CloseButtonContent="Got it"
                  Target="{x:Bind StatusBadge}" />

<!-- TeachingTip with Action -->
<muxc:TeachingTip x:Name="ShortcutTip"
                  Title="Keyboard Shortcut"
                  Subtitle="Press Ctrl+S to save quickly."
                  IsLightDismissEnabled="True"
                  Target="{x:Bind SaveButton}">
  <muxc:TeachingTip.ActionButtonContent>
    <TextBlock Text="Got it" />
  </muxc:TeachingTip.ActionButtonContent>
</muxc:TeachingTip>

<!-- Multiple Icon Buttons with Tooltips -->
<StackPanel Orientation="Horizontal" Spacing="4">
  <Button Style="{StaticResource IconButtonStyle}">
    <SymbolIcon Symbol="Edit" />
    <ToolTipService.ToolTip>
      <ToolTip Content="Edit" />
    </ToolTipService.ToolTip>
  </Button>
  <Button Style="{StaticResource IconButtonStyle}">
    <SymbolIcon Symbol="Share" />
    <ToolTipService.ToolTip>
      <ToolTip Content="Share" />
    </ToolTipService.ToolTip>
  </Button>
  <Button Style="{StaticResource IconButtonStyle}">
    <SymbolIcon Symbol="Delete" />
    <ToolTipService.ToolTip>
      <ToolTip Content="Delete" />
    </ToolTipService.ToolTip>
  </Button>
</StackPanel>`}
        />
      </SubSection>
    </section>
  )
}
