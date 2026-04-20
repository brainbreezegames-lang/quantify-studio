import { useState } from 'react'
import {
  Menu, MapPin, ChevronRight, ChevronDown, Plus, Inbox, CircleDot,
  Calendar, Package, PackageOpen, AlertTriangle, Truck, ArrowRight, ArrowDown, ArrowUp,
  Weight, Inbox as MoveToInbox,
} from 'lucide-react'
import { Shipment, ShipmentStatus, statusColors, needsCount } from '../data'

type FilterKey = 'all' | 'reserved' | 'to-be-received' | 'in-transit' | 'discrepancy' | 'pre-return'

interface Props {
  shipments: Shipment[]
  selectedLocation: string
  onSelect: (id: string) => void
  onOpenMenu: () => void
  onOpenProfile: () => void
  onOpenLocation: () => void
  onOpenCreateNew: () => void
}

// Brian: "all statuses will need someone's count" — Needs Count is not a status,
// so it's not a filter either. Filter chips are the real Quantify statuses only.
const FILTER_DEFS: { key: FilterKey; label: string; statuses: ShipmentStatus[] }[] = [
  { key: 'all',           label: 'All',             statuses: [] },
  { key: 'reserved',      label: 'Reserved',        statuses: ['RESERVED'] },
  { key: 'to-be-received',label: 'To Be Received',  statuses: ['TO-BE-RECEIVED'] },
  { key: 'in-transit',    label: 'In Transit',      statuses: ['IN-TRANSIT'] },
  { key: 'discrepancy',   label: 'Discrepancy',     statuses: ['DISCREPANCY'] },
  { key: 'pre-return',    label: 'Pre-Return',      statuses: ['PRE-RETURN'] },
]

const FILTER_ACTIVE_COLOR: Record<FilterKey, { bg: string; text: string }> = {
  'all':            { bg: '#1E3FFF', text: '#FFFFFF' },
  'reserved':       { bg: '#1E3FFF', text: '#FFFFFF' },
  'to-be-received': { bg: '#15803D', text: '#FFFFFF' },
  'in-transit':     { bg: '#0369A1', text: '#FFFFFF' },
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
      <div data-spot="app-header" className="bg-[#1E3FFF] px-5 pt-[18px] pb-7">
        <div className="flex items-center justify-between mb-[18px]">
          <button onClick={onOpenMenu} className="w-11 h-11 rounded-full bg-white/[0.15] flex items-center justify-center no-select pressable">
            <Menu size={22} color="#fff" strokeWidth={2} />
          </button>
          <button onClick={onOpenProfile} className="w-11 h-11 rounded-full bg-white/[0.2] flex items-center justify-center no-select pressable">
            <span className="text-white text-[15px] font-bold">JD</span>
          </button>
        </div>
        <h1 className="text-white text-[34px] font-semibold leading-[1.1] tracking-[-0.8px]">Shipments</h1>
        <p className="text-white/90 text-sm font-semibold mt-[18px]">{shipments.length} shipments  ·  Apr 7 – Apr 28</p>
      </div>

      {/* Location Bar */}
      <button
        data-spot="location-bar"
        onClick={onOpenLocation}
        className="bg-white flex items-center justify-between px-5 py-[18px] w-full no-select pressable"
      >
        <div className="flex items-center gap-3">
          <MapPin size={20} color="#525252" strokeWidth={2} />
          <p className="text-[#0A0A0A] text-base font-semibold leading-none">{selectedLocation}</p>
        </div>
        <ChevronDown size={20} color="#525252" strokeWidth={2} />
      </button>

      <div className="h-px bg-[#EAEAEA]" />

      {/* All-status filter chips */}
      <div data-spot="filter-chips" className="bg-white px-5 py-4 overflow-x-auto">
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
      <div className="flex flex-col gap-[14px] p-4 pb-28">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-3">
              <Inbox size={24} color="#737373" strokeWidth={1.5} />
            </div>
            <p className="text-[#0A0A0A] text-base font-bold">No shipments</p>
            <p className="text-[#737373] text-sm mt-1 font-medium">Nothing matching this filter.</p>
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
      className="flex items-center gap-2 pl-4 pr-2.5 py-2 rounded-full text-[13px] font-bold no-select transition-all flex-shrink-0 border"
      style={{
        backgroundColor: active ? activeBg : '#FFFFFF',
        color: active ? activeText : '#525252',
        borderColor: active ? activeBg : '#EAEAEA',
        boxShadow: active ? `0 4px 10px ${activeBg}38` : 'none',
      }}
    >
      <span>{label}</span>
      <span
        className="text-[11px] font-bold min-w-[22px] h-[18px] px-1.5 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: active ? 'rgba(255,255,255,0.22)' : '#F3F4F6',
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
  const isToBeReceived = shipment.status === 'TO-BE-RECEIVED'
  const isInTransit = shipment.status === 'IN-TRANSIT'
  const awaitingCount = needsCount(shipment)

  // Top stripe color per status
  const stripe =
    isDiscrepancy ? '#DC2626' :
    isPreReturn ? '#F59E0B' :
    isInTransit ? '#0EA5E9' :
    isToBeReceived ? '#15803D' :
    '#1E3FFF'

  // Shadow per status
  const cardShadow =
    isDiscrepancy ? 'shadow-[0_4px_16px_rgba(220,38,38,0.08)]' :
    isPreReturn ? 'shadow-[0_4px_16px_rgba(245,158,11,0.08)]' :
    'shadow-[0_4px_16px_rgba(10,13,30,0.04)]'

  // Direction dot: blue up / red warn / green inbox / sky truck / amber
  const dot: { bg: string; color: string; icon: JSX.Element } =
    isDiscrepancy
      ? { bg: '#FEE2E2', color: '#991B1B', icon: <AlertTriangle size={16} color="#991B1B" strokeWidth={2.2} /> }
      : isPreReturn
        ? { bg: '#FEF3C7', color: '#92400E', icon: <ArrowDown size={16} color="#92400E" strokeWidth={2.2} /> }
        : isInTransit
          ? { bg: '#E0F2FE', color: '#0369A1', icon: <Truck size={16} color="#0369A1" strokeWidth={2.2} /> }
          : isToBeReceived
            ? { bg: '#F0FDF4', color: '#15803D', icon: <MoveToInbox size={16} color="#15803D" strokeWidth={2.2} /> }
            : { bg: '#EEF2FF', color: '#1E3FFF', icon: <ArrowUp size={16} color="#1E3FFF" strokeWidth={2.2} /> }

  const sc = statusColors(shipment.status)
  const badge = { label: shipment.status.replace('-', ' '), bg: sc.bg, color: sc.text }

  const [city, state] = (shipment.location ?? '').split(',').map(s => s.trim())
  const cityLabel = state ? `${city}, ${state}` : (shipment.location ?? '')

  const stripeHeight = isDiscrepancy ? 6 : 4

  return (
    <button
      data-spot={`card-${shipment.id}`}
      onClick={onTap}
      className={`stagger-item w-full bg-white rounded-[20px] text-left no-select active:scale-[0.99] transition-transform overflow-hidden ${cardShadow}`}
      style={{
        border: '1px solid #EAEAEA',
        animationDelay: `${idx * 40}ms`,
      }}
    >
      <div className="w-full" style={{ height: stripeHeight, backgroundColor: stripe }} />
      <div className="flex flex-col gap-3 px-[22px] py-5">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: dot.bg }}>
              {dot.icon}
            </div>
            <span className="text-[#0A0A0A] text-lg font-bold tracking-[-0.2px] leading-none">{shipment.id}</span>
            <span
              className="text-[10px] font-bold px-2 py-[3px] rounded-full"
              style={{ backgroundColor: badge.bg, color: badge.color, letterSpacing: 0.5 }}
            >
              {badge.label}
            </span>
          </div>
          <ChevronRight size={20} color="#737373" strokeWidth={2} />
        </div>

        {/* Jobsite — Brian: subtitle shows the jobsite number, not the delivery */}
        <p className="text-[#0A0A0A] text-base font-bold tracking-[-0.1px] leading-snug">
          {shipment.jobsiteId} - {shipment.jobsite}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 flex-wrap">
          <MetaPill icon={<MapPin size={14} color="#737373" strokeWidth={2} />} text={cityLabel || '-'} />
          <MetaPill icon={<Calendar size={14} color="#737373" strokeWidth={2} />} text={shipment.date} />
          {isEmptyBOM && isPreReturn
            ? <MetaPill icon={<PackageOpen size={14} color="#92400E" strokeWidth={2} />} text="BOM blank" color="#92400E" bold />
            : <MetaPill icon={<Package size={14} color="#737373" strokeWidth={2} />} text={`${total} pcs`} />}
        </div>

        {/* Weight row — Brian: "Weight 1,240", no units (Quantify doesn't enforce kg/lbs) */}
        {shipment.weight && (
          <div className="flex items-center gap-1.5">
            <Weight size={14} color="#737373" strokeWidth={2} />
            <span className="text-[13px] font-medium text-[#525252]">Weight {shipment.weight}</span>
          </div>
        )}
      </div>

      {/* Footer: discrepancy or needs-count (driven by derived helper, not a status) */}
      {isDiscrepancy && shipment.discrepancy && (
        <>
          <div className="h-px bg-[#F0F0F0]" />
          <div className="flex items-center justify-between px-[22px] pt-3.5 pb-4">
            <span className="text-[#991B1B] text-[13px] font-bold">
              Count mismatch (−{shipment.discrepancy.expected - shipment.discrepancy.counted})
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#991B1B] text-xs font-bold">Resolve on desktop</span>
              <ArrowRight size={13} color="#991B1B" strokeWidth={2.2} />
            </div>
          </div>
        </>
      )}
      {awaitingCount && !isDiscrepancy && (
        <>
          <div className="h-px bg-[#F0F0F0]" />
          <div className="flex items-center gap-2 px-[22px] pt-3.5 pb-4">
            <CircleDot size={15} color="#92400E" strokeWidth={2.2} />
            <span className="text-[#92400E] text-[13px] font-bold tracking-[0.1px]">Needs your count</span>
          </div>
        </>
      )}
    </button>
  )
}

function MetaPill({ icon, text, color = '#525252', bold = false }: { icon: JSX.Element; text: string; color?: string; bold?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className={`text-[13px] ${bold ? 'font-bold' : 'font-medium'}`} style={{ color }}>{text}</span>
    </div>
  )
}
