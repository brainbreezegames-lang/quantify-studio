import { useState } from 'react'
import { Shipment, ShipmentItem, shortfall, isShort, isExplained, flagBadge, countedItems, countedUnits, totalExpected } from '../data'
import NumericKeypad from '../components/NumericKeypad'

const SW = { fontFamily: 'Switzer, sans-serif' }

type TabFilter = 'all' | 'pending' | 'done' | 'flagged'

interface Props {
  shipment: Shipment
  items: ShipmentItem[]
  activeItemId: string | null
  keypadValue: string
  onBack: () => void
  onTapItem: (itemId: string) => void
  onKeypadInput: (digit: string) => void
  onKeypadBackspace: () => void
  onKeypadConfirm: () => void
  onKeypadClose: () => void
  onFlag: (itemId: string) => void
  onPhoto: (itemId: string) => void
  onAddItem: () => void
  onReview: () => void
}

export default function CountingScreen({
  shipment, items, activeItemId, keypadValue,
  onBack, onTapItem, onKeypadInput, onKeypadBackspace, onKeypadConfirm, onKeypadClose,
  onFlag, onPhoto, onAddItem, onReview,
}: Props) {
  const [tabFilter, setTabFilter] = useState<TabFilter>('all')
  const [search, setSearch] = useState('')

  const isReturn = shipment.type === 'PRE-RETURN'
  const isEmptyBOM = shipment.items.length === 0 && items.length === 0
  const accentColor = isReturn ? '#D97706' : '#1E3FFF'

  const totalItems = items.length
  const doneItems = countedItems(items)
  const doneUnits = countedUnits(items)
  const totalUnits = totalExpected(items)
  const pct = totalUnits > 0 ? Math.round((doneUnits / totalUnits) * 100) : 0

  const hasUnresolvedFlags = items.some(i => isShort(i) && !isExplained(i))
  const canReview = totalItems > 0 && doneItems === totalItems && !hasUnresolvedFlags

  const activeItem = items.find(i => i.id === activeItemId) ?? null

  const TABS: { key: TabFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: items.length },
    { key: 'pending', label: 'Pending', count: items.filter(i => i.counted === null).length },
    { key: 'done', label: 'Done', count: items.filter(i => i.counted !== null && !isShort(i)).length },
    { key: 'flagged', label: 'Flagged', count: items.filter(i => isShort(i) || i.flag !== null).length },
  ]

  const visibleItems = items.filter(i => {
    if (search) {
      if (!i.name.toLowerCase().includes(search.toLowerCase())) return false
    }
    if (tabFilter === 'pending') return i.counted === null
    if (tabFilter === 'done') return i.counted !== null && !isShort(i)
    if (tabFilter === 'flagged') return isShort(i) || i.flag !== null
    return true
  })

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5] relative">
      {/* Header */}
      <div className="px-5 pt-4 pb-4 flex items-center gap-3" style={{ backgroundColor: accentColor }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="flex-1 text-center">
          <p className="text-white text-base font-semibold" style={SW}>{shipment.id}</p>
          <p className="text-white/70 text-xs" style={SW}>{isReturn ? 'Pre-Return · Counting' : `${shipment.truckLabel}`}</p>
        </div>
        <button onClick={() => onPhoto(items[0]?.id ?? '')} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </button>
      </div>

      {/* Progress or empty state header */}
      {!isEmptyBOM ? (
        <div className="bg-white px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: isReturn ? '#FEF3C7' : '#EEF2FF' }}>
              <span className="text-sm font-semibold" style={{ color: accentColor, fontFamily: 'Switzer, sans-serif' }}>{pct}%</span>
            </div>
            <div className="flex-1">
              <p className="text-[#0A0A0A] text-base font-semibold" style={SW}>{doneItems} of {totalItems} items</p>
              <p className="text-[#737373] text-sm" style={SW}>{doneUnits} of {totalUnits} units</p>
            </div>
          </div>
          <div className="h-2 bg-[#EFEFEF] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: accentColor }} />
          </div>
        </div>
      ) : (
        <div className="bg-white px-5 py-4">
          <p className="text-[#0A0A0A] text-base font-semibold" style={SW}>0 items added</p>
          <p className="text-[#737373] text-sm mt-0.5" style={SW}>Add items as you count them off the truck</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white px-4 pb-3 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-xl px-3 py-2.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search items…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#0A0A0A] placeholder:text-[#A3A3A3] outline-none"
            style={SW}
          />
        </div>
      </div>

      {/* Filter tabs */}
      {!isEmptyBOM && (
        <div className="bg-white px-4 py-2.5 overflow-x-auto border-b border-[#F0F0F0]">
          <div className="flex gap-2 w-max">
            {TABS.map(tab => {
              const active = tabFilter === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setTabFilter(tab.key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold no-select transition-colors"
                  style={{
                    backgroundColor: active ? accentColor : '#F5F5F5',
                    color: active ? '#FFFFFF' : '#525252',
                    fontFamily: 'Switzer, sans-serif',
                  }}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="text-[10px]" style={{ opacity: active ? 0.8 : 0.7 }}>{tab.count}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Item list */}
      <div className="mt-0 bg-white flex flex-col">
        {isEmptyBOM || items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-8">
            <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <p className="text-[#0A0A0A] text-base font-semibold" style={SW}>Nothing counted yet</p>
            <p className="text-[#737373] text-sm mt-1" style={SW}>Tap the button below to add items as they come off the truck.</p>
          </div>
        ) : (
          visibleItems.map((item, idx) => (
            <ItemRow
              key={item.id}
              item={item}
              isReturn={isReturn}
              accentColor={accentColor}
              isActive={activeItemId === item.id}
              isLast={idx === visibleItems.length - 1}
              onTap={() => onTapItem(item.id)}
              onFlag={() => onFlag(item.id)}
            />
          ))
        )}
      </div>

      {/* Bottom actions */}
      <div className="pb-8 mt-auto px-4 flex flex-col gap-3 pt-4">
        {isReturn && (
          <button
            onClick={onAddItem}
            className="w-full h-12 rounded-2xl border-2 text-sm font-semibold flex items-center justify-center gap-2 no-select"
            style={{ borderColor: accentColor, color: accentColor, fontFamily: 'Switzer, sans-serif' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add item from catalog
          </button>
        )}
        {canReview && (
          <button
            onClick={onReview}
            className="w-full h-14 rounded-2xl text-white text-base font-semibold flex items-center justify-center gap-2 no-select active:opacity-90"
            style={{ backgroundColor: accentColor, fontFamily: 'Switzer, sans-serif' }}
          >
            Review
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        )}
      </div>

      {/* Numeric keypad */}
      {activeItem && (
        <NumericKeypad
          item={activeItem}
          value={keypadValue}
          accentColor={accentColor}
          onInput={onKeypadInput}
          onBackspace={onKeypadBackspace}
          onConfirm={onKeypadConfirm}
          onClose={onKeypadClose}
        />
      )}
    </div>
  )
}

function ItemRow({ item, isReturn, accentColor, isActive, isLast, onTap, onFlag }: {
  item: ShipmentItem
  isReturn: boolean
  accentColor: string
  isActive: boolean
  isLast: boolean
  onTap: () => void
  onFlag: () => void
}) {
  const isCounted = item.counted !== null
  const gap = shortfall(item)
  const hasShortfall = isShort(item)
  const explained = isExplained(item)
  const badge = flagBadge(item)

  let rowBg = 'transparent'
  if (hasShortfall && !explained) rowBg = '#FEF3C7'
  if (badge?.color === 'red') rowBg = '#FEF2F2'

  let flagBg = '#F5F5F5'
  let flagColor = '#737373'
  let flagFilled = false

  if (isReturn && isCounted) {
    flagBg = item.flag ? (explained ? '#DCFCE7' : '#FEF3C7') : '#FEF3C7'
    flagColor = item.flag ? (explained ? '#16A34A' : '#D97706') : '#D97706'
    flagFilled = true
  } else if (hasShortfall) {
    flagBg = explained ? '#DCFCE7' : '#F59E0B'
    flagColor = '#FFFFFF'
    flagFilled = true
  }

  let boxBg = '#EEF2FF'
  let boxBorder = 'none'
  let boxTextPrimary = accentColor

  if (isCounted) {
    boxBg = '#FFFFFF'
    boxBorder = `2px solid ${hasShortfall && !explained ? '#F59E0B' : accentColor}`
    boxTextPrimary = '#0A0A0A'
  }

  if (isReturn) {
    boxBg = isCounted ? '#FFFFFF' : '#FEF3C7'
    if (!isCounted) boxTextPrimary = '#D97706'
  }

  return (
    <div>
      <div className="flex items-center gap-3 px-5 py-5" style={{ backgroundColor: rowBg }}>
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <p className="text-[#0A0A0A] text-base font-semibold leading-snug" style={SW}>{item.name}</p>
          <p className="text-[#737373] text-sm" style={SW}>{item.subtitle}</p>
          {badge && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-md self-start"
              style={{ backgroundColor: badge.color === 'red' ? '#DC2626' : badge.color === 'green' ? '#16A34A' : '#F59E0B' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span className="text-white text-[11px] font-semibold" style={SW}>{badge.label}</span>
            </div>
          )}
          {hasShortfall && !explained && (
            <p className="text-[#92400E] text-xs" style={SW}>Short {gap} · tap flag to explain</p>
          )}
        </div>

        {/* Flag button */}
        <button
          onClick={onFlag}
          disabled={!isCounted && !isReturn}
          className="w-12 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 no-select active:opacity-70 transition-opacity disabled:opacity-25"
          style={{ backgroundColor: flagBg }}
        >
          {explained && !isReturn ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={flagColor} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill={flagFilled ? flagColor : 'none'} stroke={flagColor} strokeWidth="2" strokeLinecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          )}
        </button>

        {/* Count box */}
        <button
          onClick={onTap}
          className="w-[72px] h-14 rounded-2xl flex flex-col items-center justify-center no-select active:opacity-70 transition-opacity flex-shrink-0"
          style={{ backgroundColor: boxBg, border: boxBorder, outline: isActive ? `2px solid ${accentColor}` : 'none' }}
        >
          {isCounted ? (
            <>
              <span className="text-xl font-semibold" style={{ color: boxTextPrimary, fontFamily: 'Switzer, sans-serif' }}>{item.counted}</span>
              <span className="text-[11px] font-medium text-[#737373]" style={SW}>of {item.expected}</span>
            </>
          ) : (
            <>
              <span className="text-base font-semibold" style={{ color: boxTextPrimary, fontFamily: 'Switzer, sans-serif' }}>Tap</span>
              <span className="text-[11px] font-medium" style={{ color: boxTextPrimary, fontFamily: 'Switzer, sans-serif' }}>of {item.expected}</span>
            </>
          )}
        </button>
      </div>
      {!isLast && <div className="h-px bg-[#F0F0F0] mx-5" />}
    </div>
  )
}
