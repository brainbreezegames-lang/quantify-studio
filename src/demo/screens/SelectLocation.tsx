import { ChevronLeft, Check, Building2, Warehouse, MapPin } from 'lucide-react'
import { LOCATIONS } from '../data'

interface Props {
  selectedLocation: string
  onSelect: (name: string) => void
  onBack: () => void
}

export default function SelectLocation({ selectedLocation, onSelect, onBack }: Props) {
  const branches = LOCATIONS.filter(l => l.type === 'branch')

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Blue hero header — matches ShipmentList */}
      <div className="bg-[#1E3FFF] px-5 pt-[18px] pb-7">
        <div className="flex items-center justify-between mb-[18px]">
          <button onClick={onBack} className="w-11 h-11 rounded-full bg-white/[0.15] flex items-center justify-center no-select pressable">
            <ChevronLeft size={22} color="#fff" strokeWidth={2} />
          </button>
          <div className="w-11" />
        </div>
        <h1 className="text-white text-[34px] font-semibold leading-[1.1] tracking-[-0.8px]">Select location</h1>
        <p className="text-white/90 text-sm font-semibold mt-[18px]">
          {branches.length} branch offices  ·  {LOCATIONS.filter(l => l.type === 'laydown').length} laydown yards
        </p>
      </div>

      {/* List */}
      <div className="flex flex-col gap-[14px] p-4 pb-7">
        {branches.map(branch => {
          const isCurrentBranch = selectedLocation.includes(branch.name)
          const subs = LOCATIONS.filter(l => l.parentId === branch.id)

          return (
            <div
              key={branch.id}
              className="bg-white rounded-[20px] border border-[#EAEAEA] overflow-hidden shadow-[0_4px_16px_rgba(10,13,30,0.04)]"
            >
              {/* Stripe — blue if any child is selected */}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: isCurrentBranch ? '#1E3FFF' : '#E5E7EB' }}
              />

              {/* Branch row */}
              <button
                onClick={() => onSelect(branch.name)}
                className="w-full flex items-center justify-between px-[22px] py-5 text-left no-select pressable"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: selectedLocation === branch.name ? '#1E3FFF' : '#EEF2FF',
                    }}
                  >
                    {selectedLocation === branch.name
                      ? <Check size={16} color="#fff" strokeWidth={2.5} />
                      : <Building2 size={16} color="#1E3FFF" strokeWidth={2.2} />}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#0A0A0A] text-lg font-bold tracking-[-0.2px] leading-none">{branch.name}</span>
                    <span className="text-[#737373] text-[13px] font-medium">{branch.city}</span>
                  </div>
                  {selectedLocation === branch.name && (
                    <span
                      className="text-[10px] font-bold px-2 py-[3px] rounded-full ml-1"
                      style={{ backgroundColor: '#E5ECFF', color: '#1E3FFF', letterSpacing: 0.5 }}
                    >
                      CURRENT
                    </span>
                  )}
                </div>
                <span className="text-[#737373] text-xs font-semibold">{subs.length + 1} total</span>
              </button>

              {/* Divider + sub-locations */}
              {subs.length > 0 && (
                <>
                  <div className="h-px bg-[#F0F0F0]" />
                  <div className="flex flex-col">
                    {subs.map((sub, idx) => {
                      const isSelected = selectedLocation === sub.name
                      return (
                        <div key={sub.id}>
                          <button
                            onClick={() => onSelect(sub.name)}
                            className="w-full flex items-center justify-between px-[22px] py-[14px] text-left no-select pressable"
                            style={{ backgroundColor: isSelected ? '#EEF2FF' : 'transparent' }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: isSelected ? '#1E3FFF' : '#FEF3C7' }}
                              >
                                {isSelected
                                  ? <Check size={16} color="#fff" strokeWidth={2.5} />
                                  : <Warehouse size={15} color="#92400E" strokeWidth={2.2} />}
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[#0A0A0A] text-[15px] font-bold leading-none">{sub.name}</span>
                                <div className="flex items-center gap-1.5">
                                  <MapPin size={12} color="#737373" strokeWidth={2} />
                                  <span className="text-[#737373] text-xs font-medium">{sub.city}</span>
                                </div>
                              </div>
                              {isSelected && (
                                <span
                                  className="text-[10px] font-bold px-2 py-[3px] rounded-full ml-1"
                                  style={{ backgroundColor: '#E5ECFF', color: '#1E3FFF', letterSpacing: 0.5 }}
                                >
                                  CURRENT
                                </span>
                              )}
                            </div>
                            <span className="text-[#737373] text-[11px] font-bold uppercase" style={{ letterSpacing: 0.5 }}>LAYDOWN</span>
                          </button>
                          {idx < subs.length - 1 && <div className="h-px bg-[#F5F5F5] mx-[22px]" />}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
