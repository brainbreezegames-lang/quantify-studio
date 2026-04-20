import { X, ChevronRight, Settings, LogOut, Globe } from 'lucide-react'

interface Props {
  selectedLocation: string
  onClose: () => void
  onProfile: () => void
  onSelectLocation: () => void
  onOpenSettings: () => void
}

export default function SideNav({ onClose, onOpenSettings }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 z-30" onClick={onClose} />

      {/* Drawer */}
      <div
        className="absolute top-0 left-0 bottom-0 w-[320px] bg-white z-40 flex flex-col nav-enter"
        style={{ boxShadow: '8px 0 40px rgba(0,0,0,0.25)' }}
      >
        {/* Header - avatar + name + title only.
            Brian: "locations can be many and may overlap — maybe later add a Who am I page." */}
        <div className="bg-[#1E3FFF] pt-12 pb-[30px] pl-6 pr-5">
          <div className="flex items-start justify-between mb-[22px]">
            <div className="w-14 h-14 rounded-full bg-white/[0.2] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg font-bold">JD</span>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/[0.15] flex items-center justify-center no-select pressable">
              <X size={18} color="#fff" strokeWidth={2} />
            </button>
          </div>
          <p className="text-white text-[22px] font-bold tracking-[-0.3px] leading-tight">Jacob Davis</p>
          <p className="text-white/80 text-sm font-semibold mt-1">Yard Worker</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 pt-[18px] pb-[22px] px-2.5 flex flex-col">
          {/* Server URL */}
          <div className="px-3.5 py-4 rounded-2xl flex items-center gap-3.5">
            <Globe size={22} color="#737373" strokeWidth={2} />
            <div className="min-w-0 flex-1 flex flex-col gap-1">
              <p className="text-[#0A0A0A] text-[15px] font-bold leading-none">atpac.quantify.cloud</p>
              <div className="flex items-center gap-[7px]">
                <div className="w-[7px] h-[7px] rounded-full bg-[#16A34A]" />
                <span className="text-xs font-semibold text-[#16A34A]">Connected</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#F0F0F0] mx-3" />

          {/* Settings — Brian: single-purpose settings page for Job Site display */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3.5 px-3.5 py-4 rounded-2xl no-select pressable"
          >
            <Settings size={22} color="#525252" strokeWidth={2} />
            <span className="flex-1 text-base font-bold text-left text-[#0A0A0A]">Settings</span>
            <ChevronRight size={20} color="#737373" strokeWidth={2} />
          </button>

          <div className="flex-1" />

          {/* Sign Out */}
          <button
            onClick={onClose}
            className="w-full flex items-center gap-3.5 px-3.5 py-4 rounded-2xl no-select pressable"
          >
            <LogOut size={22} color="#991B1B" strokeWidth={2} />
            <span className="flex-1 text-base font-bold text-left text-[#991B1B]">Sign Out</span>
          </button>
        </nav>
      </div>
    </>
  )
}
