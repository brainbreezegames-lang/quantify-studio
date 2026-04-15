import { useState } from 'react'
import { ShipmentItem, ItemFlag } from '../data'

const SW = { fontFamily: 'Switzer, sans-serif' }

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
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <p className="text-white text-lg font-semibold flex-1 text-center" style={SW}>Condition check</p>
        <div className="w-9" />
      </div>

      {/* Item header */}
      <div className="px-6 pt-6 pb-4 border-b border-[#F0F0F0]">
        <p className="text-[#0A0A0A] text-2xl font-semibold" style={SW}>{item.name}</p>
        <p className="text-[#737373] text-sm mt-1" style={SW}>{item.subtitle}</p>
      </div>

      {/* Question */}
      <div className="px-6 py-5 bg-[#FEF3C7] border-b border-[#FDE68A]">
        <p className="text-[#92400E] text-sm font-semibold" style={SW}>You counted {counted} back.</p>
        <p className="text-[#0A0A0A] text-xl font-semibold mt-1" style={SW}>How are they coming back?</p>
        <p className="text-[#525252] text-sm mt-2" style={SW}>
          Account for all {expected} expected — use Lost for anything that didn't come back.
        </p>
      </div>

      {/* Condition buckets */}
      <div className="flex flex-col">
        <ConditionRow
          icon="check-circle"
          color="#16A34A"
          bg="#DCFCE7"
          title="Good"
          subtitle="Back in stock"
          value={good}
          onChange={setGood}
          max={expected}
        />
        <div className="h-px bg-[#F0F0F0] mx-6" />
        <ConditionRow
          icon="tool"
          color="#D97706"
          bg="#FEF3C7"
          title="Needs service"
          subtitle="To be inspected before reuse"
          value={needsService}
          onChange={setNeedsService}
          max={expected}
        />
        <div className="h-px bg-[#F0F0F0] mx-6" />
        <ConditionRow
          icon="alert-triangle"
          color="#EA580C"
          bg="#FFF7ED"
          title="Damaged"
          subtitle="Out of service"
          value={damaged}
          onChange={setDamaged}
          max={expected}
        />
        <div className="h-px bg-[#F0F0F0] mx-6" />
        <ConditionRow
          icon="trash"
          color="#DC2626"
          bg="#FEE2E2"
          title="Scrapped"
          subtitle="Written off"
          value={scrapped}
          onChange={setScrapped}
          max={expected}
        />
        <div className="h-px bg-[#F0F0F0] mx-6" />
        <ConditionRow
          icon="map-pin"
          color="#7C3AED"
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
          style={{ color: isComplete ? '#15803D' : '#92400E', fontFamily: 'Switzer, sans-serif' }}
        >
          {isComplete
            ? `All ${expected} accounted for`
            : remaining > 0
              ? `${remaining} still unaccounted for`
              : `${Math.abs(remaining)} over — reduce a bucket`}
        </p>
        {isComplete && (
          <div className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        )}
      </div>

      {/* Done button */}
      <div className="px-6 pt-4 pb-8 mt-auto">
        <button
          onClick={handleSave}
          disabled={!isComplete}
          className="w-full h-14 rounded-2xl text-white text-base font-semibold no-select active:opacity-90 transition-opacity disabled:opacity-40"
          style={{ backgroundColor: accentColor, fontFamily: 'Switzer, sans-serif' }}
        >
          Done
        </button>
      </div>
    </div>
  )
}

// ─── Condition row ────────────────────────────────────────────────────────────

interface ConditionRowProps {
  icon: string
  color: string
  bg: string
  title: string
  subtitle: string
  value: number
  max: number
  onChange: (v: number) => void
}

function ConditionRow({ icon, color, bg, title, subtitle, value, max, onChange }: ConditionRowProps) {
  const icons: Record<string, JSX.Element> = {
    'check-circle': <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>,
    'tool': <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
    'alert-triangle': <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    'trash': <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    'map-pin': <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  }

  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
        {icons[icon]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#0A0A0A] text-base font-semibold" style={SW}>{title}</p>
        <p className="text-[#737373] text-sm" style={SW}>{subtitle}</p>
      </div>
      {/* Stepper */}
      <div className="flex items-center rounded-2xl border border-[#D4D4D4] bg-white overflow-hidden flex-shrink-0">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-11 h-11 flex items-center justify-center no-select active:bg-[#F5F5F5]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div className="w-12 h-11 bg-[#FAFAFA] flex items-center justify-center border-x border-[#D4D4D4]">
          <span className="text-base font-semibold" style={{ color: value === 0 ? '#999' : '#0A0A0A', fontFamily: 'Switzer, sans-serif' }}>{value}</span>
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-11 h-11 flex items-center justify-center no-select active:bg-[#F5F5F5]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
    </div>
  )
}
