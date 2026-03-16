# Quantify Mobile POC — Screen Prompts

Context for ALL screens: This is Avontus Quantify, an enterprise scaffolding rental & equipment management app. Users are field workers (yard workers, delivery drivers, site supervisors) who work outdoors, often wearing gloves, with dirty/wet screens. Design for: large touch targets, high contrast, minimal cognitive load, fast task completion. This is NOT a consumer app — it's an operational tool used daily by power users who need speed and reliability.

---

## PROMPT 1: Login Screen

Build a Login screen for Quantify Mobile (390x844).

Layout from top to bottom:
- 80px spacer at top
- "Quantify" title text centered, 28px Switzer Semibold, dark gray (#202020)
- 40px gap
- Form section with 24px horizontal padding, 16px vertical gap between items:
  - TextBox component (Outlined, Enabled, Label=True, Populated=False, Placeholder=True, Multiline=False) with Label="Username" and Text="Enter username" — full width
  - PasswordBox component (Outlined, Leading=None) with Label="Password" and Text="Enter password" — full width
  - 8px gap
  - Horizontal row with 12px gap:
    - Button (Outlined, Enabled, Icon=False) with Label="Connection"
    - Button (Filled, Enabled, Icon=False) with Label="Sign In" — grows to fill remaining width
  - Text "Connected to https://mycompany.quantifycloud.com" in 12px Switzer Regular, gray (#737373)
- Flexible spacer (grows to push footer down)
- Footer section centered, 40px bottom padding:
  - Text "Version 1.2.3 | © 2008-2026 Avontus Software Corporation" in 11px gray (#ABABAB)
  - Text "About Quantify" in 13px Switzer Medium, blue (#0A3EFF)

UX rationale: Hick's Law — only 2 inputs and 2 clear actions. Fitts's Law — Sign In is the primary action and fills available width. Default Bias — connection is pre-configured. Progressive Disclosure — connection settings hidden behind secondary button.

---

## PROMPT 2: Connection Settings Screen

Build a Connection Settings screen for Quantify Mobile (390x844).

Layout from top to bottom:
- NavigationBar component (Content=Title) with Text="Connection Settings" — full width
- Divider component (Length=Full) — full width
- Content section with 24px horizontal padding, 24px top padding, 16px gap:
  - TextBox component (Outlined, Enabled, Label=True, Populated=True, Placeholder=False, Multiline=False) with Label="Remote server" and Text="myinstance.mycompany.com" — full width
  - Horizontal row with vertical centering:
    - Text "https://" in 14px gray (#737373)
    - Divider line (1px gray)
  - ToggleSwitch component (Enabled, Selected=True) — with label text "Use SSL" to the left
  - Divider (Full) — full width
  - 8px gap
  - Button (Outlined, Enabled, Icon=False) with Label="Test Connection" — full width
  - 16px gap
  - Warning card: frame with #FEF2F2 background, 12px corner radius, 16px padding, horizontal layout:
    - Text "⚠" in 16px #E64059
    - Text "Unable to connect to server" in 14px Switzer Medium #E64059

UX rationale: Default Bias — SSL on by default (secure). Cognitive Load — minimal fields, clear purpose. Progressive Disclosure — validation error only shown when relevant. Clear exit via NavigationBar back button.

---

## PROMPT 3: Home Screen

Build a Home screen for Quantify Mobile (390x844).

Layout from top to bottom:
- NavigationBar component (Content=Title) with Text="Home" — full width
- Divider (Full)
- Content section with no horizontal padding, vertical layout, 0 gap:
  - Hero section centered, 32px vertical padding:
    - Text "Quantify" in 24px Switzer Semibold, centered
    - Text "HELLO WORLD!" in 16px Switzer Medium, gray (#737373), centered
  - Divider (Full)
  - Navigation list — vertical, 0 gap, full width:
    - ListItem (Leading=False, Trailing=True, Primary Commands=False, Secondary Commands=False, State=Enabled) with Subtitle="Who Am I" — full width
    - Divider (Full)
    - ListItem (same variant) with Subtitle="Sample Form" — full width
    - Divider (Full)
    - ListItem (same variant) with Subtitle="Scan Barcode" — full width
    - Divider (Full)
  - 24px spacer
  - Barcode section with 20px horizontal padding, vertical, 12px gap:
    - Text "Barcode Result" in 12px Switzer Medium, gray (#737373), uppercase
    - Text "No barcode scanned yet" in 14px gray (#ABABAB)

UX rationale: Hick's Law — exactly 3 navigation choices (well under cognitive threshold). Fitts's Law — ListItem components provide large 56px+ touch targets perfect for gloved hands. Familiarity — standard list navigation pattern. Discoverability — all options visible, no hidden menus.

---

## PROMPT 4: Who Am I Screen

Build a Who Am I profile screen for Quantify Mobile (390x844).

Layout from top to bottom:
- NavigationBar component (Content=Title) with Text="Who Am I" — full width
- Divider (Full)
- Content section with 24px horizontal padding, 32px top padding, vertical layout, 0 gap:
  - Profile field group — each field is a vertical frame with 4px gap and 24px bottom padding:
    - Field 1: Label "Username" (12px Switzer Medium, #737373) + Value "marcus.aurelio" (16px Switzer Regular, #202020)
    - Field 2: Label "Email" + Value "marcus.aurelio@company.com"
    - Field 3: Label "Role" + Value "Yard Worker"
    - Field 4: Label "Permissions" + Value "Standard Access"
  - Divider (Full) — full width
  - 16px gap
  - Branch offices section:
    - Text "Assigned to branch offices" in 12px Switzer Medium, #737373
    - 10px gap
    - Horizontal wrap row with 8px gap:
      - Chip (Outlined, Enabled, Selected=False) with Label="Portland"
      - Chip (Outlined, Enabled, Selected=False) with Label="Chicago"
      - Chip (Outlined, Enabled, Selected=False) with Label="Salt Lake City"

UX rationale: Cognitive Load — read-only display with clear visual hierarchy (small gray labels above larger dark values). Gestalt Proximity — related fields grouped together with consistent spacing. Chips for branch offices provide scannable, distinct items.

---

## PROMPT 5: Sample Form Screen

Build a Sample Form screen for Quantify Mobile (390x844). This is a data validation test form with multiple field types grouped into sections.

Layout from top to bottom:
- NavigationBar component (Content=Title) with Text="Parent" — full width
- Divider (Full)
- Scrollable content section, vertical layout, 0 gap:

  SECTION: Text Fields (16px horizontal padding, 16px vertical padding)
  - Section label "TEXT FIELDS" in 11px Switzer Medium, #737373, letter-spacing 1px
  - 8px gap
  - TextBox (Outlined, Enabled, Label=True, Populated=False, Placeholder=True, Multiline=False) Label="Alphanumeric (required)" Text="Enter value" — full width

  Divider (Full)

  SECTION: Attachments (no padding, full width)
  - ListItem (Leading=False, Trailing=True, Primary Commands=False, Secondary Commands=False, State=Enabled) Subtitle="Files and pictures" Secondary text="(6)" — full width

  Divider (Full)

  SECTION: Boolean Controls (16px horizontal padding, 16px vertical padding)
  - Section label "BOOLEAN CONTROLS"
  - 8px gap
  - Horizontal row: Text "Must be turned true" (15px, grows) + ToggleSwitch (Enabled, Selected=False)
  - Divider (Full)
  - Horizontal row: Text "Must be turned false" (15px, grows) + ToggleSwitch (Enabled, Selected=True)

  Divider (Full)

  SECTION: Selection (no padding)
  - ListItem (Leading=False, Trailing=True) Subtitle="Combobox? Select widget (required)" — full width

  Divider (Full)

  SECTION: Date Fields (16px horizontal padding, 16px vertical padding)
  - Section label "DATE FIELDS"
  - 8px gap
  - ListItem-style rows (or use text + chevron):
    - "Minimum date (required)" with trailing chevron
    - Divider
    - "Maximum date (required)" with trailing chevron
    - Divider
    - "Minimum date (not required)" with trailing chevron
    - Divider
    - "Maximum date (not required)" with trailing chevron

  Divider (Full)

  SECTION: Numeric Fields (16px horizontal padding, 16px vertical padding)
  - Section label "NUMERIC FIELDS"
  - 8px gap
  - TextBox (Outlined, Enabled, Label=True, Populated=False, Placeholder=True, Multiline=False) Label="Numeric value (nullable - required)" Text="0" — full width
  - TextBox (same variant) Label="Currency numeric (null - required)" Text="$0.00" — full width
  - 8px gap
  - Horizontal row: Text "Result of numeric × currency" (14px, #737373, grows) + Text "$0" (18px Switzer Medium, #202020)

UX rationale: Chunking — form broken into 6 clear sections with headers, reducing cognitive load. Gestalt Proximity — related fields grouped together with section dividers. Goal Gradient — visual sections give sense of progress through form. Large touch targets on toggles and list items for gloved hands. Section labels in small caps provide clear wayfinding without competing with field labels.
