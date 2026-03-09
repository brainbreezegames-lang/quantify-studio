import { Clock, RotateCcw } from 'lucide-react'
import { useAppState, useAppDispatch } from '../store'

export default function HistoryPanel() {
  const { screenHistory } = useAppState()
  const dispatch = useAppDispatch()

  if (screenHistory.length === 0) {
    return null
  }

  return (
    <div className="border-t border-studio-border">
      <div className="px-3 py-2 flex items-center gap-1.5">
        <Clock size={12} className="text-studio-text-dim" />
        <h3 className="text-[11px] font-semibold text-studio-text-dim uppercase tracking-wider">History</h3>
        <span className="text-[10px] text-studio-text-dim ml-auto">{screenHistory.length}</span>
      </div>
      <div className="max-h-40 overflow-y-auto px-1.5 pb-2">
        {screenHistory.map((entry, i) => (
          <button
            key={entry.id}
            onClick={() => dispatch({ type: 'RESTORE_HISTORY', entry })}
            className="w-full flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-studio-surface-3 transition-colors text-left group"
          >
            <span className="text-[10px] text-studio-text-dim font-mono mt-0.5 flex-shrink-0">
              #{i + 1}
            </span>
            <span className="text-xs text-studio-text-muted truncate flex-1">
              {entry.prompt}
            </span>
            <RotateCcw size={10} className="text-studio-text-dim opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}
