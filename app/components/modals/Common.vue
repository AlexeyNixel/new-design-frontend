<script setup lang="ts">
defineProps<{
  imgLinks: string[];
  startIndex: number;
}>();

const carousel = ref();
const activeIndex = ref(0);

const width = ref(800);

const handleSelectSlide = (index: number) => {
  carousel.value?.emblaApi?.scrollTo(index);
  activeIndex.value = index;
};

const handleWheelWidth = (e: WheelEvent) => {
  e.preventDefault();
  if (e.deltaY < 0 && width.value < 2000) {
    width.value = Math.min(2000, width.value + Math.abs(e.deltaY));
  } else if (e.deltaY > 0 && width.value > 800) {
    width.value = Math.max(800, width.value - e.deltaY);
  }
};

onMounted(() => {
  document.addEventListener('wheel', handleWheelWidth, { passive: false });
});

onUnmounted(() => {
  document.removeEventListener('wheel', handleWheelWidth);
});
</script>

<template>
  <UModal
    class="image-modal min-w-max"
    title="Расширенное отображение"
    description="Отсутствует"
  >
    <template #content>
      <UCarousel
        ref="carousel"
        :style="{ width: width + 'px' }"
        :items="imgLinks"
        @select="handleSelectSlide"
        v-slot="{ item }"
        :start-index="startIndex || 0"
        arrows
        :ui="{
          item: 'm-auto',
        }"
      >
        <img :style="{ width: width + 'px' }" :src="item" alt="" />
      </UCarousel>

      <div class="flex gap-1 justify-between pt-4 max-w-md mx-auto">
        <div
          v-for="(item, index) in imgLinks"
          :key="index"
          class="size-11 opacity-25 hover:opacity-100 transition-opacity"
          :class="{ 'opacity-100': activeIndex === index }"
          @click="handleSelectSlide(index)"
        >
          <img :src="item" class="rounded-lg w-20" alt="" />
        </div>
      </div>
    </template>
  </UModal>
</template>
