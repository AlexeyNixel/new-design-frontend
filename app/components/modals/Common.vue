<script setup lang="ts">
defineProps<{
  imgLinks: string[];
  startIndex: number;
}>();

const carousel = ref();
const activeIndex = ref(0);

const onClickNext = () => {
  activeIndex.value++;
};
const onClickPrev = () => {
  activeIndex.value--;
};

const handleSelectSlide = (index: number) => {
  carousel.value?.emblaApi?.scrollTo(index);
  activeIndex.value = index;
};
</script>

<template>
  <UModal
    class="min-w-max"
    title="Расширенное отображение"
    description="Отсутствует"
  >
    <template #content>
      <UCarousel
        ref="carousel"
        class="w-[800px]"
        :items="imgLinks"
        @select="handleSelectSlide"
        v-slot="{ item }"
        :start-index="startIndex || 0"
        arrows
      >
        <img :src="item" alt="" />
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

<style scoped></style>
