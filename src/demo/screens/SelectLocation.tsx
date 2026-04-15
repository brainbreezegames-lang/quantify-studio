import { useState } from 'react'
import { LOCATIONS, Location } from '../data'

const SW = { fontFamily: 'Switzer, sans-serif' }

interface Props {
  selectedLocation: string
  onSelect: (name: string) => void
  onBack: () => void
}

export default function SelectLocation({ selectedLocation, onSelect, onBack }: Props) {
  const [search, setSearch] = useState('')

  const branches = LOCATIONS.filter(l => l.type === 'branch')
  const nyLocations = LOCATIONS.filter(l => l.type !== 'branch' && l.city === 'New York')
  const otherBranches = LOCATIONS.filter(l => l.type === 'branch' && l.name !== 'New York Branch Office')
  const laydowns = LOCATIONS.filter(l => l.type === 'laydown' && l.city !== 'New York')

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Header */}
      <div className="bg-[#1E3FFF] px-5 pt-4 pb-5 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <p className="text-white text-lg font-semibold flex-1 text-center" style={SW}>Select location</p>
        <div className="w-9" />
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-xl px-3 py-2.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search jobsite or branch…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#A3A3A3]"
            style={SW}
          />
        </div>
      </div>

      {/* Currently selected */}
      <div className="px-4 py-3">
        <div
          className="flex items-center gap-4 p-4 rounded-2xl border-2 border-[#1E3FFF] bg-[#EEF2FF]"
          onClick={() => onSelect('New York Branch Office')}
        >
          <div className="w-10 h-10 rounded-full bg-[#1E3FFF] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div className="flex-1">
            <p className="text-[#1E3FFF] text-base font-semibold" style={SW}>New York</p>
            <p className="text-[#1E3FFF]/70 text-sm" style={SW}>Branch Office · Currently selected</p>
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
        <p className="text-[#737373] text-[11px] font-bold tracking-widest" style={SW}>{title}</p>
        {actionLabel && <p className="text-[#1E3FFF] text-sm font-semibold" style={SW}>{actionLabel}</p>}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function LocationRow({ location, onSelect }: { location: Location; onSelect: (name: string) => void }) {
  const icons: Record<string, JSX.Element> = {
    branch: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E3FFF" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    jobsite: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E3FFF" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
    laydown: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
  }

  const iconBg = location.type === 'laydown' ? '#FEF3C7' : '#EEF2FF'

  return (
    <button
      onClick={() => onSelect(location.name)}
      className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#F0F0F0] bg-white no-select active:bg-[#F5F5F5] text-left"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
        {icons[location.type]}
      </div>
      <div className="flex-1">
        <p className="text-[#0A0A0A] text-sm font-semibold" style={SW}>{location.name}</p>
        <p className="text-[#737373] text-xs capitalize" style={SW}>{location.type === 'laydown' ? 'Laydown yard' : location.type}</p>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  )
}
