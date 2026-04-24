import { ReactNode, useEffect, useState } from 'react'

interface Props {
  children: ReactNode
  overlay?: ReactNode
  // Floating, non-blocking UI (e.g. toast). Rendered above everything but
  // with pointer-events: none so it never blocks taps on the screen below.
  floating?: ReactNode
}

// Actual iPhone 14 CSS pixel dimensions — the phone shows at real mobile size
// even on a large desktop monitor. Never scale below 1 for usability testing;
// only scale DOWN on small viewports so the frame never gets cut off.
const PHONE_W = 390
const PHONE_H = 844
const FRAME_W = PHONE_W + 20 // 10px bezel each side
const FRAME_H = PHONE_H + 22

export default function PhoneFrame({ children, overlay, floating }: Props) {
  const [scale, setScale] = useState(1)

  // Lock body scroll
  useEffect(() => {
    const htmlEl = document.documentElement
    const bodyEl = document.body
    const prevHtml = htmlEl.style.overflow
    const prevBody = bodyEl.style.overflow
    const prevHtmlPos = htmlEl.style.position
    htmlEl.style.overflow = 'hidden'
    bodyEl.style.overflow = 'hidden'
    htmlEl.style.position = 'fixed'
    htmlEl.style.width = '100%'
    return () => {
      htmlEl.style.overflow = prevHtml
      bodyEl.style.overflow = prevBody
      htmlEl.style.position = prevHtmlPos
      htmlEl.style.width = ''
    }
  }, [])

  // Default: show the phone at 100% actual size. Only scale DOWN if the
  // viewport is too small to fit it (short laptop screens), never scale up.
  useEffect(() => {
    function update() {
      const verticalPad = 60 // room for a bit of breathing space
      const usable = window.innerHeight - verticalPad
      const s = usable < FRAME_H ? usable / FRAME_H : 1
      setScale(s)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const statusBar = (
    <div className="flex items-center justify-between px-8 pt-4 pb-1 absolute top-0 left-0 right-0 z-10 pointer-events-none">
      <span className="text-[13px] font-semibold text-[#0A0A0A]">9:41</span>
      <div className="flex gap-[5px] items-center">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="#0A0A0A"><rect x="0" y="5" width="3" height="7" rx="0.5"/><rect x="4.5" y="3" width="3" height="9" rx="0.5"/><rect x="9" y="1" width="3" height="11" rx="0.5"/><rect x="13.5" y="0" width="3" height="12" rx="0.5"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round"><path d="M1 4.5C4.5 1 11.5 1 15 4.5"/><path d="M3.5 7C5.5 5 10.5 5 12.5 7"/><circle cx="8" cy="11" r="1" fill="#0A0A0A" stroke="none"/></svg>
        <div className="flex items-center gap-[1px]">
          <div className="w-[22px] h-[11px] border border-[#0A0A0A] rounded-[2px] flex items-center px-[1px]">
            <div className="w-[16px] h-[7px] bg-[#0A0A0A] rounded-[1px]" />
          </div>
          <div className="w-[1px] h-[4px] bg-[#0A0A0A] rounded-full" />
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop — actual-size mobile phone for screen-share testing */}
      <div
        className="hidden md:flex fixed inset-0 items-center justify-center"
        style={{
          fontFamily: 'Switzer, sans-serif',
          background:
            'radial-gradient(circle at 50% 0%, #EEF2FF 0%, #E5E7EB 55%, #D1D5DB 100%)',
        }}
      >
        <div
          className="relative bg-[#111111] rounded-[52px] p-[10px]"
          style={{
            width: FRAME_W,
            height: FRAME_H,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            boxShadow:
              '0 40px 80px -30px rgba(10,13,30,0.45), 0 10px 25px -10px rgba(10,13,30,0.25), inset 0 0 0 1.5px #2a2a2a',
          }}
        >
          {/* Dynamic Island */}
          <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[110px] h-[32px] bg-[#000000] rounded-full z-30" />
          <div
            className="relative bg-white rounded-[44px] overflow-hidden"
            style={{ width: PHONE_W, height: PHONE_H }}
          >
            {statusBar}
            <div className="absolute inset-0 overflow-y-auto overflow-x-hidden pt-[44px] z-0">
              {children}
            </div>
            {overlay && (
              <div className="absolute inset-0 z-20">
                {overlay}
              </div>
            )}
            {floating && (
              <div className="absolute inset-0 z-[50] pointer-events-none">
                {floating}
              </div>
            )}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-[#0A0A0A] rounded-full opacity-40 z-30 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div
        className="md:hidden fixed inset-0 bg-white overflow-hidden"
        style={{ fontFamily: 'Switzer, sans-serif' }}
      >
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden z-0">
          {children}
        </div>
        {overlay && (
          <div className="absolute inset-0 z-20">
            {overlay}
          </div>
        )}
        {floating && (
          <div className="absolute inset-0 z-[50] pointer-events-none">
            {floating}
          </div>
        )}
      </div>
    </>
  )
}
