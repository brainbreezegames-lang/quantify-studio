# Comprehensive Design Guide

**Source URL:** https://www.cotool.ai/
**Generated:** Automated comprehensive extraction
**Viewport:** 1600x1200

---

## 📸 Visual Assets

### Screenshots
- **Desktop Viewport:** `viewport_screenshot.png`
- **Full Page:** `fullpage_screenshot.png`
- **Interactive States:** `interactive_hover.png`

### Responsive Screenshots
- **Mobile (375x812):** `responsive_mobile.png`
- **Tablet (768x1024):** `responsive_tablet.png`
- **Desktop (1920x1080):** `responsive_desktop.png`

---

## 🎨 Color System

### Primary Colors

```css
:root {
  /* Text Colors */
  --text-1: rgb(0, 0, 0);
  --text-2: rgb(13, 13, 13);
  --text-3: rgb(255, 255, 255);
  --text-4: rgb(238, 237, 237);
  --text-5: rgb(0, 11, 255);

  /* Background Colors */
  --bg-1: rgb(31, 31, 31);
  --bg-2: rgb(238, 237, 237);
  --bg-3: rgb(255, 255, 255);
  --bg-4: rgb(253, 252, 251);
  --bg-5: rgb(0, 11, 255);

  /* Border Colors */
  --border-1: rgb(0, 0, 0);
  --border-2: rgb(13, 13, 13);
  --border-3: oklab(0.159058 0.00000725687 0.00000318885 / 0.04);
  --border-4: rgb(255, 255, 255);
  --border-5: rgb(238, 237, 237);
}
```

---

## 📝 Typography System

### Font Stack

```css
:root {
  --font-1: suisseIntl, "suisseIntl Fallback", Arial, Helvetica, sans-serif;
  --font-2: moderatSerif, "moderatSerif Fallback";
}
```

### Type Scale

```css
:root {
  --text-1: 11.5px;
  --text-2: 14px;
  --text-3: 16px;
  --text-4: 18px;
  --text-5: 20px;
  --text-6: 28px;
  --text-7: 32px;
  --text-8: 36px;
  --text-9: 44px;
  --text-10: 48px;
}
```

### Heading Hierarchy

| Element | Font Size | Weight | Line Height | Letter Spacing |
|---------|-----------|--------|-------------|----------------|
| h1 | 64px | 450 | 76.8px | -1.28px |
| h2 | 48px | 400 | 52.8px | -0.96px |
| h3 | 16px | 450 | 20.8px | normal |
| h4 | 44px | 400 | 48.4px | -0.88px |

### Font Weights

- `400`
- `450`
- `700`

---

## 📐 Spacing & Layout

### Spacing Scale

```css
:root {
  /* Margins */
  --margin-1: -430px;
  --margin-2: -1px;
  --margin-3: 12px;
  --margin-4: 100px;
  --margin-5: 117px;
  --margin-6: 140px;
  --margin-7: 143px;
  --margin-8: 154px;
  --margin-9: 173px;
  --margin-10: 180px;

  /* Paddings */
  --padding-1: 3px;
  --padding-2: 6px;
  --padding-3: 8px;
  --padding-4: 9px;
  --padding-5: 12px;
  --padding-6: 14px;
  --padding-7: 33px;
  --padding-8: 60px;
  --padding-9: 68px;
  --padding-10: 73px;

  /* Gaps (Flexbox/Grid) */
  --gap-1: 4px;
  --gap-2: 6px;
  --gap-3: 8px;
  --gap-4: 8.91px;
  --gap-5: 10px;
}
```

### Border Radius

```css
:root {
  --radius-1: 4px;
  --radius-2: 7.13px;
  --radius-3: 3.35544e+07px;
}
```

---

## 🌟 Visual Effects

### Opacity Values

- `0`
- `0.2`
- `0.6`

---

## ✨ Animations & Transitions

### Transitions

```css
/* Transition 1 */
transition: all;

/* Transition 2 */
transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), translate 0.3s cubic-bezier(0.4, 0, 0.2, 1), scale 0.3s cubic-bezier(0.4, 0, 0.2, 1), rotate 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Transition 3 */
transition: 0.15s cubic-bezier(0.4, 0, 0.2, 1);

/* Transition 4 */
transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), translate 0.15s cubic-bezier(0.4, 0, 0.2, 1), scale 0.15s cubic-bezier(0.4, 0, 0.2, 1), rotate 0.15s cubic-bezier(0.4, 0, 0.2, 1);

/* Transition 5 */
transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);

/* Transition 6 */
transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);

```

### Keyframe Animations

#### @keyframes collapsible-down

```css
0% { height: 0px; }
100% { height: var(--radix-collapsible-content-height,var(--bits-collapsible-content-height,var(--reka-collapsible-content-height,var(--kb-collapsible-content-height,auto)))); }
```

#### @keyframes collapsible-up

```css
0% { height: var(--radix-collapsible-content-height,var(--bits-collapsible-content-height,var(--reka-collapsible-content-height,var(--kb-collapsible-content-height,auto)))); }
100% { height: 0px; }
```

#### @keyframes enter

```css
0% { opacity: var(--tw-enter-opacity,1); transform: translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0)scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1))rotate(var(--tw-enter-rotate,0)); filter: blur(var(--tw-enter-blur,0)); }
```

---

## ⚡ Interactive States

---

## 🧩 Component Patterns

### Buttons

#### Button 1: "Product"

```css
background-color: rgba(0, 0, 0, 0);
color: rgb(13, 13, 13);
padding: 0px;
border-radius: 0px;
border: 0px solid rgb(13, 13, 13);
font-size: 14px;
font-weight: 400;
```

#### Button 2: ""

```css
background-color: rgba(0, 0, 0, 0);
color: rgb(13, 13, 13);
padding: 3px;
border-radius: 4px;
border: 0px solid rgb(13, 13, 13);
font-size: 14px;
font-weight: 400;
```

#### Button 3: "Watch video overview"

```css
background-color: rgb(0, 11, 255);
color: rgb(255, 255, 255);
padding: 0px 12px;
border-radius: 7.13px;
border: 0px solid rgb(255, 255, 255);
font-size: 14px;
font-weight: 400;
```

---

## 🎭 UX Patterns

### Interaction Metrics

- **Interactive Elements:** 36
- **Scroll Behavior:** `auto`
- **Cursor Styles Used:** `pointer`, `default`

### Accessibility Features

- ARIA Labels: 2
- ARIA Descriptions: 0
- Role Attributes: 1
- Image Alt Texts: 13

### Sticky/Fixed Elements

- `div` - Position: `fixed`, Top: `0px`, Z-Index: `50`
- `div` - Position: `sticky`, Top: `120px`, Z-Index: `auto`

---

## 📱 Responsive Design

### Mobile (375x812)

- Viewport: 375x812
- Scroll Height: 10104px
- Body Width: 375px
- Screenshot: `responsive_mobile.png`

### Tablet (768x1024)

- Viewport: 768x1024
- Scroll Height: 7632px
- Body Width: 768px
- Screenshot: `responsive_tablet.png`

### Desktop (1920x1080)

- Viewport: 1920x1080
- Scroll Height: 6673px
- Body Width: 1920px
- Screenshot: `responsive_desktop.png`

---

## 🚀 Implementation Recommendations


### Step 1: Define Design Tokens

Create a comprehensive token system using CSS custom properties:

```css
:root {
  /* Use the color, typography, and spacing values above */
}
```

### Step 2: Implement Component Patterns

Use the extracted component styles for buttons, cards, forms, etc.

### Step 3: Apply Interactive States

Implement hover, focus, and active states as documented above.

### Step 4: Add Animations

Apply the transitions and keyframe animations for smooth interactions.

### Step 5: Ensure Responsive Behavior

Use the responsive patterns to create mobile-first, adaptive layouts.

### Step 6: Test Accessibility

Follow the accessibility patterns identified in the analysis.

---

## 📚 Files Reference

- `design-guide.md` - This comprehensive guide
- `design_data.json` - Complete raw data
- `extracted.html` - Original HTML
- `extracted.css` - All CSS styles
- `computed_styles.json` - Computed styles for every element
- `interactive_hover.png` - Hover state captures
- `responsive_*.png` - Responsive screenshots

---

**Last Updated:** {click.style('Auto-generated', fg='cyan')}
**Extraction Completeness:** {click.style('Comprehensive', fg='green')}
