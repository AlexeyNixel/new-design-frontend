<script setup lang="ts">
// Правая колонка (баннер + календарь) должна по высоте совпадать с герой-каруселью,
// но НЕ раздувать её, если внутри календаря открыт большой контент (тогда скроллится
// внутри). Grid-stretch этого не гарантирует: авто-строка грида растёт вслед за
// контентом сайдбара, поэтому высоту героя измеряем и фиксируем явно через CSS-переменную.
const heroWrapperRef = ref<HTMLElement | null>(null);
const heroHeightPx = ref<number | null>(null);

let heroResizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (!heroWrapperRef.value) return;

  heroResizeObserver = new ResizeObserver(([entry]) => {
    if (entry) heroHeightPx.value = entry.contentRect.height;
  });
  heroResizeObserver.observe(heroWrapperRef.value);
});

onUnmounted(() => {
  heroResizeObserver?.disconnect();
});
</script>

<!-- pages/index.vue -->
<template>
  <div class="flex flex-col gap-0">
    <!-- ГЕРОЙ-СЕКЦИЯ -->
    <section class="bg-gradient-to-br from-primary-50 to-primary-100">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        <div class="max-w-[1700px] mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-9">
              <div
                ref="heroWrapperRef"
                class="rounded-2xl overflow-hidden shadow-xl bg-white w-full aspect-[2/1]"
              >
                <MainCarousel />
              </div>
            </div>

            <!-- Правая колонка - 3 колонки -->
            <div
              class="lg:col-span-3 flex flex-col gap-4 min-h-0 overflow-hidden lg:h-[var(--hero-h,auto)]"
              :style="heroHeightPx ? { '--hero-h': `${heroHeightPx}px` } : {}"
            >
              <InfoBanner />
              <EventCalendar class="flex-1 min-h-0" />
            </div>
          </div>

          <!-- Поиск -->
          <div class="mt-6 block">
            <CatalogSearch
              placeholder="Найти настолку, книгу или событие..."
              class="w-full"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Остальные секции -->
    <CommonSectionWrapper
      title="Последние новости"
      link="/post"
      link-label="Все новости"
      bg-gray
    >
      <NewsCarousel />
    </CommonSectionWrapper>

    <CommonSectionWrapper
      title="Игровая библиотека"
      link="/games"
      link-label="Полный список игр"
    >
      <GameCarousel />
    </CommonSectionWrapper>

    <CommonSectionWrapper
      bg-gray
      title="Книги"
      link="/books"
      link-label="Полный список книг"
    >
      <BookShelf />
    </CommonSectionWrapper>

    <CommonSectionWrapper>
      <Achievements />
    </CommonSectionWrapper>
  </div>
</template>
