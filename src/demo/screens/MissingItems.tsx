import { useState } from 'react'
import { ChevronLeft, Check, Wrench, Trash2, HelpCircle, Camera, Minus, Plus, AlertCircle } from 'lucide-react'
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
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Blue hero header — primary screen style */}
      <div className="bg-[#1E3FFF] px-5 pt-[18px] pb-7">
        <div className="flex items-center justify-between mb-[18px]">
          <button onClick={onBack} className="w-11 h-11 rounded-full bg-white/[0.15] flex items-center justify-center no-select pressable">
            <ChevronLeft size={22} color="#fff" strokeWidth={2} />
          </button>
          <div className="w-11" />
        </div>
        <h1 className="text-white text-[28px] font-semibold leading-[1.15] tracking-[-0.6px]">Where are the other {gap}?</h1>
        <p className="text-white/90 text-sm font-semibold mt-[14px]">
          Counted {counted} of {item.expected}  ·  {gap} unaccounted
        </p>
      </div>

      <div className="flex flex-col gap-[14px] p-4 pb-[120px]">
        {/* Item card */}
        <div className="bg-white rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)] overflow-hidden">
          <div className="h-1 w-full bg-[#1E3FFF]" />
          <div className="px-[22px] py-[18px]">
            <p className="text-[#0A0A0A] text-[17px] font-bold tracking-[-0.2px] leading-snug">{item.name}</p>
            <p className="text-[#737373] text-[13px] font-medium mt-1">
              {item.partNumber
                ? `${item.partNumber}${item.weightEach ? `  ·  ${item.weightEach} kg each` : ''}`
                : item.subtitle}
            </p>
          </div>
        </div>

        {/* Loaded — read-only */}
        <BucketCard
          stripe="#15803D"
          iconBg="#DCFCE7"
          iconColor="#15803D"
          icon={<Check size={18} strokeWidth={2.5} />}
          title="Loaded"
          subtitle="Goes to the job site"
          value={counted}
          lockedBadge="FIXED"
        />

        {/* Damaged */}
        <BucketCard
          stripe="#F59E0B"
          iconBg="#FEF3C7"
          iconColor="#D97706"
          icon={<Wrench size={18} strokeWidth={2.2} />}
          title="Damaged"
          subtitle="Returnable for repair / inspection"
          value={damaged}
          max={gap}
          onChange={setDamaged}
        />

        {/* Scrapped */}
        <BucketCard
          stripe="#DC2626"
          iconBg="#FEE2E2"
          iconColor="#DC2626"
          icon={<Trash2 size={18} strokeWidth={2.2} />}
          title="Scrapped"
          subtitle="Write-off — beyond repair"
          value={scrapped}
          max={gap}
          onChange={setScrapped}
        />

        {/* Lost / missing */}
        <BucketCard
          stripe="#7C3AED"
          iconBg="#F5F3FF"
          iconColor="#7C3AED"
          icon={<HelpCircle size={18} strokeWidth={2.2} />}
          title="Lost / missing"
          subtitle="Customer may be charged"
          value={lostMissing}
          max={gap}
          onChange={setLostMissing}
        />

        {/* Running total */}
        <div
          className="rounded-[20px] border overflow-hidden shadow-[0_4px_16px_rgba(10,13,30,0.04)]"
          style={{
            backgroundColor: isComplete ? '#F0FDF4' : '#FEF3C7',
            borderColor: isComplete ? '#BBF7D0' : '#FDE68A',
          }}
        >
          <div className="h-1 w-full" style={{ backgroundColor: isComplete ? '#15803D' : '#F59E0B' }} />
          <div className="px-[22px] py-[18px] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: isComplete ? '#DCFCE7' : '#FDE68A' }}
              >
                {isComplete
                  ? <Check size={16} color="#15803D" strokeWidth={2.5} />
                  : <AlertCircle size={16} color="#92400E" strokeWidth={2.2} />}
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-bold leading-tight" style={{ color: isComplete ? '#15803D' : '#92400E' }}>
                  {isComplete
                    ? `All ${item.expected} accounted for`
                    : remaining > 0
                      ? `${remaining} still unaccounted`
                      : `${Math.abs(remaining)} over — reduce a bucket`}
                </p>
                <p className="text-[12px] font-semibold mt-0.5" style={{ color: isComplete ? '#15803D' : '#92400E', opacity: 0.8 }}>
                  {explained} of {gap} explained
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Photo evidence */}
        <div className="bg-white rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)] overflow-hidden">
          <div className="px-[22px] py-[18px] flex items-center justify-between">
            <div>
              <p className="text-[#0A0A0A] text-[15px] font-bold">Photo evidence</p>
              <p className="text-[#737373] text-[12px] font-medium mt-0.5">Recommended for damaged / scrapped</p>
            </div>
            <button
              onClick={onPhoto}
              className="flex items-center gap-2 px-4 py-[10px] rounded-full no-select pressable"
              style={{ backgroundColor: '#EEF2FF' }}
            >
              <Camera size={16} color="#1E3FFF" strokeWidth={2.2} />
              <span className="text-[#1E3FFF] text-[13px] font-bold">Take photo</span>
            </button>
          </div>
        </div>
      </div>

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

function BucketCard({
  stripe, iconBg, iconColor, icon, title, subtitle, value, max, onChange, lockedBadge,
}: {
  stripe: string
  iconBg: string
  iconColor: string
  icon: JSX.Element
  title: string
  subtitle: string
  value: number
  max?: number
  onChange?: (v: number) => void
  lockedBadge?: string
}) {
  const readOnly = !onChange
  return (
    <div className="bg-white rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)] overflow-hidden">
      <div className="h-1 w-full" style={{ backgroundColor: stripe }} />
      <div className="px-[22px] py-[18px] flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#0A0A0A] text-[15px] font-bold leading-tight">{title}</p>
          <p className="text-[#737373] text-[12px] font-medium mt-0.5">{subtitle}</p>
        </div>

        {readOnly ? (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#0A0A0A] text-[22px] font-bold tracking-[-0.3px]">{value}</span>
            {lockedBadge && (
              <span
                className="text-[10px] font-bold px-2 py-[3px] rounded-full"
                style={{ backgroundColor: '#F3F4F6', color: '#525252', letterSpacing: 0.5 }}
              >
                {lockedBadge}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center rounded-full bg-[#F5F5F5] flex-shrink-0 overflow-hidden">
            <button
              onClick={() => onChange(Math.max(0, value - 1))}
              disabled={value === 0}
              className="w-11 h-11 flex items-center justify-center no-select pressable disabled:opacity-30"
            >
              <Minus size={18} color="#525252" strokeWidth={2.2} />
            </button>
            <span className="min-w-[40px] text-center text-[#0A0A0A] text-[17px] font-bold">{value}</span>
            <button
              onClick={() => onChange(Math.min(max ?? 999, value + 1))}
              disabled={value >= (max ?? 999)}
              className="w-11 h-11 flex items-center justify-center no-select pressable disabled:opacity-30"
              style={{ backgroundColor: '#EEF2FF' }}
            >
              <Plus size={18} color="#1E3FFF" strokeWidth={2.4} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
