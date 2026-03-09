// ── Spacing Tokens ──

export interface SpacingToken {
  name: string
  value: string
  px: number
}

export const SPACING_TOKENS: SpacingToken[] = [
  { name: 'space-1', value: '4px', px: 4 },
  { name: 'space-2', value: '8px', px: 8 },
  { name: 'space-3', value: '12px', px: 12 },
  { name: 'space-4', value: '16px', px: 16 },
  { name: 'space-6', value: '24px', px: 24 },
  { name: 'space-8', value: '32px', px: 32 },
  { name: 'space-10', value: '40px', px: 40 },
  { name: 'space-12', value: '48px', px: 48 },
  { name: 'space-14', value: '56px', px: 56 },
  { name: 'space-26', value: '104px', px: 104 },
]

// ── Elevation Tokens ──

export interface ElevationToken {
  level: number
  value: string
  description: string
}

export const ELEVATION_TOKENS: ElevationToken[] = [
  {
    level: 0,
    value: 'none',
    description: 'Flat surface, no elevation',
  },
  {
    level: 1,
    value: '0 1px 3px rgba(10,62,255,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    description: 'Cards, subtle separation from surface',
  },
  {
    level: 2,
    value: '0 4px 12px rgba(10,62,255,0.08), 0 2px 4px rgba(0,0,0,0.04)',
    description: 'Raised buttons, elevated cards on hover',
  },
  {
    level: 3,
    value: '0 8px 24px rgba(10,62,255,0.10), 0 4px 8px rgba(0,0,0,0.05)',
    description: 'FABs, navigation drawers, search bars',
  },
  {
    level: 4,
    value: '0 16px 40px rgba(10,62,255,0.12), 0 8px 16px rgba(0,0,0,0.06)',
    description: 'Modals, elevated menus, popovers',
  },
  {
    level: 5,
    value: '0 24px 56px rgba(10,62,255,0.14), 0 12px 24px rgba(0,0,0,0.08)',
    description: 'Dialogs, full-screen overlays',
  },
]

// ── Shape Tokens ──

export interface ShapeToken {
  name: string
  value: string
  description: string
}

export const SHAPE_TOKENS: ShapeToken[] = [
  { name: 'None', value: '0px', description: 'Default — sharp geometric corners (Probe aesthetic)' },
  { name: 'Extra Small', value: '2px', description: 'Minimal rounding for tight UI elements' },
  { name: 'Small', value: '4px', description: 'Text fields, chips, small cards' },
  { name: 'Medium', value: '8px', description: 'Cards, menus, toolbar corners' },
  { name: 'Large', value: '12px', description: 'Large cards, dialog corners, FABs' },
  { name: 'Extra Large', value: '16px', description: 'Bottom sheets, expanded containers' },
  { name: 'Full', value: '9999px', description: 'Pills, circular buttons, badges' },
]

// ── State Layer Tokens ──

export interface StateToken {
  name: string
  opacity: number
  description: string
}

export const STATE_TOKENS: StateToken[] = [
  { name: 'Enabled', opacity: 0, description: 'Default resting state, no overlay' },
  { name: 'Hover', opacity: 0.08, description: 'HoverOverlay pattern — blue-tinted overlay on hover' },
  { name: 'Focus', opacity: 0.12, description: 'Element has keyboard or programmatic focus' },
  { name: 'Pressed', opacity: 0.12, description: 'Active press / tap on the element' },
  { name: 'Dragged', opacity: 0.16, description: 'Element being dragged to a new position' },
  { name: 'Disabled', opacity: 0.38, description: 'Element is non-interactive, reduced opacity' },
]

// ── Motion Tokens ──

export interface MotionToken {
  name: string
  value: string
  description: string
  duration?: string
}

export const MOTION_TOKENS: MotionToken[] = [
  {
    name: 'Easing Standard',
    value: 'cubic-bezier(0.2, 0, 0, 1)',
    description: 'Default easing for all transitions. Decelerating curve that feels natural and responsive.',
  },
  {
    name: 'Duration Fast',
    value: '150ms',
    description: 'Micro-interactions: hovers, ripples, color changes, state toggles',
    duration: '150ms',
  },
  {
    name: 'Duration Medium',
    value: '300ms',
    description: 'Standard transitions: card elevation, panel slides, expand/collapse',
    duration: '300ms',
  },
  {
    name: 'Duration Slow',
    value: '500ms',
    description: 'Larger transitions: page-level animations, complex reveals, onboarding',
    duration: '500ms',
  },
]
