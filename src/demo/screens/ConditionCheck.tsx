import { useState } from 'react'
import { X, Check, CheckCircle2, Wrench, AlertTriangle, Trash2, MapPin, Minus, Plus } from 'lucide-react'
import { ShipmentItem, ItemFlag } from '../data'

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

  function handleSave() {
    onSave({
      kind: 'condition',
      data: { good, needsService, damaged, scrapped, lost },
    })
  }

  const accentColor = '#D97706'

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Header */}
      <div className="px-5 pt-4 pb-5 flex items-center gap-3" style={{ backgroundColor: accentColor }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select pressable">
          <X size={20} color="#fff" strokeWidth={2} />
        </button>
        <p className="text-white text-lg font-semibold flex-1 text-center">Condition check</p>
        <div className="w-9" />
      </div>

      {/* Item header */}
      <div className="px-6 pt-6 pb-4 border-b border-[#F0F0F0]">
        <p className="text-[#0A0A0A] text-2xl font-semibold">{item.name}</p>
        <p className="text-[#737373] text-sm mt-1">{item.subtitle}</p>
      </div>

      {/* Question */}
      <div className="px-6 py-5 bg-[#FEF3C7] border-b border-[#FDE68A]">
        <p className="text-[#92400E] text-sm font-semibold">You counted {counted} back.</p>
        <p className="text-[#0A0A0A] text-xl font-semibold mt-1">How are they coming back?</p>
        <p className="text-[#525252] text-sm mt-2">
          Account for all {expected} expected — use Lost for anything that didn't come back.
        </p>
      </div>

      {/* Condition buckets */}
      <div className="flex flex-col">
        <ConditionRow
          icon={<CheckCircle2 size={22} color="#16A34A" strokeWidth={2} />}
          bg="#DCFCE7"
          title="Good"
          subtitle="Back in stock"
          value={good}
          onChange={setGood}
          max={expected}
        />
        <div className="h-px bg-[#F0F0F0] mx-6" />
        <ConditionRow
          icon={<Wrench size={22} color="#D97706" strokeWidth={2} />}
          bg="#FEF3C7"
          title="Needs service"
          subtitle="To be inspected before reuse"
          value={needsService}
          onChange={setNeedsService}
          max={expected}
        />
        <div className="h-px bg-[#F0F0F0] mx-6" />
        <ConditionRow
          icon={<AlertTriangle size={22} color="#EA580C" strokeWidth={2} />}
          bg="#FFF7ED"
          title="Damaged"
          subtitle="Out of service"
          value={damaged}
          onChange={setDamaged}
          max={expected}
        />
        <div className="h-px bg-[#F0F0F0] mx-6" />
        <ConditionRow
          icon={<Trash2 size={22} color="#DC2626" strokeWidth={2} />}
          bg="#FEE2E2"
          title="Scrapped"
          subtitle="Written off"
          value={scrapped}
          onChange={setScrapped}
          max={expected}
        />
        <div className="h-px bg-[#F0F0F0] mx-6" />
        <ConditionRow
          icon={<MapPin size={22} color="#7C3AED" strokeWidth={2} />}
          bg="#F5F3FF"
          title="Lost"
          subtitle="Didn't come back · customer charged"
          value={lost}
          onChange={setLost}
          max={expected}
        />
      </div>

      {/* Total bar */}
      <div
        className="mx-6 mt-4 px-5 py-4 rounded-2xl flex items-center justify-between"
        style={{ backgroundColor: isComplete ? '#F0FDF4' : '#FEF3C7' }}
      >
        <p
          className="text-base font-semibold"
          style={{ color: isComplete ? '#15803D' : '#92400E' }}
        >
          {isComplete
            ? `All ${expected} accounted for`
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

      {/* Done button */}
      <div className="px-6 pt-4 pb-8 mt-auto">
        <button
          onClick={handleSave}
          disabled={!isComplete}
          className="w-full h-14 rounded-2xl text-white text-base font-semibold no-select pressable disabled:opacity-40"
          style={{ backgroundColor: accentColor }}
        >
          Done
        </button>
      </div>
    </div>
  )
}

interface ConditionRowProps {
  icon: JSX.Element
  bg: string
  title: string
  subtitle: string
  value: number
  max: number
  onChange: (v: number) => void
}

function ConditionRow({ icon, bg, title, subtitle, value, max, onChange }: ConditionRowProps) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#0A0A0A] text-base font-semibold">{title}</p>
        <p className="text-[#737373] text-sm">{subtitle}</p>
      </div>
      {/* Stepper */}
      <div className="flex items-center rounded-2xl border border-[#D4D4D4] bg-white overflow-hidden flex-shrink-0">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-11 h-11 flex items-center justify-center no-select pressable"
        >
          <Minus size={18} color="#525252" strokeWidth={2} />
        </button>
        <div className="w-12 h-11 bg-[#FAFAFA] flex items-center justify-center border-x border-[#D4D4D4]">
          <span className="text-base font-semibold" style={{ color: value === 0 ? '#999' : '#0A0A0A' }}>{value}</span>
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-11 h-11 flex items-center justify-center no-select pressable"
        >
          <Plus size={18} color="#D97706" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
