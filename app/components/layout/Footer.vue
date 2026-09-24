<template>
  <footer class="footer mt-auto text-white">
    <!-- Приходите в гости: адрес, статус «открыто сейчас» и часы работы -->
    <section class="border-b border-white/10">
      <div
        class="max-w-[1710px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
      >
        <div>
          <NuxtLink
            to="/"
            class="inline-block w-36 fill-white rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-200"
            aria-label="НОМБ — на главную"
          >
            <Logo class="w-full h-auto" />
          </NuxtLink>

          <p class="mt-8 text-sm text-white/60">
            Новосибирская областная молодёжная библиотека
          </p>
          <p
            class="mt-1 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            Красный проспект, 26
          </p>

          <div class="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <span
              class="inline-flex items-center gap-2 min-h-6"
              aria-live="polite"
            >
              <span
                class="size-2.5 rounded-full"
                :class="
                  status
                    ? status.isOpen
                      ? 'bg-emerald-400'
                      : 'bg-amber-300'
                    : 'bg-white/30'
                "
                aria-hidden="true"
              />
              <span :class="status ? 'text-white' : 'text-white/60'">
                {{ status?.text ?? 'Часы работы' }}
              </span>
            </span>
            <a
              :href="MAP_URL"
              target="_blank"
              rel="noopener"
              class="footer-link inline-flex items-center gap-1.5"
            >
              <UIcon name="i-heroicons-map-pin" class="size-4" />
              Как добраться
            </a>
          </div>
        </div>

        <!-- Неделя: сегодняшний день подсвечивается после загрузки страницы -->
        <div>
          <ol
            class="grid grid-cols-7 gap-1.5 sm:gap-2"
            aria-label="Часы работы по дням недели"
          >
            <li
              v-for="day in week"
              :key="day.index"
              class="rounded-xl px-1.5 sm:px-3 py-2.5 text-center transition-colors"
              :class="
                day.index === status?.today
                  ? 'bg-white text-primary-800'
                  : 'bg-white/[0.06] text-white'
              "
            >
              <span
                class="block text-xs font-semibold"
                :class="
                  day.index === status?.today
                    ? 'text-primary-700'
                    : 'text-white/60'
                "
              >
                {{ day.label }}
              </span>
              <span
                class="mt-1 block text-xs sm:text-sm font-semibold whitespace-nowrap"
              >
                <template v-if="day.hours">{{ day.hours }}</template>
                <!-- На узких экранах «выходной» не помещается в ячейку: показываем прочерк,
                     а слово оставляем для скринридеров -->
                <template v-else>
                  <span class="sm:hidden" aria-hidden="true">—</span>
                  <span class="sr-only sm:not-sr-only">выходной</span>
                </template>
              </span>
            </li>
          </ol>
          <p class="mt-3 text-xs text-white/50">
            Последний день месяца — технический день
          </p>
        </div>
      </div>
    </section>

    <!-- Навигация и контакты -->
    <section
      class="max-w-[1710px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4"
    >
      <nav
        v-for="group in linkGroups"
        :key="group.title"
        :aria-label="group.title"
      >
        <h2 class="text-base! font-bold mb-0!">
          {{ group.title }}
        </h2>
        <ul class="mt-4 space-y-2.5">
          <li v-for="link in group.links" :key="link.label">
            <NuxtLink
              :to="link.to"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener' : undefined"
              class="footer-link text-sm"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div>
        <h2 class="text-base! font-bold mb-0!">Связаться с нами</h2>
        <ul class="mt-4 space-y-2.5 text-sm">
          <li>
            <a
              :href="`tel:${PHONE_HREF}`"
              class="footer-link inline-flex items-center gap-2"
            >
              <UIcon name="i-heroicons-phone" class="size-4 text-primary-200" />
              {{ LIBRARY_INFO.telephone }}
            </a>
          </li>
          <li>
            <a
              :href="`mailto:${LIBRARY_INFO.email}`"
              class="footer-link inline-flex items-center gap-2"
            >
              <UIcon
                name="i-heroicons-envelope"
                class="size-4 text-primary-200"
              />
              {{ LIBRARY_INFO.email }}
            </a>
          </li>
        </ul>

        <UButton
          to="/page/obratnaya-svyaz"
          size="lg"
          class="mt-6 rounded-xl bg-primary-500 hover:bg-primary-500/85 text-white font-semibold"
        >
          Задать вопрос
        </UButton>

        <ul class="mt-6 flex gap-2" aria-label="Мы в соцсетях">
          <li v-for="social in socials" :key="social.label">
            <a
              :href="social.href"
              target="_blank"
              rel="noopener"
              :aria-label="social.label"
              :title="social.label"
              class="grid place-items-center size-10 rounded-xl bg-white/[0.08] hover:bg-white/15 text-white transition-colors focus-visible:outline-2 focus-visible:outline-primary-200"
            >
              <UIcon v-if="social.icon" :name="social.icon" class="size-5" />
              <span v-else class="text-xs font-bold">{{ social.text }}</span>
            </a>
          </li>
        </ul>
      </div>
    </section>

    <!-- Обязательные документы и копирайт -->
    <section class="bg-primary-900">
      <div
        class="max-w-[1710px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col-reverse gap-4 lg:flex-row lg:items-center lg:justify-between text-xs text-white/60"
      >
        <p>
          © {{ currentYear }} Новосибирская областная молодёжная библиотека
        </p>
        <ul class="flex flex-wrap gap-x-5 gap-y-2">
          <li v-for="link in legalLinks" :key="link.label">
            <NuxtLink :to="link.to" class="footer-link">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>
  </footer>
</template>

<script setup lang="ts">
import type { LibraryStatus } from '~/utils/librarySchedule';

interface FooterLink {
  label: string;
  to: string;
  external?: boolean;
}

const MAP_URL = 'https://yandex.ru/maps/-/CDvBPw~A';
const PHONE_HREF = LIBRARY_INFO.telephone.replace(/[^\d+]/g, '');
const currentYear = new Date().getFullYear();

// Все ссылки ведут на существующие страницы сайта/CMS (проверено по API навигации)
const linkGroups: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Читателям',
    links: [
      { label: 'Ответы на вопросы', to: '/page/otvety-na-voprosy' },
      { label: 'Личный кабинет', to: '/page/lichnyj-kabinet' },
      { label: 'Правила пользования', to: '/page/pravila-polzovaniya' },
      { label: 'Услуги библиотеки', to: '/page/assortiment-uslug' },
      { label: 'План мероприятий', to: '/page/plan-osnovnyh-meropriyatij' },
      { label: 'Виртуальная справка', to: '/page/virtualnaya-spravka' },
    ],
  },
  {
    title: 'Что у нас есть',
    links: [
      { label: 'Новости и события', to: '/post' },
      { label: 'Книги', to: '/books' },
      { label: 'Настольные игры', to: '/games' },
      { label: 'Комиксы', to: '/comics' },
      { label: 'Клубы и объединения', to: '/page/clubs' },
      {
        label: 'Электронный каталог',
        to: 'http://search.infomania.ru/jirbis2/',
        external: true,
      },
    ],
  },
  {
    title: 'О библиотеке',
    links: [
      { label: 'Контакты', to: '/page/kontaktnaya-informaciya' },
      { label: 'Режим работы', to: '/page/rezhim-raboty' },
      { label: 'Структура библиотеки', to: '/page/struktura-biblioteki' },
      { label: 'История', to: '/page/istoricheskaya-spravka' },
      { label: 'Партнёры', to: '/page/partnery' },
      { label: 'Сведения об организации', to: '/Information' },
    ],
  },
];

const legalLinks: FooterLink[] = [
  { label: 'Доступная среда', to: '/page/dostupnaya-sreda' },
  {
    label: 'Антикоррупционная политика',
    to: '/page/antikorrupcionnaya-politika',
  },
  {
    label: 'Обработка персональных данных',
    to: '/page/politika-obrabotki-i-zashity-personalnyh-dannyh',
  },
  {
    label: 'Оценка качества услуг',
    to: '/page/nezavisimaya-ocenka-kachestva-okazaniya-uslug',
  },
  { label: 'Карта сайта', to: '/page/karta-sajta' },
];

const socials = [
  { label: 'ВКонтакте', href: 'https://vk.ru/oub_nsk', icon: 'i-bxl-vk' },
  // { label: 'Telegram', href: 'https://t.me/oub_nsk', icon: 'i-ix-telegram-logo' },
  { label: 'MAX', href: 'https://max.ru/id5406132173_gos', text: 'MAX' },
];

const week = WEEK_ORDER.map((index) => {
  const hours = LIBRARY_HOURS[index];
  return {
    index,
    label: WEEKDAY_SHORT[index],
    hours: hours ? `${hours.open}–${hours.close}` : null,
  };
});

// Статус зависит от текущего времени — считаем только в браузере,
// иначе серверный и клиентский рендер разойдутся
const status = ref<LibraryStatus | null>(null);
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  status.value = getLibraryStatus();
  timer = setInterval(() => {
    status.value = getLibraryStatus();
  }, 60_000);
});

onBeforeUnmount(() => clearInterval(timer));
</script>

<style scoped>
.footer {
  /* Глубокий бирюзовый из палитры сайта; к низу темнеет к primary-900 */
  background: linear-gradient(
    180deg,
    var(--color-primary-800) 0%,
    color-mix(in oklab, var(--color-primary-800) 70%, var(--color-primary-900))
      100%
  );
}

.footer-link {
  color: rgb(255 255 255 / 0.75);
  border-radius: 0.25rem;
  transition: color 0.15s ease;
}

.footer-link:hover {
  color: var(--color-primary-200);
}

.footer-link:focus-visible {
  outline: 2px solid var(--color-primary-200);
  outline-offset: 3px;
}
</style>
