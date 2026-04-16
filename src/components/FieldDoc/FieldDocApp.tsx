import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  Camera, Mic, ArrowLeft, AlertTriangle, CheckCircle,
  Share2, Trash2, ChevronRight, Plus, RotateCcw,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
type View = 'home' | 'job' | 'photo-preview' | 'voice-recording' | 'analyzing' | 'confirm' | 'summary'
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

// ── Constants ──────────────────────────────────────────────────────────────────
const SEV = {
  High:   { dot: '#DC2626', bg: '#FEE2E2', text: '#DC2626',  label: 'HIGH'   },
  Medium: { dot: '#F59E0B', bg: '#FEF3C7', text: '#B45309',  label: 'MEDIUM' },
  Low:    { dot: '#16A34A', bg: '#DCFCE7', text: '#166534',  label: 'LOW'    },
}

// ── Utilities ──────────────────────────────────────────────────────────────────
function loadJobs(): Job[] {
  try { return JSON.parse(localStorage.getItem('field-doc-jobs') || '[]') }
  catch { return [] }
}
function saveJobs(jobs: Job[]) {
  try { localStorage.setItem('field-doc-jobs', JSON.stringify(jobs.slice(0, 20))) }
  catch { /* ignore */ }
}

function parseJobId(raw: string): { type: 'DEL' | 'RET'; number: string; id: string } | null {
  const s = raw.trim().toUpperCase().replace(/\s/g, '')
  const m = s.match(/^(DEL|RET)-?(\d+)$/)
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

function buildShareText(job: Job): string {
  const date = new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const emoji = (s: Severity) => s === 'High' ? '🔴' : s === 'Medium' ? '🟡' : '🟢'
  let t = `QUANTIFY FIELD REPORT\n${job.id} · ${date}\n${job.issues.length} issue${job.issues.length !== 1 ? 's' : ''} documented\n`
  job.issues.forEach((iss, i) => {
    t += `\n${i + 1}. ${emoji(iss.severity)} ${iss.severity.toUpperCase()} — ${iss.item || 'Unknown item'}\n`
    t += `${iss.description}\n→ ${iss.action}\n`
  })
  t += `\nDocumented via Quantify Field Doc`
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
  const [error, setError] = useState<string | null>(null)
  const [shared, setShared] = useState(false)

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
    setJobInput('')
    setJobInputError('')
    setView('job')
  }, [])

  // ── Capture ────────────────────────────────────────────────────────────────
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async ev => {
      setCapturedImage(await compressImage(ev.target?.result as string))
      setView('photo-preview')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [])

  const runAnalysis = useCallback(async (payload: { imageBase64?: string; transcript?: string }) => {
    setView('analyzing')
    setError(null)
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
      setEditItem(r.item || '')
      setEditSeverity(r.severity)
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
    setPendingReport(null); setCapturedImage(null); setTranscript('')
    setView('job')
  }, [pendingReport, editItem, editSeverity, currentJobId])

  const discardIssue = useCallback(() => {
    setPendingReport(null); setCapturedImage(null); setTranscript('')
    setView('job')
  }, [])

  const deleteIssue = useCallback((issueId: string) => {
    setJobs(prev => prev.map(j =>
      j.id === currentJobId ? { ...j, issues: j.issues.filter(i => i.id !== issueId) } : j
    ))
  }, [currentJobId])

  // ── Share ──────────────────────────────────────────────────────────────────
  const shareReport = useCallback(() => {
    if (!currentJob) return
    const text = buildShareText(currentJob)
    if (navigator.share) {
      navigator.share({ title: `${currentJob.id} Field Report`, text }).catch(() => navigator.clipboard.writeText(text))
    } else {
      navigator.clipboard.writeText(text)
      setShared(true); setTimeout(() => setShared(false), 2000)
    }
  }, [currentJob])

  // ── Nav ────────────────────────────────────────────────────────────────────
  const goHome = useCallback(() => {
    recogRef.current?.stop()
    setView('home'); setCurrentJobId(null); setCapturedImage(null)
    setTranscript(''); setError(null)
  }, [])

  const goToJob = useCallback(() => {
    setCapturedImage(null); setTranscript(''); setError(null)
    setView('job')
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
              autoCapitalize="characters"
              autoComplete="off"
            />
            <button style={s.openBtn} onClick={() => openJob(jobInput)}>Open</button>
          </div>
          {jobInputError && <span style={{ fontSize: 13, color: '#DC2626' }}>{jobInputError}</span>}
        </div>

        {jobs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={s.sectionLabel}>RECENT</span>
            {jobs.slice(0, 5).map(job => {
              const topSev: Severity = job.issues.reduce<Severity>((m, i) => {
                if (i.severity === 'High') return 'High'
                if (i.severity === 'Medium' && m !== 'High') return 'Medium'
                return m
              }, 'Low')
              const dot = job.issues.length > 0 ? SEV[topSev].dot : '#D4D4D4'
              return (
                <button
                  key={job.id} style={s.recentRow}
                  onClick={() => { setCurrentJobId(job.id); setView('job') }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A' }}>{job.id}</span>
                    <span style={{ fontSize: 13, color: '#737373', marginLeft: 10 }}>
                      {job.issues.length === 0
                        ? 'No issues'
                        : `${job.issues.length} issue${job.issues.length !== 1 ? 's' : ''}`}
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
              {currentJob.type === 'DEL' ? 'Delivery' : 'Return'} ·{' '}
              {currentJob.issues.length === 0 ? 'No issues' : `${currentJob.issues.length} issue${currentJob.issues.length !== 1 ? 's' : ''}`}
            </div>
          </div>
          {currentJob.issues.length > 0
            ? <button style={s.topBarAction} onClick={() => setView('summary')}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Report</span>
              </button>
            : <div style={{ width: 64 }} />
          }
        </div>

        {highCount > 0 && (
          <div style={s.alertStrip}>
            <AlertTriangle size={16} color="#DC2626" strokeWidth={2} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#DC2626' }}>
              {highCount} high-severity issue{highCount !== 1 ? 's' : ''} — review before proceeding
            </span>
          </div>
        )}

        <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {currentJob.issues.length === 0 ? (
            <div style={s.emptyState}>
              <Camera size={40} color="#D4D4D4" strokeWidth={1.5} />
              <span style={{ fontSize: 17, color: '#A3A3A3', fontWeight: 600 }}>No issues logged</span>
              <span style={{ fontSize: 14, color: '#C4C4C4', textAlign: 'center', lineHeight: 1.5 }}>
                Use the buttons below to document a damage, defect, or missing item
              </span>
            </div>
          ) : (
            currentJob.issues.map(issue => (
              <div key={issue.id} style={s.issueCard}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: SEV[issue.severity].bg, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: SEV[issue.severity].dot }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#0A0A0A' }}>
                        {issue.item || 'Unknown item'}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: SEV[issue.severity].text, letterSpacing: '0.05em' }}>
                      {SEV[issue.severity].label} · {issue.issueType}
                    </span>
                    <div style={{ fontSize: 13, color: '#525252', lineHeight: 1.55, marginTop: 6 }}>
                      {issue.description}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1E3FFF', marginTop: 6 }}>
                      → {issue.action}
                    </div>
                    <div style={{ fontSize: 11, color: '#A3A3A3', marginTop: 6 }}>
                      {timeStr(issue.timestamp)}
                    </div>
                  </div>
                  {issue.photo && (
                    <img src={issue.photo} alt=""
                      style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                  )}
                </div>
                <button style={s.deleteBtn} onClick={() => deleteIssue(issue.id)}>
                  <Trash2 size={14} color="#A3A3A3" />
                  <span style={{ fontSize: 12, color: '#A3A3A3' }}>Remove</span>
                </button>
              </div>
            ))
          )}
        </div>

        <div style={s.captureBar}>
          <span style={s.sectionLabel}>DOCUMENT ISSUE</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ ...s.captureBtn, flex: 1 }} onClick={() => { setError(null); fileInputRef.current?.click() }}>
              <Camera size={22} color="#1E3FFF" strokeWidth={1.75} />
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1E3FFF' }}>Photo</span>
            </button>
            <button
              style={{ ...s.captureBtn, flex: 1 }}
              onClick={() => { setError(null); setTranscript(''); setInterim(''); setView('voice-recording') }}
            >
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
          <img src={capturedImage!} alt="Captured"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
      <div style={{ padding: '16px 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button style={s.primaryBtn} onClick={() => runAnalysis({ imageBase64: capturedImage! })}>
          Analyze damage
        </button>
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
          <span style={s.navTitle}>Speak a note</span>
          <span style={s.navChip}>{currentJob?.id}</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 20px 0', gap: 16 }}>
          <div style={s.transcriptBox}>
            {!hasText && !isRecording && !interim
              ? <span style={{ color: '#A3A3A3', fontSize: 16, lineHeight: 1.5 }}>Tap the mic and describe the issue…</span>
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
          </div>
        </div>
        <div style={{ padding: '16px 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {hasText && !isRecording && (
            <button style={s.primaryBtn} onClick={() => runAnalysis({ transcript: transcript.trim() })}>
              Structure this note
            </button>
          )}
          {hasText && (
            <button style={s.ghostBtn} onClick={() => { setTranscript(''); setInterim('') }}>
              Clear and start over
            </button>
          )}
        </div>
      </div>
    )
  }

  // ANALYZING ─────────────────────────────────────────────────────────────────
  if (view === 'analyzing') return (
    <div style={{ ...s.screen, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div className="animate-spin" style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '3px solid #E5E7EB', borderTopColor: '#1E3FFF',
      }} />
      <span style={{ fontSize: 15, color: '#737373', fontFamily: 'Switzer, sans-serif' }}>Analyzing…</span>
    </div>
  )

  // CONFIRM ───────────────────────────────────────────────────────────────────
  if (view === 'confirm' && pendingReport) {
    return (
      <div style={{ ...s.screen, background: '#F5F5F5' }}>
        <div style={s.navBar}>
          <button style={s.backBtn} onClick={discardIssue}><ArrowLeft size={22} color="#0A0A0A" /></button>
          <span style={s.navTitle}>Confirm issue</span>
          <span style={s.navChip}>{currentJob?.id}</span>
        </div>

        <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Severity */}
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

          {/* Item */}
          <div style={s.card}>
            <span style={{ ...s.cardLabel, display: 'block', marginBottom: 8 }}>ITEM</span>
            <input
              style={s.editInput}
              value={editItem}
              onChange={e => setEditItem(e.target.value)}
              placeholder="Item name (leave blank if unknown)"
            />
          </div>

          {/* Details */}
          <div style={s.card}>
            <div style={{ padding: '16px 0' }}>
              <span style={{ ...s.cardLabel, display: 'block', marginBottom: 6 }}>ISSUE TYPE</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A' }}>{pendingReport.issueType}</span>
            </div>
            <div style={s.divider} />
            <div style={{ padding: '16px 0' }}>
              <span style={{ ...s.cardLabel, display: 'block', marginBottom: 6 }}>DESCRIPTION</span>
              <span style={{ fontSize: 15, color: '#0A0A0A', lineHeight: 1.65 }}>{pendingReport.description}</span>
            </div>
            <div style={s.divider} />
            <div style={{ padding: '16px 0' }}>
              <span style={{ ...s.cardLabel, display: 'block', marginBottom: 6 }}>RECOMMENDED ACTION</span>
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
            <Plus size={20} color="#fff" style={{ marginRight: 8 }} />Add to {currentJob?.id}
          </button>
          <button style={s.ghostBtn} onClick={discardIssue}>Discard</button>
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
          <div style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>{currentJob.id} — Field Report</div>
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
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A', marginBottom: 3 }}>
                  {issue.item || 'Unknown item'}
                </div>
                <div style={{ fontSize: 13, color: '#737373', marginBottom: 10 }}>{issue.issueType}</div>
                <div style={{ fontSize: 14, color: '#0A0A0A', lineHeight: 1.6, marginBottom: 10 }}>{issue.description}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1E3FFF' }}>→ {issue.action}</div>
              </div>
              {issue.photo && (
                <img src={issue.photo} alt=""
                  style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', flexShrink: 0, alignSelf: 'flex-start' }} />
              )}
            </div>
            <div style={{ height: 14 }} />
          </div>
        ))}
      </div>

      <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button style={s.primaryBtn} onClick={shareReport}>
          {shared
            ? <><CheckCircle size={18} color="#fff" style={{ marginRight: 8 }} />Copied to clipboard!</>
            : <><Share2 size={18} color="#fff" style={{ marginRight: 8 }} />Share report</>
          }
        </button>
        <button style={s.ghostBtn} onClick={() => setView('job')}>Back to job</button>
      </div>
    </div>
  )

  return null
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  screen: {
    display: 'flex', flexDirection: 'column', minHeight: '100dvh',
    maxWidth: 430, margin: '0 auto', background: '#FFFFFF',
    fontFamily: 'Switzer, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  topBar: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '14px 16px', background: '#1E3FFF',
  },
  topBarBack: {
    width: 40, height: 40, border: 'none', background: 'rgba(255,255,255,0.15)',
    borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', WebkitTapHighlightColor: 'transparent', flexShrink: 0,
  },
  topBarAction: {
    height: 36, padding: '0 14px', border: '1.5px solid rgba(255,255,255,0.4)',
    borderRadius: 10, background: 'transparent', cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent', flexShrink: 0,
  },
  brand: { fontSize: 13, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.1em', flex: 1 },
  brandRight: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  navBar: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '12px 16px', borderBottom: '1px solid #F0F0F0',
  },
  backBtn: {
    width: 40, height: 40, border: 'none', background: 'transparent', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 10, WebkitTapHighlightColor: 'transparent',
  },
  navTitle: { fontSize: 16, fontWeight: 600, color: '#0A0A0A', flex: 1 },
  navChip: {
    fontSize: 12, fontWeight: 600, color: '#1E3FFF',
    background: '#EEF2FF', padding: '4px 10px', borderRadius: 20,
  },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: '#A3A3A3', letterSpacing: '0.08em' },
  jobInput: {
    height: 58, borderRadius: 14, border: '1.5px solid',
    padding: '0 16px', fontSize: 17, fontWeight: 600,
    fontFamily: 'Switzer, sans-serif', outline: 'none', color: '#0A0A0A',
    background: '#FAFAFA',
  },
  openBtn: {
    height: 58, padding: '0 22px', background: '#1E3FFF', color: '#FFFFFF',
    border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit', WebkitTapHighlightColor: 'transparent',
    flexShrink: 0,
  },
  recentRow: {
    display: 'flex', alignItems: 'center', gap: 14, padding: '15px 16px',
    background: '#FAFAFA', border: '1.5px solid #F0F0F0', borderRadius: 14,
    cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
  },
  alertStrip: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '11px 20px', background: '#FEE2E2',
  },
  emptyState: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 12, padding: '60px 32px',
  },
  issueCard: {
    background: '#FFFFFF', borderRadius: 16, border: '1.5px solid #F0F0F0',
    padding: '16px', display: 'flex', flexDirection: 'column', gap: 10,
  },
  deleteBtn: {
    alignSelf: 'flex-start', border: 'none', background: 'transparent',
    cursor: 'pointer', padding: '2px 0', display: 'flex', alignItems: 'center', gap: 5,
    WebkitTapHighlightColor: 'transparent',
  },
  captureBar: {
    padding: '16px 20px 36px', borderTop: '1px solid #F0F0F0',
    background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 10,
  },
  captureBtn: {
    height: 62, background: '#EEF2FF', border: 'none', borderRadius: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
  },
  transcriptBox: {
    flex: 1, background: '#FAFAFA', borderRadius: 16, padding: 20, minHeight: 180,
    display: 'flex', alignItems: 'flex-start', border: '1.5px solid #E5E5E5',
  },
  micBtn: {
    width: 88, height: 88, borderRadius: '50%', border: 'none',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.18s ease', WebkitTapHighlightColor: 'transparent',
  },
  card: {
    background: '#FFFFFF', borderRadius: 16, border: '1.5px solid #E5E5E5', padding: '0 20px',
  },
  cardLabel: { fontSize: 11, fontWeight: 600, color: '#A3A3A3', letterSpacing: '0.07em', textTransform: 'uppercase' },
  divider: { height: 1, background: '#F0F0F0' },
  editInput: {
    width: '100%', height: 50, borderRadius: 12, border: '1.5px solid #E5E5E5',
    padding: '0 14px', fontSize: 16, fontFamily: 'Switzer, sans-serif',
    outline: 'none', color: '#0A0A0A', boxSizing: 'border-box', background: '#FAFAFA',
  },
  primaryBtn: {
    width: '100%', height: 62, background: '#1E3FFF', color: '#FFFFFF',
    border: 'none', borderRadius: 16, fontSize: 17, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    WebkitTapHighlightColor: 'transparent',
  },
  ghostBtn: {
    width: '100%', height: 56, background: '#F5F5F5', color: '#0A0A0A',
    border: 'none', borderRadius: 16, fontSize: 15, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    WebkitTapHighlightColor: 'transparent',
  },
  errorBanner: {
    background: '#FEE2E2', color: '#DC2626',
    padding: '12px 20px', fontSize: 14,
  },
}
