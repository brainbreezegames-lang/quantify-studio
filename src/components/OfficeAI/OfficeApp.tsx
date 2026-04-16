import React, { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, RefreshCw, ChevronRight, Mail, Copy, Check } from 'lucide-react'

// ── CSS keyframes — injected once at module load ────────────────────────────
const OFFICE_CSS = `
  @keyframes oaFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes oaSpin { to { transform: rotate(360deg); } }
  @keyframes oaShimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  /* Staggered entrance — 60 ms between each layer */
  .oa-s1 { animation: oaFadeUp 320ms cubic-bezier(0.23,1,0.32,1)   0ms both; }
  .oa-s2 { animation: oaFadeUp 320ms cubic-bezier(0.23,1,0.32,1)  60ms both; }
  .oa-s3 { animation: oaFadeUp 320ms cubic-bezier(0.23,1,0.32,1) 120ms both; }
  .oa-s4 { animation: oaFadeUp 320ms cubic-bezier(0.23,1,0.32,1) 180ms both; }
  .oa-s5 { animation: oaFadeUp 320ms cubic-bezier(0.23,1,0.32,1) 240ms both; }

  /* Spinner */
  .oa-spin { animation: oaSpin 900ms linear infinite; }

  /* Tap feedback */
  .oa-tap { -webkit-tap-highlight-color: transparent; }
  .oa-tap:active { transform: scale(0.97); transition: transform 0.1s cubic-bezier(0.23,1,0.32,1); }

  /* Skeleton shimmer */
  .oa-shimmer {
    background: linear-gradient(90deg, #EBEBEB 25%, #F5F5F5 50%, #EBEBEB 75%);
    background-size: 400px 100%;
    animation: oaShimmer 1.4s ease-in-out infinite;
  }
`
if (typeof document !== 'undefined' && !document.getElementById('oa-css')) {
  const el = document.createElement('style')
  el.id = 'oa-css'
  el.textContent = OFFICE_CSS
  document.head.appendChild(el)
}

// ── Types ───────────────────────────────────────────────────────────────────
type View = 'briefing' | 'job-detail' | 'draft'
type Severity = 'High' | 'Medium' | 'Low'

interface Issue {
  id: string
  item: string
  issueType?: string
  severity: Severity
  description: string
  action: string
  photo?: string
  timestamp: number
}

interface Job {
  id: string
  type: 'DEL' | 'RET'
  number: string
  issues: Issue[]
  createdAt: number
}

interface BriefingPriority {
  jobId: string
  item: string
  severity: Severity
  nextStep: string
}

interface Briefing {
  headline: string
  briefing: string
  priorities: BriefingPriority[]
}

// ── Constants ────────────────────────────────────────────────────────────────
const SEV: Record<Severity, { color: string; bg: string; dot: string; label: string }> = {
  High:   { color: '#DC2626', bg: '#FEE2E2', dot: '#DC2626', label: 'HIGH'   },
  Medium: { color: '#D97706', bg: '#FEF3C7', dot: '#D97706', label: 'MED'    },
  Low:    { color: '#16A34A', bg: '#DCFCE7', dot: '#16A34A', label: 'LOW'    },
}

const BRIEFING_STEPS = [
  'Reading field reports…',
  'Identifying priorities…',
  'Assessing urgency…',
  'Generating briefing…',
]

// Demo data — shown when no Field Doc data exists
const DEMO_JOBS: Job[] = [
  {
    id: 'DEL-7389', type: 'DEL', number: '7389', createdAt: Date.now() - 3600000,
    issues: [
      {
        id: 'i1', item: 'Cuplok Standard', issueType: 'Damage', severity: 'High',
        description: 'Structural crack found on 4 pieces. Cannot be used safely — risk of collapse under load.',
        action: 'Remove from service', timestamp: Date.now() - 3600000,
      },
      {
        id: 'i2', item: 'LVL Plank', issueType: 'Damage', severity: 'Medium',
        description: 'Surface delamination on 3 boards. Edges peeling — possible splinter hazard.',
        action: 'Flag for inspection', timestamp: Date.now() - 3500000,
      },
    ],
  },
  {
    id: 'DEL-2401', type: 'DEL', number: '2401', createdAt: Date.now() - 7200000,
    issues: [
      {
        id: 'i3', item: 'Base Plate', issueType: 'Damage', severity: 'High',
        description: 'Severely bent on 2 pieces — unable to stand upright. Cannot support scaffold weight.',
        action: 'Remove from service', timestamp: Date.now() - 7200000,
      },
      {
        id: 'i4', item: 'Steel Toe Board', issueType: 'Damage', severity: 'Medium',
        description: 'Cracked end section on 2 boards. Structural integrity compromised.',
        action: 'Flag for inspection', timestamp: Date.now() - 7100000,
      },
      {
        id: 'i5', item: 'Swivel Coupler', issueType: 'Wear', severity: 'Low',
        description: 'Minor surface corrosion visible. Does not affect function at this stage.',
        action: 'Monitor', timestamp: Date.now() - 7000000,
      },
    ],
  },
  {
    id: 'RET-1892', type: 'RET', number: '1892', createdAt: Date.now() - 10800000,
    issues: [
      {
        id: 'i6', item: 'Ringlock Standard', issueType: 'Damage', severity: 'Medium',
        description: 'Bent 15 degrees from vertical. Will cause alignment issues on next build.',
        action: 'Flag for inspection', timestamp: Date.now() - 10800000,
      },
    ],
  },
]

// ── Utils ────────────────────────────────────────────────────────────────────
function loadFieldJobs(): Job[] {
  try {
    const raw = localStorage.getItem('field-doc-jobs')
    if (!raw) return []
    const jobs: Job[] = JSON.parse(raw)
    return jobs.filter(j => j.issues && j.issues.length > 0)
  } catch { return [] }
}

function getJobs(): Job[] {
  const fieldJobs = loadFieldJobs()
  return fieldJobs.length > 0 ? fieldJobs : DEMO_JOBS
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

// ── Skeleton loading component ────────────────────────────────────────────────
function SkeletonCard({ height = 80 }: { height?: number }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, border: '1.5px solid #EBEBEB',
      padding: '20px', overflow: 'hidden',
    }}>
      <div className="oa-shimmer" style={{ height: 14, width: '60%', borderRadius: 6, marginBottom: 12 }} />
      <div className="oa-shimmer" style={{ height: 12, width: '90%', borderRadius: 6, marginBottom: 8 }} />
      <div className="oa-shimmer" style={{ height: 12, width: '75%', borderRadius: 6, marginBottom: height > 80 ? 16 : 0 }} />
      {height > 80 && (
        <>
          <div className="oa-shimmer" style={{ height: 12, width: '80%', borderRadius: 6, marginBottom: 8 }} />
          <div className="oa-shimmer" style={{ height: 12, width: '50%', borderRadius: 6 }} />
        </>
      )}
    </div>
  )
}

function SkeletonRow() {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, border: '1.5px solid #EBEBEB',
      padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div className="oa-shimmer" style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div className="oa-shimmer" style={{ height: 13, width: '40%', borderRadius: 5 }} />
        <div className="oa-shimmer" style={{ height: 11, width: '70%', borderRadius: 5 }} />
      </div>
      <div className="oa-shimmer" style={{ width: 40, height: 20, borderRadius: 10 }} />
      <div className="oa-shimmer" style={{ width: 16, height: 16, borderRadius: 4 }} />
    </div>
  )
}

// ── Cycling step text component ───────────────────────────────────────────────
function BriefingLoadingView() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      const tid = setTimeout(() => {
        setStep(s => (s + 1) % BRIEFING_STEPS.length)
        setVisible(true)
      }, 220)
      return () => clearTimeout(tid)
    }, 1350)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Step text */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.22s cubic-bezier(0.23,1,0.32,1), transform 0.22s cubic-bezier(0.23,1,0.32,1)',
      }}>
        <div className="oa-spin" style={{
          width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
          border: '2px solid transparent',
          borderTopColor: '#1E3FFF',
          borderRightColor: 'rgba(30,63,255,0.35)',
          boxSizing: 'border-box',
        }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: '#525252' }}>
          {BRIEFING_STEPS[step]}
        </span>
      </div>

      {/* Skeleton cards */}
      <SkeletonCard height={120} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OfficeApp() {
  // ALL useState at top level — never inside conditionals
  const [view, setView] = useState<View>('briefing')
  const [jobs] = useState<Job[]>(() => getJobs())
  const [briefing, setBriefing] = useState<Briefing | null>(null)
  const [briefingLoading, setBriefingLoading] = useState(true)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [draftText, setDraftText] = useState<string | null>(null)
  const [draftLoading, setDraftLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showCopyHint, setShowCopyHint] = useState(false)

  const selectedJob = jobs.find(j => j.id === selectedJobId) ?? null

  // ── Load briefing ──────────────────────────────────────────────────────────
  const loadBriefing = useCallback(async () => {
    setBriefingLoading(true)
    setBriefing(null)

    const reports = jobs.flatMap(job =>
      job.issues.map(issue => ({
        jobId: job.id,
        jobType: job.type === 'DEL' ? 'Delivery' : 'Return',
        item: issue.item,
        severity: issue.severity,
        description: issue.description,
        action: issue.action,
        timestamp: issue.timestamp,
      }))
    )

    try {
      const apiKey = localStorage.getItem('openrouter_api_key') || ''
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'office-brief', openRouterApiKey: apiKey, reports }),
      })
      const data = await res.json()
      if (data.briefing) {
        setBriefing(data.briefing)
      } else {
        setBriefing(generateFallbackBriefing(jobs))
      }
    } catch {
      setBriefing(generateFallbackBriefing(jobs))
    } finally {
      setBriefingLoading(false)
    }
  }, [jobs])

  useEffect(() => { loadBriefing() }, [loadBriefing])

  // ── Load draft ─────────────────────────────────────────────────────────────
  const loadDraft = useCallback(async (job: Job) => {
    setDraftLoading(true)
    setDraftText(null)
    setCopied(false)
    setShowCopyHint(false)
    setView('draft')

    const issues = job.issues.map(i => ({
      item: i.item,
      severity: i.severity,
      description: i.description,
      action: i.action,
    }))

    try {
      const apiKey = localStorage.getItem('openrouter_api_key') || ''
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'office-draft',
          openRouterApiKey: apiKey,
          jobId: job.id,
          jobType: job.type === 'DEL' ? 'Delivery' : 'Return',
          issues,
        }),
      })
      const data = await res.json()
      setDraftText(data.draft ?? generateFallbackDraft(job))
    } catch {
      setDraftText(generateFallbackDraft(job))
    } finally {
      setDraftLoading(false)
    }
  }, [])

  // ── Copy ───────────────────────────────────────────────────────────────────
  const copyDraft = useCallback(() => {
    if (!draftText) return
    navigator.clipboard.writeText(draftText).catch(() => {})
    setCopied(true)
    setShowCopyHint(true)
  }, [draftText])

  // ── Nav helpers ────────────────────────────────────────────────────────────
  const openJobDetail = useCallback((jobId: string) => {
    setSelectedJobId(jobId)
    setView('job-detail')
  }, [])

  const backToBriefing = useCallback(() => {
    setView('briefing')
    setSelectedJobId(null)
    setDraftText(null)
    setCopied(false)
    setShowCopyHint(false)
  }, [])

  // ══════════════════════════════════════════════════════════════════════════
  // VIEWS
  // ══════════════════════════════════════════════════════════════════════════

  // ── BRIEFING VIEW ──────────────────────────────────────────────────────────
  if (view === 'briefing') {
    // Separate priorities by severity for display
    const highItems = briefing?.priorities.filter(p => p.severity === 'High') ?? []
    const otherItems = briefing?.priorities.filter(p => p.severity !== 'High') ?? []

    return (
      <div style={s.screen}>
        {/* Top bar */}
        <div style={s.topBar}>
          <span style={s.brand}>QUANTIFY</span>
          <span style={s.aiBadge}>AI</span>
          <span style={s.topBarDate}>{formatDate()}</span>
          <button
            className="oa-tap"
            style={s.iconBtn}
            onClick={loadBriefing}
            title="Refresh briefing"
          >
            <RefreshCw
              size={18}
              color="#fff"
              style={briefingLoading ? { animation: 'oaSpin 900ms linear infinite' } : undefined}
            />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {briefingLoading ? (
            <BriefingLoadingView />
          ) : briefing ? (
            <>
              {/* AI Briefing card */}
              <div className="oa-s1" style={s.briefingCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={s.aiBadgeInline}>AI</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.01em' }}>
                    {briefing.headline}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>
                  {briefing.briefing}
                </p>
              </div>

              {/* ACTION REQUIRED */}
              {highItems.length > 0 && (
                <div className="oa-s2">
                  <p style={s.sectionLabel}>ACTION REQUIRED</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                    {highItems.map((p, i) => (
                      <button
                        key={`${p.jobId}-${i}`}
                        className="oa-tap"
                        style={s.priorityRow}
                        onClick={() => openJobDetail(p.jobId)}
                      >
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: SEV[p.severity].dot, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>{p.jobId}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A' }}>{p.item}</span>
                          </div>
                          <span style={{ fontSize: 12, color: SEV[p.severity].color, fontWeight: 600 }}>
                            {p.nextStep}
                          </span>
                        </div>
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: SEV[p.severity].color,
                          background: SEV[p.severity].bg, padding: '3px 8px', borderRadius: 20, flexShrink: 0,
                        }}>
                          {SEV[p.severity].label}
                        </span>
                        <ChevronRight size={16} color="#C4C4C4" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* FOR REVIEW */}
              {otherItems.length > 0 && (
                <div className="oa-s3">
                  <p style={s.sectionLabel}>FOR REVIEW</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                    {otherItems.map((p, i) => (
                      <button
                        key={`${p.jobId}-review-${i}`}
                        className="oa-tap"
                        style={s.priorityRow}
                        onClick={() => openJobDetail(p.jobId)}
                      >
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: SEV[p.severity].dot, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>{p.jobId}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A' }}>{p.item}</span>
                          </div>
                          <span style={{ fontSize: 12, color: SEV[p.severity].color, fontWeight: 600 }}>
                            {p.nextStep}
                          </span>
                        </div>
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: SEV[p.severity].color,
                          background: SEV[p.severity].bg, padding: '3px 8px', borderRadius: 20, flexShrink: 0,
                        }}>
                          {SEV[p.severity].label}
                        </span>
                        <ChevronRight size={16} color="#C4C4C4" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    )
  }

  // ── JOB DETAIL VIEW ────────────────────────────────────────────────────────
  if (view === 'job-detail' && selectedJob) {
    const highCount = selectedJob.issues.filter(i => i.severity === 'High').length

    return (
      <div style={{ ...s.screen, background: '#F5F5F5' }}>
        {/* Top bar */}
        <div style={s.topBar}>
          <button className="oa-tap" style={s.iconBtn} onClick={backToBriefing}>
            <ArrowLeft size={20} color="#fff" />
          </button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
              {selectedJob.id}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              {selectedJob.type === 'DEL' ? 'Delivery' : 'Return'} · {selectedJob.issues.length} issue{selectedJob.issues.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div style={{ width: 40 }} />
        </div>

        {/* High severity banner */}
        {highCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#FEE2E2' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#DC2626' }}>
              {highCount} high-severity item{highCount !== 1 ? 's' : ''} — immediate action required
            </span>
          </div>
        )}

        {/* Issue cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {selectedJob.issues.map((issue, idx) => {
            const sev = SEV[issue.severity]
            return (
              <div key={issue.id} className={`oa-s${Math.min(idx + 1, 5) as 1 | 2 | 3 | 4 | 5}`} style={s.issueCard}>
                {/* Header */}
                <div style={{ padding: '16px 0 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: sev.color, background: sev.bg,
                    padding: '3px 10px', borderRadius: 20,
                  }}>
                    {sev.label}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A' }}>{issue.item}</span>
                </div>
                <div style={{ height: 1, background: '#F0F0F0' }} />
                {/* Description */}
                <div style={{ padding: '12px 0' }}>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.65, margin: 0 }}>
                    {issue.description}
                  </p>
                </div>
                <div style={{ height: 1, background: '#F0F0F0' }} />
                {/* Action */}
                <div style={{ padding: '12px 0' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1E3FFF' }}>→ {issue.action}</span>
                </div>
                {/* Photo */}
                {issue.photo && (
                  <>
                    <div style={{ height: 1, background: '#F0F0F0' }} />
                    <div style={{ padding: '12px 0' }}>
                      <img
                        src={issue.photo}
                        alt="Damage photo"
                        style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10 }}
                      />
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom action */}
        <div style={{ padding: '16px 20px 40px', borderTop: '1px solid #F0F0F0', background: '#fff' }}>
          <button
            className="oa-tap"
            style={s.primaryBtn}
            onClick={() => loadDraft(selectedJob)}
          >
            <Mail size={18} color="#fff" style={{ marginRight: 10 }} />
            Draft customer note
          </button>
        </div>
      </div>
    )
  }

  // ── DRAFT VIEW ─────────────────────────────────────────────────────────────
  if (view === 'draft') {
    return (
      <div style={{ ...s.screen, background: '#F5F5F5' }}>
        {/* Top bar */}
        <div style={s.topBar}>
          <button
            className="oa-tap"
            style={s.iconBtn}
            onClick={() => { setView('job-detail'); setDraftText(null); setCopied(false); setShowCopyHint(false) }}
          >
            <ArrowLeft size={20} color="#fff" />
          </button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>Customer note</div>
            {selectedJob && (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{selectedJob.id}</div>
            )}
          </div>
          <div style={{ width: 40 }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {draftLoading ? (
            /* Loading state */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '60px 32px', textAlign: 'center' }}>
              <div className="oa-spin" style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '3px solid transparent',
                borderTopColor: '#1E3FFF',
                borderRightColor: 'rgba(30,63,255,0.35)',
                boxSizing: 'border-box',
              }} />
              <span style={{ fontSize: 15, fontWeight: 600, color: '#525252' }}>Writing your customer note…</span>
            </div>
          ) : draftText ? (
            <>
              {/* AI header badge */}
              <div className="oa-s1" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={s.aiBadgeInline}>AI</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.05em' }}>
                  DRAFT — REVIEW BEFORE SENDING
                </span>
              </div>

              {/* Draft text */}
              <div className="oa-s2" style={s.draftCard}>
                <p style={{
                  fontSize: 14, lineHeight: 1.75, color: '#0A0A0A', margin: 0,
                  whiteSpace: 'pre-wrap', fontFamily: 'Switzer, -apple-system, BlinkMacSystemFont, sans-serif',
                }}>
                  {draftText}
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Bottom actions */}
        <div style={{ padding: '16px 20px 40px', borderTop: draftLoading ? 'none' : '1px solid #F0F0F0', background: '#fff', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!draftLoading && draftText && (
            <>
              <button
                className="oa-tap"
                style={{
                  ...s.primaryBtn,
                  background: copied ? '#16A34A' : '#1E3FFF',
                  transition: 'background 0.3s ease-out',
                  gap: 10,
                }}
                onClick={copyDraft}
              >
                {copied
                  ? <><Check size={18} color="#fff" />Copied ✓</>
                  : <><Copy size={18} color="#fff" />Copy to clipboard</>
                }
              </button>
              {showCopyHint && (
                <p className="oa-s1" style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', margin: 0 }}>
                  Paste into email or WhatsApp
                </p>
              )}
            </>
          )}
          <button className="oa-tap" style={s.ghostBtn} onClick={backToBriefing}>
            Back to briefing
          </button>
        </div>
      </div>
    )
  }

  return null
}

// ── Fallback generators ───────────────────────────────────────────────────────
function generateFallbackBriefing(jobs: Job[]): Briefing {
  const totalIssues = jobs.reduce((s, j) => s + j.issues.length, 0)
  const highCount = jobs.reduce((s, j) => s + j.issues.filter(i => i.severity === 'High').length, 0)
  const jobCount = jobs.length

  const headline = highCount > 0
    ? `${highCount} urgent report${highCount !== 1 ? 's' : ''} across ${jobCount} job${jobCount !== 1 ? 's' : ''}`
    : `${totalIssues} report${totalIssues !== 1 ? 's' : ''} across ${jobCount} job${jobCount !== 1 ? 's' : ''}`

  const highJobs = jobs.filter(j => j.issues.some(i => i.severity === 'High'))
  const briefingText = highJobs.length > 0
    ? `Field workers have flagged ${highCount} high-severity items across ${highJobs.map(j => j.id).join(' and ')}. These require immediate review and removal from service before next deployment. ${totalIssues - highCount} additional items are queued for inspection.`
    : `All ${totalIssues} reported items are medium or low severity. Review before next deployment and flag any items that need inspection. No immediate safety stops required at this time.`

  const priorities: BriefingPriority[] = jobs
    .flatMap(j => j.issues.map(i => ({
      jobId: j.id,
      item: i.item,
      severity: i.severity,
      nextStep: i.action.split(' ').slice(0, 4).join(' '),
    })))
    .sort((a, b) => {
      const order: Record<Severity, number> = { High: 0, Medium: 1, Low: 2 }
      return order[a.severity] - order[b.severity]
    })
    .slice(0, 8)

  return { headline, briefing: briefingText, priorities }
}

function generateFallbackDraft(job: Job): string {
  const highItems = job.issues.filter(i => i.severity === 'High')
  const otherItems = job.issues.filter(i => i.severity !== 'High')

  let text = `Hi,\n\nWe are writing regarding your ${job.type === 'DEL' ? 'delivery' : 'return'} job ${job.id}. During our inspection, our team identified the following equipment issues that require attention.\n\n`

  if (highItems.length > 0) {
    text += `The following items have been removed from service due to safety concerns:\n`
    highItems.forEach(i => { text += `• ${i.item} — ${i.description}\n` })
    text += '\n'
  }

  if (otherItems.length > 0) {
    text += `The following items have been flagged for inspection:\n`
    otherItems.forEach(i => { text += `• ${i.item} — ${i.description}\n` })
    text += '\n'
  }

  text += `We will follow up shortly with next steps. Please do not use the flagged equipment until it has been cleared.\n\nThe Avontus Quantify Team`

  return text
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  screen: {
    display: 'flex', flexDirection: 'column', minHeight: '100dvh', maxWidth: 430,
    margin: '0 auto', background: '#F5F5F5',
    fontFamily: 'Switzer, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  topBar: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px',
    background: '#1E3FFF', flexShrink: 0,
  },
  iconBtn: {
    width: 40, height: 40, border: 'none',
    background: 'rgba(255,255,255,0.15)', borderRadius: 10, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    WebkitTapHighlightColor: 'transparent', flexShrink: 0,
  },
  brand: {
    fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '0.1em', flex: 1,
  },
  aiBadge: {
    fontSize: 11, fontWeight: 800, color: '#fff', background: 'rgba(255,255,255,0.22)',
    padding: '3px 8px', borderRadius: 20, letterSpacing: '0.05em',
  },
  aiBadgeInline: {
    fontSize: 10, fontWeight: 800, color: '#1E3FFF', background: '#EEF2FF',
    padding: '2px 7px', borderRadius: 20, letterSpacing: '0.05em', flexShrink: 0,
  },
  topBarDate: {
    fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', margin: 0,
  },
  briefingCard: {
    background: '#F0F4FF', borderRadius: 16, border: '1.5px solid #DBEAFE', padding: '18px 20px',
  },
  priorityRow: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
    background: '#fff', border: '1.5px solid #EBEBEB', borderRadius: 14,
    cursor: 'pointer', width: '100%', WebkitTapHighlightColor: 'transparent',
    fontFamily: 'Switzer, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  issueCard: {
    background: '#fff', borderRadius: 16, border: '1.5px solid #EBEBEB', padding: '0 20px',
  },
  draftCard: {
    background: '#F9FAFB', borderRadius: 14, border: '1.5px solid #E5E7EB',
    padding: '20px', flexShrink: 0,
  },
  primaryBtn: {
    width: '100%', height: 60, background: '#1E3FFF', color: '#fff',
    border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    WebkitTapHighlightColor: 'transparent',
  },
  ghostBtn: {
    width: '100%', height: 54, background: '#F0F0F0', color: '#525252',
    border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    WebkitTapHighlightColor: 'transparent',
  },
}
