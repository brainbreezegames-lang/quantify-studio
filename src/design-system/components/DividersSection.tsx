import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import { Box } from '../shared/Icons'

export default function DividersSection() {
  return (
    <section id="dividers" className="ds-section">
      <SectionHeader
        label="Component"
        title="Dividers"
        description="Subtle separators — full-width, inset, or middle — for visual structure."
      />

      {/* ── Full-Width Divider ── */}
      <SubSection
        title="Full-Width Divider"
        description="Full-width dividers span the entire width of their container. Use between major sections or groups of content."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Full-Width',
              tag: 'Default',
              content: (
                <div style={{ width: '100%', maxWidth: 400 }}>
                  <div style={{ padding: '12px 0', fontSize: 14, color: 'var(--av-on-surface, #1C1B1F)' }}>Section A: Reservation Details</div>
                  <div className="ds-divider" />
                  <div style={{ padding: '12px 0', fontSize: 14, color: 'var(--av-on-surface, #1C1B1F)' }}>Section B: Equipment List</div>
                  <div className="ds-divider" />
                  <div style={{ padding: '12px 0', fontSize: 14, color: 'var(--av-on-surface, #1C1B1F)' }}>Section C: Shipping Information</div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Inset Divider ── */}
      <SubSection
        title="Inset Divider"
        description="Inset dividers have a left margin that aligns with the text content, creating visual continuity with leading elements like icons or avatars. Use within lists that have leading elements."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Inset (Left)',
              tag: 'List Pattern',
              content: (
                <div style={{ width: '100%', maxWidth: 400 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--av-blue, #2962FF)', color: 'var(--av-bg, #fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Box size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)' }}>Scaffolding Frame</div>
                      <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant, #49454F)' }}>Heavy equipment</div>
                    </div>
                  </div>
                  <div className="ds-divider" style={{ marginLeft: 56 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--av-teal, #009B86)', color: 'var(--av-bg, #fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Box size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)' }}>Safety Netting</div>
                      <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant, #49454F)' }}>Safety gear</div>
                    </div>
                  </div>
                  <div className="ds-divider" style={{ marginLeft: 56 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--av-navy, #0A1F44)', color: 'var(--av-bg, #fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Box size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)' }}>Aluminum Plank</div>
                      <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant, #49454F)' }}>Accessories</div>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Middle Divider ── */}
      <SubSection
        title="Middle Divider"
        description="Middle dividers have margins on both sides. Use within card content or between form sections where full-width separation feels too heavy."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Middle Divider',
              tag: 'Padded',
              content: (
                <div style={{ width: '100%', maxWidth: 400, border: '1px solid var(--av-outline-variant, #CAC4D0)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)' }}>Reservation Summary</div>
                    <div style={{ fontSize: 13, color: 'var(--av-on-surface-variant, #49454F)', marginTop: 4 }}>RES-2024-0847</div>
                  </div>
                  <div className="ds-divider" style={{ marginLeft: 16, marginRight: 16 }} />
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)' }}>Equipment Count</div>
                    <div style={{ fontSize: 13, color: 'var(--av-on-surface-variant, #49454F)', marginTop: 4 }}>24 items across 3 categories</div>
                  </div>
                  <div className="ds-divider" style={{ marginLeft: 16, marginRight: 16 }} />
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface, #1C1B1F)' }}>Ship Date</div>
                    <div style={{ fontSize: 13, color: 'var(--av-on-surface-variant, #49454F)', marginTop: 4 }}>March 15, 2024</div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Vertical Divider ── */}
      <SubSection
        title="Vertical Divider"
        description="Vertical dividers separate horizontally-arranged content such as toolbar actions, metadata pairs, or inline stats."
      >
        <ComponentShowcase items={[
          {
            label: 'Vertical Divider',
            tag: 'Inline',
            content: (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--av-on-surface, #1C1B1F)' }}>24</div>
                  <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant, #49454F)' }}>Items</div>
                </div>
                <div style={{ width: 1, height: 40, background: 'var(--av-outline-variant, #CAC4D0)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--av-on-surface, #1C1B1F)' }}>3</div>
                  <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant, #49454F)' }}>Categories</div>
                </div>
                <div style={{ width: 1, height: 40, background: 'var(--av-outline-variant, #CAC4D0)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--av-on-surface, #1C1B1F)' }}>$12.4k</div>
                  <div style={{ fontSize: 12, color: 'var(--av-on-surface-variant, #49454F)' }}>Value</div>
                </div>
              </div>
            ),
          },
          {
            label: 'Toolbar Divider',
            tag: 'Actions',
            content: (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button className="ds-btn ds-btn-text" style={{ fontSize: 13 }}>Edit</button>
                <div style={{ width: 1, height: 24, background: 'var(--av-outline-variant, #CAC4D0)' }} />
                <button className="ds-btn ds-btn-text" style={{ fontSize: 13 }}>Duplicate</button>
                <div style={{ width: 1, height: 24, background: 'var(--av-outline-variant, #CAC4D0)' }} />
                <button className="ds-btn ds-btn-text" style={{ fontSize: 13, color: 'var(--av-error, #D32F2F)' }}>Delete</button>
              </div>
            ),
          },
        ]} />
      </SubSection>

      {/* ── In Context: Between Sections ── */}
      <SubSection
        title="In Context"
        description="Dividers are most effective when used consistently within a specific layout pattern. Here are common usage contexts in Quantify."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Form Sections',
              tag: 'Context',
              content: (
                <div style={{ width: '100%', maxWidth: 400 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--av-on-surface-variant, #49454F)', marginBottom: 8 }}>Project Info</div>
                  <div style={{ fontSize: 14, color: 'var(--av-on-surface, #1C1B1F)', marginBottom: 4 }}>Downtown Office Tower</div>
                  <div style={{ fontSize: 13, color: 'var(--av-on-surface-variant, #49454F)', marginBottom: 16 }}>1234 Main Street, Seattle WA</div>
                  <div className="ds-divider" />
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--av-on-surface-variant, #49454F)', marginBottom: 8 }}>Schedule</div>
                    <div style={{ fontSize: 14, color: 'var(--av-on-surface, #1C1B1F)', marginBottom: 4 }}>Mar 15 - Apr 30, 2024</div>
                    <div style={{ fontSize: 13, color: 'var(--av-on-surface-variant, #49454F)' }}>47 calendar days</div>
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
              <div style={{ width: '100%' }}>
                <div style={{ padding: '8px 0', fontSize: 14 }}>Item A</div>
                <div className="ds-divider" />
                <div style={{ padding: '8px 0', fontSize: 14 }}>Item B</div>
                <div className="ds-divider" />
                <div style={{ padding: '8px 0', fontSize: 14 }}>Item C</div>
              </div>
            ),
            caption: 'Use dividers consistently between all items in a list or section group.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ width: '100%' }}>
                <div style={{ padding: '8px 0', fontSize: 14 }}>Item A</div>
                <div className="ds-divider" />
                <div style={{ padding: '8px 0', fontSize: 14 }}>Item B</div>
                <div style={{ padding: '8px 0', fontSize: 14 }}>Item C</div>
                <div className="ds-divider" />
                <div style={{ padding: '8px 0', fontSize: 14 }}>Item D</div>
              </div>
            ),
            caption: "Don't use dividers inconsistently. Either separate all items or none.",
          },
          {
            type: 'do',
            content: (
              <div style={{ width: '100%' }}>
                <div style={{ padding: '8px 0', fontSize: 14 }}>Section content here</div>
                <div className="ds-divider" style={{ margin: '8px 0' }} />
                <div style={{ padding: '8px 0', fontSize: 14 }}>Next section content</div>
              </div>
            ),
            caption: 'Add vertical spacing around dividers between major sections for breathing room.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ width: '100%' }}>
                <div className="ds-divider" />
                <div className="ds-divider" style={{ marginTop: 2 }} />
                <div style={{ padding: '8px 0', fontSize: 14 }}>Content</div>
                <div className="ds-divider" />
                <div className="ds-divider" style={{ marginTop: 2 }} />
              </div>
            ),
            caption: "Don't stack multiple dividers. Use a single divider to separate content.",
          },
        ]} />
      </SubSection>

      {/* ── Properties Table ── */}
      <PropsTable
          componentName="Divider (Border)"
          props={[
            {
              name: 'Height',
              type: 'double',
              default: '1',
              description: 'The thickness of the divider line. Standard is 1px.',
            },
            {
              name: 'Background',
              type: 'Brush',
              default: 'OutlineVariantBrush',
              description: 'The color of the divider. Uses the outline variant token by default.',
            },
            {
              name: 'Margin',
              type: 'Thickness',
              default: '0',
              description: 'Controls inset behavior. Use "56,0,0,0" for inset, "16,0" for middle dividers.',
            },
            {
              name: 'Opacity',
              type: 'double',
              default: '1',
              description: 'Visual weight of the divider. Reduce for subtle separations.',
            },
            {
              name: 'Orientation',
              type: 'Orientation',
              default: 'Horizontal',
              description: 'Set to Vertical for vertical dividers. Width should be set to 1 in that case.',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Full-Width Divider -->
<Border Height="1"
        Background="{StaticResource OutlineVariantBrush}" />

<!-- Inset Divider (aligned with list text) -->
<Border Height="1"
        Background="{StaticResource OutlineVariantBrush}"
        Margin="56,0,0,0" />

<!-- Middle Divider (padded both sides) -->
<Border Height="1"
        Background="{StaticResource OutlineVariantBrush}"
        Margin="16,0" />

<!-- Vertical Divider -->
<Border Width="1"
        Background="{StaticResource OutlineVariantBrush}"
        Margin="0,4" />

<!-- Divider Between List Items -->
<ListView ItemsSource="{Binding Equipment}">
  <ListView.ItemTemplate>
    <DataTemplate>
      <StackPanel>
        <Grid Padding="16,12">
          <TextBlock Text="{Binding Name}"
                     Style="{StaticResource BodyLarge}" />
        </Grid>
        <Border Height="1"
                Background="{StaticResource OutlineVariantBrush}"
                Margin="16,0" />
      </StackPanel>
    </DataTemplate>
  </ListView.ItemTemplate>
</ListView>`}
        />
      </SubSection>
    </section>
  )
}
