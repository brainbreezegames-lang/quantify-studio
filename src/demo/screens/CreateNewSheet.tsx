const SW = { fontFamily: 'Switzer, sans-serif' }

interface Props {
  onClose: () => void
  onSelect: (type: 'delivery' | 'reservation' | 'return' | 'pre-return') => void
}

export default function CreateNewSheet({ onClose, onSelect }: Props) {
  return (
    <>
      <div className="absolute inset-0 bg-black/30 z-30" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white z-40 rounded-t-3xl sheet-enter overflow-hidden">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#D4D4D4] rounded-full" />
        </div>

        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[#0A0A0A] text-lg font-semibold" style={SW}>Create new</p>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center no-select">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <p className="text-[#737373] text-sm mb-4" style={SW}>What are you working on?</p>

          <p className="text-[#A3A3A3] text-[11px] font-bold tracking-widest mb-3" style={SW}>GOING OUT</p>

          <div className="flex flex-col gap-2 mb-5">
            <OptionCard
              icon="truck"
              color="#1E3FFF"
              bg="#EEF2FF"
              title="Delivery"
              subtitle="Send equipment out today"
              onTap={() => onSelect('delivery')}
            />
            <OptionCard
              icon="calendar"
              color="#525252"
              bg="#F5F5F5"
              title="Reservation"
              subtitle="Schedule a future delivery"
              onTap={() => onSelect('reservation')}
            />
          </div>

          <p className="text-[#A3A3A3] text-[11px] font-bold tracking-widest mb-3" style={SW}>COMING IN</p>

          <div className="flex flex-col gap-2 mb-8">
            <OptionCard
              icon="package"
              color="#16A34A"
              bg="#DCFCE7"
              title="Return"
              subtitle="Equipment arriving now — count it"
              onTap={() => onSelect('return')}
            />
            <OptionCard
              icon="clock"
              color="#D97706"
              bg="#FEF3C7"
              title="Pre-Return"
              subtitle="Schedule a future return pickup"
              onTap={() => onSelect('pre-return')}
            />
          </div>
        </div>
      </div>
    </>
  )
}

function OptionCard({ icon, color, bg, title, subtitle, onTap }: {
  icon: string; color: string; bg: string; title: string; subtitle: string; onTap: () => void
}) {
  const icons: Record<string, JSX.Element> = {
    truck: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    calendar: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    package: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    clock: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  }

  return (
    <button
      onClick={onTap}
      className="flex items-center gap-4 p-4 rounded-2xl border border-[#F0F0F0] text-left no-select active:bg-[#F5F5F5] transition-colors"
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
        {icons[icon]}
      </div>
      <div>
        <p className="text-[#0A0A0A] text-base font-semibold" style={SW}>{title}</p>
        <p className="text-[#737373] text-sm" style={SW}>{subtitle}</p>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" className="ml-auto flex-shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  )
}
