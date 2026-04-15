import { useState } from 'react'
import { X, Check, Wrench, Trash2, HelpCircle, Camera, Minus, Plus } from 'lucide-react'
import { ShipmentItem, ItemFlag, shortfall } from '../data'
import StickyCTA from '../components/StickyCTA'

interface Props {
  item: ShipmentItem
  onSave: (flag: ItemFlag) => void
  onBack: () => void
  onPhoto: () => void
}

export default function MissingItems({ item, onSave, onBack, onPhoto }: Props) {
  const gap = shortfall(item)
  const counted = item.counted ?? 0

  const existing = item.flag?.kind === 'shortfall' ? item.flag.data : null
  const [damaged, setDamaged] = useState(existing?.damaged ?? 0)
  const [scrapped, setScrapped] = useState(existing?.scrapped ?? 0)
  const [lostMissing, setLostMissing] = useState(existing?.lostMissing ?? 0)

  const explained = damaged + scrapped + lostMissing
  const remaining = gap - explained
  const isComplete = explained === gap

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Header */}
      <div className="bg-[#1E3FFF] px-5 pt-4 pb-5 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select pressable">
          <X size={20} color="#fff" strokeWidth={2} />
        </button>
        <p className="text-white text-lg font-semibold flex-1 text-center">Missing items</p>
        <div className="w-9" />
      </div>

      {/* Item */}
      <div className="px-6 pt-6 pb-4 border-b border-[#F0F0F0]">
        <p className="text-[#0A0A0A] text-2xl font-semibold">{item.name}</p>
        <p className="text-[#737373] text-sm mt-1">{item.subtitle}</p>
      </div>

      {/* Question */}
      <div className="px-6 py-5 bg-[#FEF3C7] border-b border-[#FDE68A]">
        <p className="text-[#92400E] text-sm font-semibold">You counted {counted}.</p>
        <p className="text-[#0A0A0A] text-2xl font-semibold mt-1">Where are the other {gap}?</p>
        <p className="text-[#525252] text-sm mt-2">Adjust the buckets below until they add up to {gap}.</p>
      </div>

      {/* Loaded good — fixed */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-[#F0F0F0]">
        <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
          <Check size={22} color="#16A34A" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <p className="text-[#0A0A0A] text-base font-semibold">Loaded ({counted} good)</p>
          <p className="text-[#737373] text-sm">Goes to job site as expected</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-[#F5F5F5]">
          <span className="text-[#525252] text-sm font-semibold">Done</span>
        </div>
      </div>

      {/* Damaged */}
      <Bucket
        icon={<Wrench size={22} color="#D97706" strokeWidth={2} />}
        bg="#FEF3C7"
        title="Damaged"
        subtitle="Returnable for repair / inspection"
        value={damaged} max={gap} onChange={setDamaged}
      />
      <div className="h-px bg-[#F0F0F0] mx-6" />

      {/* Scrapped */}
      <Bucket
        icon={<Trash2 size={22} color="#DC2626" strokeWidth={2} />}
        bg="#FEE2E2"
        title="Scrapped"
        subtitle="Write-off — beyond repair"
        value={scrapped} max={gap} onChange={setScrapped}
      />
      <div className="h-px bg-[#F0F0F0] mx-6" />

      {/* Lost / missing */}
      <Bucket
        icon={<HelpCircle size={22} color="#737373" strokeWidth={2} />}
        bg="#F0F0F0"
        title="Lost / missing"
        subtitle="Customer may be charged"
        value={lostMissing} max={gap} onChange={setLostMissing}
      />

      {/* Total bar */}
      <div
        className="mx-6 mt-4 px-5 py-4 rounded-2xl flex items-center justify-between"
        style={{ backgroundColor: isComplete ? '#F0FDF4' : '#FEF3C7' }}
      >
        <p className="text-base font-semibold" style={{ color: isComplete ? '#15803D' : '#92400E' }}>
          {isComplete
            ? `Total: ${item.expected} of ${item.expected} — Balanced`
            : remaining > 0
              ? `${remaining} still unaccounted for`
              : `${Math.abs(remaining)} over — reduce a bucket`}
        </p>
        {isComplete && (
          <div className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center flex-shrink-0">
            <Check size={16} color="#fff" strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Photo evidence */}
      <div className="px-6 pt-5 pb-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[#0A0A0A] text-sm font-semibold">Photo evidence</p>
          <span className="text-[#A3A3A3] text-xs">Recommended</span>
        </div>
        <p className="text-[#737373] text-xs mb-3">Helps the office see what happened.</p>
        <button
          onClick={onPhoto}
          className="w-24 h-24 rounded-2xl border border-dashed border-[#1E3FFF] bg-[#EEF2FF] flex flex-col items-center justify-center gap-1 no-select pressable"
        >
          <Camera size={24} color="#1E3FFF" strokeWidth={1.8} />
          <span className="text-[#1E3FFF] text-[11px] font-semibold">Take photo</span>
        </button>
      </div>

      <div className="flex-1" />

      <StickyCTA
        accentColor="#1E3FFF"
        disabled={!isComplete}
        onClick={() => onSave({ kind: 'shortfall', data: { good: counted, damaged, scrapped, lostMissing } })}
      >
        {isComplete ? 'Save split' : `${Math.abs(remaining)} ${remaining > 0 ? 'unaccounted' : 'over'}`}
      </StickyCTA>
    </div>
  )
}

function Bucket({ icon, bg, title, subtitle, value, max, onChange }: {
  icon: JSX.Element; bg: string; title: string; subtitle: string
  value: number; max: number; onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-5">
      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>{icon}</div>
      <div className="flex-1">
        <p className="text-[#0A0A0A] text-base font-semibold">{title}</p>
        <p className="text-[#737373] text-sm">{subtitle}</p>
      </div>
      <div className="flex items-center rounded-2xl border border-[#D4D4D4] bg-white overflow-hidden flex-shrink-0">
        <button onClick={() => onChange(Math.max(0, value - 1))} className="w-12 h-12 flex items-center justify-center no-select pressable">
          <Minus size={18} color="#525252" strokeWidth={2} />
        </button>
        <div className="w-14 h-12 bg-[#FAFAFA] flex items-center justify-center border-x border-[#D4D4D4]">
          <span className="text-lg font-semibold" style={{ color: value === 0 ? '#999' : '#0A0A0A' }}>{value}</span>
        </div>
        <button onClick={() => onChange(Math.min(max, value + 1))} className="w-12 h-12 flex items-center justify-center no-select pressable">
          <Plus size={18} color="#1E3FFF" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
