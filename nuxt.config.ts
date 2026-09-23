import { readdirSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';

// Публичный адрес сайта — для sitemap, robots.txt и canonical
// Кеш для медиа из CMS (30 дней) и для файлов public/ без хеша в имени (7 дней)
const MEDIA_CACHE = 'public, max-age=2592000';
const STATIC_CACHE = 'public, max-age=604800, stale-while-revalidate=86400';

// Правила кеша для файлов в корне public/ (картинки, иконки, манифест).
// Маски вида '/*.png' роутер Nitro не поддерживает — перечисляем файлы явно.
const publicFileCacheRules = Object.fromEntries(
  readdirSync('public', { withFileTypes: true })
    .filter(entry => entry.isFile() && !entry.name.endsWith('.txt'))
    .map(entry => [
      `/${entry.name}`,
      { headers: { 'cache-control': STATIC_CACHE } },
    ]),
);

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
  // Остальные CSS подключаются внутри main.css (см. комментарий там)
  css: ['~/assets/css/main.css'],
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
    // Заранее сжатые .gz/.br-версии статики (_nuxt, public) — Nitro отдаёт их по Accept-Encoding
    compressPublicAssets: { gzip: true, brotli: true },

    // Проксирование медиа работает и в dev, и в production.
    // devProxy с ключом '/site' не используем: он матчит по префиксу и перехватывает /sitemap.xml
    routeRules: {
      // Медиа из CMS: имена файлов уникальны (uuid/timestamp), содержимое не меняется —
      // хранилище не отдаёт Cache-Control, поэтому выставляем сами
      '/site/**': {
        proxy: 'http://static.infomania.ru/site/**',
        headers: { 'cache-control': MEDIA_CACHE },
      },
      // Картинки игр и комиксов (`/dev/images/...`) — в production vite.server.proxy не работает
      '/dev/**': {
        proxy: 'http://static.infomania.ru/dev/**',
        headers: { 'cache-control': MEDIA_CACHE },
      },
      '/media/**': {
        proxy: 'http://static.infomania.ru/site/**',
        headers: { 'cache-control': MEDIA_CACHE },
      },
      // Файлы из public/ без хеша в имени — кешируем, но не навсегда
      '/fonts/**': { headers: { 'cache-control': STATIC_CACHE } },
      ...publicFileCacheRules,
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
