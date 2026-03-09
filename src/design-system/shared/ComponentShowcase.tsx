import React, { ReactNode } from 'react'

interface ShowcaseItem {
  label: string
  tag?: string
  content: ReactNode
}

interface ComponentShowcaseProps {
  items: ShowcaseItem[]
  columns?: number
  fullWidth?: boolean
}

export default function ComponentShowcase({ items, columns, fullWidth }: ComponentShowcaseProps) {
  if (fullWidth) {
    return (
      <>
        {items.map((item, i) => (
          <div key={i} className="ds-component-full">
            <div className="ds-component-full-header">
              <span className="ds-component-full-title">{item.label}</span>
              {item.tag && <span className="ds-component-tag">{item.tag}</span>}
            </div>
            <div className="ds-component-preview">
              {item.content}
            </div>
          </div>
        ))}
      </>
    )
  }

  const gridStyle: React.CSSProperties = columns
    ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
    : {}

  return (
    <div className="ds-component-grid" style={gridStyle}>
      {items.map((item, i) => (
        <div key={i} className="ds-component-card">
          <div className="ds-component-preview">
            {item.content}
          </div>
          <div className="ds-component-label">
            <span className="ds-component-name">{item.label}</span>
            {item.tag && <span className="ds-component-tag">{item.tag}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
