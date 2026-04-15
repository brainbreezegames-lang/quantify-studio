import { useEffect, useRef, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, X, Mic } from 'lucide-react'

export interface Segment {
  id: string
  text: string
  action?: () => void
}

interface Props {
  segments: Segment[]
}

export default function PresenterMode({ segments }: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [rate, setRate] = useState(1.0)
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [spokenUpTo, setSpokenUpTo] = useState(0)
  const latestStepRef = useRef(step)
  const latestPlayingRef = useRef(playing)

  useEffect(() => { latestStepRef.current = step }, [step])
  useEffect(() => { latestPlayingRef.current = playing }, [playing])

  // ── Voice loading ──────────────────────────────────────────────────────────
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

  // ── Speak when step changes while playing ──────────────────────────────────
  useEffect(() => {
    if (!playing) {
      window.speechSynthesis.cancel()
      return
    }
    const seg = segments[step]
    if (!seg) {
      setPlaying(false)
      return
    }
    // Fire the action once per step
    if (step !== spokenUpTo - 0) {
      try { seg.action?.() } catch (e) { console.error(e) }
    } else {
      try { seg.action?.() } catch (e) { console.error(e) }
    }

    const utter = new SpeechSynthesisUtterance(seg.text)
    if (voice) utter.voice = voice
    utter.rate = rate
    utter.pitch = 1.0
    utter.onend = () => {
      // Only auto-advance if still playing AND step didn't change underneath us
      if (!latestPlayingRef.current) return
      if (latestStepRef.current !== step) return
      if (step < segments.length - 1) {
        setStep(s => s + 1)
      } else {
        setPlaying(false)
      }
    }
    window.speechSynthesis.cancel()
    // Small delay so cancel lands before speak (Safari quirk)
    const t = setTimeout(() => window.speechSynthesis.speak(utter), 50)
    setSpokenUpTo(step)
    return () => { clearTimeout(t); window.speechSynthesis.cancel() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, step, voice, rate])

  // ── Keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return
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
  function next() {
    if (step < segments.length - 1) setStep(step + 1)
  }
  function prev() {
    if (step > 0) setStep(step - 1)
  }
  function toggle() {
    setPlaying(p => !p)
  }

  const current = segments[step]

  // ── Launcher button (always visible) ───────────────────────────────────────
  if (!open) {
    return (
      <button
        onClick={start}
        className="fixed top-5 right-5 z-[60] flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0A0A0A] text-white text-sm font-semibold shadow-lg hover:scale-[1.02] transition-transform"
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}
      >
        <Mic size={16} strokeWidth={2.5} />
        Start presentation
      </button>
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center pointer-events-none">
      {/* Subtitle panel */}
      <div
        className="pointer-events-auto w-full max-w-[820px] mx-4 mb-3 px-7 py-6 rounded-2xl text-white"
        style={{
          background: 'linear-gradient(180deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.98) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 20px 48px rgba(0,0,0,0.35)',
          fontFamily: 'Switzer, sans-serif',
        }}
      >
        <p className="text-[22px] leading-[1.35] font-medium text-white text-center">
          {current?.text ?? '—'}
        </p>
      </div>

      {/* Controls bar */}
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
  )
}
