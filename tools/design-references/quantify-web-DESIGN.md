# Quantify Web — Landing Page Design System

Scope: Marketing site, landing pages, product pages only.
NOT for app UI — the app uses the PROBE design language in `avontus-brand-guide.js`.

Inspired by: Cotool.ai editorial confidence + Quantify PROBE identity
Category: B2B Enterprise SaaS / Scaffolding & Equipment Management

---

## 1. Visual Theme & Atmosphere

Quantify is enterprise scaffolding software built for the construction industry — a sector defined by precision, physical weight, and structural integrity. The landing page should feel exactly that: **built, not decorated**. No soft gradients, no stock photography warmth. The aesthetic is a construction blueprint reimagined as a premium product site.

The core move borrowed from Cotool: **use the brand blue as a total environment**, not just as button accent. Sections alternate between white, brand blue (`#0A3EFF`), and near-black in a deliberate rhythm — the blue section feels like a steel beam running through the page. Against it, white Switzer headlines at large sizes with tight negative tracking project industrial confidence.

The secondary move: **introduce a serif italic as an editorial emphasis technique** on key phrases. Quantify's sans-serif is Switzer — precise, geometric, Swiss. For selected highlight words in headlines ("every scaffold", "zero delays", "one platform"), a serif italic creates the same contrast Cotool uses between suisseIntl and moderatSerif. This is a print editorial technique that elevates the design above generic SaaS templates.

Everything else stays PROBE: 0px corners, flat color, no gradients, no decorative shadows.

**Key Characteristics:**
- `#0A3EFF` used as full-bleed section backgrounds — brand as environment, not accent
- Switzer (geometric sans) as the primary workhorse font
- Serif italic (DM Serif Display italic) for 1–3 key emphasis phrases per page
- Sharp 0px corners on ALL containers — non-negotiable PROBE identity
- Section rhythm: white → blue → white → dark — structural, load-bearing
- Flat surfaces — depth via color contrast, not shadows
- Weight 500 for all display text (Switzer's medium is the signature)
- Negative letter-spacing at every display size — the tighter the bigger

---

## 2. Color Palette & Roles

### Primary Blues
- **Brand Blue** (`#0A3EFF`): Full-bleed hero sections, primary CTAs, active elements. The dominant environment color — used for whole sections, not sprinkled.
- **Blue Medium** (`#6F9DFF`): Hover states, secondary highlights, icon fills on blue backgrounds.
- **Blue Dark** (`#10296E`): Dark blue sections (alternative to near-black), deep callout backgrounds.
- **Blue Lightest** (`#E8EEFF`): Tinted surface for feature callouts on white sections. Tag backgrounds.
- **Blue 200** (`#9DB5FF`): Subtle accent on off-white — feature card borders, pill backgrounds.

### Neutral Scale (pure gray — no blue tint)
- **White** (`#FFFFFF`): Primary page background, text on blue/dark sections, card surfaces.
- **Off-White** (`#F8F8F8`): Alternating section backgrounds, social proof strips.
- **Light Gray** (`#F4F4F4`): Feature card backgrounds, container fills.
- **Border Gray** (`#E2E2E2`): Dividers, card borders, structural lines.
- **Secondary Text** (`#878787`): Body descriptions, metadata, captions.
- **Primary Text** (`#202020`): All headlines and primary copy on light backgrounds. Near-black, not pure black.

### Dark
- **Near-Black** (`#1A1A1A`): CTA sections, footer. Not pure black — retains warmth.

### Semantic (for feature copy only — not UI decoration)
- **Success** (`#22C55E`): Checkmarks in feature lists only.
- **Error** (`#E64059`): Not used on landing pages.

### What's not here
No orange. No gradients. No purple. No teal. The palette is **blue + neutral grays + near-black**. This restraint is the brand.

---

## 3. Typography Rules

### Font Families
- **Primary**: `Switzer`, fallbacks: `"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif`
  Geometric Swiss-influenced sans. Clean, tight, industrial. Loaded from Fontshare.
- **Serif accent** (web landing only): `"DM Serif Display"`, italic weight only.
  Used exclusively for 1–3 key phrases per page as editorial emphasis. Never for body copy. Load from Google Fonts (italic only).
- **Mono**: `"JetBrains Mono"` for technical labels, version numbers, data callouts.

### The Editorial Technique
The key landing page typographic move: **Switzer for the sentence, serif italic for the key noun/phrase**. Examples:
- "The scaffold management platform built for *the field.*"
- "From reservation to return — *zero paperwork.*"
- "Every scaffold. Every job site. *One platform.*"

The serif italic phrase appears inside the headline, inline — not as a separate element. It signals: "this word matters." This technique lifts the design above generic enterprise SaaS without breaking the industrial identity.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|---|
| Hero Display | Switzer | 76px | 500 | 1.0 | -0.04em | Largest headlines only |
| Hero Serif Phrase | DM Serif Display | 76px | 400 italic | 1.0 | -0.04em | Inline emphasis within hero |
| Section H2 | Switzer | 49px | 500 | 1.1 | -0.04em | Feature section titles |
| Section Serif Phrase | DM Serif Display | 49px | 400 italic | 1.1 | -0.04em | Inline emphasis — max once per section |
| H3 | Switzer | 39px | 500 | 1.1 | -0.02em | Sub-section headers |
| H4 | Switzer | 31px | 500 | 1.1 | -0.02em | Card titles, callout heads |
| Body Large | Switzer | 20px | 400 | 1.5 | -0.02em | Hero subtitle, section intro copy |
| Body | Switzer | 16px | 400 | 1.4 | -0.02em | Standard paragraph text |
| UI / Nav | Switzer | 14px | 400 | normal | -0.01em | Navigation links, button labels |
| Caption | Switzer | 13px | 400 | 1.3 | -0.01em | Fine print, timestamps, metadata |
| Technical | JetBrains Mono | 13px | 400 | 1.4 | normal | Version numbers, data labels, code |

### Principles
- **500 is the only display weight** — Switzer Medium for every headline. Never 600 or 700.
- **Progressive negative tracking** — -0.04em at 76/49px, -0.02em at 39/31px, -0.01em below 20px.
- **Serif only italic** — DM Serif Display is never used upright. Italic only, inline only, sparingly.
- **No all-caps** — sentence case everywhere.
- **Left-aligned default** — centered only in full-bleed color sections.

---

## 4. Component Stylings

### Buttons

**Primary (Blue Fill)**
- Background: `#0A3EFF`
- Text: `#FFFFFF`
- Padding: `12px 24px`
- Border-radius: `0px`
- Font: Switzer 16px weight 400
- Hover: `#0835D6`
- Use: "Request demo", "Get started", "See pricing"

**Secondary (Outlined)**
- Background: transparent
- Text: `#0A3EFF`
- Border: `1px solid #0A3EFF`
- Padding: `12px 24px`
- Border-radius: `0px`
- Hover: `background: #E8EEFF`
- Use: "Learn more", "View docs"

**Ghost on Blue Background**
- Background: transparent
- Text: `#FFFFFF`
- Border: `1px solid rgba(255,255,255,0.4)`
- Padding: `12px 24px`
- Border-radius: `0px`
- Hover: `background: rgba(255,255,255,0.1)`
- Use: Secondary CTAs within blue sections

**Dark Fill**
- Background: `#202020`
- Text: `#FFFFFF`
- Padding: `12px 24px`
- Border-radius: `0px`
- Use: CTAs in near-black sections

### Navigation
- Fixed header, white background, `border-bottom: 1px solid #E2E2E2`
- Logo: Quantify wordmark left-aligned
- Nav links: Switzer 14px, `#202020`, center-aligned
- CTA: Primary blue button right-aligned
- No blur backdrop — stays crisp and flat
- Mobile: hamburger, full-width drawer

### Cards / Feature Blocks
- Background: `#F4F4F4` or `#FFFFFF`
- Border: `1px solid #E2E2E2`
- Border-radius: `0px`
- Padding: `32px`
- Shadow: none
- Title: Switzer H4 (31px, weight 500, `#202020`)
- Body: Switzer Body (16px, weight 400, `#878787`)

### Feature List Items
- Icon: `#22C55E` checkmark
- Text: Switzer 16px, `#202020`
- Spacing: `12px` between items

### Social Proof Bar
- Background: `#F8F8F8`
- `border-top: 1px solid #E2E2E2`, `border-bottom: 1px solid #E2E2E2`
- Text: "Trusted by scaffold teams at:" — Switzer 13px, `#878787`
- Logos: monochrome, `#B5B5B5` fill

### Data / Stat Callouts
- Number: Switzer 49px weight 500, `#0A3EFF`
- Label: Switzer 16px weight 400, `#878787`
- Background: `#E8EEFF`
- Accent: `border-left: 3px solid #0A3EFF` — the only decorative accent allowed
- Border-radius: `0px`
- Padding: `24px`

### Section Dividers
- `1px solid #E2E2E2` between white/gray sections only
- No divider between color-block sections — the color change is the divider

---

## 5. Layout Principles

### Spacing System
| Value | Use |
|---|---|
| 8px | Component internal micro-spacing |
| 12px | Text groups (heading + body gap) |
| 16px | Grid gutters, button row gaps |
| 24px | Card internal padding (mobile) |
| 32px | Card internal padding (desktop), section header to content |
| 48px | Between major content blocks within a section |
| 80px | Section vertical padding (desktop) |
| 120px | Hero vertical padding |

### Grid & Structure
- Max content width: `1200px`, centered
- Content padding: `16px` mobile, `40px` tablet, `80px` desktop
- Feature sections: 2-column, text + screenshot (or reversed)
- Stat sections: 3–4 column grid of callout numbers
- Full-width color sections: background is unconstrained, content inside is max-width

### Section Rhythm (top to bottom)
1. **Nav**: White, fixed, 1px bottom border
2. **Hero**: Full-bleed `#0A3EFF`, centered, serif phrase in headline
3. **Social proof**: `#F8F8F8` strip, customer logos
4. **Feature A**: White, 2-col: text left, screenshot right
5. **Feature B**: `#F4F4F4`, reversed: screenshot left, text right
6. **Stats**: White, 4-col stat callouts with blue numbers
7. **Feature C**: Full-bleed `#10296E`, white text, key benefit statement
8. **Testimonials**: `#F8F8F8`, quote cards
9. **CTA**: Full-bleed `#1A1A1A`, large headline, single button
10. **Footer**: `#1A1A1A`, white text, nav links

### Whitespace Philosophy
**Section breathing room, not component breathing room.** Elements sit tightly within their section (12–16px gaps), but sections have generous vertical padding (80px). Matches how construction drawings work: dense callouts within open space.

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat (0) | No shadow | Most surfaces |
| Structural (1) | `1px solid #E2E2E2` | Cards, containers, dividers |
| Accent (2) | `border-left: 3px solid #0A3EFF` | Stat callouts, pull quotes |
| Section contrast | Full-bleed color change | Primary depth mechanism |

**Zero box-shadows.** Depth is communicated through background color contrast between sections and 1px structural borders. This is PROBE identity applied to marketing.

---

## 7. Do's and Don'ts

### Do
- Use `#0A3EFF` as full-bleed section backgrounds — not just buttons
- Mix Switzer + DM Serif Display italic inline for 1–2 key phrases per page
- Keep `border-radius: 0px` on every element — zero exceptions on landing pages
- Alternate sections: white → blue → gray → dark for structural rhythm
- Use `border-left: 3px solid #0A3EFF` as the only decorative accent
- Secondary copy under headlines should be `#878787`, not `#202020`
- Weight 500 for all headlines — Switzer Medium is the ceiling
- Trust color blocks for depth — no shadows

### Don't
- Don't add border-radius to any element
- Don't use DM Serif Display upright or in body copy — italic only, inline only
- Don't add gradients — flat blue or flat dark, nothing in between
- Don't use more than 2–3 blue elements per white section
- Don't add decorative illustrations, blob shapes, or icon grids
- Don't use pure black `#000000` — `#202020` is the darkest
- Don't add backdrop-blur to the nav
- Don't use font weight 600 or 700

---

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile | <640px | Single column, 40–48px hero, stacked CTAs |
| Tablet | 640–1024px | 2-column begins, 56px hero |
| Desktop | >1024px | Full layout, 76px hero |

### Collapsing Strategy
- Hero: 76px → 56px → 40px. Serif italic phrase stays inline at all sizes.
- Nav: horizontal → hamburger drawer at 768px
- Feature 2-cols: side-by-side → stacked (screenshot below text on mobile)
- Stat grid: 4-col → 2-col → 1-col
- Section padding: 80px → 48px on mobile
- Buttons: inline pair → stacked full-width on mobile

---

## 9. Agent Prompt Guide

### Quick Color Reference
- Brand blue (full section bg + CTAs): `#0A3EFF`
- Blue dark (alt section): `#10296E`
- Blue tint (stat/tag bg): `#E8EEFF`
- Page bg white: `#FFFFFF`
- Page bg off-white: `#F8F8F8`
- Card bg: `#F4F4F4`
- Border: `#E2E2E2`
- Primary text: `#202020`
- Secondary text: `#878787`
- CTA / footer section bg: `#1A1A1A`
- White text (on blue/dark): `#FFFFFF`
- Accent only: `border-left: 3px solid #0A3EFF`

### Example Component Prompts
- "Hero section, full-bleed `#0A3EFF`, 120px vertical padding. Centered headline in Switzer 76px weight 500 white, letter-spacing -0.04em: 'The scaffold management platform built for' then ' *the field.*' in DM Serif Display italic 76px white. Subtitle 20px Switzer 400, `rgba(255,255,255,0.75)`, max-width 600px. Two buttons side by side: primary ghost (`border: 1px solid rgba(255,255,255,0.4)`, white text, 0px radius) and text link in white."
- "Feature section, white bg, 80px vertical padding. 2-column: Left has H3 39px Switzer 500 `#202020` -0.02em tracking, body 16px 400 `#878787`, feature checklist with `#22C55E` icons. Right has product screenshot in `0px` radius container, `1px solid #E2E2E2` border."
- "Stats section, white bg, 80px padding. 4-column grid. Each cell: `#E8EEFF` bg, `border-left: 3px solid #0A3EFF`, `0px` radius, 24px padding. Number: Switzer 49px 500 `#0A3EFF`. Label: 16px 400 `#878787`."
- "CTA section, full-bleed `#1A1A1A`, 80px padding. Centered H2 49px Switzer 500 white -0.04em: 'Ready to run every scaffold *by the numbers?*' in DM Serif Display italic on the key phrase. Body 20px 400 `rgba(255,255,255,0.6)`. Single button: `#0A3EFF` bg, white text, 0px radius, 12px 24px padding."

### Iteration Guide
1. Decide section color before designing content: white / blue / off-white / dark — one of these four only.
2. Find the 3–5 most important words in each hero/section headline. Set those in DM Serif Display italic.
3. 0px corners are non-negotiable. If anything is rounded, it's wrong.
4. `#0A3EFF` belongs at full section scale once per page, not scattered as small accents.
5. `border-left: 3px solid #0A3EFF` is the only decorative element — use it on stat callouts and pull quotes.
6. Headlines use `#202020`, all body copy under them uses `#878787`. Never the other way.
7. Load DM Serif Display italic-only from Google Fonts (`ital,wght@1,400`).
