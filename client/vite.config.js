import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Cualquier petición que empiece con /media se redirigirá a Django
      '/media': {
        target: 'http://localhost:8000', // Tu VITE_API_URL
        changeOrigin: true,
      },
      // También es una buena práctica redirigir tu API
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})