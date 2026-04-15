import { useState } from 'react'
import { Menu, MapPin, ChevronRight, Plus, Inbox } from 'lucide-react'
import { Shipment, ShipmentStatus, totalExpected, statusLabel, statusColors } from '../data'

const FILTERS: { key: ShipmentStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'NEEDS-COUNT', label: 'Needs count' },
  { key: 'PRE-RETURN', label: 'Pre-Return' },
  { key: 'RESERVED', label: 'Reserved' },
  { key: 'IN-TRANSIT', label: 'In Transit' },
]

interface Props {
  shipments: Shipment[]
  selectedLocation: string
  onSelect: (id: string) => void
  onOpenMenu: () => void
  onOpenProfile: () => void
  onOpenLocation: () => void
  onOpenCreateNew: () => void
}

export default function ShipmentList({ shipments, selectedLocation, onSelect, onOpenMenu, onOpenProfile, onOpenLocation, onOpenCreateNew }: Props) {
  const [filter, setFilter] = useState<ShipmentStatus | 'all'>('all')

  const needsCount = shipments.filter(s => s.status === 'NEEDS-COUNT' || s.status === 'PRE-RETURN').length

  const filtered = filter === 'all'
    ? shipments
    : filter === 'NEEDS-COUNT'
      ? shipments.filter(s => s.status === 'NEEDS-COUNT')
      : shipments.filter(s => s.status === filter)

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Blue Header */}
      <div className="bg-[#1E3FFF] px-5 pt-4 pb-5">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onOpenMenu} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select pressable">
            <Menu size={18} color="#fff" strokeWidth={2} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-white" />
              <span className="text-white text-xs font-semibold">Synced 11:05</span>
            </div>
            <button onClick={onOpenProfile} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center no-select pressable">
              <span className="text-white text-xs font-bold">JD</span>
            </button>
          </div>
        </div>
        <h1 className="text-white text-2xl font-semibold">Shipments</h1>
        <p className="text-white/70 text-sm mt-0.5">{shipments.length} shipments · Apr 7 – Apr 28</p>
      </div>

      {/* Location Bar */}
      <button
        onClick={onOpenLocation}
        className="bg-white flex items-center gap-3 px-5 py-3.5 w-full no-select pressable"
      >
        <MapPin size={16} color="#1E3FFF" strokeWidth={2} />
        <div className="flex-1 text-left">
          <p className="text-[#0A0A0A] text-sm font-semibold leading-none">{selectedLocation.replace(' Branch Office', '').replace(' Branch', '')}</p>
          <p className="text-[#737373] text-xs mt-0.5">Branch Office · tap to change</p>
        </div>
        <ChevronRight size={16} color="#737373" strokeWidth={2} />
      </button>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Filter chips */}
      <div className="bg-white px-5 py-3 overflow-x-auto">
        <div className="flex gap-2 w-max">
          {FILTERS.map(f => {
            const active = filter === f.key
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold no-select transition-colors flex-shrink-0"
                style={{
                  backgroundColor: active ? '#1E3FFF' : '#F5F5F5',
                  color: active ? '#FFFFFF' : '#525252',
                }}
              >
                {f.label}
                {f.key === 'NEEDS-COUNT' && needsCount > 0 && (
                  <span
                    className="text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: active ? 'rgba(255,255,255,0.3)' : '#1E3FFF', color: '#fff' }}
                  >
                    {needsCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Shipment list */}
      <div className="flex flex-col gap-3 p-4 pb-24">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-3">
              <Inbox size={24} color="#A3A3A3" strokeWidth={1.5} />
            </div>
            <p className="text-[#0A0A0A] text-base font-semibold">No shipments</p>
            <p className="text-[#737373] text-sm mt-1">Nothing matching this filter.</p>
          </div>
        ) : (
          filtered.map((s, idx) => (
            <ShipmentCard
              key={s.id}
              shipment={s}
              idx={idx}
              onTap={() => onSelect(s.id)}
            />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={onOpenCreateNew}
        className="fixed bottom-8 right-6 md:absolute w-14 h-14 rounded-full bg-[#1E3FFF] shadow-lg flex items-center justify-center no-select pressable z-10"
        style={{ boxShadow: '0 4px 20px rgba(30,63,255,0.4)' }}
      >
        <Plus size={24} color="#fff" strokeWidth={2.5} />
      </button>
    </div>
  )
}

function ShipmentCard({ shipment, idx, onTap }: { shipment: Shipment; idx: number; onTap: () => void }) {
  const colors = statusColors(shipment.status)
  const label = statusLabel(shipment.status)
  const total = totalExpected(shipment.items)
  const isDiscrepancy = shipment.status === 'DISCREPANCY'
  const needsCount = shipment.status === 'NEEDS-COUNT' || shipment.status === 'PRE-RETURN'

  return (
    <button
      onClick={onTap}
      className="stagger-item w-full bg-white rounded-2xl p-4 text-left no-select active:scale-[0.98] transition-transform"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)', animationDelay: `${idx * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Top row: ID + badge */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[#737373] text-xs font-medium">{shipment.id}</span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {label}
            </span>
          </div>

          {/* Job site */}
          <p className="text-[#0A0A0A] text-base font-semibold leading-snug">{shipment.jobsiteId} — {shipment.jobsite}</p>
          <p className="text-[#737373] text-sm mt-0.5">{shipment.location}</p>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-[#737373] text-xs">Planned {shipment.date.replace(/\w+, /, '')}</span>
            {total > 0 && <span className="text-[#737373] text-xs">{total} pcs</span>}
            {shipment.items.length === 0 && <span className="text-[#737373] text-xs">BOM blank</span>}
          </div>

          {/* Sub-label */}
          {needsCount && (
            <p className="text-[#1E3FFF] text-xs font-semibold mt-2">Needs your count</p>
          )}
          {isDiscrepancy && shipment.discrepancy && (
            <p className="text-[#DC2626] text-xs font-semibold mt-2">
              Count mismatch (−{shipment.discrepancy.expected - shipment.discrepancy.counted}) · Resolve on desktop
            </p>
          )}
          {shipment.status === 'IN-TRANSIT' && (
            <p className="text-[#0369A1] text-xs font-semibold mt-2">En route to job site</p>
          )}
        </div>

        {/* Right action */}
        <div className="flex-shrink-0 mt-0.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.bg }}
          >
            <ChevronRight size={13} color={colors.text} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </button>
  )
}
