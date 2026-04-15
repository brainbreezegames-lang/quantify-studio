import React, { useState } from 'react'
import ConnectionSettings from './ConnectionSettings'

type FormState = {
  username: string
  password: string
  showPassword: boolean
}

type ValidationErrors = {
  username?: string
  password?: string
  general?: string
}

export default function SignInPage() {
  const [form, setForm] = useState<FormState>({
    username: '',
    password: '',
    showPassword: false,
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showConnection, setShowConnection] = useState(false)
  const [connectionUrl, setConnectionUrl] = useState('mycompany.quantifycloud.com')
  const [isConnected, setIsConnected] = useState(true)

  const validate = (): boolean => {
    const next: ValidationErrors = {}
    if (!form.username.trim()) next.username = 'Username is required'
    if (!form.password.trim()) next.password = 'Password is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      setErrors(prev => ({
        ...prev,
        general: 'Please fill in all required fields.',
      }))
      return
    }
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  const handleChange = (field: 'username' | 'password') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
    }
    if (errors.general) {
      setErrors(prev => { const n = { ...prev }; delete n.general; return n })
    }
  }

  return (
    <div className="flex h-screen w-full bg-white font-sans" data-theme="light">
      {/* Left: Brand Panel */}
      <div className="hidden lg:flex w-[480px] shrink-0 flex-col items-center justify-center bg-[#0A3EFF]">
        <img src="/quantify-logo.svg" alt="Quantify" className="w-[100px] h-[100px]" />
        <h1 className="mt-5 text-[24px] text-white" style={{ fontWeight: 600 }}>
          Quantify
        </h1>
        <p className="mt-1 text-[14px] text-white/60">
          Scaffolding Management
        </p>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col">
        {/* Main form area */}
        <div className="flex-1 flex items-center justify-center px-6">
          <form onSubmit={handleSignIn} className="w-full max-w-[380px]">
            {/* Mobile logo */}
            <div className="lg:hidden flex flex-col items-center mb-10">
              <div className="w-[72px] h-[72px] bg-[#0A3EFF] flex items-center justify-center">
                <img src="/quantify-logo.svg" alt="Quantify" className="w-[56px] h-[56px]" />
              </div>
              <h1 className="mt-3 text-[22px] text-[#111]" style={{ fontWeight: 600 }}>
                Quantify
              </h1>
            </div>

            <h2 className="text-[22px] text-[#111]" style={{ fontWeight: 500 }}>
              Sign in
            </h2>
            <p className="mt-1 mb-8 text-[14px] text-[#555]">
              Enter your credentials to continue
            </p>

            {/* Error banner */}
            {errors.general && (
              <div className="mb-6 px-4 py-3 border border-[#D32F2F] bg-[#FEF2F2]">
                <p className="text-[#D32F2F] text-[15px]" style={{ fontWeight: 600 }}>
                  Sign in failed
                </p>
                <p className="text-[#D32F2F] text-[13px] mt-0.5">
                  {errors.general}
                </p>
              </div>
            )}

            {/* Username */}
            <div className="mb-5">
              <input
                type="text"
                value={form.username}
                onChange={handleChange('username')}
                placeholder="Username"
                className="w-full h-[52px] px-4 text-[16px] text-[#111] placeholder-[#878787] border outline-none transition-colors"
                style={{
                  borderColor: errors.username ? '#D32F2F' : '#B5B5B5',
                  fontWeight: 500,
                }}
                onFocus={e => {
                  if (!errors.username) e.currentTarget.style.borderColor = '#0A3EFF'
                }}
                onBlur={e => {
                  if (!errors.username) e.currentTarget.style.borderColor = '#B5B5B5'
                }}
              />
              {errors.username && (
                <p className="text-[#D32F2F] text-[13px] mt-1.5" style={{ fontWeight: 500 }}>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type={form.showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="Password"
                  className="w-full h-[52px] pl-4 pr-12 text-[16px] text-[#111] placeholder-[#878787] border outline-none transition-colors"
                  style={{
                    borderColor: errors.password ? '#D32F2F' : '#B5B5B5',
                    fontWeight: 500,
                  }}
                  onFocus={e => {
                    if (!errors.password) e.currentTarget.style.borderColor = '#0A3EFF'
                  }}
                  onBlur={e => {
                    if (!errors.password) e.currentTarget.style.borderColor = '#B5B5B5'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, showPassword: !p.showPassword }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#878787] hover:text-[#555] transition-colors"
                >
                  {form.showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[#D32F2F] text-[13px] mt-1.5" style={{ fontWeight: 500 }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mb-8">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-[44px] text-white text-[14px] tracking-[0.1px] transition-colors disabled:opacity-60"
                style={{ fontWeight: 500, background: '#0A3EFF' }}
                onMouseOver={e => { if (!isLoading) (e.currentTarget.style.background = '#0835D4') }}
                onMouseOut={e => { e.currentTarget.style.background = '#0A3EFF' }}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-[#E2E2E2]" />
              <span className="text-[#878787] text-[13px]">or</span>
              <div className="flex-1 h-px bg-[#E2E2E2]" />
            </div>

            {/* Microsoft SSO */}
            <button
              type="button"
              className="w-full h-[44px] flex items-center justify-center gap-3 border border-[#B5B5B5] text-[#111] text-[14px] hover:bg-[#FAFAFA] transition-colors"
              style={{ fontWeight: 500 }}
            >
              <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
              Sign in with Microsoft
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E2E2]">
          <div className="flex items-center gap-2">
            <div
              className="w-[6px] h-[6px] rounded-full"
              style={{ background: isConnected ? '#22C55E' : '#D32F2F' }}
            />
            <span className="text-[#555] text-[13px]">
              {isConnected ? connectionUrl : 'Not connected'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowConnection(true)}
            className="text-[#0A3EFF] text-[13px] hover:underline"
            style={{ fontWeight: 500 }}
          >
            Connection settings
          </button>
        </div>
      </div>

      {/* Connection Settings Modal */}
      {showConnection && (
        <ConnectionSettings
          url={connectionUrl}
          onUrlChange={setConnectionUrl}
          isConnected={isConnected}
          onConnectionChange={setIsConnected}
          onClose={() => setShowConnection(false)}
        />
      )}
    </div>
  )
}
