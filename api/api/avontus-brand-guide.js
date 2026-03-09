// Avontus Brand Identity Style Guide
// Derived from official Brand Identity Guidelines JUL 2025
// Combined with Material Design 3 principles for Uno Platform output

export const AVONTUS_BRAND_GUIDE = `

## AVONTUS BRAND IDENTITY STYLE GUIDE

This style guide governs ALL generated UI. Every screen must reflect the Avontus brand identity
layered on top of Material Design 3 components and patterns.

---

### 1. COLOR SYSTEM

#### Primary Brand Color — Avontus Blue
- **Primary**: #0005EE (Avontus Blue — the cornerstone of the brand)
- **Primary tint (light)**: #678DF4 — for hover states, light accents, disabled fills
- **Primary shade (medium)**: #0004B3 — for pressed states, active elements
- **Primary shade (dark)**: #000377 — for high-contrast text on light surfaces

#### Secondary Palette
Use these to extend visual range. Never use as primary or dominant colors.

| Name          | Hex       | Usage                                                    |
|---------------|-----------|----------------------------------------------------------|
| Navy Blue     | #062175   | Deep backgrounds, dark headers, contrast surfaces        |
| Light Blue    | #40ABFF   | Info states, links, secondary actions, data highlights   |
| Teal          | #009B86   | Success states, positive indicators, confirmations       |
| Green         | #6BE09E   | Success badges, completed status, positive feedback      |
| Yellow        | #FFD91A   | Utilitarian ONLY — focus callouts, attention markers     |

#### Yellow Usage Restrictions
Yellow (#FFD91A) is strictly utilitarian:
- OK: Warning icons, attention badges, small highlight accents
- NEVER: Background color, paragraph text, body text, primary buttons

#### Semantic Colors
| Role          | Hex       | Icon Glyph       |
|---------------|-----------|-------------------|
| Error         | #D32F2F   | XCircle           |
| Warning       | #F9A825   | AlertTriangle     |
| Info          | #1976D2   | Info              |
| Success       | #009B86   | Check             |

#### Surface & Text
| Role              | Hex       |
|-------------------|-----------|
| Background        | #FFFFFF   |
| Surface           | #FFFFFF   |
| Surface variant   | #F5F5F5   |
| Border / Divider  | #E0E0E0   |
| Text primary      | #1C1B1F   |
| Text secondary    | #49454F   |
| Text disabled     | #1C1B1F at 38% opacity |
| Link text         | #0005EE (underlined) |

#### Color Application Hierarchy
1. **Avontus Blue (#0005EE)**: Primary actions, key CTAs, selected states, active navigation
2. **Navy Blue (#062175)**: App bars in dark mode, section headers on dark surfaces
3. **Light Blue (#40ABFF)**: Secondary actions, info badges, data visualization accents
4. **Teal (#009B86)**: Success confirmations, positive status indicators
5. **White (#FFFFFF)**: Default backgrounds, card surfaces
6. **Neutrals (#1C1B1F → #49454F → #E0E0E0)**: Text hierarchy, borders, dividers

---

### 2. TYPOGRAPHY

#### Primary Typeface: Neue Helvetica (Segoe UI as system fallback)
Avontus uses Neue Helvetica for all communications. For digital/cross-platform,
use Segoe UI as the closest system substitute.

#### Weights Used
| Weight          | Use Case                                           |
|-----------------|-----------------------------------------------------|
| Light (300)     | Large display text, hero statements                 |
| Regular (400)   | Body text, descriptions, form labels                |
| Medium (500)    | Subtitles, section headers, emphasized labels       |
| Bold (700)      | Headlines, key data, primary CTAs, toolbar titles   |

#### Typography Scale (Material Design 3)
Apply these consistently. Every TextBlock MUST have a Style.

| Style           | Size | Weight | Line Height | Use                                        |
|-----------------|------|--------|-------------|--------------------------------------------|
| DisplayLarge    | 57   | 400    | 64          | Hero statements, splash screens            |
| DisplayMedium   | 45   | 400    | 52          | Page-level headlines                       |
| DisplaySmall    | 36   | 400    | 44          | Section-level headlines                    |
| HeadlineLarge   | 32   | 700    | 40          | Screen titles, primary headings            |
| HeadlineMedium  | 28   | 700    | 36          | Section headings                           |
| HeadlineSmall   | 24   | 700    | 32          | Card titles, dialog headers                |
| TitleLarge      | 22   | 500    | 28          | Toolbar titles, navigation labels          |
| TitleMedium     | 16   | 500    | 24          | List item primary text, form section labels|
| TitleSmall      | 14   | 500    | 20          | Compact headers, metadata labels           |
| BodyLarge       | 16   | 400    | 24          | Primary body text, descriptions            |
| BodyMedium      | 14   | 400    | 20          | Standard body text, form values            |
| BodySmall       | 12   | 400    | 16          | Secondary info, timestamps, captions       |
| LabelLarge      | 14   | 500    | 20          | Button text, tab labels, chip text         |
| LabelMedium     | 12   | 500    | 16          | Small button text, badge text              |
| LabelSmall      | 11   | 500    | 16          | Overline text, micro labels                |

#### Text Hierarchy Rules
- Screen must have clear visual hierarchy: one dominant headline, supporting body, tertiary metadata
- Never use more than 3 typography styles in a single card
- Data-heavy screens: use TitleSmall for labels, BodyMedium for values
- Always pair large text (Headline/Display) with a supporting BodyLarge or BodyMedium

---

### 3. SPACING & LAYOUT

#### Spacing Scale
| Token         | Value | Use                                                    |
|---------------|-------|--------------------------------------------------------|
| Page margin   | 32px  | Outer padding of all page content                      |
| Section gap   | 24px  | Between major content sections                         |
| Card gap      | 16px  | Between cards in a list                                |
| Element gap   | 16px  | Between form fields, between buttons                   |
| Internal pad  | 16px  | Inside cards, containers                               |
| Compact pad   | 8px   | Tight internal spacing (metadata rows, icon groups)    |
| Micro gap     | 4px   | Between icon and adjacent text, badge margins          |

#### Layout Principles
- **Generous whitespace**: Avontus brand is confident and grounded — let content breathe
- **Clear rhythm**: Consistent spacing creates the professional, reliable feel
- **Left-aligned content**: Forms, labels, and body text are always left-aligned
- **Center-aligned CTAs**: Primary action buttons are centered when they're the focal point
- **Full-width cards**: List cards span the available width, no floating narrow cards

#### Grid & Alignment
- Content areas use single-column layout for mobile
- Two-column layouts for tablet/desktop forms (label-value pairs)
- Cards in lists: full-width, consistent padding, consistent spacing
- Toolbar: always full-width, content centered, actions pinned to edges

---

### 4. COMPONENT STYLING

#### Buttons
| Style     | Use                                                | Background    | Text Color |
|-----------|----------------------------------------------------|---------------|------------|
| Filled    | Primary actions: "Sign in", "Save", "Ship"         | #0005EE       | #FFFFFF    |
| Outlined  | Secondary actions: "Connection...", "Test", "Cancel"| transparent   | #0005EE    |
| Text      | Tertiary: "About...", "Learn more", links           | transparent   | #0005EE    |
| Tonal     | Moderate emphasis: "Ship all", "Select all"         | #0005EE at 12%| #0005EE    |
| Elevated  | Floating secondary actions                          | #FFFFFF       | #0005EE    |

#### Cards
| Style     | Use                                                |
|-----------|----------------------------------------------------|
| Outlined  | List items, data cards, form sections (default)    |
| Elevated  | Featured content, key metrics, dashboard widgets   |
| Filled    | Grouped information, status summaries              |

#### Navigation Bar
- Background: white or surface color
- Title: TitleLarge, centered, color #1C1B1F
- Icons: 24px, color #1C1B1F
- Divider below: #E0E0E0

#### Chips
- Default: Outlined style
- Selected: Filled with Avontus Blue
- Use for filters, tags, categories

#### Toggle Switches
- Active track: #0005EE
- Header label above, left-aligned

#### Text Fields
- Outlined style (MD3 default)
- Header label above field
- Placeholder text in #49454F at 60% opacity
- Focus border: #0005EE
- Error border: #D32F2F

#### Dividers
- Color: #E0E0E0
- Used between content sections, never within tight groups

---

### 5. BRAND VOICE & CONTENT

#### Tone
Avontus brand voice is: Confident, Forward-Looking, Grounded, Optimistic, Energetic, Conversational.

#### UI Copy Guidelines
- **Confident**: Use direct language. "Sign in" not "Please sign in". "Ship reservation" not "Would you like to ship?"
- **Grounded**: Use specific, concrete language. Show real numbers, real names, real data.
- **Forward-looking**: Frame actions as progress. "Create reservation" not "New reservation form"
- **Conversational**: Avoid stiff corporate speak. "Something went wrong" not "An error has occurred"
- **Energetic**: Action-oriented labels. Verbs over nouns. "Ship" not "Shipment"

#### Terminology
- "Scaffold" = entire structure
- "Scaffolding" = individual pieces/components
- Labels: First character capitalized only ("Remote server" not "Remote Server")
- Destructive confirmations: Soft language ("Are you sure you would like to delete this item?")

---

### 6. GRAPHIC MOTIF & VISUAL IDENTITY

#### The 107-Degree Angle
The Avontus logo uses a distinctive 107-degree slanted angle. This motif carries through:
- Decorative dividers on splash/hero screens
- Background accent shapes where appropriate
- Creates visual energy and forward momentum

#### Logo Placement
- Logo in UI: Use Image component, minimum 180px width on screen
- Clear space: Maintain padding equal to the "A" height around the logo
- Never distort, recolor, outline, tilt, or add shadows to the logo

#### Iconography Style
- **Linear, not filled**: Icons use outlines and strokes, not solid fills
- **Light and structural**: Evokes scaffolding components
- **Multicolor accents**: Icons can use the secondary palette for emphasis
- **Consistent size**: 24px standard, 20px compact, 32px featured

---

### 7. ELEVATION & DEPTH

| Level   | Shadow                                    | Use                               |
|---------|-------------------------------------------|------------------------------------|
| Level 0 | none                                     | Flat surfaces, backgrounds         |
| Level 1 | 0 1px 2px rgba(0,0,0,0.12)             | Cards at rest, subtle lift         |
| Level 2 | 0 2px 6px rgba(0,0,0,0.15)             | Hovered cards, dropdowns           |
| Level 3 | 0 4px 12px rgba(0,0,0,0.18)            | FABs, modal surfaces               |
| Level 4 | 0 6px 16px rgba(0,0,0,0.22)            | Dialogs, overlays                  |
| Level 5 | 0 8px 24px rgba(0,0,0,0.28)            | Full-screen modals                 |

---

### 8. STATE LAYERS (Material Design 3)

| State    | Opacity | Description                              |
|----------|---------|------------------------------------------|
| Hover    | 8%      | Subtle overlay on interactive elements   |
| Focus    | 12%     | Visible ring/overlay for keyboard focus  |
| Pressed  | 12%     | Momentary feedback on tap/click          |
| Dragged  | 16%     | Active drag state                        |
| Disabled | 38%     | Content opacity when disabled            |
| Disabled container | 12% | Container opacity when disabled    |

---

### 9. SCREEN COMPOSITION RULES

#### Every Screen Must Have:
1. **Clear information hierarchy**: One primary heading, supporting content, actions
2. **Consistent navigation**: Toolbar follows one of the 3 patterns (Edit/Read-Only/Edit+Extra)
3. **Appropriate density**: Enterprise data screens can be denser, consumer-facing screens breathe more
4. **Realistic content**: Real names, addresses, numbers, dates — never placeholder text
5. **Branded feel**: Avontus Blue appears in primary actions and key interactive elements

#### Screen Structure (Top to Bottom):
1. Navigation Bar (toolbar)
2. Content area with page padding (32px)
3. Primary content / form / list
4. Actions (centered or right-aligned)
5. Footer (copyright, version info) when appropriate

#### Mobile Screens:
- Single column layout
- Full-width cards and inputs
- Bottom-anchored primary actions when possible
- ScrollViewer for content that exceeds viewport

#### Tablet/Desktop Screens:
- Two-column layouts for forms (label-value pairs)
- Side-by-side card grids
- More generous spacing (can increase by 50%)

---

### 10. DARK MODE CONSIDERATIONS

When generating dark-themed screens:
- Background: #121212 or #1C1B1F
- Surface: #1E1E1E
- Primary stays #0005EE (high contrast on dark)
- Text primary: #EEEEF0
- Text secondary: #8888A0
- Cards: use subtle elevation instead of borders
- Maintain the same brand color relationships

---

### 11. ACCESSIBILITY

- All text must meet WCAG 2.1 AA contrast ratio (4.5:1 for body, 3:1 for large text)
- Interactive elements: minimum 44x44px touch target
- Never rely on color alone to convey meaning — pair with icons and text
- Disabled states: 38% opacity + no pointer events
- Focus indicators: visible 2px outline in Avontus Blue

`

// Avontus brand color constants for programmatic use
export const AVONTUS_COLORS = {
  // Primary
  primary: '#0005EE',
  primaryLight: '#678DF4',
  primaryMedium: '#0004B3',
  primaryDark: '#000377',

  // Secondary
  navyBlue: '#062175',
  lightBlue: '#40ABFF',
  teal: '#009B86',
  green: '#6BE09E',
  yellow: '#FFD91A',

  // Secondary tints & shades
  navyBlueTint: '#384D91',
  navyBlueMid: '#051958',
  navyBlueDark: '#03113B',

  lightBlueTint: '#8CCDFF',
  lightBlueMid: '#3080BF',
  lightBlueDark: '#205680',

  tealTint: '#66C3B6',
  tealMid: '#007465',
  tealDark: '#004E43',

  greenTint: '#A6ECC5',
  greenMid: '#50A877',
  greenDark: '#36704F',

  // Semantic
  error: '#D32F2F',
  warning: '#F9A825',
  info: '#1976D2',
  success: '#009B86',

  // Surfaces
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  border: '#E0E0E0',

  // Text
  textPrimary: '#1C1B1F',
  textSecondary: '#49454F',
}
