import React, { useState, useEffect, useRef } from 'react'
import { NAV_GROUPS } from '../data/navigation'
import { Icons } from '../shared/Icons'

interface SidebarProps {
  activeSection: string
  onNavigate: (id: string) => void
}

export default function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  // Only expand the first group (Foundations) by default — progressive disclosure
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() =>
    new Set([NAV_GROUPS[0].label])
  )
  const sidebarRef = useRef<HTMLElement>(null)

  const handleClick = (id: string) => {
    onNavigate(id)
    const el = document.getElementById(id)
    if (el) {
      // Scroll main content — offset by TopBar height
      const top = el.getBoundingClientRect().top + window.scrollY - 64
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName]
    return IconComponent ? <IconComponent size={16} /> : null
  }

  // Auto-expand the group containing the active section (scroll-spy driven)
  useEffect(() => {
    const activeGroup = NAV_GROUPS.find(g =>
      g.items.some(item => item.id === activeSection)
    )
    if (activeGroup) {
      setExpandedGroups(prev => {
        if (prev.has(activeGroup.label)) return prev
        return new Set([...prev, activeGroup.label])
      })
    }
  }, [activeSection])

  // Scroll the active nav item into view WITHIN the sidebar only (not the page)
  useEffect(() => {
    const sidebar = sidebarRef.current
    if (!sidebar) return

    // Find the active link inside the sidebar
    const activeEl = sidebar.querySelector('.ds-nav-link.active') as HTMLElement | null
    if (!activeEl) return

    // Calculate if active item is outside the visible area of the sidebar
    const sidebarRect = sidebar.getBoundingClientRect()
    const activeRect = activeEl.getBoundingClientRect()

    const isAbove = activeRect.top < sidebarRect.top + 8
    const isBelow = activeRect.bottom > sidebarRect.bottom - 8

    if (isAbove || isBelow) {
      // Manually adjust sidebar scrollTop — never touches window scroll
      const offset = activeEl.offsetTop - sidebar.offsetTop - sidebar.clientHeight / 2 + activeEl.clientHeight / 2
      sidebar.scrollTo({ top: offset, behavior: 'smooth' })
    }
  }, [activeSection])

  return (
    <nav className="ds-sidebar" ref={sidebarRef} aria-label="Design system navigation">
      {NAV_GROUPS.map(group => {
        const isExpanded = expandedGroups.has(group.label)
        const hasActiveItem = group.items.some(item => item.id === activeSection)

        return (
          <div key={group.label} className="ds-nav-group" data-expanded={isExpanded}>
            <button
              className={`ds-nav-group-label${hasActiveItem && !isExpanded ? ' has-active' : ''}`}
              onClick={() => toggleGroup(group.label)}
              type="button"
            >
              <span>{group.label}</span>
              <svg
                className="ds-nav-group-chevron"
                width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="ds-nav-group-items" style={{
              height: isExpanded ? 'auto' : 0,
              overflow: 'hidden',
              opacity: isExpanded ? 1 : 0,
              transition: 'opacity 200ms ease',
            }}>
              {group.items.map(item => (
                <button
                  key={item.id}
                  className={`ds-nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleClick(item.id)}
                >
                  {getIcon(item.icon)}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </nav>
  )
}
