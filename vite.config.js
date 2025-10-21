// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // sw сам подтянет обновления
      includeAssets: [
        'favicon.ico',
        'icon.png',
        'icon.png',
        'icon.png',
        'icon.png'
      ],
      manifest: {
        name: 'FitLog — тренировки и прогресс',
        short_name: 'FitLog',
        description: 'Учёт тренировок офлайн: подходы, веса, шаблоны.',
        theme_color: '#0b1020',
        background_color: '#0b1020',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icon.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icon.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Кэшируем статику по умолчанию, плюс:
        runtimeCaching: [
          {
            urlPattern: ({request}) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: { cacheName: 'pages' }
          },
          {
            urlPattern: ({request}) => ['style','script','worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'assets' }
          },
          {
            urlPattern: ({request}) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ],
        navigateFallback: '/index.html'
      }
    })
  ]
})
