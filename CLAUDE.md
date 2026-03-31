# Quantify Studio — Project Context

## What This Is

An AI-powered design tool for creating XAML (Windows) and HTML/CSS screens for **Avontus Quantify** — a scaffolding rental & equipment management platform. Users type a prompt → AI generates a production-ready XAML component tree + HTML/CSS mockup.

## Tech Stack

**Frontend:**
- React 18 + TypeScript 5.6 (strict mode)
- Vite 6 (dev server proxies `/api` → `localhost:3001`)
- Tailwind CSS 3.4 + DaisyUI
- Material UI 7 (MUI) + Emotion
- React Router DOM 7 (SPA, client-side routing)
- Fonts: Switzer (sans), JetBrains Mono (mono)

**Backend:**
- Express.js (`server/index.js`) for local dev
- Vercel Serverless Functions (`api/`) for production
- OpenRouter API (primary AI model: `google/gemini-3.1-pro-preview`)
- Anthropic SDK available but not the primary path

**State:**
- Custom React Context + useReducer (no Redux)
- localStorage with `uno-studio-*` prefix for persistence

## Project Structure

```
src/
  components/       # UI panels (PromptPanel, PreviewPanel, PropertyEditor, etc.)
  designer/         # Separate canvas-based designer app (lazy-loaded at /designer)
  design-system/    # Reusable components + docs (lazy-loaded at /design-system)
  services/         # api.ts (fetch wrappers), xaml.ts (XAML generation)
  store.tsx         # Global state + reducers
  types.ts          # All TypeScript interfaces (authoritative)
  main.tsx          # Routes + app entry

server/
  index.js              # Local Express server
  claude.js             # OpenRouter calls (generateWithClaude, generateWebDesign)
  tree-schema.js        # XAML tree validation + auto-repair
  prompt-layers/        # Modular prompt assembly (DO NOT merge into one file)

api/
  generate.js       # Vercel version of the generation endpoint (mirrors server/claude.js)
  image.js          # Image generation
  voice.js          # Voice transcription
```

## Key Architecture Decisions

**Dual deployment:** Local dev uses `server/index.js`; production uses `api/` Vercel functions. Logic is intentionally duplicated between the two — this is known and accepted.

**Modular prompt layers:** System prompts are split into discrete files in `server/prompt-layers/`. Keep them separate. Do not consolidate into one giant prompt string.

**Client-side API key:** OpenRouter key is stored in localStorage (`openrouter_api_key`) and passed with every request. No server-side credential storage. Users BYOK.

**XAML tree validation:** Every generation passes through `server/tree-schema.js` which validates against a whitelist of ~30 component types and auto-repairs invalid nesting. Do not skip this step.

**Vercel function limit:** Free tier allows 12 functions. We're at the limit. Do not add new files to `api/` without removing one or consolidating.

## API Endpoints

```
POST /api/generate
  action: 'generate'  → screen from prompt
  action: 'improve'   → design improvements (quality toggles)
  action: 'enhance'   → prompt enhancement
  action: 'chat'      → Quantify knowledge chatbot
  Body: { prompt, designTokens, designBrief, qualityToggles, currentTree, imageUrl }

POST /api/image       → generate image via OpenRouter
POST /api/voice       → voice transcription/command processing
POST /api/generate-image-screen → image → screen design
```

Timeout: 290s on generation (Vercel max is 300s). Use AbortController for cleanup.

## Conventions

**TypeScript:** Strict mode. All domain types live in `src/types.ts`. Check there before defining new interfaces.

**CSS theming:** Data attribute driven — `data-theme="dark"|"light"`. Custom Tailwind tokens: `studio-bg`, `studio-surface`, `studio-accent`, etc. Use RGB variables: `rgb(var(--studio-bg) / <alpha-value>)`.

**localStorage keys:** All use `uno-studio-*` prefix. Chat history uses `quantify-chat-history`. Don't add new keys without following this pattern.

**Rate limiting:** Server enforces 10 req/min per IP (in-memory, resets on restart).

**Routes:** `/design-system` and `/designer` are lazy-loaded. Keep them that way.

## Domain Knowledge

**Avontus Quantify** is scaffolding rental management software. Key domain concepts:
- Location hierarchy: Branch → Sub-Branch → Staging → Job Sites → Scaffolds
- Core workflows: Deliveries, Returns, Transfers, Reservations
- Scaffold lifecycle (Status Machine): Awaiting Build → Build In Progress → Standing → Modify/Repair/Inspect/Handover → Dismantle → Dismantled
- Tag colors: Blue (not built yet), Red (cannot use), Green (safe), Yellow (precautions)
- Activity types: Build (1 per scaffold), Modify (multiple), Repair (internal only — no request), Dismantle (1 per scaffold)
- Full domain reference: `quantify-docs-reference.md` (includes complete Status Machine spec)

Design outputs target **Material Design 3** adapted for enterprise equipment management. Brand/style reference: `server/avontus-brand-guide.js`.

## What NOT to Do

- Don't add Redux or Zustand — we use Context + useReducer
- Don't switch from OpenRouter to direct Anthropic API calls without discussion
- Don't add new Vercel functions without removing/merging existing ones (12-function limit)
- Don't merge prompt layer files — modularity is intentional
- Don't store API keys server-side — BYOK via localStorage is the design
- Don't skip XAML tree validation/repair step
