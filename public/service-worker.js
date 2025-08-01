// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Reloj Checador',
        short_name: 'Reloj Checador',
        description: 'INAEBA',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'inaeba-logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'inaeba-logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
