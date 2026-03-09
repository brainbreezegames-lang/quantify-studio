import {
  buildVoiceLlmPrompt,
  createEmptyPage,
  inferVoiceTargetIds,
  protectVoiceTreeProgress,
  resolveVoiceCommand,
} from '../server/voice-command-utils.js'

export const config = {
  api: { bodyParser: { sizeLimit: '1mb' } },
}

const ALLOWED_ORIGINS = [
  'https://uno-studio.vercel.app',
  'http://localhost:5173',
  'http://localhost:3001',
]

const VOICE_SYSTEM_PROMPT = `You are an expert real-time wireframe editor. You generate mobile UI component trees from spoken commands. The user speaks naturally — repeating, correcting, or contradicting themselves. Interpret their INTENT.

## Output format
Return JSON: { "tree": <component tree>, "action": "<summary>", "hint": "<suggestion>" }
ONLY valid JSON. No markdown, no commentary.

## Tree schema
{ id: string, type: string, properties: { [key]: string }, children: [] }
All property values MUST be strings. Use descriptive kebab-case IDs.
Root must be type "Page". Content goes in ScrollViewer > StackPanel.

## Available components (use ANY of these freely)

**Layout:** Page, StackPanel (Orientation: Horizontal/Vertical, Spacing, Padding), Grid (Columns, Rows), ScrollViewer, Border (Background, BorderBrush, CornerRadius, Padding)

**Text & Input:** TextBlock (Text, Style: BodySmall/BodyMedium/BodyLarge/TitleSmall/TitleMedium/TitleLarge/HeadlineSmall/HeadlineMedium/HeadlineLarge/DisplaySmall, Foreground, HorizontalAlignment), TextBox (Header, PlaceholderText), PasswordBox (Header, PlaceholderText), AutoSuggestBox (Header, PlaceholderText)

**Buttons:** Button (Content, Style: Filled/Outlined/Text/Tonal, HorizontalAlignment), IconButton (Glyph, Style: Standard/Filled), FloatingActionButton (Glyph, Label)

**Media:** Image (Width, Height, HorizontalAlignment: Stretch/Left/Center/Right), PersonPicture (DisplayName, Width), Icon (Glyph, Foreground)

**Selection:** ToggleSwitch (Header, IsOn), CheckBox (Content, IsChecked), RadioButton (Content, IsChecked), Slider (Header, Value, Minimum, Maximum), Select (Header, SelectedItem, PlaceholderText)

**Progress:** ProgressBar (Value, IsIndeterminate), ProgressRing (Value, IsIndeterminate)

**Navigation:** NavigationBar (Title, children: IconButton), BottomNavigationBar (children: NavigationViewItem), NavigationRail (children: NavigationViewItem), NavigationDrawer (children: NavigationViewItem), NavigationViewItem (Content, Icon, IsSelected)

**Containers:** Card (Style: Elevated/Outlined/Filled, Padding, Background, BorderBrush, Height), ListView (children), GridView (Columns, Spacing, children)

**Data:** DataTable (Columns: "Col1,Col2,...", RowsJson: "[{Col1:val,...}]", Height, Scrollable)

**Feedback:** Divider, Chip (Content, IsSelected, Style: Assist/Filter/Input/Suggestion), Snackbar (Content, ActionText), Badge (Content, Value), Tooltip (Content)

**Overlay:** Dialog (Title, Content), BottomSheet (Title, children), InfoBar (Title, Message, Severity: Info/Warning/Error/Success)

**Pickers:** DatePicker (Header), TimePicker (Header), Stepper (Value, Minimum, Maximum)

**Segmented:** SegmentedButton (children: Button), Tabs (children: Button with IsSelected)

## RULES

1. **Generate rich, realistic content.** Use real names, realistic data, proper icons. Never use "Lorem ipsum" or "Column 1/Row 1" placeholders.

2. **Use the FULL component library.** You have 40+ components. Build complex, realistic screens — Airbnb details, dashboards, social feeds, e-commerce, settings, whatever the user describes. Combine components creatively.

3. **Edits must be surgical.** When editing an existing tree, copy it EXACTLY and change ONLY what the user asked. Keep all existing ids, types, properties, children order. Do NOT regenerate unchanged parts.

4. **Removals are permanent.** When the user says remove/delete, actually remove those nodes. Never re-add them.

5. **Latest instruction wins.** Most recent command overrides prior ones.

6. **Spatial references:** "on top" = first children, "at the bottom" = last children, "beside"/"next to" = horizontal StackPanel sibling.`

function extractJson(text) {
  try {
    return JSON.parse(text)
  } catch {}

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim())
    } catch {}
  }

  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1))
    } catch {}
  }

  return null
}

export default async function handler(req, res) {
  const origin = req.headers.origin || ''
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { transcript, currentTree, history, previousTree, lastTargetIds, voiceSession } = req.body || {}
    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ error: 'transcript is required' })
    }

    const heuristic = resolveVoiceCommand({ transcript, currentTree, previousTree, lastTargetIds, voiceSession })
    if (heuristic.locallyHandled) {
      return res.json({
        tree: heuristic.tree,
        action: heuristic.directiveSummary[0] || 'Updated wireframe',
        hint: heuristic.unresolved?.length ? `Still missing: ${heuristic.unresolved[0]}` : null,
        source: 'heuristic',
        transcript: heuristic.normalizedTranscript,
        targetIds: heuristic.targetIds || [],
        voiceSession: heuristic.voiceSession,
      })
    }

    const apiKey = process.env.MERCURY_API_KEY
    if (!apiKey) {
      return res.json({
        tree: heuristic.tree || currentTree || createEmptyPage(),
        action: 'Applied heuristic fallback',
        hint: null,
        source: 'fallback',
        transcript: heuristic.normalizedTranscript,
        targetIds: heuristic.targetIds || lastTargetIds || [],
        voiceSession: heuristic.voiceSession,
      })
    }

    const { userPrompt, normalizedTranscript, seededTree } = buildVoiceLlmPrompt({
      transcript,
      currentTree: heuristic.tree || currentTree,
      history,
      previousTree,
      lastTargetIds,
      voiceSession,
    })

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 18_000)
    let response
    try {
      response = await fetch('https://api.inceptionlabs.ai/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mercury-2',
          messages: [
            { role: 'system', content: VOICE_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 4096,
          temperature: 0.2,
        }),
      })
    } catch (err) {
      clearTimeout(timer)
      if (err?.name === 'AbortError') {
        return res.json({
          tree: seededTree || heuristic.tree || currentTree || createEmptyPage(),
          action: 'Used seeded fallback after timeout',
          hint: null,
          source: 'timeout-fallback',
          transcript: normalizedTranscript,
          targetIds: heuristic.targetIds || lastTargetIds || [],
          voiceSession: heuristic.voiceSession,
        })
      }
      throw err
    }
    clearTimeout(timer)

    if (!response.ok) {
      console.error('Mercury error:', await response.text())
      return res.json({
        tree: seededTree || heuristic.tree || currentTree || createEmptyPage(),
        action: 'Used seeded fallback after Mercury error',
        hint: null,
        source: 'error-fallback',
        transcript: normalizedTranscript,
        targetIds: heuristic.targetIds || lastTargetIds || [],
        voiceSession: heuristic.voiceSession,
      })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    const parsed = extractJson(content)
    if (!parsed) {
      console.error('Failed to parse from:', content.slice(0, 300))
      return res.json({
        tree: seededTree || heuristic.tree || currentTree || createEmptyPage(),
        action: 'Used seeded fallback after parse failure',
        hint: null,
        source: 'parse-fallback',
        transcript: normalizedTranscript,
        targetIds: heuristic.targetIds || lastTargetIds || [],
        voiceSession: heuristic.voiceSession,
      })
    }

    if (parsed.tree && typeof parsed.tree === 'object' && parsed.tree.id) {
      const protectedResult = protectVoiceTreeProgress({
        currentTree,
        candidateTree: parsed.tree,
        transcript,
        previousTree,
      })
      const targetIds = protectedResult.prevented
        ? (lastTargetIds || [])
        : inferVoiceTargetIds({
            previousTree: currentTree,
            nextTree: protectedResult.tree,
            fallbackIds: lastTargetIds || [],
          })
      return res.json({
        tree: protectedResult.tree,
        action: protectedResult.prevented ? protectedResult.reason : (parsed.action || null),
        hint: parsed.hint || null,
        source: protectedResult.prevented ? 'protected-fallback' : 'mercury',
        transcript: normalizedTranscript,
        targetIds,
        voiceSession: heuristic.voiceSession,
      })
    }

    const protectedResult = protectVoiceTreeProgress({
      currentTree,
      candidateTree: parsed,
      transcript,
      previousTree,
    })
    const targetIds = protectedResult.prevented
      ? (lastTargetIds || [])
      : inferVoiceTargetIds({
          previousTree: currentTree,
          nextTree: protectedResult.tree,
          fallbackIds: lastTargetIds || [],
        })
    return res.json({
      tree: protectedResult.tree,
      action: protectedResult.prevented ? protectedResult.reason : null,
      hint: null,
      source: protectedResult.prevented ? 'protected-fallback' : 'mercury',
      transcript: normalizedTranscript,
      targetIds,
      voiceSession: heuristic.voiceSession,
    })
  } catch (err) {
    console.error('Voice interpretation error:', err)
    return res.status(500).json({ error: 'Voice interpretation failed' })
  }
}
