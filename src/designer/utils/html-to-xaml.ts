// ── HTML → WinUI XAML Converter for Designer ───
// Parses rendered HTML and maps it to idiomatic Uno Platform / WinUI XAML

const XAML_NAMESPACES = [
  'xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"',
  'xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"',
  'xmlns:utu="using:Uno.Toolkit.UI"',
  'xmlns:um="using:Uno.Material"',
].join('\n    ')

function indent(depth: number): string {
  return '    '.repeat(depth)
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── CSS value converters ───

function cssColorToXaml(color: string): string {
  if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return 'Transparent'
  if (color.startsWith('#')) return color.toUpperCase()
  const rgb = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (!rgb) return color
  const [, r, g, b, a] = rgb
  const hex = (n: string) => parseInt(n).toString(16).padStart(2, '0').toUpperCase()
  if (a !== undefined && parseFloat(a) < 1) {
    const alpha = Math.round(parseFloat(a) * 255).toString(16).padStart(2, '0').toUpperCase()
    return `#${alpha}${hex(r)}${hex(g)}${hex(b)}`
  }
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

function cssSizeToXaml(value: string): string {
  if (!value) return 'Auto'
  if (value === 'auto' || value === 'fit-content') return 'Auto'
  if (value.endsWith('px')) return value.replace('px', '')
  if (value.endsWith('%')) return `${parseFloat(value) / 100}*`
  if (value.endsWith('rem')) return `${parseFloat(value) * 16}`
  return value
}

function cssFontWeightToXaml(weight: string): string {
  const w = parseInt(weight)
  if (isNaN(w)) {
    const map: Record<string, string> = { normal: 'Normal', bold: 'Bold', lighter: 'Light', bolder: 'Bold' }
    return map[weight] || 'Normal'
  }
  if (w >= 800) return 'ExtraBold'
  if (w >= 700) return 'Bold'
  if (w >= 600) return 'SemiBold'
  if (w >= 500) return 'Medium'
  if (w >= 300) return 'Light'
  if (w >= 200) return 'ExtraLight'
  return 'Normal'
}

function cssAlignToXaml(align: string): string {
  const map: Record<string, string> = {
    left: 'Left', start: 'Left', right: 'Right', end: 'Right', center: 'Center', justify: 'Left'
  }
  return map[align] || 'Left'
}

function cssFlexAlignToXaml(value: string): string {
  const map: Record<string, string> = {
    'flex-start': 'Start', start: 'Start',
    'flex-end': 'End', end: 'End',
    center: 'Center',
    'space-between': 'SpaceBetween',
    'space-around': 'SpaceAround',
    'space-evenly': 'SpaceEvenly',
    stretch: 'Stretch',
  }
  return map[value] || 'Start'
}

function parsePaddingOrMargin(value: string): string {
  if (!value) return '0'
  const parts = value.replace(/px/g, '').trim().split(/\s+/).map(p => Math.round(parseFloat(p) || 0))
  if (parts.length === 1) return `${parts[0]}`
  if (parts.length === 2) return `${parts[1]},${parts[0]}`  // XAML: left,top,right,bottom → CSS: top,right
  if (parts.length === 3) return `${parts[1]},${parts[0]},${parts[1]},${parts[2]}`
  if (parts.length === 4) return `${parts[3]},${parts[0]},${parts[1]},${parts[2]}`
  return '0'
}

function cssBorderRadiusToXaml(value: string): string {
  if (!value) return '0'
  const parts = value.replace(/px/g, '').trim().split(/\s+/).map(p => Math.round(parseFloat(p) || 0))
  if (parts.length === 1) return `${parts[0]}`
  return `${parts[0]},${parts[1]},${parts[2] || parts[0]},${parts[3] || parts[1]}`
}

// ── Element mapping ───

interface XamlNode {
  tag: string
  props: Record<string, string>
  children: XamlNode[]
  text?: string
  comment?: string
}

function getComputedStylesFromElement(el: Element): Record<string, string> {
  const styles: Record<string, string> = {}
  const styleAttr = el.getAttribute('style')
  if (styleAttr) {
    styleAttr.split(';').forEach(decl => {
      const [prop, val] = decl.split(':').map(s => s.trim())
      if (prop && val) {
        // Convert kebab-case to camelCase
        const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        styles[camel] = val
      }
    })
  }
  return styles
}

function getClassList(el: Element): string[] {
  const cls = el.getAttribute('class')
  return cls ? cls.split(/\s+/).filter(Boolean) : []
}

function inferStylesFromClasses(classes: string[]): Record<string, string> {
  const styles: Record<string, string> = {}
  for (const cls of classes) {
    // Flex
    if (cls === 'flex') styles.display = 'flex'
    if (cls === 'flex-col' || cls === 'flex-column') styles.flexDirection = 'column'
    if (cls === 'flex-row') styles.flexDirection = 'row'
    if (cls === 'items-center') styles.alignItems = 'center'
    if (cls === 'items-start') styles.alignItems = 'flex-start'
    if (cls === 'items-end') styles.alignItems = 'flex-end'
    if (cls === 'justify-center') styles.justifyContent = 'center'
    if (cls === 'justify-between') styles.justifyContent = 'space-between'
    if (cls === 'justify-end') styles.justifyContent = 'flex-end'
    // Text
    if (cls === 'text-center') styles.textAlign = 'center'
    if (cls === 'text-right') styles.textAlign = 'right'
    if (cls === 'font-bold') styles.fontWeight = '700'
    if (cls === 'font-semibold') styles.fontWeight = '600'
    if (cls === 'font-medium') styles.fontWeight = '500'
    if (cls === 'font-light') styles.fontWeight = '300'
    // Sizing
    if (cls === 'w-full') styles.width = '100%'
    if (cls === 'h-full') styles.height = '100%'
    // Gaps
    const gapMatch = cls.match(/^gap-(\d+)$/)
    if (gapMatch) styles.gap = `${parseInt(gapMatch[1]) * 4}px`
    // Padding
    const pMatch = cls.match(/^p-(\d+)$/)
    if (pMatch) styles.padding = `${parseInt(pMatch[1]) * 4}px`
    const pxMatch = cls.match(/^px-(\d+)$/)
    if (pxMatch) { styles.paddingLeft = `${parseInt(pxMatch[1]) * 4}px`; styles.paddingRight = `${parseInt(pxMatch[1]) * 4}px` }
    const pyMatch = cls.match(/^py-(\d+)$/)
    if (pyMatch) { styles.paddingTop = `${parseInt(pyMatch[1]) * 4}px`; styles.paddingBottom = `${parseInt(pyMatch[1]) * 4}px` }
    // Rounded
    if (cls === 'rounded') styles.borderRadius = '4px'
    if (cls === 'rounded-lg') styles.borderRadius = '8px'
    if (cls === 'rounded-xl') styles.borderRadius = '12px'
    if (cls === 'rounded-2xl') styles.borderRadius = '16px'
    if (cls === 'rounded-full') styles.borderRadius = '9999px'
    // Overflow
    if (cls === 'overflow-hidden') styles.overflow = 'hidden'
    if (cls === 'truncate') styles.overflow = 'hidden'
  }
  return styles
}

function isBlockElement(tag: string): boolean {
  return ['div', 'section', 'article', 'main', 'header', 'footer', 'nav', 'aside', 'form', 'ul', 'ol', 'li'].includes(tag)
}

function isTextElement(tag: string): boolean {
  return ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'strong', 'em', 'b', 'i', 'small', 'a'].includes(tag)
}

function convertElement(el: Element, depth: number): XamlNode | null {
  const tag = el.tagName.toLowerCase()
  const classes = getClassList(el)
  const inlineStyles = getComputedStylesFromElement(el)
  const classStyles = inferStylesFromClasses(classes)
  const styles = { ...classStyles, ...inlineStyles }

  // Skip script, style, svg internals
  if (['script', 'style', 'link', 'meta', 'br', 'hr'].includes(tag)) return null

  // SVG → just note it
  if (tag === 'svg') {
    return { tag: 'FontIcon', props: { Glyph: '"\\uE700"', FontFamily: '{ThemeResource SymbolThemeFontFamily}' }, children: [], comment: 'SVG icon — replace with FontIcon or PathIcon' }
  }

  // Image
  if (tag === 'img') {
    const src = el.getAttribute('src') || ''
    const alt = el.getAttribute('alt') || ''
    const props: Record<string, string> = { Source: src }
    if (alt) props['AutomationProperties.Name'] = alt
    if (styles.width) props.Width = cssSizeToXaml(styles.width)
    if (styles.height) props.Height = cssSizeToXaml(styles.height)
    if (styles.borderRadius) props.CornerRadius = cssBorderRadiusToXaml(styles.borderRadius)
    return { tag: 'Image', props, children: [] }
  }

  // Input elements
  if (tag === 'input') {
    const type = el.getAttribute('type') || 'text'
    const placeholder = el.getAttribute('placeholder') || ''
    if (type === 'checkbox') return { tag: 'CheckBox', props: { Content: placeholder || 'Option' }, children: [] }
    if (type === 'radio') return { tag: 'RadioButton', props: { Content: placeholder || 'Option' }, children: [] }
    if (type === 'password') return { tag: 'PasswordBox', props: { PlaceholderText: placeholder }, children: [] }
    return { tag: 'TextBox', props: { PlaceholderText: placeholder }, children: [] }
  }
  if (tag === 'textarea') {
    return { tag: 'TextBox', props: { AcceptsReturn: 'True', PlaceholderText: el.getAttribute('placeholder') || '' }, children: [] }
  }
  if (tag === 'select') {
    return { tag: 'ComboBox', props: { PlaceholderText: 'Select...' }, children: [] }
  }

  // Button
  if (tag === 'button') {
    const text = el.textContent?.trim() || 'Button'
    const props: Record<string, string> = { Content: text }
    if (styles.backgroundColor) props.Background = cssColorToXaml(styles.backgroundColor)
    if (styles.color) props.Foreground = cssColorToXaml(styles.color)
    if (styles.borderRadius) props.CornerRadius = cssBorderRadiusToXaml(styles.borderRadius)
    if (styles.padding) props.Padding = parsePaddingOrMargin(styles.padding)
    return { tag: 'Button', props, children: [] }
  }

  // Convert children
  const children: XamlNode[] = []
  let textContent = ''

  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === 3) { // Text node
      const t = child.textContent?.trim()
      if (t) textContent += (textContent ? ' ' : '') + t
    } else if (child.nodeType === 1) {
      const converted = convertElement(child as Element, depth + 1)
      if (converted) children.push(converted)
    }
  }

  // Pure text elements
  if (isTextElement(tag) && children.length === 0) {
    const props: Record<string, string> = {}
    if (textContent) props.Text = textContent
    if (styles.fontSize) props.FontSize = styles.fontSize.replace('px', '')
    if (styles.fontWeight) props.FontWeight = cssFontWeightToXaml(styles.fontWeight)
    if (styles.color) props.Foreground = cssColorToXaml(styles.color)
    if (styles.textAlign) props.TextAlignment = cssAlignToXaml(styles.textAlign)
    if (styles.lineHeight && styles.lineHeight !== 'normal') props.LineHeight = styles.lineHeight.replace('px', '')
    if (styles.margin) props.Margin = parsePaddingOrMargin(styles.margin)

    // Heading → larger TextBlock
    if (/^h[1-6]$/.test(tag)) {
      const level = parseInt(tag[1])
      const sizeMap: Record<number, string> = { 1: '28', 2: '24', 3: '20', 4: '18', 5: '16', 6: '14' }
      if (!props.FontSize) props.FontSize = sizeMap[level]
      if (!props.FontWeight) props.FontWeight = 'Bold'
    }

    // Link
    if (tag === 'a') {
      const href = el.getAttribute('href') || ''
      return { tag: 'HyperlinkButton', props: { Content: textContent, NavigateUri: href }, children: [] }
    }

    return { tag: 'TextBlock', props, children: [] }
  }

  // Block/container elements → StackPanel or Grid
  const isFlex = styles.display === 'flex'
  const isRow = styles.flexDirection !== 'column'

  // List items
  if (tag === 'ul' || tag === 'ol') {
    return { tag: 'StackPanel', props: { Spacing: styles.gap ? styles.gap.replace('px', '') : '4' }, children }
  }
  if (tag === 'li') {
    if (children.length === 0 && textContent) {
      return { tag: 'TextBlock', props: { Text: `• ${textContent}` }, children: [] }
    }
    // Wrap li content in a StackPanel
    if (textContent && children.length > 0) {
      children.unshift({ tag: 'TextBlock', props: { Text: textContent }, children: [] })
    }
    return { tag: 'StackPanel', props: { Orientation: 'Horizontal', Spacing: '8' }, children }
  }

  // Container
  const containerTag = 'StackPanel'
  const props: Record<string, string> = {}

  if (isFlex) {
    props.Orientation = isRow ? 'Horizontal' : 'Vertical'
    if (styles.gap) props.Spacing = styles.gap.replace('px', '')
    if (styles.alignItems === 'center') props['VerticalAlignment'] = 'Center'
    if (styles.justifyContent === 'center') props['HorizontalAlignment'] = 'Center'
    if (styles.justifyContent === 'space-between') {
      // Can't do space-between in StackPanel, note it
      props['HorizontalAlignment'] = 'Stretch'
    }
  }

  if (styles.backgroundColor) props.Background = cssColorToXaml(styles.backgroundColor)
  if (styles.padding) props.Padding = parsePaddingOrMargin(styles.padding)
  if (styles.margin) props.Margin = parsePaddingOrMargin(styles.margin)
  if (styles.borderRadius) props.CornerRadius = cssBorderRadiusToXaml(styles.borderRadius)
  if (styles.width && styles.width !== '100%') props.Width = cssSizeToXaml(styles.width)
  if (styles.height) props.Height = cssSizeToXaml(styles.height)

  // If it has only text and no children, make it a TextBlock
  if (children.length === 0 && textContent) {
    return { tag: 'TextBlock', props: { ...props, Text: textContent }, children: [] }
  }

  // Add text as first child if mixed
  if (textContent && children.length > 0) {
    children.unshift({ tag: 'TextBlock', props: { Text: textContent }, children: [] })
  }

  return { tag: containerTag, props, children }
}

// ── Serializer ───

function serializeXamlNode(node: XamlNode, depth: number, isRoot: boolean = false): string {
  const pad = indent(depth)
  const entries = Object.entries(node.props)

  let commentLine = ''
  if (node.comment) {
    commentLine = `${pad}<!-- ${node.comment} -->\n`
  }

  // Build attribute string
  let attrStr = ''
  if (isRoot) {
    attrStr = `\n    ${XAML_NAMESPACES}`
    if (entries.length > 0) {
      attrStr += '\n' + entries.map(([k, v]) => `    ${k}="${xmlEscape(v)}"`).join('\n')
    }
  } else if (entries.length <= 2) {
    attrStr = entries.map(([k, v]) => ` ${k}="${xmlEscape(v)}"`).join('')
  } else {
    attrStr = '\n' + entries.map(([k, v]) => `${pad}    ${k}="${xmlEscape(v)}"`).join('\n')
  }

  if (node.children.length === 0) {
    return `${commentLine}${pad}<${node.tag}${attrStr} />`
  }

  const childStr = node.children
    .map(c => serializeXamlNode(c, depth + 1))
    .join('\n')

  return `${commentLine}${pad}<${node.tag}${attrStr}>\n${childStr}\n${pad}</${node.tag}>`
}

// ── Main converter ───

export function htmlToXaml(html: string): string {
  if (!html.trim()) return '<!-- No HTML content to convert -->'

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')
    const root = doc.body.firstElementChild

    if (!root) return '<!-- Could not parse HTML -->'

    const children: XamlNode[] = []
    for (const child of Array.from(root.children)) {
      const converted = convertElement(child, 1)
      if (converted) children.push(converted)
    }

    if (children.length === 0) {
      // Maybe it's just text
      const text = root.textContent?.trim()
      if (text) {
        return `<Page\n    ${XAML_NAMESPACES}>\n    <TextBlock Text="${xmlEscape(text)}" />\n</Page>`
      }
      return '<!-- No convertible elements found -->'
    }

    // Wrap in a Page with a root StackPanel
    const rootNode: XamlNode = {
      tag: 'Page',
      props: {},
      children: children.length === 1 ? children : [{
        tag: 'StackPanel',
        props: {},
        children,
      }],
    }

    return serializeXamlNode(rootNode, 0, true)
  } catch (e) {
    return `<!-- XAML conversion error: ${String(e)} -->`
  }
}
