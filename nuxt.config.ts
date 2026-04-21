import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  modules: ['@nuxt/ui', 'nuxt-swiper', 'dayjs-nuxt'],
  css: [
    '~/assets/css/main.css',
    '~/assets/css/fonts.css',
    '~/assets/css/editor.css',
    '~/assets/css/theme.css',
    '~/assets/css/feedback-gos.css',
  ],
  app: {
    head: {
      link: [
        {
          rel: 'preload',
          as: 'font',
          href: '/fonts/Montserrat-Regular.woff2',
          crossorigin: 'anonymous',
          type: 'font/woff2',
        },
      ],
    },
  },
  ui: {
    colorMode: false,
    fonts: false,
  },

  dayjs: {
    locales: ['ru'],
    defaultLocale: 'ru',
  },
  nitro: {
    devProxy: {
      '/site': {
        target: 'http://static.infomania.ru',
        changeOrigin: true,
      },
    },

    // Для production тоже нужно настроить routeRules
    routeRules: {
      '/site/**': {
        proxy: 'http://static.infomania.ru/site/**',
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/site': {
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
});
