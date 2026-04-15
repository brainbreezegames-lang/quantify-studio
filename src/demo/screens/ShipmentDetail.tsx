import { Shipment, totalExpected } from '../data'

const SW = { fontFamily: 'Switzer, sans-serif' }

interface Props {
  shipment: Shipment
  onBack: () => void
  onStart: () => void
}

export default function ShipmentDetail({ shipment, onBack, onStart }: Props) {
  const isReturn = shipment.type === 'PRE-RETURN'
  const accentColor = isReturn ? '#D97706' : '#1E3FFF'
  const bgColor = isReturn ? '#FEF3C7' : '#EEF2FF'
  const label = isReturn ? 'PRE-RETURN' : 'DELIVERY'
  const total = totalExpected(shipment.items)

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-[#1E3FFF] px-5 pt-4 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center no-select">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <p className="text-white/70 text-xs" style={SW}>{shipment.id}</p>
            <p className="text-white text-lg font-semibold" style={SW}>Shipment detail</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 pb-8">
        {/* Main card */}
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Job site */}
          <div className="px-5 pt-5 pb-4 border-b border-[#F0F0F0]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: bgColor, color: accentColor, fontFamily: 'Switzer, sans-serif' }}>
                {label}
              </span>
            </div>
            <h2 className="text-[#0A0A0A] text-xl font-semibold" style={SW}>{shipment.jobsite}</h2>
            <p className="text-[#737373] text-sm mt-0.5" style={SW}>{shipment.location}</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-[#F0F0F0] border-b border-[#F0F0F0]">
            {[
              { label: 'Items', value: shipment.items.length },
              { label: 'Units', value: total },
              { label: 'Time', value: shipment.time },
            ].map(({ label, value }) => (
              <div key={label} className="py-4 flex flex-col items-center gap-0.5">
                <span className="text-[#0A0A0A] text-lg font-semibold" style={SW}>{value}</span>
                <span className="text-[#737373] text-xs" style={SW}>{label}</span>
              </div>
            ))}
          </div>

          {/* Logistics */}
          <div className="px-5 py-4 flex flex-col gap-3 border-b border-[#F0F0F0]">
            <InfoRow icon="calendar" label={shipment.date} />
            <InfoRow icon="user" label={`Driver · ${shipment.driver}`} />
            <InfoRow icon="truck" label={`Vehicle · ${shipment.vehicle}`} />
          </div>

          {/* Expected items */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#0A0A0A] text-sm font-semibold" style={SW}>Expected items</span>
              <span className="text-[#737373] text-sm" style={SW}>{total} total</span>
            </div>
            <div className="flex flex-col gap-2">
              {shipment.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-[#0A0A0A] text-sm font-medium" style={SW}>{item.name}</p>
                    <p className="text-[#737373] text-xs" style={SW}>{item.subtitle}</p>
                  </div>
                  <span className="text-[#0A0A0A] text-sm font-semibold" style={SW}>×{item.expected}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="w-full h-14 rounded-2xl text-white text-base font-semibold flex items-center justify-center gap-2 no-select active:opacity-90 transition-opacity"
          style={{ backgroundColor: accentColor, fontFamily: 'Switzer, sans-serif' }}
        >
          {isReturn ? 'Start receiving' : 'Start counting'}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  )
}

function InfoRow({ icon, label }: { icon: string; label: string }) {
  const icons: Record<string, JSX.Element> = {
    calendar: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    user: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    truck: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  }
  return (
    <div className="flex items-center gap-3">
      {icons[icon]}
      <span className="text-[#0A0A0A] text-sm" style={{ fontFamily: 'Switzer, sans-serif' }}>{label}</span>
    </div>
  )
}
