<!-- Поиск + скрытая по умолчанию панель фильтров для каталогов (игры, комиксы) -->
<template>
  <div class="mb-6">
    <div class="flex items-stretch gap-2 sm:gap-3">
      <form
        class="flex flex-1 min-w-0 items-center bg-white border border-neutral-200 rounded-xl shadow-sm focus-within:border-primary transition-colors"
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
          class="flex-1 min-w-0 h-12 px-3 bg-transparent text-base text-gray-900 placeholder:text-gray-400 outline-none"
          :placeholder="searchPlaceholder"
          :aria-label="searchPlaceholder"
        >
      </form>

      <button
        type="button"
        class="relative flex items-center justify-center gap-2 h-12 min-w-12 px-3 sm:px-4 rounded-xl border font-medium transition-colors shrink-0"
        :class="
          open
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-gray-800 border-neutral-200 shadow-sm hover:border-primary'
        "
        :aria-expanded="open"
        aria-controls="catalog-filters-panel"
        @click="open = !open"
      >
        <Icon
          name="i-heroicons-adjustments-horizontal"
          class="size-5"
        />
        <span class="hidden sm:inline">Фильтры</span>
        <span
          v-if="activeCount"
          class="flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-xs font-bold"
          :class="open ? 'bg-white text-primary' : 'bg-primary text-white'"
        >{{ activeCount }}</span>
      </button>
    </div>

    <!-- Активные фильтры видны и при закрытой панели -->
    <div
      v-if="activeCount && !open"
      class="flex flex-wrap items-center gap-2 mt-3"
    >
      <slot name="active" />
      <button
        type="button"
        class="text-sm font-medium text-gray-500 hover:text-primary underline underline-offset-2"
        @click="emit('reset')"
      >
        Сбросить
      </button>
    </div>

    <div
      id="catalog-filters-panel"
      class="filters-collapse"
      :class="{ 'filters-collapse--open': open }"
      :inert="!open"
    >
      <div class="overflow-hidden">
        <div class="mt-3 bg-white border border-neutral-200 rounded-2xl shadow-sm p-4 sm:p-5">
          <slot />

          <div class="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">
            <button
              type="button"
              class="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary disabled:opacity-40 disabled:pointer-events-none"
              :disabled="!activeCount"
              @click="emit('reset')"
            >
              <Icon
                name="i-heroicons-arrow-path"
                class="size-4"
              />
              Сбросить всё
            </button>
            <UButton
              label="Показать"
              class="rounded-xl px-5"
              @click="open = false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    searchPlaceholder?: string;
    /** Сколько фильтров сейчас применено (без учёта поиска) */
    activeCount?: number;
  }>(),
  {
    searchPlaceholder: 'Поиск...',
    activeCount: 0,
  },
);

const emit = defineEmits<{
  search: [];
  reset: [];
}>();

const search = defineModel<string>('search', { default: '' });
const open = ref(false);
</script>

<style scoped>
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
