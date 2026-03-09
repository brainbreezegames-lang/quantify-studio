const VALID_COMPONENT_TYPES = new Set([
  'Page',
  'StackPanel',
  'Grid',
  'ScrollViewer',
  'TextBlock',
  'Button',
  'TextBox',
  'PasswordBox',
  'Image',
  'Border',
  'PersonPicture',
  'ToggleSwitch',
  'CheckBox',
  'RadioButton',
  'Slider',
  'ProgressBar',
  'ProgressRing',
  'NavigationBar',
  'BottomNavigationBar',
  'Card',
  'Divider',
  'Icon',
  'FloatingActionButton',
  'Chip',
  'ListView',
  'GridView',
  'NavigationViewItem',
  'Select',
  'DatePicker',
  'IconButton',
  'SegmentedButton',
  'Tabs',
  'Snackbar',
  'Badge',
  'Dialog',
  'BottomSheet',
  'InfoBar',
  'DataTable',
  'Stepper',
  'Tooltip',
  'TimePicker',
  'AutoSuggestBox',
  'NavigationRail',
  'NavigationDrawer',
  'ValidationSummary',
])

const BOOLEAN_PROPERTIES = new Set([
  'IsEnabled',
  'IsOn',
  'IsChecked',
  'IsIndeterminate',
  'IsActive',
  'IsSelected',
])

const ENUM_PROPERTIES = {
  MainCommand: ['Back', 'Close', 'None'],
  Orientation: ['Vertical', 'Horizontal'],
  HorizontalAlignment: ['Left', 'Center', 'Right', 'Stretch'],
  Validation: ['Error', 'Warning', 'Info'],
  Style: [
    'Filled',
    'Outlined',
    'Text',
    'Elevated',
    'Tonal',
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
    'Primary',
    'Secondary',
    'Tertiary',
    'Surface',
    'Assist',
    'Filter',
    'Input',
    'Suggestion',
  ],
}

const EMPHASIS_TEXT_STYLES = new Set([
  'DisplayLarge',
  'DisplayMedium',
  'DisplaySmall',
  'HeadlineLarge',
  'HeadlineMedium',
  'HeadlineSmall',
  'TitleLarge',
  'TitleMedium',
  'TitleSmall',
])

const SUPPORTING_TEXT_STYLES = new Set([
  'BodySmall',
  'LabelLarge',
  'LabelMedium',
  'LabelSmall',
])

const FORM_CONTROL_TYPES = new Set([
  'TextBox',
  'PasswordBox',
  'ToggleSwitch',
  'CheckBox',
  'RadioButton',
  'Slider',
])

function isStepperButton(node) {
  if (!node || node.type !== 'Button') return false
  const content = String(node.properties?.Content || '').trim()
  return content === '+' || content === '-' || content.toLowerCase() === 'plus' || content.toLowerCase() === 'minus'
}

function isStepperInput(node) {
  if (!node || node.type !== 'TextBox') return false
  const text = String(node.properties?.Text || '').trim()
  return /^\d+(\.\d+)?$/.test(text) || String(node.properties?.Header || '').toLowerCase().includes('quantity')
}

function looksLikeStepperRow(node) {
  if (!node || !Array.isArray(node.children) || node.children.length < 3) return false
  const candidates = node.children.filter((child) => child.type === 'Button' || child.type === 'TextBox')
  if (candidates.length < 3) return false

  const hasMinus = candidates.some((child) => isStepperButton(child) && String(child.properties.Content).trim() === '-')
  const hasPlus = candidates.some((child) => isStepperButton(child) && String(child.properties.Content).trim() === '+')
  const hasInput = candidates.some(isStepperInput)
  return hasMinus && hasPlus && hasInput
}

function kebabCase(value) {
  if (!value) return ''

  return String(value)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function uniqueId(baseId, usedIds) {
  let id = baseId || 'node'
  if (!usedIds.has(id)) {
    usedIds.add(id)
    return id
  }

  let counter = 2
  while (usedIds.has(`${id}-${counter}`)) {
    counter += 1
  }

  const unique = `${id}-${counter}`
  usedIds.add(unique)
  return unique
}

function toPropertyString(key, value) {
  if (value === null || value === undefined) return ''

  if (BOOLEAN_PROPERTIES.has(key)) {
    if (typeof value === 'string') {
      const lowered = value.trim().toLowerCase()
      if (['true', '1', 'yes', 'on'].includes(lowered)) return 'True'
      if (['false', '0', 'no', 'off'].includes(lowered)) return 'False'
      return 'False'
    }

    return value ? 'True' : 'False'
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : ''
  }

  if (typeof value === 'boolean') {
    return value ? 'True' : 'False'
  }

  if (typeof value === 'string') {
    return value
  }

  try {
    return JSON.stringify(value)
  } catch {
    return ''
  }
}

function sanitizeProperties(type, value, repairs) {
  const safe = {}

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    if (value !== undefined) {
      repairs.push(`Coerced non-object properties on ${type} to empty object`)
    }
    return safe
  }

  for (const [rawKey, rawValue] of Object.entries(value)) {
    const key = String(rawKey).trim()
    if (!key) continue

    let normalized = toPropertyString(key, rawValue)
    if (key in ENUM_PROPERTIES && normalized) {
      const allowed = ENUM_PROPERTIES[key]
      if (!allowed.includes(normalized)) {
        const caseInsensitive = allowed.find((option) => option.toLowerCase() === normalized.toLowerCase())
        normalized = caseInsensitive || allowed[0]
        repairs.push(`Normalized enum ${key} to ${normalized}`)
      }
    }

    safe[key] = normalized
  }

  return safe
}

function defaultNode(type, idBase) {
  return {
    id: idBase,
    type,
    properties: {},
    children: [],
  }
}

function ensureProperty(properties, key, value, nodeType, repairs, note) {
  if (properties[key] === undefined || properties[key] === '') {
    properties[key] = value
    repairs.push(`${nodeType}: applied default ${key}=${value}${note ? ` (${note})` : ''}`)
  }
}

function inferTextStyle(node, parentType, depth) {
  const rawText = String(node.properties.Text || '')
  const text = rawText.trim()
  const isLong = text.length > 72
  const isShort = text.length > 0 && text.length <= 30
  const looksLabel = /^[A-Z0-9 .:_-]+$/.test(text) || text.endsWith(':')

  if (depth <= 1) return isLong ? 'TitleMedium' : 'HeadlineSmall'
  if (parentType === 'NavigationBar') return 'TitleMedium'
  if (parentType === 'Card') return isLong ? 'BodyMedium' : 'TitleSmall'
  if (parentType === 'Button' || looksLabel) return 'LabelLarge'
  if (isShort && !isLong) return 'BodyLarge'
  return isLong ? 'BodySmall' : 'BodyMedium'
}

function inferTextColor(style, text) {
  const lower = text.toLowerCase()
  if (lower.includes('error') || lower.includes('invalid') || lower.includes('failed')) return '#B3261E'
  if (lower.includes('warning')) return '#B7791F'
  if (EMPHASIS_TEXT_STYLES.has(style)) return '#1C1B1F'
  if (SUPPORTING_TEXT_STYLES.has(style)) return '#49454F'
  return '#1C1B1F'
}

function inferButtonStyle(content) {
  const lower = String(content || '').toLowerCase()
  if (!lower) return 'Filled'
  if (/(cancel|close|back|dismiss|skip|later|no)$/.test(lower)) return 'Text'
  if (/(test|connection|details|settings|branch|choose|select|filter|browse)/.test(lower)) return 'Outlined'
  if (/(ship all|secondary|tonal)/.test(lower)) return 'Tonal'
  if (/(create|save|submit|send|apply|continue|sign in|ship|publish|next|ok|start)/.test(lower)) return 'Filled'
  return 'Outlined'
}

function applyMaterialDefaults(node, parentType, depth, repairs) {
  const p = node.properties

  switch (node.type) {
    case 'Page':
      ensureProperty(p, 'Background', '#F4F6FB', node.type, repairs)
      break

    case 'StackPanel':
      if (looksLikeStepperRow(node)) {
        ensureProperty(p, 'Orientation', 'Horizontal', node.type, repairs, 'quantity stepper layout')
        ensureProperty(p, 'Spacing', '8', node.type, repairs, 'stepper spacing')
      }
      if (!p.Orientation) {
        ensureProperty(p, 'Orientation', 'Vertical', node.type, repairs)
      }
      ensureProperty(p, 'Spacing', p.Orientation === 'Horizontal' ? '8' : '12', node.type, repairs)
      if (!p.Padding && (parentType === 'Page' || parentType === 'ScrollViewer')) {
        ensureProperty(
          p,
          'Padding',
          depth <= 1 ? '24' : '16',
          node.type,
          repairs,
          'layout rhythm',
        )
      }
      break

    case 'Grid':
      ensureProperty(p, 'RowSpacing', '12', node.type, repairs)
      ensureProperty(p, 'ColumnSpacing', '12', node.type, repairs)
      if (!p.Padding && parentType === 'Page') {
        ensureProperty(p, 'Padding', '24', node.type, repairs)
      }
      break

    case 'Card':
      ensureProperty(
        p,
        'Style',
        parentType === 'ListView' || parentType === 'GridView' ? 'Filled' : 'Elevated',
        node.type,
        repairs,
      )
      ensureProperty(p, 'Padding', '16', node.type, repairs, 'card rhythm')
      break

    case 'TextBlock': {
      const style = p.Style || inferTextStyle(node, parentType, depth)
      ensureProperty(p, 'Style', style, node.type, repairs)
      if (!p.Foreground) {
        ensureProperty(
          p,
          'Foreground',
          inferTextColor(style, String(p.Text || '')),
          node.type,
          repairs,
        )
      }
      break
    }

    case 'Button':
      ensureProperty(p, 'Style', inferButtonStyle(p.Content), node.type, repairs)
      ensureProperty(p, 'IsEnabled', 'True', node.type, repairs)
      if (!p.Content) {
        ensureProperty(p, 'Content', 'Action', node.type, repairs)
      }
      if (String(p.Content).trim() === '+' || String(p.Content).trim() === '-') {
        ensureProperty(p, 'Width', '36', node.type, repairs, 'stepper control size')
        ensureProperty(p, 'Height', '36', node.type, repairs, 'stepper control size')
      }
      break

    case 'TextBox':
      if (parentType === 'StackPanel') {
        const header = String(p.Header || '').toLowerCase()
        if (header.includes('quantity') || /^\d+(\.\d+)?$/.test(String(p.Text || '').trim())) {
          ensureProperty(p, 'Width', '76', node.type, repairs, 'stepper input width')
        }
      }
      if (!p.Header && p.PlaceholderText) {
        ensureProperty(p, 'Header', p.PlaceholderText.replace(/^enter\s+/i, ''), node.type, repairs)
      }
      if (!p.PlaceholderText && p.Header) {
        ensureProperty(p, 'PlaceholderText', `Enter ${String(p.Header).toLowerCase()}`, node.type, repairs)
      }
      break

    case 'PasswordBox':
      if (!p.PlaceholderText) {
        ensureProperty(p, 'PlaceholderText', 'Enter password', node.type, repairs)
      }
      break

    case 'ToggleSwitch':
      ensureProperty(p, 'IsOn', 'False', node.type, repairs)
      break

    case 'CheckBox':
    case 'RadioButton':
      ensureProperty(p, 'IsChecked', 'False', node.type, repairs)
      break

    case 'Slider':
      ensureProperty(p, 'Minimum', '0', node.type, repairs)
      ensureProperty(p, 'Maximum', '100', node.type, repairs)
      ensureProperty(p, 'Value', '50', node.type, repairs)
      break

    case 'ProgressBar':
      if (!p.IsIndeterminate) ensureProperty(p, 'Value', '50', node.type, repairs)
      break

    case 'ProgressRing':
      ensureProperty(p, 'IsActive', 'True', node.type, repairs)
      break

    case 'NavigationBar':
      ensureProperty(p, 'MainCommand', 'Back', node.type, repairs)
      break

    case 'Icon':
      ensureProperty(p, 'FontSize', '20', node.type, repairs)
      ensureProperty(p, 'Foreground', '#49454F', node.type, repairs)
      break

    case 'FloatingActionButton':
      ensureProperty(p, 'Style', 'Primary', node.type, repairs)
      break

    case 'Chip':
      ensureProperty(p, 'Style', 'Assist', node.type, repairs)
      break

    case 'Border':
      ensureProperty(p, 'CornerRadius', '12', node.type, repairs)
      break

    default:
      break
  }

  if (
    node.type === 'StackPanel' &&
    !p.Spacing &&
    Array.isArray(node.children) &&
    node.children.some((child) => FORM_CONTROL_TYPES.has(child.type))
  ) {
    ensureProperty(p, 'Spacing', '12', node.type, repairs, 'form controls spacing')
  }
}

function repairNode(input, options) {
  const {
    usedIds,
    repairs,
    fallbackId,
    isRoot,
    parentType,
    depth,
  } = options

  const source = input && typeof input === 'object' && !Array.isArray(input) ? input : defaultNode('StackPanel', fallbackId)

  const originalType = typeof source.type === 'string' ? source.type : 'StackPanel'
  let type = originalType
  const isUnsupportedType = !VALID_COMPONENT_TYPES.has(type)
  if (isUnsupportedType) {
    const fallbackType = isRoot
      ? 'Page'
      : (Array.isArray(source.children) && source.children.length > 0 ? 'StackPanel' : 'Border')
    repairs.push(`Unsupported component type ${String(source.type)} downgraded to ${fallbackType} (manual XAML review required)`)
    type = fallbackType
  }

  if (isRoot && type !== 'Page') {
    repairs.push(`Root type ${type} mapped to Page`)
    type = 'Page'
  }

  const proposedId = kebabCase(source.id || fallbackId || type)
  const id = uniqueId(proposedId || (isRoot ? 'page-root' : 'node'), usedIds)

  const properties = sanitizeProperties(type, source.properties, repairs)
  if (isUnsupportedType) {
    properties._OriginalType = String(originalType)
    properties._FallbackReason = 'unsupported-component-type'
  }

  const rawChildren = Array.isArray(source.children) ? source.children : []
  const children = rawChildren.map((child, index) => repairNode(child, {
    usedIds,
    repairs,
    fallbackId: `${id}-${index + 1}`,
    isRoot: false,
    parentType: type,
    depth: depth + 1,
  }))

  const repairedNode = {
    id,
    type,
    properties,
    ...(children.length > 0 ? { children } : {}),
  }

  applyMaterialDefaults(repairedNode, parentType, depth, repairs)
  return repairedNode
}

export function repairComponentTree(input) {
  const usedIds = new Set()
  const repairs = []

  const tree = repairNode(input, {
    usedIds,
    repairs,
    fallbackId: 'page-root',
    isRoot: true,
    parentType: null,
    depth: 0,
  })

  if (tree.id !== 'page-root' && !usedIds.has('page-root')) {
    repairs.push(`Root id ${tree.id} normalized to page-root`)
    usedIds.delete(tree.id)
    tree.id = uniqueId('page-root', usedIds)
  }

  return { tree, repairs }
}

function assertNode(node, path, seenIds) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    throw new Error(`Invalid node at ${path}: expected object`)
  }

  if (typeof node.id !== 'string' || !node.id.trim()) {
    throw new Error(`Invalid node at ${path}: missing id`)
  }

  if (seenIds.has(node.id)) {
    throw new Error(`Duplicate node id: ${node.id}`)
  }
  seenIds.add(node.id)

  if (typeof node.type !== 'string' || !VALID_COMPONENT_TYPES.has(node.type)) {
    throw new Error(`Invalid node type at ${path}: ${String(node.type)}`)
  }

  if (!node.properties || typeof node.properties !== 'object' || Array.isArray(node.properties)) {
    throw new Error(`Invalid properties at ${path}`)
  }

  for (const [key, value] of Object.entries(node.properties)) {
    if (typeof value !== 'string') {
      throw new Error(`Property ${path}.${key} must be a string`)
    }
  }

  if (node.children !== undefined) {
    if (!Array.isArray(node.children)) {
      throw new Error(`Children at ${path} must be an array`)
    }

    node.children.forEach((child, index) => assertNode(child, `${path}.children[${index}]`, seenIds))
  }
}

export function validateTreeStrict(tree) {
  if (!tree || typeof tree !== 'object' || Array.isArray(tree)) {
    throw new Error('Tree must be an object')
  }

  if (tree.type !== 'Page') {
    throw new Error(`Root node type must be Page, got ${String(tree.type)}`)
  }

  assertNode(tree, 'root', new Set())
}

// Attempt to repair common JSON issues from model output
function repairJson(str) {
  let s = str
  // Strip JS-style comments (// and /* */)
  s = s.replace(/\/\/[^\n]*/g, '')
  s = s.replace(/\/\*[\s\S]*?\*\//g, '')
  // Remove trailing commas before } or ]
  s = s.replace(/,\s*([}\]])/g, '$1')
  // Strip control chars except \n \r \t
  s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
  return s
}

// Try to close truncated JSON by balancing braces/brackets
function closeTruncatedJson(str) {
  let depth = { brace: 0, bracket: 0 }
  let inString = false
  let escape = false
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    if (escape) { escape = false; continue }
    if (ch === '\\' && inString) { escape = true; continue }
    if (ch === '"') { inString = !inString; continue }
    if (inString) continue
    if (ch === '{') depth.brace++
    else if (ch === '}') depth.brace--
    else if (ch === '[') depth.bracket++
    else if (ch === ']') depth.bracket--
  }
  // If we're inside an unclosed string, close it
  if (inString) str += '"'
  // Close open brackets/braces
  while (depth.bracket > 0) { str += ']'; depth.bracket-- }
  while (depth.brace > 0) { str += '}'; depth.brace-- }
  return str
}

function tryParse(str) {
  try { return JSON.parse(str) } catch { return null }
}

export function extractJsonObject(text) {
  if (typeof text !== 'string') {
    throw new Error('Model response must be a string')
  }

  // Try extracting from code blocks, starting from the last one (models often put thinking/example blocks first)
  const codeBlockRegex = /```(?:json)?\s*\n?([\s\S]*?)\n?```/gi;
  let match;
  const blocks = [];
  while ((match = codeBlockRegex.exec(text)) !== null) {
    blocks.push(match[1].trim());
  }

  // Check blocks from last to first — try raw, then repaired, then truncation-closed
  for (let i = blocks.length - 1; i >= 0; i--) {
    const block = blocks[i]
    let result = tryParse(block)
    if (result) return result
    result = tryParse(repairJson(block))
    if (result) return result
    result = tryParse(closeTruncatedJson(repairJson(block)))
    if (result) return result
  }

  // Fallback: try parsing the whole thing
  let result = tryParse(text.trim())
  if (result) return result
  result = tryParse(repairJson(text.trim()))
  if (result) return result

  // Fallback: find outer braces
  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')

  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const slice = text.slice(firstBrace, lastBrace + 1)
    result = tryParse(slice)
    if (result) return result
    result = tryParse(repairJson(slice))
    if (result) return result
  }

  // Last resort: find first { and try to close truncated JSON
  if (firstBrace !== -1) {
    const fromBrace = text.slice(firstBrace)
    const repaired = repairJson(fromBrace)
    result = tryParse(closeTruncatedJson(repaired))
    if (result) return result
  }

  throw new Error('Failed to parse generated UI. Please try again.')
}

export { VALID_COMPONENT_TYPES }
