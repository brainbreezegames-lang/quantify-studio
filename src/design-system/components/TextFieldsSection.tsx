import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'

/* ── Filled text field: MD3 style with bottom border only ── */
function FilledTextField({
  label,
  value,
  placeholder,
  error,
  disabled,
  helperText,
  charCount,
  maxLength,
  leadingIcon,
  trailingIcon,
  multiline,
  type = 'text',
  onChange,
}: {
  label: string
  value?: string
  placeholder?: string
  error?: boolean
  disabled?: boolean
  helperText?: string
  charCount?: boolean
  maxLength?: number
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  multiline?: boolean
  type?: string
  onChange?: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const [internalValue, setInternalValue] = useState(value ?? '')

  const currentValue = value !== undefined ? value : internalValue
  const hasValue = currentValue.length > 0
  const labelFloated = focused || hasValue

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInternalValue(e.target.value)
    onChange?.(e.target.value)
  }

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
              top: labelFloated ? 8 : multiline ? 18 : '50%',
              transform: labelFloated ? 'none' : 'translateY(-50%)',
              fontSize: labelFloated ? 12 : 14,
              fontFamily: 'var(--av-font-primary)',
              color: labelColor,
              pointerEvents: 'none',
              transition: 'all 150ms ease',
            }}
          >
            {label}
          </label>

          {multiline ? (
            <textarea
              value={currentValue}
              placeholder={focused ? placeholder : undefined}
              disabled={disabled}
              maxLength={maxLength}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={handleChange}
              rows={3}
              style={{
                width: '100%',
                padding: `28px ${trailingIcon ? 8 : 16}px 8px ${leadingIcon ? 0 : 16}px`,
                fontSize: 14,
                fontFamily: 'var(--av-font-primary)',
                color: 'var(--av-on-surface)',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'vertical',
                minHeight: 80,
              }}
            />
          ) : (
            <input
              type={type}
              value={currentValue}
              placeholder={focused ? placeholder : undefined}
              disabled={disabled}
              maxLength={maxLength}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={handleChange}
              style={{
                width: '100%',
                height: 56,
                padding: `24px ${trailingIcon ? 8 : 16}px 8px ${leadingIcon ? 0 : 16}px`,
                fontSize: 14,
                fontFamily: 'var(--av-font-primary)',
                color: 'var(--av-on-surface)',
                background: 'transparent',
                border: 'none',
                outline: 'none',
              }}
            />
          )}
        </div>

        {trailingIcon && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingRight: 12,
              color: error ? 'var(--av-error)' : 'var(--av-on-surface-variant)',
              cursor: 'pointer',
            }}
          >
            {trailingIcon}
          </span>
        )}
      </div>

      {(helperText || charCount) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '4px 16px 0',
            fontSize: 12,
            color: error ? 'var(--av-error)' : 'var(--av-on-surface-variant)',
          }}
        >
          <span>{helperText}</span>
          {charCount && maxLength && (
            <span>
              {currentValue.length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Small SVG icons used inline ── */
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

const ErrorCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
)

const ClearIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function TextFieldsSection() {
  const [projectName, setProjectName] = useState('Riverside Tower')
  const [showPassword, setShowPassword] = useState(false)
  const [notes, setNotes] = useState('')
  const [searchVal, setSearchVal] = useState('')

  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      {showPassword ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  )

  return (
    <section id="text-fields">
      <SectionHeader
        label="Inputs"
        title="Text Fields"
        description="Filled and outlined text inputs with labels, helpers, and validation states."
      />

      {/* ── Overview ── */}
      <SubSection
        title="Overview"
        description="MD3 text fields come in two variants: Filled (with a solid background and bottom border) and Outlined (with a full border). Both support floating labels, helper text, icons, and error states."
      >
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Filled Text Field',
              tag: 'Primary',
              content: (
                <FilledTextField label="Project Name" value={projectName} onChange={setProjectName} />
              ),
            },
            {
              label: 'Outlined Text Field',
              tag: 'Default',
              content: (
                <div className="ds-textfield">
                  <input defaultValue="123 Main St" />
                  <label>Site Address</label>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Variants ── */}
      <SubSection
        title="Variants"
        description="Choose Filled for emphasis on forms with multiple fields, and Outlined for cleaner, more minimal layouts."
      >
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Filled — Empty',
              content: <FilledTextField label="Project Name" placeholder="Enter project name" />,
            },
            {
              label: 'Outlined — Empty',
              content: (
                <div className="ds-textfield">
                  <input placeholder=" " />
                  <label>Site Address</label>
                </div>
              ),
            },
            {
              label: 'Filled — With Value',
              content: <FilledTextField label="Delivery Date" value="2026-03-15" />,
            },
            {
              label: 'Outlined — With Value',
              content: (
                <div className="ds-textfield">
                  <input defaultValue="250" />
                  <label>Quantity</label>
                </div>
              ),
            },
            {
              label: 'Filled — With Leading Icon',
              content: (
                <FilledTextField
                  label="Site Address"
                  placeholder="Search address..."
                  leadingIcon={<LocationIcon />}
                />
              ),
            },
            {
              label: 'Filled — With Trailing Icon',
              content: (
                <FilledTextField
                  label="Project Name"
                  value={projectName}
                  onChange={setProjectName}
                  trailingIcon={
                    projectName ? (
                      <span onClick={() => setProjectName('')}>
                        <ClearIcon />
                      </span>
                    ) : undefined
                  }
                />
              ),
            },
            {
              label: 'Textarea (Multiline)',
              content: (
                <FilledTextField
                  label="Notes"
                  placeholder="Add project notes..."
                  multiline
                  value={notes}
                  onChange={setNotes}
                  charCount
                  maxLength={500}
                />
              ),
            },
            {
              label: 'Outlined Textarea',
              content: (
                <div className="ds-textfield">
                  <textarea
                    placeholder=" "
                    rows={3}
                    defaultValue=""
                    style={{
                      width: '100%',
                      padding: '24px 16px 8px',
                      fontSize: 14,
                      fontFamily: 'var(--av-font-primary)',
                      color: 'var(--av-on-surface)',
                      background: 'transparent',
                      border: '1px solid var(--av-outline)',
                      borderRadius: 'var(--av-radius-md)',
                      outline: 'none',
                      resize: 'vertical',
                      minHeight: 80,
                    }}
                  />
                  <label>Description</label>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── States ── */}
      <SubSection
        title="States"
        description="Text fields transition between enabled, focused, error, and disabled states to communicate interactivity and validation."
      >
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Enabled',
              tag: 'Default',
              content: <FilledTextField label="Project Name" placeholder="Enter name" />,
            },
            {
              label: 'Focused',
              content: <FilledTextField label="Site Address" value="123 Main" />,
            },
            {
              label: 'Error',
              tag: 'Validation',
              content: (
                <FilledTextField
                  label="Quantity"
                  value="-5"
                  error
                  helperText="Quantity must be a positive number"
                  trailingIcon={<ErrorCircle />}
                />
              ),
            },
            {
              label: 'Disabled',
              content: (
                <FilledTextField
                  label="Project Name"
                  value="Locked Project"
                  disabled
                />
              ),
            },
            {
              label: 'Error — Outlined',
              content: (
                <div className="ds-textfield error">
                  <input defaultValue="" />
                  <label>Site Address</label>
                  <div className="ds-textfield-helper">This field is required</div>
                </div>
              ),
            },
            {
              label: 'With Helper Text',
              content: (
                <FilledTextField
                  label="Project Code"
                  placeholder="e.g. PRJ-001"
                  helperText="Use format: PRJ-XXX"
                />
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Special Input Types ── */}
      <SubSection
        title="Special Types"
        description="Specialized text field configurations for common input patterns: password visibility toggle and search fields."
      >
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Password Field',
              tag: 'Toggle',
              content: (
                <FilledTextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value="scaffold2026"
                  trailingIcon={
                    <span onClick={() => setShowPassword(!showPassword)}>
                      <EyeIcon />
                    </span>
                  }
                />
              ),
            },
            {
              label: 'Search Field',
              tag: 'Search',
              content: (
                <FilledTextField
                  label="Search Projects"
                  placeholder="Type to search..."
                  value={searchVal}
                  onChange={setSearchVal}
                  leadingIcon={<SearchIcon />}
                  trailingIcon={
                    searchVal ? (
                      <span onClick={() => setSearchVal('')}>
                        <ClearIcon />
                      </span>
                    ) : undefined
                  }
                />
              ),
            },
            {
              label: 'Number Input',
              content: <FilledTextField label="Quantity" type="number" placeholder="0" />,
            },
            {
              label: 'With Character Counter',
              content: (
                <FilledTextField
                  label="Project Name"
                  placeholder="Enter name"
                  charCount
                  maxLength={40}
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
                <FilledTextField label="Project Name" placeholder="e.g. Riverside Tower" />
              ),
              caption:
                'Use clear, descriptive labels that tell users exactly what information is expected.',
            },
            {
              type: 'dont',
              content: (
                <FilledTextField label="Name" placeholder="Enter" />
              ),
              caption:
                'Avoid vague labels and truncated placeholders that leave users guessing.',
            },
            {
              type: 'do',
              content: (
                <FilledTextField
                  label="Quantity"
                  value="-5"
                  error
                  helperText="Must be 1 or greater"
                  trailingIcon={<ErrorCircle />}
                />
              ),
              caption:
                'Provide specific, actionable error messages that tell users how to fix the issue.',
            },
            {
              type: 'dont',
              content: (
                <FilledTextField
                  label="Quantity"
                  value="-5"
                  error
                  helperText="Invalid input"
                />
              ),
              caption:
                'Avoid generic error messages that do not explain what went wrong.',
            },
          ]}
        />
      </SubSection>

      {/* ── Props ── */}
      <SubSection title="XAML Properties">
        <PropsTable
          componentName="TextBox"
          props={[
            {
              name: 'Header',
              type: 'string',
              description: 'Label text displayed above the input field.',
            },
            {
              name: 'PlaceholderText',
              type: 'string',
              description: 'Hint text shown when the field is empty.',
            },
            {
              name: 'Text',
              type: 'string',
              description: 'The current text value of the field.',
            },
            {
              name: 'IsEnabled',
              type: 'bool',
              default: 'True',
              description: 'Whether the user can interact with the field.',
            },
            {
              name: 'MaxLength',
              type: 'int',
              default: '0',
              description: 'Maximum number of characters. 0 means no limit.',
            },
            {
              name: 'AcceptsReturn',
              type: 'bool',
              default: 'False',
              description: 'When True, the TextBox becomes multiline.',
            },
            {
              name: 'TextWrapping',
              type: 'TextWrapping',
              default: 'NoWrap',
              description: 'Controls text wrapping behavior in multiline mode.',
            },
            {
              name: 'InputScope',
              type: 'InputScope',
              description: 'Sets keyboard type: Number, EmailSmtpAddress, Search, etc.',
            },
            {
              name: 'IsReadOnly',
              type: 'bool',
              default: 'False',
              description: 'Makes the field read-only (visible but not editable).',
            },
          ]}
        />
      </SubSection>

      {/* ── XAML Code ── */}
      <SubSection title="Uno Platform XAML">
        <CodeSnippet
          title="TEXT FIELD VARIANTS"
          code={`<!-- Filled Text Field -->
<TextBox
  Header="Project Name"
  PlaceholderText="Enter project name"
  Text="{x:Bind ViewModel.ProjectName, Mode=TwoWay}" />

<!-- Outlined Text Field (with style) -->
<TextBox
  Header="Site Address"
  PlaceholderText="Enter address"
  Style="{StaticResource OutlinedTextBoxStyle}" />

<!-- Error State -->
<TextBox
  Header="Quantity"
  PlaceholderText="Enter quantity"
  Text="-5">
  <TextBox.Description>
    <TextBlock
      Text="Quantity must be a positive number"
      Foreground="{ThemeResource SystemErrorTextForegroundBrush}" />
  </TextBox.Description>
</TextBox>

<!-- Disabled -->
<TextBox
  Header="Project Name"
  Text="Locked Project"
  IsEnabled="False" />

<!-- Multiline / Textarea -->
<TextBox
  Header="Notes"
  PlaceholderText="Add project notes..."
  AcceptsReturn="True"
  TextWrapping="Wrap"
  MaxLength="500"
  Height="120" />

<!-- Password Field -->
<PasswordBox
  Header="Password"
  PlaceholderText="Enter password"
  PasswordRevealMode="Peek" />

<!-- Search Field -->
<AutoSuggestBox
  Header="Search"
  PlaceholderText="Search projects..."
  QueryIcon="Find"
  TextChanged="{x:Bind ViewModel.OnSearchChanged}" />`}
        />
      </SubSection>
    </section>
  )
}
