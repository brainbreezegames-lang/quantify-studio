import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import { Add, Download, Share, Check, ArrowRight, Upload } from '../shared/Icons'

export default function ButtonsSection() {
  return (
    <section id="buttons" className="ds-section">
      <SectionHeader
        label="Component"
        title="Buttons"
        description="Five button variants — filled, outlined, text, elevated, and tonal — for clear action hierarchy."
      />

      {/* ── Variants ── */}
      <SubSection
        title="Variants"
        description="Material Design 3 defines five button types. Use filled for the most important action, tonal or elevated for medium emphasis, outlined for secondary actions, and text for the lowest-emphasis actions."
      >
        <ComponentShowcase items={[
          {
            label: 'Filled',
            tag: 'Primary',
            content: <button className="ds-btn ds-btn-filled">Save Reservation</button>,
          },
          {
            label: 'Outlined',
            tag: 'Secondary',
            content: <button className="ds-btn ds-btn-outlined">Cancel</button>,
          },
          {
            label: 'Text',
            tag: 'Tertiary',
            content: <button className="ds-btn ds-btn-text">Learn More</button>,
          },
          {
            label: 'Elevated',
            tag: 'Medium',
            content: <button className="ds-btn ds-btn-elevated">Ship Items</button>,
          },
          {
            label: 'Tonal',
            tag: 'Medium',
            content: <button className="ds-btn ds-btn-tonal">Add Equipment</button>,
          },
        ]} />
      </SubSection>

      {/* ── With Icons ── */}
      <SubSection
        title="With Icons"
        description="Buttons can include a leading icon to reinforce meaning. Icons should be 18px and placed before the label with an 8px gap."
      >
        <ComponentShowcase items={[
          {
            label: 'Filled + Icon',
            tag: 'Button',
            content: (
              <button className="ds-btn ds-btn-filled">
                <Add size={18} /> Add Equipment
              </button>
            ),
          },
          {
            label: 'Outlined + Icon',
            tag: 'Button',
            content: (
              <button className="ds-btn ds-btn-outlined">
                <Download size={18} /> Export Report
              </button>
            ),
          },
          {
            label: 'Text + Icon',
            tag: 'Button',
            content: (
              <button className="ds-btn ds-btn-text">
                <Share size={18} /> Share
              </button>
            ),
          },
          {
            label: 'Elevated + Icon',
            tag: 'Button',
            content: (
              <button className="ds-btn ds-btn-elevated">
                <Upload size={18} /> Upload File
              </button>
            ),
          },
          {
            label: 'Tonal + Icon',
            tag: 'Button',
            content: (
              <button className="ds-btn ds-btn-tonal">
                <Check size={18} /> Mark Complete
              </button>
            ),
          },
        ]} />
      </SubSection>

      {/* ── Disabled State ── */}
      <SubSection
        title="Disabled State"
        description="Disabled buttons have 38% opacity and do not respond to interaction. Use disabled state when an action is unavailable due to permissions, validation, or workflow state."
      >
        <ComponentShowcase items={[
          {
            label: 'Filled (Disabled)',
            tag: 'Button',
            content: <button className="ds-btn ds-btn-filled" disabled>Save Reservation</button>,
          },
          {
            label: 'Outlined (Disabled)',
            tag: 'Button',
            content: <button className="ds-btn ds-btn-outlined" disabled>Cancel</button>,
          },
          {
            label: 'Text (Disabled)',
            tag: 'Button',
            content: <button className="ds-btn ds-btn-text" disabled>Learn More</button>,
          },
          {
            label: 'Elevated (Disabled)',
            tag: 'Button',
            content: <button className="ds-btn ds-btn-elevated" disabled>Ship Items</button>,
          },
          {
            label: 'Tonal (Disabled)',
            tag: 'Button',
            content: <button className="ds-btn ds-btn-tonal" disabled>Add Equipment</button>,
          },
        ]} />
      </SubSection>

      {/* ── Color Variations ── */}
      <SubSection
        title="Color Variations"
        description="Filled buttons support brand color overrides for specific contexts. Use the default blue for most actions, navy for authoritative actions, teal for success/confirmation, and error red for destructive actions."
      >
        <ComponentShowcase items={[
          {
            label: 'Blue (Default)',
            tag: 'Primary',
            content: <button className="ds-btn ds-btn-filled">Save Reservation</button>,
          },
          {
            label: 'Navy',
            tag: 'Brand',
            content: <button className="ds-btn ds-btn-filled navy">Approve Request</button>,
          },
          {
            label: 'Teal',
            tag: 'Success',
            content: <button className="ds-btn ds-btn-filled teal">Confirm Shipment</button>,
          },
          {
            label: 'Error',
            tag: 'Destructive',
            content: <button className="ds-btn ds-btn-filled error">Delete Equipment</button>,
          },
        ]} />
      </SubSection>

      {/* ── With Trailing Icon ── */}
      <SubSection
        title="With Trailing Icons"
        description="Trailing icons can indicate forward navigation or progression. Use sparingly and only when the icon adds meaning beyond the label."
      >
        <ComponentShowcase items={[
          {
            label: 'Filled + Trailing',
            tag: 'Button',
            content: (
              <button className="ds-btn ds-btn-filled">
                Continue <ArrowRight size={18} />
              </button>
            ),
          },
          {
            label: 'Outlined + Trailing',
            tag: 'Button',
            content: (
              <button className="ds-btn ds-btn-outlined">
                Next Step <ArrowRight size={18} />
              </button>
            ),
          },
          {
            label: 'Text + Trailing',
            tag: 'Button',
            content: (
              <button className="ds-btn ds-btn-text">
                View Details <ArrowRight size={18} />
              </button>
            ),
          },
        ]} />
      </SubSection>

      {/* ── Button Groups ── */}
      <SubSection
        title="Button Groups"
        description="Pair buttons to create clear action hierarchies. The primary action uses a filled button, while the secondary action uses an outlined or text variant."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Filled + Outlined Pair',
              tag: 'Pattern',
              content: (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="ds-btn ds-btn-filled">Save Reservation</button>
                  <button className="ds-btn ds-btn-outlined">Cancel</button>
                </div>
              ),
            },
            {
              label: 'Filled + Text Pair',
              tag: 'Pattern',
              content: (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="ds-btn ds-btn-filled">Confirm Shipment</button>
                  <button className="ds-btn ds-btn-text">Not Now</button>
                </div>
              ),
            },
            {
              label: 'Triple Action',
              tag: 'Pattern',
              content: (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="ds-btn ds-btn-filled">Submit</button>
                  <button className="ds-btn ds-btn-outlined">Save Draft</button>
                  <button className="ds-btn ds-btn-text">Discard</button>
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
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="ds-btn ds-btn-filled">Save Reservation</button>
                <button className="ds-btn ds-btn-outlined">Cancel</button>
              </div>
            ),
            caption: 'Use one filled button for the primary action per screen area. Pair it with a lower-emphasis variant for secondary actions.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="ds-btn ds-btn-filled">Save</button>
                <button className="ds-btn ds-btn-filled teal">Approve</button>
                <button className="ds-btn ds-btn-filled navy">Submit</button>
              </div>
            ),
            caption: "Don't use multiple filled buttons in the same area. It creates visual competition and unclear hierarchy.",
          },
          {
            type: 'do',
            content: (
              <button className="ds-btn ds-btn-filled">
                <Add size={18} /> Add Equipment
              </button>
            ),
            caption: 'Use descriptive labels that clearly communicate the action. Include an icon when it reinforces the meaning.',
          },
          {
            type: 'dont',
            content: (
              <button className="ds-btn ds-btn-filled">Click Here</button>
            ),
            caption: "Don't use vague or generic labels like \"Click Here\" or \"Submit\". Be specific about what will happen.",
          },
          {
            type: 'do',
            content: (
              <button className="ds-btn ds-btn-filled error">Delete Equipment</button>
            ),
            caption: 'Use the error color variant for destructive actions like delete or remove to signal danger.',
          },
          {
            type: 'dont',
            content: (
              <button className="ds-btn ds-btn-filled teal">Delete Equipment</button>
            ),
            caption: "Don't use success or positive colors for destructive actions. The color should match the intent.",
          },
        ]} />
      </SubSection>

      {/* ── Properties Table ── */}
      <PropsTable
          componentName="Button"
          props={[
            {
              name: 'Content',
              type: 'string | object',
              default: '""',
              description: 'The text label or content displayed inside the button.',
            },
            {
              name: 'Style',
              type: 'StaticResource',
              default: 'FilledButtonStyle',
              description: 'The visual style variant: FilledButtonStyle, OutlinedButtonStyle, TextButtonStyle, ElevatedButtonStyle, or TonalButtonStyle.',
            },
            {
              name: 'IsEnabled',
              type: 'bool',
              default: 'true',
              description: 'Whether the button is interactive. When false, opacity drops to 38% and input is ignored.',
            },
            {
              name: 'Command',
              type: 'ICommand',
              description: 'The command to execute when the button is clicked. Supports MVVM binding.',
            },
            {
              name: 'CommandParameter',
              type: 'object',
              description: 'A parameter passed to the Command when the button is invoked.',
            },
            {
              name: 'Click',
              type: 'event',
              description: 'Event handler invoked when the button is tapped or clicked.',
            },
            {
              name: 'Foreground',
              type: 'Brush',
              description: 'Overrides the text and icon color of the button.',
            },
            {
              name: 'Background',
              type: 'Brush',
              description: 'Overrides the background fill color of the button.',
            },
            {
              name: 'CornerRadius',
              type: 'CornerRadius',
              default: '20',
              description: 'The border radius of the button. MD3 buttons use fully rounded corners (pill shape).',
            },
            {
              name: 'Padding',
              type: 'Thickness',
              default: '24,0',
              description: 'Internal padding. Horizontal padding is 24px for standard buttons, 12px for text buttons.',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Filled Button (Primary Action) -->
<Button Content="Save Reservation"
        Style="{StaticResource FilledButtonStyle}" />

<!-- Filled Button with Icon -->
<Button Style="{StaticResource FilledButtonStyle}">
  <StackPanel Orientation="Horizontal" Spacing="8">
    <SymbolIcon Symbol="Add" />
    <TextBlock Text="Add Equipment" />
  </StackPanel>
</Button>

<!-- Outlined Button (Secondary Action) -->
<Button Content="Cancel"
        Style="{StaticResource OutlinedButtonStyle}" />

<!-- Text Button (Tertiary Action) -->
<Button Content="Learn More"
        Style="{StaticResource TextButtonStyle}" />

<!-- Elevated Button -->
<Button Content="Ship Items"
        Style="{StaticResource ElevatedButtonStyle}" />

<!-- Tonal Button -->
<Button Content="Add Equipment"
        Style="{StaticResource TonalButtonStyle}" />

<!-- Disabled Button -->
<Button Content="Save Reservation"
        Style="{StaticResource FilledButtonStyle}"
        IsEnabled="False" />

<!-- Button with Command Binding -->
<Button Content="Confirm Shipment"
        Style="{StaticResource FilledButtonStyle}"
        Command="{Binding ConfirmShipmentCommand}"
        CommandParameter="{Binding SelectedOrder}" />

<!-- Button Pair (Dialog Actions) -->
<StackPanel Orientation="Horizontal" Spacing="8"
            HorizontalAlignment="Right">
  <Button Content="Cancel"
          Style="{StaticResource TextButtonStyle}" />
  <Button Content="Save Reservation"
          Style="{StaticResource FilledButtonStyle}" />
</StackPanel>`}
        />
      </SubSection>
    </section>
  )
}
