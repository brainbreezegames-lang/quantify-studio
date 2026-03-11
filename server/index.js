import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { generateWithClaude, generateWebDesign } from './claude.js'
import { repairComponentTree, validateTreeStrict } from './tree-schema.js'
import { setupVoiceRoutes } from './voice.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001'],
}))
app.use(express.json({ limit: '2mb' }))

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, designTokens, currentTree, designBrief, imageUrl, qualityToggles } = req.body

    if ((!prompt || typeof prompt !== 'string') && !imageUrl) {
      return res.status(400).json({ error: 'Prompt or image URL is required' })
    }
    if (prompt && prompt.length > 20000) {
      return res.status(400).json({ error: 'Prompt too long (max 20000 chars)' })
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({ error: 'AI generation is not available — no API key configured. Please add your OpenRouter API key in settings.' })
    }

    const [tree, webDesign] = await Promise.all([
      generateWithClaude(prompt, designTokens, currentTree, designBrief, imageUrl, qualityToggles),
      generateWebDesign(prompt, designTokens, currentTree, designBrief, qualityToggles, imageUrl)
        .catch((err) => { console.warn('Web design generation warning:', err?.message); return null }),
    ])
    res.json({ tree, webDesign })
  } catch (err) {
    console.error('Generation error:', err)
    res.status(500).json({ error: 'Generation failed' })
  }
})

// ── Image generation endpoint ──
app.post('/api/image', async (req, res) => {
  const { prompt, aspectRatio, size } = req.body || {}
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt is required' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' })
  }

  try {
    const imageConfig = { image_size: size === '512' ? '0.5K' : (size || '1K') }
    if (aspectRatio) imageConfig.aspect_ratio = aspectRatio

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://uno-studio.vercel.app',
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

    if (images.length === 0) return res.status(422).json({ error: 'No image generated' })
    return res.json({ images })
  } catch (err) {
    console.error('Image generation error:', err)
    return res.status(500).json({ error: err.message || 'Image generation failed' })
  }
})

// ── Image screen generation endpoint ──
app.post('/api/generate-image-screen', async (req, res) => {
  try {
    const handler = (await import('../api/generate-image-screen.js')).default
    await handler(req, res)
  } catch (err) {
    console.error('Image screen generation error:', err)
    if (!res.headersSent) res.status(500).json({ error: 'Image screen generation failed' })
  }
})

// ── Quantify knowledge chat endpoint ──
app.post('/api/quantify-chat', async (req, res) => {
  try {
    const handler = (await import('../api/quantify-chat.js')).default
    await handler(req, res)
  } catch (err) {
    console.error('Quantify chat error:', err)
    if (!res.headersSent) res.status(500).json({ error: 'Chat failed' })
  }
})

setupVoiceRoutes(app)

app.listen(PORT, () => {
  console.log(`Uno Studio server running on http://localhost:${PORT}`)
  if (!process.env.OPENROUTER_API_KEY) {
    console.log('⚠ No OPENROUTER_API_KEY found — running in mock mode')
  }
})

// Mock web design for local dev parity with prod
function generateMockWebDesign(prompt, designBrief) {
  const title = (prompt || 'Screen').slice(0, 48)
  return {
    title,
    html: `<main class="screen"><header class="topbar"><h1>${title}</h1></header><section class="content"><p>Mock web preview for local development.</p></section></main>`,
    css: `.screen{min-height:100%;background:#f2f6ff;color:#14171f;padding:20px 16px;font-family:system-ui,sans-serif}.topbar{height:56px;background:#fff;border-radius:16px;border:1px solid #d8dfef;padding:0 16px;display:flex;align-items:center;box-shadow:0 2px 8px rgba(0,0,0,.06)}.topbar h1{margin:0;font-size:20px;font-weight:700}.content{margin-top:16px;padding:16px;background:#fff;border-radius:16px;border:1px solid #d8dfef}`,
  }
}

// Mock generator for development without API key — uses Avontus Quantify patterns
function generateMockTree(prompt) {
  const lower = prompt.toLowerCase()

  if (lower.includes('login') || lower.includes('sign in')) {
    return {
      id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
        {
          id: 'login-content', type: 'StackPanel', properties: { HorizontalAlignment: 'Center', Padding: '32', Spacing: '24', VerticalAlignment: 'Center' }, children: [
            { id: 'login-logo', type: 'Image', properties: { Width: '200', Height: '80' } },
            { id: 'login-username', type: 'TextBox', properties: { Header: 'Username', PlaceholderText: 'Enter username' } },
            { id: 'login-password', type: 'PasswordBox', properties: { Header: 'Password', PlaceholderText: 'Enter password' } },
            {
              id: 'login-buttons', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '16', HorizontalAlignment: 'Center' }, children: [
                { id: 'login-connection-btn', type: 'Button', properties: { Content: 'Connection...', Style: 'Outlined' } },
                { id: 'login-signin-btn', type: 'Button', properties: { Content: 'Sign in', Style: 'Filled' } },
              ]
            },
            { id: 'login-version', type: 'TextBlock', properties: { Text: 'Quantify v3.2.1', Style: 'BodySmall', HorizontalAlignment: 'Center', Foreground: '#49454F' } },
            { id: 'login-copyright', type: 'TextBlock', properties: { Text: '\u00a9 Avontus 2008-2025. All rights reserved.', Style: 'BodySmall', HorizontalAlignment: 'Center', Foreground: '#49454F' } },
            { id: 'login-about-btn', type: 'Button', properties: { Content: 'About Quantify...', Style: 'Text', HorizontalAlignment: 'Center' } },
          ]
        }
      ]
    }
  }

  if (lower.includes('connection')) {
    return {
      id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
        {
          id: 'conn-toolbar', type: 'NavigationBar', properties: { Content: 'Connection settings', MainCommand: 'Close' }, children: [
            { id: 'conn-warning-icon', type: 'Icon', properties: { Glyph: 'AlertTriangle', Foreground: '#F9A825' } },
            { id: 'conn-save-icon', type: 'Icon', properties: { Glyph: 'Check' } },
          ]
        },
        {
          id: 'conn-content', type: 'StackPanel', properties: { Padding: '16', Spacing: '16' }, children: [
            { id: 'conn-server-url', type: 'TextBox', properties: { Header: 'Remote server', PlaceholderText: 'https://' } },
            { id: 'conn-ssl-toggle', type: 'ToggleSwitch', properties: { Header: 'Use SSL', IsOn: 'True' } },
            { id: 'conn-test-btn', type: 'Button', properties: { Content: 'Test connection', Style: 'Outlined', HorizontalAlignment: 'Right' } },
          ]
        }
      ]
    }
  }

  if (lower.includes('reservation') && lower.includes('list')) {
    return {
      id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
        { id: 'list-toolbar', type: 'NavigationBar', properties: { Content: 'RESERVATIONS', MainCommand: 'Back' }, children: [] },
        {
          id: 'list-scroll', type: 'ScrollViewer', properties: {}, children: [
            {
              id: 'list-content', type: 'StackPanel', properties: { Spacing: '8', Padding: '16,8' }, children: [
                { id: 'list-branch-label', type: 'TextBlock', properties: { Text: 'Branch office', Style: 'TitleSmall' } },
                { id: 'list-branch-dropdown', type: 'Button', properties: { Content: 'New York', Style: 'Outlined' } },
                {
                  id: 'list-items', type: 'ListView', properties: {}, children: [
                    {
                      id: 'res-card-1', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
                        { id: 'res-1-id', type: 'TextBlock', properties: { Text: 'DEL-00756', Style: 'TitleMedium' } },
                        { id: 'res-1-date', type: 'TextBlock', properties: { Text: 'March 15, 2025', Style: 'BodySmall', Foreground: '#49454F' } },
                        { id: 'res-1-company', type: 'TextBlock', properties: { Text: 'Johnson Construction', Style: 'BodyMedium' } },
                        { id: 'res-1-location', type: 'TextBlock', properties: { Text: 'Midtown Tower Site', Style: 'BodyMedium' } },
                        { id: 'res-1-address', type: 'TextBlock', properties: { Text: '350 5th Avenue, New York, NY', Style: 'BodySmall', Foreground: '#0A3EFF' } },
                        { id: 'res-1-summary', type: 'TextBlock', properties: { Text: '24 pieces \u00b7 1,240 kg', Style: 'BodySmall', Foreground: '#49454F' } },
                        {
                          id: 'res-1-actions', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8', HorizontalAlignment: 'Right' }, children: [
                            { id: 'res-1-view', type: 'Icon', properties: { Glyph: 'ChevronRight', FontSize: '20' } },
                            { id: 'res-1-ship', type: 'Icon', properties: { Glyph: 'ArrowUp', FontSize: '20' } },
                          ]
                        },
                      ]
                    },
                    {
                      id: 'res-card-2', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
                        { id: 'res-2-id', type: 'TextBlock', properties: { Text: 'DEL-00761', Style: 'TitleMedium' } },
                        { id: 'res-2-date', type: 'TextBlock', properties: { Text: 'March 18, 2025', Style: 'BodySmall', Foreground: '#49454F' } },
                        { id: 'res-2-company', type: 'TextBlock', properties: { Text: 'Apex Building Group', Style: 'BodyMedium' } },
                        { id: 'res-2-location', type: 'TextBlock', properties: { Text: 'Downtown Office Complex', Style: 'BodyMedium' } },
                        { id: 'res-2-address', type: 'TextBlock', properties: { Text: '88 Greenwich St, New York, NY', Style: 'BodySmall', Foreground: '#0A3EFF' } },
                        { id: 'res-2-summary', type: 'TextBlock', properties: { Text: '18 pieces \u00b7 890 kg', Style: 'BodySmall', Foreground: '#49454F' } },
                        {
                          id: 'res-2-actions', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8', HorizontalAlignment: 'Right' }, children: [
                            { id: 'res-2-view', type: 'Icon', properties: { Glyph: 'ChevronRight', FontSize: '20' } },
                            { id: 'res-2-ship', type: 'Icon', properties: { Glyph: 'ArrowUp', FontSize: '20' } },
                          ]
                        },
                      ]
                    },
                  ]
                },
              ]
            }
          ]
        }
      ]
    }
  }

  if (lower.includes('ship')) {
    return {
      id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
        {
          id: 'ship-toolbar', type: 'NavigationBar', properties: { Content: 'Ship reservation', MainCommand: 'Close' }, children: [
            { id: 'ship-error-icon', type: 'Icon', properties: { Glyph: 'XCircle', Foreground: '#D32F2F' } },
            { id: 'ship-save-icon', type: 'Icon', properties: { Glyph: 'Check' } },
          ]
        },
        {
          id: 'ship-scroll', type: 'ScrollViewer', properties: {}, children: [
            {
              id: 'ship-content', type: 'StackPanel', properties: { Padding: '16', Spacing: '16' }, children: [
                { id: 'ship-shortage-toggle', type: 'ToggleSwitch', properties: { Header: 'Create new reservation with shortages', IsOn: 'False' } },
                { id: 'ship-all-btn', type: 'Button', properties: { Content: 'Ship all', Style: 'Tonal' } },
                { id: 'ship-divider', type: 'Divider', properties: {} },
                { id: 'ship-products-title', type: 'TextBlock', properties: { Text: 'Products to ship', Style: 'TitleSmall' } },
                {
                  id: 'ship-products', type: 'ListView', properties: {}, children: [
                    {
                      id: 'ship-product-1', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
                        { id: 'sp-1-code', type: 'TextBlock', properties: { Text: 'SCF-4824', Style: 'LabelMedium', Foreground: '#49454F' } },
                        { id: 'sp-1-name', type: 'TextBlock', properties: { Text: 'Standard Frame 48x24', Style: 'BodyMedium' } },
                        {
                          id: 'sp-1-qty-row', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
                            { id: 'sp-1-ordered', type: 'TextBlock', properties: { Text: 'Ordered: 12', Style: 'BodySmall', Foreground: '#49454F' } },
                            { id: 'sp-1-minus', type: 'Button', properties: { Content: '-', Style: 'Outlined' } },
                            { id: 'sp-1-qty', type: 'TextBox', properties: { Text: '12', Width: '48' } },
                            { id: 'sp-1-plus', type: 'Button', properties: { Content: '+', Style: 'Outlined' } },
                          ]
                        },
                        { id: 'sp-1-weight', type: 'TextBlock', properties: { Text: 'Weight: 186 kg', Style: 'BodySmall', Foreground: '#49454F' } },
                      ]
                    },
                    {
                      id: 'ship-product-2', type: 'Card', properties: { Style: 'Outlined', Padding: '12' }, children: [
                        { id: 'sp-2-code', type: 'TextBlock', properties: { Text: 'BRC-3618', Style: 'LabelMedium', Foreground: '#49454F' } },
                        { id: 'sp-2-name', type: 'TextBlock', properties: { Text: 'Diagonal Brace 36x18', Style: 'BodyMedium' } },
                        {
                          id: 'sp-2-qty-row', type: 'StackPanel', properties: { Orientation: 'Horizontal', Spacing: '8' }, children: [
                            { id: 'sp-2-ordered', type: 'TextBlock', properties: { Text: 'Ordered: 8', Style: 'BodySmall', Foreground: '#49454F' } },
                            { id: 'sp-2-minus', type: 'Button', properties: { Content: '-', Style: 'Outlined' } },
                            { id: 'sp-2-qty', type: 'TextBox', properties: { Text: '8', Width: '48' } },
                            { id: 'sp-2-plus', type: 'Button', properties: { Content: '+', Style: 'Outlined' } },
                          ]
                        },
                        { id: 'sp-2-weight', type: 'TextBlock', properties: { Text: 'Weight: 96 kg', Style: 'BodySmall', Foreground: '#49454F' } },
                      ]
                    },
                  ]
                },
              ]
            }
          ]
        }
      ]
    }
  }

  // Default: Quantify-style home
  return {
    id: 'page-root', type: 'Page', properties: { Background: '#FFFFFF' }, children: [
      { id: 'home-toolbar', type: 'NavigationBar', properties: { Content: 'Quantify', MainCommand: 'Back' }, children: [] },
      {
        id: 'home-scroll', type: 'ScrollViewer', properties: {}, children: [
          {
            id: 'home-content', type: 'StackPanel', properties: { Padding: '16', Spacing: '16' }, children: [
              { id: 'home-welcome', type: 'TextBlock', properties: { Text: 'Welcome to Quantify', Style: 'HeadlineMedium' } },
              { id: 'home-subtitle', type: 'TextBlock', properties: { Text: 'Describe a Quantify screen to generate its layout.', Style: 'BodyLarge', Foreground: '#49454F' } },
              {
                id: 'home-card', type: 'Card', properties: { Style: 'Outlined', Padding: '16' }, children: [
                  {
                    id: 'home-card-content', type: 'StackPanel', properties: { Spacing: '12' }, children: [
                      { id: 'home-card-title', type: 'TextBlock', properties: { Text: 'Try these prompts', Style: 'TitleMedium' } },
                      { id: 'home-card-desc', type: 'TextBlock', properties: { Text: 'Sign in screen, Connection settings, List reservations, View reservation, Ship reservation', Style: 'BodyMedium', Foreground: '#49454F' } },
                    ]
                  }
                ]
              },
            ]
          }
        ]
      }
    ]
  }
}
