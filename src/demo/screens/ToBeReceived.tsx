import { Check } from 'lucide-react'
import { Shipment } from '../data'
import StickyCTA from '../components/StickyCTA'

interface Props {
  shipment: Shipment
  summary: { units: number; variances: number; flagged: number }
  onDone: () => void
}

export default function ToBeReceived({ shipment, summary, onDone }: Props) {
  const isReturn = shipment.type === 'PRE-RETURN'
  const accentColor = isReturn ? '#D97706' : '#1E3FFF'
  const statusText = isReturn ? 'Return submitted' : 'To Be Received'

  const steps = isReturn
    ? [
        { label: 'Yard counted', sub: '11:05 AM', done: true },
        { label: 'Office reviewing', sub: 'Started 11:06', done: true },
        { label: 'Rent stopped', sub: 'Pending confirmation', done: false },
      ]
    : [
        { label: 'Yard counted', sub: '11:05 AM', done: true },
        { label: 'Office reviewing', sub: 'Started 11:06', done: true },
        { label: 'In Transit', sub: 'Pending', done: false },
      ]

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-5 pt-4 pb-5 flex items-center gap-3" style={{ backgroundColor: accentColor }}>
        <div className="w-9" />
        <div className="flex-1 text-center">
          <p className="text-white text-base font-semibold">{shipment.id}</p>
          <p className="text-white/70 text-xs">{statusText}</p>
        </div>
        <div className="w-9" />
      </div>

      <div className="flex flex-col gap-3 p-4 pb-4">
        {/* Status card */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-[#F0F0F0]">
            <span
              data-spot="to-be-received-pill"
              className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-3"
              style={{ backgroundColor: isReturn ? '#FEF3C7' : '#EEF2FF', color: accentColor }}
            >
              {isReturn ? 'RETURN SUBMITTED' : 'TO BE RECEIVED'}
            </span>
            <p className="text-[#0A0A0A] text-xl font-semibold">{shipment.jobsite}</p>
          </div>

          {/* Stepper */}
          <div data-spot="stepper" className="px-5 py-5 flex flex-col gap-0">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: step.done ? accentColor : '#F0F0F0' }}
                  >
                    {step.done ? (
                      <Check size={12} color="#fff" strokeWidth={3} />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[#D4D4D4]" />
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-0.5 h-8 mt-1" style={{ backgroundColor: step.done ? accentColor : '#F0F0F0' }} />
                  )}
                </div>
                {/* Label */}
                <div className="pb-8 last:pb-0">
                  <p className="text-[#0A0A0A] text-sm font-semibold">{step.label}</p>
                  <p className="text-[#737373] text-xs mt-0.5">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="px-5 py-4 bg-[#EEF2FF] border-t border-[#F0F0F0]">
            <p className="text-[#1E3FFF] text-sm">
              {isReturn
                ? 'Rent stops after the office confirms this return.'
                : "Rent doesn't start until the office confirms and the truck arrives at the customer."}
            </p>
          </div>
        </div>

        {/* Truck note (delivery only) */}
        {!isReturn && (
          <div className="bg-white rounded-2xl px-5 py-4">
            <p className="text-[#0A0A0A] text-sm font-semibold">{shipment.truckLabel} sent</p>
            <p className="text-[#737373] text-sm mt-1">Quantify will auto-generate the next loading session for the remaining items on Truck 2.</p>
          </div>
        )}

        {/* Summary */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
            <p className="text-[#0A0A0A] text-sm font-semibold">Submitted summary</p>
            <span className="text-[#1E3FFF] text-sm font-semibold">View all</span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-[#F0F0F0]">
            <StatCell value={String(summary.units)} label="Units" color="#0A0A0A" />
            <StatCell value={String(summary.variances)} label="Variances" color={summary.variances > 0 ? '#D97706' : '#0A0A0A'} />
            <StatCell value={String(summary.flagged)} label="Flagged" color={summary.flagged > 0 ? '#DC2626' : '#0A0A0A'} />
          </div>
        </div>

      </div>

      <div className="flex-1" />

      <StickyCTA accentColor={accentColor} onClick={onDone}>
        View other shipments
      </StickyCTA>
    </div>
  )
}

function StatCell({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="py-4 flex flex-col items-center gap-0.5">
      <span className="text-xl font-semibold" style={{ color }}>{value}</span>
      <span className="text-xs text-[#737373]">{label}</span>
    </div>
  )
}
