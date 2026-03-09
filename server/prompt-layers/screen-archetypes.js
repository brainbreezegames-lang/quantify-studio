// Layer 2: Screen Archetypes — injected only when a matching archetype is detected
// Defines how each screen type should behave visually

export const SCREEN_ARCHETYPE_LAYERS = {
  dashboard: `Dashboard-specific rules:
- Emphasize scanability and hierarchy over decoration.
- Start with a strong summary layer: key metrics, status, alerts, or operational totals.
- Use display typography only for important KPI values, not for every number.
- Organize information into clearly different zones:
  - top summary (stat-group with 2-4 KPI cards)
  - critical alerts or exceptions (info-bar or highlighted card)
  - detailed cards, charts, or lists (card-grid with activity feed)
  - optional quick-actions (FAB or bottom-actions bar)
- Use stronger contrast than standard screens, but keep the layout clean.
- Cards should feel operational and dense, not marketing-like.
- Highlight problems, delays, risks, and exceptions clearly.
- Avoid symmetrical "tile wallpaper" dashboards with equal weight everywhere.
- At least one area should feel primary and immediately actionable.
- Use brand-blue accents carefully; most surfaces should remain light.
- If charts are shown, they should support decisions, not act as decoration.
- Empty space should help hierarchy, not reduce information density.
- Layout skeleton: [app-bar] > [stat-group] > [card-grid OR activity-feed] > [quick-actions?]
- Hierarchy: L1=KPI values (largest, boldest), L2=card titles + stat labels, L3=metadata + timestamps
- Density target: 4-6 data points visible without scrolling
- Primary CTA: quick-action FAB or first stat card tap
- Common mistakes: equal-weight tiles, decorative charts, too many accent colors
- ANTI-PATTERNS for dashboards:
  - Never center-align KPI labels or stat values (left-align for scannability)
  - Never make all stat cards the same size/color/weight (vary to create hierarchy)
  - Never use more than 2 chart types on one screen
  - Never put a chart without a clear title and one-line insight
  - Never use decorative gradients on data containers (save color for data meaning)
- Allowed flourishes: subtle gradients on hero stat card, brand-blue tinted chart fills, micro-animation on KPI deltas`,

  'list-browse': `Forms and lists-specific rules:
- Optimize for speed, clarity, and real work.
- The user should immediately understand what can be viewed, filtered, edited, or submitted.
- Prioritize:
  - toolbar clarity (title + 1-2 actions max)
  - search and filter visibility (chip-bar or search-bar prominent)
  - easy row scanning (consistent [icon] + [text col] + [trailing badge/chevron] pattern)
  - obvious row hierarchy (title-md for primary, body-sm for secondary)
- Use chips, status markers, badges, and metadata deliberately to improve scanning.
- Avoid oversized cards and excessive whitespace.
- Avoid decorative UI that slows down task completion.
- Keep controls aligned and rhythmically spaced on the 4px grid.
- Layout skeleton: [app-bar] > [filter-zone] > [scrollable-list] > [fab?]
- Hierarchy: L1=row titles + status badges, L2=secondary text + metadata, L3=timestamps + IDs
- Density target: 4-8 list items visible without scrolling
- Primary CTA: FAB for create, or first list item tap for browse
- Common mistakes: Item 1/2/3 data, no status differentiation, missing filter bar
- ANTI-PATTERNS for lists:
  - Never show a list without at least one status badge or visual differentiator per row
  - Never make all rows identical weight — vary with badges, colors, or emphasis on key rows
  - Never hide the item count (show "12 reservations" or similar near the top)
  - Never omit trailing chevrons or action affordances on tappable rows
  - Never use full-width buttons inside list items (use badge or icon-btn instead)
- Allowed flourishes: subtle row hover states, brand-colored active filter chips`,

  'form-input': `Forms and lists-specific rules:
- Optimize for speed, clarity, and real work.
- Group related fields into logical sections with section-headers.
- Use compact but breathable spacing (12px between fields, 24px between groups).
- Labels, helper text, validation, and action buttons must be explicit.
- Primary action should be obvious (filled button, right side of bottom-actions).
- Secondary actions should be grouped and quieter (outlined button, left side).
- Toolbars must follow Avontus conventions (close icon for edit mode).
- Keep controls aligned and rhythmically spaced on the 4px grid.
- Layout skeleton: [app-bar with close] > [form-groups] > [bottom-actions]
- Hierarchy: L1=section headers + primary CTA, L2=field labels + input values, L3=helper text + placeholders
- Density target: one complete form group visible without scrolling
- Primary CTA: bottom-actions bar with Save/Submit on right
- Common mistakes: bare unstyled inputs, missing labels, no field grouping, no validation hints
- VALIDATION ON FORMS: When the user asks for validation states, errors, or required fields:
  - Add .field-error / .field-warning / .field-info class to the .field div
  - Add <span class="field-validation-icon"><span class="msi sm">error</span></span> inside .field after the input
  - Add <span class="field-helper field-helper-error">Error message</span> AFTER the .field as a sibling
  - The runtime auto-creates: severity icon in app bar + tappable popup listing all issues
  - NEVER create your own validation summary, error list, or info-bar for field validation
- ANTI-PATTERNS for forms:
  - Never stack more than 3-4 fields without a section break or header
  - Never use bare <input> or <select> — always wrap in .field with .field-label
  - Never put the submit button anywhere except bottom-actions bar
  - Never use placeholder text as the only label (always use .field-label)
  - Never make all fields the same width when some are short (date, time, zip code)
  - Never create inline validation summary cards or error lists — the runtime handles this
- Allowed flourishes: subtle field focus transitions, section dividers with micro-spacing`,

  'detail-view': `Detail view rules:
- Present one entity comprehensively with clear information hierarchy.
- Hero header should show: entity name, status badge, primary metric, subtitle.
- Break content into 2-4 sections with section-headers.
- Include contextual actions relevant to the entity state.
- Layout skeleton: [app-bar with back] > [hero-header] > [info-sections OR tabs] > [bottom-actions?]
- Hierarchy: L1=entity name + status + primary metric, L2=section headers + key fields, L3=metadata + timestamps
- Density target: hero + first section visible without scrolling
- Primary CTA: contextual action ("Ship", "Edit", "Approve") in bottom-actions or app-bar
- Common mistakes: flat list of fields, no visual grouping, missing status context
- ANTI-PATTERNS for detail views:
  - Never present all fields as a flat list — group into labeled sections
  - Never omit the entity status (badge in header is mandatory)
  - Never put action buttons in the middle of content — use app-bar or bottom-actions
  - Never show raw IDs without context (pair with human-readable name)
  - Never make the hero header taller than 120px (keep it compact and informational)
- Allowed flourishes: status-colored hero accent, brand-tinted section backgrounds`,

  settings: `Settings rules:
- Group preferences into 2-4 logical sections.
- Each row: [icon] + [label + description col] + [trailing toggle/chevron/value].
- Destructive actions at bottom, visually separated.
- Layout skeleton: [app-bar with back] > [preference-groups] > [destructive-zone?]
- Hierarchy: L1=section headers, L2=preference labels, L3=descriptions + current values
- Density target: 6-8 preference rows visible without scrolling
- Primary CTA: none (settings are direct manipulation via toggles)
- Common mistakes: no descriptions on toggles, flat unsectioned list, bare switches without labels
- VALIDATION: When settings have validation (required fields, invalid values), use .field-error/.field-warning/.field-info on .field divs + .field-helper sibling. The runtime auto-creates the severity icon in the app bar and a tappable popup. NEVER create your own validation summary or error list.
- Allowed flourishes: subtle dividers between rows, muted icons in brand-blue`,

  login: `Sign-in / onboarding rules:
- Center content vertically with generous top margin.
- Logo/brand mark at top, form fields in middle, secondary links at bottom.
- One clear primary CTA (full-width filled button).
- Layout skeleton: [branding-zone] > [form-zone] > [footer-links?]
- Hierarchy: L1=primary CTA button (largest, filled), L2=logo + input fields, L3=footer links
- Density target: all elements visible without scrolling
- Primary CTA: full-width "Sign in" or "Get started" button
- Common mistakes: too many fields, cluttered footer, weak CTA hierarchy
- ANTI-PATTERNS for login:
  - Never show more than 2-3 input fields (email + password, maybe "remember me")
  - Never use a small or non-prominent CTA — the sign-in button must dominate
  - Never add decorative UI that competes with the form for attention
  - Never use a dark background that makes form fields hard to read
  - Never forget the brand logo/mark at the top
- Allowed flourishes: 107-degree brand slant motif, brand-blue gradient accent on hero`,

  'empty-state': `Empty state rules:
- Center content vertically with icon/illustration + headline + body + CTA.
- Copy must be specific and helpful: "No reservations yet" not "No data".
- CTA must be actionable: "Create first reservation" not "Add".
- Layout skeleton: [app-bar] > [centered-content]
- Hierarchy: L1=CTA button + headline, L2=body text, L3=illustration (decorative)
- Density target: all elements visible, vertically centered
- Primary CTA: single filled button below explanation
- Common mistakes: generic "No data" text, missing CTA, decorative-only illustration
- Allowed flourishes: brand-blue outline illustration, subtle background pattern`,

  'workflow': `Multi-step workflow rules:
- Show clear progress indication (stepper, progress bar, or step count).
- One step visible at a time with clear "Next" and "Back" actions.
- Validate each step before allowing progression.
- Layout skeleton: [app-bar with close] > [stepper/progress] > [step-content] > [bottom-actions]
- Hierarchy: L1=current step content + Next CTA, L2=step title + progress, L3=helper text
- Density target: current step fully visible without scrolling
- Primary CTA: "Next" or final action in bottom-actions
- Common mistakes: all steps visible at once, no progress indication, unclear step boundaries
- Allowed flourishes: animated step transitions, brand-blue progress fill`
}

// Detect which archetype layer to inject based on prompt keywords
export function detectArchetypeLayer(prompt) {
  if (!prompt || typeof prompt !== 'string') return null
  const lower = prompt.toLowerCase()

  const patterns = [
    { key: 'login', keywords: ['login', 'sign in', 'signin', 'sign-in', 'log in', 'authentication', 'onboarding', 'welcome screen', 'splash'] },
    { key: 'empty-state', keywords: ['empty state', 'empty-state', 'no data', 'no results', 'zero state', 'first use', 'blank state'] },
    { key: 'workflow', keywords: ['workflow', 'wizard', 'multi-step', 'multistep', 'stepper', 'onboarding flow', 'checkout flow'] },
    { key: 'settings', keywords: ['settings', 'preferences', 'configuration', 'account settings', 'app settings', 'options', 'profile settings'] },
    { key: 'dashboard', keywords: ['dashboard', 'overview', 'home screen', 'home page', 'summary', 'analytics', 'metrics', 'kpi', 'operations'] },
    { key: 'detail-view', keywords: ['detail', 'details', 'view details', 'detail view', 'detail page', 'profile', 'reservation detail', 'order detail', 'item detail', 'single'] },
    { key: 'form-input', keywords: ['form', 'create', 'new ', 'add ', 'edit ', 'input', 'register', 'signup', 'sign up', 'sign-up', 'checkout', 'booking'] },
    { key: 'list-browse', keywords: ['list', 'browse', 'search', 'catalog', 'inventory', 'reservations', 'orders', 'history', 'items', 'products', 'equipment', 'schedule', 'table'] },
  ]

  for (const { key, keywords } of patterns) {
    if (keywords.some(kw => lower.includes(kw))) {
      return key
    }
  }

  return null
}
