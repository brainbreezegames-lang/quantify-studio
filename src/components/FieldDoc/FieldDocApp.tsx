import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  Camera, Mic, ArrowLeft, AlertTriangle, CheckCircle,
  Share2, Trash2, ChevronRight, RotateCcw, Send,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
type View = 'home' | 'job' | 'photo-preview' | 'voice-recording' | 'analyzing' | 'confirm' | 'send' | 'summary'
type Severity = 'High' | 'Medium' | 'Low'

interface Issue {
  id: string
  item: string | null
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
  High:   { dot: '#DC2626', bg: '#FEE2E2', text: '#DC2626', label: 'HIGH'   },
  Medium: { dot: '#F59E0B', bg: '#FEF3C7', text: '#B45309', label: 'MEDIUM' },
  Low:    { dot: '#16A34A', bg: '#DCFCE7', text: '#166534', label: 'LOW'    },
}

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

function buildIssueMessage(jobId: string, issue: Issue): string {
  const sevEmoji = issue.severity === 'High' ? '🔴' : issue.severity === 'Medium' ? '🟡' : '🟢'
  return [
    `${sevEmoji} ${jobId} — Damage Report`,
    ``,
    `Item: ${issue.item || 'Unknown item'}`,
    `Severity: ${issue.severity.toUpperCase()}`,
    `Issue: ${issue.issueType}`,
    ``,
    issue.description,
    ``,
    `→ ${issue.action}`,
    ``,
    `Logged at ${timeStr(issue.timestamp)} · Quantify Field Doc`,
  ].join('\n')
}

// ── Demo data ──────────────────────────────────────────────────────────────────
const DEMO_JOB: Job = {
  id: 'DEL-2401', type: 'DEL', number: '2401',
  createdAt: Date.now() - 1800000,
  issues: [
    {
      id: 'demo-1', item: 'Cuplok Standard 2.0m', issueType: 'Damage', severity: 'High',
      description: 'Cracked weld at the cup joint on 4 pieces. Cannot bear load safely — must not be loaded.',
      action: 'Remove from service', timestamp: Date.now() - 900000,
    },
    {
      id: 'demo-2', item: 'LVL Plank 2.5m', issueType: 'Damage', severity: 'Medium',
      description: 'Surface delamination on 5 planks, edge peeling visible. Usable with caution but needs sign-off.',
      action: 'Flag for inspection', timestamp: Date.now() - 600000,
    },
  ],
}
const DEMO_LAST_ISSUE: Issue = {
  id: 'demo-3', item: 'Steel Toe Board 2.5m', issueType: 'Wear', severity: 'Low',
  description: 'Surface rust on 19 boards — structurally intact but will need treatment before next deployment.',
  action: 'Monitor', timestamp: Date.now(),
}

function buildFullReport(job: Job): string {
  const date = new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const sevEmoji = (s: Severity) => s === 'High' ? '🔴' : s === 'Medium' ? '🟡' : '🟢'
  let t = `QUANTIFY FIELD REPORT\n${job.id} · ${date}\n${job.issues.length} issue${job.issues.length !== 1 ? 's' : ''}\n`
  job.issues.forEach((iss, i) => {
    t += `\n${i + 1}. ${sevEmoji(iss.severity)} ${iss.severity.toUpperCase()} — ${iss.item || 'Unknown item'}\n`
    t += `${iss.description}\n→ ${iss.action}\n`
  })
  return t
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
  const [pendingReport, setPendingReport] = useState<Omit<Issue, 'id' | 'timestamp'> | null>(null)
  const [editItem, setEditItem] = useState('')
  const [editSeverity, setEditSeverity] = useState<Severity>('Medium')
  const [lastIssue, setLastIssue] = useState<Issue | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sendState, setSendState] = useState<'idle' | 'sent'>('idle')
  const [reportSent, setReportSent] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const recogRef = useRef<any>(null)

  useEffect(() => { saveJobs(jobs) }, [jobs])

  const currentJob = jobs.find(j => j.id === currentJobId) ?? null

  // ── Job ────────────────────────────────────────────────────────────────────
  const openJob = useCallback((input: string) => {
    const parsed = parseJobId(input)
    if (!parsed) { setJobInputError('Enter a valid number — DEL-2401 or RET-1892'); return }
    setCurrentJobId(parsed.id)
    setJobs(prev => {
      if (prev.find(j => j.id === parsed.id)) return prev
      return [{ id: parsed.id, type: parsed.type, number: parsed.number, issues: [], createdAt: Date.now() }, ...prev]
    })
    setJobInput(''); setJobInputError(''); setView('job')
  }, [])

  // ── Capture ────────────────────────────────────────────────────────────────
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = async ev => {
      setCapturedImage(await compressImage(ev.target?.result as string))
      setView('photo-preview')
    }
    reader.readAsDataURL(file); e.target.value = ''
  }, [])

  const runAnalysis = useCallback(async (payload: { imageBase64?: string; transcript?: string }) => {
    setView('analyzing'); setError(null)
    try {
      const apiKey = localStorage.getItem('openrouter_api_key') || ''
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'field-doc', openRouterApiKey: apiKey, ...payload }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      const r = data.report as Omit<Issue, 'id' | 'timestamp'>
      setPendingReport({ ...r, photo: payload.imageBase64 })
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
    if (!SR) { setError('Voice not supported. Try Chrome or Safari.'); return }
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
  const confirmIssue = useCallback(() => {
    if (!pendingReport || !currentJobId) return
    const issue: Issue = {
      ...pendingReport,
      item: editItem.trim() || pendingReport.item,
      severity: editSeverity,
      id: Date.now().toString(),
      timestamp: Date.now(),
    }
    setJobs(prev => prev.map(j => j.id === currentJobId ? { ...j, issues: [...j.issues, issue] } : j))
    setLastIssue(issue)
    setPendingReport(null); setCapturedImage(null); setTranscript('')
    setSendState('idle')
    setView('send')         // ← go straight to Send screen, not back to job list
  }, [pendingReport, editItem, editSeverity, currentJobId])

  const deleteIssue = useCallback((issueId: string) => {
    setJobs(prev => prev.map(j =>
      j.id === currentJobId ? { ...j, issues: j.issues.filter(i => i.id !== issueId) } : j
    ))
  }, [currentJobId])

  // ── Send ───────────────────────────────────────────────────────────────────
  const sendToOffice = useCallback((single?: Issue) => {
    if (!currentJob) return
    const issue = single ?? lastIssue
    if (!issue) return
    const text = buildIssueMessage(currentJob.id, issue)
    const title = `${currentJob.id} — Damage Report`
    const doSend = () => {
      setSendState('sent')
      setTimeout(() => setSendState('idle'), 3000)
    }
    if (navigator.share) {
      navigator.share({ title, text }).then(doSend).catch(() => {
        navigator.clipboard.writeText(text); doSend()
      })
    } else {
      navigator.clipboard.writeText(text); doSend()
    }
  }, [currentJob, lastIssue])

  const sendFullReport = useCallback(() => {
    if (!currentJob) return
    const text = buildFullReport(currentJob)
    const doSend = () => { setReportSent(true); setTimeout(() => setReportSent(false), 3000) }
    if (navigator.share) {
      navigator.share({ title: `${currentJob.id} Field Report`, text }).then(doSend).catch(() => {
        navigator.clipboard.writeText(text); doSend()
      })
    } else {
      navigator.clipboard.writeText(text); doSend()
    }
  }, [currentJob])

  // ── Nav ────────────────────────────────────────────────────────────────────
  const goHome = useCallback(() => {
    recogRef.current?.stop()
    setView('home'); setCurrentJobId(null); setCapturedImage(null); setTranscript(''); setError(null)
  }, [])
  const goToJob = useCallback(() => {
    setCapturedImage(null); setTranscript(''); setError(null); setView('job')
  }, [])

  const startDemo = useCallback(() => {
    const job = { ...DEMO_JOB, issues: [...DEMO_JOB.issues, { ...DEMO_LAST_ISSUE, timestamp: Date.now() }] }
    setJobs(prev => {
      const without = prev.filter(j => j.id !== job.id)
      return [job, ...without]
    })
    setCurrentJobId(job.id)
    setLastIssue({ ...DEMO_LAST_ISSUE, timestamp: Date.now() })
    setSendState('idle')
    setView('send')
  }, [])

  // ── VIEWS ──────────────────────────────────────────────────────────────────

  // HOME ──────────────────────────────────────────────────────────────────────
  if (view === 'home') return (
    <div style={s.screen}>
      <div style={s.topBar}>
        <span style={s.brand}>QUANTIFY</span>
        <span style={s.brandRight}>Field Doc</span>
      </div>
      <div style={{ flex: 1, padding: '28px 20px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={s.sectionLabel}>OPEN A JOB</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              style={{ ...s.jobInput, flex: 1, borderColor: jobInputError ? '#DC2626' : '#E5E5E5' }}
              placeholder="DEL-2401 or RET-1892"
              value={jobInput}
              onChange={e => { setJobInput(e.target.value.toUpperCase()); setJobInputError('') }}
              onKeyDown={e => e.key === 'Enter' && openJob(jobInput)}
              autoCapitalize="characters" autoComplete="off"
            />
            <button style={s.openBtn} onClick={() => openJob(jobInput)}>Open</button>
          </div>
          {jobInputError && <span style={{ fontSize: 13, color: '#DC2626' }}>{jobInputError}</span>}
        </div>

        {/* Demo */}
        <div style={{
          background: '#F0F4FF', borderRadius: 16, padding: '18px 20px',
          display: 'flex', flexDirection: 'column', gap: 8,
          border: '1.5px solid #C7D7FF',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3FFF', letterSpacing: '0.07em' }}>DEMO</span>
            <span style={{ fontSize: 13, color: '#525252' }}>See the full flow with realistic data</span>
          </div>
          <button style={{
            height: 52, background: '#1E3FFF', color: '#FFFFFF', border: 'none',
            borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit', WebkitTapHighlightColor: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }} onClick={startDemo}>
            <Send size={16} color="#fff" />Watch the full flow →
          </button>
        </div>

        {jobs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={s.sectionLabel}>RECENT</span>
            {jobs.slice(0, 5).map(job => {
              const top: Severity = job.issues.reduce<Severity>((m, i) => {
                if (i.severity === 'High') return 'High'
                if (i.severity === 'Medium' && m !== 'High') return 'Medium'
                return m
              }, 'Low')
              return (
                <button key={job.id} style={s.recentRow} onClick={() => { setCurrentJobId(job.id); setView('job') }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    background: job.issues.length > 0 ? SEV[top].dot : '#D4D4D4' }} />
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A' }}>{job.id}</span>
                    <span style={{ fontSize: 13, color: '#737373', marginLeft: 10 }}>
                      {job.issues.length === 0 ? 'No issues' : `${job.issues.length} issue${job.issues.length !== 1 ? 's' : ''}`}
                    </span>
                  </div>
                  <ChevronRight size={18} color="#A3A3A3" />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  // JOB ───────────────────────────────────────────────────────────────────────
  if (view === 'job' && currentJob) {
    const highCount = currentJob.issues.filter(i => i.severity === 'High').length
    return (
      <div style={{ ...s.screen, background: '#F5F5F5' }}>
        <div style={s.topBar}>
          <button style={s.topBarBack} onClick={goHome}><ArrowLeft size={22} color="#FFFFFF" /></button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>{currentJob.id}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>
              {currentJob.type === 'DEL' ? 'Delivery' : 'Return'} · {currentJob.issues.length === 0 ? 'No reports yet' : `${currentJob.issues.length} report${currentJob.issues.length !== 1 ? 's' : ''} sent`}
            </div>
          </div>
          {currentJob.issues.length > 0
            ? <button style={s.topBarAction} onClick={() => { setReportSent(false); setView('summary') }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>All reports</span>
              </button>
            : <div style={{ width: 80 }} />
          }
        </div>

        {highCount > 0 && (
          <div style={s.alertStrip}>
            <AlertTriangle size={16} color="#DC2626" strokeWidth={2} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#DC2626' }}>
              {highCount} high-severity report{highCount !== 1 ? 's' : ''} — office notified
            </span>
          </div>
        )}

        <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {currentJob.issues.length === 0 ? (
            <div style={s.emptyState}>
              <Camera size={40} color="#D4D4D4" strokeWidth={1.5} />
              <span style={{ fontSize: 17, color: '#A3A3A3', fontWeight: 600 }}>No damage reports yet</span>
              <span style={{ fontSize: 14, color: '#C4C4C4', textAlign: 'center', lineHeight: 1.5 }}>
                Use the buttons below to report a damage, defect, or missing item to the office
              </span>
            </div>
          ) : currentJob.issues.map(issue => (
            <div key={issue.id} style={s.issueCard}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: SEV[issue.severity].bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: SEV[issue.severity].dot }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0A0A0A', marginBottom: 2 }}>
                    {issue.item || 'Unknown item'}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: SEV[issue.severity].text, letterSpacing: '0.05em', marginBottom: 6 }}>
                    {SEV[issue.severity].label} · {issue.issueType}
                  </div>
                  <div style={{ fontSize: 13, color: '#525252', lineHeight: 1.55, marginBottom: 6 }}>{issue.description}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1E3FFF' }}>→ {issue.action}</div>
                </div>
                {issue.photo && (
                  <img src={issue.photo} alt=""
                    style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 11, color: '#A3A3A3' }}>Reported at {timeStr(issue.timestamp)}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={s.rowAction} onClick={() => sendToOffice(issue)}>
                    <Send size={13} color="#1E3FFF" />
                    <span style={{ fontSize: 12, color: '#1E3FFF', fontWeight: 600 }}>Resend</span>
                  </button>
                  <button style={s.rowAction} onClick={() => deleteIssue(issue.id)}>
                    <Trash2 size={13} color="#A3A3A3" />
                    <span style={{ fontSize: 12, color: '#A3A3A3' }}>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={s.captureBar}>
          <span style={s.sectionLabel}>REPORT DAMAGE OR DEFECT</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ ...s.captureBtn, flex: 1 }} onClick={() => { setError(null); fileInputRef.current?.click() }}>
              <Camera size={22} color="#1E3FFF" strokeWidth={1.75} />
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1E3FFF' }}>Photo</span>
            </button>
            <button style={{ ...s.captureBtn, flex: 1 }}
              onClick={() => { setError(null); setTranscript(''); setInterim(''); setView('voice-recording') }}>
              <Mic size={22} color="#1E3FFF" strokeWidth={1.75} />
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1E3FFF' }}>Voice</span>
            </button>
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
          style={{ display: 'none' }} onChange={handleFileChange} />
      </div>
    )
  }

  // PHOTO PREVIEW ─────────────────────────────────────────────────────────────
  if (view === 'photo-preview') return (
    <div style={s.screen}>
      <div style={s.navBar}>
        <button style={s.backBtn} onClick={goToJob}><ArrowLeft size={22} color="#0A0A0A" /></button>
        <span style={s.navTitle}>Review photo</span>
        <span style={s.navChip}>{currentJob?.id}</span>
      </div>
      {error && <div style={s.errorBanner}>{error}</div>}
      <div style={{ flex: 1, padding: '20px 20px 0', minHeight: 0 }}>
        <div style={{ height: '100%', minHeight: 280, borderRadius: 16, overflow: 'hidden', background: '#F5F5F5' }}>
          <img src={capturedImage!} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
      <div style={{ padding: '16px 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button style={s.primaryBtn} onClick={() => runAnalysis({ imageBase64: capturedImage! })}>Analyze damage</button>
        <button style={s.ghostBtn} onClick={() => fileInputRef.current?.click()}>
          <RotateCcw size={16} color="#525252" style={{ marginRight: 8 }} />Retake photo
        </button>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
        style={{ display: 'none' }} onChange={handleFileChange} />
    </div>
  )

  // VOICE ─────────────────────────────────────────────────────────────────────
  if (view === 'voice-recording') {
    const hasText = transcript.trim().length > 0
    return (
      <div style={s.screen}>
        <div style={s.navBar}>
          <button style={s.backBtn} onClick={goToJob}><ArrowLeft size={22} color="#0A0A0A" /></button>
          <span style={s.navTitle}>Describe the issue</span>
          <span style={s.navChip}>{currentJob?.id}</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 20px 0', gap: 16 }}>
          <div style={s.transcriptBox}>
            {!hasText && !isRecording && !interim
              ? <span style={{ color: '#A3A3A3', fontSize: 16, lineHeight: 1.5 }}>
                  Tap the mic — describe what you found. The office will see exactly what you say.
                </span>
              : <span style={{ fontSize: 18, color: '#0A0A0A', lineHeight: 1.6 }}>
                  {transcript}
                  {interim && <span style={{ color: '#A3A3A3' }}>{(transcript ? ' ' : '') + interim}</span>}
                </span>
            }
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 4 }}>
            <button
              style={{
                ...s.micBtn,
                background: isRecording ? '#DC2626' : '#1E3FFF',
                boxShadow: isRecording ? '0 0 0 14px rgba(220,38,38,0.12)' : '0 0 0 14px rgba(30,63,255,0.08)',
              }}
              onClick={isRecording ? stopRecording : startRecording}
            >
              <Mic size={36} color="#FFFFFF" strokeWidth={1.75} />
            </button>
            <span style={{ fontSize: 13, color: '#737373' }}>
              {isRecording ? 'Listening… tap to stop' : hasText ? 'Tap to add more' : 'Tap to start speaking'}
            </span>
            {!hasText && !isRecording && (
              <button
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 0', WebkitTapHighlightColor: 'transparent' }}
                onClick={() => setTranscript('Cuplok standard 2 meter, cracked weld on the cup joint, four pieces, cannot use them')}
              >
                <span style={{ fontSize: 13, color: '#1E3FFF', textDecoration: 'underline' }}>Use example note instead</span>
              </button>
            )}
          </div>
        </div>
        <div style={{ padding: '16px 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {hasText && !isRecording && (
            <button style={s.primaryBtn} onClick={() => runAnalysis({ transcript: transcript.trim() })}>
              <Send size={18} color="#fff" style={{ marginRight: 10 }} />Report this issue
            </button>
          )}
          {hasText && (
            <button style={s.ghostBtn} onClick={() => { setTranscript(''); setInterim('') }}>Clear and start over</button>
          )}
        </div>
      </div>
    )
  }

  // ANALYZING ─────────────────────────────────────────────────────────────────
  if (view === 'analyzing') return (
    <div style={{ ...s.screen, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div className="animate-spin" style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #E5E7EB', borderTopColor: '#1E3FFF' }} />
      <span style={{ fontSize: 15, color: '#737373', fontFamily: 'Switzer, sans-serif' }}>Analyzing…</span>
    </div>
  )

  // CONFIRM ───────────────────────────────────────────────────────────────────
  if (view === 'confirm' && pendingReport) return (
    <div style={{ ...s.screen, background: '#F5F5F5' }}>
      <div style={s.navBar}>
        <button style={s.backBtn} onClick={() => { setPendingReport(null); setCapturedImage(null); setTranscript(''); setView('job') }}>
          <ArrowLeft size={22} color="#0A0A0A" />
        </button>
        <span style={s.navTitle}>Review before sending</span>
        <span style={s.navChip}>{currentJob?.id}</span>
      </div>
      <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={s.card}>
          <span style={{ ...s.cardLabel, display: 'block', marginBottom: 12 }}>SEVERITY</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['High', 'Medium', 'Low'] as Severity[]).map(sv => (
              <button key={sv} style={{
                flex: 1, height: 48, borderRadius: 12, border: '2px solid',
                borderColor: editSeverity === sv ? SEV[sv].dot : '#E5E5E5',
                background: editSeverity === sv ? SEV[sv].bg : '#FAFAFA',
                color: editSeverity === sv ? SEV[sv].text : '#A3A3A3',
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                WebkitTapHighlightColor: 'transparent',
              }} onClick={() => setEditSeverity(sv)}>{sv}</button>
            ))}
          </div>
        </div>
        <div style={s.card}>
          <span style={{ ...s.cardLabel, display: 'block', marginBottom: 8 }}>ITEM</span>
          <input style={s.editInput} value={editItem}
            onChange={e => setEditItem(e.target.value)} placeholder="Item name (optional)" />
        </div>
        <div style={s.card}>
          <div style={{ padding: '16px 0' }}>
            <span style={{ ...s.cardLabel, display: 'block', marginBottom: 6 }}>DESCRIPTION</span>
            <span style={{ fontSize: 15, color: '#0A0A0A', lineHeight: 1.65 }}>{pendingReport.description}</span>
          </div>
          <div style={s.divider} />
          <div style={{ padding: '16px 0' }}>
            <span style={{ ...s.cardLabel, display: 'block', marginBottom: 6 }}>OFFICE ACTION</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#1E3FFF' }}>{pendingReport.action}</span>
          </div>
        </div>
        {capturedImage && (
          <div style={{ borderRadius: 14, overflow: 'hidden', height: 180 }}>
            <img src={capturedImage} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>
      <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button style={s.primaryBtn} onClick={confirmIssue}>
          <Send size={18} color="#fff" style={{ marginRight: 10 }} />Send to office
        </button>
        <button style={s.ghostBtn} onClick={() => { setPendingReport(null); setCapturedImage(null); setTranscript(''); setView('job') }}>
          Discard
        </button>
      </div>
    </div>
  )

  // SEND ──────────────────────────────────────────────────────────────────────
  // The screen right after confirming — makes it clear the report goes to the office
  if (view === 'send' && lastIssue && currentJob) {
    const sev = SEV[lastIssue.severity]
    const isSent = sendState === 'sent'
    return (
      <div style={{ ...s.screen, background: '#F5F5F5' }}>
        <div style={s.topBar}>
          <button style={s.topBarBack} onClick={goToJob}><ArrowLeft size={22} color="#FFFFFF" /></button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>Report ready</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{currentJob.id}</div>
          </div>
          <div style={{ width: 56 }} />
        </div>

        <div style={{ flex: 1, padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Office message preview */}
          <div style={{
            background: '#FFFFFF', borderRadius: 20, padding: 20,
            border: '1.5px solid #E5E5E5',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: sev.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <AlertTriangle size={20} color={sev.text} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: sev.text, letterSpacing: '0.05em' }}>
                  {sev.label} SEVERITY
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A' }}>
                  {lastIssue.item || 'Unknown item'}
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: '#F0F0F0' }} />

            {/* Message body — exactly what goes to office */}
            <div style={{
              background: '#F8F9FF', borderRadius: 12, padding: '14px 16px',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#A3A3A3', letterSpacing: '0.07em' }}>
                MESSAGE PREVIEW
              </span>
              <span style={{ fontSize: 14, color: '#0A0A0A', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{lastIssue.description}"
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                flex: 1, height: 44, borderRadius: 10, background: '#F0F7FF',
                display: 'flex', alignItems: 'center', paddingLeft: 14,
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1E3FFF' }}>→ {lastIssue.action}</span>
              </div>
              {lastIssue.photo && (
                <img src={lastIssue.photo} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
              )}
            </div>

            <div style={{ fontSize: 11, color: '#A3A3A3', textAlign: 'right' }}>
              {currentJob.id} · {timeStr(lastIssue.timestamp)}
            </div>
          </div>

          {/* Destination hint */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' }}>
            <Send size={16} color="#737373" />
            <span style={{ fontSize: 14, color: '#737373', lineHeight: 1.5 }}>
              This report will go to WhatsApp, email, or wherever your team communicates. The office sees severity, description, and the recommended action.
            </span>
          </div>
        </div>

        <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={{ ...s.primaryBtn, background: isSent ? '#16A34A' : '#1E3FFF' }} onClick={() => sendToOffice()}>
            {isSent
              ? <><CheckCircle size={20} color="#fff" style={{ marginRight: 10 }} />Sent to office</>
              : <><Send size={20} color="#fff" style={{ marginRight: 10 }} />Send to office now</>
            }
          </button>
          <button style={s.ghostBtn} onClick={() => { setTranscript(''); setCapturedImage(null); goToJob() }}>
            Log another issue
          </button>
        </div>
      </div>
    )
  }

  // SUMMARY ───────────────────────────────────────────────────────────────────
  if (view === 'summary' && currentJob) return (
    <div style={{ ...s.screen, background: '#F5F5F5' }}>
      <div style={s.topBar}>
        <button style={s.topBarBack} onClick={() => setView('job')}><ArrowLeft size={22} color="#FFFFFF" /></button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>{currentJob.id} — All Reports</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>
            {currentJob.issues.length} issue{currentJob.issues.length !== 1 ? 's' : ''} documented
          </div>
        </div>
        <div style={{ width: 56 }} />
      </div>
      <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {currentJob.issues.map(issue => (
          <div key={issue.id} style={s.card}>
            <div style={{ padding: '14px 0 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: SEV[issue.severity].dot }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: SEV[issue.severity].text, letterSpacing: '0.06em' }}>
                {SEV[issue.severity].label}
              </span>
              <span style={{ fontSize: 11, color: '#A3A3A3', marginLeft: 'auto' }}>{timeStr(issue.timestamp)}</span>
            </div>
            <div style={s.divider} />
            <div style={{ padding: '14px 0 0', display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A', marginBottom: 3 }}>{issue.item || 'Unknown item'}</div>
                <div style={{ fontSize: 13, color: '#737373', marginBottom: 10 }}>{issue.issueType}</div>
                <div style={{ fontSize: 14, color: '#0A0A0A', lineHeight: 1.6, marginBottom: 10 }}>{issue.description}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1E3FFF' }}>→ {issue.action}</div>
              </div>
              {issue.photo && (
                <img src={issue.photo} alt="" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', flexShrink: 0, alignSelf: 'flex-start' }} />
              )}
            </div>
            <div style={{ height: 14 }} />
          </div>
        ))}
      </div>
      <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button style={{ ...s.primaryBtn, background: reportSent ? '#16A34A' : '#1E3FFF' }} onClick={sendFullReport}>
          {reportSent
            ? <><CheckCircle size={18} color="#fff" style={{ marginRight: 8 }} />Sent to office</>
            : <><Send size={18} color="#fff" style={{ marginRight: 8 }} />Send full report to office</>
          }
        </button>
        <button style={s.ghostBtn} onClick={() => setView('job')}>Back to job</button>
      </div>
    </div>
  )

  return null
}

// ── Styles ──────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  screen: { display: 'flex', flexDirection: 'column', minHeight: '100dvh', maxWidth: 430, margin: '0 auto', background: '#FFFFFF', fontFamily: 'Switzer, -apple-system, BlinkMacSystemFont, sans-serif' },
  topBar: { display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', background: '#1E3FFF' },
  topBarBack: { width: 40, height: 40, border: 'none', background: 'rgba(255,255,255,0.15)', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent', flexShrink: 0 },
  topBarAction: { height: 36, padding: '0 14px', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 10, background: 'transparent', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', flexShrink: 0 },
  brand: { fontSize: 13, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.1em', flex: 1 },
  brandRight: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  navBar: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid #F0F0F0' },
  backBtn: { width: 40, height: 40, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, WebkitTapHighlightColor: 'transparent' },
  navTitle: { fontSize: 16, fontWeight: 600, color: '#0A0A0A', flex: 1 },
  navChip: { fontSize: 12, fontWeight: 600, color: '#1E3FFF', background: '#EEF2FF', padding: '4px 10px', borderRadius: 20 },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: '#A3A3A3', letterSpacing: '0.08em' },
  jobInput: { height: 58, borderRadius: 14, border: '1.5px solid', padding: '0 16px', fontSize: 17, fontWeight: 600, fontFamily: 'Switzer, sans-serif', outline: 'none', color: '#0A0A0A', background: '#FAFAFA' },
  openBtn: { height: 58, padding: '0 22px', background: '#1E3FFF', color: '#FFFFFF', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', WebkitTapHighlightColor: 'transparent', flexShrink: 0 },
  recentRow: { display: 'flex', alignItems: 'center', gap: 14, padding: '15px 16px', background: '#FAFAFA', border: '1.5px solid #F0F0F0', borderRadius: 14, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' },
  alertStrip: { display: 'flex', alignItems: 'center', gap: 10, padding: '11px 20px', background: '#FEE2E2' },
  emptyState: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '60px 32px' },
  issueCard: { background: '#FFFFFF', borderRadius: 16, border: '1.5px solid #F0F0F0', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 },
  rowAction: { display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 8px', borderRadius: 8, WebkitTapHighlightColor: 'transparent' },
  captureBar: { padding: '16px 20px 36px', borderTop: '1px solid #F0F0F0', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 10 },
  captureBtn: { height: 62, background: '#EEF2FF', border: 'none', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' },
  transcriptBox: { flex: 1, background: '#FAFAFA', borderRadius: 16, padding: 20, minHeight: 180, display: 'flex', alignItems: 'flex-start', border: '1.5px solid #E5E5E5' },
  micBtn: { width: 88, height: 88, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s ease', WebkitTapHighlightColor: 'transparent' },
  card: { background: '#FFFFFF', borderRadius: 16, border: '1.5px solid #E5E5E5', padding: '0 20px' },
  cardLabel: { fontSize: 11, fontWeight: 600, color: '#A3A3A3', letterSpacing: '0.07em', textTransform: 'uppercase' },
  divider: { height: 1, background: '#F0F0F0' },
  editInput: { width: '100%', height: 50, borderRadius: 12, border: '1.5px solid #E5E5E5', padding: '0 14px', fontSize: 16, fontFamily: 'Switzer, sans-serif', outline: 'none', color: '#0A0A0A', boxSizing: 'border-box', background: '#FAFAFA' },
  primaryBtn: { width: '100%', height: 62, background: '#1E3FFF', color: '#FFFFFF', border: 'none', borderRadius: 16, fontSize: 17, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent', transition: 'background 0.2s' },
  ghostBtn: { width: '100%', height: 56, background: '#F5F5F5', color: '#0A0A0A', border: 'none', borderRadius: 16, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent' },
  errorBanner: { background: '#FEE2E2', color: '#DC2626', padding: '12px 20px', fontSize: 14 },
}
