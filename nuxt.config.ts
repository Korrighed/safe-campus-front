import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-31',

  modules: ['@nuxt/eslint'],

  devtools: { enabled: true },

  devServer: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 3000,
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        // Favicon : tete de ninja du menu (public/assets/logoNinjaHead.png).
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/icon-512.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cabin:wght@400;600;700&display=swap' },
      ],
    },
  },

  runtimeConfig: {
    // Serveur uniquement (SSR) : hostname Docker interne, injecte par
    // docker-compose.yml du back. Jamais expose au client.
    apiBaseInternal: process.env.NUXT_API_BASE_INTERNAL ?? process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:8000',
    public: {
      // Navigateur : doit etre joignable depuis l'hote, jamais un hostname
      // Docker interne (le reseau bridge n'existe pas hors des conteneurs).
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:8000',
    },
  },

  // En-tetes de securite (S-05). geolocation=(self) : ContactMap.vue localise l'utilisateur.
  // CSP limitee aux directives sans effet sur le rendu (payload SSR inline, tuiles Leaflet).
  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Frame-Options': 'DENY',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
        'Content-Security-Policy': "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
        'Strict-Transport-Security': 'max-age=31536000',
      },
    },
  },

  vite: {
    plugins: [svgLoader()],
    // Leaflet n'est tire que par la page contact (import dynamique). Le pre-bundler
    // au demarrage evite que Vite le decouvre et re-optimise ses deps pendant une
    // requete SSR (course qui renvoyait un 500 sur F5 de /contact/...).
    optimizeDeps: {
      include: ['leaflet'],
    },
    server: {
      ws: {
        port: Number(process.env.PORT) || 3000,
      },
    },
  },
})
