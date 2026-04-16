import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Camera, Mic, ArrowLeft, AlertTriangle, CheckCircle, ChevronRight, RotateCcw, Send, X } from 'lucide-react'

// ── CSS keyframes — injected once at module load ───────────────────────────────
const FIELD_CSS = `
  @keyframes fdSpin { to { transform: rotate(360deg); } }
  @keyframes fdSpinR { to { transform: rotate(-360deg); } }
  @keyframes fdPulseRing {
    0%   { transform: scale(1);   opacity: 0.20; }
    65%  { transform: scale(1.75); opacity: 0;   }
    100% { transform: scale(1.75); opacity: 0;   }
  }
  @keyframes fdFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes fdMicRing {
    0%   { box-shadow: 0 0 0 0px  rgba(220,38,38,0.30); }
    70%  { box-shadow: 0 0 0 18px rgba(220,38,38,0);    }
    100% { box-shadow: 0 0 0 0px  rgba(220,38,38,0);    }
  }
  @keyframes fdCenterPulse {
    0%,100% { transform: translate(-50%,-50%) scale(1);    opacity: 1;    }
    50%      { transform: translate(-50%,-50%) scale(0.75); opacity: 0.55; }
  }

  /* Staggered entrance — 60 ms between each layer */
  .fd-s1 { animation: fdFadeUp 320ms cubic-bezier(0.23,1,0.32,1)   0ms both; }
  .fd-s2 { animation: fdFadeUp 320ms cubic-bezier(0.23,1,0.32,1)  60ms both; }
  .fd-s3 { animation: fdFadeUp 320ms cubic-bezier(0.23,1,0.32,1) 120ms both; }
  .fd-s4 { animation: fdFadeUp 320ms cubic-bezier(0.23,1,0.32,1) 180ms both; }
  .fd-s5 { animation: fdFadeUp 320ms cubic-bezier(0.23,1,0.32,1) 240ms both; }

  .fd-spin-fwd { animation: fdSpin  900ms linear infinite; }
  .fd-spin-rev { animation: fdSpinR 1.8s  linear infinite; }
  .fd-pulse-ring { animation: fdPulseRing 2.4s ease-out infinite; }
  .fd-mic-ring   { animation: fdMicRing   1.4s ease-out infinite; }

  /* Press feedback — apply to any tappable element */
  .fd-tap { -webkit-tap-highlight-color: transparent; }
  .fd-tap:active { transform: scale(0.97); transition: transform 0.1s cubic-bezier(0.23,1,0.32,1); }
`
if (typeof document !== 'undefined' && !document.getElementById('field-doc-css')) {
  const el = document.createElement('style')
  el.id = 'field-doc-css'
  el.textContent = FIELD_CSS
  document.head.appendChild(el)
}

// ── Types ──────────────────────────────────────────────────────────────────────
type View = 'home' | 'job' | 'photo-preview' | 'voice-recording' | 'analyzing' | 'confirm' | 'send' | 'summary'
type Severity = 'High' | 'Medium' | 'Low'

interface Issue {
  id: string
  item: string
  issueType: string
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

const SEV = {
  High:   { color: '#DC2626', bg: '#FEE2E2', label: 'HIGH'   },
  Medium: { color: '#D97706', bg: '#FEF3C7', label: 'MED'    },
  Low:    { color: '#16A34A', bg: '#DCFCE7', label: 'LOW'    },
}

const EXAMPLES = [
  'Cuplok standard, cracked weld, 4 pieces',
  'LVL plank, surface peeling, 5 boards',
  'Base plate, bent, cannot stand upright',
]

// ── Utils ──────────────────────────────────────────────────────────────────────
function loadJobs(): Job[] {
  try { return JSON.parse(localStorage.getItem('field-doc-jobs') || '[]') } catch { return [] }
}
function saveJobs(jobs: Job[]) {
  try { localStorage.setItem('field-doc-jobs', JSON.stringify(jobs.slice(0, 20))) } catch { /**/ }
}
function parseJobId(raw: string): { type: 'DEL' | 'RET'; number: string; id: string } | null {
  const m = raw.trim().toUpperCase().replace(/\s/g, '').match(/^(DEL|RET)-?(\d+)$/)
  if (!m) return null
  return { type: m[1] as 'DEL' | 'RET', number: m[2], id: `${m[1]}-${m[2]}` }
}
async function compressImage(dataUrl: string, maxWidth = 900, quality = 0.82): Promise<string> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      if (width > maxWidth) { height = Math.round(height * maxWidth / width); width = maxWidth }
      const c = document.createElement('canvas')
      c.width = width; c.height = height
      c.getContext('2d')!.drawImage(img, 0, 0, width, height)
      resolve(c.toDataURL('image/jpeg', quality))
    }
    img.src = dataUrl
  })
}
function timeStr(ts: number) {
  return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}
function buildShareText(job: Job, single?: Issue): string {
  const issues = single ? [single] : job.issues
  const e = (sv: Severity) => sv === 'High' ? '🔴' : sv === 'Medium' ? '🟡' : '🟢'
  let t = `${job.id} — Field Report\n`
  issues.forEach(i => {
    t += `\n${e(i.severity)} ${i.item} — ${i.severity.toUpperCase()}\n${i.description}\n→ ${i.action}\n`
  })
  return t.trim()
}

// ── Analyzing sub-view ─────────────────────────────────────────────────────────
const STEPS = [
  'Reading your note…',
  'Identifying the item…',
  'Assessing severity…',
  'Writing report…',
]

function AnalyzingView() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      const tid = setTimeout(() => { setStep(s => (s + 1) % STEPS.length); setVisible(true) }, 220)
      return () => clearTimeout(tid)
    }, 1350)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100dvh', maxWidth: 430,
      margin: '0 auto', background: '#fff',
      fontFamily: 'Switzer, -apple-system, BlinkMacSystemFont, sans-serif',
      alignItems: 'center', justifyContent: 'center', padding: '0 48px',
    }}>
      {/* Spinner cluster */}
      <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 44 }}>
        {/* Pulse ring */}
        <div className="fd-pulse-ring" style={{
          position: 'absolute', inset: 0, borderRadius: '50%', background: '#EEF2FF',
          pointerEvents: 'none',
        }} />
        {/* Outer spinner */}
        <div className="fd-spin-fwd" style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2.5px solid transparent',
          borderTopColor: '#1E3FFF',
          borderRightColor: 'rgba(30,63,255,0.4)',
          boxSizing: 'border-box',
        }} />
        {/* Inner counter-spin */}
        <div className="fd-spin-rev" style={{
          position: 'absolute', inset: '15px', borderRadius: '50%',
          border: '1.5px solid transparent',
          borderTopColor: 'rgba(30,63,255,0.3)',
          boxSizing: 'border-box',
        }} />
        {/* White separation ring */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 30, height: 30, borderRadius: '50%', background: '#fff',
        }} />
        {/* Pulsing center dot */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 16, height: 16, borderRadius: '50%', background: '#1E3FFF',
          animation: 'fdCenterPulse 1.8s ease-in-out infinite',
          transformOrigin: 'center center',
          marginTop: -8, marginLeft: -8,
        }} />
      </div>

      {/* Step text — cross-fade between steps */}
      <div style={{
        minHeight: 28, marginBottom: 28, textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.22s cubic-bezier(0.23,1,0.32,1), transform 0.22s cubic-bezier(0.23,1,0.32,1)',
      }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#0A0A0A', letterSpacing: '-0.01em' }}>
          {STEPS[step]}
        </span>
      </div>

      {/* Step pills — active one expands */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            height: 5, borderRadius: 3,
            width: i === step ? 22 : 5,
            background: i === step ? '#1E3FFF' : '#E5E5E5',
            transition: 'width 0.35s cubic-bezier(0.23,1,0.32,1), background 0.3s ease-out',
          }} />
        ))}
      </div>
    </div>
  )
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function FieldDocApp() {
  const [view, setView] = useState<View>('home')
  const [jobs, setJobs] = useState<Job[]>(() => loadJobs())
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [jobInput, setJobInput] = useState('')
  const [jobInputError, setJobInputError] = useState('')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [pending, setPending] = useState<Omit<Issue, 'id' | 'timestamp'> | null>(null)
  const [editItem, setEditItem] = useState('')
  const [editSeverity, setEditSeverity] = useState<Severity>('Medium')
  const [lastIssue, setLastIssue] = useState<Issue | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sendDone, setSendDone] = useState(false)
  const [allSendDone, setAllSendDone] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const recogRef = useRef<any>(null)

  useEffect(() => { saveJobs(jobs) }, [jobs])
  const currentJob = jobs.find(j => j.id === currentJobId) ?? null

  // ── Job ────────────────────────────────────────────────────────────────────
  const openJob = useCallback((input: string) => {
    const parsed = parseJobId(input)
    if (!parsed) { setJobInputError('Enter DEL-2401 or RET-1892'); return }
    setCurrentJobId(parsed.id)
    setJobs(prev => prev.find(j => j.id === parsed.id) ? prev
      : [{ id: parsed.id, type: parsed.type, number: parsed.number, issues: [], createdAt: Date.now() }, ...prev])
    setJobInput(''); setJobInputError(''); setView('job')
  }, [])

  // ── Capture ────────────────────────────────────────────────────────────────
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = async ev => { setCapturedImage(await compressImage(ev.target?.result as string)); setView('photo-preview') }
    reader.readAsDataURL(file); e.target.value = ''
  }, [])

  const analyze = useCallback(async (payload: { imageBase64?: string; transcript?: string }) => {
    setView('analyzing'); setError(null)
    try {
      const apiKey = localStorage.getItem('openrouter_api_key') || ''
      const res = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'field-doc', openRouterApiKey: apiKey, ...payload }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      const r = data.report as Omit<Issue, 'id' | 'timestamp'>
      setPending({ ...r, photo: payload.imageBase64 })
      setEditItem(r.item || ''); setEditSeverity(r.severity)
      setView('confirm')
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Try again.')
      setView(payload.imageBase64 ? 'photo-preview' : 'voice-recording')
    }
  }, [])

  // ── Voice ──────────────────────────────────────────────────────────────────
  const startRecording = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { setError('Voice not supported on this browser. Try Chrome.'); return }
    const r = new SR()
    r.continuous = false; r.interimResults = true; r.lang = 'en-US'
    r.onresult = (ev: any) => {
      let fin = '', inter = ''
      for (const res of ev.results) res.isFinal ? (fin += res[0].transcript + ' ') : (inter += res[0].transcript)
      if (fin.trim()) setTranscript(p => (p + ' ' + fin).trim())
      setInterim(inter)
    }
    r.onend = () => { setIsRecording(false); setInterim(''); recogRef.current = null }
    r.onerror = () => { setIsRecording(false); setInterim(''); recogRef.current = null }
    recogRef.current = r; r.start(); setIsRecording(true)
  }, [])

  const stopRecording = useCallback(() => { recogRef.current?.stop(); setIsRecording(false) }, [])

  // ── Issues ─────────────────────────────────────────────────────────────────
  const confirm = useCallback(() => {
    if (!pending || !currentJobId) return
    const issue: Issue = {
      ...pending,
      item: editItem.trim() || pending.item,
      severity: editSeverity,
      id: Date.now().toString(),
      timestamp: Date.now(),
    }
    setJobs(prev => prev.map(j => j.id === currentJobId ? { ...j, issues: [...j.issues, issue] } : j))
    setLastIssue(issue); setPending(null); setCapturedImage(null); setTranscript('')
    setSendDone(false); setView('send')
  }, [pending, editItem, editSeverity, currentJobId])

  const discard = useCallback(() => {
    setPending(null); setCapturedImage(null); setTranscript(''); setView('job')
  }, [])

  const deleteIssue = useCallback((issueId: string) => {
    setJobs(prev => prev.map(j => j.id === currentJobId ? { ...j, issues: j.issues.filter(i => i.id !== issueId) } : j))
  }, [currentJobId])

  // ── Send ───────────────────────────────────────────────────────────────────
  const doSend = useCallback((single?: Issue) => {
    if (!currentJob) return
    const text = buildShareText(currentJob, single ?? lastIssue ?? undefined)
    const finish = () => { single ? setSendDone(true) : setAllSendDone(true) }
    if (navigator.share) {
      navigator.share({ title: `${currentJob.id} Report`, text }).then(finish).catch(() => { navigator.clipboard.writeText(text); finish() })
    } else { navigator.clipboard.writeText(text); finish() }
  }, [currentJob, lastIssue])

  // ── Nav ────────────────────────────────────────────────────────────────────
  const goHome = useCallback(() => {
    recogRef.current?.stop()
    setView('home'); setCurrentJobId(null); setCapturedImage(null); setTranscript(''); setError(null)
  }, [])
  const goJob = useCallback(() => {
    setCapturedImage(null); setTranscript(''); setError(null); setView('job')
  }, [])

  // ══════════════════════════════════════════════════════════════════════════
  // VIEWS
  // ══════════════════════════════════════════════════════════════════════════

  // HOME
  if (view === 'home') return (
    <div style={s.screen}>
      <div style={s.topBar}>
        <span style={s.brand}>QUANTIFY</span>
        <span style={s.brandSub}>Field Doc</span>
      </div>
      <div style={{ flex: 1, padding: '28px 20px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <p style={s.label}>OPEN A JOB</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <input
              style={{ ...s.jobInput, flex: 1, borderColor: jobInputError ? '#DC2626' : '#E5E5E5' }}
              placeholder="DEL-2401 or RET-1892"
              value={jobInput}
              onChange={e => { setJobInput(e.target.value.toUpperCase()); setJobInputError('') }}
              onKeyDown={e => e.key === 'Enter' && openJob(jobInput)}
              autoCapitalize="characters" autoComplete="off"
            />
            <button className="fd-tap" style={s.openBtn} onClick={() => openJob(jobInput)}>Open</button>
          </div>
          {jobInputError && <p style={{ fontSize: 13, color: '#DC2626', marginTop: 6 }}>{jobInputError}</p>}
        </div>
        {jobs.length > 0 && (
          <div>
            <p style={s.label}>RECENT</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {jobs.slice(0, 5).map(job => {
                const top: Severity = job.issues.reduce<Severity>(
                  (m, i) => i.severity === 'High' ? 'High' : i.severity === 'Medium' && m !== 'High' ? 'Medium' : m,
                  'Low'
                )
                return (
                  <button key={job.id} className="fd-tap" style={s.recentRow}
                    onClick={() => { setCurrentJobId(job.id); setView('job') }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: job.issues.length > 0 ? SEV[top].color : '#D4D4D4', flexShrink: 0 }} />
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A', flex: 1, textAlign: 'left' }}>{job.id}</span>
                    <span style={{ fontSize: 13, color: '#737373' }}>
                      {job.issues.length === 0 ? 'No reports' : `${job.issues.length} report${job.issues.length !== 1 ? 's' : ''}`}
                    </span>
                    <ChevronRight size={16} color="#C4C4C4" />
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // JOB
  if (view === 'job' && currentJob) {
    const highCount = currentJob.issues.filter(i => i.severity === 'High').length
    return (
      <div style={{ ...s.screen, background: '#F5F5F5' }}>
        <div style={s.topBar}>
          <button className="fd-tap" style={s.iconBtn} onClick={goHome}><ArrowLeft size={22} color="#fff" /></button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{currentJob.id}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              {currentJob.type === 'DEL' ? 'Delivery' : 'Return'} · {currentJob.issues.length === 0 ? 'No reports yet' : `${currentJob.issues.length} report${currentJob.issues.length !== 1 ? 's' : ''}`}
            </div>
          </div>
          {currentJob.issues.length > 0
            ? <button className="fd-tap" style={s.topBarTextBtn} onClick={() => { setAllSendDone(false); setView('summary') }}>All reports</button>
            : <div style={{ width: 80 }} />}
        </div>

        {highCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#FEE2E2' }}>
            <AlertTriangle size={14} color="#DC2626" strokeWidth={2.5} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#DC2626' }}>
              {highCount} high-severity — review before proceeding
            </span>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {currentJob.issues.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '80px 32px', textAlign: 'center' }}>
              <Camera size={36} color="#D4D4D4" strokeWidth={1.5} />
              <span style={{ fontSize: 16, fontWeight: 600, color: '#A3A3A3' }}>No damage reports yet</span>
              <span style={{ fontSize: 14, color: '#C4C4C4', lineHeight: 1.6 }}>Use the buttons below to report a damage or defect to the office.</span>
            </div>
          ) : (
            <div style={{ background: '#fff', marginTop: 16 }}>
              {currentJob.issues.map((issue, idx) => (
                <div key={issue.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: SEV[issue.severity].color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A' }}>{issue.item}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: SEV[issue.severity].color, background: SEV[issue.severity].bg, padding: '2px 7px', borderRadius: 20 }}>
                          {SEV[issue.severity].label}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1E3FFF' }}>→ {issue.action}</div>
                      <div style={{ fontSize: 11, color: '#A3A3A3', marginTop: 3 }}>{timeStr(issue.timestamp)}</div>
                    </div>
                    {issue.photo && <img src={issue.photo} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
                    <button className="fd-tap" style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 8, margin: -8 }} onClick={() => deleteIssue(issue.id)}>
                      <X size={16} color="#C4C4C4" />
                    </button>
                  </div>
                  {idx < currentJob.issues.length - 1 && <div style={{ height: 1, background: '#F5F5F5', marginLeft: 44 }} />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '16px 20px 36px', borderTop: '1px solid #F0F0F0', background: '#fff' }}>
          <p style={{ ...s.label, marginBottom: 10 }}>REPORT DAMAGE OR DEFECT</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="fd-tap" style={{ ...s.captureBtn, flex: 1 }} onClick={() => { setError(null); fileInputRef.current?.click() }}>
              <Camera size={20} color="#1E3FFF" strokeWidth={1.75} />
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1E3FFF' }}>Photo</span>
            </button>
            <button className="fd-tap" style={{ ...s.captureBtn, flex: 1 }} onClick={() => { setError(null); setTranscript(''); setInterim(''); setView('voice-recording') }}>
              <Mic size={20} color="#1E3FFF" strokeWidth={1.75} />
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1E3FFF' }}>Voice</span>
            </button>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>
    )
  }

  // PHOTO PREVIEW
  if (view === 'photo-preview') return (
    <div style={s.screen}>
      <div style={s.navBar}>
        <button className="fd-tap" style={s.backBtn} onClick={goJob}><ArrowLeft size={22} color="#0A0A0A" /></button>
        <span style={s.navTitle}>Review photo</span>
        <span style={s.navChip}>{currentJob?.id}</span>
      </div>
      {error && <div style={s.errorBanner}>{error}</div>}
      <div style={{ flex: 1, padding: '20px 20px 0', minHeight: 0 }}>
        <div style={{ height: '100%', minHeight: 280, borderRadius: 16, overflow: 'hidden', background: '#F5F5F5' }}>
          <img src={capturedImage!} alt="Captured damage" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
      <div style={{ padding: '16px 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="fd-tap" style={s.primaryBtn} onClick={() => analyze({ imageBase64: capturedImage! })}>Analyze damage</button>
        <button className="fd-tap" style={s.ghostBtn} onClick={() => fileInputRef.current?.click()}>
          <RotateCcw size={15} color="#525252" style={{ marginRight: 8 }} />Retake
        </button>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFileChange} />
    </div>
  )

  // VOICE
  if (view === 'voice-recording') {
    const hasText = transcript.trim().length > 0
    return (
      <div style={s.screen}>
        <div style={s.navBar}>
          <button className="fd-tap" style={s.backBtn} onClick={goJob}><ArrowLeft size={22} color="#0A0A0A" /></button>
          <span style={s.navTitle}>Describe the damage</span>
          <span style={s.navChip}>{currentJob?.id}</span>
        </div>
        {error && <div style={s.errorBanner}>{error}</div>}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 20px 0', gap: 14 }}>
          {/* Transcript box */}
          <div style={{
            flex: 1, background: '#FAFAFA', borderRadius: 16, padding: 20,
            minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            border: `1.5px solid ${isRecording ? '#1E3FFF' : '#E5E5E5'}`,
            transition: 'border-color 0.2s ease-out',
          }}>
            {!hasText && !isRecording && !interim ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 15, color: '#A3A3A3', lineHeight: 1.55 }}>
                  Say the item name, what's wrong, and how many.
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {EXAMPLES.map(ex => (
                    <button key={ex} className="fd-tap" style={{
                      textAlign: 'left', background: '#F0F0F0', border: 'none',
                      borderRadius: 8, padding: '9px 12px', cursor: 'pointer',
                      fontSize: 13, color: '#525252', fontFamily: 'inherit',
                    }} onClick={() => setTranscript(ex)}>
                      "{ex}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span style={{ fontSize: 18, color: '#0A0A0A', lineHeight: 1.6 }}>
                {transcript}
                {interim && <span style={{ color: '#A3A3A3' }}>{(transcript ? ' ' : '') + interim}</span>}
              </span>
            )}
          </div>

          {/* Mic button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0' }}>
            <button
              className={isRecording ? 'fd-mic-ring' : 'fd-tap'}
              style={{
                width: 80, height: 80, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: isRecording ? '#DC2626' : '#1E3FFF',
                boxShadow: isRecording ? undefined : '0 0 0 12px rgba(30,63,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.18s ease-out',
                WebkitTapHighlightColor: 'transparent',
              }}
              onClick={isRecording ? stopRecording : startRecording}
            >
              <Mic size={32} color="#fff" strokeWidth={1.75} />
            </button>
            <span style={{ fontSize: 13, color: '#737373' }}>
              {isRecording ? 'Listening… tap to stop' : hasText ? 'Tap to add more' : 'Tap to record'}
            </span>
          </div>
        </div>

        <div style={{ padding: '12px 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {hasText && !isRecording && (
            <button className="fd-tap" style={s.primaryBtn} onClick={() => analyze({ transcript: transcript.trim() })}>
              <Send size={17} color="#fff" style={{ marginRight: 10 }} />Report this issue
            </button>
          )}
          {hasText && <button className="fd-tap" style={s.ghostBtn} onClick={() => { setTranscript(''); setInterim('') }}>Clear</button>}
        </div>
      </div>
    )
  }

  // ANALYZING — rich step animation
  if (view === 'analyzing') return <AnalyzingView />

  // CONFIRM — staggered reveal of each section
  if (view === 'confirm' && pending) return (
    <div style={{ ...s.screen, background: '#F5F5F5' }}>
      <div style={s.navBar}>
        <button className="fd-tap" style={s.backBtn} onClick={discard}><ArrowLeft size={22} color="#0A0A0A" /></button>
        <span style={s.navTitle}>Review before sending</span>
        <span style={s.navChip}>{currentJob?.id}</span>
      </div>
      <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Severity picker */}
        <div className="fd-s1" style={s.card}>
          <p style={{ ...s.label, marginBottom: 10, paddingTop: 20 }}>SEVERITY</p>
          <div style={{ display: 'flex', gap: 8, paddingBottom: 20 }}>
            {(['High', 'Medium', 'Low'] as Severity[]).map(sv => (
              <button key={sv} className="fd-tap" onClick={() => setEditSeverity(sv)} style={{
                flex: 1, height: 46, borderRadius: 12,
                border: `2px solid ${editSeverity === sv ? SEV[sv].color : '#E5E5E5'}`,
                background: editSeverity === sv ? SEV[sv].bg : '#FAFAFA',
                color: editSeverity === sv ? SEV[sv].color : '#A3A3A3',
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'border-color 0.15s ease-out, background 0.15s ease-out, color 0.15s ease-out',
              }}>{sv}</button>
            ))}
          </div>
        </div>

        {/* Item name */}
        <div className="fd-s2" style={s.card}>
          <p style={{ ...s.label, marginBottom: 8, paddingTop: 16 }}>ITEM</p>
          <input style={{ ...s.editInput, marginBottom: 16 }} value={editItem} onChange={e => setEditItem(e.target.value)} placeholder="Item name" />
        </div>

        {/* Description + action */}
        <div className="fd-s3" style={s.card}>
          <div style={{ padding: '16px 0' }}>
            <p style={{ ...s.label, marginBottom: 6 }}>DESCRIPTION</p>
            <span style={{ fontSize: 15, color: '#0A0A0A', lineHeight: 1.65 }}>{pending.description}</span>
          </div>
          <div style={{ height: 1, background: '#F0F0F0' }} />
          <div style={{ padding: '16px 0' }}>
            <p style={{ ...s.label, marginBottom: 4 }}>OFFICE ACTION</p>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#1E3FFF' }}>→ {pending.action}</span>
          </div>
        </div>

        {capturedImage && (
          <div className="fd-s4" style={{ borderRadius: 14, overflow: 'hidden', height: 180 }}>
            <img src={capturedImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      <div className="fd-s5" style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="fd-tap" style={s.primaryBtn} onClick={confirm}>
          <Send size={17} color="#fff" style={{ marginRight: 10 }} />Send to office
        </button>
        <button className="fd-tap" style={s.ghostBtn} onClick={discard}>Discard</button>
      </div>
    </div>
  )

  // SEND — report ready, staggered reveal
  if (view === 'send' && lastIssue && currentJob) {
    const sev = SEV[lastIssue.severity]
    return (
      <div style={{ ...s.screen, background: '#F5F5F5' }}>
        <div style={s.topBar}>
          <button className="fd-tap" style={s.iconBtn} onClick={goJob}><ArrowLeft size={22} color="#fff" /></button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Report ready</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{currentJob.id}</div>
          </div>
          <div style={{ width: 48 }} />
        </div>

        <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Issue card */}
          <div className="fd-s1" style={s.card}>
            <div style={{ padding: '18px 0 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: sev.color, background: sev.bg, padding: '3px 10px', borderRadius: 20 }}>
                {sev.label}
              </span>
              <span style={{ fontSize: 17, fontWeight: 700, color: '#0A0A0A' }}>{lastIssue.item}</span>
            </div>
            <div style={{ height: 1, background: '#F0F0F0' }} />
            <div style={{ padding: '14px 0' }}>
              <span style={{ fontSize: 15, color: '#0A0A0A', lineHeight: 1.65 }}>{lastIssue.description}</span>
            </div>
            <div style={{ height: 1, background: '#F0F0F0' }} />
            <div style={{ padding: '14px 0' }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1E3FFF' }}>→ {lastIssue.action}</span>
            </div>
            {lastIssue.photo && (
              <>
                <div style={{ height: 1, background: '#F0F0F0' }} />
                <div style={{ padding: '14px 0' }}>
                  <img src={lastIssue.photo} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10 }} />
                </div>
              </>
            )}
          </div>

          {/* Where it goes */}
          <div className="fd-s2" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '0 4px' }}>
            <Send size={15} color="#A3A3A3" style={{ marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#737373', lineHeight: 1.55 }}>
              Goes to WhatsApp, email, or wherever your team works. The office sees what was damaged and what to do about it.
            </span>
          </div>
        </div>

        <div className="fd-s3" style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="fd-tap"
            style={{ ...s.primaryBtn, background: sendDone ? '#16A34A' : '#1E3FFF', transition: 'background 0.25s ease-out' }}
            onClick={() => doSend()}
          >
            {sendDone
              ? <><CheckCircle size={18} color="#fff" style={{ marginRight: 10 }} />Sent</>
              : <><Send size={18} color="#fff" style={{ marginRight: 10 }} />Send to office</>
            }
          </button>
          <button className="fd-tap" style={s.ghostBtn} onClick={goJob}>Log another issue</button>
        </div>
      </div>
    )
  }

  // SUMMARY
  if (view === 'summary' && currentJob) return (
    <div style={{ ...s.screen, background: '#F5F5F5' }}>
      <div style={s.topBar}>
        <button className="fd-tap" style={s.iconBtn} onClick={() => setView('job')}><ArrowLeft size={22} color="#fff" /></button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{currentJob.id} — All Reports</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{currentJob.issues.length} issue{currentJob.issues.length !== 1 ? 's' : ''}</div>
        </div>
        <div style={{ width: 48 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {currentJob.issues.map(issue => {
          const sev = SEV[issue.severity]
          return (
            <div key={issue.id} style={s.card}>
              <div style={{ padding: '16px 0 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: sev.color, background: sev.bg, padding: '2px 8px', borderRadius: 20 }}>{sev.label}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A' }}>{issue.item}</span>
                <span style={{ fontSize: 11, color: '#A3A3A3', marginLeft: 'auto' }}>{timeStr(issue.timestamp)}</span>
              </div>
              <div style={{ height: 1, background: '#F0F0F0' }} />
              <div style={{ padding: '12px 0 0', display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: '#0A0A0A', lineHeight: 1.6, margin: '0 0 10px' }}>{issue.description}</p>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1E3FFF' }}>→ {issue.action}</span>
                </div>
                {issue.photo && <img src={issue.photo} alt="" style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />}
              </div>
              <div style={{ height: 16 }} />
            </div>
          )
        })}
      </div>

      <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="fd-tap" style={{ ...s.primaryBtn, background: allSendDone ? '#16A34A' : '#1E3FFF', transition: 'background 0.25s ease-out' }} onClick={() => doSend()}>
          {allSendDone
            ? <><CheckCircle size={18} color="#fff" style={{ marginRight: 8 }} />Sent to office</>
            : <><Send size={18} color="#fff" style={{ marginRight: 8 }} />Send full report to office</>
          }
        </button>
        <button className="fd-tap" style={s.ghostBtn} onClick={() => setView('job')}>Back</button>
      </div>
    </div>
  )

  return null
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  screen:        { display: 'flex', flexDirection: 'column', minHeight: '100dvh', maxWidth: 430, margin: '0 auto', background: '#FFFFFF', fontFamily: 'Switzer, -apple-system, BlinkMacSystemFont, sans-serif' },
  topBar:        { display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', background: '#1E3FFF' },
  iconBtn:       { width: 40, height: 40, border: 'none', background: 'rgba(255,255,255,0.15)', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent', flexShrink: 0 },
  topBarTextBtn: { height: 34, padding: '0 12px', border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 8, background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'inherit', WebkitTapHighlightColor: 'transparent', flexShrink: 0 },
  brand:         { fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '0.1em', flex: 1 },
  brandSub:      { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  navBar:        { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid #F0F0F0' },
  backBtn:       { width: 40, height: 40, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, WebkitTapHighlightColor: 'transparent' },
  navTitle:      { fontSize: 16, fontWeight: 600, color: '#0A0A0A', flex: 1 },
  navChip:       { fontSize: 12, fontWeight: 600, color: '#1E3FFF', background: '#EEF2FF', padding: '4px 10px', borderRadius: 20 },
  label:         { fontSize: 11, fontWeight: 700, color: '#A3A3A3', letterSpacing: '0.08em', margin: 0 },
  jobInput:      { height: 56, borderRadius: 14, border: '1.5px solid', padding: '0 16px', fontSize: 17, fontWeight: 600, fontFamily: 'Switzer, sans-serif', outline: 'none', color: '#0A0A0A', background: '#FAFAFA' },
  openBtn:       { height: 56, padding: '0 22px', background: '#1E3FFF', color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', WebkitTapHighlightColor: 'transparent', flexShrink: 0 },
  recentRow:     { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#FAFAFA', border: '1.5px solid #F0F0F0', borderRadius: 14, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' },
  captureBtn:    { height: 60, background: '#EEF2FF', border: 'none', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' },
  card:          { background: '#fff', borderRadius: 16, border: '1.5px solid #EBEBEB', padding: '0 20px' },
  editInput:     { width: '100%', height: 48, borderRadius: 10, border: '1.5px solid #E5E5E5', padding: '0 14px', fontSize: 16, fontFamily: 'Switzer, sans-serif', outline: 'none', color: '#0A0A0A', boxSizing: 'border-box', background: '#FAFAFA' },
  primaryBtn:    { width: '100%', height: 60, background: '#1E3FFF', color: '#fff', border: 'none', borderRadius: 16, fontSize: 17, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent' },
  ghostBtn:      { width: '100%', height: 54, background: '#F5F5F5', color: '#0A0A0A', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent' },
  errorBanner:   { background: '#FEE2E2', color: '#DC2626', padding: '12px 20px', fontSize: 14, fontWeight: 500 },
}
