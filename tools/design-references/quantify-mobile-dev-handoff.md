# Quantify Mobile — Dev Hand-off

**Two sources of truth, in order:**
1. **Figma file** — the design
2. **Click-through prototype:** https://quantify-studio.vercel.app/demo — final behaviour, what Brian signed off on

If they ever disagree, the prototype wins. Ping Zino — don't guess.

---

## Tokens — use exact values, no rounding

### Colors

| Token | Hex | Used for |
|---|---|---|
| Brand primary | `#1E3FFF` | Delivery accent, primary CTAs, blue hero |
| Brand tint | `#EEF2FF` | Icon chip bg, info card bg |
| Page bg | `#F5F5F5` | Every screen |
| Surface | `#FFFFFF` | Cards, rows, sticky bars |
| Border (outer) | `#EAEAEA` | Card border |
| Border (inside) | `#F0F0F0` | Divider inside a card |
| Border (rows) | `#F5F5F5` | Divider between rows in a list card |
| Text primary | `#0A0A0A` | Titles, numbers |
| Text secondary | `#525252` | Subtitles, inactive chip text |
| Text tertiary | `#737373` | Meta, captions |

**Status colors — stripe + pill bg + pill text + icon chip bg + icon:**

| Status | Stripe | Pill bg | Pill text | Icon chip bg | Icon color |
|---|---|---|---|---|---|
| Reserved | `#1E3FFF` | `#E5ECFF` | `#1E3FFF` | `#EEF2FF` | `#1E3FFF` |
| To Be Received | `#15803D` | `#F0FDF4` | `#15803D` | `#F0FDF4` | `#15803D` |
| In Transit | `#0EA5E9` | `#E0F2FE` | `#0369A1` | `#E0F2FE` | `#0369A1` |
| Needs Count | `#F59E0B` | `#FEF3C7` | `#92400E` | `#FEF3C7` | `#92400E` |
| Pre-Return | `#F59E0B` | `#FEF3C7` | `#D97706` | `#FEF3C7` | `#92400E` |
| Discrepancy | `#DC2626` (6px) | `#FEE2E2` | `#DC2626` | `#FEE2E2` | `#991B1B` |

Stripe height is **4px**, except Discrepancy which is **6px**. Always at the very top of the card, above padded content.

### Type — Switzer

| Role | Size | Weight | Letter-spacing |
|---|---|---|---|
| Hero h1 | 34 | 600 | -0.8 |
| Sub-screen h1 | 28 | 600 | -0.6 |
| Card title | 18 | 700 | -0.2 |
| Body / item | 15–16 | 700 / 500 | 0 |
| Meta | 12–13 | 500 | 0 |
| Pill (uppercase) | 10–11 | 700 | 0.5–0.6 |
| Keypad display | 72 | 700 | -2 |

### Radius + shadow

- Cards: `20`
- Buttons: `16`
- Pills / icon chips: `999` (fully round)
- Input fields: `14`
- Card shadow: `0 4px 16px rgba(10,13,30,0.04)` — discrepancy uses red-tinted `rgba(220,38,38,0.08)`

### Tap targets — hard rule

Minimum **44×44**. Primary count / keypad targets **56+** high. Yard workers wear gloves. Smaller = broken.

---

## Interaction model: keypad-first, never +/-

Every count input opens a **bottom-sheet keypad**. No +/- buttons anywhere in the app. Brian's "I like the +/-" feedback was noted; keypad is now primary because +/- breaks at 300-part counts and with gloves on.

The keypad sheet:
- Slides up from bottom, 280ms
- Handle, then bucket label (uppercase, accent) + "Enter amount" title + Cancel link
- Display: 72px number on `#FAFAFA`, shows "of X max"
- Over-max: red strip with "Over by N"
- Keys: 60×60 white buttons, 26px digits, Clear + Backspace on bottom row
- Save: full-width, accent-coloured, disabled when over max
- Backdrop: `rgba(0,0,0,0.4)`, tap to cancel

---

## What doesn't exist in the Uno kit — build these as custom UserControls

1. **StatusCard** — the card pattern used across Shipments list, Counting, MissingItems, ConditionCheck, Review. A rounded 20px container with a 4–6px coloured stripe at the top, then padded content. The Uno `ListItem` cannot render this.
2. **StatusPill** — small rounded-full badge with uppercase label. Uno `Chip` in this kit is gray-only; we need per-status colours.
3. **IconChip** — 32–40px circular badge with tinted bg and coloured icon. Used on every card header and bucket row.
4. **FilterChipRow** — horizontal scrolling row of pill buttons with a count badge on the right. Active state uses the status colour as bg with white text and a coloured shadow.
5. **KeypadSheet** — the bottom-sheet numeric keypad described above. Reused everywhere a number is entered.
6. **StickyActionBar** — bottom-pinned bar with primary button + optional secondary text link (e.g. "Go back and edit").

**Kit components you can use as-is:** `Divider`, `Status Bar` (iOS), `Bottom Bar` (iOS gesture nav), `TextBox` (outlined variant for search), `NavigationBar` (sub-screen mini header only).

Build `StatusCard` and `KeypadSheet` first — every screen depends on them.

---

## Screen-specific rules

- **Shipments list:** FAB is 60×60 blue, absolutely positioned bottom-right. Filter chips row has All + all 6 statuses, each with a count badge, and active state uses that status's colour.
- **Card footer strip:** appears for Discrepancy (`Count mismatch (−N)` + `Resolve on desktop →`) and for Needs-Count / Pre-Return (`Needs your count`). A thin divider separates it from the main card body.
- **Counting screen:** each item row is its **own card with a stripe** (green = counted, amber = short/needs explanation, red = flagged, blue or amber = pending). Tap the number → keypad. Tap the flag icon → MissingItems or ConditionCheck.
- **MissingItems / ConditionCheck:** each bucket is a card with a stripe + icon chip + tappable number pill. The number opens the keypad. **No +/- anywhere.**
- **Review:** variances and flagged items merged into one card. Delta shown as a coloured pill (amber or red). The **"Rent doesn't start yet"** callout is required — it's the most important copy in the app.
- **Notes for office** appears in **two places**: Review screen *and* ShipmentDetail (Brian: "can edit notes without editing the shipment").

---

## Traps

1. **Never tint the full card background** by status. Card background is always `#FFFFFF`. Colour lives in stripe, pill, icon chip, and inline text only.
2. **Use exact Quantify desktop status names.** `Reserved`, `To Be Received`, `In Transit`, `Needs Count`, `Discrepancy`, `Pre-Return`. Don't invent `Awaiting Office` or similar.
3. **No icon mixing.** All icons are Material Design (equivalent to Uno's Material Icons font). No Lucide, Phosphor, or SF Symbols.
4. **No +/- steppers anywhere.** See the interaction section.
5. **Don't skip "Rent doesn't start yet"** on Review. It's the whole reason we kept that screen.
6. **Default alignment is leading (left).** Only the sub-screen mini-header title is centered.

---

## Acceptance checks — do these with work gloves on

- [ ] Every tap target ≥ 44×44; keypad keys and count pills ≥ 56
- [ ] Status colours match the table above exactly
- [ ] Card shadow present; discrepancy uses red-tinted shadow
- [ ] No truncation at default font; no overflow at 120% text scale
- [ ] Sticky CTA stays above the keyboard when the keypad is open
- [ ] Back nav animates left→right; forward right→left
- [ ] Tap a count → keypad slides up; over-max shows red warning; Save disables
- [ ] Offline: local state survives, no "failed to save" errors in the count flow

---

**Questions?** Slack Zino. Don't guess from the Figma if something's unclear — ask.
