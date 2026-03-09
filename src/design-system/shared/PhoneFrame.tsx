import React, { ReactNode } from 'react'

interface PhoneFrameProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function PhoneFrame({ children, title, description }: PhoneFrameProps) {
  const phone = (
    <div className="ds-phone-frame">
      <div className="ds-phone-status-bar">9:41</div>
      <div className="ds-phone-content">
        {children}
      </div>
    </div>
  )

  if (title || description) {
    return (
      <div className="ds-phone-wrapper">
        {phone}
        <div className="ds-phone-info">
          {title && <div className="ds-phone-title">{title}</div>}
          {description && <div className="ds-phone-desc">{description}</div>}
        </div>
      </div>
    )
  }

  return phone
}
