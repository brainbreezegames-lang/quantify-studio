import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import { Add, Edit, Share, Download, Upload, Search } from '../shared/Icons'

/* ── Extended FAB helper ── */
function ExtendedFab({
  icon,
  label,
  color = 'var(--av-blue)',
  textColor = 'var(--av-bg, #fff)',
}: {
  icon: React.ReactNode
  label: string
  color?: string
  textColor?: string
}) {
  return (
    <button
      className="ds-fab"
      style={{
        width: 'auto',
        height: 56,
        borderRadius: 16,
        padding: '0 20px',
        gap: 12,
        background: color,
        color: textColor,
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: 'var(--av-font-primary)',
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: '0.1px',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

export default function FABSection() {
  return (
    <section id="fab" className="ds-section">
      <SectionHeader
        label="Component"
        title="Floating Action Buttons"
        description="The primary screen action — prominent, floating, and unmissable."
      />

      {/* ── Sizes ── */}
      <SubSection
        title="Sizes"
        description="FABs come in three icon-only sizes (small, standard, large) and an extended variant that includes a text label. Choose the size that best fits the screen context and content density."
      >
        <ComponentShowcase items={[
          {
            label: 'Small FAB (40px)',
            tag: '40px',
            content: (
              <button
                className="ds-fab primary"
                style={{ width: 40, height: 40, borderRadius: 12 }}
              >
                <Add size={20} />
              </button>
            ),
          },
          {
            label: 'Standard FAB (56px)',
            tag: '56px',
            content: (
              <button className="ds-fab primary">
                <Add size={24} />
              </button>
            ),
          },
          {
            label: 'Large FAB (96px)',
            tag: '96px',
            content: (
              <button
                className="ds-fab primary"
                style={{ width: 96, height: 96, borderRadius: 28 }}
              >
                <Add size={36} />
              </button>
            ),
          },
          {
            label: 'Extended FAB',
            tag: 'Extended',
            content: (
              <ExtendedFab icon={<Add size={20} />} label="Add Equipment" />
            ),
          },
        ]} />
      </SubSection>

      {/* ── Color Variations ── */}
      <SubSection
        title="Color Variations"
        description="FABs support four container color schemes: primary (blue), secondary (navy), tertiary (light blue), and surface (white/light with icon colored). Choose the color that best complements the page context."
      >
        <ComponentShowcase items={[
          {
            label: 'Primary',
            tag: 'Blue',
            content: (
              <button className="ds-fab primary">
                <Add size={24} />
              </button>
            ),
          },
          {
            label: 'Secondary',
            tag: 'Navy',
            content: (
              <button className="ds-fab secondary">
                <Add size={24} />
              </button>
            ),
          },
          {
            label: 'Tertiary',
            tag: 'Light Blue',
            content: (
              <button className="ds-fab tertiary">
                <Add size={24} />
              </button>
            ),
          },
          {
            label: 'Surface',
            tag: 'Surface',
            content: (
              <button className="ds-fab surface">
                <Add size={24} />
              </button>
            ),
          },
        ]} />
      </SubSection>

      {/* ── Extended FAB Variations ── */}
      <SubSection
        title="Extended FAB Variations"
        description="Extended FABs include a text label alongside the icon for greater clarity. They are ideal when the action needs explicit naming, such as in content creation flows."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Primary Extended',
              tag: 'Extended',
              content: (
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <ExtendedFab icon={<Add size={20} />} label="Add Equipment" />
                  <ExtendedFab icon={<Edit size={20} />} label="Edit Reservation" />
                  <ExtendedFab icon={<Upload size={20} />} label="Upload Document" />
                </div>
              ),
            },
            {
              label: 'Color Extended',
              tag: 'Extended',
              content: (
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <ExtendedFab icon={<Add size={20} />} label="New Order" color="var(--av-navy)" />
                  <ExtendedFab icon={<Share size={20} />} label="Share Report" color="var(--av-teal)" />
                  <ExtendedFab
                    icon={<Download size={20} />}
                    label="Export Data"
                    color="var(--av-surface)"
                    textColor="var(--av-blue)"
                  />
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Different Icons ── */}
      <SubSection
        title="Icon Variations"
        description="The FAB icon should clearly represent the primary action. Common icons include add (+), edit (pencil), share, search, and compose."
      >
        <ComponentShowcase items={[
          {
            label: 'Add',
            tag: 'Create',
            content: (
              <button className="ds-fab primary">
                <Add size={24} />
              </button>
            ),
          },
          {
            label: 'Edit',
            tag: 'Modify',
            content: (
              <button className="ds-fab primary">
                <Edit size={24} />
              </button>
            ),
          },
          {
            label: 'Share',
            tag: 'Distribute',
            content: (
              <button className="ds-fab primary">
                <Share size={24} />
              </button>
            ),
          },
          {
            label: 'Search',
            tag: 'Find',
            content: (
              <button className="ds-fab primary">
                <Search size={24} />
              </button>
            ),
          },
          {
            label: 'Download',
            tag: 'Export',
            content: (
              <button className="ds-fab primary">
                <Download size={24} />
              </button>
            ),
          },
          {
            label: 'Upload',
            tag: 'Import',
            content: (
              <button className="ds-fab primary">
                <Upload size={24} />
              </button>
            ),
          },
        ]} />
      </SubSection>

      {/* ── Positioning Pattern ── */}
      <SubSection
        title="Positioning"
        description="FABs are positioned at the bottom-right of the viewport (or bottom-center on mobile). They float above all other content and should remain accessible during scrolling."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Bottom-Right (Default)',
              tag: 'Pattern',
              content: (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 280,
                    background: 'var(--av-surface-2)',
                    borderRadius: 'var(--av-radius-lg)',
                    border: '1px dashed var(--av-outline-variant)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Simulated content */}
                  <div style={{ padding: 20 }}>
                    <div style={{ height: 12, width: '60%', background: 'var(--av-outline-variant)', borderRadius: 6, marginBottom: 12 }} />
                    <div style={{ height: 12, width: '80%', background: 'var(--av-outline-variant)', borderRadius: 6, marginBottom: 12 }} />
                    <div style={{ height: 12, width: '45%', background: 'var(--av-outline-variant)', borderRadius: 6, marginBottom: 24 }} />
                    <div style={{ height: 12, width: '70%', background: 'var(--av-outline-variant)', borderRadius: 6, marginBottom: 12 }} />
                    <div style={{ height: 12, width: '55%', background: 'var(--av-outline-variant)', borderRadius: 6 }} />
                  </div>
                  <button
                    className="ds-fab primary"
                    style={{ position: 'absolute', bottom: 16, right: 16 }}
                  >
                    <Add size={24} />
                  </button>
                </div>
              ),
            },
            {
              label: 'Bottom-Center with Extended FAB',
              tag: 'Pattern',
              content: (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 280,
                    background: 'var(--av-surface-2)',
                    borderRadius: 'var(--av-radius-lg)',
                    border: '1px dashed var(--av-outline-variant)',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: 20 }}>
                    <div style={{ height: 12, width: '60%', background: 'var(--av-outline-variant)', borderRadius: 6, marginBottom: 12 }} />
                    <div style={{ height: 12, width: '80%', background: 'var(--av-outline-variant)', borderRadius: 6, marginBottom: 12 }} />
                    <div style={{ height: 12, width: '45%', background: 'var(--av-outline-variant)', borderRadius: 6, marginBottom: 24 }} />
                    <div style={{ height: 12, width: '70%', background: 'var(--av-outline-variant)', borderRadius: 6, marginBottom: 12 }} />
                    <div style={{ height: 12, width: '55%', background: 'var(--av-outline-variant)', borderRadius: 6 }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
                    <ExtendedFab icon={<Add size={20} />} label="Add Equipment" />
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
              <button className="ds-fab primary">
                <Add size={24} />
              </button>
            ),
            caption: 'Use a single FAB per screen for the most important action. The FAB should represent the primary user goal.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="ds-fab primary"><Add size={24} /></button>
                <button className="ds-fab secondary"><Edit size={24} /></button>
                <button className="ds-fab tertiary"><Share size={24} /></button>
              </div>
            ),
            caption: "Don't use multiple FABs on the same screen. It dilutes focus and creates visual clutter.",
          },
          {
            type: 'do',
            content: (
              <ExtendedFab icon={<Add size={20} />} label="Add Equipment" />
            ),
            caption: 'Use an extended FAB when the action needs clarification. The label removes ambiguity about what the button does.',
          },
          {
            type: 'dont',
            content: (
              <button className="ds-fab primary" style={{ width: 28, height: 28, borderRadius: 8 }}>
                <Add size={14} />
              </button>
            ),
            caption: "Don't make FABs too small. They should be prominent and easy to tap. Minimum small FAB size is 40px.",
          },
        ]} />
      </SubSection>

      {/* ── Properties ── */}
      <PropsTable
          componentName="FAB"
          props={[
            {
              name: 'Content',
              type: 'IconElement | StackPanel',
              description: 'The icon (for icon-only FABs) or a StackPanel with icon + text (for extended FABs).',
            },
            {
              name: 'Style',
              type: 'StaticResource',
              default: 'FABStyle',
              description: 'The visual style: FABStyle, SmallFABStyle, LargeFABStyle, or ExtendedFABStyle.',
            },
            {
              name: 'Background',
              type: 'Brush',
              default: 'PrimaryContainer',
              description: 'The container color. Maps to primary, secondary, tertiary, or surface container tokens.',
            },
            {
              name: 'Foreground',
              type: 'Brush',
              default: 'OnPrimaryContainer',
              description: 'The icon and text color inside the FAB.',
            },
            {
              name: 'Width / Height',
              type: 'double',
              default: '56',
              description: 'The FAB dimensions. Small: 40px, Standard: 56px, Large: 96px. Extended uses auto width.',
            },
            {
              name: 'CornerRadius',
              type: 'CornerRadius',
              default: '16',
              description: 'The border radius. Small: 12px, Standard: 16px, Large: 28px.',
            },
            {
              name: 'Command',
              type: 'ICommand',
              description: 'The command to execute when the FAB is clicked.',
            },
            {
              name: 'Click',
              type: 'event',
              description: 'Event handler invoked when the FAB is tapped or clicked.',
            },
            {
              name: 'Shadow',
              type: 'Elevation',
              default: 'Level3',
              description: 'The elevation shadow level. FABs use Level 3 by default, Level 4 on hover.',
            },
            {
              name: 'IsEnabled',
              type: 'bool',
              default: 'true',
              description: 'Whether the FAB is interactive.',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Standard FAB (56px) -->
<Button Style="{StaticResource FABStyle}"
        Background="{StaticResource PrimaryContainerBrush}"
        Foreground="{StaticResource OnPrimaryContainerBrush}"
        Command="{Binding AddEquipmentCommand}">
  <SymbolIcon Symbol="Add" />
</Button>

<!-- Small FAB (40px) -->
<Button Style="{StaticResource SmallFABStyle}"
        Background="{StaticResource PrimaryContainerBrush}">
  <SymbolIcon Symbol="Add" />
</Button>

<!-- Large FAB (96px) -->
<Button Style="{StaticResource LargeFABStyle}"
        Background="{StaticResource PrimaryContainerBrush}">
  <SymbolIcon Symbol="Add" FontSize="36" />
</Button>

<!-- Extended FAB with Icon + Label -->
<Button Style="{StaticResource ExtendedFABStyle}"
        Background="{StaticResource PrimaryContainerBrush}"
        Command="{Binding AddEquipmentCommand}">
  <StackPanel Orientation="Horizontal" Spacing="12">
    <SymbolIcon Symbol="Add" />
    <TextBlock Text="Add Equipment"
               VerticalAlignment="Center" />
  </StackPanel>
</Button>

<!-- Secondary Color FAB -->
<Button Style="{StaticResource FABStyle}"
        Background="{StaticResource SecondaryContainerBrush}"
        Foreground="{StaticResource OnSecondaryContainerBrush}">
  <SymbolIcon Symbol="Edit" />
</Button>

<!-- Surface FAB -->
<Button Style="{StaticResource FABStyle}"
        Background="{StaticResource SurfaceContainerHighBrush}"
        Foreground="{StaticResource PrimaryBrush}">
  <SymbolIcon Symbol="Add" />
</Button>

<!-- FAB Positioned in Page Layout -->
<Grid>
  <ScrollViewer>
    <!-- Page content here -->
  </ScrollViewer>

  <Button Style="{StaticResource FABStyle}"
          HorizontalAlignment="Right"
          VerticalAlignment="Bottom"
          Margin="0,0,16,16"
          Background="{StaticResource PrimaryContainerBrush}"
          Command="{Binding CreateReservationCommand}">
    <SymbolIcon Symbol="Add" />
  </Button>
</Grid>`}
        />
      </SubSection>
    </section>
  )
}
