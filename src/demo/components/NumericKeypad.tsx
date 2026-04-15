import { Check } from 'lucide-react'
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
  ['', '0', '⌫'],
]

export default function NumericKeypad({ item, value, accentColor, onInput, onBackspace, onConfirm, onClose }: Props) {
  const displayValue = value === '' ? '—' : value
  const parsed = value === '' ? null : parseInt(value, 10)
  const isOver = parsed !== null && parsed > item.expected
  const isZero = value === '' || value === '0'

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 z-20"
        onClick={onClose}
      />

      {/* Sheet */}
      <div data-spot="keypad" className="absolute bottom-0 left-0 right-0 bg-white z-30 rounded-t-3xl sheet-enter overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#D4D4D4] rounded-full" />
        </div>

        {/* Item name */}
        <div className="px-6 pt-2 pb-4">
          <p className="text-[#737373] text-sm">{item.name}</p>

          {/* Count display */}
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className="text-5xl font-semibold"
              style={{ color: isOver ? '#DC2626' : '#0A0A0A' }}
            >
              {displayValue}
            </span>
            <span className="text-lg text-[#737373]">of {item.expected}</span>
          </div>

          {/* Over-count warning */}
          {isOver && (
            <p className="text-[#DC2626] text-sm mt-1">
              Over by {parsed! - item.expected} — double-check your count
            </p>
          )}
        </div>

        {/* Keypad grid */}
        <div className="px-4 pb-2">
          {KEYS.map((row, ri) => (
            <div key={ri} className="flex gap-3 mb-3">
              {row.map((key, ki) => {
                if (key === '') {
                  return <div key={ki} className="flex-1" />
                }
                if (key === '⌫') {
                  return (
                    <button
                      key={ki}
                      onClick={onBackspace}
                      className="flex-1 h-14 rounded-2xl bg-[#F5F5F5] flex items-center justify-center no-select pressable"
                    >
                      {/* Custom backspace SVG — unique keypad element */}
                      <svg width="22" height="16" viewBox="0 0 24 20" fill="none" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z"/>
                        <line x1="18" y1="9" x2="12" y2="15"/>
                        <line x1="12" y1="9" x2="18" y2="15"/>
                      </svg>
                    </button>
                  )
                }
                return (
                  <button
                    key={ki}
                    onClick={() => onInput(key)}
                    className="flex-1 h-14 rounded-2xl bg-[#F5F5F5] text-xl font-semibold text-[#0A0A0A] no-select pressable"
                  >
                    {key}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Confirm button */}
        <div className="px-4 pb-6">
          <button
            onClick={onConfirm}
            disabled={isZero}
            className="w-full h-14 rounded-2xl text-white text-base font-semibold flex items-center justify-center gap-2 no-select pressable disabled:opacity-40"
            style={{ backgroundColor: accentColor }}
          >
            Confirm
            <Check size={18} color="#fff" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </>
  )
}
