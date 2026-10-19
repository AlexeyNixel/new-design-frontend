<template>
  <div
    v-if="book"
    class="bg-neutral-100"
  >
    <!-- Шапка: обложка, название, автор, где взять -->
    <section class="bg-[#0d4954] text-white">
      <div class="mx-auto max-w-[1236px] px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 3xl:max-w-[1710px]">
        <UBreadcrumb
          :items="breadcrumbItems"
          :ui="{
            link: 'text-white/70 hover:text-white',
            linkLeadingIcon: 'text-white/70',
            separatorIcon: 'text-white/40',
          }"
          class="mb-8"
        />

        <div class="grid gap-8 md:grid-cols-[minmax(0,260px)_1fr] lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-12">
          <!-- Обложка: по клику — во весь экран -->
          <div
            v-image-gallery="{ modal }"
            class="mx-auto w-48 sm:w-60 md:mx-0 md:w-full"
          >
            <img
              :src="book.preview?.path"
              :srcset="imageSrcset(book.preview)"
              sizes="(max-width: 768px) 240px, 300px"
              :alt="`Обложка книги «${book.title}»`"
              width="300"
              height="450"
              class="aspect-[2/3] w-full cursor-zoom-in rounded-[4px] bg-white/10 object-cover shadow-[0_18px_40px_rgb(0_0_0/0.45)]"
            >
          </div>

          <div class="min-w-0">
            <p
              v-if="book.isVideo"
              class="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#F2B632] px-3 py-1 text-sm font-semibold text-[#0d2a30]"
            >
              <Icon
                name="i-heroicons-video-camera-20-solid"
                class="size-4"
              />
              Есть видеообзор
            </p>

            <h1 class="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              {{ book.title }}
            </h1>
            <p
              v-if="record.author"
              class="mt-3 text-xl text-white/90"
            >
              {{ record.author }}
            </p>
            <p
              v-else-if="!record.isRecord && lead"
              class="mt-4 max-w-2xl text-lg leading-relaxed text-white/85"
            >
              {{ lead }}
            </p>

            <ul
              v-if="facts.length"
              class="mt-6 flex flex-wrap gap-2"
            >
              <li
                v-for="fact in facts"
                :key="fact"
                class="rounded-full bg-white/10 px-3 py-1 text-sm text-white/90 ring-1 ring-white/15"
              >
                {{ fact }}
              </li>
            </ul>

            <!-- Где взять -->
            <div class="mt-8 max-w-xl rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
              <p class="flex items-start gap-2 text-sm text-white/70">
                <Icon
                  name="i-heroicons-map-pin-20-solid"
                  class="mt-0.5 size-5 shrink-0 text-[#F2B632]"
                />
                Где взять
              </p>
              <p class="mt-1 pl-7 font-semibold">
                {{ placeLabel }}
              </p>
              <p class="mt-1 pl-7 text-sm text-white/75">
                Новосибирск, {{ LIBRARY_INFO.address.streetAddress }}. Понедельник — выходной.
              </p>
              <div
                v-if="book.litresLink || hasSession"
                class="mt-4 flex flex-wrap gap-2 pl-7"
              >
                <a
                  v-if="book.litresLink"
                  :href="book.litresLink"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/40 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <Icon
                    name="i-heroicons-device-tablet"
                    class="size-4"
                  />
                  Электронная версия на ЛитРес
                </a>
                <UButton
                  v-if="hasSession"
                  icon="i-heroicons-pencil-square"
                  label="Редактировать"
                  color="neutral"
                  variant="ghost"
                  class="text-white/80 hover:bg-white/10"
                  @click="goToAdmin(`/book/admin/${book.id}`)"
                />
              </div>
            </div>

            <CommonShareButtons
              :title="record.author ? `${book.title} — ${record.author}` : book.title"
              dark
              class="mt-6"
            />

            <div
              v-if="visibleCollections.length"
              class="mt-6 flex flex-wrap items-center gap-2"
            >
              <span class="text-sm text-white/70">В подборках:</span>
              <NuxtLink
                v-for="collection in visibleCollections"
                :key="collection.id"
                :to="`/books/collections/${collection.slug || collection.id}`"
                class="rounded-full bg-white px-3 py-1 text-sm font-medium text-[#0d4954] transition-colors hover:bg-[#F2B632]"
              >
                {{ collection.label }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- items-start: колонки не тянутся за соседней (раскрытие записи справа не растягивает «О книге») -->
    <div class="mx-auto grid max-w-[1236px] items-start gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8 lg:py-14 3xl:max-w-[1710px]">
      <!-- Аннотация -->
      <article
        v-if="annotation"
        class="min-w-0 rounded-2xl bg-white p-6 ring-1 ring-gray-200 sm:p-10"
        :class="{ 'lg:col-span-2': !record.isRecord }"
      >
        <h2 class="mb-5 text-2xl font-bold tracking-tight text-gray-900">
          О книге
        </h2>
        <div
          v-image-gallery="{ modal }"
          class="book-annotation tiptap max-w-[68ch] text-[1.0625rem] leading-[1.75] text-gray-800"
          v-html="annotation"
        />
      </article>

      <!-- Выходные данные -->
      <aside
        v-if="record.isRecord"
        class="h-max rounded-2xl bg-white p-6 ring-1 ring-gray-200"
        :class="{ 'lg:col-span-2 lg:max-w-xl': !annotation }"
      >
        <h2 class="mb-4 text-lg font-bold text-gray-900">
          Выходные данные
        </h2>
        <dl class="space-y-3 text-sm">
          <div
            v-for="row in details"
            :key="row.label"
          >
            <dt class="text-gray-500">
              {{ row.label }}
            </dt>
            <dd class="font-medium text-gray-900">
              {{ row.value }}
            </dd>
          </div>
        </dl>

        <details class="group mt-5 border-t border-gray-100 pt-4">
          <summary class="cursor-pointer list-none text-sm font-semibold text-[#157486] hover:underline">
            <span class="inline-flex items-center gap-1">
              <Icon
                name="i-heroicons-chevron-right-20-solid"
                class="size-4 transition-transform group-open:rotate-90"
              />
              Библиографическая запись для списка литературы
            </span>
          </summary>
          <p class="mt-3 rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
            {{ book.description }}
          </p>
          <UButton
            :icon="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
            :label="copied ? 'Скопировано' : 'Скопировать'"
            size="sm"
            color="neutral"
            variant="outline"
            class="mt-2"
            @click="copyRecord"
          />
        </details>
      </aside>
    </div>

    <!-- Что ещё почитать -->
    <section
      v-if="related.length"
      class="mx-auto max-w-[1236px] px-4 pb-16 sm:px-6 lg:px-8 3xl:max-w-[1710px]"
    >
      <div class="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {{ relatedTitle }}
        </h2>
        <NuxtLink
          :to="relatedLink"
          class="font-medium text-[#157486] hover:underline"
        >
          {{ relatedLinkLabel }}
        </NuxtLink>
      </div>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <BookCard
          v-for="item in related"
          :key="item.id"
          :book="item"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useBookApi } from '~~/services/api/bookService';
import { ModalsCommon } from '#components';
import type { Book } from '~~/services/types/book.type';
import { parseBookRecord } from '~/utils/bibliography';

const RELATED_COUNT = 6;

const route = useRoute();
const bookApi = useBookApi();
const { hasSession, goToAdmin } = useAuth();
const toAbsolute = useAbsoluteUrl();

const overlay = useOverlay();
const modal = overlay.create(ModalsCommon);

const { data: book } = await bookApi.getOneBook(route.params.slug as string, {
  include: 'preview, collections',
});

// В description редакторы кладут библиографическую запись — разбираем на поля
const record = parseBookRecord(book.description);
// Не запись, а обычная фраза (у видеообзоров) — показываем её под названием
const lead = record.isRecord || book.description?.trim() === book.title.trim()
  ? ''
  : book.description?.trim();

// Пустые абзацы (&nbsp;) из старого редактора дают дыры в тексте
const annotation = fitTables(
  (book.content ?? '').replace(/<p[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/g, ''),
);

const facts = [
  record.note,
  record.year && `${record.year} год`,
  record.pages && `${record.pages} ${plural(Number(record.pages), ['страница', 'страницы', 'страниц'])}`,
  record.publisher,
].filter((fact): fact is string => !!fact);

const details = [
  { label: 'Автор', value: record.author },
  { label: 'Перевод', value: record.translation?.replace(/^Перевод с /, 'с ') },
  { label: 'Издательство', value: [record.publisher, record.city].filter(Boolean).join(', ') },
  { label: 'Год издания', value: record.year },
  { label: 'Страниц', value: record.pages },
  { label: 'Серия', value: record.series },
  { label: 'ISBN', value: record.isbn },
].filter((row): row is { label: string; value: string } => !!row.value);

/** «НОМБ» в данных — вся библиотека; иначе конкретный отдел */
const placeLabel = !book.place || book.place.trim() === 'НОМБ'
  ? LIBRARY_INFO.name
  : book.place;

// Скрытые подборки не показываем — их страница ответит 404
const visibleCollections = computed(() =>
  (book.collections ?? []).filter(collection => !collection.isDeleted),
);

// ——— Что ещё почитать: книги той же подборки, иначе новые поступления ———

const firstCollection = visibleCollections.value[0];
let related: Book[] = [];
if (firstCollection) {
  try {
    const { data: collection } = await bookApi.getOneCollection(firstCollection.slug || firstCollection.id);
    related = (collection.books ?? []).filter(item => item.id !== book.id).slice(0, RELATED_COUNT);
  }
  catch {
    related = [];
  }
}
// В маленькой подборке книг мало — добираем новыми поступлениями
const fromCollection = related.length >= 4;
if (!fromCollection) {
  const { data: latest } = await bookApi.getAllBooks({ include: 'preview', limit: RELATED_COUNT * 2 });
  const known = new Set([book.id, ...related.map(item => item.id)]);
  related = [...related, ...(latest ?? []).filter(item => !known.has(item.id))].slice(0, RELATED_COUNT);
}

const relatedTitle = fromCollection ? `Ещё из подборки «${firstCollection!.label}»` : 'Что ещё почитать';
const relatedLink = fromCollection ? `/books/collections/${firstCollection!.slug || firstCollection!.id}` : '/books';
const relatedLinkLabel = fromCollection ? 'Вся подборка' : 'Все книги';

// ——— Копирование записи для списка литературы ———

const copied = ref(false);
const copyRecord = async () => {
  try {
    await navigator.clipboard.writeText(book.description);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  }
  catch {
    useToast().add({ title: 'Не удалось скопировать — выделите текст вручную', color: 'error' });
  }
};

// ——— SEO ———

const breadcrumbItems = [
  { label: 'Главная', icon: 'i-heroicons-home', to: '/' },
  { label: 'Книги', to: '/books' },
  { label: book.title, to: `/books/${book.slug}` },
];
useBreadcrumbSchema(breadcrumbItems);

const annotationText = stripHtml(annotation);

usePageSeo({
  title: record.author ? `${book.title} — ${record.author}` : book.title,
  description: truncateText(annotationText || lead || book.title),
  image: book.preview?.path,
  type: 'article',
});

useJsonLd('content', {
  '@type': 'Book',
  'name': book.title,
  'author': record.author ? { '@type': 'Person', 'name': record.author } : undefined,
  'description': truncateText(annotationText, 500) || undefined,
  'image': toAbsolute(book.preview?.path),
  'url': toAbsolute(route.path),
  'inLanguage': 'ru',
  'isbn': record.isbn,
  'numberOfPages': record.pages ? Number(record.pages) : undefined,
  'datePublished': record.year,
  'publisher': record.publisher ? { '@type': 'Organization', 'name': record.publisher } : undefined,
  'bookFormat': 'https://schema.org/Paperback',
});
</script>

<style scoped>
/* Старые аннотации выровнены по ширине — на узком экране это даёт «реки» пробелов */
.book-annotation :deep(p) {
  text-align: left !important;
  margin-bottom: 1em;
}
</style>
