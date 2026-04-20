import { useState } from 'react'
import { X, Search, ChevronLeft, Delete } from 'lucide-react'
import { CatalogItem } from '../data'
import StickyCTA from '../components/StickyCTA'

const CATEGORIES = ['All', 'Cuplok', 'Boards', 'Accessories', 'Ringlock']

interface Props {
  catalog: CatalogItem[]
  onAdd: (item: CatalogItem, qty: number) => void
  onBack: () => void
}

export default function AddItemPicker({ catalog, onAdd, onBack }: Props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null)
  const [qty, setQty] = useState('')

  const filtered = catalog.filter(i => {
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false
    if (category !== 'All' && i.category !== category) return false
    return true
  })

  if (selectedItem) {
    return <QtySheet item={selectedItem} qty={qty} onQty={setQty} onConfirm={() => onAdd(selectedItem, parseInt(qty) || 0)} onBack={() => setSelectedItem(null)} />
  }

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Header */}
      <div className="bg-[#D97706] px-3 pt-3 pb-[18px] flex items-center gap-3">
        <button onClick={onBack} className="w-11 h-11 rounded-full bg-white/[0.15] flex items-center justify-center no-select pressable">
          <X size={22} color="#fff" strokeWidth={2} />
        </button>
        <p className="text-white text-lg font-bold flex-1 text-center">Add to DEL-2401</p>
        <div className="w-11" />
      </div>

      {/* Search */}
      <div className="bg-white px-4 pt-3.5 pb-3.5 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-[14px] px-4 py-3.5">
          <Search size={20} color="#737373" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search catalog…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[15px] font-medium text-[#0A0A0A] outline-none placeholder:text-[#737373]"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="px-4 py-3 overflow-x-auto border-b border-[#F0F0F0]">
        <div className="flex gap-2 w-max">
          {CATEGORIES.map(cat => {
            const active = category === cat
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="pl-4 pr-4 py-2 rounded-full text-[13px] font-bold no-select transition-all flex-shrink-0 border"
                style={{
                  backgroundColor: active ? '#D97706' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#525252',
                  borderColor: active ? '#D97706' : '#EAEAEA',
                  boxShadow: active ? '0 4px 10px rgba(217,119,6,0.25)' : 'none',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results */}
      <div className="flex flex-col">
        {filtered.map((item, idx) => (
          <div key={item.id}>
            <button
              onClick={() => { setSelectedItem(item); setQty('') }}
              className="w-full flex items-center gap-4 px-[22px] py-4 text-left no-select pressable"
            >
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className="text-[#0A0A0A] text-base font-bold">{item.name}</p>
                <p className="text-[#737373] text-xs font-semibold">{item.subtitle}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className="text-sm font-bold"
                  style={{ color: item.isLow ? '#DC2626' : '#16A34A' }}
                >
                  {item.available} avail{item.isLow ? ' · low' : ''}
                </p>
              </div>
            </button>
            {idx < filtered.length - 1 && <div className="h-px bg-[#F5F5F5] mx-[22px]" />}
          </div>
        ))}
      </div>
    </div>
  )
}

function QtySheet({ item, qty, onQty, onConfirm, onBack }: {
  item: CatalogItem
  qty: string
  onQty: (v: string) => void
  onConfirm: () => void
  onBack: () => void
}) {
  const KEYS = [['1','2','3'],['4','5','6'],['7','8','9'],['clear','0','back']]
  const parsed = parseInt(qty) || 0
  const accent = '#D97706'
  const over = parsed > item.available

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Amber hero header */}
      <div className="px-5 pt-[18px] pb-7" style={{ backgroundColor: accent }}>
        <div className="flex items-center justify-between mb-[18px]">
          <button onClick={onBack} className="w-11 h-11 rounded-full bg-white/[0.15] flex items-center justify-center no-select pressable">
            <ChevronLeft size={22} color="#fff" strokeWidth={2} />
          </button>
          <div className="w-11" />
        </div>
        <h1 className="text-white text-[28px] font-semibold leading-[1.15] tracking-[-0.6px]">How many?</h1>
        <p className="text-white/90 text-sm font-semibold mt-[14px]">
          {item.name}  ·  {item.available} available
        </p>
      </div>

      <div className="flex flex-col gap-[14px] p-4">
        {/* Item card */}
        <div className="bg-white rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)] overflow-hidden">
          <div className="h-1 w-full" style={{ backgroundColor: accent }} />
          <div className="px-[22px] py-[18px]">
            <p className="text-[#0A0A0A] text-[17px] font-bold tracking-[-0.2px] leading-snug">{item.name}</p>
            <p className="text-[#737373] text-[13px] font-medium mt-1">{item.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Display */}
      <div className="px-6 py-6 flex flex-col items-center gap-3 bg-white">
        <div className="flex items-baseline gap-3 justify-center">
          <span
            className="text-[72px] font-bold tracking-[-2px] leading-none"
            style={{ color: over ? '#DC2626' : (parsed > 0 ? '#0A0A0A' : '#737373') }}
          >
            {qty || '0'}
          </span>
          <span className="text-base font-semibold text-[#737373]">of {item.available} available</span>
        </div>
        {over && (
          <div className="px-3 py-1 bg-[#FEE2E2] rounded-full">
            <span className="text-[12px] font-bold text-[#DC2626]">Over by {parsed - item.available}</span>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Keypad */}
      <div className="px-[18px] pt-3 pb-3 bg-[#F5F5F5] flex flex-col gap-3">
        {KEYS.map((row, ri) => (
          <div key={ri} className="flex gap-3">
            {row.map((key, ki) => {
              if (key === 'clear') return (
                <button key={ki} onClick={() => onQty('')} className="flex-1 h-[60px] rounded-2xl bg-white flex items-center justify-center no-select pressable">
                  <span className="text-[13px] font-bold text-[#DC2626]">Clear</span>
                </button>
              )
              if (key === 'back') return (
                <button key={ki} onClick={() => onQty(qty.slice(0,-1))} className="flex-1 h-[60px] rounded-2xl bg-white flex items-center justify-center no-select pressable">
                  <Delete size={22} color="#0A0A0A" strokeWidth={2} />
                </button>
              )
              return (
                <button
                  key={ki}
                  onClick={() => qty.length < 4 && onQty(qty + key)}
                  className="flex-1 h-[60px] rounded-2xl bg-white text-[26px] font-semibold text-[#0A0A0A] no-select pressable"
                >
                  {key}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <StickyCTA
        accentColor={accent}
        disabled={parsed === 0 || over}
        onClick={onConfirm}
      >
        {over ? `Too many — have ${item.available}` : `Add ${parsed > 0 ? `${parsed} ` : ''}to count`}
      </StickyCTA>
    </div>
  )
}
