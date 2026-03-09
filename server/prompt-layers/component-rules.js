// Layer 3: Component Rules — injected always (compact version)
// Defines exact usage rules for Avontus UI components
// This is where the AI learns "how Avontus composes UI"

export const COMPONENT_RULES = `
COMPONENT USAGE RULES — how Avontus composes UI:

BUTTONS — use ONLY the pre-loaded classes, NEVER write custom button CSS:
- Classes: btn-filled (primary), btn-outlined (secondary), btn-tonal (alternative), btn-text (tertiary). These are pill-shaped (border-radius:9999px), 40px tall, auto-width, 14px font. All styles are pre-loaded.
- ONE btn-filled per screen/action area. Pair with btn-outlined or btn-text for secondary.
- Labels: verb + object ("Save reservation", "Ship items"). Max 20 chars, single line only. Never "Submit", "OK", "Click here".
- Bottom actions: always .bottom-actions. Left = btn-outlined flex:1. Right = btn-filled flex:1.
- Never add icons inside buttons unless explicitly designed. Never stack 2 action buttons vertically.
- NEVER write CSS that targets .btn-filled, .btn-outlined, .btn-tonal, or .btn-text — they are already styled.
- NEVER add inline style= on buttons that sets background, color, border-radius, height, padding, font-size, or width.
- NEVER use width:100% on buttons (except flex:1 inside .bottom-actions).

FIELDS (inputs, selects, textareas):
- Always wrap in .field container with .field-label + .field-input.
- Never use bare unstyled <input> or <select>.
- Group related fields into sections with .section-header.
- Realistic placeholders: "e.g., Johnson Construction" not "Enter text".

FIELD VALIDATION (when user requests forms with errors/warnings/required fields):
- Add .field-error, .field-warning, or .field-info class to the .field div for severity.
- Add <span class="field-validation-icon"><span class="msi sm">error</span></span> inside .field after the input.
- Add <span class="field-helper field-helper-error">message</span> AFTER the .field div as a sibling.
- NEVER create standalone validation summary cards, info-bars, or error lists. The runtime auto-generates a tappable severity icon in the app bar + a popup listing all issues from the field states.
- NEVER put validation text inside .field — only the .field-validation-icon goes inside.
- NEVER use .info-bar for field-level validation messages.

TOGGLES:
- Always wrap in .row-between: [text label col on left] + [label.switch on right].
- Never place a bare <label class="switch"> without .row-between parent.
- With subtitle: wrap label+description in .col with gap:2px.

TABS:
- Use .filter-bar with .chip buttons for in-page filtering.
- Active tab: .chip.active class.
- Max 5 tabs visible, overflow to scrollable.

CHIPS:
- Filter chips: .chip in .filter-bar. First = .active.
- Status chips: use .badge classes (badge-blue, badge-teal, badge-error, badge-warning, badge-gray).

FAB (floating action button):
- Position: bottom-right, 16px from edges.
- Use only for primary creation action on list/browse screens.
- One FAB per screen maximum.

BOTTOM NAV:
- 3-5 items max. Icon + label for each.
- Active item: brand-blue icon + label. Inactive: gray.

LIST ITEMS:
- Always use .list-item inside .card.
- Pattern: .list-icon + .col flex:1 (title + subtitle) + trailing (.badge and/or .icon-btn chevron).
- Every data row with state must show a status badge.

DIALOGS:
- Focused task, clear title, max 2 action buttons.
- Primary action right, secondary left.
- Never more than 3 form fields in a dialog.

STEPPERS:
- Use .row with icon-btn minus + number input + icon-btn plus.
- Wrap in .col with .label-sm above.

SHEETS (bottom sheets):
- Content rises from bottom. Rounded top corners.
- Drag handle at top (decorative gray bar).
- Max 60% screen height.

TOOLBARS / APP BARS:
- Edit mode: close (X) left, title center, check right.
- Read mode: back arrow left, title center, overflow right.
- Max 2-3 icon-btns on right. Overflow for rest.
- Always frosted glass style. Height 56-64px.

SWITCHES:
- Always paired with descriptive text.
- On = checked attribute. Off = no checked.
- Never use for destructive actions (use dialog confirmation instead).

ICONS:
- Always use <span class="msi">icon_name</span>.
- Icons ONLY in: .icon-btn, .list-icon, standalone in .row with gap:8px.
- NEVER inside <p>, <h1>-<h6>, <label>, <a>, <button> text, or any sentence text.
- Size classes: .msi (24px default), .msi.sm (18px), .msi.lg (32px hero only).
`
