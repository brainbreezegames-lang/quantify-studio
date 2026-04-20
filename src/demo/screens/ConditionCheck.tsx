import { useState } from 'react'
import { ChevronLeft, Check, CheckCircle2, Wrench, AlertTriangle, Trash2, MapPin, AlertCircle, Delete } from 'lucide-react'
import { ShipmentItem, ItemFlag } from '../data'
import StickyCTA from '../components/StickyCTA'

type BucketKey = 'good' | 'needsService' | 'damaged' | 'scrapped' | 'lost'

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

  const [editing, setEditing] = useState<BucketKey | null>(null)
  const [editValue, setEditValue] = useState('')

  const total = good + needsService + damaged + scrapped + lost
  const isComplete = total === expected
  const remaining = expected - total

  const accentColor = '#D97706'

  function openKeypad(bucket: BucketKey, current: number) {
    setEditing(bucket)
    setEditValue(current > 0 ? String(current) : '')
  }

  function commitKeypad() {
    if (!editing) return
    const n = Math.max(0, Math.min(expected, parseInt(editValue || '0', 10)))
    if (editing === 'good') setGood(n)
    if (editing === 'needsService') setNeedsService(n)
    if (editing === 'damaged') setDamaged(n)
    if (editing === 'scrapped') setScrapped(n)
    if (editing === 'lost') setLost(n)
    setEditing(null)
    setEditValue('')
  }

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
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
          value={good} onTapNumber={() => openKeypad('good', good)}
        />

        <ConditionCard
          stripe="#D97706" iconBg="#FEF3C7" iconColor="#D97706"
          icon={<Wrench size={18} strokeWidth={2.2} />}
          title="Needs service" subtitle="To be inspected before reuse"
          value={needsService} onTapNumber={() => openKeypad('needsService', needsService)}
        />

        <ConditionCard
          stripe="#EA580C" iconBg="#FFF7ED" iconColor="#EA580C"
          icon={<AlertTriangle size={18} strokeWidth={2.2} />}
          title="Damaged" subtitle="Out of service"
          value={damaged} onTapNumber={() => openKeypad('damaged', damaged)}
        />

        <ConditionCard
          stripe="#DC2626" iconBg="#FEE2E2" iconColor="#DC2626"
          icon={<Trash2 size={18} strokeWidth={2.2} />}
          title="Scrapped" subtitle="Written off"
          value={scrapped} onTapNumber={() => openKeypad('scrapped', scrapped)}
        />

        <ConditionCard
          stripe="#7C3AED" iconBg="#F5F3FF" iconColor="#7C3AED"
          icon={<MapPin size={18} strokeWidth={2.2} />}
          title="Lost" subtitle="Didn't come back · customer charged"
          value={lost} onTapNumber={() => openKeypad('lost', lost)}
        />

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

      {editing && (
        <BucketKeypad
          bucket={editing}
          value={editValue}
          maxValue={expected}
          onInput={(d) => setEditValue(v => (v.length < 4 ? v + d : v))}
          onBackspace={() => setEditValue(v => v.slice(0, -1))}
          onClear={() => setEditValue('')}
          onCancel={() => { setEditing(null); setEditValue('') }}
          onConfirm={commitKeypad}
        />
      )}
    </div>
  )
}

function ConditionCard({
  stripe, iconBg, iconColor, icon, title, subtitle, value, onTapNumber,
}: {
  stripe: string
  iconBg: string
  iconColor: string
  icon: JSX.Element
  title: string
  subtitle: string
  value: number
  onTapNumber: () => void
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
        <button
          onClick={onTapNumber}
          className="flex-shrink-0 no-select pressable transition-all"
          style={{
            minWidth: 72,
            height: 52,
            borderRadius: 16,
            border: value > 0 ? `2px solid ${stripe}` : '2px solid #EAEAEA',
            backgroundColor: value > 0 ? '#FFFFFF' : '#F5F5F5',
            padding: '0 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            className="text-[22px] font-bold tracking-[-0.3px] leading-none"
            style={{ color: value > 0 ? '#0A0A0A' : '#737373' }}
          >
            {value}
          </span>
        </button>
      </div>
    </div>
  )
}

function BucketKeypad({
  bucket, value, maxValue, onInput, onBackspace, onClear, onCancel, onConfirm,
}: {
  bucket: BucketKey
  value: string
  maxValue: number
  onInput: (d: string) => void
  onBackspace: () => void
  onClear: () => void
  onCancel: () => void
  onConfirm: () => void
}) {
  const label = bucket === 'good' ? 'Good'
    : bucket === 'needsService' ? 'Needs service'
    : bucket === 'damaged' ? 'Damaged'
    : bucket === 'scrapped' ? 'Scrapped'
    : 'Lost'
  const accent = bucket === 'good' ? '#16A34A'
    : bucket === 'needsService' ? '#D97706'
    : bucket === 'damaged' ? '#EA580C'
    : bucket === 'scrapped' ? '#DC2626'
    : '#7C3AED'
  const parsed = parseInt(value || '0', 10)
  const over = parsed > maxValue
  const rows = [['1','2','3'],['4','5','6'],['7','8','9'],['clear','0','back']]

  return (
    <>
      <div
        className="absolute inset-0 bg-black/40 z-40"
        onClick={onCancel}
        style={{ animation: 'fadeIn 180ms ease-out forwards' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 bg-white z-50 rounded-t-[24px] overflow-hidden"
        style={{ animation: 'sheetSlideUp 280ms var(--ease-drawer, cubic-bezier(0.32,0.72,0,1)) forwards' }}
      >
        <div className="flex flex-col items-center pt-2.5 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#D4D4D4]" />
        </div>

        <div className="px-6 pt-3 pb-4 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold uppercase" style={{ color: accent, letterSpacing: 0.6 }}>{label}</span>
            <span className="text-[#0A0A0A] text-lg font-bold">Enter amount</span>
          </div>
          <button onClick={onCancel} className="text-[#525252] text-sm font-bold no-select pressable">Cancel</button>
        </div>

        <div className="px-6 py-6 flex items-baseline justify-center gap-3 bg-[#FAFAFA]">
          <span
            className="text-[72px] font-bold tracking-[-2px] leading-none"
            style={{ color: over ? '#DC2626' : (parsed > 0 ? '#0A0A0A' : '#737373') }}
          >
            {value || '0'}
          </span>
          <span className="text-base font-semibold text-[#737373]">of {maxValue} max</span>
        </div>

        {over && (
          <div className="px-6 py-2.5 bg-[#FEE2E2]">
            <p className="text-[#991B1B] text-[13px] font-bold text-center">Over by {parsed - maxValue}</p>
          </div>
        )}

        <div className="px-[18px] pt-2 pb-4 bg-[#F5F5F5] flex flex-col gap-3">
          {rows.map((row, ri) => (
            <div key={ri} className="flex gap-3">
              {row.map((key, ki) => {
                if (key === 'clear') return (
                  <button key={ki} onClick={onClear} className="flex-1 h-[60px] rounded-2xl bg-white flex items-center justify-center no-select pressable">
                    <span className="text-[13px] font-bold text-[#DC2626]">Clear</span>
                  </button>
                )
                if (key === 'back') return (
                  <button key={ki} onClick={onBackspace} className="flex-1 h-[60px] rounded-2xl bg-white flex items-center justify-center no-select pressable">
                    <Delete size={22} color="#0A0A0A" strokeWidth={2} />
                  </button>
                )
                return (
                  <button
                    key={ki}
                    onClick={() => onInput(key)}
                    className="flex-1 h-[60px] rounded-2xl bg-white text-[26px] font-semibold text-[#0A0A0A] no-select pressable"
                  >
                    {key}
                  </button>
                )
              })}
            </div>
          ))}
          <button
            onClick={onConfirm}
            disabled={over}
            className="w-full h-[56px] rounded-2xl flex items-center justify-center no-select pressable disabled:opacity-50"
            style={{
              backgroundColor: accent,
              boxShadow: over ? 'none' : `0 8px 20px ${accent}40`,
            }}
          >
            <span className="text-white text-[17px] font-bold tracking-[-0.1px]">Save</span>
          </button>
        </div>
      </div>
    </>
  )
}
