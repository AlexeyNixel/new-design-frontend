<template>
  <div
    v-if="rows.length"
    class="flex flex-col gap-2.5"
  >
    <div
      v-for="row in rows"
      :key="row.label"
      class="flex items-center gap-3 rounded-xl bg-neutral-100 p-3"
    >
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-700/10 text-primary-700"
      >
        <Icon
          :name="row.icon"
          class="h-5 w-5"
        />
      </div>
      <div class="min-w-0">
        <div class="text-xs text-gray-500">
          {{ row.label }}
        </div>
        <div class="font-bold text-gray-900">
          {{ row.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Game } from '~~/services/types/game.type';
import { GameStatusLabels } from '~/constants/gameStatus';

const props = defineProps<{ game: Game }>();

const rows = computed(() => {
  const list: { icon: string; label: string; value: string }[] = [];

  list.push({
    icon: 'i-heroicons-check-badge',
    label: 'Статус',
    value: GameStatusLabels[props.game.status],
  });

  if (props.game.place) {
    list.push({
      icon: 'i-heroicons-map-pin',
      label: 'Место хранения',
      value: props.game.place,
    });
  }

  return list;
});
</script>
