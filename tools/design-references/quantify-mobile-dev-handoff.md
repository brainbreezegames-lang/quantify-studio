# Quantify Mobile — Dev Hand-off (v15/v16)

**Purpose:** everything a WinUI/Uno dev needs to ship 1:1 with the design.
**Sources of truth (in this order):**
1. React prototype (most accurate, click-through): https://quantify-studio.vercel.app/demo
2. Figma screen builder JSON: `tools/figma-screen-builder/quantify-v16-*.json`
3. Figma file (library + approved screens): *link here*

If these ever disagree, the React prototype wins. It's what Brian signed off on.

---

## 1. Design tokens — do not improvise

Use these exact values. No rounding, no "close enough."

### Colors

| Token | Hex | Used for |
|---|---|---|
| `brand/primary` | `#1E3FFF` | Delivery accent, primary CTAs, blue hero |
| `brand/primary-tint` | `#EEF2FF` | Icon chip bg on blue accent cards, info card bg |
| `brand/primary-soft` | `#E5ECFF` | Status pill bg (Reserved) |
| `bg/page` | `#F5F5F5` | Every screen background |
| `bg/surface` | `#FFFFFF` | Cards, rows, sticky bars |
| `bg/muted` | `#F3F4F6` / `#F5F5F5` | Input fields, disabled pills |
| `border/default` | `#EAEAEA` | Card border, row divider between cards |
| `border/inline` | `#F0F0F0` | Divider inside a card |
| `border/subtle` | `#F5F5F5` | Divider between rows in a list card |
| `text/primary` | `#0A0A0A` | Titles, numbers |
| `text/secondary` | `#525252` | Inactive chip text, subtitles |
| `text/tertiary` | `#737373` | Meta, timestamps, captions |

**Status colors (stripe + icon + pill):**

| Status | Stripe/accent | Pill bg | Pill text | Icon chip bg | Icon color |
|---|---|---|---|---|---|
| RESERVED | `#1E3FFF` | `#E5ECFF` | `#1E3FFF` | `#EEF2FF` | `#1E3FFF` |
| TO-BE-RECEIVED | `#15803D` | `#F0FDF4` | `#15803D` | `#F0FDF4` | `#15803D` |
| IN-TRANSIT | `#0EA5E9` | `#E0F2FE` | `#0369A1` | `#E0F2FE` | `#0369A1` |
| NEEDS-COUNT | `#F59E0B` | `#FEF3C7` | `#92400E` | `#FEF3C7` | `#92400E` |
| PRE-RETURN | `#F59E0B` | `#FEF3C7` | `#D97706` | `#FEF3C7` | `#92400E` |
| DISCREPANCY | `#DC2626` (6px) | `#FEE2E2` | `#DC2626` | `#FEE2E2` | `#991B1B` |

> Stripe is 4px tall except Discrepancy which is 6px. Always at the very top of the card, above the padded content.

### Typography — Switzer

Load the font file. Font families: `Switzer` + `JetBrains Mono` (mono only for numerics if needed).

| Name | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Hero h1 | 34 | Semibold (600) | -0.8 | 1.1 |
| Sub-screen h1 | 28 | Semibold (600) | -0.6 | 1.15 |
| Card h2 | 22 | Bold (700) | -0.4 | tight |
| Card title | 18 | Bold (700) | -0.2 | 1.2 |
| Item title | 16 | Bold (700) | -0.1 | snug |
| Body | 15 | Bold / Medium | 0 | 1.4 |
| Label | 13 | Bold / Medium | 0 | 1.3 |
| Meta / caption | 12–13 | Medium (500) | 0 | 1.3 |
| Pill (uppercase) | 10–11 | Bold (700) | 0.5–0.6 | 1 |
| Big display (keypad) | 72–96 | Bold (700) | -2 to -3 | 1 |

### Radius + shadow

- Cards: `CornerRadius="20"`
- Buttons / pills: `CornerRadius="16"` (buttons), `CornerRadius="999"` (pills, icon chips)
- Input fields: `CornerRadius="14"`
- Card shadow: `0 4px 16px rgba(10,13,30,0.04)` — on discrepancy use `rgba(220,38,38,0.08)`
- FAB shadow: `0 8px 20px rgba(30,63,255,0.35), 0 2px 6px rgba(0,0,0,0.10)`

### Spacing

Use a 4px grid. Card inner padding: **22px horizontal, 18–22px vertical**. Between cards in a list: **14px gap**. Page edge padding: **16px**.

### Tap targets (hard rule)

Minimum **44×44**. Primary count/keypad targets **56×72** or larger. Yard workers wear gloves — this is non-negotiable. If it's smaller, it's broken.

---

## 2. Primary interaction: **keypad-first, never steppers**

**Every count input uses the numeric keypad sheet.** No +/- anywhere. This is a standing rule — Brian's "I like the +/-" feedback was noted; we're promoting the keypad (his fallback) to the primary path because +/- breaks at 300-part shipments and with gloves on.

The keypad sheet:
- Slides up from bottom (280ms, cubic-bezier(0.32, 0.72, 0, 1))
- Handle (40×4 gray bar) at top
- Header row: bucket label (uppercase, accent color) + "Enter amount" title + Cancel
- Display area: 72–96px number, `#FAFAFA` bg, shows "of X max"
- Over-max warning: red strip with "Over by N"
- Keys: 60×60 white buttons, 26px numbers, Clear/Backspace bottom row
- Save button: accent-colored, full-width, disabled when over max
- Backdrop: `rgba(0,0,0,0.4)`, tap to cancel

---

## 3. Component map — what each Figma frame becomes in XAML

| Figma frame | XAML | Notes |
|---|---|---|
| Blue hero header | `Grid` with blue `Background`, vertical `StackPanel` inside | Safe-area top padding required |
| Card (with stripe) | `Border` (radius 20, white bg, 1px `#EAEAEA` border) containing `StackPanel` — first child is a `Border` with `Height=4` and the stripe color | Uno `ListItem` can **not** render this; use a custom `UserControl` called `StatusCard` |
| Icon chip (32×32 colored circle) | `Border` (radius 999) with colored bg, `FontIcon`/`PathIcon` centered | |
| Status pill (uppercase) | `Border` (radius 999) with tint bg, `TextBlock` padded 8×3, letter-spacing +0.5 | |
| Filter chips row | `ItemsControl` with horizontal `WrapPanel`, each chip is a pill `Button` with optional count badge | Active state = accent bg + white text + shadow |
| Count row / bucket | `Grid` with icon chip, stacked labels, tap-target pill on the right | |
| Tappable number pill | 72–78 × 52 `Button`, radius 16, 2px accent border when value > 0, gray border when 0 | Always opens keypad on tap |
| Sticky CTA | `Border` pinned to bottom, white bg, 1px top border | Primary button + optional secondary text-link below |
| Section divider | `Rectangle` height 1, bg `#F0F0F0` (inside card) or `#EAEAEA` (between sections) | |
| iOS Status Bar / Bottom Bar | Use native safe-area insets — these are mock chrome in Figma, don't recreate as components | |

**Uno kit components you *can* use as-is:** `Divider`, `Status Bar`, `Bottom Bar`, `TextBox` (outlined), `NavigationBar` (sub-screen mini header only).
**Uno kit components that will **not** match the design if used raw:** `ListItem` (can't do the card composition), `Chip` (kit is gray-only, we need colored active states), `Card` (slot-only, not matching our layout). Build custom UserControls.

---

## 4. Screen-specific notes

- **Shipment list:** FAB is absolutely positioned bottom-right, 60×60, blue, +. Filter chips are **7 chips** (All + 6 statuses), each with a count badge, active uses status-specific colors (see table).
- **Shipment card footer strip:** appears only for DISCREPANCY ("Count mismatch (−N)" + "Resolve on desktop →") and NEEDS-COUNT / PRE-RETURN ("Needs your count"). Separate `Border` below main content, preceded by a thin divider.
- **Count screen:** item rows are **individual cards with stripes**, not a flat list. Stripe color maps to per-row status (green=counted, amber=short/needs-explain, red=flagged, blue/amber=pending). Tap the number → keypad. Tap the flag → MissingItems / ConditionCheck.
- **Split missing / Condition check:** keypad-first. Buckets are cards with colored stripes. Tap a bucket number opens the keypad sheet.
- **Review:** merged variances + flagged list in one card. Delta shown as a pill (amber or red). "Rent doesn't start yet" info card is **required** — it's the most important copy in the app.
- **Notes for office** appears in TWO places: Review screen **and** ShipmentDetail (Brian: "can edit notes without editing the shipment").

---

## 5. Traps to watch for

1. **Don't tint full card backgrounds** by status. Card bg is always `#FFFFFF`. Color lives in stripe, pill, icon chip, inline text only.
2. **Don't replace our status vocab.** Use exact Quantify desktop status names: `Reserved`, `To Be Received`, `In Transit`, `Needs Count`, `Discrepancy`, `Pre-Return`. No `Awaiting Office`, no `In Review`, no invented variants.
3. **Don't center-align text blocks that aren't centered in Figma.** Default alignment is leading (left) except the mini sub-screen header title.
4. **Don't substitute icons.** All icons are Material Design icon names (we use those names in the Figma JSON); map to Uno's Material Icons font or equivalent. No mixing Lucide / Phosphor / SF Symbols.
5. **Don't skip the "Rent doesn't start yet" callout** on Review. Brian suggested cutting Review entirely; we kept it specifically for that message.
6. **Don't use +/- anywhere.** See section 2. If the stepper pattern creeps in, the dev has diverged from design.
7. **Don't add jobsite/customer names as hardcoded theme colors.** Everything is token-driven.

---

## 6. Acceptance QA checklist (for the dev)

Before marking a screen done, verify on a real device with work gloves:

- [ ] All tap targets ≥ 44×44 (keypad keys + count pills ≥ 56)
- [ ] No text truncation at default system font size; no overflow at 120% text scale
- [ ] Status colors exactly match the table in section 1
- [ ] Card shadow present and color-correct (discrepancy uses red-tinted shadow)
- [ ] Sticky CTA stays above keyboard when keypad is open
- [ ] Back navigation animates left→right; forward right→left
- [ ] Tap a count → keypad sheet slides up; over-max shows red warning; Save disabled when over
- [ ] Offline: keeps local state, no "failed to save" errors on the count flow
- [ ] Presenter-quality data: shipment IDs and jobsite names match the v15 dataset (check `src/demo/data.ts`)

---

## 7. Files to consult

- Prototype: https://quantify-studio.vercel.app/demo
- React reference: [src/demo/screens/](../../src/demo/screens/)
- Figma JSONs (paste into screen-builder plugin): [tools/figma-screen-builder/quantify-v16-*.json](../figma-screen-builder/)
- Data fixtures: [src/demo/data.ts](../../src/demo/data.ts)
- Scaffold status machine (business rules): [quantify-docs-reference.md](../../quantify-docs-reference.md)

Questions: ping Zino on Slack. Don't guess — ask.
