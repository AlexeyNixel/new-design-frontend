<template>
  <div class="pb-16">
    <!-- Шапка с поиском -->
    <section class="bg-gradient-to-br from-primary-700 to-primary-800 text-white">
      <div class="container mx-auto max-w-7xl px-4 pt-6 pb-10 sm:pb-14">
        <UBreadcrumb
          :items="breadcrumbItems"
          :ui="{
            link: 'text-white/70 hover:text-white',
            linkLeadingIcon: 'text-white/70',
            separatorIcon: 'text-white/50',
          }"
          class="mb-8"
        />

        <h1 class="text-3xl sm:text-5xl font-bold tracking-tight">
          Карта сайта
        </h1>
        <p class="mt-3 text-base sm:text-lg text-white/80">
          {{ totalLinks }} {{ plural(totalLinks, ['страница', 'страницы', 'страниц']) }}
          в {{ sections.length }} {{ plural(sections.length, ['разделе', 'разделах', 'разделах']) }} — всё, что есть на сайте, на одном экране
        </p>

        <UInput
          ref="searchInput"
          v-model="query"
          type="text"
          icon="i-heroicons-magnifying-glass"
          size="xl"
          placeholder="Найти раздел или страницу"
          aria-label="Поиск по карте сайта"
          class="mt-8 w-full max-w-2xl"
          :ui="{
            base: 'h-14 sm:h-16 rounded-2xl bg-white !ps-14 !pe-28 text-base sm:text-lg text-gray-900 shadow-xl shadow-black/10 ring-0 placeholder:text-gray-400 focus-visible:ring-4 focus-visible:ring-white/40',
            leading: '!ps-5',
            leadingIcon: 'size-6 text-gray-400',
            trailing: '!pe-4',
          }"
          @keydown.esc="query = ''"
        >
          <template #trailing>
            <UButton
              v-if="query"
              label="Сбросить"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="clearSearch"
            />
            <UKbd
              v-else
              value="/"
              class="hidden sm:inline-flex"
            />
          </template>
        </UInput>
        <p
          v-if="query"
          class="mt-3 text-sm text-white/80"
          aria-live="polite"
        >
          {{ foundLabel }}
        </p>
      </div>
    </section>

    <!-- Быстрый переход к разделам -->
    <nav
      v-if="!query && sections.length"
      aria-label="Разделы карты сайта"
      class="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur"
    >
      <div class="container mx-auto max-w-7xl px-4">
        <ul class="-mx-1 flex gap-1 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <li
            v-for="section in sections"
            :key="section.id"
            class="shrink-0"
          >
            <a
              :href="`#${section.anchor}`"
              class="flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-primary-700/10 hover:text-primary-700"
              @click.prevent="scrollToSection(section.anchor)"
            >
              <UiNavIcon
                :icon="section.icon"
                :to="section.to"
                fallback="i-heroicons-folder"
                class="size-4 text-primary-700"
              />
              {{ section.title }}
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container mx-auto max-w-7xl px-4 mt-8 space-y-6">
      <!-- Каталоги -->
      <section
        v-if="visibleCatalogs.length"
        aria-labelledby="sitemap-catalogs"
      >
        <h2
          id="sitemap-catalogs"
          class="mb-3 text-lg font-bold text-gray-900"
        >
          Каталоги и ленты
        </h2>
        <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <li
            v-for="catalog in visibleCatalogs"
            :key="catalog.to"
          >
            <NuxtLink
              :to="catalog.to"
              class="group flex h-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-primary-700/40 focus-visible:outline-3 focus-visible:outline-primary-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span class="flex size-11 items-center justify-center rounded-xl bg-primary-700/10 text-primary-700 transition-colors group-hover:bg-primary-700 group-hover:text-white">
                <Icon
                  :name="catalog.icon"
                  class="size-6"
                />
              </span>
              <span>
                <span class="block font-semibold text-gray-900">
                  <template
                    v-for="(part, i) in highlight(catalog.title)"
                    :key="i"
                  >
                    <mark
                      v-if="part.match"
                      class="rounded bg-primary-700/10 font-semibold text-primary-800"
                    >{{ part.text }}</mark>
                    <template v-else>{{ part.text }}</template>
                  </template>
                </span>
                <span class="mt-0.5 block text-sm leading-snug text-gray-500">{{ catalog.description }}</span>
              </span>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <!-- Разделы меню -->
      <section
        v-for="section in visibleSections"
        :id="section.anchor"
        :key="section.id"
        style="scroll-margin-top: 5.5rem"
        class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 sm:p-8"
        :aria-labelledby="`${section.anchor}-title`"
      >
        <header class="mb-6 flex items-center gap-4">
          <span class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-700 text-white">
            <UiNavIcon
              :icon="section.icon"
              :to="section.to"
              fallback="i-heroicons-folder"
              class="size-6"
            />
          </span>
          <div class="min-w-0">
            <h2
              :id="`${section.anchor}-title`"
              class="text-xl font-bold text-gray-900 sm:text-2xl"
            >
              <SitemapLink
                :item="section"
                :parts="highlight(section.title)"
                class="hover:text-primary-700"
              />
            </h2>
            <p class="text-sm text-gray-500">
              {{ section.count }} {{ plural(section.count, ['страница', 'страницы', 'страниц']) }}
            </p>
          </div>
        </header>

        <div class="grid grid-cols-1 items-start gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Пункты без вложенных — одним списком -->
          <ul
            v-if="section.leaves.length"
            class="space-y-1"
          >
            <li
              v-for="leaf in section.leaves"
              :key="leaf.id"
            >
              <SitemapLink
                :item="leaf"
                :parts="highlight(leaf.title)"
                with-icon
                class="-mx-2 rounded-lg px-2 py-1.5 font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700"
              />
            </li>
          </ul>

          <div
            v-for="group in section.groups"
            :key="group.id"
          >
            <h3 class="border-b border-gray-100 pb-2 text-base font-semibold text-gray-900">
              <SitemapLink
                :item="group"
                :parts="highlight(group.title)"
                with-icon
                class="hover:text-primary-700"
              />
            </h3>
            <ul class="mt-2 space-y-0.5">
              <li
                v-for="child in group.children"
                :key="child.id"
              >
                <SitemapLink
                  :item="child"
                  :parts="highlight(child.title)"
                  class="-mx-2 rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-primary-700"
                />
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Ничего не нашлось -->
      <div
        v-if="query && !visibleSections.length && !visibleCatalogs.length"
        class="rounded-2xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-gray-200"
      >
        <Icon
          name="i-heroicons-document-magnifying-glass"
          class="mx-auto size-12 text-gray-300"
        />
        <p class="mt-4 text-lg font-semibold text-gray-900">
          В разделах сайта нет «{{ query }}»
        </p>
        <p class="mt-1 text-gray-500">
          Возможно, это есть в новостях — поищите там.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <UButton
            :to="{ path: '/post', query: { search: query } }"
            icon="i-heroicons-magnifying-glass"
            label="Искать в новостях"
            size="lg"
          />
          <UButton
            label="Сбросить поиск"
            color="neutral"
            variant="outline"
            size="lg"
            @click="clearSearch"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavigationApi, type NavigationMenuItem } from '~~/services/api/main-navigation.api';
import SitemapLink, { type SitemapItem } from '~/components/sitemap/SitemapLink.vue';

usePageSeo({
  title: 'Карта сайта',
  description:
    'Все разделы и страницы сайта Новосибирской областной молодёжной библиотеки на одной странице: услуги, ресурсы, пространства, проекты, документы.',
});

const breadcrumbItems = [
  { label: 'Главная', icon: 'i-heroicons-home', to: '/' },
  { label: 'Карта сайта' },
];

// ---------- Данные: меню сайта из CMS ----------

const navigationApi = useNavigationApi();
const navigation = (await navigationApi.getAllNavigation()) ?? [];

// Абсолютные ссылки на свой сайт превращаем во внутренние — без перезагрузки
const OWN_HOST = /^https?:\/\/(www\.)?infomania\.ru(?=\/(page|post|books|games|comics|afisha|document|information)\b)/;

const toSitemapItem = (item: NavigationMenuItem): SitemapItem => {
  const to = item.to?.trim().replace(OWN_HOST, '') || undefined;
  return {
    id: String(item.id),
    title: item.title.trim(),
    icon: item.icon,
    to,
    external: !!to && /^https?:\/\//.test(to),
  };
};

const anchorOf = (to: string | undefined, id: string) => `razdel-${to?.split('/').filter(Boolean).pop() || id}`;

interface SitemapGroup extends SitemapItem {
  children: SitemapItem[];
}

interface SitemapSection extends SitemapItem {
  anchor: string;
  leaves: SitemapItem[];
  groups: SitemapGroup[];
  count: number;
}

const sections: SitemapSection[] = navigation.map((top) => {
  const children = top.children ?? [];
  const leaves = children.filter(child => !child.children?.length).map(toSitemapItem);
  const groups = children
    .filter(child => child.children?.length)
    .map(child => ({ ...toSitemapItem(child), children: child.children!.map(toSitemapItem) }));
  const base = toSitemapItem(top);
  return {
    ...base,
    anchor: anchorOf(base.to, base.id),
    leaves,
    groups,
    count: 1 + leaves.length + groups.reduce((sum, group) => sum + 1 + group.children.length, 0),
  };
});

// Разделы-каталоги, которых нет в меню как отдельных страниц
const catalogs = [
  { title: 'Новости', description: 'Лента и поиск по новостям', to: '/post', icon: 'i-heroicons-newspaper' },
  { title: 'Афиша', description: 'Мероприятия на ближайшие дни', to: '/afisha', icon: 'i-heroicons-calendar-days' },
  { title: 'Каталог книг', description: 'Книги, которые можно взять', to: '/books', icon: 'i-heroicons-book-open' },
  { title: 'Подборки книг', description: 'Тематические списки', to: '/books/collections', icon: 'i-heroicons-rectangle-stack' },
  { title: 'Настольные игры', description: 'Игротека библиотеки', to: '/games', icon: 'i-heroicons-puzzle-piece' },
  { title: 'Комиксы', description: 'Комиксы и манга в фонде', to: '/comics', icon: 'i-heroicons-chat-bubble-left-right' },
];

const totalLinks = sections.reduce((sum, section) => sum + section.count, 0) + catalogs.length;

// ---------- Поиск ----------

const query = ref('');
const searchInput = useTemplateRef<{ inputRef?: HTMLInputElement }>('searchInput');

const normalize = (text: string) => text.toLowerCase().replace(/ё/g, 'е');
const needle = computed(() => normalize(query.value.trim()));
const matches = (text: string) => !needle.value || normalize(text).includes(needle.value);

/** Разбивает текст на куски для подсветки совпадения с запросом. */
const highlight = (text: string) => {
  if (!needle.value) return [{ text, match: false }];
  const index = normalize(text).indexOf(needle.value);
  if (index < 0) return [{ text, match: false }];
  const end = index + needle.value.length;
  return [
    { text: text.slice(0, index), match: false },
    { text: text.slice(index, end), match: true },
    { text: text.slice(end), match: false },
  ].filter(part => part.text);
};

const visibleCatalogs = computed(() => catalogs.filter(catalog => matches(catalog.title) || matches(catalog.description)));

// Совпал раздел или группа — показываем их целиком; иначе — только совпавшие пункты
const visibleSections = computed(() => {
  if (!needle.value) return sections;
  return sections
    .map((section) => {
      if (matches(section.title)) return section;
      const leaves = section.leaves.filter(leaf => matches(leaf.title));
      const groups = section.groups
        .map(group => (matches(group.title) ? group : { ...group, children: group.children.filter(child => matches(child.title)) }))
        .filter(group => matches(group.title) || group.children.length);
      return { ...section, leaves, groups };
    })
    .filter(section => matches(section.title) || section.leaves.length || section.groups.length);
});

const foundCount = computed(
  () =>
    visibleCatalogs.value.length
    + visibleSections.value.reduce(
      (sum, section) =>
        sum + (matches(section.title) ? 1 : 0) + section.leaves.length
        + section.groups.reduce((groupSum, group) => groupSum + (matches(group.title) ? 1 : 0) + group.children.filter(child => matches(child.title)).length, 0),
      0,
    ),
);

const foundLabel = computed(() =>
  foundCount.value
    ? `Найдено ${foundCount.value} ${plural(foundCount.value, ['совпадение', 'совпадения', 'совпадений'])}`
    : 'Совпадений нет',
);

// Свой переход к разделу: scrollIntoView учитывает scroll-margin (липкую полосу)
const scrollToSection = (anchor: string) => {
  document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.replaceState(history.state, '', `#${anchor}`);
};

const clearSearch = () => {
  query.value = '';
  searchInput.value?.inputRef?.focus();
};

// «/» — быстро перейти к поиску (если фокус не в поле ввода)
const onSlash = (event: KeyboardEvent) => {
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
  const target = event.target as HTMLElement | null;
  if (target?.closest('input, textarea, [contenteditable="true"]')) return;
  event.preventDefault();
  searchInput.value?.inputRef?.focus();
};

onMounted(() => window.addEventListener('keydown', onSlash));
onBeforeUnmount(() => window.removeEventListener('keydown', onSlash));
</script>
