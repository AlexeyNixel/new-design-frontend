<template>
  <NuxtLayout>
    <UApp :locale="ru">
      <NuxtPage />
    </UApp>
    <!-- Dev-панель только для авторизованных в админке. Lazy-компонент — отдельный чанк,
         обычные посетители его не загружают. Вне <UApp>, чтобы не влиять на гидрацию. -->
    <ClientOnly>
      <LazyDevPanel v-if="isAuthenticated" />
    </ClientOnly>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ru } from '@nuxt/ui/locale';

const { isAuthenticated } = useAuth();

useHead({
  titleTemplate: title =>
    title && title !== 'НОМБ' ? `${title} — НОМБ` : 'НОМБ',
});
// Значения по умолчанию — страницы переопределяют их через usePageSeo()
usePageSeo({
  title: 'НОМБ',
  description:
    'Новосибирская областная молодёжная библиотека (НОМБ): новости, книги, настольные игры, комиксы и мероприятия для молодёжи.',
});
useOrganizationSchema();
useSeoMeta({
  ogSiteName: 'НОМБ — Новосибирская областная молодёжная библиотека',
  ogLocale: 'ru_RU',
});

// canonical и og:url: адрес страницы без UTM-меток и фильтров.
// Сохраняем только номер страницы пагинации — каждая страница листинга самостоятельна.
const route = useRoute();
const toAbsolute = useAbsoluteUrl();

const canonicalUrl = computed(() => {
  const path = route.path.length > 1 ? route.path.replace(/\/+$/, '') : '/';
  const page = Number(route.query.page);
  const query = page > 1 ? `?page=${page}` : '';
  return toAbsolute(path + query);
});

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
});
useSeoMeta({
  ogUrl: canonicalUrl,
});
</script>
