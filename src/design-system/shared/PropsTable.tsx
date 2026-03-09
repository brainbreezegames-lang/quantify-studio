import React, { useState } from 'react'

interface PropDef {
  name: string
  type: string
  default?: string
  description: string
}

interface PropsTableProps {
  componentName: string
  props: PropDef[]
}

export default function PropsTable({ componentName, props }: PropsTableProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="ds-props-collapse" data-expanded={expanded}>
      <button
        className="ds-props-toggle"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <svg
          className="ds-props-chevron"
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="ds-props-toggle-label">XAML Properties</span>
        <span className="ds-props-toggle-count">{props.length}</span>
      </button>

      {expanded && (
        <div className="ds-props-body">
          <table className="ds-token-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {props.map((prop, i) => (
                <tr key={i}>
                  <td className="token-name">{prop.name}</td>
                  <td className="token-value">{prop.type}</td>
                  <td className="token-value">{prop.default ?? '—'}</td>
                  <td>{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
