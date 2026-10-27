<template>
  <div class="bg-neutral-100">
    <!-- Шапка: название и действия. Нижний отступ большой — на него наезжает рамка плеера -->
    <section class="bg-[#0d4954] text-white">
      <div class="mx-auto max-w-[1236px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-36 3xl:max-w-[1710px]">
        <UBreadcrumb
          :items="breadcrumbItems"
          :ui="{
            link: 'text-white/70 hover:text-white',
            linkLeadingIcon: 'text-white/70',
            separatorIcon: 'text-white/40',
          }"
          class="mb-6"
        />

        <div class="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <div class="min-w-0 max-w-3xl">
            <p class="mb-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/60">
              <UIcon
                name="i-heroicons-photo"
                class="size-4"
              />
              Виртуальная выставка
            </p>
            <h1 class="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {{ exhibition.title }}
            </h1>
          </div>

          <CommonShareButtons
            :title="`Виртуальная выставка «${exhibition.title}»`"
            dark
          />
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-[1236px] px-4 pb-16 sm:px-6 lg:px-8 3xl:max-w-[1710px]">
      <!-- Плеер: рамка держит пропорции слайда и по высоте помещается в экран -->
      <div
        class="-mt-20 lg:-mt-28 mx-auto"
        :style="{ maxWidth: `calc((100dvh - 9rem) * ${exhibition.width} / ${exhibition.height})` }"
      >
        <div
          ref="frameWrapper"
          class="a11y-keep relative overflow-hidden rounded-2xl bg-[#dcdee0] shadow-[0_24px_60px_-20px_rgb(0_0_0/0.45)] ring-1 ring-black/10"
          :style="{ aspectRatio: `${exhibition.width} / ${exhibition.height}` }"
        >
          <!-- Пока плеер грузится — обложка с индикатором, а не пустой серый прямоугольник -->
          <Transition
            leave-active-class="transition-opacity duration-500"
            leave-to-class="opacity-0"
          >
            <div
              v-if="!loaded"
              class="absolute inset-0 z-10 flex items-center justify-center"
            >
              <img
                :src="exhibition.cover"
                alt=""
                class="absolute inset-0 size-full object-cover"
                @error="coverFailed = true"
              >
              <div
                class="absolute inset-0"
                :class="coverFailed ? 'bg-[#0d4954]' : 'bg-black/35'"
              />
              <span class="relative inline-flex items-center gap-3 rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-lg">
                <UIcon
                  name="i-heroicons-arrow-path"
                  class="size-5 animate-spin text-primary-500"
                />
                Загружаем выставку…
              </span>
            </div>
          </Transition>

          <iframe
            ref="frame"
            :src="exhibition.path"
            :title="`Виртуальная выставка «${exhibition.title}»`"
            allow="fullscreen; autoplay"
            allowfullscreen
            class="absolute inset-0 size-full border-0"
            @load="loaded = true"
          />
        </div>

        <!-- Панель под плеером -->
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p class="flex items-center gap-2 text-sm text-gray-600">
            <UIcon
              name="i-heroicons-cursor-arrow-rays"
              class="size-5 shrink-0 text-[#157486]"
            />
            Листайте слайды кнопками плеера или стрелками на клавиатуре
          </p>

          <div class="flex flex-wrap gap-2">
            <UButton
              v-if="canFullscreen"
              icon="i-heroicons-arrows-pointing-out"
              label="Во весь экран"
              @click="openFullscreen"
            />
            <!-- На телефонах без Fullscreen API (iPhone) — открыть сам пакет на весь экран -->
            <UButton
              v-else
              :to="exhibition.path"
              external
              icon="i-heroicons-arrows-pointing-out"
              label="Во весь экран"
            />
            <UButton
              to="/page/exhibition"
              color="neutral"
              variant="outline"
              icon="i-heroicons-squares-2x2"
              label="Все выставки"
            />
          </div>
        </div>
      </div>

      <!-- Другие выставки -->
      <section
        v-if="otherExhibitions.length"
        class="mt-16"
      >
        <div class="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Другие выставки
          </h2>
          <NuxtLink
            to="/page/exhibition"
            class="font-medium text-[#157486] hover:underline"
          >
            Все выставки
          </NuxtLink>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          <ExhibitionCard
            v-for="item in otherExhibitions"
            :key="item.id"
            :exhibition="item"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExhibitionApi } from '~~/services/api/exhibitionsService';

const route = useRoute();
const exhibitionApi = useExhibitionApi();

const slug = route.params.slug as string;

const { data, error } = await useFetch(`/api/exhibition/${slug}`, { key: `exhibition-${slug}` });
if (error.value || !data.value) {
  throw createError({
    statusCode: error.value?.statusCode === 404 ? 404 : 502,
    statusMessage: 'Выставка не найдена',
    fatal: true,
  });
}
const exhibition = data.value;

// Ошибка списка не должна ронять страницу — просто не показываем блок
const otherExhibitions = await exhibitionApi
  .getAllExhibitions({ page: 1, limit: 5, sortOrder: 'desc' })
  .then(response => (response.data ?? []).filter(item => exhibitionSlug(item) !== slug).slice(0, 4))
  .catch(() => []);

const loaded = ref(false);
const coverFailed = ref(false);

const frame = useTemplateRef<HTMLIFrameElement>('frame');
const frameWrapper = useTemplateRef<HTMLElement>('frameWrapper');
const canFullscreen = ref(true);
onMounted(() => {
  canFullscreen.value = document.fullscreenEnabled;
  // Фрейм из SSR-разметки мог догрузиться раньше гидрации — тогда @load уже не придёт
  if (frame.value?.contentDocument?.readyState === 'complete'
    && frame.value.contentWindow?.location.href !== 'about:blank') {
    loaded.value = true;
  }
});

const openFullscreen = () => frameWrapper.value?.requestFullscreen();

const breadcrumbItems = [
  { label: 'Главная', icon: 'i-heroicons-home', to: '/' },
  { label: 'Виртуальные выставки', to: '/page/exhibition' },
  { label: exhibition.title, to: `/page/exhibition/${slug}` },
];
useBreadcrumbSchema(breadcrumbItems);

usePageSeo({
  title: `${exhibition.title} — виртуальная выставка`,
  description: `Виртуальная выставка «${exhibition.title}» Новосибирской областной молодёжной библиотеки — смотрите онлайн в любое время.`,
  image: exhibition.cover,
});
</script>
