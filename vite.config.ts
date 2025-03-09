import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/rd-api': {
        target: 'https://api.rd.services',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rd-api/, '')
      }
    }
  }
})