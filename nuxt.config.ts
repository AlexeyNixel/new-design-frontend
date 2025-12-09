import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  modules: ['@nuxt/ui', 'nuxt-swiper', 'dayjs-nuxt', '@nuxtjs/google-fonts'],
  css: [
    '~/assets/css/main.css',
    '~/assets/css/fonts.css',
    '~/assets/css/ck-content.css',
    '~/assets/css/theme.css',
    '~/assets/css/feedback-gos.css',
  ],

  ui: {
    colorMode: false,
  },

  dayjs: {
    locales: ['ru'],
    defaultLocale: 'ru',
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/site': {
          target: 'http://192.168.0.41:10001/',
          changeOrigin: true,
        },
        '/dev': {
          target: 'http://192.168.0.41:10001/',
          changeOrigin: true,
        },
        '/media': {
          target: 'http://192.168.0.41:10001/site',
          changeOrigin: true,
        },
        '/news': {
          target: 'http://dev.infomania.ru/',
          changeOrigin: true,
          //@ts-ignore
          rewrite: (path) => path.replace(/^\/entry/, ''),
        },
      },
    },
  },
});
