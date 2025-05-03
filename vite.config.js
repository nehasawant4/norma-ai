import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Local dev proxy to Flask backend
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: '../dist', // optional: for separating build output
  }
})
