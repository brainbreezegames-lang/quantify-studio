import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, RotateCcw, Sparkles, Zap, TrendingUp, CircleDot } from 'lucide-react'
import { useAppState, useAppDispatch } from '../store'
import type { Decision } from '../types'

/* ── Impact config — uses shape + text + color so it never relies on color alone ── */

const IMPACT_CONFIG = {
  high: {
    icon: Zap,
    label: 'High impact',
    short: 'High',
    border: 'border-l-red-400',
    badge: 'bg-red-500/15 text-red-300 border-red-400/25',
    dot: 'bg-red-400',
  },
  medium: {
    icon: TrendingUp,
    label: 'Medium impact',
    short: 'Medium',
    border: 'border-l-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-400/25',
    dot: 'bg-amber-400',
  },
  low: {
    icon: CircleDot,
    label: 'Low impact',
    short: 'Low',
    border: 'border-l-sky-400',
    badge: 'bg-sky-500/12 text-sky-300 border-sky-400/20',
    dot: 'bg-sky-400',
  },
} as const

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function bestImpact(decisions: Decision[]): 'high' | 'medium' | 'low' {
  if (decisions.some(d => d.impact === 'high')) return 'high'
  if (decisions.some(d => d.impact === 'medium')) return 'medium'
  return 'low'
}

export default function ImprovementsPanel() {
  const { improveHistory, originalWebDesign, viewingImproveIndex } = useAppState()
  const dispatch = useAppDispatch()
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const hasHistory = improveHistory.length > 0

  // Auto-expand latest version on first load
  useEffect(() => {
    if (hasHistory && expandedVersion === null) {
      setExpandedVersion(improveHistory.length - 1)
    }
  }, [hasHistory]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Empty state ── */
  if (!hasHistory) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-studio-accent/20 to-studio-accent/5 border border-studio-accent/20 flex items-center justify-center">
            <Sparkles size={22} className="text-studio-accent" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-studio-surface border-2 border-studio-accent/30 flex items-center justify-center">
            <span className="text-[7px] font-bold text-studio-accent">0</span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[13px] font-bold text-studio-text">No versions yet</p>
          <p className="text-[11px] text-studio-text-dim leading-[1.6] max-w-[200px]">
            Each time you improve your design, a new version appears here so you can compare and go back.
          </p>
        </div>
      </div>
    )
  }

  /* ── Derived state ── */
  const isViewingOriginal = viewingImproveIndex === -1
  const isViewingLatest = viewingImproveIndex === null
  const activeIndex = viewingImproveIndex ?? improveHistory.length - 1

  const handleView = (index: number | null) => {
    dispatch({ type: 'VIEW_IMPROVE_VERSION', index })
    setExpandedVersion(index ?? improveHistory.length - 1)
  }

  const handlePrev = () => {
    if (isViewingOriginal) return
    if (activeIndex <= 0) {
      dispatch({ type: 'VIEW_IMPROVE_VERSION', index: -1 })
      setExpandedVersion(null)
    } else {
      handleView(activeIndex - 1)
    }
  }

  const handleNext = () => {
    if (isViewingLatest) return
    if (isViewingOriginal) handleView(0)
    else if (activeIndex >= improveHistory.length - 1) handleView(null)
    else handleView(activeIndex + 1)
  }

  const laterCount = improveHistory.length - activeIndex - 1

  return (
    <div className="flex flex-col h-full">

      {/* ── Scrubber — prominent, always visible ── */}
      <div className="px-3 pt-3 pb-2.5 border-b border-studio-border flex-shrink-0">
        <nav
          className="flex items-center bg-studio-surface rounded-xl border border-studio-border"
          aria-label="Browse design versions"
          role="navigation"
        >
          <button
            onClick={handlePrev}
            disabled={isViewingOriginal}
            className="p-2.5 rounded-l-xl text-studio-text-dim hover:text-studio-text hover:bg-studio-surface-3 disabled:opacity-20 disabled:cursor-not-allowed transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Go to previous version"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => handleView(null)}
            className={`flex-1 py-2 text-[11px] font-bold text-center transition-all min-h-[40px] ${
              isViewingLatest
                ? 'text-studio-accent'
                : isViewingOriginal
                ? 'text-studio-text-dim'
                : 'text-studio-text-muted hover:text-studio-text'
            }`}
            aria-label={
              isViewingOriginal
                ? 'Viewing original design. Press to jump to latest.'
                : isViewingLatest
                ? `Showing latest version, round ${improveHistory.length}`
                : `Showing round ${activeIndex + 1} of ${improveHistory.length}. Press to jump to latest.`
            }
            aria-live="polite"
          >
            {isViewingOriginal
              ? 'Original design'
              : isViewingLatest
              ? `Round ${improveHistory.length} · Latest`
              : `Round ${activeIndex + 1} of ${improveHistory.length}`
            }
          </button>

          <button
            onClick={handleNext}
            disabled={isViewingLatest}
            className="p-2.5 rounded-r-xl text-studio-text-dim hover:text-studio-text hover:bg-studio-surface-3 disabled:opacity-20 disabled:cursor-not-allowed transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Go to next version"
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      </div>

      {/* ── Version cards ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5"
        role="list"
        aria-label="Design improvement rounds, newest first"
      >
        {[...improveHistory].reverse().map((snap, reverseIdx) => {
          const i = improveHistory.length - 1 - reverseIdx
          const isLatest = i === improveHistory.length - 1
          const isActive = !isViewingOriginal && activeIndex === i
          const isExpanded = expandedVersion === i
          const impact = bestImpact(snap.decisions)
          const impactCfg = IMPACT_CONFIG[impact]
          const highCount = snap.decisions.filter(d => d.impact === 'high').length
          const medCount = snap.decisions.filter(d => d.impact === 'medium').length

          return (
            <div
              key={snap.id}
              role="listitem"
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isActive
                  ? 'border-studio-accent/40 bg-studio-accent/[0.05] shadow-[0_0_12px_rgba(var(--studio-accent),0.08)]'
                  : 'border-studio-border/70 bg-studio-surface hover:border-studio-border hover:bg-studio-surface-3/40'
              }`}
            >
              {/* Version header — the clickable row */}
              <button
                onClick={() => {
                  handleView(isLatest ? null : i)
                  setExpandedVersion(isExpanded ? null : i)
                }}
                aria-expanded={isExpanded}
                aria-label={`Round ${i + 1}${isLatest ? ', latest' : ''}: ${snap.decisions.length} refinements including ${highCount} high impact. ${timeAgo(snap.timestamp)}. Press to ${isExpanded ? 'collapse' : 'expand'} details.`}
                className="w-full text-left px-3 py-2.5 group"
              >
                <div className="flex items-center gap-2.5">
                  {/* Version badge — large, readable */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-black transition-colors ${
                    isActive
                      ? 'bg-studio-accent text-white'
                      : 'bg-studio-surface-3 text-studio-text-dim'
                  }`}>
                    {i + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[12px] font-bold transition-colors ${
                        isActive ? 'text-studio-accent' : 'text-studio-text-muted group-hover:text-studio-text'
                      }`}>
                        Round {i + 1}
                      </span>
                      {isLatest && (
                        <span className="text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-studio-accent/15 text-studio-accent">
                          Latest
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-studio-text-dim">
                      <span>{snap.decisions.length} refinement{snap.decisions.length !== 1 ? 's' : ''}</span>
                      {highCount > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-red-300 font-medium" title={`${highCount} high-impact change${highCount !== 1 ? 's' : ''}`}>
                          <Zap size={9} aria-hidden="true" />
                          <span>{highCount} high</span>
                        </span>
                      )}
                      {medCount > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-amber-300 font-medium" title={`${medCount} medium-impact change${medCount !== 1 ? 's' : ''}`}>
                          <TrendingUp size={9} aria-hidden="true" />
                          <span>{medCount} med</span>
                        </span>
                      )}
                      <span className="ml-auto tabular-nums flex-shrink-0">{timeAgo(snap.timestamp)}</span>
                    </div>
                  </div>

                  {/* Expand chevron */}
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className={`flex-shrink-0 text-studio-text-dim transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-studio-accent' : 'group-hover:text-studio-text-muted'
                    }`}
                  />
                </div>
              </button>

              {/* Expanded decisions — visually contained inside the card */}
              {isExpanded && snap.decisions.length > 0 && (
                <div
                  className="px-3 pb-3 pt-0.5 space-y-1.5 border-t border-studio-border/50 mx-1.5 mt-0.5"
                  role="list"
                  aria-label={`What changed in round ${i + 1}`}
                >
                  {snap.decisions.map((d, di) => {
                    const cfg = IMPACT_CONFIG[d.impact] || IMPACT_CONFIG.medium
                    const Icon = cfg.icon
                    return (
                      <div
                        key={di}
                        role="listitem"
                        className={`rounded-lg bg-studio-surface/80 border-l-[3px] ${cfg.border} py-2 px-2.5 space-y-0.5`}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border flex-shrink-0 ${cfg.badge}`}
                          >
                            <Icon size={8} aria-hidden="true" />
                            {cfg.short}
                          </span>
                          <span className="text-[11px] font-semibold text-studio-text leading-snug flex-1">
                            {d.principle}
                          </span>
                        </div>
                        <p className="text-[10px] text-studio-text-dim/80 leading-relaxed pl-0.5">{d.description}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* ── Original — the anchor ── */}
        <div
          role="listitem"
          className={`rounded-xl border transition-all duration-200 ${
            isViewingOriginal
              ? 'border-studio-accent/40 bg-studio-accent/[0.05]'
              : 'border-dashed border-studio-border/50 hover:border-studio-border hover:bg-studio-surface-3/30'
          }`}
        >
          <button
            onClick={() => {
              dispatch({ type: 'VIEW_IMPROVE_VERSION', index: -1 })
              setExpandedVersion(null)
            }}
            aria-label="View original design, before any improvements were applied"
            className="w-full text-left px-3 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                isViewingOriginal
                  ? 'bg-studio-accent/15'
                  : 'bg-studio-surface-3/50'
              }`}>
                <div className={`w-2.5 h-2.5 rotate-45 rounded-[2px] transition-colors ${
                  isViewingOriginal ? 'bg-studio-accent' : 'bg-studio-text-dim/40'
                }`} />
              </div>
              <div>
                <span className={`text-[12px] font-bold transition-colors ${
                  isViewingOriginal ? 'text-studio-accent' : 'text-studio-text-dim'
                }`}>
                  Original
                </span>
                <p className={`text-[10px] mt-0.5 transition-colors ${
                  isViewingOriginal ? 'text-studio-accent/50' : 'text-studio-text-dim/40'
                }`}>
                  Before any improvements
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ── Footer — contextual action with clear consequences ── */}
      {!isViewingLatest && (
        <div className="px-3 py-2.5 border-t border-studio-border flex-shrink-0">
          {isViewingOriginal ? (
            originalWebDesign && (
              <button
                onClick={() => dispatch({ type: 'REVERT_TO_VERSION', index: -1 })}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-semibold text-red-400/80 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 hover:border-red-500/25 transition-all min-h-[40px]"
                aria-label={`Discard all ${improveHistory.length} improvement rounds and restore the original design`}
              >
                <RotateCcw size={12} />
                Discard all {improveHistory.length} round{improveHistory.length !== 1 ? 's' : ''} — use original
              </button>
            )
          ) : (
            <button
              onClick={() => dispatch({ type: 'REVERT_TO_VERSION', index: activeIndex })}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-semibold text-studio-text-dim hover:text-studio-accent bg-studio-surface hover:bg-studio-accent/5 border border-studio-border hover:border-studio-accent/25 transition-all min-h-[40px]"
              aria-label={`Keep round ${activeIndex + 1} and remove the ${laterCount} round${laterCount !== 1 ? 's' : ''} after it`}
            >
              <RotateCcw size={12} />
              Keep round {activeIndex + 1} — remove {laterCount} later round{laterCount !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
