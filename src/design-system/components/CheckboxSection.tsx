import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'

/* ── Checkmark SVG icon ── */
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M11.5 3.5L5.5 9.5L2.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function CheckboxSection() {
  /* Interactive demo state */
  const [checked1, setChecked1] = useState(true)
  const [checked2, setChecked2] = useState(false)
  const [checked3, setChecked3] = useState(false)
  const [checked4, setChecked4] = useState(true)

  /* Group demo */
  const [groupState, setGroupState] = useState({
    accessories: true,
    discount: false,
    rush: false,
    notify: true,
  })

  const toggleGroup = (key: keyof typeof groupState) => {
    setGroupState(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="ds-section" id="checkboxes">
      <SectionHeader
        label="Selection Controls"
        title="Checkbox"
        description="Multi-select controls for forms and settings. Supports indeterminate state."
      />

      {/* ── Variants ── */}
      <SubSection title="States" description="Checkboxes support unchecked, checked, and indeterminate visual states.">
        <ComponentShowcase
          columns={3}
          items={[
            {
              label: 'Unchecked',
              tag: 'Default',
              content: (
                <label className="ds-checkbox">
                  <span className="ds-checkbox-box" />
                  <span>Option label</span>
                </label>
              ),
            },
            {
              label: 'Checked',
              tag: 'Active',
              content: (
                <label className="ds-checkbox">
                  <span className="ds-checkbox-box checked">
                    <CheckIcon />
                  </span>
                  <span>Option label</span>
                </label>
              ),
            },
            {
              label: 'Indeterminate',
              tag: 'Partial',
              content: (
                <label className="ds-checkbox">
                  <span className="ds-checkbox-box checked" style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>
                    -
                  </span>
                  <span>Option label</span>
                </label>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Disabled ── */}
      <SubSection title="Disabled States" description="Disabled checkboxes indicate options that are not currently available. They retain their checked/unchecked visual but reduce opacity.">
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Disabled Unchecked',
              content: (
                <label className="ds-checkbox" style={{ opacity: 0.38, pointerEvents: 'none' }}>
                  <span className="ds-checkbox-box" />
                  <span>Unavailable option</span>
                </label>
              ),
            },
            {
              label: 'Disabled Checked',
              content: (
                <label className="ds-checkbox" style={{ opacity: 0.38, pointerEvents: 'none' }}>
                  <span className="ds-checkbox-box checked">
                    <CheckIcon />
                  </span>
                  <span>Locked option</span>
                </label>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Error State ── */}
      <SubSection title="Error State" description="When a required checkbox is not selected, apply an error border to indicate validation failure.">
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Error — Unchecked',
              tag: 'Required',
              content: (
                <div>
                  <label className="ds-checkbox">
                    <span
                      className="ds-checkbox-box"
                      style={{ borderColor: 'var(--av-error, #D32F2F)' }}
                    />
                    <span style={{ color: 'var(--av-error, #D32F2F)' }}>Accept terms and conditions</span>
                  </label>
                  <div style={{ fontSize: 12, color: 'var(--av-error, #D32F2F)', marginTop: 4, marginLeft: 32 }}>
                    This field is required
                  </div>
                </div>
              ),
            },
            {
              label: 'Error Resolved',
              tag: 'Valid',
              content: (
                <label className="ds-checkbox">
                  <span className="ds-checkbox-box checked">
                    <CheckIcon />
                  </span>
                  <span>Accept terms and conditions</span>
                </label>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Interactive Demo ── */}
      <SubSection title="Interactive Demo" description="Click each checkbox to toggle its state. This demonstrates real-time state management.">
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Checkbox Group',
              tag: 'Interactive',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 320 }}>
                  <label className="ds-checkbox" onClick={() => setChecked1(!checked1)}>
                    <span className={`ds-checkbox-box${checked1 ? ' checked' : ''}`}>
                      {checked1 && <CheckIcon />}
                    </span>
                    <span>Include accessories</span>
                  </label>
                  <label className="ds-checkbox" onClick={() => setChecked2(!checked2)}>
                    <span className={`ds-checkbox-box${checked2 ? ' checked' : ''}`}>
                      {checked2 && <CheckIcon />}
                    </span>
                    <span>Apply discount</span>
                  </label>
                  <label className="ds-checkbox" onClick={() => setChecked3(!checked3)}>
                    <span className={`ds-checkbox-box${checked3 ? ' checked' : ''}`}>
                      {checked3 && <CheckIcon />}
                    </span>
                    <span>Rush delivery</span>
                  </label>
                  <label className="ds-checkbox" onClick={() => setChecked4(!checked4)}>
                    <span className={`ds-checkbox-box${checked4 ? ' checked' : ''}`}>
                      {checked4 && <CheckIcon />}
                    </span>
                    <span>Notify customer</span>
                  </label>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Checkbox Group Example ── */}
      <SubSection title="Checkbox Group" description="A practical checkbox group used inside a form. The 'Select All' checkbox uses the indeterminate state when some — but not all — options are checked.">
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Order Options',
              tag: 'Group',
              content: (() => {
                const allChecked = Object.values(groupState).every(Boolean)
                const noneChecked = Object.values(groupState).every(v => !v)
                const isIndeterminate = !allChecked && !noneChecked

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', maxWidth: 360 }}>
                    {/* Select All */}
                    <label
                      className="ds-checkbox"
                      style={{ paddingBottom: 8, borderBottom: '1px solid var(--av-outline-variant, #CAC4D0)', marginBottom: 4 }}
                      onClick={() => {
                        const newVal = !allChecked
                        setGroupState({ accessories: newVal, discount: newVal, rush: newVal, notify: newVal })
                      }}
                    >
                      <span className={`ds-checkbox-box${allChecked || isIndeterminate ? ' checked' : ''}`} style={isIndeterminate ? { fontSize: 16, fontWeight: 700, lineHeight: 1 } : {}}>
                        {allChecked && <CheckIcon />}
                        {isIndeterminate && '-'}
                      </span>
                      <span style={{ fontWeight: 600 }}>Select all options</span>
                    </label>
                    {/* Items */}
                    <label className="ds-checkbox" style={{ paddingLeft: 12 }} onClick={() => toggleGroup('accessories')}>
                      <span className={`ds-checkbox-box${groupState.accessories ? ' checked' : ''}`}>
                        {groupState.accessories && <CheckIcon />}
                      </span>
                      <span>Include accessories</span>
                    </label>
                    <label className="ds-checkbox" style={{ paddingLeft: 12 }} onClick={() => toggleGroup('discount')}>
                      <span className={`ds-checkbox-box${groupState.discount ? ' checked' : ''}`}>
                        {groupState.discount && <CheckIcon />}
                      </span>
                      <span>Apply discount</span>
                    </label>
                    <label className="ds-checkbox" style={{ paddingLeft: 12 }} onClick={() => toggleGroup('rush')}>
                      <span className={`ds-checkbox-box${groupState.rush ? ' checked' : ''}`}>
                        {groupState.rush && <CheckIcon />}
                      </span>
                      <span>Rush delivery</span>
                    </label>
                    <label className="ds-checkbox" style={{ paddingLeft: 12 }} onClick={() => toggleGroup('notify')}>
                      <span className={`ds-checkbox-box${groupState.notify ? ' checked' : ''}`}>
                        {groupState.notify && <CheckIcon />}
                      </span>
                      <span>Notify customer</span>
                    </label>
                  </div>
                )
              })(),
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
                  <label className="ds-checkbox">
                    <span className="ds-checkbox-box checked"><CheckIcon /></span>
                    <span>Include accessories</span>
                  </label>
                  <label className="ds-checkbox">
                    <span className="ds-checkbox-box" />
                    <span>Apply discount</span>
                  </label>
                </div>
              ),
              caption: 'Use checkboxes for independent, non-exclusive options where multiple selections are valid.',
            },
            {
              type: 'dont',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label className="ds-checkbox">
                    <span className="ds-checkbox-box checked"><CheckIcon /></span>
                    <span>Standard delivery</span>
                  </label>
                  <label className="ds-checkbox">
                    <span className="ds-checkbox-box checked"><CheckIcon /></span>
                    <span>Express delivery</span>
                  </label>
                </div>
              ),
              caption: 'Don\'t use checkboxes for mutually exclusive options. Use radio buttons instead.',
            },
            {
              type: 'do',
              content: (
                <label className="ds-checkbox">
                  <span className="ds-checkbox-box checked"><CheckIcon /></span>
                  <span>Enable notifications</span>
                </label>
              ),
              caption: 'Use clear, descriptive labels that indicate what happens when checked.',
            },
            {
              type: 'dont',
              content: (
                <label className="ds-checkbox">
                  <span className="ds-checkbox-box" />
                  <span>Check this box</span>
                </label>
              ),
              caption: 'Don\'t use vague labels. The user should understand the effect without extra context.',
            },
          ]}
        />
      </SubSection>

      {/* ── Props Table ── */}
      <PropsTable
          componentName="CheckBox"
          props={[
            { name: 'Content', type: 'string', description: 'The label text displayed next to the checkbox.' },
            { name: 'IsChecked', type: 'bool?', default: 'false', description: 'Whether the checkbox is checked. Supports true, false, and null (indeterminate).' },
            { name: 'IsEnabled', type: 'bool', default: 'true', description: 'Whether the checkbox is interactive.' },
            { name: 'IsThreeState', type: 'bool', default: 'false', description: 'Enables indeterminate (third) state support.' },
            { name: 'Checked', type: 'event', description: 'Fires when the checkbox becomes checked.' },
            { name: 'Unchecked', type: 'event', description: 'Fires when the checkbox becomes unchecked.' },
            { name: 'Indeterminate', type: 'event', description: 'Fires when the checkbox enters the indeterminate state.' },
          ]}
        />

      {/* ── XAML Code ── */}
      <SubSection title="Uno Platform XAML" description="Copy-ready XAML snippets for implementing checkboxes in your Uno Platform application.">
        <CodeSnippet
          title="CHECKBOX EXAMPLES"
          code={`<!-- Basic checkbox -->
<CheckBox Content="Include accessories" IsChecked="True" />

<!-- Unchecked checkbox -->
<CheckBox Content="Apply discount" />

<!-- Indeterminate (three-state) -->
<CheckBox Content="Select all"
          IsThreeState="True"
          IsChecked="{x:Null}" />

<!-- Disabled checkbox -->
<CheckBox Content="Locked option"
          IsChecked="True"
          IsEnabled="False" />

<!-- Checkbox group in a StackPanel -->
<StackPanel Spacing="12">
  <CheckBox Content="Include accessories" IsChecked="True" />
  <CheckBox Content="Apply discount" />
  <CheckBox Content="Rush delivery" />
  <CheckBox Content="Notify customer" IsChecked="True" />
</StackPanel>

<!-- With event handler -->
<CheckBox Content="Accept terms"
          Checked="OnTermsChecked"
          Unchecked="OnTermsUnchecked" />`}
        />
      </SubSection>
    </div>
  )
}
