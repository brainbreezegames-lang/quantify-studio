import { Shipment } from '../data'

const SW = { fontFamily: 'Switzer, sans-serif' }

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
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="flex-1 text-center">
          <p className="text-white text-base font-semibold" style={SW}>{shipment.id}</p>
          <p className="text-white/70 text-xs" style={SW}>Discrepancy</p>
        </div>
        <div className="w-9" />
      </div>

      <div className="flex flex-col gap-3 p-4">
        {/* Hero */}
        <div className="bg-white rounded-2xl p-5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] inline-block mb-3" style={SW}>DISCREPANCY</span>
          <p className="text-[#0A0A0A] text-xl font-semibold" style={SW}>{shipment.jobsite}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#737373] text-sm" style={SW}>{shipment.jobsiteId}</span>
            <span className="text-[#737373]">·</span>
            <span className="text-[#737373] text-sm" style={SW}>{shipment.location}</span>
          </div>
        </div>

        {/* Desktop banner */}
        <div className="bg-[#FEF3C7] rounded-2xl px-5 py-4 flex items-start gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" className="mt-0.5 flex-shrink-0"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          <div>
            <p className="text-[#92400E] text-sm font-semibold" style={SW}>Resolve on desktop</p>
            <p className="text-[#92400E]/80 text-sm mt-0.5" style={SW}>Discrepancies can't be edited from mobile. Open Quantify on your desktop to resolve.</p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
            <p className="text-[#0A0A0A] text-sm font-semibold" style={SW}>Variance summary</p>
            <span className="text-[#A3A3A3] text-xs" style={SW}>Read-only</span>
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
            <p className="text-[#0A0A0A] text-sm font-semibold" style={SW}>Mismatched lines</p>
            <span className="text-[#737373] text-sm" style={SW}>{disc.lines.length} lines</span>
          </div>
          {disc.lines.map((line, idx) => (
            <div key={idx}>
              <div className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[#0A0A0A] text-sm font-medium" style={SW}>{line.name}</p>
                  <p className="text-[#737373] text-xs mt-0.5" style={SW}>Expected {line.expected} · Counted {line.counted}</p>
                </div>
                <span className="text-[#DC2626] text-sm font-semibold" style={SW}>−{line.expected - line.counted}</span>
              </div>
              {idx < disc.lines.length - 1 && <div className="h-px bg-[#F0F0F0] mx-5" />}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-2">
          <button className="w-full h-14 rounded-2xl bg-[#DC2626] text-white text-base font-semibold no-select" style={SW}>
            Open on desktop
          </button>
          <button onClick={onBack} className="w-full h-12 rounded-2xl text-[#737373] text-sm font-semibold no-select" style={SW}>
            ← Back to shipments
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCell({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="py-4 flex flex-col items-center gap-0.5">
      <span className="text-xl font-semibold" style={{ color, fontFamily: 'Switzer, sans-serif' }}>{value}</span>
      <span className="text-xs text-[#737373]" style={SW}>{label}</span>
    </div>
  )
}
