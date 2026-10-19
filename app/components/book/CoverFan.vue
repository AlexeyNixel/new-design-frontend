<script setup lang="ts">
import type { Book } from '~~/services/types/book.type';

// Веер обложек первых книг подборки. При наведении на карточку-родителя
// (класс group) обложки расходятся шире — «раскрывается» стопка книг.
const props = withDefaults(
  defineProps<{
    covers: Pick<Book, 'id' | 'title' | 'preview'>[];
    /** Высота обложки, px */
    height?: number;
    /** Обложки над первым экраном — грузим сразу */
    eager?: boolean;
  }>(),
  { height: 150, eager: false },
);

// До 4 обложек: сдвиг (в долях высоты) и поворот от центра к краям
const LAYOUT = [
  [{ x: 0, r: 0 }],
  [{ x: -0.18, r: -6 }, { x: 0.18, r: 6 }],
  [{ x: -0.32, r: -9 }, { x: 0, r: 0 }, { x: 0.32, r: 9 }],
  [{ x: -0.45, r: -12 }, { x: -0.15, r: -4 }, { x: 0.15, r: 4 }, { x: 0.45, r: 12 }],
];

const items = computed(() => {
  const list = props.covers.filter(cover => cover.preview?.path).slice(0, 4);
  const layout = LAYOUT[list.length - 1] ?? [];
  const middle = Math.floor(list.length / 2);
  return list.map((cover, index) => {
    const { x = 0, r = 0 } = layout[index] ?? {};
    return {
      cover,
      style: {
        '--x': `${x * props.height}px`,
        '--x-open': `${x * props.height * 1.25}px`,
        '--r': `${r}deg`,
        '--r-open': `${r * 1.35}deg`,
        'height': `${props.height}px`,
        'zIndex': index === middle ? 10 : index,
      },
    };
  });
});
</script>

<template>
  <div
    class="relative flex items-end justify-center"
    :style="{ height: `${height + 20}px` }"
  >
    <img
      v-for="{ cover, style } in items"
      :key="cover.id"
      :src="cover.preview?.path"
      :srcset="imageSrcset(cover.preview)"
      :sizes="`${Math.round(height * 0.67)}px`"
      :alt="cover.title"
      :loading="eager ? 'eager' : 'lazy'"
      class="fan-cover absolute bottom-2 aspect-[2/3] rounded-[3px] bg-white object-cover shadow-[0_6px_16px_rgb(0_0_0/0.28)]"
      :style="style"
    >
    <div
      v-if="!items.length"
      class="flex aspect-[2/3] items-center justify-center rounded-[3px] border-2 border-dashed border-current opacity-40"
      :style="{ height: `${height}px` }"
    >
      <Icon
        name="i-heroicons-book-open"
        class="size-8"
      />
    </div>
  </div>
</template>

<style scoped>
.fan-cover {
  transform: translateX(var(--x)) rotate(var(--r));
  transform-origin: 50% 100%;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

:global(.group:hover) .fan-cover,
:global(.group:focus-visible) .fan-cover {
  transform: translateX(var(--x-open)) rotate(var(--r-open)) translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .fan-cover {
    transition: none;
  }
}
</style>
