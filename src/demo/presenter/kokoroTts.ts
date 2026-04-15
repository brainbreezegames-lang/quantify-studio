// Lazy wrapper around kokoro-js: dynamic import + WebGPU/WASM fallback.
// All types are loose intentionally so this module doesn't force kokoro-js
// into the main bundle.

type KokoroInstance = any
type RawAudio = any

let modelPromise: Promise<KokoroInstance> | null = null
let currentBackend: 'webgpu' | 'wasm' | null = null

export interface LoadProgress {
  stage: 'importing' | 'downloading' | 'initializing' | 'ready' | 'error'
  detail?: string
  percent?: number
}

export async function loadKokoro(
  onProgress?: (p: LoadProgress) => void,
  preferred: 'webgpu' | 'wasm' = 'webgpu',
): Promise<KokoroInstance> {
  if (modelPromise) return modelPromise

  modelPromise = (async () => {
    onProgress?.({ stage: 'importing' })
    const { KokoroTTS } = await import('kokoro-js')

    const tryDevice = async (device: 'webgpu' | 'wasm') => {
      onProgress?.({ stage: 'downloading', detail: `Loading voice model (${device.toUpperCase()})…` })
      const model = await KokoroTTS.from_pretrained(
        'onnx-community/Kokoro-82M-v1.0-ONNX',
        {
          dtype: device === 'webgpu' ? 'fp32' : 'q8',
          device,
          progress_callback: (progress: any) => {
            if (progress?.status === 'progress' && typeof progress.progress === 'number') {
              onProgress?.({
                stage: 'downloading',
                percent: progress.progress,
                detail: progress.file,
              })
            }
          },
        },
      )
      currentBackend = device
      return model
    }

    try {
      const m = await tryDevice(preferred)
      onProgress?.({ stage: 'ready' })
      return m
    } catch (e1) {
      if (preferred === 'webgpu') {
        try {
          const m = await tryDevice('wasm')
          onProgress?.({ stage: 'ready' })
          return m
        } catch (e2) {
          onProgress?.({ stage: 'error', detail: String(e2) })
          throw e2
        }
      }
      onProgress?.({ stage: 'error', detail: String(e1) })
      throw e1
    }
  })()

  return modelPromise
}

export function getBackend(): 'webgpu' | 'wasm' | null {
  return currentBackend
}

export async function synthesize(
  model: KokoroInstance,
  text: string,
  voice: string,
): Promise<{ blob: Blob; url: string }> {
  const audio: RawAudio = await model.generate(text, { voice })
  const blob: Blob = audio.toBlob()
  const url = URL.createObjectURL(blob)
  return { blob, url }
}

// Voice catalog — curated, most natural voices first.
export const KOKORO_VOICES: { id: string; label: string; lang: string; gender: 'f' | 'm' }[] = [
  { id: 'af_heart', label: 'Heart (American F)', lang: 'en-US', gender: 'f' },
  { id: 'af_bella', label: 'Bella (American F)', lang: 'en-US', gender: 'f' },
  { id: 'af_nicole', label: 'Nicole (American F)', lang: 'en-US', gender: 'f' },
  { id: 'af_sarah', label: 'Sarah (American F)', lang: 'en-US', gender: 'f' },
  { id: 'af_sky', label: 'Sky (American F)', lang: 'en-US', gender: 'f' },
  { id: 'am_michael', label: 'Michael (American M)', lang: 'en-US', gender: 'm' },
  { id: 'am_adam', label: 'Adam (American M)', lang: 'en-US', gender: 'm' },
  { id: 'bf_emma', label: 'Emma (British F)', lang: 'en-GB', gender: 'f' },
  { id: 'bf_isabella', label: 'Isabella (British F)', lang: 'en-GB', gender: 'f' },
  { id: 'bm_george', label: 'George (British M)', lang: 'en-GB', gender: 'm' },
  { id: 'bm_lewis', label: 'Lewis (British M)', lang: 'en-GB', gender: 'm' },
]
