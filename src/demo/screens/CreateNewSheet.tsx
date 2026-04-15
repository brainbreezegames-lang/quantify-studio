import { X, ChevronRight, Truck, CalendarPlus, ArrowDownToLine, CalendarClock } from 'lucide-react'

interface Props {
  onClose: () => void
  onSelect: (type: 'delivery' | 'reservation' | 'return' | 'pre-return') => void
}

export default function CreateNewSheet({ onClose, onSelect }: Props) {
  return (
    <>
      <div className="absolute inset-0 bg-[#0A0F29]/60 z-30" onClick={onClose} />
      <div
        className="absolute bottom-0 left-0 right-0 bg-white z-40 rounded-t-[28px] sheet-enter overflow-hidden"
        style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.18)' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-11 h-[5px] bg-[#D4D4D4] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pt-[18px] pb-1 pl-6 pr-4">
          <div>
            <p className="text-[#0A0A0A] text-[24px] font-semibold leading-none">Create new</p>
            <p className="text-[#737373] text-sm mt-1.5">What are you working on?</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#F5F5F5] flex items-center justify-center no-select pressable flex-shrink-0">
            <X size={18} color="#525252" strokeWidth={2} />
          </button>
        </div>

        {/* GOING OUT */}
        <div className="px-6 pt-6 pb-1.5">
          <p className="text-[#737373] text-[11px] font-semibold" style={{ letterSpacing: 1 }}>GOING OUT</p>
        </div>
        <div className="flex flex-col gap-2.5 px-4 pt-2 pb-1">
          <OptionCard
            accent="#1E3FFF"
            icon={<Truck size={22} color="#1E3FFF" strokeWidth={2} />}
            iconBg="#EEF2FF"
            title="Delivery"
            subtitle="Send equipment out today"
            onTap={() => onSelect('delivery')}
          />
          <OptionCard
            accent="#1E3FFF"
            icon={<CalendarPlus size={22} color="#1E3FFF" strokeWidth={2} />}
            iconBg="#E5ECFF"
            title="Reservation"
            subtitle="Schedule a future delivery"
            onTap={() => onSelect('reservation')}
          />
        </div>

        {/* COMING IN */}
        <div className="px-6 pt-[18px] pb-1.5">
          <p className="text-[#737373] text-[11px] font-semibold" style={{ letterSpacing: 1 }}>COMING IN</p>
        </div>
        <div className="flex flex-col gap-2.5 px-4 pt-2 pb-8">
          <OptionCard
            accent="#F59E0B"
            icon={<ArrowDownToLine size={22} color="#92400E" strokeWidth={2} />}
            iconBg="#FEF3C7"
            title="Return"
            subtitle="Equipment arriving now — count it"
            onTap={() => onSelect('return')}
          />
          <OptionCard
            accent="#F59E0B"
            icon={<CalendarClock size={22} color="#92400E" strokeWidth={2} />}
            iconBg="#FEF7E6"
            title="Pre-Return"
            subtitle="Schedule a future return pickup"
            onTap={() => onSelect('pre-return')}
          />
        </div>
      </div>
    </>
  )
}

function OptionCard({ icon, iconBg, title, subtitle, onTap }: {
  accent: string; icon: JSX.Element; iconBg: string; title: string; subtitle: string; onTap: () => void
}) {
  return (
    <button
      onClick={onTap}
      className="rounded-[14px] bg-white overflow-hidden text-left no-select pressable"
      style={{ border: '1px solid #EAEAEA' }}
    >
      <div className="flex items-center gap-3.5 px-4 py-4">
        <div className="w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-[#0A0A0A] text-base font-semibold">{title}</p>
          <p className="text-[#525252] text-[13px] mt-0.5">{subtitle}</p>
        </div>
        <ChevronRight size={18} color="#999999" strokeWidth={2} />
      </div>
    </button>
  )
}
