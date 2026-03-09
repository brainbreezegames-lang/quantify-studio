// Conditional 4-layer prompt assembly for the web design (HTML/CSS) path.
// Single source of truth — used by both server/claude.js and api/generate.js.
//
// Layer 1: Core system spec (always)
// Layer 2: Screen archetype (conditional — detected from prompt keywords)
// Layer 3: Component rules (always)
// Layer 4: Critique self-check (always)
// Plus: brand guide, design brief, old archetype spec, gold examples, quality checklist

import { CORE_SYSTEM_SPEC } from './core-system-spec.js'
import { SCREEN_ARCHETYPE_LAYERS, detectArchetypeLayer } from './screen-archetypes.js'
import { COMPONENT_RULES } from './component-rules.js'
import { CRITIQUE_CHECKLIST_COMPACT } from './design-critique-checklist.js'
import { DESIGN_PHILOSOPHY } from './design-philosophy.js'

/**
 * @param {object} opts
 * @param {string} opts.prompt - User's design prompt
 * @param {object|null} opts.designBrief - Optional business brief
 * @param {object|null} opts.currentTree - Existing tree for modification requests
 * @param {string} opts.qualityChecklist - Quality toggle checklist string
 * @param {string} [opts.taskPrefix] - Optional prefix (e.g. wireframe instruction)
 * @param {string} [opts.brandGuide] - Optional brand guide text
 * @param {object} [opts.screenArchetypes] - Old SCREEN_ARCHETYPES map
 * @param {object} [opts.goldExamples] - GOLD_EXAMPLES map
 */
export function assembleWebLayers({
  prompt,
  designBrief,
  currentTree,
  qualityChecklist,
  taskPrefix,
  brandGuide,
  screenArchetypes,
  goldExamples,
}) {
  const archetypeKey = detectArchetypeLayer(prompt)
  const archetypeLayer = archetypeKey ? SCREEN_ARCHETYPE_LAYERS[archetypeKey] : null

  // Detect old archetype for structural guidance + gold examples
  let oldArchetype = null
  if (screenArchetypes) {
    const lower = (prompt || '').toLowerCase()
    const patterns = [
      { key: 'login', kw: ['login', 'sign in', 'signin', 'sign-in', 'log in', 'authentication', 'onboarding', 'welcome screen', 'splash'] },
      { key: 'empty-state', kw: ['empty state', 'empty-state', 'no data', 'no results', 'zero state', 'first use', 'blank state'] },
      { key: 'settings', kw: ['settings', 'preferences', 'configuration', 'account settings', 'app settings', 'options', 'profile settings'] },
      { key: 'dashboard', kw: ['dashboard', 'overview', 'home screen', 'home page', 'summary', 'analytics', 'metrics', 'kpi'] },
      { key: 'detail-view', kw: ['detail', 'details', 'view details', 'detail view', 'detail page', 'profile', 'reservation detail', 'order detail', 'item detail', 'single'] },
      { key: 'form-input', kw: ['form', 'create', 'new ', 'add ', 'edit ', 'input', 'register', 'signup', 'sign up', 'sign-up', 'checkout', 'booking'] },
      { key: 'list-browse', kw: ['list', 'browse', 'search', 'catalog', 'inventory', 'reservations', 'orders', 'history', 'items', 'products', 'equipment', 'schedule', 'table'] },
    ]
    for (const { key, kw } of patterns) {
      if (kw.some(k => lower.includes(k))) { oldArchetype = key; break }
    }
  }

  let msg = ''

  // Layer 1: Core system spec
  msg += CORE_SYSTEM_SPEC + '\n\n'

  // Brand guide (if provided)
  if (brandGuide) {
    msg += `Brand Style Guide:\n${brandGuide}\n\n`
  }

  // Design brief (if provided)
  if (designBrief && typeof designBrief === 'object') {
    msg += `Business design brief:\n${JSON.stringify(designBrief, null, 2)}\n\n`
  }

  // Layer 2: Screen archetype (conditional)
  if (archetypeLayer) {
    msg += archetypeLayer + '\n\n'
  }

  // Layer 3: Component rules
  msg += COMPONENT_RULES + '\n\n'

  // Task-specific content
  if (taskPrefix) {
    msg += taskPrefix + '\n\n'
  }

  if (currentTree) {
    msg += `Create the most beautiful, production-quality design for this screen.

CONTENT REFERENCE (use the same sections, labels and data — but design visually however looks best):
${JSON.stringify(currentTree, null, 2)}

Design request: ${prompt}`
  } else if (!taskPrefix) {
    msg += `Create the most beautiful, production-quality design for this screen: ${prompt}`
  } else {
    msg += `User intent: ${prompt}`
  }

  // Old archetype spec + gold example for structural guidance
  if (oldArchetype && screenArchetypes && screenArchetypes[oldArchetype]) {
    msg += `\n\n${screenArchetypes[oldArchetype]}`
  }
  if (oldArchetype && goldExamples && goldExamples[oldArchetype]) {
    msg += `\n\nREFERENCE — here is the quality bar for this screen type (adapt to the request, don't copy verbatim):\n${goldExamples[oldArchetype]}`
  }

  // Quality checklist
  msg += qualityChecklist

  // Layer 4: Critique self-check
  msg += '\n' + CRITIQUE_CHECKLIST_COMPACT

  // Hidden design philosophy — elevates quality silently
  msg += '\n' + DESIGN_PHILOSOPHY

  return msg
}
