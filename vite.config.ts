import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Service Worker gerado pelo Workbox:
// - precache do "app shell" (HTML/JS/CSS) -> abre sem rede;
// - Stale-While-Revalidate para a API de notícias e para as imagens:
//   responde na hora com o cache e atualiza em segundo plano.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Offline Manager - Leitor de Notícias',
        short_name: 'OfflineNews',
        theme_color: '#3880ff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
      workbox: {
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.hostname === 'api.spaceflightnewsapi.net',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'noticias-api',
              expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 3600 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'noticias-imagens',
              expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 3600 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
