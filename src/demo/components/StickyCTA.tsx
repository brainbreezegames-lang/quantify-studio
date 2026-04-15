import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'destructive'
  accentColor?: string
  disabled?: boolean
  loading?: boolean
  icon?: ReactNode
  onClick?: () => void
  secondary?: {
    label: string
    onClick: () => void
  }
}

export default function StickyCTA({
  children,
  variant = 'primary',
  accentColor = '#1E3FFF',
  disabled = false,
  loading = false,
  icon,
  onClick,
  secondary,
}: Props) {
  const bg =
    variant === 'destructive' ? '#DC2626' :
    variant === 'secondary' ? '#FFFFFF' :
    accentColor

  const color = variant === 'secondary' ? accentColor : '#FFFFFF'
  const border = variant === 'secondary' ? `1.5px solid ${accentColor}` : 'none'

  return (
    <div
      className="sticky bottom-0 left-0 right-0 mt-auto px-4 pt-3 pb-5 bg-white border-t border-[#EAEAEA] z-10"
      style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
    >
      {secondary && (
        <button
          onClick={secondary.onClick}
          className="w-full h-11 rounded-xl text-[#525252] text-sm font-semibold no-select pressable mb-2"
        >
          {secondary.label}
        </button>
      )}
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className="relative w-full h-[52px] rounded-2xl text-[15px] font-semibold no-select flex items-center justify-center gap-2 overflow-hidden transition-all"
        style={{
          backgroundColor: bg,
          color,
          border,
          opacity: disabled ? 0.4 : 1,
          transform: loading ? 'none' : undefined,
          boxShadow: variant === 'primary' && !disabled
            ? `0 4px 14px ${accentColor}40`
            : 'none',
        }}
      >
        {!loading && !disabled && (
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 50%)',
            }}
          />
        )}
        {loading ? (
          <div className="flex items-center gap-2">
            <Spinner color={color} />
            <span>Submitting…</span>
          </div>
        ) : (
          <>
            {children}
            {icon}
          </>
        )}
      </button>
    </div>
  )
}

function Spinner({ color }: { color: string }) {
  return (
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeOpacity="0.25" strokeWidth="2.5" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
