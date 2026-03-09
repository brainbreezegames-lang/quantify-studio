# Comprehensive Design Guide

**Source URL:** https://www.todesktop.com/?ref=saaspo.com
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
  --text-2: rgba(255, 255, 255, 0.7);
  --text-3: rgba(255, 255, 255, 0.72);
  --text-4: rgba(255, 255, 255, 0.9);
  --text-5: rgba(255, 255, 255, 0.6);

  /* Background Colors */
  --bg-1: rgba(255, 255, 255, 0.06);
  --bg-2: rgba(255, 255, 255, 0.04);
  --bg-3: color(display-p3 0.0118 0.2067 0.9861);
  --bg-4: rgb(255, 255, 255);
  --bg-5: rgba(255, 255, 255, 0.08);

  /* Border Colors */
  --border-1: rgb(229, 231, 235);
  --border-2: rgba(255, 255, 255, 0.08);
  --border-3: rgba(255, 255, 255, 0.1);
  --border-4: rgb(255, 255, 255);
  --border-5: rgba(0, 0, 0, 0.04);
}
```

### Gradients

1. `linear-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0.8))`
2. `linear-gradient(0deg, rgb(255, 255, 255), rgb(230, 244, 247) 6.29%, rgb(128, 191, 239) 15.02%, rgb(68, 164, 233) 19.39%, rgb(48, 157, 231), rgb(16, 150, 229) 21.57%, color(xyz-d65 0.241 0.261 0.773), color(xyz-d65 0.23 0.248 0.764) 22.66%, color(xyz-d65 0.21 0.222 0.745) 23.75%, color(xyz-d65 0.188 0.157 0.764) 33.2%, color(xyz-d65 0.178 0.128 0.772), rgb(16, 70, 233) 42.64%, rgb(6, 29, 182) 53.09%, rgb(7, 11, 107) 66.19%, rgb(19, 2, 58) 75.33%, rgb(15, 7, 29) 86.09%, rgb(15, 7, 29))`
3. `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.75))`
4. `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`
5. `linear-gradient(rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0)), none`

### Shadow Colors

- `rgba(4, 8, 34, 0.06)`
- `rgba(3, 8, 35, 0.12)`
- `rgba(0, 0, 0, 0.12)`
- `rgba(255, 255, 255, 0.12)`
- `rgba(255, 255, 255, 0.16)`

---

## 📝 Typography System

### Font Stack

```css
:root {
  --font-1: Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-2: "Aeonik Pro", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-3: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
```

### Type Scale

```css
:root {
  --text-1: 9px;
  --text-2: 11px;
  --text-3: 12px;
  --text-4: 14px;
  --text-5: 16px;
  --text-6: 18px;
  --text-7: 36px;
  --text-8: 48px;
  --text-9: 64px;
  --text-10: 74px;
}
```

### Heading Hierarchy

| Element | Font Size | Weight | Line Height | Letter Spacing |
|---------|-----------|--------|-------------|----------------|
| h1 | 74px | 500 | 84px | -1.11px |
| h2 | 48px | 500 | 52px | -0.72px |

### Font Weights

- `400`
- `500`
- `600`

---

## 📐 Spacing & Layout

### Spacing Scale

```css
:root {
  /* Margins */
  --margin-1: -273px;
  --margin-2: -100px;
  --margin-3: -1px;
  --margin-4: 1px;
  --margin-5: 4px;
  --margin-6: 6px;
  --margin-7: 8px;
  --margin-8: 10px;
  --margin-9: 11px;
  --margin-10: 12px;

  /* Paddings */
  --padding-1: 1px;
  --padding-2: 2px;
  --padding-3: 3px;
  --padding-4: 3.45312px;
  --padding-5: 4px;
  --padding-6: 5px;
  --padding-7: 5.1875px;
  --padding-8: 6px;
  --padding-9: 6.90625px;
  --padding-10: 7px;

  /* Gaps (Flexbox/Grid) */
  --gap-1: 2px;
  --gap-2: 3px;
  --gap-3: 4px;
  --gap-4: 6px;
  --gap-5: 8px;
}
```

### Border Radius

```css
:root {
  --radius-1: 0px 0px 32px 32px;
  --radius-2: 0px 8px 8px 0px;
  --radius-3: 0px 0px 8px 8px;
  --radius-4: 0px 0px 16px 16px;
  --radius-5: 0px 0px 3px 3px;
  --radius-6: 1px;
  --radius-7: 2px 2px 1px 1px;
  --radius-8: 3px 3px 0px 0px;
}
```

---

## 🌟 Visual Effects

### Box Shadows

```css
/* Shadow 1 */
box-shadow: rgba(4, 8, 34, 0.06) 0px 1.5px 2px -0.75px, rgba(3, 8, 35, 0.12) 0px 1px 1.5px -0.5px, rgba(3, 8, 35, 0.12) 0px 0.5px 0.75px -0.25px, rgba(3, 8, 35, 0.12) 0px 0.25px 0.5px -0.125px, rgba(3, 8, 35, 0.12) 0px 0.125px 0.25px -0.062px, rgba(0, 0, 0, 0.12) 0px 0.062px 0.125px 0px;

/* Shadow 2 */
box-shadow: rgba(255, 255, 255, 0.12) 0px 1px 2px -0.5px inset, rgba(255, 255, 255, 0.16) 0px 0.5px 0.5px 0px inset, rgba(255, 255, 255, 0.16) 0px 8px 24px -4px inset, rgba(9, 1, 20, 0.03) 0px 8px 8px -3px, rgba(9, 1, 20, 0.03) 0px 5px 5px -2.5px, rgba(8, 1, 20, 0.03) 0px 3px 3px -1.5px, rgba(8, 1, 20, 0.03) 0px 2px 2px -1px, rgba(8, 1, 20, 0.03) 0px 1px 1px -0.5px, rgba(8, 1, 20, 0.03) 0px 0.5px 0.5px 0px;

/* Shadow 3 */
box-shadow: rgba(255, 255, 255, 0.08) 0px -4px 12px -4px inset, rgba(255, 255, 255, 0.06) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.12) 0px 0.5px 0.5px 0px inset, rgba(9, 1, 20, 0.06) 0px 8px 8px -3px, rgba(8, 1, 20, 0.06) 0px 3px 3px -1.5px, rgba(8, 1, 20, 0.04) 0px 2px 2px -1px, rgba(8, 1, 20, 0.03) 0px 1px 1px -0.5px, rgba(8, 1, 20, 0.03) 0px 0.5px 0.5px 0px;

/* Shadow 4 */
box-shadow: rgba(8, 1, 20, 0.03) 0px 2px 2px -1px, rgba(8, 1, 20, 0.03) 0px 1px 1px -0.5px, rgba(8, 1, 20, 0.03) 0px 0.5px 0.5px 0px, rgba(255, 255, 255, 0.04) 0px 2px 8px 0px inset, rgba(255, 255, 255, 0.1) 0px 1px 3px 0px inset, rgba(255, 255, 255, 0.12) 0px 0.5px 0.5px 0px inset;

/* Shadow 5 */
box-shadow: rgba(4, 8, 34, 0.06) 0px 2.824px 3.765px -1.412px, rgba(3, 8, 35, 0.12) 0px 1.882px 2.824px -0.941px, rgba(3, 8, 35, 0.12) 0px 0.941px 1.412px -0.471px, rgba(3, 8, 35, 0.12) 0px 0.471px 0.941px -0.235px, rgba(3, 8, 35, 0.12) 0px 0.235px 0.471px -0.118px, rgba(0, 0, 0, 0.12) 0px 0.118px 0.235px 0px;

```

### Filters

- `blur(3px)`
- `url("#filter0_b_640_2086")`
- `blur(4px)`
- `drop-shadow(rgba(0, 0, 0, 0.12) 0px 1.5px 1.5px) drop-shadow(rgba(0, 0, 0, 0.12) 0px 0.75px 0.75px) drop-shadow(rgba(0, 0, 0, 0.16) 0px 0.25px 0.25px)`
- `grayscale(1)`

### Opacity Values

- `0`
- `0.04`
- `0.1`
- `0.2`
- `0.3`
- `0.5`
- `0.6`
- `0.64`

---

## ✨ Animations & Transitions

### Transitions

```css
/* Transition 1 */
transition: all;

/* Transition 2 */
transition: 0.2s cubic-bezier(0.6, 0.6, 0, 1);

/* Transition 3 */
transition: transform 0.45s cubic-bezier(0.6, 0.6, 0, 1);

/* Transition 4 */
transition: 0.45s cubic-bezier(0.6, 0.6, 0, 1);

/* Transition 5 */
transition: 0.45s cubic-bezier(0.6, 0.6, 0, 1) 0.25s;

/* Transition 6 */
transition: opacity 1s cubic-bezier(0.76, 0, 0.24, 1);

/* Transition 7 */
transition: color 0.05s cubic-bezier(0.6, 0.6, 0, 1), background-color 0.05s cubic-bezier(0.6, 0.6, 0, 1), border-color 0.05s cubic-bezier(0.6, 0.6, 0, 1), text-decoration-color 0.05s cubic-bezier(0.6, 0.6, 0, 1), fill 0.05s cubic-bezier(0.6, 0.6, 0, 1), stroke 0.05s cubic-bezier(0.6, 0.6, 0, 1), opacity 0.05s cubic-bezier(0.6, 0.6, 0, 1), box-shadow 0.05s cubic-bezier(0.6, 0.6, 0, 1), transform 0.05s cubic-bezier(0.6, 0.6, 0, 1), filter 0.05s cubic-bezier(0.6, 0.6, 0, 1), backdrop-filter 0.05s cubic-bezier(0.6, 0.6, 0, 1);

/* Transition 8 */
transition: color 0.45s cubic-bezier(0.6, 0.6, 0, 1), background-color 0.45s cubic-bezier(0.6, 0.6, 0, 1), border-color 0.45s cubic-bezier(0.6, 0.6, 0, 1), text-decoration-color 0.45s cubic-bezier(0.6, 0.6, 0, 1), fill 0.45s cubic-bezier(0.6, 0.6, 0, 1), stroke 0.45s cubic-bezier(0.6, 0.6, 0, 1), opacity 0.45s cubic-bezier(0.6, 0.6, 0, 1), box-shadow 0.45s cubic-bezier(0.6, 0.6, 0, 1), transform 0.45s cubic-bezier(0.6, 0.6, 0, 1), filter 0.45s cubic-bezier(0.6, 0.6, 0, 1), backdrop-filter 0.45s cubic-bezier(0.6, 0.6, 0, 1);

```

### Keyframe Animations

#### @keyframes rotate-1turn

```css
100% { rotate: 360deg; }
```

#### @keyframes rotate-1turn

```css
100% { rotate: 360deg; }
```

#### @keyframes rotate-1turn

```css
100% { rotate: 360deg; }
```

---

## ⚡ Interactive States

---

## 🧩 Component Patterns

### Buttons

#### Button 1: "Products"

```css
background-color: rgba(0, 0, 0, 0);
color: rgba(255, 255, 255, 0.72);
padding: 8px 12px;
border-radius: 25px;
border: 0px solid rgb(229, 231, 235);
font-size: 14px;
font-weight: 400;
```

#### Button 2: "Log in"

```css
background-color: rgba(255, 255, 255, 0.04);
color: rgb(0, 0, 0);
padding: 12px;
border-radius: 999px;
border: 0px solid rgb(229, 231, 235);
font-size: 16px;
font-weight: 400;
```

#### Button 3: ""

```css
background-color: rgba(255, 255, 255, 0.04);
color: rgb(0, 0, 0);
padding: 7px;
border-radius: 999px;
border: 0px solid rgb(229, 231, 235);
font-size: 16px;
font-weight: 400;
```

---

## 🎭 UX Patterns

### Interaction Metrics

- **Interactive Elements:** 110
- **Scroll Behavior:** `smooth`
- **Cursor Styles Used:** `pointer`

### Accessibility Features

- ARIA Labels: 56
- ARIA Descriptions: 0
- Role Attributes: 1
- Image Alt Texts: 107

### Sticky/Fixed Elements

- `div` - Position: `fixed`, Top: `0px`, Z-Index: `9999`
- `div` - Position: `fixed`, Top: `-10000px`, Z-Index: `9999`

---

## 📱 Responsive Design

### Mobile (375x812)

- Viewport: 375x812
- Scroll Height: 16636px
- Body Width: 375px
- Screenshot: `responsive_mobile.png`

### Tablet (768x1024)

- Viewport: 768x1024
- Scroll Height: 13947px
- Body Width: 768px
- Screenshot: `responsive_tablet.png`

### Desktop (1920x1080)

- Viewport: 1920x1080
- Scroll Height: 12056px
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
