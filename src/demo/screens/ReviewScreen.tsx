import { Shipment, ShipmentItem, shortfall, flagBadge, totalExpected, countedUnits } from '../data'

const SW = { fontFamily: 'Switzer, sans-serif' }

interface Props {
  shipment: Shipment
  items: ShipmentItem[]
  onBack: () => void
  onConfirm: () => void
}

export default function ReviewScreen({ shipment, items, onBack, onConfirm }: Props) {
  const isReturn = shipment.type === 'PRE-RETURN'
  const accentColor = isReturn ? '#D97706' : '#1E3FFF'
  const total = totalExpected(items)
  const doneUnits = countedUnits(items)

  const variances = items.filter(i => i.counted !== null && i.counted !== i.expected)
  const flagged = items.filter(i => i.flag !== null)

  // Summary counts
  const totalCounted = items.reduce((s, i) => s + (i.counted ?? 0), 0)

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-5 pt-4 pb-5 flex items-center gap-3" style={{ backgroundColor: accentColor }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <p className="text-white text-lg font-semibold flex-1 text-center" style={SW}>Review</p>
        <div className="w-9" />
      </div>

      <div className="flex flex-col gap-3 p-4 pb-8">
        {/* Summary card */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-[#F0F0F0]">
            <p className="text-[#737373] text-sm" style={SW}>{shipment.id} · {shipment.jobsite}</p>
            <p className="text-[#0A0A0A] text-xl font-semibold mt-1" style={SW}>
              {variances.length === 0 ? 'All items counted' : `${items.length} items counted`}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-[#F0F0F0]">
            <StatCell value={totalCounted} label="Units counted" color="#0A0A0A" />
            <StatCell value={variances.length} label="Variances" color={variances.length > 0 ? '#D97706' : '#0A0A0A'} />
            <StatCell value={flagged.length} label="Flagged" color={flagged.length > 0 ? '#DC2626' : '#0A0A0A'} />
          </div>
        </div>

        {/* Variances */}
        {variances.length > 0 && (
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-[#F0F0F0] flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
              </div>
              <p className="text-[#0A0A0A] text-sm font-semibold" style={SW}>{variances.length} variance{variances.length > 1 ? 's' : ''} to review</p>
            </div>
            {variances.map((item, idx) => (
              <div key={item.id}>
                <VarianceRow item={item} />
                {idx < variances.length - 1 && <div className="h-px bg-[#F0F0F0] mx-5" />}
              </div>
            ))}
          </div>
        )}

        {/* Flagged items */}
        {flagged.length > 0 && (
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-[#F0F0F0] flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#DC2626" stroke="none"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15" stroke="#DC2626" strokeWidth="2"/></svg>
              </div>
              <p className="text-[#0A0A0A] text-sm font-semibold" style={SW}>{flagged.length} flagged item{flagged.length > 1 ? 's' : ''}</p>
            </div>
            {flagged.map((item, idx) => (
              <div key={item.id}>
                <FlaggedRow item={item} />
                {idx < flagged.length - 1 && <div className="h-px bg-[#F0F0F0] mx-5" />}
              </div>
            ))}
          </div>
        )}

        {/* Note */}
        <div className="bg-white rounded-2xl px-5 py-4">
          <p className="text-[#0A0A0A] text-sm font-semibold mb-2" style={SW}>Note for office</p>
          <textarea
            placeholder="Optional — add any context..."
            className="w-full text-sm text-[#0A0A0A] placeholder:text-[#A3A3A3] resize-none outline-none"
            rows={2}
            style={SW}
          />
        </div>

        {/* Info banner */}
        <div className="bg-[#EEF2FF] rounded-2xl px-5 py-4 flex items-start gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E3FFF" strokeWidth="2" strokeLinecap="round" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p className="text-[#1E3FFF] text-sm" style={SW}>
            {isReturn
              ? 'Rent stops after the office confirms this return.'
              : "Rent doesn't start until the office confirms and the truck reaches the customer."}
          </p>
        </div>

        {/* Confirm button */}
        <button
          onClick={onConfirm}
          className="w-full h-14 rounded-2xl text-white text-base font-semibold flex items-center justify-center gap-2 no-select active:opacity-90 transition-opacity"
          style={{ backgroundColor: accentColor, fontFamily: 'Switzer, sans-serif' }}
        >
          Confirm & submit
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
      </div>
    </div>
  )
}

function StatCell({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="py-4 flex flex-col items-center gap-0.5">
      <span className="text-xl font-semibold" style={{ color, fontFamily: 'Switzer, sans-serif' }}>{value}</span>
      <span className="text-xs text-[#737373]" style={SW}>{label}</span>
    </div>
  )
}

function VarianceRow({ item }: { item: ShipmentItem }) {
  const diff = (item.counted ?? 0) - item.expected
  const isOver = diff > 0
  const isShortItem = diff < 0

  return (
    <div className="px-5 py-3 flex items-center justify-between">
      <div>
        <p className="text-[#0A0A0A] text-sm font-medium" style={SW}>{item.name}</p>
        <p className="text-[#737373] text-xs" style={SW}>Expected {item.expected} · Counted {item.counted}</p>
      </div>
      <span
        className="text-sm font-semibold"
        style={{ color: isOver ? '#16A34A' : isShortItem ? '#DC2626' : '#737373', fontFamily: 'Switzer, sans-serif' }}
      >
        {isOver ? '+' : ''}{diff}
      </span>
    </div>
  )
}

function FlaggedRow({ item }: { item: ShipmentItem }) {
  const badge = flagBadge(item)
  return (
    <div className="px-5 py-3 flex items-center justify-between">
      <div>
        <p className="text-[#0A0A0A] text-sm font-medium" style={SW}>{item.name}</p>
        <p className="text-[#737373] text-xs" style={SW}>Counted {item.counted} · Expected {item.expected}</p>
      </div>
      {badge && (
        <span
          className="text-xs font-semibold px-2 py-1 rounded-md"
          style={{
            backgroundColor: badge.color === 'red' ? '#FEE2E2' : badge.color === 'green' ? '#DCFCE7' : '#FEF3C7',
            color: badge.color === 'red' ? '#DC2626' : badge.color === 'green' ? '#16A34A' : '#D97706',
            fontFamily: 'Switzer, sans-serif',
          }}
        >
          {badge.label}
        </span>
      )}
    </div>
  )
}
