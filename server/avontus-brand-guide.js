// Probe Design Language — Quantify Brand Guide
// Sharp geometry, monochromatic blue, Switzer typeface
// Combined with Material Design 3 principles for Uno Platform output

export const AVONTUS_BRAND_GUIDE = `

## QUANTIFY — PROBE DESIGN LANGUAGE STYLE GUIDE

This style guide governs ALL generated UI. Every screen must reflect the Probe design language
layered on top of Material Design 3 components and patterns.

---

### 1. COLOR SYSTEM

#### Primary Brand Color — Probe Blue
- **Blue Main**: #0A3EFF (Primary brand color — CTAs, links, active states, primary actions)
- **Blue Medium**: #6F9DFF (Secondary accent — hover states, tinted surfaces, illustrations)
- **Blue Dark**: #10296E (Deep accent — headers, high-contrast surfaces, authoritative elements)

#### Blue Scale
| Step     | Hex       | Usage                                          |
|----------|-----------|-------------------------------------------------|
| Lightest | #E8EEFF   | Containers, tinted backgrounds                  |
| 100      | #C5D4FF   | Light accents, hover backgrounds                |
| 200      | #9DB5FF   | Secondary fills, highlights                     |
| Medium   | #6F9DFF   | Secondary accent, illustrations                 |
| 400      | #3A6BFF   | Interactive mid-tones                           |
| Main     | #0A3EFF   | Primary actions, CTAs, links                    |
| 600      | #0835D6   | Pressed states                                  |
| 700      | #062BB3   | Active elements                                 |
| Dark     | #10296E   | Deep headers, dark surfaces                     |
| Darkest  | #0A1A4A   | Maximum contrast                                |

#### Gray Scale (Pure Neutral — No Blue Tint)
| Step   | Hex       | Usage                                            |
|--------|-----------|--------------------------------------------------|
| White  | #FFFFFF   | Default background                               |
| 50     | #F8F8F8   | Surface, subtle backgrounds                      |
| 100    | #EEEEEE   | Surface 2, card backgrounds                      |
| 200    | #D4D4D4   | Outline variant, subtle borders                  |
| 300    | #ABABAB   | Outline, dividers                                |
| 400    | #787878   | Secondary text, muted icons                      |
| 500    | #545454   | On Surface Variant, body text secondary           |
| 600    | #363636   | Strong secondary text                            |
| Black  | #202020   | On Surface, primary text, headings               |

#### Semantic Colors
| Role          | Hex       | Container   | On Container |
|---------------|-----------|-------------|--------------|
| Error         | #E64059   | #FFE5E9     | #5F1422      |
| Warning       | #F9A825   | #FFF3CD     | #5D4300      |
| Info          | #0A3EFF   | #E8EEFF     | #10296E      |
| Success       | #22C55E   | #DCFCE7     | #14532D      |

#### Surface & Text
| Role              | Hex       |
|-------------------|-----------|
| Background        | #FFFFFF   |
| Surface           | #F8F8F8   |
| Surface 2         | #EEEEEE   |
| Surface 3         | #D4D4D4   |
| On Surface        | #202020   |
| On Surface Variant| #545454   |
| Outline           | #ABABAB   |
| Outline Variant   | #D4D4D4   |
| Text primary      | #202020   |
| Text secondary    | #545454   |
| Link text         | #0A3EFF   |

---

### 2. TYPOGRAPHY

#### Primary Typeface: Switzer
Quantify uses Switzer as the primary typeface — a clean geometric sans-serif.
Fallback chain: "Switzer", "Helvetica Neue", Helvetica, Arial, sans-serif.

#### Weights Used
| Weight          | Use Case                                           |
|-----------------|-----------------------------------------------------|
| Regular (400)   | Body text, descriptions, form labels                |
| Medium (500)    | Headings, emphasized labels, buttons, navigation    |

**Important**: Only use weights 400 and 500. No light (300), semibold (600), or bold (700).

#### Typography Scale
| Style     | Size | Weight | Line Height | Letter Spacing | Use                                |
|-----------|------|--------|-------------|----------------|-------------------------------------|
| H1        | 76px | 500    | 1.05        | -0.04em        | Hero text, splash screens           |
| H2        | 49px | 500    | 1.1         | -0.04em        | Page titles, major sections         |
| H3        | 39px | 500    | 1.15        | -0.02em        | Section headers, dialog titles      |
| H4        | 31px | 500    | 1.2         | -0.02em        | Card titles, subsection headers     |
| H5        | 25px | 500    | 1.25        | -0.02em        | Toolbar text, list headers          |
| H6        | 20px | 500    | 1.3         | -0.02em        | Labels, tags, navigation items      |
| Body      | 16px | 400    | 1.5         | -0.02em        | Paragraph text, descriptions        |
| Small     | 13px | 400    | 1.45        | -0.01em        | Captions, timestamps, helper text   |

**Key**: All text uses tight negative letter-spacing for a modern, precise feel.

---

### 3. SHAPE & CORNERS

**0px border-radius is the universal default.** Sharp corners define the Probe aesthetic.

| Token         | Value   | Use                                      |
|---------------|---------|------------------------------------------|
| Default       | 0px     | ALL elements — cards, buttons, inputs, containers |
| Extra Small   | 0px     | Same as default                          |
| Small         | 0px     | Text fields, chips, small cards          |
| Medium        | 0px     | Cards, menus, dialogs                    |
| Large         | 0px     | Large cards, sheets, containers          |
| Extra Large   | 0px     | Modals, bottom sheets                    |
| Full          | 9999px  | ONLY for badges, dot indicators, avatars |

**Never use rounded corners** on buttons, cards, inputs, or containers. Only badges, dot indicators, and avatar circles use full rounding.

---

### 4. SPACING & LAYOUT

#### Spacing Scale
| Token    | Value | Use                                                    |
|----------|-------|--------------------------------------------------------|
| space-1  | 4px   | Micro gap — icon-text pairs, badge margins             |
| space-2  | 8px   | Compact padding — metadata rows, icon groups           |
| space-3  | 12px  | Tight element gap — between related items              |
| space-4  | 16px  | Standard element gap — form fields, buttons            |
| space-6  | 24px  | Section gap — between major content sections           |
| space-8  | 32px  | Page margin — outer padding of all page content        |
| space-10 | 40px  | Generous section spacing                               |
| space-12 | 48px  | Major section dividers                                 |

---

### 5. COMPONENT STYLING

#### Buttons (All 0px border-radius)
| Style     | Use                                                | Background    | Text Color |
|-----------|----------------------------------------------------|---------------|------------|
| Filled    | Primary actions: "Save", "Ship", "Confirm"         | #0A3EFF       | #FFFFFF    |
| Outlined  | Secondary actions: "Cancel", "Test", "Edit"         | transparent   | #0A3EFF    |
| Text      | Tertiary: "Learn more", links                       | transparent   | #0A3EFF    |
| Tonal     | Moderate emphasis: "Select all"                     | #0A3EFF at 12%| #0A3EFF    |
| Elevated  | Floating secondary actions                          | #FFFFFF       | #0A3EFF    |

#### Cards (All 0px border-radius)
| Style     | Use                                                |
|-----------|----------------------------------------------------|
| Outlined  | List items, data cards, form sections (default)    |
| Elevated  | Featured content, key metrics, dashboard widgets   |
| Filled    | Grouped information, status summaries              |

#### Text Fields
- Outlined style, 0px border-radius
- Focus border: #0A3EFF
- Error border: #E64059

---

### 6. ELEVATION & DEPTH

Brand-blue-tinted shadows:

| Level   | Shadow                                                                    | Use                               |
|---------|--------------------------------------------------------------------------|------------------------------------|
| Level 0 | none                                                                     | Flat surfaces, backgrounds         |
| Level 1 | 0 1px 3px rgba(10,62,255,0.06), 0 1px 2px rgba(0,0,0,0.04)           | Cards at rest, subtle lift         |
| Level 2 | 0 4px 12px rgba(10,62,255,0.08), 0 2px 4px rgba(0,0,0,0.04)          | Hovered cards, dropdowns           |
| Level 3 | 0 8px 24px rgba(10,62,255,0.10), 0 4px 8px rgba(0,0,0,0.05)          | FABs, navigation drawers           |
| Level 4 | 0 16px 40px rgba(10,62,255,0.12), 0 8px 16px rgba(0,0,0,0.06)        | Modals, elevated menus              |
| Level 5 | 0 24px 56px rgba(10,62,255,0.14), 0 12px 24px rgba(0,0,0,0.08)       | Dialogs, full-screen overlays       |

---

### 7. BRAND VOICE & CONTENT

#### Tone
Confident, Forward-Looking, Grounded, Optimistic, Energetic, Conversational.

#### UI Copy Guidelines
- **Confident**: Direct language. "Sign in" not "Please sign in"
- **Grounded**: Specific, concrete. Real numbers, names, data
- **Forward-looking**: Frame actions as progress
- **Conversational**: Avoid stiff corporate speak

---

### 8. SCREEN COMPOSITION RULES

#### Every Screen Must Have:
1. **Clear information hierarchy**: One primary heading, supporting content, actions
2. **0px border-radius everywhere**: Sharp corners on all elements except badges/avatars
3. **Realistic content**: Real names, addresses, numbers — never placeholder text
4. **Branded feel**: Probe Blue #0A3EFF in primary actions and interactive elements
5. **Switzer typeface**: Weight 400 for body, 500 for headings

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
  surface2: '#EEEEEE',
  surface3: '#D4D4D4',
  outline: '#ABABAB',
  outlineVariant: '#D4D4D4',
  border: '#ABABAB',

  // Text
  textPrimary: '#202020',
  textSecondary: '#545454',
}
