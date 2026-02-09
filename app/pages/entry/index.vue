<template>
  <CommonContentContainer>
    <!-- Хлебные крошки -->
    <UBreadcrumb
      :ui="{ link: '[&>span]:text-black text-black' }"
      class="text-black mb-6"
      :items="BREADCRUMB_ITEMS"
    />

    <!-- Заголовок страницы -->
    <div class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        Новости и события
      </h1>
      <UButton @click="activeGrid = !activeGrid">Сменить</UButton>
    </div>

    <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <!-- Блок фильтров -->
      <div class="lg:w-1/3 xl:w-1/4">
        <div
          class="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 md:p-6 sticky top-6"
        >
          <!-- Заголовок фильтров -->
          <div
            class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100"
          >
            <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Icon name="i-heroicons-funnel" class="w-5 h-5 text-primary" />
              Фильтры
            </h2>
            <UButton
              v-if="hasActiveFilters"
              @click="clearFilters"
              size="xs"
              color="neutral"
              variant="ghost"
              class="text-gray-500 hover:text-gray-700"
            >
              Сбросить всё
            </UButton>
          </div>

          <!-- Поиск -->
          <div class="mb-6">
            <UInput
              v-model="search"
              placeholder="Введите запрос..."
              icon="i-heroicons-magnifying-glass-20-solid"
              class="w-full"
              size="lg"
              @keydown.enter="handleSearchChange"
            >
              <template #trailing>
                <UButton
                  v-if="search"
                  @click="
                    search = '';
                    handleSearchChange();
                  "
                  variant="link"
                  size="xs"
                >
                  <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
                </UButton>
              </template>
            </UInput>
          </div>

          <!-- Фильтр по отделам -->
          <div class="mb-6">
            <h3
              class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"
            >
              <Icon name="i-heroicons-building-office" class="w-4 h-4" />
              Отдел
            </h3>
            <USelect
              v-model="filters.department"
              placeholder="Все отделы"
              :items="departments"
              label-key="title"
              value-key="id"
              size="md"
              class="w-full"
              @change="handleFilterChange"
            />
          </div>

          <!-- Фильтр по тегам -->
          <div class="mb-2">
            <div class="flex items-center justify-between mb-3">
              <h3
                class="text-sm font-semibold text-gray-900 flex items-center gap-2"
              >
                <Icon name="i-heroicons-tag" class="w-4 h-4" />
                Теги
              </h3>
              <span class="text-xs text-gray-500"
                >{{ selectedTagsCount }}/{{ tags.length }}</span
              >
            </div>

            <!-- Выбранные теги -->
            <div
              v-if="selectedTags.length > 0"
              class="flex flex-wrap gap-2 mb-3"
            >
              <UBadge
                v-for="tag in selectedTags"
                :key="tag.id"
                :label="tag.title"
                color="primary"
                size="sm"
              >
                <template #trailing>
                  <button
                    @click="toggleTag(tag)"
                    class="ml-1 hover:scale-125 transition-transform"
                  >
                    <Icon name="i-heroicons-x-mark" class="w-3 h-3" />
                  </button>
                </template>
              </UBadge>
            </div>

            <!-- Список тегов -->
            <div class="max-h-60 overflow-y-auto pr-2">
              <div class="space-y-2">
                <div
                  v-for="tag in tags"
                  :key="tag.id"
                  @click="toggleTag(tag)"
                  :class="[
                    'flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all',
                    isTagSelected(tag)
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-gray-50 border border-transparent',
                  ]"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="w-2 h-2 rounded-full"
                      :style="{ backgroundColor: '#3b82f6' }"
                    />
                    <span
                      class="text-sm"
                      :class="
                        isTagSelected(tag)
                          ? 'text-primary font-medium'
                          : 'text-gray-700'
                      "
                    >
                      {{ tag.title }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Сортировка -->
          <div class="pt-4 border-t border-gray-100">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Сортировка</h3>
            <USelect
              placeholder="Сначала новые"
              v-model="filters.sort"
              :items="SORT_OPTIONS"
              size="md"
              @change="handleFilterChange"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Основной контент -->
      <div class="lg:w-2/3 xl:w-3/4">
        <!-- Список новостей -->
        <div v-if="entries?.data && entries.data.length > 0">
          <div
            class="gap-6"
            :class="activeGrid ? 'grid grid-cols-4' : 'flex flex-col'"
          >
            <template v-for="entry in entries.data" :key="entry.id">
              <EntryTile v-if="!activeGrid" :entry="entry" />
              <EntryCard v-else :entry="entry" />
            </template>
          </div>

          <!-- Пагинация -->
          <div class="mt-8 pt-6 border-t border-gray-100">
            <UPagination
              show-edges
              @update:page="handleNavigate"
              v-model:page="page"
              :page-count="10"
              :total="entries?.meta?.total || 0"
              class="flex items-center justify-center"
            />
          </div>
        </div>

        <!-- Состояние "нет результатов" -->
        <div v-else class="text-center py-16">
          <div class="w-24 h-24 mx-auto mb-6 text-gray-300">
            <Icon name="i-heroicons-newspaper" class="w-full h-full" />
          </div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            Новостей не найдено
          </h3>
          <p class="text-gray-500 mb-6 max-w-md mx-auto">
            Попробуйте изменить параметры фильтрации или очистить фильтры
          </p>
          <UButton
            @click="clearFilters"
            color="primary"
            variant="solid"
            size="lg"
          >
            <Icon name="i-heroicons-arrow-path" class="w-5 h-5 mr-2" />
            Очистить фильтры
          </UButton>
        </div>
      </div>
    </div>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import { useEntryApi } from '~~/services/api/entryService';
import type { Entry } from '~~/services/types/entry.type';
import type { ApiResponse } from '~~/services/api/base';
import { useDepartmentApi } from '~~/services/api/departmentService';

interface Tag {
  id: string;
  title: string;
}

const entryApi = useEntryApi();
const departmentApi = useDepartmentApi();
const route = useRoute();

const BREADCRUMB_ITEMS = [
  {
    label: 'Главная',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Новости',
    icon: 'i-heroicons-newspaper',
    to: '/entry',
  },
];

const SORT_OPTIONS = [
  { label: 'Сначала новые', value: 'desc' },
  { label: 'Сначала старые', value: 'asc' },
];

// Состояние
const activeGrid = ref(false);
const entries = ref<ApiResponse<Entry[]>>();
const page = ref(Number(route.query.page) || 1);
const search = ref<string>((route.query.search as string) || '');
const sortFilters = ref('-publishedAt');

const { data: tags } = await entryApi.getAllTags();
const { data: departments } = await departmentApi.getAllDepartments();

const filters = ref({
  date: (route.query.date as string) || undefined,
  dateFrom: (route.query.dateFrom as string) || undefined,
  dateTo: (route.query.dateTo as string) || undefined,
  department: (route.query.department as string) || undefined,
  tags: (route.query.tags as string)?.split(',') || ([] as string[]),
  sort: (route.query.sort as string) || 'desc',
});

const hasActiveFilters = computed(() => {
  return (
    !!filters.value.date ||
    !!filters.value.department ||
    filters.value.tags.length > 0 ||
    !!filters.value.dateFrom ||
    !!filters.value.dateTo
  );
});

const selectedTags = computed(() => {
  return tags.filter((tag) => filters.value.tags.includes(tag.id.toString()));
});

const selectedTagsCount = computed(() => filters.value.tags.length);

const handleSearchChange = async () => {
  updateUrl();
  entries.value = await entryApi.getAllEntry({
    include: 'preview, department',
    search: search.value || undefined,
    department: filters.value.department,
  });
};

const isTagSelected = (tag: Tag) => {
  return filters.value.tags.includes(tag.id.toString());
};

const toggleTag = (tag: Tag) => {
  const tagId = tag.id.toString();
  const index = filters.value.tags.indexOf(tagId);

  if (index > -1) {
    filters.value.tags.splice(index, 1);
  } else {
    filters.value.tags.push(tagId);
  }

  handleFilterChange();
};

const clearFilters = () => {
  filters.value = {
    date: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    department: undefined,
    tags: [],
    sort: 'desc',
  };
  search.value = '';
  page.value = 1;
  handleFilterChange();
};

const handleFilterChange = () => {
  page.value = 1;
  updateUrl();
  loadEntries();
};

const handleNavigate = async (newPage?: number) => {
  page.value = newPage || 1;
  updateUrl();
  await loadEntries();

  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const updateUrl = () => {
  const query: any = {};
  if (page.value > 1) query.page = page.value;
  if (search.value) query.search = search.value;
  if (filters.value.date) query.date = filters.value.date;
  if (filters.value.dateFrom) query.dateFrom = filters.value.dateFrom;
  if (filters.value.dateTo) query.dateTo = filters.value.dateTo;
  if (filters.value.department) query.department = filters.value.department;
  if (filters.value.tags.length > 0) query.tags = filters.value.tags.join(',');
  if (filters.value.sort) query.sort = filters.value.sort;

  navigateTo({
    name: 'entry',
    query,
  });
};

const loadEntries = async () => {
  try {
    entries.value = await entryApi.getAllEntry({
      include: 'preview, department',
      search: search.value || undefined,
      page: page.value,
      department: filters.value.department,
      sortOrder: filters.value.sort,
    });
  } catch (error) {
    console.error('Error loading entries:', error);
  }
};

await loadEntries();

watch(
  () => route.query,
  (newQuery) => {
    // Синхронизируем состояние с URL
    page.value = Number(newQuery.page) || 1;
    search.value = (newQuery.search as string) || '';
    filters.value = {
      date: (newQuery.date as string) || undefined,
      dateFrom: (newQuery.dateFrom as string) || undefined,
      dateTo: (newQuery.dateTo as string) || undefined,
      department: (newQuery.department as string) || undefined,
      tags: (newQuery.tags as string)?.split(',') || [],
      sort: newQuery.sort as string,
    };
  },
  { immediate: true }
);
</script>

<style scoped></style>
