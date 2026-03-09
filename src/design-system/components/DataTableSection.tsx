import React, { useState } from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import ComponentShowcase from '../shared/ComponentShowcase'
import PropsTable from '../shared/PropsTable'
import CodeSnippet from '../shared/CodeSnippet'
import DoDontGrid from '../shared/DoDontGrid'
import { Add, Edit, Delete, Refresh, Check } from '../shared/Icons'

/* ── Sort icon ── */
function SortIcon({ dir }: { dir: 'asc' | 'desc' | null }) {
  if (!dir) return null
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 4, transform: dir === 'desc' ? 'rotate(180deg)' : 'none' }}>
      <path d="M7 14l5-5 5 5z" />
    </svg>
  )
}

/* ── CRUD Toolbar ── */
function CrudToolbar({ onAdd, onEdit, onDelete, onRefresh }: {
  onAdd?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onRefresh?: () => void
}) {
  const btn: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    fontFamily: 'var(--av-font-primary, Inter, sans-serif)',
    background: 'var(--av-surface, #FAFBFF)',
    border: '1px solid var(--av-outline-variant, #CAC4D0)',
    cursor: 'pointer',
    color: 'var(--av-on-surface, #1C1B1F)',
  }

  return (
    <div className="ds-data-table-toolbar">
      <button style={btn} onClick={onAdd}><Add size={16} /> Add</button>
      <button style={btn} onClick={onEdit}><Edit size={16} /> Edit</button>
      <button style={btn} onClick={onDelete}><Delete size={16} /> Delete</button>
      <button style={btn} onClick={onRefresh}><Refresh size={16} /> Refresh</button>
    </div>
  )
}

/* ── Sample data ── */
interface EquipmentRow {
  id: string
  name: string
  quantity: number
  reserved: number
  available: number
  status: 'Available' | 'Low stock' | 'Out of stock'
}

const SAMPLE_DATA: EquipmentRow[] = [
  { id: 'EQ-001', name: 'Scaffold frames (5\'x5\')', quantity: 1200, reserved: 450, available: 750, status: 'Available' },
  { id: 'EQ-002', name: 'Cross braces', quantity: 800, reserved: 320, available: 480, status: 'Available' },
  { id: 'EQ-003', name: 'Base plates', quantity: 200, reserved: 185, available: 15, status: 'Low stock' },
  { id: 'EQ-004', name: 'Guardrails (6\')', quantity: 600, reserved: 280, available: 320, status: 'Available' },
  { id: 'EQ-005', name: 'Ladder frames', quantity: 50, reserved: 50, available: 0, status: 'Out of stock' },
]

type SortKey = 'name' | 'quantity' | 'reserved' | 'available'

/* ── Interactive Data Table ── */
function InteractiveDataTable() {
  const [data, setData] = useState(SAMPLE_DATA)
  const [selectedId, setSelectedId] = useState<string | null>('EQ-001')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sorted = [...data].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    }
    return sortDir === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal))
  })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const handleDelete = () => {
    if (!selectedId) return
    const idx = sorted.findIndex(r => r.id === selectedId)
    const newData = data.filter(r => r.id !== selectedId)
    setData(newData)
    // Select next row or previous if last
    const newSorted = [...newData].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }
      return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal))
    })
    if (newSorted.length > 0) {
      const nextIdx = Math.min(idx, newSorted.length - 1)
      setSelectedId(newSorted[nextIdx].id)
    } else {
      setSelectedId(null)
    }
  }

  const handleRefresh = () => {
    setData(SAMPLE_DATA)
    setSelectedId('EQ-001')
  }

  const statusColor = (s: string) => {
    if (s === 'Available') return { bg: 'rgba(0,155,134,0.1)', color: 'var(--av-success, #009B86)' }
    if (s === 'Low stock') return { bg: 'rgba(249,168,37,0.1)', color: 'var(--av-warning, #F9A825)' }
    return { bg: 'rgba(211,47,47,0.1)', color: 'var(--av-error, #D32F2F)' }
  }

  const thStyle = (key: SortKey): React.CSSProperties => ({
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    fontWeight: sortKey === key ? 700 : 600,
    color: sortKey === key ? 'var(--av-blue, #2962FF)' : 'var(--av-on-surface-variant)',
  })

  return (
    <div className="ds-data-table">
      <CrudToolbar onDelete={handleDelete} onRefresh={handleRefresh} />
      <div className="ds-data-table-container">
        {/* Header */}
        <div className="ds-data-table-header">
          <div style={{ width: 40 }} />
          <div style={{ flex: 2, ...thStyle('name') }} onClick={() => toggleSort('name')}>
            Equipment <SortIcon dir={sortKey === 'name' ? sortDir : null} />
          </div>
          <div style={{ flex: 1, ...thStyle('quantity'), justifyContent: 'flex-end' }} onClick={() => toggleSort('quantity')}>
            Total <SortIcon dir={sortKey === 'quantity' ? sortDir : null} />
          </div>
          <div style={{ flex: 1, ...thStyle('reserved'), justifyContent: 'flex-end' }} onClick={() => toggleSort('reserved')}>
            Reserved <SortIcon dir={sortKey === 'reserved' ? sortDir : null} />
          </div>
          <div style={{ flex: 1, ...thStyle('available'), justifyContent: 'flex-end' }} onClick={() => toggleSort('available')}>
            Available <SortIcon dir={sortKey === 'available' ? sortDir : null} />
          </div>
          <div style={{ width: 90 }}>Status</div>
        </div>

        {/* Rows */}
        {sorted.length === 0 ? (
          <div className="ds-data-table-empty">
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface-variant)', marginBottom: 4 }}>No equipment found</div>
            <div style={{ fontSize: 12, color: 'var(--av-outline)' }}>Click Refresh to reload the data.</div>
          </div>
        ) : (
          sorted.map((row) => {
            const selected = row.id === selectedId
            const sc = statusColor(row.status)
            return (
              <div
                key={row.id}
                className={`ds-data-table-row${selected ? ' selected' : ''}`}
                role="row"
                tabIndex={0}
                aria-selected={selected}
                onClick={() => setSelectedId(row.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedId(row.id) } }}
              >
                <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    border: selected ? 'none' : '2px solid var(--av-outline, #79747E)',
                    background: selected ? 'var(--av-blue, #2962FF)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--av-bg, #fff)',
                  }}>
                    {selected && <Check size={12} />}
                  </div>
                </div>
                <div style={{ flex: 2, fontWeight: 500 }}>{row.name}</div>
                <div style={{ flex: 1, textAlign: 'right', fontFamily: 'var(--av-font-mono)' }}>{row.quantity.toLocaleString()}</div>
                <div style={{ flex: 1, textAlign: 'right', fontFamily: 'var(--av-font-mono)' }}>{row.reserved.toLocaleString()}</div>
                <div style={{ flex: 1, textAlign: 'right', fontFamily: 'var(--av-font-mono)', fontWeight: 600, color: row.available === 0 ? 'var(--av-error)' : undefined }}>{row.available.toLocaleString()}</div>
                <div style={{ width: 90 }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: sc.bg,
                    color: sc.color,
                    whiteSpace: 'nowrap',
                  }}>
                    {row.status}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default function DataTableSection() {
  return (
    <section id="data-tables" className="ds-section">
      <SectionHeader
        label="Component"
        title="Data Tables"
        description="Tabular data display with sortable columns, row selection, and CRUD toolbar. The primary way to browse and manage equipment, reservations, and inventory in Quantify."
      />

      {/* ── Interactive Demo ── */}
      <SubSection
        title="Interactive Data Table"
        description="Click column headers to sort. Click rows to select. Use the toolbar buttons to interact — Delete removes the selected row (with Avontus selection-after-delete behavior), Refresh resets the data."
      >
        <ComponentShowcase
          fullWidth
          items={[{
            label: 'Equipment inventory',
            tag: 'Interactive',
            content: <InteractiveDataTable />,
          }]}
        />
      </SubSection>

      {/* ── CRUD Toolbar Strip ── */}
      <SubSection
        title="CRUD Toolbar Strip"
        description="Every data table in Quantify includes a toolbar strip with Add, Edit, Delete, and Refresh. Per Avontus convention, all four buttons are always enabled regardless of selection state."
      >
        <ComponentShowcase
          fullWidth
          items={[{
            label: 'Toolbar strip',
            tag: 'Convention',
            content: <CrudToolbar />,
          }]}
        />
      </SubSection>

      {/* ── Empty State ── */}
      <SubSection
        title="Empty State"
        description="When no data matches the current filter or the dataset is empty, show a clear message with guidance. Never display an empty grid with only column headers."
      >
        <ComponentShowcase
          fullWidth
          items={[{
            label: 'No results',
            tag: 'Empty',
            content: (
              <div className="ds-data-table">
                <div className="ds-data-table-container">
                  <div className="ds-data-table-header">
                    <div style={{ width: 40 }} />
                    <div style={{ flex: 2, fontWeight: 600, color: 'var(--av-on-surface-variant)' }}>Equipment</div>
                    <div style={{ flex: 1, fontWeight: 600, color: 'var(--av-on-surface-variant)', textAlign: 'right' }}>Total</div>
                    <div style={{ flex: 1, fontWeight: 600, color: 'var(--av-on-surface-variant)', textAlign: 'right' }}>Reserved</div>
                    <div style={{ flex: 1, fontWeight: 600, color: 'var(--av-on-surface-variant)', textAlign: 'right' }}>Available</div>
                    <div style={{ width: 90, fontWeight: 600, color: 'var(--av-on-surface-variant)' }}>Status</div>
                  </div>
                  <div className="ds-data-table-empty">
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface-variant)', marginBottom: 4 }}>No equipment found</div>
                    <div style={{ fontSize: 12, color: 'var(--av-outline)' }}>Try adjusting your search or filter criteria.</div>
                  </div>
                </div>
              </div>
            ),
          }]}
        />
      </SubSection>

      {/* ── Do & Don't ── */}
      <SubSection title="Do & Don't">
        <DoDontGrid items={[
          {
            type: 'do',
            content: (
              <div style={{ display: 'flex', gap: 6, fontSize: 13 }}>
                {['Add', 'Edit', 'Delete', 'Refresh'].map(l => (
                  <span key={l} style={{
                    padding: '4px 10px',
                    borderRadius: 4,
                    border: '1px solid var(--av-outline-variant)',
                    background: 'var(--av-surface)',
                    color: 'var(--av-on-surface)',
                  }}>
                    {l}
                  </span>
                ))}
              </div>
            ),
            caption: 'Keep all CRUD buttons always enabled. Show a prompt if the user clicks Edit or Delete with no selection.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ display: 'flex', gap: 6, fontSize: 13 }}>
                {['Add', 'Edit', 'Delete', 'Refresh'].map((l, i) => (
                  <span key={l} style={{
                    padding: '4px 10px',
                    borderRadius: 4,
                    border: '1px solid var(--av-outline-variant)',
                    background: 'var(--av-surface)',
                    color: 'var(--av-on-surface)',
                    opacity: i === 1 || i === 2 ? 0.3 : 1,
                  }}>
                    {l}
                  </span>
                ))}
              </div>
            ),
            caption: 'Never gray out Edit/Delete based on selection. This is a core Avontus convention.',
          },
          {
            type: 'do',
            content: (
              <div style={{ textAlign: 'center', padding: 12, fontSize: 13, color: 'var(--av-on-surface-variant)' }}>
                No equipment found.<br />
                <span style={{ fontSize: 12, color: 'var(--av-outline)' }}>Try adjusting your search.</span>
              </div>
            ),
            caption: 'Show a descriptive empty state with actionable guidance when no data is available.',
          },
          {
            type: 'dont',
            content: (
              <div style={{ fontSize: 13, color: 'var(--av-on-surface-variant)', opacity: 0.5, textAlign: 'center', padding: 12 }}>
                (empty grid with only headers visible)
              </div>
            ),
            caption: 'Never show an empty grid with only column headers. Users think the page is broken.',
          },
        ]} />
      </SubSection>

      {/* ── Properties ── */}
      <PropsTable
        componentName="DataGrid"
        props={[
          { name: 'ItemsSource', type: 'IEnumerable', description: 'The data source for the grid rows.' },
          { name: 'SelectedItem', type: 'object', description: 'The currently selected row object.' },
          { name: 'SelectedIndex', type: 'int', default: '-1', description: 'Index of the selected row. -1 means no selection.' },
          { name: 'CanUserSortColumns', type: 'bool', default: 'true', description: 'Whether column headers are clickable for sorting.' },
          { name: 'CanUserReorderColumns', type: 'bool', default: 'false', description: 'Whether columns can be reordered by dragging.' },
          { name: 'CanUserResizeColumns', type: 'bool', default: 'true', description: 'Whether column widths can be adjusted by dragging.' },
          { name: 'SelectionMode', type: 'DataGridSelectionMode', default: 'Single', description: 'Single or Extended (multi-select with Ctrl/Shift).' },
          { name: 'AutoGenerateColumns', type: 'bool', default: 'true', description: 'Whether columns are auto-generated from the data source properties.' },
          { name: 'IsReadOnly', type: 'bool', default: 'true', description: 'Whether inline cell editing is disabled. Quantify uses dialog-based editing.' },
        ]}
      />

      {/* ── XAML ── */}
      <SubSection title="XAML Usage">
        <CodeSnippet
          code={`<!-- Equipment Data Table with CRUD Toolbar -->
<Grid>
  <Grid.RowDefinitions>
    <RowDefinition Height="Auto" />
    <RowDefinition Height="*" />
  </Grid.RowDefinitions>

  <!-- CRUD Toolbar (always enabled) -->
  <CommandBar Grid.Row="0"
              DefaultLabelPosition="Right">
    <AppBarButton Icon="Add" Label="Add"
                  Command="{Binding AddCommand}" />
    <AppBarButton Icon="Edit" Label="Edit"
                  Command="{Binding EditCommand}" />
    <AppBarButton Icon="Delete" Label="Delete"
                  Command="{Binding DeleteCommand}" />
    <AppBarButton Icon="Refresh" Label="Refresh"
                  Command="{Binding RefreshCommand}" />
  </CommandBar>

  <!-- Data Grid -->
  <controls:DataGrid
      Grid.Row="1"
      ItemsSource="{x:Bind ViewModel.Equipment}"
      SelectedItem="{x:Bind ViewModel.SelectedEquipment, Mode=TwoWay}"
      CanUserSortColumns="True"
      CanUserResizeColumns="True"
      SelectionMode="Single"
      IsReadOnly="True"
      AutoGenerateColumns="False">
    <controls:DataGrid.Columns>
      <controls:DataGridTextColumn
          Header="Equipment"
          Binding="{Binding Name}"
          Width="2*" />
      <controls:DataGridTextColumn
          Header="Total"
          Binding="{Binding Quantity}"
          Width="*" />
      <controls:DataGridTextColumn
          Header="Reserved"
          Binding="{Binding Reserved}"
          Width="*" />
      <controls:DataGridTextColumn
          Header="Available"
          Binding="{Binding Available}"
          Width="*" />
      <controls:DataGridTemplateColumn
          Header="Status"
          Width="100">
        <controls:DataGridTemplateColumn.CellTemplate>
          <DataTemplate>
            <Border Background="{Binding StatusBackground}"
                    CornerRadius="4"
                    Padding="8,2">
              <TextBlock Text="{Binding Status}"
                         FontSize="11"
                         FontWeight="SemiBold"
                         Foreground="{Binding StatusForeground}" />
            </Border>
          </DataTemplate>
        </controls:DataGridTemplateColumn.CellTemplate>
      </controls:DataGridTemplateColumn>
    </controls:DataGrid.Columns>
  </controls:DataGrid>
</Grid>`}
        />
      </SubSection>
    </section>
  )
}
