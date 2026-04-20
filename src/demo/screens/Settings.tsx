import { useState } from 'react'
import { ChevronLeft, Check } from 'lucide-react'

// Brian: "all we need is a page that allows them to customize the display
// of the jobsite (name, number-name, name-number)."
type JobSiteDisplay = 'name' | 'number-name' | 'name-number'

const OPTIONS: { key: JobSiteDisplay; label: string; preview: string }[] = [
  { key: 'name',          label: 'Name',              preview: 'Vanguard Plant Systems' },
  { key: 'number-name',   label: 'Number – Name',     preview: 'JS-0942 – Vanguard Plant Systems' },
  { key: 'name-number',   label: 'Name – Number',     preview: 'Vanguard Plant Systems – JS-0942' },
]

export default function Settings({ onBack }: { onBack: () => void }) {
  const [value, setValue] = useState<JobSiteDisplay>('name')

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F5]">
      {/* Blue hero */}
      <div className="bg-[#1E3FFF] px-5 pt-[18px] pb-7">
        <div className="flex items-center justify-between mb-[18px]">
          <button onClick={onBack} className="w-11 h-11 rounded-full bg-white/[0.15] flex items-center justify-center no-select pressable">
            <ChevronLeft size={22} color="#fff" strokeWidth={2} />
          </button>
          <div className="w-11" />
        </div>
        <h1 className="text-white text-[34px] font-semibold leading-[1.1] tracking-[-0.8px]">Settings</h1>
        <p className="text-white/90 text-sm font-semibold mt-[18px]">Customize how jobsites appear across the app</p>
      </div>

      <div className="flex flex-col gap-[14px] p-4 pb-8">
        <div className="px-1 pt-1 pb-1">
          <p className="text-[#737373] text-[11px] font-bold uppercase" style={{ letterSpacing: 1.4 }}>
            Job Site display
          </p>
          <p className="text-[#525252] text-[13px] font-medium mt-1.5 leading-snug">
            Applies wherever a jobsite appears — list cards, detail, and reviews.
          </p>
        </div>

        <div className="bg-white rounded-[20px] border border-[#EAEAEA] shadow-[0_4px_16px_rgba(10,13,30,0.04)] overflow-hidden">
          {OPTIONS.map((opt, idx) => {
            const active = value === opt.key
            return (
              <button
                key={opt.key}
                onClick={() => setValue(opt.key)}
                className="w-full flex items-center gap-4 px-[22px] py-[18px] text-left no-select pressable"
                style={{ backgroundColor: active ? '#EEF2FF' : 'transparent' }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    border: `2px solid ${active ? '#1E3FFF' : '#D4D4D4'}`,
                    backgroundColor: active ? '#1E3FFF' : '#FFFFFF',
                  }}
                >
                  {active && <Check size={13} color="#fff" strokeWidth={2.8} />}
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <p className="text-[#0A0A0A] text-[15px] font-bold leading-none">{opt.label}</p>
                  <p className="text-[#525252] text-[13px] font-medium truncate">{opt.preview}</p>
                </div>
                {idx === 0 && !active && (
                  <span
                    className="text-[10px] font-bold px-2 py-[3px] rounded-full"
                    style={{ backgroundColor: '#F3F4F6', color: '#525252', letterSpacing: 0.5 }}
                  >
                    DEFAULT
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
