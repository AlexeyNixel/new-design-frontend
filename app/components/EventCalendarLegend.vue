<script setup lang="ts">
/**
 * Легенда значков календаря: чем отличаются точки под датой.
 * Намеренно крошечная (10px, без своих отступов по вертикали) — её ставят
 * в уже существующие строки, чтобы не увеличивать высоту блока календаря.
 */
withDefaults(defineProps<{
  /** Показывать ли пункт про выставки: в месяце без выставок он лишний */
  showExhibition?: boolean;
}>(), {
  showExhibition: true,
});
</script>

<template>
  <div class="flex shrink-0 items-center gap-2 text-[10px] leading-none text-gray-500">
    <span class="flex items-center gap-1 whitespace-nowrap">
      <span
        class="size-1 rounded-full bg-primary-50"
        aria-hidden="true"
      />
      события
    </span>
    <span
      v-if="showExhibition"
      class="flex items-center gap-1 whitespace-nowrap"
    >
      <span
        class="size-1.5 rounded-full bg-[#F2B632]"
        aria-hidden="true"
      />
      выставка
    </span>
  </div>
</template>
