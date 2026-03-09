import { extractJsonObject, repairComponentTree, validateTreeStrict } from './tree-schema.js'
import { AVONTUS_BRAND_GUIDE } from './avontus-brand-guide.js'
import { SCREEN_ARCHETYPES, detectArchetype } from './screen-archetypes.js'
import { GOLD_EXAMPLES } from './gold-examples.js'
// 4-layer prompt system
import { CORE_SYSTEM_SPEC } from './prompt-layers/core-system-spec.js'
import { COMPONENT_RULES } from './prompt-layers/component-rules.js'
import { DESIGN_CRITIQUE_CHECKLIST } from './prompt-layers/design-critique-checklist.js'
import { SYSTEM_PROMPT_TREE } from '../server/prompt-layers/system-prompt-tree.js'
import { assembleWebLayers } from '../server/prompt-layers/assemble-web-layers.js'
import { DESIGN_PHILOSOPHY } from '../server/prompt-layers/design-philosophy.js'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

// ─── Security ────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://quantify-studio.vercel.app',
  'http://localhost:5173',
  'http://localhost:3001',
]

const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const RATE_LIMIT_MAX = 10 // max requests per window per IP

function checkRateLimit(ip) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 })
    return true
  }
  entry.count++
  return entry.count <= RATE_LIMIT_MAX
}

const SYSTEM_PROMPT = SYSTEM_PROMPT_TREE

// SYSTEM_PROMPT was extracted to server/prompt-layers/system-prompt-tree.js
// as single source of truth shared by server/claude.js and api/generate.js.


// --- Mock data for when no API key is configured ---

function generateMockTree(prompt) {
  const lower = prompt.toLowerCase()

  if (lower.includes('login') || lower.includes('sign in')) {
    return {
      id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
        {
          id: 'login-content', type: 'StackPanel', properties: { HorizontalAlignment: 'Center', Padding: '32', Spacing: '24', VerticalAlignment: 'Center' }, children: [
            { id: 'login-logo', type: 'Image', properties: { Width: '200', Height: '80' } },
            { id: 'login-username', type: 'TextBox', properties: { Header: 'Username', PlaceholderText: 'Enter username' } },
            { id: 'login-password', type: 'PasswordBox', properties: { Header: 'Password', PlaceholderText: 'Enter password' } },
            {
              id: 'login-buttons', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '16', HorizontalAlignment: 'Center' }, children: [
                { id: 'login-connection-btn', type: 'Button', properties: { Content: 'Connection...', Style: 'Outlined' } },
                { id: 'login-signin-btn', type: 'Button', properties: { Content: 'Sign in', Style: 'Filled' } },
              ]
            },
            { id: 'login-version', type: 'TextBlock', properties: { Text: 'Quantify v3.2.1', Style: 'BodySmall', HorizontalAlignment: 'Center', Foreground: '#49454F' } },
            { id: 'login-copyright', type: 'TextBlock', properties: { Text: '\u00a9 Avontus 2008-2025. All rights reserved.', Style: 'BodySmall', HorizontalAlignment: 'Center', Foreground: '#49454F' } },
            { id: 'login-about-btn', type: 'Button', properties: { Content: 'About Quantify...', Style: 'Text', HorizontalAlignment: 'Center' } },
          ]
        }
      ]
    }
  }

  if (lower.includes('connection')) {
    return {
      id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
        {
          id: 'conn-toolbar', type: 'NavigationBar', properties: { Content: 'Connection settings', MainCommand: 'Close' }, children: [
            { id: 'conn-warning-icon', type: 'Icon', properties: { Glyph: 'AlertTriangle', Foreground: '#F9A825' } },
            { id: 'conn-save-icon', type: 'Icon', properties: { Glyph: 'Check' } },
          ]
        },
        {
          id: 'conn-content', type: 'StackPanel', properties: { Padding: '32', Spacing: '16' }, children: [
            { id: 'conn-server-url', type: 'TextBox', properties: { Header: 'Remote server', PlaceholderText: 'https://' } },
            { id: 'conn-ssl-toggle', type: 'ToggleSwitch', properties: { Header: 'Use SSL', IsOn: 'True' } },
            { id: 'conn-test-btn', type: 'Button', properties: { Content: 'Test connection', Style: 'Outlined', HorizontalAlignment: 'Right' } },
          ]
        }
      ]
    }
  }

  if (lower.includes('reservation') && lower.includes('list')) {
    return {
      id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
        { id: 'list-toolbar', type: 'NavigationBar', properties: { Content: 'RESERVATIONS', MainCommand: 'Back' }, children: [] },
        {
          id: 'list-scroll', type: 'ScrollViewer', properties: {}, children: [
            {
              id: 'list-content', type: 'StackPanel', properties: { Spacing: '8', Padding: '16,8' }, children: [
                { id: 'list-branch-label', type: 'TextBlock', properties: { Text: 'Branch office', Style: 'TitleSmall' } },
                { id: 'list-branch-dropdown', type: 'Button', properties: { Content: 'New York', Style: 'Outlined' } },
                {
                  id: 'list-items', type: 'ListView', properties: {}, children: [
                    {
                      id: 'res-card-1', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
                        { id: 'res-1-id', type: 'TextBlock', properties: { Text: 'DEL-00756', Style: 'TitleMedium' } },
                        { id: 'res-1-date', type: 'TextBlock', properties: { Text: 'March 15, 2025', Style: 'BodySmall', Foreground: '#49454F' } },
                        { id: 'res-1-company', type: 'TextBlock', properties: { Text: 'Johnson Construction', Style: 'BodyMedium' } },
                        { id: 'res-1-location', type: 'TextBlock', properties: { Text: 'Midtown Tower Site', Style: 'BodyMedium' } },
                        { id: 'res-1-address', type: 'TextBlock', properties: { Text: '350 5th Avenue, New York, NY', Style: 'BodySmall', Foreground: '#0005EE' } },
                        { id: 'res-1-summary', type: 'TextBlock', properties: { Text: '24 pieces \u00b7 1,240 kg', Style: 'BodySmall', Foreground: '#49454F' } },
                      ]
                    },
                    {
                      id: 'res-card-2', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
                        { id: 'res-2-id', type: 'TextBlock', properties: { Text: 'DEL-00761', Style: 'TitleMedium' } },
                        { id: 'res-2-date', type: 'TextBlock', properties: { Text: 'March 18, 2025', Style: 'BodySmall', Foreground: '#49454F' } },
                        { id: 'res-2-company', type: 'TextBlock', properties: { Text: 'Apex Building Group', Style: 'BodyMedium' } },
                        { id: 'res-2-location', type: 'TextBlock', properties: { Text: 'Downtown Office Complex', Style: 'BodyMedium' } },
                        { id: 'res-2-address', type: 'TextBlock', properties: { Text: '88 Greenwich St, New York, NY', Style: 'BodySmall', Foreground: '#0005EE' } },
                        { id: 'res-2-summary', type: 'TextBlock', properties: { Text: '18 pieces \u00b7 890 kg', Style: 'BodySmall', Foreground: '#49454F' } },
                      ]
                    },
                  ]
                },
              ]
            }
          ]
        }
      ]
    }
  }

  if (lower.includes('ship')) {
    return {
      id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
        {
          id: 'ship-toolbar', type: 'NavigationBar', properties: { Content: 'Ship reservation', MainCommand: 'Close' }, children: [
            { id: 'ship-error-icon', type: 'Icon', properties: { Glyph: 'XCircle', Foreground: '#D32F2F' } },
            { id: 'ship-save-icon', type: 'Icon', properties: { Glyph: 'Check' } },
          ]
        },
        {
          id: 'ship-scroll', type: 'ScrollViewer', properties: {}, children: [
            {
              id: 'ship-content', type: 'StackPanel', properties: { Padding: '32', Spacing: '16' }, children: [
                { id: 'ship-shortage-toggle', type: 'ToggleSwitch', properties: { Header: 'Create new reservation with shortages', IsOn: 'False' } },
                { id: 'ship-all-btn', type: 'Button', properties: { Content: 'Ship all', Style: 'Tonal' } },
                { id: 'ship-divider', type: 'Divider', properties: {} },
                { id: 'ship-products-title', type: 'TextBlock', properties: { Text: 'Products to ship', Style: 'TitleSmall' } },
                {
                  id: 'ship-products', type: 'ListView', properties: {}, children: [
                    {
                      id: 'ship-product-1', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
                        { id: 'sp-1-code', type: 'TextBlock', properties: { Text: 'SCF-4824', Style: 'LabelMedium', Foreground: '#49454F' } },
                        { id: 'sp-1-name', type: 'TextBlock', properties: { Text: 'Standard Frame 48x24', Style: 'BodyMedium' } },
                        {
                          id: 'sp-1-qty-row', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
                            { id: 'sp-1-ordered', type: 'TextBlock', properties: { Text: 'Ordered: 12', Style: 'BodySmall', Foreground: '#49454F' } },
                            { id: 'sp-1-minus', type: 'Button', properties: { Content: '-', Style: 'Outlined' } },
                            { id: 'sp-1-qty', type: 'TextBox', properties: { Text: '12' } },
                            { id: 'sp-1-plus', type: 'Button', properties: { Content: '+', Style: 'Outlined' } },
                          ]
                        },
                        { id: 'sp-1-weight', type: 'TextBlock', properties: { Text: 'Weight: 186 kg', Style: 'BodySmall', Foreground: '#49454F' } },
                      ]
                    },
                    {
                      id: 'ship-product-2', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
                        { id: 'sp-2-code', type: 'TextBlock', properties: { Text: 'BRC-3618', Style: 'LabelMedium', Foreground: '#49454F' } },
                        { id: 'sp-2-name', type: 'TextBlock', properties: { Text: 'Diagonal Brace 36x18', Style: 'BodyMedium' } },
                        {
                          id: 'sp-2-qty-row', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
                            { id: 'sp-2-ordered', type: 'TextBlock', properties: { Text: 'Ordered: 8', Style: 'BodySmall', Foreground: '#49454F' } },
                            { id: 'sp-2-minus', type: 'Button', properties: { Content: '-', Style: 'Outlined' } },
                            { id: 'sp-2-qty', type: 'TextBox', properties: { Text: '8' } },
                            { id: 'sp-2-plus', type: 'Button', properties: { Content: '+', Style: 'Outlined' } },
                          ]
                        },
                        { id: 'sp-2-weight', type: 'TextBlock', properties: { Text: 'Weight: 96 kg', Style: 'BodySmall', Foreground: '#49454F' } },
                      ]
                    },
                  ]
                },
              ]
            }
          ]
        }
      ]
    }
  }

  // Default
  return {
    id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
      { id: 'home-toolbar', type: 'NavigationBar', properties: { Content: 'Quantify', MainCommand: 'Back' }, children: [] },
      {
        id: 'home-scroll', type: 'ScrollViewer', properties: {}, children: [
          {
            id: 'home-content', type: 'StackPanel', properties: { Padding: '32', Spacing: '16' }, children: [
              { id: 'home-welcome', type: 'TextBlock', properties: { Text: 'Welcome to Quantify', Style: 'HeadlineMedium' } },
              { id: 'home-subtitle', type: 'TextBlock', properties: { Text: 'Describe a Quantify screen to generate its layout.', Style: 'BodyLarge', Foreground: '#49454F' } },
              {
                id: 'home-card', type: 'Card', properties: { Style: 'Outlined', Padding: '16' }, children: [
                  {
                    id: 'home-card-content', type: 'StackPanel', properties: { Spacing: '12' }, children: [
                      { id: 'home-card-title', type: 'TextBlock', properties: { Text: 'Try these prompts', Style: 'TitleMedium' } },
                      { id: 'home-card-desc', type: 'TextBlock', properties: { Text: 'Sign in screen, Connection settings, List reservations, View reservation, Ship reservation, Jobsite check-in, Navigation drawer, Inspection list', Style: 'BodyMedium', Foreground: '#49454F' } },
                    ]
                  }
                ]
              },
            ]
          }
        ]
      }
    ]
  }
}

// --- Vercel serverless handler ---

const ENHANCE_SYSTEM_PROMPT = `You are an expert UI/UX design prompt refiner. Your job: take the user's rough or messy description and rewrite it as a clear, precise, actionable design prompt — while preserving EXACTLY what they asked for.

## CRITICAL RULE: Never change what the user asked for
- If they say "Airbnb listing page" → keep it as an Airbnb listing page. Do NOT turn it into a scaffolding reservation screen.
- If they say "food delivery app" → keep it as food delivery. Do NOT inject Avontus domain language.
- If they say "reservation dashboard" → THEN use Avontus domain language (reservations, scaffolding, branches, equipment, jobsites).
- Match the user's domain. Only use Avontus language when the prompt is clearly about Avontus/scaffolding/equipment.

## What you improve
1. Structure: turn rambling or voice-transcribed text into clear, ordered requirements
2. Specificity: add what sections to show, what data to display, what actions are available
3. De-duplicate: voice transcripts often repeat the same request 3-5 times — collapse into one clear instruction
4. Resolve contradictions: if the user said "make it big" then "make it small", use the LAST instruction
5. Add realistic data: suggest domain-appropriate example data (names, prices, dates, IDs)

## What you NEVER change
- The screen type or app concept the user described
- The specific features or sections they mentioned
- The visual style they requested (e.g., "like Airbnb", "minimal", "dark mode")

## Screen archetypes (use to expand vague prompts)
- Dashboard: KPI cards, stat groups, charts, activity feed, quick actions
- Detail view: hero header, tabbed sections, action buttons, related items
- List/browse: search bar, filters, sortable rows, FAB for create
- Form/input: grouped fields with labels, validation, section headers, submit/cancel
- Settings: grouped toggle rows, descriptions, destructive zone at bottom

## Rules
1. Preserve the user's core intent and domain exactly
2. Keep it to 2-5 sentences — dense, descriptive, actionable
3. Describe WHAT to show, never HOW to code it — no CSS classes, HTML tags, or code
4. If quality lenses are active, weave their emphasis naturally
5. If modifying an existing screen, frame as improvements — "Enhance the current screen by adding..."
6. Output ONLY the enhanced prompt text. No explanation, no prefix, no quotes, no markdown.`

const WEB_SYSTEM_PROMPT = `You are a world-class product designer and front-end engineer. Your job is to create STUNNING, production-quality mobile UI screens for Avontus Quantify — a scaffolding and equipment reservation management platform.

DESIGN PHILOSOPHY: Create the most beautiful, polished design possible. You have complete creative freedom within the Avontus brand and Material Design 3. Do NOT think about XAML, component types, or cross-platform constraints. Think purely in terms of visual excellence, UX clarity, and brand fidelity. Use any HTML/CSS techniques — gradients, shadows, blur, custom CSS — whatever makes the screen look amazing.

CRITICAL — USER PROMPT IS LAW: Always build EXACTLY the screen the user describes. The user's prompt defines the content, screen type, features, and data. NEVER substitute the user's request with a different screen. If the user asks for "a food delivery app", build a food delivery app. If they ask for "a reservation list", build a reservation list. Apply Avontus branding (colors, fonts, styling) to whatever the user asks for, but never change WHAT they asked for.

╔══════════════════════════════════════════════════════════════╗
║  ⛔ TWO CRITICAL RULES — VIOLATING THESE = BROKEN OUTPUT  ║
╚══════════════════════════════════════════════════════════════╝

RULE 1 — ICONS IN TEXT WILL BREAK THE UI:
The class "msi" renders Material Symbol ICONS, not text. Words like "cancel", "settings", "error", "info", "close", "check", "home", "search", "send", "share", "done", "warning", "delete", "edit" etc. will render as GRAPHIC ICONS when inside <span class="msi">.

NEVER write: <span class="msi">settings</span> inside a sentence — it renders as ⚙ not the word "settings"
NEVER write: <span class="msi">cancel</span> inside a paragraph — it renders as ✕ not the word "cancel"
NEVER write: <span class="msi">error</span> inside body text — it renders as ⚠ not the word "error"

✅ Icons ONLY go inside: .icon-btn buttons, .list-icon containers, or standalone in a .row with gap
✅ When mentioning icons in text, write the plain word WITHOUT .msi: "Cancel through the app settings"
✅ When you need icon + text side by side, use: <div class="row" style="gap:8px"><span class="msi sm">icon_name</span><span>Text here</span></div>

RULE 2 — DARK TEXT ON DARK BLUE = INVISIBLE:
Any background with blue, navy, teal, or dark gradient MUST have white text (color: #FFFFFF).
NEVER use default text color (#1C1B1F) or any dark color on blue/navy/dark backgrounds.
EVERY element inside a dark/blue container MUST explicitly set color: #fff or color: #E8E9FD.
This includes headings, body text, spans, labels, links — ALL text nodes, no exceptions.

IMPORTANT: Return ONLY valid JSON. No markdown, no explanation, no code fences.
{"html": "...", "css": "..."}

- "html": inner content of <div id="app"> only. NO html/head/body/script/style tags.
- "css": your custom CSS for this screen. The host pre-loads all base design system classes (listed below) — do NOT redefine them. Add custom CSS freely for any visual enhancement not covered by base classes.

═══════════════════════════════════════════
DESIGN GRAMMAR (always apply)
═══════════════════════════════════════════

SPACING RHYTHM — use these exact values:
- 4px: icon-to-label, badge padding (micro)
- 8px: related siblings, list-item internals (tight)
- 12px: between cards, form fields (standard)
- 16-24px: between distinct sections (section)
- 32px: between layout zones — app-bar to content, content to bottom-actions (zone)
- Rule: group-internal spacing MUST be smaller than group-external spacing (1:2 ratio minimum)

VISUAL HIERARCHY — exactly 3 levels per screen:
- L1: one element per screen, largest/boldest/most-colored (the primary action or key data point)
- L2: section headers, supporting data, secondary actions (medium weight)
- L3: metadata, timestamps, helper text (smallest, muted color)
- NEVER make everything the same size/weight — that kills hierarchy

COLOR DISTRIBUTION:
- 70% neutral surfaces (white, gray, surface-container)
- 20% text colors, borders, subtle backgrounds
- 10% accent (primary actions, active states, key badges)
- Primary color on max 2-3 elements per screen — more = visual noise

DENSITY:
- Card padding: 12-16px, never 24+ (wastes mobile space)
- App-bar height: 56-64px, never taller
- List-row height: 56-72px, min 48px (touch target)
- Show 4-8 list items without scrolling on mobile

ANTI-PATTERNS — never do these:
- AP1: Center-align ALL text on screen. Body text and captions MUST be left-aligned.
- AP2: Same padding/gap everywhere. Use tight spacing inside groups, generous spacing between groups.
- AP3: 4+ distinct accent colors. Stick to one primary + semantic set (red/amber/green/blue).
- AP4: 5+ identical cards with zero visual differentiation. Vary with badges, status colors, emphasis.
- AP5: Orphan button floating disconnected from content. Buttons belong in bottom-actions bar, inside cards, or in app-bar.
- AP6: Placeholder content like "Lorem ipsum", "Item 1/2/3", "User Name", "Description here". Always use domain-realistic data.
- AP7: Heading and body text at the same size/weight. Must have visible contrast between levels.
- AP8: 4+ icon-buttons in app bar. Max 2-3 actions visible, rest go in overflow menu.
- AP9: Custom button CSS. NEVER write CSS for .btn-filled, .btn-outlined, .btn-tonal, .btn-text in the "css" field. NEVER add inline styles that override background, color, border-radius, height, padding, font-size, or width on buttons. The button classes are pre-loaded pill-shaped (9999px radius), 40px tall, auto-width. Use them as-is.

═══════════════════════════════════════════
PRE-LOADED CSS CLASSES — USE THESE IN HTML
═══════════════════════════════════════════
These classes are guaranteed to exist. Use them directly in your HTML.
Do NOT redefine them in "css". Just reference them by name.

SCREEN STRUCTURE (use this skeleton for every screen):
  <div class="screen">
    <div class="app-bar">…</div>
    <div class="content">…</div>
    <!-- optional: <div class="bottom-actions">…</div> -->
  </div>

BUTTONS — ⛔ NEVER override button CSS (height, padding, border-radius, font-size, background, color are ALL pre-loaded):
  <button class="btn-filled">Label</button>       ← primary: pill shape, #0005EE bg, white text, 40px tall
  <button class="btn-outlined">Label</button>     ← secondary: pill shape, 1px border, blue text, 40px tall
  <button class="btn-text">Label</button>         ← tertiary: no bg/border, blue text, 40px tall
  <button class="btn-tonal">Label</button>        ← alternative: light blue bg, blue text, 40px tall
  <button class="btn-filled btn-sm">Small</button> ← compact: 32px tall
  <button class="icon-btn"><span class="msi">arrow_back</span></button>
  ⛔ NEVER add style="..." to buttons that overrides background, color, border-radius, height, padding, or font-size.
  ⛔ NEVER write custom CSS for .btn-filled, .btn-outlined, .btn-tonal, .btn-text — they are pre-loaded.
  ⛔ NEVER use width:100% on buttons unless inside .bottom-actions. Buttons are auto-width by default.
  ✅ For full-width pairs: <div class="bottom-actions"><button class="btn-outlined" style="flex:1">Cancel</button><button class="btn-filled" style="flex:1">Save</button></div>

ICONS — CRITICAL RULE: Every icon MUST use <span class="msi">icon_name</span>
  The text content is a Material Symbols ligature name. NEVER write icon names as bare text.
  <span class="msi">arrow_back</span>      ← back navigation
  <span class="msi">close</span>           ← close / cancel
  <span class="msi">check</span>           ← confirm / done
  <span class="msi">more_vert</span>       ← overflow menu
  <span class="msi">menu</span>            ← hamburger menu
  <span class="msi">add</span>             ← add item
  <span class="msi">remove</span>          ← remove / minus
  <span class="msi">search</span>          ← search
  <span class="msi">tune</span>            ← filter / tune
  <span class="msi">refresh</span>         ← refresh / reload
  <span class="msi">sync</span>            ← sync
  <span class="msi">edit</span>            ← edit
  <span class="msi">delete</span>          ← delete
  <span class="msi">done</span>            ← checkmark done
  <span class="msi">done_all</span>        ← all done
  <span class="msi">clear</span>           ← clear / X
  <span class="msi">chevron_right</span>   ← navigate right
  <span class="msi">chevron_left</span>    ← navigate left
  <span class="msi">expand_more</span>     ← dropdown open
  <span class="msi">expand_less</span>     ← dropdown close
  <span class="msi">notifications</span>   ← bell
  <span class="msi">person</span>          ← user
  <span class="msi">account_circle</span>  ← user avatar
  <span class="msi">group</span>           ← group / team
  <span class="msi">business</span>        ← company
  <span class="msi">settings</span>        ← settings
  <span class="msi">home</span>            ← home
  <span class="msi">dashboard</span>       ← dashboard
  <span class="msi">list_alt</span>        ← list
  <span class="msi">inventory_2</span>     ← inventory / products
  <span class="msi">local_shipping</span>  ← delivery / truck
  <span class="msi">assignment</span>      ← reservation / document
  <span class="msi">schedule</span>        ← clock / time
  <span class="msi">calendar_today</span>  ← date / calendar
  <span class="msi">place</span>           ← location / pin
  <span class="msi">map</span>             ← map
  <span class="msi">call</span>            ← phone call
  <span class="msi">mail</span>            ← email
  <span class="msi">check_circle</span>    ← success / complete
  <span class="msi">cancel</span>          ← cancelled
  <span class="msi">warning</span>         ← warning
  <span class="msi">error</span>           ← error
  <span class="msi">info</span>            ← info
  <span class="msi">report_problem</span>  ← issue / defect
  <span class="msi">star</span>            ← favourite / rating
  <span class="msi">visibility</span>      ← view / eye
  <span class="msi">upload</span>          ← upload
  <span class="msi">download</span>        ← download
  <span class="msi">add_business</span>    ← new company
  <span class="msi">fitness_center</span>  ← weight / load
  <span class="msi">filter_list</span>     ← filter list
  <span class="msi">sort</span>            ← sort
  Size variants: <span class="msi sm">icon</span> (18px) | default=24px | <span class="msi lg">icon</span> (32px)

CARDS:
  <div class="card">…</div>               ← outlined
  <div class="card-elevated">…</div>      ← shadow
  <div class="card-filled">…</div>        ← blue tint

STATS (2-column grid):
  <div class="stat-group">
    <div class="stat-card"><span class="stat-label">LABEL</span><span class="stat-value">42</span></div>
    <div class="stat-card"><span class="stat-label">LABEL</span><span class="stat-value teal">18</span></div>
  </div>

SECTION HEADER:  <p class="section-header">PRODUCTS</p>

TYPOGRAPHY:
  <p class="display">Hero number</p>      ← 36px bold
  <p class="headline">Big title</p>        ← 28px bold
  <p class="title-lg">Section title</p>    ← 22px semibold
  <p class="title-md">Card title</p>       ← 16px semibold
  <p class="title-sm">Compact title</p>    ← 14px semibold
  <p class="body-lg">Large body</p>        ← 16px regular
  <p class="body-md">Body text</p>         ← 14px regular
  <p class="body-sm">Caption / secondary</p> ← 12px
  <p class="label-lg">Large label</p>      ← 14px semibold
  <p class="label-md">MEDIUM LABEL</p>     ← 12px uppercase
  <p class="label-sm">MICRO LABEL</p>      ← 11px uppercase
  <span class="link">linked text</span>
  <span class="code">SCF-4824</span>   ← product/reservation codes

FLOATING ACTION BUTTON:
  <button class="fab"><span class="msi">add</span></button>
  <button class="fab-extended"><span class="msi">add</span> New Reservation</button>

TABS:
  <div class="tab-bar">
    <button class="tab active">Details</button>
    <button class="tab">Products</button>
    <button class="tab">History</button>
  </div>

COLOR UTILITIES:
  .text-primary .text-secondary .text-disabled .text-on-primary .text-error .text-success .text-accent
  .surface-container (blue-tinted surface bg)

LAYOUT UTILITIES:
  <div class="row">…</div>              ← horizontal, gap:12px, align center
  <div class="row-between">…</div>     ← horizontal, space-between
  <div class="col">…</div>             ← vertical, gap:4px

BADGES:
  <span class="badge badge-blue">Info</span>
  <span class="badge badge-teal">Success</span>
  <span class="badge badge-error">Error</span>
  <span class="badge badge-warning">Warning</span>
  <span class="badge badge-gray">Neutral</span>

LIST ITEMS (inside a .card):
  <div class="list-item">
    <div class="list-icon"><span class="msi">inventory_2</span></div>
    <div class="col" style="flex:1">…content…</div>
    <button class="icon-btn"><span class="msi">chevron_right</span></button>
  </div>

AVATAR (person initials):
  <div class="avatar">JD</div>

TOGGLE SWITCH (ALWAYS wrap in row-between — never use bare switch alone):
  <div class="row-between">
    <span class="title-md">Setting Name</span>
    <label class="switch"><input type="checkbox" checked><span class="sw-track"><span class="sw-thumb"></span></span></label>
  </div>
  For toggle with subtitle:
  <div class="row-between">
    <div class="col" style="gap:2px">
      <span class="title-md">Setting Name</span>
      <span class="body-sm" style="color:#49454F">Short description of what this does</span>
    </div>
    <label class="switch"><input type="checkbox"><span class="sw-track"><span class="sw-thumb"></span></span></label>
  </div>

TEXT FIELD:
  <div class="field">
    <label class="field-label">Label</label>
    <input class="field-input" type="text" placeholder="Placeholder">
  </div>

DROPDOWN (select):
  <div class="field">
    <label class="field-label">Branch</label>
    <select class="field-input">
      <option>Houston Branch</option>
      <option>Chicago Branch</option>
    </select>
  </div>

TEXTAREA (multi-line):
  <div class="field">
    <label class="field-label">Notes</label>
    <textarea class="field-input" rows="3" placeholder="Enter notes…"></textarea>
  </div>

FIELD VALIDATION (error/warning/info states on fields):
  The runtime handles all validation UX automatically — you just need to use the right classes.
  The system will auto-create a tappable severity icon in the app bar and a popup listing all issues.

  Step 1: Add severity class to the .field div:
    <div class="field field-error">…</div>    ← red border, Error severity
    <div class="field field-warning">…</div>  ← yellow border, Warning severity
    <div class="field field-info">…</div>     ← blue border, Info severity

  Step 2: Add a .field-validation-icon inside the .field (after the input):
    <span class="field-validation-icon"><span class="msi sm">error</span></span>       ← for errors
    <span class="field-validation-icon"><span class="msi sm">warning</span></span>     ← for warnings
    <span class="field-validation-icon"><span class="msi sm">info</span></span>        ← for info

  Step 3: Add a .field-helper span AFTER the .field div (as a sibling, NOT inside):
    <span class="field-helper field-helper-error">Server URL is required</span>
    <span class="field-helper field-helper-warning">Date falls on a weekend</span>
    <span class="field-helper field-helper-info">Notes will be shared with team</span>

  Complete example — error field:
    <div class="field field-error">
      <label class="field-label">Server URL</label>
      <input class="field-input" type="text" placeholder="e.g., api.avontus.com">
      <span class="field-validation-icon"><span class="msi sm">error</span></span>
    </div>
    <span class="field-helper field-helper-error">Server URL is required</span>

  Complete example — warning field:
    <div class="field field-warning">
      <label class="field-label">Delivery date</label>
      <input class="field-input" type="text" value="15/03/2026">
      <span class="field-validation-icon"><span class="msi sm">warning</span></span>
    </div>
    <span class="field-helper field-helper-warning">Date falls on a weekend</span>

  CRITICAL VALIDATION RULES:
  V1. ONLY use the .field-error / .field-warning / .field-info class on .field divs — NEVER invent custom validation HTML.
  V2. NEVER create standalone validation summaries, info-bars, or cards that list errors. The runtime auto-generates a popup from the field states.
  V3. NEVER add validation text inside the .field div (except the .field-validation-icon). Helper text goes AFTER the .field as a sibling .field-helper span.
  V4. NEVER use .info-bar for field-level validation. Info bars are for page-level alerts only (not tied to specific fields).
  V5. The severity icon in the app bar is auto-created by the runtime. You do NOT need to add it manually.
  V6. Normal fields (no validation) should NOT have field-error/field-warning/field-info classes.

SEARCH BAR:
  <div class="search-bar">
    <span class="msi sm">search</span>
    <input class="field-input" type="text" placeholder="Search…">
  </div>

FILTER CHIPS:
  <div class="filter-bar">
    <button class="chip active">All</button>
    <button class="chip">Pending</button>
    <button class="chip">In Transit</button>
  </div>

INFO BAR (alerts):
  <div class="info-bar error"><span class="msi sm">report_problem</span><span>Error message here</span></div>
  <div class="info-bar warning"><span class="msi sm">warning</span><span>Warning message</span></div>

DIVIDER:   <hr class="divider">
PROGRESS:  <div class="progress"><div class="progress-fill" style="width:60%"></div></div>

STEPPER (quantity input):
  <div class="col" style="gap:6px">
    <span class="label-sm">Quantity</span>
    <div class="row" style="gap:8px">
      <button class="icon-btn"><span class="msi">remove</span></button>
      <input type="number" value="5" style="width:56px;border:1.5px solid #CAC4D0;border-radius:8px;padding:6px 4px;text-align:center;font-size:16px;font-family:inherit;background:#fff">
      <button class="icon-btn"><span class="msi">add</span></button>
    </div>
  </div>

BOTTOM ACTIONS (for non-modal screens only — NOT for edit/create modals):
  <div class="bottom-actions">
    <button class="btn-outlined" style="flex:1">Cancel</button>
    <button class="btn-filled" style="flex:1">Save</button>
  </div>

═══════════════════════════════════════════
COMPLETE SCREEN EXAMPLE — COPY THIS STRUCTURE
═══════════════════════════════════════════
<div class="screen">
  <div class="app-bar">
    <button class="icon-btn"><span class="msi">arrow_back</span></button>
    <span class="app-bar-title">Houston Inventory</span>
    <button class="icon-btn"><span class="msi">sync</span></button>
    <button class="icon-btn"><span class="msi">more_vert</span></button>
  </div>
  <div class="content">
    <div class="stat-group">
      <div class="stat-card"><span class="stat-label">Total Stock</span><span class="stat-value">4,200</span></div>
      <div class="stat-card"><span class="stat-label">Available</span><span class="stat-value teal">2,840</span></div>
    </div>
    <div class="search-bar">
      <span class="msi sm">search</span>
      <input class="field-input" type="text" placeholder="Search products…">
    </div>
    <div class="filter-bar">
      <button class="chip active">All</button>
      <button class="chip">Low Stock</button>
      <button class="chip">Out of Stock</button>
    </div>
    <p class="section-header">Products</p>
    <div class="card">
      <div class="list-item">
        <div class="list-icon"><span class="msi">inventory_2</span></div>
        <div class="col" style="flex:1">
          <div class="row-between">
            <span class="code">151150</span>
            <span class="badge badge-error">Low Stock</span>
          </div>
          <p class="body-md" style="margin:2px 0">4'11" Vertical Post</p>
          <p class="body-sm" style="margin:0">Stock: 1,420 · Available: −45</p>
        </div>
        <button class="icon-btn"><span class="msi">chevron_right</span></button>
      </div>
    </div>
  </div>
</div>

═══════════════════════════════════════════
AVONTUS DESIGN SYSTEM
═══════════════════════════════════════════
Brand palette:
  Primary Blue: #0005EE | On Primary: #FFFFFF
  Navy: #062175 | Teal: #009B86 | Light Blue: #40ABFF
  Error: #D32F2F | Warning: #F9A825 | Info: #1976D2 | Success: #009B86
  Surfaces: #FFFFFF (bg), #F0F3FF (surface2), #FAFBFF (page bg)
  Text Primary: #1C1B1F | Text Secondary: #49454F
  Border: #CAC4D0 | Font: DM Sans

Content: Use realistic Avontus Quantify data:
  - Branches: Houston Branch, Chicago Branch, New York Branch
  - Product codes: SCF-4824, BRC-3618, AF-1002-B, 151150, 156850
  - Reservation IDs: DEL-00756, RES-00892, DEL-00761
  - Companies: Johnson Construction, Apex Building Group, Skyline Scaffolding

═══════════════════════════════════════════
DESIGN EXCELLENCE REQUIREMENTS
═══════════════════════════════════════════
1. ALWAYS start with <div class="screen"><div class="app-bar">…</div><div class="content">…</div></div>
2. App bar: ALWAYS frosted glass. Navigation icon on left (arrow_back or close). Title (.app-bar-title). Action icons on right as .icon-btn buttons.
3. EVERY icon MUST be <span class="msi">icon_name</span>. NEVER write icon names as bare text. No exceptions.
4. Use REALISTIC data: real company names, product codes, dollar amounts, dates. Never "Lorem ipsum".
5. Numbers: commas for thousands (1,240). Currency: $248,400. Percentages: 78%.
6. Status badges on every data row that has state (Good/Fair/Damaged/Low Stock/Pending/etc.)
7. KPI stats: .stat-group 2-column grid. Large bold numbers (.stat-value) in brand color.
8. Utilization/capacity: .progress bars. Charts: clean inline SVG — NEVER <img> for charts.
9. Lists: .card > .list-item rows. Each row: icon in .list-icon, .col content, .icon-btn chevron.
10. Forms: always use .field wrapper with .field-label + .field-input for inputs, <select class="field-input"> for dropdowns, and <textarea class="field-input"> for multi-line. NEVER use bare unstyled inputs.
11. Toggle switches: ALWAYS use .row-between to wrap [text label/col] on the left + [label.switch > input + span.sw-track > span.sw-thumb] on the right. NEVER place a bare <label class="switch"> without a surrounding .row-between containing the label text. NEVER embed a .msi icon inside any span/p/h text node — icons ONLY go in .list-icon, .icon-btn, or standalone in a .row with gap.
12. NEVER use external image URLs or placeholder image services. For ANY image content — hero illustrations, product photos, empty-state graphics, onboarding visuals, gallery items, profile covers, food photos, travel images, app screenshots, team photos, logos, icons that need to be images — ALWAYS use this AI image generation pattern:
    <img data-generate-image="detailed description of the image needed, style, colors, mood — be specific and vivid" alt="description" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;background:linear-gradient(135deg,#E8E9FD 25%,#C5CAFF 100%)">
    The app will auto-generate these with AI when the user clicks them. Write rich, detailed prompts in data-generate-image describing exactly what the image should show. Adjust aspect-ratio to match context (1/1 for avatars/profile pics, 16/9 for heroes/banners, 4/3 for cards/thumbnails, 3/4 for portraits).
    PREFER data-generate-image over CSS gradient placeholders whenever the design would benefit from a real image. Use gradients ONLY for abstract decorative backgrounds, not for content images.
13. Bottom actions: .bottom-actions with flex row of buttons.
14. Add custom CSS freely for visual polish — gradients, shadows, any enhancement not in base classes.

═══════════════════════════════════════════
MODAL EDIT FORM WITH VALIDATION — MANDATORY PATTERN
═══════════════════════════════════════════
When the user asks for an edit screen, create screen, modal form, or any form with validation:

YOUR ONLY JOB is to output the toolbar + fields. The app runtime handles the validation popup automatically.
Do NOT generate any validation summary, popup, banner, card, info-bar, or list of issues. The app builds it from field states.

EXACT TEMPLATE — copy this structure:

<div class="screen">
  <div class="app-bar">
    <button class="icon-btn"><span class="msi">close</span></button>
    <span class="app-bar-title">Edit Reservation</span>
    <button class="icon-btn" style="color:#D32F2F"><span class="msi">error</span></button>
    <button class="icon-btn"><span class="msi">check</span></button>
  </div>
  <div class="content">
    <p class="section-header">Reservation details</p>

    <div class="field field-error">
      <label class="field-label">Date *</label>
      <input class="field-input" type="text" placeholder="Select date">
      <span class="field-validation-icon" style="color:#D32F2F"><span class="msi sm">error</span></span>
    </div>
    <span class="field-helper field-helper-error">Date is required</span>

    <div class="field">
      <label class="field-label">Customer name</label>
      <input class="field-input" type="text" value="Acme Corp">
    </div>

    <div class="field field-warning">
      <label class="field-label">Notes</label>
      <textarea class="field-input" rows="3">Long text here…</textarea>
      <span class="field-validation-icon" style="color:#F9A825"><span class="msi sm">warning</span></span>
    </div>
    <span class="field-helper field-helper-warning">Notes exceed 500 characters</span>
  </div>
</div>

RULES — ZERO EXCEPTIONS:
- Toolbar: close | title | severity-icon (colored) | check. Nothing else.
- Severity icon color: #D32F2F if ANY errors, #F9A825 if only warnings, #1976D2 if only info
- Each validated field: add .field-error / .field-warning / .field-info class to the .field div
- Inside .field: ONLY .field-label + .field-input + .field-validation-icon. NOTHING else inside .field.
- Validation text: <span class="field-helper field-helper-error"> AFTER the .field as a SIBLING, never inside
- DO NOT generate: validation summary, validation popup, validation card, validation list, info-bar, banner, alert, or ANY element listing multiple issues. The app runtime creates the popup automatically from your field classes.
- DO NOT generate .bottom-actions on modal edit forms. The toolbar check icon IS the save button.
- DO NOT put character counts, helper spans, or extra text INSIDE the .field div.
═══════════════════════════════════════════

BUTTON RULES (MANDATORY — always follow):
B1. Style hierarchy: btn-filled = primary (ONE per screen/bar, confirm/save/accept). btn-outlined = secondary (cancel/reject). btn-tonal = alternative primary. btn-text = tertiary/minor.
B2. Button text MUST fit on ONE LINE — no wrapping allowed. Max ~20 chars full-width, ~15 chars side-by-side. Shorten: "Accept" not "Accept with Discrepancy". "Reject" not "Reject Return". Short > long always.
B3. Bottom action bars: ALWAYS use .bottom-actions. Left = btn-outlined style="flex:1". Right = btn-filled style="flex:1". Both equal height. NO icons inside bottom action buttons.
B4. No unsolicited icons in buttons. NEVER add a cancel/no-entry icon to Reject. NEVER add a checkmark to Accept. Icons inside buttons only when explicitly designed.
B5. Two buttons side-by-side (outside bottom-actions): wrap in .row with gap, both style="flex:1" or natural width. Never stack 2 action buttons vertically.

BUTTON STYLING — DO NOT OVERRIDE (pre-loaded CSS handles all button styling):
B6. NEVER add custom CSS for button width, height, padding, border-radius, font-size, or background on .btn-filled / .btn-outlined / .btn-tonal / .btn-text. The pre-loaded classes already define: height:40px, padding:0 24px, border-radius:9999px (pill), font-size:14px, font-weight:600. Overriding these creates broken, cut-off, or misshapen buttons.
B7. The ONLY inline styles allowed on buttons are: flex:1 (for equal-width pairs), margin/gap adjustments, and width:100% (for full-width CTA). NEVER set: max-width, overflow:hidden, text-overflow, white-space:nowrap, font-size, padding, height, border-radius, or background on individual buttons.
B8. Button labels: use clear, specific action verbs from the Avontus domain. Examples: "Save Reservation", "Ship Items", "Add Equipment", "Cancel", "Export Report", "Mark Complete", "Delete Equipment". NOT "Click Here", "Submit", "OK", "Go", "Process".

TOGGLE RULES (MANDATORY):
T1. Every toggle MUST use .row-between: [text on left] + [label.switch on right]. No exceptions.
    Simple: <div class="row-between"><span class="title-md">Label</span><label class="switch"><input type="checkbox"><span class="sw-track"><span class="sw-thumb"></span></span></label></div>
    With subtitle: <div class="row-between"><div class="col" style="gap:2px"><span class="title-md">Label</span><span class="body-sm" style="color:#49454F">Description</span></div><label class="switch"><input type="checkbox"><span class="sw-track"><span class="sw-thumb"></span></span></label></div>
T2. NEVER place a bare <label class="switch"> without a .row-between parent. NEVER use a toggle without label text on the left.
T3. Toggle already on: add checked attribute to <input type="checkbox">.

ICON RULES (MANDATORY):
I1. Icons ONLY go in these containers — nowhere else:
    • .icon-btn buttons (app-bar actions, FABs, trailing actions)
    • .list-icon inside .list-item rows
    • Standalone inside a .row with gap (icon + text label combos)
    • .chip-icon inside chips
I2. NEVER put <span class="msi"> inside a <p>, <h1>-<h6>, <li>, <label>, <a>, <button> text, <td>, <th>, <span> that contains a sentence, or any element whose primary purpose is readable text. Icons inside text WILL break the sentence.
I3. These common English words are Material Symbol icon names — NEVER wrap them in .msi when they appear as normal words: cancel, close, delete, block, check, add, remove, edit, search, phone, lock, star, home, menu, help, info, warning, error, settings, send, share, copy, save, back, forward, done, clear, refresh, view, image, place, event, date, book, work, cloud, time, list, table, flag.
I4. WRONG: <p>Can I <span class="msi">cancel</span> anytime?</p>  RIGHT: <p>Can I cancel anytime?</p>
    WRONG: <span class="msi">settings</span> Settings  RIGHT: <div class="row" style="gap:8px"><span class="msi">settings</span><span>Settings</span></div>
I5. ICON SIZING — always use the .msi class as-is (24px default). Use .msi.sm (18px) for compact contexts. Use .msi.lg (32px) ONLY for hero/empty-state illustrations. NEVER set font-size on icons inline — use the size classes.
I6. ICON + TEXT ALIGNMENT — always place icon and text in a .row with gap:8px. Icon comes FIRST (leading), text SECOND. Vertically they auto-align via the row's align-items:center.
    Pattern: <div class="row" style="gap:8px"><span class="msi">icon_name</span><span>Label text</span></div>
I7. ICON IN LIST ROWS — always use .list-item pattern: .list-icon (contains one .msi) + .col flex:1 (text) + optional trailing .icon-btn. Never put the icon loose next to text without the .list-icon wrapper.
I8. APP-BAR ICONS — use .icon-btn inside the app-bar. Left: navigation (arrow_back or menu). Right: action icons. Never mix icon buttons with text labels in the same row without proper .row gap spacing.
I9. ICON CHOICE — pick the most specific Material Symbol name. Prefer: arrow_back (not back), more_vert (not menu for overflow), check_circle (not check for success states), chevron_right (not arrow_forward for list navigation).

COLOR & CONTRAST RULES (MANDATORY — WCAG AA):
C1. NEVER place dark text on dark backgrounds. NEVER place light text on light backgrounds. Always check: dark bg (#062175, #1C1B1F, #333, etc.) → use white/light text. Light bg (#fff, #F5F5F5, #E8E9FD, etc.) → use dark text.
C2. Body text minimum contrast ratio: 4.5:1 against its background. Large text (18px+): 3:1 minimum.
C3. FORBIDDEN combinations: black/dark text on navy (#062175), dark text on any gradient with dark stops, white text on light gray, #49454F text on #E8E9FD backgrounds.
C4. Hero/banner sections with dark blue or gradient backgrounds: always use color:#fff or color:#E8E9FD for ALL text inside — never assume the AI default text color.
C5. When unsure, default to: dark backgrounds → color:#fff. Light backgrounds → color:#1C1B1F.

ACCESSIBILITY RULES (MANDATORY — WCAG 2.2 AA):
A1. All interactive elements (buttons, links, inputs) MUST have min 44×44px touch target. Use existing button classes which already handle this.
A2. Every <input>, <select>, <textarea> MUST have an associated <label> (use .field wrapper with .field-label).
A3. Use semantic HTML: <button> for actions (not <div>), <nav> for navigation, <main> for content, <header>/<footer> for landmarks.
A4. Status indicators MUST use color + icon + text — never color alone. A red badge saying "Error" with an icon is correct; a red dot alone is not.
A5. Focus states: all interactive elements get visible focus rings via :focus-visible. The pre-loaded CSS handles this for .btn-* and .field classes.
A6. Images/illustrations: always use aria-label or role="img" with alt text. Decorative elements: aria-hidden="true".
A7. Reading order: DOM order must match visual order. Don't use CSS to reorder content in a way that breaks screen reader flow.
`

const MODEL = 'google/gemini-3.1-pro-preview'
const ALLOWED_MODELS = new Set([
  'google/gemini-3.1-pro-preview',
  'google/gemini-3.1-flash-lite-preview',
  'anthropic/claude-opus-4.6',
  'openai/gpt-5.4',
])

// ─── OpenRouter (single provider for all models) ────────────────────────────

// Client's API key comes from request body; server key is fallback for enhance
function getOpenRouterKey(requestKey) {
  return requestKey || process.env.OPENROUTER_API_KEY || ''
}

function getProviderConfig(model, requestKey) {
  return {
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    apiKey: getOpenRouterKey(requestKey),
    timeout: model.includes('flash') ? 120_000 : 200_000,
    provider: 'openrouter',
  }
}

// Reasoning models need special handling: GPT-5.x uses developer role, Gemini 3.1 needs reasoning param
function buildRequestBody(model, messages, maxTokens) {
  const isGpt5 = model.includes('gpt-5')
  const isGemini31 = model.includes('gemini-3.1')
  const needsReasoning = isGpt5 || isGemini31
  // GPT-5.x needs developer role instead of system
  const msgs = isGpt5
    ? messages.map(m => m.role === 'system' ? { ...m, role: 'developer' } : m)
    : messages
  const body = { model, messages: msgs, max_tokens: maxTokens }
  if (needsReasoning) {
    body.reasoning = { effort: 'medium' }
  }
  return body
}

async function llmCompletion(model, messages, maxTokens, requestKey) {
  const config = getProviderConfig(model, requestKey)
  if (!config.apiKey) throw new Error('OpenRouter API key is required. Please enter your key in the app.')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), config.timeout)
  let resp
  try {
    resp = await fetch(config.baseUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildRequestBody(model, messages, maxTokens)),
    })
  } catch (err) {
    clearTimeout(timer)
    if (err?.name === 'AbortError') throw new Error(`Request to ${model} timed out — please try again.`)
    throw err
  }
  clearTimeout(timer)
  if (!resp.ok) {
    const errText = await resp.text()
    throw new Error(`AI generation failed (${resp.status} ${model}): ${errText.slice(0, 300)}`)
  }
  return resp
}

function extractTextFromContent(content) {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    const textBlock = content.find(b => b.type === 'text')
    return textBlock?.text || ''
  }
  return ''
}

// Gemini can occasionally return empty — allow up to 2 retries. Opus is reliable — 1 attempt.
async function llmWithRetry(model, messages, maxTokens, retries, requestKey) {
  const maxAttempts = retries ?? (model.includes('claude') ? 1 : 2)
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await llmCompletion(model, messages, maxTokens, requestKey)
    const data = await response.json()
    const text = extractTextFromContent(data.choices?.[0]?.message?.content)
    if (text) return { text, modelUsed: model }
    console.warn(`Attempt ${attempt + 1}: empty content from ${model}, retrying...`)
  }
  return { text: '', modelUsed: model }
}

function sanitizeWebDesign(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const html = String(value.html || '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<iframe[^>]*\/?\s*>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*\/?\s*>/gi, '')
    // Allow <form> tags — harmless in sandboxed iframe, needed for form screens
    .replace(/<base[^>]*\/?\s*>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/<\/?(html|head|body|meta|title|link|style)[^>]*>/gi, '')
    .trim()
  const css = String(value.css || '')
    .replace(/<style[^>]*>/gi, '')
    .replace(/<\/style>/gi, '')
    .replace(/@import\s+url\([^)]*\);?/gi, '')
    .trim()

  if (!html) return null
  return {
    title: String(value.title || 'Generated screen').slice(0, 80),
    html,
    css,
  }
}

async function generateWebDesign(model, prompt, designTokens, designBrief, currentTree, imageUrl = null, qualitySections = '', qualityChecklist = '', requestKey = '') {
  // System prompt: WEB_SYSTEM_PROMPT is the sole system prompt (output format + HTML class reference)
  // Quality toggle sections inject before DESIGN EXCELLENCE REQUIREMENTS
  const systemPrompt = qualitySections
    ? WEB_SYSTEM_PROMPT.replace(
        '\n═══════════════════════════════════════════\nDESIGN EXCELLENCE REQUIREMENTS',
        qualitySections + '\n═══════════════════════════════════════════\nDESIGN EXCELLENCE REQUIREMENTS'
      )
    : WEB_SYSTEM_PROMPT

  const layerOpts = {
    prompt,
    designBrief,
    qualityChecklist,
    brandGuide: AVONTUS_BRAND_GUIDE,
    screenArchetypes: SCREEN_ARCHETYPES,
    goldExamples: GOLD_EXAMPLES,
  }

  let userContent
  if (imageUrl) {
    const textPart = assembleWebLayers({
      ...layerOpts,
      currentTree: null,
      taskPrefix: 'You are looking at a wireframe or low-fidelity sketch. Use it ONLY to understand the screen structure and content — do NOT copy its visual style. Translate it into a production-quality Avontus design using the design system rules above. Apply the full brand: frosted glass app bar, DM Sans font, Avontus blue (#0005EE), elevated cards, proper spacing.',
    })
    userContent = [
      { type: 'text', text: textPart },
      { type: 'image_url', image_url: { url: imageUrl } },
    ]
  } else {
    userContent = assembleWebLayers({ ...layerOpts, currentTree })
  }

  let text = ''
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await llmCompletion(model, [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ], 12000, requestKey)
    const data = await response.json()
    text = extractTextFromContent(data.choices?.[0]?.message?.content)
    if (text) break
    console.warn(`Web design attempt ${attempt + 1}: empty response, retrying...`)
  }

  if (!text) return null
  return sanitizeWebDesign(extractJsonObject(text))
}

function normalizeTextList(value, maxItems = 80, maxLen = 140) {
  if (!Array.isArray(value)) return []
  const seen = new Set()
  const out = []
  for (const item of value) {
    if (typeof item !== 'string') continue
    const trimmed = item.trim()
    if (!trimmed) continue
    const normalized = trimmed.slice(0, maxLen)
    const key = normalized.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(normalized)
    if (out.length >= maxItems) break
  }
  return out
}

function normalizeWireframeAnalysis(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const summary = typeof value.summary === 'string' ? value.summary.trim().slice(0, 1200) : ''
  const screenType = typeof value.screenType === 'string' ? value.screenType.trim().slice(0, 140) : ''

  return {
    summary,
    screenType,
    visibleTexts: normalizeTextList(value.visibleTexts, 100, 120),
    keyActions: normalizeTextList(value.keyActions, 24, 80),
    sections: normalizeTextList(value.sections, 40, 120),
  }
}

function collectTreeTextValues(node, values = []) {
  if (!node || typeof node !== 'object') return values
  if (node.properties && typeof node.properties === 'object' && !Array.isArray(node.properties)) {
    for (const value of Object.values(node.properties)) {
      if (typeof value === 'string') values.push(value.toLowerCase())
    }
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) collectTreeTextValues(child, values)
  }
  return values
}

function countEvidenceMatches(tree, evidenceTexts) {
  if (!tree || !Array.isArray(evidenceTexts) || evidenceTexts.length === 0) return 0
  const flattened = collectTreeTextValues(tree).join('\n')
  let matches = 0
  for (const raw of evidenceTexts) {
    const token = String(raw || '').trim().toLowerCase()
    if (token.length < 3) continue
    if (flattened.includes(token)) matches += 1
  }
  return matches
}

function buildWireframeAnalysisMessage(prompt, designTokens, designBrief) {
  return `You are a wireframe analyst.

Return ONLY JSON in this exact shape:
{
  "screenType": "short description",
  "summary": "what the screen does",
  "visibleTexts": ["exact text seen in image"],
  "keyActions": ["button/action labels seen in image"],
  "sections": ["major visual sections in top-to-bottom order"]
}

Rules:
1. Read the image carefully and extract text exactly as visible (case-sensitive when possible).
2. Keep visibleTexts focused on labels, headers, button captions, and field hints.
3. Do not invent content that is not visible.
4. If text is unreadable, skip it.

Design tokens:
${JSON.stringify(designTokens)}

Business design brief:
${JSON.stringify(designBrief || {}, null, 2)}

${prompt ? `User context: ${prompt}` : 'No extra user context.'}`
}

async function analyzeWireframe(model, imageUrl, prompt, designTokens, designBrief, requestKey) {
  const userContent = [
    { type: 'text', text: buildWireframeAnalysisMessage(prompt, designTokens, designBrief) },
    { type: 'image_url', image_url: { url: imageUrl } },
  ]

  const response = await llmCompletion(model, [
    { role: 'system', content: 'You analyze wireframes and return strict JSON only.' },
    { role: 'user', content: userContent },
  ], 16384, requestKey)

  const data = await response.json()
  const text = extractTextFromContent(data.choices?.[0]?.message?.content)
  if (!text) return { analysis: null, modelUsed: model }

  const parsed = extractJsonObject(text)
  return { analysis: normalizeWireframeAnalysis(parsed), modelUsed: model }
}

function generateMockWebDesign(prompt, designBrief) {
  const title = (prompt || 'New shortage reservation').slice(0, 48)
  const product = designBrief?.productName || 'Quantify'
  const company = designBrief?.companyName || 'Avontus'

  return {
    title,
    html: `
<main class="screen">
  <header class="topbar">
    <button class="icon-btn">✕</button>
    <h1>${title}</h1>
    <button class="text-btn">Create</button>
  </header>
  <section class="hero">
    <p class="label">Created from original reservation</p>
    <p class="code">RES-882914</p>
  </section>
  <section class="section">
    <h2>Shortage items</h2>
    <article class="card">
      <p class="sku">SF-H-LEDGE-200</p>
      <p class="name">2.0m Horizontal Ledger</p>
      <p class="meta">Reserved: 150 | Shipped: 120</p>
      <div class="stepper-row">
        <button class="stepper-btn">−</button>
        <input class="qty" value="30" />
        <button class="stepper-btn">+</button>
      </div>
    </article>
    <article class="card">
      <p class="sku">SF-V-STAND-300</p>
      <p class="name">3.0m Vertical Standard</p>
      <p class="meta">Reserved: 80 | Shipped: 75</p>
      <div class="stepper-row">
        <button class="stepper-btn">−</button>
        <input class="qty" value="5" />
        <button class="stepper-btn">+</button>
      </div>
    </article>
  </section>
  <section class="section">
    <label>Branch office</label>
    <div class="field">Houston Main Yard</div>
    <label>Planned ship date</label>
    <div class="field">2025-05-24</div>
  </section>
  <footer class="foot">${company} ${product}</footer>
</main>
    `.trim(),
    css: `
.screen{
  min-height:100%;
  background:linear-gradient(180deg,#f2f6ff 0%,#eef2fb 100%);
  color:#14171f;
  padding:20px 16px 24px;
  font-family:"DM Sans","Segoe UI",Roboto,system-ui,sans-serif;
}
.topbar{
  height:64px;
  border-radius:22px;
  background:linear-gradient(140deg,#dbe7ff 0%,#f4f8ff 100%);
  border:1px solid #c7d6f2;
  padding:0 12px;
  display:flex;
  align-items:center;
  gap:10px;
  box-shadow:0 6px 20px rgba(6,33,117,.08);
}
.topbar h1{margin:0;flex:1;font-size:24px;line-height:1.1;font-weight:700;}
.icon-btn,.text-btn{border:0;background:transparent;color:#0005EE;font-weight:700}
.hero,.card,.field{
  background:#fff;
  border:1px solid #d8dfef;
  border-radius:18px;
  box-shadow:0 4px 16px rgba(15,31,74,.08);
}
.hero{margin-top:14px;padding:14px 14px 10px}
.label{margin:0;font-size:11px;text-transform:uppercase;color:#4e5870;font-weight:700;letter-spacing:.4px}
.code{margin:6px 0 0;font-size:34px;line-height:1.05;font-weight:800;letter-spacing:-.5px}
.section{margin-top:16px}
.section h2{margin:0 0 10px;font-size:14px;color:#0b4db5;text-transform:uppercase;letter-spacing:.4px}
.card{padding:12px 12px 14px;margin-bottom:10px}
.sku{margin:0;color:#1d4fd8;font-size:12px;font-weight:800}
.name{margin:4px 0 0;font-size:18px;line-height:1.2;font-weight:700}
.meta{margin:6px 0 0;font-size:12px;color:#5f6679}
.stepper-row{display:flex;align-items:center;gap:10px;margin-top:10px}
.stepper-btn{
  width:40px;height:40px;border-radius:999px;border:1px solid #b9c5e2;
  background:#f7f9ff;color:#0037cc;font-size:24px;line-height:0;padding-bottom:2px
}
.qty{
  flex:1;height:44px;border-radius:12px;border:1px solid #becae6;background:#f9fbff;
  font-size:20px;text-align:center;font-weight:800;color:#1a1f2d
}
label{display:block;margin:10px 4px 6px;font-size:12px;font-weight:700;color:#596174}
.field{padding:12px 14px;font-size:16px;font-weight:600}
.foot{margin-top:14px;text-align:center;color:#6f7588;font-size:12px}
    `.trim(),
  }
}

// ── Quality Toggle Prompt Sections ──────────────────────────────

function buildQualityChecklist(toggles, designTokens) {
  if (!toggles || typeof toggles !== 'object') return ''
  const t = designTokens || {}
  const items = []

  // Foundation
  if (toggles.avontusBrand) {
    items.push('• Avontus Brand: Use Avontus Blue #0005EE for primary actions. DM Sans typography. 107° motif on hero screens. Navy #062175 for deep contrast. Teal #009B86 for success. Yellow #FFD91A NEVER as background/text. Brand-blue-tinted shadows. Confident, forward-looking copy voice.')
  }
  if (toggles.tokenMap || toggles.noGenericFallback) {
    items.push(`• Token Enforcement: action=${t.primaryColor || '#6750A4'}, heading=${t.colors?.onSurface || '#1C1B1F'}, caption=${t.colors?.onSurfaceVariant || '#49454F'}, page bg=${t.backgroundColor || '#FFFFFF'}. Use role assignments, never raw hex guesses. No blue/Material defaults. If tokens missing → neutral white/gray.`)
  }
  if (toggles.componentRegistry) {
    items.push('• Components: Map every UI need to the correct typed component. Need button → Button with Style. Need input → TextBox with Header. Never raw unstyled primitives.')
  }
  // Design System
  if (toggles.dnaAnalysis || toggles.dnaGeneration) {
    items.push('• Design DNA: Before generating, analyze the design tokens — typography scale, color ratios, spacing density, card treatment, icon style. Then match detected patterns exactly throughout.')
  }
  if (toggles.designSystemPatterns || toggles.designSystemArchitect || toggles.artifactFix) {
    items.push('• Design System: All spacing in multiples of 4px. Interactive elements need default+hover+focus+disabled+error states. ONE Filled button per action group. Three-tier tokens. Atomic design hierarchy. STRICTLY follow pre-loaded HTML patterns for inputs, toggles, icons, list items.')
  }
  if (toggles.materialDesign3 || toggles.flutterMd3) {
    items.push('• Material Design 3: HCT dynamic color, tonal palettes, 5 button variants, MD3 type scale, 4dp grid, responsive breakpoints, state layers. Touch targets ≥48dp. No hardcoded colors. Dark mode support.')
  }
  // Visual Quality
  if (toggles.frontendDesign || toggles.creativeDesign || toggles.aestheticReview) {
    items.push('• Visual Excellence: Look crafted, not generated. Intentional depth. Micro-spacing tight within groups, generous between. NO Inter/Roboto/Arial. No flat solid backgrounds. 1+ unexpected visual choice. 3+ distinctive choices per screen.')
  }
  if (toggles.typography) {
    items.push('• Typography: Max 3–4 font sizes per screen. Body line-height 1.5–1.7. Headings 1.1–1.3. One weight contrast (semibold heading vs regular body). Labels/captions must visually recede.')
  }
  if (toggles.uiuxDesignAudit || toggles.uiDesignPrinciples || toggles.uxDesignExpert) {
    items.push('• Design Standards: 60-30-10 color rule. F/Z-pattern layout. ONE primary CTA per viewport. MD3 8 states + WCAG AA + Nielsen heuristics. Unique color pairs. Material honesty. Natural animation physics.')
  }
  // User Experience
  if (toggles.uxPsychology) {
    items.push('• UX Psychology: Max 4–5 choices per screen. 44px min touch targets. ONE primary CTA. Pre-fill progress. Always visible exits — never trap users.')
  }
  if (toggles.gestalt) {
    items.push('• Gestalt: Space between groups = 2–3× space within groups. ONE dominant focal point (primary CTA must pop). Same function = same visual treatment.')
  }
  if (toggles.interaction) {
    items.push('• Interaction: Design for worst-case input. Give users edit/undo/cancel controls. High-stakes actions need checkpoints. Always a visible stop/cancel.')
  }
  // Content & Data
  if (toggles.microcopy) {
    items.push('• Microcopy: Buttons = [Verb]+[Object] ("Save Order" not "Submit"). Empty states explain WHY + WHAT + CTA. Errors = [What happened]+[How to fix], never blame. Loading = describe action.')
  }
  if (toggles.accessibility) {
    items.push('• Accessibility: 4.5:1 contrast for text. Dark backgrounds = white text ONLY. 44px touch targets. Visible focus rings. Labels on all inputs. Color + icon + text for status.')
  }
  if (toggles.dataHeavyDesign) {
    items.push('• Data-Heavy Design: 5-metric rule for dashboards. KPI cards with delta+sparkline+context. Tables: right-align numbers, sticky headers, 3 density tiers. Real-time count animations. Progressive disclosure.')
  }

  if (items.length === 0) return ''
  return `\n\nActive quality requirements — apply ALL of these:\n${items.join('\n')}`
}

function buildQualitySections(toggles, designTokens) {
  if (!toggles || typeof toggles !== 'object') return ''

  const sections = []

  // ═══════════════════════════════════════════════════════════
  // FOUNDATION
  // ═══════════════════════════════════════════════════════════

  if (toggles.avontusBrand) {
    sections.push(`## Quality: Avontus Brand Identity Guidelines

Apply the official Avontus brand identity to every generated screen.

### Brand Promise & Voice
- **Tagline**: "Reach New Heights"
- **Brand Tone**: Confident, Forward-Looking, Grounded, Optimistic, Energetic, Conversational
- **UI Copy**: Direct and action-oriented. "Sign in" not "Please sign in". Verbs over nouns.
- **Terminology**: "Scaffold" = entire structure. "Scaffolding" = individual pieces/components.
- **Label case**: First character capitalized only ("Remote server" not "Remote Server")

### Primary Color — Avontus Blue
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | #0005EE | Primary CTA, key actions, selected states, active nav, links |
| Primary tint | #678DF4 | Hover states, light accents, info badges |
| Primary shade | #0004B3 | Pressed states, active elements |
| Primary dark | #000377 | High-contrast text on light surfaces |

### Blue Scale (50–900)
#E8E9FD (50) → #C5C7FA (100) → #9EA1F7 (200) → #678DF4 (300) → #3344F1 (400) → #0005EE (500) → #0004D6 (600) → #0004B3 (700) → #000390 (800) → #000377 (900)

### Secondary Palette
| Name | Hex | Usage |
|------|-----|-------|
| Navy Blue | #062175 | Deep backgrounds, dark headers, contrast surfaces |
| Light Blue | #40ABFF | Info states, links, secondary actions |
| Teal | #009B86 | Success states, confirmations |
| Green | #6BE09E | Success badges, completed status |
| Yellow | #FFD91A | UTILITARIAN ONLY — NEVER as background, body text, or buttons |

### Surface & Text Colors
Background=#FFFFFF, Surface=#FAFBFF, Surface2=#F0F3FF, Surface3=#E3E8F9, Text primary=#1C1B1F, Text secondary=#49454F, Outline=#79747E, Border=#E0E0E0, Link=#0005EE (underlined)

### Typography — DM Sans
Fallback: "DM Sans", "Helvetica Neue", Helvetica, Arial, sans-serif.
- Light (300): Display text. Regular (400): Body. Medium (500): Subtitles. Bold (700): Headlines, CTAs.

### The 107° Graphic Motif
Distinctive 107-degree slanted angle from logo. Use on hero/splash screens as decorative dividers and background accent shapes.

### Elevation (Brand-Blue-Tinted)
Level 1: 0 1px 3px rgba(0,5,238,0.06), 0 1px 2px rgba(0,0,0,0.04)
Level 2: 0 4px 12px rgba(0,5,238,0.08), 0 2px 4px rgba(0,0,0,0.04)
Level 3: 0 8px 24px rgba(0,5,238,0.10), 0 4px 8px rgba(0,0,0,0.05)

### Button Hierarchy
Filled: bg=#0005EE, text=#FFF (PRIMARY). Outlined: border=#0005EE (SECONDARY). Tonal: bg=#0005EE@12% (ALT). Text: transparent (TERTIARY).

### Shape & Spacing
Shapes: None=0, XS=2px, S=4px, M=8px, L=12px, XL=16px, Full=9999px
Spacing: 4→8→12→16→20→24→32→40→48→64→80px

CRITICAL: Every screen must feel unmistakably Avontus — branded with Blue #0005EE, professional, and polished.`)
  }

  if ((toggles.tokenMap || toggles.noGenericFallback) && designTokens) {
    const t = designTokens
    const p = t.primaryColor || '#6750A4'
    const bg = t.backgroundColor || '#FFFFFF'
    const surface = t.surfaceColor || bg
    const err = t.errorColor || '#B3261E'
    const onSurface = t.colors?.onSurface || '#1C1B1F'
    const onSurfaceVariant = t.colors?.onSurfaceVariant || '#49454F'
    const outline = t.colors?.outline || '#79747E'
    const outlineVariant = t.colors?.outlineVariant || '#CAC4D0'
    const onPrimary = t.colors?.onPrimary || '#FFFFFF'
    const primaryContainer = t.colors?.primaryContainer || '#E8DEFF'
    const errorContainer = t.colors?.errorContainer || '#FFDAD6'
    const surfaceVariant = t.colors?.surfaceVariant || '#E7E0EC'
    const surfaceContainer = t.colors?.surfaceContainer || '#F3EDF7'

    sections.push(`## Quality: Token Enforcement — Color Role Map & Anti-Generic Fallback

### Color Role Assignments — Use These EXACT Values

#### TEXT colors:
- heading        → ${onSurface} — page titles, section headers
- body           → ${onSurface} — paragraph text, descriptions
- caption        → ${onSurfaceVariant} — secondary text, timestamps, helper text
- action         → ${p} — links, interactive text
- disabled       → ${outline} — disabled labels, placeholder text
- on-color       → ${onPrimary} — text ON colored backgrounds (buttons, badges)
- error          → ${err} — error messages

#### SURFACE/BACKGROUND colors:
- page           → ${bg} — page/app background
- default        → ${surface} — cards, panels, content containers
- elevated       → ${surfaceContainer} — modals, popovers, floating elements
- action         → ${p} — primary buttons, active tabs, selected items
- disabled       → ${surfaceVariant} — disabled buttons, disabled inputs
- error          → ${errorContainer} — error alert backgrounds

#### BORDER colors:
- default        → ${outlineVariant} — cards, panels, dividers
- subtle         → ${surfaceVariant} — subtle separators
- action         → ${p} — focused inputs, active indicator
- focus-ring     → ${primaryContainer} — focus outline
- error          → ${err} — error state borders

### Anti-Generic Fallback — CRITICAL

Do NOT silently fall back to generic design patterns.

If the design tokens and brief specify brand colors, typography, and patterns:
- USE THEM EXACTLY. Do not default to Material purple, generic blue, or stock gray.
- Every color in the output must trace back to a token from the provided design system.
- Every font must match the provided fontFamily.
- Every border-radius must match the provided shape scale.

If the design tokens are missing or incomplete:
- Do NOT invent a random color scheme.
- Use the EXACT tokens provided, even if minimal.
- Fill gaps with neutral/safe values (white background, dark text, standard spacing) — NOT with Material Design defaults.
- Make it obvious that design tokens need to be configured rather than masking the gap with pretty defaults.

CRITICAL: Use these exact colors for the correct roles. Do NOT invent colors.`)
  }

  if (toggles.componentRegistry) {
    sections.push(`## Quality: Component Registry — Mandatory Usage Patterns

Before writing output, map every UI need to the correct component:

### Component Usage Checklist:
| UI Need | Use This | NEVER Use |
|---------|----------|-----------|
| Button | Button with Style="Filled"/"Outlined"/"Text"/"Elevated"/"Tonal" | Raw unstyled button |
| Text input | TextBox with Header property | Unlabeled input field |
| Password | PasswordBox with Header | Plain text input |
| Card | Card with Style="Elevated"/"Filled"/"Outlined" | Plain div/Border |
| Toggle | ToggleSwitch with Header | Checkbox for on/off |
| Dropdown | Select with Header | Custom clickable text |
| Date | DatePicker with Header | Text field for dates |
| Search | AutoSuggestBox with Header | Plain TextBox |
| App bar | NavigationBar with Content + MainCommand | Custom header layout |
| Bottom nav | BottomNavigationBar with NavigationViewItem children | Button row |
| Status | Badge with Style="Error"/"Info"/"Success"/"Warning" | Colored TextBlock |
| Alert | InfoBar with Style="Info"/"Success"/"Warning"/"Error" | Custom colored card |

### Mandatory props — every component MUST include:
- TextBlock: Style (typography scale) + Foreground (text color)
- Button: Content + Style
- Card: Style + Padding
- StackPanel: Spacing + Padding + Orientation
- Icon: Glyph + FontSize
- Every form field: Header (label)

NEVER output a bare/unstyled component. Every node must have its required styling props.`)
  }

  // ═══════════════════════════════════════════════════════════
  // DESIGN SYSTEM
  // ═══════════════════════════════════════════════════════════

  if (toggles.dnaAnalysis || toggles.dnaGeneration) {
    sections.push(`## Quality: Design DNA — Analysis & Generation

### Phase 1: Analyze Before Generating

Before writing ANY code or JSON, perform a fast design-system analysis from the provided tokens and brief.

Analyze in priority order:
1. **Typography scale**: heading/body/caption sizes, weight usage, line-height density, hierarchy rhythm
2. **Color system**: primary vs secondary vs neutral vs semantic, background/surface layers, text color hierarchy, usage ratio
3. **Buttons + actions**: primary/secondary/tertiary hierarchy, fill vs outline vs ghost patterns, radius and shadow usage
4. **Icons**: stroke vs fill, size rhythm (16/20/24), rounded vs sharp
5. **Layout & spacing**: spacing scale, gutters, section gaps, card padding, separators vs whitespace
6. **Containers / cards**: outlined vs shadowed vs flat, border thickness, rounding consistency
7. **Shell patterns**: navbar/sidebar structure, page header composition, icon+label pairing, panel widths

Use this analysis to form an internal "design DNA" model. Use that DNA to choose components, spacing, density, and shell structure. If uncertain, prefer consistency with detected patterns over novelty.

### Phase 2: Apply DNA to Every Output

- Prioritize **typography scale correctness** before decorative styling
- Use colors by role and ratio — do NOT overuse primary/accent colors
- Preserve established shell/navigation patterns when the prompt implies an existing app
- Reuse the spacing rhythm and density consistently across all sections
- Match card/container treatment exactly (outline vs shadow vs flat, border thickness, radius)
- Match icon language and icon+text alignment patterns
- When building something new, compose from existing design patterns so it feels native

### Failure Modes to AVOID:
- Generic SaaS layout that ignores the user's spacing rhythm
- Correct components but wrong density/spacing
- Correct colors but wrong color proportion (too much primary, not enough neutral)
- Correct text but wrong typography hierarchy
- Correct cards but wrong border/shadow/radius treatment`)
  }

  if (toggles.designSystemPatterns || toggles.designSystemArchitect || toggles.artifactFix) {
    sections.push(`## Quality: Design System — Patterns, Architecture & Structure

### Atomic Design — Use the Right Abstraction Level:
- **Atom**: Single-purpose, context-free (button, input, icon, badge). NO business logic. NO layout assumptions.
- **Molecule**: Functional unit of atoms (search field = input + icon + button). Single responsibility. Encapsulated state.
- **Organism**: Complex component (nav bar, data table, card). May have business logic. Composed from molecules + atoms.
- Never make an atom that does too many things. Never make a molecule that renders a full section.

### Three-Tier Token Architecture:
- **Tier 1 — Primitives**: Raw values named by their value (color-blue-500, spacing-4, radius-md)
- **Tier 2 — Semantic**: Purpose-driven aliases (color-action-primary → color-blue-500, color-text-body → color-gray-900)
- **Tier 3 — Component**: Component-scoped tokens (button-bg → color-action-primary, card-padding → spacing-component-md)
- CRITICAL: Components reference ONLY their own component tokens or semantic tokens — NEVER primitive tokens directly
- Detect: repeated styles → extract token. Similar components → variant system. Magic numbers → tokens.

### 8-Point Spacing System (only use multiples of 4px):
- 4px — micro gaps, icon padding
- 8px — tight spacing, related elements
- 16px — standard component padding
- 24px — section inner spacing
- 32px — section gap
- 48px — major section division
- NEVER use arbitrary values: 13px, 17px, 22px — round to nearest 4px multiple

### Required Component States — ALL interactive elements must have:
- Default, Hover (8% opacity overlay), Focus (2–3px ring, 2px offset), Active/Pressed (darker + slight scale-down)
- Disabled (38–50% opacity, no pointer), Loading (spinner + no interaction), Error (red border + message), Empty (illustration + CTA)
- Missing any state is a production bug, not a design gap

### Variant-Driven API (never style-driven):
- Use: variant="filled/outlined/ghost", size="sm/md/lg", intent="primary/secondary/destructive"
- Never: color="blue", fontSize="14px", backgroundColor="#0005EE"

### Strict HTML Pattern Enforcement:
- Every input MUST be wrapped in a .field container with label
- Every toggle/switch MUST use .row-between layout
- Every icon MUST use .list-icon or .icon-btn class — NEVER inline icons inside text spans
- Button labels: max 20 characters, single line only
- List rows MUST use .list-item structure
- Output structure MUST start with .screen > .app-bar + .content
- When pre-loaded HTML component classes exist, use them — do NOT invent custom structures

APPLY: Every value traces to a token. Every component fits atomic hierarchy. Every structure follows pre-loaded patterns.`)
  }

  if (toggles.materialDesign3 || toggles.flutterMd3) {
    sections.push(`## Quality: Material Design 3 — Specification & Implementation

### Core System:
- HCT dynamic color: 5 roles (primary/secondary/tertiary/error/neutral), tonal palettes 0–100
- State layers: Hover 8%, Focus 12%, Pressed 12%
- Buttons: Filled/Tonal/Elevated/Outlined/Text. Cards: 12dp radius
- Type scale: Display 57sp, Headline 32sp, Title 22sp, Body 16sp, Label 14sp
- Layout: Compact 0–599dp, Medium 600–839dp, Expanded 840dp+. 4dp grid

### Implementation Rules:
- NEVER hardcode colors — use colorScheme roles (dynamic color on Android 12+)
- 4dp grid: ALL measurements must be multiples of 4
- Touch targets: 48×48dp minimum
- Type scale via MaterialTheme.typography
- Support both light AND dark themes
- Scaffold + TopAppBar + content + BottomBar structure. LazyColumn for lists

APPLY: Every component follows MD3. Tonal color system, not arbitrary hex. Every dp divisible by 4, every color from colorScheme, every target >= 48dp.`)
  }

  // ═══════════════════════════════════════════════════════════
  // VISUAL QUALITY
  // ═══════════════════════════════════════════════════════════

  if (toggles.frontendDesign || toggles.creativeDesign || toggles.aestheticReview) {
    sections.push(`## Quality: Visual Excellence — Crafted, Distinctive, Anti-Generic

### Design Craft — Not AI-Assembled:
- Every screen must feel CRAFTED, not generated. Avoid generic SaaS aesthetics (flat cards, boring blue defaults, uniform padding).
- Use depth intentionally: shadows must have directionality (elevation implies a light source), not copy-pasted everywhere.
- Use light: subtle surface tints, translucency, or gradient overlays to establish layering and atmosphere.
- Visual tension: contrast strong type against quiet backgrounds. Bold headlines against light body. Not everything the same weight.

### Micro-Precision:
- Spacing must be intentional: tight within component groups, generous between sections. NEVER uniform padding everywhere.
- Line-height and letter-spacing set the rhythm. Dense content: tighter line-height. Headlines: wider letter-spacing.
- Border-radius must be consistent AND intentional: interactive elements get one radius, containers get another.
- Color opacity variations (8%, 15%, 20% tints) create depth without introducing new colors.

### Typography Craft:
- Max 3 type sizes visible on one screen. More = visual noise.
- One strong weight contrast: heavy heading vs regular body. Avoid mixing 3+ font weights.
- Labels, captions, and metadata must visually recede (smaller, lighter, muted color).

### Interaction States:
- Every interactive element must communicate affordance before hover (visible border, shadow, or color).
- State changes (hover, focus, active, disabled) must be visibly distinct from each other.
- Empty states, loading states, and error states must be intentionally designed — never just blank.

### Anti-Generic Aesthetic Direction:
- Avoid purple-gradient-on-white. Use dominant color + sharp accent. Tinted shadows.
- Break the grid intentionally: asymmetry, overlapping elements, grid-breaking moments where appropriate.
- No flat solid backgrounds — consider gradient meshes, noise texture, geometric patterns.
- Staggered page load reveals. Hover states that surprise. Skeleton loading.
- Intentionality test: every visual element must be CHOSEN, not DEFAULT. Aim for 3+ distinctive choices per screen.

### Aesthetic Quality Check:
- Flag: generic fonts (Inter/Roboto/Arial when no brand font specified), purple-on-white cliche, centered stacked cards, no animations, flat backgrounds.
- Push for: distinctive fonts, custom color personality, asymmetric layouts, staggered reveals, textured backgrounds.

GOAL: When a screenshot of this UI is shown to a designer, they should say "that looks professional" — not "that's AI-generated." Bold aesthetic direction. Generic is worse than imperfect.`)
  }

  if (toggles.typography) {
    sections.push(`## Quality: Typography System

Apply a professional type system on every screen:

### Type Scale (use this exact hierarchy — max 3–4 levels per screen):
- Display / Hero: 48–60px, weight 700–800, tracking -0.02em — hero headlines only
- H1 / Page title: 36–48px, weight 600–700, tracking -0.01em
- H2 / Section header: 24–30px, weight 600, tracking 0
- H3 / Card title: 18–20px, weight 600, tracking 0
- Body: 16px, weight 400, line-height 1.5–1.7 — paragraph text
- Small / Label: 14px, weight 400–500 — secondary content, helper text
- Caption / Metadata: 12px, weight 400–500 — timestamps, tags, overlines

### Readability Rules:
- Body line-height: 1.5–1.7 (never below 1.4 for multi-line text)
- Heading line-height: 1.1–1.3 (tight — large text needs less leading)
- Max line length: 65–75 characters per line for body text
- Letter-spacing: 0 or +0.01em for body, -0.02em for large headings, +0.05–0.1em for ALL-CAPS labels

### Hierarchy Rules:
- NEVER use more than 4 distinct font sizes on one screen — more creates noise, not hierarchy
- Use SIZE first, then WEIGHT, then COLOR to establish hierarchy (in that order)
- One dominant weight contrast per screen: semibold/bold heading vs regular body
- Labels and captions must visually recede: smaller + muted color (never same size as body)

### Contrast (WCAG AA minimum):
- Primary text: must be #111827 or darker on white — contrast > 16:1
- Secondary text: #4b5563 minimum — 7:1 contrast
- Muted/caption: #6b7280 minimum — 4.9:1 (never use #999 on white — fails WCAG)
- Placeholder text: #6b7280 minimum (lighter = accessibility failure)`)
  }

  if (toggles.uiuxDesignAudit || toggles.uiDesignPrinciples || toggles.uxDesignExpert) {
    sections.push(`## Quality: Design Standards — UI Principles, UX Audit & Expert Review

### Core UI Design Principles:
- **Color**: 60-30-10 rule (60% neutral, 30% secondary, 10% accent). HSL-based shade scales. Semantic mapping (success=green, error=red, warning=amber, info=blue). WCAG AA contrast minimum.
- **Typography**: Max 2 typefaces. Type scale ratios: 1.200–1.333. Line-height: 1.5–1.75 body, 1.1–1.3 headings. Letter-spacing: -0.02em display, 0 body, +0.05em caps. Max 45–75ch line length.
- **Layout**: F-pattern for text-heavy, Z-pattern for marketing. 4px spacing scale (4,8,12,16,24,32,48,64). Inner padding < outer margin < section spacing. Max 3–4 visual weight levels per screen.
- **Shadows**: Low=offset-y 1–2px blur 3–8px (cards). Mid=offset-y 4–8px blur 12–24px (dropdowns). High=offset-y 12–24px blur 32–56px (modals). Use colored shadows for premium feel.
- **Responsive**: Mobile-first (375px). Breakpoints: sm=640, md=768, lg=1024, xl=1280. Touch targets: 44×44px min. Stack horizontal→vertical on mobile.
- **Buttons**: ONE primary per viewport. Min-width 120px. Destructive = outlined until confirmed. Loading state: spinner replaces text, width unchanged.
- **Forms**: Labels ALWAYS above/left. Placeholder != label. Error messages below field with icon. Group related fields. Autofocus first field. Required fields marked.
- **Cards**: Single responsibility. Consistent 16–24px padding. Hierarchy: media→title→description→metadata→actions.
- **Modals**: Max 480px alerts, 640px forms, 900px complex. Backdrop 40–60% opacity. ESC to close. Focus trapped.
- **Navigation**: Max 5–7 top-level items. Active state clearly distinguished. Mobile: bottom tab bar (4–5 items).
- **Tables**: Zebra OR borders, not both. Right-align numbers. Sticky header. Empty state with illustration + CTA.
- **WCAG 2.2 AA**: 4.5:1 text contrast, 3:1 large text/UI. Focus ring 2px+ visible. 24×24px min target, 44×44px recommended. All images need alt text. Logical heading structure. Respect prefers-reduced-motion.

### Design Audit — Three Frameworks:
- **MD3**: All 8 component states (default, hover, focus, active, disabled, loading, error, success). 4px spacing grid. Token-based colors.
- **WCAG AA**: 4.5:1 contrast, keyboard access, 44px targets, labels on inputs, no color-only signals, heading hierarchy.
- **Nielsen 10**: System status visible, no jargon, undo/cancel available, consistent verbs, constrained inputs, icons have labels, keyboard shortcuts, clear hierarchy, inline error recovery, tooltips on complex features.

### Expert UX Review:
- Stand out from generic AI/SaaS patterns. Material honesty (no fake shadows).
- Color: 4–5 neutrals + 1–3 bold accents. Avoid default SaaS blue.
- Typography: headlines=emotional, body=functional. 2–3 typefaces, 1.25x scale.
- Animation: ease-out enter, ease-in exit. 100–300ms. Only transform+opacity.
- Every choice intentional. If it looks generic, push further.

APPLY: Every component passes MD3 + WCAG AA + Nielsen 10 before output. Every choice intentional.`)
  }

  // ═══════════════════════════════════════════════════════════
  // USER EXPERIENCE
  // ═══════════════════════════════════════════════════════════

  if (toggles.uxPsychology) {
    sections.push(`## Quality: UX Psychology — Cognitive Bias Application

Apply these principles to every interactive element and decision point:

### Information Filtering:
- **Hick's Law**: Max 4–5 choices visible at once. More → group, progressive disclosure, or smart defaults.
- **Fitts's Law**: Primary CTA minimum 44×44px. Large + reachable + adequate spacing. Secondary can be smaller.
- **Progressive Disclosure**: Show core features first. Reveal advanced options on demand.
- **Banner Blindness**: Never put critical CTAs in typical ad zones (right sidebar, top banner strip).

### Meaning Making:
- **Loss Aversion**: Frame as "don't lose X" (2× stronger than "gain X"). Show what's missed, not gained.
- **Goal Gradient**: Show progress bars. Pre-fill to 20% (never 0%). Break long flows into milestones.
- **Social Proof**: Show user counts, activity, ratings where context calls for it.
- **Reciprocity**: Show value before asking. The bigger the ask, the more value first.

### Time & Decisions:
- **Default Bias**: 90% keep defaults. Set smart defaults that serve most users.
- **Reactance**: NEVER trap users. Always provide clear, visible exits. Guilt-free back navigation.
- **Labor Illusion**: Show work during loading ("Checking availability...") — better than a blank spinner.

### Memory & Retention:
- **Peak-End Rule**: Create one memorable, satisfying moment per screen. End positively.
- **Aha Moment**: Remove all friction before the user's first success. Add features after.

APPLY: For each interactive element, ask "Which bias is most relevant here?" Design accordingly.`)
  }

  if (toggles.gestalt) {
    sections.push(`## Quality: Gestalt Visual Perception Principles

Apply these visual laws to every layout decision:

### Grouping:
- **Proximity**: Spacing BETWEEN groups must be 2–3× spacing WITHIN groups. Form labels: 4–8px from their field, 16–24px from previous field. Squint test: do the right things clump together?
- **Similarity**: Same-function = same visual treatment. Different-function = different look. One icon style throughout. Error=red, Success=green, Warning=amber — always.
- **Common Region**: Use cards/containers to enclose related items. Max 2–3 nesting levels. Unrelated items must be in separate containers.
- **Common Fate**: Hover/focus applies to the FULL container, not just the title. Animate related elements together.

### Hierarchy:
- **Figure-Ground**: Background → content → actions → modals. WCAG 4.5:1 contrast minimum for text. Primary CTAs visually "lifted" (filled background + strong contrast).
- **Focal Point**: ONE primary focal point per screen. Primary: large, filled, contrasting color. Everything else de-emphasized. Squint: what stands out? That must be the primary action.
- **Symmetry/Order**: Use a spacing scale (4px or 8px base, multiples only). Grid-based layout. Balance visual weight.

### Flow:
- **Continuity**: Eye path must flow naturally from top to primary CTA. Left-align body text. Headline → subhead → body → CTA.
- **Closure**: Carousels/scroll areas peek 20–40px off-screen. Skeleton screens match final layout shape. Truncated text always has "...".
- **Past Experience**: Use standard patterns (back arrow, gear for settings, magnifying glass for search). Novel interactions need explicit affordance cues.

### Simplicity:
- **Pragnanz**: Remove visual elements until the design breaks. Max 3–4 functional colors. No decorative borders that aren't creating grouping or hierarchy.`)
  }

  if (toggles.interaction) {
    sections.push(`## Quality: Interaction Design — Atlas 4-Layer Model

Design the full interaction flow across all 4 layers:

### Layer 1 — INBOUND (Sensing & Structuring)
- Design for worst-case input, not the happy path demo
- Make the human→AI handoff seamless (no jarring context switches)
- Use the right input modality for the touchpoint (touch on mobile, keyboard shortcuts on desktop)
- Never ask users to do work the system should handle (manual tagging, explicit formatting)

### Layer 2 — INTERNAL (Reasoning & Deciding)
- Make AI/system decisions explainable: show WHY something was recommended or acted on
- Define what happens when confidence is low (fallback, graceful degradation, ask user)
- High-stakes decisions need human-in-the-loop checkpoints
- Never over-automate decisions users expect control over

### Layer 3 — OUTBOUND (Expressing & Creating)
- Always give users steering controls: edit, regenerate, refine, constrain
- Progressive disclosure of detail: summary first, expand on demand
- Error recovery must be obvious: when something goes wrong, user can fix it immediately
- Output format must match the touchpoint (visual on mobile, dense table on desktop)

### Layer 4 — INTERACTIVE (Acting & Learning)
- Capture feedback signals: explicit (thumbs/stars) and implicit (edits, re-runs)
- Every automated action needs a visible undo/pause/override mechanism
- Session context should persist: system must remember across steps within a flow
- No runaway loops: always a stop/cancel mechanism visible to the user

### Touchpoint-Specific Rules:
- **Mobile App**: Bottom-heavy CTAs (thumb zone), glanceable, interruption-tolerant
- **Web Dashboard**: Keyboard shortcuts, dense information, multi-tasking friendly
- **AI-Assisted Flows**: Turn-based, context-dependent, graceful fallback for ambiguous input`)
  }

  // ═══════════════════════════════════════════════════════════
  // CONTENT & DATA
  // ═══════════════════════════════════════════════════════════

  if (toggles.microcopy) {
    sections.push(`## Quality: Microcopy & UX Writing

### BUTTONS
FORBIDDEN: "Submit", "OK", "Yes", "Process", "Confirm". REQUIRED: [Verb]+[Object] ("Save Order", "Add Item", "Delete Order").

### EMPTY STATES
FORBIDDEN: "No data", "No items". REQUIRED: WHY empty + WHAT to do + CTA button.

### ERRORS
Formula: [What happened] + [How to fix]. Never blame user. Place inline next to field.

### LOADING
Describe action: "Saving order..." not "Loading...". Always confirm success.

APPLY: Every label, button, message must be specific and action-oriented.`)
  }

  if (toggles.accessibility) {
    sections.push(`## Quality: Accessibility — WCAG 2.2 AA Compliance

### CONTRAST
- Normal text: 4.5:1 minimum. Large text (18pt+): 3:1. UI components: 3:1.
- Dark/saturated backgrounds → white text. Light backgrounds → dark text.
- NEVER color as only indicator — always pair with icon + text.

### TOUCH TARGETS
- 44×44px minimum for all tappable elements. 8px gap between adjacent targets.

### FOCUS & KEYBOARD
- Visible focus ring 2px+ on every interactive element. Tab order matches visual flow.
- Every input has visible label. Error = red + icon + text (never just red border).

APPLY: Dark background = white text. No exceptions.`)
  }

  if (toggles.dataHeavyDesign) {
    sections.push(`## Quality: Data-Heavy Design — Dashboards, Tables & Analytics

### Dashboard Layout
- 5-Metric Rule: max ~5 headline KPIs visible. Progressive disclosure for the rest.
- Card modularity: self-contained cards, 16–24px padding, independent skeleton loading.

### KPI Cards
- Label + Value (large, bold) + Delta (▲/▼ + % + period) + Sparkline + Context (target/goal).
- NEVER color alone — always include arrow direction.

### Data Tables
- Text: LEFT. Numbers: RIGHT. Dates/IDs: LEFT. Status: CENTER. Actions: RIGHT.
- Density tiers: Condensed 40px, Regular 48px, Relaxed 56px.
- Sticky header, sticky first column, sticky footer action bar on selection.
- Pagination: total + page + items-per-page (10/25/50/100).

### Real-Time Updates
- Count animation 200–400ms. Slide reorder <300ms. Pulse on new data. Color fade for status.
- "Last updated: X min ago". Never blank dashboard — show stale data with indicator.

### Charts
- Max 5 series. Label directly on chart. Horizontal labels. Reserve red=negative, green=positive.

### Cognitive Load
- Card padding 16–24px, gap 16–24px, section spacing 32–48px.
- Monospace fonts for numbers. Body 14px min. Headers 12–13px semi-bold.

APPLY: Every metric has context. Every column aligned by type. Every update animated.`)
  }

  return sections.length > 0
    ? '\n\n' + sections.join('\n\n')
    : ''
}

export default async function handler(req, res) {
  // CORS — origin allowlist
  const origin = req.headers.origin || ''
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  res.setHeader('Access-Control-Allow-Origin', allowed)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Vary', 'Origin')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' })
  }

  try {
    const { prompt, designBrief, currentTree, imageUrl, model: requestModel, action, qualityToggles, openRouterApiKey } = req.body
    const rk = typeof openRouterApiKey === 'string' ? openRouterApiKey.trim() : ''
    const designTokens = req.body.designTokens || {}
    const qualitySections = buildQualitySections(qualityToggles, designTokens)
    const qualityChecklist = buildQualityChecklist(qualityToggles, designTokens)

    // ── Prompt enhancement (lightweight, fast path) ──────────────────────────
    if (action === 'enhance') {
      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required for enhancement' })
      }
      if (!rk && !process.env.OPENROUTER_API_KEY) {
        return res.json({ enhancedPrompt: prompt })
      }
      try {
        // Build rich context for the enhancer
        const qt = qualityToggles || {}
        const activeLensNames = Object.entries(qt).filter(([, v]) => v).map(([k]) => {
          const names = {
            avontusBrand: 'Avontus Brand', tokenMap: 'Color & Tokens', noGenericFallback: 'Color & Tokens',
            componentRegistry: 'Component Registry', dnaAnalysis: 'Design DNA', dnaGeneration: 'Design DNA',
            designSystemPatterns: 'Structure & Patterns', designSystemArchitect: 'Structure & Patterns', artifactFix: 'Structure & Patterns',
            materialDesign3: 'Material Design 3', flutterMd3: 'Material Design 3',
            frontendDesign: 'Visual Excellence', creativeDesign: 'Visual Excellence', aestheticReview: 'Visual Excellence',
            typography: 'Typography', uiuxDesignAudit: 'Design Standards', uiDesignPrinciples: 'Design Standards', uxDesignExpert: 'Design Standards',
            uxPsychology: 'UX Psychology', gestalt: 'Gestalt Principles', interaction: 'Interaction Design',
            microcopy: 'UX Writing', accessibility: 'Accessibility', dataHeavyDesign: 'Data-Dense UI',
          }
          return names[k]
        }).filter(Boolean)

        const isModify = !!currentTree
        let userMsg = ''
        if (designBrief && typeof designBrief === 'object' && Object.keys(designBrief).length > 0) {
          userMsg += `Business context: ${JSON.stringify(designBrief)}\n\n`
        }
        if (designTokens && Object.keys(designTokens).length > 0) {
          const tokenSummary = []
          if (designTokens.primaryColor) tokenSummary.push(`primary: ${designTokens.primaryColor}`)
          if (designTokens.secondaryColor) tokenSummary.push(`secondary: ${designTokens.secondaryColor}`)
          if (designTokens.fontFamily) tokenSummary.push(`font: ${designTokens.fontFamily}`)
          if (tokenSummary.length > 0) userMsg += `Design tokens: ${tokenSummary.join(', ')}\n\n`
        }
        if (activeLensNames.length > 0) {
          userMsg += `Active quality lenses (weave their emphasis into the prompt): ${activeLensNames.join(', ')}\n\n`
        }
        userMsg += `Mode: ${isModify ? 'Modifying an existing screen' : 'Creating a new screen'}\n\n`
        userMsg += `User's rough prompt: ${prompt.trim()}`

        const { text } = await llmWithRetry('google/gemini-3.1-flash-lite-preview', [
          { role: 'system', content: ENHANCE_SYSTEM_PROMPT },
          { role: 'user', content: userMsg },
        ], 512, undefined, rk)
        return res.json({ enhancedPrompt: text.trim() || prompt })
      } catch (enhanceErr) {
        console.warn('Prompt enhancement failed, returning original:', enhanceErr?.message)
        return res.json({ enhancedPrompt: prompt })
      }
    }

    // ── Design improvement ──────────────────────────────────────────────────
    if (action === 'improve') {
      const { currentWebDesign, qualityToggles: qt, designTokens: dt, designBrief: db, model: rm } = req.body
      if (!currentWebDesign?.html) {
        return res.status(400).json({ error: 'No current design to improve' })
      }
      const improveModel = (rm && ALLOWED_MODELS.has(rm) ? rm : MODEL)
      // Build active quality lenses
      const activeToggleNames = {
        avontusBrand: 'Avontus Brand — Blue #0005EE, DM Sans, 107° motif, navy/teal secondary palette, brand voice, blue-tinted shadows',
        tokenMap: 'Token Enforcement — map colors to semantic roles, no generic blue/Material defaults, missing tokens → neutral gray not invented colors',
        noGenericFallback: 'Token Enforcement — no generic blue/Material defaults, missing tokens → neutral gray not invented colors',
        componentRegistry: 'Component Registry — correct Uno/XAML component for every UI need, required props on every component, never raw unstyled primitives',
        dnaAnalysis: 'Design DNA — analyze typography, color roles, spacing, card treatment from tokens first, then enforce detected patterns consistently throughout',
        dnaGeneration: 'Design DNA — match detected patterns exactly throughout',
        designSystemPatterns: 'Design System — atomic design hierarchy, 3-tier tokens, 8pt grid, all 8 component states, strict HTML pattern enforcement',
        designSystemArchitect: 'Design System — three-tier tokens, atomic design, variant-driven props',
        artifactFix: 'Design System — strict HTML pattern enforcement for inputs/toggles/icons/list items',
        materialDesign3: 'Material Design 3 — HCT dynamic color, tonal palettes, 5 button variants, MD3 type scale, 4dp grid, responsive breakpoints, 48dp touch targets',
        flutterMd3: 'Material Design 3 — dynamic color, 4dp grid, 48dp touch targets, no hardcoded colors, dark mode support',
        frontendDesign: 'Visual Excellence — crafted not generated, intentional depth, micro-spacing tight within groups, generous between',
        creativeDesign: 'Visual Excellence — distinctive fonts, textured backgrounds, tinted shadows, break the grid',
        aestheticReview: 'Visual Excellence — flag generic patterns, push for 3+ distinctive choices per screen',
        typography: 'Typography — modular scale, max 3-4 sizes per screen, body 1.5-1.7 line-height, one weight contrast, WCAG AA contrast',
        uiuxDesignAudit: 'Design Standards — MD3 8 states + WCAG AA + Nielsen heuristics audit',
        uiDesignPrinciples: 'Design Standards — 60-30-10 color rule, F/Z-pattern layout, ONE primary CTA per viewport',
        uxDesignExpert: 'Design Standards — material honesty, intentional animation, unique color pairs',
        uxPsychology: 'UX Psychology — Hick\'s Law (max 4-5 choices), Fitts\'s Law (44px+ touch targets), loss aversion, goal gradient, default bias, visible exits',
        gestalt: 'Gestalt Principles — proximity (2-3× between groups), similarity, figure-ground contrast, one focal point, common region, continuity',
        interaction: 'Interaction Design — worst-case input design, undo/cancel/edit controls, high-stakes checkpoints, mobile bottom CTAs, desktop shortcuts',
        microcopy: 'UX Writing — verb+object labels ("Save Order" not "Submit"), empty states with CTAs, error messages with fixes, action-oriented loading',
        accessibility: 'Accessibility WCAG AA — 4.5:1 contrast, dark bg → white text only, 44px touch targets, visible focus rings, color+icon+text for status',
        dataHeavyDesign: 'Data-Dense UI — 5-metric dashboard rule, KPI cards with delta+sparkline, right-align numbers, sticky headers, 3 density tiers, real-time animations',
      }
      const activeLenses = qt ? Object.entries(qt).filter(([, v]) => v).map(([k]) => activeToggleNames[k]).filter(Boolean) : []

      if (activeLenses.length === 0) {
        return res.status(400).json({ error: 'Enable at least one quality toggle to improve the design' })
      }

      const IMPROVE_SYSTEM = `You are a senior UX/UI designer improving an existing mobile app screen.
Apply the specific design principles listed below to improve the provided HTML+CSS.
Preserve all content, labels, and overall structure. Only improve: contrast, spacing, typography, UX copy, touch targets, visual hierarchy, layout clarity.

⛔ TWO CRITICAL RULES — VIOLATING THESE = BROKEN OUTPUT:
1. ICONS IN TEXT: <span class="msi"> renders GRAPHIC ICONS, not text. "settings" → ⚙, "cancel" → ✕, "error" → ⚠. NEVER put .msi inside paragraphs or sentences. Icons ONLY go in .icon-btn, .list-icon, or standalone in a .row with gap:8px. WRONG: <p>Cancel through <span class="msi">settings</span></p>. RIGHT: <p>Cancel through the app settings</p>.
2. DARK TEXT ON BLUE/DARK = INVISIBLE: Any blue, navy, teal, or dark background MUST have color:#FFFFFF on ALL text. NEVER rely on inherited color. Set color:#fff explicitly on EVERY text element inside dark containers.

Return ONLY a valid JSON object — no markdown, no explanation outside the JSON:
{"webDesign":{"html":"...","css":"..."},"decisions":[{"principle":"...","description":"...","impact":"high|medium|low"}]}
Each decision: principle = which lens (e.g. "UX Psychology — Loss Aversion"), description = what you changed and why (1-2 sentences), impact = high/medium/low.
Aim for 3-8 specific, concrete decisions.`

      const htmlSnippet = (currentWebDesign.html || '').slice(0, 6000)
      const cssSnippet = (currentWebDesign.css || '').slice(0, 2000)

      // Build quality checklist for actionable instructions (same as generation flow)
      const improveChecklist = buildQualityChecklist(qt, dt)

      let userMsg = CORE_SYSTEM_SPEC + '\n\n' + COMPONENT_RULES + '\n\n' + DESIGN_CRITIQUE_CHECKLIST + '\n\n'
      userMsg += `Design tokens: ${JSON.stringify(dt || {})}`
      if (db && typeof db === 'object' && Object.keys(db).length > 0) {
        userMsg += `\n\nBusiness design brief:\n${JSON.stringify(db, null, 2)}`
      }
      userMsg += `\n\nApply these quality lenses:
${activeLenses.map((l, i) => `${i + 1}. ${l}`).join('\n')}
${improveChecklist}

Current HTML:
${htmlSnippet}

Current CSS:
${cssSnippet}`

      try {
        const { text } = await llmWithRetry(improveModel, [
          { role: 'system', content: IMPROVE_SYSTEM },
          { role: 'user', content: userMsg },
        ], 10000, undefined, rk)

        const parsed = extractJsonObject(text)
        if (!parsed?.webDesign?.html) {
          return res.status(500).json({ error: 'Improvement returned invalid response. Please try again.' })
        }
        const decisions = Array.isArray(parsed.decisions) ? parsed.decisions.slice(0, 12).map(d => ({
          principle: String(d.principle || '').slice(0, 120),
          description: String(d.description || '').slice(0, 300),
          impact: ['high', 'medium', 'low'].includes(d.impact) ? d.impact : 'medium',
        })) : []

        return res.json({ webDesign: { html: parsed.webDesign.html, css: parsed.webDesign.css || '' }, decisions })
      } catch (improveErr) {
        console.error('Improve error:', improveErr)
        return res.status(500).json({ error: improveErr.message || 'Improvement failed. Please try again.' })
      }
    }

    // Input validation
    if ((!prompt || typeof prompt !== 'string') && !imageUrl) {
      return res.status(400).json({ error: 'Prompt or image URL is required' })
    }
    if (prompt && prompt.length > 20000) {
      return res.status(400).json({ error: 'Prompt too long (max 20000 chars)' })
    }

    if (!process.env.OPENROUTER_API_KEY) {
      const repairedMock = repairComponentTree(generateMockTree(prompt || 'default'))
      validateTreeStrict(repairedMock.tree)
      return res.json({
        tree: repairedMock.tree,
        webDesign: generateMockWebDesign(prompt || 'New screen', designBrief),
      })
    }

    const model = (requestModel && ALLOWED_MODELS.has(requestModel) ? requestModel : MODEL)
    // Launch WebDesign concurrently
    const webPromise = generateWebDesign(model, prompt || 'New screen', designTokens, designBrief, currentTree, imageUrl, qualitySections, qualityChecklist, rk)
      .catch((webErr) => {
        console.warn('Web design generation warning:', webErr?.message || webErr)
        return null
      })

    if (!imageUrl) {
      // TEXT PROMPT MODE: run tree + web design generation IN PARALLEL
      let textMsg = `Design tokens: ${JSON.stringify(designTokens)}\n\n`
      textMsg += `Brand Style Guide:\n${AVONTUS_BRAND_GUIDE}\n\n`
      textMsg += `Business design brief:\n${JSON.stringify(designBrief || {}, null, 2)}\n\n`
      if (currentTree) {
        textMsg += `Current screen (modify this):\n${JSON.stringify(currentTree, null, 2)}\n\nModification request: ${prompt}`
      } else {
        textMsg += `Create a screen: ${prompt}`
      }

      // Inject screen archetype spec for structural guidance (tree generation)
      const archetype = detectArchetype(prompt)
      if (archetype && SCREEN_ARCHETYPES[archetype]) {
        textMsg += `\n\n${SCREEN_ARCHETYPES[archetype]}`
      }

      textMsg += qualityChecklist

      // Hidden design philosophy — elevates quality silently
      textMsg += '\n' + DESIGN_PHILOSOPHY

      // Inject quality sections before IMPORTANT RULES so they're not buried at the tail
      const treeSystemPrompt = qualitySections
        ? SYSTEM_PROMPT.replace('\n\n## IMPORTANT RULES', qualitySections + '\n\n## IMPORTANT RULES')
        : SYSTEM_PROMPT

      const treePromise = llmWithRetry(model, [
        { role: 'system', content: treeSystemPrompt },
        { role: 'user', content: textMsg },
      ], 16384, undefined, rk)

      const [treeResult, webDesign] = await Promise.all([treePromise, webPromise])

      const text = treeResult.text

      // Try to parse tree — retry once on failure, then fall back to web design if available
      let tree = null
      try {
        if (!text) throw new Error('Empty tree response')
        const parsed = extractJsonObject(text)
        const repaired = repairComponentTree(parsed)
        validateTreeStrict(repaired.tree)
        if (repaired.repairs.length > 0) {
          console.warn('Applied schema repairs to generated tree:', repaired.repairs.slice(0, 8))
        }
        tree = repaired.tree
      } catch (treeErr) {
        console.warn('Tree parsing failed, retrying with repair prompt:', treeErr?.message)
        // One quick retry — ask model to fix its JSON
        try {
          const fixResult = await llmWithRetry(model, [
            { role: 'system', content: 'You are a JSON repair tool. Fix the malformed JSON and return ONLY valid JSON. No explanation, no markdown, no code blocks — just the raw JSON object.' },
            { role: 'user', content: `Fix this broken JSON:\n${(text || '').slice(0, 12000)}` },
          ], 16384, 1, rk)
          if (fixResult.text) {
            const fixParsed = extractJsonObject(fixResult.text)
            const fixRepaired = repairComponentTree(fixParsed)
            validateTreeStrict(fixRepaired.tree)
            tree = fixRepaired.tree
            console.log('Tree recovered via JSON repair retry')
          }
        } catch (retryErr) {
          console.warn('Tree retry also failed:', retryErr?.message)
        }
        // If retry also failed, use fallback
        if (!tree) {
          if (webDesign) {
            tree = { id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [] }
          } else {
            throw treeErr
          }
        }
      }

      return res.json({
        tree,
        webDesign: webDesign || generateMockWebDesign(prompt || 'Generated screen', designBrief),
        modelUsed: treeResult.modelUsed,
      })
    }

    // IMAGE / WIREFRAME MODE: sequential (analysis feeds into tree generation)
    let wireframeAnalysis = null
    try {
      const analysisResult = await analyzeWireframe(model, imageUrl, prompt, designTokens, designBrief, rk)
      wireframeAnalysis = analysisResult.analysis
    } catch (analysisErr) {
      console.warn('Wireframe analysis warning:', analysisErr?.message || analysisErr)
    }

    const textPart = `Design tokens: ${JSON.stringify(designTokens)}

Business design brief:
${JSON.stringify(designBrief || {}, null, 2)}

## WIREFRAME CONVERSION TASK

You are looking at a Balsamiq wireframe image. Balsamiq wireframes are LOW-FIDELITY mockups drawn in a sketchy, hand-drawn style. They use:
- Rectangles with sketch borders for containers, text fields, and buttons
- Simple toggle switches (green/white circles)
- "X" icons for close/cancel actions
- Checkmark icons for confirm/save actions
- Red circle-X icons for error/delete actions
- Triangle icons for warnings
- Circle-i icons for info
- Arrows and "Tap" labels showing user interaction flows
- Phone/tablet outlines showing mobile context
- Multiple states of the same screen shown side-by-side (e.g. before tap, after tap)

${wireframeAnalysis ? `## IMAGE ANALYSIS REFERENCE (from a prior vision pass)
Use this as grounding truth and preserve it in the generated tree.
- Screen type: ${wireframeAnalysis.screenType || 'N/A'}
- Summary: ${wireframeAnalysis.summary || 'N/A'}
- Visible texts (preserve exactly where possible): ${JSON.stringify(wireframeAnalysis.visibleTexts || [])}
- Key actions: ${JSON.stringify(wireframeAnalysis.keyActions || [])}
- Sections (top-to-bottom): ${JSON.stringify(wireframeAnalysis.sections || [])}
` : ''}

## WHAT TO DO

Analyze the wireframe image carefully and convert it to a component tree.

**CRITICAL RULES:**

1. **If the image shows MULTIPLE SCREENS or STATES side by side**: Pick the MOST COMPLETE or MOST INTERESTING state and convert that one. If the wireframe shows a progression (e.g. tap → result), convert the final/complete state. If it shows before/after, convert the "after" state since it has more UI elements visible.

2. **If the image shows a SINGLE COMPONENT** (not a full screen — e.g. just a dialog, popup, toolbar, or form section): Wrap it in a Page root but only build the component shown. Do NOT invent surrounding UI that isn't in the wireframe.

3. **If the image shows a FULL SCREEN**: Convert the entire screen as a Page with all visible elements.

4. **PRESERVE ALL TEXT exactly as written** in the wireframe. Every label, every button caption, every field header. Do not rename or paraphrase anything.

5. **PRESERVE THE LAYOUT**: If elements are side by side, use Orientation="Horizontal". If stacked vertically, use Vertical. Match the spatial arrangement.

6. **MAP VISUAL ELEMENTS to the component types in my design system**:
   - Sketchy rectangles with text inside → Button or Card
   - Text fields with labels above → TextBox with Header property
   - Toggle switches → ToggleSwitch
   - Lists of items in boxes → ListView with Card children
   - Top bar with X/Back and title → NavigationBar
   - Popup/overlay cards → Card with Style="Outlined"
   - Red circle-X → Icon Glyph="XCircle" Foreground="#D32F2F"
   - Yellow triangle → Icon Glyph="AlertTriangle" Foreground="#F9A825"
   - Blue circle-i → Icon Glyph="Info" Foreground="#1976D2"
   - Checkmark → Icon Glyph="Check"
   - Refresh/cycle icon → Icon Glyph="Search" (closest available)

7. **RESPECT THE TOOLBAR PATTERN visible in the wireframe**:
   - X on left + checkmark on right = Edit mode (MainCommand="Close")
   - Back arrow on left = Read-only mode (MainCommand="Back")
   - Error/warning icon between X and checkmark = validation state

8. Use realistic Avontus Quantify data for any placeholder content.

9. Preserve the same core workflow and on-screen content from the image. Improve visual hierarchy and spacing, but DO NOT invent unrelated features or replace the screen purpose.

10. Quality gate before final output:
   - Ensure visible texts in the image remain represented in the tree properties.
   - Ensure section order (top-to-bottom) matches the wireframe.
   - Ensure primary actions match the image intent.

${prompt ? `Additional context from user: ${prompt}` : 'No additional context provided.'}

${DESIGN_PHILOSOPHY}`

    const userContent = [
      { type: 'text', text: textPart },
      { type: 'image_url', image_url: { url: imageUrl } },
    ]

    const imageTreeSystemPrompt = qualitySections
      ? SYSTEM_PROMPT.replace('\n\n## IMPORTANT RULES', qualitySections + '\n\n## IMPORTANT RULES')
      : SYSTEM_PROMPT

    const { text, modelUsed } = await llmWithRetry(model, [
      { role: 'system', content: imageTreeSystemPrompt },
      { role: 'user', content: userContent },
    ], 16384, undefined, rk)

    // Try to parse tree — if it fails but web design succeeded, return web design with fallback tree
    let tree = null
    let treeParseOk = false
    try {
      if (!text) throw new Error('Empty tree response')
      const parsed = extractJsonObject(text)
      let repaired = repairComponentTree(parsed)
      validateTreeStrict(repaired.tree)
      if (repaired.repairs.length > 0) {
        console.warn('Applied schema repairs to generated tree:', repaired.repairs.slice(0, 8))
      }

      if (wireframeAnalysis?.visibleTexts?.length) {
        const evidence = wireframeAnalysis.visibleTexts
        const matched = countEvidenceMatches(repaired.tree, evidence)
        const requiredMatches = Math.min(4, Math.max(2, Math.ceil(evidence.length * 0.2)))
        if (matched < requiredMatches) {
          try {
            const retryContent = [
              {
                type: 'text',
                text: `The previous output appears weakly grounded to the image text (matched ${matched}/${requiredMatches} evidence phrases).
Re-run the conversion and preserve image content more faithfully.

Evidence phrases that should appear in properties when visible:
${JSON.stringify(evidence.slice(0, 30))}

Original request:
${prompt || 'Convert the wireframe image to the design system.'}`,
              },
              { type: 'image_url', image_url: { url: imageUrl } },
            ]

            const retry = await llmCompletion(model, [
              { role: 'system', content: imageTreeSystemPrompt },
              { role: 'user', content: retryContent },
            ], 16384, rk)
            const retryData = await retry.json()
            const retryText = extractTextFromContent(retryData.choices?.[0]?.message?.content)
            if (retryText) {
              const retryParsed = extractJsonObject(retryText)
              repaired = repairComponentTree(retryParsed)
              validateTreeStrict(repaired.tree)
            }
          } catch (retryErr) {
            console.warn('Wireframe grounding retry warning:', retryErr?.message || retryErr)
          }
        }
      }

      tree = repaired.tree
      treeParseOk = true
    } catch (treeErr) {
      console.warn('Tree parsing failed (image mode), retrying with repair prompt:', treeErr?.message)
      // One quick retry — ask model to fix its JSON
      try {
        const fixResult = await llmWithRetry(model, [
          { role: 'system', content: 'You are a JSON repair tool. Fix the malformed JSON and return ONLY valid JSON. No explanation, no markdown, no code blocks — just the raw JSON object.' },
          { role: 'user', content: `Fix this broken JSON:\n${(text || '').slice(0, 12000)}` },
        ], 16384, 1, rk)
        if (fixResult.text) {
          const fixParsed = extractJsonObject(fixResult.text)
          const fixRepaired = repairComponentTree(fixParsed)
          validateTreeStrict(fixRepaired.tree)
          tree = fixRepaired.tree
          treeParseOk = true
          console.log('Tree recovered via JSON repair retry (image mode)')
        }
      } catch (retryErr) {
        console.warn('Tree retry also failed (image mode):', retryErr?.message)
      }
    }

    const webDesign = await webPromise

    if (!treeParseOk && !webDesign) {
      // Both failed — surface the error
      return res.status(500).json({ error: 'Failed to parse generated UI. Please try again.' })
    }

    res.json({
      tree: tree || { id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [] },
      webDesign: webDesign || generateMockWebDesign(prompt || 'Generated screen', designBrief),
      modelUsed,
    })
  } catch (err) {
    console.error('Generation error:', err)
    // Don't leak internal details to client
    const safeMsg = err.message?.includes('API') || err.message?.includes('fetch')
      ? 'AI service temporarily unavailable. Please try again.'
      : (err.message || 'Generation failed')
    res.status(500).json({ error: safeMsg })
  }
}
