---
name: data-heavy-design
description: Expert patterns for data-dense interfaces — dashboards, data tables, KPI panels, and analytics views. Applies real-time update strategies, enterprise table patterns, cognitive load management, and role-based layout architecture. Synthesized from Smashing Magazine, Pencil & Paper, Creative27, UX Planet, and Ronas IT.
user_invocable: true
---

# Data-Heavy Design — Dashboards, Tables & Analytics

Expert patterns for designing data-dense interfaces that reduce cognitive overload and shorten time-to-decision. This skill covers real-time dashboards, enterprise data tables, KPI panels, analytics views, and any screen where users must scan, compare, filter, and act on large datasets.

## When to Use

- Designing dashboards with multiple KPIs, charts, or status indicators
- Building data tables with sorting, filtering, pagination, or inline editing
- Creating analytics views, reporting screens, or monitoring panels
- Any screen showing 10+ data points, metrics, or list items simultaneously
- Enterprise/SaaS interfaces where different user roles need different data views

---

## 1. Dashboard Layout Architecture

### Information Hierarchy

Position elements by scanning priority — users read dashboards like a newspaper:

| Zone | Placement | Content | Visual Weight |
|------|-----------|---------|---------------|
| **Primary KPIs** | Top-left or center-top | 3–5 critical metrics | Large font, bold, high contrast |
| **Controls** | Top bar or left panel | Filters, date range, role selector | Light, minimal, receding |
| **Trend Charts** | Middle or right | Sparklines, line charts, area charts | Medium emphasis |
| **Data Tables** | Below charts | Detailed records, lists | Dense, scannable |
| **Alerts/Status** | Edge or floating | Critical notifications | High contrast, accent color |

### The 5-Metric Rule

Limit the primary view to ~5 key data points. More than 5 visible metrics at once triggers cognitive overload. Use progressive disclosure for the rest:
- **Level 1**: 3–5 headline KPIs (always visible)
- **Level 2**: Supporting charts and trends (visible, secondary emphasis)
- **Level 3**: Detailed data tables (scrollable, below the fold)
- **Level 4**: Drill-down views (on click/expand)

### Card-Based Modularity

Every dashboard section should be a self-contained card/widget:
- Clear title describing what the card shows
- Consistent padding (16–24px)
- Independent loading state (skeleton, not spinner)
- Self-contained tooltip or info icon explaining the metric
- Optional expand/collapse for progressive disclosure

### Role-Based Views

Different users need different dashboards from the same data:
- **Executives**: 3–5 top-level KPIs, trend direction, goal progress — no detail
- **Managers**: Team metrics, comparisons, filtered by department/region
- **Analysts**: Full data access, export, custom date ranges, drill-down to raw records
- **Operators**: Real-time status, alerts, action queues — operational focus

Provide role-based presets or allow users to customize which widgets appear.

---

## 2. KPI & Metric Presentation

### Anatomy of a Well-Designed KPI Card

Every metric needs context — a number alone is meaningless:

```
┌─────────────────────────────┐
│  Revenue            ℹ️      │  ← Label + info tooltip
│  $1.24M                     │  ← Primary value (large, bold)
│  ▲ +12.3%  vs last month    │  ← Delta indicator + comparison period
│  ▔▔▔▁▁▂▃▅▆█                │  ← Sparkline (7–30 day trend)
│  Target: $1.5M  (83%)       │  ← Goal progress
└─────────────────────────────┘
```

**Required elements:**
1. **Label**: What this metric measures (plain language, not field names)
2. **Value**: Current number, large and bold — the first thing the eye hits
3. **Delta**: Direction arrow (▲/▼) + percentage change + comparison period
4. **Sparkline**: 7–30 day mini trend line, no axes, accent color on latest point
5. **Context**: Target/goal, previous period, or benchmark for comparison

### Delta Indicator Rules

- **Positive change**: Green + upward arrow (▲ +12.3%)
- **Negative change**: Red + downward arrow (▼ -5.1%)
- **Neutral/flat**: Gray + horizontal dash (— 0.2%)
- Always show the comparison period: "vs last week", "vs Q2", "MoM"
- Never rely on color alone — always include the arrow direction

### Sparkline Best Practices

- Remove axis lines and legends — they add noise at this scale
- Limit time span to 7–30 days for clarity
- Highlight the latest data point with an accent-colored dot
- Use them in comparative tables to reveal anomalies across rows

---

## 3. Data Table Design

### Column Alignment Rules (Critical)

| Data Type | Alignment | Why |
|-----------|-----------|-----|
| Text (names, descriptions) | Left | Follows reading direction |
| Numbers (amounts, quantities) | Right | Decimal points align for comparison |
| Dates, IDs, phone numbers | Left | Qualitative — read as text, not compared |
| Status badges, icons | Center | Visual balance |
| Actions (buttons, menus) | Right | Conventional placement |

**Headers match their column alignment.** A right-aligned number column has a right-aligned header.

### Row Density Tiers

Offer 3 density levels — preserve user preference across sessions:

| Density | Row Height | Use Case |
|---------|-----------|----------|
| Condensed | 40px | Power users, monitoring, high-volume scanning |
| Regular | 48px | Default — balanced readability and density |
| Relaxed | 56px | Touch targets, accessibility, less technical users |

### Row Separation Styles

Choose ONE style per table (never combine):
- **Line dividers**: 1px light gray borders — minimal noise, best default
- **Zebra stripes**: Alternating white/light-gray rows — good for wide tables but complicates hover/selection states
- **Card rows**: Slight background elevation per row — works when the page already has a colored background
- **No dividers**: Clean but only works for low-density, simple data

### Vertical Alignment Within Rows

- **1–3 lines of content**: Center-align vertically
- **4+ lines**: Top-align to prevent content being clipped or hidden

### Column Management

Users must be able to customize their view:
- **Freeze columns**: First column (identifier) stays fixed during horizontal scroll
- **Reorder**: Drag-to-reorder column headers
- **Show/Hide**: Column visibility toggle (dropdown or settings panel)
- **Resize**: Drag handles on column separators, visible on hover
- **Reset**: Always provide "Reset to default" to undo all column changes

### Sorting

- Show chevron icon (▲/▼) on sortable column headers
- Default sort: most recent first, or highest priority
- Clicking toggles: ascending → descending → no sort
- Sort indicator must not interfere with header text alignment

### Sticky Elements

- **Sticky header**: Column headers remain visible during vertical scroll
- **Sticky footer**: Action toolbar appears when rows are selected — keeps context visible
- **Sticky first column**: Identifier column stays visible during horizontal scroll

### Bulk Actions & Multi-Select

- Show checkboxes on row hover (not always visible — reduces noise)
- Select-all checkbox in header (with "Select all X items" option beyond current page)
- Action bar appears only after selection: Delete, Export, Duplicate, Assign
- Show count: "3 of 247 selected"

### Inline Editing

Three patterns by complexity:
1. **Cell-level**: Click to edit a single cell. Text cursor on hover signals editability. Confirm via Enter or blur. Best for quick corrections.
2. **Row-level**: Expandable row or modal for multi-field edits. Add friction for high-stakes data (confirmation step).
3. **Sidebar panel**: Slide-in panel with full detail form. Most scalable for complex records. Triggered by row click or "View" action.

### Row Detail Patterns

| Pattern | When to Use |
|---------|-------------|
| Expandable row | Quick peek at 3–5 extra fields |
| Tooltip on hover | Desktop only — secondary metadata |
| Sidebar panel | Full detail view without losing table context |
| Modal | Isolated editing — complex forms, high-stakes changes |
| Full-screen view | Deep dive — analytics, history, related records |

### Search & Filtering

- Highlight matched text within rows (bold or background highlight)
- Filters above the table, not inside it — keep them persistent and visible
- Show active filter count: "3 filters active" with ability to clear each one
- Support column-specific filters (dropdown on column header)

### Pagination vs Infinite Scroll

| Pattern | Use When | Avoid When |
|---------|----------|------------|
| Pagination | User needs to jump to specific records, share page links, or act on specific ranges | Data has no natural pages |
| Infinite scroll | Browsing/discovery, social feeds, logs | User needs to reference specific rows or bookmark position |
| Load more button | Compromise — user controls when more data loads | Performance-critical real-time data |

Pagination footer should show: total count, current page, items-per-page selector (10/25/50/100).

### Typography for Data Tables

- Use monospace or tabular-figure fonts for numeric columns — prevents misalignment
- Body: 14px minimum, regular weight (400)
- Headers: 12–13px, semi-bold (600), uppercase or small-caps for distinction
- Truncate long text with ellipsis (...) + tooltip on hover showing full text
- Never wrap text in condensed density — truncate instead

---

## 4. Real-Time Update Patterns

### Micro-Animations for Change Detection

When data updates in real-time:
- **Number changes**: Smooth count-up/count-down animation (200–400ms)
- **List reordering**: Slide animation under 300ms to maintain spatial memory
- **New data**: Pulse or glow effect (subtle) on the changed metric
- **Status changes**: Color transition with fade (not instant swap)

All animations must respect `prefers-reduced-motion` — fall back to instant updates.

### Data Freshness Indicators

Every dashboard needs visible data freshness:
- "Last updated: 2 min ago" timestamp on the dashboard or per-widget
- Sync status icon: green dot = live, yellow = stale, red = disconnected
- Manual refresh button alongside auto-refresh
- When offline: banner "Offline — showing cached data from 10:42 AM"

### Connectivity Failure Handling

- Auto-retry with exponential backoff (silent recovery)
- If retries fail: clear banner "Connection lost — Reconnecting..."
- Never show a blank dashboard — display last-known data with staleness indicator
- Allow manual refresh attempt

### Skeleton Loading (Not Spinners)

- Use skeleton placeholders (gray animated rectangles) matching the exact layout shape
- Each card/widget loads independently — don't block the entire dashboard
- Show real data as it arrives (progressive hydration)
- For waits >10s: add text explaining what's loading

---

## 5. Charts & Data Visualization

### Chart Type Selection

| Data Story | Best Chart | Avoid |
|-----------|-----------|-------|
| Trend over time | Line chart, area chart | Pie chart, bar chart |
| Part of whole | Donut chart (not pie), stacked bar | 3D charts |
| Comparison | Horizontal bar chart | Vertical bar with 10+ items |
| Distribution | Histogram, box plot | Line chart |
| Correlation | Scatter plot | Bar chart |
| Single value + progress | Gauge, progress bar | Full chart |

### Chart Design Rules

- **Max 5 data series** per chart — more becomes unreadable
- **Label directly** on the chart when possible — avoid separate legends that require eye-tracking
- **Use consistent colors** across charts for the same data dimensions
- **Start Y-axis at 0** for bar charts — truncated axes mislead
- **Horizontal labels** always — never rotate text more than 45 degrees
- **Interactive tooltips** on hover showing exact values and dates
- **Responsive**: charts resize proportionally, labels adapt or hide on small screens

### Color for Data Visualization

- Use a sequential palette (light-to-dark of one hue) for ordered data
- Use a categorical palette (distinct hues) for unrelated categories — max 5–7 colors
- Reserve red for negative/error, green for positive/success — do not reuse these for categories
- Ensure all data series pass 3:1 contrast against the chart background
- Test with color blindness simulators — add patterns or labels as fallback

---

## 6. Cognitive Load Reduction

### Progressive Disclosure for Dashboards

Reveal complexity gradually:
1. **Summary view**: KPI cards + sparklines (default landing)
2. **Expanded view**: Click a KPI card to see its supporting chart
3. **Detail view**: Click through to the full data table
4. **Record view**: Click a row for complete detail in sidebar/modal

Each level adds detail but never forces it on users who don't need it.

### Whitespace as a Tool

- Inner padding (within cards): 16–24px
- Gap between cards: 16–24px
- Section spacing: 32–48px
- Page margins: 24–32px

Whitespace is not wasted space — it defines grouping, creates hierarchy, and prevents the "wall of numbers" feeling.

### Information Density vs. Clarity

- High density is not the same as clutter — dense data is fine IF it's well-organized
- Use alignment, consistent spacing, and typographic hierarchy to make density scannable
- Group related metrics visually (proximity, shared container, shared header)
- Separate unrelated metrics with clear visual breaks (divider, spacing, background change)

---

## 7. Accessibility for Data Interfaces

### Screen Readers & Data Tables

- Use proper `<table>`, `<thead>`, `<tbody>`, `<th>` semantic HTML
- Add `scope="col"` on column headers, `scope="row"` on row headers
- Use `aria-sort="ascending|descending|none"` on sortable columns
- Announce row count: `aria-label="Orders table, 247 rows"`
- For real-time updates: use `aria-live="polite"` on KPI values

### Keyboard Navigation

- Tab through table: header → rows → pagination controls
- Arrow keys navigate cells within the table
- Enter/Space activates row actions or inline edit
- Escape cancels inline edit or closes detail panel

### Touch Targets in Data Tables

- Row action buttons: minimum 44x44px tap area
- Pagination controls: minimum 44x44px
- Column header sort: entire header is the tap target, not just the chevron
- Checkbox: 44x44px tap area even if the visual checkbox is 16–20px

---

## Sources

Synthesized from:
- Smashing Magazine: "UX Strategies for Real-Time Dashboards" (2025)
- Pencil & Paper: "UX Pattern Analysis: Enterprise Data Tables"
- Creative27: "Designing for Clarity: UX/UI Best Practices for Data-Heavy SaaS"
- UX Planet: "Best Practices for Usable and Efficient Data Tables"
- Ronas IT: "Designing for Complexity: Enterprise Dashboards"
