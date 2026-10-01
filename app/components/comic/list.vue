<template>
  <div class="relative w-full">
    <swiper-container
      ref="swiperElRef"
      class="block w-full py-4"
      init="false"
    >
      <swiper-slide
        v-for="comic in comics"
        :key="comic.id"
        class="h-auto"
      >
        <!-- Отступ вокруг карточки — иначе тень/сдвиг при ховере обрезает overflow:hidden внутри swiper -->
        <div class="h-full py-3">
          <ComicCard :comic="comic" />
        </div>
      </swiper-slide>
    </swiper-container>

    <!-- Стрелки -->
    <button
      type="button"
      aria-label="Предыдущие комиксы"
      class="absolute z-10 top-1/2 -translate-y-1/2 left-2 sm:left-4 md:left-[60px] flex items-center justify-center w-9 h-9 rounded bg-primary text-white hover:bg-primary/60 hover:cursor-pointer transition-colors"
      @click="goPrev"
    >
      <Icon
        name="i-heroicons-chevron-left-20-solid"
        class="w-5 h-5"
      />
    </button>
    <button
      type="button"
      aria-label="Следующие комиксы"
      class="absolute z-10 top-1/2 -translate-y-1/2 right-2 sm:right-4 md:right-[60px] flex items-center justify-center w-9 h-9 rounded bg-primary text-white hover:bg-primary/60 hover:cursor-pointer transition-colors"
      @click="goNext"
    >
      <Icon
        name="i-heroicons-chevron-right-20-solid"
        class="w-5 h-5"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { API_ENDPOINTS } from '~~/services/api/endpoints';
import type {
  Comic,
  ComicQueryParams,
  ComicSeries,
} from '~~/services/types/comic.type';

// Нативный веб-компонент из nuxt-swiper (swiper/element), см. app/components/MainCarousel.vue.
// breakpoints — объект, а не примитив: при SSR Vue не может отрендерить его атрибутом,
// а при гидратации не переустанавливает такие пропсы на кастомном элементе, поэтому
// задаём их вручную через свойства после монтирования (init="false" — чтобы swiper
// не успел инициализироваться раньше с дефолтными параметрами).
type SwiperContainerEl = HTMLElement & {
  swiper?: SwiperInstance;
  initialize?: () => void;
  breakpoints?: Record<number, { slidesPerView: number; spaceBetween?: number }>;
  loop?: boolean;
};
interface SwiperInstance {
  slidePrev: () => void;
  slideNext: () => void;
}

const breakpoints = {
  0: { slidesPerView: 2, spaceBetween: 12 },
  640: { slidesPerView: 3, spaceBetween: 16 },
  768: { slidesPerView: 4, spaceBetween: 16 },
  1280: { slidesPerView: 5, spaceBetween: 16 },
  1536: { slidesPerView: 7, spaceBetween: 16 },
};

// ——— Подборка для главной: случайные комиксы с чередованием серий ———
// Каждой серии достаётся случайная «страница» из PER_SERIES комиксов, затем серии
// раскладываются по кругу (A, B, C, …, A, B, …) — соседние карточки из разных серий,
// а при каждом открытии вкладки набор новый.
const PER_SERIES = 2;
const TOTAL = 12;

interface ComicListResponse {
  data?: Comic[];
  meta?: { total?: number };
}

const config = useRuntimeConfig();

const fetchComics = (params: ComicQueryParams) =>
  $fetch<ComicListResponse>(config.public.apiBaseUrl + API_ENDPOINTS.comic, {
    params,
  });

function shuffle<T>(list: T[]): T[] {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

/** Случайные PER_SERIES комиксов серии: первая страница даёт total, затем — случайная страница */
const randomFromSeries = async (seriesId: string): Promise<Comic[]> => {
  const first = await fetchComics({ seriesId, limit: PER_SERIES });
  const pages = Math.ceil((first.meta?.total ?? 0) / PER_SERIES);
  if (pages <= 1) return first.data ?? [];

  const page = 1 + Math.floor(Math.random() * pages);
  if (page === 1) return first.data ?? [];
  return (await fetchComics({ seriesId, limit: PER_SERIES, page })).data ?? [];
};

const interleave = (groups: Comic[][]): Comic[] => {
  const result: Comic[] = [];
  const queues = groups.map(group => shuffle(group));
  while (result.length < TOTAL && queues.some(queue => queue.length)) {
    for (const queue of queues) {
      const comic = queue.shift();
      if (comic) result.push(comic);
      if (result.length === TOTAL) break;
    }
  }
  return result;
};

const { data: comics } = await useAsyncData('home-comics-mix', async () => {
  try {
    const seriesRes = await $fetch<ComicSeries[] | { data: ComicSeries[] }>(
      config.public.apiBaseUrl + API_ENDPOINTS.comicSeries,
    );
    const series = Array.isArray(seriesRes) ? seriesRes : (seriesRes?.data ?? []);
    if (!series.length) throw new Error('no series');

    const groups = await Promise.all(
      shuffle(series).map(item => randomFromSeries(item.id).catch(() => [])),
    );
    const mixed = interleave(groups.filter(group => group.length));
    if (mixed.length) return mixed;
    throw new Error('empty');
  }
  catch {
    // Запасной вариант — последние добавленные, как было раньше
    return (await fetchComics({ limit: 9 }).catch(() => null))?.data ?? [];
  }
});

const swiperElRef = ref<SwiperContainerEl | null>(null);

onMounted(async () => {
  await customElements.whenDefined('swiper-container');
  const el = swiperElRef.value;
  if (!el) return;
  Object.assign(el, { loop: true, breakpoints });
  el.initialize?.();
});

const goPrev = () => swiperElRef.value?.swiper?.slidePrev();
const goNext = () => swiperElRef.value?.swiper?.slideNext();
</script>
