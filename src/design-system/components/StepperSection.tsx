import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'

/* ── Stepper Component ── */
function Stepper({
  value: initialValue = 1,
  min = 0,
  max = 999,
  step = 1,
  disabled = false,
  error = false,
  label,
  size = 'default',
  decimal = false,
}: {
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  error?: boolean
  label?: string
  size?: 'default' | 'small'
  decimal?: boolean
}) {
  const [value, setValue] = useState(initialValue)

  const canDecrement = value - step >= min
  const canIncrement = value + step <= max
  const isError = error || value < min || value > max

  const decrement = () => {
    if (!disabled && canDecrement) {
      setValue((v) => {
        const next = v - step
        return decimal ? parseFloat(next.toFixed(2)) : next
      })
    }
  }

  const increment = () => {
    if (!disabled && canIncrement) {
      setValue((v) => {
        const next = v + step
        return decimal ? parseFloat(next.toFixed(2)) : next
      })
    }
  }

  const isSmall = size === 'small'
  const btnSize = isSmall ? 28 : 36
  const valueWidth = isSmall ? 44 : 56
  const fontSize = isSmall ? 12 : 14

  return (
    <div style={{ opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <div
          style={{
            fontSize: 12,
            fontFamily: 'var(--av-font-primary)',
            color: 'var(--av-on-surface-variant)',
            marginBottom: 6,
          }}
        >
          {label}
        </div>
      )}
      <div
        className="ds-stepper"
        style={{
          borderColor: isError ? 'var(--av-error)' : undefined,
        }}
      >
        <button
          className="ds-stepper-btn"
          onClick={decrement}
          disabled={disabled || !canDecrement}
          style={{
            width: btnSize,
            height: btnSize,
            opacity: canDecrement && !disabled ? 1 : 0.4,
            cursor: disabled || !canDecrement ? 'not-allowed' : 'pointer',
          }}
          aria-label="Decrease"
        >
          <svg width={isSmall ? 14 : 18} height={isSmall ? 14 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <span
          className="ds-stepper-value"
          style={{
            width: valueWidth,
            fontSize,
            color: isError ? 'var(--av-error)' : undefined,
            fontWeight: isError ? 700 : 600,
          }}
        >
          {decimal ? value.toFixed(2) : value}
        </span>

        <button
          className="ds-stepper-btn"
          onClick={increment}
          disabled={disabled || !canIncrement}
          style={{
            width: btnSize,
            height: btnSize,
            opacity: canIncrement && !disabled ? 1 : 0.4,
            cursor: disabled || !canIncrement ? 'not-allowed' : 'pointer',
          }}
          aria-label="Increase"
        >
          <svg width={isSmall ? 14 : 18} height={isSmall ? 14 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {isError && (
        <div
          style={{
            fontSize: 12,
            color: 'var(--av-error)',
            marginTop: 4,
            fontFamily: 'var(--av-font-primary)',
          }}
        >
          {value > max
            ? `Maximum is ${max}`
            : value < min
              ? `Minimum is ${min}`
              : 'Invalid value'}
        </div>
      )}
    </div>
  )
}

/* ── Stepper with inline label ── */
function StepperRow({
  label,
  sublabel,
  value,
  min,
  max,
  step,
  decimal,
}: {
  label: string
  sublabel?: string
  value?: number
  min?: number
  max?: number
  step?: number
  decimal?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid var(--av-outline-variant)',
        width: '100%',
        maxWidth: 360,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--av-on-surface)',
            fontFamily: 'var(--av-font-primary)',
          }}
        >
          {label}
        </div>
        {sublabel && (
          <div
            style={{
              fontSize: 12,
              color: 'var(--av-on-surface-variant)',
              fontFamily: 'var(--av-font-primary)',
              marginTop: 2,
            }}
          >
            {sublabel}
          </div>
        )}
      </div>
      <Stepper value={value} min={min} max={max} step={step} decimal={decimal} />
    </div>
  )
}

export default function StepperSection() {
  return (
    <section id="stepper">
      <SectionHeader
        label="Inputs"
        title="Stepper"
        description="Increment/decrement controls for quantities, counts, and measurements."
      />

      {/* ── Overview ── */}
      <SubSection
        title="Overview"
        description="The stepper provides a compact, touch-friendly way to adjust quantities without keyboard input. It consists of minus/plus buttons flanking a numeric display."
      >
        <ComponentShowcase
          columns={3}
          items={[
            {
              label: 'Default Stepper',
              tag: 'Interactive',
              content: <Stepper value={5} />,
            },
            {
              label: 'With Label',
              content: <Stepper value={12} label="Bay Count" />,
            },
            {
              label: 'Small Stepper',
              tag: 'Compact',
              content: <Stepper value={3} size="small" />,
            },
          ]}
        />
      </SubSection>

      {/* ── Variants ── */}
      <SubSection
        title="Variants"
        description="Steppers support different value formats, size options, and can be used standalone or within list rows."
      >
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Integer Value',
              tag: 'Default',
              content: <Stepper value={24} label="Standard Frames" />,
            },
            {
              label: 'Decimal Value',
              tag: 'Precision',
              content: <Stepper value={2.5} step={0.25} decimal label="Height (m)" />,
            },
            {
              label: 'Small — Integer',
              content: <Stepper value={1} size="small" label="Quantity" />,
            },
            {
              label: 'Small — Decimal',
              content: (
                <Stepper value={0.5} step={0.1} decimal size="small" label="Spacing (m)" />
              ),
            },
            {
              label: 'Large Step',
              content: <Stepper value={50} step={10} label="Planks" />,
            },
            {
              label: 'Starting at Zero',
              content: <Stepper value={0} min={0} label="Extra Braces" />,
            },
          ]}
        />

        {/* Stepper in list context */}
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'In List Context',
              tag: 'Quantify Pattern',
              content: (
                <div
                  style={{
                    background: 'var(--av-bg)',
                    borderRadius: 'var(--av-radius-lg)',
                    border: '1px solid var(--av-outline-variant)',
                    padding: '4px 20px',
                    maxWidth: 400,
                    width: '100%',
                  }}
                >
                  <StepperRow label="Standard Frames" sublabel="H: 2.0m  W: 0.73m" value={24} />
                  <StepperRow label="Ledgers" sublabel="L: 2.57m" value={48} />
                  <StepperRow label="Diagonal Braces" value={12} />
                  <StepperRow
                    label="Base Jacks"
                    sublabel="Adjustable height"
                    value={1.5}
                    step={0.25}
                    decimal
                  />
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── States ── */}
      <SubSection
        title="States"
        description="Steppers handle boundary conditions, disabled states, and error validation for out-of-range values."
      >
        <ComponentShowcase
          columns={3}
          items={[
            {
              label: 'Default',
              tag: 'Enabled',
              content: <Stepper value={5} label="Quantity" />,
            },
            {
              label: 'At Minimum',
              tag: 'Bounded',
              content: <Stepper value={0} min={0} label="Extra Items" />,
            },
            {
              label: 'At Maximum',
              tag: 'Bounded',
              content: <Stepper value={100} max={100} label="Max 100" />,
            },
            {
              label: 'Disabled',
              content: <Stepper value={10} disabled label="Locked" />,
            },
            {
              label: 'Error — Over Max',
              tag: 'Validation',
              content: <Stepper value={150} max={100} error label="Quantity" />,
            },
            {
              label: 'Error — Under Min',
              tag: 'Validation',
              content: <Stepper value={-1} min={0} error label="Count" />,
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
              content: <Stepper value={5} label="Bay Count" />,
              caption:
                'Use a stepper for small numeric adjustments where users typically change the value by a few increments.',
            },
            {
              type: 'dont',
              content: <Stepper value={2500} step={1} label="Total Pieces" />,
              caption:
                'Do not use a stepper for large numeric ranges. Use a text input with validation instead.',
            },
            {
              type: 'do',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Stepper value={5} label="Frames" />
                  <Stepper value={10} label="Ledgers" />
                </div>
              ),
              caption:
                'Add clear labels to each stepper so users know exactly what quantity they are adjusting.',
            },
            {
              type: 'dont',
              content: (
                <div style={{ display: 'flex', gap: 8 }}>
                  <Stepper value={5} />
                  <Stepper value={10} />
                  <Stepper value={3} />
                </div>
              ),
              caption:
                'Do not group multiple unlabeled steppers. Without context, users cannot distinguish between them.',
            },
          ]}
        />
      </SubSection>

      {/* ── Props ── */}
      <SubSection title="XAML Properties">
        <PropsTable
          componentName="NumberBox"
          props={[
            {
              name: 'Header',
              type: 'string',
              description: 'Label text displayed above the control.',
            },
            {
              name: 'Value',
              type: 'double',
              description: 'The current numeric value.',
            },
            {
              name: 'Minimum',
              type: 'double',
              default: '-Infinity',
              description: 'Minimum allowed value.',
            },
            {
              name: 'Maximum',
              type: 'double',
              default: 'Infinity',
              description: 'Maximum allowed value.',
            },
            {
              name: 'SmallChange',
              type: 'double',
              default: '1',
              description: 'Amount to increment/decrement per click.',
            },
            {
              name: 'LargeChange',
              type: 'double',
              default: '10',
              description: 'Amount to change on page up/down.',
            },
            {
              name: 'SpinButtonPlacementMode',
              type: 'NumberBoxSpinButtonPlacementMode',
              default: 'Hidden',
              description: 'Controls visibility: Hidden, Compact, or Inline.',
            },
            {
              name: 'IsEnabled',
              type: 'bool',
              default: 'True',
              description: 'Whether the control is interactive.',
            },
            {
              name: 'AcceptsExpression',
              type: 'bool',
              default: 'False',
              description: 'Allows math expressions like "2+3" in the input.',
            },
            {
              name: 'NumberFormatter',
              type: 'INumberFormatter2',
              description: 'Custom formatter for display (e.g., decimal places, units).',
            },
            {
              name: 'ValueChanged',
              type: 'event',
              description: 'Fires when the value changes.',
            },
          ]}
        />
      </SubSection>

      {/* ── XAML Code ── */}
      <SubSection title="Uno Platform XAML">
        <CodeSnippet
          title="STEPPER / NUMBERBOX"
          code={`<!-- Basic Stepper -->
<muxc:NumberBox
  Header="Bay Count"
  Value="{x:Bind ViewModel.BayCount, Mode=TwoWay}"
  Minimum="0"
  Maximum="100"
  SmallChange="1"
  SpinButtonPlacementMode="Inline" />

<!-- Decimal Stepper -->
<muxc:NumberBox
  Header="Height (m)"
  Value="{x:Bind ViewModel.Height, Mode=TwoWay}"
  Minimum="0.5"
  Maximum="50"
  SmallChange="0.25"
  SpinButtonPlacementMode="Inline">
  <muxc:NumberBox.NumberFormatter>
    <DecimalFormatter
      FractionDigits="2"
      IntegerDigits="1" />
  </muxc:NumberBox.NumberFormatter>
</muxc:NumberBox>

<!-- Compact Stepper -->
<muxc:NumberBox
  Header="Quantity"
  Value="{x:Bind ViewModel.Qty, Mode=TwoWay}"
  Minimum="1"
  SmallChange="1"
  SpinButtonPlacementMode="Compact" />

<!-- Disabled Stepper -->
<muxc:NumberBox
  Header="Locked Quantity"
  Value="10"
  IsEnabled="False"
  SpinButtonPlacementMode="Inline" />

<!-- In a list context -->
<ListView ItemsSource="{x:Bind ViewModel.LineItems}">
  <ListView.ItemTemplate>
    <DataTemplate x:DataType="models:LineItem">
      <Grid ColumnDefinitions="*, Auto" Padding="16,8">
        <StackPanel>
          <TextBlock Text="{x:Bind Name}" />
          <TextBlock Text="{x:Bind Description}"
            Style="{ThemeResource CaptionTextBlockStyle}" />
        </StackPanel>
        <muxc:NumberBox
          Grid.Column="1"
          Value="{x:Bind Quantity, Mode=TwoWay}"
          Minimum="0"
          SmallChange="1"
          SpinButtonPlacementMode="Inline" />
      </Grid>
    </DataTemplate>
  </ListView.ItemTemplate>
</ListView>`}
        />
      </SubSection>
    </section>
  )
}
