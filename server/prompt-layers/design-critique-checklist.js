// Layer 4: Design Critique Checklist — used as second-pass review after generation
// Also used by the "improve" flow to audit existing designs

export const DESIGN_CRITIQUE_CHECKLIST = `Review this design critically against the Avontus design system.

Check these points:
- Does this look like Avontus Quantify, or like generic SaaS?
- Is the hierarchy strong and immediate?
- Is there one obvious primary action?
- Is sentence case used everywhere?
- Are colors on-brand and restrained?
- Are spacing and alignment disciplined on a 4px rhythm?
- Are shadows, corners, and surfaces consistent with the system?
- Are toolbars and dialogs following Avontus conventions?
- Is the layout efficient for operational work?
- Are there any parts that feel decorative instead of useful?
- Are there any generic patterns, weak sections, or visually flat areas?
- Are forms and lists easy to scan and act on?
- Is there any component misuse or inconsistency?
- What 3 concrete changes would make this more polished and less generic?

If anything feels generic, messy, or off-brand, rewrite the design with stronger hierarchy, cleaner composition, and stricter system fidelity.`

// Compact version for injection into the generate flow (appended to user message)
export const CRITIQUE_CHECKLIST_COMPACT = `
SELF-CHECK before returning — fix any issues you find:
1. Does this look like Avontus or generic SaaS? (must be unmistakably Avontus)
2. Is there ONE clear primary action per area?
3. Is sentence case used everywhere? (never title case)
4. Are colors restrained? (70% neutral, 20% text, 10% accent)
5. Is spacing on 4px rhythm? (tight inside groups, generous between)
6. Are shadows blue-tinted, not gray?
7. Is every toolbar following Avontus conventions?
8. Is every input wrapped in .field? Every toggle in .row-between?
9. Is every icon in .msi class, never inside text sentences?
10. Is content realistic Avontus data, never placeholder?
VISUAL BUG CHECK — these break the output if wrong:
11. Did you write ANY custom CSS for .btn-filled, .btn-outlined, .btn-tonal, .btn-text? REMOVE IT — buttons are pre-loaded.
12. Did you add inline style= on any button that sets background, color, border-radius, height, padding, or width? REMOVE IT.
13. Is any text dark-colored (#1C1B1F or similar) sitting on a blue/dark background? Change to #FFFFFF.
14. Is any .msi icon inside a <p>, <h1-h6>, <li>, or <label>? Move it outside — icons in text are hidden by CSS.
15. Is the .screen div present as the root wrapper? Is .app-bar the first child?`
