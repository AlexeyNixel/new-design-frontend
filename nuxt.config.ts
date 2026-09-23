import tailwindcss from '@tailwindcss/vite';

// Публичный адрес сайта — для sitemap, robots.txt и canonical
const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'https://alt.infomania.ru';

export default defineNuxtConfig({
  modules: ['@nuxt/ui', 'nuxt-swiper', 'dayjs-nuxt', '@nuxtjs/sitemap'],
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      meta: [{ name: 'theme-color', content: '#157486' }],
      link: [
        // Иконки: .ico — для старых браузеров и ботов, SVG — для современных вкладок
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        {
          rel: 'preload',
          as: 'font',
          href: '/fonts/Montserrat-Regular.woff2',
          crossorigin: 'anonymous',
          type: 'font/woff2',
        },
        {
          rel: 'preconnect',
          href: 'http://static.infomania.ru',
        },
      ],
    },
  },
  css: [
    '~/assets/css/main.css',
    '~/assets/css/fonts.css',
    '~/assets/css/editor.css',
    '~/assets/css/theme.css',
    '~/assets/css/feedback-gos.css',
  ],
  site: {
    url: SITE_URL,
    name: 'НОМБ — Новосибирская областная молодёжная библиотека',
  },
  ui: {
    colorMode: false,
    fonts: false,
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE,
      siteUrl: SITE_URL,
    },
  },
  compatibilityDate: '2025-07-15',
  nitro: {
    // Проксирование медиа работает и в dev, и в production.
    // devProxy с ключом '/site' не используем: он матчит по префиксу и перехватывает /sitemap.xml
    routeRules: {
      '/site/**': {
        proxy: 'http://static.infomania.ru/site/**',
      },
      // Картинки игр и комиксов (`/dev/images/...`) — в production vite.server.proxy не работает
      '/dev/**': {
        proxy: 'http://static.infomania.ru/dev/**',
      },
      '/media/**': {
        proxy: 'http://static.infomania.ru/site/**',
      },
      // Старый раздел /entry переименован в /post — постоянный редирект (передаёт вес ссылок)
      '/entry': { redirect: { to: '/post', statusCode: 301 } },
      '/entry/**': { redirect: { to: '/post/**', statusCode: 301 } },
    },
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/site/': {
          target: 'http://static.infomania.ru',
          changeOrigin: true,
        },
        '/dev': {
          target: 'http://static.infomania.ru/',
          changeOrigin: true,
        },
        '/media': {
          target: 'http://static.infomania.ru/site',
          changeOrigin: true,
        },
      },
    },
  },

  dayjs: {
    locales: ['ru'],
    defaultLocale: 'ru',
  },
  sitemap: {
    // Динамические URL (посты, книги, игры, комиксы, страницы) — server/api/__sitemap__/urls.ts
    sources: ['/api/__sitemap__/urls'],
    // /document — пустая заглушка без контента
    exclude: ['/test', '/debug-cors', '/games/test', '/document'],
  },
});
