import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppState } from './store'
import Header from './components/Header'
import PromptPanel from './components/PromptPanel'
import ComponentPalette from './components/ComponentPalette'
import PreviewPanel from './components/PreviewPanel'
import PropertyEditor from './components/PropertyEditor'
import WebDesignEditor from './components/WebDesignEditor'
import XamlPanel from './components/XamlPanel'
import QualityPanel from './components/QualityPanel'
import ImprovementsPanel from './components/ImprovementsPanel'
import OnboardingModal from './components/OnboardingModal'
import TutorialOverlay from './components/TutorialOverlay'
import QuantifyChat from './components/QuantifyChat'
import { WebEditProvider } from './contexts/WebEditContext'

export default function App() {
  const { hasCompletedOnboarding, designTokens, themeMode, improveDecisions, currentWebDesign } = useAppState()
  const dispatch = useAppDispatch()
  const [showSettings, setShowSettings] = useState(false)
  const [showTutorial, setShowTutorial] = useState(() => {
    return localStorage.getItem('uno-studio-tutorial-done') !== 'true'
  })
  const [leftTab, setLeftTab] = useState<'chat' | 'components'>('chat')
  const [rightTab, setRightTab] = useState<'xaml' | 'properties' | 'quality' | 'improvements'>(() => {
    const saved = localStorage.getItem('uno-studio-right-tab')
    if (saved === 'xaml' || saved === 'quality') return saved
    return 'properties'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode)
  }, [themeMode])

  useEffect(() => {
    localStorage.setItem('uno-studio-right-tab', rightTab)
  }, [rightTab])

  // Auto-switch to Improvements tab when new decisions arrive
  useEffect(() => {
    if (improveDecisions && improveDecisions.length > 0) {
      setRightTab('improvements')
    }
  }, [improveDecisions])

  const handleToggleTheme = () => {
    dispatch({ type: 'SET_THEME_MODE', mode: themeMode === 'dark' ? 'light' : 'dark' })
  }

  const handleCompleteTutorial = useCallback(() => {
    localStorage.setItem('uno-studio-tutorial-done', 'true')
    setShowTutorial(false)
  }, [])

  const tabBtn = (active: boolean) =>
    `px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
      active
        ? 'text-studio-text bg-studio-surface-3'
        : 'text-studio-text-dim hover:text-studio-text-muted'
    }`

  return (
    <WebEditProvider>
    <div className="h-screen flex flex-col bg-studio-bg text-studio-text overflow-hidden">
      {!hasCompletedOnboarding && <OnboardingModal initialTokens={designTokens} />}
      {showSettings && hasCompletedOnboarding && (
        <OnboardingModal initialTokens={designTokens} onClose={() => setShowSettings(false)} />
      )}

      <Header
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setShowSettings(true)}
        onNewDesign={() => dispatch({ type: 'CLEAR_SCREEN' })}
        onShowTutorial={() => setShowTutorial(true)}
      />

      {showTutorial && hasCompletedOnboarding && (
        <TutorialOverlay onComplete={handleCompleteTutorial} />
      )}

      <div className="flex-1 flex overflow-hidden" id="main-content">
        {/* Left Panel */}
        <aside className="w-[320px] border-r border-studio-border bg-studio-surface flex flex-col flex-shrink-0" aria-label="Design tools">
          <div className="px-3 py-1 border-b border-studio-border flex items-center gap-0.5" role="tablist" aria-label="Left panel tabs">
            <button
              role="tab"
              aria-selected={leftTab === 'chat'}
              aria-controls="left-tabpanel"
              onClick={() => setLeftTab('chat')}
              className={tabBtn(leftTab === 'chat')}
            >
              Chat
            </button>
            <button
              role="tab"
              aria-selected={leftTab === 'components'}
              aria-controls="left-tabpanel"
              onClick={() => setLeftTab('components')}
              className={tabBtn(leftTab === 'components')}
            >
              Components
            </button>
          </div>
          <div id="left-tabpanel" role="tabpanel" className="flex-1 min-h-0">
            {leftTab === 'chat' ? <PromptPanel /> : <ComponentPalette />}
          </div>
        </aside>

        {/* Center - Preview */}
        <main className="flex-1 flex flex-col min-w-0" aria-label="Design preview">
          <PreviewPanel />
        </main>

        {/* Right Panel */}
        <aside className="w-[320px] border-l border-studio-border bg-studio-surface flex flex-col flex-shrink-0" aria-label="Code and properties">
          <div className="px-3 py-1 border-b border-studio-border flex items-center gap-0.5" role="tablist" aria-label="Right panel tabs">
            <button
              role="tab"
              aria-selected={rightTab === 'xaml'}
              aria-controls="right-tabpanel"
              onClick={() => setRightTab('xaml')}
              className={tabBtn(rightTab === 'xaml')}
            >
              XAML
            </button>
            <button
              role="tab"
              aria-selected={rightTab === 'properties'}
              aria-controls="right-tabpanel"
              onClick={() => setRightTab('properties')}
              className={tabBtn(rightTab === 'properties')}
            >
              Properties
            </button>
            <button
              role="tab"
              aria-selected={rightTab === 'quality'}
              aria-controls="right-tabpanel"
              onClick={() => setRightTab('quality')}
              className={tabBtn(rightTab === 'quality')}
            >
              AI Tuning
            </button>
            {improveDecisions && improveDecisions.length > 0 && (
              <button
                role="tab"
                aria-selected={rightTab === 'improvements'}
                aria-controls="right-tabpanel"
                onClick={() => setRightTab('improvements')}
                className={tabBtn(rightTab === 'improvements') + ' relative'}
              >
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-studio-accent opacity-80" />
                Improved
              </button>
            )}
          </div>
          <div id="right-tabpanel" role="tabpanel" className="flex-1 min-h-0">
            {rightTab === 'xaml' ? <XamlPanel /> : rightTab === 'quality' ? <QualityPanel /> : rightTab === 'improvements' ? <ImprovementsPanel /> : currentWebDesign?.html ? <WebDesignEditor /> : <PropertyEditor />}
          </div>
        </aside>
      </div>
      <QuantifyChat />
    </div>
    </WebEditProvider>
  )
}
