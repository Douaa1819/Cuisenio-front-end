import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
  },
  server: {
    // Faster recovery after HMR / Windows file watchers
    watch: { usePolling: false },
  },
  preview: {
    // Ensure SPA deep links (/login, /register) resolve to index.html
    port: 4173,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'axios',
      'lucide-react',
    ],
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
  },
})
