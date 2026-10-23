<script setup lang="ts">
usePageSeo({
  title: 'Новосибирская областная молодёжная библиотека',
  description:
    'Новосибирская областная молодёжная библиотека (НОМБ): новости и события, книги, настольные игры и комиксы, клубы, выставки и услуги для читателей.',
});
</script>

<!-- pages/index.vue -->
<template>
  <div class="flex flex-col gap-0">
    <!-- ГЕРОЙ-СЕКЦИЯ -->
    <section class="bg-gradient-to-br from-primary-50 to-primary-100">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
        <div class="max-w-[1700px] mx-auto">
          <!-- Слайдер и колонка «уведомление + ближайшее событие» встают рядом только с 2xl:
               уже на 1024–1439px колонка 3/12 получалась 225–290px и обрезала заголовки, а слайдер
               фиксированной высоты сильно кадрировал баннеры. До 2xl — слайдер во всю ширину
               в своих пропорциях, блоки под ним. -->
          <div class="grid grid-cols-1 2xl:grid-cols-12 gap-4">
            <div
              class="2xl:col-span-9 rounded-2xl overflow-hidden shadow-xl bg-white aspect-[5/2] 2xl:aspect-auto 2xl:h-[496px] w-full h-full"
            >
              <MainCarousel />
            </div>

            <!-- Правая колонка (с 2xl), до 2xl — под слайдером -->
            <div
              class="2xl:col-span-3 w-full flex flex-col gap-4 min-h-0 2xl:h-[496px]"
            >
              <InfoBanner />
              <EventCalendar class="flex-1 min-h-0 lg:h-[380px] lg:flex-none 2xl:h-auto 2xl:flex-1" />
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
      eyebrow="Что происходит в библиотеке"
      icon="i-heroicons-newspaper"
      link="/post"
      link-label="Все новости"
      bg-gray
    >
      <NewsCarousel />
    </CommonSectionWrapper>

    <!-- Ссылку на каталог блок рисует сам — рядом с вкладками, своя для каждой -->
    <CommonSectionWrapper
      title="Книжная полка"
      eyebrow="Что почитать в библиотеке"
      icon="i-heroicons-book-open"
    >
      <BookShelf />
    </CommonSectionWrapper>

    <CommonSectionWrapper
      title="Игровая библиотека"
      eyebrow="Настольные игры"
      icon="i-heroicons-puzzle-piece"
      link="/games"
      link-label="Все игры"
      bg-gray
    >
      <GameCarousel />
    </CommonSectionWrapper>

    <ExhibitionShowcase />

    <CommonSectionWrapper content-class="grid gap-4 md:gap-6 lg:grid-cols-2">
      <FeedbackGos />
      <QualitySurvey />
    </CommonSectionWrapper>

    <CommonSectionWrapper
      title="Информация партнёров"
      eyebrow="Новости друзей библиотеки"
      icon="i-heroicons-hand-raised"
      :link="`/post?tags=${POST_TAG.partner}`"
      link-label="Все новости партнёров"
    >
      <PartnerNews />
    </CommonSectionWrapper>
  </div>
</template>
