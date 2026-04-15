import { useState } from 'react'
import { ChevronLeft, Camera, Search, Plus, Flag, Check, AlertTriangle } from 'lucide-react'
import { Shipment, ShipmentItem, shortfall, isShort, isExplained, flagBadge, countedItems, countedUnits, totalExpected } from '../data'
import StickyCTA from '../components/StickyCTA'

type TabFilter = 'all' | 'pending' | 'done' | 'flagged'

interface Props {
  shipment: Shipment
  items: ShipmentItem[]
  activeItemId: string | null
  onBack: () => void
  onTapItem: (itemId: string) => void
  onFlag: (itemId: string) => void
  onPhoto: (itemId: string) => void
  onAddItem: () => void
  onReview: () => void
}

export default function CountingScreen({
  shipment, items, activeItemId,
  onBack, onTapItem, onFlag, onPhoto, onAddItem, onReview,
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
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select pressable flex-shrink-0">
          <ChevronLeft size={20} color="#fff" strokeWidth={2} />
        </button>
        <div className="flex-1 text-center">
          <p className="text-white text-base font-semibold">{shipment.id}</p>
          <p className="text-white/70 text-xs">{isReturn ? 'Pre-Return · Counting' : `${shipment.truckLabel}`}</p>
        </div>
        <button onClick={() => onPhoto(items[0]?.id ?? '')} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select pressable flex-shrink-0">
          <Camera size={18} color="#fff" strokeWidth={2} />
        </button>
      </div>

      {/* Progress or empty state header */}
      {!isEmptyBOM ? (
        <div className="bg-white px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: isReturn ? '#FEF3C7' : '#EEF2FF' }}>
              <span className="text-sm font-semibold" style={{ color: accentColor }}>{pct}%</span>
            </div>
            <div className="flex-1">
              <p className="text-[#0A0A0A] text-base font-semibold">{doneItems} of {totalItems} items</p>
              <p className="text-[#737373] text-sm">{doneUnits} of {totalUnits} units</p>
            </div>
          </div>
          <div className="h-2 bg-[#EFEFEF] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: accentColor }} />
          </div>
        </div>
      ) : (
        <div className="bg-white px-5 py-4">
          <p className="text-[#0A0A0A] text-base font-semibold">0 items added</p>
          <p className="text-[#737373] text-sm mt-0.5">Add items as you count them off the truck</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white px-4 pb-3 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-xl px-3 py-2.5">
          <Search size={15} color="#A3A3A3" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search items…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#0A0A0A] placeholder:text-[#A3A3A3] outline-none"
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
              <Plus size={24} color="#A3A3A3" strokeWidth={1.5} />
            </div>
            <p className="text-[#0A0A0A] text-base font-semibold">Nothing counted yet</p>
            <p className="text-[#737373] text-sm mt-1">Tap the button below to add items as they come off the truck.</p>
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

      <div className="flex-1" />

      {/* Sticky action bar */}
      <StickyCTA
        accentColor={accentColor}
        disabled={!canReview}
        onClick={onReview}
        icon={<ChevronLeft size={18} color="#fff" strokeWidth={2.5} style={{ transform: 'rotate(180deg)' }} />}
        secondary={isReturn ? { label: '+ Add item from catalog', onClick: onAddItem } : undefined}
      >
        {canReview ? 'Review' : doneItems === 0 ? 'Tap an item to start' : `${totalItems - doneItems} items left`}
      </StickyCTA>
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
          <p className="text-[#0A0A0A] text-base font-semibold leading-snug">{item.name}</p>
          <p className="text-[#737373] text-sm">{item.subtitle}</p>
          {badge && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-md self-start"
              style={{ backgroundColor: badge.color === 'red' ? '#DC2626' : badge.color === 'green' ? '#16A34A' : '#F59E0B' }}
            >
              <AlertTriangle size={10} color="#fff" strokeWidth={2.5} />
              <span className="text-white text-[11px] font-semibold">{badge.label}</span>
            </div>
          )}
          {hasShortfall && !explained && (
            <p className="text-[#92400E] text-xs">Short {gap} · tap flag to explain</p>
          )}
        </div>

        {/* Flag button */}
        <button
          onClick={onFlag}
          disabled={!isCounted && !isReturn}
          className="w-12 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 no-select pressable disabled:opacity-25"
          style={{ backgroundColor: flagBg }}
        >
          {explained && !isReturn ? (
            <Check size={20} color={flagColor} strokeWidth={2.5} />
          ) : (
            <Flag size={20} color={flagColor} strokeWidth={2} fill={flagFilled ? flagColor : 'none'} />
          )}
        </button>

        {/* Count box */}
        <button
          onClick={onTap}
          className="w-[72px] h-14 rounded-2xl flex flex-col items-center justify-center no-select pressable flex-shrink-0"
          style={{ backgroundColor: boxBg, border: boxBorder, outline: isActive ? `2px solid ${accentColor}` : 'none' }}
        >
          {isCounted ? (
            <>
              <span className="text-xl font-semibold" style={{ color: boxTextPrimary }}>{item.counted}</span>
              <span className="text-[11px] font-medium text-[#737373]">of {item.expected}</span>
            </>
          ) : (
            <>
              <span className="text-base font-semibold" style={{ color: boxTextPrimary }}>Tap</span>
              <span className="text-[11px] font-medium" style={{ color: boxTextPrimary }}>of {item.expected}</span>
            </>
          )}
        </button>
      </div>
      {!isLast && <div className="h-px bg-[#F0F0F0] mx-5" />}
    </div>
  )
}
