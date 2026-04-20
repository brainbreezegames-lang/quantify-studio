import { useState } from 'react'
import { ChevronLeft, Check, CheckCircle2, Wrench, AlertTriangle, Trash2, MapPin, Minus, Plus, AlertCircle } from 'lucide-react'
import { ShipmentItem, ItemFlag } from '../data'
import StickyCTA from '../components/StickyCTA'

interface Props {
  item: ShipmentItem
  onSave: (flag: ItemFlag) => void
  onBack: () => void
}

export default function ConditionCheck({ item, onSave, onBack }: Props) {
  const counted = item.counted ?? 0
  const expected = item.expected

  const existing = item.flag?.kind === 'condition' ? item.flag.data : null
  const [good, setGood] = useState(existing?.good ?? counted)
  const [needsService, setNeedsService] = useState(existing?.needsService ?? 0)
  const [damaged, setDamaged] = useState(existing?.damaged ?? 0)
  const [scrapped, setScrapped] = useState(existing?.scrapped ?? 0)
  const [lost, setLost] = useState(existing?.lost ?? Math.max(0, expected - counted))

  const total = good + needsService + damaged + scrapped + lost
  const isComplete = total === expected
  const remaining = expected - total

  const accentColor = '#D97706'

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Amber hero header — pre-return context */}
      <div className="px-5 pt-[18px] pb-7" style={{ backgroundColor: accentColor }}>
        <div className="flex items-center justify-between mb-[18px]">
          <button onClick={onBack} className="w-11 h-11 rounded-full bg-white/[0.15] flex items-center justify-center no-select pressable">
            <ChevronLeft size={22} color="#fff" strokeWidth={2} />
          </button>
          <div className="w-11" />
        </div>
        <h1 className="text-white text-[28px] font-semibold leading-[1.15] tracking-[-0.6px]">How are they coming back?</h1>
        <p className="text-white/90 text-sm font-semibold mt-[14px]">
          Counted {counted} of {expected} back  ·  account for all {expected}
        </p>
      </div>

      <div className="flex flex-col gap-[14px] p-4 pb-[120px]">
        {/* Item card */}
        <div className="bg-white rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)] overflow-hidden">
          <div className="h-1 w-full" style={{ backgroundColor: accentColor }} />
          <div className="px-[22px] py-[18px]">
            <p className="text-[#0A0A0A] text-[17px] font-bold tracking-[-0.2px] leading-snug">{item.name}</p>
            <p className="text-[#737373] text-[13px] font-medium mt-1">
              {item.partNumber
                ? `${item.partNumber}${item.weightEach ? `  ·  ${item.weightEach} kg each` : ''}`
                : item.subtitle}
            </p>
          </div>
        </div>

        <ConditionCard
          stripe="#16A34A" iconBg="#DCFCE7" iconColor="#16A34A"
          icon={<CheckCircle2 size={18} strokeWidth={2.2} />}
          title="Good" subtitle="Back in stock"
          value={good} max={expected} onChange={setGood}
        />

        <ConditionCard
          stripe="#D97706" iconBg="#FEF3C7" iconColor="#D97706"
          icon={<Wrench size={18} strokeWidth={2.2} />}
          title="Needs service" subtitle="To be inspected before reuse"
          value={needsService} max={expected} onChange={setNeedsService}
        />

        <ConditionCard
          stripe="#EA580C" iconBg="#FFF7ED" iconColor="#EA580C"
          icon={<AlertTriangle size={18} strokeWidth={2.2} />}
          title="Damaged" subtitle="Out of service"
          value={damaged} max={expected} onChange={setDamaged}
        />

        <ConditionCard
          stripe="#DC2626" iconBg="#FEE2E2" iconColor="#DC2626"
          icon={<Trash2 size={18} strokeWidth={2.2} />}
          title="Scrapped" subtitle="Written off"
          value={scrapped} max={expected} onChange={setScrapped}
        />

        <ConditionCard
          stripe="#7C3AED" iconBg="#F5F3FF" iconColor="#7C3AED"
          icon={<MapPin size={18} strokeWidth={2.2} />}
          title="Lost" subtitle="Didn't come back · customer charged"
          value={lost} max={expected} onChange={setLost}
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
                    ? `All ${expected} accounted for`
                    : remaining > 0
                      ? `${remaining} still unaccounted`
                      : `${Math.abs(remaining)} over — reduce a bucket`}
                </p>
                <p className="text-[12px] font-semibold mt-0.5" style={{ color: isComplete ? '#15803D' : '#92400E', opacity: 0.8 }}>
                  {total} of {expected} explained
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StickyCTA
        accentColor={accentColor}
        disabled={!isComplete}
        onClick={() => onSave({ kind: 'condition', data: { good, needsService, damaged, scrapped, lost } })}
      >
        {isComplete ? 'Done' : `${Math.abs(remaining)} ${remaining > 0 ? 'left' : 'over'}`}
      </StickyCTA>
    </div>
  )
}

function ConditionCard({
  stripe, iconBg, iconColor, icon, title, subtitle, value, max, onChange,
}: {
  stripe: string
  iconBg: string
  iconColor: string
  icon: JSX.Element
  title: string
  subtitle: string
  value: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div className="bg-white rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)] overflow-hidden">
      <div className="h-1 w-full" style={{ backgroundColor: stripe }} />
      <div className="px-[22px] py-[18px] flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#0A0A0A] text-[15px] font-bold leading-tight">{title}</p>
          <p className="text-[#737373] text-[12px] font-medium mt-0.5">{subtitle}</p>
        </div>
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
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
            className="w-11 h-11 flex items-center justify-center no-select pressable disabled:opacity-30"
            style={{ backgroundColor: '#FEF3C7' }}
          >
            <Plus size={18} color="#D97706" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  )
}
