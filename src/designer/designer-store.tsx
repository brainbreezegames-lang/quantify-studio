import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { DesignerState, DesignerAction } from './types'

const STORAGE_KEY = 'quantify-designer-project'

const initialState: DesignerState = {
  projectName: 'Untitled project',
  artboards: [],
  selectedArtboardId: null,
  viewport: { panX: 0, panY: 0, zoom: 0.7 },
  messages: [],
  isGenerating: false,
  error: null,
  activeLenses: [],
}

function loadState(): DesignerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const saved = JSON.parse(raw)
    return {
      ...initialState,
      projectName: saved.projectName || initialState.projectName,
      artboards: saved.artboards || [],
      messages: (saved.messages || []).slice(-50),
      activeLenses: saved.activeLenses || [],
    }
  } catch {
    return initialState
  }
}

function saveState(state: DesignerState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      projectName: state.projectName,
      artboards: state.artboards,
      messages: state.messages.slice(-50),
      activeLenses: state.activeLenses,
    }))
  } catch { /* quota exceeded */ }
}

function reducer(state: DesignerState, action: DesignerAction): DesignerState {
  switch (action.type) {
    case 'SET_PROJECT_NAME':
      return { ...state, projectName: action.name }

    case 'CREATE_ARTBOARD':
      return {
        ...state,
        artboards: [...state.artboards, action.artboard],
        selectedArtboardId: action.artboard.id,
      }

    case 'UPDATE_ARTBOARD':
      return {
        ...state,
        artboards: state.artboards.map(a =>
          a.id === action.id ? { ...a, ...action.updates, updatedAt: Date.now() } : a
        ),
      }

    case 'DELETE_ARTBOARD':
      return {
        ...state,
        artboards: state.artboards.filter(a => a.id !== action.id),
        selectedArtboardId: state.selectedArtboardId === action.id ? null : state.selectedArtboardId,
      }

    case 'SELECT_ARTBOARD':
      return { ...state, selectedArtboardId: action.id }

    case 'MOVE_ARTBOARD':
      return {
        ...state,
        artboards: state.artboards.map(a =>
          a.id === action.id ? { ...a, x: action.x, y: action.y } : a
        ),
      }

    case 'SET_VIEWPORT':
      return { ...state, viewport: { ...state.viewport, ...action.viewport } }

    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] }

    case 'SET_GENERATING':
      return { ...state, isGenerating: action.value }

    case 'SET_ERROR':
      return { ...state, error: action.error }

    case 'CLEAR_CHAT':
      return { ...state, messages: [] }

    case 'LOAD_STATE':
      return { ...state, ...action.state }

    case 'TOGGLE_LENS':
      return {
        ...state,
        activeLenses: state.activeLenses.includes(action.lens)
          ? state.activeLenses.filter(l => l !== action.lens)
          : [...state.activeLenses, action.lens],
      }

    default:
      return state
  }
}

const DesignerContext = createContext<{
  state: DesignerState
  dispatch: React.Dispatch<DesignerAction>
} | null>(null)

export function DesignerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    saveState(state)
  }, [state.projectName, state.artboards, state.messages, state.activeLenses])

  return (
    <DesignerContext.Provider value={{ state, dispatch }}>
      {children}
    </DesignerContext.Provider>
  )
}

export function useDesigner() {
  const ctx = useContext(DesignerContext)
  if (!ctx) throw new Error('useDesigner must be used within DesignerProvider')
  return ctx
}
