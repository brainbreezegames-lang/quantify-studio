---
name: aesthetic-quality-review
description: Multi-phase design aesthetic quality review that evaluates whether frontend interfaces have distinctive, intentional design or fall into generic "AI slop" patterns. Inspired by frontend-design plugin's aesthetic principles.
---

This skill evaluates the **aesthetic quality and intentionality** of frontend interfaces, detecting generic patterns and assessing design distinction. Unlike technical audits, this focuses on whether the design is memorable, contextual, and intentionally crafted.

## When to Use

- Reviewing existing UI for "AI slop" aesthetics (generic, cookie-cutter design)
- Assessing design system aesthetic direction
- Preparing for visual redesign
- Evaluating brand/product distinctiveness
- Checking if design matches intended tone

## 5-Phase Aesthetic Review Workflow

### Phase 1: Context Discovery

Understand the product and intended aesthetic direction:

**Ask the user:**
1. **Product Context**
   - What does this product do?
   - Who is the target audience?
   - What's the brand personality? (playful, serious, luxury, brutalist, minimal, etc.)

2. **Intended Aesthetic**
   - What aesthetic were you aiming for?
   - Any design references or mood boards?
   - Specific design goals? (memorable, refined, bold, understated?)

3. **Current Perception**
   - Does the current design feel distinctive or generic?
   - Any feedback from users about visual impression?

4. **Review Scope**
   - Entire app or specific pages/components?
   - Focus areas? (typography, color, motion, layout, visual details?)

**Output:**
```markdown
## Aesthetic Quality Review - Discovery

### Product Context
- Purpose: [What it does]
- Audience: [Who uses it]
- Brand: [Intended personality]

### Intended Aesthetic
- Direction: [What you were aiming for]
- References: [Any inspiration]
- Goals: [Memorable/refined/bold/etc.]

### Current Perception
- [User's current assessment]

### Focus Areas
- [Typography/Color/Motion/Layout/Details]

### Proceeding to Phase 2: Initial Visual Scan
```

---

### Phase 2: Initial Visual Scan

Quick scan to identify design patterns:

**Actions:**
1. Use Glob to find:
   - Style files (CSS, SCSS, Tailwind config)
   - Component files (React, Vue, Svelte)
   - Font declarations
   - Color definitions
   - Animation/motion code

2. Scan for common patterns:
   - Font families used
   - Color palette
   - Spacing patterns
   - Animation usage

**Quick Assessment:**
```markdown
## Phase 2: Initial Visual Scan

### Typography Detected
- Fonts used: [List all font-family declarations]
- **Red Flag Check**: Inter, Roboto, Arial, system fonts? (⚠️ Generic)
- Custom/distinctive fonts? (✅ Intentional)

### Color Palette
- Primary colors: [List]
- **Red Flag Check**: Purple gradients on white? (⚠️ Cliché)
- **Red Flag Check**: All colors from default Tailwind? (⚠️ Generic)
- Custom color system? (✅ Intentional)

### Layout Patterns
- Grid usage: [Standard/Unexpected]
- Asymmetry present? (✅ Distinctive)
- Cookie-cutter layouts? (⚠️ Generic)

### Motion & Animation
- Animations found: [Count/type]
- High-impact page loads? (✅ Memorable)
- Generic fade-ins only? (⚠️ Predictable)

### Visual Details
- Backgrounds: Solid colors or contextual atmosphere?
- Textures/gradients/patterns used?
- Custom cursors/decorative elements?

### Initial Assessment
**Generic Score**: [Low/Medium/High]
- [List generic patterns detected]

**Distinctive Score**: [Low/Medium/High]
- [List intentional choices detected]

### Proceeding to Phase 3: Clarifying Questions
```

---

### Phase 3: Clarifying Questions (🛑 CHECKPOINT)

**IMPORTANT:** Pause and ask about findings and priorities.

**Ask the user:**

#### Aesthetic Intent Alignment
1. **Typography**: I found [fonts]. Were these intentional choices, or defaults?
   - If generic: "Want recommendations for more distinctive typography?"
2. **Colors**: Palette is [assessment]. Does this match your brand?
   - If generic Tailwind: "Should we develop a custom color system?"
3. **Layout**: Layouts feel [standard/unexpected]. Intentional?
   - If cookie-cutter: "Open to more asymmetric/bold compositions?"

#### Design Direction
1. **Boldness Tolerance**: On a scale of minimal-refined to maximalist-chaos, where should this land?
2. **Differentiation**: What's the ONE thing you want users to remember visually?
3. **Constraints**: Any brand guidelines, accessibility requirements, or technical limits?

#### Review Depth
1. **Focus**: Should I deep dive into:
   - Typography pairing and hierarchy?
   - Color system and palette refinement?
   - Motion design and micro-interactions?
   - Spatial composition and layout innovation?
   - All of the above?

2. **References**: Any design systems or products whose aesthetic you admire?

**📋 Present Initial Findings:**
- "I detected [X] generic patterns: [list]"
- "Strong points: [distinctive elements found]"
- "Biggest aesthetic opportunity: [suggestion]"

**Wait for user responses.**

---

### Phase 4: Deep Aesthetic Analysis with Gemini

Based on user's priorities and intended direction, run focused Gemini analysis:

**Verify Gemini CLI:**
```bash
which gemini || echo "Please install Gemini CLI"
```

**Construct Aesthetic Analysis Prompt:**

```bash
gemini -p "@src/components @src/styles @app @tailwind.config.*

You are a Design Critic evaluating aesthetic quality and intentionality based on these principles:

## Product Context
[INSERT FROM PHASE 1]
- Purpose: [product purpose]
- Audience: [target users]
- Intended aesthetic: [user's goal]
- Desired memorability: [THE ONE THING from Phase 3]

## Aesthetic Evaluation Framework

### 1. Typography Assessment (Priority: [from user])

**Evaluate:**
- Font choices: Distinctive vs generic (flag: Inter, Roboto, Arial, system fonts)
- Font pairing: Display + body font harmony
- Typography hierarchy: Clear and intentional?
- Character: Do fonts feel contextual to [product purpose]?
- Unexpected choices: Anything that surprises positively?

**Reference**: Avoid generic fonts. Look for characterful, beautiful, interesting choices.

**Output**:
- Generic fonts detected (with file:line)
- Distinctive choices (with rationale)
- Pairing effectiveness
- Recommendations for [user's intended direction]

### 2. Color & Theme System (Priority: [from user])

**Evaluate:**
- Palette intentionality: Custom vs default Tailwind?
- Color psychology: Does palette match [brand personality]?
- Dominant colors with accents vs timid distribution?
- CSS variables: Consistent theme system?
- Clichés detected: Purple gradients on white? Overused combinations?

**Reference**: Dominant colors with sharp accents outperform evenly-distributed palettes.

**Output**:
- Generic patterns (file:line)
- Cliché usage
- Custom color system quality
- Recommendations for [user's intended boldness level from Phase 3]

### 3. Motion & Animation (Priority: [from user])

**Evaluate:**
- Animation presence: High-impact moments or scattered micro-interactions?
- Page load experience: Orchestrated reveals with staggered timing?
- Scroll-triggered effects: Surprises on interaction?
- Hover states: Memorable or predictable?
- CSS-only vs library: Appropriate for stack?

**Reference**: One well-orchestrated page load > scattered micro-interactions.

**Output**:
- Animation inventory (file:line)
- High-impact opportunities missed
- Predictable patterns
- Recommendations for [user's motion priorities]

### 4. Spatial Composition & Layout (Priority: [from user])

**Evaluate:**
- Layout patterns: Unexpected vs cookie-cutter?
- Asymmetry usage: Present and effective?
- Negative space: Generous or cramped?
- Grid-breaking elements: Any bold compositional choices?
- Responsive patterns: Interesting or standard?

**Reference**: Unexpected layouts, asymmetry, overlap, diagonal flow create distinction.

**Output**:
- Layout assessment per page/component
- Cookie-cutter patterns (file:line)
- Compositional opportunities
- Recommendations for [user's layout boldness]

### 5. Visual Details & Atmosphere (Priority: [from user])

**Evaluate:**
- Backgrounds: Solid colors or atmospheric depth?
- Textures: Grain, noise, patterns present?
- Gradients: Custom mesh gradients or defaults?
- Shadows/elevation: Custom system or generic?
- Decorative elements: Custom cursors, borders, overlays?
- Context-specificity: Do details feel designed FOR THIS product?

**Reference**: Create atmosphere and depth, not defaults to solid colors.

**Output**:
- Visual detail inventory
- Generic vs intentional details
- Atmospheric quality
- Recommendations for [product context]

### 6. Overall Aesthetic Coherence

**Evaluate:**
- Conceptual direction: Is there ONE clear vision?
- Execution consistency: Vision executed across all pages?
- Intentionality: Does every choice feel considered?
- Generic AI slop patterns: [LIST ALL DETECTED]
  - Overused fonts (Inter, Roboto, Arial)
  - Purple gradients on white
  - Predictable layouts
  - Lack of context-specific character
- Memorability: What's the ONE thing users will remember?

**Output**:
- Coherence score: [X/10]
- Vision clarity: [assessment]
- Generic patterns summary
- Distinctive elements summary
- Gap: Intended aesthetic vs actual implementation

**Constraints from User:**
[INSERT CONSTRAINTS FROM PHASE 3]

**Output Format:**
- Category scores (X/10)
- Specific findings with file:line references
- Before/after code examples for improvements
- Prioritize by [user's focus areas from Phase 3]
"
```

**Parse Gemini Analysis:**

```markdown
## Phase 4: Deep Aesthetic Analysis Results

### Overall Aesthetic Quality: X/10
**Intentionality Score**: Y/10
**Distinctiveness Score**: Z/10

---

#### Typography (Score: W/10)

**Generic Patterns Detected** 🔴
- `src/App.css:12` - `font-family: Inter, system-ui`
  - **Impact**: Ubiquitous tech SaaS aesthetic, no distinction
  - **Context**: For [product purpose], this feels generic

- `src/components/Header.tsx:45` - No display font, all Inter
  - **Impact**: Missed opportunity for hierarchy and character

**Distinctive Choices** ✅
- `src/styles/hero.css:23` - Custom display font pairing
  - [If found, highlight]

**Recommendations**:
- Replace Inter with [contextual suggestion for user's product]
  - For [brand personality]: Consider [font families]
  - Pair distinctive display font with refined body font
  - Examples: [specific pairings with rationale]

**Code Example**:
```css
/* Before */
font-family: Inter, system-ui, sans-serif;

/* After - For [user's context] */
--font-display: 'Editorial New', serif;
--font-body: 'Suisse Intl', sans-serif;
```

---

#### Color & Theme (Score: V/10)

**Generic Patterns** 🔴
- All colors from default Tailwind (no customization)
- `bg-purple-600` + `bg-white` gradient pattern (cliché)
- Timid, evenly-distributed palette (no dominant colors)

**Clichés Found**:
- Purple-to-white gradients: 8 instances
- Standard Tailwind blues/grays: No custom brand colors

**Intentional Choices** ✅
- [If custom CSS variables found, highlight]

**Recommendations**:
- Develop custom color system for [brand personality]
- Dominant color: [suggestion for user's context] with sharp accents
- Example palette for [intended aesthetic]:
  ```css
  --color-dominant: [hex];
  --color-accent: [hex];
  --color-subtle: [hex];
  ```

---

#### Motion & Animation (Score: U/10)

**Current State**:
- Generic fade-ins: 12 instances (predictable)
- No page load orchestration
- Missing high-impact moments

**Opportunities**:
- Staggered page load reveal for hero section
- Scroll-triggered surprises on [key sections]
- Custom hover states for [interactive elements]

**Code Example**:
```css
/* High-impact page load */
.hero-title {
  animation: reveal 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  animation-delay: 0.1s;
}
.hero-subtitle {
  animation: reveal 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  animation-delay: 0.3s;
}
```

---

#### Layout & Composition (Score: T/10)

**Cookie-Cutter Patterns**:
- All components use centered, symmetric layouts
- No grid-breaking elements
- Predictable responsive patterns

**Opportunities**:
- Asymmetric hero layout
- Overlapping elements in [section]
- Generous negative space in [area]

---

#### Visual Details (Score: S/10)

**Current**:
- All solid color backgrounds (no atmosphere)
- No textures, grain, or custom gradients
- Generic shadows from Tailwind defaults

**Opportunities**:
- Atmospheric backgrounds for [sections]
- Custom gradient mesh for hero
- Grain overlay for texture
- Custom cursor for [interactive areas]

**Code Example**:
```css
/* Before */
background: white;

/* After - Create atmosphere */
background:
  radial-gradient(circle at 20% 30%, rgba(...) 0%, transparent 50%),
  radial-gradient(circle at 80% 70%, rgba(...) 0%, transparent 50%),
  linear-gradient(180deg, #fff 0%, #f9f9f9 100%);
```

---

### Generic "AI Slop" Patterns Summary 🚨

Total generic patterns detected: [N]

1. **Typography**: Inter (ubiquitous SaaS font)
2. **Color**: Purple gradients on white (AI generation cliché)
3. **Layout**: All centered, symmetric (predictable)
4. **Animation**: Generic fade-ins (no high-impact moments)
5. **Details**: Solid backgrounds (no atmospheric depth)

**Overall Assessment**: Current design feels [generic/somewhat intentional/distinctive]

**Gap Analysis**:
- **Intended**: [User's stated aesthetic goal]
- **Actual**: [What the code shows]
- **Deviation**: [How far off and why]

### Proceeding to Phase 5: Aesthetic Improvement Recommendations
```

---

### Phase 5: Aesthetic Improvement Recommendations (🛑 CHECKPOINT)

Present prioritized approaches for aesthetic enhancement:

**Option A: Quick Aesthetic Wins (Non-breaking)**
- Replace generic fonts (1-2 hours)
- Develop custom color palette (2-3 hours)
- Add 1-2 high-impact animations (1 hour)
- Total effort: ~1 day
- Impact: Noticeable improvement, more distinctive

**Option B: Comprehensive Visual Redesign**
- Full typography system with distinctive pairing
- Custom color system and theme
- Choreographed motion design
- Unexpected layouts for key pages
- Atmospheric visual details
- Total effort: 1-2 weeks
- Impact: Transform from generic to memorable

**Option C: Incremental Aesthetic Refinement**
- **Phase 1**: Typography + Color (2-3 days)
- **Phase 2**: Motion Design (2 days)
- **Phase 3**: Layout Innovation (3-4 days)
- **Phase 4**: Visual Details & Atmosphere (1-2 days)
- Total: ~2 weeks phased

**Option D: Focus Area (Based on Phase 3)**
- If user wanted typography focus: Deep dive on font pairing
- If user wanted motion: Choreograph entire experience
- Custom approach based on priorities

**Ask user:**
```
I've identified [N] generic patterns and [M] distinctive elements.

To achieve your intended aesthetic of [user's goal], I recommend:

Which path resonates?
- A) Quick wins (~1 day for immediate improvement)
- B) Comprehensive redesign (transform to distinctive)
- C) Incremental refinement (phased approach)
- D) Focus on [specific area from Phase 3]

Or should I:
- Generate more specific recommendations for [area]?
- Create mood board / design reference examples?
- Provide detailed font pairing suggestions?
- Design a custom color palette for [brand]?
```

**Wait for user decision.**

---

### After User Approval: Deliverables

Based on user's choice, deliver:

**Aesthetic Improvement Guide**:
```markdown
## Aesthetic Enhancement Plan - [Chosen Approach]

### Typography Transformation
**Current**: Inter (generic SaaS)
**Recommended**: [Specific pairing for user's context]

Implementation:
```css
/* Add to theme */
@import url('[Google Fonts/Fontshare/etc.]');

:root {
  --font-display: '[Display font]', serif;
  --font-body: '[Body font]', sans-serif;
}

/* Apply */
h1, h2, h3 { font-family: var(--font-display); }
p, span, div { font-family: var(--font-body); }
```

**Rationale**: [Why these fonts for user's product/brand]

---

### Color System Redesign
**Current**: Default Tailwind (generic)
**Recommended**: Custom palette for [brand personality]

```css
:root {
  /* Dominant color - [rationale for choice] */
  --color-primary: #[hex];
  --color-primary-dark: #[hex];

  /* Sharp accent - [rationale] */
  --color-accent: #[hex];

  /* Subtle backgrounds */
  --color-bg-subtle: #[hex];
  --color-bg-emphasis: #[hex];
}
```

**Usage Guidelines**:
- Primary: 60% of interface
- Accent: 10% (calls-to-action, key highlights)
- Neutrals: 30%

---

### Motion Choreography
**High-Impact Page Load**:
```css
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-element-1 { animation: reveal 0.8s ease-out 0.1s backwards; }
.hero-element-2 { animation: reveal 0.8s ease-out 0.3s backwards; }
.hero-element-3 { animation: reveal 0.8s ease-out 0.5s backwards; }
```

**Scroll-Triggered Surprises**:
[Specific recommendations for user's pages]

---

### Layout Innovation
**Before**: Centered, symmetric
**After**: Asymmetric, grid-breaking

[Specific layout code examples for user's key pages]

---

### Atmospheric Details
**Background Transformation**:
```css
/* Replace flat white with atmospheric depth */
.hero {
  background:
    radial-gradient(
      circle at 20% 30%,
      rgba([color], 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba([color], 0.1) 0%,
      transparent 50%
    ),
    linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
}
```

**Grain Texture Overlay**:
```css
.with-texture::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml,...'); /* grain SVG */
  opacity: 0.03;
  mix-blend-mode: multiply;
}
```

---

### Implementation Checklist
- [ ] Update typography system
- [ ] Implement custom color palette
- [ ] Add page load choreography
- [ ] Refine [X] key layouts
- [ ] Add atmospheric backgrounds
- [ ] Test on [devices/browsers]
- [ ] Validate accessibility (WCAG contrast)
- [ ] Get stakeholder feedback

### Success Metrics
- **Before**: [generic patterns count]
- **After**: [distinctive elements count]
- Aesthetic score: [X/10] → [Y/10]
- Memorability: [THE ONE THING users will remember]
```

## Special Features

### Reference Generation
Can generate:
- Mood boards based on user's aesthetic goal
- Font pairing examples with rationale
- Color palette with psychology explanation
- Motion design references

### Comparative Analysis
Offer to compare to:
- Competitors' design approaches
- Industry-leading design systems
- Reference products user admires

### Integration with Implementation
After approval, can:
1. Generate actual CSS/Tailwind config code
2. Create design tokens file
3. Update component styling
4. Implement animations

## Key Principles

1. **Intentionality Over Intensity**: Both minimal and maximal can work if intentional
2. **Context-Specificity**: Every recommendation tailored to product purpose and brand
3. **Memorability**: Focus on THE ONE THING users will remember
4. **Avoid Generic**: Actively detect and replace "AI slop" patterns
5. **Practical**: All recommendations with implementation code

This ensures aesthetic reviews produce distinctive, memorable interfaces that avoid generic patterns.
