<template>
  <div>
    <!-- Hero: фон — смешанный цвет обложки -->
    <section
      class="relative overflow-hidden rounded-3xl bg-primary-900"
      :style="heroBackground ? { background: heroBackground } : undefined"
    >
      <div
        class="absolute -left-24 top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 rounded-full bg-primary-50/25 blur-3xl"
      />

      <div
        class="relative z-10 flex flex-col gap-8 p-6 sm:p-10 lg:flex-row lg:items-start lg:gap-12"
      >
        <div class="shrink-0 [perspective:1000px]">
          <img
            :src="cover"
            :alt="comic.title"
            class="w-40 rotate-[-2deg] rounded-2xl bg-white p-2 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:rotate-0 sm:w-52 lg:w-60"
            @error="onCoverError"
          >
        </div>

        <div class="min-w-0 flex-1">
          <h1 class="comic-title text-white">
            {{ comic.title }}
          </h1>

          <p
            v-if="comic.description"
            class="mt-4 max-w-2xl text-lg leading-relaxed text-white/80"
          >
            {{ comic.description }}
          </p>

          <ComicGenres
            :comic="comic"
            tone="onDark"
            class="mt-5"
          />

          <ComicSpecs
            :comic="comic"
            variant="chips"
            tone="onDark"
            class="mt-5"
          />

          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink
              to="/comics"
              class="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white ring-1 ring-inset ring-white/40 transition-colors hover:bg-white/10"
            >
              <Icon
                name="i-heroicons-squares-2x2"
                class="h-5 w-5"
              />
              К каталогу комиксов
            </NuxtLink>
            <NuxtLink
              target="_blank"
              to="https://t.me/ComicBookCenter"
              class="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white ring-1 ring-inset ring-white/40 transition-colors hover:bg-white/10"
            >
              <Icon
                name="i-ix-telegram-logo"
                class="h-5 w-5"
              />
              Наш телеграм канал
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Тело -->
    <div class="mt-8 grid gap-6 lg:grid-cols-3">
      <div class="flex flex-col gap-6 lg:col-span-2">
        <ComicGallery
          :comic="comic"
          :modal="modal"
          hero-covered
        />

        <article
          v-if="comic.content"
          class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:p-8"
        >
          <h2 class="comic-section-title">
            Описание
          </h2>
          <div
            class="tiptap mt-4"
            v-html="comic.content"
          />
        </article>
      </div>

      <aside class="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
        <ComicInfoPanel :comic="comic" />
      </aside>
    </div>

    <ComicAlsoSee
      :comics="otherComics"
      :exclude-id="comic.id"
      :series-title="comic.series?.title"
    />
  </div>
</template>

<script setup lang="ts">
import type { Comic } from '~~/services/types/comic.type';
import type { RgbColor } from '~/composables/useAverageColor';

const props = defineProps<{
  comic: Comic;
  otherComics: Comic[] | null | undefined;
  modal: unknown;
}>();

const cover = computed(
  () => props.comic.images[0]?.file.path || '/placeholder.jpg',
);

const onCoverError = (event: Event) => {
  (event.target as HTMLImageElement).src = '/placeholder.jpg';
};

const averageColor = useAverageColor(cover);

const mixWithBlack = (color: RgbColor, ratio: number) =>
  `rgb(${Math.round(color.r * ratio)}, ${Math.round(color.g * ratio)}, ${Math.round(color.b * ratio)})`;

// Затемняем смешанный цвет, чтобы белый текст поверх оставался читаемым.
const heroBackground = computed(() => {
  if (!averageColor.value) return null;
  const from = mixWithBlack(averageColor.value, 0.55);
  const to = mixWithBlack(averageColor.value, 0.3);
  return `linear-gradient(135deg, ${from}, ${to})`;
});
</script>

<style scoped>
.comic-title {
  font-size: 1.875rem;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.comic-section-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
  color: #111827;
}

@media (min-width: 640px) {
  .comic-title {
    font-size: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .comic-title {
    font-size: 3rem;
  }
}
</style>
