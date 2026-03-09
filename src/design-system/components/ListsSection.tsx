import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import { ChevronRight, Box, Check } from '../shared/Icons'

export default function ListsSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(1)

  return (
    <section id="lists" className="ds-section">
      <SectionHeader
        label="Component"
        title="Lists"
        description="Vertical content groups with one, two, or three-line items and optional icons."
      />

      {/* ── One-Line List Items ── */}
      <SubSection
        title="One-Line Items"
        description="Single-line list items display a primary text label only. Use when the item name alone is sufficient to identify it."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'One-Line List',
              tag: 'Basic',
              content: (
                <div className="ds-list" style={{ width: '100%', maxWidth: 360 }}>
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Downtown Office Tower</span>
                    </div>
                  </div>
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Harbor Bridge Renovation</span>
                    </div>
                  </div>
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Westside Stadium Expansion</span>
                    </div>
                  </div>
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Airport Terminal C</span>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Two-Line List Items ── */}
      <SubSection
        title="Two-Line Items"
        description="Two-line list items include primary text and a secondary line for supporting information such as dates, status, or identifiers."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Two-Line List',
              tag: 'Standard',
              content: (
                <div className="ds-list" style={{ width: '100%', maxWidth: 360 }}>
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">RES-2024-0847</span>
                      <span className="ds-list-item-secondary">Downtown Office Tower</span>
                    </div>
                  </div>
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">RES-2024-0912</span>
                      <span className="ds-list-item-secondary">Harbor Bridge Renovation</span>
                    </div>
                  </div>
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">RES-2024-1033</span>
                      <span className="ds-list-item-secondary">Westside Stadium Expansion</span>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Three-Line List Items ── */}
      <SubSection
        title="Three-Line Items"
        description="Three-line list items add a tertiary line for additional context such as dates, counts, or descriptions. Useful for richer data previews."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Three-Line List',
              tag: 'Extended',
              content: (
                <div className="ds-list" style={{ width: '100%', maxWidth: 400 }}>
                  <div className="ds-list-item" style={{ alignItems: 'flex-start' }}>
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">RES-2024-0847</span>
                      <span className="ds-list-item-secondary">Downtown Office Tower</span>
                      <span className="ds-list-item-secondary" style={{ fontSize: 12, color: 'var(--av-on-surface-variant, #49454F)' }}>Ship date: Mar 15, 2024 &middot; 24 items</span>
                    </div>
                  </div>
                  <div className="ds-divider" />
                  <div className="ds-list-item" style={{ alignItems: 'flex-start' }}>
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">RES-2024-0912</span>
                      <span className="ds-list-item-secondary">Harbor Bridge Renovation</span>
                      <span className="ds-list-item-secondary" style={{ fontSize: 12, color: 'var(--av-on-surface-variant, #49454F)' }}>Ship date: Mar 22, 2024 &middot; 18 items</span>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── With Leading Icons ── */}
      <SubSection
        title="With Leading Icons"
        description="Leading icons help users quickly identify item type or category. Use colored circles with icons for visual distinction."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Icon List',
              tag: 'Leading',
              content: (
                <div className="ds-list" style={{ width: '100%', maxWidth: 400 }}>
                  <div className="ds-list-item">
                    <div className="ds-list-item-icon" style={{ background: 'var(--av-blue, #2962FF)', color: 'var(--av-bg, #fff)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Box size={20} />
                    </div>
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Scaffolding Frame</span>
                      <span className="ds-list-item-secondary">Heavy equipment &middot; 120 available</span>
                    </div>
                  </div>
                  <div className="ds-list-item">
                    <div className="ds-list-item-icon" style={{ background: 'var(--av-teal, #009B86)', color: 'var(--av-bg, #fff)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Box size={20} />
                    </div>
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Safety Netting</span>
                      <span className="ds-list-item-secondary">Safety &middot; 340 available</span>
                    </div>
                  </div>
                  <div className="ds-list-item">
                    <div className="ds-list-item-icon" style={{ background: 'var(--av-navy, #0A1F44)', color: 'var(--av-bg, #fff)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Box size={20} />
                    </div>
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Aluminum Plank</span>
                      <span className="ds-list-item-secondary">Accessories &middot; 85 available</span>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── With Trailing Elements ── */}
      <SubSection
        title="With Trailing Elements"
        description="Trailing elements provide supplementary actions or information. Use chevrons for navigation, switches for toggles, checkboxes for selection, and text for metadata."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Chevron Trailing',
              tag: 'Navigation',
              content: (
                <div className="ds-list" style={{ width: '100%', maxWidth: 360 }}>
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Project Details</span>
                      <span className="ds-list-item-secondary">Downtown Office Tower</span>
                    </div>
                    <div className="ds-list-item-trailing" style={{ color: 'var(--av-on-surface-variant, #49454F)' }}>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Equipment List</span>
                      <span className="ds-list-item-secondary">24 items assigned</span>
                    </div>
                    <div className="ds-list-item-trailing" style={{ color: 'var(--av-on-surface-variant, #49454F)' }}>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              ),
            },
            {
              label: 'Switch Trailing',
              tag: 'Toggle',
              content: (
                <div className="ds-list" style={{ width: '100%', maxWidth: 360 }}>
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Email Notifications</span>
                    </div>
                    <div className="ds-list-item-trailing">
                      <div style={{ width: 44, height: 24, borderRadius: 12, background: 'var(--av-blue, #2962FF)', position: 'relative', cursor: 'pointer' }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--av-bg, #fff)', position: 'absolute', top: 3, right: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                      </div>
                    </div>
                  </div>
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Auto-sync Inventory</span>
                    </div>
                    <div className="ds-list-item-trailing">
                      <div style={{ width: 44, height: 24, borderRadius: 12, background: 'var(--av-outline-variant, #CAC4D0)', position: 'relative', cursor: 'pointer' }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--av-bg, #fff)', position: 'absolute', top: 3, left: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              label: 'Text Trailing',
              tag: 'Metadata',
              content: (
                <div className="ds-list" style={{ width: '100%', maxWidth: 360 }}>
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Scaffolding Frames</span>
                    </div>
                    <div className="ds-list-item-trailing" style={{ fontSize: 14, color: 'var(--av-on-surface-variant, #49454F)' }}>
                      120
                    </div>
                  </div>
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Safety Harnesses</span>
                    </div>
                    <div className="ds-list-item-trailing" style={{ fontSize: 14, color: 'var(--av-on-surface-variant, #49454F)' }}>
                      48
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── With Avatar ── */}
      <SubSection
        title="With Avatar"
        description="Use circular image placeholders for person-related lists such as team members, contacts, or assigned workers."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Avatar List',
              tag: 'People',
              content: (
                <div className="ds-list" style={{ width: '100%', maxWidth: 400 }}>
                  <div className="ds-list-item">
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--av-blue, #2962FF)', color: 'var(--av-bg, #fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16, fontWeight: 600 }}>
                      JD
                    </div>
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">John Dawson</span>
                      <span className="ds-list-item-secondary">Project Manager</span>
                    </div>
                    <div className="ds-list-item-trailing" style={{ color: 'var(--av-on-surface-variant, #49454F)' }}>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                  <div className="ds-list-item">
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--av-teal, #009B86)', color: 'var(--av-bg, #fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16, fontWeight: 600 }}>
                      SM
                    </div>
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Sarah Mitchell</span>
                      <span className="ds-list-item-secondary">Site Supervisor</span>
                    </div>
                    <div className="ds-list-item-trailing" style={{ color: 'var(--av-on-surface-variant, #49454F)' }}>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                  <div className="ds-list-item">
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--av-navy, #0A1F44)', color: 'var(--av-bg, #fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16, fontWeight: 600 }}>
                      RK
                    </div>
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Robert Kim</span>
                      <span className="ds-list-item-secondary">Inventory Coordinator</span>
                    </div>
                    <div className="ds-list-item-trailing" style={{ color: 'var(--av-on-surface-variant, #49454F)' }}>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Dividers ── */}
      <SubSection
        title="Dividers in Lists"
        description="Dividers separate list items visually. Full-width dividers span the entire width. Inset dividers align with the text content, preserving visual continuity with leading elements."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Full-Width Dividers',
              tag: 'Divider',
              content: (
                <div className="ds-list" style={{ width: '100%', maxWidth: 360 }}>
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">RES-2024-0847</span>
                      <span className="ds-list-item-secondary">Downtown Office Tower</span>
                    </div>
                  </div>
                  <div className="ds-divider" />
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">RES-2024-0912</span>
                      <span className="ds-list-item-secondary">Harbor Bridge Renovation</span>
                    </div>
                  </div>
                  <div className="ds-divider" />
                  <div className="ds-list-item">
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">RES-2024-1033</span>
                      <span className="ds-list-item-secondary">Westside Stadium Expansion</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              label: 'Inset Dividers',
              tag: 'Divider',
              content: (
                <div className="ds-list" style={{ width: '100%', maxWidth: 400 }}>
                  <div className="ds-list-item">
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--av-blue, #2962FF)', color: 'var(--av-bg, #fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Box size={20} />
                    </div>
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Scaffolding Frame</span>
                      <span className="ds-list-item-secondary">Heavy equipment</span>
                    </div>
                  </div>
                  <div className="ds-divider" style={{ marginLeft: 56 }} />
                  <div className="ds-list-item">
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--av-teal, #009B86)', color: 'var(--av-bg, #fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Box size={20} />
                    </div>
                    <div className="ds-list-item-content">
                      <span className="ds-list-item-primary">Safety Netting</span>
                      <span className="ds-list-item-secondary">Safety gear</span>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </SubSection>

      {/* ── Selectable List Items ── */}
      <SubSection
        title="Selectable Items"
        description="Selectable list items highlight on tap/click to indicate selection. Use for single-select patterns where the user picks one item from a list."
      >
        <ComponentShowcase
          fullWidth
          items={[
            {
              label: 'Selectable List',
              tag: 'Interactive',
              content: (
                <div className="ds-list" style={{ width: '100%', maxWidth: 360 }}>
                  {['Downtown Office Tower', 'Harbor Bridge Renovation', 'Westside Stadium Expansion', 'Airport Terminal C'].map((name, i) => (
                    <div
                      key={i}
                      className="ds-list-item"
                      onClick={() => setSelectedIndex(i)}
                      style={{
                        cursor: 'pointer',
                        background: selectedIndex === i ? 'var(--av-blue-light, rgba(41,98,255,0.08))' : 'transparent',
                        borderLeft: selectedIndex === i ? '3px solid var(--av-blue, #2962FF)' : '3px solid transparent',
                        transition: 'all 150ms ease',
                      }}
                    >
                      <div className="ds-list-item-content">
                        <span className="ds-list-item-primary" style={{ color: selectedIndex === i ? 'var(--av-blue, #2962FF)' : undefined, fontWeight: selectedIndex === i ? 600 : undefined }}>
                          {name}
                        </span>
                        <span className="ds-list-item-secondary">RES-2024-{String(847 + i * 65).padStart(4, '0')}</span>
                      </div>
                      {selectedIndex === i && (
                        <div className="ds-list-item-trailing" style={{ color: 'var(--av-blue, #2962FF)' }}>
                          <Check size={20} />
                        </div>
                      )}
                    </div>
                  ))}
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
              <div className="ds-list" style={{ width: '100%' }}>
                <div className="ds-list-item">
                  <div className="ds-list-item-content">
                    <span className="ds-list-item-primary">Scaffolding Frame</span>
                    <span className="ds-list-item-secondary">120 available</span>
                  </div>
                  <div className="ds-list-item-trailing" style={{ color: 'var(--av-on-surface-variant)' }}>
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            ),
            caption: 'Keep list items scannable. Use primary text for the main identifier and secondary text for supporting info.',
          },
          {
            type: 'dont',
            content: (
              <div className="ds-list" style={{ width: '100%' }}>
                <div className="ds-list-item" style={{ alignItems: 'flex-start' }}>
                  <div className="ds-list-item-content">
                    <span className="ds-list-item-primary">Scaffolding Frame — Heavy Equipment — Warehouse B — Available for immediate dispatch — Last inspected Jan 2024</span>
                  </div>
                </div>
              </div>
            ),
            caption: "Don't overload list items with too much text. Move detailed info to a detail view.",
          },
          {
            type: 'do',
            content: (
              <div className="ds-list" style={{ width: '100%' }}>
                <div className="ds-list-item">
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--av-blue)', color: 'var(--av-bg, #fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Box size={20} />
                  </div>
                  <div className="ds-list-item-content">
                    <span className="ds-list-item-primary">Scaffolding Frame</span>
                  </div>
                </div>
              </div>
            ),
            caption: 'Use leading icons consistently across all items in a list for visual rhythm.',
          },
          {
            type: 'dont',
            content: (
              <div className="ds-list" style={{ width: '100%' }}>
                <div className="ds-list-item">
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--av-blue)', color: 'var(--av-bg, #fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Box size={20} />
                  </div>
                  <div className="ds-list-item-content">
                    <span className="ds-list-item-primary">Scaffolding</span>
                  </div>
                </div>
                <div className="ds-list-item">
                  <div className="ds-list-item-content">
                    <span className="ds-list-item-primary">Safety Netting</span>
                  </div>
                </div>
              </div>
            ),
            caption: "Don't mix items with and without leading elements. Be consistent within a single list.",
          },
        ]} />
      </SubSection>

      {/* ── Properties Table ── */}
      <PropsTable
          componentName="ListView / ListViewItem"
          props={[
            {
              name: 'ItemsSource',
              type: 'IEnumerable',
              description: 'The data source for the list. Bind to an ObservableCollection for dynamic updates.',
            },
            {
              name: 'ItemTemplate',
              type: 'DataTemplate',
              description: 'Defines the visual layout of each list item.',
            },
            {
              name: 'SelectionMode',
              type: 'ListViewSelectionMode',
              default: 'Single',
              description: 'Selection behavior: None, Single, Multiple, or Extended.',
            },
            {
              name: 'SelectedItem',
              type: 'object',
              description: 'The currently selected item. Supports two-way binding.',
            },
            {
              name: 'ItemContainerStyle',
              type: 'Style',
              description: 'Style applied to each item container for padding, highlight, and spacing.',
            },
            {
              name: 'Header',
              type: 'object',
              description: 'Content displayed above the list items.',
            },
            {
              name: 'Footer',
              type: 'object',
              description: 'Content displayed below the list items.',
            },
            {
              name: 'IsItemClickEnabled',
              type: 'bool',
              default: 'false',
              description: 'When true, list items raise ItemClick events on tap.',
            },
          ]}
        />

      {/* ── XAML Usage ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- One-Line List -->
<ListView ItemsSource="{Binding Projects}"
          SelectionMode="Single">
  <ListView.ItemTemplate>
    <DataTemplate>
      <TextBlock Text="{Binding Name}"
                 Style="{StaticResource BodyLarge}" />
    </DataTemplate>
  </ListView.ItemTemplate>
</ListView>

<!-- Two-Line List with Leading Icon -->
<ListView ItemsSource="{Binding Equipment}">
  <ListView.ItemTemplate>
    <DataTemplate>
      <Grid ColumnDefinitions="Auto,*,Auto" Padding="16,12">
        <Border CornerRadius="20" Width="40" Height="40"
                Background="{StaticResource QuantifyBlueBrush}">
          <SymbolIcon Symbol="Package"
                      Foreground="White" />
        </Border>
        <StackPanel Grid.Column="1" Margin="16,0,0,0"
                    VerticalAlignment="Center">
          <TextBlock Text="{Binding Name}"
                     Style="{StaticResource BodyLarge}" />
          <TextBlock Text="{Binding Category}"
                     Style="{StaticResource BodyMedium}"
                     Foreground="{StaticResource OnSurfaceVariantBrush}" />
        </StackPanel>
        <SymbolIcon Grid.Column="2" Symbol="ChevronRight"
                    VerticalAlignment="Center"
                    Foreground="{StaticResource OnSurfaceVariantBrush}" />
      </Grid>
    </DataTemplate>
  </ListView.ItemTemplate>
</ListView>

<!-- Selectable List with Highlight -->
<ListView ItemsSource="{Binding Reservations}"
          SelectedItem="{Binding SelectedReservation, Mode=TwoWay}"
          SelectionMode="Single"
          IsItemClickEnabled="True"
          ItemClick="OnReservationClick">
  <ListView.ItemTemplate>
    <DataTemplate>
      <StackPanel Padding="16,12">
        <TextBlock Text="{Binding ReservationNumber}"
                   Style="{StaticResource BodyLarge}" />
        <TextBlock Text="{Binding ProjectName}"
                   Style="{StaticResource BodyMedium}"
                   Foreground="{StaticResource OnSurfaceVariantBrush}" />
      </StackPanel>
    </DataTemplate>
  </ListView.ItemTemplate>
</ListView>`}
        />
      </SubSection>
    </section>
  )
}
