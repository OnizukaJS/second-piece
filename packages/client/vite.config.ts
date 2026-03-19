import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  envDir: '../..',
  resolve: {
    alias: {
      '@shared': new URL('../shared/src', import.meta.url).pathname,
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
})
