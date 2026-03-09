import React, { useState } from 'react'
import PhoneFrame from '../shared/PhoneFrame'

const searchResults = [
  { name: 'Scaffold Frame 5\' x 6\'8"', type: 'Equipment', resNum: '#10482' },
  { name: 'Scaffold Platform 7\'', type: 'Equipment', resNum: '#10475' },
  { name: 'Scaffold Brace Assembly', type: 'Equipment', resNum: '#10468' },
  { name: 'Scaffolding Safety Net', type: 'Accessory', resNum: '#10471' },
]

const recentSearches = ['frame', 'base plate', 'ledger 7']

export default function SearchScreen() {
  const [activeRecent, setActiveRecent] = useState<number | null>(null)

  return (
    <PhoneFrame title="Search" description="Search interface with recent queries, live results, and result types.">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 568 }}>
        {/* Search Bar */}
        <div style={{ padding: '8px 12px', background: 'var(--av-surface)', borderBottom: '1px solid var(--av-outline-variant)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 12px',
            height: 44,
            background: 'var(--av-surface-2)',
            borderRadius: 'var(--av-radius-full)',
            border: '2px solid var(--av-blue)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--av-blue)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <span style={{ fontSize: 14, color: 'var(--av-on-surface)', fontWeight: 400, flex: 1 }}>scaffold</span>
            <button style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--av-outline)" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Recent Searches */}
        <div style={{ padding: '12px 16px 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--av-on-surface-variant)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
            Recent Searches
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {recentSearches.map((term, i) => (
              <button
                key={i}
                className={`ds-chip${activeRecent === i ? ' selected' : ''}`}
                style={{ height: 26, fontSize: 12, padding: '0 10px', gap: 4 }}
                onClick={() => setActiveRecent(activeRecent === i ? null : i)}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="ds-divider" style={{ margin: '8px 16px' }} />

        {/* Search Results */}
        <div style={{ padding: '4px 16px 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--av-on-surface-variant)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
            Results ({searchResults.length})
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          {searchResults.map((result, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderBottom: '1px solid var(--av-surface-3)',
              cursor: 'pointer',
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--av-radius-md)',
                background: 'var(--av-blue-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--av-blue)" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--av-on-surface)' }}>
                  {result.name.split(/scaffold/i).map((part, j, arr) =>
                    j < arr.length - 1 ? (
                      <React.Fragment key={j}>
                        {part}<span style={{ fontWeight: 700, color: 'var(--av-blue)' }}>scaffold</span>
                      </React.Fragment>
                    ) : (
                      <React.Fragment key={j}>{part}</React.Fragment>
                    )
                  )}
                </div>
                <div style={{ fontSize: 11, color: 'var(--av-on-surface-variant)', marginTop: 2 }}>
                  {result.type} &middot; {result.resNum}
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--av-outline)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          ))}

          {/* End of results */}
          <div style={{ padding: '20px 16px', textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--av-outline)', fontWeight: 500 }}>No more results</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}
