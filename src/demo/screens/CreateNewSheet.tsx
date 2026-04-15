import { X, ChevronRight, Truck, Calendar, Package, Clock } from 'lucide-react'

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
            <p className="text-[#0A0A0A] text-lg font-semibold">Create new</p>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center no-select pressable">
              <X size={14} color="#737373" strokeWidth={2} />
            </button>
          </div>
          <p className="text-[#737373] text-sm mb-4">What are you working on?</p>

          <p className="text-[#A3A3A3] text-[11px] font-bold tracking-widest mb-3">GOING OUT</p>

          <div className="flex flex-col gap-2 mb-5">
            <OptionCard
              icon={<Truck size={22} color="#1E3FFF" strokeWidth={2} />}
              bg="#EEF2FF"
              title="Delivery"
              subtitle="Send equipment out today"
              onTap={() => onSelect('delivery')}
            />
            <OptionCard
              icon={<Calendar size={22} color="#525252" strokeWidth={2} />}
              bg="#F5F5F5"
              title="Reservation"
              subtitle="Schedule a future delivery"
              onTap={() => onSelect('reservation')}
            />
          </div>

          <p className="text-[#A3A3A3] text-[11px] font-bold tracking-widest mb-3">COMING IN</p>

          <div className="flex flex-col gap-2 mb-8">
            <OptionCard
              icon={<Package size={22} color="#16A34A" strokeWidth={2} />}
              bg="#DCFCE7"
              title="Return"
              subtitle="Equipment arriving now — count it"
              onTap={() => onSelect('return')}
            />
            <OptionCard
              icon={<Clock size={22} color="#D97706" strokeWidth={2} />}
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

function OptionCard({ icon, bg, title, subtitle, onTap }: {
  icon: JSX.Element; bg: string; title: string; subtitle: string; onTap: () => void
}) {
  return (
    <button
      onClick={onTap}
      className="flex items-center gap-4 p-4 rounded-2xl border border-[#F0F0F0] text-left no-select pressable"
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
        {icon}
      </div>
      <div>
        <p className="text-[#0A0A0A] text-base font-semibold">{title}</p>
        <p className="text-[#737373] text-sm">{subtitle}</p>
      </div>
      <ChevronRight size={16} color="#A3A3A3" strokeWidth={2} className="ml-auto flex-shrink-0" />
    </button>
  )
}
