<template>
  <CommonContentContainer>
    <div class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        Библиотека
      </h1>
    </div>

    <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <!-- Блок фильтров -->
      <div class="lg:w-1/4">
        <div
          class="flex flex-col bg-white p-5 shadow rounded-2xl border border-gray-100 sticky top-6"
        >
          <div
            class="flex items-center justify-between border-b border-gray-100 pb-3 mb-4"
          >
            <h2 class="flex items-center gap-2 font-bold text-gray-900">
              <Icon
                name="i-heroicons-funnel"
                class="w-5 h-5 text-primary"
              />
              Фильтры
            </h2>
            <UButton
              v-if="hasActiveFilters"
              size="xs"
              color="neutral"
              variant="ghost"
              class="text-gray-500 hover:text-gray-700"
              @click="resetFilters"
            >
              Сбросить всё
            </UButton>
          </div>

          <!-- Тип -->
          <div class="mb-6">
            <h3
              class="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3"
            >
              <Icon
                name="i-heroicons-adjustments-horizontal"
                class="w-4 h-4"
              />
              Тип
            </h3>

            <div class="grid grid-cols-3 gap-2">
              <UButton
                v-for="option in TYPE_OPTIONS"
                :key="option.value"
                variant="ghost"
                size="sm"
                :class="[
                  'flex-col h-auto py-2 gap-1',
                  typeFilter === option.value ? 'border border-primary bg-primary/5' : 'border border-transparent',
                ]"
                @click="selectType(option.value)"
              >
                <Icon
                  :name="option.icon"
                  class="w-4 h-4"
                />
                <span class="text-xs">{{ option.label }}</span>
              </UButton>
            </div>
          </div>

          <!-- Место хранения -->
          <div class="mb-6">
            <header class="flex items-center justify-between mb-3">
              <h3 class="flex items-center gap-2 text-sm font-medium text-gray-900">
                <Icon
                  name="i-heroicons-map-pin"
                  class="w-4 h-4"
                />
                Хранение
              </h3>

              <div class="text-sm text-gray-500">
                {{ activePlaces.length }} / {{ places.length }}
              </div>
            </header>

            <div
              v-if="activePlaces.length > 0"
              class="flex gap-2 flex-wrap mb-3"
            >
              <UBadge
                v-for="place in activePlaces"
                :key="place"
                :label="place"
                class="rounded-xl flex items-center"
              >
                <template #trailing>
                  <button
                    class="flex items-center ml-1 hover:scale-125 transition-transform"
                    @click="togglePlace(place)"
                  >
                    <Icon
                      name="i-heroicons-x-mark"
                      class="w-3 h-3"
                    />
                  </button>
                </template>
              </UBadge>
            </div>

            <div class="flex flex-col gap-2 max-h-56 overflow-y-auto">
              <button
                v-for="place in places"
                :key="place"
                type="button"
                class="flex items-start gap-2 text-left text-sm rounded-lg px-3 py-2 border transition-colors hover:bg-gray-50"
                :class="isPlaceSelected(place) ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-700'"
                @click="togglePlace(place)"
              >
                <Icon
                  name="i-heroicons-building-library"
                  class="w-4 h-4 mt-0.5 shrink-0"
                />
                <span class="leading-snug">{{ place }}</span>
              </button>
            </div>
          </div>

          <!-- Сортировка -->
          <div class="pt-4 border-t border-gray-100">
            <h3 class="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
              <Icon
                name="i-heroicons-bars-arrow-down"
                class="w-4 h-4"
              />
              Сортировка
            </h3>
            <USelect
              v-model="sort"
              :items="SORT_OPTIONS"
              size="md"
              class="w-full"
              @change="applyFilterChange"
            />
          </div>
        </div>
      </div>

      <!-- Основной контент -->
      <div class="lg:w-3/4">
        <div class="mb-4 bg-white border border-neutral-200 rounded-xl shadow">
          <UInput
            v-model="searchText"
            variant="none"
            class="w-full rounded-xl bg-white"
            placeholder="Поиск по названию или описанию..."
            icon="i-heroicons-magnifying-glass-20-solid"
            size="xl"
          />
        </div>

        <div
          v-if="filteredBooks.length > 0"
          class="mb-4 text-sm text-gray-500"
        >
          Найдено книг: {{ filteredBooks.length }}
        </div>

        <div v-if="paginatedBooks.length > 0">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6"
          >
            <BookCard
              v-for="book in paginatedBooks"
              :key="book.id"
              :book="book"
            />
          </div>

          <div
            v-if="totalPages > 1"
            class="flex items-center justify-center w-full"
          >
            <UPagination
              v-model:page="page"
              show-edges
              :total="filteredBooks.length"
              :items-per-page="PAGE_SIZE"
              @update:page="handleNavigate"
            />
          </div>
        </div>

        <!-- Состояние "нет результатов" -->
        <div
          v-else
          class="text-center py-16 bg-white rounded-2xl shadow border border-gray-100"
        >
          <div class="w-24 h-24 mx-auto mb-6 text-gray-300">
            <Icon
              name="i-heroicons-book-open"
              class="w-full h-full"
            />
          </div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            Книги не найдены
          </h3>
          <p class="text-gray-500 mb-6 max-w-md mx-auto">
            Попробуйте изменить параметры фильтрации или очистить фильтры
          </p>
          <UButton
            color="primary"
            variant="solid"
            size="lg"
            @click="resetFilters"
          >
            <Icon
              name="i-heroicons-arrow-path"
              class="w-5 h-5 mr-2"
            />
            Очистить фильтры
          </UButton>
        </div>
      </div>
    </div>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import { useBookApi } from '~~/services/api/bookService';

type TypeFilter = 'all' | 'book' | 'video';
type SortOption = 'new' | 'old' | 'alpha';

const PAGE_SIZE = 12;

const TYPE_OPTIONS: { label: string; value: TypeFilter; icon: string }[] = [
  { label: 'Все', value: 'all', icon: 'i-heroicons-squares-2x2' },
  { label: 'Книги', value: 'book', icon: 'i-heroicons-book-open' },
  { label: 'Видео', value: 'video', icon: 'i-heroicons-video-camera' },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Сначала новые', value: 'new' },
  { label: 'Сначала старые', value: 'old' },
  { label: 'По алфавиту А-Я', value: 'alpha' },
];

const bookApi = useBookApi();
const route = useRoute();

const { data: allBooks } = await bookApi.getAllBooks({
  include: 'preview',
  limit: 500,
});

const page = ref(Number(route.query.page) || 1);
const searchText = ref<string>((route.query.search as string) || '');
const typeFilter = ref<TypeFilter>((route.query.type as TypeFilter) || 'all');
const activePlaces = ref<string[]>(
  (route.query.places as string)?.split(',').filter(Boolean) || [],
);
const sort = ref<SortOption>((route.query.sort as SortOption) || 'new');

const places = computed(() => {
  const unique = new Set(allBooks.map(book => book.place).filter(Boolean));
  return [...unique].sort((a, b) => a.localeCompare(b, 'ru'));
});

const hasActiveFilters = computed(() => {
  return (
    !!searchText.value
    || typeFilter.value !== 'all'
    || activePlaces.value.length > 0
    || sort.value !== 'new'
  );
});

const filteredBooks = computed(() => {
  let result = allBooks;

  if (typeFilter.value === 'book') result = result.filter(book => !book.isVideo);
  else if (typeFilter.value === 'video') result = result.filter(book => book.isVideo);

  if (activePlaces.value.length > 0) {
    result = result.filter(book => activePlaces.value.includes(book.place));
  }

  const query = searchText.value.trim().toLowerCase();
  if (query) {
    result = result.filter(book =>
      book.title?.toLowerCase().includes(query)
      || book.description?.toLowerCase().includes(query),
    );
  }

  result = [...result].sort((a, b) => {
    if (sort.value === 'alpha') return a.title.localeCompare(b.title, 'ru');

    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return sort.value === 'old' ? -diff : diff;
  });

  return result;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredBooks.value.length / PAGE_SIZE)),
);

const paginatedBooks = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE;
  return filteredBooks.value.slice(start, start + PAGE_SIZE);
});

const updateUrl = () => {
  const query: any = {};
  if (page.value > 1) query.page = page.value;
  if (searchText.value) query.search = searchText.value;
  if (typeFilter.value !== 'all') query.type = typeFilter.value;
  if (activePlaces.value.length > 0) query.places = activePlaces.value.join(',');
  if (sort.value !== 'new') query.sort = sort.value;

  navigateTo({ path: '/books', query });
};

const applyFilterChange = () => {
  page.value = 1;
  updateUrl();
};

let searchDebounce: ReturnType<typeof setTimeout> | undefined;
watch(searchText, () => {
  page.value = 1;
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(updateUrl, 400);
});

const selectType = (value: TypeFilter) => {
  typeFilter.value = value;
  applyFilterChange();
};

const togglePlace = (place: string) => {
  const index = activePlaces.value.indexOf(place);
  if (index > -1) activePlaces.value.splice(index, 1);
  else activePlaces.value.push(place);
  applyFilterChange();
};

const isPlaceSelected = (place: string) => activePlaces.value.includes(place);

const resetFilters = () => {
  searchText.value = '';
  typeFilter.value = 'all';
  activePlaces.value = [];
  sort.value = 'new';
  applyFilterChange();
};

const handleNavigate = () => {
  updateUrl();

  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

watch(totalPages, (value) => {
  if (page.value > value) page.value = value;
});
</script>

<style scoped></style>
