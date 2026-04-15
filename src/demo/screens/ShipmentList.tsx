import { useState } from 'react'
import {
  Menu, MapPin, ChevronRight, Plus, Inbox, Wifi, CircleDot,
  Calendar, Package, PackageOpen, AlertTriangle, Truck, ArrowRight,
} from 'lucide-react'
import { Shipment, ShipmentStatus, totalExpected } from '../data'

const FILTERS: { key: ShipmentStatus | 'all'; label: string }[] = [
  { key: 'NEEDS-COUNT', label: 'Needs your count' },
  { key: 'RESERVED', label: 'Reserved' },
  { key: 'PRE-RETURN', label: 'Pre-Return' },
  { key: 'IN-TRANSIT', label: 'In Transit' },
  { key: 'all', label: 'All' },
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
  const [filter, setFilter] = useState<ShipmentStatus | 'all'>('NEEDS-COUNT')

  const counts: Record<string, number> = {
    'NEEDS-COUNT': shipments.filter(s => s.status === 'NEEDS-COUNT' || s.status === 'PRE-RETURN').length,
    'RESERVED': shipments.filter(s => s.status === 'RESERVED').length,
    'PRE-RETURN': shipments.filter(s => s.status === 'PRE-RETURN').length,
    'IN-TRANSIT': shipments.filter(s => s.status === 'IN-TRANSIT').length,
  }

  const filtered = filter === 'all'
    ? shipments
    : filter === 'NEEDS-COUNT'
      ? shipments.filter(s => s.status === 'NEEDS-COUNT' || s.status === 'PRE-RETURN')
      : shipments.filter(s => s.status === filter)

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Blue Header */}
      <div className="bg-[#1E3FFF] px-5 pt-[18px] pb-[22px]">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onOpenMenu} className="w-10 h-10 rounded-full bg-white/[0.12] flex items-center justify-center no-select pressable">
            <Menu size={20} color="#fff" strokeWidth={2} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/[0.12] rounded-full pl-3 pr-3.5 py-1.5">
              <Wifi size={13} color="#fff" strokeWidth={2.2} />
              <span className="text-white text-xs font-semibold">Synced 11:05</span>
            </div>
            <button onClick={onOpenProfile} className="w-10 h-10 rounded-full bg-white/[0.18] flex items-center justify-center no-select pressable">
              <span className="text-white text-[14px] font-semibold">JD</span>
            </button>
          </div>
        </div>
        <h1 className="text-white text-[30px] font-semibold leading-tight">Shipments</h1>
        <p className="text-white/80 text-[13px] mt-1">{shipments.length} shipments  ·  Apr 7 – Apr 28</p>
      </div>

      {/* Location Bar */}
      <button
        onClick={onOpenLocation}
        className="bg-white flex items-center gap-3 px-5 py-4 w-full no-select pressable"
      >
        <div className="w-9 h-9 rounded-[10px] bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
          <MapPin size={18} color="#1E3FFF" strokeWidth={2} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[#0A0A0A] text-[15px] font-semibold leading-tight">{selectedLocation.replace(' Branch Office', '').replace(' Branch', '')}</p>
          <p className="text-[#737373] text-xs mt-0.5">Branch Office</p>
        </div>
        <ChevronRight size={18} color="#999999" strokeWidth={2} />
      </button>

      <div className="h-px bg-[#EAEAEA]" />

      {/* Filter chips */}
      <div className="bg-white px-5 py-3.5 overflow-x-auto">
        <div className="flex gap-2 w-max">
          {FILTERS.map(f => {
            const active = filter === f.key
            const count = counts[f.key as string]

            if (f.key === 'NEEDS-COUNT') {
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="flex items-center gap-2 pl-3.5 pr-3 py-2.5 rounded-full text-xs font-semibold no-select transition-colors flex-shrink-0"
                  style={{
                    backgroundColor: active ? '#F59E0B' : '#FFF7E6',
                    color: active ? '#FFFFFF' : '#92400E',
                  }}
                >
                  <CircleDot size={14} strokeWidth={2.2} />
                  {f.label}
                  {count > 0 && (
                    <span
                      className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                      style={{ backgroundColor: active ? 'rgba(255,255,255,0.22)' : '#F59E0B22', color: active ? '#fff' : '#92400E' }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              )
            }

            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-semibold no-select transition-colors flex-shrink-0 border"
                style={{
                  backgroundColor: active ? '#1E3FFF' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#525252',
                  borderColor: active ? '#1E3FFF' : '#EAEAEA',
                }}
              >
                {f.label}
                {count !== undefined && count > 0 && (
                  <span className="text-[11px] opacity-70">{count}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="h-px bg-[#EAEAEA]" />

      {/* Shipment list */}
      <div className="flex flex-col gap-3.5 p-4 pb-24">
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
        className="fixed bottom-7 right-6 md:absolute w-[60px] h-[60px] rounded-full bg-[#1E3FFF] flex items-center justify-center no-select pressable z-10"
        style={{ boxShadow: '0 8px 20px rgba(30,63,255,0.35), 0 2px 6px rgba(0,0,0,0.10)' }}
      >
        <Plus size={26} color="#fff" strokeWidth={2.5} />
      </button>
    </div>
  )
}

// ─── Card ──────────────────────────────────────────────────────────────────────

function ShipmentCard({ shipment, idx, onTap }: { shipment: Shipment; idx: number; onTap: () => void }) {
  const total = totalExpected(shipment.items)
  const isDiscrepancy = shipment.status === 'DISCREPANCY'
  const isDelivery = shipment.type === 'DELIVERY'
  const isPreReturn = shipment.type === 'PRE-RETURN'
  const isEmptyBOM = shipment.items.length === 0

  const accent = isDiscrepancy ? '#DC2626' : isPreReturn ? '#F59E0B' : '#1E3FFF'

  let badge: { label: string; bg: string; color: string }
  if (shipment.status === 'DISCREPANCY') badge = { label: 'DISCREPANCY', bg: '#FEE2E2', color: '#991B1B' }
  else if (shipment.status === 'PRE-RETURN') badge = { label: 'PRE-RETURN', bg: '#FEF3C7', color: '#92400E' }
  else if (shipment.status === 'RESERVED') badge = { label: 'RESERVED', bg: '#E5ECFF', color: '#1E3FFF' }
  else if (shipment.status === 'IN-TRANSIT') badge = { label: 'IN TRANSIT', bg: '#E0F2FE', color: '#0369A1' }
  else if (shipment.status === 'TO-BE-RECEIVED') badge = { label: 'TO BE RECEIVED', bg: '#EEF2FF', color: '#4F46E5' }
  else badge = { label: 'RESERVED', bg: '#E5ECFF', color: '#1E3FFF' }

  const [city, state] = (shipment.location ?? '').split(',').map(s => s.trim())
  const cityLabel = state ? `${city}, ${state}` : (shipment.location ?? '')
  const plannedLabel = shipment.date.replace(/\w+, /, '').replace(/(\w+ \d+).*/, 'Planned $1')

  return (
    <button
      onClick={onTap}
      className="stagger-item w-full bg-white rounded-2xl text-left no-select active:scale-[0.99] transition-transform overflow-hidden"
      style={{
        border: '1px solid #EAEAEA',
        animationDelay: `${idx * 40}ms`,
      }}
    >
      {/* Colored accent bar */}
      <div className="w-full h-1" style={{ backgroundColor: accent }} />

      <div className="flex flex-col gap-4 px-5 py-5">
        {/* Top row: ID + badge + chevron */}
        <div className="flex items-center gap-2.5">
          <span className="text-[#0A0A0A] text-[20px] font-semibold leading-none">{shipment.id}</span>
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: badge.bg, color: badge.color, letterSpacing: 0.3 }}
          >
            {badge.label}
          </span>
          <div className="flex-1" />
          <ChevronRight size={20} color="#999999" strokeWidth={2} />
        </div>

        {/* Jobsite */}
        <p className="text-[#0A0A0A] text-[17px] font-semibold leading-snug -mt-1">
          {shipment.jobsiteId} — {shipment.jobsite}
        </p>

        {/* Meta with icons */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <MetaPill icon={<MapPin size={14} color="#737373" strokeWidth={2} />} text={cityLabel || '—'} />
          <MetaPill icon={<Calendar size={14} color="#737373" strokeWidth={2} />} text={plannedLabel} strong />
          {isEmptyBOM && isPreReturn
            ? <MetaPill icon={<PackageOpen size={14} color="#92400E" strokeWidth={2} />} text="BOM blank" color="#92400E" strong />
            : <MetaPill icon={<Package size={14} color="#737373" strokeWidth={2} />} text={`${total} pcs`} />}
        </div>

        {/* Status line */}
        {isDiscrepancy && shipment.discrepancy && (
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} color="#991B1B" strokeWidth={2.2} />
            <span className="text-[#991B1B] text-[13px] font-semibold">
              Count mismatch (−{shipment.discrepancy.expected - shipment.discrepancy.counted})
            </span>
            <div className="flex-1" />
            <span className="text-[#991B1B] text-xs font-semibold">Resolve on desktop</span>
            <ArrowRight size={12} color="#991B1B" strokeWidth={2.2} />
          </div>
        )}
        {(shipment.status === 'NEEDS-COUNT' || shipment.status === 'PRE-RETURN') && (
          <div className="flex items-center gap-2">
            <CircleDot size={14} color="#92400E" strokeWidth={2.2} />
            <span className="text-[#92400E] text-[13px] font-semibold">Needs your count</span>
          </div>
        )}
        {shipment.status === 'IN-TRANSIT' && (
          <div className="flex items-center gap-2">
            <Truck size={14} color="#0369A1" strokeWidth={2.2} />
            <span className="text-[#0369A1] text-[13px] font-semibold">En route to job site</span>
          </div>
        )}
      </div>
    </button>
  )
}

function MetaPill({ icon, text, color = '#525252', strong = false }: { icon: JSX.Element; text: string; color?: string; strong?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-[13px]" style={{ color: strong ? '#0A0A0A' : color, fontWeight: strong ? 600 : 400 }}>{text}</span>
    </div>
  )
}
