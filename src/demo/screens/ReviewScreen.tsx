import { useState } from 'react'
import { ChevronLeft, AlertTriangle, Flag, Clock, ArrowRight, ArrowLeft, StickyNote } from 'lucide-react'
import { Shipment, ShipmentItem, flagBadge } from '../data'

interface Props {
  shipment: Shipment
  items: ShipmentItem[]
  onBack: () => void
  onConfirm: () => void
}

export default function ReviewScreen({ shipment, items, onBack, onConfirm }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [notes, setNotes] = useState('')
  const [notesOpen, setNotesOpen] = useState(false)
  const isReturn = shipment.type === 'PRE-RETURN'
  const accentColor = isReturn ? '#D97706' : '#1E3FFF'

  function handleConfirm() {
    setSubmitting(true)
    setTimeout(() => onConfirm(), 800)
  }

  const variances = items.filter(i => i.counted !== null && i.counted !== i.expected)
  const flagged = items.filter(i => i.flag !== null)
  const flaggedIds = new Set(flagged.map(i => i.id))

  // Merge variances + any flagged-but-not-variance items into one reviewable list
  const reviewList = [
    ...variances,
    ...flagged.filter(i => !variances.some(v => v.id === i.id)),
  ]

  const totalCounted = items.reduce((s, i) => s + (i.counted ?? 0), 0)
  const allCounted = items.every(i => i.counted !== null)

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Blue hero header */}
      <div className="px-5 pt-[18px] pb-7" style={{ backgroundColor: accentColor }}>
        <div className="flex items-center justify-between mb-[18px]">
          <button onClick={onBack} className="w-11 h-11 rounded-full bg-white/[0.15] flex items-center justify-center no-select pressable">
            <ChevronLeft size={22} color="#fff" strokeWidth={2} />
          </button>
          <div className="w-11" />
        </div>
        <h1 className="text-white text-[28px] font-semibold leading-[1.15] tracking-[-0.6px]">Review before submit</h1>
        <p className="text-white/90 text-sm font-semibold mt-[14px]">
          {shipment.id}  ·  {shipment.jobsite}
        </p>
      </div>

      <div className="flex flex-col gap-[14px] p-4 pb-[140px]">
        {/* Summary card */}
        <div className="bg-white rounded-[20px] overflow-hidden border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)]">
          <div className="h-1 w-full bg-[#15803D]" />
          <div className="px-[22px] pt-[18px] pb-[18px] flex flex-col gap-1.5">
            <p className="text-[#0A0A0A] text-[22px] font-bold tracking-[-0.4px] leading-tight">
              {allCounted ? `All ${items.length} items counted` : `${items.length} items counted`}
            </p>
            <p className="text-[#525252] text-[13px] font-medium">
              Office will review {variances.length} variance{variances.length !== 1 ? 's' : ''} and {flagged.length} flagged item{flagged.length !== 1 ? 's' : ''} before rent starts.
            </p>
          </div>

          <div className="h-px bg-[#F0F0F0]" />

          <div className="flex">
            <StatCell value={totalCounted.toLocaleString()} label="Units" bg="#FFFFFF" numColor="#0A0A0A" labelColor="#737373" />
            <div className="w-px bg-[#F0F0F0]" />
            <StatCell
              value={String(variances.length)}
              label="VARIANCES"
              bg={variances.length > 0 ? '#FEF3C7' : '#FFFFFF'}
              numColor={variances.length > 0 ? '#92400E' : '#0A0A0A'}
              labelColor={variances.length > 0 ? '#92400E' : '#737373'}
            />
            <div className="w-px bg-[#F0F0F0]" />
            <StatCell
              value={String(flagged.length)}
              label="FLAGGED"
              bg={flagged.length > 0 ? '#FEE2E2' : '#FFFFFF'}
              numColor={flagged.length > 0 ? '#991B1B' : '#0A0A0A'}
              labelColor={flagged.length > 0 ? '#991B1B' : '#737373'}
            />
          </div>
        </div>

        {/* Variances / flagged — merged card */}
        {reviewList.length > 0 && (
          <div className="bg-white rounded-[20px] overflow-hidden border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)]">
            <div className="h-1 w-full bg-[#F59E0B]" />
            <div className="px-[22px] pt-4 pb-[14px] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={16} color="#92400E" strokeWidth={2.2} />
              </div>
              <p className="text-[#0A0A0A] text-[15px] font-bold">
                {reviewList.length} {reviewList.length === 1 ? 'item' : 'items'} to review
              </p>
            </div>

            <div className="h-px bg-[#F0F0F0]" />

            {reviewList.map((item, idx) => (
              <div key={item.id}>
                <VarianceRow item={item} isFlagged={flaggedIds.has(item.id)} />
                {idx < reviewList.length - 1 && <div className="h-px bg-[#F5F5F5] mx-[22px]" />}
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        <div className="bg-white rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)] px-[22px] py-[18px] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <StickyNote size={16} color="#525252" strokeWidth={2} />
              <p className="text-[#0A0A0A] text-[15px] font-bold">Notes for office</p>
            </div>
            <span className="text-[#737373] text-[11px] font-bold uppercase" style={{ letterSpacing: 0.5 }}>Optional</span>
          </div>
          {notesOpen || notes ? (
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              onBlur={() => setNotesOpen(false)}
              autoFocus={notesOpen}
              placeholder="Add any context for the office team…"
              className="w-full min-h-[84px] bg-[#F5F5F5] rounded-[14px] px-4 py-3 text-[14px] font-medium text-[#0A0A0A] placeholder:text-[#737373] outline-none resize-none"
              style={{ WebkitAppearance: 'none', appearance: 'none', colorScheme: 'light' }}
            />
          ) : (
            <button
              onClick={() => setNotesOpen(true)}
              className="w-full bg-[#F5F5F5] rounded-[14px] px-4 py-3 text-left no-select pressable"
            >
              <span className="text-[14px] font-medium text-[#737373]">Add a note for the office team…</span>
            </button>
          )}
        </div>

        {/* Rent doesn't start yet — the load-bearing message */}
        <div
          data-spot="rent-info"
          className="rounded-[20px] border px-5 py-[18px] flex items-start gap-3"
          style={{ backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }}
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <Clock size={16} color="#1E3FFF" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-[#1E1B4B] text-[15px] font-bold leading-tight">
              {isReturn ? "Rent doesn't stop yet" : "Rent doesn't start yet"}
            </p>
            <p className="text-[#3730A3] text-[13px] font-medium leading-relaxed">
              {isReturn
                ? 'Your counts go to the office for review. Rent stops only after the office confirms this return.'
                : 'Your counts go to the office for review. Rent begins only after the office confirms and the truck reaches the customer.'}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky action bar — primary + secondary */}
      <div className="fixed bottom-0 left-0 right-0 md:absolute md:bottom-0 bg-white border-t border-[#EAEAEA] px-4 pt-[14px] pb-5 flex flex-col gap-2.5">
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="w-full h-[56px] rounded-2xl flex items-center justify-center gap-2 no-select pressable disabled:opacity-70 transition-colors"
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 8px 20px ${accentColor}40, 0 2px 6px rgba(0,0,0,0.08)`,
          }}
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span className="text-white text-[17px] font-bold tracking-[-0.1px]">Send to office</span>
              <ArrowRight size={18} color="#fff" strokeWidth={2.5} />
            </>
          )}
        </button>
        <button
          onClick={onBack}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-1.5 no-select pressable disabled:opacity-50"
        >
          <ArrowLeft size={14} color="#525252" strokeWidth={2.2} />
          <span className="text-[#525252] text-[13px] font-bold">Go back and edit</span>
        </button>
      </div>

    </div>
  )
}

function StatCell({ value, label, bg, numColor, labelColor }: {
  value: string; label: string; bg: string; numColor: string; labelColor: string
}) {
  return (
    <div
      className="flex-1 py-[18px] flex flex-col items-center gap-1"
      style={{ backgroundColor: bg }}
    >
      <span className="text-[24px] font-bold tracking-[-0.4px] leading-none" style={{ color: numColor }}>{value}</span>
      <span
        className="text-[11px] font-bold uppercase"
        style={{ color: labelColor, letterSpacing: 0.6 }}
      >
        {label}
      </span>
    </div>
  )
}

function VarianceRow({ item, isFlagged }: { item: ShipmentItem; isFlagged: boolean }) {
  const diff = (item.counted ?? 0) - item.expected
  const isOver = diff > 0
  const isShortItem = diff < 0
  const badge = flagBadge(item)

  // Pill color: red if flagged OR large shortage, amber otherwise
  const pillBg = isFlagged || (isShortItem && Math.abs(diff) >= 10) ? '#FEE2E2' : isOver ? '#DCFCE7' : '#FEF3C7'
  const pillColor = isFlagged || (isShortItem && Math.abs(diff) >= 10) ? '#991B1B' : isOver ? '#15803D' : '#92400E'

  return (
    <div className="px-[22px] py-[14px] flex items-center gap-3">
      {isFlagged && <Flag size={16} color="#DC2626" strokeWidth={2} fill="#DC2626" />}
      <div className="flex-1 min-w-0 flex flex-col gap-[3px]">
        <p className="text-[#0A0A0A] text-[15px] font-bold leading-tight">{item.name}</p>
        <p className="text-[#737373] text-xs font-medium">
          Expected {item.expected}  ·  Counted {item.counted}
          {badge ? `  ·  ${badge.label.toLowerCase()}` : ''}
        </p>
      </div>
      <span
        className="text-sm font-bold px-3 py-1.5 rounded-[10px]"
        style={{ backgroundColor: pillBg, color: pillColor }}
      >
        {isOver ? '+' : ''}{diff}
      </span>
    </div>
  )
}
