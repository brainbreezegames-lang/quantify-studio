import { ChevronLeft, Monitor } from 'lucide-react'
import { Shipment } from '../data'
import StickyCTA from '../components/StickyCTA'

interface Props {
  shipment: Shipment
  onBack: () => void
}

export default function DiscrepancyDetail({ shipment, onBack }: Props) {
  const disc = shipment.discrepancy!
  const diff = disc.expected - disc.counted

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-[#DC2626] px-5 pt-4 pb-5 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select pressable">
          <ChevronLeft size={20} color="#fff" strokeWidth={2} />
        </button>
        <div className="flex-1 text-center">
          <p className="text-white text-base font-semibold">{shipment.id}</p>
          <p className="text-white/70 text-xs">Discrepancy</p>
        </div>
        <div className="w-9" />
      </div>

      <div className="flex flex-col gap-3 p-4">
        {/* Hero */}
        <div className="bg-white rounded-2xl p-5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] inline-block mb-3">DISCREPANCY</span>
          <p className="text-[#0A0A0A] text-xl font-semibold">{shipment.jobsite}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#737373] text-sm">{shipment.jobsiteId}</span>
            <span className="text-[#737373]">·</span>
            <span className="text-[#737373] text-sm">{shipment.location}</span>
          </div>
        </div>

        {/* Desktop banner */}
        <div className="bg-[#FEF3C7] rounded-2xl px-5 py-4 flex items-start gap-3">
          <Monitor size={18} color="#D97706" strokeWidth={2} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[#92400E] text-sm font-semibold">Resolve on desktop</p>
            <p className="text-[#92400E]/80 text-sm mt-0.5">Discrepancies can't be edited from mobile. Open Quantify on your desktop to resolve.</p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
            <p className="text-[#0A0A0A] text-sm font-semibold">Variance summary</p>
            <span className="text-[#A3A3A3] text-xs">Read-only</span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-[#F0F0F0]">
            <StatCell value={String(disc.counted)} label="Counted" color="#0A0A0A" />
            <StatCell value={String(disc.expected)} label="Expected" color="#0A0A0A" />
            <StatCell value={`−${diff}`} label="Mismatch" color="#DC2626" />
          </div>
        </div>

        {/* Mismatched lines */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
            <p className="text-[#0A0A0A] text-sm font-semibold">Mismatched lines</p>
            <span className="text-[#737373] text-sm">{disc.lines.length} lines</span>
          </div>
          {disc.lines.map((line, idx) => (
            <div key={idx}>
              <div className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[#0A0A0A] text-sm font-medium">{line.name}</p>
                  <p className="text-[#737373] text-xs mt-0.5">Expected {line.expected} · Counted {line.counted}</p>
                </div>
                <span className="text-[#DC2626] text-sm font-semibold">−{line.expected - line.counted}</span>
              </div>
              {idx < disc.lines.length - 1 && <div className="h-px bg-[#F0F0F0] mx-5" />}
            </div>
          ))}
        </div>

      </div>

      <div className="flex-1" />

      <StickyCTA
        variant="destructive"
        onClick={() => {}}
        secondary={{ label: '← Back to shipments', onClick: onBack }}
      >
        Open on desktop
      </StickyCTA>
    </div>
  )
}

function StatCell({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="py-4 flex flex-col items-center gap-0.5">
      <span className="text-xl font-semibold" style={{ color }}>{value}</span>
      <span className="text-xs text-[#737373]">{label}</span>
    </div>
  )
}
