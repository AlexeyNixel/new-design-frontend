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
        {{ LIBRARY_INFO.address.addressLocality }}, угол Октябрьской улицы
      </p>
    </div>

    <div class="p-3">
      <!-- Карта OpenStreetMap: без рекламы и API-ключей (виджет Яндекса показывал рекламный блок).
           Leaflet грузится только при открытии панели — панель монтируется по клику. -->
      <div
        ref="mapEl"
        class="library-map aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100"
        role="region"
        aria-label="Карта: библиотека на Красном проспекте, 26"
      />

      <a
        :href="ROUTE_URL"
        target="_blank"
        rel="noopener"
        class="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-primary-700 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
      >
        <UIcon
          name="i-heroicons-map-pin"
          class="size-4"
        />
        Построить маршрут
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Map as LeafletMap } from 'leaflet';

/** Здание библиотеки (точка из OpenStreetMap) */
const LIBRARY_COORDS: [number, number] = [55.024618, 82.922475];
const ZOOM = 17;

// Маршрут «от меня до библиотеки» строим в Яндекс Картах — способ передвижения посетитель выберет там
const ROUTE_URL = `https://yandex.ru/maps/?rtext=~${LIBRARY_COORDS.join(',')}`;

const mapEl = ref<HTMLElement | null>(null);
let map: LeafletMap | null = null;

onMounted(async () => {
  // Стили и сама библиотека — отдельным чанком, только когда открыли карту:
  // шапка есть на каждой странице, и общий CSS не должен расти из-за неё
  const [L] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
  if (!mapEl.value) return;

  map = L.map(mapEl.value, {
    center: LIBRARY_COORDS,
    zoom: ZOOM,
    scrollWheelZoom: false,
  });
  // Префикс Leaflet по умолчанию не нужен — оставляем только обязательную подпись OSM
  map.attributionControl.setPrefix(false);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
  }).addTo(map);

  // Свой маркер (divIcon): стандартные картинки Leaflet теряются при сборке Vite
  const icon = L.divIcon({
    className: 'library-map__pin',
    html: '<span></span>',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    tooltipAnchor: [0, -38],
  });
  L.marker(LIBRARY_COORDS, { icon, keyboard: false })
    .addTo(map)
    .bindTooltip('НОМБ', { permanent: true, direction: 'top', className: 'library-map__label' });

  // Панель появляется с анимацией — пересчитываем размер, когда она встала на место
  setTimeout(() => map?.invalidateSize(), 200);
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
});
</script>

<style scoped>
/* Маркер — капля бирюзового цвета сайта с белой точкой */
.library-map :deep(.library-map__pin span) {
  position: absolute;
  inset: 0 4px 8px;
  border-radius: 50% 50% 50% 0;
  background: var(--color-primary-700);
  box-shadow: 0 4px 10px rgb(13 73 84 / 0.4);
  transform: rotate(-45deg);
}

.library-map :deep(.library-map__pin span::after) {
  content: '';
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: #fff;
}

.library-map :deep(.library-map__label) {
  padding: 2px 8px;
  border: 0;
  border-radius: 6px;
  background: var(--color-primary-800);
  color: #fff;
  font-weight: 700;
  box-shadow: none;
}

.library-map :deep(.library-map__label::before) {
  display: none;
}

.library-map :deep(.leaflet-control-attribution) {
  font-size: 10px;
}
</style>
