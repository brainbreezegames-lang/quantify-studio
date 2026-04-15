import { useEffect, useRef, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, X, Mic } from 'lucide-react'

export interface Segment {
  id: string
  text: string
  action?: () => void
  target?: string  // data-spot value to highlight
  padding?: number // extra px around the spotlight
}

interface Props {
  segments: Segment[]
  autoStart?: boolean
}

interface Rect { x: number; y: number; w: number; h: number }

export default function PresenterMode({ segments, autoStart = false }: Props) {
  const [open, setOpen] = useState(autoStart)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [rate, setRate] = useState(1.0)
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [rect, setRect] = useState<Rect | null>(null)
  const latestStepRef = useRef(step)
  const latestPlayingRef = useRef(playing)

  useEffect(() => { latestStepRef.current = step }, [step])
  useEffect(() => { latestPlayingRef.current = playing }, [playing])

  // ── Load voices ───────────────────────────────────────────────────────────
  useEffect(() => {
    function loadVoices() {
      const v = window.speechSynthesis.getVoices()
      if (v.length === 0) return
      setVoices(v)
      const preferred =
        v.find(x => x.name === 'Samantha') ||
        v.find(x => x.name === 'Ava (Premium)') ||
        v.find(x => x.name === 'Allison') ||
        v.find(x => x.name.includes('Google UK English Female')) ||
        v.find(x => x.name.includes('Google US English')) ||
        v.find(x => x.name === 'Karen') ||
        v.find(x => x.lang === 'en-US') ||
        v.find(x => x.lang.startsWith('en')) ||
        v[0]
      setVoice(preferred ?? null)
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => { window.speechSynthesis.cancel() }
  }, [])

  // ── Update spotlight when step changes ─────────────────────────────────────
  useEffect(() => {
    const seg = segments[step]
    if (!seg?.target) {
      setRect(null)
      return
    }
    const pad = seg.padding ?? 14
    let raf = 0
    function measure(attempt = 0) {
      const el = document.querySelector<HTMLElement>(`[data-spot="${seg.target}"]`)
      if (!el) {
        if (attempt < 20) { raf = requestAnimationFrame(() => measure(attempt + 1)) }
        else { setRect(null) }
        return
      }
      const r = el.getBoundingClientRect()
      // Ensure it's scrolled into view in its scroll container
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      setTimeout(() => {
        const r2 = el.getBoundingClientRect()
        setRect({ x: r2.left - pad, y: r2.top - pad, w: r2.width + pad * 2, h: r2.height + pad * 2 })
      }, 250)
    }
    // Wait for any pending navigation to render
    const t = setTimeout(() => measure(0), 120)
    return () => { clearTimeout(t); cancelAnimationFrame(raf) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, segments.length])

  // Re-measure on resize/scroll of any scroll container
  useEffect(() => {
    if (!rect) return
    function remeasure() {
      const seg = segments[latestStepRef.current]
      if (!seg?.target) return
      const el = document.querySelector<HTMLElement>(`[data-spot="${seg.target}"]`)
      if (!el) return
      const pad = seg.padding ?? 14
      const r = el.getBoundingClientRect()
      setRect({ x: r.left - pad, y: r.top - pad, w: r.width + pad * 2, h: r.height + pad * 2 })
    }
    window.addEventListener('resize', remeasure)
    window.addEventListener('scroll', remeasure, true)
    return () => {
      window.removeEventListener('resize', remeasure)
      window.removeEventListener('scroll', remeasure, true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rect !== null])

  // ── Speak when step changes while playing ──────────────────────────────────
  useEffect(() => {
    if (!playing) { window.speechSynthesis.cancel(); return }
    const seg = segments[step]
    if (!seg) { setPlaying(false); return }
    try { seg.action?.() } catch (e) { console.error(e) }

    const utter = new SpeechSynthesisUtterance(seg.text)
    if (voice) utter.voice = voice
    utter.rate = rate
    utter.pitch = 1.0
    utter.onend = () => {
      if (!latestPlayingRef.current) return
      if (latestStepRef.current !== step) return
      if (step < segments.length - 1) setStep(s => s + 1)
      else setPlaying(false)
    }
    window.speechSynthesis.cancel()
    const t = setTimeout(() => window.speechSynthesis.speak(utter), 260) // wait for nav
    return () => { clearTimeout(t); window.speechSynthesis.cancel() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, step, voice, rate])

  // ── Keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.code === 'Space') { e.preventDefault(); setPlaying(p => !p) }
      else if (e.code === 'ArrowRight') { e.preventDefault(); next() }
      else if (e.code === 'ArrowLeft') { e.preventDefault(); prev() }
      else if (e.code === 'Escape') { e.preventDefault(); close() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function start() {
    setOpen(true)
    setStep(0)
    setPlaying(true)
  }
  function close() {
    setOpen(false)
    setPlaying(false)
    window.speechSynthesis.cancel()
  }
  function next() { if (step < segments.length - 1) setStep(step + 1) }
  function prev() { if (step > 0) setStep(step - 1) }
  function toggle() { setPlaying(p => !p) }

  const current = segments[step]

  // In autoStart mode we always show the panel. Otherwise show a launcher.
  if (!open) {
    return (
      <button
        onClick={start}
        className="fixed top-5 right-5 z-[70] flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0A0A0A] text-white text-sm font-semibold shadow-lg hover:scale-[1.02] transition-transform"
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.25)', fontFamily: 'Switzer, sans-serif' }}
      >
        <Mic size={16} strokeWidth={2.5} />
        Start presentation
      </button>
    )
  }

  return (
    <>
      {/* Spotlight overlay — dims everything, cuts a hole around the target */}
      <div className="fixed inset-0 z-[55] pointer-events-none">
        {rect ? (
          <div
            className="absolute rounded-2xl transition-all"
            style={{
              left: rect.x,
              top: rect.y,
              width: rect.w,
              height: rect.h,
              boxShadow: '0 0 0 9999px rgba(10, 10, 25, 0.62)',
              transitionDuration: '520ms',
              transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
              outline: '2px solid rgba(30, 63, 255, 0.9)',
              outlineOffset: '0px',
            }}
          />
        ) : (
          // No target: soft uniform dim so subtitle reads cleanly
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10,10,25,0.35)' }} />
        )}
      </div>

      {/* Subtitle + controls */}
      <div className="fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-[640px] mx-4 mb-3 px-6 py-3.5 rounded-xl"
          style={{
            background: 'rgba(10, 10, 25, 0.38)',
            backdropFilter: 'blur(12px) saturate(140%)',
            WebkitBackdropFilter: 'blur(12px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'Switzer, sans-serif',
          }}
        >
          <p className="text-[15px] leading-[1.45] font-normal text-center" style={{ color: 'rgba(255,255,255,0.88)' }}>
            {current?.text ?? '—'}
          </p>
        </div>

        <div
          className="pointer-events-auto flex items-center gap-3 px-3 py-2.5 rounded-full bg-white mb-5"
          style={{
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            fontFamily: 'Switzer, sans-serif',
          }}
        >
          <button onClick={prev} disabled={step === 0} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F5F5F5] disabled:opacity-30">
            <SkipBack size={16} color="#0A0A0A" strokeWidth={2.4} />
          </button>
          <button onClick={toggle} className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1E3FFF] text-white hover:scale-[1.05] transition-transform">
            {playing ? <Pause size={16} color="#fff" strokeWidth={2.4} fill="#fff" /> : <Play size={16} color="#fff" strokeWidth={2.4} fill="#fff" />}
          </button>
          <button onClick={next} disabled={step === segments.length - 1} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F5F5F5] disabled:opacity-30">
            <SkipForward size={16} color="#0A0A0A" strokeWidth={2.4} />
          </button>

          <div className="w-px h-6 bg-[#EAEAEA] mx-1" />
          <div className="text-[#525252] text-[13px] font-semibold tabular-nums px-1">
            {step + 1}<span className="text-[#A3A3A3]"> / {segments.length}</span>
          </div>
          <div className="w-px h-6 bg-[#EAEAEA] mx-1" />

          <select
            value={rate}
            onChange={e => setRate(parseFloat(e.target.value))}
            className="text-[13px] font-semibold text-[#0A0A0A] bg-transparent outline-none cursor-pointer"
          >
            <option value={0.85}>0.85×</option>
            <option value={1.0}>1.0×</option>
            <option value={1.1}>1.1×</option>
            <option value={1.25}>1.25×</option>
          </select>

          {voices.length > 0 && (
            <>
              <div className="w-px h-6 bg-[#EAEAEA] mx-1" />
              <select
                value={voice?.name ?? ''}
                onChange={e => setVoice(voices.find(v => v.name === e.target.value) ?? null)}
                className="text-[13px] font-semibold text-[#0A0A0A] bg-transparent outline-none cursor-pointer max-w-[180px] truncate"
              >
                {voices.filter(v => v.lang.startsWith('en')).map(v => (
                  <option key={v.name} value={v.name}>{v.name}</option>
                ))}
              </select>
            </>
          )}

          <div className="w-px h-6 bg-[#EAEAEA] mx-1" />
          <button onClick={close} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F5F5F5]">
            <X size={16} color="#525252" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </>
  )
}
