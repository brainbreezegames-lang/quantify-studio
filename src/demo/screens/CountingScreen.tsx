import { useState } from 'react'
import { ChevronLeft, ChevronRight, Camera, Search, Plus, Flag, Check, AlertTriangle, StickyNote } from 'lucide-react'
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
  const [notes, setNotes] = useState('')
  const [notesOpen, setNotesOpen] = useState(false)

  const isReturn = shipment.type === 'PRE-RETURN'
  const isEmptyBOM = shipment.items.length === 0 && items.length === 0
  const accentColor = isReturn ? '#D97706' : '#1E3FFF'
  const headerColor = isReturn ? '#D97706' : '#1E3FFF'

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
      {/* Mini header — sub-screen back nav */}
      <div className="px-3 pt-3 pb-[18px] flex items-center gap-3" style={{ backgroundColor: headerColor }}>
        <button onClick={onBack} className="w-11 h-11 rounded-full bg-white/[0.15] flex items-center justify-center no-select pressable flex-shrink-0">
          <ChevronLeft size={22} color="#fff" strokeWidth={2} />
        </button>
        <div className="flex-1 text-center">
          <p className="text-white text-lg font-bold">{shipment.id}</p>
          <p className="text-white/80 text-xs font-semibold tracking-[0.3px]">{isReturn ? 'Pre-Return · Counting' : 'Counting'}</p>
        </div>
        <button onClick={() => onPhoto(items[0]?.id ?? '')} className="w-11 h-11 rounded-full bg-white/[0.15] flex items-center justify-center no-select pressable flex-shrink-0">
          <Camera size={22} color="#fff" strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-[14px] p-4 pb-[120px]">
        {/* Progress card (v15 pattern) */}
        <div className="bg-white rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)] overflow-hidden">
          <div className="h-1 w-full" style={{ backgroundColor: accentColor }} />
          {!isEmptyBOM ? (
            <div className="px-[22px] py-5 flex flex-col gap-4">
              <div className="flex items-center gap-[18px]">
                <div
                  className="w-[68px] h-[68px] rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isReturn ? '#FEF3C7' : '#EEF2FF',
                    border: `3px solid ${accentColor}`,
                  }}
                >
                  <span className="text-[17px] font-bold tracking-[-0.3px]" style={{ color: accentColor }}>{pct}%</span>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <p className="text-[#0A0A0A] text-[19px] font-bold tracking-[-0.3px] leading-tight">
                    {doneItems} of {totalItems} items counted
                  </p>
                  <p className="text-[#737373] text-[13px] font-semibold">{doneUnits} of {totalUnits} units</p>
                </div>
              </div>
              <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: accentColor }} />
              </div>
            </div>
          ) : (
            <div className="px-[22px] py-5">
              <p className="text-[#0A0A0A] text-[19px] font-bold tracking-[-0.3px]">0 items added</p>
              <p className="text-[#737373] text-[13px] font-semibold mt-1">Add items as you count them off the truck</p>
            </div>
          )}
        </div>

        {/* Notes — Brian: "We could use notes on here somewhere" */}
        <div className="bg-white rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)] overflow-hidden">
          <div className="px-[22px] py-[14px] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <StickyNote size={16} color="#525252" strokeWidth={2} />
                <p className="text-[#0A0A0A] text-[14px] font-bold">Notes</p>
              </div>
              <span className="text-[#737373] text-[11px] font-bold uppercase" style={{ letterSpacing: 0.5 }}>Optional</span>
            </div>
            {notesOpen || notes ? (
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                onBlur={() => setNotesOpen(false)}
                autoFocus={notesOpen}
                placeholder="e.g. driver said back row loaded last"
                className="w-full min-h-[64px] bg-[#F5F5F5] rounded-[12px] px-3 py-2.5 text-[14px] font-medium text-[#0A0A0A] placeholder:text-[#737373] outline-none resize-none"
              />
            ) : (
              <button
                onClick={() => setNotesOpen(true)}
                className="w-full bg-[#F5F5F5] rounded-[12px] px-3 py-2.5 text-left no-select pressable"
              >
                <span className="text-[14px] font-medium text-[#737373]">Add a note about this count…</span>
              </button>
            )}
          </div>
        </div>

        {/* Search + tabs card */}
        <div className="bg-white rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)] overflow-hidden">
          <div className="px-[22px] pt-[18px] pb-[14px] flex flex-col gap-3.5">
            <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-[14px] px-4 py-3">
              <Search size={18} color="#737373" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search items…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-[15px] font-medium text-[#0A0A0A] placeholder:text-[#737373] outline-none"
              />
            </div>

            {!isEmptyBOM && (
              <div data-spot="counting-tabs" className="overflow-x-auto -mx-1 px-1">
                <div className="flex gap-2 w-max">
                  {TABS.map(tab => {
                    const active = tabFilter === tab.key
                    const isFlagged = tab.key === 'flagged'
                    const activeBg = active ? (isFlagged ? '#F59E0B' : accentColor) : '#FFFFFF'
                    const activeColor = active ? '#FFFFFF' : (isFlagged && tab.count > 0 ? '#92400E' : '#525252')
                    const border = active ? activeBg : '#EAEAEA'
                    const shadow = active ? `0 4px 10px ${activeBg}38` : 'none'
                    const countBg = active ? 'rgba(255,255,255,0.22)' : '#F3F4F6'
                    const countColor = active ? '#FFFFFF' : '#525252'
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setTabFilter(tab.key)}
                        className="flex items-center gap-2 pl-4 pr-2.5 py-2 rounded-full text-[13px] font-bold no-select transition-all flex-shrink-0 border"
                        style={{ backgroundColor: activeBg, color: activeColor, borderColor: border, boxShadow: shadow }}
                      >
                        <span>{tab.label}</span>
                        {tab.count > 0 && (
                          <span
                            className="text-[11px] font-bold min-w-[22px] h-[18px] px-1.5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: countBg, color: countColor }}
                          >
                            {tab.count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Item list */}
        {isEmptyBOM || items.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)] overflow-hidden">
            <div className="flex flex-col items-center justify-center py-14 text-center px-8">
              <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-3">
                <Plus size={24} color="#737373" strokeWidth={1.5} />
              </div>
              <p className="text-[#0A0A0A] text-base font-bold">Nothing counted yet</p>
              <p className="text-[#737373] text-[13px] font-medium mt-1 max-w-[260px]">
                Tap the button below to add items as they come off the truck.
              </p>
            </div>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)] overflow-hidden">
            <div className="py-14 text-center">
              <p className="text-[#0A0A0A] text-base font-bold">No items in this filter</p>
              <p className="text-[#737373] text-[13px] font-medium mt-1">Try another tab.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visibleItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isReturn={isReturn}
                accentColor={accentColor}
                isActive={activeItemId === item.id}
                onTap={() => onTapItem(item.id)}
                onFlag={() => onFlag(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sticky action bar */}
      <StickyCTA
        accentColor={accentColor}
        disabled={!canReview}
        onClick={onReview}
        icon={<ChevronRight size={20} color="#fff" strokeWidth={2.5} />}
        secondary={isReturn ? { label: '+ Add item from catalog', onClick: onAddItem } : undefined}
      >
        {canReview ? 'Review' : doneItems === 0 ? 'Tap an item to start' : `${totalItems - doneItems} items left to count`}
      </StickyCTA>
    </div>
  )
}

function ItemCard({ item, isReturn, accentColor, isActive, onTap, onFlag }: {
  item: ShipmentItem
  isReturn: boolean
  accentColor: string
  isActive: boolean
  onTap: () => void
  onFlag: () => void
}) {
  const isCounted = item.counted !== null
  const gap = shortfall(item)
  const hasShortfall = isShort(item)
  const explained = isExplained(item)
  const badge = flagBadge(item)

  // Stripe maps status to v15 colors
  const stripe =
    badge?.color === 'red' ? '#DC2626' :
    hasShortfall && !explained ? '#F59E0B' :
    isCounted ? '#15803D' :
    isReturn ? '#D97706' :
    '#E5E7EB'

  const boxBg = isCounted ? '#FFFFFF' : (isReturn ? '#FEF3C7' : '#EEF2FF')
  const boxBorder = `2px solid ${hasShortfall && !explained ? '#F59E0B' : accentColor}`
  const boxTextPrimary = isCounted ? '#0A0A0A' : accentColor
  const boxTextSecondary = isCounted ? '#737373' : accentColor

  const flagEnabled = isCounted || isReturn
  const flagBg = !flagEnabled ? '#F5F5F5'
    : hasShortfall && !explained ? '#FEF3C7'
    : explained ? '#DCFCE7'
    : item.flag ? (explained ? '#DCFCE7' : '#FEF3C7')
    : '#F5F5F5'
  const flagColor = !flagEnabled ? '#A3A3A3'
    : hasShortfall && !explained ? '#D97706'
    : explained ? '#16A34A'
    : item.flag ? (explained ? '#16A34A' : '#D97706')
    : '#737373'

  return (
    <div
      data-spot={`counting-row-${item.id}`}
      className="bg-white rounded-[20px] border overflow-hidden transition-all"
      style={{
        borderColor: isActive ? accentColor : '#EAEAEA',
        boxShadow: isActive
          ? `0 0 0 2px ${accentColor}28, 0 4px 16px rgba(10,13,30,0.04)`
          : '0 4px 16px rgba(10,13,30,0.04)',
      }}
    >
      <div className="h-1 w-full" style={{ backgroundColor: stripe }} />
      <div className="flex items-center gap-3 px-[18px] py-[14px]">
        <div className="flex-1 min-w-0 flex flex-col gap-[6px]">
          <p className="text-[#0A0A0A] text-[15px] font-bold leading-snug">{item.name}</p>
          <p className="text-xs font-semibold text-[#737373]">
            {item.partNumber
              ? `${item.partNumber}${item.weightEach ? `  ·  ${item.weightEach} kg each` : ''}`
              : item.subtitle}
          </p>
          {badge && (
            <div
              className="flex items-center gap-1.5 px-2 py-[3px] rounded-full self-start"
              style={{ backgroundColor: badge.color === 'red' ? '#FEE2E2' : badge.color === 'green' ? '#DCFCE7' : '#FEF3C7' }}
            >
              <AlertTriangle
                size={11}
                color={badge.color === 'red' ? '#DC2626' : badge.color === 'green' ? '#16A34A' : '#D97706'}
                strokeWidth={2.5}
              />
              <span
                className="text-[10px] font-bold uppercase"
                style={{
                  color: badge.color === 'red' ? '#DC2626' : badge.color === 'green' ? '#16A34A' : '#D97706',
                  letterSpacing: 0.4,
                }}
              >
                {badge.label}
              </span>
            </div>
          )}
          {hasShortfall && !explained && !badge && (
            <div className="flex items-center gap-1.5 px-2 py-[3px] rounded-full self-start bg-[#FEF3C7]">
              <AlertTriangle size={11} color="#D97706" strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase text-[#92400E]" style={{ letterSpacing: 0.4 }}>
                Short {gap} — tap flag
              </span>
            </div>
          )}
        </div>

        {/* Flag button */}
        <button
          onClick={onFlag}
          disabled={!flagEnabled}
          className="w-12 h-[54px] rounded-2xl flex items-center justify-center flex-shrink-0 no-select pressable disabled:opacity-50"
          style={{ backgroundColor: flagBg }}
        >
          {explained && !isReturn ? (
            <Check size={20} color={flagColor} strokeWidth={2.5} />
          ) : (
            <Flag size={20} color={flagColor} strokeWidth={2} fill={hasShortfall && !explained ? flagColor : 'none'} />
          )}
        </button>

        {/* Count box — keypad-first target */}
        <button
          onClick={onTap}
          className="w-[78px] h-[54px] rounded-2xl flex flex-col items-center justify-center no-select pressable flex-shrink-0"
          style={{ backgroundColor: boxBg, border: boxBorder }}
        >
          {isCounted ? (
            <>
              <span className="text-[20px] font-bold tracking-[-0.3px] leading-none" style={{ color: boxTextPrimary }}>{item.counted}</span>
              <span className="text-[10px] font-semibold mt-0.5" style={{ color: boxTextSecondary }}>of {item.expected}</span>
            </>
          ) : (
            <>
              <span className="text-[11px] font-bold uppercase leading-none" style={{ color: boxTextPrimary, letterSpacing: 0.3 }}>Tap</span>
              <span className="text-[10px] font-semibold mt-0.5" style={{ color: boxTextSecondary }}>of {item.expected}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
