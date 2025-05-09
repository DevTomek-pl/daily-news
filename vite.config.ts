import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/xda-developers': {
        target: 'https://www.xda-developers.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/xda-developers/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      },
      '/api/laskonline': {
        target: 'https://www.laskonline.pl',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/laskonline/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    }
  }
})
