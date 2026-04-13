import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1400,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules\/(react|react-dom|react-router-dom)/
            },
            {
              name: 'dashboard-crop-vendor',
              test: /node_modules\/react-image-crop/
            },
            {
              name: 'heic-vendor',
              test: /node_modules\/heic2any/
            }
          ]
        }
      }
    }
  }
})
