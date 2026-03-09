import React from 'react'

interface SectionHeaderProps {
  label: string
  title: string
  description: string
}

export default function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <div className="ds-section-header">
      <div className="ds-section-label">{label}</div>
      <h2 className="ds-section-title">{title}</h2>
      <p className="ds-section-desc">{description}</p>
    </div>
  )
}
