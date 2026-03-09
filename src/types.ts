export type BorderRadiusPreset = 'sharp' | 'slightly-rounded' | 'rounded' | 'pill'

export type TypographyVariant =
  | 'DisplayLarge'
  | 'DisplayMedium'
  | 'DisplaySmall'
  | 'HeadlineLarge'
  | 'HeadlineMedium'
  | 'HeadlineSmall'
  | 'TitleLarge'
  | 'TitleMedium'
  | 'TitleSmall'
  | 'BodyLarge'
  | 'BodyMedium'
  | 'BodySmall'
  | 'LabelLarge'
  | 'LabelMedium'
  | 'LabelSmall'

export interface Md3TypographyStyle {
  fontFamily: string
  fontSize: number
  lineHeight: number
  letterSpacing: number
  fontWeight: number
}

export type Md3TypographyScale = Record<TypographyVariant, Md3TypographyStyle>

export interface Md3ColorRoles {
  primary: string
  onPrimary: string
  primaryContainer: string
  onPrimaryContainer: string
  secondary: string
  onSecondary: string
  secondaryContainer: string
  onSecondaryContainer: string
  tertiary: string
  onTertiary: string
  tertiaryContainer: string
  onTertiaryContainer: string
  error: string
  onError: string
  errorContainer: string
  onErrorContainer: string
  background: string
  onBackground: string
  surface: string
  onSurface: string
  surfaceVariant: string
  onSurfaceVariant: string
  outline: string
  outlineVariant: string
  inverseSurface: string
  inverseOnSurface: string
  inversePrimary: string
  surfaceTint: string
  shadow: string
  scrim: string
  surfaceContainerLowest: string
  surfaceContainerLow: string
  surfaceContainer: string
  surfaceContainerHigh: string
  surfaceContainerHighest: string
}

export interface Md3StateLayers {
  hoverOpacity: number
  focusOpacity: number
  pressedOpacity: number
  draggedOpacity: number
  disabledContentOpacity: number
  disabledContainerOpacity: number
}

export interface Md3ElevationLevels {
  level0: string
  level1: string
  level2: string
  level3: string
  level4: string
  level5: string
}

export interface Md3ShapeScale {
  none: number
  extraSmall: number
  small: number
  medium: number
  large: number
  extraLarge: number
  full: number
}

export interface DesignTokenSeed {
  primaryColor: string
  secondaryColor: string
  tertiaryColor: string
  backgroundColor: string
  surfaceColor: string
  errorColor: string
  fontFamily: string
  borderRadius: BorderRadiusPreset
}

export interface DesignTokens extends DesignTokenSeed {
  colors: Md3ColorRoles
  states: Md3StateLayers
  elevation: Md3ElevationLevels
  shape: Md3ShapeScale
  typography: Md3TypographyScale
}

export interface DesignBrief {
  companyName: string
  productName: string
  industry: string
  targetUsers: string
  keyWorkflows: string
  businessGoals: string
  brandPersonality: string
  qualityBar: string
}

export interface WebDesign {
  title?: string
  html: string
  css: string
}

export interface Decision {
  principle: string
  description: string
  impact: 'high' | 'medium' | 'low'
}

export interface ImproveSnapshot {
  id: string
  timestamp: number
  webDesign: WebDesign
  decisions: Decision[]
  lensCount: number
}

const TYPOGRAPHY_BASE: Record<TypographyVariant, Omit<Md3TypographyStyle, 'fontFamily'>> = {
  DisplayLarge: { fontSize: 57, lineHeight: 64, letterSpacing: -0.25, fontWeight: 400 },
  DisplayMedium: { fontSize: 45, lineHeight: 52, letterSpacing: 0, fontWeight: 400 },
  DisplaySmall: { fontSize: 36, lineHeight: 44, letterSpacing: 0, fontWeight: 400 },
  HeadlineLarge: { fontSize: 32, lineHeight: 40, letterSpacing: 0, fontWeight: 400 },
  HeadlineMedium: { fontSize: 28, lineHeight: 36, letterSpacing: 0, fontWeight: 400 },
  HeadlineSmall: { fontSize: 24, lineHeight: 32, letterSpacing: 0, fontWeight: 400 },
  TitleLarge: { fontSize: 22, lineHeight: 28, letterSpacing: 0, fontWeight: 400 },
  TitleMedium: { fontSize: 16, lineHeight: 24, letterSpacing: 0.15, fontWeight: 500 },
  TitleSmall: { fontSize: 14, lineHeight: 20, letterSpacing: 0.1, fontWeight: 500 },
  BodyLarge: { fontSize: 16, lineHeight: 24, letterSpacing: 0.5, fontWeight: 400 },
  BodyMedium: { fontSize: 14, lineHeight: 20, letterSpacing: 0.25, fontWeight: 400 },
  BodySmall: { fontSize: 12, lineHeight: 16, letterSpacing: 0.4, fontWeight: 400 },
  LabelLarge: { fontSize: 14, lineHeight: 20, letterSpacing: 0.1, fontWeight: 500 },
  LabelMedium: { fontSize: 12, lineHeight: 16, letterSpacing: 0.5, fontWeight: 500 },
  LabelSmall: { fontSize: 11, lineHeight: 16, letterSpacing: 0.5, fontWeight: 500 },
}

const DEFAULT_SEED: DesignTokenSeed = {
  primaryColor: '#6750A4',
  secondaryColor: '#625B71',
  tertiaryColor: '#7D5260',
  backgroundColor: '#FFFBFE',
  surfaceColor: '#FFFBFE',
  errorColor: '#B3261E',
  fontFamily: 'Roboto',
  borderRadius: 'rounded',
}

const BASE_STATES: Md3StateLayers = {
  hoverOpacity: 0.08,
  focusOpacity: 0.12,
  pressedOpacity: 0.12,
  draggedOpacity: 0.16,
  disabledContentOpacity: 0.38,
  disabledContainerOpacity: 0.12,
}

const BASE_ELEVATION: Md3ElevationLevels = {
  level0: 'none',
  level1: '0 1px 2px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.1)',
  level2: '0 2px 6px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
  level3: '0 4px 8px rgba(0,0,0,0.14), 0 2px 4px rgba(0,0,0,0.1)',
  level4: '0 6px 12px rgba(0,0,0,0.16), 0 4px 8px rgba(0,0,0,0.12)',
  level5: '0 8px 20px rgba(0,0,0,0.18), 0 6px 10px rgba(0,0,0,0.14)',
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function clampUnit(value: number): number {
  return Math.max(0, Math.min(1, value))
}

function normalizeHexColor(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback

  const trimmed = value.trim()
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const r = trimmed[1]
    const g = trimmed[2]
    const b = trimmed[3]
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
  }

  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toUpperCase()
  }

  return fallback
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = normalizeHexColor(hex, '#000000')
  const value = normalized.slice(1)
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ]
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${clampByte(r).toString(16).padStart(2, '0')}${clampByte(g).toString(16).padStart(2, '0')}${clampByte(b).toString(16).padStart(2, '0')}`.toUpperCase()
}

function blend(colorA: string, colorB: string, mix: number): string {
  const ratio = clampUnit(mix)
  const [ar, ag, ab] = hexToRgb(colorA)
  const [br, bg, bb] = hexToRgb(colorB)

  return rgbToHex(
    ar + (br - ar) * ratio,
    ag + (bg - ag) * ratio,
    ab + (bb - ab) * ratio,
  )
}

function tone(color: string, amount: number): string {
  return amount >= 0
    ? blend(color, '#FFFFFF', amount)
    : blend(color, '#000000', Math.abs(amount))
}

function createTypographyScale(fontFamily: string): Md3TypographyScale {
  return Object.entries(TYPOGRAPHY_BASE).reduce((acc, [variant, style]) => {
    acc[variant as TypographyVariant] = {
      ...style,
      fontFamily,
    }
    return acc
  }, {} as Md3TypographyScale)
}

function getRadiusBase(borderRadius: BorderRadiusPreset): number {
  const map: Record<BorderRadiusPreset, number> = {
    sharp: 0,
    'slightly-rounded': 4,
    rounded: 12,
    pill: 9999,
  }

  return map[borderRadius]
}

function createShapeScale(borderRadius: BorderRadiusPreset): Md3ShapeScale {
  const base = getRadiusBase(borderRadius)
  if (base >= 9999) {
    return {
      none: 0,
      extraSmall: 4,
      small: 8,
      medium: 12,
      large: 16,
      extraLarge: 28,
      full: 9999,
    }
  }

  return {
    none: 0,
    extraSmall: Math.max(0, Math.round(base * 0.33)),
    small: Math.max(0, Math.round(base * 0.66)),
    medium: base,
    large: Math.round(base * 1.5),
    extraLarge: Math.round(base * 2),
    full: 9999,
  }
}

function createColorRoles(seed: DesignTokenSeed): Md3ColorRoles {
  const primary = normalizeHexColor(seed.primaryColor, DEFAULT_SEED.primaryColor)
  const secondary = normalizeHexColor(seed.secondaryColor, DEFAULT_SEED.secondaryColor)
  const tertiary = normalizeHexColor(seed.tertiaryColor, DEFAULT_SEED.tertiaryColor)
  const error = normalizeHexColor(seed.errorColor, DEFAULT_SEED.errorColor)
  const background = normalizeHexColor(seed.backgroundColor, DEFAULT_SEED.backgroundColor)
  const surface = normalizeHexColor(seed.surfaceColor, background)

  const surfaceVariant = tone(secondary, 0.85)
  const onSurfaceVariant = tone(secondary, -0.2)

  return {
    primary,
    onPrimary: '#FFFFFF',
    primaryContainer: tone(primary, 0.82),
    onPrimaryContainer: tone(primary, -0.55),
    secondary,
    onSecondary: '#FFFFFF',
    secondaryContainer: tone(secondary, 0.82),
    onSecondaryContainer: tone(secondary, -0.55),
    tertiary,
    onTertiary: '#FFFFFF',
    tertiaryContainer: tone(tertiary, 0.82),
    onTertiaryContainer: tone(tertiary, -0.55),
    error,
    onError: '#FFFFFF',
    errorContainer: tone(error, 0.84),
    onErrorContainer: tone(error, -0.5),
    background,
    onBackground: tone(background, -0.88),
    surface,
    onSurface: tone(surface, -0.88),
    surfaceVariant,
    onSurfaceVariant,
    outline: tone(onSurfaceVariant, 0.35),
    outlineVariant: tone(surfaceVariant, -0.1),
    inverseSurface: tone(surface, -0.82),
    inverseOnSurface: tone(background, 0.9),
    inversePrimary: tone(primary, 0.45),
    surfaceTint: primary,
    shadow: '#000000',
    scrim: '#000000',
    surfaceContainerLowest: tone(surface, 0.02),
    surfaceContainerLow: tone(surface, -0.02),
    surfaceContainer: tone(surface, -0.04),
    surfaceContainerHigh: tone(surface, -0.08),
    surfaceContainerHighest: tone(surface, -0.12),
  }
}

export function toDesignTokenSeed(tokens: DesignTokens): DesignTokenSeed {
  return {
    primaryColor: tokens.primaryColor,
    secondaryColor: tokens.secondaryColor,
    tertiaryColor: tokens.tertiaryColor,
    backgroundColor: tokens.backgroundColor,
    surfaceColor: tokens.surfaceColor,
    errorColor: tokens.errorColor,
    fontFamily: tokens.fontFamily,
    borderRadius: tokens.borderRadius,
  }
}

export function createDesignTokens(seed?: Partial<DesignTokenSeed>): DesignTokens {
  const resolvedSeed: DesignTokenSeed = {
    primaryColor: normalizeHexColor(seed?.primaryColor, DEFAULT_SEED.primaryColor),
    secondaryColor: normalizeHexColor(seed?.secondaryColor, DEFAULT_SEED.secondaryColor),
    tertiaryColor: normalizeHexColor(seed?.tertiaryColor, DEFAULT_SEED.tertiaryColor),
    backgroundColor: normalizeHexColor(seed?.backgroundColor, DEFAULT_SEED.backgroundColor),
    surfaceColor: normalizeHexColor(seed?.surfaceColor, normalizeHexColor(seed?.backgroundColor, DEFAULT_SEED.surfaceColor)),
    errorColor: normalizeHexColor(seed?.errorColor, DEFAULT_SEED.errorColor),
    fontFamily: typeof seed?.fontFamily === 'string' && seed.fontFamily.trim() ? seed.fontFamily.trim() : DEFAULT_SEED.fontFamily,
    borderRadius: seed?.borderRadius && ['sharp', 'slightly-rounded', 'rounded', 'pill'].includes(seed.borderRadius)
      ? seed.borderRadius
      : DEFAULT_SEED.borderRadius,
  }

  return {
    ...resolvedSeed,
    colors: createColorRoles(resolvedSeed),
    states: { ...BASE_STATES },
    elevation: { ...BASE_ELEVATION },
    shape: createShapeScale(resolvedSeed.borderRadius),
    typography: createTypographyScale(resolvedSeed.fontFamily),
  }
}

function mergeNumbers<T extends object>(base: T, value: unknown): T {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return base

  const merged = { ...base } as T
  const source = value as Record<string, unknown>

  for (const key of Object.keys(base) as Array<keyof T>) {
    const raw = source[String(key)]
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      merged[key] = raw as T[keyof T]
    }
  }
  return merged
}

function mergeStrings<T extends object>(base: T, value: unknown): T {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return base

  const merged = { ...base } as T
  const source = value as Record<string, unknown>

  for (const key of Object.keys(base) as Array<keyof T>) {
    const raw = source[String(key)]
    if (typeof raw === 'string' && raw.trim()) {
      merged[key] = raw.trim() as T[keyof T]
    }
  }
  return merged
}

function mergeTypography(base: Md3TypographyScale, value: unknown): Md3TypographyScale {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return base

  const merged = { ...base }

  for (const [variant, rawStyle] of Object.entries(value)) {
    if (!(variant in merged) || !rawStyle || typeof rawStyle !== 'object' || Array.isArray(rawStyle)) {
      continue
    }

    const style = rawStyle as Partial<Md3TypographyStyle>
    merged[variant as TypographyVariant] = {
      fontFamily: typeof style.fontFamily === 'string' && style.fontFamily.trim()
        ? style.fontFamily.trim()
        : merged[variant as TypographyVariant].fontFamily,
      fontSize: typeof style.fontSize === 'number' && Number.isFinite(style.fontSize)
        ? style.fontSize
        : merged[variant as TypographyVariant].fontSize,
      lineHeight: typeof style.lineHeight === 'number' && Number.isFinite(style.lineHeight)
        ? style.lineHeight
        : merged[variant as TypographyVariant].lineHeight,
      letterSpacing: typeof style.letterSpacing === 'number' && Number.isFinite(style.letterSpacing)
        ? style.letterSpacing
        : merged[variant as TypographyVariant].letterSpacing,
      fontWeight: typeof style.fontWeight === 'number' && Number.isFinite(style.fontWeight)
        ? style.fontWeight
        : merged[variant as TypographyVariant].fontWeight,
    }
  }

  return merged
}

export function updateDesignTokenSeed(tokens: DesignTokens, patch: Partial<DesignTokenSeed>): DesignTokens {
  const seed = toDesignTokenSeed(tokens)
  return createDesignTokens({ ...seed, ...patch })
}

export function normalizeDesignTokens(raw: unknown, fallback: DesignTokens = AVONTUS_TOKENS): DesignTokens {
  const baseSeed = toDesignTokenSeed(fallback)

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return createDesignTokens(baseSeed)
  }

  const source = raw as Record<string, unknown>
  const colors = source.colors as Record<string, unknown> | undefined
  const typography = source.typography as Record<string, unknown> | undefined

  const seed: Partial<DesignTokenSeed> = {
    ...baseSeed,
    primaryColor: typeof source.primaryColor === 'string' ? source.primaryColor : (typeof colors?.primary === 'string' ? colors.primary : baseSeed.primaryColor),
    secondaryColor: typeof source.secondaryColor === 'string' ? source.secondaryColor : (typeof colors?.secondary === 'string' ? colors.secondary : baseSeed.secondaryColor),
    tertiaryColor: typeof source.tertiaryColor === 'string' ? source.tertiaryColor : (typeof colors?.tertiary === 'string' ? colors.tertiary : baseSeed.tertiaryColor),
    backgroundColor: typeof source.backgroundColor === 'string' ? source.backgroundColor : (typeof colors?.background === 'string' ? colors.background : baseSeed.backgroundColor),
    surfaceColor: typeof source.surfaceColor === 'string' ? source.surfaceColor : (typeof colors?.surface === 'string' ? colors.surface : baseSeed.surfaceColor),
    errorColor: typeof source.errorColor === 'string' ? source.errorColor : (typeof colors?.error === 'string' ? colors.error : baseSeed.errorColor),
    fontFamily: typeof source.fontFamily === 'string'
      ? source.fontFamily
      : (typeof typography?.BodyMedium === 'object' && typography.BodyMedium && typeof (typography.BodyMedium as Record<string, unknown>).fontFamily === 'string'
        ? String((typography.BodyMedium as Record<string, unknown>).fontFamily)
        : baseSeed.fontFamily),
    borderRadius: source.borderRadius && ['sharp', 'slightly-rounded', 'rounded', 'pill'].includes(String(source.borderRadius))
      ? (String(source.borderRadius) as BorderRadiusPreset)
      : baseSeed.borderRadius,
  }

  const tokens = createDesignTokens(seed)
  tokens.colors = mergeStrings(tokens.colors, source.colors)
  tokens.states = mergeNumbers(tokens.states, source.states)
  tokens.elevation = mergeStrings(tokens.elevation, source.elevation)
  tokens.shape = mergeNumbers(tokens.shape, source.shape)
  tokens.typography = mergeTypography(tokens.typography, source.typography)

  return tokens
}

export const DEFAULT_TOKENS: DesignTokens = createDesignTokens(DEFAULT_SEED)

export const AVONTUS_TOKENS: DesignTokens = createDesignTokens({
  primaryColor: '#0A3EFF',
  secondaryColor: '#10296E',
  tertiaryColor: '#6F9DFF',
  backgroundColor: '#FFFFFF',
  surfaceColor: '#FFFFFF',
  errorColor: '#E64059',
  fontFamily: 'Switzer',
  borderRadius: 'sharp',
})

export const DEFAULT_DESIGN_BRIEF: DesignBrief = {
  companyName: 'Avontus',
  productName: 'Quantify',
  industry: 'Scaffolding and equipment management software',
  targetUsers: 'Branch office coordinators, dispatchers, field supervisors, scaffolding company managers',
  keyWorkflows: 'Reservation creation, shipping, check-in/check-out, branch coordination, inventory management',
  businessGoals: 'Reduce shipment errors, speed up fulfillment, improve operational visibility — Reach New Heights',
  brandPersonality: 'Confident, Forward-Looking, Grounded, Optimistic, Energetic, Conversational — premium enterprise feel with Probe Blue (#0A3EFF) as the brand cornerstone, sharp 0px corners, Switzer typeface',
  qualityBar: 'World-class enterprise tool: clear rhythm, intentional whitespace, branded color hierarchy, production-ready MD3 polish',
}

function normalizeBriefField(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : fallback
}

export function normalizeDesignBrief(
  raw: unknown,
  fallback: DesignBrief = DEFAULT_DESIGN_BRIEF,
): DesignBrief {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...fallback }
  }

  const source = raw as Record<string, unknown>

  return {
    companyName: normalizeBriefField(source.companyName, fallback.companyName),
    productName: normalizeBriefField(source.productName, fallback.productName),
    industry: normalizeBriefField(source.industry, fallback.industry),
    targetUsers: normalizeBriefField(source.targetUsers, fallback.targetUsers),
    keyWorkflows: normalizeBriefField(source.keyWorkflows, fallback.keyWorkflows),
    businessGoals: normalizeBriefField(source.businessGoals, fallback.businessGoals),
    brandPersonality: normalizeBriefField(source.brandPersonality, fallback.brandPersonality),
    qualityBar: normalizeBriefField(source.qualityBar, fallback.qualityBar),
  }
}

export function updateDesignBrief(
  brief: DesignBrief,
  patch: Partial<DesignBrief>,
): DesignBrief {
  return normalizeDesignBrief({ ...brief, ...patch }, brief)
}

export interface ComponentNode {
  id: string
  type: ComponentType
  properties: Record<string, string>
  children?: ComponentNode[]
}

export type ComponentType =
  | 'Page'
  | 'StackPanel'
  | 'Grid'
  | 'ScrollViewer'
  | 'TextBlock'
  | 'Button'
  | 'TextBox'
  | 'PasswordBox'
  | 'Image'
  | 'Border'
  | 'PersonPicture'
  | 'ToggleSwitch'
  | 'CheckBox'
  | 'RadioButton'
  | 'Slider'
  | 'ProgressBar'
  | 'ProgressRing'
  | 'NavigationBar'
  | 'BottomNavigationBar'
  | 'Card'
  | 'Divider'
  | 'Icon'
  | 'FloatingActionButton'
  | 'Chip'
  | 'ListView'
  | 'GridView'
  | 'NavigationViewItem'
  | 'Select'
  | 'DatePicker'
  | 'IconButton'
  | 'SegmentedButton'
  | 'Tabs'
  | 'Snackbar'
  | 'Badge'
  | 'Dialog'
  | 'BottomSheet'
  | 'InfoBar'
  | 'DataTable'
  | 'Stepper'
  | 'Tooltip'
  | 'TimePicker'
  | 'AutoSuggestBox'
  | 'NavigationRail'
  | 'NavigationDrawer'
  | 'ValidationSummary'

export interface ScreenHistoryEntry {
  id: string
  prompt: string
  tree: ComponentNode
  webDesign?: WebDesign | null
  timestamp: number
}

export type ThemeMode = 'dark' | 'light'

export interface QualityToggles {
  // Foundation
  avontusBrand: boolean
  tokenEnforcement: boolean      // was: tokenMap + noGenericFallback
  componentRegistry: boolean
  // Design System
  designDna: boolean             // was: dnaAnalysis + dnaGeneration
  designSystem: boolean          // was: designSystemPatterns + designSystemArchitect + artifactFix
  materialDesign: boolean        // was: materialDesign3 + flutterMd3
  // Visual Quality
  visualExcellence: boolean      // was: frontendDesign + creativeDesign + aestheticReview
  typography: boolean
  designStandards: boolean       // was: uiuxDesignAudit + uiDesignPrinciples + uxDesignExpert
  // User Experience
  uxPsychology: boolean
  gestalt: boolean
  interaction: boolean
  // Content & Data
  microcopy: boolean
  accessibility: boolean
  dataHeavyDesign: boolean
}

export const DEFAULT_QUALITY_TOGGLES: QualityToggles = {
  avontusBrand: true,
  tokenEnforcement: false,
  componentRegistry: false,
  designDna: false,
  designSystem: false,
  materialDesign: false,
  visualExcellence: false,
  typography: false,
  designStandards: false,
  uxPsychology: false,
  gestalt: false,
  interaction: false,
  microcopy: false,
  accessibility: false,
  dataHeavyDesign: false,
}

export interface AppState {
  designTokens: DesignTokens
  designBrief: DesignBrief
  themeMode: ThemeMode
  hasCompletedOnboarding: boolean
  currentTree: ComponentNode | null
  currentWebDesign: WebDesign | null
  selectedComponentId: string | null
  screenHistory: ScreenHistoryEntry[]
  isGenerating: boolean
  isImproving: boolean
  promptHistory: string[]
  error: string | null
  qualityToggles: QualityToggles
  canUndo: boolean
  canRedo: boolean
  previousWebDesign: WebDesign | null
  improveDecisions: Decision[] | null
  showingBefore: boolean
  improveHistory: ImproveSnapshot[]
  originalWebDesign: WebDesign | null
  viewingImproveIndex: number | null
  currentImageDataUri: string | null
}

export type AppAction =
  | { type: 'SET_TOKENS'; tokens: DesignTokens }
  | { type: 'SET_DESIGN_BRIEF'; brief: Partial<DesignBrief> }
  | { type: 'SET_THEME_MODE'; mode: ThemeMode }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'SET_TREE'; tree: ComponentNode; prompt: string; webDesign?: WebDesign | null; imageDataUri?: string | null }
  | { type: 'UPDATE_COMPONENT'; id: string; properties: Record<string, string> }
  | { type: 'SELECT_COMPONENT'; id: string | null }
  | { type: 'SET_GENERATING'; value: boolean }
  | { type: 'RESTORE_HISTORY'; entry: ScreenHistoryEntry }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'CLEAR_SCREEN' }
  | { type: 'REORDER_CHILDREN'; parentId: string; fromIndex: number; toIndex: number }
  | { type: 'DELETE_COMPONENT'; id: string }
  | { type: 'ADD_CHILD'; parentId: string; child: ComponentNode }
  | { type: 'DROP_COMPONENT_ON_CANVAS'; child: ComponentNode }
  | { type: 'MOVE_COMPONENT'; id: string; left: number; top: number }
  | { type: 'START_BLANK_CANVAS' }
  | { type: 'INSERT_CHILD'; parentId: string; child: ComponentNode; index: number }
  | { type: 'DUPLICATE_COMPONENT'; id: string }
  | { type: 'SET_QUALITY_TOGGLES'; toggles: Partial<QualityToggles> }
  | { type: 'DELETE_HISTORY_ENTRY'; id: string }
  | { type: 'CLEAR_ALL_HISTORY' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_IMPROVING'; value: boolean }
  | { type: 'SET_IMPROVE_RESULT'; previousWebDesign: WebDesign; webDesign: WebDesign; decisions: Decision[]; lensCount: number }
  | { type: 'SET_SHOW_BEFORE'; value: boolean }
  | { type: 'VIEW_IMPROVE_VERSION'; index: number | null }
  | { type: 'REVERT_TO_VERSION'; index: number }
  | { type: 'UPDATE_WEB_DESIGN'; html: string; css: string }

export interface EditableProperty {
  key: string
  label: string
  type: 'text' | 'color' | 'select' | 'number' | 'boolean'
  options?: string[]
}

export const COMPONENT_EDITABLE_PROPS: Record<string, EditableProperty[]> = {
  TextBlock: [
    { key: 'Text', label: 'Text', type: 'text' },
    { key: 'Foreground', label: 'Color', type: 'color' },
  ],
  Button: [
    { key: 'Content', label: 'Label', type: 'text' },
    { key: 'Style', label: 'Variant', type: 'select', options: ['Filled', 'Outlined', 'Text', 'Elevated', 'Tonal'] },
    { key: 'IsEnabled', label: 'Enabled', type: 'boolean' },
  ],
  TextBox: [
    { key: 'Header', label: 'Label', type: 'text' },
    { key: 'PlaceholderText', label: 'Placeholder', type: 'text' },
    { key: 'Text', label: 'Value', type: 'text' },
  ],
  PasswordBox: [
    { key: 'Header', label: 'Label', type: 'text' },
    { key: 'PlaceholderText', label: 'Placeholder', type: 'text' },
  ],
  Image: [
    { key: 'Source', label: 'Image URL', type: 'text' },
  ],
  PersonPicture: [
    { key: 'DisplayName', label: 'Name', type: 'text' },
  ],
  ToggleSwitch: [
    { key: 'Header', label: 'Label', type: 'text' },
    { key: 'IsOn', label: 'On', type: 'boolean' },
  ],
  CheckBox: [
    { key: 'Content', label: 'Label', type: 'text' },
    { key: 'IsChecked', label: 'Checked', type: 'boolean' },
  ],
  Slider: [
    { key: 'Header', label: 'Label', type: 'text' },
    { key: 'Value', label: 'Value', type: 'number' },
  ],
  Card: [
    { key: 'Style', label: 'Variant', type: 'select', options: ['Elevated', 'Filled', 'Outlined'] },
  ],
  NavigationBar: [
    { key: 'Content', label: 'Title', type: 'text' },
    { key: 'MainCommand', label: 'Left Button', type: 'select', options: ['Back', 'Close', 'None'] },
  ],
  Icon: [
    { key: 'Glyph', label: 'Icon Name', type: 'text' },
    { key: 'Foreground', label: 'Color', type: 'color' },
  ],
  FloatingActionButton: [
    { key: 'Content', label: 'Icon Name', type: 'text' },
    { key: 'Style', label: 'Variant', type: 'select', options: ['Primary', 'Secondary', 'Tertiary', 'Surface'] },
  ],
  Chip: [
    { key: 'Content', label: 'Label', type: 'text' },
  ],
  ProgressBar: [
    { key: 'Value', label: 'Progress %', type: 'number' },
  ],
  RadioButton: [
    { key: 'Content', label: 'Label', type: 'text' },
    { key: 'IsChecked', label: 'Selected', type: 'boolean' },
  ],
  // Layout containers effectively have no editable properties for simple users
  StackPanel: [],
  Grid: [],
  Border: [],
  Page: [
    { key: 'Background', label: 'Background Color', type: 'color' },
  ],
  ScrollViewer: [],
  ListView: [],
  GridView: [],
  Divider: [],
  BottomNavigationBar: [],
  NavigationViewItem: [
    { key: 'Content', label: 'Label', type: 'text' },
    { key: 'Icon', label: 'Icon', type: 'text' },
  ],
  ProgressRing: [],
  Select: [
    { key: 'Header', label: 'Label', type: 'text' },
    { key: 'PlaceholderText', label: 'Placeholder', type: 'text' },
    { key: 'SelectedItem', label: 'Selected', type: 'text' },
  ],
  DatePicker: [
    { key: 'Header', label: 'Label', type: 'text' },
    { key: 'Date', label: 'Date', type: 'text' },
  ],
  IconButton: [
    { key: 'Glyph', label: 'Icon', type: 'text' },
    { key: 'Style', label: 'Variant', type: 'select', options: ['Standard', 'Filled', 'FilledTonal', 'Outlined'] },
  ],
  SegmentedButton: [],
  Tabs: [],
  Snackbar: [
    { key: 'Content', label: 'Message', type: 'text' },
    { key: 'ActionText', label: 'Action', type: 'text' },
  ],
  Badge: [
    { key: 'Content', label: 'Text', type: 'text' },
    { key: 'Style', label: 'Variant', type: 'select', options: ['Error', 'Info', 'Success', 'Warning'] },
  ],
  Dialog: [
    { key: 'Title', label: 'Title', type: 'text' },
  ],
  BottomSheet: [],
  InfoBar: [
    { key: 'Content', label: 'Message', type: 'text' },
    { key: 'Style', label: 'Severity', type: 'select', options: ['Info', 'Success', 'Warning', 'Error'] },
  ],
  DataTable: [
    { key: 'SelectionMode', label: 'Selection', type: 'select', options: ['Single', 'Extended', 'None'] },
    { key: 'IsReadOnly', label: 'Read Only', type: 'boolean' },
  ],
  Stepper: [
    { key: 'Header', label: 'Label', type: 'text' },
    { key: 'Value', label: 'Value', type: 'number' },
    { key: 'Min', label: 'Min', type: 'number' },
    { key: 'Max', label: 'Max', type: 'number' },
    { key: 'Step', label: 'Step', type: 'number' },
  ],
  Tooltip: [
    { key: 'Content', label: 'Text', type: 'text' },
    { key: 'Title', label: 'Title', type: 'text' },
    { key: 'Placement', label: 'Placement', type: 'select', options: ['Top', 'Bottom', 'Left', 'Right'] },
  ],
  TimePicker: [
    { key: 'Header', label: 'Label', type: 'text' },
    { key: 'Time', label: 'Time', type: 'text' },
    { key: 'ClockIdentifier', label: 'Format', type: 'select', options: ['12HourClock', '24HourClock'] },
  ],
  AutoSuggestBox: [
    { key: 'Header', label: 'Label', type: 'text' },
    { key: 'PlaceholderText', label: 'Placeholder', type: 'text' },
    { key: 'Text', label: 'Value', type: 'text' },
  ],
  NavigationRail: [],
  NavigationDrawer: [
    { key: 'Header', label: 'Title', type: 'text' },
    { key: 'IsPaneOpen', label: 'Open', type: 'boolean' },
  ],
  ValidationSummary: [
    { key: 'Title', label: 'Title', type: 'text' },
    { key: 'IsOpen', label: 'Open', type: 'boolean' },
  ],
}

// ─── Component Palette ───

export interface PaletteItem {
  type: ComponentType
  label: string
  props?: Record<string, string>
}

export interface PaletteCategory {
  id: string
  label: string
  items: PaletteItem[]
}

function v(type: ComponentType, label: string, props?: Record<string, string>): PaletteItem {
  return { type, label, props }
}

export const COMPONENT_PALETTE_CATEGORIES: PaletteCategory[] = [
  {
    id: 'actions', label: 'Actions', items: [
      v('Button', 'Filled Button', { Style: 'Filled' }),
      v('Button', 'Outlined Button', { Style: 'Outlined' }),
      v('Button', 'Text Button', { Style: 'Text' }),
      v('Button', 'Elevated Button', { Style: 'Elevated' }),
      v('Button', 'Tonal Button', { Style: 'Tonal' }),
      v('IconButton', 'Icon Button', { Style: 'Standard' }),
      v('IconButton', 'Filled Icon Btn', { Style: 'Filled' }),
      v('IconButton', 'Tonal Icon Btn', { Style: 'FilledTonal' }),
      v('IconButton', 'Outlined Icon Btn', { Style: 'Outlined' }),
      v('FloatingActionButton', 'FAB', { Style: 'Primary' }),
      v('FloatingActionButton', 'Surface FAB', { Style: 'Surface' }),
      v('SegmentedButton', 'Segments'),
    ],
  },
  {
    id: 'input', label: 'Inputs', items: [
      v('TextBox', 'Text Field'),
      v('PasswordBox', 'Password'),
      v('Select', 'Dropdown'),
      v('DatePicker', 'Date Picker'),
      v('TimePicker', 'Time Picker'),
      v('AutoSuggestBox', 'Search Field'),
      v('Slider', 'Slider'),
      v('Stepper', 'Stepper'),
    ],
  },
  {
    id: 'selection', label: 'Selection', items: [
      v('CheckBox', 'Checkbox'),
      v('RadioButton', 'Radio'),
      v('ToggleSwitch', 'Toggle'),
      v('Chip', 'Assist Chip', { Style: 'Assist' }),
      v('Chip', 'Filter Chip', { Style: 'Filter' }),
      v('Chip', 'Input Chip', { Style: 'Input' }),
      v('Chip', 'Suggestion Chip', { Style: 'Suggestion' }),
    ],
  },
  {
    id: 'navigation', label: 'Navigation', items: [
      v('NavigationBar', 'Top App Bar'),
      v('BottomNavigationBar', 'Bottom Nav'),
      v('Tabs', 'Tabs'),
      v('NavigationRail', 'Nav Rail'),
      v('NavigationDrawer', 'Nav Drawer'),
      v('NavigationViewItem', 'Nav Item'),
    ],
  },
  {
    id: 'containers', label: 'Containment', items: [
      v('Card', 'Elevated Card', { Style: 'Elevated' }),
      v('Card', 'Filled Card', { Style: 'Filled' }),
      v('Card', 'Outlined Card', { Style: 'Outlined' }),
      v('Dialog', 'Dialog'),
      v('BottomSheet', 'Bottom Sheet'),
      v('Border', 'Container'),
    ],
  },
  {
    id: 'display', label: 'Display', items: [
      v('TextBlock', 'Text'),
      v('Image', 'Image'),
      v('PersonPicture', 'Avatar'),
      v('Icon', 'Icon'),
      v('Badge', 'Badge'),
      v('Divider', 'Divider'),
    ],
  },
  {
    id: 'data', label: 'Lists & Data', items: [
      v('ListView', 'List'),
      v('GridView', 'Grid View'),
      v('DataTable', 'Data Table'),
    ],
  },
  {
    id: 'feedback', label: 'Feedback', items: [
      v('ProgressBar', 'Progress Bar'),
      v('ProgressRing', 'Spinner'),
      v('Snackbar', 'Snackbar'),
      v('InfoBar', 'Info Bar', { Style: 'Info' }),
      v('InfoBar', 'Success Bar', { Style: 'Success' }),
      v('InfoBar', 'Warning Bar', { Style: 'Warning' }),
      v('InfoBar', 'Error Bar', { Style: 'Error' }),
      v('Tooltip', 'Tooltip'),
    ],
  },
  {
    id: 'layout', label: 'Layout', items: [
      v('StackPanel', 'Stack'),
      v('Grid', 'Grid'),
      v('ScrollViewer', 'Scroll View'),
    ],
  },
]

const CONTAINER_TYPES: ComponentType[] = [
  'Page', 'StackPanel', 'Grid', 'ScrollViewer', 'Border', 'Card', 'ListView', 'GridView',
  'Dialog', 'BottomSheet', 'Tabs', 'SegmentedButton', 'DataTable', 'NavigationRail', 'NavigationDrawer', 'ValidationSummary',
]

// Avontus Design System defaults — matches latest design system tokens
// Colors: primary #0A3EFF, surface #FAFBFF, outline-variant #CAC4D0
// on-surface #1C1B1F, on-surface-variant #49454F, outline #79747E
const DEFAULT_PROPS: Partial<Record<ComponentType, Record<string, string>>> = {
  TextBlock: { Text: 'Text label', Style: 'BodyMedium', Foreground: '#1C1B1F' },
  Button: { Content: 'Button', Style: 'Filled' },
  TextBox: { Header: 'Field label', PlaceholderText: 'Enter text...' },
  PasswordBox: { Header: 'Password', PlaceholderText: 'Enter password...' },
  Image: { Width: '200', Height: '120' },
  CheckBox: { Content: 'Checkbox option' },
  RadioButton: { Content: 'Radio option' },
  ToggleSwitch: { Header: 'Toggle setting' },
  Slider: { Minimum: '0', Maximum: '100', Value: '50' },
  Card: { Style: 'Outlined', Padding: '16' },
  Icon: { Glyph: 'Star', FontSize: '24', Foreground: '#0A3EFF' },
  Chip: { Content: 'Chip label', Style: 'Suggestion' },
  FloatingActionButton: { Content: 'Plus', Style: 'Primary' },
  ProgressBar: { Value: '50' },
  NavigationBar: { Content: 'Screen title', MainCommand: 'Back' },
  StackPanel: { Spacing: '16', Padding: '16', Orientation: 'Vertical' },
  Grid: { RowSpacing: '16', ColumnSpacing: '16', Padding: '16' },
  PersonPicture: { DisplayName: 'John', Width: '48' },
  NavigationViewItem: { Content: 'Menu item', Icon: 'Home' },
  Divider: {},
  ProgressRing: {},
  Border: { Padding: '16', CornerRadius: '12', BorderBrush: '#CAC4D0', Background: '#FAFBFF' },
  ScrollViewer: {},
  Page: { Background: '#FFFFFF' },
  ListView: {},
  GridView: {},
  BottomNavigationBar: {},
  Select: { Header: 'Select option', PlaceholderText: 'Choose...', SelectedItem: '' },
  DatePicker: { Header: 'Date', Date: '' },
  IconButton: { Glyph: 'Settings', Style: 'Standard' },
  SegmentedButton: {},
  Tabs: {},
  Snackbar: { Content: 'Changes saved successfully', ActionText: 'Undo' },
  Badge: { Content: '3', Style: 'Error' },
  Dialog: { Title: 'Dialog title', Padding: '24' },
  BottomSheet: { Padding: '24' },
  InfoBar: { Content: 'This is an informational message.', Style: 'Info' },
  DataTable: { SelectionMode: 'Single', IsReadOnly: 'True' },
  Stepper: { Header: 'Quantity', Value: '1', Min: '0', Max: '99', Step: '1' },
  Tooltip: { Content: 'Tooltip text', Placement: 'Top' },
  TimePicker: { Header: 'Time', Time: '', ClockIdentifier: '12HourClock' },
  AutoSuggestBox: { Header: 'Search', PlaceholderText: 'Type to search...' },
  NavigationRail: {},
  NavigationDrawer: { Header: 'App Name', IsPaneOpen: 'True' },
  ValidationSummary: { Title: 'Validation', IsOpen: 'True' },
}

function rid(): string { return crypto.randomUUID() }

export function createDefaultComponent(type: ComponentType): Omit<ComponentNode, 'id'> {
  const base: Omit<ComponentNode, 'id'> = {
    type,
    properties: { ...(DEFAULT_PROPS[type] || {}) },
    children: CONTAINER_TYPES.includes(type) ? [] : undefined,
  }

  // Pre-populate containers with sample children so they're visible on drop
  switch (type) {
    case 'Card':
      base.children = [
        { id: rid(), type: 'TextBlock', properties: { Text: 'Card title', Style: 'TitleMedium', Foreground: '#1C1B1F' } },
        { id: rid(), type: 'TextBlock', properties: { Text: 'Card description text goes here.', Style: 'BodyMedium', Foreground: '#49454F' } },
      ]
      break
    case 'BottomNavigationBar':
      base.children = [
        { id: rid(), type: 'NavigationViewItem', properties: { Content: 'Home', Icon: 'Home', IsSelected: 'True' } },
        { id: rid(), type: 'NavigationViewItem', properties: { Content: 'Search', Icon: 'Search' } },
        { id: rid(), type: 'NavigationViewItem', properties: { Content: 'Profile', Icon: 'Person' } },
      ]
      break
    case 'ListView':
      base.children = [
        { id: rid(), type: 'TextBlock', properties: { Text: 'List item 1', Style: 'BodyLarge', Foreground: '#1C1B1F' } },
        { id: rid(), type: 'TextBlock', properties: { Text: 'List item 2', Style: 'BodyLarge', Foreground: '#1C1B1F' } },
        { id: rid(), type: 'TextBlock', properties: { Text: 'List item 3', Style: 'BodyLarge', Foreground: '#1C1B1F' } },
      ]
      break
    case 'GridView':
      base.children = [
        { id: rid(), type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
          { id: rid(), type: 'TextBlock', properties: { Text: 'Item 1', Style: 'BodyMedium' } },
        ]},
        { id: rid(), type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
          { id: rid(), type: 'TextBlock', properties: { Text: 'Item 2', Style: 'BodyMedium' } },
        ]},
      ]
      break
    case 'NavigationBar':
      base.children = [
        { id: rid(), type: 'Icon', properties: { Glyph: 'Search', FontSize: '22' } },
        { id: rid(), type: 'Icon', properties: { Glyph: 'MoreVert', FontSize: '22' } },
      ]
      break
    case 'SegmentedButton':
      base.children = [
        { id: rid(), type: 'Button', properties: { Content: 'Day', Style: 'Tonal' } },
        { id: rid(), type: 'Button', properties: { Content: 'Week', Style: 'Outlined' } },
        { id: rid(), type: 'Button', properties: { Content: 'Month', Style: 'Outlined' } },
      ]
      break
    case 'Tabs':
      base.children = [
        { id: rid(), type: 'NavigationViewItem', properties: { Content: 'Tab 1', Icon: 'Home', IsSelected: 'True' } },
        { id: rid(), type: 'NavigationViewItem', properties: { Content: 'Tab 2', Icon: 'Search' } },
        { id: rid(), type: 'NavigationViewItem', properties: { Content: 'Tab 3', Icon: 'Settings' } },
      ]
      break
    case 'Dialog':
      base.children = [
        { id: rid(), type: 'TextBlock', properties: { Text: 'Are you sure?', Style: 'BodyMedium', Foreground: '#49454F' } },
        { id: rid(), type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
          { id: rid(), type: 'Button', properties: { Content: 'Cancel', Style: 'Outlined' } },
          { id: rid(), type: 'Button', properties: { Content: 'Confirm', Style: 'Filled' } },
        ]},
      ]
      break
    case 'BottomSheet':
      base.children = [
        { id: rid(), type: 'Divider', properties: {} },
        { id: rid(), type: 'TextBlock', properties: { Text: 'Bottom sheet', Style: 'TitleMedium', Foreground: '#1C1B1F' } },
        { id: rid(), type: 'TextBlock', properties: { Text: 'Sheet content goes here.', Style: 'BodyMedium', Foreground: '#49454F' } },
      ]
      break
    case 'DataTable':
      base.children = [
        { id: rid(), type: 'TextBlock', properties: { Text: 'Name', Style: 'LabelMedium', Foreground: '#49454F' } },
        { id: rid(), type: 'TextBlock', properties: { Text: 'Status', Style: 'LabelMedium', Foreground: '#49454F' } },
        { id: rid(), type: 'TextBlock', properties: { Text: 'Qty', Style: 'LabelMedium', Foreground: '#49454F' } },
      ]
      break
    case 'NavigationRail':
      base.children = [
        { id: rid(), type: 'NavigationViewItem', properties: { Content: 'Home', Icon: 'Home', IsSelected: 'True' } },
        { id: rid(), type: 'NavigationViewItem', properties: { Content: 'Search', Icon: 'Search' } },
        { id: rid(), type: 'NavigationViewItem', properties: { Content: 'Settings', Icon: 'Settings' } },
      ]
      break
    case 'NavigationDrawer':
      base.children = [
        { id: rid(), type: 'NavigationViewItem', properties: { Content: 'Home', Icon: 'Home', IsSelected: 'True' } },
        { id: rid(), type: 'NavigationViewItem', properties: { Content: 'Orders', Icon: 'ShoppingCart' } },
        { id: rid(), type: 'NavigationViewItem', properties: { Content: 'Reports', Icon: 'BarChart' } },
        { id: rid(), type: 'NavigationViewItem', properties: { Content: 'Settings', Icon: 'Settings' } },
      ]
      break
  }

  return base
}

export function assignIds(node: Record<string, unknown>): ComponentNode {
  return {
    ...(node as Omit<ComponentNode, 'id'>),
    id: crypto.randomUUID(),
    children: (node.children as Record<string, unknown>[] | undefined)?.map(assignIds),
  } as ComponentNode
}
