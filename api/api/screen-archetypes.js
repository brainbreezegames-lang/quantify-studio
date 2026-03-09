// Screen archetype specs — structural blueprints for the AI
// Each archetype defines zones, composition, spacing, and hierarchy
// so the AI has a concrete layout plan instead of inventing from scratch.

export const SCREEN_ARCHETYPES = {
  'dashboard': `SCREEN ARCHETYPE: Dashboard
ZONES: [app-bar] > [stat-group] > [card-grid OR activity-feed] > [quick-actions?]
COMPOSITION:
  app-bar: title ("Dashboard" or domain-specific) + 1-2 icon-btns (notifications, settings)
  stat-group: 2-4 KPI stat-cards in a grid. Each: label + large value + optional delta/trend
  card-grid: 2-3 summary cards below stats — recent activity, upcoming items, alerts
  quick-actions: optional FAB or bottom action row for primary create action
SPACING: app-bar>stats=12, stats>cards=16, between-cards=12, card-padding=16
DATA: realistic KPI numbers (not round 100s), varied statuses, recent timestamps
HIERARCHY: L1=KPI values (largest, boldest), L2=card titles + stat labels, L3=metadata + timestamps`,

  'list-browse': `SCREEN ARCHETYPE: List / Browse
ZONES: [app-bar] > [filter-zone] > [scrollable-list] > [fab?]
COMPOSITION:
  app-bar: title + search-icon + overflow-menu (max 2 icon-btns)
  filter-zone: chip-bar (3-5 chips, first=active) OR search-bar + chip-bar
  scrollable-list: card rows, each = [icon/avatar 40px] + [col: title-md + body-sm + metadata] + [trailing: badge? + chevron]
  fab: bottom-right, primary-create-action (only if screen allows creation)
SPACING: app-bar>filter=0, filter>list=12, between-rows=8, row-padding=12-16
DATA: 4-8 items visible, realistic variety in status/badges/names, no "Item 1/2/3"
HIERARCHY: L1=row titles + status badges, L2=secondary text + metadata, L3=timestamps + IDs`,

  'form-input': `SCREEN ARCHETYPE: Form / Edit Modal
COPY the "MODAL EDIT FORM WITH VALIDATION" template from system prompt exactly.
Toolbar: close (X) = cancel | title | severity icon | check = save
.validation-popup INSIDE app-bar. .field-helper AFTER .field. NO .info-bar. NO .bottom-actions.
SPACING: 12px between fields, 24px between groups. Realistic field labels.`,

  'detail-view': `SCREEN ARCHETYPE: Detail View
ZONES: [app-bar] > [hero-header] > [info-sections OR tabs] > [bottom-actions?]
COMPOSITION:
  app-bar: back-arrow + title (entity name or ID) + edit icon-btn + overflow
  hero-header: key info summary — entity name, status badge, primary metric, subtitle
  info-sections: 2-4 sections with section-headers showing related data (details, items, history, notes)
  bottom-actions: contextual actions ("Ship", "Edit", "Cancel Reservation")
SPACING: app-bar>hero=0, hero-padding=16-20, hero>sections=16, between-sections=20
DATA: one complete entity with realistic values, related items list, activity/history entries
HIERARCHY: L1=entity name + status + primary metric, L2=section headers + key fields, L3=metadata + history timestamps`,

  'settings': `SCREEN ARCHETYPE: Settings / Preferences
ZONES: [app-bar] > [preference-groups] > [destructive-zone?]
COMPOSITION:
  app-bar: back-arrow + "Settings" title
  preference-groups: 2-4 groups, each = section-header + 2-4 toggle/select rows. Each row = [icon 24px] + [col: label + description] + [trailing: toggle/chevron/value]
  destructive-zone: bottom section with outlined/red destructive actions (Sign Out, Delete Account)
SPACING: app-bar>first-group=8, between-groups=24, between-rows=0 (divider only), row-padding=16
DATA: realistic preference labels, not "Option 1". Include descriptions explaining each toggle.
HIERARCHY: L1=section headers, L2=preference labels, L3=descriptions + current values`,

  'login': `SCREEN ARCHETYPE: Login / Onboarding
ZONES: [branding-zone] > [form-zone] > [footer-links?]
COMPOSITION:
  branding-zone: logo (centered, generous top margin) + optional tagline or app name
  form-zone: 1-3 input fields (email/username, password) stacked vertically + primary CTA button (full-width)
  footer-links: secondary actions ("Forgot password?", "Create account", "SSO login")
SPACING: top-margin=64-80, logo>form=32-40, between-fields=12, fields>cta=24, cta>links=16
DATA: realistic placeholders, not "Enter text here". Use domain context.
HIERARCHY: L1=primary CTA button (largest, filled, full-width), L2=logo + input fields, L3=footer links`,

  'empty-state': `SCREEN ARCHETYPE: Empty State
ZONES: [app-bar] > [centered-content]
COMPOSITION:
  app-bar: back-arrow or menu + title
  centered-content: vertically centered group = [icon or illustration 64-80px] + [headline: what's empty] + [body: why + what to do] + [primary CTA button]
SPACING: illustration>headline=16, headline>body=8, body>cta=24
DATA: specific, helpful copy — "No reservations yet" not "No data". CTA = "Create First Reservation" not "Add".
HIERARCHY: L1=CTA button + headline, L2=body text, L3=illustration (decorative, not focal)`
}

/**
 * Detect screen archetype from a user prompt using keyword matching.
 * Returns null if no archetype is confidently detected — never forces a wrong match.
 */
export function detectArchetype(prompt) {
  if (!prompt || typeof prompt !== 'string') return null
  const lower = prompt.toLowerCase()

  // Order matters: check specific patterns before generic ones
  const patterns = [
    { archetype: 'login', keywords: ['login', 'sign in', 'signin', 'sign-in', 'log in', 'authentication', 'onboarding', 'welcome screen', 'splash'] },
    { archetype: 'empty-state', keywords: ['empty state', 'empty-state', 'no data', 'no results', 'zero state', 'first use', 'blank state'] },
    { archetype: 'settings', keywords: ['settings', 'preferences', 'configuration', 'account settings', 'app settings', 'options', 'profile settings'] },
    { archetype: 'dashboard', keywords: ['dashboard', 'overview', 'home screen', 'home page', 'summary', 'analytics', 'metrics', 'kpi'] },
    { archetype: 'detail-view', keywords: ['detail', 'details', 'view details', 'detail view', 'detail page', 'profile', 'reservation detail', 'order detail', 'item detail', 'single'] },
    { archetype: 'form-input', keywords: ['form', 'create', 'new ', 'add ', 'edit ', 'input', 'register', 'signup', 'sign up', 'sign-up', 'checkout', 'booking'] },
    { archetype: 'list-browse', keywords: ['list', 'browse', 'search', 'catalog', 'inventory', 'reservations', 'orders', 'history', 'items', 'products', 'equipment', 'schedule', 'table'] },
  ]

  for (const { archetype, keywords } of patterns) {
    if (keywords.some(kw => lower.includes(kw))) {
      return archetype
    }
  }

  return null
}
