import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

export default function SignInScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <PhoneFrame title="Sign In" description="Authentication entry point with email and password fields.">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 568, padding: '48px 24px 24px', background: 'var(--av-bg)' }}>
        {/* Logo */}
        <div style={{ marginBottom: 8 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="0" fill="var(--av-blue)" />
            <text x="24" y="28" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="500" fontFamily="var(--av-font-primary)">Q</text>
          </svg>
        </div>
        <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--av-blue)', letterSpacing: 3, marginBottom: 4 }}>QUANTIFY</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--av-on-surface)', marginBottom: 32 }}>Sign in to Quantify</div>

        {/* Email Field */}
        <div className="ds-textfield" style={{ maxWidth: '100%', marginBottom: 16 }}>
          <input type="email" defaultValue="john@acmescaffold.com" style={{ height: 48, fontSize: 13, padding: '20px 12px 6px' }} readOnly />
          <label style={{ left: 12, top: 6, fontSize: 11 }}>Email</label>
        </div>

        {/* Password Field */}
        <div className="ds-textfield" style={{ maxWidth: '100%', marginBottom: 12, position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            defaultValue="password123"
            style={{ height: 48, fontSize: 13, padding: '20px 40px 6px 12px' }}
            readOnly
          />
          <label style={{ left: 12, top: 6, fontSize: 11 }}>Password</label>
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--av-outline)" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--av-outline)" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {/* Remember Me Checkbox */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            alignSelf: 'flex-start',
            marginBottom: 20,
            cursor: 'pointer',
          }}
          onClick={() => setRememberMe(!rememberMe)}
        >
          <div style={{
            width: 18,
            height: 18,
            borderRadius: 3,
            border: rememberMe ? 'none' : '2px solid var(--av-outline)',
            background: rememberMe ? 'var(--av-blue)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}>
            {rememberMe && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </div>
          <span style={{ fontSize: 13, color: 'var(--av-on-surface-variant)' }}>Remember me</span>
        </div>

        {/* Sign In Button */}
        <button className="ds-btn ds-btn-filled" style={{ width: '100%', height: 44, fontSize: 14 }}>
          Sign In
        </button>

        {/* Forgot Password */}
        <button className="ds-btn ds-btn-text" style={{ marginTop: 12, fontSize: 13 }}>
          Forgot password?
        </button>

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: 48, fontSize: 11, color: 'var(--av-outline)', textAlign: 'center' }}>
          &copy; 2026 Quantify Software
        </div>
      </div>
    </PhoneFrame>
  )
}
