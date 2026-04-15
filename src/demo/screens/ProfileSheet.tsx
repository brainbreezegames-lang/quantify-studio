const SW = { fontFamily: 'Switzer, sans-serif' }

interface Props {
  onClose: () => void
}

export default function ProfileSheet({ onClose }: Props) {
  return (
    <>
      <div className="absolute inset-0 bg-black/30 z-30" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white z-40 rounded-t-3xl sheet-enter overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#D4D4D4] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
          <p className="text-[#0A0A0A] text-lg font-semibold" style={SW}>Profile</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center no-select">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Identity */}
        <div className="px-6 py-5 flex items-center gap-4 border-b border-[#F0F0F0]">
          <div className="w-16 h-16 rounded-full bg-[#1E3FFF] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl font-bold" style={SW}>JD</span>
          </div>
          <div>
            <p className="text-[#0A0A0A] text-lg font-semibold" style={SW}>John Doe</p>
            <p className="text-[#737373] text-sm" style={SW}>Yard Worker</p>
            <p className="text-[#A3A3A3] text-xs mt-0.5" style={SW}>Active since Jan 2024</p>
          </div>
        </div>

        {/* Detail rows */}
        <div className="px-6 py-4 border-b border-[#F0F0F0] flex flex-col gap-3">
          <DetailRow label="Branch" value="New York Branch Office" />
          <DetailRow label="Phone" value="(713) 555-0142" />
          <DetailRow label="Email" value="john.doe@atpac.com" />
        </div>

        {/* Today's stats */}
        <div className="px-6 py-4 border-b border-[#F0F0F0]">
          <p className="text-[#737373] text-[11px] font-bold tracking-widest mb-3" style={SW}>TODAY'S STATS</p>
          <div className="flex gap-4">
            <StatPill value="1" label="Submitted" color="#16A34A" />
            <StatPill value="2" label="In Progress" color="#D97706" />
            <StatPill value="1" label="To Be Received" color="#0369A1" />
          </div>
        </div>

        {/* Sign out */}
        <div className="px-6 py-5">
          <button className="w-full h-12 rounded-2xl border border-[#F0F0F0] text-sm font-semibold text-[#DC2626] no-select" style={SW}>
            Sign Out
          </button>
        </div>
      </div>
    </>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#737373] text-sm" style={SW}>{label}</span>
      <span className="text-[#0A0A0A] text-sm font-medium" style={SW}>{value}</span>
    </div>
  )
}

function StatPill({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="flex-1 bg-[#F5F5F5] rounded-2xl py-3 flex flex-col items-center gap-0.5">
      <span className="text-xl font-semibold" style={{ color, fontFamily: 'Switzer, sans-serif' }}>{value}</span>
      <span className="text-[10px] text-[#737373] text-center leading-snug" style={SW}>{label}</span>
    </div>
  )
}
