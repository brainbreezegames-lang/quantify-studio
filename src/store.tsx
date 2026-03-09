import React, { createContext, useContext, useReducer, type Dispatch } from 'react'
import { v4 as uuid } from 'uuid'
import type { AppState, AppAction, ScreenHistoryEntry, ComponentNode, WebDesign, ImproveSnapshot } from './types'
import type { ThemeMode } from './types'
import {
  AVONTUS_TOKENS,
  DEFAULT_DESIGN_BRIEF,
  DEFAULT_QUALITY_TOGGLES,
  normalizeDesignBrief,
  normalizeDesignTokens,
  updateDesignBrief,
  assignIds,
} from './types'
import type { QualityToggles } from './types'

const savedTokens = localStorage.getItem('uno-studio-tokens')
const savedOnboarding = localStorage.getItem('uno-studio-onboarded')
const savedBrief = localStorage.getItem('uno-studio-design-brief')
const savedThemeMode = localStorage.getItem('uno-studio-theme-mode')
const savedQualityToggles = localStorage.getItem('uno-studio-quality-toggles')
const savedScreenHistory = localStorage.getItem('uno-studio-screen-history')
const savedCurrentDesign = localStorage.getItem('uno-studio-current-design')

function parseSavedTokens(raw: string | null) {
  if (!raw) return AVONTUS_TOKENS

  try {
    return normalizeDesignTokens(JSON.parse(raw), AVONTUS_TOKENS)
  } catch {
    return AVONTUS_TOKENS
  }
}

function parseSavedBrief(raw: string | null) {
  if (!raw) return DEFAULT_DESIGN_BRIEF

  try {
    return normalizeDesignBrief(JSON.parse(raw), DEFAULT_DESIGN_BRIEF)
  } catch {
    return DEFAULT_DESIGN_BRIEF
  }
}

function parseSavedThemeMode(raw: string | null): ThemeMode {
  return raw === 'light' ? 'light' : 'dark'
}

function parseSavedQualityToggles(raw: string | null): QualityToggles {
  if (!raw) return { ...DEFAULT_QUALITY_TOGGLES }
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_QUALITY_TOGGLES }
    // Migrate old 24-toggle keys → new 15-toggle keys
    const b = (key: string) => parsed[key] === true
    const any = (...keys: string[]) => keys.some(k => b(k))
    return {
      avontusBrand: b('avontusBrand'),
      tokenEnforcement: b('tokenEnforcement') || any('tokenMap', 'noGenericFallback'),
      componentRegistry: b('componentRegistry'),
      designDna: b('designDna') || any('dnaAnalysis', 'dnaGeneration'),
      designSystem: b('designSystem') || any('designSystemPatterns', 'designSystemArchitect', 'artifactFix'),
      materialDesign: b('materialDesign') || any('materialDesign3', 'flutterMd3'),
      visualExcellence: b('visualExcellence') || any('frontendDesign', 'creativeDesign', 'aestheticReview'),
      typography: b('typography'),
      designStandards: b('designStandards') || any('uiuxDesignAudit', 'uiDesignPrinciples', 'uxDesignExpert'),
      uxPsychology: b('uxPsychology'),
      gestalt: b('gestalt'),
      interaction: b('interaction'),
      microcopy: b('microcopy'),
      accessibility: b('accessibility'),
      dataHeavyDesign: b('dataHeavyDesign'),
    }
  } catch {
    return { ...DEFAULT_QUALITY_TOGGLES }
  }
}

const MAX_HISTORY_ENTRIES = 200

function deduplicateVoiceEntries(entries: ScreenHistoryEntry[]): ScreenHistoryEntry[] {
  const result: ScreenHistoryEntry[] = []
  for (let i = 0; i < entries.length; i++) {
    const isVoice = entries[i].prompt.startsWith('[Voice]')
    const nextIsVoice = i + 1 < entries.length && entries[i + 1].prompt.startsWith('[Voice]')
    // Keep entry if it's not a voice entry, or if it's the last in a consecutive voice sequence
    if (!isVoice || !nextIsVoice) {
      result.push(entries[i])
    }
  }
  return result
}

function parseSavedScreenHistory(raw: string | null): ScreenHistoryEntry[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const entries = parsed.slice(-MAX_HISTORY_ENTRIES).filter(
      (e: unknown) => e && typeof e === 'object' && 'id' in (e as Record<string, unknown>) && 'prompt' in (e as Record<string, unknown>) && 'tree' in (e as Record<string, unknown>)
    ) as ScreenHistoryEntry[]
    // Clean up old consecutive voice entries — keep only the last in each sequence
    const cleaned = deduplicateVoiceEntries(entries)
    if (cleaned.length < entries.length) {
      // Persist the cleaned version
      try { localStorage.setItem('uno-studio-screen-history', JSON.stringify(cleaned)) } catch {}
    }
    return cleaned
  } catch {
    return []
  }
}

function parseSavedCurrentDesign(raw: string | null): {
  tree: ComponentNode | null
  webDesign: WebDesign | null
  improveHistory: import('./types').ImproveSnapshot[]
  improveDecisions: import('./types').Decision[] | null
  originalWebDesign: WebDesign | null
  previousWebDesign: WebDesign | null
} {
  const empty = { tree: null, webDesign: null, improveHistory: [], improveDecisions: null, originalWebDesign: null, previousWebDesign: null }
  if (!raw) return empty
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return empty
    return {
      tree: parsed.tree ?? null,
      webDesign: parsed.webDesign ?? null,
      improveHistory: Array.isArray(parsed.improveHistory) ? parsed.improveHistory : [],
      improveDecisions: parsed.improveDecisions ?? null,
      originalWebDesign: parsed.originalWebDesign ?? null,
      previousWebDesign: parsed.previousWebDesign ?? null,
    }
  } catch {
    return empty
  }
}

function persistScreenHistory(history: ScreenHistoryEntry[]) {
  try {
    localStorage.setItem('uno-studio-screen-history', JSON.stringify(history.slice(-MAX_HISTORY_ENTRIES)))
  } catch { /* storage full — silently skip */ }
}

interface ImprovePersistedState {
  improveHistory?: import('./types').ImproveSnapshot[]
  improveDecisions?: import('./types').Decision[] | null
  originalWebDesign?: WebDesign | null
  previousWebDesign?: WebDesign | null
}

function persistCurrentDesign(tree: ComponentNode | null, webDesign: WebDesign | null, improve?: ImprovePersistedState) {
  try {
    if (tree) {
      localStorage.setItem('uno-studio-current-design', JSON.stringify({ tree, webDesign, ...improve }))
    } else {
      localStorage.removeItem('uno-studio-current-design')
    }
  } catch { /* storage full — silently skip */ }
}

const restoredHistory = parseSavedScreenHistory(savedScreenHistory)
const restoredDesign = parseSavedCurrentDesign(savedCurrentDesign)

const initialState: AppState = {
  designTokens: parseSavedTokens(savedTokens),
  designBrief: parseSavedBrief(savedBrief),
  themeMode: parseSavedThemeMode(savedThemeMode),
  hasCompletedOnboarding: savedOnboarding === 'true',
  currentTree: restoredDesign.tree,
  currentWebDesign: restoredDesign.webDesign,
  selectedComponentId: null,
  screenHistory: restoredHistory,
  isGenerating: false,
  isImproving: false,
  promptHistory: [],
  error: null,
  qualityToggles: parseSavedQualityToggles(savedQualityToggles),
  canUndo: false,
  canRedo: false,
  previousWebDesign: restoredDesign.previousWebDesign,
  improveDecisions: restoredDesign.improveDecisions,
  showingBefore: false,
  improveHistory: restoredDesign.improveHistory,
  originalWebDesign: restoredDesign.originalWebDesign,
  viewingImproveIndex: null,
  currentImageDataUri: null,
}

/* ── Tree mutation helpers ────────────────────────────────────── */

function findAndUpdate(
  node: ComponentNode,
  id: string,
  properties: Record<string, string>
): ComponentNode {
  if (node.id === id) {
    return { ...node, properties: { ...node.properties, ...properties } }
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map((c) => findAndUpdate(c, id, properties)),
    }
  }
  return node
}

function reorderChildren(
  node: ComponentNode,
  parentId: string,
  fromIndex: number,
  toIndex: number,
): ComponentNode {
  if (node.id === parentId && node.children) {
    const newChildren = [...node.children]
    const [moved] = newChildren.splice(fromIndex, 1)
    newChildren.splice(toIndex, 0, moved)
    return { ...node, children: newChildren }
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map((c) => reorderChildren(c, parentId, fromIndex, toIndex)),
    }
  }
  return node
}

function deleteNode(
  node: ComponentNode,
  targetId: string,
): ComponentNode {
  if (node.children) {
    const filtered = node.children.filter((c) => c.id !== targetId)
    return {
      ...node,
      children: filtered.length > 0
        ? filtered.map((c) => deleteNode(c, targetId))
        : undefined,
    }
  }
  return node
}

function addChild(
  node: ComponentNode,
  parentId: string,
  child: ComponentNode,
): ComponentNode {
  if (node.id === parentId) {
    return { ...node, children: [...(node.children || []), child] }
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map((c) => addChild(c, parentId, child)),
    }
  }
  return node
}

function insertChildAtIndex(
  node: ComponentNode,
  parentId: string,
  child: ComponentNode,
  index: number,
): ComponentNode {
  if (node.id === parentId) {
    const children = [...(node.children || [])]
    children.splice(index, 0, child)
    return { ...node, children }
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map((c) => insertChildAtIndex(c, parentId, child, index)),
    }
  }
  return node
}

function findNode(node: ComponentNode, id: string): ComponentNode | null {
  if (node.id === id) return node
  if (node.children) {
    for (const child of node.children) {
      const found = findNode(child, id)
      if (found) return found
    }
  }
  return null
}

function findParent(node: ComponentNode, id: string): ComponentNode | null {
  if (node.children) {
    for (const child of node.children) {
      if (child.id === id) return node
      const found = findParent(child, id)
      if (found) return found
    }
  }
  return null
}

function cloneNode(node: ComponentNode): ComponentNode {
  return assignIds(node as unknown as Record<string, unknown>)
}

/* ── Smart drop helpers ────────────────────────────────────────── */

const TOP_COMPONENTS = new Set(['NavigationBar'])
const BOTTOM_COMPONENTS = new Set(['BottomNavigationBar'])

function stripCanvasProps(node: ComponentNode): ComponentNode {
  const props = { ...node.properties }
  delete props['Canvas.Left']
  delete props['Canvas.Top']
  return { ...node, properties: props }
}

function createFlowPage(): { page: ComponentNode; contentStackId: string } {
  const contentStackId = uuid()
  const page: ComponentNode = {
    id: uuid(),
    type: 'Page',
    properties: { Background: '#FFFFFF' },
    children: [
      {
        id: uuid(),
        type: 'ScrollViewer',
        properties: {},
        children: [
          {
            id: contentStackId,
            type: 'StackPanel',
            properties: { Orientation: 'Vertical', Padding: '16', Spacing: '16' },
            children: [],
          },
        ],
      },
    ],
  }
  return { page, contentStackId }
}

function findContentStack(page: ComponentNode): string | null {
  for (const child of page.children || []) {
    if (child.type === 'ScrollViewer') {
      for (const inner of child.children || []) {
        if (inner.type === 'StackPanel') return inner.id
      }
    }
    if (child.type === 'StackPanel' && !TOP_COMPONENTS.has(child.type) && !BOTTOM_COMPONENTS.has(child.type)) {
      return child.id
    }
  }
  return null
}

function addToContentStack(root: ComponentNode, stackId: string, child: ComponentNode): ComponentNode {
  return addChild(root, stackId, child)
}

function insertAtTop(root: ComponentNode, child: ComponentNode): ComponentNode {
  const filtered = (root.children || []).filter(c => c.type !== 'NavigationBar')
  return { ...root, children: [child, ...filtered] }
}

function insertAtBottom(root: ComponentNode, child: ComponentNode): ComponentNode {
  const filtered = (root.children || []).filter(c => c.type !== 'BottomNavigationBar')
  return { ...root, children: [...filtered, child] }
}

/* ── Core reducer (no undo logic) ─────────────────────────────── */

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TOKENS':
      localStorage.setItem('uno-studio-tokens', JSON.stringify(action.tokens))
      return { ...state, designTokens: action.tokens }

    case 'SET_DESIGN_BRIEF': {
      const nextBrief = updateDesignBrief(state.designBrief, action.brief)
      localStorage.setItem('uno-studio-design-brief', JSON.stringify(nextBrief))
      return { ...state, designBrief: nextBrief }
    }

    case 'SET_THEME_MODE':
      localStorage.setItem('uno-studio-theme-mode', action.mode)
      return { ...state, themeMode: action.mode }

    case 'COMPLETE_ONBOARDING':
      localStorage.setItem('uno-studio-onboarded', 'true')
      return { ...state, hasCompletedOnboarding: true }

    case 'SET_QUALITY_TOGGLES': {
      const nextToggles = { ...state.qualityToggles, ...action.toggles }
      localStorage.setItem('uno-studio-quality-toggles', JSON.stringify(nextToggles))
      return { ...state, qualityToggles: nextToggles }
    }

    case 'SET_TREE': {
      const isVoiceEdit = action.prompt.startsWith('[Voice]')
      const lastEntry = state.screenHistory[state.screenHistory.length - 1]
      const shouldMerge = isVoiceEdit && lastEntry && lastEntry.prompt.startsWith('[Voice]')

      let nextHistory: ScreenHistoryEntry[]
      if (shouldMerge) {
        // Voice edits on same design: update the existing entry instead of creating a new one
        const updated = { ...lastEntry, tree: action.tree, webDesign: action.webDesign ?? lastEntry.webDesign, prompt: action.prompt, timestamp: Date.now() }
        nextHistory = [...state.screenHistory.slice(0, -1), updated]
      } else {
        const entry: ScreenHistoryEntry = {
          id: uuid(),
          prompt: action.prompt,
          tree: action.tree,
          webDesign: action.webDesign ?? null,
          timestamp: Date.now(),
        }
        nextHistory = [...state.screenHistory, entry]
      }
      persistScreenHistory(nextHistory)
      persistCurrentDesign(action.tree, action.webDesign ?? null)
      return {
        ...state,
        currentTree: action.tree,
        currentWebDesign: action.webDesign ?? null,
        selectedComponentId: null,
        screenHistory: nextHistory,
        promptHistory: [...state.promptHistory, action.prompt],
        error: null,
        previousWebDesign: null,
        improveDecisions: null,
        showingBefore: false,
        improveHistory: [],
        originalWebDesign: null,
        viewingImproveIndex: null,
        currentImageDataUri: action.imageDataUri ?? null,
      }
    }

    case 'UPDATE_COMPONENT':
      if (!state.currentTree) return state
      return {
        ...state,
        currentTree: findAndUpdate(state.currentTree, action.id, action.properties),
      }

    case 'SELECT_COMPONENT':
      return { ...state, selectedComponentId: action.id }

    case 'SET_GENERATING':
      return { ...state, isGenerating: action.value, error: action.value ? null : state.error }

    case 'RESTORE_HISTORY':
      persistCurrentDesign(action.entry.tree, action.entry.webDesign ?? null)
      return {
        ...state,
        currentTree: action.entry.tree,
        currentWebDesign: action.entry.webDesign ?? null,
        selectedComponentId: null,
        promptHistory: [action.entry.prompt],
        previousWebDesign: null,
        improveDecisions: null,
        showingBefore: false,
      }

    case 'SET_ERROR':
      return { ...state, error: action.error, isGenerating: false }

    case 'CLEAR_SCREEN':
      persistCurrentDesign(null, null)
      return {
        ...state,
        currentTree: null,
        currentWebDesign: null,
        selectedComponentId: null,
        promptHistory: [],
        error: null,
        currentImageDataUri: null,
      }

    case 'REORDER_CHILDREN':
      if (!state.currentTree) return state
      return {
        ...state,
        currentTree: reorderChildren(state.currentTree, action.parentId, action.fromIndex, action.toIndex),
      }

    case 'DELETE_COMPONENT': {
      if (!state.currentTree || state.currentTree.id === action.id) return state
      return {
        ...state,
        currentTree: deleteNode(state.currentTree, action.id),
        selectedComponentId: state.selectedComponentId === action.id ? null : state.selectedComponentId,
      }
    }

    case 'ADD_CHILD':
      if (!state.currentTree) return state
      return {
        ...state,
        currentTree: addChild(state.currentTree, action.parentId, action.child),
      }

    case 'INSERT_CHILD':
      if (!state.currentTree) return state
      return {
        ...state,
        currentTree: insertChildAtIndex(state.currentTree, action.parentId, action.child, action.index),
      }

    case 'DUPLICATE_COMPONENT': {
      if (!state.currentTree) return state
      const parent = findParent(state.currentTree, action.id)
      const original = findNode(state.currentTree, action.id)
      if (!parent || !original) return state
      const clone = cloneNode(original)
      const idx = parent.children!.findIndex(c => c.id === action.id)
      return {
        ...state,
        currentTree: insertChildAtIndex(state.currentTree, parent.id, clone, idx + 1),
        selectedComponentId: clone.id,
      }
    }

    case 'DROP_COMPONENT_ON_CANVAS': {
      const child = stripCanvasProps(action.child)
      const childType = child.type
      const isTop = TOP_COMPONENTS.has(childType)
      const isBottom = BOTTOM_COMPONENTS.has(childType)

      if (!state.currentTree) {
        const { page, contentStackId } = createFlowPage()
        let newPage: ComponentNode

        if (isTop) {
          newPage = insertAtTop(page, child)
        } else if (isBottom) {
          newPage = insertAtBottom(page, child)
        } else {
          newPage = addToContentStack(page, contentStackId, child)
        }

        return {
          ...state,
          currentTree: newPage,
          selectedComponentId: child.id,
          error: null,
        }
      }

      const root = state.currentTree

      if (root.properties.LayoutMode === 'Canvas') {
        return {
          ...state,
          currentTree: {
            ...root,
            children: [...(root.children || []), action.child],
          },
          selectedComponentId: action.child.id,
          error: null,
        }
      }

      if (isTop) {
        return {
          ...state,
          currentTree: insertAtTop(root, child),
          selectedComponentId: child.id,
          error: null,
        }
      }

      if (isBottom) {
        return {
          ...state,
          currentTree: insertAtBottom(root, child),
          selectedComponentId: child.id,
          error: null,
        }
      }

      const stackId = findContentStack(root)
      if (stackId) {
        return {
          ...state,
          currentTree: addToContentStack(root, stackId, child),
          selectedComponentId: child.id,
          error: null,
        }
      }

      return {
        ...state,
        currentTree: {
          ...root,
          children: [...(root.children || []), child],
        },
        selectedComponentId: child.id,
        error: null,
      }
    }

    case 'MOVE_COMPONENT':
      if (!state.currentTree) return state
      return {
        ...state,
        currentTree: findAndUpdate(state.currentTree, action.id, {
          'Canvas.Left': String(Math.round(action.left)),
          'Canvas.Top': String(Math.round(action.top)),
        }),
      }

    case 'START_BLANK_CANVAS': {
      const { page } = createFlowPage()
      return {
        ...state,
        currentTree: page,
        currentWebDesign: null,
        selectedComponentId: null,
        promptHistory: [],
        error: null,
      }
    }

    case 'DELETE_HISTORY_ENTRY': {
      const nextHistory = state.screenHistory.filter(e => e.id !== action.id)
      persistScreenHistory(nextHistory)
      return { ...state, screenHistory: nextHistory }
    }

    case 'CLEAR_ALL_HISTORY': {
      persistScreenHistory([])
      return { ...state, screenHistory: [] }
    }

    // UNDO / REDO handled by the wrapping undoReducer
    case 'UNDO':
    case 'REDO':
      return state

    case 'SET_IMPROVING':
      return { ...state, isImproving: action.value }

    case 'SET_IMPROVE_RESULT': {
      const snapshot: ImproveSnapshot = {
        id: uuid(),
        timestamp: Date.now(),
        webDesign: action.webDesign,
        decisions: action.decisions,
        lensCount: action.lensCount ?? action.decisions.length,
      }
      const isFirstImprove = state.improveHistory.length === 0
      const nextImproveHistory = [...state.improveHistory, snapshot]
      const nextOriginalWebDesign = isFirstImprove ? action.previousWebDesign : state.originalWebDesign
      persistCurrentDesign(state.currentTree, action.webDesign, {
        improveHistory: nextImproveHistory,
        improveDecisions: action.decisions,
        originalWebDesign: nextOriginalWebDesign,
        previousWebDesign: action.previousWebDesign,
      })
      return {
        ...state,
        previousWebDesign: action.previousWebDesign,
        currentWebDesign: action.webDesign,
        improveDecisions: action.decisions,
        showingBefore: false,
        isImproving: false,
        improveHistory: nextImproveHistory,
        originalWebDesign: nextOriginalWebDesign,
        viewingImproveIndex: null,
      }
    }

    case 'SET_SHOW_BEFORE':
      return { ...state, showingBefore: action.value }

    case 'VIEW_IMPROVE_VERSION':
      return { ...state, viewingImproveIndex: action.index }

    case 'UPDATE_WEB_DESIGN': {
      if (!state.currentWebDesign) return state
      const updatedWebDesign = { ...state.currentWebDesign, html: action.html, css: action.css }
      persistCurrentDesign(state.currentTree, updatedWebDesign, {
        improveHistory: state.improveHistory,
        improveDecisions: state.improveDecisions,
        originalWebDesign: state.originalWebDesign,
        previousWebDesign: state.previousWebDesign,
      })
      return { ...state, currentWebDesign: updatedWebDesign }
    }

    case 'REVERT_TO_VERSION': {
      // index -1 = restore original (discard all improvements)
      if (action.index === -1) {
        if (!state.originalWebDesign) return state
        persistCurrentDesign(state.currentTree, state.originalWebDesign, {
          improveHistory: [],
          improveDecisions: null,
          originalWebDesign: null,
          previousWebDesign: null,
        })
        return {
          ...state,
          currentWebDesign: state.originalWebDesign,
          improveHistory: [],
          improveDecisions: null,
          previousWebDesign: null,
          originalWebDesign: null,
          viewingImproveIndex: null,
          showingBefore: false,
        }
      }
      const target = state.improveHistory[action.index]
      if (!target) return state
      const nextPrevious = action.index > 0
        ? state.improveHistory[action.index - 1].webDesign
        : state.originalWebDesign
      const nextHistory = state.improveHistory.slice(0, action.index + 1)
      persistCurrentDesign(state.currentTree, target.webDesign, {
        improveHistory: nextHistory,
        improveDecisions: target.decisions,
        originalWebDesign: state.originalWebDesign,
        previousWebDesign: nextPrevious,
      })
      return {
        ...state,
        currentWebDesign: target.webDesign,
        improveHistory: nextHistory,
        improveDecisions: target.decisions,
        previousWebDesign: nextPrevious,
        viewingImproveIndex: null,
        showingBefore: false,
      }
    }

    default:
      return state
  }
}

/* ── Undo/Redo wrapper ────────────────────────────────────────── */

const UNDO_MAX = 50

// Actions that mutate the tree and should be recorded in undo history
const UNDOABLE_ACTIONS = new Set<string>([
  'SET_TREE',
  'UPDATE_COMPONENT',
  'DELETE_COMPONENT',
  'ADD_CHILD',
  'INSERT_CHILD',
  'DUPLICATE_COMPONENT',
  'DROP_COMPONENT_ON_CANVAS',
  'REORDER_CHILDREN',
  'MOVE_COMPONENT',
  'UPDATE_WEB_DESIGN',
  'START_BLANK_CANVAS',
  'CLEAR_SCREEN',
  'RESTORE_HISTORY',
])

interface UndoState {
  past: AppState[]
  present: AppState
  future: AppState[]
}

function undoReducer(undoState: UndoState, action: AppAction): UndoState {
  const { past, present, future } = undoState

  if (action.type === 'UNDO') {
    if (past.length === 0) return undoState
    const previous = past[past.length - 1]
    return {
      past: past.slice(0, -1),
      present: { ...previous, canUndo: past.length - 1 > 0, canRedo: true },
      future: [present, ...future],
    }
  }

  if (action.type === 'REDO') {
    if (future.length === 0) return undoState
    const next = future[0]
    return {
      past: [...past, present],
      present: { ...next, canUndo: true, canRedo: future.length - 1 > 0 },
      future: future.slice(1),
    }
  }

  const newPresent = reducer(present, action)

  // If state didn't change, don't push to undo stack
  if (newPresent === present) return undoState

  if (UNDOABLE_ACTIONS.has(action.type)) {
    const newPast = [...past, present].slice(-UNDO_MAX)
    return {
      past: newPast,
      present: { ...newPresent, canUndo: true, canRedo: false },
      future: [], // clear redo on new action
    }
  }

  // Non-undoable action — update present without touching history
  return {
    past,
    present: { ...newPresent, canUndo: past.length > 0, canRedo: future.length > 0 },
    future,
  }
}

const initialUndoState: UndoState = {
  past: [],
  present: initialState,
  future: [],
}

/* ── Context & Provider ───────────────────────────────────────── */

const StateContext = createContext<AppState>(initialState)
const DispatchContext = createContext<Dispatch<AppAction>>(() => { })

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [undoState, dispatch] = useReducer(undoReducer, initialUndoState)
  return (
    <StateContext.Provider value={undoState.present}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export function useAppState() {
  return useContext(StateContext)
}

export function useAppDispatch() {
  return useContext(DispatchContext)
}
