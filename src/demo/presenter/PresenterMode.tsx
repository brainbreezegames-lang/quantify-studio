import { useEffect, useRef, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, X, Mic } from 'lucide-react'

export interface Segment {
  id: string
  text: string
  action?: () => void
  target?: string
  padding?: number
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
  const [rate, setRate] = useState(0.98)
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [rect, setRect] = useState<Rect | null>(null)
  const [caption, setCaption] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  const latestStepRef = useRef(step)
  const latestPlayingRef = useRef(playing)
  const sentenceIdxRef = useRef(0)
  const sentencesRef = useRef<string[]>([])
  const timerRef = useRef<number | null>(null)

  useEffect(() => { latestStepRef.current = step }, [step])
  useEffect(() => { latestPlayingRef.current = playing }, [playing])

  // ── Voice loading ─────────────────────────────────────────────────────────
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

  // ── Spotlight target measuring ────────────────────────────────────────────
  useEffect(() => {
    const seg = segments[step]
    if (!seg?.target) { setRect(null); return }
    const pad = seg.padding ?? 14
    let raf = 0
    function measure(attempt = 0) {
      const el = document.querySelector<HTMLElement>(`[data-spot="${seg.target}"]`)
      if (!el) {
        if (attempt < 20) { raf = requestAnimationFrame(() => measure(attempt + 1)) }
        else { setRect(null) }
        return
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      setTimeout(() => {
        const r = el.getBoundingClientRect()
        setRect({ x: r.left - pad, y: r.top - pad, w: r.width + pad * 2, h: r.height + pad * 2 })
      }, 280)
    }
    const t = setTimeout(() => measure(0), 140)
    return () => { clearTimeout(t); cancelAnimationFrame(raf) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, segments.length])

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

  // ── Speaking with natural pauses between sentences ────────────────────────
  function splitSentences(text: string): string[] {
    // Split on . ? ! followed by space. Keep sentence-ending punctuation.
    return text
      .replace(/—/g, '—')
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(Boolean)
  }

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  function speakSentence() {
    const sentences = sentencesRef.current
    const i = sentenceIdxRef.current
    if (i >= sentences.length) {
      // Segment finished — advance to next step
      if (!latestPlayingRef.current) return
      if (step < segments.length - 1) {
        setStep(s => s + 1)
      } else {
        setPlaying(false)
      }
      return
    }
    const sentence = sentences[i]
    setCaption(sentence)
    const utter = new SpeechSynthesisUtterance(sentence)
    if (voice) utter.voice = voice
    utter.rate = rate
    utter.pitch = 1.0
    utter.onend = () => {
      if (!latestPlayingRef.current) return
      if (latestStepRef.current !== step) return
      sentenceIdxRef.current = i + 1
      // Pause length scales with sentence (longer sentences → longer pause after)
      const pause = Math.min(850, 420 + sentence.length * 3)
      clearTimer()
      timerRef.current = window.setTimeout(speakSentence, pause)
    }
    // Small buffer to let any prior cancel settle
    window.speechSynthesis.cancel()
    clearTimer()
    timerRef.current = window.setTimeout(() => window.speechSynthesis.speak(utter), 60)
  }

  useEffect(() => {
    clearTimer()
    if (!playing) { window.speechSynthesis.cancel(); return }
    const seg = segments[step]
    if (!seg) { setPlaying(false); return }
    try { seg.action?.() } catch (e) { console.error(e) }

    sentencesRef.current = splitSentences(seg.text)
    sentenceIdxRef.current = 0
    // Wait for any nav action to render + spotlight to settle
    clearTimer()
    timerRef.current = window.setTimeout(speakSentence, 420)
    return () => {
      clearTimer()
      window.speechSynthesis.cancel()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, step, voice, rate])

  // ── Keyboard ──────────────────────────────────────────────────────────────
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
    clearTimer()
  }
  function next() { if (step < segments.length - 1) setStep(step + 1) }
  function prev() { if (step > 0) setStep(step - 1) }
  function toggle() { setPlaying(p => !p) }

  const current = segments[step]

  // Launcher
  if (!open) {
    return (
      <button
        onClick={start}
        className="fixed top-5 right-5 z-[70] flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0A0A0A]/70 text-white text-[13px] font-medium"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
          fontFamily: 'Switzer, sans-serif',
        }}
      >
        <Mic size={14} strokeWidth={2.2} />
        Present
      </button>
    )
  }

  return (
    <>
      {/* Spotlight overlay — softer dim, no harsh ring */}
      <div className="fixed inset-0 z-[55] pointer-events-none">
        {rect ? (
          <div
            className="absolute rounded-2xl"
            style={{
              left: rect.x,
              top: rect.y,
              width: rect.w,
              height: rect.h,
              boxShadow: '0 0 0 9999px rgba(10, 10, 20, 0.42)',
              transition: 'all 560ms cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(10,10,20,0.18)',
              transition: 'background-color 420ms ease-out',
            }}
          />
        )}
      </div>

      {/* Minimal film-caption — no container, just text with shadow */}
      <div className="fixed inset-x-0 bottom-[52px] z-[60] px-8 pointer-events-none flex justify-center">
        <p
          key={caption}
          className="fade-in-caption text-center"
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 15,
            fontWeight: 400,
            lineHeight: 1.42,
            letterSpacing: '0.005em',
            maxWidth: 560,
            textShadow: '0 1px 4px rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.4)',
            fontFamily: 'Switzer, sans-serif',
          }}
        >
          {caption || current?.text || ''}
        </p>
      </div>

      {/* Compact control bar — top-right, subtle */}
      <div
        className="fixed top-5 right-5 z-[70] flex items-center gap-1 px-2 py-1.5 rounded-full pointer-events-auto"
        style={{
          backgroundColor: 'rgba(10,10,20,0.55)',
          backdropFilter: 'blur(14px) saturate(140%)',
          WebkitBackdropFilter: 'blur(14px) saturate(140%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          fontFamily: 'Switzer, sans-serif',
        }}
      >
        <button onClick={prev} disabled={step === 0} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/8 disabled:opacity-25">
          <SkipBack size={13} color="rgba(255,255,255,0.8)" strokeWidth={2.2} />
        </button>
        <button onClick={toggle} className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20">
          {playing
            ? <Pause size={12} color="#fff" strokeWidth={2.2} fill="#fff" />
            : <Play size={12} color="#fff" strokeWidth={2.2} fill="#fff" />}
        </button>
        <button onClick={next} disabled={step === segments.length - 1} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/8 disabled:opacity-25">
          <SkipForward size={13} color="rgba(255,255,255,0.8)" strokeWidth={2.2} />
        </button>
        <span className="text-[11px] font-medium tabular-nums px-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
          {step + 1}/{segments.length}
        </span>
        <button
          onClick={() => setShowSettings(s => !s)}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/8"
          style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}
        >
          {rate.toFixed(1)}×
        </button>
        <button onClick={close} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/8">
          <X size={13} color="rgba(255,255,255,0.7)" strokeWidth={2.2} />
        </button>
      </div>

      {/* Settings (speed + voice) — expanded dropdown */}
      {showSettings && (
        <div
          className="fixed top-[58px] right-5 z-[70] px-3 py-3 rounded-xl pointer-events-auto"
          style={{
            backgroundColor: 'rgba(10,10,20,0.82)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 22px rgba(0,0,0,0.25)',
            minWidth: 180,
            fontFamily: 'Switzer, sans-serif',
          }}
        >
          <label className="block text-[10px] font-semibold tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>SPEED</label>
          <select
            value={rate}
            onChange={e => setRate(parseFloat(e.target.value))}
            className="w-full mb-3 px-2 py-1.5 rounded bg-white/5 text-[13px] outline-none"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            <option value={0.85}>0.85× — slow</option>
            <option value={0.95}>0.95×</option>
            <option value={0.98}>0.98× — natural</option>
            <option value={1.05}>1.05×</option>
            <option value={1.15}>1.15×</option>
          </select>
          <label className="block text-[10px] font-semibold tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>VOICE</label>
          <select
            value={voice?.name ?? ''}
            onChange={e => setVoice(voices.find(v => v.name === e.target.value) ?? null)}
            className="w-full px-2 py-1.5 rounded bg-white/5 text-[13px] outline-none"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {voices.filter(v => v.lang.startsWith('en')).map(v => (
              <option key={v.name} value={v.name}>{v.name}</option>
            ))}
          </select>
        </div>
      )}

      <style>{`
        @keyframes presenterCaption {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-caption {
          animation: presenterCaption 340ms cubic-bezier(0.23, 1, 0.32, 1) both;
        }
      `}</style>
    </>
  )
}
