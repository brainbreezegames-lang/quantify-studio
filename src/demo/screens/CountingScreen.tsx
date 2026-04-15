import { Shipment, ShipmentItem, shortfall, isShort, isExplained, flagBadge, countedItems, countedUnits, totalExpected } from '../data'
import NumericKeypad from '../components/NumericKeypad'

const SW = { fontFamily: 'Switzer, sans-serif' }

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
  onReview: () => void
}

export default function CountingScreen({
  shipment, items, activeItemId, keypadValue,
  onBack, onTapItem, onKeypadInput, onKeypadBackspace, onKeypadConfirm, onKeypadClose, onFlag, onReview,
}: Props) {
  const isReturn = shipment.type === 'PRE-RETURN'
  const accentColor = isReturn ? '#D97706' : '#1E3FFF'
  const totalItems = items.length
  const doneItems = countedItems(items)
  const doneUnits = countedUnits(items)
  const totalUnits = totalExpected(items)
  const pct = totalUnits > 0 ? Math.round((doneUnits / totalUnits) * 100) : 0
  const progressWidth = `${pct}%`
  const allCounted = doneItems === totalItems

  // Are any flagged items unresolved?
  const hasUnresolvedFlags = items.some(i => isShort(i) && !isExplained(i))

  const canReview = allCounted && !hasUnresolvedFlags

  const activeItem = items.find(i => i.id === activeItemId) ?? null

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5] relative">
      {/* Header */}
      <div
        className="px-5 pt-4 pb-4 flex items-center gap-3"
        style={{ backgroundColor: accentColor }}
      >
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="flex-1 text-center">
          <p className="text-white text-base font-semibold" style={SW}>{shipment.id}</p>
          <p className="text-white/70 text-xs" style={SW}>{shipment.jobsite}</p>
        </div>
        <div className="w-9 h-9 flex-shrink-0" />
      </div>

      {/* Progress */}
      <div className="bg-white px-5 py-4 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          {/* Circle */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: isReturn ? '#FEF3C7' : '#EEF2FF' }}
          >
            <span className="text-sm font-semibold" style={{ color: accentColor, fontFamily: 'Switzer, sans-serif' }}>{pct}%</span>
          </div>
          <div className="flex-1">
            <p className="text-[#0A0A0A] text-base font-semibold" style={SW}>{doneItems} of {totalItems} items</p>
            <p className="text-[#737373] text-sm" style={SW}>{doneUnits} of {totalUnits} units</p>
          </div>
          {canReview && (
            <button
              onClick={onReview}
              className="px-4 h-9 rounded-xl text-white text-sm font-semibold flex items-center gap-1.5 no-select"
              style={{ backgroundColor: accentColor, fontFamily: 'Switzer, sans-serif' }}
            >
              Review
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          )}
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-[#EFEFEF] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: progressWidth, backgroundColor: accentColor }}
          />
        </div>
      </div>

      {/* Item list */}
      <div className="mt-3 bg-white flex flex-col">
        {items.map((item, idx) => (
          <ItemRow
            key={item.id}
            item={item}
            isReturn={isReturn}
            accentColor={accentColor}
            isActive={activeItemId === item.id}
            isLast={idx === items.length - 1}
            onTap={() => onTapItem(item.id)}
            onFlag={() => onFlag(item.id)}
          />
        ))}
      </div>

      {/* Floating review button when all counted */}
      {canReview && (
        <div className="p-4 mt-auto">
          <button
            onClick={onReview}
            className="w-full h-14 rounded-2xl text-white text-base font-semibold flex items-center justify-center gap-2 no-select active:opacity-90"
            style={{ backgroundColor: accentColor, fontFamily: 'Switzer, sans-serif' }}
          >
            Review all items
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}

      {/* Numeric keypad overlay */}
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

// ─── Item Row ─────────────────────────────────────────────────────────────────

interface RowProps {
  item: ShipmentItem
  isReturn: boolean
  accentColor: string
  isActive: boolean
  isLast: boolean
  onTap: () => void
  onFlag: () => void
}

function ItemRow({ item, isReturn, accentColor, isActive, isLast, onTap, onFlag }: RowProps) {
  const isCounted = item.counted !== null
  const short = shortfall(item)
  const hasShortfall = isShort(item)
  const explained = isExplained(item)
  const badge = flagBadge(item)

  // Row background
  let rowBg = 'transparent'
  if (hasShortfall && !explained) rowBg = '#FEF3C7'
  if (badge && (badge.color === 'red')) rowBg = '#FEF2F2'

  // Flag button state
  let flagBg = '#F5F5F5'
  let flagColor = '#737373'
  let flagFill = false

  if (isReturn && isCounted) {
    // Return: flag is always amber (condition check is mandatory)
    flagBg = item.flag ? (explained ? '#DCFCE7' : '#FEF3C7') : '#FEF3C7'
    flagColor = item.flag ? (explained ? '#16A34A' : '#D97706') : '#D97706'
    flagFill = true
  } else if (hasShortfall) {
    flagBg = explained ? '#DCFCE7' : '#F59E0B'
    flagColor = '#FFFFFF'
    flagFill = true
  }

  // Count box state
  let boxBg = '#EEF2FF'
  let boxBorder = 'none'
  let boxTextColor = accentColor

  if (isCounted) {
    boxBg = '#FFFFFF'
    boxBorder = `2px solid ${hasShortfall && !explained ? '#F59E0B' : accentColor}`
    boxTextColor = '#0A0A0A'
  }

  return (
    <div>
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ backgroundColor: rowBg }}
      >
        {/* Item info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <p className="text-[#0A0A0A] text-base font-semibold leading-snug" style={SW}>{item.name}</p>
          <p className="text-[#737373] text-sm" style={SW}>{item.subtitle}</p>
          {/* Badge */}
          {badge && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-md self-start"
              style={{
                backgroundColor: badge.color === 'red' ? '#DC2626' : badge.color === 'green' ? '#16A34A' : '#F59E0B',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span className="text-white text-[11px] font-semibold" style={SW}>{badge.label}</span>
            </div>
          )}
          {/* Shortfall hint */}
          {hasShortfall && !explained && (
            <p className="text-[#92400E] text-xs" style={SW}>Short {short} · tap flag to explain</p>
          )}
        </div>

        {/* Flag button */}
        <button
          onClick={onFlag}
          disabled={!isCounted && !isReturn}
          className="w-12 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 no-select active:opacity-70 transition-opacity disabled:opacity-30"
          style={{ backgroundColor: flagBg }}
        >
          {explained && !isReturn ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={flagColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill={flagFill ? flagColor : 'none'} stroke={flagColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
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
              <span className="text-xl font-semibold" style={{ color: boxTextColor, fontFamily: 'Switzer, sans-serif' }}>{item.counted}</span>
              <span className="text-[11px] font-medium text-[#737373]" style={SW}>of {item.expected}</span>
            </>
          ) : (
            <>
              <span className="text-base font-semibold" style={{ color: accentColor, fontFamily: 'Switzer, sans-serif' }}>Tap</span>
              <span className="text-[11px] font-medium" style={{ color: accentColor, fontFamily: 'Switzer, sans-serif' }}>of {item.expected}</span>
            </>
          )}
        </button>
      </div>
      {!isLast && <div className="h-px bg-[#F0F0F0] mx-5" />}
    </div>
  )
}
