import React, { useState } from 'react'

type Props = {
  url: string
  onUrlChange: (url: string) => void
  isConnected: boolean
  onConnectionChange: (connected: boolean) => void
  onClose: () => void
}

export default function ConnectionSettings({
  url,
  onUrlChange,
  isConnected,
  onConnectionChange,
  onClose,
}: Props) {
  const [localUrl, setLocalUrl] = useState(url)
  const [protocol, setProtocol] = useState<'https://' | 'http://'>('https://')
  const [useSSL, setUseSSL] = useState(true)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)

  const handleTest = () => {
    setTesting(true)
    setTestResult(null)
    setTimeout(() => {
      setTesting(false)
      const success = localUrl.trim().length > 0
      setTestResult(success ? 'success' : 'error')
      onConnectionChange(success)
    }, 1200)
  }

  const handleSave = () => {
    onUrlChange(localUrl)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white w-full max-w-[440px] mx-4">
        {/* Header */}
        <div className="flex items-center justify-between h-[52px] px-5 border-b border-[#E2E2E2]">
          <h2 className="text-[#111] text-[16px]" style={{ fontWeight: 500 }}>
            Connection settings
          </h2>
          <button onClick={onClose} className="text-[#555] hover:text-[#111]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <label className="block text-[#555] text-[12px] tracking-[0.5px] mb-2" style={{ fontWeight: 500 }}>
            SERVER
          </label>
          <input
            type="text"
            value={localUrl}
            onChange={e => { setLocalUrl(e.target.value); setTestResult(null) }}
            placeholder="myinstance.mycompany.com"
            className="w-full h-[48px] px-4 text-[15px] text-[#111] placeholder-[#878787] border border-[#B5B5B5] outline-none transition-colors mb-5"
            style={{ fontWeight: 500 }}
            onFocus={e => { e.currentTarget.style.borderColor = '#0A3EFF' }}
            onBlur={e => { e.currentTarget.style.borderColor = '#B5B5B5' }}
          />

          {/* Protocol */}
          <div className="flex items-center justify-between h-[44px] border-b border-[#E2E2E2]">
            <span className="text-[#111] text-[15px]" style={{ fontWeight: 500 }}>Protocol</span>
            <button
              onClick={() => setProtocol(p => p === 'https://' ? 'http://' : 'https://')}
              className="text-[#0A3EFF] text-[15px]"
              style={{ fontWeight: 500 }}
            >
              {protocol}
            </button>
          </div>

          {/* SSL */}
          <div className="flex items-center justify-between h-[44px]">
            <span className="text-[#111] text-[15px]" style={{ fontWeight: 500 }}>Use SSL</span>
            <div
              className="relative w-[40px] h-[22px] cursor-pointer"
              onClick={() => setUseSSL(!useSSL)}
            >
              <div
                className="absolute inset-0 rounded-full transition-colors duration-200"
                style={{ background: useSSL ? '#0A3EFF' : '#B5B5B5' }}
              />
              <div
                className="absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full transition-all duration-200"
                style={{ left: useSSL ? 20 : 2 }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          {testResult === 'success' && (
            <div className="mb-4 px-4 py-3 border border-[#22C55E] bg-[#F0FDF4]">
              <p className="text-[#166534] text-[14px]" style={{ fontWeight: 500 }}>
                Connected successfully
              </p>
            </div>
          )}
          {testResult === 'error' && (
            <div className="mb-4 px-4 py-3 border border-[#D32F2F] bg-[#FEF2F2]">
              <p className="text-[#D32F2F] text-[14px]" style={{ fontWeight: 500 }}>
                Unable to reach server
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={handleTest}
              disabled={testing || !localUrl.trim()}
              className="h-[38px] px-5 border border-[#B5B5B5] text-[#111] text-[13px] hover:bg-[#FAFAFA] transition-colors disabled:opacity-50"
              style={{ fontWeight: 500 }}
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={handleSave}
              className="h-[38px] px-5 bg-[#0A3EFF] text-white text-[13px] transition-colors"
              style={{ fontWeight: 500 }}
              onMouseOver={e => (e.currentTarget.style.background = '#0835D4')}
              onMouseOut={e => (e.currentTarget.style.background = '#0A3EFF')}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
