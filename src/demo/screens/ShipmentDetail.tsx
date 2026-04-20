import { useState } from 'react'
import { ChevronLeft, ChevronRight, Camera, Paperclip, StickyNote } from 'lucide-react'
import { Shipment, ShipmentItem, totalExpected, statusLabel, statusColors } from '../data'
import StickyCTA from '../components/StickyCTA'

interface Props {
  shipment: Shipment
  items: ShipmentItem[]
  onBack: () => void
  onStart: () => void
}

export default function ShipmentDetail({ shipment, items, onBack, onStart }: Props) {
  const [notes, setNotes] = useState('')
  const [notesOpen, setNotesOpen] = useState(false)
  const isReturn = shipment.type === 'PRE-RETURN'
  const accentColor = isReturn ? '#D97706' : '#1E3FFF'
  const label = statusLabel(shipment.status)
  const colors = statusColors(shipment.status)
  const total = totalExpected(items)
  const isEmptyBOM = items.length === 0

  const stripeColor = isReturn ? '#F59E0B' : '#1E3FFF'

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-3 pt-3 pb-[18px] flex items-center gap-3" style={{ backgroundColor: '#1E3FFF' }}>
        <button onClick={onBack} className="w-11 h-11 rounded-full bg-white/[0.15] flex items-center justify-center no-select pressable flex-shrink-0">
          <ChevronLeft size={22} color="#fff" strokeWidth={2} />
        </button>
        <div className="flex-1 text-center">
          <p className="text-white text-lg font-bold">{shipment.id}</p>
          <p className="text-white/80 text-xs font-semibold tracking-[0.3px]">{isReturn ? 'Pre-Return' : 'Delivery'}</p>
        </div>
        {/* Brian: "Something to allow them to take and attached photos and docs even when not editing" */}
        <button className="w-11 h-11 rounded-full bg-white/[0.15] flex items-center justify-center no-select pressable flex-shrink-0">
          <Camera size={22} color="#fff" strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-[14px] px-4 pt-[18px] pb-[14px]">
        {/* Hero card */}
        <div
          className="bg-white rounded-[20px] overflow-hidden border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)]"
        >
          <div className="h-1 w-full" style={{ backgroundColor: stripeColor }} />

          {/* Title block */}
          <div className="px-[22px] pt-[22px] pb-[22px] flex flex-col gap-3">
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full self-start"
              style={{ backgroundColor: colors.bg, color: colors.text, letterSpacing: 0.6 }}
            >
              {label}
            </span>
            <h2 className="text-[#0A0A0A] text-[26px] font-bold tracking-[-0.5px] leading-tight">{shipment.jobsite}</h2>
            <p className="text-[#737373] text-sm font-medium">{shipment.jobsiteId}  ·  {shipment.location}</p>
          </div>

          <div className="h-px bg-[#F0F0F0]" />

          {/* 3-col stats */}
          <div className="flex">
            <StatCell label="SCHEDULED" value={shipment.date.replace('Planned ', '')} />
            <div className="w-px bg-[#F0F0F0] my-5" />
            <StatCell label="PRODUCTS" value={isEmptyBOM ? '-' : String(items.length)} />
            <div className="w-px bg-[#F0F0F0] my-5" />
            <StatCell label="UNITS" value={isEmptyBOM ? '-' : String(total)} />
          </div>

          <div className="h-px bg-[#F0F0F0]" />

          {/* Details */}
          <div className="px-[22px]">
            {isReturn ? (
              <>
                <DetailRow label="From" value={shipment.jobsite} />
                <DetailRow label="To" value="New York Branch Office" />
              </>
            ) : (
              <>
                <DetailRow label="Type" value="Delivery" />
                <DetailRow label="From" value="New York Branch Office" />
                <DetailRow label="To" value={shipment.jobsite} />
              </>
            )}
            <DetailRow label="Salesperson" value={shipment.salesperson ?? '-'} muted={!shipment.salesperson} />
            {shipment.weight && <DetailRow label="Weight" value={shipment.weight} last />}
          </div>

          <div className="h-px bg-[#F0F0F0]" />

          {/* Products */}
          <div className="px-[22px] pt-[18px] pb-[18px]">
            <div className="flex items-center justify-between mb-[14px]">
              <p className="text-[#0A0A0A] text-[17px] font-bold tracking-[-0.2px]">Products</p>
              {!isEmptyBOM && <p className="text-[#737373] text-[13px] font-semibold">{items.length} items</p>}
            </div>
            {isEmptyBOM ? (
              <div className="py-4 text-center">
                <p className="text-[#737373] text-sm font-medium">No expected items</p>
                <p className="text-[#737373] text-xs mt-1 font-medium">This pre-return started with an empty list. Add items as they come off the truck.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {items.slice(0, 4).map((item, idx) => (
                  <div key={item.id}>
                    <div className="flex items-center justify-between py-[14px]">
                      <div className="flex-1 min-w-0 pr-3 flex flex-col gap-1">
                        <p className="text-[#0A0A0A] text-[15px] font-bold leading-snug">{item.name}</p>
                        {/* Part number + weight each - Brian's request */}
                        <p className="text-[#737373] text-xs font-semibold">
                          {item.partNumber ? item.partNumber : ''}
                          {item.partNumber && item.weightEach ? '  ·  ' : ''}
                          {item.weightEach ? `${item.weightEach} kg each` : ''}
                          {!item.partNumber && !item.weightEach ? item.subtitle : ''}
                        </p>
                      </div>
                      <span className="text-[#0A0A0A] text-[15px] font-bold flex-shrink-0">×{item.expected}</span>
                    </div>
                    {idx < Math.min(items.length, 4) - 1 && <div className="h-px bg-[#F5F5F5]" />}
                  </div>
                ))}
                {items.length > 4 && (
                  <p className="text-[#1E3FFF] text-sm font-semibold mt-2">Show {items.length - 4} more products</p>
                )}
              </div>
            )}
          </div>

          <div className="h-px bg-[#F0F0F0]" />

          {/* Notes — Brian: "edit notes without editing the shipment" */}
          <div className="px-[22px] py-[18px] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <StickyNote size={16} color="#525252" strokeWidth={2} />
                <p className="text-[#0A0A0A] text-[15px] font-bold">Notes for office</p>
              </div>
              <span className="text-[#737373] text-[11px] font-semibold uppercase" style={{ letterSpacing: 0.5 }}>Optional</span>
            </div>
            {notesOpen || notes ? (
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                onBlur={() => setNotesOpen(false)}
                autoFocus={notesOpen}
                placeholder="e.g. driver said back row was loaded last"
                className="w-full min-h-[84px] bg-[#F5F5F5] rounded-[14px] px-4 py-3 text-[14px] font-medium text-[#0A0A0A] placeholder:text-[#737373] outline-none resize-none"
              />
            ) : (
              <button
                onClick={() => setNotesOpen(true)}
                className="w-full bg-[#F5F5F5] rounded-[14px] px-4 py-3 text-left no-select pressable"
              >
                <span className="text-[14px] font-medium text-[#737373]">Add a note for the office team…</span>
              </button>
            )}
          </div>

          <div className="h-px bg-[#F0F0F0]" />

          {/* Attachments */}
          <div className="px-[22px] py-4">
            <button className="flex items-center gap-3 text-[#1E3FFF] text-sm font-semibold no-select pressable">
              <Paperclip size={18} color="#1E3FFF" strokeWidth={2} />
              <span>Attachments  ·  2 photos</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* Brian: "Ship Reservation" as primary CTA + "Create Reservation for Shortage" as secondary */}
      <StickyCTA
        accentColor={accentColor}
        onClick={onStart}
        icon={<ChevronRight size={20} color="#fff" strokeWidth={2.5} />}
        secondary={!isReturn ? { label: 'Create reservation for shortage', onClick: () => {} } : undefined}
      >
        {isReturn ? 'Start receiving' : 'Ship Reservation'}
      </StickyCTA>
    </div>
  )
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 py-5 flex flex-col items-center gap-1">
      <span className="text-[#0A0A0A] text-[22px] font-bold tracking-[-0.3px]">{value}</span>
      <span className="text-[10px] font-bold text-[#737373] uppercase tracking-[0.8px]">{label}</span>
    </div>
  )
}

function DetailRow({ label, value, muted, last }: { label: string; value: string; muted?: boolean; last?: boolean }) {
  return (
    <>
      <div className="flex items-center justify-between gap-4 py-[14px]">
        <span className="text-sm font-medium text-[#737373]">{label}</span>
        <span className="text-sm font-bold text-right" style={{ color: muted ? '#737373' : '#0A0A0A' }}>{value}</span>
      </div>
      {!last && <div className="h-px bg-[#F5F5F5]" />}
    </>
  )
}
