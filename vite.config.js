import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Reloj Checador',
        short_name: 'Reloj Checador',
        description: 'Reloj Checador',
        theme_color: '#381313ff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'icons/inaeba-logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/inaeba-logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/inaeba-logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
