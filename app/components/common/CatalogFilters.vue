<!-- Поиск и фильтры каталогов (книги, игры, комиксы, новости).
     Главный фильтр (#quick) виден всегда, редкие (#default) — под «Ещё фильтры»,
     под карточкой — итог поиска, выбранные фильтры и сортировка. -->
<template>
  <div class="mb-6">
    <div class="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#0d4954]/10 sm:p-4">
      <div class="flex items-stretch gap-2 sm:gap-3">
        <form
          class="flex flex-1 min-w-0 items-center rounded-xl bg-neutral-100 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-primary"
          role="search"
          @submit.prevent="emit('search')"
        >
          <Icon
            name="i-heroicons-magnifying-glass"
            class="ml-4 size-5 shrink-0 text-gray-400"
          />
          <input
            v-model="search"
            type="search"
            enterkeyhint="search"
            class="h-12 min-w-0 flex-1 bg-transparent px-3 text-base text-gray-900 outline-none placeholder:text-gray-500"
            :placeholder="searchPlaceholder"
            :aria-label="searchPlaceholder"
          >
          <button
            v-if="!liveSearch"
            type="submit"
            class="m-1 flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-primary-700 px-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800 sm:px-4"
          >
            <Icon
              name="i-heroicons-magnifying-glass-20-solid"
              class="size-4 sm:hidden"
            />
            <span class="sr-only sm:not-sr-only">Найти</span>
          </button>
        </form>

        <!-- Дополнительные кнопки справа (например, переключатель вида) -->
        <slot name="actions" />
      </div>

      <!-- Главный фильтр страницы — всегда на виду -->
      <div
        v-if="$slots.quick"
        class="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:items-start sm:gap-4"
      >
        <span
          v-if="quickLabel"
          class="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#0d4954] sm:h-9 sm:w-24"
        >
          <Icon
            v-if="quickIcon"
            :name="quickIcon"
            class="size-4 text-primary"
          />
          {{ quickLabel }}
        </span>
        <div class="quick-row">
          <slot name="quick" />
        </div>
      </div>

      <!-- Редкие фильтры -->
      <div
        v-if="$slots.default"
        class="mt-3 border-t border-gray-100 pt-3 sm:mt-4"
      >
        <button
          type="button"
          class="group flex w-full items-center gap-2 rounded-lg py-1 text-left text-sm"
          :aria-expanded="open"
          aria-controls="catalog-filters-panel"
          @click="open = !open"
        >
          <Icon
            name="i-heroicons-adjustments-horizontal"
            class="size-5 shrink-0 text-primary"
          />
          <span class="font-semibold text-[#0d4954] group-hover:text-primary">
            {{ open ? 'Скрыть фильтры' : 'Ещё фильтры' }}
          </span>
          <span
            v-if="moreHint"
            class="hidden truncate text-gray-500 sm:inline"
          >{{ moreHint }}</span>
          <span
            v-if="panelCount"
            class="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white"
          >{{ panelCount }}</span>
          <Icon
            name="i-heroicons-chevron-down-20-solid"
            class="ml-auto size-5 shrink-0 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': open }"
          />
        </button>

        <div
          id="catalog-filters-panel"
          class="filters-collapse"
          :class="{ 'filters-collapse--open': open }"
          :inert="!open"
        >
          <div class="overflow-hidden">
            <div class="pt-4 pb-1">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Итог: сколько нашлось, что выбрано, порядок -->
    <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
      <p
        v-if="total !== undefined"
        class="text-sm text-gray-600"
        aria-live="polite"
      >
        Найдено: <b class="font-semibold text-gray-900">{{ total }}</b>
        {{ totalForms ? plural(total, totalForms) : '' }}
      </p>

      <div
        v-if="activeCount"
        class="flex flex-wrap items-center gap-2"
      >
        <slot name="active" />
        <button
          type="button"
          class="flex items-center gap-1 text-sm font-medium text-gray-500 underline-offset-2 hover:text-primary hover:underline"
          @click="emit('reset')"
        >
          <Icon
            name="i-heroicons-arrow-path"
            class="size-4"
          />
          Сбросить всё
        </button>
      </div>

      <label
        v-if="sortOptions?.length"
        class="ml-auto flex items-center gap-2 text-sm text-gray-500"
      >
        <Icon
          name="i-heroicons-arrows-up-down"
          class="size-4"
        />
        <span class="hidden sm:inline">Порядок:</span>
        <select
          v-model="sort"
          class="sort-select"
        >
          <option
            v-for="option in sortOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    searchPlaceholder?: string;
    /** Сколько фильтров сейчас применено (без учёта поиска) — для «Сбросить всё» */
    activeCount?: number;
    /** Сколько из них спрятано под «Ещё фильтры» */
    panelCount?: number;
    /** Подпись и иконка строки главного фильтра */
    quickLabel?: string;
    quickIcon?: string;
    /** Что лежит под «Ещё фильтры», например «возраст, число игроков» */
    moreHint?: string;
    /** Сколько нашлось и как это склонять: ['игра', 'игры', 'игр'] */
    total?: number;
    totalForms?: [string, string, string];
    sortOptions?: { label: string; value: string }[];
    /** Поиск срабатывает при вводе — кнопка «Найти» не нужна */
    liveSearch?: boolean;
  }>(),
  {
    searchPlaceholder: 'Поиск...',
    activeCount: 0,
    panelCount: 0,
  },
);

const emit = defineEmits<{
  search: [];
  reset: [];
}>();

const search = defineModel<string>('search', { default: '' });
const sort = defineModel<string>('sort');

// Если по ссылке пришли уже выбранные редкие фильтры — показываем их сразу
const open = ref(props.panelCount > 0);
</script>

<style scoped>
/* Строка главного фильтра: на телефоне — лента с прокруткой, на компьютере — в несколько строк */
.quick-row {
  display: flex;
  flex: 1;
  min-width: 0;
  gap: 0.5rem;
  margin-inline: -0.75rem;
  padding-inline: 0.75rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.quick-row::-webkit-scrollbar {
  display: none;
}

@media (min-width: 640px) {
  .quick-row {
    flex-wrap: wrap;
    margin-inline: 0;
    padding-inline: 0;
    overflow: visible;
  }
}

/* Кнопки фильтров и плашки выбранных приходят из страниц через слоты */
:slotted(.genre-pill) {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.375rem;
  min-height: 2.25rem;
  padding: 0.25rem 0.875rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: 9999px;
  background: white;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  color: var(--color-gray-700);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

@media (hover: hover) {
  :slotted(.genre-pill:hover) {
    border-color: var(--ui-primary);
    color: var(--ui-primary);
  }
}

:slotted(.genre-pill--active),
:slotted(.genre-pill--active:hover) {
  border-color: var(--color-primary-700);
  background: var(--color-primary-700);
  color: white;
}

/* «Ещё N» в ленте жанров */
:slotted(.genre-pill--more) {
  border-style: dashed;
  color: var(--color-primary-700);
}

/* Разделитель групп в ленте (например, тип | место хранения) */
:slotted(.quick-divider) {
  flex-shrink: 0;
  align-self: center;
  width: 1px;
  height: 1.5rem;
  background: var(--color-neutral-200);
}

:slotted(.filter-title) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

:slotted(.filter-chip) {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: color-mix(in oklab, var(--ui-primary) 12%, white);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-primary-800);
}

:slotted(button.filter-chip:hover) {
  background: color-mix(in oklab, var(--ui-primary) 20%, white);
}

.sort-select {
  height: 2.25rem;
  padding: 0 2rem 0 0.75rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: 0.625rem;
  background: white
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%239ca3af'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z' clip-rule='evenodd'/%3E%3C/svg%3E")
    no-repeat right 0.5rem center / 1.125rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-900);
  appearance: none;
  outline: none;
  cursor: pointer;
}

.sort-select:focus {
  border-color: var(--ui-primary);
}

/* Плавное раскрытие на произвольную высоту через grid-template-rows */
.filters-collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.filters-collapse--open {
  grid-template-rows: 1fr;
}

@media (prefers-reduced-motion: reduce) {
  .filters-collapse {
    transition: none;
  }
}
</style>
