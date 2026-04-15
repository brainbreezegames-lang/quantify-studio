import { useState } from 'react'
import { X, Search, Check, Home, Briefcase, Package, ChevronRight } from 'lucide-react'
import { LOCATIONS, Location } from '../data'

interface Props {
  selectedLocation: string
  onSelect: (name: string) => void
  onBack: () => void
}

export default function SelectLocation({ selectedLocation, onSelect, onBack }: Props) {
  const [search, setSearch] = useState('')

  const nyLocations = LOCATIONS.filter(l => l.type !== 'branch' && l.city === 'New York')
  const otherBranches = LOCATIONS.filter(l => l.type === 'branch' && l.name !== 'New York Branch Office')
  const laydowns = LOCATIONS.filter(l => l.type === 'laydown' && l.city !== 'New York')

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Header */}
      <div className="bg-[#1E3FFF] px-5 pt-4 pb-5 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select pressable">
          <X size={20} color="#fff" strokeWidth={2} />
        </button>
        <p className="text-white text-lg font-semibold flex-1 text-center">Select location</p>
        <div className="w-9" />
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-xl px-3 py-2.5">
          <Search size={15} color="#A3A3A3" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search jobsite or branch…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#A3A3A3]"
          />
        </div>
      </div>

      {/* Currently selected */}
      <div className="px-4 py-3">
        <div
          className="flex items-center gap-4 p-4 rounded-2xl border-2 border-[#1E3FFF] bg-[#EEF2FF] cursor-pointer no-select"
          onClick={() => onSelect('New York Branch Office')}
        >
          <div className="w-10 h-10 rounded-full bg-[#1E3FFF] flex items-center justify-center flex-shrink-0">
            <Check size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-[#1E3FFF] text-base font-semibold">New York</p>
            <p className="text-[#1E3FFF]/70 text-sm">Branch Office · Currently selected</p>
          </div>
        </div>
      </div>

      {/* NY Locations */}
      <Section title="NEW YORK LOCATIONS" actionLabel="View all">
        {nyLocations.map(loc => <LocationRow key={loc.id} location={loc} onSelect={onSelect} />)}
      </Section>

      {/* Other branches */}
      <Section title="OTHER BRANCHES">
        {otherBranches.map(loc => <LocationRow key={loc.id} location={loc} onSelect={onSelect} />)}
      </Section>

      {/* Laydown yards */}
      <Section title="LAYDOWN YARDS">
        {laydowns.map(loc => <LocationRow key={loc.id} location={loc} onSelect={onSelect} />)}
      </Section>
    </div>
  )
}

function Section({ title, actionLabel, children }: { title: string; actionLabel?: string; children: React.ReactNode }) {
  return (
    <div className="px-4 mb-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-[#737373] text-[11px] font-bold tracking-widest">{title}</p>
        {actionLabel && <p className="text-[#1E3FFF] text-sm font-semibold">{actionLabel}</p>}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function LocationRow({ location, onSelect }: { location: Location; onSelect: (name: string) => void }) {
  const iconColor = location.type === 'laydown' ? '#D97706' : '#1E3FFF'
  const iconBg = location.type === 'laydown' ? '#FEF3C7' : '#EEF2FF'

  const icon = location.type === 'branch'
    ? <Home size={18} color={iconColor} strokeWidth={2} />
    : location.type === 'jobsite'
      ? <Briefcase size={18} color={iconColor} strokeWidth={2} />
      : <Package size={18} color={iconColor} strokeWidth={2} />

  return (
    <button
      onClick={() => onSelect(location.name)}
      className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#F0F0F0] bg-white no-select pressable text-left"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[#0A0A0A] text-sm font-semibold">{location.name}</p>
        <p className="text-[#737373] text-xs capitalize">{location.type === 'laydown' ? 'Laydown yard' : location.type}</p>
      </div>
      <ChevronRight size={14} color="#A3A3A3" strokeWidth={2} />
    </button>
  )
}
