<template>
  <CommonContentContainer>
    <!-- Хлебные крошки -->
    <UBreadcrumb
      :ui="{ link: '[&>span]:text-black text-black' }"
      class="text-black mb-6"
      :items="BREADCRUMB_ITEMS"
    />

    <!-- Заголовок страницы -->
    <div class="mb-6 md:mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900">
        Новости и события
      </h1>
    </div>

    <CommonCatalogFilters
      v-model:search="search"
      search-placeholder="Поиск новостей"
      :active-count="activeFiltersCount"
      @search="handleSearchChange"
      @reset="clearFilters"
    >
      <template #actions>
        <div
          class="hidden md:flex items-center gap-1 p-1 bg-white border border-neutral-200 rounded-xl shadow-sm shrink-0"
          role="group"
          aria-label="Вид списка"
        >
          <button
            v-for="view in VIEW_OPTIONS"
            :key="view.label"
            type="button"
            class="flex items-center justify-center size-10 rounded-lg transition-colors"
            :class="
              activeGrid === view.grid
                ? 'bg-primary text-white'
                : 'text-gray-500 hover:text-gray-900 hover:bg-neutral-100'
            "
            :aria-label="view.label"
            :aria-pressed="activeGrid === view.grid"
            @click="activeGrid = view.grid"
          >
            <Icon
              :name="view.icon"
              class="size-5"
            />
          </button>
        </div>
      </template>

      <template #active>
        <button
          v-if="periodLabel"
          type="button"
          class="filter-chip"
          :aria-label="`Убрать фильтр «${periodLabel}»`"
          @click="setPeriod(undefined)"
        >
          {{ periodLabel }}
          <Icon
            name="i-heroicons-x-mark"
            class="size-3.5"
          />
        </button>
        <button
          v-if="selectedDepartment"
          type="button"
          class="filter-chip"
          :aria-label="`Убрать фильтр «${selectedDepartment.title}»`"
          @click="setDepartment(undefined)"
        >
          {{ selectedDepartment.title }}
          <Icon
            name="i-heroicons-x-mark"
            class="size-3.5"
          />
        </button>
        <button
          v-for="tag in selectedTags"
          :key="tag.id"
          type="button"
          class="filter-chip"
          :aria-label="`Убрать тег «${tag.title}»`"
          @click="toggleTag(tag)"
        >
          #{{ tag.title }}
          <Icon
            name="i-heroicons-x-mark"
            class="size-3.5"
          />
        </button>
      </template>

      <div class="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <!-- Период: быстрые варианты или год + месяц (без календаря) -->
        <section>
          <h2 class="filter-title">
            <Icon
              name="i-heroicons-calendar-days"
              class="size-4 text-primary"
            />
            Период
          </h2>

          <div class="flex flex-wrap gap-2 mb-3">
            <button
              v-for="item in PERIODS"
              :key="item.value"
              type="button"
              class="genre-pill"
              :class="{ 'genre-pill--active': filters.period === item.value }"
              :aria-pressed="filters.period === item.value"
              @click="
                setPeriod(filters.period === item.value ? undefined : item.value)
              "
            >
              {{ item.label }}
            </button>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <label class="block">
              <span class="sr-only">Год</span>
              <select
                class="filter-select"
                :value="filters.year ?? ''"
                @change="setYear(($event.target as HTMLSelectElement).value)"
              >
                <option value="">Любой год</option>
                <option
                  v-for="year in YEARS"
                  :key="year"
                  :value="year"
                >
                  {{ year }}
                </option>
              </select>
            </label>
            <label class="block">
              <span class="sr-only">Месяц</span>
              <select
                class="filter-select"
                :value="filters.month ?? ''"
                :disabled="!filters.year"
                @change="setMonth(($event.target as HTMLSelectElement).value)"
              >
                <option value="">
                  {{ filters.year ? 'Весь год' : 'Месяц' }}
                </option>
                <option
                  v-for="(name, index) in MONTHS"
                  :key="name"
                  :value="index + 1"
                >
                  {{ name }}
                </option>
              </select>
            </label>
          </div>
        </section>

        <!-- Отдел и порядок -->
        <div class="grid gap-6 content-start">
          <section>
            <h2 class="filter-title">
              <Icon
                name="i-heroicons-building-office"
                class="size-4 text-primary"
              />
              Отдел
            </h2>
            <label class="block">
              <span class="sr-only">Отдел</span>
              <select
                class="filter-select"
                :value="filters.department ?? ''"
                @change="
                  setDepartment(
                    ($event.target as HTMLSelectElement).value || undefined,
                  )
                "
              >
                <option value="">Все отделы</option>
                <option
                  v-for="department in departments"
                  :key="department.id"
                  :value="department.id"
                >
                  {{ department.title }}
                </option>
              </select>
            </label>
          </section>

          <section>
            <h2 class="filter-title">
              <Icon
                name="i-heroicons-arrows-up-down"
                class="size-4 text-primary"
              />
              Порядок
            </h2>
            <div
              class="grid grid-cols-2 p-1 bg-neutral-100 rounded-xl"
              role="group"
              aria-label="Порядок сортировки"
            >
              <button
                v-for="option in SORT_OPTIONS"
                :key="option.value"
                type="button"
                class="h-9 rounded-lg text-sm font-medium transition-colors"
                :class="
                  filters.sort === option.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                "
                :aria-pressed="filters.sort === option.value"
                @click="setSort(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </section>
        </div>

        <!-- Теги: поиск + компактный список -->
        <section class="lg:col-span-2">
          <div
            class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-3"
          >
            <h2 class="filter-title mb-0!">
              <Icon
                name="i-heroicons-hashtag"
                class="size-4 text-primary"
              />
              Теги
              <span
                v-if="filters.tags.length"
                class="text-xs font-normal text-gray-500"
              >выбрано {{ filters.tags.length }}</span>
            </h2>
            <label class="relative w-full sm:w-64">
              <span class="sr-only">Найти тег</span>
              <Icon
                name="i-heroicons-magnifying-glass"
                class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none"
              />
              <input
                v-model="tagQuery"
                type="search"
                class="w-full h-9 pl-9 pr-3 rounded-lg border border-neutral-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary transition-colors"
                placeholder="Найти тег…"
              >
            </label>
          </div>

          <div
            v-if="filteredTags.length"
            class="flex flex-wrap gap-1.5"
          >
            <button
              v-for="tag in filteredTags"
              :key="tag.id"
              type="button"
              class="tag-pill"
              :class="{ 'tag-pill--active': isTagSelected(tag) }"
              :aria-pressed="isTagSelected(tag)"
              @click="toggleTag(tag)"
            >
              #{{ tag.title }}
            </button>
          </div>
          <p
            v-else
            class="text-sm text-gray-500"
          >
            Тегов «{{ tagQuery }}» не найдено
          </p>
        </section>
      </div>
    </CommonCatalogFilters>

    <!-- Список новостей -->
    <div v-if="posts?.data && posts.data.length > 0">
      <div
        v-if="activeGrid"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <EntryCard
          v-for="post in posts.data"
          :key="post.id"
          :post="post"
          class="h-full"
        />
      </div>

      <div
        v-else
        class="flex flex-col gap-6"
      >
        <EntryTile
          v-for="post in posts.data"
          :key="post.id"
          :post="post"
        />
      </div>

      <!-- Пагинация -->
      <div class="mt-10 pt-8 border-t border-gray-200">
        <UPagination
          v-if="(posts.meta?.total ?? 0) > itemsPerPage"
          v-model:page="page"
          show-edges
          :sibling-count="1"
          :items-per-page="itemsPerPage"
          :total="posts.meta?.total || 0"
          class="flex items-center justify-center"
          @update:page="handleNavigate"
        />

        <div class="text-center text-sm text-gray-500 mt-4">
          Найдено новостей: {{ posts.meta?.total }}
        </div>
      </div>
    </div>

    <!-- Состояние "нет результатов" -->
    <div
      v-else
      class="text-center py-16"
    >
      <div class="w-24 h-24 mx-auto mb-6 text-gray-300">
        <Icon
          name="i-heroicons-newspaper"
          class="w-full h-full"
        />
      </div>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">
        Новостей не найдено
      </h3>
      <p class="text-gray-500 mb-6 max-w-md mx-auto">
        Попробуйте изменить параметры фильтрации или очистить фильтры
      </p>
      <UButton
        color="primary"
        variant="solid"
        size="lg"
        icon="i-heroicons-arrow-path"
        label="Очистить фильтры"
        @click="clearFilters"
      />
    </div>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import type { LocationQuery } from 'vue-router';
import { useEntryApi } from '~~/services/api/entryService';
import type { Post } from '~~/services/types/post.type';
import type { ApiResponse } from '~~/services/api/base';
import { useDepartmentApi } from '~~/services/api/departmentService';

interface Tag {
  id: string;
  title: string;
}

type Period = 'week' | 'month' | 'quarter' | 'year';
type SortOrder = 'desc' | 'asc';

interface PostFilters {
  period?: Period;
  year?: number;
  /** 1–12, только вместе с year */
  month?: number;
  department?: string;
  tags: string[];
  sort: SortOrder;
}

const entryApi = useEntryApi();
const departmentApi = useDepartmentApi();
const route = useRoute();

usePageSeo({
  title: 'Новости и события',
  description:
    'Новости, мероприятия и события Новосибирской областной молодёжной библиотеки: встречи, выставки, мастер-классы и клубы.',
});

const BREADCRUMB_ITEMS = [
  {
    label: 'Главная',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Новости',
    icon: 'i-heroicons-newspaper',
    to: '/post',
  },
];

useBreadcrumbSchema(BREADCRUMB_ITEMS);

const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: 'Сначала новые', value: 'desc' },
  { label: 'Сначала старые', value: 'asc' },
];

const VIEW_OPTIONS = [
  { label: 'Списком', icon: 'i-heroicons-bars-3-bottom-left', grid: false },
  { label: 'Сеткой', icon: 'i-heroicons-squares-2x2', grid: true },
];

const PERIODS: { value: Period; label: string; chip: string; days: number }[]
  = [
    { value: 'week', label: 'Неделя', chip: 'За неделю', days: 7 },
    { value: 'month', label: 'Месяц', chip: 'За месяц', days: 30 },
    { value: 'quarter', label: '3 месяца', chip: 'За 3 месяца', days: 91 },
    { value: 'year', label: 'Год', chip: 'За год', days: 365 },
  ];

const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

/** Самые ранние новости в базе — 2009 год */
const FIRST_YEAR = 2009;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
  { length: CURRENT_YEAR - FIRST_YEAR + 1 },
  (_, index) => CURRENT_YEAR - index,
);

/** Границы месяцев считаем по Новосибирску (UTC+7), независимо от часового пояса сервера */
const NSK_OFFSET_MS = 7 * 60 * 60 * 1000;
const nskMonthStart = (year: number, monthIndex: number) =>
  Date.UTC(year, monthIndex, 1) - NSK_OFFSET_MS;

const toNumber = (value: unknown): number | undefined => {
  const num = Number(value);
  return value && !Number.isNaN(num) ? num : undefined;
};

// Старые ссылки вида ?dateFrom=2024-01-01...&dateTo=2024-12-31... превращаем в выбор года
const legacyYear = (query: LocationQuery) => {
  const from = String(query.dateFrom ?? '').match(/^(\d{4})-01-01/);
  const to = String(query.dateTo ?? '').match(/^(\d{4})-12-31/);
  return from && to && from[1] === to[1] ? Number(from[1]) : undefined;
};

const readFilters = (query: LocationQuery): PostFilters => {
  const period = PERIODS.find(item => item.value === query.period)?.value;
  const year = period ? undefined : (toNumber(query.year) ?? legacyYear(query));
  const month = toNumber(query.month);

  return {
    period,
    year,
    month: year && month && month >= 1 && month <= 12 ? month : undefined,
    department: (query.department as string) || undefined,
    tags: ((query.tags as string) || '').split(',').filter(Boolean),
    sort: query.sort === 'asc' ? 'asc' : 'desc',
  };
};

// Состояние
const activeGrid = ref(false);
const posts = ref<ApiResponse<Post[]>>();
const page = ref(Number(route.query.page) || 1);
const search = ref<string>((route.query.search as string) || '');
const filters = ref<PostFilters>(readFilters(route.query));
const tagQuery = ref('');

// Тегов немного (десятки), поэтому грузим все и ищем по ним на клиенте
const { data: tags } = await entryApi.getAllTags({
  limit: 200,
  sortBy: 'title',
  sortOrder: 'asc',
});

const { data: departments } = await departmentApi.getAllDepartments();

const itemsPerPage = computed(() => Number(posts.value?.meta?.limit) || 10);

const selectedTags = computed(() =>
  (tags ?? []).filter(tag => filters.value.tags.includes(tag.id.toString())),
);

const normalize = (value: string) =>
  value.toLowerCase().replaceAll('ё', 'е').trim();

const filteredTags = computed(() => {
  const query = normalize(tagQuery.value);
  if (!query) return tags ?? [];
  return (tags ?? []).filter(tag => normalize(tag.title).includes(query));
});

const selectedDepartment = computed(() =>
  (departments ?? []).find(item => item.id === filters.value.department),
);

const periodLabel = computed(() => {
  const { period, year, month } = filters.value;
  if (period) return PERIODS.find(item => item.value === period)?.chip;
  if (year && month) return `${MONTHS[month - 1]} ${year}`;
  if (year) return `${year} год`;
  return undefined;
});

const activeFiltersCount = computed(
  () =>
    (periodLabel.value ? 1 : 0)
    + (filters.value.department ? 1 : 0)
    + filters.value.tags.length,
);

/** Диапазон дат для API */
const dateRange = computed(() => {
  const { period, year, month } = filters.value;

  if (period) {
    const days = PERIODS.find(item => item.value === period)?.days ?? 0;
    return {
      startDate: new Date(Date.now() - days * 86_400_000).toISOString(),
    };
  }

  if (year) {
    const start = nskMonthStart(year, month ? month - 1 : 0);
    // Date.UTC сам переносит 12-й месяц на январь следующего года
    const end = nskMonthStart(year, month ?? 12) - 1;
    return {
      startDate: new Date(start).toISOString(),
      endDate: new Date(end).toISOString(),
    };
  }

  return {};
});

const isTagSelected = (tag: Tag) =>
  filters.value.tags.includes(tag.id.toString());

// Данные перезагружает watch на route.query — здесь только меняем адрес
const updateUrl = () => {
  const {
    period,
    year,
    month,
    department,
    tags: tagIds,
    sort,
  } = filters.value;
  const query: Record<string, string | number> = {};
  if (page.value > 1) query.page = page.value;
  if (search.value) query.search = search.value;
  if (period) query.period = period;
  if (year) query.year = year;
  if (year && month) query.month = month;
  if (department) query.department = department;
  if (tagIds.length) query.tags = tagIds.join(',');
  if (sort !== 'desc') query.sort = sort;

  navigateTo({ name: 'post', query });
};

const handleFilterChange = () => {
  page.value = 1;
  updateUrl();
};

const handleSearchChange = () => {
  handleFilterChange();
};

const toggleTag = (tag: Tag) => {
  const tagId = tag.id.toString();
  filters.value.tags = isTagSelected(tag)
    ? filters.value.tags.filter(id => id !== tagId)
    : [...filters.value.tags, tagId];
  handleFilterChange();
};

const setPeriod = (period: Period | undefined) => {
  filters.value.period = period;
  filters.value.year = undefined;
  filters.value.month = undefined;
  handleFilterChange();
};

const setYear = (value: string) => {
  filters.value.period = undefined;
  filters.value.year = toNumber(value);
  if (!filters.value.year) filters.value.month = undefined;
  handleFilterChange();
};

const setMonth = (value: string) => {
  filters.value.month = toNumber(value);
  handleFilterChange();
};

const setDepartment = (department: string | undefined) => {
  filters.value.department = department;
  handleFilterChange();
};

const setSort = (sort: SortOrder) => {
  if (filters.value.sort === sort) return;
  filters.value.sort = sort;
  handleFilterChange();
};

const clearFilters = () => {
  filters.value = { tags: [], sort: filters.value.sort };
  tagQuery.value = '';
  handleFilterChange();
};

const handleNavigate = (newPage?: number) => {
  page.value = newPage || 1;
  updateUrl();

  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const loadEntries = async () => {
  try {
    posts.value = await entryApi.getAllEntry({
      include: 'preview, department',
      search: search.value || undefined,
      page: page.value,
      department: filters.value.department,
      sortOrder: filters.value.sort,
      tags: filters.value.tags,
      ...dateRange.value,
    });
  }
  catch (error) {
    console.error('Error loading entries:', error);
  }
};

await loadEntries();

// immediate: false — начальные данные уже загружены выше; здесь реагируем на смену query
// (фильтры, пагинация, а также переход по ссылке /post?... на ту же страницу,
// когда Vue Router переиспользует компонент и setup() повторно не выполняется).
watch(
  () => route.query,
  async (newQuery) => {
    page.value = Number(newQuery.page) || 1;
    search.value = (newQuery.search as string) || '';
    filters.value = readFilters(newQuery);
    await loadEntries();
  },
);
</script>

<style scoped>
.filter-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

/* Нативный select: на телефоне открывает системный барабан — удобнее календаря */
.filter-select {
  width: 100%;
  height: 2.5rem;
  padding: 0 2.25rem 0 0.75rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: 0.625rem;
  background: white
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%239ca3af'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z' clip-rule='evenodd'/%3E%3C/svg%3E")
    no-repeat right 0.625rem center / 1.125rem;
  font-size: 0.875rem;
  color: var(--color-gray-900);
  appearance: none;
  outline: none;
  transition: border-color 0.15s ease;
}

.filter-select:focus {
  border-color: var(--ui-primary);
}

.filter-select:disabled {
  background-color: var(--color-neutral-50);
  color: var(--color-gray-400);
}

/* Теги — компактнее жанров: их много и они вторичны */
.tag-pill {
  display: inline-flex;
  align-items: center;
  height: 1.75rem;
  padding: 0 0.625rem;
  border-radius: 9999px;
  background: var(--color-neutral-100);
  font-size: 0.75rem;
  color: var(--color-gray-600);
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

@media (hover: hover) {
  .tag-pill:hover {
    background: color-mix(in oklab, var(--ui-primary) 12%, white);
    color: var(--ui-primary);
  }
}

.tag-pill--active,
.tag-pill--active:hover {
  background: var(--ui-primary);
  color: white;
}
</style>
