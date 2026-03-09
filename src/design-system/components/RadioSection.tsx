import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'

export default function RadioSection() {
  /* Interactive group demo */
  const [selectedDelivery, setSelectedDelivery] = useState<string>('standard')

  /* Second interactive demo */
  const [selectedDemo, setSelectedDemo] = useState<string>('option-a')

  return (
    <div className="ds-section" id="radio-buttons">
      <SectionHeader
        label="Selection Controls"
        title="Radio Button"
        description="Single-select from a visible set of mutually exclusive options."
      />

      {/* ── States ── */}
      <SubSection title="States" description="Radio buttons have two primary visual states: unselected (default) and selected.">
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Unselected',
              tag: 'Default',
              content: (
                <label className="ds-radio">
                  <span className="ds-radio-circle" />
                  <span>Option label</span>
                </label>
              ),
            },
            {
              label: 'Selected',
              tag: 'Active',
              content: (
                <label className="ds-radio">
                  <span className="ds-radio-circle selected" />
                  <span>Option label</span>
                </label>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── With Labels ── */}
      <SubSection title="With Labels" description="Radio buttons should always have a descriptive label to communicate the option clearly.">
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Labeled Radio Buttons',
              content: (
                <div style={{ display: 'flex', gap: 32 }}>
                  <label className="ds-radio">
                    <span className="ds-radio-circle selected" />
                    <span>Standard Delivery</span>
                  </label>
                  <label className="ds-radio">
                    <span className="ds-radio-circle" />
                    <span>Express Delivery</span>
                  </label>
                  <label className="ds-radio">
                    <span className="ds-radio-circle" />
                    <span>Self Pickup</span>
                  </label>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Disabled States ── */}
      <SubSection title="Disabled States" description="Disabled radio buttons indicate options that are not currently available. They maintain their visual state but cannot be interacted with.">
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Disabled Unselected',
              content: (
                <label className="ds-radio" style={{ opacity: 0.38, pointerEvents: 'none' }}>
                  <span className="ds-radio-circle" />
                  <span>Unavailable option</span>
                </label>
              ),
            },
            {
              label: 'Disabled Selected',
              content: (
                <label className="ds-radio" style={{ opacity: 0.38, pointerEvents: 'none' }}>
                  <span className="ds-radio-circle selected" />
                  <span>Locked selection</span>
                </label>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Interactive Demo ── */}
      <SubSection title="Interactive Demo" description="Click a radio button to select it. Only one option within a group can be selected at a time.">
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Delivery Method',
              tag: 'Interactive',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 320 }}>
                  <label className="ds-radio" onClick={() => setSelectedDelivery('standard')}>
                    <span className={`ds-radio-circle${selectedDelivery === 'standard' ? ' selected' : ''}`} />
                    <div>
                      <div>Standard Delivery</div>
                      <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant, #49454F)', marginTop: 2 }}>5-7 business days</div>
                    </div>
                  </label>
                  <label className="ds-radio" onClick={() => setSelectedDelivery('express')}>
                    <span className={`ds-radio-circle${selectedDelivery === 'express' ? ' selected' : ''}`} />
                    <div>
                      <div>Express Delivery</div>
                      <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant, #49454F)', marginTop: 2 }}>1-2 business days</div>
                    </div>
                  </label>
                  <label className="ds-radio" onClick={() => setSelectedDelivery('pickup')}>
                    <span className={`ds-radio-circle${selectedDelivery === 'pickup' ? ' selected' : ''}`} />
                    <div>
                      <div>Self Pickup</div>
                      <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant, #49454F)', marginTop: 2 }}>Available immediately</div>
                    </div>
                  </label>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Radio Group in a Card ── */}
      <SubSection title="Radio Group" description="A realistic radio group rendered inside a card container, demonstrating how radio buttons appear within a form layout.">
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Settings Group',
              tag: 'Group',
              content: (
                <div
                  style={{
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 'var(--av-radius-lg, 12px)',
                    border: '1px solid var(--av-outline-variant, #CAC4D0)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '12px 16px',
                      background: 'var(--av-surface, #FAFBFF)',
                      borderBottom: '1px solid var(--av-outline-variant, #CAC4D0)',
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--av-on-surface, #1C1B1F)',
                    }}
                  >
                    Choose an option
                  </div>
                  {['option-a', 'option-b', 'option-c'].map((id, i) => (
                    <label
                      key={id}
                      className="ds-radio"
                      onClick={() => setSelectedDemo(id)}
                      style={{
                        padding: '14px 16px',
                        borderBottom: i < 2 ? '1px solid var(--av-surface-3, #E3E8F9)' : 'none',
                        cursor: 'pointer',
                        transition: 'background 150ms',
                        background: selectedDemo === id ? 'var(--av-blue-50, #E8E9FD)' : 'var(--av-bg, #fff)',
                      }}
                    >
                      <span className={`ds-radio-circle${selectedDemo === id ? ' selected' : ''}`} />
                      <span>{['Option Alpha', 'Option Beta', 'Option Gamma'][i]}</span>
                    </label>
                  ))}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label className="ds-radio">
                    <span className="ds-radio-circle selected" />
                    <span>Standard Delivery</span>
                  </label>
                  <label className="ds-radio">
                    <span className="ds-radio-circle" />
                    <span>Express Delivery</span>
                  </label>
                  <label className="ds-radio">
                    <span className="ds-radio-circle" />
                    <span>Self Pickup</span>
                  </label>
                </div>
              ),
              caption: 'Use radio buttons for mutually exclusive options where only one selection is allowed.',
            },
            {
              type: 'dont',
              content: (
                <label className="ds-radio">
                  <span className="ds-radio-circle selected" />
                  <span>Accept terms</span>
                </label>
              ),
              caption: 'Don\'t use a single radio button alone. Use a checkbox for standalone on/off toggles.',
            },
            {
              type: 'do',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label className="ds-radio">
                    <span className="ds-radio-circle selected" />
                    <span>Small (8 oz)</span>
                  </label>
                  <label className="ds-radio">
                    <span className="ds-radio-circle" />
                    <span>Medium (12 oz)</span>
                  </label>
                </div>
              ),
              caption: 'Show all available options upfront so users can compare before selecting.',
            },
            {
              type: 'dont',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <label key={i} className="ds-radio" style={{ fontSize: 12 }}>
                      <span className={`ds-radio-circle${i === 0 ? ' selected' : ''}`} />
                      <span>Option {i + 1}</span>
                    </label>
                  ))}
                </div>
              ),
              caption: 'Don\'t use radio buttons for very long lists. Consider a dropdown or select control instead.',
            },
          ]}
        />
      </SubSection>

      {/* ── Props Table ── */}
      <PropsTable
          componentName="RadioButton"
          props={[
            { name: 'Content', type: 'string', description: 'The label text displayed next to the radio button.' },
            { name: 'IsChecked', type: 'bool', default: 'false', description: 'Whether this radio button is currently selected.' },
            { name: 'IsEnabled', type: 'bool', default: 'true', description: 'Whether the radio button is interactive.' },
            { name: 'GroupName', type: 'string', description: 'Name of the radio group. Only one radio button per group can be selected.' },
            { name: 'Checked', type: 'event', description: 'Fires when this radio button becomes selected.' },
          ]}
        />

      {/* ── XAML Code ── */}
      <SubSection title="Uno Platform XAML" description="Copy-ready XAML snippets for implementing radio buttons in your Uno Platform application.">
        <CodeSnippet
          title="RADIOBUTTON EXAMPLES"
          code={`<!-- Basic radio button -->
<RadioButton Content="Standard Delivery"
             GroupName="DeliveryType" />

<!-- Selected radio button -->
<RadioButton Content="Express Delivery"
             GroupName="DeliveryType"
             IsChecked="True" />

<!-- Disabled radio button -->
<RadioButton Content="Self Pickup"
             GroupName="DeliveryType"
             IsEnabled="False" />

<!-- Radio group in a StackPanel -->
<StackPanel Spacing="12">
  <TextBlock Text="Delivery Method"
             Style="{StaticResource TitleSmall}" />
  <RadioButton Content="Standard Delivery"
               GroupName="DeliveryType"
               IsChecked="True" />
  <RadioButton Content="Express Delivery"
               GroupName="DeliveryType" />
  <RadioButton Content="Self Pickup"
               GroupName="DeliveryType" />
</StackPanel>

<!-- With event handler -->
<RadioButton Content="Standard"
             GroupName="DeliveryType"
             Checked="OnDeliveryTypeChanged" />`}
        />
      </SubSection>
    </div>
  )
}
