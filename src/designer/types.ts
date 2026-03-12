export interface Artboard {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  html: string
  css: string
  createdAt: number
  updatedAt: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  artboardActions?: ArtboardAction[]
}

export interface ArtboardAction {
  type: 'create' | 'update'
  artboardId: string
  artboardName: string
}

export interface CanvasViewport {
  panX: number
  panY: number
  zoom: number
}

export type QualityLens = 'premium' | 'gestalt' | 'typography' | 'accessibility'

export interface DesignerState {
  projectName: string
  artboards: Artboard[]
  selectedArtboardId: string | null
  viewport: CanvasViewport
  messages: ChatMessage[]
  isGenerating: boolean
  error: string | null
  activeLenses: QualityLens[]
}

export type DesignerAction =
  | { type: 'SET_PROJECT_NAME'; name: string }
  | { type: 'CREATE_ARTBOARD'; artboard: Artboard }
  | { type: 'UPDATE_ARTBOARD'; id: string; updates: Partial<Artboard> }
  | { type: 'DELETE_ARTBOARD'; id: string }
  | { type: 'SELECT_ARTBOARD'; id: string | null }
  | { type: 'MOVE_ARTBOARD'; id: string; x: number; y: number }
  | { type: 'SET_VIEWPORT'; viewport: Partial<CanvasViewport> }
  | { type: 'ADD_MESSAGE'; message: ChatMessage }
  | { type: 'SET_GENERATING'; value: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'CLEAR_CHAT' }
  | { type: 'LOAD_STATE'; state: Partial<DesignerState> }
  | { type: 'TOGGLE_LENS'; lens: QualityLens }
