import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // Keep Kokoro / Transformers / ONNX in their own chunk so /demo doesn't pay for it.
          if (
            id.includes('/kokoro-js/') ||
            id.includes('/@huggingface/transformers/') ||
            id.includes('/onnxruntime-web/') ||
            id.includes('/onnxruntime-common/')
          ) return 'tts-vendor'
          if (id.includes('/@mui/') || id.includes('/@emotion/')) return 'mui-vendor'
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('scheduler')) return 'react-vendor'
          return 'vendor'
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  appType: 'spa',
})
