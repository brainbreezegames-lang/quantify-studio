import { BookOpen, HelpCircle, MoonStar, Plus, Settings, Sparkles, SunMedium } from 'lucide-react'
import type { ThemeMode } from '../types'

interface HeaderProps {
  themeMode: ThemeMode
  onToggleTheme: () => void
  onOpenSettings: () => void
  onNewDesign: () => void
  onShowTutorial: () => void
}

export default function Header({ themeMode, onToggleTheme, onOpenSettings, onNewDesign, onShowTutorial }: HeaderProps) {
  const isDark = themeMode === 'dark'

  const iconBtn = "p-1.5 rounded-md text-studio-text-dim hover:text-studio-text hover:bg-studio-surface-3 transition-colors flex items-center justify-center"

  return (
    <header className="h-11 bg-studio-surface border-b border-studio-border flex items-center justify-between px-4 flex-shrink-0">
      <div id="tutorial-welcome" className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-studio-accent/90 flex items-center justify-center" aria-hidden="true">
          <Sparkles size={13} className="text-white" />
        </div>
        <span className="text-studio-text font-medium text-[13px] tracking-tight">Uno Studio</span>
        <span className="text-[9px] text-studio-text-dim bg-studio-surface-3 px-1.5 py-px rounded font-mono uppercase tracking-wide">Avontus</span>
      </div>
      <nav className="flex items-center gap-1" aria-label="App actions">
        <button
          onClick={onNewDesign}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-studio-accent hover:bg-studio-accent/10 transition-colors"
          aria-label="Start a new design"
        >
          <Plus size={12} strokeWidth={2.5} aria-hidden="true" />
          <span>New</span>
        </button>
        <div className="w-px h-3.5 bg-studio-border mx-1" />
        <a
          href="/design-system"
          target="_blank"
          rel="noopener noreferrer"
          className={iconBtn}
          aria-label="Design system"
          title="Design system"
        >
          <BookOpen size={14} aria-hidden="true" />
        </a>
        <button
          onClick={onToggleTheme}
          className={iconBtn}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <SunMedium size={14} aria-hidden="true" /> : <MoonStar size={14} aria-hidden="true" />}
        </button>
        <button
          onClick={onOpenSettings}
          className={iconBtn}
          aria-label="Design settings"
          title="Settings"
        >
          <Settings size={14} aria-hidden="true" />
        </button>
        <button
          onClick={onShowTutorial}
          className={iconBtn}
          aria-label="Show tutorial"
          title="Quick tour"
        >
          <HelpCircle size={14} aria-hidden="true" />
        </button>
      </nav>
    </header>
  )
}
