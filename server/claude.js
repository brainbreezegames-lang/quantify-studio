import dotenv from 'dotenv'
import { extractJsonObject, repairComponentTree, validateTreeStrict } from './tree-schema.js'
import { AVONTUS_BRAND_GUIDE } from './avontus-brand-guide.js'
import { SCREEN_ARCHETYPES, detectArchetype } from './screen-archetypes.js'
import { GOLD_EXAMPLES } from './gold-examples.js'
// 4-layer prompt system
import { CORE_SYSTEM_SPEC } from './prompt-layers/core-system-spec.js'
import { SCREEN_ARCHETYPE_LAYERS, detectArchetypeLayer } from './prompt-layers/screen-archetypes.js'
import { COMPONENT_RULES } from './prompt-layers/component-rules.js'
import { CRITIQUE_CHECKLIST_COMPACT } from './prompt-layers/design-critique-checklist.js'
import { SYSTEM_PROMPT_TREE } from './prompt-layers/system-prompt-tree.js'
import { assembleWebLayers } from './prompt-layers/assemble-web-layers.js'
import { DESIGN_PHILOSOPHY } from './prompt-layers/design-philosophy.js'
dotenv.config()

const SYSTEM_PROMPT = SYSTEM_PROMPT_TREE

// SYSTEM_PROMPT was extracted to server/prompt-layers/system-prompt-tree.js
// as single source of truth shared by server/claude.js and api/generate.js.

const WEB_DESIGN_SYSTEM_PROMPT = `You are a world-class product designer and front-end engineer. Your job is to create STUNNING, production-quality mobile UI screens for Avontus Quantify — a scaffolding and equipment reservation management platform.

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

BUTTONS:
  <button class="btn-filled">Label</button>
  <button class="btn-outlined">Label</button>
  <button class="btn-text">Label</button>
  <button class="btn-tonal">Label</button>
  <button class="btn-filled btn-sm">Small</button>
  <button class="icon-btn"><span class="msi">arrow_back</span></button>

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

BOTTOM ACTIONS:
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
      <div class="list-item">
        <div class="list-icon"><span class="msi">inventory_2</span></div>
        <div class="col" style="flex:1">
          <div class="row-between">
            <span class="code">156850</span>
            <span class="badge badge-teal">OK</span>
          </div>
          <p class="body-md" style="margin:2px 0">5' Safety-Grip Plank</p>
          <p class="body-sm" style="margin:0">Stock: 850 · Available: 120</p>
        </div>
        <button class="icon-btn"><span class="msi">chevron_right</span></button>
      </div>
    </div>
    <div class="card">
      <div class="row-between">
        <p class="body-md" style="margin:0">Show out-of-stock only</p>
        <label class="switch"><input type="checkbox"><span class="sw-track"><span class="sw-thumb"></span></span></label>
      </div>
    </div>
  </div>
</div>

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

ICON RULES (MANDATORY — VIOLATION = VISUAL BUG):
I1. Icons ONLY go in these containers — nowhere else:
    • .icon-btn buttons (app-bar actions, FABs, trailing actions)
    • .list-icon inside .list-item rows
    • Standalone inside a .row with gap (icon + text label combos)
    • .chip-icon inside chips
I2. NEVER put <span class="msi"> inside a <p>, <h1>-<h6>, <li>, <label>, <a>, <button> text, <td>, <th>, <span> that contains a sentence, or any element whose primary purpose is readable text. Icons inside text WILL break the sentence.
I3. These common English words are Material Symbol icon names — NEVER wrap them in .msi when they appear as normal words: cancel, close, delete, block, check, add, remove, edit, search, phone, lock, star, home, menu, help, info, warning, error, settings, send, share, copy, save, back, forward, done, clear, refresh, view, image, place, event, date, book, work, cloud, time, list, table, flag.
I4. WRONG: <p>Can I <span class="msi">cancel</span> anytime?</p>  RIGHT: <p>Can I cancel anytime?</p>
    WRONG: <span class="msi">settings</span> Settings  RIGHT: <div class="row" style="gap:8px"><span class="msi">settings</span><span>Settings</span></div>
    WRONG: <p>Predict shortages with AI-driven project <span class="msi">trending_up</span>s.</p>  RIGHT: <p>Predict shortages with AI-driven project trends.</p>
I5. ICON SIZING — always use the .msi class as-is (24px default). Use .msi.sm (18px) for compact contexts. Use .msi.lg (32px) ONLY for hero/empty-state illustrations. NEVER set font-size on icons inline — use the size classes.
I6. ICON + TEXT ALIGNMENT — always place icon and text in a .row with gap:8px. Icon comes FIRST (leading), text SECOND. Vertically they auto-align via the row's align-items:center.
    Pattern: <div class="row" style="gap:8px"><span class="msi">icon_name</span><span>Label text</span></div>
I7. ICON IN LIST ROWS — always use .list-item pattern: .list-icon (contains one .msi) + .col flex:1 (text) + optional trailing .icon-btn. Never put the icon loose next to text without the .list-icon wrapper.
I8. APP-BAR ICONS — use .icon-btn inside the app-bar. Left: navigation (arrow_back or menu). Right: action icons. Never mix icon buttons with text labels in the same row without proper .row gap spacing.
I9. ICON CHOICE — pick the most specific Material Symbol name. Prefer: arrow_back (not back), more_vert (not menu for overflow), check_circle (not check for success states), chevron_right (not arrow_forward for list navigation).

COLOR & CONTRAST RULES (MANDATORY — VIOLATION = UNREADABLE TEXT):
C1. DARK TEXT (#1C1B1F, #333, #49454F, black) ON DARK/BLUE BACKGROUNDS IS FORBIDDEN. ALWAYS set color:#FFFFFF on ANY element inside a dark, blue, navy, teal, or gradient container. This means EVERY <p>, <span>, <h1>-<h6>, <a>, <label>, <li> inside a dark section must explicitly have color:#fff or color:#E8E9FD in its style attribute or CSS class. Do NOT rely on inherited text color — always set it explicitly on dark backgrounds.
C2. Body text minimum contrast ratio: 4.5:1 against its background. Large text (18px+): 3:1 minimum.
C3. FORBIDDEN combinations that WILL produce unreadable text:
    - #1C1B1F text on #0005EE background (black on blue)
    - #1C1B1F text on #062175 background (black on navy)
    - #49454F text on any blue/navy/teal gradient
    - Any dark text on any background darker than #808080
    - White or light text on white or light gray backgrounds
C4. Hero/banner sections with dark blue or gradient backgrounds: set color:#fff on EVERY text element inside — headings, body, captions, links, labels, ALL of them. Never assume inherited color will be white.
C5. When unsure: dark/colored bg → color:#fff. Light bg → color:#1C1B1F. Always explicit, never inherited.

ACCESSIBILITY RULES (MANDATORY — WCAG 2.2 AA):
A1. All interactive elements (buttons, links, inputs) MUST have min 44×44px touch target. Use existing button classes which already handle this.
A2. Every <input>, <select>, <textarea> MUST have an associated <label> (use .field wrapper with .field-label).
A3. Use semantic HTML: <button> for actions (not <div>), <nav> for navigation, <main> for content, <header>/<footer> for landmarks.
A4. Status indicators MUST use color + icon + text — never color alone. A red badge saying "Error" with an icon is correct; a red dot alone is not.
A5. Focus states: all interactive elements get visible focus rings via :focus-visible. The pre-loaded CSS handles this for .btn-* and .field classes.
A6. Images/illustrations: always use aria-label or role="img" with alt text. Decorative elements: aria-hidden="true".
A7. Reading order: DOM order must match visual order. Don't use CSS to reorder content in a way that breaks screen reader flow.
`

function callTimeoutMs(model) {
  return model.startsWith('anthropic/') ? 200_000 : 180_000
}

async function openRouterCompletion(apiKey, model, messages, maxTokens) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), callTimeoutMs(model))
  let resp
  try {
    resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://uno-studio.vercel.app',
        'X-Title': 'Uno Studio',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages,
        ...(model.startsWith('anthropic/') ? { thinking: { type: 'disabled' } } : {}),
        provider: model.startsWith('anthropic/')
          ? { order: ['Anthropic'], allow_fallbacks: false }
          : { order: ['Google AI Studio'], allow_fallbacks: false },
      }),
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

async function openRouterWithFallback(apiKey, preferredModel, messages, maxTokens) {
  const response = await openRouterCompletion(apiKey, preferredModel, messages, maxTokens)
  return { response, modelUsed: preferredModel }
}

// ── Quality Toggle Prompt Sections ──────────────────────────────

function buildQualitySections(toggles, designTokens) {
  if (!toggles || typeof toggles !== 'object') return ''

  const sections = []

  // ═══════════════════════════════════════════════════════════
  // FOUNDATION
  // ═══════════════════════════════════════════════════════════

  if (toggles.avontusBrand) {
    sections.push(`## Quality: Avontus Brand Identity Guidelines

Apply the official Avontus brand identity to every generated screen. This is derived from the Avontus Brand Identity Guidelines JUL 2025 and the Avontus design system.

### Brand Promise & Voice
- **Tagline**: "Reach New Heights"
- **Brand Tone**: Confident, Forward-Looking, Grounded, Optimistic, Energetic, Conversational
- **UI Copy**: Direct and action-oriented. "Sign in" not "Please sign in". Verbs over nouns. "Ship" not "Shipment".
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
| Light Blue | #40ABFF | Info states, links, secondary actions, data highlights |
| Teal | #009B86 | Success states, confirmations, positive indicators |
| Green | #6BE09E | Success badges, completed status, positive feedback |
| Yellow | #FFD91A | UTILITARIAN ONLY — focus callouts, attention markers. NEVER as background, body text, or buttons |

### Secondary Tints & Shades
- Navy: #384D91 (light) → #051958 (mid) → #03113B (dark)
- Light Blue: #8CCDFF (light) → #3080BF (mid) → #205680 (dark)
- Teal: #66C3B6 (light) → #007465 (mid) → #004E43 (dark)
- Green: #A6ECC5 (light) → #50A877 (mid) → #36704F (dark)

### Surface & Text Colors
| Role | Hex |
|------|-----|
| Background | #FFFFFF |
| Surface | #FAFBFF |
| Surface 2 | #F0F3FF |
| Surface 3 | #E3E8F9 |
| Text primary | #1C1B1F |
| Text secondary | #49454F |
| Outline | #79747E |
| Outline variant | #CAC4D0 |
| Border/Divider | #E0E0E0 |
| Link text | #0005EE (underlined) |

### Semantic Colors
| Role | Hex | Icon |
|------|-----|------|
| Error | #D32F2F | XCircle |
| Warning | #F9A825 | AlertTriangle |
| Info | #1976D2 | Info |
| Success | #009B86 | Check |

### Typography — DM Sans
Primary typeface: DM Sans. Fallback: "DM Sans", "Helvetica Neue", Helvetica, Arial, sans-serif.
Monospace: JetBrains Mono for code.
- Light (300): Large display text, hero statements
- Regular (400): Body text, descriptions, form labels
- Medium (500): Subtitles, section headers, emphasized labels
- Bold (700): Headlines, key data, primary CTAs, toolbar titles

### The 107° Graphic Motif
The Avontus logo uses a distinctive 107-degree slanted angle. This motif carries through:
- Decorative dividers on splash/hero screens
- Background accent shapes (slanted bands of color)
- Creates visual energy and forward momentum
- The logo consists of typographic wordmark "Avontus" with a foundational underline

### Logo Rules
- Minimum 180px width on screen
- Clear space: padding equal to "A" height around the logo
- NEVER distort, recolor, outline, tilt, add shadows, or place over busy backgrounds
- Use with "SOFTWARE" subhead when context is unclear

### Iconography
- Style: Linear strokes, NOT heavy fills — evokes scaffolding structural components
- Sizes: 24px standard, 20px compact, 32px featured
- Can use secondary palette colors for multicolor emphasis

### Elevation (Brand-Blue-Tinted Shadows)
| Level | Shadow |
|-------|--------|
| 0 | none |
| 1 | 0 1px 3px rgba(0,5,238,0.06), 0 1px 2px rgba(0,0,0,0.04) |
| 2 | 0 4px 12px rgba(0,5,238,0.08), 0 2px 4px rgba(0,0,0,0.04) |
| 3 | 0 8px 24px rgba(0,5,238,0.10), 0 4px 8px rgba(0,0,0,0.05) |
| 4 | 0 16px 40px rgba(0,5,238,0.12), 0 8px 16px rgba(0,0,0,0.06) |
| 5 | 0 24px 56px rgba(0,5,238,0.14), 0 12px 24px rgba(0,0,0,0.08) |

### Shape Tokens
None=0px, Extra Small=2px, Small=4px, Medium=8px, Large=12px, Extra Large=16px, Full=9999px

### Spacing Scale
4px (micro) → 8px (compact) → 12px (tight) → 16px (standard) → 20px (comfortable) → 24px (section) → 32px (page margin) → 40px (generous) → 48px (major) → 64px (hero) → 80px (max)

### Motion Tokens
- Easing: cubic-bezier(0.2, 0, 0, 1)
- Fast: 150ms (hovers, ripples, toggles)
- Medium: 300ms (slides, expand/collapse)
- Slow: 500ms (page animations, onboarding)

### Button Style Hierarchy (MANDATORY)
- Filled: bg=#0005EE, text=#FFFFFF — PRIMARY action only. ONE per action group.
- Outlined: border=#0005EE, text=#0005EE — SECONDARY action (cancel, back, reject).
- Tonal: bg=#0005EE at 12%, text=#0005EE — ALTERNATIVE primary (bulk ops).
- Text: transparent, text=#0005EE — TERTIARY (minor links, dismiss).

### State Layers
Hover=8%, Focus=12%, Pressed=12%, Dragged=16%, Disabled=38%

### Dark Mode
Background: #121212 or #1C1B1F. Surface: #1E1E1E. Primary stays #0005EE. Text primary: #EEEEF0. Text secondary: #8888A0.

CRITICAL: Every generated screen must feel unmistakably Avontus — branded with Blue #0005EE, professional, confident, and polished.`)
  }

  if (toggles.tokenEnforcement && designTokens) {
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

  // 4. Component Registry with Usage Examples
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
| Stepper | Stepper with Header, Value, Min, Max, Step | Custom +/- buttons |
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

  if (toggles.designDna) {
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

  if (toggles.designSystem) {
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

  if (toggles.materialDesign) {
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

  if (toggles.visualExcellence) {
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

  if (toggles.designStandards) {
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
- **Commitment Consistency**: Start with small asks. Build trust incrementally.

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
- **Symmetry/Order**: Use a spacing scale (4px or 8px base, multiples only). Grid-based layout. Balance visual weight on both sides.

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
    sections.push(`## Quality: Microcopy & UX Writing — Copy That Works

Apply professional UX writing principles to every piece of interface text. Bad copy fails users before bad layout does.

### BUTTONS & CTAs — THE MOST CRITICAL ELEMENT
Every button must start with a specific verb describing the OUTCOME the user gets.

**FORBIDDEN button labels:** "Submit", "OK", "Yes", "Process", "Confirm", "Click here", "Done" — these say nothing
**REQUIRED pattern:** [Verb] + [Object] = clear outcome
- "Save Order" not "Submit"
- "Add Item" not "Add"
- "Create Shipment" not "Process"
- "Delete Order" not "Delete" (include the object for destructive actions)
- "Ship 3 Items" not "Ship" (when a count/selection is involved, say so)
- "Complete Shipment" not "OK"
- "Cancel Shipment" not "Cancel" (cancel is ambiguous — cancel WHAT?)

**Primary vs secondary:** Primary button = specific strong verb. Secondary = softer/escape ("Keep editing", "Discard changes", "Go back")

### LABELS & FORM FIELDS
- Use the user's language, not developer/database terminology
  - "Phone" not "Contact Number" | "Date" not "DateTime" | "Notes" not "Memo"
  - "Weight" not "WeightLbs" | "Ship to" not "DestinationAddress" | "Qty" not "Quantity (integer)"
- Labels: always visible above or beside the input — never use placeholder text as a substitute label
- Placeholder text = format example only: "e.g., john@company.com", "MM/DD/YYYY", "e.g., 10"
- For sensitive data: inline explanation of why: "Used for delivery updates only"

### EMPTY STATES
Every empty state MUST explain: WHY it's empty + WHAT to do next + include a clear CTA.
- FORBIDDEN: "No data", "No items", "Nothing here", "Empty", "—" alone
- GOOD: "No orders yet. Create your first order to get started." → [Create Order] button
- No results: "No results for '[search term]'. Try a different search or clear your filters."
- All done: "All shipments complete. Great work today." → [View History] link

### NAVIGATION & HEADINGS
- Section headings: content-first ("Your Shipments" not "Shipment List", "Today's Orders" not "Orders")
- Status labels: human language ("Awaiting Pickup" not "PENDING", "Complete" not "STATUS: 1")
- Navigation items: use terms your users actually use, not internal data model names
- Page titles: describe what the user is DOING, not the system state ("Reviewing Order #756" not "Order Detail")

### ERROR MESSAGES
Formula: [What happened] + [How to fix it]. Never blame the user.
- FORBIDDEN: "Invalid input", "Error", "Failed", "Something went wrong" (with no guidance)
- FORBIDDEN: "You entered an invalid email" (blaming)
- GOOD: "This doesn't look like a valid email — check for typos" (describes, fixes)
- GOOD: "Order couldn't be saved. Check your connection and try again."
- Place errors inline, next to the specific field — not just in a banner at the top

### LOADING & PROGRESS STATES
- Describe the specific action happening: "Saving order..." not "Loading..."
- Long operations: "Processing shipment — usually takes 10–15 seconds"
- Never leave users staring at a spinner with no text — they don't know if it's working or broken
- Success confirmation: "Order saved" / "Shipment created" — always confirm what just happened

### TONE — AVONTUS VOICE
- Confident and direct: active voice, strong verbs, no hedging
- Action-oriented: focus on what users CAN do, not what the system is doing to them
- Concise: cut every word that doesn't earn its place
- Human but professional: clear without being robotic or over-formal
- Industry-aware: use scaffolding/construction terminology users recognize

APPLY: Read every label, button, and message aloud. If it sounds robotic, vague, or blaming — rewrite it.`)
  }

  if (toggles.accessibility) {
    sections.push(`## Quality: Accessibility — WCAG 2.2 AA Compliance

Apply accessibility standards so the design works for every user on every device.

### CONTRAST — THE #1 AI DESIGN FAILURE
This is the most common problem in AI-generated designs. Fix it every time.

**Rules:**
- Normal text (under 18pt / under 14pt bold): MINIMUM 4.5:1 contrast ratio against its background
- Large text (18pt+ or 14pt+ bold): MINIMUM 3:1 ratio
- UI components (borders, icon buttons, input outlines): MINIMUM 3:1 ratio against adjacent colors

**CRITICAL — Dark backgrounds DEMAND light text:**
- ANY background darker than mid-gray in luminance (roughly #808080 or darker) MUST use white or very light text
- Avontus Blue #0005EE background → white text (#FFFFFF) ✓ (8.6:1 ratio)
- Navy #062175 background → white text (#FFFFFF) ✓
- Teal #009B86 background → white text ✓
- Dark card/surface (#1C1B1F, #1a2340, etc.) → white or very light text ✓
- FORBIDDEN: dark text on dark blue, dark text on navy, dark text on any saturated dark color
- FORBIDDEN: placing the brand primary color as text ON another saturated color background
- Before outputting HTML/CSS: mentally check every text-on-background pair

**Colored UI elements:**
- Colored button with text label → text must contrast with the button background at 4.5:1
- Badge/chip with colored background → ensure label is white on dark colors, dark on light colors
- Status indicators → NEVER rely on color alone; pair color with text label or icon

### COLOR AS THE ONLY SIGNAL — FORBIDDEN
- Error states: red border/color + icon (⚠ or ✗) + descriptive text message — never red border alone
- Success states: green color + text "Saved" / "Complete" — never green alone
- Required fields: asterisk (*) + label text — never just red color on the label
- Charts/graphs: add labels or patterns in addition to color — 8% of men are color-blind

### TOUCH TARGETS (Mobile)
- Every tappable/clickable element: minimum 44×44px touch area (Apple HIG / WCAG AA recommended)
- Icon buttons (close, back, chevron): 44×44px hit area even if the icon itself is 20px
- Minimum 8px gap between adjacent interactive targets to prevent mis-taps
- Inline text links within dense copy: add vertical padding so the tap target is at least 44px tall

### READABLE TEXT
- Minimum font size for body text: 14px on mobile, 16px recommended
- Line-height: minimum 1.4× for body paragraphs (1.5–1.7 preferred)
- ALL CAPS text: only for short labels (max 3–4 words), never for body content or descriptions
- Placeholder text in inputs: must meet 3:1 minimum against the input background

### FOCUS STATES (Web/Desktop)
- Every interactive element must show a visible focus ring when keyboard-navigated
- Focus ring: minimum 2px solid, contrasting color against the element's background
- NEVER: \`outline: none\` or \`outline: 0\` without a custom replacement focus style
- Tab order: top-left → bottom-right, matching the visual reading flow

### FORM ACCESSIBILITY
- Every input field must have a visible label — placeholder text is NOT a label substitute
- Error messages: text description of what's wrong, placed directly below the field
- Error styling: red color + icon + text — never just a red border alone

APPLY: Check every text/background combination. If a background is dark and saturated, the text must be white. No exceptions.`)
  }

  if (toggles.dataHeavyDesign) {
    sections.push(`## Quality: Data-Heavy Design — Dashboards, Tables & Analytics

Expert patterns for data-dense interfaces that reduce cognitive overload and shorten time-to-decision.

### Dashboard Layout Architecture
- **Information hierarchy**: Primary KPIs top-left/center-top (large, bold), Controls in top bar, Trend charts middle, Data tables below, Alerts at edges
- **5-Metric Rule**: Limit primary view to ~5 headline KPIs. More triggers cognitive overload. Use progressive disclosure:
  - Level 1: 3–5 headline KPIs (always visible)
  - Level 2: Supporting charts/trends (visible, secondary emphasis)
  - Level 3: Detailed data tables (scrollable, below fold)
  - Level 4: Drill-down views (on click/expand)
- **Card modularity**: Every dashboard section is a self-contained card with clear title, 16–24px padding, independent loading state (skeleton), optional expand/collapse

### KPI Card Anatomy
Every metric needs context — a number alone is meaningless:
1. **Label**: What this metric measures (plain language)
2. **Value**: Current number — large, bold, first thing the eye hits
3. **Delta**: Direction arrow (▲/▼) + percentage change + comparison period ("vs last month")
4. **Sparkline**: 7–30 day mini trend, no axes, accent dot on latest point
5. **Context**: Target/goal, previous period, or benchmark
- Positive = green + ▲, Negative = red + ▼, Neutral = gray + —
- NEVER rely on color alone — always include arrow direction

### Data Table Design (Critical Rules)
**Column alignment:**
- Text (names, descriptions): LEFT
- Numbers (amounts, quantities): RIGHT (decimals align for comparison)
- Dates, IDs: LEFT (read as text)
- Status badges, icons: CENTER
- Action buttons: RIGHT
- Headers match their column alignment

**Row density** — offer 3 tiers: Condensed (40px), Regular (48px), Relaxed (56px)
**Row separation** — choose ONE: line dividers (1px light gray), zebra stripes, card rows, or no dividers
**Sticky elements**: Sticky header (always), sticky first column (horizontal scroll), sticky footer action bar (on selection)
**Sorting**: Chevron (▲/▼) on sortable headers, click toggles asc → desc → none
**Pagination footer**: Total count + current page + items-per-page selector (10/25/50/100)

### Bulk Actions & Multi-Select
- Show checkboxes on row hover, select-all in header
- Action bar appears after selection: "3 of 247 selected" + Delete/Export/Assign buttons
- Inline editing: click-to-edit cells for quick corrections, expandable rows for multi-field, sidebar panel for complex records

### Real-Time Update Patterns
- **Number changes**: Smooth count-up/down animation (200–400ms)
- **List reordering**: Slide animation under 300ms
- **New data**: Subtle pulse/glow on changed metric
- **Status changes**: Color fade transition (not instant swap)
- All animations must respect prefers-reduced-motion
- Show "Last updated: X min ago" per-widget or dashboard-wide
- Sync status: green dot = live, yellow = stale, red = disconnected
- NEVER show blank dashboard — display last-known data with staleness indicator

### Charts & Visualization
- **Trend over time**: Line/area chart — NOT pie chart
- **Part of whole**: Donut chart, stacked bar — NOT 3D
- **Comparison**: Horizontal bar chart
- **Single value + progress**: Gauge, progress bar
- Max 5 data series per chart, label directly on chart, tooltips on hover
- Start Y-axis at 0 for bar charts, horizontal labels always
- Use sequential palette (light-to-dark one hue) for ordered data, categorical (distinct hues, max 5–7) for categories
- Reserve red=negative, green=positive — don't reuse for categories

### Cognitive Load Reduction
- **Whitespace**: Inner card padding 16–24px, gap between cards 16–24px, section spacing 32–48px, page margins 24–32px
- **Progressive disclosure**: Summary → Expanded → Detail → Record (each level adds detail, never forces it)
- High density ≠ clutter — use alignment, spacing, and typographic hierarchy to make density scannable

### Typography for Data
- Monospace or tabular-figure fonts for numeric columns
- Body: 14px minimum, Regular (400)
- Headers: 12–13px, Semi-Bold (600), uppercase or small-caps
- Truncate long text with ellipsis + tooltip — never wrap in condensed density

### Skeleton Loading (Not Spinners)
- Skeleton placeholders matching exact layout shape
- Each widget loads independently (progressive hydration)
- For waits >10s: add explanatory text

APPLY: Every dashboard metric has context (delta + sparkline + comparison). Every table column is aligned by data type. Every real-time update has animation. Cognitive overload is managed through progressive disclosure.`)
  }

  return sections.length > 0
    ? '\n\n' + sections.join('\n\n')
    : ''
}

export async function generateWebDesign(prompt, designTokens, currentTree, designBrief, qualityToggles, imageUrl) {
  const apiKey = process.env.OPENROUTER_API_KEY
  const model = (process.env.OPENROUTER_MODEL || '').trim() || 'google/gemini-3.1-pro-preview'

  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set')

  const qualitySections = buildQualitySections(qualityToggles, designTokens)
  const qualityChecklist = buildQualityChecklist(qualityToggles, designTokens)

  // System prompt: WEB_DESIGN_SYSTEM_PROMPT is the sole system prompt
  // Quality toggle sections inject before it
  let systemPrompt = qualitySections
    ? qualitySections + '\n\n' + WEB_DESIGN_SYSTEM_PROMPT
    : WEB_DESIGN_SYSTEM_PROMPT

  let userContent
  if (imageUrl) {
    const textPart = assembleWebLayers({
      prompt,
      designBrief,
      currentTree: null,
      qualityChecklist,
      taskPrefix: 'You are looking at a wireframe or low-fidelity sketch. Use it ONLY to understand the screen structure and content — do NOT copy its visual style. Translate it into a production-quality Avontus design using the design system rules above. Apply the full brand: frosted glass app bar, DM Sans font, Avontus blue (#0005EE), elevated cards, proper spacing.',
      screenArchetypes: SCREEN_ARCHETYPES,
      goldExamples: GOLD_EXAMPLES,
    })
    userContent = [
      { type: 'text', text: textPart },
      { type: 'image_url', image_url: { url: imageUrl } },
    ]
  } else {
    userContent = assembleWebLayers({
      prompt, designBrief, currentTree, qualityChecklist,
      screenArchetypes: SCREEN_ARCHETYPES,
      goldExamples: GOLD_EXAMPLES,
    })
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent },
  ]

  let text = ''
  const webAttempts = model.startsWith('anthropic/') ? 1 : 2
  for (let attempt = 0; attempt < webAttempts; attempt++) {
    const { response } = await openRouterWithFallback(apiKey, model, messages, 12000)
    const data = await response.json()
    text = extractTextFromContent(data.choices?.[0]?.message?.content)
    if (text) break
    console.warn(`Web design attempt ${attempt + 1}: empty response, retrying...`)
  }

  if (!text) throw new Error('Empty response from AI for web design')

  const parsed = extractJsonObject(text)
  if (typeof parsed.html !== 'string') throw new Error('Web design response missing html field')

  return { html: parsed.html, css: typeof parsed.css === 'string' ? parsed.css : '' }
}

export async function generateWithClaude(prompt, designTokens, currentTree, designBrief, imageUrl, qualityToggles) {
  const apiKey = process.env.OPENROUTER_API_KEY
  const model = (process.env.OPENROUTER_MODEL || '').trim() || 'google/gemini-3.1-pro-preview'

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set')
  }

  let userContent
  let tokenLimit = 16384

  if (imageUrl) {
    // Wireframe import mode: multimodal (image + text)
    tokenLimit = 16384
    const textPart = buildWireframeMessage(prompt, designTokens, designBrief)
    userContent = [
      { type: 'text', text: textPart },
      { type: 'image_url', image_url: { url: imageUrl } },
    ]
  } else {
    userContent = buildUserMessage(prompt, designTokens, currentTree, designBrief, qualityToggles)
  }

  const qualitySections = buildQualitySections(qualityToggles, designTokens)
  // Inject quality sections before IMPORTANT RULES so they don't get buried at the tail
  const systemPrompt = qualitySections
    ? SYSTEM_PROMPT.replace('\n\n## IMPORTANT RULES', qualitySections + '\n\n## IMPORTANT RULES')
    : SYSTEM_PROMPT

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent },
  ]

  let text = ''
  const treeAttempts = model.startsWith('anthropic/') ? 1 : 2
  for (let attempt = 0; attempt < treeAttempts; attempt++) {
    const { response } = await openRouterWithFallback(apiKey, model, messages, tokenLimit)
    const data = await response.json()
    text = extractTextFromContent(data.choices?.[0]?.message?.content)
    if (text) break
    console.warn(`Attempt ${attempt + 1}: empty response from provider, retrying...`)
  }

  if (!text) {
    throw new Error('Empty response from AI after retries. Please try again.')
  }

  const parsed = extractJsonObject(text)
  const { tree, repairs } = repairComponentTree(parsed)
  validateTreeStrict(tree)

  if (repairs.length > 0) {
    console.warn('Applied schema repairs to generated tree:', repairs.slice(0, 8))
  }


  return tree
}

function buildWireframeMessage(prompt, designTokens, designBrief) {
  return `Design tokens: ${JSON.stringify(designTokens)}

Brand Style Guide:
${AVONTUS_BRAND_GUIDE}

Business design brief:
${JSON.stringify(designBrief || {}, null, 2)}

## WIREFRAME & SKETCH CONVERSION TASK

You are looking at a wireframe, Balsamiq mockup, hand-drawn sketch, or low-fidelity design. Your job is to produce a production-quality Uno Platform component tree that faithfully implements the layout and intent of the sketch.

---

### STEP 1 — READ THE SKETCH SYSTEMATICALLY

Before generating any JSON, analyze the image:
1. **Scope**: Is this a full mobile screen, a web page, a single dialog, or just a component?
2. **Regions**: Identify the top bar, scrollable content area, bottom bar, sidebars, and overlays.
3. **Elements**: List every distinct UI element — fields, buttons, lists, cards, images, labels.
4. **Hierarchy**: How are elements grouped? Which are inside which containers?
5. **Labels**: Note every text string exactly as written — you will preserve it verbatim.

---

### STEP 2 — DECODE WIREFRAME CONVENTIONS

If this is a **Balsamiq** or similar low-fidelity wireframe, apply these decoding rules:

| Wireframe element | Map to |
|---|---|
| Dashed/dotted rectangle | Card Outlined or Border container |
| Rectangle with X across it (image placeholder) | Image component |
| Squiggly underlined text | TextBlock (treat as readable text content) |
| Horizontal lines (hairlines) | Divider |
| Gray filled rectangle with no text | Image placeholder |
| "Lorem ipsum" / dummy text | Replace with realistic Avontus Quantify data |
| "[Label]" / "(placeholder)" text | Replace with real content appropriate to context |
| Low-fidelity icon scribble | Map to nearest Glyph value |
| Rounded rectangle with text inside (action) | Button |
| Rounded rectangle with text inside (data) | Card or TextBlock |
| Input field with label above | TextBox with Header property |
| Checkbox squares | CheckBox |
| Circle radio buttons | RadioButton |
| On/off lever | ToggleSwitch |
| Progress/loading bar | ProgressBar |
| Tab row | Tabs |
| Pill-shaped row of options | SegmentedButton |
| Small pill labels | Chip (Assist/Filter/Input/Suggestion) |
| Scrollable list of rows | ScrollViewer > ListView > Card children |
| Grid of cards/cells | GridView |
| Big circle button (bottom-right) | FloatingActionButton |
| Bottom tab row | BottomNavigationBar |
| Left sidebar rail | NavigationRail |
| Left panel drawer | NavigationDrawer |

---

### STEP 3 — MAP TOOLBAR PATTERN (MANDATORY)

Identify the exact toolbar pattern from the sketch:

- **X (close) on left + checkmark on right** → Edit mode: NavigationBar MainCommand="Close", children: [Icon Glyph="Check"]
- **X on left + checkmark + 3-dot on right** → Edit mode with overflow: children: [Icon Glyph="Check", Icon Glyph="MoreVertical"]
- **Back arrow (←) on left** → Read-only mode: NavigationBar MainCommand="Back"
- **Back arrow + 3-dot on right** → Read-only with overflow: children: [Icon Glyph="MoreVertical"]
- **Error/warning icon near toolbar** → Add Icon with Glyph="XCircle" Foreground="#D32F2F" or Glyph="AlertTriangle" Foreground="#F9A825"
- **No toolbar** → Do not add NavigationBar (e.g. sign-in screens)

---

### STEP 4 — SCOPE HANDLING

- **Multiple screens side by side**: Pick the MOST COMPLETE state and convert only that one.
- **Single component** (dialog, form section, toolbar only): Wrap in a Page root but do NOT invent surrounding UI.
- **Full screen**: Convert every visible element.

---

### STEP 5 — APPLY & UPGRADE

Apply the Avontus design system on top of the sketch's structure:

1. **Preserve all original labels verbatim** — every button caption, field header, section title exactly as written in the sketch.
2. **Preserve spatial layout** — side-by-side elements → StackPanel Orientation="Horizontal". Stacked → StackPanel vertical.
3. **Replace all placeholder content** with real Avontus Quantify data: reservation IDs (DEL-00756), company names (Johnson Construction), product codes (SCF-4824), branch offices (New York Branch).
4. **Apply typography scale**: HeadlineMedium/HeadlineSmall for page titles, TitleSmall for section headers, BodyMedium for data, LabelSmall for metadata.
5. **Add spacing rhythm**: StackPanel Spacing="12", Padding="16" on page content.
6. **Choose card styles intentionally**: Elevated for featured content, Outlined for list items, Filled for status areas.
7. **Make every button meaningful**: Filled for primary CTA, Outlined for secondary, Text for ghost actions.

---

${prompt ? `### USER CONTEXT\n"${prompt}"\n` : ''}
Generate the complete component tree now.`
}

function buildQualityChecklist(toggles, designTokens) {
  if (!toggles || typeof toggles !== 'object') return ''
  const t = designTokens || {}
  const items = []

  // Foundation
  if (toggles.avontusBrand) {
    items.push('• Avontus Brand: Use Avontus Blue #0005EE for primary actions. DM Sans typography. 107° motif on hero screens. Navy #062175 for deep contrast. Teal #009B86 for success. Yellow #FFD91A NEVER as background/text. Brand-blue-tinted shadows. Confident, forward-looking copy voice.')
  }
  if (toggles.tokenEnforcement) {
    items.push(`• Token Enforcement: action=${t.primaryColor || '#6750A4'}, heading=${t.colors?.onSurface || '#1C1B1F'}, caption=${t.colors?.onSurfaceVariant || '#49454F'}, page bg=${t.backgroundColor || '#FFFFFF'}. Use role assignments, never raw hex guesses. No blue/Material defaults. If tokens missing → neutral white/gray.`)
  }
  if (toggles.componentRegistry) {
    items.push('• Components: Map every UI need to the correct typed component. Need button → Button with Style. Need input → TextBox with Header. Never raw unstyled primitives.')
  }
  // Design System
  if (toggles.designDna) {
    items.push('• Design DNA: Before generating, analyze the design tokens — typography scale, color ratios, spacing density, card treatment, icon style. Then match detected patterns exactly throughout.')
  }
  if (toggles.designSystem) {
    items.push('• Design System: All spacing in multiples of 4px. Interactive elements need default+hover+focus+disabled+error states. ONE Filled button per action group. Three-tier tokens. Atomic design hierarchy. STRICTLY follow pre-loaded HTML patterns for inputs, toggles, icons, list items.')
  }
  if (toggles.materialDesign) {
    items.push('• Material Design 3: HCT dynamic color, tonal palettes, 5 button variants, MD3 type scale, 4dp grid, responsive breakpoints, state layers. Touch targets ≥48dp. No hardcoded colors. Dark mode support.')
  }
  // Visual Quality
  if (toggles.visualExcellence) {
    items.push('• Visual Excellence: Look crafted, not generated. Intentional depth. Micro-spacing tight within groups, generous between. NO Inter/Roboto/Arial. No flat solid backgrounds. 1+ unexpected visual choice. 3+ distinctive choices per screen.')
  }
  if (toggles.typography) {
    items.push('• Typography: Max 3–4 font sizes per screen. Body line-height 1.5–1.7. Headings 1.1–1.3. One weight contrast (semibold heading vs regular body). Labels/captions must visually recede.')
  }
  if (toggles.designStandards) {
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
    items.push('• Microcopy: Every button starts with a specific verb ("Save Order" not "Submit", "Create Shipment" not "Process"). Empty states explain why + what to do next. Error messages describe the fix without blaming. Placeholders show format examples, never act as labels. Status labels use human language (not "PENDING", "STATUS: 1").')
  }
  if (toggles.accessibility) {
    items.push('• Accessibility: CRITICAL — dark backgrounds MUST use white/light text. Avontus Blue / Navy / Teal backgrounds → white text only. Dark text on dark colors is FORBIDDEN. 4.5:1 minimum contrast for all text. 44px touch targets. Color never the only error/status signal — always pair with text or icon.')
  }
  if (toggles.dataHeavyDesign) {
    items.push('• Data-Heavy Design: 5-metric rule for dashboards. KPI cards with delta+sparkline+context. Tables: right-align numbers, sticky headers, 3 density tiers. Real-time count animations. Progressive disclosure.')
  }

  if (items.length === 0) return ''
  return `\n\nActive quality requirements — apply ALL of these:\n${items.join('\n')}`
}

function buildUserMessage(prompt, designTokens, currentTree, designBrief, qualityToggles) {
  let msg = `Design tokens: ${JSON.stringify(designTokens)}\n\n`

  msg += `Brand Style Guide:\n${AVONTUS_BRAND_GUIDE}\n\n`

  if (designBrief && typeof designBrief === 'object') {
    msg += `Business design brief:\n${JSON.stringify(designBrief, null, 2)}\n\n`
  }

  if (currentTree) {
    msg += `Current screen (modify this):\n${JSON.stringify(currentTree, null, 2)}\n\n`
    msg += `Modification request: ${prompt}`
  } else {
    msg += `Create a screen: ${prompt}`
  }

  // Inject screen archetype spec for structural guidance (tree generation)
  const archetype = detectArchetype(prompt)
  if (archetype && SCREEN_ARCHETYPES[archetype]) {
    msg += `\n\n${SCREEN_ARCHETYPES[archetype]}`
  }

  msg += buildQualityChecklist(qualityToggles, designTokens)

  // Hidden design philosophy — elevates quality silently
  msg += '\n' + DESIGN_PHILOSOPHY

  return msg
}
