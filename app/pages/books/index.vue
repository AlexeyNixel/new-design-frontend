<template>
  <CommonContentContainer>
    <div class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        Библиотека
      </h1>
    </div>

    <!-- Подборки: с них проще начать, чем с фильтров по всему каталогу -->
    <section
      v-if="collections.length"
      class="mb-12"
      aria-labelledby="collections-title"
    >
      <div class="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id="collections-title"
          class="text-2xl font-bold tracking-tight text-gray-900"
        >
          Подборки от библиотекарей
        </h2>
        <NuxtLink
          v-if="collections.length > 3"
          to="/books/collections"
          class="font-medium text-[#157486] hover:underline"
        >
          Все подборки
        </NuxtLink>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <BookCollectionCard
          v-for="(collection, index) in collections.slice(0, 3)"
          :key="collection.id"
          :collection="collection"
          :index="index"
          eager
        />
      </div>
    </section>

    <h2
      id="catalog-title"
      class="mb-5 text-2xl font-bold tracking-tight text-gray-900"
    >
      Все книги и видеообзоры
    </h2>

    <CommonCatalogFilters
      v-model:search="searchText"
      v-model:sort="sort"
      search-placeholder="Название, автор или описание"
      live-search
      :active-count="activeFiltersCount"
      :total="filteredBooks.length"
      :total-forms="['результат', 'результата', 'результатов']"
      :sort-options="SORT_OPTIONS"
      @reset="resetFilters"
    >
      <template #quick>
        <button
          v-for="option in TYPE_OPTIONS"
          :key="option.value"
          type="button"
          class="genre-pill"
          :class="{ 'genre-pill--active': typeFilter === option.value }"
          :aria-pressed="typeFilter === option.value"
          @click="selectType(option.value)"
        >
          <Icon
            :name="option.icon"
            class="size-4 shrink-0"
          />
          {{ option.label }}
        </button>

        <template v-if="places.length > 1">
          <span
            class="quick-divider"
            aria-hidden="true"
          />
          <button
            v-for="place in places"
            :key="place"
            type="button"
            class="genre-pill"
            :class="{ 'genre-pill--active': isPlaceSelected(place) }"
            :aria-pressed="isPlaceSelected(place)"
            :title="`Где стоит книга: ${place}`"
            @click="togglePlace(place)"
          >
            <Icon
              name="i-heroicons-map-pin"
              class="size-4 shrink-0"
            />
            {{ place }}
          </button>
        </template>
      </template>

      <template #active>
        <button
          v-if="typeFilter !== 'all'"
          type="button"
          class="filter-chip"
          aria-label="Убрать фильтр по типу"
          @click="selectType('all')"
        >
          {{ TYPE_OPTIONS.find(option => option.value === typeFilter)?.label }}
          <Icon
            name="i-heroicons-x-mark"
            class="size-3.5"
          />
        </button>
        <button
          v-for="place in activePlaces"
          :key="place"
          type="button"
          class="filter-chip"
          :aria-label="`Убрать фильтр «${place}»`"
          @click="togglePlace(place)"
        >
          {{ place }}
          <Icon
            name="i-heroicons-x-mark"
            class="size-3.5"
          />
        </button>
      </template>
    </CommonCatalogFilters>

    <div v-if="paginatedBooks.length > 0">
      <div
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6"
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
      class="text-center py-16 bg-white rounded-2xl shadow-sm ring-1 ring-[#0d4954]/10"
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
        Попробуйте изменить запрос или сбросить фильтры
      </p>
      <UButton
        color="primary"
        variant="solid"
        size="lg"
        icon="i-heroicons-arrow-path"
        label="Сбросить поиск и фильтры"
        @click="resetAll"
      />
    </div>
  </CommonContentContainer>
</template>

<script setup lang="ts">
import { useBookApi } from '~~/services/api/bookService';

type TypeFilter = 'all' | 'book' | 'video';
type SortOption = 'new' | 'old' | 'alpha';

const PAGE_SIZE = 24;

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

usePageSeo({
  title: 'Книги',
  description:
    'Книжные подборки и видеообзоры Новосибирской областной молодёжной библиотеки: что почитать и где взять книгу.',
});

const [{ data: allBooks }, { data: collectionsData }] = await Promise.all([
  bookApi.getAllBooks({
    include: 'preview',
    limit: 500,
  }),
  bookApi.getAllCollections({ limit: 4 }),
]);

// Пустые подборки посетителю не показываем
const collections = computed(() =>
  nonEmptyCollections(collectionsData),
);

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

const activeFiltersCount = computed(
  () => (typeFilter.value !== 'all' ? 1 : 0) + activePlaces.value.length,
);

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
  const query: Record<string, string | number> = {};
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
watch(sort, applyFilterChange);

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
  typeFilter.value = 'all';
  activePlaces.value = [];
  applyFilterChange();
};

const resetAll = () => {
  searchText.value = '';
  resetFilters();
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
