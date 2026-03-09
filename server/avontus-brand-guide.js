// Probe Design Language — Quantify Brand Guide
// Sharp geometry, monochromatic blue, Switzer typeface

export const AVONTUS_BRAND_GUIDE = `

## QUANTIFY — PROBE DESIGN LANGUAGE

This style guide governs ALL generated UI. Every screen MUST reflect the Probe design language.
The Probe aesthetic is defined by: SHARP 0px corners, monochromatic blue, Switzer font, pure neutral grays, no decorative elements.

---

### 1. COLOR SYSTEM

#### Primary Blues
| Token | Value | Usage |
|-------|-------|-------|
| Blue Main | #0A3EFF | Primary buttons, CTAs, accent elements, links, active states |
| Blue Medium | #6F9DFF | Secondary accents, hover states, softer highlights |
| Blue Dark | #10296E | Dark sections, dark button fills, feature card backgrounds |

#### Grays (Pure Neutral — NO blue tint)
| Token | Value | Usage |
|-------|-------|-------|
| White | #FFFFFF | Page background, hero background, text on dark |
| Tinted White | #F8F8F8 | Alternating section backgrounds, subtle surface |
| Gray Extra Light | #F4F4F4 | Card backgrounds, containers |
| Gray Light | #E2E2E2 | Dividers, subtle borders |
| Gray Medium | #B5B5B5 | Placeholder text, disabled states |
| Gray Dark | #878787 | Secondary body text, metadata |
| Gray Extra Dark | #5F5F5F | Tertiary text |
| Light Black | #202020 | Primary text color, headings |

#### Semantic
| Role | Value |
|------|-------|
| Error | #E64059 |
| Success | #22C55E |
| Warning | #F9A825 |

#### Color Philosophy
- **No true black (#000)** — darkest color is #202020
- **Blue is the ONLY hue** — entire palette is monochromatic blue + neutrals + one red for errors
- **No gradients** — flat solid colors only
- **No CSS box-shadows** in the traditional sense — the design relies on flat color and borders for depth

---

### 2. TYPOGRAPHY

#### Font: Switzer (from Fontshare)
Two weights ONLY: Regular (400) and Medium (500). NEVER use bold (700), semibold (600), or light (300).

| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| H1 | 76px | 500 | 1em | -0.04em | Hero text only |
| H2 | 49px | 500 | 1.1em | -0.04em | Page titles |
| H3 | 39px | 500 | 1.1em | -0.02em | Section headers, dialog titles |
| H4 | 31px | 500 | 1.1em | -0.02em | Card titles, subsection headers |
| H5 | 25px | 500 | 1.1em | -0.02em | Toolbar text, list headers |
| H6 | 20px | 400 | 1.2em | -0.02em | Labels, navigation items |
| Body | 16px | 400 | 1.4em | -0.02em | Paragraph text |
| Small | 13px | 400 | 1.3em | -0.01em | Captions, helper text |

KEY RULES:
- All text uses TIGHT NEGATIVE letter-spacing
- All text left-aligned by default
- No uppercase transforms — all sentence case
- H1–H5 use weight 500, H6–Small use weight 400

---

### 3. SHAPE & CORNERS — THE DEFINING TRAIT

**border-radius: 0px is MANDATORY on ALL elements.**

This is the single most important visual rule. Sharp corners define the Probe aesthetic.
- Buttons: 0px border-radius
- Cards: 0px border-radius
- Inputs: 0px border-radius
- Containers: 0px border-radius
- Modals/dialogs: 0px border-radius
- ONLY exception: CTA components may use 2px radius

NEVER use rounded corners (4px, 8px, 12px, 9999px) on ANY element.

---

### 4. COMPONENT SPECS

#### Buttons
| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| Primary | #0A3EFF | #FFFFFF | none |
| Light | #F8F8F8 | #202020 | none |
| Dark | #202020 | #FFFFFF | none |
| Outlined | transparent | #0A3EFF | 1px solid #0A3EFF |

Specs: padding 8px 16px, border-radius 0px, Switzer Regular (400) 16px, gap 12px for icon+label.

#### Cards
- Background: #F4F4F4 or #FFFFFF
- Border-radius: 0px
- No box-shadow (use subtle border instead: 1px solid #E2E2E2)
- Padding: 24px

#### Text Fields (Outlined style)
- Border: 1px solid #E2E2E2
- Border-radius: 0px
- Focus border: #0A3EFF
- Label: floating label above field, Small style (13px), #0A3EFF when focused
- Background: #FFFFFF

#### App Bar / Top Bar
- Height: 56px
- Background: #FFFFFF
- Border-bottom: 1px solid #E2E2E2
- Title: H5 style (Switzer Medium 25px)
- Actions: icon buttons on right

---

### 5. SPACING & LAYOUT

| Gap | Usage |
|-----|-------|
| 4px | Between FAQ items, micro spacing |
| 8px | Benefits card internal, step items |
| 12px | Text group (heading + body) |
| 16px | Grid gutters, button row gaps, form field gaps |
| 24px | Section header to content |
| 32px | Feature card internal padding |
| 40px | Section outer padding |
| 48px | Between major sections |

Container max-width: 1200px, centered.
Content padding: 16px on mobile, 40px on desktop.

---

### 6. SCREEN COMPOSITION RULES

Every screen MUST:
1. Use 0px border-radius on ALL elements (sharp corners)
2. Use Switzer font (400 for body, 500 for headings)
3. Use #0A3EFF for primary actions only (max 2-3 blue elements per screen)
4. Use pure neutral grays for surfaces (#FFFFFF, #F8F8F8, #F4F4F4)
5. Use #202020 for primary text, #878787 for secondary text
6. Have clear 3-level visual hierarchy
7. Use realistic Quantify domain data (scaffolding, reservations, jobsites, equipment)
8. Have generous whitespace — the design should breathe
9. Use flat colors only — no gradients, no decorative shadows
10. Border dividers (1px solid #E2E2E2) instead of shadows for separation

`

// Probe brand color constants for programmatic use
export const AVONTUS_COLORS = {
  // Primary
  primary: '#0A3EFF',
  primaryLight: '#6F9DFF',
  primaryMedium: '#3A6BFF',
  primaryDark: '#10296E',

  // Blue scale
  blueLightest: '#E8EEFF',
  blue100: '#C5D4FF',
  blue200: '#9DB5FF',
  blue600: '#0835D6',
  blue700: '#062BB3',
  blueDarkest: '#0A1A4A',

  // Semantic
  error: '#E64059',
  warning: '#F9A825',
  info: '#0A3EFF',
  success: '#22C55E',

  // Surfaces (pure neutral gray)
  background: '#FFFFFF',
  surface: '#F8F8F8',
  surface2: '#F4F4F4',
  surface3: '#E2E2E2',
  outline: '#B5B5B5',
  outlineVariant: '#E2E2E2',
  border: '#E2E2E2',

  // Text
  textPrimary: '#202020',
  textSecondary: '#878787',
}
