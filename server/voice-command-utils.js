const APP_TEMPLATES = [
  { kind: 'listing-detail', match: /\b(listing detail|airbnb|property detail|hotel detail|rental detail|booking detail|listing page|accommodation)\b/ },
  { kind: 'ecommerce-detail', match: /\b(ecommerce|e-commerce|shopping app|product detail|product page)\b/ },
  { kind: 'paywall', match: /\b(paywall|pricing|subscription|plans?|packages?)\b/ },
  { kind: 'dashboard', match: /\b(dashboard|analytics|stats|overview)\b/ },
  { kind: 'settings', match: /\bsettings?\b/ },
  { kind: 'chat', match: /\b(chat|messaging|messages)\b/ },
  { kind: 'profile', match: /\b(profile|user profile|my account|account page)\b/ },
  { kind: 'login', match: /\b(login|sign in|signin|log in|authentication)\b/ },
  { kind: 'onboarding', match: /\b(onboarding|welcome screen|getting started|walkthrough)\b/ },
]

const NUMBER_WORDS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
}

export function cloneTree(tree) {
  return tree ? JSON.parse(JSON.stringify(tree)) : null
}

export function createEmptyPage() {
  return {
    id: 'page-root',
    type: 'Page',
    properties: { Background: '#FFFFFF' },
    children: [
      {
        id: 'scroll-root',
        type: 'ScrollViewer',
        properties: {},
        children: [
          {
            id: 'content-stack',
            type: 'StackPanel',
            properties: { Orientation: 'Vertical', Padding: '16', Spacing: '16' },
            children: [],
          },
        ],
      },
    ],
  }
}

export function normalizeVoiceTranscript(transcript) {
  const raw = String(transcript || '')
    .replace(/\[voice\]/gi, ' ')
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()

  const clauses = raw
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

  const deduped = []
  for (const clause of clauses) {
    const normalized = clause.replace(/[.!?]+$/g, '').trim().toLowerCase()
    if (!normalized) continue
    if (deduped.length && deduped[deduped.length - 1].toLowerCase() === normalized) continue
    deduped.push(clause)
  }

  return deduped.join(' ').trim() || raw
}

export function summarizeVoiceHistory(history) {
  if (!Array.isArray(history)) return []
  const seen = new Set()
  const items = []
  for (const entry of history) {
    const normalized = normalizeVoiceTranscript(entry)
    if (!normalized) continue
    const key = normalized.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    items.push(normalized)
  }
  return items.slice(-6)
}

export function buildVoiceDirectiveSummary(transcript) {
  const directives = extractVoiceDirectives(transcript)
  const lines = []
  if (directives.removeImages) lines.push(`remove images (${directives.removeImagesPosition})`)
  if (directives.removeBottomNav) lines.push('remove bottom navigation')
  if (directives.removePrimaryButton) lines.push('remove primary button')
  if (directives.removeCards) lines.push('remove cards')
  if (directives.addBottomNav) lines.push(`add bottom navigation${directives.bottomNavTabCount ? ` with ${directives.bottomNavTabCount} tabs` : ''}`)
  if (directives.closeButton) lines.push(`close button at ${directives.closeButtonPosition.toLowerCase()}`)
  if (directives.makeBigger) lines.push(`make ${directives.makeBigger} bigger`)
  if (directives.keepOnly) lines.push(`keep only ${directives.keepOnly}`)
  return lines
}

function createEmptyVoiceSession() {
  return {
    turn: 0,
    archetype: null,
    blueprint: { sections: {} },
    instructionLedger: [],
    unresolved: [],
    lastOperations: [],
  }
}

function normalizeVoiceSession(voiceSession, currentTree) {
  const inferred = inferVoiceBlueprintFromTree(currentTree)
  const previousSections = voiceSession?.blueprint?.sections || {}
  return {
    turn: voiceSession?.turn || 0,
    archetype: voiceSession?.archetype || inferred.archetype || null,
    blueprint: { sections: mergeSectionSpecs(inferred.sections, previousSections) },
    instructionLedger: Array.isArray(voiceSession?.instructionLedger) ? voiceSession.instructionLedger : [],
    unresolved: Array.isArray(voiceSession?.unresolved) ? voiceSession.unresolved : [],
    lastOperations: Array.isArray(voiceSession?.lastOperations) ? voiceSession.lastOperations : [],
  }
}

function mergeSectionSpecs(inferred, previous) {
  const merged = { ...inferred }
  for (const [role, spec] of Object.entries(previous || {})) {
    merged[role] = { ...(merged[role] || {}), ...spec }
  }
  return merged
}

function inferVoiceBlueprintFromTree(tree) {
  if (!tree) return { archetype: null, sections: {} }
  const sections = {}
  const archetype = inferVoiceArchetypeFromTree(tree)
  const header = findFirst(tree, (node) => node.id === 'header-actions')
  const bottomNav = findFirst(tree, (node) => node.id === 'bottom-nav' || node.type === 'BottomNavigationBar')
  const pricing = findFirst(tree, (node) => node.id === 'paywall-pricing-section')
  const pro = findFirst(tree, (node) => node.id === 'paywall-pro-card')
  const table = findDashboardTableNode(tree)
  const gallery = findFirst(tree, (node) => node.id === 'paywall-gallery')
  const reviews = findFirst(tree, (node) => node.id === 'reviews-list')
  const stats = findFirst(tree, (node) => node.id === 'paywall-stats')
  const about = findFirst(tree, (node) => node.id === 'paywall-about')
  const description = findFirst(tree, (node) => ['paywall-description', 'product-description'].includes(node.id))

  if (header) sections.header = { desired: true, alignment: header.properties?.HorizontalAlignment || 'Right' }
  if (findFirst(tree, (node) => node.id === 'close-button')) sections['close-button'] = { desired: true, position: header?.properties?.HorizontalAlignment || 'Right' }
  if (bottomNav) sections['bottom-nav'] = { desired: true, tabs: (bottomNav.children || []).length }
  if (pricing) sections.pricing = { desired: true, variant: 'cards', packageCount: (pricing.children || []).length, standoutPro: pro?.properties?.Highlighted === 'True' }
  if (description) sections.description = { desired: true }
  if (gallery) sections.gallery = { desired: true }
  if (reviews) sections.reviews = { desired: true }
  if (stats) sections.stats = { desired: true, prominent: (stats.children || []).some((child) => Number(child.properties?.Height || 0) >= 140) }
  if (about) sections.about = { desired: true }
  if (table) sections.table = { desired: true, rowCount: getCurrentTableRowCount(table), columnCount: getCurrentTableColumnCount(table), scrollable: table.properties?.Scrollable === 'True' }

  return { archetype, sections }
}

function inferVoiceArchetypeFromTree(tree) {
  if (!tree) return null
  if (findFirst(tree, (node) => node.id === 'paywall-title' || node.id === 'paywall-pricing-section')) return 'paywall'
  if (findFirst(tree, (node) => node.id === 'dashboard-title' || node.id === 'dashboard-data-table')) return 'dashboard'
  if (findFirst(tree, (node) => node.id === 'listing-title' || node.id === 'listing-gallery')) return 'listing-detail'
  if (findFirst(tree, (node) => node.id === 'profile-title')) return 'profile'
  if (findFirst(tree, (node) => node.id === 'login-title')) return 'login'
  if (findFirst(tree, (node) => node.id === 'onboarding-title')) return 'onboarding'
  if (findFirst(tree, (node) => node.id === 'product-title' || node.id === 'hero-image')) return 'ecommerce-detail'
  return null
}

function buildVoiceOperations({ transcript, directives, voiceSession, currentTree, lastTargetIds }) {
  const operations = []
  const currentArchetype = voiceSession.archetype || inferVoiceArchetypeFromTree(currentTree)

  if (directives.template) {
    operations.push({ kind: 'set_archetype', archetype: directives.template })
  }

  if (directives.removeBottomNav) operations.push({ kind: 'remove_section', role: 'bottom-nav' })
  if (directives.addBottomNav) operations.push({ kind: 'ensure_section', role: 'bottom-nav', tabs: directives.bottomNavTabCount || 5 })
  if (directives.removeImages) operations.push({ kind: 'remove_images', position: directives.removeImagesPosition || 'all' })
  if (directives.closeButton) operations.push({ kind: 'position_element', role: 'close-button', position: directives.closeButtonPosition || 'Right' })
  if (directives.moveNamedElement?.target === 'close-button') operations.push({ kind: 'position_element', role: 'close-button', position: directives.moveNamedElement.direction === 'left' ? 'Left' : 'Right' })
  if (directives.pronounReference && directives.horizontalEdge && (lastTargetIds || []).some((id) => id === 'close-button' || id === 'header-actions')) {
    operations.push({ kind: 'position_element', role: 'close-button', position: directives.horizontalEdge })
  }

  const paywallContext = currentArchetype === 'paywall' || directives.template === 'paywall' || /\b(paywall|pricing|subscription|packages?)\b/.test(transcript)
  if (paywallContext) {
    operations.push({ kind: 'set_archetype', archetype: 'paywall' })
    if (directives.noTable) operations.push({ kind: 'remove_section', role: 'table' })
    if (directives.pricingCards || directives.noTable || directives.packageCount) operations.push({ kind: 'ensure_section', role: 'pricing', variant: 'cards', packageCount: directives.packageCount || 3 })
    if (directives.featureChecklist) operations.push({ kind: 'style_section', role: 'pricing', checklist: true })
    if (directives.standoutPro) operations.push({ kind: 'emphasize_item', role: 'pricing', item: 'pro' })
    if (directives.longDescription) operations.push({ kind: 'ensure_section', role: 'description' })
    if (directives.gallery) operations.push({ kind: 'ensure_section', role: 'gallery', after: 'description' })
    if (directives.reviews) operations.push({ kind: 'ensure_section', role: 'reviews', after: 'gallery' })
    if (directives.statsSection) operations.push({ kind: 'ensure_section', role: 'stats', after: 'reviews', prominent: directives.prominentStats })
    if (directives.aboutSection) operations.push({ kind: 'ensure_section', role: 'about', after: 'stats' })
  }

  const dashboardContext = !paywallContext && (currentArchetype === 'dashboard' || directives.template === 'dashboard' || /\bdashboard\b/.test(transcript))
  if (dashboardContext && (directives.tableRequest || directives.rowCount || directives.columnCount || directives.realTableData || directives.scrollableTable || directives.makeBigger === 'table')) {
    operations.push({
      kind: 'ensure_section',
      role: 'table',
      rowCount: directives.rowCount || 10,
      columnCount: directives.columnCount || 5,
      scrollable: directives.scrollableTable || true,
      realistic: directives.realTableData || true,
    })
  }

  if (directives.pronounReference && directives.resize && (lastTargetIds || []).length > 0) {
    operations.push({ kind: 'mutate_target', targetIds: lastTargetIds, mutation: `resize-${directives.resize}` })
  }
  if (directives.pronounReference && directives.moveDirection && (lastTargetIds || []).length > 0) {
    operations.push({ kind: 'mutate_target', targetIds: lastTargetIds, mutation: `move-${directives.moveDirection}` })
  }
  if (directives.removeLastReference && (lastTargetIds || []).length > 0) {
    operations.push({ kind: 'mutate_target', targetIds: lastTargetIds, mutation: 'remove' })
  }

  if (operations.length === 0 && !currentTree && !directives.template) {
    operations.push({ kind: 'custom_create', summary: transcript })
  }

  return dedupeVoiceOperations(operations)
}

function dedupeVoiceOperations(operations) {
  const seen = new Set()
  const result = []
  for (const op of operations) {
    const key = `${op.kind}:${op.role || op.archetype || op.mutation || op.summary || ''}:${op.position || ''}:${op.tabs || ''}:${op.packageCount || ''}:${op.rowCount || ''}:${op.columnCount || ''}`
    if (seen.has(key)) continue
    seen.add(key)
    result.push(op)
  }
  return result
}

function updateVoiceSessionFromOperations(session, operations, transcript) {
  const next = {
    ...session,
    turn: (session.turn || 0) + 1,
    blueprint: { sections: { ...(session.blueprint?.sections || {}) } },
    instructionLedger: [...(session.instructionLedger || [])],
    unresolved: [],
    lastOperations: operations,
  }

  operations.forEach((op, index) => {
    if (op.kind === 'set_archetype') {
      next.archetype = op.archetype
    }
    if (op.role) {
      next.blueprint.sections[op.role] = {
        ...(next.blueprint.sections[op.role] || {}),
        ...(op.kind === 'remove_section' ? { desired: false } : { desired: true }),
        ...('tabs' in op ? { tabs: op.tabs } : {}),
        ...('packageCount' in op ? { packageCount: op.packageCount } : {}),
        ...('variant' in op ? { variant: op.variant } : {}),
        ...('position' in op ? { position: op.position, alignment: op.position } : {}),
        ...('rowCount' in op ? { rowCount: op.rowCount } : {}),
        ...('columnCount' in op ? { columnCount: op.columnCount } : {}),
        ...('scrollable' in op ? { scrollable: op.scrollable } : {}),
        ...('prominent' in op ? { prominent: op.prominent } : {}),
        ...('item' in op && op.item === 'pro' ? { standoutPro: true } : {}),
      }
    }

    for (const entry of next.instructionLedger) {
      if (entry.status === 'superseded') continue
      if (entry.role && op.role && entry.role === op.role && entry.kind !== op.kind) {
        entry.status = 'superseded'
      }
    }

    next.instructionLedger.push({
      id: `turn-${next.turn}-${index + 1}`,
      turn: next.turn,
      kind: op.kind,
      role: op.role || null,
      text: summarizeVoiceOperation(op, transcript),
      status: 'pending',
    })
  })

  return next
}

function summarizeVoiceOperation(op, transcript) {
  switch (op.kind) {
    case 'set_archetype': return `Use the ${op.archetype} archetype`
    case 'ensure_section': return `Ensure ${op.role} is present`
    case 'remove_section': return `Remove ${op.role}`
    case 'position_element': return `Place ${op.role} at ${String(op.position || '').toLowerCase()}`
    case 'emphasize_item': return `Make ${op.item} stand out in ${op.role}`
    case 'mutate_target': return `Apply ${op.mutation} to the targeted element`
    case 'remove_images': return 'Remove decorative images'
    default: return normalizeVoiceTranscript(transcript)
  }
}

function describeVoiceBlueprint(voiceSession) {
  if (!voiceSession?.blueprint?.sections) return ''
  const lines = []
  if (voiceSession.archetype) lines.push(`archetype: ${voiceSession.archetype}`)
  for (const [role, spec] of Object.entries(voiceSession.blueprint.sections)) {
    const details = []
    if (spec.desired === false) details.push('absent')
    else details.push('present')
    if (spec.packageCount) details.push(`${spec.packageCount} packages`)
    if (spec.tabs) details.push(`${spec.tabs} tabs`)
    if (spec.position) details.push(`position ${String(spec.position).toLowerCase()}`)
    if (spec.rowCount) details.push(`${spec.rowCount} rows`)
    if (spec.columnCount) details.push(`${spec.columnCount} columns`)
    if (spec.standoutPro) details.push('pro highlighted')
    if (spec.prominent) details.push('prominent')
    lines.push(`- ${role}: ${details.join(', ')}`)
  }
  return lines.join('\n')
}

function describeVoiceLedger(voiceSession) {
  const active = (voiceSession?.instructionLedger || []).filter((entry) => entry.status !== 'superseded').slice(-8)
  if (active.length === 0) return ''
  return active.map((entry) => `- [${entry.status}] ${entry.text}`).join('\n')
}

function verifyVoiceSession({ tree, voiceSession, operations }) {
  if (!voiceSession) return { voiceSession: createEmptyVoiceSession(), unresolved: [] }
  const next = {
    ...voiceSession,
    blueprint: inferVoiceBlueprintFromTree(tree),
    instructionLedger: [...(voiceSession.instructionLedger || [])],
  }
  next.blueprint.sections = mergeSectionSpecs(next.blueprint.sections, voiceSession.blueprint?.sections || {})

  const unresolved = []
  for (const entry of next.instructionLedger) {
    if (entry.status === 'superseded') continue
    const satisfied = evaluateVoiceLedgerEntry(tree, next, entry)
    entry.status = satisfied ? 'satisfied' : 'pending'
    if (!satisfied) unresolved.push(entry.text)
  }

  next.unresolved = unresolved
  next.lastOperations = operations
  return { voiceSession: next, unresolved }
}

function evaluateVoiceLedgerEntry(tree, voiceSession, entry) {
  switch (entry.kind) {
    case 'set_archetype':
      return inferVoiceArchetypeFromTree(tree) === voiceSession.archetype
    case 'ensure_section':
      return evaluateRoleState(tree, entry.role, voiceSession.blueprint?.sections?.[entry.role] || {})
    case 'remove_section':
      return evaluateRoleAbsence(tree, entry.role)
    case 'position_element':
      return evaluateElementPosition(tree, entry.role, voiceSession.blueprint?.sections?.[entry.role] || {})
    case 'emphasize_item':
      return entry.role === 'pricing' ? isProPackageHighlighted(tree) : true
    case 'remove_images':
      return !findFirst(tree, (node) => node.type === 'Image')
    case 'mutate_target':
      return true
    default:
      return true
  }
}

function evaluateRoleState(tree, role, spec) {
  switch (role) {
    case 'bottom-nav': {
      const nav = findFirst(tree, (node) => node.id === 'bottom-nav' || node.type === 'BottomNavigationBar')
      return !!nav && (!spec.tabs || (nav.children || []).length === spec.tabs)
    }
    case 'pricing': {
      const pricing = findFirst(tree, (node) => node.id === 'paywall-pricing-section')
      return !!pricing &&
        (!spec.packageCount || (pricing.children || []).length === spec.packageCount) &&
        (!spec.variant || spec.variant === 'cards') &&
        (!spec.standoutPro || isProPackageHighlighted(tree))
    }
    case 'description':
      return !!findFirst(tree, (node) => ['paywall-description', 'product-description'].includes(node.id))
    case 'gallery':
      return !!findFirst(tree, (node) => node.id === 'paywall-gallery')
    case 'reviews':
      return !!findFirst(tree, (node) => node.id === 'reviews-list')
    case 'stats': {
      const stats = findFirst(tree, (node) => node.id === 'paywall-stats')
      return !!stats && (!spec.prominent || (stats.children || []).some((child) => Number(child.properties?.Height || 0) >= 140))
    }
    case 'about':
      return !!findFirst(tree, (node) => node.id === 'paywall-about')
    case 'table': {
      const table = findDashboardTableNode(tree)
      return !!table &&
        (!spec.rowCount || getCurrentTableRowCount(table) >= spec.rowCount) &&
        (!spec.columnCount || getCurrentTableColumnCount(table) >= spec.columnCount) &&
        (!spec.scrollable || table.properties?.Scrollable === 'True')
    }
    default:
      return true
  }
}

function evaluateRoleAbsence(tree, role) {
  switch (role) {
    case 'bottom-nav':
      return !findFirst(tree, (node) => node.id === 'bottom-nav' || node.type === 'BottomNavigationBar')
    case 'table':
      return !findDashboardTableNode(tree)
    default:
      return true
  }
}

function evaluateElementPosition(tree, role, spec) {
  if (role === 'close-button') {
    const header = findFirst(tree, (node) => node.id === 'header-actions')
    return !!header && (!spec.position || header.properties?.HorizontalAlignment === spec.position)
  }
  return true
}

function isProPackageHighlighted(tree) {
  const pro = findFirst(tree, (node) => node.id === 'paywall-pro-card')
  return !!pro && pro.properties?.Highlighted === 'True'
}

function autoFixVoiceIssues(tree, voiceSession) {
  const unresolved = voiceSession?.unresolved || []
  if (unresolved.length === 0) return false
  let changed = false
  const sections = voiceSession.blueprint?.sections || {}

  if (sections['close-button']?.desired) changed = ensureCloseButton(tree, sections['close-button'].position || 'Right') || changed
  if (sections['bottom-nav']?.desired) changed = ensureBottomNavigation(tree, sections['bottom-nav'].tabs || 5) || changed
  if (sections['bottom-nav']?.desired === false) changed = removeBottomNavigation(tree) || changed
  if (voiceSession.archetype === 'paywall') changed = ensurePaywallLayout(tree, buildDirectiveLikeStateFromBlueprint(voiceSession)) || changed
  if (sections.table?.desired) changed = ensureDashboardTable(tree, buildDirectiveLikeStateFromBlueprint(voiceSession)) || changed
  if (sections.table?.desired === false) changed = removeTableLikeNodes(tree) || changed

  return changed
}

function buildDirectiveLikeStateFromBlueprint(voiceSession) {
  const sections = voiceSession?.blueprint?.sections || {}
  return {
    packageCount: sections.pricing?.packageCount,
    standoutPro: sections.pricing?.standoutPro,
    longDescription: sections.description?.desired,
    gallery: sections.gallery?.desired,
    reviews: sections.reviews?.desired,
    statsSection: sections.stats?.desired,
    prominentStats: sections.stats?.prominent,
    aboutSection: sections.about?.desired,
    addBottomNav: sections['bottom-nav']?.desired,
    bottomNavTabCount: sections['bottom-nav']?.tabs,
    noTable: sections.table?.desired === false,
    pricingCards: sections.pricing?.desired,
    rowCount: sections.table?.rowCount,
    columnCount: sections.table?.columnCount,
    scrollableTable: sections.table?.scrollable,
    closeButton: sections['close-button']?.desired,
    closeButtonPosition: sections['close-button']?.position,
  }
}

export function resolveVoiceCommand({ transcript, currentTree, previousTree, lastTargetIds = [], voiceSession = null }) {
  const normalizedTranscript = normalizeVoiceTranscript(transcript)
  const directives = extractVoiceDirectives(normalizedTranscript)
  let nextVoiceSession = normalizeVoiceSession(voiceSession, currentTree)
  const operations = buildVoiceOperations({
    transcript: normalizedTranscript,
    directives,
    voiceSession: nextVoiceSession,
    currentTree,
    lastTargetIds,
  })
  nextVoiceSession = updateVoiceSessionFromOperations(nextVoiceSession, operations, normalizedTranscript)

  if (directives.clear) {
    return {
      tree: createEmptyPage(),
      locallyHandled: true,
      normalizedTranscript,
      directiveSummary: ['start over with a blank page'],
      targetIds: [],
      voiceSession: createEmptyVoiceSession(),
      operations,
      unresolved: [],
    }
  }

  if (directives.undo && previousTree) {
    return {
      tree: cloneTree(previousTree),
      locallyHandled: true,
      normalizedTranscript,
      directiveSummary: ['undo the previous change'],
      targetIds: lastTargetIds,
      voiceSession: normalizeVoiceSession(voiceSession, previousTree),
      operations,
      unresolved: [],
    }
  }

  // Frustration = user is unhappy with the last result, revert to previous tree
  if (directives.frustration && previousTree && !directives.template) {
    return {
      tree: cloneTree(previousTree),
      locallyHandled: true,
      normalizedTranscript,
      directiveSummary: ['reverted — sorry about that'],
      targetIds: lastTargetIds,
      voiceSession: normalizeVoiceSession(voiceSession, previousTree),
      operations,
      unresolved: [],
    }
  }

  const seededTree =
    cloneTree(currentTree) ||
    buildTemplateForTranscript(normalizedTranscript) ||
    createEmptyPage()

  const workingTree = cloneTree(seededTree)
  const applied = []
  let targetIds = Array.isArray(lastTargetIds) ? [...lastTargetIds] : []

  if (directives.removeBottomNav && removeBottomNavigation(workingTree)) {
    applied.push('removed bottom navigation')
    targetIds = []
  }

  if (directives.removePrimaryButton && removePrimaryActionButton(workingTree)) {
    applied.push('removed primary CTA button')
    targetIds = []
  }

  if (directives.removeCards && removeCardsByPosition(workingTree, normalizedTranscript)) {
    applied.push('removed cards')
    targetIds = []
  }

  if (directives.removeImages && removeImagesFromTree(workingTree, directives.removeImagesPosition)) {
    applied.push('removed images and thumbnails')
    targetIds = []
  }

  if (directives.removeLastReference && targetIds.length > 0 && removeNodesByIds(workingTree, targetIds)) {
    applied.push('removed the last targeted element')
    targetIds = []
  } else if (directives.removeLastReference && previousTree) {
    return {
      tree: cloneTree(previousTree),
      locallyHandled: true,
      normalizedTranscript,
      directiveSummary: ['removed the last change'],
      targetIds: lastTargetIds,
      voiceSession: normalizeVoiceSession(voiceSession, previousTree),
      operations,
      unresolved: [],
    }
  }

  if (directives.keepOnly && keepOnlyType(workingTree, directives.keepOnly)) {
    applied.push(`kept only ${directives.keepOnly}`)
    targetIds = inferVoiceTargetIds({ previousTree: currentTree, nextTree: workingTree, fallbackIds: targetIds })
  }

  // --- EDIT HEURISTICS (no templates, just tree manipulation) ---

  if (directives.pronounReference && directives.resize === 'bigger' && targetIds.length > 0 && resizeNodesByIds(workingTree, targetIds, 'bigger')) {
    applied.push('made the last targeted element bigger')
  } else if (directives.pronounReference && directives.resize === 'smaller' && targetIds.length > 0 && resizeNodesByIds(workingTree, targetIds, 'smaller')) {
    applied.push('made the last targeted element smaller')
  } else if (directives.makeBigger && makeElementBigger(workingTree, directives.makeBigger)) {
    applied.push(`made ${directives.makeBigger} bigger`)
  }

  // Named element move: "move the close button to the right"
  if (directives.moveNamedElement) {
    const { target, direction } = directives.moveNamedElement
    if (target === 'close-button' && (direction === 'right' || direction === 'left')) {
      if (ensureCloseButton(workingTree, direction === 'right' ? 'Right' : 'Left')) {
        applied.push(`moved close button to the ${direction}`)
        targetIds = ['header-actions', 'close-button']
      }
    }
  }

  if (directives.pronounReference && directives.horizontalEdge && targetIds.some((id) => id === 'close-button' || id === 'header-actions')) {
    if (ensureCloseButton(workingTree, directives.horizontalEdge === 'Left' ? 'Left' : 'Right')) {
      applied.push(`aligned close button to the ${directives.horizontalEdge.toLowerCase()}`)
      targetIds = ['header-actions', 'close-button']
    }
  }

  // Add bottom navigation with tabs
  if (directives.addBottomNav && ensureBottomNavigation(workingTree, directives.bottomNavTabCount || 5)) {
    applied.push(`added bottom navigation with ${directives.bottomNavTabCount || 5} tabs`)
    targetIds = ['bottom-nav']
  }

  if (directives.pronounReference && directives.moveDirection && targetIds.length > 0 && moveNodesByIds(workingTree, targetIds, directives.moveDirection)) {
    applied.push(`moved the last targeted element ${directives.moveDirection}`)
  }

  if (directives.pronounReference && directives.fullWidthCommand && targetIds.length > 0 && stretchNodesByIds(workingTree, targetIds)) {
    applied.push('stretched the last targeted element full width')
  }

  const paywallHandled = shouldHandlePaywall(directives, normalizedTranscript, inferVoiceArchetypeFromTree(workingTree) === 'paywall')
  const dashboardHandled = shouldHandleDashboardTable(directives, normalizedTranscript)

  if (paywallHandled && ensurePaywallLayout(workingTree, directives)) {
    applied.push('updated the paywall layout')
    if (directives.standoutPro) targetIds = ['paywall-pro-card', 'paywall-pricing-section']
    else if (directives.statsSection) targetIds = ['paywall-stats']
    else targetIds = ['paywall-pricing-section']
  } else if (dashboardHandled && ensureDashboardTable(workingTree, directives)) {
    applied.push('updated the dashboard table')
    targetIds = ['dashboard-data-table']
  } else {
    const ecommerceContext =
      directives.template === 'ecommerce-detail' ||
      inferVoiceArchetypeFromTree(workingTree) === 'ecommerce-detail' ||
      directives.heroImage ||
      directives.favorite ||
      directives.bookmark ||
      directives.rating ||
      directives.descriptionAlignment ||
      directives.longDescription ||
      /\b(ecommerce|product|shopping|thumbnail|hero image|ratings?|reviews?)\b/.test(normalizedTranscript)

    if (ecommerceContext && !directives.removeImages && directives.heroImage && ensureHeroImage(workingTree)) {
      applied.push('updated the hero image')
      targetIds = ['hero-image']
    }

    if (ecommerceContext && (directives.titleTone || directives.subtitle || directives.longDescription || directives.descriptionAlignment) && ensureTextScaffold(workingTree, directives)) {
      applied.push('updated the text content')
      if (directives.descriptionAlignment || directives.longDescription) {
        targetIds = ['product-description']
      }
    }

    if (ecommerceContext && directives.titleTone && tunePrimaryTitle(workingTree)) {
      applied.push('tightened the title styling')
      targetIds = ['product-title']
    }

    if (ecommerceContext && (directives.favorite || directives.bookmark || directives.rating) && ensureActionRow(workingTree, directives)) {
      applied.push('updated the action row')
      targetIds = ['product-actions']
    }

    if (ecommerceContext && directives.reviews && ensureReviewsSection(workingTree)) {
      applied.push('updated the reviews section')
      targetIds = ['reviews-list']
    }
  }

  if (directives.paddingPx && setRootPadding(workingTree, String(directives.paddingPx))) {
    applied.push(`set the app padding to ${directives.paddingPx}px`)
  }

  if (shouldReinforceLastTarget(normalizedTranscript.toLowerCase(), targetIds) && reinforceVoiceTargets(workingTree, targetIds)) {
    applied.push('reinforced the last targeted element')
  }

  let verification = verifyVoiceSession({ tree: workingTree, voiceSession: nextVoiceSession, operations })
  if (verification.unresolved.length > 0 && autoFixVoiceIssues(workingTree, verification.voiceSession)) {
    verification = verifyVoiceSession({ tree: workingTree, voiceSession: verification.voiceSession, operations })
  }

  return {
    tree: workingTree,
    locallyHandled: applied.length > 0 || operations.some((op) => op.kind !== 'custom_create'),
    normalizedTranscript,
    directiveSummary: applied.length > 0 ? applied : buildVoiceDirectiveSummary(normalizedTranscript),
    targetIds,
    voiceSession: verification.voiceSession,
    operations,
    unresolved: verification.unresolved,
  }
}

export function buildVoiceLlmPrompt({ transcript, currentTree, history, previousTree, lastTargetIds = [], voiceSession = null }) {
  const normalizedTranscript = normalizeVoiceTranscript(transcript)
  const heuristic = resolveVoiceCommand({ transcript: normalizedTranscript, currentTree, previousTree, lastTargetIds, voiceSession })
  const priorCommands = summarizeVoiceHistory(history)

  let userPrompt = ''
  if (priorCommands.length > 0) {
    userPrompt += `Recent voice commands:\n${priorCommands.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n`
  }

  const summary = heuristic.directiveSummary
  if (summary.length > 0) {
    userPrompt += `Interpreted design directives:\n${summary.map((line) => `- ${line}`).join('\n')}\n\n`
  }

  const targetSummary = describeVoiceTargets(heuristic.tree || currentTree, lastTargetIds)
  if (targetSummary) {
    userPrompt += `Last targeted element:\n${targetSummary}\n\n`
  }

  const blueprintSummary = describeVoiceBlueprint(heuristic.voiceSession)
  if (blueprintSummary) {
    userPrompt += `Screen blueprint:\n${blueprintSummary}\n\n`
  }

  const ledgerSummary = describeVoiceLedger(heuristic.voiceSession)
  if (ledgerSummary) {
    userPrompt += `Instruction ledger:\n${ledgerSummary}\n\n`
  }

  if (heuristic.operations?.length) {
    userPrompt += `Structured edit operations:\n${heuristic.operations.map((op, index) => `${index + 1}. ${JSON.stringify(op)}`).join('\n')}\n\n`
  }

  if (heuristic.unresolved?.length) {
    userPrompt += `Unresolved requirements that must be satisfied:\n${heuristic.unresolved.map((item) => `- ${item}`).join('\n')}\n\n`
  }

  userPrompt += `Latest spoken command:\n"${normalizedTranscript}"\n\n`
  userPrompt += currentTree
    ? `Current wireframe tree:\n${JSON.stringify(heuristic.tree || currentTree)}\n\n`
    : `Current wireframe tree:\n${JSON.stringify(heuristic.tree || createEmptyPage())}\n\n`

  if (previousTree) {
    userPrompt += `Previous tree for undo reference:\n${JSON.stringify(previousTree)}\n\n`
  }

  const isEditCommand = /\b(move|change|edit|modify|make|bigger|smaller|remove|delete|add|put|place|update|fix|stand out|prominent)\b/i.test(normalizedTranscript) && currentTree
  if (isEditCommand) {
    userPrompt += `CRITICAL: This is an EDIT command on an existing wireframe. You MUST:
1. Keep 95%+ of the tree IDENTICAL — same ids, same types, same properties, same children order
2. ONLY modify the specific element(s) the user mentioned
3. Do NOT regenerate the entire tree — copy it exactly and change only the targeted part
4. Do NOT add elements the user didn't ask for
5. Do NOT remove elements the user didn't ask to remove
Return the COMPLETE updated JSON tree with minimal changes.`
  } else {
    userPrompt += 'Apply the latest spoken command to the current wireframe. Preserve existing good structure. Return the COMPLETE updated JSON tree only.'
  }

  return {
    userPrompt,
    normalizedTranscript,
    directiveSummary: summary,
    seededTree: heuristic.tree,
    targetIds: heuristic.targetIds,
    voiceSession: heuristic.voiceSession,
  }
}

function splitVoiceClauses(transcript) {
  return String(transcript || '')
    .toLowerCase()
    .split(/(?<=[.!?])\s+|\n+/)
    .flatMap((part) => part.split(/\s+(?:and then|then)\s+/))
    .map((part) => part.trim().replace(/[.!?]+$/g, ''))
    .filter(Boolean)
}

function matchesAnyPattern(text, patterns = []) {
  return patterns.some((pattern) => pattern.test(text))
}

function findLastClauseMatching(clauses, predicate) {
  for (let index = clauses.length - 1; index >= 0; index--) {
    if (predicate(clauses[index])) return clauses[index]
  }
  return ''
}

function findLastTargetedClause(clauses, { verbs = [], nouns = [], exclude = [] }) {
  return findLastClauseMatching(clauses, (clause) => (
    matchesAnyPattern(clause, verbs) &&
    matchesAnyPattern(clause, nouns) &&
    !matchesAnyPattern(clause, exclude)
  ))
}

function hasConcreteVoiceInstruction(lower) {
  return /\b(add|remove|delete|get rid|move|put|place|make|change|edit|update|fix|align|create|build|stretch|expand|keep|use|decrease|increase)\b/.test(lower)
}

function extractVoiceDirectives(transcript) {
  const lower = transcript.toLowerCase()
  const clauses = splitVoiceClauses(lower)
  const imageRemovalClause = findLastTargetedClause(clauses, {
    verbs: [/\b(remove|delete|get rid of|no need|don't need|do not need|without)\b/],
    nouns: [/\b(photo|photos|picture|pictures|thumbnail|thumbnails|image|images)\b/],
  })
  const bottomNavRemovalClause = findLastTargetedClause(clauses, {
    verbs: [/\b(remove|delete|without|don't need|do not need|completely remove|no)\b/],
    nouns: [/\b(bottom nav|nav bar at the bottom|bottom bar|tab bar|bottom navigation|button navigation)\b/],
  })
  const primaryButtonRemovalClause = findLastTargetedClause(clauses, {
    verbs: [/\b(remove|delete|without|no)\b/],
    nouns: [/\b(blue button|cta|primary button|get started|filled button)\b/],
  })
  const cardRemovalClause = findLastTargetedClause(clauses, {
    verbs: [/\b(remove|delete|get rid of|don't need|do not need|no more)\b/],
    nouns: [/\bcards?\b/],
  })
  const closeButtonClause = findLastClauseMatching(clauses, (clause) => /\b(close button|x button|close means an x|top right close)\b/.test(clause))
  const addBottomNavClause = findLastTargetedClause(clauses, {
    verbs: [/\b(add|create|need|want|include|should have)\b/],
    nouns: [/\b(bottom nav|bottom navigation|tab bar|bottom bar|navigation bar at the bottom)\b/],
    exclude: [/\b(remove|delete|without|no)\b/],
  })
  const descriptionClause = findLastClauseMatching(clauses, (clause) => /\bdescription\b/.test(clause))
  const complaintOnly =
    /\b(completely wrong|completely fucked|fucked up|fucked off|what the fuck|this is wrong|you did not do|you didn't do|you still did not|terrible|awful|horrible|useless|broken|not that|no no|wrong)\b/.test(lower) &&
    !hasConcreteVoiceInstruction(lower)

  return {
    // Meta
    clear: /\b(clear|start over|from scratch|reset everything)\b/.test(lower),
    undo: /\b(undo|go back|revert)\b/.test(lower) || complaintOnly,
    frustration: complaintOnly,
    template: detectTemplateKind(lower),
    // Removal
    removeLastReference: /\b(remove that|delete that|get rid of that|take that away|remove the last thing|delete the last thing)\b/.test(lower),
    removeImages: Boolean(imageRemovalClause),
    removeImagesPosition: imageRemovalClause
      ? (/\b(on top|at the top|top section|pictures? on top|thumbnail picture in the middle)\b/.test(imageRemovalClause) ? 'top' : /\b(at the bottom|bottom)\b/.test(imageRemovalClause) ? 'bottom' : 'all')
      : 'all',
    removeBottomNav: Boolean(bottomNavRemovalClause),
    removePrimaryButton: Boolean(primaryButtonRemovalClause),
    removeCards: Boolean(cardRemovalClause),
    keepOnly: extractKeepOnly(lower),
    // Resize
    makeBigger: extractMakeBigger(lower),
    resize: extractResizeIntent(lower),
    // Move
    moveDirection: extractMoveDirection(lower),
    horizontalEdge: pickLatestDirectionalChoice(lower, { Left: [/\bleft\b/], Right: [/\bright\b/] }),
    moveNamedElement: extractNamedMoveTarget(lower),
    // References
    pronounReference: /\b(that|it|this|the last one|last one|that one)\b/.test(lower),
    fullWidthCommand: /\b(full width|full-width|stretch)\b/.test(lower),
    heroImage: /\b(image|thumbnail|photo|picture|hero)\b/.test(lower),
    // Structural edits
    closeButton: Boolean(closeButtonClause),
    closeButtonPosition: pickLatestDirectionalChoice(closeButtonClause || lower, { Left: [/\btop left\b/, /\bleft\b/], Right: [/\btop right\b/, /\bright\b/] }) || 'Right',
    addBottomNav: Boolean(addBottomNavClause),
    bottomNavTabCount: extractQuantifiedCount(lower, 'tab'),
    titleTone: /\b(title)\b/.test(lower) && /\b(smaller|decrease|smaller than you have|little bit more bold|more bold|bolder)\b/.test(lower) ? 'smaller-bolder' : null,
    subtitle: /\bsubtitle\b/.test(lower),
    longDescription: /\b(long description|longer reviews|long text|paragraph description|huge description|detailed description|collapse and expand)\b/.test(lower) || (/\bdescription\b/.test(lower) && /\b(huge|long|longer|paragraph|collapse|expand)\b/.test(lower)),
    descriptionAlignment: descriptionClause ? (pickLatestDirectionalChoice(descriptionClause, { Left: [/\bleft\b/], Right: [/\bright\b/] }) || null) : null,
    paddingPx: (() => {
      const match = lower.match(/\b(\d+)\s*(?:px|pixel|pixels)\s+padding\b|\bpadding\b.*?\b(\d+)\s*(?:px|pixel|pixels)\b/)
      return match ? Number(match[1] || match[2] || 0) : null
    })(),
    favorite: /\b(favorite|favourite|heart icon|heart button|like button)\b/.test(lower),
    bookmark: /\b(bookmark icon|bookmark|save icon|save button)\b/.test(lower),
    rating: /\b(rating|ratings|stars?)\b/.test(lower),
    packageCount: extractQuantifiedCount(lower, 'package') || extractQuantifiedCount(lower, 'plan') || extractQuantifiedCount(lower, 'card'),
    pricingCards: /\b(cards?|pricing cards?|pricing table)\b/.test(lower) && /\b(price|pricing|package|plan|paywall)\b/.test(lower),
    featureChecklist: /\b(features?|checklist|to do|todo)\b/.test(lower),
    standoutPro: /\b(pro package|pro card|pro)\b/.test(lower) && /\b(stand out|standout|outline|shadows?|bigger typography|bolder|highlight|prominent|colors?|look good|great)\b/.test(lower),
    noTable: /\b(no table|not a table|no table needed)\b/.test(lower) || Boolean(findLastTargetedClause(clauses, {
      verbs: [/\b(remove|delete|avoid|without|no)\b/],
      nouns: [/\btable\b/],
    })),
    gallery: /\b(gallery|pictures beside each other|few pictures|images beside each other)\b/.test(lower),
    reviews: /\b(reviews?|profile pictures?|people)\b/.test(lower),
    statsSection: /\b(graphs?|stats?|statistics|metrics?)\b/.test(lower),
    prominentStats: /\b(stats?|statistics|metrics?)\b/.test(lower) && /\b(big|prominent|cool|huge|large|stand out|not small|bigger)\b/.test(lower),
    aboutSection: /\babout section\b|\babout\b/.test(lower),
    tableRequest: /\btable\b/.test(lower) && !/\b(no table|not a table)\b/.test(lower),
    rowCount: extractQuantifiedCount(lower, 'row'),
    columnCount: extractQuantifiedCount(lower, 'column'),
    realTableData: /\b(real table|real data|fake data|feel like a real table|don't keep it lorem|lorem ipsum)\b/.test(lower),
    scrollableTable: /\bscrollable|huge table\b/.test(lower),
  }
}

function extractNamedMoveTarget(lower) {
  // "move the close button to the right" → { target: 'close-button', direction: 'right' }
  const patterns = [
    { regex: /\b(?:move|put|place)\b.*\b(close button|x button|close)\b.*\b(right|left|top|bottom)\b/, target: 'close-button' },
    { regex: /\b(close button|x button)\b.*\b(?:must be|should be|needs? to be)\b.*\b(right|left|top|bottom)\b/, target: 'close-button' },
    { regex: /\b(?:move|put|place)\b.*\b(title|header)\b.*\b(right|left|top|center|bottom)\b/, target: 'title' },
    { regex: /\b(?:move|put|place)\b.*\b(navigation|nav|bottom nav)\b.*\b(right|left|top|bottom)\b/, target: 'navigation' },
  ]
  for (const p of patterns) {
    const match = lower.match(p.regex)
    if (match) {
      const directionWord = match[2] || match[match.length - 1]
      return { target: p.target, direction: directionWord }
    }
  }
  return null
}

export function protectVoiceTreeProgress({ currentTree, candidateTree, transcript, previousTree }) {
  if (!currentTree || !candidateTree) {
    return { tree: candidateTree, prevented: false, reason: null }
  }

  const normalized = normalizeVoiceTranscript(transcript).toLowerCase()
  if (allowsMajorDestruction(normalized)) {
    return { tree: candidateTree, prevented: false, reason: null }
  }

  const currentMeaningful = countMeaningfulNodes(currentTree)
  const candidateMeaningful = countMeaningfulNodes(candidateTree)
  const currentTopLevel = countTopLevelContent(currentTree)
  const candidateTopLevel = countTopLevelContent(candidateTree)
  const ratio = candidateMeaningful / Math.max(1, currentMeaningful)

  const candidateLooksDestructive =
    currentMeaningful >= 7 &&
    (candidateMeaningful <= 3 || candidateTopLevel === 0 || ratio < 0.45)

  if (!candidateLooksDestructive) {
    return { tree: candidateTree, prevented: false, reason: null }
  }

  const fallbackTree = prefersPreviousTree(normalized) && previousTree ? previousTree : currentTree
  return {
    tree: cloneTree(fallbackTree),
    prevented: true,
    reason: fallbackTree === previousTree
      ? 'Reverted only the last step instead of wiping the screen.'
      : 'Preserved the current layout because the response removed too much for an ambiguous edit.',
  }
}

export function inferVoiceTargetIds({ previousTree, nextTree, fallbackIds = [] }) {
  if (!nextTree) return fallbackIds

  const prevIndex = buildNodeIndex(previousTree)
  const nextIndex = buildNodeIndex(nextTree)

  const added = []
  const changed = []

  for (const [id, meta] of nextIndex.entries()) {
    const prev = prevIndex.get(id)
    if (!prev) {
      if (isMeaningfulTarget(meta.node)) added.push(id)
      continue
    }
    if (prev.signature !== meta.signature && isMeaningfulTarget(meta.node)) {
      changed.push(id)
    }
  }

  const primary = collapseNestedTargets(added.length > 0 ? added : changed, nextIndex)
  return primary.length > 0 ? primary.slice(0, 5) : fallbackIds
}

export function describeVoiceTargets(tree, ids = []) {
  if (!tree || !Array.isArray(ids) || ids.length === 0) return ''
  const labels = ids
    .map((id) => findNodeById(tree, id))
    .filter(Boolean)
    .map((node) => {
      const label =
        node.properties?.Text ||
        node.properties?.Content ||
        node.properties?.Header ||
        node.properties?.DisplayName ||
        node.id
      return `${node.type} "${String(label).slice(0, 80)}" (${node.id})`
    })
  return labels.join('\n')
}

function extractKeepOnly(lower) {
  const match = lower.match(/\bkeep (?:only |just )?(the )?(table|navigation|nav|cards?|header|title|image)\b/)
  if (match) return match[2]
  return null
}

function extractMakeBigger(lower) {
  const match = lower.match(/\b(?:make|the) (table|image|card|nav|header|stats?|statistics?|metrics?|navigation|button|text|title|description).*?\b(big|bigger|larger|much bigger|huge|expand|full|prominent|stand out|bolder|cooler)\b/)
  if (match) return normalizeTargetType(match[1])
  const match2 = lower.match(/\b(big|bigger|larger|much bigger|huge|prominent|stand out)\b.*?\b(table|image|card|stats?|statistics?|metrics?|navigation)\b/)
  if (match2) return normalizeTargetType(match2[2])
  if (/\b(stats?|statistics?|metrics?)\b/.test(lower) && /\b(big|bigger|prominent|stand out|not small|ugly)\b/.test(lower)) return 'stats'
  return null
}

function normalizeTargetType(raw) {
  if (/^stats?$|^statistics?$|^metrics?$/.test(raw)) return 'stats'
  if (/^nav|^navigation/.test(raw)) return 'nav'
  return raw
}

function extractResizeIntent(lower) {
  if (/\b(smaller|shrink|reduce|less tall|less wide)\b/.test(lower)) return 'smaller'
  if (/\b(bigger|larger|bigger one|make it big|expand|grow)\b/.test(lower)) return 'bigger'
  return null
}

function extractMoveDirection(lower) {
  if (/\bmove .* top\b|\bput .* top\b|\bon top\b/.test(lower)) return 'top'
  if (/\bmove .* bottom\b|\bput .* bottom\b|\bat the bottom\b/.test(lower)) return 'bottom'
  if (/\bmove .* up\b/.test(lower)) return 'up'
  if (/\bmove .* down\b/.test(lower)) return 'down'
  if (/\bto the right\b|\bmove .* right\b|\bon the right\b|\bnot.*left.*right\b/.test(lower)) return 'right'
  if (/\bto the left\b|\bmove .* left\b|\bon the left\b/.test(lower)) return 'left'
  return null
}

function detectTemplateKind(lower) {
  for (const entry of APP_TEMPLATES) {
    if (entry.match.test(lower)) return entry.kind
  }
  return null
}

function extractQuantifiedCount(lower, noun) {
  const regex = new RegExp(`\\b(\\d+|${Object.keys(NUMBER_WORDS).join('|')})\\s+${noun}s?\\b`, 'g')
  let match = null
  let latest = null
  while ((match = regex.exec(lower)) !== null) {
    latest = wordToNumber(match[1])
  }
  return latest
}

function wordToNumber(token) {
  if (!token) return null
  if (/^\d+$/.test(token)) return Number(token)
  return NUMBER_WORDS[token] || null
}

function buildNodeIndex(tree) {
  const map = new Map()
  if (!tree) return map
  walk(tree, (node, parent) => {
    map.set(node.id, {
      node,
      parentId: parent?.id || null,
      signature: JSON.stringify({
        type: node.type,
        properties: node.properties || {},
        childIds: (node.children || []).map((child) => child.id),
      }),
    })
  })
  return map
}

function collapseNestedTargets(ids, index) {
  const set = new Set(ids)
  return ids.filter((id) => {
    let parentId = index.get(id)?.parentId
    while (parentId) {
      if (set.has(parentId)) return false
      parentId = index.get(parentId)?.parentId
    }
    return true
  })
}

function isMeaningfulTarget(node) {
  return !!node && !['Page', 'ScrollViewer', 'StackPanel', 'Grid', 'Border', 'Divider'].includes(node.type)
}

function allowsMajorDestruction(lower) {
  return /\b(clear|start over|from scratch|reset everything|remove everything|delete everything|delete all|remove all|keep only|just the |only the )\b/.test(lower)
}

function prefersPreviousTree(lower) {
  return /\b(remove that|delete that|get rid of that|take that away|undo|not that|no no|wrong|revert)\b/.test(lower)
}

function countMeaningfulNodes(tree) {
  let count = 0
  walk(tree, (node) => {
    if (!['Page', 'ScrollViewer', 'StackPanel', 'Grid', 'Border'].includes(node.type)) {
      count += 1
    }
  })
  return count
}

function countTopLevelContent(tree) {
  const stack = findOrCreateContentStack(cloneTree(tree))
  return (stack.children || []).filter((child) => child.type !== 'Divider').length
}

function findNodeById(tree, id) {
  return findFirst(tree, (node) => node.id === id)
}

function removeNodesByIds(tree, ids) {
  const target = new Set(ids)
  let removed = false
  walk(tree, (node) => {
    if (!Array.isArray(node.children)) return
    const before = node.children.length
    node.children = node.children.filter((child) => !target.has(child.id))
    if (node.children.length !== before) removed = true
  })
  return removed
}

function removeImagesFromTree(tree, position = 'all') {
  let removed = false
  if (position === 'top') {
    // Remove only images near the top of the content stack
    const stack = findOrCreateContentStack(tree)
    const newChildren = []
    let foundNonImage = false
    for (const child of stack.children || []) {
      if (!foundNonImage && (child.type === 'Image' || child.type === 'PersonPicture' ||
        (child.type === 'StackPanel' && (child.children || []).every(c => c.type === 'Image' || c.type === 'PersonPicture')))) {
        removed = true
        continue
      }
      foundNonImage = true
      newChildren.push(child)
    }
    stack.children = newChildren
  } else {
    walk(tree, (node) => {
      if (!Array.isArray(node.children)) return
      const before = node.children.length
      node.children = node.children.filter((child) => child.type !== 'Image' && child.type !== 'PersonPicture')
      if (node.children.length !== before) removed = true
    })
  }
  return removed
}

function resizeNodesByIds(tree, ids, direction) {
  let changed = false
  for (const id of ids) {
    const node = findNodeById(tree, id)
    if (!node) continue
    if (node.type === 'DataTable') {
      normalizeDashboardTableNode(node, {
        rowCount: direction === 'bigger' ? getCurrentTableRowCount(node) + 4 : Math.max(4, getCurrentTableRowCount(node) - 3),
        columnCount: getCurrentTableColumnCount(node),
        scrollableTable: true,
        realTableData: true,
        makeBigger: direction === 'bigger' ? 'table' : null,
      })
      changed = true
      continue
    }
    if (node.type === 'Image' || node.type === 'Card' || node.type === 'Button' || node.type === 'PersonPicture') {
      const currentHeight = Number(node.properties?.Height || (node.type === 'Image' ? 220 : 56))
      const currentWidth = Number(node.properties?.Width || 0)
      const factor = direction === 'bigger' ? 1.25 : 0.75
      if (node.type === 'Image') {
        node.properties = {
          ...node.properties,
          Height: String(Math.max(96, Math.round(currentHeight * factor))),
          ...(currentWidth > 0 ? { Width: String(Math.max(96, Math.round(currentWidth * factor))) } : {}),
        }
      } else if (currentWidth > 0 || node.type !== 'Button') {
        node.properties = {
          ...node.properties,
          ...(currentWidth > 0 ? { Width: String(Math.max(40, Math.round(currentWidth * factor))) } : {}),
          ...(currentHeight > 0 ? { Height: String(Math.max(32, Math.round(currentHeight * factor))) } : {}),
        }
      }
      changed = true
      continue
    }
    if (node.type === 'TextBlock') {
      node.properties = {
        ...node.properties,
        Style: resizeTypographyStyle(node.properties?.Style || 'BodyMedium', direction),
      }
      changed = true
    }
  }
  return changed
}

function resizeTypographyStyle(style, direction) {
  const order = ['BodySmall', 'BodyMedium', 'BodyLarge', 'TitleSmall', 'TitleMedium', 'TitleLarge', 'HeadlineSmall', 'HeadlineMedium', 'HeadlineLarge']
  const currentIndex = Math.max(0, order.indexOf(style))
  const delta = direction === 'bigger' ? 1 : -1
  return order[Math.min(order.length - 1, Math.max(0, currentIndex + delta))] || style
}

function moveNodesByIds(tree, ids, direction) {
  let changed = false
  // For left/right, change HorizontalAlignment on the node or its parent container
  if (direction === 'left' || direction === 'right') {
    for (const id of ids) {
      const node = findNodeById(tree, id)
      if (!node) continue
      // Find the parent StackPanel and change its alignment
      walk(tree, (parent) => {
        if (!Array.isArray(parent.children)) return
        if (parent.children.some(c => c.id === id)) {
          if (parent.type === 'StackPanel' && parent.properties?.Orientation === 'Horizontal') {
            parent.properties = { ...parent.properties, HorizontalAlignment: direction === 'right' ? 'Right' : 'Left' }
            changed = true
          } else {
            node.properties = { ...node.properties, HorizontalAlignment: direction === 'right' ? 'Right' : 'Left' }
            changed = true
          }
        }
      })
    }
    return changed
  }
  walk(tree, (node) => {
    if (!Array.isArray(node.children)) return
    for (const id of ids) {
      const index = node.children.findIndex((child) => child.id === id)
      if (index === -1) continue
      const [child] = node.children.splice(index, 1)
      if (!child) continue
      if (direction === 'top') {
        node.children.unshift(child)
      } else if (direction === 'bottom') {
        node.children.push(child)
      } else if (direction === 'up') {
        node.children.splice(Math.max(0, index - 1), 0, child)
      } else if (direction === 'down') {
        node.children.splice(Math.min(node.children.length, index + 1), 0, child)
      }
      changed = true
    }
  })
  return changed
}

function stretchNodesByIds(tree, ids) {
  let changed = false
  for (const id of ids) {
    const node = findNodeById(tree, id)
    if (!node) continue
    node.properties = {
      ...node.properties,
      Width: 'Fill',
      HorizontalAlignment: 'Stretch',
    }
    changed = true
  }
  return changed
}

function pickLatestDirectionalChoice(lower, choices) {
  let winner = null
  let bestIndex = -1
  for (const [value, patterns] of Object.entries(choices)) {
    for (const pattern of patterns) {
      const match = lower.match(pattern)
      if (!match || match.index == null) continue
      if (match.index >= bestIndex) {
        bestIndex = match.index
        winner = value
      }
    }
  }
  return winner
}

function buildTemplateForTranscript(transcript) {
  const kind = detectTemplateKind(transcript.toLowerCase())
  switch (kind) {
    case 'listing-detail':
      return createListingDetailTemplate()
    case 'ecommerce-detail':
      return createEcommerceDetailTemplate()
    case 'paywall':
      return createPaywallTemplate()
    case 'dashboard':
      return createDashboardTemplate()
    case 'settings':
      return createSettingsTemplate()
    case 'chat':
      return createChatTemplate()
    case 'profile':
      return createProfileTemplate()
    case 'login':
      return createLoginTemplate()
    case 'onboarding':
      return createOnboardingTemplate()
    default:
      return null
  }
}

function createEcommerceDetailTemplate() {
  const page = createEmptyPage()
  const stack = findOrCreateContentStack(page)
  stack.children = [
    createHeaderActions(),
    { id: 'hero-image', type: 'Image', properties: { Width: 'Fill', HorizontalAlignment: 'Stretch', Height: '220' } },
    { id: 'product-title', type: 'TextBlock', properties: { Text: 'Product title', Style: 'HeadlineSmall' } },
    { id: 'product-subtitle', type: 'TextBlock', properties: { Text: 'Short product subtitle', Style: 'BodyMedium', Foreground: '#49454F' } },
    createActionRow(),
    {
      id: 'product-description',
      type: 'TextBlock',
      properties: {
        Text: 'This is a longer product description that explains the item, highlights key features, and gives the user enough context to make a confident purchase decision.',
        Style: 'BodyMedium',
        HorizontalAlignment: 'Left',
        Foreground: '#49454F',
      },
    },
    createReviewsList(),
  ]
  return page
}

function createPaywallTemplate() {
  const page = createEmptyPage()
  const stack = findOrCreateContentStack(page)
  stack.children = [
    createHeaderActions(),
    { id: 'paywall-title', type: 'TextBlock', properties: { Text: 'Paywall', Style: 'HeadlineMedium' } },
    { id: 'paywall-subtitle', type: 'TextBlock', properties: { Text: 'Unlock premium features', Style: 'BodyMedium', Foreground: '#49454F' } },
    { id: 'pricing-title', type: 'TextBlock', properties: { Text: 'Pricing comparison', Style: 'TitleLarge' } },
    createPricingCardsSection(3, true),
  ]
  return page
}

function createDashboardTemplate() {
  const page = createEmptyPage()
  const stack = findOrCreateContentStack(page)
  stack.children = [
    { id: 'dashboard-title', type: 'TextBlock', properties: { Text: 'Dashboard', Style: 'HeadlineMedium' } },
    { id: 'dashboard-summary', type: 'Card', properties: { Style: 'Elevated', Padding: '16' }, children: [
      { id: 'dashboard-summary-title', type: 'TextBlock', properties: { Text: 'Today overview', Style: 'TitleMedium' } },
      { id: 'dashboard-summary-copy', type: 'TextBlock', properties: { Text: 'Key metrics and recent updates', Style: 'BodyMedium', Foreground: '#49454F' } },
    ] },
    createDashboardMetricRow(),
  ]
  return page
}

function createSettingsTemplate() {
  const page = createEmptyPage()
  const stack = findOrCreateContentStack(page)
  stack.children = [
    { id: 'settings-title', type: 'TextBlock', properties: { Text: 'Settings', Style: 'HeadlineMedium' } },
    { id: 'settings-toggle-1', type: 'ToggleSwitch', properties: { Header: 'Notifications', IsOn: 'True' } },
    { id: 'settings-toggle-2', type: 'ToggleSwitch', properties: { Header: 'Dark mode', IsOn: 'False' } },
  ]
  return page
}

function createChatTemplate() {
  const page = createEmptyPage()
  const stack = findOrCreateContentStack(page)
  stack.children = [
    { id: 'chat-title', type: 'TextBlock', properties: { Text: 'Messages', Style: 'HeadlineMedium' } },
    { id: 'chat-list', type: 'ListView', properties: {}, children: [
      { id: 'chat-item-1', type: 'TextBlock', properties: { Text: 'Hello there', Style: 'BodyMedium' } },
      { id: 'chat-item-2', type: 'TextBlock', properties: { Text: 'Can we talk later?', Style: 'BodyMedium' } },
    ] },
    { id: 'chat-input', type: 'TextBox', properties: { Header: 'Message', PlaceholderText: 'Write a message...' } },
  ]
  return page
}

function createListingDetailTemplate() {
  const page = createEmptyPage()
  const stack = findOrCreateContentStack(page)
  stack.properties = { ...stack.properties, Padding: '0', Spacing: '0' }
  stack.children = [
    { id: 'hero-image', type: 'Image', properties: { Width: 'Fill', HorizontalAlignment: 'Stretch', Height: '280' } },
    {
      id: 'listing-content',
      type: 'StackPanel',
      properties: { Orientation: 'Vertical', Padding: '16', Spacing: '16' },
      children: [
        { id: 'listing-title', type: 'TextBlock', properties: { Text: 'Cozy lakeside cabin with mountain views', Style: 'HeadlineSmall' } },
        {
          id: 'listing-meta',
          type: 'StackPanel',
          properties: { Orientation: 'Horizontal', Spacing: '8' },
          children: [
            { id: 'listing-rating-icon', type: 'Icon', properties: { Glyph: 'Star' } },
            { id: 'listing-rating', type: 'TextBlock', properties: { Text: '4.92 (128 reviews)', Style: 'BodyMedium' } },
            { id: 'listing-location', type: 'TextBlock', properties: { Text: 'Lake Tahoe, CA', Style: 'BodyMedium', Foreground: '#49454F' } },
          ],
        },
        { id: 'listing-divider-1', type: 'Divider', properties: {} },
        {
          id: 'listing-host',
          type: 'StackPanel',
          properties: { Orientation: 'Horizontal', Spacing: '12' },
          children: [
            { id: 'listing-host-avatar', type: 'PersonPicture', properties: { DisplayName: 'Sarah', Width: '48' } },
            {
              id: 'listing-host-info',
              type: 'StackPanel',
              properties: { Spacing: '2' },
              children: [
                { id: 'listing-host-name', type: 'TextBlock', properties: { Text: 'Hosted by Sarah', Style: 'TitleSmall' } },
                { id: 'listing-host-badge', type: 'TextBlock', properties: { Text: 'Superhost · 4 years hosting', Style: 'BodySmall', Foreground: '#49454F' } },
              ],
            },
          ],
        },
        { id: 'listing-divider-2', type: 'Divider', properties: {} },
        {
          id: 'listing-description',
          type: 'TextBlock',
          properties: {
            Text: 'Escape to this beautifully renovated cabin nestled among towering pines. Wake up to stunning lake views, enjoy the private hot tub, and explore nearby hiking trails. Perfect for couples or small families looking for a peaceful retreat.',
            Style: 'BodyMedium',
            Foreground: '#49454F',
          },
        },
        { id: 'listing-divider-3', type: 'Divider', properties: {} },
        { id: 'listing-amenities-title', type: 'TextBlock', properties: { Text: 'Amenities', Style: 'TitleMedium' } },
        {
          id: 'listing-amenities',
          type: 'StackPanel',
          properties: { Orientation: 'Vertical', Spacing: '12' },
          children: [
            createAmenityRow('amenity-wifi', 'Wifi', 'Fast wifi — 120 Mbps'),
            createAmenityRow('amenity-kitchen', 'Kitchen', 'Full kitchen with dishwasher'),
            createAmenityRow('amenity-parking', 'Car', 'Free parking on premises'),
            createAmenityRow('amenity-pool', 'Water', 'Private hot tub'),
            createAmenityRow('amenity-ac', 'Thermostat', 'Air conditioning'),
            createAmenityRow('amenity-washer', 'Laundry', 'Washer and dryer'),
          ],
        },
        { id: 'listing-divider-4', type: 'Divider', properties: {} },
        { id: 'listing-contact-title', type: 'TextBlock', properties: { Text: 'Contact Information', Style: 'TitleMedium' } },
        {
          id: 'listing-contact',
          type: 'StackPanel',
          properties: { Orientation: 'Vertical', Spacing: '8' },
          children: [
            createAmenityRow('contact-phone', 'Phone', '+1 (555) 123-4567'),
            createAmenityRow('contact-email', 'Mail', 'sarah@hosting.com'),
          ],
        },
        { id: 'listing-divider-5', type: 'Divider', properties: {} },
        createReviewsList(),
        { id: 'listing-cta', type: 'Button', properties: { Content: 'Reserve', Style: 'Filled', HorizontalAlignment: 'Stretch' } },
      ],
    },
  ]
  return page
}

function createAmenityRow(id, icon, text) {
  return {
    id,
    type: 'StackPanel',
    properties: { Orientation: 'Horizontal', Spacing: '12' },
    children: [
      { id: `${id}-icon`, type: 'Icon', properties: { Glyph: icon } },
      { id: `${id}-text`, type: 'TextBlock', properties: { Text: text, Style: 'BodyMedium' } },
    ],
  }
}

function createProfileTemplate() {
  const page = createEmptyPage()
  const stack = findOrCreateContentStack(page)
  stack.children = [
    {
      id: 'profile-header',
      type: 'StackPanel',
      properties: { Orientation: 'Vertical', Spacing: '8', HorizontalAlignment: 'Center' },
      children: [
        { id: 'profile-avatar', type: 'PersonPicture', properties: { DisplayName: 'Alex Morgan', Width: '96' } },
        { id: 'profile-name', type: 'TextBlock', properties: { Text: 'Alex Morgan', Style: 'HeadlineSmall', HorizontalAlignment: 'Center' } },
        { id: 'profile-bio', type: 'TextBlock', properties: { Text: 'Product designer & photographer', Style: 'BodyMedium', Foreground: '#49454F', HorizontalAlignment: 'Center' } },
      ],
    },
    {
      id: 'profile-stats',
      type: 'StackPanel',
      properties: { Orientation: 'Horizontal', Spacing: '24', HorizontalAlignment: 'Center' },
      children: [
        createProfileStat('profile-stat-posts', '248', 'Posts'),
        createProfileStat('profile-stat-followers', '12.4k', 'Followers'),
        createProfileStat('profile-stat-following', '891', 'Following'),
      ],
    },
    { id: 'profile-edit-btn', type: 'Button', properties: { Content: 'Edit Profile', Style: 'Outlined', HorizontalAlignment: 'Stretch' } },
  ]
  return page
}

function createProfileStat(id, value, label) {
  return {
    id,
    type: 'StackPanel',
    properties: { Spacing: '2', HorizontalAlignment: 'Center' },
    children: [
      { id: `${id}-value`, type: 'TextBlock', properties: { Text: value, Style: 'TitleMedium', HorizontalAlignment: 'Center' } },
      { id: `${id}-label`, type: 'TextBlock', properties: { Text: label, Style: 'BodySmall', Foreground: '#49454F', HorizontalAlignment: 'Center' } },
    ],
  }
}

function createLoginTemplate() {
  const page = createEmptyPage()
  const stack = findOrCreateContentStack(page)
  stack.children = [
    { id: 'login-title', type: 'TextBlock', properties: { Text: 'Welcome back', Style: 'HeadlineMedium' } },
    { id: 'login-subtitle', type: 'TextBlock', properties: { Text: 'Sign in to your account', Style: 'BodyLarge', Foreground: '#49454F' } },
    { id: 'login-email', type: 'TextBox', properties: { Header: 'Email', PlaceholderText: 'you@example.com' } },
    { id: 'login-password', type: 'PasswordBox', properties: { Header: 'Password', PlaceholderText: 'Enter your password' } },
    { id: 'login-forgot', type: 'Button', properties: { Content: 'Forgot password?', Style: 'Text' } },
    { id: 'login-submit', type: 'Button', properties: { Content: 'Sign In', Style: 'Filled', HorizontalAlignment: 'Stretch' } },
    { id: 'login-divider', type: 'Divider', properties: {} },
    { id: 'login-google', type: 'Button', properties: { Content: 'Continue with Google', Style: 'Outlined', HorizontalAlignment: 'Stretch' } },
    { id: 'login-signup', type: 'TextBlock', properties: { Text: "Don't have an account? Sign up", Style: 'BodyMedium', HorizontalAlignment: 'Center', Foreground: '#49454F' } },
  ]
  return page
}

function createOnboardingTemplate() {
  const page = createEmptyPage()
  const stack = findOrCreateContentStack(page)
  stack.children = [
    { id: 'onboarding-image', type: 'Image', properties: { Width: 'Fill', HorizontalAlignment: 'Stretch', Height: '300' } },
    { id: 'onboarding-title', type: 'TextBlock', properties: { Text: 'Discover something new every day', Style: 'HeadlineMedium', HorizontalAlignment: 'Center' } },
    { id: 'onboarding-description', type: 'TextBlock', properties: { Text: 'Explore curated content tailored to your interests. Swipe through recommendations and save your favorites.', Style: 'BodyLarge', Foreground: '#49454F', HorizontalAlignment: 'Center' } },
    {
      id: 'onboarding-dots',
      type: 'StackPanel',
      properties: { Orientation: 'Horizontal', Spacing: '8', HorizontalAlignment: 'Center' },
      children: [
        { id: 'dot-1', type: 'Icon', properties: { Glyph: 'Circle', Foreground: '#6750A4' } },
        { id: 'dot-2', type: 'Icon', properties: { Glyph: 'Circle', Foreground: '#CAC4D0' } },
        { id: 'dot-3', type: 'Icon', properties: { Glyph: 'Circle', Foreground: '#CAC4D0' } },
      ],
    },
    { id: 'onboarding-next', type: 'Button', properties: { Content: 'Get Started', Style: 'Filled', HorizontalAlignment: 'Stretch' } },
    { id: 'onboarding-skip', type: 'Button', properties: { Content: 'Skip', Style: 'Text', HorizontalAlignment: 'Center' } },
  ]
  return page
}

function createHeaderActions() {
  return {
    id: 'header-actions',
    type: 'StackPanel',
    properties: { Orientation: 'Horizontal', HorizontalAlignment: 'Right', Spacing: '8' },
    children: [
      { id: 'close-button', type: 'IconButton', properties: { Glyph: 'Close', Style: 'Standard' } },
    ],
  }
}

function createActionRow() {
  return {
    id: 'product-actions',
    type: 'StackPanel',
    properties: { Orientation: 'Horizontal', Spacing: '12' },
    children: [
      { id: 'favorite-button', type: 'IconButton', properties: { Glyph: 'Star', Style: 'Standard' } },
      { id: 'bookmark-button', type: 'IconButton', properties: { Glyph: 'Save', Style: 'Standard' } },
      {
        id: 'rating-row',
        type: 'StackPanel',
        properties: { Orientation: 'Horizontal', Spacing: '4' },
        children: [
          { id: 'rating-star-1', type: 'Icon', properties: { Glyph: 'Star' } },
          { id: 'rating-star-2', type: 'Icon', properties: { Glyph: 'Star' } },
          { id: 'rating-star-3', type: 'Icon', properties: { Glyph: 'Star' } },
          { id: 'rating-star-4', type: 'Icon', properties: { Glyph: 'Star' } },
          { id: 'rating-score', type: 'TextBlock', properties: { Text: '4.8/5', Style: 'BodySmall', Foreground: '#49454F' } },
        ],
      },
    ],
  }
}

function createReviewsList() {
  return {
    id: 'reviews-list',
    type: 'ListView',
    properties: {},
    children: [
      createReviewCard('review-1', 'Ava', 'Beautiful build quality and the sizing matched exactly what I needed for my space.'),
      createReviewCard('review-2', 'Noah', 'The materials feel premium and the shipping experience was smooth from start to finish.'),
      createReviewCard('review-3', 'Mia', 'I liked the detail shots and the long description because it answered all my questions before checkout.'),
    ],
  }
}

function createDashboardMetricRow() {
  return {
    id: 'dashboard-metrics',
    type: 'StackPanel',
    properties: { Orientation: 'Horizontal', Spacing: '12' },
    children: [
      createMetricCard('dashboard-metric-revenue', 'Revenue', '$12.4k'),
      createMetricCard('dashboard-metric-users', 'Users', '1.2k'),
      createMetricCard('dashboard-metric-orders', 'Orders', '87'),
    ],
  }
}

function createMetricCard(id, label, value) {
  return {
    id,
    type: 'Card',
    properties: { Style: 'Outlined', Padding: '12' },
    children: [
      { id: `${id}-label`, type: 'TextBlock', properties: { Text: label, Style: 'BodySmall', Foreground: '#49454F' } },
      { id: `${id}-value`, type: 'TextBlock', properties: { Text: value, Style: 'TitleMedium' } },
    ],
  }
}

function createPricingCardsSection(packageCount = 3, standoutPro = false) {
  const plans = [
    { id: 'basic', name: 'Basic', price: '$4.99/mo', copy: 'Limited access: basic articles, ads', features: ['3 saved lists', 'Weekly updates', 'Basic support', 'Single device'] },
    { id: 'pro', name: 'Pro', price: '$9.99/mo', copy: 'All features: unlimited articles, no ads, priority support', features: ['Unlimited saves', 'Daily premium content', 'Priority support', 'Offline access'] },
    { id: 'enterprise', name: 'Enterprise', price: 'Contact sales', copy: 'Custom solutions: dedicated account manager, custom integrations', features: ['Team seats', 'Advanced permissions', 'Custom onboarding', 'SSO and analytics'] },
  ]
  return {
    id: 'paywall-pricing-section',
    type: 'StackPanel',
    properties: { Orientation: 'Vertical', Spacing: '12' },
    children: plans.slice(0, Math.max(1, packageCount)).map((plan, index) => createPricingCard(plan, standoutPro && plan.id === 'pro', index)),
  }
}

function createPricingCard(plan, highlighted = false, index = 0) {
  const basePadding = highlighted ? '20' : '16'
  const baseHeight = highlighted ? '250' : '210'
  const titleStyle = highlighted ? 'HeadlineSmall' : 'TitleLarge'
  const priceStyle = highlighted ? 'HeadlineMedium' : 'TitleLarge'
  return {
    id: `paywall-${plan.id}-card`,
    type: 'Card',
    properties: {
      Style: highlighted ? 'Elevated' : 'Outlined',
      Padding: basePadding,
      Height: baseHeight,
      Background: highlighted ? '#EEF1FF' : '#FFFFFF',
      BorderBrush: highlighted ? '#0A3EFF' : '#CAC4D0',
      Highlighted: highlighted ? 'True' : 'False',
      Accent: highlighted ? '#0A3EFF' : '#49454F',
      Order: String(index),
    },
    children: [
      ...(highlighted ? [{ id: `paywall-${plan.id}-badge`, type: 'TextBlock', properties: { Text: 'Most popular', Style: 'LabelLarge', Foreground: '#0A3EFF' } }] : []),
      { id: `paywall-${plan.id}-title`, type: 'TextBlock', properties: { Text: plan.name, Style: titleStyle } },
      { id: `paywall-${plan.id}-price`, type: 'TextBlock', properties: { Text: plan.price, Style: priceStyle, Foreground: highlighted ? '#0A3EFF' : '#1C1B1F' } },
      { id: `paywall-${plan.id}-copy`, type: 'TextBlock', properties: { Text: plan.copy, Style: 'BodyMedium', Foreground: '#49454F' } },
      createFeatureChecklist(`paywall-${plan.id}-features`, plan.features),
    ],
  }
}

function createFeatureChecklist(id, items) {
  return {
    id,
    type: 'StackPanel',
    properties: { Orientation: 'Vertical', Spacing: '6' },
    children: items.map((item, index) => ({
      id: `${id}-item-${index + 1}`,
      type: 'TextBlock',
      properties: { Text: `• ${item}`, Style: 'BodySmall', Foreground: '#49454F' },
    })),
  }
}

function createGallerySection() {
  return {
    id: 'paywall-gallery',
    type: 'StackPanel',
    properties: { Orientation: 'Horizontal', Spacing: '12' },
    children: [
      { id: 'paywall-gallery-image-1', type: 'Image', properties: { Width: '96', Height: '96' } },
      { id: 'paywall-gallery-image-2', type: 'Image', properties: { Width: '96', Height: '96' } },
      { id: 'paywall-gallery-image-3', type: 'Image', properties: { Width: '96', Height: '96' } },
    ],
  }
}

function createPaywallStatsSection(prominent = false) {
  return {
    id: 'paywall-stats',
    type: 'StackPanel',
    properties: { Orientation: 'Vertical', Spacing: '12' },
    children: [
      createPaywallStatCard('paywall-stat-card-1', 'Premium users', '18.2k', 'Monthly growth +18%', prominent),
      createPaywallStatCard('paywall-stat-card-2', 'Upgrade rate', '38%', 'Conversion from trial +11%', prominent),
      createPaywallStatCard('paywall-stat-card-3', 'Retention', '92%', 'Subscriber renewals this quarter', prominent),
    ],
  }
}

function createPaywallStatCard(id, label, value, copy, prominent = false) {
  return {
    id,
    type: 'Card',
    properties: {
      Style: prominent ? 'Elevated' : 'Outlined',
      Padding: prominent ? '18' : '14',
      Height: prominent ? '150' : '118',
      Background: prominent ? '#F7F8FF' : '#FFFFFF',
      BorderBrush: prominent ? '#0A3EFF' : '#CAC4D0',
    },
    children: [
      { id: `${id}-label`, type: 'TextBlock', properties: { Text: label, Style: 'LabelLarge', Foreground: '#49454F' } },
      { id: `${id}-value`, type: 'TextBlock', properties: { Text: value, Style: prominent ? 'DisplaySmall' : 'HeadlineSmall' } },
      { id: `${id}-copy`, type: 'TextBlock', properties: { Text: copy, Style: 'BodySmall', Foreground: '#49454F' } },
      { id: `${id}-progress`, type: 'ProgressBar', properties: { Value: prominent ? '78' : '62' } },
    ],
  }
}

function createAboutSection() {
  return {
    id: 'paywall-about',
    type: 'StackPanel',
    properties: { Orientation: 'Vertical', Spacing: '8' },
    children: [
      { id: 'paywall-about-title', type: 'TextBlock', properties: { Text: 'About', Style: 'TitleLarge' } },
      {
        id: 'paywall-about-copy',
        type: 'TextBlock',
        properties: {
          Text: 'This app provides premium content and features to enhance your experience. Learn more about our brand and mission.',
          Style: 'BodyMedium',
          Foreground: '#49454F',
        },
      },
    ],
  }
}

function createReviewCard(id, name, review) {
  return {
    id,
    type: 'Card',
    properties: { Style: 'Outlined', Padding: '16' },
    children: [
      {
        id: `${id}-row`,
        type: 'StackPanel',
        properties: { Orientation: 'Horizontal', Spacing: '12' },
        children: [
          { id: `${id}-avatar`, type: 'PersonPicture', properties: { DisplayName: name, Width: '40' } },
          {
            id: `${id}-content`,
            type: 'StackPanel',
            properties: { Spacing: '4' },
            children: [
              { id: `${id}-name`, type: 'TextBlock', properties: { Text: name, Style: 'TitleSmall' } },
              { id: `${id}-copy`, type: 'TextBlock', properties: { Text: review, Style: 'BodyMedium', Foreground: '#49454F' } },
            ],
          },
        ],
      },
    ],
  }
}

function walk(node, visitor, parent = null) {
  if (!node) return
  visitor(node, parent)
  for (const child of node.children || []) walk(child, visitor, node)
}

function findFirst(node, predicate) {
  let match = null
  walk(node, (candidate, parent) => {
    if (!match && predicate(candidate, parent)) match = candidate
  })
  return match
}

function removeBottomNavigation(tree) {
  let removed = false
  walk(tree, (node) => {
    if (!Array.isArray(node.children)) return
    const before = node.children.length
    node.children = node.children.filter((child) => child.type !== 'BottomNavigationBar' && child.id !== 'bottom-nav')
    if (node.children.length !== before) removed = true
  })
  return removed
}

function ensureBottomNavigation(tree, tabCount) {
  // Remove existing bottom nav first
  removeBottomNavigation(tree)
  const defaultTabs = ['Home', 'Search', 'Favorites', 'Messages', 'Profile', 'Settings', 'Cart', 'Explore']
  const defaultIcons = ['Home', 'Search', 'Star', 'Chat', 'Person', 'Settings', 'Cart', 'Explore']
  const count = Math.min(tabCount || 5, 8)
  const items = []
  for (let i = 0; i < count; i++) {
    items.push({
      id: `bottom-nav-item-${i + 1}`,
      type: 'NavigationViewItem',
      properties: { Content: defaultTabs[i] || `Tab ${i + 1}`, Icon: defaultIcons[i] || 'Circle' },
    })
  }
  tree.children.push({
    id: 'bottom-nav',
    type: 'BottomNavigationBar',
    properties: {},
    children: items,
  })
  return true
}

function removePrimaryActionButton(tree) {
  let removed = false
  walk(tree, (node) => {
    if (!Array.isArray(node.children) || removed) return
    const next = []
    for (const child of node.children) {
      const isRemovableButton =
        child.type === 'Button' &&
        ((child.properties?.Style || '') === 'Filled' ||
          /get started|buy now|continue|shop now/i.test(child.properties?.Content || ''))
      if (!removed && isRemovableButton && !/close|x/i.test(child.properties?.Content || '')) {
        removed = true
        continue
      }
      next.push(child)
    }
    node.children = next
  })
  return removed
}

function setRootPadding(tree, value) {
  const stack = findOrCreateContentStack(tree)
  if (stack.properties?.Padding === value) return false
  stack.properties = { ...stack.properties, Padding: value }
  return true
}

function ensureHeroImage(tree) {
  const stack = findOrCreateContentStack(tree)
  const images = stack.children.filter((child) => child.type === 'Image')
  let image = images[0]
  if (!image) {
    image = { id: 'hero-image', type: 'Image', properties: { Height: '220' } }
    stack.children.unshift(image)
  }
  image.properties = {
    ...image.properties,
    Width: 'Fill',
    HorizontalAlignment: 'Stretch',
    Height: image.properties?.Height || '220',
  }
  stack.children = stack.children.filter((child, index) => child.type !== 'Image' || child === image || index === stack.children.indexOf(image))
  stack.children = [image, ...stack.children.filter((child) => child !== image)]
  return true
}

function ensureCloseButton(tree, position) {
  const stack = findOrCreateContentStack(tree)
  let header = stack.children.find((child) => child.id === 'header-actions')
  if (!header) {
    header = createHeaderActions()
    stack.children.unshift(header)
  }
  header.properties = {
    ...header.properties,
    Orientation: 'Horizontal',
    HorizontalAlignment: position === 'Left' ? 'Left' : 'Right',
    Spacing: '8',
  }
  let closeButton = (header.children || []).find((child) => child.id === 'close-button')
  if (!closeButton) {
    closeButton = { id: 'close-button', type: 'IconButton', properties: { Glyph: 'Close', Style: 'Standard' } }
    header.children = [...(header.children || []), closeButton]
  }
  closeButton.type = 'IconButton'
  closeButton.properties = { ...closeButton.properties, Glyph: 'Close', Style: 'Standard' }
  return true
}

function tunePrimaryTitle(tree) {
  const title =
    findFirst(tree, (node) => node.type === 'TextBlock' && /title/i.test(node.id || '')) ||
    findFirst(tree, (node) => node.type === 'TextBlock' && /^Headline/.test(node.properties?.Style || '')) ||
    findFirst(tree, (node) => node.type === 'TextBlock')

  if (!title) return false
  title.properties = { ...title.properties, Style: 'TitleLarge' }
  return true
}

function ensureTextScaffold(tree, directives) {
  const stack = findOrCreateContentStack(tree)
  let title = findFirst(tree, (node) => node.id === 'product-title' || /title/i.test(node.id || ''))
  if (!title) {
    title = { id: 'product-title', type: 'TextBlock', properties: { Text: 'Product title', Style: 'TitleLarge' } }
    stack.children.splice(1, 0, title)
  }
  if (directives.titleTone === 'smaller-bolder') {
    title.properties = { ...title.properties, Style: 'TitleLarge' }
  }

  if (directives.subtitle) {
    let subtitle = findFirst(tree, (node) => node.id === 'product-subtitle')
    if (!subtitle) {
      subtitle = { id: 'product-subtitle', type: 'TextBlock', properties: { Text: 'Short subtitle', Style: 'BodyMedium', Foreground: '#49454F' } }
      const insertAt = Math.min(stack.children.indexOf(title) + 1, stack.children.length)
      stack.children.splice(insertAt, 0, subtitle)
    }
  }

  if (directives.longDescription || directives.descriptionAlignment) {
    let description = findFirst(tree, (node) => node.id === 'product-description' || /description/i.test(node.id || ''))
    if (!description) {
      description = {
        id: 'product-description',
        type: 'TextBlock',
        properties: {
          Text: 'This is a longer paragraph description that gives the user enough detail to understand the product, compare options, and decide confidently.',
          Style: 'BodyMedium',
          Foreground: '#49454F',
          HorizontalAlignment: directives.descriptionAlignment || 'Left',
        },
      }
      stack.children.push(description)
    } else {
      description.properties = {
        ...description.properties,
        Text:
          description.properties?.Text ||
          'This is a longer paragraph description that gives the user enough detail to understand the product, compare options, and decide confidently.',
        Style: 'BodyMedium',
        Foreground: description.properties?.Foreground || '#49454F',
        HorizontalAlignment: directives.descriptionAlignment || description.properties?.HorizontalAlignment || 'Left',
      }
    }
  }

  return true
}

function ensureActionRow(tree, directives) {
  const stack = findOrCreateContentStack(tree)
  let row = findFirst(tree, (node) => node.id === 'product-actions')
  if (!row) {
    row = createActionRow()
    const descriptionIndex = stack.children.findIndex((child) => child.id === 'product-description')
    const insertAt = descriptionIndex === -1 ? Math.min(4, stack.children.length) : descriptionIndex
    stack.children.splice(insertAt, 0, row)
  }

  row.children = row.children || []
  if (directives.favorite && !row.children.some((child) => child.id === 'favorite-button')) {
    row.children.unshift({ id: 'favorite-button', type: 'IconButton', properties: { Glyph: 'Star', Style: 'Standard' } })
  }
  if (directives.bookmark && !row.children.some((child) => child.id === 'bookmark-button')) {
    row.children.push({ id: 'bookmark-button', type: 'IconButton', properties: { Glyph: 'Save', Style: 'Standard' } })
  }
  if (directives.rating && !row.children.some((child) => child.id === 'rating-row')) {
    row.children.push(createActionRow().children[2])
  }
  return true
}

function ensureReviewsSection(tree) {
  const stack = findOrCreateContentStack(tree)
  let list = findFirst(tree, (node) => node.id === 'reviews-list')
  if (!list) {
    list = createReviewsList()
    stack.children.push(list)
  }
  return true
}

function removeCardsByPosition(tree, transcript) {
  const lower = (transcript || '').toLowerCase()
  const atBottom = /\b(bottom|at the bottom|below)\b/.test(lower)
  let removed = false

  function removeCardsFrom(node) {
    if (!Array.isArray(node.children)) return
    if (atBottom) {
      // Remove cards from the end of children arrays
      const newChildren = []
      let foundNonCard = false
      // Walk backwards, remove trailing Card nodes
      for (let i = node.children.length - 1; i >= 0; i--) {
        const child = node.children[i]
        if (!foundNonCard && child.type === 'Card') {
          removed = true
          continue
        }
        foundNonCard = true
        newChildren.unshift(child)
      }
      node.children = newChildren
    } else {
      // Remove ALL cards
      const before = node.children.length
      node.children = node.children.filter(c => c.type !== 'Card')
      if (node.children.length < before) removed = true
    }
    // Recurse into remaining children
    for (const child of node.children) removeCardsFrom(child)
  }

  removeCardsFrom(tree)
  return removed
}

function shouldHandlePaywall(directives, transcript, hasPaywallTree = false) {
  return Boolean(
    hasPaywallTree ||
    directives.template === 'paywall' ||
    /\b(paywall|pricing|subscription|packages?)\b/.test(transcript) ||
    directives.pricingCards ||
    directives.packageCount ||
    directives.standoutPro ||
    directives.noTable
  )
}

function ensurePaywallLayout(tree, directives) {
  const stack = findOrCreateContentStack(tree)
  if (!findFirst(tree, (node) => node.id === 'paywall-title')) {
    const seeded = createPaywallTemplate()
    const seededStack = findOrCreateContentStack(seeded)
    stack.children = [...seededStack.children, ...(stack.children || [])]
  }

  removeTableLikeNodes(tree)

  ensurePaywallPricingSection(tree, directives)
  if (directives.longDescription) ensurePaywallDescription(tree)
  if (directives.gallery) ensureGallery(tree)
  if (directives.reviews) ensurePaywallReviews(tree)
  if (directives.statsSection) ensurePaywallStats(tree, directives.prominentStats)
  if (directives.aboutSection) ensurePaywallAbout(tree)

  orderPaywallSections(tree)
  return true
}

function removeTableLikeNodes(tree) {
  let removed = false
  walk(tree, (node) => {
    if (!Array.isArray(node.children)) return
    const before = node.children.length
    node.children = node.children.filter((child) => child.type !== 'DataTable' && child.id !== 'dashboard-data-table')
    if (node.children.length !== before) removed = true
  })
  return removed
}

function ensurePaywallPricingSection(tree, directives) {
  const stack = findOrCreateContentStack(tree)
  let title = findFirst(tree, (node) => node.id === 'pricing-title')
  if (!title) {
    title = { id: 'pricing-title', type: 'TextBlock', properties: { Text: 'Pricing comparison', Style: 'TitleLarge' } }
    stack.children.push(title)
  }

  const packageCount = Math.max(1, directives.packageCount || 3)
  let section = findFirst(tree, (node) => node.id === 'paywall-pricing-section')
  if (!section) {
    section = createPricingCardsSection(packageCount, directives.standoutPro || true)
    stack.children.push(section)
  } else {
    section.type = 'StackPanel'
    section.properties = { Orientation: 'Vertical', Spacing: '12' }
    section.children = createPricingCardsSection(packageCount, directives.standoutPro || true).children
  }

  if (directives.standoutPro) {
    emphasizeProPackage(tree)
  }
}

function emphasizeProPackage(tree) {
  const pro = findFirst(tree, (node) => node.id === 'paywall-pro-card')
  if (!pro) return false
  pro.properties = {
    ...pro.properties,
    Style: 'Elevated',
    Padding: '20',
    Height: '260',
    Background: '#EEF1FF',
    BorderBrush: '#0A3EFF',
    Highlighted: 'True',
  }
  const title = findFirst(pro, (node) => node.id === 'paywall-pro-title')
  const price = findFirst(pro, (node) => node.id === 'paywall-pro-price')
  if (title) title.properties = { ...title.properties, Style: 'HeadlineSmall' }
  if (price) price.properties = { ...price.properties, Style: 'HeadlineMedium', Foreground: '#0A3EFF' }
  if (!findFirst(pro, (node) => node.id === 'paywall-pro-badge')) {
    pro.children = [{ id: 'paywall-pro-badge', type: 'TextBlock', properties: { Text: 'Most popular', Style: 'LabelLarge', Foreground: '#0A3EFF' } }, ...(pro.children || [])]
  }
  return true
}

function ensurePaywallDescription(tree) {
  const stack = findOrCreateContentStack(tree)
  let description = findFirst(tree, (node) => node.id === 'paywall-description')
  if (!description) {
    description = {
      id: 'paywall-description',
      type: 'TextBlock',
      properties: {
        Text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus vitae odio aliquet commodo. Proin lacinia, massa at gravida dictum, sapien mauris tempor orci, a aliquet odio est at nunc. Vivamus vitae lacus a ligula suscipit fermentum.',
        Style: 'BodyMedium',
        Foreground: '#49454F',
      },
    }
    stack.children.push(description)
  }
  description.properties = {
    ...description.properties,
    Style: 'BodyMedium',
    Foreground: '#49454F',
  }
  return true
}

function ensureGallery(tree) {
  const stack = findOrCreateContentStack(tree)
  let gallery = findFirst(tree, (node) => node.id === 'paywall-gallery')
  if (!gallery) {
    gallery = createGallerySection()
    stack.children.push(gallery)
  }
  gallery.properties = { Orientation: 'Horizontal', Spacing: '12' }
  return true
}

function ensurePaywallReviews(tree) {
  const stack = findOrCreateContentStack(tree)
  let list = findFirst(tree, (node) => node.id === 'reviews-list')
  if (!list) {
    list = createReviewsList()
    stack.children.push(list)
  }
  return true
}

function ensurePaywallStats(tree, prominent = false) {
  const stack = findOrCreateContentStack(tree)
  let stats = findFirst(tree, (node) => node.id === 'paywall-stats')
  if (!stats) {
    stats = createPaywallStatsSection(prominent)
    stack.children.push(stats)
  } else {
    stats.properties = { Orientation: 'Vertical', Spacing: '12' }
    stats.children = createPaywallStatsSection(prominent).children
  }
  return true
}

function ensurePaywallAbout(tree) {
  const stack = findOrCreateContentStack(tree)
  let about = findFirst(tree, (node) => node.id === 'paywall-about')
  if (!about) {
    about = createAboutSection()
    stack.children.push(about)
  }
  return true
}

function orderPaywallSections(tree) {
  const stack = findOrCreateContentStack(tree)
  const orderedIds = [
    'header-actions',
    'paywall-title',
    'paywall-subtitle',
    'pricing-title',
    'paywall-pricing-section',
    'paywall-description',
    'paywall-gallery',
    'reviews-list',
    'paywall-stats',
    'paywall-about',
  ]
  const existing = new Map((stack.children || []).map((child) => [child.id, child]))
  const ordered = orderedIds.map((id) => existing.get(id)).filter(Boolean)
  const remainder = (stack.children || []).filter((child) => !orderedIds.includes(child.id))
  stack.children = [...ordered, ...remainder]
}

function shouldReinforceLastTarget(transcript, targetIds) {
  return Array.isArray(targetIds) && targetIds.length > 0 && /\b(change that|fix that|improve that|make it better|you did not|still did not|not like that|wrong)\b/.test(transcript)
}

function reinforceVoiceTargets(tree, targetIds) {
  let changed = false
  if (targetIds.some((id) => id === 'close-button' || id === 'header-actions')) {
    changed = ensureCloseButton(tree, 'Right') || changed
  }
  if (targetIds.includes('bottom-nav')) {
    changed = ensureBottomNavigation(tree, 5) || changed
  }
  if (targetIds.includes('dashboard-data-table')) {
    const table = findDashboardTableNode(tree)
    if (table) {
      normalizeDashboardTableNode(table, {
        rowCount: Math.max(getCurrentTableRowCount(table) + 4, 10),
        columnCount: Math.max(getCurrentTableColumnCount(table), 5),
        scrollableTable: true,
        realTableData: true,
        makeBigger: 'table',
      })
      changed = true
    }
  }
  if (targetIds.some((id) => id === 'paywall-pro-card' || id === 'paywall-pricing-section')) {
    changed = emphasizeProPackage(tree) || changed
  }
  if (targetIds.some((id) => id.startsWith('paywall-stat-card-') || id === 'paywall-stats')) {
    changed = ensurePaywallStats(tree, true) || changed
  }
  return changed
}

function shouldHandleDashboardTable(directives, transcript) {
  return Boolean(
    !shouldHandlePaywall(directives, transcript, false) &&
    !directives.noTable &&
    (
      directives.tableRequest ||
      directives.rowCount ||
      directives.columnCount ||
      directives.realTableData ||
      directives.scrollableTable ||
      directives.makeBigger === 'table' ||
      (/\bdashboard\b/.test(transcript) && /\b(rows?|columns?)\b/.test(transcript))
    )
  )
}

function keepOnlyType(tree, targetType) {
  const typeMap = {
    table: ['DataTable', 'Grid'],
    navigation: ['NavigationBar', 'NavigationRail', 'NavigationDrawer'],
    nav: ['NavigationBar', 'NavigationRail', 'NavigationDrawer'],
    header: ['NavigationBar'],
    cards: ['Card'],
    card: ['Card'],
    image: ['Image'],
    title: ['TextBlock'],
  }
  const keepTypes = typeMap[targetType] || [targetType]
  let changed = false

  function filterChildren(node) {
    if (!Array.isArray(node.children)) return
    const stack = findOrCreateContentStack(tree)
    if (node === stack || (node.type === 'StackPanel' && node.children.some(c => keepTypes.includes(c.type)))) {
      const before = node.children.length
      // Keep containers (ScrollViewer, StackPanel) + the target type + NavigationBar (always keep nav)
      node.children = node.children.filter(c => {
        if (keepTypes.includes(c.type)) return true
        if (c.type === 'NavigationBar' || c.type === 'NavigationRail' || c.type === 'NavigationDrawer') return true
        if (c.type === 'ScrollViewer' || c.type === 'StackPanel') return true
        // Keep title TextBlock
        if (c.type === 'TextBlock' && /title/i.test(c.id || '')) return true
        return false
      })
      if (node.children.length < before) changed = true
    }
    for (const child of node.children) filterChildren(child)
  }

  filterChildren(tree)
  return changed
}

function makeElementBigger(tree, targetType) {
  const typeMap = {
    table: ['DataTable', 'Grid'],
    image: ['Image'],
    card: ['Card'],
    nav: ['NavigationBar'],
    header: ['NavigationBar'],
    stats: [], // handled specially below
  }
  const targetTypes = typeMap[targetType] || [targetType]
  let changed = false

  // Special handling for stats/metrics — make metric cards bigger with larger typography
  if (targetType === 'stats') {
    walk(tree, (node) => {
      if (!node.id) return
      const isMetric = /metric|stat/i.test(node.id) && node.type === 'Card'
      if (isMetric) {
        node.properties = { ...node.properties, Padding: '20' }
        walk(node, (child) => {
          if (child.type !== 'TextBlock') return
          const style = child.properties?.Style || 'BodyMedium'
          if (/Title|Headline/.test(style)) {
            child.properties = { ...child.properties, Style: 'HeadlineMedium' }
          } else {
            child.properties = { ...child.properties, Style: 'TitleSmall' }
          }
        })
        changed = true
      }
    })
    // Also try generic cards that look like metrics (Card with 1-2 TextBlock children)
    if (!changed) {
      walk(tree, (node) => {
        if (node.type !== 'Card') return
        const textChildren = (node.children || []).filter(c => c.type === 'TextBlock')
        if (textChildren.length >= 1 && textChildren.length <= 3 && (node.children || []).length <= 4) {
          node.properties = { ...node.properties, Padding: '20' }
          for (const tc of textChildren) {
            const style = tc.properties?.Style || 'BodyMedium'
            if (/Title|Headline/.test(style)) {
              tc.properties = { ...tc.properties, Style: 'HeadlineMedium' }
            } else {
              tc.properties = { ...tc.properties, Style: 'TitleSmall' }
            }
          }
          changed = true
        }
      })
    }
    return changed
  }

  walk(tree, (node) => {
    if (!targetTypes.includes(node.type)) return
    if (node.type === 'DataTable' || node.type === 'Grid') {
      normalizeDashboardTableNode(node, {
        rowCount: Math.max(getCurrentTableRowCount(node) + 4, 10),
        columnCount: Math.max(getCurrentTableColumnCount(node), 5),
        scrollableTable: true,
        realTableData: true,
        makeBigger: 'table',
      })
      changed = true
    } else if (node.type === 'Image') {
      node.properties = { ...node.properties, Height: '300', Width: 'Fill', HorizontalAlignment: 'Stretch' }
      changed = true
    }
  })

  return changed
}

function findOrCreateContentStack(page) {
  for (const child of page.children || []) {
    if (child.type === 'ScrollViewer') {
      for (const inner of child.children || []) {
        if (inner.type === 'StackPanel') return inner
      }
    }
    if (child.type === 'StackPanel') return child
  }
  const stack = {
    id: 'content-stack',
    type: 'StackPanel',
    properties: { Orientation: 'Vertical', Padding: '16', Spacing: '16' },
    children: [],
  }
  page.children = page.children || []
  page.children.push({ id: 'scroll-root', type: 'ScrollViewer', properties: {}, children: [stack] })
  return stack
}

function ensureDashboardTable(tree, directives) {
  const stack = findOrCreateContentStack(tree)
  if (!findFirst(tree, (node) => node.id === 'dashboard-title')) {
    const seeded = createDashboardTemplate()
    const seededStack = findOrCreateContentStack(seeded)
    stack.children = [...seededStack.children, ...(stack.children || [])]
  }

  let table = findDashboardTableNode(tree)
  if (!table) {
    table = createDashboardTableNode()
    const metricsIndex = stack.children.findIndex((child) => child.id === 'dashboard-metrics')
    const insertAt = metricsIndex === -1 ? stack.children.length : metricsIndex + 1
    stack.children.splice(insertAt, 0, table)
  }

  normalizeDashboardTableNode(table, directives)
  return true
}

function findDashboardTableNode(tree) {
  return findFirst(
    tree,
    (node) =>
      node.id === 'dashboard-data-table' ||
      node.type === 'DataTable' ||
      ((node.id || '').includes('table') && ['Grid', 'Card', 'ListView'].includes(node.type)),
  )
}

function createDashboardTableNode() {
  return {
    id: 'dashboard-data-table',
    type: 'DataTable',
    properties: {
      SelectionMode: 'None',
      IsReadOnly: 'True',
      Scrollable: 'True',
      Height: '360',
      Padding: '0',
    },
    children: [],
  }
}

function normalizeDashboardTableNode(node, directives = {}) {
  const currentRows = getCurrentTableRowCount(node)
  const currentColumns = getCurrentTableColumnCount(node)
  const requestedRows = directives.rowCount || null
  const requestedColumns = directives.columnCount || null
  const rowCount = requestedRows || (directives.makeBigger === 'table'
    ? Math.max(currentRows + 4, 10)
    : Math.max(currentRows, directives.tableRequest ? 10 : 6, directives.scrollableTable ? 10 : 0))
  const columnCount = requestedColumns || Math.max(currentColumns, directives.tableRequest ? 5 : 4)
  const headers = buildDashboardTableHeaders(columnCount)
  const rows = buildDashboardTableRows(rowCount, headers)
  const height = Math.max(280, Math.min(460, 110 + rowCount * 26))

  node.id = 'dashboard-data-table'
  node.type = 'DataTable'
  node.properties = {
    ...node.properties,
    Columns: headers.join(','),
    RowsJson: JSON.stringify(rows),
    SelectionMode: 'None',
    IsReadOnly: 'True',
    Scrollable: (directives.scrollableTable || rowCount >= 8 || directives.makeBigger === 'table') ? 'True' : (node.properties?.Scrollable || 'False'),
    Height: String(height),
    Padding: '0',
  }
  node.children = headers.map((header, index) => ({
    id: `dashboard-table-header-${index + 1}`,
    type: 'TextBlock',
    properties: { Text: header, Style: 'LabelLarge' },
  }))
}

function getCurrentTableRowCount(node) {
  const rows = parseTableRows(node.properties?.RowsJson || node.properties?.Rows)
  return rows.length || 3
}

function getCurrentTableColumnCount(node) {
  const fromProps = String(node.properties?.Columns || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  return fromProps.length || (node.children || []).length || 3
}

function parseTableRows(raw) {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function buildDashboardTableHeaders(columnCount) {
  const base = ['Order', 'Customer', 'Status', 'Updated', 'Total', 'Channel', 'Priority', 'ETA']
  return base.slice(0, Math.max(1, columnCount))
}

function buildDashboardTableRows(rowCount, headers) {
  const sampleRows = [
    ['ORD-2048', 'West Harbor', 'Ready', '2m ago', '$1,240', 'Web', 'High', 'Today'],
    ['ORD-2051', 'North Peak', 'Picking', '6m ago', '$860', 'App', 'Medium', 'Today'],
    ['ORD-2056', 'Blue Atlas', 'Packed', '14m ago', '$2,180', 'Sales', 'High', 'Today'],
    ['ORD-2060', 'Oak Supply', 'Delayed', '22m ago', '$540', 'Web', 'Critical', '1h'],
    ['ORD-2064', 'Summit Parts', 'Shipped', '31m ago', '$1,960', 'Partner', 'Low', '2h'],
    ['ORD-2069', 'Metro Build', 'Ready', '44m ago', '$3,420', 'App', 'High', '2h'],
    ['ORD-2072', 'Canyon Tools', 'Picking', '51m ago', '$780', 'Web', 'Medium', '3h'],
    ['ORD-2078', 'Harbor Steel', 'Packed', '1h ago', '$1,110', 'Sales', 'Medium', '3h'],
    ['ORD-2084', 'Granite Works', 'Shipped', '1h ago', '$4,050', 'Partner', 'Low', '4h'],
    ['ORD-2091', 'Elevate Co', 'Ready', '2h ago', '$920', 'Web', 'High', 'Today'],
    ['ORD-2095', 'Atlas Crew', 'Picking', '2h ago', '$1,680', 'App', 'Medium', 'Today'],
    ['ORD-2099', 'North Crane', 'Delayed', '3h ago', '$2,940', 'Sales', 'Critical', '6h'],
  ]

  return Array.from({ length: rowCount }, (_, index) => {
    const source = sampleRows[index % sampleRows.length]
    return Object.fromEntries(headers.map((header, colIndex) => [header, source[colIndex] || `Value ${index + 1}-${colIndex + 1}`]))
  })
}
