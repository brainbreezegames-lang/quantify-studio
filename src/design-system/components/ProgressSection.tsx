import React, { useState, useEffect } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'

export default function ProgressSection() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => p >= 100 ? 0 : p + 2)
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const linearTrackStyle: React.CSSProperties = {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  }

  return (
    <section id="progress" className="ds-section">
      <SectionHeader
        label="Component"
        title="Progress Indicators"
        description="Linear and circular indicators for determinate and indeterminate progress."
      />

      {/* ── Linear Determinate ── */}
      <SubSection
        title="Linear Determinate"
        description="Shows exact progress as a filled bar. Use when the percentage completion is known, such as file uploads, sync operations, or multi-step workflows."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: '25% Complete',
              tag: 'ProgressBar',
              content: (
                <div style={{ width: '100%', maxWidth: 360 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--av-on-surface, #1C1B1F)' }}>Uploading equipment list</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-blue, #2962FF)' }}>25%</span>
                  </div>
                  <div className="ds-progress-linear">
                    <div className="ds-progress-linear-fill" style={{ width: '25%' }} />
                  </div>
                </div>
              ),
            },
            {
              label: '60% Complete',
              tag: 'ProgressBar',
              content: (
                <div style={{ width: '100%', maxWidth: 360 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--av-on-surface, #1C1B1F)' }}>Syncing inventory</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-blue, #2962FF)' }}>60%</span>
                  </div>
                  <div className="ds-progress-linear">
                    <div className="ds-progress-linear-fill" style={{ width: '60%' }} />
                  </div>
                </div>
              ),
            },
            {
              label: '100% Complete',
              tag: 'ProgressBar',
              content: (
                <div style={{ width: '100%', maxWidth: 360 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--av-on-surface, #1C1B1F)' }}>Export complete</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-teal, #009B86)' }}>100%</span>
                  </div>
                  <div className="ds-progress-linear">
                    <div className="ds-progress-linear-fill" style={{ width: '100%', background: 'var(--av-teal, #009B86)' }} />
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Linear Animated ── */}
      <SubSection
        title="Linear Animated"
        description="A live progress bar that updates in real time. The fill animates smoothly between percentage values."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Animated Progress',
              tag: 'Live',
              content: (
                <div style={{ width: '100%', maxWidth: 400 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--av-on-surface, #1C1B1F)' }}>Uploading items...</span>
                    <span style={{ fontSize: 13, fontFamily: 'var(--av-font-mono, monospace)', color: 'var(--av-blue, #2962FF)' }}>{progress}%</span>
                  </div>
                  <div className="ds-progress-linear">
                    <div className="ds-progress-linear-fill" style={{ width: `${progress}%`, transition: 'width 100ms linear' }} />
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Linear Indeterminate ── */}
      <SubSection
        title="Linear Indeterminate"
        description="An animating bar that moves continuously. Use when the completion time is unknown, such as waiting for a server response or loading data."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Indeterminate',
              tag: 'Loading',
              content: (
                <div style={{ width: '100%', maxWidth: 400 }}>
                  <div style={{ fontSize: 13, color: 'var(--av-on-surface-variant, #49454F)', marginBottom: 8 }}>Loading reservations...</div>
                  <div className="ds-progress-linear" style={{ overflow: 'hidden' }}>
                    <div style={{
                      width: '30%',
                      height: '100%',
                      background: 'var(--av-blue, #2962FF)',
                      borderRadius: 2,
                      animation: 'progress-indeterminate 1.5s ease-in-out infinite',
                    }} />
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Circular Determinate ── */}
      <SubSection
        title="Circular Determinate"
        description="A percentage ring that fills clockwise. Useful in compact spaces or overlaid on content to show completion status."
      >
        <ComponentShowcase items={[
          {
            label: '25%',
            tag: 'Ring',
            content: (
              <div style={{ position: 'relative', width: 48, height: 48 }}>
                <svg width={48} height={48} viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={24} cy={24} r={20} fill="none" stroke="var(--av-outline-variant, #CAC4D0)" strokeWidth={4} />
                  <circle cx={24} cy={24} r={20} fill="none" stroke="var(--av-blue, #2962FF)" strokeWidth={4}
                    strokeDasharray={`${2 * Math.PI * 20 * 0.25} ${2 * Math.PI * 20 * 0.75}`}
                    strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--av-on-surface, #1C1B1F)' }}>25%</div>
              </div>
            ),
          },
          {
            label: '60%',
            tag: 'Ring',
            content: (
              <div style={{ position: 'relative', width: 48, height: 48 }}>
                <svg width={48} height={48} viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={24} cy={24} r={20} fill="none" stroke="var(--av-outline-variant, #CAC4D0)" strokeWidth={4} />
                  <circle cx={24} cy={24} r={20} fill="none" stroke="var(--av-teal, #009B86)" strokeWidth={4}
                    strokeDasharray={`${2 * Math.PI * 20 * 0.6} ${2 * Math.PI * 20 * 0.4}`}
                    strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--av-on-surface, #1C1B1F)' }}>60%</div>
              </div>
            ),
          },
          {
            label: '90%',
            tag: 'Ring',
            content: (
              <div style={{ position: 'relative', width: 48, height: 48 }}>
                <svg width={48} height={48} viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={24} cy={24} r={20} fill="none" stroke="var(--av-outline-variant, #CAC4D0)" strokeWidth={4} />
                  <circle cx={24} cy={24} r={20} fill="none" stroke="var(--av-navy, #0A1F44)" strokeWidth={4}
                    strokeDasharray={`${2 * Math.PI * 20 * 0.9} ${2 * Math.PI * 20 * 0.1}`}
                    strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--av-on-surface, #1C1B1F)' }}>90%</div>
              </div>
            ),
          },
        ]} />
      </SubSection>

      {/* ── Circular Indeterminate ── */}
      <SubSection
        title="Circular Indeterminate"
        description="A spinning ring for loading states in compact areas. Supports multiple sizes and colors."
      >
        <ComponentShowcase items={[
          {
            label: 'Default',
            tag: 'Spinner',
            content: <div className="ds-progress-circular" />,
          },
          {
            label: 'Small',
            tag: 'Spinner',
            content: <div className="ds-progress-circular" style={{ width: 24, height: 24, borderWidth: 2 }} />,
          },
          {
            label: 'Large',
            tag: 'Spinner',
            content: <div className="ds-progress-circular" style={{ width: 56, height: 56, borderWidth: 4 }} />,
          },
        ]} />
      </SubSection>

      {/* ── Color Variants ── */}
      <SubSection
        title="Color Variants"
        description="Progress indicators support brand colors for different contexts. Blue is the default, teal for success/completion, and navy for branded operations."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Color Variants',
              tag: 'Themed',
              content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 400 }}>
                  {[
                    { label: 'Blue (Default)', color: 'var(--av-blue, #2962FF)', bg: 'rgba(41,98,255,0.12)' },
                    { label: 'Teal', color: 'var(--av-teal, #009B86)', bg: 'rgba(0,155,134,0.12)' },
                    { label: 'Navy', color: 'var(--av-navy, #0A1F44)', bg: 'rgba(10,31,68,0.10)' },
                  ].map(v => (
                    <div key={v.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: 'var(--av-on-surface-variant, #49454F)' }}>{v.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: v.color }}>60%</span>
                      </div>
                      <div style={{ ...linearTrackStyle, background: v.bg }}>
                        <div style={{ width: '60%', height: '100%', background: v.color, borderRadius: 2, transition: 'width 300ms ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              label: 'Colored Spinners',
              tag: 'Themed',
              content: (
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div className="ds-progress-circular" />
                    <span style={{ fontSize: 11, color: 'var(--av-on-surface-variant, #49454F)' }}>Blue</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div className="ds-progress-circular" style={{ borderTopColor: 'var(--av-teal, #009B86)', borderColor: 'rgba(0,155,134,0.15)' }} />
                    <span style={{ fontSize: 11, color: 'var(--av-on-surface-variant, #49454F)' }}>Teal</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div className="ds-progress-circular" style={{ borderTopColor: 'var(--av-navy, #0A1F44)', borderColor: 'rgba(10,31,68,0.1)' }} />
                    <span style={{ fontSize: 11, color: 'var(--av-on-surface-variant, #49454F)' }}>Navy</span>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── With Labels ── */}
      <SubSection
        title="With Percentage Label"
        description="Display the percentage value alongside the progress indicator for explicit feedback. Place the label inline with the track or inside a circular indicator."
      >
        <ComponentShowcase items={[
          {
            label: 'Linear + Label',
            tag: 'Pattern',
            content: (
              <div style={{ width: 200 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--av-on-surface-variant, #49454F)' }}>Processing</span>
                  <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--av-font-mono, monospace)', color: 'var(--av-blue, #2962FF)' }}>72%</span>
                </div>
                <div className="ds-progress-linear">
                  <div className="ds-progress-linear-fill" style={{ width: '72%' }} />
                </div>
              </div>
            ),
          },
          {
            label: 'Circular + Label',
            tag: 'Pattern',
            content: (
              <div style={{ position: 'relative', width: 64, height: 64 }}>
                <svg width={64} height={64} viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={32} cy={32} r={28} fill="none" stroke="var(--av-outline-variant, #CAC4D0)" strokeWidth={4} />
                  <circle cx={32} cy={32} r={28} fill="none" stroke="var(--av-blue, #2962FF)" strokeWidth={4}
                    strokeDasharray={`${2 * Math.PI * 28 * 0.72} ${2 * Math.PI * 28 * 0.28}`}
                    strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: 'var(--av-on-surface, #1C1B1F)' }}>72%</div>
              </div>
            ),
          },
        ]} />
      </SubSection>

      {/* ── Do & Don't ── */}
      <SubSection title="Do & Don't">
        <DoDontGrid items={[
          {
            type: 'do',
            content: (
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: 13, marginBottom: 4 }}>Uploading equipment list...</div>
                <div style={{ ...linearTrackStyle, background: 'rgba(41,98,255,0.12)' }}>
                  <div style={{ width: '60%', height: '100%', background: 'var(--av-blue)', borderRadius: 2 }} />
                </div>
              </div>
            ),
            caption: 'Use determinate progress when you can calculate the percentage. It gives users predictable expectations.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: 13, marginBottom: 4 }}>Uploading equipment list...</div>
                <div style={{ ...linearTrackStyle, background: 'rgba(41,98,255,0.12)', overflow: 'hidden' }}>
                  <div style={{ width: '30%', height: '100%', background: 'var(--av-blue)', borderRadius: 2, animation: 'progress-indeterminate 1.5s ease infinite' }} />
                </div>
              </div>
            ),
            caption: "Don't use indeterminate when progress is measurable. Users prefer knowing how long they have to wait.",
          },
          {
            type: 'do',
            content: (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="ds-progress-circular" style={{ width: 24, height: 24, borderWidth: 2 }} />
                <span style={{ fontSize: 13 }}>Loading...</span>
              </div>
            ),
            caption: 'Add descriptive text alongside progress indicators to explain what is happening.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="ds-progress-circular" style={{ width: 24, height: 24, borderWidth: 2 }} />
              </div>
            ),
            caption: "Don't show a spinner without context. Users may not know what is loading or if the app is stuck.",
          },
        ]} />
      </SubSection>

      {/* ── Properties Table ── */}
      <PropsTable
          componentName="ProgressBar / ProgressRing"
          props={[
            {
              name: 'Value',
              type: 'double',
              default: '0',
              description: 'The current progress value between Minimum and Maximum.',
            },
            {
              name: 'IsIndeterminate',
              type: 'bool',
              default: 'false',
              description: 'When true, displays an indeterminate animation instead of a value-based fill.',
            },
            {
              name: 'Maximum',
              type: 'double',
              default: '100',
              description: 'The maximum progress value representing 100% completion.',
            },
            {
              name: 'Minimum',
              type: 'double',
              default: '0',
              description: 'The minimum progress value representing 0% completion.',
            },
            {
              name: 'ShowPaused',
              type: 'bool',
              default: 'false',
              description: 'Displays a paused visual state (muted color, no animation).',
            },
            {
              name: 'ShowError',
              type: 'bool',
              default: 'false',
              description: 'Displays an error visual state (red fill).',
            },
            {
              name: 'Foreground',
              type: 'Brush',
              default: 'PrimaryBrush',
              description: 'The fill color of the progress indicator.',
            },
            {
              name: 'Background',
              type: 'Brush',
              default: 'SurfaceVariantBrush',
              description: 'The track color behind the progress fill.',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Determinate Progress Bar -->
<ProgressBar Value="60" Maximum="100" />

<!-- Determinate with Label -->
<StackPanel Spacing="4">
  <Grid>
    <TextBlock Text="Uploading equipment..."
               Style="{StaticResource BodySmall}" />
    <TextBlock Text="60%"
               HorizontalAlignment="Right"
               Foreground="{StaticResource QuantifyBlueBrush}"
               Style="{StaticResource LabelMedium}" />
  </Grid>
  <ProgressBar Value="60" Maximum="100" />
</StackPanel>

<!-- Indeterminate Progress Bar -->
<ProgressBar IsIndeterminate="True" />

<!-- Circular Progress Ring -->
<ProgressRing IsActive="True" />

<!-- Determinate Progress Ring -->
<ProgressRing Value="75" Maximum="100" />

<!-- Small Circular Spinner -->
<ProgressRing IsActive="True"
              Width="24" Height="24" />

<!-- Color Variants -->
<ProgressBar Value="60"
             Foreground="{StaticResource QuantifyTealBrush}" />

<ProgressBar Value="80"
             Foreground="{StaticResource QuantifyNavyBrush}" />

<!-- Progress with Error State -->
<ProgressBar Value="45"
             ShowError="True" />`}
        />
      </SubSection>
    </section>
  )
}
