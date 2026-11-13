<script setup lang="ts">
import type { LibraryExhibition } from '~~/services/types/libraryExhibition.type';

/**
 * Выставки, которые идут в выбранный день: одна свёрнутая строка «Выставки»
 * со счётчиком, по нажатию раскрывается список с названием и описанием.
 * Держим блок свёрнутым по умолчанию — иначе он перекрывает события дня.
 */
const props = defineProps<{
  exhibitions: LibraryExhibition[];
}>();

const open = ref(false);

// День сменился — блок снова свёрнут, чтобы список не «прыгал»
watch(
  () => props.exhibitions,
  () => {
    open.value = false;
  },
);
</script>

<template>
  <div
    v-if="exhibitions.length"
    class="mb-2.5 overflow-hidden rounded-lg bg-[#fbf1ec] ring-1 ring-[#c9714b]/20"
  >
    <button
      type="button"
      class="flex w-full items-center gap-2 px-2.5 py-1.5 text-left transition hover:bg-[#c9714b]/5"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span
        class="size-2 shrink-0 rounded-full bg-[#F2B632]"
        aria-hidden="true"
      />
      <span class="min-w-0 flex-1 text-[13px] font-semibold uppercase tracking-wide text-gray-600">
        Выставки
      </span>
      <span class="shrink-0 rounded-full bg-[#c9714b]/15 px-1.5 text-[11px] font-bold leading-4 text-[#8a4a2c]">
        {{ exhibitions.length }}
      </span>
      <UIcon
        name="i-heroicons-chevron-down-20-solid"
        class="size-4 shrink-0 text-gray-500 transition-transform"
        :class="{ 'rotate-180': open }"
      />
    </button>

    <ul
      v-if="open"
      class="space-y-2 border-t border-[#c9714b]/15 px-2.5 py-2"
    >
      <li
        v-for="exhibition in exhibitions"
        :key="exhibition.id"
      >
        <p class="text-[13px] font-semibold leading-snug text-gray-900">
          {{ exhibition.title }}
        </p>
        <p
          v-if="exhibition.description"
          class="mt-0.5 text-xs leading-snug text-gray-600"
        >
          {{ exhibition.description }}
        </p>
      </li>
    </ul>
  </div>
</template>
