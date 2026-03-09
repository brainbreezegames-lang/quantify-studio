import React, { ReactNode } from 'react'

interface DoDontItem {
  type: 'do' | 'dont'
  content: ReactNode
  caption: string
}

interface DoDontGridProps {
  items: DoDontItem[]
}

export default function DoDontGrid({ items }: DoDontGridProps) {
  return (
    <div className="ds-dodont-grid">
      {items.map((item, i) => {
        const isDo = item.type === 'do'

        return (
          <div key={i} className={`ds-dodont-card ${isDo ? 'do' : 'dont'}`}>
            <div className="ds-dodont-preview">
              {item.content}
            </div>
            <div className="ds-dodont-bar" />
            <div className="ds-dodont-caption">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="ds-dodont-icon">
                {isDo ? (
                  <path
                    d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm3.7 5.3a.75.75 0 0 0-1.06 0L9 10.94 7.36 9.3a.75.75 0 1 0-1.06 1.06l2.17 2.17a.75.75 0 0 0 1.06 0l4.17-4.17a.75.75 0 0 0 0-1.06Z"
                    fill="currentColor"
                  />
                ) : (
                  <path
                    d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm2.83 5.17a.75.75 0 0 0-1.06 0L10 8.94 8.23 7.17a.75.75 0 1 0-1.06 1.06L8.94 10l-1.77 1.77a.75.75 0 1 0 1.06 1.06L10 11.06l1.77 1.77a.75.75 0 1 0 1.06-1.06L11.06 10l1.77-1.77a.75.75 0 0 0 0-1.06Z"
                    fill="currentColor"
                  />
                )}
              </svg>
              <div>
                <div className="ds-dodont-label">{isDo ? 'Do' : "Don't"}</div>
                <div className="ds-dodont-text">{item.caption}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
