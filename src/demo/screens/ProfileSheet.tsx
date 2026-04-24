import { X } from 'lucide-react'

interface Props {
  onClose: () => void
}

export default function ProfileSheet({ onClose }: Props) {
  return (
    <>
      <div className="absolute inset-0 bg-black/40 z-30" onClick={onClose} />
      <div
        className="absolute bottom-0 left-0 right-0 bg-white z-40 sheet-enter overflow-hidden"
        style={{
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          boxShadow: '0 -12px 40px rgba(0,0,0,0.2)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1.5">
          <div className="w-12 h-[5px] bg-[#D4D4D4] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-[18px] pb-4">
          <p className="text-[#0A0A0A] text-xl font-bold tracking-[-0.3px]">Profile</p>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center no-select pressable">
            <X size={20} color="#525252" strokeWidth={2} />
          </button>
        </div>

        {/* Identity */}
        <div className="px-6 py-5 flex items-center gap-4 border-t border-[#F0F0F0]">
          <div className="w-16 h-16 rounded-full bg-[#1E3FFF] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl font-bold">JD</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[#0A0A0A] text-xl font-bold tracking-[-0.3px]">Jacob Davis</p>
            <p className="text-[#525252] text-sm font-semibold">Yard Worker</p>
            <p className="text-[#737373] text-xs font-medium">Active since Jan 2024</p>
          </div>
        </div>

        {/* Detail rows */}
        <div className="px-6 py-4 border-t border-[#F0F0F0] flex flex-col gap-3.5">
          <DetailRow label="Branch" value="New York" />
          <DetailRow label="Phone" value="(713) 555-0142" />
          <DetailRow label="Email" value="jacob.davis@atpac.com" />
        </div>

        {/* Today's stats */}
        <div className="px-6 py-4 border-t border-[#F0F0F0]">
          <p className="text-[#737373] text-[11px] font-bold uppercase mb-3.5" style={{ letterSpacing: 1.4 }}>TODAY'S STATS</p>
          <div className="flex gap-3">
            <StatPill value="1" label="Submitted" color="#16A34A" />
            <StatPill value="2" label="In Progress" color="#D97706" />
            <StatPill value="1" label="To Be Received" color="#0369A1" />
          </div>
        </div>

        {/* Sign out */}
        <div className="px-6 pt-4 pb-7">
          <button className="w-full h-12 rounded-2xl border border-[#EAEAEA] text-base font-bold text-[#991B1B] no-select pressable">
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
      <span className="text-[#737373] text-sm font-medium">{label}</span>
      <span className="text-[#0A0A0A] text-sm font-bold">{value}</span>
    </div>
  )
}

function StatPill({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="flex-1 bg-[#F5F5F5] rounded-2xl py-3.5 flex flex-col items-center gap-1">
      <span className="text-2xl font-bold tracking-[-0.3px]" style={{ color }}>{value}</span>
      <span className="text-[11px] font-semibold text-[#737373] text-center leading-snug">{label}</span>
    </div>
  )
}
