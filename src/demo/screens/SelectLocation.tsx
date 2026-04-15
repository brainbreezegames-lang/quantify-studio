import { useState } from 'react'
import { ArrowLeft, Search, Check, Home, Briefcase, Package, ChevronRight } from 'lucide-react'
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
      {/* White header */}
      <div className="bg-white px-4 pt-[18px] pb-[18px] flex items-center gap-3.5 border-b border-[#EAEAEA]">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center no-select pressable flex-shrink-0">
          <ArrowLeft size={20} color="#0A0A0A" strokeWidth={2} />
        </button>
        <p className="text-[#0A0A0A] text-[19px] font-semibold flex-1">Select location</p>
      </div>

      {/* Search */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-[14px] px-4 py-3.5">
          <Search size={18} color="#737373" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search jobsite or branch…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#999999] text-[#0A0A0A]"
          />
        </div>
      </div>

      {/* Currently selected */}
      <div className="px-4 pt-1">
        <div
          className="flex items-center gap-3.5 px-4 py-4 rounded-[14px] bg-[#EEF2FF] cursor-pointer no-select"
          style={{ border: '1.5px solid #1E3FFF' }}
          onClick={() => onSelect('New York Branch Office')}
        >
          <div className="w-10 h-10 rounded-full bg-[#1E3FFF] flex items-center justify-center flex-shrink-0">
            <Check size={22} color="#fff" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-[#1E3FFF] text-[17px] font-semibold leading-tight">New York</p>
            <p className="text-[#1E3FFF] text-xs font-medium mt-0.5">Branch Office · Currently selected</p>
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

      <div className="h-8" />
    </div>
  )
}

function Section({ title, actionLabel, children }: { title: string; actionLabel?: string; children: React.ReactNode }) {
  return (
    <div className="px-4 mt-7">
      <div className="flex items-center justify-between px-2 mb-2.5">
        <p className="text-[#737373] text-[11px] font-semibold" style={{ letterSpacing: 1 }}>{title}</p>
        {actionLabel && <p className="text-[#1E3FFF] text-[13px] font-semibold">{actionLabel}</p>}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function LocationRow({ location, onSelect }: { location: Location; onSelect: (name: string) => void }) {
  const iconColor = location.type === 'laydown' ? '#92400E' : '#1E3FFF'
  const iconBg = location.type === 'laydown' ? '#FEF3C7' : '#EEF2FF'

  const icon = location.type === 'branch'
    ? <Home size={18} color={iconColor} strokeWidth={2} />
    : location.type === 'jobsite'
      ? <Briefcase size={18} color={iconColor} strokeWidth={2} />
      : <Package size={18} color={iconColor} strokeWidth={2} />

  return (
    <button
      onClick={() => onSelect(location.name)}
      className="flex items-center gap-3 p-3.5 rounded-[14px] bg-white no-select pressable text-left"
      style={{ border: '1px solid #EAEAEA' }}
    >
      <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#0A0A0A] text-[14px] font-semibold truncate">{location.name}</p>
        <p className="text-[#737373] text-xs capitalize mt-0.5">{location.type === 'laydown' ? 'Laydown yard' : location.type}</p>
      </div>
      <ChevronRight size={16} color="#999999" strokeWidth={2} />
    </button>
  )
}
