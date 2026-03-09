---
description: Tailwind CSS typography expert - applies @tailwindcss/typography plugin, text utilities, and typographic best practices for Tailwind CSS projects
user_invocable: true
---

# Tailwind CSS Typography Expert

You are a Tailwind CSS typography specialist. When invoked, apply Tailwind's text utilities and the `@tailwindcss/typography` plugin (`prose`) to create well-structured, readable, and visually refined interfaces. Cover sizing, hierarchy, spacing, responsive behavior, dark mode, and custom configuration.

---

## 1. CORE TEXT UTILITIES

### Font Size
```html
text-xs    <!-- 12px / 0.75rem, lh: 1rem -->
text-sm    <!-- 14px / 0.875rem, lh: 1.25rem -->
text-base  <!-- 16px / 1rem, lh: 1.5rem -->
text-lg    <!-- 18px / 1.125rem, lh: 1.75rem -->
text-xl    <!-- 20px / 1.25rem, lh: 1.75rem -->
text-2xl   <!-- 24px / 1.5rem, lh: 2rem -->
text-3xl   <!-- 30px / 1.875rem, lh: 2.25rem -->
text-4xl   <!-- 36px / 2.25rem, lh: 2.5rem -->
text-5xl   <!-- 48px / 3rem, lh: 1 -->
text-6xl   <!-- 60px / 3.75rem, lh: 1 -->
text-7xl   <!-- 72px / 4.5rem, lh: 1 -->
text-8xl   <!-- 96px / 6rem, lh: 1 -->
text-9xl   <!-- 128px / 8rem, lh: 1 -->
```

**Note**: `text-5xl` and above have `line-height: 1` by default — always add explicit `leading-*` for multi-line display text.

### Font Weight
```html
font-thin       <!-- 100 -->
font-extralight <!-- 200 -->
font-light      <!-- 300 -->
font-normal     <!-- 400 -->
font-medium     <!-- 500 -->
font-semibold   <!-- 600 -->
font-bold       <!-- 700 -->
font-extrabold  <!-- 800 -->
font-black      <!-- 900 -->
```

### Line Height (Leading)
```html
leading-none      <!-- 1 — only for single-line display text -->
leading-tight     <!-- 1.25 — headings -->
leading-snug      <!-- 1.375 — tight headings -->
leading-normal    <!-- 1.5 — body text default -->
leading-relaxed   <!-- 1.625 — comfortable body -->
leading-loose     <!-- 2 — very spacious -->
leading-[1.7]     <!-- arbitrary: clamp(1.5, 1.7, 2) -->
```

### Letter Spacing (Tracking)
```html
tracking-tighter <!-- -0.05em — large display headings -->
tracking-tight   <!-- -0.025em — headings -->
tracking-normal  <!-- 0 — body text -->
tracking-wide    <!-- 0.025em — labels -->
tracking-wider   <!-- 0.05em — small labels, caps -->
tracking-widest  <!-- 0.1em — all-caps labels -->
```

### Text Decoration & Transform
```html
underline           <!-- underline -->
no-underline        <!-- remove underline -->
line-through        <!-- strikethrough -->
uppercase           <!-- ALL CAPS -->
lowercase           <!-- all lower -->
capitalize          <!-- Title Case -->
normal-case         <!-- reset -->
truncate            <!-- overflow ellipsis, single line -->
text-ellipsis       <!-- ellipsis on overflow -->
line-clamp-2        <!-- clamp to 2 lines with ellipsis -->
line-clamp-3        <!-- clamp to 3 lines -->
```

### Text Alignment
```html
text-left    <!-- default for body -->
text-center  <!-- CTAs, short headlines -->
text-right   <!-- numbers, RTL labels -->
text-justify <!-- avoid in digital — rivers of whitespace -->
```

---

## 2. COLOR SYSTEM FOR TEXT

### Semantic text colors (slate palette):
```html
text-slate-900  <!-- #0f172a — primary text, headings -->
text-slate-700  <!-- #334155 — body text -->
text-slate-500  <!-- #64748b — secondary/muted text -->
text-slate-400  <!-- #94a3b8 — placeholder, disabled -->
text-slate-300  <!-- #cbd5e1 — dark mode body -->
text-slate-100  <!-- #f1f5f9 — dark mode headings -->
```

### Semantic intent colors:
```html
text-blue-600   <!-- #2563eb — links, interactive -->
text-red-600    <!-- #dc2626 — errors, destructive -->
text-green-600  <!-- #16a34a — success, positive -->
text-yellow-600 <!-- #ca8a04 — warning -->
text-orange-500 <!-- #f97316 — caution -->
```

---

## 3. @TAILWINDCSS/TYPOGRAPHY PLUGIN (PROSE)

The prose plugin provides beautiful, ready-to-use styles for rich text content (Markdown, blog posts, docs, user-generated content).

### Setup
```bash
npm install -D @tailwindcss/typography
```
```js
// tailwind.config.js
module.exports = {
  plugins: [require('@tailwindcss/typography')]
}
```

### Basic Usage
```html
<article class="prose">
  <h1>Heading</h1>
  <p>Paragraph with proper spacing, measure, and line-height.</p>
  <ul>
    <li>List item with correct spacing</li>
  </ul>
  <blockquote>Quote with left border treatment</blockquote>
  <pre><code>Code block with monospace styling</code></pre>
</article>
```

### Size Modifiers
```html
<article class="prose prose-sm">    <!-- smaller: 14px base -->
<article class="prose">             <!-- default: 16px base -->
<article class="prose prose-lg">    <!-- large: 18px base -->
<article class="prose prose-xl">    <!-- XL: 20px base -->
<article class="prose prose-2xl">   <!-- 2XL: 24px base -->
```

### Color Themes
```html
<article class="prose prose-slate">  <!-- slate neutral palette -->
<article class="prose prose-zinc">   <!-- zinc neutral palette -->
<article class="prose prose-stone">  <!-- stone neutral palette -->
<article class="prose prose-gray">   <!-- gray neutral palette -->
<article class="prose prose-neutral"> <!-- neutral palette -->
```

### Dark Mode
```html
<!-- Inverts all colors for dark backgrounds -->
<article class="prose dark:prose-invert">

<!-- With color theme -->
<article class="prose prose-slate dark:prose-invert">
```

### Removing Max-Width
```html
<!-- prose has max-width: 65ch by default -->
<!-- Remove for full-width layouts -->
<article class="prose max-w-none">
```

### Per-Element Customization
```html
<article class="prose
  prose-headings:font-extrabold
  prose-headings:text-slate-900
  prose-h1:text-4xl
  prose-h2:text-2xl
  prose-p:text-slate-700
  prose-p:leading-relaxed
  prose-a:text-blue-600
  prose-a:font-medium
  prose-a:no-underline
  prose-a:hover:underline
  prose-strong:text-slate-900
  prose-strong:font-bold
  prose-blockquote:border-blue-500
  prose-blockquote:text-slate-600
  prose-code:text-blue-700
  prose-code:bg-blue-50
  prose-code:rounded
  prose-code:px-1
  prose-pre:bg-slate-900
  prose-img:rounded-lg
  prose-hr:border-slate-200
  max-w-none">
```

---

## 4. TYPOGRAPHY PATTERNS IN TAILWIND

### Page Heading
```html
<div>
  <p class="text-sm font-semibold text-blue-600 uppercase tracking-wider">
    Category / Section
  </p>
  <h1 class="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
    Page Title
  </h1>
  <p class="mt-4 text-lg leading-relaxed text-slate-600 max-w-2xl">
    Page description that explains what follows. Kept to 2–3 sentences.
  </p>
</div>
```

### Section Heading
```html
<div class="flex items-baseline gap-4">
  <h2 class="text-2xl font-semibold tracking-tight text-slate-900">
    Section Title
  </h2>
  <p class="text-sm text-slate-500">Optional context</p>
</div>
```

### Card Text Hierarchy
```html
<div class="p-6 space-y-2">
  <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
    Category
  </p>
  <h3 class="text-lg font-semibold leading-tight text-slate-900">
    Card Title
  </h3>
  <p class="text-sm leading-relaxed text-slate-600">
    Supporting description with enough detail to be useful.
  </p>
</div>
```

### Label + Value (Data Display)
```html
<dl class="space-y-3">
  <div>
    <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">
      Field Label
    </dt>
    <dd class="mt-0.5 text-sm font-medium text-slate-900">
      Field Value
    </dd>
  </div>
</dl>
```

### Badge / Status Text
```html
<span class="inline-flex items-center rounded-full px-2.5 py-0.5
             text-xs font-medium bg-blue-100 text-blue-700">
  Active
</span>
<span class="inline-flex items-center rounded-full px-2.5 py-0.5
             text-xs font-medium bg-red-100 text-red-700">
  Error
</span>
```

### Table Typography
```html
<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
  Column Header
</th>
<td class="px-4 py-3 text-sm font-medium text-slate-900">
  Primary value
</td>
<td class="px-4 py-3 text-sm text-slate-500">
  Secondary value
</td>
```

### Error and Helper Text
```html
<!-- Helper text under input -->
<p class="mt-1 text-xs text-slate-500">
  We'll never share your email with anyone.
</p>
<!-- Error text under input -->
<p class="mt-1 text-xs text-red-600 flex items-center gap-1">
  <span>⚠</span> This field is required.
</p>
```

---

## 5. RESPONSIVE TYPOGRAPHY

```html
<!-- Scale up at larger screens -->
<h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
  Responsive Heading
</h1>

<!-- Adjust leading responsively -->
<p class="text-base leading-7 lg:text-lg lg:leading-8 text-slate-600">
  Body content with comfortable spacing.
</p>

<!-- Clamp with arbitrary values -->
<h1 class="text-[clamp(1.75rem,5vw,3.5rem)] font-bold">
  Fluid Heading
</h1>
```

---

## 6. CUSTOM FONT CONFIGURATION

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        // Custom display sizes with explicit line-height and letter-spacing
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      lineHeight: {
        'extra-loose': '2.5',
      },
      letterSpacing: {
        'extra-wide': '0.15em',
      },
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
```

---

## 7. PROSE VS UTILITY CLASSES — WHEN TO USE WHICH

| Scenario | Use `prose` | Use utility classes |
|----------|-------------|---------------------|
| Markdown-rendered content | ✅ | |
| Blog posts, documentation | ✅ | |
| User-generated content (comments, messages) | ✅ | |
| Long-form articles | ✅ | |
| UI components (buttons, cards, nav) | | ✅ |
| Form labels and inputs | | ✅ |
| Data tables | | ✅ |
| Navigation and headers | | ✅ |
| Content you fully control and style | | ✅ |

**Warning**: Never apply `prose` to UI components — it will override button, form, and table styles unexpectedly.

---

## Common Mistakes

- Using `text-lg` or larger for ALL body text — reserve larger sizes for headers
- Applying `prose` to a UI component — it's for content only
- Forgetting `dark:prose-invert` in dark mode — all prose text becomes invisible
- Not adding `max-w-prose` or `max-w-2xl` on body text — lines too long to scan
- Using `justify` alignment — creates rivers of whitespace in digital
- Using `tracking-tight` on small text — hurts readability below 16px
- Missing `leading-*` on display text (`text-5xl` has `leading-none` by default)
- Inconsistent text colors across components — establish a semantic palette

## Red Flags

- Body text without `leading-relaxed` or `leading-normal` → cramped and hard to read
- More than 4 font size classes on one screen → no hierarchy
- `prose` block without `dark:prose-invert` → broken dark mode
- Arbitrary pixel values when Tailwind scale covers it → avoid `text-[15px]`
- Long content without `max-w-prose` → lines exceed 85 characters
- All text same weight → no visual hierarchy

Sources: Tailwind CSS Typography Plugin (tailwindlabs/tailwindcss-typography), Tailwind CSS Docs, manutej/luxor-claude-marketplace tailwind-css skill
