import { useState } from 'react'
import { ShipmentItem, ItemFlag, shortfall } from '../data'

const SW = { fontFamily: 'Switzer, sans-serif' }

interface Props {
  item: ShipmentItem
  onSave: (flag: ItemFlag) => void
  onBack: () => void
}

export default function MissingItems({ item, onSave, onBack }: Props) {
  const gap = shortfall(item)
  const counted = item.counted ?? 0
  const expected = item.expected

  // Initialise from existing flag if any
  const existing = item.flag?.kind === 'shortfall' ? item.flag.data : null
  const [damaged, setDamaged] = useState(existing?.damaged ?? 0)
  const [broken, setBroken] = useState(existing?.broken ?? 0)
  const [missing, setMissing] = useState(existing?.missing ?? 0)

  const explained = damaged + broken + missing
  const remaining = gap - explained
  const isComplete = explained === gap

  function handleSave() {
    onSave({
      kind: 'shortfall',
      data: { damaged, broken, missing },
    })
  }

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Header */}
      <div className="bg-[#1E3FFF] px-5 pt-4 pb-5 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <p className="text-white text-lg font-semibold flex-1 text-center" style={SW}>Missing items</p>
        <div className="w-9" />
      </div>

      {/* Item header */}
      <div className="px-6 pt-6 pb-4 border-b border-[#F0F0F0]">
        <p className="text-[#0A0A0A] text-2xl font-semibold" style={SW}>{item.name}</p>
        <p className="text-[#737373] text-sm mt-1" style={SW}>{item.subtitle}</p>
      </div>

      {/* Question */}
      <div className="px-6 py-5 bg-[#FEF3C7] border-b border-[#FDE68A]">
        <p className="text-[#92400E] text-sm font-semibold" style={SW}>You counted {counted}.</p>
        <p className="text-[#0A0A0A] text-2xl font-semibold mt-1" style={SW}>Where are the other {gap}?</p>
        <p className="text-[#525252] text-sm mt-2" style={SW}>Adjust the buckets below until they add up to {gap}.</p>
      </div>

      {/* Good row — fixed, not adjustable */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-[#F0F0F0]">
        <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div className="flex-1">
          <p className="text-[#0A0A0A] text-base font-semibold" style={SW}>{counted} good</p>
          <p className="text-[#737373] text-sm" style={SW}>Going to the job site</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-[#F5F5F5]">
          <span className="text-[#525252] text-sm font-semibold" style={SW}>Done</span>
        </div>
      </div>

      {/* Damaged */}
      <BucketRow
        icon="wrench"
        color="#D97706"
        bg="#FEF3C7"
        title="Damaged"
        subtitle="Can be repaired"
        value={damaged}
        onChange={setDamaged}
        max={gap}
      />
      <div className="h-px bg-[#F0F0F0] mx-6" />

      {/* Broken */}
      <BucketRow
        icon="x-circle"
        color="#DC2626"
        bg="#FEE2E2"
        title="Broken"
        subtitle="Can't be fixed"
        value={broken}
        onChange={setBroken}
        max={gap}
      />
      <div className="h-px bg-[#F0F0F0] mx-6" />

      {/* Missing */}
      <BucketRow
        icon="help-circle"
        color="#737373"
        bg="#F0F0F0"
        title="Missing"
        subtitle="Can't find them"
        value={missing}
        onChange={setMissing}
        max={gap}
      />

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
          <div className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        )}
      </div>

      {/* Photo hint */}
      <div className="px-6 pt-5 pb-2">
        <p className="text-[#0A0A0A] text-sm font-semibold" style={SW}>Add a photo</p>
        <p className="text-[#737373] text-xs mt-1" style={SW}>Helpful so the office can see what happened.</p>
        <div className="mt-3 w-24 h-24 rounded-2xl border border-dashed border-[#1E3FFF] bg-[#EEF2FF] flex flex-col items-center justify-center gap-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E3FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <span className="text-[#1E3FFF] text-[11px] font-semibold" style={SW}>Take photo</span>
        </div>
      </div>

      {/* Done button */}
      <div className="px-6 pt-4 pb-8 mt-auto">
        <button
          onClick={handleSave}
          disabled={!isComplete}
          className="w-full h-14 rounded-2xl text-white text-base font-semibold no-select active:opacity-90 transition-opacity disabled:opacity-40"
          style={{ backgroundColor: '#1E3FFF', fontFamily: 'Switzer, sans-serif' }}
        >
          Done
        </button>
      </div>
    </div>
  )
}

// ─── Bucket row ───────────────────────────────────────────────────────────────

interface BucketProps {
  icon: string
  color: string
  bg: string
  title: string
  subtitle: string
  value: number
  max: number
  onChange: (v: number) => void
}

function BucketRow({ icon, color, bg, title, subtitle, value, max, onChange }: BucketProps) {
  const icons: Record<string, JSX.Element> = {
    wrench: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
    'x-circle': <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
    'help-circle': <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  }

  return (
    <div className="flex items-center gap-4 px-6 py-5">
      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
        {icons[icon]}
      </div>
      <div className="flex-1">
        <p className="text-[#0A0A0A] text-base font-semibold" style={SW}>{title}</p>
        <p className="text-[#737373] text-sm" style={SW}>{subtitle}</p>
      </div>
      {/* Stepper */}
      <div className="flex items-center rounded-2xl border border-[#D4D4D4] bg-white overflow-hidden">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-12 h-12 flex items-center justify-center no-select active:bg-[#F5F5F5]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div className="w-14 h-12 bg-[#FAFAFA] flex items-center justify-center border-x border-[#D4D4D4]">
          <span className="text-lg font-semibold text-[#0A0A0A]" style={SW}>{value === 0 ? <span className="text-[#999]">0</span> : value}</span>
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-12 h-12 flex items-center justify-center no-select active:bg-[#F5F5F5]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E3FFF" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
    </div>
  )
}
