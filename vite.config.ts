import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
	vue(),
	svgLoader(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // Proxy /api ke backend Go supaya tidak kena masalah CORS saat dev.
    // Backend saat ini belum punya middleware CORS, jadi ini cara paling
    // aman untuk development tanpa perlu mengubah kode backend.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/storage': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
