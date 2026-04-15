import { X, ChevronRight, List, Truck, Clock, User, Settings } from 'lucide-react'

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
      <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-white z-40 flex flex-col shadow-2xl nav-enter">
        {/* Header */}
        <div className="bg-[#1E3FFF] px-6 pt-10 pb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white text-lg font-semibold">Quantify</p>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center no-select pressable">
              <X size={16} color="#fff" strokeWidth={2} />
            </button>
          </div>
          <p className="text-white/60 text-[10px] font-bold tracking-widest mb-1">CURRENT BRANCH</p>
          <button onClick={onSelectLocation} className="flex items-center gap-2 no-select pressable">
            <p className="text-white text-sm font-semibold">{selectedLocation}</p>
            <ChevronRight size={12} color="rgba(255,255,255,0.7)" strokeWidth={2.5} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4">
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              onClick={item.label === 'My Profile' ? onProfile : onClose}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-1 no-select transition-colors pressable"
              style={{ backgroundColor: item.active ? '#EEF2FF' : 'transparent' }}
            >
              <NavIcon name={item.icon} active={item.active} />
              <span
                className="flex-1 text-sm font-semibold text-left"
                style={{ color: item.active ? '#1E3FFF' : '#0A0A0A' }}
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
            <p className="text-[#15803D] text-sm font-semibold">Connected</p>
            <p className="text-[#737373] text-xs">Last sync 11:05 AM</p>
          </div>
        </div>
      </div>
    </>
  )
}

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? '#1E3FFF' : '#737373'
  const icons: Record<string, JSX.Element> = {
    list: <List size={18} color={color} strokeWidth={2} />,
    truck: <Truck size={18} color={color} strokeWidth={2} />,
    clock: <Clock size={18} color={color} strokeWidth={2} />,
    user: <User size={18} color={color} strokeWidth={2} />,
    settings: <Settings size={18} color={color} strokeWidth={2} />,
  }
  return icons[name] ?? null
}
