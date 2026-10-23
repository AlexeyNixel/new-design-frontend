<template>
  <div
    ref="root"
    class="relative"
    @focusout="onFocusOut"
  >
    <form
      role="search"
      action="/post"
      @submit.prevent="submit()"
    >
      <label class="group flex items-center gap-2.5 h-11 px-4 rounded-xl bg-neutral-100 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-700 hover:ring-primary-700/40">
        <UIcon
          name="i-heroicons-magnifying-glass"
          class="size-5 shrink-0 text-primary-700"
        />
        <input
          ref="input"
          v-model="query"
          type="search"
          name="search"
          autocomplete="off"
          placeholder="Поиск по сайту"
          aria-label="Поиск по сайту"
          role="combobox"
          aria-autocomplete="list"
          :aria-expanded="isOpen"
          :aria-controls="listId"
          :aria-activedescendant="activeIndex >= 0 ? optionId(activeIndex) : undefined"
          class="min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-500 outline-none [&::-webkit-search-cancel-button]:hidden"
          @focus="isOpen = true"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.esc="close(true)"
          @keydown.enter.prevent="onEnter"
        >
        <button
          v-if="query"
          type="button"
          class="flex size-6 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-neutral-100 hover:text-gray-700"
          aria-label="Очистить поиск"
          @click="clear"
        >
          <UIcon
            name="i-heroicons-x-mark-20-solid"
            class="size-4"
          />
        </button>
        <!-- Подсказка горячей клавиши — только для мыши и клавиатуры, на тач-экранах её нет -->
        <kbd
          v-else
          class="hidden pointer-fine:flex size-6 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-xs font-semibold text-gray-400"
          title="Нажмите «/», чтобы начать поиск"
        >/</kbd>
      </label>
    </form>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 top-full z-[60] mt-2 w-full md:w-[min(560px,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-white shadow-[0_24px_48px_-12px_rgb(13_73_84/0.35)] ring-1 ring-gray-100"
      >
        <ul
          :id="listId"
          role="listbox"
          aria-label="Подсказки поиска"
          class="max-h-[min(70vh,520px)] overflow-y-auto p-2"
        >
          <!-- Пустой запрос: недавние поиски и разделы, где обычно ищут -->
          <template v-if="!hasQuery">
            <template v-if="recent.length">
              <li
                class="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400"
                role="presentation"
              >
                Вы искали
              </li>
              <li
                v-for="(term, i) in recent"
                :id="optionId(i)"
                :key="term"
                role="option"
                :aria-selected="activeIndex === i"
                class="option items-center py-2 text-gray-800"
                :class="{ 'option--active': activeIndex === i }"
                @mousedown.prevent
                @mouseenter="activeIndex = i"
                @click="select(i)"
              >
                <UIcon
                  name="i-heroicons-clock"
                  class="size-4 shrink-0 text-gray-400"
                />
                <span class="flex-1 truncate">{{ term }}</span>
                <button
                  type="button"
                  class="flex size-6 items-center justify-center rounded-md text-gray-400 hover:bg-white hover:text-gray-700"
                  :aria-label="`Удалить «${term}» из истории`"
                  @click.stop="forget(term)"
                >
                  <UIcon
                    name="i-heroicons-x-mark-20-solid"
                    class="size-4"
                  />
                </button>
              </li>
            </template>

            <li
              class="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400"
              role="presentation"
            >
              Быстрые переходы
            </li>
            <li
              v-for="(link, i) in QUICK_LINKS"
              :id="optionId(recent.length + i)"
              :key="link.to"
              role="option"
              :aria-selected="activeIndex === recent.length + i"
              class="option items-center py-2 text-gray-800"
              :class="{ 'option--active': activeIndex === recent.length + i }"
              @mousedown.prevent
              @mouseenter="activeIndex = recent.length + i"
              @click="select(recent.length + i)"
            >
              <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eef5f6] text-primary-700">
                <UIcon
                  :name="link.icon"
                  class="size-4"
                />
              </span>
              <span class="flex-1 truncate">{{ link.label }}</span>
              <UIcon
                v-if="link.external"
                name="i-heroicons-arrow-top-right-on-square"
                class="size-4 text-gray-400"
              />
            </li>
          </template>

          <!-- Есть запрос: подсказки из новостей и переход ко всем результатам -->
          <template v-else>
            <li
              v-if="loading && !results.length"
              class="px-3 py-3 text-sm text-gray-500"
              role="presentation"
            >
              Ищем…
            </li>
            <li
              v-else-if="!loading && searched && !results.length"
              class="px-3 py-3 text-sm text-gray-500"
              role="presentation"
            >
              По запросу «{{ trimmed }}» ничего не нашлось. Попробуйте другие слова.
            </li>

            <li
              v-for="(post, i) in results"
              :id="optionId(i)"
              :key="post.id"
              role="option"
              :aria-selected="activeIndex === i"
              class="option items-start py-2 text-gray-800"
              :class="{ 'option--active': activeIndex === i, 'opacity-60': loading }"
              @mousedown.prevent
              @mouseenter="activeIndex = i"
              @click="select(i)"
            >
              <img
                v-if="post.preview?.path"
                :src="thumbnail(post)"
                alt=""
                loading="lazy"
                class="size-12 shrink-0 rounded-lg bg-neutral-100 object-cover"
              >
              <span
                v-else
                class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#eef5f6] text-primary-700"
              >
                <UIcon
                  name="i-heroicons-newspaper"
                  class="size-5"
                />
              </span>
              <span class="min-w-0 flex-1">
                <span class="line-clamp-2 text-sm font-medium leading-snug text-gray-900">
                  <template
                    v-for="(part, p) in highlight(post.title)"
                    :key="p"
                  >
                    <mark
                      v-if="part.match"
                      class="rounded-sm bg-primary-200/60 text-inherit"
                    >{{ part.text }}</mark>
                    <template v-else>{{ part.text }}</template>
                  </template>
                </span>
                <span class="mt-0.5 block text-xs text-gray-500">
                  {{ dayjs(postDisplayDate(post)).format('D MMMM YYYY') }}
                </span>
              </span>
            </li>

            <li
              v-if="results.length"
              class="mx-3 my-1 border-t border-gray-100"
              role="presentation"
            />
            <li
              :id="optionId(results.length)"
              role="option"
              :aria-selected="activeIndex === results.length"
              class="option items-center py-2.5 font-semibold text-primary-800"
              :class="{ 'option--active': activeIndex === results.length }"
              @mousedown.prevent
              @mouseenter="activeIndex = results.length"
              @click="select(results.length)"
            >
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="size-4 shrink-0"
              />
              <span class="flex-1 truncate">
                Все результаты по запросу «{{ trimmed }}»
                <span
                  v-if="total"
                  class="font-normal text-gray-500"
                >· {{ total }}</span>
              </span>
              <kbd class="hidden pointer-fine:inline rounded-md border border-gray-200 bg-white px-1.5 text-xs font-semibold text-gray-400">Enter</kbd>
            </li>
          </template>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import type { Post } from '~~/services/types/post.type';
import type { ApiResponse } from '~~/services/api/base';
import { API_ENDPOINTS } from '~~/services/api/endpoints';

const props = defineProps<{
  /** Сразу поставить курсор в поле (мобильная панель поиска) */
  autofocus?: boolean;
  /** Слушать «/» для фокуса — только у одного экземпляра на странице */
  hotkey?: boolean;
}>();

/** Поиск завершён переходом — родитель может закрыть панель */
const emit = defineEmits<{ done: [] }>();

type SearchPost = Pick<Post, 'id' | 'title' | 'slug' | 'publishedAt' | 'eventDate' | 'preview'>;

const QUICK_LINKS = [
  { label: 'Афиша мероприятий', to: '/afisha', icon: 'i-heroicons-calendar-days' },
  { label: 'Новости', to: '/post', icon: 'i-heroicons-newspaper' },
  { label: 'Книги', to: '/books', icon: 'i-heroicons-book-open' },
  { label: 'Настольные игры', to: '/games', icon: 'i-heroicons-puzzle-piece' },
  { label: 'Комиксы', to: '/comics', icon: 'i-heroicons-chat-bubble-bottom-center-text' },
  {
    label: 'Электронный каталог',
    to: 'https://search.infomania.ru/jirbis2/',
    icon: 'i-heroicons-magnifying-glass-circle',
    external: true,
  },
];

const MIN_LENGTH = 2;
const SUGGEST_LIMIT = 5;
const DEBOUNCE_MS = 250;
const RECENT_KEY = 'header-search-recent';
const RECENT_LIMIT = 5;

const config = useRuntimeConfig();
const route = useRoute();

const root = ref<HTMLElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const listId = useId();
const optionId = (i: number) => `${listId}-option-${i}`;

const query = ref('');
const isOpen = ref(false);
const activeIndex = ref(-1);
const loading = ref(false);
const searched = ref(false);
const results = ref<SearchPost[]>([]);
const total = ref(0);
const recent = ref<string[]>([]);

const trimmed = computed(() => query.value.trim());
const hasQuery = computed(() => trimmed.value.length >= MIN_LENGTH);
const optionCount = computed(() =>
  hasQuery.value ? results.value.length + 1 : recent.value.length + QUICK_LINKS.length,
);

// --- Подсказки -------------------------------------------------------------

let debounce: ReturnType<typeof setTimeout> | undefined;
let controller: AbortController | undefined;

const fetchSuggestions = async (term: string) => {
  controller?.abort();
  controller = new AbortController();
  loading.value = true;
  try {
    const response = await $fetch<ApiResponse<SearchPost[]>>(
      config.public.apiBaseUrl + API_ENDPOINTS.post,
      {
        params: { search: term, limit: SUGGEST_LIMIT, include: 'preview' },
        signal: controller.signal,
      },
    );
    results.value = response.data ?? [];
    total.value = Number(response.meta?.total) || 0;
    searched.value = true;
    loading.value = false;
  }
  catch (error) {
    // Отменённый запрос заменён более свежим — его состояние не трогаем
    if ((error as Error).name === 'AbortError') return;
    results.value = [];
    total.value = 0;
    searched.value = true;
    loading.value = false;
  }
};

watch(trimmed, (term) => {
  clearTimeout(debounce);
  activeIndex.value = -1;
  if (term.length < MIN_LENGTH) {
    controller?.abort();
    results.value = [];
    searched.value = false;
    loading.value = false;
    return;
  }
  loading.value = true;
  debounce = setTimeout(() => fetchSuggestions(term), DEBOUNCE_MS);
});

/** Самая маленькая WebP-копия превью — в подсказке картинка 48px */
const thumbnail = (post: SearchPost) => {
  const variants = Object.entries(post.preview?.variants ?? {});
  if (!variants.length) return post.preview.path;
  return variants.sort(([a], [b]) => Number(a) - Number(b))[0]![1];
};

/** Подсветка слов запроса в заголовке, без v-html */
const highlight = (title: string) => {
  const words = trimmed.value
    .split(/\s+/)
    .filter(word => word.length >= MIN_LENGTH)
    .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!words.length) return [{ text: title, match: false }];
  // split с группой захвата чередует «текст, совпадение, текст, …» — совпадения на нечётных местах
  return title
    .split(new RegExp(`(${words.join('|')})`, 'gi'))
    .map((text, i) => ({ text, match: i % 2 === 1 }))
    .filter(part => part.text);
};

// --- Недавние запросы (только в браузере посетителя) -----------------------

const loadRecent = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
    recent.value = Array.isArray(saved) ? saved.filter(item => typeof item === 'string').slice(0, RECENT_LIMIT) : [];
  }
  catch {
    recent.value = [];
  }
};

const saveRecent = (list: string[]) => {
  recent.value = list.slice(0, RECENT_LIMIT);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.value));
  }
  catch {
    // Хранилище недоступно (приватный режим) — история просто не сохранится
  }
};

const remember = (term: string) =>
  saveRecent([term, ...recent.value.filter(item => item.toLowerCase() !== term.toLowerCase())]);

const forget = (term: string) => {
  saveRecent(recent.value.filter(item => item !== term));
  activeIndex.value = -1;
  input.value?.focus();
};

// --- Действия ----------------------------------------------------------------

const close = (blur = false) => {
  isOpen.value = false;
  activeIndex.value = -1;
  if (blur) input.value?.blur();
};

const finish = () => {
  close(true);
  emit('done');
};

/** Enter без выбранной подсказки — страница поиска со всеми результатами */
const submit = (term = trimmed.value) => {
  if (!term) return;
  remember(term);
  query.value = '';
  finish();
  navigateTo({ path: '/post', query: { search: term } });
};

const select = (index: number) => {
  if (hasQuery.value) {
    const post = results.value[index];
    if (!post) return submit();
    remember(trimmed.value);
    query.value = '';
    finish();
    navigateTo(`/post/${post.slug}`);
    return;
  }

  const term = recent.value[index];
  if (term) return submit(term);

  const link = QUICK_LINKS[index - recent.value.length];
  if (!link) return;
  finish();
  navigateTo(link.to, link.external ? { external: true, open: { target: '_blank' } } : undefined);
};

const onEnter = () => {
  if (activeIndex.value >= 0) select(activeIndex.value);
  else submit();
};

const move = (step: number) => {
  isOpen.value = true;
  const count = optionCount.value;
  if (!count) return;
  // Позиции по кругу: -1 (курсор в поле), 0 … count - 1 (подсказки)
  const position = activeIndex.value + 1;
  activeIndex.value = ((position + step + count + 1) % (count + 1)) - 1;
  if (activeIndex.value >= 0) {
    nextTick(() => document.getElementById(optionId(activeIndex.value))?.scrollIntoView({ block: 'nearest' }));
  }
};

const clear = () => {
  query.value = '';
  input.value?.focus();
};

/** Фокус ушёл за пределы поиска (Tab, клик мимо) — закрываем подсказки */
const onFocusOut = (event: FocusEvent) => {
  if (!root.value?.contains(event.relatedTarget as Node | null)) close();
};

// «/» в любом месте страницы (кроме полей ввода) ставит курсор в поиск
const onHotkey = (event: KeyboardEvent) => {
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
  const target = event.target as HTMLElement | null;
  if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
  event.preventDefault();
  input.value?.focus();
};

// Переход на другую страницу (в т.ч. кнопками браузера) — подсказки не нужны
watch(() => route.fullPath, () => close());

onMounted(() => {
  loadRecent();
  if (props.hotkey) document.addEventListener('keydown', onHotkey);
  if (props.autofocus) input.value?.focus();
});

onBeforeUnmount(() => {
  clearTimeout(debounce);
  controller?.abort();
  document.removeEventListener('keydown', onHotkey);
});
</script>

<style scoped>
/* Выравнивание и вертикальные отступы задаются классами у каждой строки:
   стили без слоя перебили бы утилиты Tailwind */
.option {
  display: flex;
  gap: 0.75rem;
  padding-inline: 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.option--active {
  background-color: #eef5f6;
}
</style>
