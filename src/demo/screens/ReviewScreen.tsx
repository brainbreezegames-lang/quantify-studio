import { useState } from 'react'
import { ChevronLeft, AlertTriangle, Flag, Info, Check } from 'lucide-react'
import { Shipment, ShipmentItem, flagBadge } from '../data'
import StickyCTA from '../components/StickyCTA'

interface Props {
  shipment: Shipment
  items: ShipmentItem[]
  onBack: () => void
  onConfirm: () => void
}

export default function ReviewScreen({ shipment, items, onBack, onConfirm }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const isReturn = shipment.type === 'PRE-RETURN'
  const accentColor = isReturn ? '#D97706' : '#1E3FFF'

  function handleConfirm() {
    setSubmitting(true)
    setTimeout(() => onConfirm(), 800)
  }

  const variances = items.filter(i => i.counted !== null && i.counted !== i.expected)
  const flagged = items.filter(i => i.flag !== null)

  const totalCounted = items.reduce((s, i) => s + (i.counted ?? 0), 0)

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-5 pt-4 pb-5 flex items-center gap-3" style={{ backgroundColor: accentColor }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select pressable">
          <ChevronLeft size={20} color="#fff" strokeWidth={2} />
        </button>
        <p className="text-white text-lg font-semibold flex-1 text-center">Review</p>
        <div className="w-9" />
      </div>

      <div className="flex flex-col gap-3 p-4 pb-4">
        {/* Summary card */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-[#F0F0F0]">
            <p className="text-[#737373] text-sm">{shipment.id} · {shipment.jobsite}</p>
            <p className="text-[#0A0A0A] text-xl font-semibold mt-1">
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
                <AlertTriangle size={11} color="#D97706" strokeWidth={2.5} />
              </div>
              <p className="text-[#0A0A0A] text-sm font-semibold">{variances.length} variance{variances.length > 1 ? 's' : ''} to review</p>
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
                <Flag size={11} color="#DC2626" strokeWidth={2} fill="#DC2626" />
              </div>
              <p className="text-[#0A0A0A] text-sm font-semibold">{flagged.length} flagged item{flagged.length > 1 ? 's' : ''}</p>
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
          <p className="text-[#0A0A0A] text-sm font-semibold mb-2">Note for office</p>
          <textarea
            placeholder="Optional — add any context..."
            className="w-full text-sm resize-none outline-none bg-white text-[#0A0A0A] placeholder:text-[#A3A3A3]"
            style={{ backgroundColor: '#FFFFFF', color: '#0A0A0A', WebkitAppearance: 'none', appearance: 'none', colorScheme: 'light' }}
            rows={2}
          />
        </div>

        {/* Info banner */}
        <div className="bg-[#EEF2FF] rounded-2xl px-5 py-4 flex items-start gap-3">
          <Info size={18} color="#1E3FFF" strokeWidth={2} className="mt-0.5 flex-shrink-0" />
          <p className="text-[#1E3FFF] text-sm">
            {isReturn
              ? 'Rent stops after the office confirms this return.'
              : "Rent doesn't start until the office confirms and the truck reaches the customer."}
          </p>
        </div>

      </div>

      <div className="flex-1" />

      <StickyCTA
        accentColor={accentColor}
        loading={submitting}
        onClick={handleConfirm}
        icon={!submitting ? <Check size={18} color="#fff" strokeWidth={2.5} /> : undefined}
      >
        Confirm & submit
      </StickyCTA>
    </div>
  )
}

function StatCell({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="py-4 flex flex-col items-center gap-0.5">
      <span className="text-xl font-semibold" style={{ color }}>{value}</span>
      <span className="text-xs text-[#737373]">{label}</span>
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
        <p className="text-[#0A0A0A] text-sm font-medium">{item.name}</p>
        <p className="text-[#737373] text-xs">Expected {item.expected} · Counted {item.counted}</p>
      </div>
      <span
        className="text-sm font-semibold"
        style={{ color: isOver ? '#16A34A' : isShortItem ? '#DC2626' : '#737373' }}
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
        <p className="text-[#0A0A0A] text-sm font-medium">{item.name}</p>
        <p className="text-[#737373] text-xs">Counted {item.counted} · Expected {item.expected}</p>
      </div>
      {badge && (
        <span
          className="text-xs font-semibold px-2 py-1 rounded-md"
          style={{
            backgroundColor: badge.color === 'red' ? '#FEE2E2' : badge.color === 'green' ? '#DCFCE7' : '#FEF3C7',
            color: badge.color === 'red' ? '#DC2626' : badge.color === 'green' ? '#16A34A' : '#D97706',
          }}
        >
          {badge.label}
        </span>
      )}
    </div>
  )
}
