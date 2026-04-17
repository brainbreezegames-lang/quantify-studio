import { useState } from 'react'
import {
  Menu, MapPin, ChevronRight, Plus, Inbox, CircleDot,
  Calendar, Package, PackageOpen, AlertTriangle, Truck, ArrowRight, ArrowDown, ArrowUp,
  Weight,
} from 'lucide-react'
import { Shipment, ShipmentStatus, statusColors } from '../data'

type FilterKey = 'all' | 'reserved' | 'to-be-received' | 'in-transit' | 'needs-count' | 'discrepancy' | 'pre-return'

interface Props {
  shipments: Shipment[]
  selectedLocation: string
  onSelect: (id: string) => void
  onOpenMenu: () => void
  onOpenProfile: () => void
  onOpenLocation: () => void
  onOpenCreateNew: () => void
}

const FILTER_DEFS: { key: FilterKey; label: string; statuses: ShipmentStatus[] }[] = [
  { key: 'all',           label: 'All',             statuses: [] },
  { key: 'reserved',      label: 'Reserved',        statuses: ['RESERVED'] },
  { key: 'to-be-received',label: 'To Be Received',  statuses: ['TO-BE-RECEIVED'] },
  { key: 'in-transit',    label: 'In Transit',       statuses: ['IN-TRANSIT'] },
  { key: 'needs-count',   label: 'Needs Count',      statuses: ['NEEDS-COUNT'] },
  { key: 'discrepancy',   label: 'Discrepancy',      statuses: ['DISCREPANCY'] },
  { key: 'pre-return',    label: 'Pre-Return',       statuses: ['PRE-RETURN'] },
]

// Active chip colors per status — Brian: "Maybe show all statuses? Zero next to ones that don't have any?"
const FILTER_ACTIVE_COLOR: Record<FilterKey, { bg: string; text: string }> = {
  'all':            { bg: '#1E3FFF', text: '#FFFFFF' },
  'reserved':       { bg: '#1E3FFF', text: '#FFFFFF' },
  'to-be-received': { bg: '#15803D', text: '#FFFFFF' },
  'in-transit':     { bg: '#0369A1', text: '#FFFFFF' },
  'needs-count':    { bg: '#92400E', text: '#FFFFFF' },
  'discrepancy':    { bg: '#DC2626', text: '#FFFFFF' },
  'pre-return':     { bg: '#D97706', text: '#FFFFFF' },
}

export default function ShipmentList({ shipments, selectedLocation, onSelect, onOpenMenu, onOpenProfile, onOpenLocation, onOpenCreateNew }: Props) {
  const [filter, setFilter] = useState<FilterKey>('all')

  const counts: Record<FilterKey, number> = {
    'all':            shipments.length,
    'reserved':       shipments.filter(s => s.status === 'RESERVED').length,
    'to-be-received': shipments.filter(s => s.status === 'TO-BE-RECEIVED').length,
    'in-transit':     shipments.filter(s => s.status === 'IN-TRANSIT').length,
    'needs-count':    shipments.filter(s => s.status === 'NEEDS-COUNT').length,
    'discrepancy':    shipments.filter(s => s.status === 'DISCREPANCY').length,
    'pre-return':     shipments.filter(s => s.status === 'PRE-RETURN').length,
  }

  const filtered =
    filter === 'all'
      ? shipments
      : shipments.filter(s => FILTER_DEFS.find(f => f.key === filter)!.statuses.includes(s.status))

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Blue Header */}
      <div data-spot="app-header" className="bg-[#1E3FFF] px-5 pt-[18px] pb-[22px]">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onOpenMenu} className="w-10 h-10 rounded-full bg-white/[0.12] flex items-center justify-center no-select pressable">
            <Menu size={20} color="#fff" strokeWidth={2} />
          </button>
          <button onClick={onOpenProfile} className="w-10 h-10 rounded-full bg-white/[0.18] flex items-center justify-center no-select pressable">
            <span className="text-white text-[14px] font-semibold">JD</span>
          </button>
        </div>
        <h1 className="text-white text-[30px] font-semibold leading-tight">Shipments</h1>
        <p className="text-white/80 text-[13px] mt-1">{shipments.length} shipments  ·  Apr 7 – Apr 28</p>
      </div>

      {/* Location Bar */}
      <button
        data-spot="location-bar"
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

      {/* All-status filter chips — Brian: "Maybe show all statuses? Zero next to ones that don't have any?" */}
      <div data-spot="filter-chips" className="bg-white px-5 py-3.5 overflow-x-auto">
        <div className="flex gap-2 w-max">
          {FILTER_DEFS.map(f => {
            const active = filter === f.key
            const count = counts[f.key]
            const activeColors = FILTER_ACTIVE_COLOR[f.key]
            return (
              <FilterChip
                key={f.key}
                label={f.label}
                count={count}
                active={active}
                activeBg={activeColors.bg}
                activeText={activeColors.text}
                onClick={() => setFilter(f.key)}
              />
            )
          })}
        </div>
      </div>

      <div className="h-px bg-[#EAEAEA]" />

      {/* Shipment list */}
      <div className="flex flex-col gap-3 p-4 pb-28">
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
        data-spot="fab"
        onClick={onOpenCreateNew}
        className="fixed bottom-7 right-6 md:absolute w-[60px] h-[60px] rounded-full bg-[#1E3FFF] flex items-center justify-center no-select pressable z-10"
        style={{ boxShadow: '0 8px 20px rgba(30,63,255,0.35), 0 2px 6px rgba(0,0,0,0.10)' }}
      >
        <Plus size={26} color="#fff" strokeWidth={2.5} />
      </button>
    </div>
  )
}

// ─── Filter chip ──────────────────────────────────────────────────────────────
function FilterChip({ label, count, active, activeBg, activeText, onClick }: {
  label: string; count: number; active: boolean
  activeBg: string; activeText: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 pl-3.5 pr-2 py-2 rounded-full text-[13px] font-semibold no-select transition-colors flex-shrink-0 border"
      style={{
        backgroundColor: active ? activeBg : '#FFFFFF',
        color: active ? activeText : '#525252',
        borderColor: active ? activeBg : '#EAEAEA',
      }}
    >
      <span>{label}</span>
      <span
        className="text-[11px] font-semibold min-w-[20px] h-[20px] px-1.5 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: active ? 'rgba(255,255,255,0.24)' : '#F5F5F5',
          color: active ? '#FFFFFF' : '#525252',
        }}
      >
        {count}
      </span>
    </button>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function ShipmentCard({ shipment, idx, onTap }: { shipment: Shipment; idx: number; onTap: () => void }) {
  const total = shipment.pcsTotal
  const isDiscrepancy = shipment.status === 'DISCREPANCY'
  const isPreReturn = shipment.type === 'PRE-RETURN'
  const isEmptyBOM = shipment.items.length === 0

  const accent =
    isDiscrepancy ? '#DC2626' :
    isPreReturn ? '#F59E0B' :
    shipment.status === 'IN-TRANSIT' ? '#0EA5E9' :
    '#1E3FFF'

  const dot: { bg: string; color: string; icon: JSX.Element } =
    isDiscrepancy
      ? { bg: '#FEE2E2', color: '#991B1B', icon: <AlertTriangle size={14} color="#991B1B" strokeWidth={2.2} /> }
      : isPreReturn
        ? { bg: '#FEF3C7', color: '#92400E', icon: <ArrowDown size={14} color="#92400E" strokeWidth={2.2} /> }
        : shipment.status === 'IN-TRANSIT'
          ? { bg: '#E0F2FE', color: '#0369A1', icon: <Truck size={14} color="#0369A1" strokeWidth={2.2} /> }
          : { bg: '#EEF2FF', color: '#1E3FFF', icon: <ArrowUp size={14} color="#1E3FFF" strokeWidth={2.2} /> }

  const sc = statusColors(shipment.status)
  const badge = { label: shipment.status.replace('-', ' '), bg: sc.bg, color: sc.text }

  const [city, state] = (shipment.location ?? '').split(',').map(s => s.trim())
  const cityLabel = state ? `${city}, ${state}` : (shipment.location ?? '')

  return (
    <button
      data-spot={`card-${shipment.id}`}
      onClick={onTap}
      className="stagger-item w-full bg-white rounded-2xl text-left no-select active:scale-[0.99] transition-transform overflow-hidden"
      style={{
        border: '1px solid #EAEAEA',
        animationDelay: `${idx * 40}ms`,
      }}
    >
      <div className="h-1 w-full" style={{ backgroundColor: accent }} />
      <div className="flex flex-col gap-3.5 px-5 py-5">
        {/* Top row */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: dot.bg }}>
            {dot.icon}
          </div>
          <span className="text-[#0A0A0A] text-[18px] font-semibold leading-none">{shipment.id}</span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: badge.bg, color: badge.color, letterSpacing: 0.3 }}
          >
            {badge.label}
          </span>
          <div className="flex-1" />
          <ChevronRight size={18} color="#999999" strokeWidth={2} />
        </div>

        {/* Jobsite */}
        <p className="text-[#0A0A0A] text-[16px] font-semibold leading-snug">
          {shipment.jobsiteId} — {shipment.jobsite}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 flex-wrap -mt-1">
          <MetaPill icon={<MapPin size={13} color="#737373" strokeWidth={2} />} text={cityLabel || '—'} />
          <MetaPill icon={<Calendar size={13} color="#737373" strokeWidth={2} />} text={shipment.date} />
          {isEmptyBOM && isPreReturn
            ? <MetaPill icon={<PackageOpen size={13} color="#92400E" strokeWidth={2} />} text="BOM blank" color="#92400E" />
            : <MetaPill icon={<Package size={13} color="#737373" strokeWidth={2} />} text={`${total} pcs`} />}
        </div>

        {/* Weight row — Brian: "Weight is also very important" */}
        {shipment.weight && (
          <div className="flex items-center gap-1.5 -mt-1">
            <Weight size={13} color="#737373" strokeWidth={2} />
            <span className="text-[13px] text-[#525252]">{shipment.weight}</span>
          </div>
        )}

        {isDiscrepancy && shipment.discrepancy && (
          <div className="flex items-center gap-2 pt-0.5 border-t border-[#F0F0F0] -mx-5 px-5 pt-3">
            <span className="text-[#991B1B] text-[13px] font-semibold">
              Count mismatch (−{shipment.discrepancy.expected - shipment.discrepancy.counted})
            </span>
            <div className="flex-1" />
            <span className="text-[#991B1B] text-xs font-semibold">Resolve on desktop</span>
            <ArrowRight size={12} color="#991B1B" strokeWidth={2.2} />
          </div>
        )}
        {(shipment.status === 'NEEDS-COUNT' || shipment.status === 'PRE-RETURN') && (
          <div className="flex items-center gap-2 pt-0.5 border-t border-[#F0F0F0] -mx-5 px-5 pt-3">
            <CircleDot size={14} color="#92400E" strokeWidth={2.2} />
            <span className="text-[#92400E] text-[13px] font-semibold">Needs your count</span>
          </div>
        )}
      </div>
    </button>
  )
}

function MetaPill({ icon, text, color = '#525252' }: { icon: JSX.Element; text: string; color?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-[13px]" style={{ color }}>{text}</span>
    </div>
  )
}
