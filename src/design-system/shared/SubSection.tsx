import React, { ReactNode } from 'react'

interface SubSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export default function SubSection({ title, description, children }: SubSectionProps) {
  return (
    <div className="ds-subsection">
      <h3 className="ds-subsection-title">{title}</h3>
      {description && <p className="ds-subsection-desc">{description}</p>}
      {children}
    </div>
  )
}
