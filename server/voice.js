import dotenv from 'dotenv'
import {
  buildVoiceLlmPrompt,
  createEmptyPage,
  inferVoiceTargetIds,
  protectVoiceTreeProgress,
  resolveVoiceCommand,
} from './voice-command-utils.js'

dotenv.config()

const VOICE_SYSTEM_PROMPT = `You are an expert real-time wireframe editor. The user is speaking naturally, often correcting themselves mid-sentence. Update the mobile UI component tree accurately and return only valid JSON for the complete updated tree. Preserve good structure, latest correction wins, full width means horizontal stretch, not just extra height, and never wipe most of the screen for a small ambiguous edit unless the user explicitly says to clear or keep only one thing.`

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

export function setupVoiceRoutes(app) {
  app.post('/api/voice', async (req, res) => {
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

      const apiKey = process.env.OPENROUTER_API_KEY
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

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-sonnet-4',
          messages: [
            { role: 'system', content: VOICE_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 4096,
          temperature: 0.2,
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error('OpenRouter error:', errText)
        return res.json({
          tree: seededTree || heuristic.tree || currentTree || createEmptyPage(),
          action: 'Used seeded fallback after model error',
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
        console.error('Failed to parse tree from:', content.slice(0, 200))
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
          source: protectedResult.prevented ? 'protected-fallback' : 'llm',
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
        source: protectedResult.prevented ? 'protected-fallback' : 'llm',
        transcript: normalizedTranscript,
        targetIds,
        voiceSession: heuristic.voiceSession,
      })
    } catch (err) {
      console.error('Voice interpretation error:', err)
      return res.status(500).json({ error: 'Voice interpretation failed' })
    }
  })

  app.get('/api/deepgram-key', (_req, res) => {
    const key = process.env.DEEPGRAM_API_KEY
    if (!key) {
      return res.status(500).json({ error: 'DEEPGRAM_API_KEY not configured' })
    }
    return res.json({ key })
  })
}
