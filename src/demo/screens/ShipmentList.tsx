import { Shipment, totalExpected } from '../data'

const SW = { fontFamily: 'Switzer, sans-serif' }

interface Props {
  shipments: Shipment[]
  onSelect: (id: string) => void
}

export default function ShipmentList({ shipments, onSelect }: Props) {
  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-[#1E3FFF] px-5 pt-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white text-[11px] font-bold" style={SW}>JO</span>
          </div>
        </div>
        <h1 className="text-white text-2xl font-semibold" style={SW}>Shipments</h1>
        <p className="text-white/70 text-sm mt-0.5" style={SW}>New York · Apr 14, 2026</p>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3 p-4">
        {shipments.map((s) => (
          <ShipmentCard key={s.id} shipment={s} onTap={() => onSelect(s.id)} />
        ))}
      </div>
    </div>
  )
}

function ShipmentCard({ shipment, onTap }: { shipment: Shipment; onTap: () => void }) {
  const isReturn = shipment.type === 'PRE-RETURN'
  const accentColor = isReturn ? '#D97706' : '#1E3FFF'
  const bgColor = isReturn ? '#FEF3C7' : '#EEF2FF'
  const label = isReturn ? 'PRE-RETURN' : 'DELIVERY'
  const total = totalExpected(shipment.items)
  const countedCount = shipment.items.filter(i => i.counted !== null).length

  return (
    <button
      onClick={onTap}
      className="w-full bg-white rounded-2xl p-4 text-left active:scale-[0.98] transition-transform no-select"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: bgColor, color: accentColor, fontFamily: 'Switzer, sans-serif' }}
            >
              {label}
            </span>
            <span className="text-[#737373] text-xs" style={SW}>{shipment.id}</span>
          </div>
          {/* Job site */}
          <p className="text-[#0A0A0A] text-base font-semibold leading-snug" style={SW}>{shipment.jobsite}</p>
          <p className="text-[#737373] text-sm mt-0.5" style={SW}>{shipment.location}</p>
          {/* Meta row */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span className="text-[#737373] text-xs" style={SW}>{shipment.date.split(', ')[1]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="text-[#737373] text-xs" style={SW}>{shipment.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              <span className="text-[#737373] text-xs" style={SW}>{shipment.items.length} items · {total} units</span>
            </div>
          </div>
        </div>
        {/* Arrow */}
        <div className="flex-shrink-0 mt-1">
          {countedCount === 0 ? (
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: bgColor }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          ) : (
            <div className="text-right">
              <span className="text-xs font-semibold" style={{ color: accentColor, fontFamily: 'Switzer, sans-serif' }}>{countedCount}/{shipment.items.length}</span>
              <p className="text-[10px] text-[#737373]" style={SW}>items</p>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
