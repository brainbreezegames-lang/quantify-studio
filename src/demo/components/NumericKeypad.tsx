import { Check, CheckCircle2, Delete } from 'lucide-react'
import { ShipmentItem } from '../data'

interface Props {
  item: ShipmentItem
  value: string
  accentColor: string
  onInput: (digit: string) => void
  onBackspace: () => void
  onConfirm: () => void
  onClose: () => void
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['clear', '0', 'back'],
]

export default function NumericKeypad({ item, value, accentColor, onInput, onBackspace, onConfirm, onClose }: Props) {
  const displayValue = value === '' ? '0' : value
  const parsed = value === '' ? 0 : parseInt(value, 10)
  const isOver = parsed > item.expected
  const isZero = value === '' || value === '0'
  const isFull = parsed === item.expected
  const isShort = parsed > 0 && parsed < item.expected

  // Category overline — use first word of product name
  const firstWord = item.name.split(' ')[0]?.toUpperCase() ?? ''

  function matchReserved() {
    // Clear current value, then enter the expected
    for (let i = 0; i < value.length; i++) onBackspace()
    const exp = String(item.expected)
    for (const d of exp) onInput(d)
  }

  function clearAll() {
    for (let i = 0; i < value.length; i++) onBackspace()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 z-20"
        onClick={onClose}
        style={{ animation: 'fadeIn 180ms ease-out forwards' }}
      />

      {/* Sheet */}
      <div
        data-spot="keypad"
        className="absolute bottom-0 left-0 right-0 bg-white z-30 overflow-hidden"
        style={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          animation: 'sheetSlideUp 280ms var(--ease-drawer, cubic-bezier(0.32,0.72,0,1)) forwards',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#D4D4D4]" />
        </div>

        {/* Header */}
        <div className="px-6 pt-3 pb-4 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            {firstWord && (
              <span
                className="text-[11px] font-bold uppercase"
                style={{ color: accentColor, letterSpacing: 0.6 }}
              >
                {firstWord}
              </span>
            )}
            <p className="text-[#0A0A0A] text-lg font-bold tracking-[-0.2px] truncate">{item.name}</p>
            <p className="text-[12px] font-medium text-[#737373] truncate">
              {item.partNumber
                ? `${item.partNumber}${item.weightEach ? `  ·  ${item.weightEach} kg each` : ''}`
                : item.subtitle}
            </p>
          </div>
          <button onClick={onClose} className="text-[#525252] text-sm font-bold no-select pressable flex-shrink-0 pt-1">
            Cancel
          </button>
        </div>

        {/* Display */}
        <div className="px-6 py-6 flex flex-col items-center gap-3 bg-[#FAFAFA]">
          <div className="flex items-baseline gap-3 justify-center">
            <span
              className="text-[72px] font-bold tracking-[-2px] leading-none"
              style={{ color: isOver ? '#DC2626' : (parsed > 0 ? '#0A0A0A' : '#737373') }}
            >
              {displayValue}
            </span>
            <span className="text-base font-semibold text-[#737373]">of {item.expected}</span>
          </div>

          {/* Status pills */}
          {isFull && (
            <div className="flex items-center gap-[7px] px-3 py-1 bg-[#DCFCE7] rounded-full">
              <CheckCircle2 size={13} color="#15803D" strokeWidth={2.5} />
              <span className="text-[12px] font-bold text-[#15803D]">Matches reserved</span>
            </div>
          )}
          {isShort && (
            <div className="px-3 py-1 bg-[#FEF3C7] rounded-full">
              <span className="text-[12px] font-bold text-[#92400E]">Short by {item.expected - parsed}</span>
            </div>
          )}
          {isOver && (
            <div className="px-3 py-1 bg-[#FEE2E2] rounded-full">
              <span className="text-[12px] font-bold text-[#DC2626]">Over by {parsed - item.expected} — double-check</span>
            </div>
          )}
        </div>

        {/* Match reserved preset */}
        {!isFull && (
          <div className="px-6 pt-3 pb-1 flex items-center justify-center bg-white">
            <button
              onClick={matchReserved}
              className="flex items-center gap-2 px-4 py-2 rounded-full no-select pressable"
              style={{ backgroundColor: `${accentColor}14` }}
            >
              <Check size={14} strokeWidth={2.5} style={{ color: accentColor }} />
              <span className="text-[13px] font-bold" style={{ color: accentColor }}>
                Match reserved ({item.expected})
              </span>
            </button>
          </div>
        )}

        {/* Keypad grid */}
        <div className="px-[18px] pt-3 pb-4 bg-[#F5F5F5] flex flex-col gap-3">
          {KEYS.map((row, ri) => (
            <div key={ri} className="flex gap-3">
              {row.map((key, ki) => {
                if (key === 'clear') {
                  return (
                    <button
                      key={ki}
                      onClick={clearAll}
                      className="flex-1 h-[60px] rounded-2xl bg-white flex items-center justify-center no-select pressable"
                    >
                      <span className="text-[13px] font-bold text-[#DC2626]">Clear</span>
                    </button>
                  )
                }
                if (key === 'back') {
                  return (
                    <button
                      key={ki}
                      onClick={onBackspace}
                      className="flex-1 h-[60px] rounded-2xl bg-white flex items-center justify-center no-select pressable"
                    >
                      <Delete size={22} color="#0A0A0A" strokeWidth={2} />
                    </button>
                  )
                }
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

          {/* Save button */}
          <button
            onClick={onConfirm}
            disabled={isZero}
            className="w-full h-[56px] rounded-2xl flex items-center justify-center no-select pressable disabled:opacity-50 mt-1"
            style={{
              backgroundColor: accentColor,
              boxShadow: !isZero ? `0 8px 20px ${accentColor}40` : 'none',
            }}
          >
            <span className="text-white text-[17px] font-bold tracking-[-0.1px]">
              {isZero ? 'Enter a count' : `Save ${parsed} counted`}
            </span>
          </button>
        </div>
      </div>
    </>
  )
}
