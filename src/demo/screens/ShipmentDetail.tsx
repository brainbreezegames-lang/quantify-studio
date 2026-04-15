import { ChevronLeft, ChevronRight, Truck } from 'lucide-react'
import { Shipment, ShipmentItem, totalExpected, countedItems, statusLabel, statusColors } from '../data'

interface Props {
  shipment: Shipment
  items: ShipmentItem[]
  onBack: () => void
  onStart: () => void
}

export default function ShipmentDetail({ shipment, items, onBack, onStart }: Props) {
  const isReturn = shipment.type === 'PRE-RETURN'
  const accentColor = isReturn ? '#D97706' : '#1E3FFF'
  const label = statusLabel(shipment.status)
  const colors = statusColors(shipment.status)
  const total = totalExpected(items)
  const doneItems = countedItems(items)
  const isEmptyBOM = items.length === 0

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-[#1E3FFF] px-5 pt-4 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select pressable">
            <ChevronLeft size={20} color="#fff" strokeWidth={2} />
          </button>
          <div className="flex-1 text-center">
            <p className="text-white text-base font-semibold">{shipment.id}</p>
            <p className="text-white/70 text-xs">{isReturn ? 'Pre-Return' : 'Delivery'}</p>
          </div>
          <div className="w-9" />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 pb-28">
        {/* Hero card */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-[#F0F0F0]">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-2"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {label}
            </span>
            <h2 className="text-[#0A0A0A] text-xl font-semibold">{shipment.jobsite}</h2>
            <p className="text-[#737373] text-sm mt-0.5">{shipment.location}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-[#F0F0F0] border-b border-[#F0F0F0]">
            <StatCell label="Scheduled" value={shipment.time} />
            <StatCell label="Items" value={isEmptyBOM ? '—' : String(items.length)} />
            <StatCell label="Units" value={isEmptyBOM ? '—' : String(total)} />
          </div>

          {/* Truck card */}
          {doneItems > 0 && (
            <div className="mx-5 my-4 px-4 py-3 bg-[#EEF2FF] rounded-xl flex items-center gap-3">
              <Truck size={18} color="#1E3FFF" strokeWidth={2} />
              <div>
                <p className="text-[#1E3FFF] text-sm font-semibold">{shipment.truckLabel}</p>
                <p className="text-[#1E3FFF]/70 text-xs">{doneItems} item{doneItems !== 1 ? 's' : ''} counted so far</p>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="px-5 py-4 flex flex-col gap-3 border-b border-[#F0F0F0]">
            {isReturn ? (
              <>
                <DetailRow label="From (Job Site)" value={shipment.jobsite} />
                <DetailRow label="To (Branch)" value="New York Branch Office" />
              </>
            ) : (
              <>
                <DetailRow label="From (Branch)" value="New York Branch Office" />
                <DetailRow label="To (Job Site)" value={shipment.jobsite} />
                <DetailRow label="Rent Start Date" value={shipment.date} />
              </>
            )}
            <DetailRow label="Driver" value={shipment.driver ?? 'Tap to set'} muted={!shipment.driver} />
            <DetailRow label="Vehicle" value={shipment.vehicle ?? 'Tap to set'} muted={!shipment.vehicle} />
          </div>

          {/* Expected items */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#0A0A0A] text-sm font-semibold">Expected items</p>
              {!isEmptyBOM && <p className="text-[#737373] text-sm">{items.length} total</p>}
            </div>
            {isEmptyBOM ? (
              <div className="py-4 text-center">
                <p className="text-[#737373] text-sm">No expected items</p>
                <p className="text-[#A3A3A3] text-xs mt-1">This pre-return started with an empty list. Add items as they come off the truck.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {items.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-[#0A0A0A] text-sm font-medium">{item.name}</p>
                      <p className="text-[#737373] text-xs">{item.subtitle}</p>
                    </div>
                    <span className="text-[#0A0A0A] text-sm font-semibold">×{item.expected}</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-[#1E3FFF] text-sm font-semibold mt-1">+ {items.length - 3} more items</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 bg-gradient-to-t from-[#F5F5F5] to-transparent">
        <button
          onClick={onStart}
          className="w-full h-14 rounded-2xl text-white text-base font-semibold flex items-center justify-center gap-2 no-select pressable"
          style={{ backgroundColor: accentColor }}
        >
          {isReturn ? 'Start receiving' : 'Start loading'}
          <ChevronRight size={18} color="#fff" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-4 flex flex-col items-center gap-0.5">
      <span className="text-[#0A0A0A] text-lg font-semibold">{value}</span>
      <span className="text-[#737373] text-xs">{label}</span>
    </div>
  )
}

function DetailRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1 border-b border-[#F0F0F0] last:border-0">
      <span className="text-[#737373] text-sm flex-shrink-0">{label}</span>
      <span className="text-sm text-right" style={{ color: muted ? '#A3A3A3' : '#0A0A0A' }}>{value}</span>
    </div>
  )
}
