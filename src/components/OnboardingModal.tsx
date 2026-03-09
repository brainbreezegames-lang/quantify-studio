import { useState } from 'react'
import { Palette, Type, Square, ArrowRight } from 'lucide-react'
import { useAppDispatch } from '../store'
import type { DesignTokens } from '../types'
import { AVONTUS_TOKENS, normalizeDesignTokens, updateDesignTokenSeed } from '../types'

const RADIUS_OPTIONS = [
  { value: 'sharp' as const, label: 'Sharp', radius: 0 },
  { value: 'slightly-rounded' as const, label: 'Subtle', radius: 4 },
  { value: 'rounded' as const, label: 'Rounded', radius: 12 },
  { value: 'pill' as const, label: 'Pill', radius: 9999 },
]

interface OnboardingModalProps {
  initialTokens?: DesignTokens
  onClose?: () => void
}

export default function OnboardingModal({ initialTokens, onClose }: OnboardingModalProps) {
  const dispatch = useAppDispatch()
  const [step, setStep] = useState(0)
  const [tokens, setTokens] = useState<DesignTokens>(() => normalizeDesignTokens(initialTokens, AVONTUS_TOKENS))

  const steps = [
    {
      title: 'Brand Colors',
      subtitle: 'Set the colors for your design system',
      icon: Palette,
    },
    {
      title: 'Typography',
      subtitle: 'Pick the typeface for your screens',
      icon: Type,
    },
    {
      title: 'Corner Style',
      subtitle: 'How rounded should components be?',
      icon: Square,
    },
  ]

  const handleComplete = () => {
    dispatch({ type: 'SET_TOKENS', tokens })
    dispatch({ type: 'COMPLETE_ONBOARDING' })
    onClose?.()
  }

  const current = steps[step]
  const Icon = current.icon

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-studio-surface border border-studio-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-studio-accent/15 flex items-center justify-center">
              <Icon size={18} className="text-studio-accent" />
            </div>
            <div>
              <h2 className="text-studio-text font-semibold text-lg">{current.title}</h2>
              <p className="text-xs text-studio-text-dim">{current.subtitle}</p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 rounded-full flex-1 transition-colors ${i <= step ? 'bg-studio-accent' : 'bg-studio-surface-3'}`} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          {step === 0 && (
            <div className="space-y-4">
              <ColorPicker label="Primary" value={tokens.primaryColor} onChange={(v) => setTokens(t => updateDesignTokenSeed(t, { primaryColor: v }))} />
              <ColorPicker label="Secondary" value={tokens.secondaryColor} onChange={(v) => setTokens(t => updateDesignTokenSeed(t, { secondaryColor: v }))} />
              <ColorPicker label="Background" value={tokens.backgroundColor} onChange={(v) => setTokens(t => updateDesignTokenSeed(t, { backgroundColor: v, surfaceColor: v }))} />

              {/* Quick palette presets */}
              <div>
                <label className="text-[11px] text-studio-text-dim font-medium uppercase tracking-wider mb-2 block">Presets</label>
                <div className="flex gap-2">
                  {[
                    { primary: '#0A3EFF', secondary: '#10296E', label: 'Probe' },
                    { primary: '#6750A4', secondary: '#625B71', label: 'Material' },
                    { primary: '#0066FF', secondary: '#5856D6', label: 'Blue' },
                    { primary: '#FF6B35', secondary: '#F7C59F', label: 'Warm' },
                    { primary: '#00C853', secondary: '#69F0AE', label: 'Green' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setTokens(t => updateDesignTokenSeed(t, { primaryColor: preset.primary, secondaryColor: preset.secondary }))}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 rounded-full border-2 border-studio-surface" style={{ backgroundColor: preset.primary }} />
                        <div className="w-5 h-5 rounded-full border-2 border-studio-surface" style={{ backgroundColor: preset.secondary }} />
                      </div>
                      <span className="text-[10px] text-studio-text-dim group-hover:text-studio-text-muted transition-colors">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-2">
              {['Segoe UI', 'Roboto', 'Inter', 'Open Sans', 'Poppins', 'System UI'].map((font) => (
                <button
                  key={font}
                  onClick={() => setTokens(t => updateDesignTokenSeed(t, { fontFamily: font === 'System UI' ? 'system-ui' : font }))}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    tokens.fontFamily === (font === 'System UI' ? 'system-ui' : font)
                      ? 'border-studio-accent bg-studio-accent/10 text-studio-text'
                      : 'border-studio-border text-studio-text-muted hover:border-studio-border-hover hover:bg-studio-surface-2'
                  }`}
                >
                  <span className="text-sm font-medium">{font}</span>
                  <span className="text-xs text-studio-text-dim ml-2" style={{ fontFamily: font === 'System UI' ? 'system-ui' : font }}>
                    The quick brown fox
                  </span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-3">
              {RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTokens(t => updateDesignTokenSeed(t, { borderRadius: opt.value }))}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 ${
                    tokens.borderRadius === opt.value
                      ? 'border-studio-accent bg-studio-accent/10'
                      : 'border-studio-border hover:border-studio-border-hover hover:bg-studio-surface-2'
                  }`}
                >
                  <div
                    className="w-16 h-10"
                    style={{
                      borderRadius: opt.radius > 20 ? 20 : opt.radius,
                      backgroundColor: tokens.primaryColor,
                    }}
                  />
                  <span className="text-xs text-studio-text-muted font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-studio-border flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 0) handleComplete()
              else setStep(s => s - 1)
            }}
            className="text-sm text-studio-text-muted hover:text-studio-text transition-colors"
          >
            {step === 0 ? 'Use defaults' : 'Back'}
          </button>
          <button
            onClick={() => {
              if (step < steps.length - 1) setStep(s => s + 1)
              else handleComplete()
            }}
            className="flex items-center gap-2 bg-studio-accent hover:bg-studio-accent-hover text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            {step < steps.length - 1 ? 'Next' : 'Start Building'}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg border border-studio-border cursor-pointer bg-transparent"
      />
      <div className="flex-1">
        <label className="text-xs text-studio-text-muted font-medium">{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-studio-surface-2 border border-studio-border rounded-lg px-2.5 py-1 text-sm text-studio-text font-mono focus:outline-none focus:border-studio-accent/50 transition-colors mt-0.5"
        />
      </div>
    </div>
  )
}
