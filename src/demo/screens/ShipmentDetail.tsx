import { ChevronLeft, ChevronRight, Camera, Paperclip } from 'lucide-react'
import { Shipment, ShipmentItem, totalExpected, countedItems, statusLabel, statusColors } from '../data'
import StickyCTA from '../components/StickyCTA'

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
          {/* Brian: "Something to allow them to take and attached photos and docs even when not editing" */}
          <button className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select pressable">
            <Camera size={18} color="#fff" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 pb-2">
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

          {/* Stats — Brian: "We don't have time yet, only a date" */}
          <div className="grid grid-cols-3 divide-x divide-[#F0F0F0] border-b border-[#F0F0F0]">
            <StatCell label="Scheduled" value={shipment.date.replace('Planned ', '')} />
            <StatCell label="Items" value={isEmptyBOM ? '—' : String(items.length)} />
            <StatCell label="Units" value={isEmptyBOM ? '—' : String(total)} />
          </div>

          {/* Details — Salesperson + Weight (Brian requests), no truck tracking */}
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
              </>
            )}
            <DetailRow label="Rent Start Date" value={shipment.date.replace('Planned ', '')} />
            {/* Brian: "How about adding Salesperson here also" */}
            <DetailRow label="Salesperson" value={shipment.salesperson ?? '—'} muted={!shipment.salesperson} />
            {/* Brian: "Need a weight here" */}
            {shipment.weight && <DetailRow label="Est. Weight" value={shipment.weight} />}
          </div>

          {/* Expected items — Brian: "Part number is missing, as well as weight each" */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#0A0A0A] text-sm font-semibold">Products</p>
              {!isEmptyBOM && <p className="text-[#737373] text-sm">{items.length} items</p>}
            </div>
            {isEmptyBOM ? (
              <div className="py-4 text-center">
                <p className="text-[#737373] text-sm">No expected items</p>
                <p className="text-[#A3A3A3] text-xs mt-1">This pre-return started with an empty list. Add items as they come off the truck.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {items.slice(0, 4).map(item => (
                  <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-[#F5F5F5] last:border-0">
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-[#0A0A0A] text-sm font-semibold leading-snug">{item.name}</p>
                      {/* Part number + weight each — Brian's request */}
                      <p className="text-[#737373] text-xs mt-0.5">
                        {item.partNumber ? item.partNumber : ''}
                        {item.partNumber && item.weightEach ? '  ·  ' : ''}
                        {item.weightEach ? `${item.weightEach} kg each` : ''}
                        {!item.partNumber && !item.weightEach ? item.subtitle : ''}
                      </p>
                    </div>
                    <span className="text-[#0A0A0A] text-sm font-semibold flex-shrink-0">×{item.expected}</span>
                  </div>
                ))}
                {items.length > 4 && (
                  <p className="text-[#1E3FFF] text-sm font-semibold mt-1">+ {items.length - 4} more items</p>
                )}
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="px-5 py-3 border-t border-[#F0F0F0]">
            <button className="flex items-center gap-2 text-[#1E3FFF] text-sm font-semibold no-select pressable py-1">
              <Paperclip size={15} color="#1E3FFF" strokeWidth={2} />
              <span>Attachments</span>
            </button>
          </div>
        </div>
      </div>

      {/* Brian: "Ship Reservation" as primary CTA + "Create Reservation for Shortage" as secondary */}
      <StickyCTA
        accentColor={accentColor}
        onClick={onStart}
        icon={<ChevronRight size={18} color="#fff" strokeWidth={2.5} />}
        secondary={!isReturn ? { label: 'Create Reservation for Shortage', onClick: () => {} } : undefined}
      >
        {isReturn ? 'Start receiving' : 'Ship Reservation'}
      </StickyCTA>
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
