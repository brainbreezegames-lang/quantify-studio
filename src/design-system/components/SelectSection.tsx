import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'

const scaffoldOptions = [
  'Standard Scaffold',
  'System Scaffold',
  'Tube & Clamp',
  'Ring Lock',
  'Cup Lock',
  'Frame Scaffold',
  'Suspended Scaffold',
  'Mobile Tower',
]

/* ── Filled Select ── */
function FilledSelect({
  label,
  value,
  options,
  placeholder,
  disabled,
  error,
  helperText,
  leadingIcon,
  onChange,
}: {
  label: string
  value?: string
  options: string[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
  helperText?: string
  leadingIcon?: React.ReactNode
  onChange?: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const [internalValue, setInternalValue] = useState(value ?? '')

  const currentValue = value !== undefined ? value : internalValue
  const hasValue = currentValue.length > 0
  const labelFloated = focused || hasValue

  const borderColor = error
    ? 'var(--av-error)'
    : focused
      ? 'var(--av-blue)'
      : 'var(--av-outline)'
  const borderWidth = focused ? 2 : 1
  const labelColor = error
    ? 'var(--av-error)'
    : focused
      ? 'var(--av-blue)'
      : 'var(--av-on-surface-variant)'

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInternalValue(e.target.value)
    onChange?.(e.target.value)
  }

  return (
    <div style={{ width: '100%', maxWidth: 280, opacity: disabled ? 0.5 : 1 }}>
      <div
        style={{
          position: 'relative',
          background: disabled
            ? 'var(--av-surface, #F5F5F5)'
            : 'var(--av-surface-2, #E8E8E8)',
          borderBottom: `${borderWidth}px solid ${borderColor}`,
          borderRadius: '4px 4px 0 0',
          transition: 'border-color 150ms ease',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {leadingIcon && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 12,
              color: 'var(--av-on-surface-variant)',
            }}
          >
            {leadingIcon}
          </span>
        )}

        <div style={{ flex: 1, position: 'relative' }}>
          <label
            style={{
              position: 'absolute',
              left: leadingIcon ? 0 : 16,
              top: labelFloated ? 8 : '50%',
              transform: labelFloated ? 'none' : 'translateY(-50%)',
              fontSize: labelFloated ? 12 : 14,
              fontFamily: 'var(--av-font-primary)',
              color: labelColor,
              pointerEvents: 'none',
              transition: 'all 150ms ease',
              zIndex: 1,
            }}
          >
            {label}
          </label>

          <select
            value={currentValue}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={handleChange}
            style={{
              width: '100%',
              height: 56,
              padding: `24px 36px 8px ${leadingIcon ? 0 : 16}px`,
              fontSize: 14,
              fontFamily: 'var(--av-font-primary)',
              color: currentValue ? 'var(--av-on-surface)' : 'var(--av-on-surface-variant)',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              appearance: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          {/* Dropdown arrow */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--av-on-surface-variant)',
              pointerEvents: 'none',
            }}
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </div>

      {helperText && (
        <div
          style={{
            padding: '4px 16px 0',
            fontSize: 12,
            color: error ? 'var(--av-error)' : 'var(--av-on-surface-variant)',
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  )
}

/* ── Outlined Select (uses ds-textfield styling) ── */
function OutlinedSelect({
  label,
  value,
  options,
  placeholder,
  disabled,
  error,
  helperText,
  onChange,
}: {
  label: string
  value?: string
  options: string[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
  helperText?: string
  onChange?: (v: string) => void
}) {
  const [internalValue, setInternalValue] = useState(value ?? '')
  const currentValue = value !== undefined ? value : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInternalValue(e.target.value)
    onChange?.(e.target.value)
  }

  return (
    <div
      className={`ds-textfield${error ? ' error' : ''}`}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <select
        value={currentValue}
        disabled={disabled}
        onChange={handleChange}
        style={{
          appearance: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          paddingRight: 36,
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <label>{label}</label>

      {/* Dropdown arrow */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--av-on-surface-variant)',
          pointerEvents: 'none',
        }}
      >
        <path d="M7 10l5 5 5-5z" />
      </svg>

      {helperText && (
        <div className="ds-textfield-helper">{helperText}</div>
      )}
    </div>
  )
}

/* ── Scaffold type icon ── */
const ScaffoldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
)

export default function SelectSection() {
  const [scaffoldType, setScaffoldType] = useState('Standard Scaffold')
  const [outlinedValue, setOutlinedValue] = useState('')

  return (
    <section id="select">
      <SectionHeader
        label="Inputs"
        title="Select / Dropdown"
        description="Dropdown menus for choosing from a predefined list of options."
      />

      {/* ── Overview ── */}
      <SubSection
        title="Overview"
        description="Select components follow the same visual language as text fields, with Filled and Outlined variants. A dropdown arrow icon indicates the interactive nature of the control."
      >
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Filled Select',
              tag: 'Primary',
              content: (
                <FilledSelect
                  label="Scaffold Type"
                  value={scaffoldType}
                  options={scaffoldOptions}
                  onChange={setScaffoldType}
                />
              ),
            },
            {
              label: 'Outlined Select',
              tag: 'Default',
              content: (
                <OutlinedSelect
                  label="Scaffold Type"
                  value={outlinedValue || 'Standard Scaffold'}
                  options={scaffoldOptions}
                  onChange={setOutlinedValue}
                />
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Variants ── */}
      <SubSection
        title="Variants"
        description="Different select configurations for various form contexts."
      >
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'With Placeholder',
              content: (
                <FilledSelect
                  label="Category"
                  options={scaffoldOptions}
                  placeholder="Select a type..."
                />
              ),
            },
            {
              label: 'With Leading Icon',
              content: (
                <FilledSelect
                  label="Scaffold Type"
                  value="System Scaffold"
                  options={scaffoldOptions}
                  leadingIcon={<ScaffoldIcon />}
                />
              ),
            },
            {
              label: 'With Helper Text',
              content: (
                <FilledSelect
                  label="Unit Type"
                  options={['Meters', 'Feet', 'Inches', 'Centimeters']}
                  value="Meters"
                  helperText="Select measurement unit for this project"
                />
              ),
            },
            {
              label: 'Outlined — With Placeholder',
              content: (
                <OutlinedSelect
                  label="Project Status"
                  options={['Planning', 'In Progress', 'Review', 'Completed', 'Archived']}
                  placeholder="Choose status..."
                />
              ),
            },
            {
              label: 'Outlined — Multiple Option Context',
              content: (
                <OutlinedSelect
                  label="Region"
                  options={[
                    'North America',
                    'Europe',
                    'Asia Pacific',
                    'Middle East',
                    'Africa',
                    'South America',
                  ]}
                  value="North America"
                />
              ),
            },
            {
              label: 'Short Option List',
              content: (
                <FilledSelect
                  label="Priority"
                  options={['Low', 'Medium', 'High', 'Critical']}
                  value="Medium"
                />
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── States ── */}
      <SubSection
        title="States"
        description="Select fields share the same state system as text fields to maintain visual consistency across form elements."
      >
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Enabled',
              tag: 'Default',
              content: (
                <FilledSelect
                  label="Scaffold Type"
                  options={scaffoldOptions}
                  value="Standard Scaffold"
                />
              ),
            },
            {
              label: 'Disabled',
              content: (
                <FilledSelect
                  label="Scaffold Type"
                  options={scaffoldOptions}
                  value="Standard Scaffold"
                  disabled
                />
              ),
            },
            {
              label: 'Error',
              tag: 'Validation',
              content: (
                <FilledSelect
                  label="Scaffold Type"
                  options={scaffoldOptions}
                  placeholder="Select type..."
                  error
                  helperText="A scaffold type is required"
                />
              ),
            },
            {
              label: 'Outlined — Disabled',
              content: (
                <OutlinedSelect
                  label="Category"
                  options={scaffoldOptions}
                  value="Ring Lock"
                  disabled
                />
              ),
            },
            {
              label: 'Outlined — Error',
              content: (
                <OutlinedSelect
                  label="Status"
                  options={['Planning', 'Active', 'Completed']}
                  placeholder="Select..."
                  error
                  helperText="Please select a status"
                />
              ),
            },
            {
              label: 'Filled — Selected Value',
              content: (
                <FilledSelect
                  label="Material"
                  options={['Steel', 'Aluminum', 'Fiberglass', 'Bamboo']}
                  value="Steel"
                  helperText="Material determines load capacity"
                />
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Avontus Combobox Conventions ── */}
      <SubSection
        title="Avontus Combobox Conventions"
        description='Quantify uses strict conventions for combobox empty states and inactive items that differ from standard Material Design.'
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 20 }}>
          <div className="ds-card ds-card-outlined" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)', marginBottom: 8 }}>Empty State</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--av-on-surface-variant)' }}>
              When no value is chosen, display <strong>" (select)"</strong> — with a leading space. This is the canonical Avontus placeholder, not "Choose..." or "Select...".
            </div>
          </div>
          <div className="ds-card ds-card-outlined" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--av-blue)', marginBottom: 8 }}>Inactive Items</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--av-on-surface-variant)' }}>
              Items marked as inactive are <strong>hidden</strong> from the dropdown — unless the field currently holds that value. This keeps the list clean while preserving historical data.
            </div>
          </div>
        </div>
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Empty state convention',
              tag: 'Avontus',
              content: (
                <FilledSelect
                  label="Scaffold type"
                  options={[' (select)', ...scaffoldOptions]}
                  value=" (select)"
                />
              ),
            },
            {
              label: 'With inactive item',
              tag: 'Avontus',
              content: (
                <FilledSelect
                  label="Scaffold type"
                  options={[...scaffoldOptions.slice(0, 2), 'Tube & Clamp (inactive)', ...scaffoldOptions.slice(3)]}
                  value="Tube & Clamp (inactive)"
                  helperText="Inactive item shown because it's the current value"
                />
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
                <FilledSelect
                  label="Scaffold Type"
                  options={scaffoldOptions}
                  placeholder="Select scaffold type..."
                />
              ),
              caption:
                'Use descriptive labels and provide a helpful placeholder that guides the selection.',
            },
            {
              type: 'dont',
              content: (
                <FilledSelect
                  label="Type"
                  options={['Option 1', 'Option 2', 'Option 3']}
                  placeholder="Select..."
                />
              ),
              caption:
                'Avoid vague labels and generic option names that do not convey meaning.',
            },
            {
              type: 'do',
              content: (
                <FilledSelect
                  label="Priority"
                  options={['Low', 'Medium', 'High', 'Critical']}
                  value="Medium"
                />
              ),
              caption:
                'Use a select for 4-10 predefined options. It keeps the UI compact and prevents input errors.',
            },
            {
              type: 'dont',
              content: (
                <FilledSelect
                  label="Quantity"
                  options={Array.from({ length: 20 }, (_, i) => String(i + 1))}
                  value="1"
                />
              ),
              caption:
                'Do not use a select for sequential numeric values. Use a stepper or number input instead.',
            },
          ]}
        />
      </SubSection>

      {/* ── Props ── */}
      <SubSection title="XAML Properties">
        <PropsTable
          componentName="ComboBox"
          props={[
            {
              name: 'Header',
              type: 'string',
              description: 'Label text displayed above the dropdown.',
            },
            {
              name: 'PlaceholderText',
              type: 'string',
              description: 'Hint text shown when no item is selected.',
            },
            {
              name: 'SelectedItem',
              type: 'object',
              description: 'The currently selected item.',
            },
            {
              name: 'SelectedIndex',
              type: 'int',
              default: '-1',
              description: 'Index of the selected item. -1 means no selection.',
            },
            {
              name: 'ItemsSource',
              type: 'IEnumerable',
              description: 'The data source providing the list of options.',
            },
            {
              name: 'IsEnabled',
              type: 'bool',
              default: 'True',
              description: 'Whether the dropdown is interactive.',
            },
            {
              name: 'IsEditable',
              type: 'bool',
              default: 'False',
              description: 'Allows the user to type to filter options.',
            },
            {
              name: 'MaxDropDownHeight',
              type: 'double',
              default: '200',
              description: 'Maximum height of the dropdown popup.',
            },
            {
              name: 'SelectionChanged',
              type: 'event',
              description: 'Fires when the user selects a different item.',
            },
          ]}
        />
      </SubSection>

      {/* ── XAML Code ── */}
      <SubSection title="Uno Platform XAML">
        <CodeSnippet
          title="SELECT / COMBOBOX"
          code={`<!-- Basic Select -->
<ComboBox
  Header="Scaffold Type"
  PlaceholderText="Select scaffold type..."
  SelectedItem="{x:Bind ViewModel.SelectedScaffoldType, Mode=TwoWay}">
  <x:String>Standard Scaffold</x:String>
  <x:String>System Scaffold</x:String>
  <x:String>Tube &amp; Clamp</x:String>
  <x:String>Ring Lock</x:String>
  <x:String>Cup Lock</x:String>
</ComboBox>

<!-- Data-bound Select -->
<ComboBox
  Header="Category"
  PlaceholderText="Choose category..."
  ItemsSource="{x:Bind ViewModel.Categories}"
  SelectedItem="{x:Bind ViewModel.SelectedCategory, Mode=TwoWay}"
  DisplayMemberPath="Name" />

<!-- Disabled Select -->
<ComboBox
  Header="Locked Type"
  SelectedItem="Standard Scaffold"
  IsEnabled="False" />

<!-- Editable ComboBox (searchable) -->
<ComboBox
  Header="Material"
  PlaceholderText="Search or select..."
  IsEditable="True"
  ItemsSource="{x:Bind ViewModel.Materials}"
  TextSubmitted="{x:Bind ViewModel.OnMaterialSearch}" />`}
        />
      </SubSection>
    </section>
  )
}
