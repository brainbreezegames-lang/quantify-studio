import { useState, useEffect, useCallback, useRef } from 'react'
import { ArrowRight, ArrowLeft, X, MessageSquareText, Monitor, Code2, Sparkles } from 'lucide-react'

interface TutorialStep {
  target: string
  title: string
  body: string
  icon: typeof Sparkles
  anchor: 'right' | 'left' | 'bottom' | 'center'
}

const STEPS: TutorialStep[] = [
  {
    target: '',
    title: 'Prompt → UI → Code',
    body: 'Describe a screen, see it live, copy the XAML.',
    icon: Sparkles,
    anchor: 'center',
  },
  {
    target: '#left-tabpanel',
    title: 'Type what you need',
    body: '"A login page" or "inventory dashboard" — the AI builds it.',
    icon: MessageSquareText,
    anchor: 'right',
  },
  {
    target: '[aria-label="Design preview"]',
    title: 'Preview updates live',
    body: 'Phone, tablet, or desktop. Export as image anytime.',
    icon: Monitor,
    anchor: 'bottom',
  },
  {
    target: '#right-tabpanel',
    title: 'Grab your code',
    body: 'Copy the XAML, tweak properties, or tune AI quality.',
    icon: Code2,
    anchor: 'left',
  },
]

interface Props {
  onComplete: () => void
}

export default function TutorialOverlay({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const current = STEPS[step]
  const isCentered = current.anchor === 'center'
  const isLast = step === STEPS.length - 1
  const Icon = current.icon

  // Measure target element
  const measure = useCallback(() => {
    if (isCentered || !current.target) {
      setTargetRect(null)
      setPos(null)
      return
    }
    const el = document.querySelector(current.target)
    if (el) {
      const rect = el.getBoundingClientRect()
      setTargetRect(rect)
    }
  }, [step, current.target, isCentered])

  useEffect(() => {
    // Small delay to let layout settle after step change
    const id = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  // Position the tooltip card after target is measured
  useEffect(() => {
    if (isCentered || !targetRect || !cardRef.current) return

    const card = cardRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const gap = 14
    const edge = 12

    let top = 0
    let left = 0

    switch (current.anchor) {
      case 'right':
        top = targetRect.top + targetRect.height / 2 - card.height / 2
        left = targetRect.right + gap
        break
      case 'left':
        top = targetRect.top + targetRect.height / 2 - card.height / 2
        left = targetRect.left - card.width - gap
        break
      case 'bottom':
        top = targetRect.bottom + gap
        left = targetRect.left + targetRect.width / 2 - card.width / 2
        break
    }

    // Clamp to viewport
    top = Math.max(edge, Math.min(top, vh - card.height - edge))
    left = Math.max(edge, Math.min(left, vw - card.width - edge))

    setPos({ top, left })
  }, [targetRect, isCentered, current.anchor])

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onComplete()
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        isLast ? onComplete() : setStep(s => s + 1)
      }
      if (e.key === 'ArrowLeft' && step > 0) setStep(s => s - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, isLast, onComplete])

  const next = () => (isLast ? onComplete() : setStep(s => s + 1))
  const prev = () => setStep(s => s - 1)

  // Spotlight SVG mask
  const renderSpotlight = () => {
    if (!targetRect) return null
    const p = 6
    const r = 10
    return (
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-[60]">
        <defs>
          <mask id="tut-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={targetRect.left - p} y={targetRect.top - p}
              width={targetRect.width + p * 2} height={targetRect.height + p * 2}
              rx={r} fill="black"
            />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#tut-mask)" />
        <rect
          x={targetRect.left - p} y={targetRect.top - p}
          width={targetRect.width + p * 2} height={targetRect.height + p * 2}
          rx={r} fill="none" stroke="rgba(99,132,255,0.35)" strokeWidth="2"
        />
      </svg>
    )
  }

  // Card style
  const cardStyle: React.CSSProperties = isCentered
    ? { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    : pos
      ? { position: 'fixed', top: pos.top, left: pos.left }
      : { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } // fallback to center while measuring

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label="Quick tour">
      {/* Dark overlay — full for centered, SVG cutout for spotlight */}
      {isCentered && <div className="fixed inset-0 bg-black/60 z-[60]" />}
      {renderSpotlight()}

      {/* Card */}
      <div ref={cardRef} className="z-[70] w-72" style={cardStyle}>
        <div className="bg-studio-surface border border-studio-border rounded-xl shadow-2xl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-studio-accent/12 flex items-center justify-center">
                  <Icon size={14} className="text-studio-accent" />
                </div>
                <h3 className="text-studio-text font-semibold text-[13px]">{current.title}</h3>
              </div>
              <button
                onClick={onComplete}
                className="p-1 rounded-md text-studio-text-dim hover:text-studio-text hover:bg-studio-surface-3 transition-colors"
                aria-label="Close tour"
              >
                <X size={13} />
              </button>
            </div>

            <p className="text-[12px] text-studio-text-muted leading-relaxed mb-3 ml-9">
              {current.body}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === step ? 'bg-studio-accent' : i < step ? 'bg-studio-accent/40' : 'bg-studio-surface-3'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {step === 0 ? (
                  <>
                    <button onClick={onComplete} className="text-[11px] text-studio-text-dim hover:text-studio-text transition-colors">
                      Skip
                    </button>
                    <button
                      onClick={next}
                      className="flex items-center gap-1 bg-studio-accent hover:bg-studio-accent-hover text-white px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                    >
                      Quick tour
                      <ArrowRight size={12} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={prev} className="p-1 rounded-md text-studio-text-dim hover:text-studio-text hover:bg-studio-surface-3 transition-colors">
                      <ArrowLeft size={13} />
                    </button>
                    <button
                      onClick={next}
                      className="flex items-center gap-1 bg-studio-accent hover:bg-studio-accent-hover text-white px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                    >
                      {isLast ? 'Got it' : 'Next'}
                      {!isLast && <ArrowRight size={12} />}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
