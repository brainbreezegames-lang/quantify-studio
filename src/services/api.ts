import type { ComponentNode, Decision, DesignBrief, DesignTokens, DesignVariant, QualityToggles, WebDesign } from '../types'

export function getOpenRouterKey(): string {
  return localStorage.getItem('openrouter_api_key') || ''
}

export function setOpenRouterKey(key: string): void {
  localStorage.setItem('openrouter_api_key', key)
}

interface GenerateRequest {
  prompt: string
  designTokens: DesignTokens
  designBrief: DesignBrief
  currentTree?: ComponentNode | null
  imageUrl?: string
  qualityToggles?: QualityToggles
  model?: string
}

interface GenerateResponse {
  tree: ComponentNode
  webDesign?: WebDesign | null
}

export async function generateScreen(req: GenerateRequest): Promise<GenerateResponse> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 290_000)

  let response: Response
  try {
    response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...req, openRouterApiKey: getOpenRouterKey() }),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Generation timed out — please try again.')
    }
    throw new Error('Network error — check your connection and try again.')
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    if (response.status === 504) {
      throw new Error('Generation timed out — please try again.')
    }
    const err = await response.json().catch(() => ({ error: 'Generation failed' }))
    throw new Error(err.error || 'Generation failed')
  }

  return response.json()
}

export interface ImproveResponse {
  webDesign: WebDesign
  decisions: Decision[]
}

export async function improveDesign(req: {
  currentWebDesign: WebDesign
  qualityToggles: QualityToggles
  designTokens: DesignTokens
  designBrief: DesignBrief
  model?: string
}): Promise<ImproveResponse> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 290_000)
  let response: Response
  try {
    response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'improve', ...req, openRouterApiKey: getOpenRouterKey() }),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Improvement timed out — please try again.')
    }
    throw new Error('Network error — check your connection and try again.')
  } finally {
    clearTimeout(timeout)
  }
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Improvement failed' }))
    throw new Error(err.error || 'Improvement failed')
  }
  return response.json()
}

export interface GenerateImageResponse {
  images: { dataUri: string; mimeType: string }[]
  text: string | null
}

export async function generateImage(prompt: string, options?: { aspectRatio?: string; size?: string }): Promise<GenerateImageResponse> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60_000)
  try {
    const response = await fetch('/api/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, ...options }),
      signal: controller.signal,
    })
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Image generation failed' }))
      throw new Error(err.error || 'Image generation failed')
    }
    return response.json()
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Image generation timed out')
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

export interface ImageScreenResponse {
  webDesign: WebDesign
  imageDataUri: string
}

export async function generateImageScreen(req: {
  prompt: string
  designTokens: DesignTokens
  designBrief: DesignBrief
  qualityToggles?: QualityToggles
}): Promise<ImageScreenResponse> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 120_000)
  try {
    const response = await fetch('/api/generate-image-screen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      signal: controller.signal,
    })
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Image generation failed' }))
      throw new Error(err.error || 'Image generation failed')
    }
    return response.json()
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Image generation timed out — please try again.')
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

export interface GenerateVariantsResponse {
  variants: Omit<DesignVariant, 'id'>[]
}

export async function generateVariants(req: GenerateRequest): Promise<GenerateVariantsResponse> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 290_000)

  let response: Response
  try {
    response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...req, action: 'variants', openRouterApiKey: getOpenRouterKey() }),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Generation timed out — please try again.')
    }
    throw new Error('Network error — check your connection and try again.')
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    if (response.status === 504) throw new Error('Generation timed out — please try again.')
    const err = await response.json().catch(() => ({ error: 'Variants generation failed' }))
    throw new Error(err.error || 'Variants generation failed')
  }

  return response.json()
}

export async function enhancePrompt(
  prompt: string,
  designBrief: DesignBrief,
  context?: { designTokens?: DesignTokens; qualityToggles?: QualityToggles; currentTree?: ComponentNode | null }
): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20_000)
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'enhance',
        prompt,
        designBrief,
        designTokens: context?.designTokens,
        qualityToggles: context?.qualityToggles,
        currentTree: context?.currentTree ? {} : undefined,
        openRouterApiKey: getOpenRouterKey(),
      }),
      signal: controller.signal,
    })
    if (!response.ok) return prompt
    const data = await response.json()
    return data.enhancedPrompt || prompt
  } catch {
    return prompt
  } finally {
    clearTimeout(timeout)
  }
}
