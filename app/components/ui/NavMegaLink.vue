<template>
  <!-- Пункт раздела без вложенных ссылок: выглядит как заголовок группы, но это ссылка —
       рамка-«кнопка», стрелка справа и подсветка при наведении -->
  <NuxtLink
    v-if="parent"
    :to="item.to"
    :target="item.target || (external ? '_blank' : undefined)"
    role="menuitem"
    :aria-current="current ? 'page' : undefined"
    class="group flex items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-colors duration-150"
    :class="
      current
        ? 'border-[#0d4954] bg-[#eef5f6]'
        : 'border-[#0d4954]/10 bg-white hover:border-[#0d4954]/30 hover:bg-[#eef5f6]'
    "
    @click="emit('navigate')"
  >
    <span
      class="flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150"
      :class="current ? 'bg-[#0d4954] text-white' : 'bg-[#eef5f6] text-[#0d4954] group-hover:bg-[#0d4954] group-hover:text-white'"
    >
      <UiNavIcon
        :icon="item.icon"
        :to="item.to"
        fallback="i-heroicons-link"
        class="size-4"
      />
    </span>
    <span class="min-w-0 flex-1 text-sm font-bold uppercase tracking-wide text-[#0d4954]">
      {{ item.title }}
    </span>
    <Icon
      :name="external ? 'i-heroicons-arrow-up-right-20-solid' : 'i-heroicons-arrow-right-20-solid'"
      class="size-4 shrink-0 text-[#157486] transition-transform duration-150 group-hover:translate-x-0.5"
      :aria-label="external ? 'откроется на другом сайте' : undefined"
      :aria-hidden="external ? undefined : 'true'"
    />
  </NuxtLink>

  <!-- Ссылка мега-меню: текущая страница подсвечена, внешние сайты помечены стрелкой -->
  <NuxtLink
    v-else
    :to="item.to"
    :target="item.target || (external ? '_blank' : undefined)"
    role="menuitem"
    :aria-current="current ? 'page' : undefined"
    class="group -mx-2 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors duration-150"
    :class="
      current
        ? 'bg-[#eef5f6] font-bold text-[#0d4954]'
        : 'font-medium text-gray-700 hover:bg-[#eef5f6] hover:text-[#0d4954]'
    "
    @click="emit('navigate')"
  >
    <span
      v-if="hasNavIcon(item)"
      class="flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-150"
      :class="
        current
          ? 'bg-white text-[#0d4954]'
          : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-[#0d4954]'
      "
    >
      <UiNavIcon
        :icon="item.icon"
        :to="item.to"
        class="size-4"
      />
    </span>
    <!-- Стрелка внутри текста — при переносе строки остаётся сразу после последнего слова -->
    <span class="min-w-0">
      {{ item.title }}
      <Icon
        v-if="external"
        name="i-heroicons-arrow-up-right-20-solid"
        class="inline-block size-3.5 align-[-2px] text-gray-400 group-hover:text-[#157486]"
        aria-label="откроется на другом сайте"
      />
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '~~/services/api/main-navigation.api';

const props = defineProps<{
  item: NavigationMenuItem;
  /** Пункт верхнего уровня раздела — оформляется как заголовок группы */
  parent?: boolean;
}>();

const emit = defineEmits<{ navigate: [] }>();

const route = useRoute();

const external = computed(() => !!props.item.to && /^https?:\/\//.test(props.item.to));
const current = computed(() => !external.value && props.item.to === route.fullPath);
</script>
