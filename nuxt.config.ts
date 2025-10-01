export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: ['@nuxt/ui', 'nuxt-swiper'],
    css: ['~/assets/css/main.css'],
    ui: {
        colorMode: false
    }
})