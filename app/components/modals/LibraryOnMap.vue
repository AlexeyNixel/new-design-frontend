<template>
  <div class="w-[min(92vw,440px)]">
    <div class="rounded-t-2xl bg-gradient-to-br from-primary-700 to-primary-800 px-5 pt-5 pb-4 text-white">
      <p class="text-xs font-semibold uppercase tracking-wider text-white/60">
        Как нас найти
      </p>
      <p class="mt-1.5 text-lg font-bold leading-snug">
        {{ LIBRARY_INFO.address.streetAddress }}
      </p>
      <p class="text-sm text-white/70">
        {{ LIBRARY_INFO.address.addressLocality }}
      </p>
    </div>

    <div class="p-3">
      <!-- Карта грузится только при открытии панели (панель монтируется по клику) -->
      <div class="aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
        <iframe
          :src="MAP_EMBED_URL"
          title="Библиотека на Яндекс Картах"
          loading="lazy"
          class="size-full border-0"
        />
      </div>

      <div class="mt-3 grid grid-cols-2 gap-2">
        <a
          :href="ROUTE_URL"
          target="_blank"
          rel="noopener"
          class="flex items-center justify-center gap-1.5 rounded-xl bg-primary-700 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
        >
          <UIcon
            name="i-heroicons-map-pin"
            class="size-4"
          />
          Построить маршрут
        </a>
        <NuxtLink
          to="/page/kontaktnaya-informaciya"
          class="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-100 px-3 py-2.5 text-sm font-semibold text-primary-800 transition-colors hover:bg-[#e2eef0]"
          @click="emit('navigate')"
        >
          Все контакты
        </NuxtLink>
      </div>

      <ul class="mt-3 grid gap-1 border-t border-gray-100 pt-3 text-sm">
        <li>
          <a
            :href="`tel:${PHONE_HREF}`"
            class="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-gray-800 transition-colors hover:bg-[#eef5f6] hover:text-primary-800"
          >
            <UIcon
              name="i-heroicons-phone"
              class="size-4 text-primary-700"
            />
            {{ LIBRARY_INFO.telephone }}
          </a>
        </li>
        <li>
          <a
            :href="`mailto:${LIBRARY_INFO.email}`"
            class="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-gray-800 transition-colors hover:bg-[#eef5f6] hover:text-primary-800"
          >
            <UIcon
              name="i-heroicons-envelope"
              class="size-4 text-primary-700"
            />
            {{ LIBRARY_INFO.email }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ navigate: [] }>();

const MAP_EMBED_URL
  = 'https://yandex.ru/map-widget/v1/?um=constructor%3A952a94a4b33a6930b5ce54184df44d9a8f630cc4697ed47374222011683b6ded&source=constructor';
const ROUTE_URL = `https://yandex.ru/maps/?text=${encodeURIComponent(
  `${LIBRARY_INFO.address.addressLocality}, ${LIBRARY_INFO.address.streetAddress}`,
)}`;
const PHONE_HREF = LIBRARY_INFO.telephone.replace(/[^\d+]/g, '');
</script>
