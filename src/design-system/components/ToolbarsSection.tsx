import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import { Back, More, Search, Close, Edit, Delete, Share, Check, Settings } from '../shared/Icons'

export default function ToolbarsSection() {
  const toolbarBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: 64,
    padding: '0 4px',
    background: 'var(--av-surface, #FAFBFF)',
    borderRadius: 12,
    border: '1px solid var(--av-outline-variant, #CAC4D0)',
    width: '100%',
    maxWidth: 400,
  }

  const toolbarBtnStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--av-on-surface, #1C1B1F)',
    flexShrink: 0,
  }

  return (
    <section id="toolbars" className="ds-section">
      <SectionHeader
        label="Component"
        title="Top App Bars"
        description="Screen headers with navigation, title, and contextual actions."
      />

      {/* ── Center-Aligned ── */}
      <SubSection
        title="Center-Aligned"
        description="The center-aligned top app bar places the title in the center with optional navigation and action icons. Best for simple screens with a single, clear purpose."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Center-Aligned',
              tag: 'MD3',
              content: (
                <div className="ds-toolbar" style={toolbarBase}>
                  <div className="ds-toolbar-start">
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><Back size={20} /></button>
                  </div>
                  <div className="ds-toolbar-center" style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)' }}>
                    Reservations
                  </div>
                  <div className="ds-toolbar-end" style={{ display: 'flex', gap: 4 }}>
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><More size={20} /></button>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Small ── */}
      <SubSection
        title="Small"
        description="The small top app bar has the title left-aligned. This is the most common variant, suitable for most screens in Quantify."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Small',
              tag: 'Default',
              content: (
                <div className="ds-toolbar" style={toolbarBase}>
                  <div className="ds-toolbar-start">
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><Back size={20} /></button>
                  </div>
                  <div style={{ flex: 1, fontSize: 16, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)', paddingLeft: 4 }}>
                    Ship reservation
                  </div>
                  <div className="ds-toolbar-end" style={{ display: 'flex', gap: 4 }}>
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><Search size={20} /></button>
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><More size={20} /></button>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Medium ── */}
      <SubSection
        title="Medium"
        description="The medium top app bar provides a larger title area. Use for screens where the title needs more emphasis, like detail views or section landing pages."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Medium',
              tag: 'Expanded',
              content: (
                <div style={{ width: '100%', maxWidth: 400, borderRadius: 12, border: '1px solid var(--av-outline-variant, #CAC4D0)', overflow: 'hidden', background: 'var(--av-surface, #FAFBFF)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', height: 48, padding: '0 4px' }}>
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><Back size={20} /></button>
                    <div style={{ flex: 1 }} />
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><Edit size={20} /></button>
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><More size={20} /></button>
                  </div>
                  <div style={{ padding: '0 16px 16px' }}>
                    <div style={{ fontSize: 24, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)' }}>Equipment details</div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Large ── */}
      <SubSection
        title="Large"
        description="The large top app bar creates a hero-style header with a prominent title. Use for top-level destinations or when the screen title is the primary content anchor."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Large',
              tag: 'Hero',
              content: (
                <div style={{ width: '100%', maxWidth: 400, borderRadius: 12, border: '1px solid var(--av-outline-variant, #CAC4D0)', overflow: 'hidden', background: 'var(--av-surface, #FAFBFF)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', height: 48, padding: '0 4px' }}>
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><Back size={20} /></button>
                    <div style={{ flex: 1 }} />
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><Search size={20} /></button>
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><Settings size={20} /></button>
                  </div>
                  <div style={{ padding: '8px 16px 24px' }}>
                    <div style={{ fontSize: 32, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)', lineHeight: 1.2 }}>Reservations</div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Edit Mode ── */}
      <SubSection
        title="Edit Mode"
        description="When a form enters edit mode, the toolbar transforms to show save, cancel, and delete actions. Uses the ds-toolbar classes for consistent layout."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Edit Mode',
              tag: 'Contextual',
              content: (
                <div className="ds-toolbar" style={{ ...toolbarBase, background: 'var(--av-blue-light, rgba(41,98,255,0.04))' }}>
                  <div className="ds-toolbar-start">
                    <button style={{ ...toolbarBtnStyle, color: 'var(--av-on-surface, #1C1B1F)' }} className="ds-toolbar-btn"><Close size={20} /></button>
                  </div>
                  <div style={{ flex: 1, fontSize: 16, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)', paddingLeft: 4 }}>
                    Edit reservation
                  </div>
                  <div className="ds-toolbar-end" style={{ display: 'flex', gap: 4 }}>
                    <button style={{ ...toolbarBtnStyle, color: 'var(--av-error, #D32F2F)' }} className="ds-toolbar-btn"><Delete size={20} /></button>
                    <button className="ds-btn ds-btn-filled" style={{ height: 36, fontSize: 13, padding: '0 16px' }}>
                      <Check size={16} /> Save
                    </button>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Read-Only Mode ── */}
      <SubSection
        title="Read-Only Mode"
        description="In read-only mode, the toolbar shows view-oriented actions such as edit, share, and print. The user cannot modify content from this state."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Read-Only Mode',
              tag: 'Contextual',
              content: (
                <div className="ds-toolbar" style={toolbarBase}>
                  <div className="ds-toolbar-start">
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><Back size={20} /></button>
                  </div>
                  <div style={{ flex: 1, fontSize: 16, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)', paddingLeft: 4 }}>
                    RES-2024-0847
                  </div>
                  <div className="ds-toolbar-end" style={{ display: 'flex', gap: 4 }}>
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><Edit size={20} /></button>
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><Share size={20} /></button>
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><More size={20} /></button>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Search Mode ── */}
      <SubSection
        title="Search Mode"
        description="In search mode, the title is replaced by a search input field. The back button dismisses search and returns to the previous toolbar state."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Search Mode',
              tag: 'Contextual',
              content: (
                <div className="ds-toolbar" style={toolbarBase}>
                  <div className="ds-toolbar-start">
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><Back size={20} /></button>
                  </div>
                  <div style={{ flex: 1, padding: '0 8px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 12px',
                      borderRadius: 'var(--av-radius-full, 24px)',
                      background: 'var(--av-bg, #fff)',
                      border: '1px solid var(--av-outline-variant, #CAC4D0)',
                    }}>
                      <Search size={18} />
                      <span style={{ fontSize: 14, color: 'var(--av-on-surface-variant, #49454F)' }}>Search reservations...</span>
                    </div>
                  </div>
                  <div className="ds-toolbar-end">
                    <button style={toolbarBtnStyle} className="ds-toolbar-btn"><Close size={20} /></button>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Quantify Toolbar Conventions ── */}
      <SubSection
        title="Quantify Toolbar Conventions"
        description="Quantify uses exactly three toolbar configurations. Every screen maps to one of these modes. Using the wrong leading icon or trailing actions causes confusion."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          <div className="ds-card ds-card-outlined" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)', marginBottom: 8 }}>Edit Mode</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--av-on-surface-variant)' }}>
              <strong>X</strong> (close) on the left — dismisses without saving.<br />
              <strong>Verb button</strong> on the right — commits the action (e.g., "Ship", "Save").<br />
              Optional overflow for extras.
            </div>
          </div>
          <div className="ds-card ds-card-outlined" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)', marginBottom: 8 }}>Read-Only Mode</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--av-on-surface-variant)' }}>
              <strong>Back arrow</strong> on the left — returns to previous screen.<br />
              <strong>Three-dot overflow</strong> on the right — view-level actions (Share, Print, Edit).
            </div>
          </div>
          <div className="ds-card ds-card-outlined" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)', marginBottom: 8 }}>Edit + Extras</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--av-on-surface-variant)' }}>
              <strong>X</strong> on the left, <strong>checkmark</strong> to confirm, plus <strong>three-dot overflow</strong> for secondary actions like Delete or Duplicate.
            </div>
          </div>
        </div>
        <DoDontGrid items={[
          {
            type: 'do',
            content: (
              <div className="ds-toolbar" style={{ ...toolbarBase, maxWidth: 320 }}>
                <button style={toolbarBtnStyle}><Close size={18} /></button>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500, paddingLeft: 4 }}>Ship reservation</div>
                <button className="ds-btn ds-btn-filled" style={{ height: 30, fontSize: 12, padding: '0 12px' }}>Ship</button>
              </div>
            ),
            caption: 'Edit mode: X on left, verb button on right. The X dismisses without saving.',
          },
          {
            type: 'dont',
            content: (
              <div className="ds-toolbar" style={{ ...toolbarBase, maxWidth: 320 }}>
                <button style={toolbarBtnStyle}><Back size={18} /></button>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500, paddingLeft: 4 }}>Ship reservation</div>
                <button className="ds-btn ds-btn-filled" style={{ height: 30, fontSize: 12, padding: '0 12px' }}>Ship</button>
              </div>
            ),
            caption: 'Don\'t use a back arrow in edit mode. Back implies navigation; X implies "discard and close".',
          },
        ]} />
      </SubSection>

      {/* ── Do & Don't ── */}
      <SubSection title="Do & Don't">
        <DoDontGrid items={[
          {
            type: 'do',
            content: (
              <div className="ds-toolbar" style={{ ...toolbarBase, maxWidth: 320 }}>
                <button style={toolbarBtnStyle}><Back size={20} /></button>
                <div style={{ flex: 1, fontSize: 16, fontWeight: 500, textAlign: 'left', paddingLeft: 4 }}>Reservations</div>
                <button style={toolbarBtnStyle}><More size={20} /></button>
              </div>
            ),
            caption: 'Use concise, descriptive titles that identify the current screen context.',
          },
          {
            type: 'dont',
            content: (
              <div className="ds-toolbar" style={{ ...toolbarBase, maxWidth: 320 }}>
                <button style={toolbarBtnStyle}><Back size={20} /></button>
                <div style={{ flex: 1, fontSize: 16, fontWeight: 500, textAlign: 'left', paddingLeft: 4 }}>All Active and Pending Reservation Records for Q1</div>
                <button style={toolbarBtnStyle}><More size={20} /></button>
              </div>
            ),
            caption: "Don't use long titles that truncate or wrap. Move details to subtitle or content area.",
          },
          {
            type: 'do',
            content: (
              <div className="ds-toolbar" style={{ ...toolbarBase, maxWidth: 320 }}>
                <button style={toolbarBtnStyle}><Back size={20} /></button>
                <div style={{ flex: 1, fontSize: 16, fontWeight: 500, paddingLeft: 4 }}>Edit reservation</div>
                <button style={toolbarBtnStyle}><Delete size={20} /></button>
                <button className="ds-btn ds-btn-filled" style={{ height: 32, fontSize: 12, padding: '0 12px' }}>Save</button>
              </div>
            ),
            caption: 'Limit action buttons to 2-3 most important actions. Use overflow menu for additional items.',
          },
          {
            type: 'dont',
            content: (
              <div className="ds-toolbar" style={{ ...toolbarBase, maxWidth: 320 }}>
                <button style={toolbarBtnStyle}><Back size={20} /></button>
                <div style={{ flex: 1 }} />
                <button style={toolbarBtnStyle}><Edit size={18} /></button>
                <button style={toolbarBtnStyle}><Share size={18} /></button>
                <button style={toolbarBtnStyle}><Delete size={18} /></button>
                <button style={toolbarBtnStyle}><Search size={18} /></button>
                <button style={toolbarBtnStyle}><Settings size={18} /></button>
                <button style={toolbarBtnStyle}><More size={18} /></button>
              </div>
            ),
            caption: "Don't crowd the toolbar with too many actions. Group secondary actions in an overflow menu.",
          },
        ]} />
      </SubSection>

      {/* ── Properties Table ── */}
      <PropsTable
          componentName="NavigationBar (Top App Bar)"
          props={[
            {
              name: 'Title',
              type: 'string',
              description: 'The text displayed as the toolbar title.',
            },
            {
              name: 'NavigationIcon',
              type: 'IconElement',
              default: 'Back arrow',
              description: 'The leading navigation icon (back, close, or menu).',
            },
            {
              name: 'PrimaryCommands',
              type: 'IList<AppBarButton>',
              description: 'Action buttons displayed on the right side of the toolbar.',
            },
            {
              name: 'SecondaryCommands',
              type: 'IList<AppBarButton>',
              description: 'Actions that appear in the overflow menu.',
            },
            {
              name: 'IsSticky',
              type: 'bool',
              default: 'true',
              description: 'Whether the toolbar remains fixed at the top when scrolling.',
            },
            {
              name: 'Background',
              type: 'Brush',
              default: 'SurfaceBrush',
              description: 'The background color of the toolbar.',
            },
            {
              name: 'Mode',
              type: 'AppBarMode',
              default: 'Standard',
              description: 'Toolbar display mode: Standard, Search, Edit, or Selection.',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Small Top App Bar (Default) -->
<CommandBar Content="Ship reservation"
            Background="{StaticResource SurfaceBrush}">
  <CommandBar.PrimaryCommands>
    <AppBarButton Icon="Find" Label="Search" />
    <AppBarButton Icon="More" Label="More" />
  </CommandBar.PrimaryCommands>
</CommandBar>

<!-- Center-Aligned Top App Bar -->
<CommandBar Content="Reservations"
            HorizontalContentAlignment="Center"
            Background="{StaticResource SurfaceBrush}">
  <CommandBar.Content>
    <TextBlock Text="Reservations"
               HorizontalAlignment="Center"
               Style="{StaticResource TitleLarge}" />
  </CommandBar.Content>
</CommandBar>

<!-- Medium / Large Title (Custom) -->
<StackPanel Background="{StaticResource SurfaceBrush}">
  <CommandBar>
    <CommandBar.PrimaryCommands>
      <AppBarButton Icon="Edit" Label="Edit" />
      <AppBarButton Icon="More" Label="More" />
    </CommandBar.PrimaryCommands>
  </CommandBar>
  <TextBlock Text="Equipment details"
             Style="{StaticResource HeadlineMedium}"
             Margin="16,0,16,16" />
</StackPanel>

<!-- Edit Mode Toolbar -->
<CommandBar Background="{StaticResource SurfaceContainerBrush}">
  <CommandBar.Content>
    <StackPanel Orientation="Horizontal" Spacing="8">
      <AppBarButton Icon="Cancel" Label="Cancel" />
      <TextBlock Text="Edit reservation"
                 Style="{StaticResource TitleLarge}"
                 VerticalAlignment="Center" />
    </StackPanel>
  </CommandBar.Content>
  <CommandBar.PrimaryCommands>
    <AppBarButton Icon="Delete" Label="Delete"
                  Foreground="{StaticResource ErrorBrush}" />
    <AppBarButton Icon="Save" Label="Save" />
  </CommandBar.PrimaryCommands>
</CommandBar>

<!-- Search Mode -->
<CommandBar>
  <CommandBar.Content>
    <AutoSuggestBox PlaceholderText="Search reservations..."
                    QueryIcon="Find"
                    Width="300" />
  </CommandBar.Content>
</CommandBar>`}
        />
      </SubSection>
    </section>
  )
}
