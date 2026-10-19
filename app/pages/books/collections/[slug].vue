<template>
  <!-- Без данных не рисуем: при 404 шаблон не должен падать -->
  <div
    v-if="collection"
    class="bg-neutral-100"
  >
    <!-- Шапка: название, описание и веер обложек -->
    <section class="bg-[#0d4954] text-white">
      <div class="mx-auto max-w-[1236px] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14 3xl:max-w-[1710px]">
        <UBreadcrumb
          :items="breadcrumbItems"
          :ui="{
            link: 'text-white/70 hover:text-white',
            linkLeadingIcon: 'text-white/70',
            separatorIcon: 'text-white/40',
          }"
          class="mb-8"
        />

        <div class="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,440px)]">
          <div>
            <h1 class="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {{ collection.label }}
            </h1>
            <p
              v-if="collection.description"
              class="mt-5 max-w-2xl text-lg leading-relaxed text-white/85"
            >
              {{ collection.description }}
            </p>
            <p class="mt-6 text-white/70">
              {{ books.length }} {{ pluralBooks(books.length) }}. Все можно взять в
              библиотеке на {{ LIBRARY_INFO.address.streetAddress }} — где именно
              стоит книга, написано в карточке.
            </p>
          </div>

          <BookCoverFan
            :covers="books"
            :height="220"
            eager
            class="order-first lg:order-none"
          />
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-[1236px] px-4 py-10 sm:px-6 lg:px-8 3xl:max-w-[1710px]">
      <!-- Книги в порядке, который задал редактор -->
      <ul
        v-if="books.length"
        class="grid gap-4 lg:grid-cols-2"
      >
        <li
          v-for="book in books"
          :key="book.id"
        >
          <NuxtLink
            :to="`/books/${book.id}`"
            class="group flex h-full gap-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#0d4954] sm:p-5"
          >
            <img
              :src="book.preview?.path"
              :srcset="imageSrcset(book.preview)"
              sizes="128px"
              :alt="book.title"
              width="128"
              height="192"
              loading="lazy"
              class="aspect-[2/3] w-24 shrink-0 self-start rounded-[3px] bg-gray-100 object-cover shadow-[0_4px_12px_rgb(0_0_0/0.18)] sm:w-32"
            >
            <div class="flex min-w-0 flex-1 flex-col">
              <h2 class="text-lg font-bold leading-snug text-gray-900 group-hover:underline group-hover:underline-offset-4">
                {{ book.title }}
              </h2>
              <p
                v-if="book.description"
                class="mt-2 line-clamp-4 text-sm leading-relaxed text-gray-600"
              >
                {{ book.description }}
              </p>
              <div class="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-sm text-gray-500">
                <span
                  v-if="book.place"
                  class="inline-flex items-center gap-1"
                >
                  <Icon
                    name="i-heroicons-map-pin"
                    class="size-4 shrink-0 text-[#157486]"
                  />
                  {{ book.place }}
                </span>
                <span
                  v-if="book.isVideo"
                  class="inline-flex items-center gap-1"
                >
                  <Icon
                    name="i-heroicons-video-camera"
                    class="size-4 shrink-0 text-[#157486]"
                  />
                  Видеообзор
                </span>
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>

      <div
        v-else
        class="rounded-2xl bg-white p-10 text-center ring-1 ring-gray-200"
      >
        <p class="text-lg font-bold text-gray-900">
          Книги в подборку ещё добавляются
        </p>
        <UButton
          to="/books"
          label="Смотреть все книги"
          class="mt-4"
        />
      </div>

      <!-- Другие подборки -->
      <section
        v-if="otherCollections.length"
        class="mt-16"
      >
        <div class="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Другие подборки
          </h2>
          <NuxtLink
            to="/books/collections"
            class="font-medium text-[#157486] hover:underline"
          >
            Все подборки
          </NuxtLink>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <BookCollectionCard
            v-for="(item, index) in otherCollections"
            :key="item.id"
            :collection="item"
            :index="index + 1"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookApi } from '~~/services/api/bookService';

const route = useRoute();
const bookApi = useBookApi();
const toAbsolute = useAbsoluteUrl();

const { data: collection } = await bookApi.getOneCollection(route.params.slug as string);

const books = computed(() => collection.books ?? []);

const { data: allCollections } = await bookApi.getAllCollections({ limit: 4 });
const otherCollections = computed(() =>
  (allCollections ?? []).filter(item => item.id !== collection.id).slice(0, 3),
);

const breadcrumbItems = [
  { label: 'Главная', icon: 'i-heroicons-home', to: '/' },
  { label: 'Книги', to: '/books' },
  { label: 'Подборки', to: '/books/collections' },
  { label: collection.label, to: `/books/collections/${collection.slug}` },
];
useBreadcrumbSchema(breadcrumbItems);

usePageSeo({
  title: `${collection.label} — подборка книг`,
  description: truncateText(
    collection.description
    || `${books.value.length} ${pluralBooks(books.value.length)} в подборке «${collection.label}» Новосибирской областной молодёжной библиотеки: ${books.value.slice(0, 3).map(book => book.title).join(', ')}.`,
  ),
  image: collection.preview?.path || books.value[0]?.preview?.path,
});

useJsonLd('content', () => {
  if (!books.value.length) return undefined;
  return {
    '@type': 'ItemList',
    'name': collection.label,
    'description': collection.description || undefined,
    'url': toAbsolute(`/books/collections/${collection.slug}`),
    'numberOfItems': books.value.length,
    'itemListElement': books.value.map((book, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Book',
        'name': book.title,
        'url': toAbsolute(`/books/${book.id}`),
        'image': book.preview?.path ? toAbsolute(book.preview.path) : undefined,
      },
    })),
  };
});
</script>
