export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt-swiper', 'dayjs-nuxt'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  ui: {
    colorMode: false,
  },
  dayjs: {
    locales: ['ru'],
    defaultLocale: 'ru',
  },
  vite: {
    server: {
      proxy: {
        '/site': {
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
