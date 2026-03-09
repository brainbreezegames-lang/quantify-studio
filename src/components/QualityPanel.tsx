import { useState } from 'react'
import { useAppState, useAppDispatch } from '../store'
import type { QualityToggles } from '../types'

interface ToggleConfig {
  key: keyof QualityToggles
  label: string
  outcomes: string[]
}

interface ToggleGroup {
  label: string
  toggles: ToggleConfig[]
}

const TOGGLE_GROUPS: ToggleGroup[] = [
  {
    label: 'Foundation',
    toggles: [
      {
        key: 'avontusBrand',
        label: 'Avontus Brand',
        outcomes: [
          'Avontus Blue #0005EE on all primary actions',
          'DM Sans typography with brand weights',
          '107° motif on hero screens, brand-blue shadows',
        ],
      },
      {
        key: 'tokenEnforcement',
        label: 'Color & Tokens',
        outcomes: [
          'Every color mapped to a role (action, heading, surface)',
          'No generic blue/purple Material defaults',
          'Missing tokens → neutral gray, not invented colors',
        ],
      },
      {
        key: 'componentRegistry',
        label: 'Component Registry',
        outcomes: [
          'Every UI need → correct Uno/XAML component',
          'Required props on every component (Style, Header)',
          'No raw unstyled primitives in output',
        ],
      },
    ],
  },
  {
    label: 'Design System',
    toggles: [
      {
        key: 'designDna',
        label: 'Design DNA',
        outcomes: [
          'Analyzes your tokens before generating anything',
          'Same spacing rhythm, color ratios, card style throughout',
          'New screens feel native to your existing design',
        ],
      },
      {
        key: 'designSystem',
        label: 'Structure & Patterns',
        outcomes: [
          'Atomic design hierarchy (atom → molecule → organism)',
          'All spacing in 4px multiples, 8 component states',
          'Strict HTML patterns for inputs, toggles, icons, lists',
        ],
      },
      {
        key: 'materialDesign',
        label: 'Material Design 3',
        outcomes: [
          'HCT dynamic color, tonal palettes, 5 button variants',
          '4dp grid, responsive breakpoints, state layers',
          'Dark mode support, 48dp touch targets',
        ],
      },
    ],
  },
  {
    label: 'Visual Quality',
    toggles: [
      {
        key: 'visualExcellence',
        label: 'Visual Excellence',
        outcomes: [
          'Looks crafted by a designer, not AI-assembled',
          'Distinctive fonts, textured backgrounds, tinted shadows',
          '3+ unexpected visual choices per screen',
        ],
      },
      {
        key: 'typography',
        label: 'Typography',
        outcomes: [
          'Proper type scale (Display → Body → Caption)',
          'Correct line heights & letter spacing per level',
          'Max 3–4 font sizes per screen, one weight contrast',
        ],
      },
      {
        key: 'designStandards',
        label: 'Design Standards',
        outcomes: [
          '60-30-10 color rule, F/Z-pattern layouts',
          'MD3 + WCAG AA + Nielsen heuristics audit',
          'Intentional animation, material honesty',
        ],
      },
    ],
  },
  {
    label: 'User Experience',
    toggles: [
      {
        key: 'uxPsychology',
        label: 'UX Psychology',
        outcomes: [
          'Max 4–5 choices per screen (Hick\'s Law)',
          '44px touch targets, one primary CTA',
          'Loss aversion copy, pre-filled progress bars',
        ],
      },
      {
        key: 'gestalt',
        label: 'Gestalt Principles',
        outcomes: [
          'Group spacing 2–3× within-group spacing',
          'One dominant focal point per screen',
          'Same function → same visual treatment',
        ],
      },
      {
        key: 'interaction',
        label: 'Interaction Design',
        outcomes: [
          'Undo/cancel/edit controls on every action',
          'Checkpoints before high-stakes decisions',
          'Mobile: bottom CTAs · Desktop: keyboard shortcuts',
        ],
      },
    ],
  },
  {
    label: 'Content & Data',
    toggles: [
      {
        key: 'microcopy',
        label: 'UX Writing',
        outcomes: [
          '"Save Order" not "Submit" — verb + object labels',
          'Empty states explain why + what to do + CTA',
          'Errors: what happened + how to fix, never blame',
        ],
      },
      {
        key: 'accessibility',
        label: 'Accessibility',
        outcomes: [
          '4.5:1 contrast, dark bg → white text only',
          '44px touch targets, visible focus rings',
          'Color + icon + text for every status signal',
        ],
      },
      {
        key: 'dataHeavyDesign',
        label: 'Data-Dense UI',
        outcomes: [
          '5-metric rule for dashboards, KPI cards with delta',
          'Tables: right-align numbers, sticky headers, 3 densities',
          'Real-time animations, progressive disclosure',
        ],
      },
    ],
  },
]

const ALL_TOGGLES = TOGGLE_GROUPS.flatMap(g => g.toggles)

const QUICK_PICKS: { label: string; keys: (keyof QualityToggles)[] }[] = [
  { label: 'Brand Ready', keys: ['avontusBrand', 'tokenEnforcement', 'typography'] },
  { label: 'Visual Polish', keys: ['visualExcellence', 'designStandards', 'typography'] },
  { label: 'UX Boost', keys: ['uxPsychology', 'gestalt', 'accessibility', 'microcopy'] },
  { label: 'Full System', keys: ['designDna', 'designSystem', 'materialDesign', 'tokenEnforcement'] },
]

export default function QualityPanel() {
  const { qualityToggles } = useAppState()
  const dispatch = useAppDispatch()
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const totalCount = ALL_TOGGLES.length
  const activeCount = ALL_TOGGLES.filter(t => qualityToggles[t.key]).length

  const handleToggle = (key: keyof QualityToggles) => {
    dispatch({ type: 'SET_QUALITY_TOGGLES', toggles: { [key]: !qualityToggles[key] } })
  }

  const handleEnableAll = () => {
    const allOn: Partial<QualityToggles> = {}
    ALL_TOGGLES.forEach(t => { allOn[t.key] = true })
    dispatch({ type: 'SET_QUALITY_TOGGLES', toggles: allOn })
  }

  const handleDisableAll = () => {
    const allOff: Partial<QualityToggles> = {}
    ALL_TOGGLES.forEach(t => { allOff[t.key] = false })
    dispatch({ type: 'SET_QUALITY_TOGGLES', toggles: allOff })
  }

  const handleQuickPick = (keys: (keyof QualityToggles)[]) => {
    const allOff: Partial<QualityToggles> = {}
    ALL_TOGGLES.forEach(t => { allOff[t.key] = false })
    const picked: Partial<QualityToggles> = {}
    keys.forEach(k => { picked[k] = true })
    dispatch({ type: 'SET_QUALITY_TOGGLES', toggles: { ...allOff, ...picked } })
  }

  const isQuickPickActive = (keys: (keyof QualityToggles)[]) =>
    keys.every(k => qualityToggles[k]) && activeCount === keys.length

  const toggleGroupCollapse = (label: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-studio-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-studio-text-muted">
              AI Quality Lenses
            </h3>
            <p className="text-[10px] text-studio-text-dim mt-0.5">
              {activeCount === 0 ? 'None active' : `${activeCount}/${totalCount} active`} — injected into every generation
            </p>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={handleEnableAll}
              className="text-[10px] px-2 py-1 rounded bg-studio-accent/10 text-studio-accent hover:bg-studio-accent/20 transition-colors"
            >
              All on
            </button>
            <button
              onClick={handleDisableAll}
              className="text-[10px] px-2 py-1 rounded bg-studio-surface-3 text-studio-text-dim hover:text-studio-text-muted transition-colors"
            >
              All off
            </button>
          </div>
        </div>
      </div>

      {/* Quick Picks */}
      <div className="px-4 pt-3 pb-2.5 border-b border-studio-border flex-shrink-0">
        <p className="text-[9px] font-bold uppercase tracking-widest text-studio-text-dim mb-2">
          Quick picks
        </p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PICKS.map(pick => {
            const active = isQuickPickActive(pick.keys)
            return (
              <button
                key={pick.label}
                onClick={() => handleQuickPick(pick.keys)}
                className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                  active
                    ? 'border-studio-accent/50 bg-studio-accent/10 text-studio-accent'
                    : 'border-studio-border text-studio-text-dim hover:text-studio-text-muted hover:bg-studio-surface-3'
                }`}
              >
                {pick.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Toggle Groups */}
      <div className="flex-1 overflow-y-auto py-1">
        {TOGGLE_GROUPS.map((group) => {
          const groupActive = group.toggles.filter(t => qualityToggles[t.key]).length
          const isCollapsed = collapsedGroups.has(group.label)
          return (
            <div key={group.label} className="px-3 py-2">
              <button
                onClick={() => toggleGroupCollapse(group.label)}
                className="w-full flex items-center gap-2 mb-2"
              >
                <svg
                  width="7" height="7" viewBox="0 0 8 8" fill="currentColor"
                  className={`text-studio-text-dim transition-transform flex-shrink-0 ${isCollapsed ? '' : 'rotate-90'}`}
                >
                  <polygon points="2,1 7,4 2,7" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-widest text-studio-text-muted flex-1 text-left">
                  {group.label}
                </span>
                {groupActive > 0 ? (
                  <span className="text-[9px] bg-studio-accent/15 text-studio-accent px-1.5 py-0.5 rounded-full font-medium">
                    {groupActive}/{group.toggles.length}
                  </span>
                ) : (
                  <span className="text-[9px] text-studio-text-dim">{group.toggles.length}</span>
                )}
              </button>

              {!isCollapsed && (
                <div className="space-y-1.5">
                  {group.toggles.map(({ key, label, outcomes }) => {
                    const isOn = qualityToggles[key]
                    return (
                      <button
                        key={key}
                        onClick={() => handleToggle(key)}
                        className={`w-full text-left rounded-lg border p-2.5 transition-all ${
                          isOn
                            ? 'border-studio-accent/40 bg-studio-accent/5'
                            : 'border-studio-border bg-studio-surface hover:bg-studio-surface-2'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Toggle switch */}
                          <div
                            className={`mt-0.5 w-7 h-4 rounded-full flex-shrink-0 relative transition-colors ${
                              isOn ? 'bg-studio-accent' : 'bg-studio-surface-3'
                            }`}
                          >
                            <div
                              className={`absolute top-[2px] w-3 h-3 rounded-full bg-white transition-transform shadow-sm ${
                                isOn ? 'translate-x-[14px]' : 'translate-x-[2px]'
                              }`}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-semibold text-studio-text leading-tight mb-1">
                              {label}
                            </div>
                            <div className="space-y-0.5">
                              {outcomes.map((outcome, i) => (
                                <div key={i} className="flex items-start gap-1.5">
                                  <span className={`text-[9px] mt-[3px] flex-shrink-0 ${isOn ? 'text-studio-accent' : 'text-studio-text-dim'}`}>
                                    &rarr;
                                  </span>
                                  <span className="text-[10px] text-studio-text-dim leading-snug">
                                    {outcome}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-studio-border flex-shrink-0">
        <p className="text-[10px] text-studio-text-dim leading-relaxed">
          Each lens adds targeted AI instructions — toggle on, then regenerate or use <strong className="text-studio-text-muted">Improve Design</strong> to apply.
        </p>
      </div>
    </div>
  )
}
