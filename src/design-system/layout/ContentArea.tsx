import React, { useEffect, useRef, ReactNode } from 'react'
import { NAV_GROUPS } from '../data/navigation'

interface ContentAreaProps {
  children: ReactNode
  onSectionChange: (sectionId: string) => void
}

export default function ContentArea({ children, onSectionChange }: ContentAreaProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const lastReportedRef = useRef<string>('')

  useEffect(() => {
    const sectionIds = NAV_GROUPS.flatMap(g => g.items.map(i => i.id))

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section (closest to viewport top)
        let best: IntersectionObserverEntry | null = null

        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (!best || entry.boundingClientRect.top < best.boundingClientRect.top) {
            best = entry
          }
        }

        if (best && best.target.id !== lastReportedRef.current) {
          lastReportedRef.current = best.target.id
          onSectionChange(best.target.id)
        }
      },
      {
        // Only consider the top 40% of the viewport for scroll-spy
        rootMargin: '-64px 0px -60% 0px',
        threshold: 0,
      }
    )

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [onSectionChange])

  return (
    <main ref={contentRef} className="ds-main" id="main-content">
      {children}
    </main>
  )
}
