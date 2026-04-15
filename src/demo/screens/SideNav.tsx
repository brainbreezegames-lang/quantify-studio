const SW = { fontFamily: 'Switzer, sans-serif' }

interface Props {
  selectedLocation: string
  onClose: () => void
  onProfile: () => void
  onSelectLocation: () => void
}

const NAV_ITEMS = [
  { label: "Today's Work", icon: 'list', active: true, badge: null },
  { label: 'In Transit', icon: 'truck', active: false, badge: '1' },
  { label: 'History', icon: 'clock', active: false, badge: null },
  { label: 'My Profile', icon: 'user', active: false, badge: null },
  { label: 'Settings', icon: 'settings', active: false, badge: null },
]

export default function SideNav({ selectedLocation, onClose, onProfile, onSelectLocation }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 z-30" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-white z-40 flex flex-col shadow-2xl screen-enter-back">
        {/* Header */}
        <div className="bg-[#1E3FFF] px-6 pt-10 pb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white text-lg font-semibold" style={SW}>Quantify</p>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center no-select">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <p className="text-white/60 text-[10px] font-bold tracking-widest mb-1" style={SW}>CURRENT BRANCH</p>
          <button onClick={onSelectLocation} className="flex items-center gap-2 no-select">
            <p className="text-white text-sm font-semibold" style={SW}>{selectedLocation}</p>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4">
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              onClick={item.label === 'My Profile' ? onProfile : onClose}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-1 no-select transition-colors"
              style={{ backgroundColor: item.active ? '#EEF2FF' : 'transparent' }}
            >
              <NavIcon name={item.icon} active={item.active} />
              <span
                className="flex-1 text-sm font-semibold text-left"
                style={{ color: item.active ? '#1E3FFF' : '#0A0A0A', fontFamily: 'Switzer, sans-serif' }}
              >
                {item.label}
              </span>
              {item.badge && (
                <span className="w-5 h-5 rounded-full bg-[#1E3FFF] text-white text-[10px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Connection card */}
        <div className="mx-4 mb-6 px-4 py-3 bg-[#F0FDF4] rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
          <div>
            <p className="text-[#15803D] text-sm font-semibold" style={SW}>Connected</p>
            <p className="text-[#737373] text-xs" style={SW}>Last sync 11:05 AM</p>
          </div>
        </div>
      </div>
    </>
  )
}

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? '#1E3FFF' : '#737373'
  const icons: Record<string, JSX.Element> = {
    list: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    truck: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    clock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  }
  return icons[name] ?? null
}
