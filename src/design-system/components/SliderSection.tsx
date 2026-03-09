import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'

/* ── Slider with label and value ── */
function Slider({
  label,
  value: initialValue = 50,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  unit = '',
  showValue = true,
  size = 'default',
  onChange,
}: {
  label?: string
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  unit?: string
  showValue?: boolean
  size?: 'default' | 'small'
  onChange?: (v: number) => void
}) {
  const [value, setValue] = useState(initialValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setValue(v)
    onChange?.(v)
  }

  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div
      className="ds-slider"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {(label || showValue) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 8,
          }}
        >
          {label && (
            <span
              style={{
                fontSize: size === 'small' ? 12 : 13,
                fontFamily: 'var(--av-font-primary)',
                color: 'var(--av-on-surface-variant)',
                fontWeight: 500,
              }}
            >
              {label}
            </span>
          )}
          {showValue && (
            <span
              style={{
                fontSize: size === 'small' ? 12 : 14,
                fontFamily: 'var(--av-font-mono)',
                fontWeight: 600,
                color: 'var(--av-on-surface)',
              }}
            >
              {step < 1 ? value.toFixed(1) : value}
              {unit && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 400,
                    color: 'var(--av-on-surface-variant)',
                    marginLeft: 2,
                  }}
                >
                  {unit}
                </span>
              )}
            </span>
          )}
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          style={{
            height: size === 'small' ? 2 : 4,
            cursor: disabled ? 'not-allowed' : 'pointer',
            background: `linear-gradient(to right, var(--av-blue) ${percentage}%, var(--av-blue-50, #E0E0E0) ${percentage}%)`,
          }}
        />
      </div>

      {/* Min/max labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
          fontSize: 11,
          fontFamily: 'var(--av-font-primary)',
          color: 'var(--av-on-surface-variant)',
          opacity: 0.7,
        }}
      >
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  )
}

/* ── Discrete Slider with step marks ── */
function DiscreteSlider({
  label,
  value: initialValue = 50,
  min = 0,
  max = 100,
  step = 10,
  disabled = false,
  unit = '',
  marks,
}: {
  label?: string
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  unit?: string
  marks?: { value: number; label: string }[]
}) {
  const [value, setValue] = useState(initialValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseFloat(e.target.value))
  }

  const percentage = ((value - min) / (max - min)) * 100
  const stepCount = (max - min) / step

  return (
    <div
      className="ds-slider"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontFamily: 'var(--av-font-primary)',
              color: 'var(--av-on-surface-variant)',
              fontWeight: 500,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: 14,
              fontFamily: 'var(--av-font-mono)',
              fontWeight: 600,
              color: 'var(--av-on-surface)',
            }}
          >
            {value}
            {unit}
          </span>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          style={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            background: `linear-gradient(to right, var(--av-blue) ${percentage}%, var(--av-blue-50, #E0E0E0) ${percentage}%)`,
          }}
        />

        {/* Step marks */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: -2,
            height: 8,
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 2px',
          }}
        >
          {Array.from({ length: stepCount + 1 }, (_, i) => {
            const markVal = min + i * step
            const markPct = ((markVal - min) / (max - min)) * 100
            const isActive = markPct <= percentage

            return (
              <div
                key={i}
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: isActive ? 'var(--av-blue)' : 'var(--av-outline)',
                  opacity: 0.6,
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Custom marks or default range labels */}
      {marks ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 8,
            fontSize: 11,
            fontFamily: 'var(--av-font-primary)',
            color: 'var(--av-on-surface-variant)',
          }}
        >
          {marks.map((m, i) => (
            <span
              key={i}
              style={{
                fontWeight: m.value === value ? 600 : 400,
                color: m.value === value ? 'var(--av-on-surface)' : undefined,
              }}
            >
              {m.label}
            </span>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 4,
            fontSize: 11,
            fontFamily: 'var(--av-font-primary)',
            color: 'var(--av-on-surface-variant)',
            opacity: 0.7,
          }}
        >
          <span>
            {min}
            {unit}
          </span>
          <span>
            {max}
            {unit}
          </span>
        </div>
      )}
    </div>
  )
}

/* ── Range Slider Concept (two thumbs simulated) ── */
function RangeSliderConcept({
  label,
  minValue: initMin = 20,
  maxValue: initMax = 80,
  min = 0,
  max = 100,
  unit = '',
}: {
  label?: string
  minValue?: number
  maxValue?: number
  min?: number
  max?: number
  unit?: string
}) {
  const [lo, setLo] = useState(initMin)
  const [hi, setHi] = useState(initMax)

  const loPct = ((lo - min) / (max - min)) * 100
  const hiPct = ((hi - min) / (max - min)) * 100

  const handleLoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    if (v <= hi) setLo(v)
  }

  const handleHiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    if (v >= lo) setHi(v)
  }

  return (
    <div className="ds-slider">
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontFamily: 'var(--av-font-primary)',
              color: 'var(--av-on-surface-variant)',
              fontWeight: 500,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: 14,
              fontFamily: 'var(--av-font-mono)',
              fontWeight: 600,
              color: 'var(--av-on-surface)',
            }}
          >
            {lo}
            {unit} - {hi}
            {unit}
          </span>
        </div>
      )}

      <div style={{ position: 'relative', height: 20 }}>
        {/* Track background */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 8,
            height: 4,
            borderRadius: 2,
            background: 'var(--av-blue-50, #E0E0E0)',
          }}
        />
        {/* Active range */}
        <div
          style={{
            position: 'absolute',
            left: `${loPct}%`,
            right: `${100 - hiPct}%`,
            top: 8,
            height: 4,
            borderRadius: 2,
            background: 'var(--av-blue)',
          }}
        />

        {/* Low thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={handleLoChange}
          style={{
            position: 'absolute',
            width: '100%',
            top: 0,
            height: 20,
            WebkitAppearance: 'none',
            background: 'transparent',
            pointerEvents: 'none',
            zIndex: 2,
          }}
          className="range-thumb-only"
        />

        {/* High thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={handleHiChange}
          style={{
            position: 'absolute',
            width: '100%',
            top: 0,
            height: 20,
            WebkitAppearance: 'none',
            background: 'transparent',
            pointerEvents: 'none',
            zIndex: 3,
          }}
          className="range-thumb-only"
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
          fontSize: 11,
          fontFamily: 'var(--av-font-primary)',
          color: 'var(--av-on-surface-variant)',
          opacity: 0.7,
        }}
      >
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>

      {/* Inline style for thumb-only pointer events */}
      <style>{`
        .range-thumb-only::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--av-blue);
          cursor: pointer;
          pointer-events: auto;
          box-shadow: 0 2px 6px rgba(0,5,238,0.3);
        }
      `}</style>
    </div>
  )
}

export default function SliderSection() {
  const [height, setHeight] = useState(2.0)
  const [opacity, setOpacity] = useState(75)

  return (
    <section id="slider">
      <SectionHeader
        label="Inputs"
        title="Slider"
        description="Continuous and discrete value selection — single thumb or range."
      />

      {/* ── Overview ── */}
      <SubSection
        title="Overview"
        description="Sliders provide a visual, interactive way to select numeric values along a track. They are ideal when the precise value is less important than the approximate position within a range."
      >
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Continuous Slider',
              tag: 'Interactive',
              content: (
                <Slider
                  label="Scaffold Height"
                  value={height}
                  min={0.5}
                  max={10}
                  step={0.1}
                  unit="m"
                  onChange={setHeight}
                />
              ),
            },
            {
              label: 'Discrete Slider',
              tag: 'Stepped',
              content: (
                <DiscreteSlider
                  label="Load Capacity"
                  value={60}
                  min={0}
                  max={100}
                  step={20}
                  unit="%"
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 20, label: '20%' },
                    { value: 40, label: '40%' },
                    { value: 60, label: '60%' },
                    { value: 80, label: '80%' },
                    { value: 100, label: '100%' },
                  ]}
                />
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Variants ── */}
      <SubSection
        title="Variants"
        description="Different slider configurations for various contexts: continuous, discrete with step marks, and range selection."
      >
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Continuous',
              tag: 'Default',
              content: (
                <Slider
                  label="Opacity"
                  value={opacity}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  onChange={setOpacity}
                />
              ),
            },
            {
              label: 'Discrete — 5 Steps',
              content: (
                <DiscreteSlider
                  label="Lift Height"
                  value={3}
                  min={1}
                  max={5}
                  step={1}
                  unit="m"
                  marks={[
                    { value: 1, label: '1m' },
                    { value: 2, label: '2m' },
                    { value: 3, label: '3m' },
                    { value: 4, label: '4m' },
                    { value: 5, label: '5m' },
                  ]}
                />
              ),
            },
            {
              label: 'Small Size',
              content: (
                <Slider
                  label="Zoom"
                  value={100}
                  min={25}
                  max={400}
                  step={25}
                  unit="%"
                  size="small"
                />
              ),
            },
            {
              label: 'Without Value Display',
              content: (
                <Slider
                  label="Volume"
                  value={60}
                  min={0}
                  max={100}
                  showValue={false}
                />
              ),
            },
            {
              label: 'Decimal Steps',
              content: (
                <Slider
                  label="Spacing"
                  value={1.5}
                  min={0.5}
                  max={3.0}
                  step={0.5}
                  unit="m"
                />
              ),
            },
            {
              label: 'Large Range',
              content: (
                <Slider
                  label="Budget"
                  value={25000}
                  min={0}
                  max={100000}
                  step={5000}
                />
              ),
            },
          ]}
        />

        {/* Range slider full-width */}
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Range Slider',
              tag: 'Dual Thumb',
              content: (
                <RangeSliderConcept
                  label="Price Range"
                  minValue={200}
                  maxValue={800}
                  min={0}
                  max={1000}
                />
              ),
            },
            {
              label: 'Range — Height Filter',
              content: (
                <RangeSliderConcept
                  label="Height Filter"
                  minValue={2}
                  maxValue={8}
                  min={0}
                  max={15}
                  unit="m"
                />
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── States ── */}
      <SubSection
        title="States"
        description="Sliders support enabled, disabled, and various interactive states."
      >
        <ComponentShowcase
          columns={2}
          items={[
            {
              label: 'Enabled',
              tag: 'Default',
              content: <Slider label="Value" value={50} min={0} max={100} />,
            },
            {
              label: 'Disabled',
              content: <Slider label="Locked" value={75} min={0} max={100} disabled />,
            },
            {
              label: 'At Minimum',
              content: <Slider label="Volume" value={0} min={0} max={100} unit="%" />,
            },
            {
              label: 'At Maximum',
              content: <Slider label="Brightness" value={100} min={0} max={100} unit="%" />,
            },
            {
              label: 'Mid Range',
              content: <Slider label="Balance" value={50} min={0} max={100} />,
            },
            {
              label: 'Discrete — Disabled',
              content: (
                <DiscreteSlider
                  label="Quality"
                  value={60}
                  min={0}
                  max={100}
                  step={20}
                  unit="%"
                  disabled
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
                <Slider
                  label="Scaffold Height"
                  value={4.5}
                  min={0.5}
                  max={10}
                  step={0.5}
                  unit="m"
                />
              ),
              caption:
                'Use sliders for values where approximate selection is acceptable and the range is bounded and well-understood.',
            },
            {
              type: 'dont',
              content: (
                <Slider
                  label="Project ID"
                  value={45231}
                  min={0}
                  max={99999}
                  step={1}
                />
              ),
              caption:
                'Do not use sliders for precise or arbitrary values like IDs. Use a text input instead.',
            },
            {
              type: 'do',
              content: (
                <Slider
                  label="Load Capacity"
                  value={75}
                  min={0}
                  max={100}
                  unit="%"
                />
              ),
              caption:
                'Always display the current value alongside the slider so users know the exact number.',
            },
            {
              type: 'dont',
              content: (
                <Slider
                  label=""
                  value={75}
                  min={0}
                  max={100}
                  showValue={false}
                />
              ),
              caption:
                'Do not use a slider without any label or value display. Users need context to understand what they are adjusting.',
            },
          ]}
        />
      </SubSection>

      {/* ── Props ── */}
      <SubSection title="XAML Properties">
        <PropsTable
          componentName="Slider"
          props={[
            {
              name: 'Header',
              type: 'string',
              description: 'Label text displayed above the slider.',
            },
            {
              name: 'Value',
              type: 'double',
              description: 'The current slider value.',
            },
            {
              name: 'Minimum',
              type: 'double',
              default: '0',
              description: 'The minimum value of the slider range.',
            },
            {
              name: 'Maximum',
              type: 'double',
              default: '100',
              description: 'The maximum value of the slider range.',
            },
            {
              name: 'StepFrequency',
              type: 'double',
              default: '1',
              description: 'Step interval between selectable values.',
            },
            {
              name: 'TickFrequency',
              type: 'double',
              description: 'Interval between visible tick marks on the track.',
            },
            {
              name: 'TickPlacement',
              type: 'TickPlacement',
              default: 'None',
              description: 'Where ticks appear: None, TopLeft, BottomRight, Outside, Inline.',
            },
            {
              name: 'SnapsTo',
              type: 'SliderSnapsTo',
              default: 'StepValues',
              description: 'Whether the thumb snaps to StepValues or Ticks.',
            },
            {
              name: 'IsEnabled',
              type: 'bool',
              default: 'True',
              description: 'Whether the slider is interactive.',
            },
            {
              name: 'Orientation',
              type: 'Orientation',
              default: 'Horizontal',
              description: 'Slider direction: Horizontal or Vertical.',
            },
            {
              name: 'IsThumbToolTipEnabled',
              type: 'bool',
              default: 'True',
              description: 'Shows a tooltip with the current value while dragging.',
            },
            {
              name: 'ValueChanged',
              type: 'event',
              description: 'Fires when the slider value changes.',
            },
          ]}
        />
      </SubSection>

      {/* ── XAML Code ── */}
      <SubSection title="Uno Platform XAML">
        <CodeSnippet
          title="SLIDER"
          code={`<!-- Continuous Slider -->
<Slider
  Header="Scaffold Height (m)"
  Value="{x:Bind ViewModel.Height, Mode=TwoWay}"
  Minimum="0.5"
  Maximum="10"
  StepFrequency="0.1"
  IsThumbToolTipEnabled="True" />

<!-- Discrete Slider with Ticks -->
<Slider
  Header="Load Capacity"
  Value="{x:Bind ViewModel.LoadCapacity, Mode=TwoWay}"
  Minimum="0"
  Maximum="100"
  StepFrequency="20"
  TickFrequency="20"
  TickPlacement="BottomRight"
  SnapsTo="Ticks" />

<!-- Disabled Slider -->
<Slider
  Header="Locked Value"
  Value="75"
  Minimum="0"
  Maximum="100"
  IsEnabled="False" />

<!-- Slider with Value Display -->
<StackPanel>
  <Grid>
    <TextBlock Text="Height" />
    <TextBlock
      Text="{x:Bind ViewModel.Height, Mode=OneWay}"
      HorizontalAlignment="Right" />
  </Grid>
  <Slider
    Value="{x:Bind ViewModel.Height, Mode=TwoWay}"
    Minimum="0"
    Maximum="50"
    StepFrequency="0.5" />
</StackPanel>

<!-- Range Slider (using two sliders) -->
<StackPanel Spacing="8">
  <TextBlock Text="Price Range" />
  <Slider
    Header="Min"
    Value="{x:Bind ViewModel.MinPrice, Mode=TwoWay}"
    Minimum="0"
    Maximum="{x:Bind ViewModel.MaxPrice}" />
  <Slider
    Header="Max"
    Value="{x:Bind ViewModel.MaxPrice, Mode=TwoWay}"
    Minimum="{x:Bind ViewModel.MinPrice}"
    Maximum="1000" />
</StackPanel>`}
        />
      </SubSection>
    </section>
  )
}
