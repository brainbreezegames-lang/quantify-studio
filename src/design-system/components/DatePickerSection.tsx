import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'

/* ── SVG Icons ── */
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

/* ── Date Input Field (Filled Style) ── */
function DateField({
  label,
  value,
  disabled,
  error,
  helperText,
  type = 'date',
  onChange,
}: {
  label: string
  value?: string
  disabled?: boolean
  error?: boolean
  helperText?: string
  type?: 'date' | 'time' | 'datetime-local'
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value)
    onChange?.(e.target.value)
  }

  const icon = type === 'time' ? <ClockIcon /> : <CalendarIcon />

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
        <div style={{ flex: 1, position: 'relative' }}>
          <label
            style={{
              position: 'absolute',
              left: 16,
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

          <input
            type={type}
            value={currentValue}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={handleChange}
            style={{
              width: '100%',
              height: 56,
              padding: '24px 44px 8px 16px',
              fontSize: 14,
              fontFamily: 'var(--av-font-primary)',
              color: 'var(--av-on-surface)',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          />
        </div>

        <span
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            color: error ? 'var(--av-error)' : 'var(--av-on-surface-variant)',
            pointerEvents: 'none',
          }}
        >
          {icon}
        </span>
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

/* ── Date Range (two fields with arrow) ── */
function DateRangeField({
  startLabel,
  endLabel,
  startValue,
  endValue,
  disabled,
  error,
  helperText,
}: {
  startLabel: string
  endLabel: string
  startValue?: string
  endValue?: string
  disabled?: boolean
  error?: boolean
  helperText?: string
}) {
  const [start, setStart] = useState(startValue ?? '')
  const [end, setEnd] = useState(endValue ?? '')

  return (
    <div style={{ width: '100%', maxWidth: 580 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <DateField
          label={startLabel}
          value={start}
          onChange={setStart}
          disabled={disabled}
          error={error}
        />

        <span
          style={{
            color: 'var(--av-on-surface-variant)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowRightIcon />
        </span>

        <DateField
          label={endLabel}
          value={end}
          onChange={setEnd}
          disabled={disabled}
          error={error}
        />
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

export default function DatePickerSection() {
  const [deliveryDate, setDeliveryDate] = useState('2026-03-15')

  return (
    <section id="date-picker">
      <SectionHeader
        label="Inputs"
        title="Date Picker"
        description="Date and time selection for scheduling, deadlines, and rental periods."
      />

      {/* ── Overview ── */}
      <SubSection
        title="Overview"
        description="Date inputs use the filled text field pattern with a calendar trailing icon. The native browser date picker is activated on click, providing platform-appropriate calendar UI."
      >
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Date Input',
              tag: 'Primary',
              content: (
                <DateField
                  label="Delivery Date"
                  value={deliveryDate}
                  onChange={setDeliveryDate}
                />
              ),
            },
            {
              label: 'Outlined Date Input',
              tag: 'Default',
              content: (
                <div className="ds-textfield" style={{ position: 'relative' }}>
                  <input type="date" defaultValue="2026-03-15" />
                  <label>Start Date</label>
                  <span
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--av-on-surface-variant)',
                      pointerEvents: 'none',
                    }}
                  >
                    <CalendarIcon />
                  </span>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Variants ── */}
      <SubSection
        title="Variants"
        description="Date fields support single date, date range, time-only, and combined date-time inputs."
      >
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Date Only',
              content: <DateField label="Delivery Date" value="2026-03-15" />,
            },
            {
              label: 'Time Only',
              content: <DateField label="Inspection Time" type="time" value="09:30" />,
            },
            {
              label: 'Date-Time',
              tag: 'Combined',
              content: (
                <DateField
                  label="Scheduled Delivery"
                  type="datetime-local"
                  value="2026-03-15T09:30"
                />
              ),
            },
            {
              label: 'Empty — With Helper',
              content: (
                <DateField
                  label="Project Deadline"
                  helperText="Select the final delivery date"
                />
              ),
            },
          ]}
        />

        {/* Date range is full-width */}
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Date Range',
              tag: 'Rental Period',
              content: (
                <DateRangeField
                  startLabel="Rental Start"
                  endLabel="Rental End"
                  startValue="2026-03-01"
                  endValue="2026-06-30"
                  helperText="Rental duration: 122 days"
                />
              ),
            },
            {
              label: 'Date Range — Empty',
              content: (
                <DateRangeField
                  startLabel="Start Date"
                  endLabel="End Date"
                  helperText="Select the project timeline"
                />
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── States ── */}
      <SubSection
        title="States"
        description="Date fields follow the same state model as text fields: enabled, focused, error, and disabled."
      >
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Enabled',
              tag: 'Default',
              content: <DateField label="Delivery Date" value="2026-03-15" />,
            },
            {
              label: 'Empty',
              content: <DateField label="Start Date" />,
            },
            {
              label: 'Error',
              tag: 'Validation',
              content: (
                <DateField
                  label="Delivery Date"
                  value="2025-01-01"
                  error
                  helperText="Date cannot be in the past"
                />
              ),
            },
            {
              label: 'Disabled',
              content: (
                <DateField
                  label="Project Start"
                  value="2026-01-15"
                  disabled
                />
              ),
            },
            {
              label: 'With Helper Text',
              content: (
                <DateField
                  label="Inspection Date"
                  value="2026-04-01"
                  helperText="Must be within rental period"
                />
              ),
            },
            {
              label: 'Error — Range',
              content: (
                <DateRangeField
                  startLabel="Start"
                  endLabel="End"
                  startValue="2026-06-01"
                  endValue="2026-03-01"
                  error
                  helperText="End date must be after start date"
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
                <DateField
                  label="Delivery Date"
                  value="2026-03-15"
                  helperText="Expected scaffold delivery"
                />
              ),
              caption:
                'Use descriptive labels and helper text to clarify the purpose of the date field.',
            },
            {
              type: 'dont',
              content: <DateField label="Date" />,
              caption:
                'Avoid ambiguous labels. Users should know which date they are selecting.',
            },
            {
              type: 'do',
              content: (
                <DateRangeField
                  startLabel="Rental Start"
                  endLabel="Rental End"
                  startValue="2026-03-01"
                  endValue="2026-06-30"
                />
              ),
              caption:
                'Use a date range pattern with a clear visual connection between start and end dates.',
            },
            {
              type: 'dont',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 220 }}>
                  <DateField label="Date 1" value="2026-03-01" />
                  <DateField label="Date 2" value="2026-06-30" />
                </div>
              ),
              caption:
                'Do not stack unrelated-looking date fields when they represent a range. Use the date range pattern instead.',
            },
          ]}
        />
      </SubSection>

      {/* ── Props ── */}
      <SubSection title="XAML Properties">
        <PropsTable
          componentName="DatePicker / TimePicker"
          props={[
            {
              name: 'Header',
              type: 'string',
              description: 'Label text displayed above the picker.',
            },
            {
              name: 'Date',
              type: 'DateTimeOffset',
              description: 'The currently selected date value.',
            },
            {
              name: 'Time',
              type: 'TimeSpan',
              description: 'The currently selected time value (TimePicker only).',
            },
            {
              name: 'MinYear',
              type: 'DateTimeOffset',
              description: 'Earliest selectable year.',
            },
            {
              name: 'MaxYear',
              type: 'DateTimeOffset',
              description: 'Latest selectable year.',
            },
            {
              name: 'DayFormat',
              type: 'string',
              default: '{day.integer}',
              description: 'Format string for day display.',
            },
            {
              name: 'MonthFormat',
              type: 'string',
              default: '{month.abbreviated}',
              description: 'Format string for month display.',
            },
            {
              name: 'IsEnabled',
              type: 'bool',
              default: 'True',
              description: 'Whether the picker is interactive.',
            },
            {
              name: 'DateChanged',
              type: 'event',
              description: 'Fires when the user selects a new date.',
            },
            {
              name: 'ClockIdentifier',
              type: 'string',
              default: '12HourClock',
              description: '12- or 24-hour format (TimePicker only).',
            },
          ]}
        />
      </SubSection>

      {/* ── XAML Code ── */}
      <SubSection title="Uno Platform XAML">
        <CodeSnippet
          title="DATE & TIME PICKERS"
          code={`<!-- Date Picker -->
<DatePicker
  Header="Delivery Date"
  Date="{x:Bind ViewModel.DeliveryDate, Mode=TwoWay}"
  MinYear="{x:Bind ViewModel.MinDate}"
  MaxYear="{x:Bind ViewModel.MaxDate}" />

<!-- Time Picker -->
<TimePicker
  Header="Inspection Time"
  Time="{x:Bind ViewModel.InspectionTime, Mode=TwoWay}"
  ClockIdentifier="12HourClock" />

<!-- Date Range (two pickers side by side) -->
<StackPanel Orientation="Horizontal" Spacing="16">
  <DatePicker
    Header="Rental Start"
    Date="{x:Bind ViewModel.RentalStart, Mode=TwoWay}" />

  <FontIcon Glyph="&#xE72A;" VerticalAlignment="Center" />

  <DatePicker
    Header="Rental End"
    Date="{x:Bind ViewModel.RentalEnd, Mode=TwoWay}" />
</StackPanel>

<!-- Disabled Date Picker -->
<DatePicker
  Header="Project Start"
  Date="{x:Bind ViewModel.ProjectStart}"
  IsEnabled="False" />

<!-- Calendar Date Picker (shows full calendar) -->
<CalendarDatePicker
  Header="Select Date"
  PlaceholderText="Pick a date"
  Date="{x:Bind ViewModel.SelectedDate, Mode=TwoWay}"
  MinDate="{x:Bind ViewModel.MinDate}"
  IsTodayHighlighted="True" />`}
        />
      </SubSection>
    </section>
  )
}
