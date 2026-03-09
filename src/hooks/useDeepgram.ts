import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseDeepgramOptions {
  apiKey: string
  onTranscript?: (text: string, isFinal: boolean) => void
  language?: string
  model?: string
}

export interface UseDeepgramReturn {
  isListening: boolean
  isConnecting: boolean
  transcript: string
  interimTranscript: string
  error: string | null
  startListening: () => Promise<void>
  stopListening: () => void
}

export function useDeepgram({
  apiKey,
  onTranscript,
  language = 'en',
  model = 'nova-3',
}: UseDeepgramOptions): UseDeepgramReturn {
  const [isListening, setIsListening] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const onTranscriptRef = useRef(onTranscript)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shouldReconnectRef = useRef(false)
  const reconnectAttemptsRef = useRef(0)

  useEffect(() => {
    onTranscriptRef.current = onTranscript
  }, [onTranscript])

  const stopListening = useCallback(() => {
    shouldReconnectRef.current = false
    reconnectAttemptsRef.current = 0
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop())
      mediaStreamRef.current = null
    }
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'CloseStream' }))
      }
      wsRef.current.close()
      wsRef.current = null
    }
    setIsListening(false)
    setIsConnecting(false)
    setInterimTranscript('')
  }, [])

  const connectWebSocket = useCallback((stream: MediaStream) => {
    setError(null)
    setIsConnecting(true)

    const params = new URLSearchParams({
      model,
      language,
      punctuate: 'true',
      interim_results: 'true',
      vad_events: 'true',
      smart_format: 'true',
      encoding: 'linear16',
      sample_rate: '16000',
      channels: '1',
    })

    const ws = new WebSocket(
      `wss://api.deepgram.com/v1/listen?${params.toString()}`,
      ['token', apiKey],
    )
    wsRef.current = ws

    ws.onopen = () => {
      setIsConnecting(false)
      setIsListening(true)
      setError(null)
      reconnectAttemptsRef.current = 0

      // Clean up previous audio processing
      if (processorRef.current) processorRef.current.disconnect()
      if (audioContextRef.current) audioContextRef.current.close()

      const audioContext = new AudioContext({ sampleRate: 16000 })
      audioContextRef.current = audioContext
      const source = audioContext.createMediaStreamSource(stream)
      const processor = audioContext.createScriptProcessor(4096, 1, 1)
      processorRef.current = processor

      processor.onaudioprocess = (e) => {
        if (ws.readyState !== WebSocket.OPEN) return
        const float32 = e.inputBuffer.getChannelData(0)
        const int16 = new Int16Array(float32.length)
        for (let i = 0; i < float32.length; i++) {
          const s = Math.max(-1, Math.min(1, float32[i]))
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
        }
        ws.send(int16.buffer)
      }

      source.connect(processor)
      processor.connect(audioContext.destination)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'Results') {
          const alt = data.channel?.alternatives?.[0]
          if (!alt) return
          const text = alt.transcript || ''
          if (!text) return

          if (data.is_final) {
            setTranscript(prev => prev ? `${prev} ${text}` : text)
            setInterimTranscript('')
            onTranscriptRef.current?.(text, true)
          } else {
            setInterimTranscript(text)
            onTranscriptRef.current?.(text, false)
          }
        }
      } catch {
        // ignore parse errors
      }
    }

    ws.onerror = () => {
      // Don't stop — let onclose handle reconnect
    }

    ws.onclose = (event) => {
      setIsListening(false)
      setIsConnecting(false)

      // Auto-reconnect if we should still be listening
      if (shouldReconnectRef.current && mediaStreamRef.current && reconnectAttemptsRef.current < 5) {
        reconnectAttemptsRef.current++
        const delay = Math.min(1000 * reconnectAttemptsRef.current, 4000)
        setError(`Reconnecting... (${reconnectAttemptsRef.current}/5)`)
        reconnectTimerRef.current = setTimeout(() => {
          if (shouldReconnectRef.current && mediaStreamRef.current) {
            connectWebSocket(mediaStreamRef.current)
          }
        }, delay)
      } else if (event.code !== 1000 && shouldReconnectRef.current) {
        setError('Connection lost — tap mic to restart')
        shouldReconnectRef.current = false
      }
    }
  }, [apiKey, language, model])

  const startListening = useCallback(async () => {
    setError(null)
    shouldReconnectRef.current = true
    reconnectAttemptsRef.current = 0

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      })
      mediaStreamRef.current = stream
      connectWebSocket(stream)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to access microphone')
      setIsConnecting(false)
      shouldReconnectRef.current = false
    }
  }, [connectWebSocket])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [stopListening])

  return {
    isListening,
    isConnecting,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
  }
}
