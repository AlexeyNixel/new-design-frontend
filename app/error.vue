<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();

const route = useRoute();

const statusCode = computed(() => Number(props.error?.statusCode) || 500);
const isNotFound = computed(() => statusCode.value === 404);

/** Путь, который не нашёлся (без адреса сайта) */
const requestedPath = computed(() => route.fullPath);

/** Старый сайт ещё работает — по старым ссылкам страница может найтись там */
const OLD_SITE = 'http://dev.infomania.ru';
const showOldSiteHint = computed(
  () => isNotFound.value && requestedPath.value !== '/',
);

const sections = [
  { label: 'Новости и события', to: '/post', icon: 'i-heroicons-newspaper' },
  { label: 'Книги', to: '/books', icon: 'i-heroicons-book-open' },
  { label: 'Настольные игры', to: '/games', icon: 'i-heroicons-puzzle-piece' },
  { label: 'Комиксы', to: '/comics', icon: 'i-heroicons-chat-bubble-bottom-center-text' },
  { label: 'Виртуальные выставки', to: '/page/exhibition', icon: 'i-heroicons-photo' },
  { label: 'Контакты', to: '/page/kontaktnaya-informaciya', icon: 'i-heroicons-map-pin' },
];

useHead({
  // error.vue рендерится вне app.vue, поэтому шаблон « — НОМБ» добавляем сами
  title: `${isNotFound.value ? 'Страница не найдена' : 'Ошибка на сайте'} — НОМБ`,
  meta: [{ name: 'robots', content: 'noindex' }],
});

// Переход по ссылкам (шапка, подвал, разделы) сбрасывает ошибку сам Nuxt.
// Своего наблюдателя за route не добавлять: при переходе внутри сайта адрес меняется
// уже после показа ошибки, и такой наблюдатель тут же её убирает — экран остаётся пустым.
const goHome = () => clearError({ redirect: '/' });

const goBack = () => {
  if (window.history.length > 1) window.history.back();
  else goHome();
};

const reload = () => window.location.reload();
</script>

<template>
  <NuxtLayout>
    <section class="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div class="max-w-[1236px] mx-auto">
        <div class="grid gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-16">
          <!-- Код ошибки — главный визуальный элемент -->
          <p
            class="error-code font-black leading-none tracking-tighter select-none text-[7rem] sm:text-[10rem] lg:text-[13rem]"
            aria-hidden="true"
          >
            {{ statusCode }}
          </p>

          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {{ isNotFound ? 'Такой страницы нет' : 'Что-то пошло не так' }}
            </h1>

            <p
              v-if="isNotFound"
              class="text-gray-600 text-lg max-w-2xl"
            >
              Возможно, страница переехала или адрес набран с ошибкой. Проверьте
              ссылку или выберите нужный раздел ниже.
            </p>
            <p
              v-else
              class="text-gray-600 text-lg max-w-2xl"
            >
              На сервере произошла ошибка, и страница не открылась. Попробуйте
              обновить её через минуту — если не поможет, напишите нам.
            </p>

            <p
              v-if="isNotFound"
              class="mt-4 inline-flex max-w-full items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-gray-500 shadow-sm"
            >
              <UIcon
                name="i-heroicons-link"
                class="size-4 shrink-0"
              />
              <span class="truncate">{{ requestedPath }}</span>
            </p>

            <div class="mt-8 flex flex-wrap gap-3">
              <UButton
                v-if="!isNotFound"
                size="lg"
                icon="i-heroicons-arrow-path"
                class="rounded-xl bg-primary-500 hover:bg-primary-500/85 text-white font-semibold"
                @click="reload"
              >
                Обновить страницу
              </UButton>
              <UButton
                size="lg"
                icon="i-heroicons-home"
                :class="[
                  'rounded-xl font-semibold',
                  isNotFound
                    ? 'bg-primary-500 hover:bg-primary-500/85 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-50 ring-1 ring-gray-200',
                ]"
                @click="goHome"
              >
                На главную
              </UButton>
              <UButton
                size="lg"
                icon="i-heroicons-arrow-left"
                class="rounded-xl bg-white text-gray-800 hover:bg-gray-50 ring-1 ring-gray-200 font-semibold"
                @click="goBack"
              >
                Назад
              </UButton>
            </div>

            <p
              v-if="showOldSiteHint"
              class="mt-6 text-sm text-gray-500 max-w-2xl"
            >
              Перешли по старой ссылке? Страница могла остаться на прежней версии
              сайта:
              <a
                :href="`${OLD_SITE}${requestedPath}`"
                class="font-semibold text-primary-500 hover:underline"
              >открыть на старом сайте</a>.
            </p>
          </div>
        </div>

        <!-- Куда можно пойти -->
        <nav
          class="mt-14 md:mt-20"
          aria-label="Популярные разделы"
        >
          <h2 class="text-xl! font-bold text-gray-900 mb-5!">
            Популярные разделы
          </h2>
          <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <li
              v-for="section in sections"
              :key="section.to"
            >
              <NuxtLink
                :to="section.to"
                class="group flex h-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <span class="grid size-10 place-items-center rounded-xl bg-primary-500/10 text-primary-700">
                  <UIcon
                    :name="section.icon"
                    class="size-5"
                  />
                </span>
                <span class="text-sm font-semibold text-gray-800 group-hover:text-primary-700">
                  {{ section.label }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
/* Цифры кода — градиент из фирменной палитры (бирюзовый → голубой полосы меню) */
.error-code {
  background: linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-50) 55%, var(--color-primary-500) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
