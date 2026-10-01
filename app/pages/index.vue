<script setup lang="ts">
usePageSeo({
  title: 'Новосибирская областная молодёжная библиотека',
  description:
    'Новосибирская областная молодёжная библиотека (НОМБ): новости и события, книги, настольные игры и комиксы, клубы, выставки и услуги для читателей.',
});

// Ссылка «Полный список» в блоке «Книги» ведёт в каталог открытой вкладки
const shelfTab = ref<'books' | 'comics'>('books');
const shelfLink = computed(() =>
  shelfTab.value === 'comics'
    ? { to: '/comics', label: 'Полный список комиксов и манги' }
    : { to: '/books', label: 'Полный список книг' },
);
</script>

<!-- pages/index.vue -->
<template>
  <div class="flex flex-col gap-0">
    <!-- ГЕРОЙ-СЕКЦИЯ -->
    <section class="bg-gradient-to-br from-primary-50 to-primary-100">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
        <div class="max-w-[1700px] mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div
              class="lg:col-span-9 rounded-2xl overflow-hidden shadow-xl bg-white aspect-[5/2] lg:aspect-auto lg:h-[496px] w-full h-full"
            >
              <MainCarousel />
            </div>

            <!-- Правая колонка -->
            <div
              class="lg:col-span-3 w-full flex flex-col gap-4 min-h-0 lg:h-[496px]"
            >
              <InfoBanner />
              <EventCalendar class="flex-1 min-h-0" />
            </div>
          </div>

          <!-- Поиск -->
          <!--          <div class="mt-4 block"> -->
          <!--            <CatalogSearch class="w-full" /> -->
          <!--          </div> -->

          <div class="mt-4">
            <Achievements />
          </div>
        </div>
      </div>
    </section>

    <!-- Остальные секции -->
    <CommonSectionWrapper
      title="Анонсы и события"
      link="/post"
      link-label="Все новости"
      bg-gray
    >
      <NewsCarousel />
    </CommonSectionWrapper>

    <CommonSectionWrapper
      bg-gray
      title="Книги"
      :link="shelfLink.to"
      :link-label="shelfLink.label"
    >
      <BookShelf v-model="shelfTab" />
    </CommonSectionWrapper>

    <CommonSectionWrapper
      title="Игровая библиотека"
      link="/games"
      link-label="Полный список игр"
    >
      <GameCarousel />
    </CommonSectionWrapper>

    <ExhibitionShowcase />

    <CommonSectionWrapper>
      <div class="block justify-between md:flex">
        <FeedbackGos />
        <NuxtLink
          to="https://forms.mkrf.ru/e/2579/xTPLeBU7/?ap_orgcode=225601"
          class="rounded-xl overflow-hidden"
        >
          <img
            src="/banner-uvazhaemye-posetiteli.png"
            alt=""
            width="974"
            height="526"
            loading="lazy"
          >
        </NuxtLink>
      </div>
    </CommonSectionWrapper>

    <CommonSectionWrapper
      title="Новости партнеров"
      :link="`/post?tags=${POST_TAG.partner}`"
      link-label="Все новости партнеров"
    >
      <PartnerNews />
    </CommonSectionWrapper>
  </div>
</template>
