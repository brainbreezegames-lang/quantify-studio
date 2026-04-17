import { X, ChevronRight, Settings, LogOut, Globe } from 'lucide-react'

interface Props {
  selectedLocation: string
  onClose: () => void
  onProfile: () => void
  onSelectLocation: () => void
}

export default function SideNav({ selectedLocation, onClose, onProfile, onSelectLocation }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 z-30" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute top-0 left-0 bottom-0 w-[300px] bg-white z-40 flex flex-col shadow-2xl nav-enter">
        {/* Header — avatar + name + role */}
        <div className="bg-[#1E3FFF] px-6 pt-10 pb-6">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[16px] font-bold">JD</span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center no-select pressable mt-1">
              <X size={16} color="#fff" strokeWidth={2} />
            </button>
          </div>
          <p className="text-white text-[18px] font-semibold leading-tight">Jacob Davis</p>
          <p className="text-white/70 text-sm mt-0.5">
            Yard Worker · {selectedLocation.replace(' Branch Office', '').replace(' Branch', '')}
          </p>
        </div>

        {/* Nav — Brian: "Settings (there will be a few user-specific settings)" */}
        <nav className="flex-1 px-3 py-4">
          {/* Server URL */}
          <div className="mx-1 mb-1 px-4 py-3.5 rounded-2xl flex items-center gap-3">
            <Globe size={18} color="#737373" strokeWidth={2} />
            <div className="min-w-0 flex-1">
              <p className="text-[#525252] text-sm font-semibold">atpac.quantify.cloud</p>
              <p className="text-[#A3A3A3] text-xs mt-0.5">Connected</p>
            </div>
          </div>

          <div className="h-px bg-[#F0F0F0] mx-4 my-2" />

          {/* Settings */}
          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-1 no-select transition-colors pressable"
          >
            <Settings size={18} color="#737373" strokeWidth={2} />
            <span className="flex-1 text-sm font-semibold text-left text-[#0A0A0A]">Settings</span>
            <ChevronRight size={16} color="#C4C4C4" strokeWidth={2} />
          </button>

          <div className="flex-1" />

          {/* Sign Out */}
          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl no-select transition-colors pressable mt-2"
          >
            <LogOut size={18} color="#991B1B" strokeWidth={2} />
            <span className="flex-1 text-sm font-semibold text-left text-[#991B1B]">Sign Out</span>
          </button>
        </nav>
      </div>
    </>
  )
}
