import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
    //   manifest: {
    //     "name": "IQ-Pilot",
    //     "short_name": "IQ-Pilot",
    //     "description": "Your app description",
    //     "start_url": "/",
    //     "display": "standalone",
    //     "background_color": "#ffffff",
    //     "theme_color": "#007bff",
    //     "icons": [
    //       {
    //         "src": "/images/icon-192x192.png",
    //         "sizes": "192x192",
    //         "type": "image/png"
    //       },
    //       {
    //         "src": "/images/icon-512x512.png",
    //         "sizes": "512x512",
    //         "type": "image/png"
    //       }
    //     ],
    //   }
    // })
  ],
})
