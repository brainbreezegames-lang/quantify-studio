import { useState } from 'react'
import { CatalogItem } from '../data'

const SW = { fontFamily: 'Switzer, sans-serif' }

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
      <div className="bg-[#D97706] px-5 pt-4 pb-5 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <p className="text-white text-lg font-semibold flex-1 text-center" style={SW}>Add to DEL-2401</p>
        <div className="w-9" />
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-xl px-3 py-2.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search catalog…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#A3A3A3]"
            style={SW}
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="px-4 py-2.5 overflow-x-auto border-b border-[#F0F0F0]">
        <div className="flex gap-2 w-max">
          {CATEGORIES.map(cat => {
            const active = category === cat
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold no-select transition-colors flex-shrink-0"
                style={{
                  backgroundColor: active ? '#D97706' : '#F5F5F5',
                  color: active ? '#FFFFFF' : '#525252',
                  fontFamily: 'Switzer, sans-serif',
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
              className="w-full flex items-center gap-4 px-5 py-4 text-left no-select active:bg-[#F5F5F5]"
            >
              <div className="flex-1">
                <p className="text-[#0A0A0A] text-base font-semibold" style={SW}>{item.name}</p>
                <p className="text-[#737373] text-sm mt-0.5" style={SW}>{item.subtitle}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className="text-sm font-semibold"
                  style={{ color: item.isLow ? '#DC2626' : '#16A34A', fontFamily: 'Switzer, sans-serif' }}
                >
                  {item.available} avail{item.isLow ? ' · low' : ''}
                </p>
              </div>
            </button>
            {idx < filtered.length - 1 && <div className="h-px bg-[#F0F0F0] mx-5" />}
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
  const KEYS = [['1','2','3'],['4','5','6'],['7','8','9'],['','0','⌫']]
  const parsed = parseInt(qty) || 0

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="bg-[#D97706] px-5 pt-4 pb-5 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <p className="text-white text-lg font-semibold flex-1 text-center" style={SW}>How many?</p>
        <div className="w-9" />
      </div>

      <div className="px-6 pt-6 pb-4 border-b border-[#F0F0F0]">
        <p className="text-[#0A0A0A] text-xl font-semibold" style={SW}>{item.name}</p>
        <p className="text-[#737373] text-sm mt-1" style={SW}>{item.subtitle}</p>
      </div>

      <div className="px-6 pt-6 pb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-semibold text-[#0A0A0A]" style={SW}>{qty || '—'}</span>
          <span className="text-lg text-[#737373]" style={SW}>units</span>
        </div>
        <p className="text-[#A3A3A3] text-sm mt-1" style={SW}>{item.available} available in stock</p>
      </div>

      <div className="px-4 flex flex-col gap-3 mt-auto pb-2">
        {KEYS.map((row, ri) => (
          <div key={ri} className="flex gap-3">
            {row.map((key, ki) => {
              if (key === '') return <div key={ki} className="flex-1" />
              if (key === '⌫') return (
                <button key={ki} onClick={() => onQty(qty.slice(0,-1))} className="flex-1 h-14 rounded-2xl bg-[#F5F5F5] flex items-center justify-center no-select active:bg-[#E5E5E5]">
                  <svg width="22" height="16" viewBox="0 0 24 20" fill="none" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
                </button>
              )
              return (
                <button key={ki} onClick={() => qty.length < 4 && onQty(qty + key)} className="flex-1 h-14 rounded-2xl bg-[#F5F5F5] text-xl font-semibold text-[#0A0A0A] no-select active:bg-[#E5E5E5]" style={SW}>
                  {key}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="px-4 pb-8 pt-3">
        <button
          onClick={onConfirm}
          disabled={parsed === 0}
          className="w-full h-14 rounded-2xl text-white text-base font-semibold no-select disabled:opacity-40"
          style={{ backgroundColor: '#D97706', fontFamily: 'Switzer, sans-serif' }}
        >
          Add {parsed > 0 ? `${parsed} ` : ''}to count
        </button>
      </div>
    </div>
  )
}
