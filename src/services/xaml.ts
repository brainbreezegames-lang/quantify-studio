import { AVONTUS_TOKENS, type ComponentNode, type ComponentType, type DesignTokens, type TypographyVariant } from '../types'

export type XamlDiagnosticSeverity = 'info' | 'warning' | 'error'

export interface XamlDiagnostic {
  code: string
  severity: XamlDiagnosticSeverity
  message: string
  nodeId?: string
  nodeType?: string
}

export interface XamlBindingHint {
  nodeId: string
  property: string
  path: string
  mode?: string
}

export interface XamlNodeIR {
  id: string
  type: string
  tag: string
  xName: string
  xUid: string
  automationId: string
  automationName?: string
  semanticRole: string
  stateHints: string[]
  templateHint?: string
  bindingHints: XamlBindingHint[]
  diagnostics: XamlDiagnostic[]
  properties: Record<string, string>
  children: XamlNodeIR[]
}

export interface XamlResourceDictionaryIR {
  brushes: Array<{ key: string; color: string }>
  doubles: Array<{ key: string; value: number }>
  textStyles: Array<{
    key: string
    fontFamily: string
    fontSize: number
    fontWeight: string
    lineHeight: number
    characterSpacing: number
    foregroundBrushKey: string
  }>
  controlStyles: Array<{
    key: string
    targetType: string
    setters: Array<{ property: string; value: string }>
  }>
}

export interface XamlConversionReport {
  xaml: string
  root: XamlNodeIR
  diagnostics: XamlDiagnostic[]
  bindingHints: XamlBindingHint[]
  resources: XamlResourceDictionaryIR
}

const XAML_NAMESPACES = [
  'xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"',
  'xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"',
  'xmlns:utu="using:Uno.Toolkit.UI"',
  'xmlns:um="using:Uno.Material"',
]

const TEXT_STYLE_KEYS: TypographyVariant[] = [
  'DisplayLarge',
  'DisplayMedium',
  'DisplaySmall',
  'HeadlineLarge',
  'HeadlineMedium',
  'HeadlineSmall',
  'TitleLarge',
  'TitleMedium',
  'TitleSmall',
  'BodyLarge',
  'BodyMedium',
  'BodySmall',
  'LabelLarge',
  'LabelMedium',
  'LabelSmall',
]

const ICON_TEXT_MAP: Record<string, string> = {
  Add: '+',
  AlertCircle: '!',
  AlertTriangle: '!',
  ArrowBack: '<',
  ArrowDown: 'v',
  ArrowForward: '>',
  ArrowLeft: '<',
  ArrowRight: '>',
  ArrowUp: '^',
  Cancel: 'x',
  Check: '✓',
  CheckCircle: '✓',
  ChevronDown: 'v',
  ChevronLeft: '<',
  ChevronRight: '>',
  ChevronUp: '^',
  Close: 'x',
  Delete: '⌫',
  Edit: '✎',
  Filter: '≡',
  FilterList: '≡',
  Home: '⌂',
  Info: 'i',
  Menu: '☰',
  Minus: '-',
  MoreVert: '⋯',
  MoreVertical: '⋯',
  Person: '◉',
  Place: '⌖',
  Plus: '+',
  Refresh: '↻',
  Remove: '-',
  Search: '⌕',
  Send: '➜',
  Settings: '⚙',
  Star: '★',
  Warning: '!',
  X: 'x',
  XCircle: 'x',
}

const SELF_CLOSING_STANDARD_TYPES = new Set([
  'TextBlock',
  'TextBox',
  'PasswordBox',
  'CheckBox',
  'RadioButton',
  'ToggleSwitch',
  'Slider',
  'ProgressBar',
  'ProgressRing',
  'DatePicker',
  'TimePicker',
  'AutoSuggestBox',
  'ComboBox',
])

function indent(depth: number): string {
  return '    '.repeat(depth)
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function xmlCommentEscape(value: string): string {
  return value.replace(/--/g, '- -')
}

function toFontWeight(weight: number): string {
  if (weight >= 700) return 'Bold'
  if (weight >= 600) return 'SemiBold'
  if (weight >= 500) return 'Medium'
  return 'Normal'
}

function toCharacterSpacing(letterSpacing: number): number {
  return Math.round(letterSpacing * 100)
}

function toXName(id: string): string {
  const words = String(id || 'node')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))

  const joined = words.join('') || 'Node'
  return /^[A-Za-z_]/.test(joined) ? joined : `Node${joined}`
}

function toBindingPath(label: string): string {
  const words = label
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())

  return words.join('') || 'Action'
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function normalizeColor(value: string): string {
  return value.trim().toUpperCase()
}

function semanticRoleForNode(node: ComponentNode, parentType?: string | null): string {
  switch (node.type) {
    case 'NavigationBar':
      return 'top-app-bar'
    case 'BottomNavigationBar':
      return 'bottom-navigation'
    case 'Card':
      return parentType === 'ListView' || parentType === 'GridView' ? 'list-card' : 'surface-card'
    case 'Button':
      return 'action-button'
    case 'IconButton':
      return 'icon-button'
    case 'TextBox':
    case 'PasswordBox':
    case 'Select':
    case 'DatePicker':
    case 'TimePicker':
    case 'AutoSuggestBox':
      return 'form-input'
    case 'ListView':
      return 'list'
    case 'GridView':
      return 'grid-list'
    case 'Dialog':
      return 'dialog-surface'
    case 'BottomSheet':
      return 'bottom-sheet-surface'
    case 'InfoBar':
      return 'status-banner'
    case 'ValidationSummary':
      return 'validation-summary'
    default:
      return node.type.toLowerCase()
  }
}

function stateHintsForNode(node: ComponentNode): string[] {
  const hints = ['Normal']

  if (node.type === 'Button' || node.type === 'IconButton' || node.type === 'FloatingActionButton' || node.type === 'Chip') {
    hints.push('PointerOver', 'Pressed', 'Disabled')
  }

  if (node.type === 'TextBox' || node.type === 'PasswordBox' || node.type === 'AutoSuggestBox' || node.type === 'Select') {
    hints.push('Focused', 'Disabled')
  }

  if (node.properties.IsSelected === 'True' || node.properties.IsChecked === 'True' || node.properties.IsOn === 'True') {
    hints.push('Selected')
  }

  return hints
}

function templateHintForNode(node: ComponentNode): string | undefined {
  switch (node.type) {
    case 'NavigationBar':
      return 'Generated as a standard Grid-based top app bar for stable Uno/WinUI XAML output.'
    case 'BottomNavigationBar':
      return 'Generated as a Grid-based bottom navigation surface.'
    case 'Dialog':
      return 'Generated as an inline dialog surface. Wrap in a modal host for production modal behavior.'
    case 'BottomSheet':
      return 'Generated as an inline bottom sheet surface. Wrap in a host if you need slide-up modal behavior.'
    case 'DataTable':
      return 'Generated as a static Grid skeleton. Replace with a data-bound table for production data workflows.'
    default:
      return undefined
  }
}

function automationNameForNode(node: ComponentNode): string | undefined {
  const p = node.properties
  return (
    p.AutomationName
    || p.Content
    || p.Text
    || p.Header
    || p.Title
    || p.Glyph
    || p.Icon
    || undefined
  )
}

function createBrushResources(tokens: DesignTokens): Array<{ key: string; color: string }> {
  return [
    { key: 'PrimaryBrush', color: tokens.colors.primary },
    { key: 'OnPrimaryBrush', color: tokens.colors.onPrimary },
    { key: 'PrimaryContainerBrush', color: tokens.colors.primaryContainer },
    { key: 'OnPrimaryContainerBrush', color: tokens.colors.onPrimaryContainer },
    { key: 'SecondaryBrush', color: tokens.colors.secondary },
    { key: 'OnSecondaryBrush', color: tokens.colors.onSecondary },
    { key: 'TertiaryBrush', color: tokens.colors.tertiary },
    { key: 'OnTertiaryBrush', color: tokens.colors.onTertiary },
    { key: 'ErrorBrush', color: tokens.colors.error },
    { key: 'OnErrorBrush', color: tokens.colors.onError },
    { key: 'BackgroundBrush', color: tokens.colors.background },
    { key: 'SurfaceBrush', color: tokens.colors.surface },
    { key: 'SurfaceVariantBrush', color: tokens.colors.surfaceVariant },
    { key: 'OnSurfaceBrush', color: tokens.colors.onSurface },
    { key: 'OnSurfaceVariantBrush', color: tokens.colors.onSurfaceVariant },
    { key: 'InverseSurfaceBrush', color: tokens.colors.inverseSurface },
    { key: 'InverseOnSurfaceBrush', color: tokens.colors.inverseOnSurface },
    { key: 'OutlineBrush', color: tokens.colors.outline },
    { key: 'OutlineVariantBrush', color: tokens.colors.outlineVariant },
    { key: 'SurfaceContainerBrush', color: tokens.colors.surfaceContainer },
    { key: 'SurfaceContainerHighBrush', color: tokens.colors.surfaceContainerHigh },
    { key: 'SurfaceContainerHighestBrush', color: tokens.colors.surfaceContainerHighest },
  ]
}

function createDoubleResources(): Array<{ key: string; value: number }> {
  return [
    { key: 'SpacingXXS', value: 4 },
    { key: 'SpacingXS', value: 8 },
    { key: 'SpacingSM', value: 12 },
    { key: 'SpacingMD', value: 16 },
    { key: 'SpacingLG', value: 24 },
    { key: 'SpacingXL', value: 32 },
    { key: 'TouchTargetSize', value: 48 },
    { key: 'NavigationBarHeight', value: 56 },
    { key: 'FabSize', value: 56 },
  ]
}

function createTextStyles(tokens: DesignTokens): XamlResourceDictionaryIR['textStyles'] {
  return TEXT_STYLE_KEYS.map((key) => ({
    key,
    fontFamily: tokens.typography[key].fontFamily,
    fontSize: tokens.typography[key].fontSize,
    fontWeight: toFontWeight(tokens.typography[key].fontWeight),
    lineHeight: tokens.typography[key].lineHeight,
    characterSpacing: toCharacterSpacing(tokens.typography[key].letterSpacing),
    foregroundBrushKey: key.startsWith('Label') || key === 'BodySmall' ? 'OnSurfaceVariantBrush' : 'OnSurfaceBrush',
  }))
}

function createControlStyles(tokens: DesignTokens): XamlResourceDictionaryIR['controlStyles'] {
  const mediumRadius = `${tokens.shape.medium}`
  const smallRadius = `${tokens.shape.small}`
  const largeRadius = `${tokens.shape.large}`

  return [
    {
      key: 'FilledButtonStyle',
      targetType: 'Button',
      setters: [
        { property: 'Background', value: '{StaticResource PrimaryBrush}' },
        { property: 'Foreground', value: '{StaticResource OnPrimaryBrush}' },
        { property: 'MinHeight', value: '{StaticResource TouchTargetSize}' },
        { property: 'Padding', value: '24,0' },
        { property: 'CornerRadius', value: mediumRadius },
      ],
    },
    {
      key: 'OutlinedButtonStyle',
      targetType: 'Button',
      setters: [
        { property: 'Background', value: 'Transparent' },
        { property: 'Foreground', value: '{StaticResource PrimaryBrush}' },
        { property: 'BorderBrush', value: '{StaticResource OutlineBrush}' },
        { property: 'BorderThickness', value: '1' },
        { property: 'MinHeight', value: '{StaticResource TouchTargetSize}' },
        { property: 'Padding', value: '24,0' },
        { property: 'CornerRadius', value: mediumRadius },
      ],
    },
    {
      key: 'TextButtonStyle',
      targetType: 'Button',
      setters: [
        { property: 'Background', value: 'Transparent' },
        { property: 'Foreground', value: '{StaticResource PrimaryBrush}' },
        { property: 'Padding', value: '12,0' },
        { property: 'CornerRadius', value: mediumRadius },
      ],
    },
    {
      key: 'ElevatedButtonStyle',
      targetType: 'Button',
      setters: [
        { property: 'Background', value: '{StaticResource SurfaceBrush}' },
        { property: 'Foreground', value: '{StaticResource PrimaryBrush}' },
        { property: 'BorderBrush', value: '{StaticResource OutlineVariantBrush}' },
        { property: 'BorderThickness', value: '1' },
        { property: 'MinHeight', value: '{StaticResource TouchTargetSize}' },
        { property: 'Padding', value: '24,0' },
        { property: 'CornerRadius', value: mediumRadius },
      ],
    },
    {
      key: 'FilledTonalButtonStyle',
      targetType: 'Button',
      setters: [
        { property: 'Background', value: '{StaticResource PrimaryContainerBrush}' },
        { property: 'Foreground', value: '{StaticResource OnPrimaryContainerBrush}' },
        { property: 'MinHeight', value: '{StaticResource TouchTargetSize}' },
        { property: 'Padding', value: '24,0' },
        { property: 'CornerRadius', value: mediumRadius },
      ],
    },
    {
      key: 'GeneratedElevatedCardBorderStyle',
      targetType: 'Border',
      setters: [
        { property: 'Background', value: '{StaticResource SurfaceBrush}' },
        { property: 'BorderBrush', value: '{StaticResource OutlineVariantBrush}' },
        { property: 'BorderThickness', value: '1' },
        { property: 'CornerRadius', value: largeRadius },
      ],
    },
    {
      key: 'GeneratedFilledCardBorderStyle',
      targetType: 'Border',
      setters: [
        { property: 'Background', value: '{StaticResource SurfaceContainerBrush}' },
        { property: 'BorderBrush', value: 'Transparent' },
        { property: 'BorderThickness', value: '0' },
        { property: 'CornerRadius', value: largeRadius },
      ],
    },
    {
      key: 'GeneratedOutlinedCardBorderStyle',
      targetType: 'Border',
      setters: [
        { property: 'Background', value: '{StaticResource SurfaceBrush}' },
        { property: 'BorderBrush', value: '{StaticResource OutlineBrush}' },
        { property: 'BorderThickness', value: '1' },
        { property: 'CornerRadius', value: largeRadius },
      ],
    },
    {
      key: 'GeneratedFabButtonStyle',
      targetType: 'Button',
      setters: [
        { property: 'Background', value: '{StaticResource PrimaryBrush}' },
        { property: 'Foreground', value: '{StaticResource OnPrimaryBrush}' },
        { property: 'Width', value: '{StaticResource FabSize}' },
        { property: 'Height', value: '{StaticResource FabSize}' },
        { property: 'CornerRadius', value: '{StaticResource FabSize}' },
      ],
    },
    {
      key: 'GeneratedAssistChipBorderStyle',
      targetType: 'Border',
      setters: [
        { property: 'Background', value: '{StaticResource SurfaceContainerBrush}' },
        { property: 'BorderBrush', value: '{StaticResource OutlineVariantBrush}' },
        { property: 'BorderThickness', value: '1' },
        { property: 'CornerRadius', value: smallRadius },
      ],
    },
    {
      key: 'GeneratedFilterChipBorderStyle',
      targetType: 'Border',
      setters: [
        { property: 'Background', value: '{StaticResource PrimaryContainerBrush}' },
        { property: 'BorderBrush', value: '{StaticResource PrimaryBrush}' },
        { property: 'BorderThickness', value: '1' },
        { property: 'CornerRadius', value: smallRadius },
      ],
    },
    {
      key: 'GeneratedSuggestionChipBorderStyle',
      targetType: 'Border',
      setters: [
        { property: 'Background', value: '{StaticResource SurfaceBrush}' },
        { property: 'BorderBrush', value: '{StaticResource OutlineVariantBrush}' },
        { property: 'BorderThickness', value: '1' },
        { property: 'CornerRadius', value: smallRadius },
      ],
    },
  ]
}

function createResourceDictionary(tokens: DesignTokens): XamlResourceDictionaryIR {
  return {
    brushes: createBrushResources(tokens),
    doubles: createDoubleResources(),
    textStyles: createTextStyles(tokens),
    controlStyles: createControlStyles(tokens),
  }
}

function inferCommandBinding(node: ComponentNode): XamlBindingHint | null {
  if (node.type !== 'Button' && node.type !== 'IconButton' && node.type !== 'FloatingActionButton') return null

  const label = node.properties.Content || node.properties.Glyph || ''
  if (!label || label === '+' || label === '-') return null

  return {
    nodeId: node.id,
    property: 'Command',
    path: `${toBindingPath(label)}Command`,
  }
}

function inferBindings(node: ComponentNode): XamlBindingHint[] {
  const hints: XamlBindingHint[] = []
  const command = inferCommandBinding(node)
  if (command) hints.push(command)
  return hints
}

function makeDiagnostic(
  severity: XamlDiagnosticSeverity,
  code: string,
  message: string,
  node: ComponentNode,
): XamlDiagnostic {
  return { severity, code, message, nodeId: node.id, nodeType: node.type }
}

function buildNodeIR(
  node: ComponentNode,
  tokens: DesignTokens,
  diagnostics: XamlDiagnostic[],
  bindingHints: XamlBindingHint[],
  parentType: string | null,
): XamlNodeIR {
  const nodeDiagnostics: XamlDiagnostic[] = []
  const localBindings = inferBindings(node)
  const properties: Record<string, string> = {
    ...node.properties,
    'x:Name': toXName(node.id),
    'x:Uid': node.id,
    'AutomationProperties.AutomationId': node.id,
  }

  const automationName = automationNameForNode(node)
  if (automationName) {
    properties['AutomationProperties.Name'] = automationName
  }

  for (const binding of localBindings) {
    if (!properties[binding.property]) {
      properties[binding.property] = `{Binding ${binding.path}}`
    }
  }

  if (properties._OriginalType) {
    nodeDiagnostics.push(makeDiagnostic('warning', 'XAML001', `Unsupported component type "${properties._OriginalType}" was downgraded during tree repair.`, node))
  }

  switch (node.type) {
    case 'Dialog':
      nodeDiagnostics.push(makeDiagnostic('warning', 'XAML201', 'Dialog is exported as an inline surface. Wrap it in a modal host for production modal behavior.', node))
      break
    case 'BottomSheet':
      nodeDiagnostics.push(makeDiagnostic('warning', 'XAML202', 'Bottom sheet is exported as an inline surface. Wrap it in a host to reproduce slide-up behavior.', node))
      break
    case 'DataTable':
      nodeDiagnostics.push(makeDiagnostic('warning', 'XAML203', 'DataTable is exported as a static Grid scaffold. Replace it with a bound table implementation for production use.', node))
      break
    case 'Tooltip':
      nodeDiagnostics.push(makeDiagnostic('warning', 'XAML204', 'Tooltip is exported as a compact inline hint because standalone tooltip attachment targets are not encoded in the tree.', node))
      break
    default:
      break
  }

  const ir: XamlNodeIR = {
    id: node.id,
    type: node.type,
    tag: node.type,
    xName: properties['x:Name'],
    xUid: properties['x:Uid'],
    automationId: properties['AutomationProperties.AutomationId'],
    automationName,
    semanticRole: semanticRoleForNode(node, parentType),
    stateHints: stateHintsForNode(node),
    templateHint: templateHintForNode(node),
    bindingHints: localBindings,
    diagnostics: nodeDiagnostics,
    properties,
    children: (node.children || []).map((child) => buildNodeIR(child, tokens, diagnostics, bindingHints, node.type)),
  }

  diagnostics.push(...nodeDiagnostics)
  bindingHints.push(...localBindings)

  return ir
}

function buildReport(tree: ComponentNode, tokens: DesignTokens): Omit<XamlConversionReport, 'xaml'> {
  const diagnostics: XamlDiagnostic[] = []
  const bindingHints: XamlBindingHint[] = []
  const resources = createResourceDictionary(tokens)
  const root = buildNodeIR(tree, tokens, diagnostics, bindingHints, null)

  return { root, diagnostics, bindingHints, resources }
}

function brushKeyForColor(color: string | undefined, resources: XamlResourceDictionaryIR): string | null {
  if (!color) return null
  const target = normalizeColor(color)
  const match = resources.brushes.find((brush) => normalizeColor(brush.color) === target)
  return match ? match.key : null
}

function styleResourceForButton(style: string | undefined): string {
  switch (style) {
    case 'Outlined':
      return '{StaticResource OutlinedButtonStyle}'
    case 'Text':
      return '{StaticResource TextButtonStyle}'
    case 'Elevated':
      return '{StaticResource ElevatedButtonStyle}'
    case 'Tonal':
      return '{StaticResource FilledTonalButtonStyle}'
    default:
      return '{StaticResource FilledButtonStyle}'
  }
}

function styleResourceForCard(style: string | undefined): string {
  switch (style) {
    case 'Filled':
      return '{StaticResource GeneratedFilledCardBorderStyle}'
    case 'Outlined':
      return '{StaticResource GeneratedOutlinedCardBorderStyle}'
    default:
      return '{StaticResource GeneratedElevatedCardBorderStyle}'
  }
}

function styleResourceForChip(style: string | undefined): string {
  switch (style) {
    case 'Filter':
      return '{StaticResource GeneratedFilterChipBorderStyle}'
    case 'Input':
      return '{StaticResource GeneratedFilterChipBorderStyle}'
    case 'Suggestion':
      return '{StaticResource GeneratedSuggestionChipBorderStyle}'
    default:
      return '{StaticResource GeneratedAssistChipBorderStyle}'
  }
}

function emitAttrs(attrs: Record<string, string | undefined>): string {
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}="${xmlEscape(String(value))}"`)
    .join(' ')
}

function commonLayoutAttrs(node: XamlNodeIR): Record<string, string | undefined> {
  const p = node.properties
  return {
    Width: p.Width,
    Height: p.Height,
    MinWidth: p.MinWidth,
    MinHeight: p.MinHeight,
    MaxWidth: p.MaxWidth,
    MaxHeight: p.MaxHeight,
    Margin: p.Margin,
    Padding: p.Padding,
    HorizontalAlignment: p.HorizontalAlignment,
    VerticalAlignment: p.VerticalAlignment,
    Opacity: p.Opacity,
    Visibility: p.Visibility,
    'Grid.Row': p['Grid.Row'],
    'Grid.Column': p['Grid.Column'],
    'Grid.RowSpan': p['Grid.RowSpan'],
    'Grid.ColumnSpan': p['Grid.ColumnSpan'],
    'Canvas.Left': p['Canvas.Left'],
    'Canvas.Top': p['Canvas.Top'],
    'x:Name': p['x:Name'],
    'x:Uid': p['x:Uid'],
    'AutomationProperties.AutomationId': p['AutomationProperties.AutomationId'],
    'AutomationProperties.Name': p['AutomationProperties.Name'],
  }
}

function emitSimpleElement(tag: string, attrs: Record<string, string | undefined>, depth: number, children: string[] = []): string {
  const attrString = emitAttrs(attrs)
  const prefix = attrString ? ` ${attrString}` : ''

  if (children.length === 0 && SELF_CLOSING_STANDARD_TYPES.has(tag)) {
    return `${indent(depth)}<${tag}${prefix} />`
  }

  if (children.length === 0) {
    return `${indent(depth)}<${tag}${prefix} />`
  }

  return [
    `${indent(depth)}<${tag}${prefix}>`,
    ...children,
    `${indent(depth)}</${tag}>`,
  ].join('\n')
}

function emitGridDefinitions(definitions: string, tagName: string, depth: number): string[] {
  const parts = definitions.split(/[,\s]+/).map((part) => part.trim()).filter(Boolean)
  if (parts.length === 0) return []

  const childTag = tagName === 'Grid.ColumnDefinitions' ? 'ColumnDefinition' : 'RowDefinition'
  const dimensionKey = childTag === 'ColumnDefinition' ? 'Width' : 'Height'

  return [
    `${indent(depth)}<${tagName}>`,
    ...parts.map((part) => `${indent(depth + 1)}<${childTag} ${dimensionKey}="${xmlEscape(part)}" />`),
    `${indent(depth)}</${tagName}>`,
  ]
}

function emitBrushResource(brush: { key: string; color: string }, depth: number): string {
  return `${indent(depth)}<SolidColorBrush x:Key="${brush.key}" Color="${xmlEscape(brush.color)}" />`
}

function emitDoubleResource(double: { key: string; value: number }, depth: number): string {
  return `${indent(depth)}<x:Double x:Key="${double.key}">${double.value}</x:Double>`
}

function emitTextStyle(style: XamlResourceDictionaryIR['textStyles'][number], depth: number): string[] {
  return [
    `${indent(depth)}<Style x:Key="${style.key}" TargetType="TextBlock">`,
    `${indent(depth + 1)}<Setter Property="FontFamily" Value="${xmlEscape(style.fontFamily)}" />`,
    `${indent(depth + 1)}<Setter Property="FontSize" Value="${style.fontSize}" />`,
    `${indent(depth + 1)}<Setter Property="FontWeight" Value="${style.fontWeight}" />`,
    `${indent(depth + 1)}<Setter Property="LineHeight" Value="${style.lineHeight}" />`,
    `${indent(depth + 1)}<Setter Property="CharacterSpacing" Value="${style.characterSpacing}" />`,
    `${indent(depth + 1)}<Setter Property="Foreground" Value="{StaticResource ${style.foregroundBrushKey}}" />`,
    `${indent(depth)}</Style>`,
  ]
}

function emitControlStyle(style: XamlResourceDictionaryIR['controlStyles'][number], depth: number): string[] {
  return [
    `${indent(depth)}<Style x:Key="${style.key}" TargetType="${style.targetType}">`,
    ...style.setters.map((setter) => `${indent(depth + 1)}<Setter Property="${setter.property}" Value="${xmlEscape(setter.value)}" />`),
    `${indent(depth)}</Style>`,
  ]
}

function emitResources(resources: XamlResourceDictionaryIR, depth: number): string[] {
  return [
    `${indent(depth)}<Page.Resources>`,
    ...resources.brushes.map((brush) => emitBrushResource(brush, depth + 1)),
    ...resources.doubles.map((double) => emitDoubleResource(double, depth + 1)),
    ...resources.textStyles.flatMap((style) => emitTextStyle(style, depth + 1)),
    ...resources.controlStyles.flatMap((style) => emitControlStyle(style, depth + 1)),
    `${indent(depth)}</Page.Resources>`,
  ]
}

function iconText(glyph: string | undefined): string {
  if (!glyph) return '•'
  return ICON_TEXT_MAP[glyph] || glyph.slice(0, 1).toUpperCase()
}

function emitIconNode(node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR, extraAttrs?: Record<string, string | undefined>): string {
  const brushKey = brushKeyForColor(node.properties.Foreground, resources)
  return emitSimpleElement('TextBlock', {
    ...commonLayoutAttrs(node),
    ...extraAttrs,
    Text: iconText(node.properties.Glyph || node.properties.Icon),
    FontSize: node.properties.FontSize || '20',
    FontFamily: 'Segoe UI Symbol',
    VerticalAlignment: 'Center',
    HorizontalAlignment: node.properties.HorizontalAlignment || 'Center',
    Foreground: brushKey ? `{StaticResource ${brushKey}}` : node.properties.Foreground,
  }, depth)
}

function emitIconActionButton(node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR): string {
  return [
    `${indent(depth)}<Button ${emitAttrs({
      Style: '{StaticResource TextButtonStyle}',
      MinWidth: '{StaticResource TouchTargetSize}',
      Height: '{StaticResource TouchTargetSize}',
      Padding: '0',
      VerticalAlignment: 'Center',
      'AutomationProperties.AutomationId': `${node.automationId}-action`,
      'AutomationProperties.Name': node.automationName || node.properties.Glyph || node.properties.Icon || 'Action',
    })}>`,
    emitIconNode(node, depth + 1, resources),
    `${indent(depth)}</Button>`,
  ].join('\n')
}

function wrapChildrenInStack(children: XamlNodeIR[], depth: number, resources: XamlResourceDictionaryIR): string[] {
  if (children.length === 0) return []
  if (children.length === 1) return [emitNode(children[0], depth, resources)]

  return [
    `${indent(depth)}<StackPanel Spacing="{StaticResource SpacingSM}">`,
    ...children.map((child) => emitNode(child, depth + 1, resources)),
    `${indent(depth)}</StackPanel>`,
  ]
}

function emitNavigationBar(node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR): string {
  const command = node.properties.MainCommand || 'Back'
  const mainIcon = command === 'Close' ? 'x' : '<'
  const actionChildren = node.children

  const lines = [
    `${indent(depth)}<Grid ${emitAttrs({
      ...commonLayoutAttrs(node),
      Height: node.properties.Height || '{StaticResource NavigationBarHeight}',
      Padding: node.properties.Padding || '8,4',
      Background: '{StaticResource SurfaceBrush}',
      BorderBrush: '{StaticResource OutlineVariantBrush}',
      BorderThickness: '0,0,0,1',
    })}>`,
    `${indent(depth + 1)}<Grid.ColumnDefinitions>`,
    `${indent(depth + 2)}<ColumnDefinition Width="Auto" />`,
    `${indent(depth + 2)}<ColumnDefinition Width="*" />`,
    `${indent(depth + 2)}<ColumnDefinition Width="Auto" />`,
    `${indent(depth + 1)}</Grid.ColumnDefinitions>`,
    `${indent(depth + 1)}<Button ${emitAttrs({
      'Grid.Column': '0',
      Style: '{StaticResource TextButtonStyle}',
      MinWidth: '{StaticResource TouchTargetSize}',
      Height: '{StaticResource TouchTargetSize}',
      Padding: '0',
      Command: node.properties.Command,
      'AutomationProperties.Name': command === 'Close' ? 'Close' : 'Back',
      'AutomationProperties.AutomationId': `${node.automationId}-main-command`,
    })}>`,
    `${indent(depth + 2)}<TextBlock Text="${xmlEscape(mainIcon)}" FontFamily="Segoe UI Symbol" FontSize="20" VerticalAlignment="Center" HorizontalAlignment="Center" />`,
    `${indent(depth + 1)}</Button>`,
    emitSimpleElement('TextBlock', {
      'Grid.Column': '1',
      Text: node.properties.Content || 'Title',
      Style: '{StaticResource TitleLarge}',
      VerticalAlignment: 'Center',
      Margin: '12,0',
    }, depth + 1),
    `${indent(depth + 1)}<StackPanel ${emitAttrs({
      'Grid.Column': '2',
      Orientation: 'Horizontal',
      Spacing: '{StaticResource SpacingXS}',
      VerticalAlignment: 'Center',
    })}>`,
    ...actionChildren.map((child) => emitIconActionButton(child, depth + 2, resources)),
    `${indent(depth + 1)}</StackPanel>`,
    `${indent(depth)}</Grid>`,
  ]

  return lines.join('\n')
}

function emitBottomNavigationBar(node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR): string {
  const count = Math.max(1, node.children.length)
  const lines = [
    `${indent(depth)}<Border ${emitAttrs({
      ...commonLayoutAttrs(node),
      Background: '{StaticResource SurfaceBrush}',
      BorderBrush: '{StaticResource OutlineVariantBrush}',
      BorderThickness: '0,1,0,0',
      Padding: '8,6',
    })}>`,
    `${indent(depth + 1)}<Grid>`,
    `${indent(depth + 2)}<Grid.ColumnDefinitions>`,
    ...Array.from({ length: count }, (_, index) => `${indent(depth + 3)}<ColumnDefinition Width="*" />`),
    `${indent(depth + 2)}</Grid.ColumnDefinitions>`,
    ...node.children.map((child, index) => {
      const selected = child.properties.IsSelected === 'True'
      return [
        `${indent(depth + 2)}<Button ${emitAttrs({
          'Grid.Column': String(index),
          Style: '{StaticResource TextButtonStyle}',
          Padding: '8,8',
          HorizontalAlignment: 'Stretch',
          VerticalAlignment: 'Stretch',
          'AutomationProperties.AutomationId': child.automationId,
          'AutomationProperties.Name': child.automationName || child.properties.Content || 'Navigation item',
        })}>`,
        `${indent(depth + 3)}<StackPanel HorizontalAlignment="Center" Spacing="4">`,
        emitIconNode({
          ...child,
          properties: {
            ...child.properties,
            Foreground: selected ? '{StaticResource PrimaryBrush}' : '{StaticResource OnSurfaceVariantBrush}',
          },
        }, depth + 4, resources),
        emitSimpleElement('TextBlock', {
          Text: child.properties.Content || 'Item',
          Style: '{StaticResource LabelMedium}',
          HorizontalAlignment: 'Center',
          Foreground: selected ? '{StaticResource PrimaryBrush}' : '{StaticResource OnSurfaceVariantBrush}',
        }, depth + 4),
        `${indent(depth + 3)}</StackPanel>`,
        `${indent(depth + 2)}</Button>`,
      ].join('\n')
    }),
    `${indent(depth + 1)}</Grid>`,
    `${indent(depth)}</Border>`,
  ]

  return lines.join('\n')
}

function emitCard(node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR): string {
  const lines = [
    `${indent(depth)}<Border ${emitAttrs({
      ...commonLayoutAttrs(node),
      Style: styleResourceForCard(node.properties.Style),
      Padding: node.properties.Padding || '16',
    })}>`,
    ...wrapChildrenInStack(node.children, depth + 1, resources),
    `${indent(depth)}</Border>`,
  ]

  return lines.join('\n')
}

function emitChip(node: XamlNodeIR, depth: number): string {
  const icon = node.properties.Glyph || node.properties.Icon
  const lines = [
    `${indent(depth)}<Border ${emitAttrs({
      ...commonLayoutAttrs(node),
      Style: styleResourceForChip(node.properties.Style),
      Padding: node.properties.Padding || '12,6',
    })}>`,
    `${indent(depth + 1)}<StackPanel Orientation="Horizontal" Spacing="8">`,
  ]

  if (icon) {
    lines.push(`${indent(depth + 2)}<TextBlock Text="${xmlEscape(iconText(icon))}" FontFamily="Segoe UI Symbol" VerticalAlignment="Center" />`)
  }

  lines.push(`${indent(depth + 2)}<TextBlock Text="${xmlEscape(node.properties.Content || 'Chip')}" Style="{StaticResource LabelLarge}" VerticalAlignment="Center" />`)
  lines.push(`${indent(depth + 1)}</StackPanel>`)
  lines.push(`${indent(depth)}</Border>`)
  return lines.join('\n')
}

function emitFloatingActionButton(node: XamlNodeIR, depth: number): string {
  return emitSimpleElement('Button', {
    ...commonLayoutAttrs(node),
    Style: '{StaticResource GeneratedFabButtonStyle}',
    Content: iconText(node.properties.Content || node.properties.Glyph),
    Command: node.properties.Command,
  }, depth)
}

function emitDivider(node: XamlNodeIR, depth: number): string {
  return emitSimpleElement('Border', {
    ...commonLayoutAttrs(node),
    Height: node.properties.Height || '1',
    Background: '{StaticResource OutlineVariantBrush}',
  }, depth)
}

function emitInfoBar(node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR): string {
  const severity = node.properties.Style || 'Info'
  const severityBrushMap: Record<string, string> = {
    Error: 'ErrorBrush',
    Warning: 'TertiaryBrush',
    Success: 'SecondaryBrush',
    Info: 'PrimaryBrush',
  }

  const accentBrush = severityBrushMap[severity] || 'PrimaryBrush'
  const title = node.properties.Title || severity

  return [
    `${indent(depth)}<Border ${emitAttrs({
      ...commonLayoutAttrs(node),
      Background: '{StaticResource SurfaceContainerBrush}',
      BorderBrush: `{StaticResource ${accentBrush}}`,
      BorderThickness: '1',
      CornerRadius: '16',
      Padding: node.properties.Padding || '16',
    })}>`,
    `${indent(depth + 1)}<StackPanel Spacing="8">`,
    emitSimpleElement('TextBlock', {
      Text: title,
      Style: '{StaticResource TitleSmall}',
      Foreground: `{StaticResource ${accentBrush}}`,
    }, depth + 2),
    emitSimpleElement('TextBlock', {
      Text: node.properties.Content || '',
      Style: '{StaticResource BodyMedium}',
    }, depth + 2),
    `${indent(depth + 1)}</StackPanel>`,
    `${indent(depth)}</Border>`,
  ].join('\n')
}

function emitValidationSummary(node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR): string {
  const title = node.properties.Title || 'Validation'
  const lines = [
    `${indent(depth)}<Border ${emitAttrs({
      ...commonLayoutAttrs(node),
      Background: '{StaticResource SurfaceBrush}',
      BorderBrush: '{StaticResource OutlineVariantBrush}',
      BorderThickness: '1',
      CornerRadius: '12',
      Padding: '0',
    })}>`,
    `${indent(depth + 1)}<StackPanel>`,
    `${indent(depth + 2)}<!-- Header -->`,
    `${indent(depth + 2)}<Border Background="{StaticResource ErrorContainerBrush}" Padding="12,10">`,
    emitSimpleElement('TextBlock', {
      Text: title,
      Style: '{StaticResource TitleSmall}',
    }, depth + 3),
    `${indent(depth + 2)}</Border>`,
    `${indent(depth + 2)}<!-- Validation items -->`,
  ]

  for (const child of node.children) {
    const severity = child.properties.Style || child.properties.Severity || 'Info'
    const severityIconMap: Record<string, string> = { Error: '\uE711', Warning: '\uE7BA', Info: '\uE946' }
    const severityColorMap: Record<string, string> = { Error: 'ErrorBrush', Warning: 'TertiaryBrush', Info: 'PrimaryBrush' }
    lines.push(
      `${indent(depth + 2)}<Grid Padding="12,8" ColumnSpacing="10">`,
      `${indent(depth + 3)}<Grid.ColumnDefinitions>`,
      `${indent(depth + 4)}<ColumnDefinition Width="Auto" />`,
      `${indent(depth + 4)}<ColumnDefinition Width="*" />`,
      `${indent(depth + 3)}</Grid.ColumnDefinitions>`,
      emitSimpleElement('FontIcon', {
        Glyph: severityIconMap[severity] || severityIconMap.Info,
        FontSize: '16',
        Foreground: `{StaticResource ${severityColorMap[severity] || severityColorMap.Info}}`,
      }, depth + 3),
      emitSimpleElement('TextBlock', {
        'Grid.Column': '1',
        Text: child.properties.Content || child.properties.Text || '',
        Style: '{StaticResource BodySmall}',
        TextWrapping: 'Wrap',
      }, depth + 3),
      `${indent(depth + 2)}</Grid>`,
    )
  }

  lines.push(
    `${indent(depth + 1)}</StackPanel>`,
    `${indent(depth)}</Border>`,
  )
  return lines.join('\n')
}

function emitSnackbar(node: XamlNodeIR, depth: number): string {
  const hasAction = Boolean(node.properties.ActionText)
  const lines = [
    `${indent(depth)}<Border ${emitAttrs({
      ...commonLayoutAttrs(node),
      Background: '{StaticResource InverseSurfaceBrush}',
      CornerRadius: '12',
      Padding: node.properties.Padding || '16,12',
    })}>`,
    `${indent(depth + 1)}<Grid>`,
    `${indent(depth + 2)}<Grid.ColumnDefinitions>`,
    `${indent(depth + 3)}<ColumnDefinition Width="*" />`,
    `${indent(depth + 3)}<ColumnDefinition Width="Auto" />`,
    `${indent(depth + 2)}</Grid.ColumnDefinitions>`,
    emitSimpleElement('TextBlock', {
      'Grid.Column': '0',
      Text: node.properties.Content || '',
      Style: '{StaticResource BodyMedium}',
      Foreground: '{StaticResource BackgroundBrush}',
      VerticalAlignment: 'Center',
    }, depth + 2),
  ]

  if (hasAction) {
    lines.push(emitSimpleElement('Button', {
      'Grid.Column': '1',
      Style: '{StaticResource TextButtonStyle}',
      Content: node.properties.ActionText,
      Foreground: '{StaticResource PrimaryContainerBrush}',
    }, depth + 2))
  }

  lines.push(`${indent(depth + 1)}</Grid>`)
  lines.push(`${indent(depth)}</Border>`)
  return lines.join('\n')
}

function emitListViewLike(tag: 'ListView' | 'GridView', node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR): string {
  const lines = [
    `${indent(depth)}<${tag} ${emitAttrs({
      ...commonLayoutAttrs(node),
      SelectionMode: node.properties.SelectionMode || 'None',
      IsItemClickEnabled: 'False',
    })}>`,
    ...node.children.map((child) => emitNode(child, depth + 1, resources)),
    `${indent(depth)}</${tag}>`,
  ]

  return lines.join('\n')
}

function emitNavigationViewItem(node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR): string {
  return [
    `${indent(depth)}<Button ${emitAttrs({
      ...commonLayoutAttrs(node),
      Style: '{StaticResource TextButtonStyle}',
      HorizontalAlignment: 'Stretch',
      Padding: '12,10',
    })}>`,
    `${indent(depth + 1)}<StackPanel Orientation="Horizontal" Spacing="12">`,
    emitIconNode({
      ...node,
      properties: {
        ...node.properties,
        Glyph: node.properties.Icon || node.properties.Glyph,
      },
    }, depth + 2, resources),
    emitSimpleElement('TextBlock', {
      Text: node.properties.Content || 'Item',
      Style: '{StaticResource BodyMedium}',
      VerticalAlignment: 'Center',
    }, depth + 2),
    `${indent(depth + 1)}</StackPanel>`,
    `${indent(depth)}</Button>`,
  ].join('\n')
}

function emitDialogLike(node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR, title: string, leadingDivider = false): string {
  const lines = [
    `${indent(depth)}<Border ${emitAttrs({
      ...commonLayoutAttrs(node),
      Background: '{StaticResource SurfaceBrush}',
      BorderBrush: '{StaticResource OutlineVariantBrush}',
      BorderThickness: '1',
      CornerRadius: '24',
      Padding: node.properties.Padding || '24',
      MaxWidth: node.properties.MaxWidth || '480',
    })}>`,
    `${indent(depth + 1)}<StackPanel Spacing="16">`,
  ]

  if (leadingDivider) {
    lines.push(`${indent(depth + 2)}<Border Width="32" Height="4" Background="{StaticResource OutlineVariantBrush}" CornerRadius="2" HorizontalAlignment="Center" />`)
  }

  if (title) {
    lines.push(emitSimpleElement('TextBlock', { Text: title, Style: '{StaticResource TitleLarge}' }, depth + 2))
  }

  lines.push(...wrapChildrenInStack(node.children, depth + 2, resources))
  lines.push(`${indent(depth + 1)}</StackPanel>`)
  lines.push(`${indent(depth)}</Border>`)
  return lines.join('\n')
}

function emitDataTable(node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR): string {
  const columns = Math.max(1, node.children.length)
  const lines = [
    `${indent(depth)}<Border ${emitAttrs({
      ...commonLayoutAttrs(node),
      Background: '{StaticResource SurfaceBrush}',
      BorderBrush: '{StaticResource OutlineVariantBrush}',
      BorderThickness: '1',
      CornerRadius: '16',
      Padding: node.properties.Padding || '0',
    })}>`,
    `${indent(depth + 1)}<Grid>`,
    `${indent(depth + 2)}<Grid.RowDefinitions>`,
    `${indent(depth + 3)}<RowDefinition Height="Auto" />`,
    `${indent(depth + 3)}<RowDefinition Height="Auto" />`,
    `${indent(depth + 2)}</Grid.RowDefinitions>`,
    `${indent(depth + 2)}<Grid.ColumnDefinitions>`,
    ...Array.from({ length: columns }, () => `${indent(depth + 3)}<ColumnDefinition Width="*" />`),
    `${indent(depth + 2)}</Grid.ColumnDefinitions>`,
    ...node.children.map((child, index) => emitSimpleElement('TextBlock', {
      'Grid.Row': '0',
      'Grid.Column': String(index),
      Text: child.properties.Text || child.properties.Content || `Column ${index + 1}`,
      Style: '{StaticResource LabelLarge}',
      Padding: '16,12',
      Foreground: '{StaticResource OnSurfaceVariantBrush}',
    }, depth + 2)),
    `${indent(depth + 2)}<Border Grid.Row="1" Grid.ColumnSpan="${columns}" Height="1" Background="{StaticResource OutlineVariantBrush}" />`,
    `${indent(depth + 2)}<TextBlock Grid.Row="1" Grid.ColumnSpan="${columns}" Text="Generated data table scaffold" Style="{StaticResource BodyMedium}" Margin="16,18,16,16" />`,
    `${indent(depth + 1)}</Grid>`,
    `${indent(depth)}</Border>`,
  ]

  return lines.join('\n')
}

function emitTabsLike(node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR, pill = false): string {
  const count = Math.max(1, node.children.length)
  const lines = [
    `${indent(depth)}<Grid ${emitAttrs(commonLayoutAttrs(node))}>`,
    `${indent(depth + 1)}<Grid.ColumnDefinitions>`,
    ...Array.from({ length: count }, () => `${indent(depth + 2)}<ColumnDefinition Width="*" />`),
    `${indent(depth + 1)}</Grid.ColumnDefinitions>`,
    ...node.children.map((child, index) => emitSimpleElement('Button', {
      'Grid.Column': String(index),
      Style: child.properties.IsSelected === 'True' || (pill && index === 0)
        ? '{StaticResource FilledTonalButtonStyle}'
        : '{StaticResource OutlinedButtonStyle}',
      Content: child.properties.Content || `Item ${index + 1}`,
      Margin: pill ? '0' : '0,0,8,0',
    }, depth + 1)),
    `${indent(depth)}</Grid>`,
  ]

  return lines.join('\n')
}

function emitBadge(node: XamlNodeIR, depth: number): string {
  const severityMap: Record<string, string> = {
    Error: '{StaticResource ErrorBrush}',
    Warning: '{StaticResource TertiaryBrush}',
    Success: '{StaticResource SecondaryBrush}',
    Info: '{StaticResource PrimaryBrush}',
  }
  return [
    `${indent(depth)}<Border ${emitAttrs({
      ...commonLayoutAttrs(node),
      Background: severityMap[node.properties.Style || 'Info'] || '{StaticResource PrimaryBrush}',
      CornerRadius: '999',
      Padding: '8,2',
      MinWidth: '20',
      HorizontalAlignment: 'Left',
    })}>`,
    emitSimpleElement('TextBlock', {
      Text: node.properties.Content || '',
      Style: '{StaticResource LabelSmall}',
      Foreground: '{StaticResource OnPrimaryBrush}',
      HorizontalAlignment: 'Center',
    }, depth + 1),
    `${indent(depth)}</Border>`,
  ].join('\n')
}

function emitTooltip(node: XamlNodeIR, depth: number): string {
  const text = [node.properties.Title, node.properties.Content].filter(Boolean).join(': ')
  return [
    `${indent(depth)}<Border ${emitAttrs({
      ...commonLayoutAttrs(node),
      Background: '{StaticResource InverseSurfaceBrush}',
      CornerRadius: '8',
      Padding: '10,6',
    })}>`,
    emitSimpleElement('TextBlock', {
      Text: text || 'Tooltip',
      Style: '{StaticResource BodySmall}',
      Foreground: '{StaticResource BackgroundBrush}',
    }, depth + 1),
    `${indent(depth)}</Border>`,
  ].join('\n')
}

function emitNavigationRail(node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR): string {
  return [
    `${indent(depth)}<Border ${emitAttrs({
      ...commonLayoutAttrs(node),
      Background: '{StaticResource SurfaceBrush}',
      BorderBrush: '{StaticResource OutlineVariantBrush}',
      BorderThickness: '0,0,1,0',
      Padding: '8,16',
      Width: node.properties.Width || '88',
    })}>`,
    `${indent(depth + 1)}<StackPanel Spacing="8">`,
    ...node.children.map((child) => emitNavigationViewItem(child, depth + 2, resources)),
    `${indent(depth + 1)}</StackPanel>`,
    `${indent(depth)}</Border>`,
  ].join('\n')
}

function emitNavigationDrawer(node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR): string {
  return [
    `${indent(depth)}<Border ${emitAttrs({
      ...commonLayoutAttrs(node),
      Background: '{StaticResource SurfaceBrush}',
      BorderBrush: '{StaticResource OutlineVariantBrush}',
      BorderThickness: '0,0,1,0',
      Padding: '16',
      Width: node.properties.Width || '320',
    })}>`,
    `${indent(depth + 1)}<StackPanel Spacing="16">`,
    ...(node.properties.Header ? [emitSimpleElement('TextBlock', { Text: node.properties.Header, Style: '{StaticResource TitleLarge}' }, depth + 2)] : []),
    ...node.children.map((child) => emitNavigationViewItem(child, depth + 2, resources)),
    `${indent(depth + 1)}</StackPanel>`,
    `${indent(depth)}</Border>`,
  ].join('\n')
}

function emitContainer(tag: string, node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR, extraAttrs?: Record<string, string | undefined>): string {
  const lines = [
    `${indent(depth)}<${tag} ${emitAttrs({
      ...commonLayoutAttrs(node),
      ...extraAttrs,
      Orientation: node.properties.Orientation,
      Spacing: node.properties.Spacing,
      RowSpacing: node.properties.RowSpacing,
      ColumnSpacing: node.properties.ColumnSpacing,
      Background: node.properties.Background,
      BorderBrush: node.properties.BorderBrush,
      BorderThickness: node.properties.BorderThickness,
      CornerRadius: node.properties.CornerRadius,
    })}>`,
  ]

  if (tag === 'Grid') {
    if (node.properties.RowDefinitions) {
      lines.push(...emitGridDefinitions(node.properties.RowDefinitions, 'Grid.RowDefinitions', depth + 1))
    }
    if (node.properties.ColumnDefinitions) {
      lines.push(...emitGridDefinitions(node.properties.ColumnDefinitions, 'Grid.ColumnDefinitions', depth + 1))
    }
  }

  lines.push(...node.children.map((child) => emitNode(child, depth + 1, resources)))
  lines.push(`${indent(depth)}</${tag}>`)
  return lines.join('\n')
}

function emitPage(node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR): string {
  const nonNavChildren = node.children.filter((child) => child.type !== 'NavigationBar' && child.type !== 'BottomNavigationBar')
  const topNav = node.children.find((child) => child.type === 'NavigationBar') || null
  const bottomNav = [...node.children].reverse().find((child) => child.type === 'BottomNavigationBar') || null

  const lines = [
    `${indent(depth)}<Page ${emitAttrs({
      ...Object.fromEntries(XAML_NAMESPACES.map((entry) => {
        const [key, rawValue] = entry.split('=')
        return [key, rawValue.replace(/^"|"$/g, '')]
      })),
      'x:Name': node.xName,
      'x:Uid': node.xUid,
      'AutomationProperties.AutomationId': node.automationId,
      Background: node.properties.Background || '{StaticResource BackgroundBrush}',
    })}>`,
    ...emitResources(resources, depth + 1),
  ]

  if (topNav || bottomNav || nonNavChildren.length > 1) {
    lines.push(`${indent(depth + 1)}<Grid>`)
    lines.push(`${indent(depth + 2)}<Grid.RowDefinitions>`)
    if (topNav) lines.push(`${indent(depth + 3)}<RowDefinition Height="Auto" />`)
    lines.push(`${indent(depth + 3)}<RowDefinition Height="*" />`)
    if (bottomNav) lines.push(`${indent(depth + 3)}<RowDefinition Height="Auto" />`)
    lines.push(`${indent(depth + 2)}</Grid.RowDefinitions>`)

    let currentRow = 0
    if (topNav) {
      lines.push(emitNavigationBar({
        ...topNav,
        properties: { ...topNav.properties, 'Grid.Row': String(currentRow) },
      }, depth + 2, resources))
      currentRow += 1
    }

    const bodyRows = wrapChildrenInStack(nonNavChildren, depth + 3, resources)
    if (bodyRows.length > 0) {
      if (bodyRows.length === 1 && nonNavChildren.length === 1) {
        lines.push(emitNode({
          ...nonNavChildren[0],
          properties: { ...nonNavChildren[0].properties, 'Grid.Row': String(currentRow) },
        }, depth + 2, resources))
      } else {
        lines.push(`${indent(depth + 2)}<StackPanel Grid.Row="${currentRow}" Spacing="{StaticResource SpacingSM}">`)
        lines.push(...nonNavChildren.map((child) => emitNode(child, depth + 3, resources)))
        lines.push(`${indent(depth + 2)}</StackPanel>`)
      }
    } else {
      lines.push(`${indent(depth + 2)}<Grid Grid.Row="${currentRow}" />`)
    }

    if (bottomNav) {
      lines.push(emitBottomNavigationBar({
        ...bottomNav,
        properties: { ...bottomNav.properties, 'Grid.Row': String(currentRow + 1) },
      }, depth + 2, resources))
    }

    lines.push(`${indent(depth + 1)}</Grid>`)
  } else if (nonNavChildren.length === 1) {
    lines.push(emitNode(nonNavChildren[0], depth + 1, resources))
  } else {
    lines.push(`${indent(depth + 1)}<Grid />`)
  }

  lines.push(`${indent(depth)}</Page>`)
  return lines.join('\n')
}

function emitNode(node: XamlNodeIR, depth: number, resources: XamlResourceDictionaryIR): string {
  switch (node.type) {
    case 'Page':
      return emitPage(node, depth, resources)
    case 'StackPanel':
      return emitContainer('StackPanel', node, depth, resources)
    case 'Grid':
      return emitContainer('Grid', node, depth, resources)
    case 'ScrollViewer':
      return emitContainer('ScrollViewer', node, depth, resources)
    case 'Border':
      return emitContainer('Border', node, depth, resources)
    case 'TextBlock':
      return emitSimpleElement('TextBlock', {
        ...commonLayoutAttrs(node),
        Text: node.properties.Text || '',
        Style: node.properties.Style ? `{StaticResource ${node.properties.Style}}` : undefined,
        Foreground: brushKeyForColor(node.properties.Foreground, resources)
          ? `{StaticResource ${brushKeyForColor(node.properties.Foreground, resources)}}`
          : node.properties.Foreground,
      }, depth)
    case 'Button':
      return emitSimpleElement('Button', {
        ...commonLayoutAttrs(node),
        Content: node.properties.Content || 'Action',
        Command: node.properties.Command,
        IsEnabled: node.properties.IsEnabled,
        Style: styleResourceForButton(node.properties.Style),
      }, depth)
    case 'IconButton':
      return [
        `${indent(depth)}<Button ${emitAttrs({
          ...commonLayoutAttrs(node),
          Command: node.properties.Command,
          Style: styleResourceForButton(node.properties.Style === 'Outlined' ? 'Outlined' : 'Text'),
          Width: node.properties.Width || '{StaticResource TouchTargetSize}',
          Height: node.properties.Height || '{StaticResource TouchTargetSize}',
          Padding: '0',
        })}>`,
        emitIconNode({
          ...node,
          properties: {
            ...node.properties,
            Glyph: node.properties.Glyph || node.properties.Icon,
          },
        }, depth + 1, resources),
        `${indent(depth)}</Button>`,
      ].join('\n')
    case 'TextBox': {
      const tbLines = [emitSimpleElement('TextBox', {
        ...commonLayoutAttrs(node),
        Header: node.properties.Header,
        PlaceholderText: node.properties.PlaceholderText,
        Text: node.properties.Text,
      }, depth)]
      if (node.properties.Validation) {
        tbLines.push(`${indent(depth)}<!-- Validation: ${node.properties.Validation} — ${node.properties.ValidationMessage || ''} -->`)
      }
      return tbLines.join('\n')
    }
    case 'PasswordBox':
      return emitSimpleElement('PasswordBox', {
        ...commonLayoutAttrs(node),
        Header: node.properties.Header,
        PlaceholderText: node.properties.PlaceholderText,
        Password: node.properties.Password,
      }, depth)
    case 'Select':
      return emitSimpleElement('ComboBox', {
        ...commonLayoutAttrs(node),
        Header: node.properties.Header,
        PlaceholderText: node.properties.PlaceholderText,
        SelectedItem: node.properties.SelectedItem,
      }, depth)
    case 'DatePicker':
      return emitSimpleElement('DatePicker', {
        ...commonLayoutAttrs(node),
        Header: node.properties.Header,
        Date: node.properties.Date,
      }, depth)
    case 'TimePicker':
      return emitSimpleElement('TimePicker', {
        ...commonLayoutAttrs(node),
        Header: node.properties.Header,
        Time: node.properties.Time,
        ClockIdentifier: node.properties.ClockIdentifier,
      }, depth)
    case 'AutoSuggestBox':
      return emitSimpleElement('AutoSuggestBox', {
        ...commonLayoutAttrs(node),
        Header: node.properties.Header,
        PlaceholderText: node.properties.PlaceholderText,
        Text: node.properties.Text,
      }, depth)
    case 'Image':
      return emitSimpleElement('Image', {
        ...commonLayoutAttrs(node),
        Source: node.properties.Source,
        Stretch: node.properties.Stretch || 'UniformToFill',
      }, depth)
    case 'PersonPicture':
      return emitSimpleElement('Border', {
        ...commonLayoutAttrs(node),
        Width: node.properties.Width || node.properties.Height || '48',
        Height: node.properties.Height || node.properties.Width || '48',
        Background: '{StaticResource PrimaryContainerBrush}',
        CornerRadius: '999',
      }, depth, [
        emitSimpleElement('TextBlock', {
          Text: (node.properties.DisplayName || '?')
            .split(/\s+/)
            .filter(Boolean)
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
          Style: '{StaticResource LabelLarge}',
          HorizontalAlignment: 'Center',
          VerticalAlignment: 'Center',
          Foreground: '{StaticResource PrimaryBrush}',
        }, depth + 1),
      ])
    case 'ToggleSwitch':
      return emitSimpleElement('ToggleSwitch', {
        ...commonLayoutAttrs(node),
        Header: node.properties.Header,
        IsOn: node.properties.IsOn,
      }, depth)
    case 'CheckBox':
      return emitSimpleElement('CheckBox', {
        ...commonLayoutAttrs(node),
        Content: node.properties.Content,
        IsChecked: node.properties.IsChecked,
      }, depth)
    case 'RadioButton':
      return emitSimpleElement('RadioButton', {
        ...commonLayoutAttrs(node),
        Content: node.properties.Content,
        IsChecked: node.properties.IsChecked,
      }, depth)
    case 'Slider':
      return emitSimpleElement('Slider', {
        ...commonLayoutAttrs(node),
        Header: node.properties.Header,
        Minimum: node.properties.Minimum || node.properties.Min,
        Maximum: node.properties.Maximum || node.properties.Max,
        Value: node.properties.Value,
        StepFrequency: node.properties.Step,
      }, depth)
    case 'ProgressBar':
      return emitSimpleElement('ProgressBar', {
        ...commonLayoutAttrs(node),
        Value: node.properties.Value,
        Minimum: node.properties.Minimum,
        Maximum: node.properties.Maximum,
        IsIndeterminate: node.properties.IsIndeterminate,
      }, depth)
    case 'ProgressRing':
      return emitSimpleElement('ProgressRing', {
        ...commonLayoutAttrs(node),
        IsActive: node.properties.IsActive || 'True',
      }, depth)
    case 'NavigationBar':
      return emitNavigationBar(node, depth, resources)
    case 'BottomNavigationBar':
      return emitBottomNavigationBar(node, depth, resources)
    case 'NavigationViewItem':
      return emitNavigationViewItem(node, depth, resources)
    case 'Card':
      return emitCard(node, depth, resources)
    case 'Divider':
      return emitDivider(node, depth)
    case 'Icon':
      return emitIconNode(node, depth, resources)
    case 'FloatingActionButton':
      return emitFloatingActionButton(node, depth)
    case 'Chip':
      return emitChip(node, depth)
    case 'ListView':
      return emitListViewLike('ListView', node, depth, resources)
    case 'GridView':
      return emitListViewLike('GridView', node, depth, resources)
    case 'SegmentedButton':
      return emitTabsLike(node, depth, resources, true)
    case 'Tabs':
      return emitTabsLike(node, depth, resources)
    case 'Snackbar':
      return emitSnackbar(node, depth)
    case 'Badge':
      return emitBadge(node, depth)
    case 'Dialog':
      return emitDialogLike(node, depth, resources, node.properties.Title || 'Dialog')
    case 'BottomSheet':
      return emitDialogLike(node, depth, resources, node.properties.Title || '', true)
    case 'InfoBar':
      return emitInfoBar(node, depth, resources)
    case 'DataTable':
      return emitDataTable(node, depth, resources)
    case 'Stepper':
      return emitSimpleElement('NumberBox', {
        ...commonLayoutAttrs(node),
        Header: node.properties.Header,
        Value: node.properties.Value,
        Minimum: node.properties.Min,
        Maximum: node.properties.Max,
        SmallChange: node.properties.Step,
      }, depth)
    case 'Tooltip':
      return emitTooltip(node, depth)
    case 'NavigationRail':
      return emitNavigationRail(node, depth, resources)
    case 'NavigationDrawer':
      return emitNavigationDrawer(node, depth, resources)
    case 'ValidationSummary':
      return emitValidationSummary(node, depth, resources)
    default:
      return emitContainer('Border', node, depth, resources)
  }
}

function emitDiagnosticsComments(diagnostics: XamlDiagnostic[]): string[] {
  if (diagnostics.length === 0) return []

  return [
    '<!-- Quantify Studio XAML diagnostics -->',
    ...diagnostics.map((diagnostic) => `<!-- ${xmlCommentEscape(`${diagnostic.severity.toUpperCase()} ${diagnostic.code}${diagnostic.nodeId ? ` [${diagnostic.nodeId}]` : ''}: ${diagnostic.message}`)} -->`),
  ]
}

export function generateXamlReport(tree: ComponentNode, tokens: DesignTokens): XamlConversionReport {
  const report = buildReport(tree, tokens)
  const xaml = [
    ...emitDiagnosticsComments(report.diagnostics),
    emitNode(report.root, 0, report.resources),
  ].join('\n')

  return { ...report, xaml }
}

export function generateXaml(tree: ComponentNode, tokens: DesignTokens): string {
  return generateXamlReport(tree, tokens).xaml
}

export function generateXamlFragment(node: ComponentNode, tokens: DesignTokens = AVONTUS_TOKENS): string {
  const report = buildReport(node, tokens)
  return emitNode(report.root, 0, report.resources)
}
