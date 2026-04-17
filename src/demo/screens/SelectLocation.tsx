import { ArrowLeft, Check, Home, Package } from 'lucide-react'
import { LOCATIONS, Location } from '../data'

interface Props {
  selectedLocation: string
  onSelect: (name: string) => void
  onBack: () => void
}

export default function SelectLocation({ selectedLocation, onSelect, onBack }: Props) {
  const branches = LOCATIONS.filter(l => l.type === 'branch')

  const currentBranch = LOCATIONS.find(l => l.name === selectedLocation || selectedLocation.includes(l.name))
    ?? branches[0]

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Header — no search (no search needed per design direction) */}
      <div className="bg-white px-4 pt-[18px] pb-[18px] flex items-center gap-3.5 border-b border-[#EAEAEA]">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center no-select pressable flex-shrink-0">
          <ArrowLeft size={20} color="#0A0A0A" strokeWidth={2} />
        </button>
        <p className="text-[#0A0A0A] text-[19px] font-semibold flex-1">Select location</p>
      </div>

      {/* Branch offices with nested laydowns */}
      <div className="px-4 pt-6 pb-8">
        <p className="text-[#737373] text-[11px] font-bold px-2 mb-3" style={{ letterSpacing: 1 }}>BRANCH OFFICES</p>
        <div className="flex flex-col gap-1">
          {branches.map(branch => {
            const isCurrent = currentBranch?.id === branch.id
            const subLocations = LOCATIONS.filter(l => l.parentId === branch.id)

            return (
              <div key={branch.id}>
                {/* Branch row */}
                <button
                  onClick={() => onSelect(branch.name)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-[14px] no-select pressable text-left"
                  style={{
                    backgroundColor: isCurrent ? '#EEF2FF' : '#F9F9F9',
                    border: isCurrent ? '1.5px solid #1E3FFF' : '1px solid #EAEAEA',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: isCurrent ? '#1E3FFF' : '#EAEAEA' }}
                  >
                    {isCurrent
                      ? <Check size={20} color="#fff" strokeWidth={2.5} />
                      : <Home size={18} color="#525252" strokeWidth={2} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[15px] font-semibold"
                      style={{ color: isCurrent ? '#1E3FFF' : '#0A0A0A' }}
                    >
                      {branch.name}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: isCurrent ? '#3B5FFF' : '#737373' }}
                    >
                      {isCurrent ? 'Branch Office · Currently selected' : 'Branch Office'}
                    </p>
                  </div>
                </button>

                {/* Nested sub-locations (laydown yards / staging areas) */}
                {subLocations.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => onSelect(sub.name)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-[14px] no-select pressable text-left mt-1"
                    style={{
                      marginLeft: 36,
                      width: 'calc(100% - 36px)',
                      backgroundColor: 'white',
                      border: '1px solid #EAEAEA',
                    }}
                  >
                    <div className="w-8 h-8 rounded-[8px] bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                      <Package size={15} color="#92400E" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#0A0A0A]">{sub.name}</p>
                      <p className="text-xs text-[#737373] mt-0.5 capitalize">{sub.type === 'laydown' ? 'Laydown yard' : sub.type}</p>
                    </div>
                  </button>
                ))}

                {/* Spacer between branches */}
                <div className="h-4" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
