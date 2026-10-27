<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Заголовок страницы -->
    <div class="bg-white shadow-sm border-b border-gray-200 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1>
          Сведения об организации, осуществляющей образовательную деятельность
        </h1>
        <p class="text-lg text-gray-600 text-center max-w-3xl mx-auto">
          Полная информация о структуре, документах и деятельности нашей
          организации
        </p>
      </div>
    </div>

    <div class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="link in links"
          :key="link.slug"
          :to="link.slug"
          class="bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 border border-transparent hover:translate-y-[-4px] hover:shadow-xl hover:border-[#25cae9] group flex items-start gap-4 min-h-[120px]"
        >
          <Icon
            class="rounded-lg flex items-center justify-center text-white text-4xl"
            :class="link.color"
            :name="link.icon"
          />
          <div class="flex-1 flex flex-col min-w-0">
            <h3 class="line-clamp-3">
              {{ link.title }}
            </h3>
            <Icon
              class="text-gray-400 transition-transform duration-300 group-hover:translate-x-1 mt-auto ml-auto"
              name="fa-chevron-right"
            />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
usePageSeo({
  title: 'Сведения об образовательной организации',
  description:
    'Сведения об организации, осуществляющей образовательную деятельность: структура, документы, руководство и материально-техническое обеспечение НОМБ.',
});

const links = reactive([
  {
    title: 'Основные сведения',
    slug: '/post/2021-10-12-osnovnye-svedenija',
    icon: 'i-fa-solid-info-circle',
    color: 'bg-blue-500',
  },
  {
    title: 'Структура библиотеки',
    slug: '/page/struktura-biblioteki',
    icon: 'i-fa-solid-sitemap',
    color: 'bg-green-500',
  },
  {
    title: 'Документы',
    slug: '/post/2021-10-12-dokumenty',
    icon: 'i-fa-solid-file-alt',
    color: 'bg-purple-500',
  },
  {
    title: 'Образование',
    slug: '/post/2021-11-12-obrazovanie',
    icon: 'i-fa-solid-graduation-cap',
    color: 'bg-[#25cae9]',
  },
  {
    title: 'Образовательные стандарты',
    slug: '/post/2021-11-12-obrazovatelnye-standarty',
    icon: 'i-fa-solid-award',
    color: 'bg-amber-500',
  },
  {
    title: 'Руководство. Педагогический (научно-педагогический) состав',
    slug: '/post/2021-11-13-rukovodstvo-pedagogicheskij-nauchno-pedagogicheskij-sostav',
    icon: 'i-fa-solid-users',
    color: 'bg-pink-500',
  },
  {
    title:
      'Материально-техническое обеспечение и оснащенность образовательного процесса',
    slug: '/post/2021-11-13-materialno-tehnicheskoe-obespechenie-i-osnaschennost-obrazovatelnogo-protsessa',
    icon: 'i-fa-solid-laptop-house',
    color: 'bg-teal-500',
  },
  {
    title: 'Стипендии и иные виды материальной поддержки',
    slug: '/post/2021-11-13-stipendii-i-inye-vidy-materialnoj-podderzhki',
    icon: 'i-fa-solid-hand-holding-usd',
    color: 'bg-emerald-500',
  },
  {
    title: 'Платные образовательные услуги',
    slug: '/post/2021-11-13-platnye-obrazovatelnye-uslugi',
    icon: 'i-fa-solid-money-bill-wave',
    color: 'bg-orange-500',
  },
  {
    title: 'Финансово-хозяйственная деятельность',
    slug: '/post/2021-11-13-finansovo-hozjajstvennaja-dejatelnost',
    icon: 'i-fa-solid-chart-line',
    color: 'bg-indigo-500',
  },
  {
    title: 'Вакантные места для приема (перевода)',
    slug: '/post/2021-11-13-vakantnye-mesta-dlja-priema-perevoda',
    icon: 'i-fa-solid-user-plus',
    color: 'bg-cyan-500',
  },
  {
    title: 'Архив мероприятий Учебного центра',
    slug: '/post/2021-11-13-arhiv-meroprijatij-uchebnogo-tsentra',
    icon: 'i-fa-solid-archive',
    color: 'bg-violet-500',
  },
  {
    title: 'Планы реализации программ ДПО',
    slug: '/post/2021-11-13-plany-realizatsii-programm-dpo',
    icon: 'i-fa-solid-calendar-alt',
    color: 'bg-rose-500',
  },
]);
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Адаптивность для мобильных */
@media (max-width: 768px) {
  .min-h-\[120px\] {
    min-height: 100px;
  }
}
</style>
