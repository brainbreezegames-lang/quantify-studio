export const config = {
  api: {
    bodyParser: { sizeLimit: '4mb' },
  },
  maxDuration: 60,
}

const ALLOWED_ORIGINS = [
  'https://quantify-studio.vercel.app',
  'http://localhost:5173',
  'http://localhost:3001',
]

const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 60000
const RATE_LIMIT_MAX = 20

function checkRateLimit(ip) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 })
    return true
  }
  entry.count++
  return entry.count <= RATE_LIMIT_MAX
}

export default async function handler(req, res) {
  const origin = req.headers.origin
  if (ALLOWED_ORIGINS.includes(origin) || origin === 'null' || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
  if (!checkRateLimit(ip)) return res.status(429).json({ error: 'Rate limit exceeded' })

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' })

  const { prompt, aspectRatio, size } = req.body || {}
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt is required' })
  }
  if (prompt.length > 2000) {
    return res.status(400).json({ error: 'Prompt too long (max 2000 chars)' })
  }

  try {
    const imageConfig = {
      image_size: size === '512' ? '0.5K' : (size || '1K'),
    }
    if (aspectRatio) imageConfig.aspect_ratio = aspectRatio

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://quantify-studio.vercel.app',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-image-preview',
        messages: [{ role: 'user', content: prompt }],
        modalities: ['image', 'text'],
        image_config: imageConfig,
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error?.message || `OpenRouter error ${response.status}`)
    }

    const data = await response.json()
    const msg = data.choices?.[0]?.message || {}
    const images = []
    let textResponse = msg.content || ''

    // OpenRouter returns images in message.images[]
    if (Array.isArray(msg.images)) {
      for (const img of msg.images) {
        const url = img.image_url?.url || img.url || ''
        if (url) {
          const mimeMatch = url.match(/^data:([^;]+);/)
          images.push({ dataUri: url, mimeType: mimeMatch?.[1] || 'image/png' })
        }
      }
    }

    if (images.length === 0) {
      return res.status(422).json({ error: 'No image generated', text: textResponse })
    }

    return res.json({
      images: images.map(img => ({
        dataUri: img.dataUri,
        mimeType: img.mimeType,
      })),
      text: textResponse || null,
    })
  } catch (err) {
    console.error('Image generation error:', err)
    return res.status(500).json({ error: err.message || 'Image generation failed' })
  }
}
