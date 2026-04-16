import React, { useState, useRef, useCallback } from 'react'
import { Camera, Mic, ArrowLeft, AlertTriangle, CheckCircle, Clipboard, RefreshCw, RotateCcw } from 'lucide-react'

type View = 'home' | 'photo-preview' | 'voice-recording' | 'analyzing' | 'result'

interface FieldReport {
  item: string | null
  issueType: 'Damage' | 'Missing' | 'Defect' | 'Wear' | 'Other'
  severity: 'High' | 'Medium' | 'Low'
  description: string
  action: string
}

const SEVERITY = {
  High:   { bg: '#FEE2E2', text: '#DC2626', label: 'HIGH SEVERITY' },
  Medium: { bg: '#FEF3C7', text: '#B45309', label: 'MEDIUM SEVERITY' },
  Low:    { bg: '#DCFCE7', text: '#166534', label: 'LOW SEVERITY' },
}

// Compress photo to ≤ 800px wide JPEG before sending
function compressImage(dataUrl: string, maxWidth = 800, quality = 0.82): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.src = dataUrl
  })
}

export default function FieldDocApp() {
  const [view, setView] = useState<View>('home')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [report, setReport] = useState<FieldReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const recogRef = useRef<any>(null)

  // ── Photo capture ──────────────────────────────────────────────────────────
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const raw = ev.target?.result as string
      const compressed = await compressImage(raw)
      setCapturedImage(compressed)
      setView('photo-preview')
    }
    reader.readAsDataURL(file)
    // Reset input so same photo can be retaken
    e.target.value = ''
  }, [])

  const analyzePhoto = useCallback(async () => {
    if (!capturedImage) return
    setView('analyzing')
    setError(null)
    try {
      const apiKey = localStorage.getItem('openrouter_api_key') || ''
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'field-doc', imageBase64: capturedImage, openRouterApiKey: apiKey }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setReport(data.report)
      setView('result')
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Try again.')
      setView('photo-preview')
    }
  }, [capturedImage])

  // ── Voice recording ────────────────────────────────────────────────────────
  const startRecording = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      setError('Voice not supported in this browser. Use Chrome or Safari.')
      return
    }
    const r = new SR()
    r.continuous = false
    r.interimResults = true
    r.lang = 'en-US'
    r.onresult = (ev: any) => {
      let final = '', inter = ''
      for (const result of ev.results) {
        if (result.isFinal) final += result[0].transcript + ' '
        else inter += result[0].transcript
      }
      if (final.trim()) setTranscript(p => (p + ' ' + final).trim())
      setInterim(inter)
    }
    r.onend = () => { setIsRecording(false); setInterim(''); recogRef.current = null }
    r.onerror = () => { setIsRecording(false); setInterim(''); recogRef.current = null }
    recogRef.current = r
    r.start()
    setIsRecording(true)
  }, [])

  const stopRecording = useCallback(() => {
    recogRef.current?.stop()
    setIsRecording(false)
  }, [])

  const analyzeTranscript = useCallback(async () => {
    const text = transcript.trim()
    if (!text) return
    setView('analyzing')
    setError(null)
    try {
      const apiKey = localStorage.getItem('openrouter_api_key') || ''
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'field-doc', transcript: text, openRouterApiKey: apiKey }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setReport(data.report)
      setView('result')
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Try again.')
      setView('voice-recording')
    }
  }, [transcript])

  // ── Utilities ──────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setView('home')
    setCapturedImage(null)
    setTranscript('')
    setInterim('')
    setIsRecording(false)
    setReport(null)
    setError(null)
    setCopied(false)
    recogRef.current?.stop()
    recogRef.current = null
  }, [])

  const copyReport = useCallback(() => {
    if (!report) return
    const lines = [
      report.item ? `Item: ${report.item}` : 'Item: Unknown',
      `Issue: ${report.issueType}`,
      `Severity: ${report.severity}`,
      `Description: ${report.description}`,
      `Action: ${report.action}`,
    ]
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [report])

  // ── Render ─────────────────────────────────────────────────────────────────

  if (view === 'home') return (
    <div style={s.screen}>
      <div style={s.topBar}>
        <span style={s.brand}>QUANTIFY</span>
        <span style={s.brandSub}>Field Doc</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 20px 32px' }}>
        {error && <div style={s.errorBanner}>{error}</div>}

        <button style={{ ...s.bigCard, flex: 1 }} onClick={() => fileInputRef.current?.click()}>
          <div style={{ ...s.iconRing, background: '#EEF2FF' }}>
            <Camera size={34} color="#1E3FFF" strokeWidth={1.75} />
          </div>
          <span style={s.bigCardTitle}>Take a photo</span>
          <span style={s.bigCardSub}>Point at the damaged equipment</span>
        </button>

        <button
          style={{ ...s.bigCard, flex: 1 }}
          onClick={() => { setError(null); setTranscript(''); setInterim(''); setView('voice-recording') }}
        >
          <div style={{ ...s.iconRing, background: '#FEF3C7' }}>
            <Mic size={34} color="#D97706" strokeWidth={1.75} />
          </div>
          <span style={s.bigCardTitle}>Speak a note</span>
          <span style={s.bigCardSub}>Describe the issue out loud</span>
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
        style={{ display: 'none' }} onChange={handleFileChange} />
    </div>
  )

  if (view === 'photo-preview') return (
    <div style={s.screen}>
      <div style={s.navBar}>
        <button style={s.backBtn} onClick={reset}><ArrowLeft size={22} color="#0A0A0A" /></button>
        <span style={s.navTitle}>Review photo</span>
        <div style={{ width: 40 }} />
      </div>

      {error && <div style={{ ...s.errorBanner, margin: '12px 20px 0' }}>{error}</div>}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 20px 0', gap: 16 }}>
        <div style={s.photoFrame}>
          <img src={capturedImage!} alt="Captured"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
        </div>
      </div>

      <div style={{ padding: '16px 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button style={s.primaryBtn} onClick={analyzePhoto}>Analyze damage</button>
        <button style={s.ghostBtn} onClick={() => fileInputRef.current?.click()}>
          <RotateCcw size={16} color="#525252" style={{ marginRight: 8 }} />Retake photo
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
        style={{ display: 'none' }} onChange={handleFileChange} />
    </div>
  )

  if (view === 'voice-recording') {
    const hasText = transcript.trim().length > 0
    return (
      <div style={s.screen}>
        <div style={s.navBar}>
          <button style={s.backBtn} onClick={reset}><ArrowLeft size={22} color="#0A0A0A" /></button>
          <span style={s.navTitle}>Speak a note</span>
          <div style={{ width: 40 }} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 20px 0', gap: 16 }}>
          <div style={s.transcriptBox}>
            {!hasText && !isRecording && !interim ? (
              <span style={{ color: '#A3A3A3', fontSize: 16, lineHeight: 1.5 }}>
                Tap the mic and describe the issue...
              </span>
            ) : (
              <span style={{ fontSize: 18, color: '#0A0A0A', lineHeight: 1.6 }}>
                {transcript}
                {interim && <span style={{ color: '#A3A3A3' }}>{(transcript ? ' ' : '') + interim}</span>}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 8 }}>
            <button
              style={{
                ...s.micBtn,
                background: isRecording ? '#DC2626' : '#1E3FFF',
                boxShadow: isRecording ? '0 0 0 12px rgba(220,38,38,0.15)' : '0 0 0 12px rgba(30,63,255,0.1)',
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
            <button style={s.primaryBtn} onClick={analyzeTranscript}>Structure this note</button>
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

  if (view === 'analyzing') return (
    <div style={{ ...s.screen, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div className="animate-spin" style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '3px solid #E5E7EB', borderTopColor: '#1E3FFF',
      }} />
      <span style={{ fontSize: 15, color: '#737373', fontFamily: 'Switzer, sans-serif' }}>Analyzing…</span>
    </div>
  )

  if (view === 'result' && report) {
    const sev = SEVERITY[report.severity]
    return (
      <div style={{ ...s.screen, background: '#F5F5F5' }}>
        <div style={s.navBar}>
          <button style={s.backBtn} onClick={reset}><ArrowLeft size={22} color="#0A0A0A" /></button>
          <span style={s.navTitle}>Issue report</span>
          <div style={{ width: 40 }} />
        </div>

        <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          {/* Severity banner */}
          <div style={{ ...s.sevBanner, background: sev.bg }}>
            <AlertTriangle size={18} color={sev.text} strokeWidth={2} />
            <span style={{ fontSize: 13, fontWeight: 700, color: sev.text, letterSpacing: '0.05em' }}>
              {sev.label}
            </span>
          </div>

          {/* Main card */}
          <div style={s.resultCard}>
            {report.item && <>
              <div style={s.resultRow}>
                <span style={s.rowLabel}>ITEM</span>
                <span style={s.rowValue}>{report.item}</span>
              </div>
              <div style={s.divider} />
            </>}
            <div style={s.resultRow}>
              <span style={s.rowLabel}>ISSUE TYPE</span>
              <span style={s.rowValue}>{report.issueType}</span>
            </div>
            <div style={s.divider} />
            <div style={{ padding: '16px 0' }}>
              <span style={{ ...s.rowLabel, display: 'block', marginBottom: 8 }}>DESCRIPTION</span>
              <span style={{ fontSize: 15, color: '#0A0A0A', lineHeight: 1.65 }}>{report.description}</span>
            </div>
            <div style={s.divider} />
            <div style={{ padding: '16px 0' }}>
              <span style={{ ...s.rowLabel, display: 'block', marginBottom: 8 }}>RECOMMENDED ACTION</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1E3FFF' }}>{report.action}</span>
            </div>
          </div>

          {capturedImage && (
            <div style={{ borderRadius: 14, overflow: 'hidden', height: 180 }}>
              <img src={capturedImage} alt="Evidence"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={s.primaryBtn} onClick={copyReport}>
            {copied
              ? <><CheckCircle size={18} color="#fff" style={{ marginRight: 8 }} />Copied!</>
              : <><Clipboard size={18} color="#fff" style={{ marginRight: 8 }} />Copy report</>}
          </button>
          <button style={s.ghostBtn} onClick={reset}>
            <RefreshCw size={16} color="#525252" style={{ marginRight: 8 }} />New report
          </button>
        </div>
      </div>
    )
  }

  return null
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  screen: {
    display: 'flex', flexDirection: 'column',
    minHeight: '100dvh', maxWidth: 430, margin: '0 auto',
    background: '#FFFFFF', fontFamily: 'Switzer, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  topBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 20px', background: '#1E3FFF',
  },
  brand: { fontSize: 13, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.1em' },
  brandSub: { fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.65)' },
  navBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px', borderBottom: '1px solid #F0F0F0',
  },
  backBtn: {
    width: 40, height: 40, border: 'none', background: 'transparent',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 10, WebkitTapHighlightColor: 'transparent',
  },
  navTitle: { fontSize: 16, fontWeight: 600, color: '#0A0A0A' },
  bigCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 14, background: '#FFFFFF', border: '1.5px solid #E5E5E5', borderRadius: 20,
    cursor: 'pointer', padding: '28px 20px',
    WebkitTapHighlightColor: 'transparent',
  },
  iconRing: {
    width: 76, height: 76, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  bigCardTitle: { fontSize: 19, fontWeight: 700, color: '#0A0A0A' },
  bigCardSub: { fontSize: 14, color: '#737373' },
  photoFrame: {
    flex: 1, borderRadius: 16, overflow: 'hidden',
    background: '#F5F5F5', minHeight: 280,
  },
  transcriptBox: {
    flex: 1, background: '#FAFAFA', borderRadius: 16, padding: 20,
    minHeight: 180, display: 'flex', alignItems: 'flex-start',
    border: '1.5px solid #E5E5E5',
  },
  micBtn: {
    width: 88, height: 88, borderRadius: '50%', border: 'none',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.18s ease', WebkitTapHighlightColor: 'transparent',
  },
  sevBanner: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '13px 16px', borderRadius: 14,
  },
  resultCard: {
    background: '#FFFFFF', borderRadius: 16,
    border: '1.5px solid #E5E5E5', padding: '0 20px',
  },
  resultRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0',
  },
  rowLabel: { fontSize: 11, fontWeight: 600, color: '#A3A3A3', letterSpacing: '0.07em', textTransform: 'uppercase' },
  rowValue: { fontSize: 15, fontWeight: 600, color: '#0A0A0A' },
  divider: { height: 1, background: '#F0F0F0' },
  primaryBtn: {
    width: '100%', height: 60, background: '#1E3FFF', color: '#FFFFFF',
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
    padding: '12px 16px', borderRadius: 12, fontSize: 14,
  },
}
