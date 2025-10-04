<template>
  <ClientOnly>
    <div class="flex flex-col justify-between h-full w-full">
      <swiper-container
        class="h-full"
        :slides-per-view="1"
        :loop="true"
        ref="containerRef"
      >
        <swiper-slide v-for="(slide, index) in mockBanner" :key="index">
          <div class="flex flex-col h-full justify-between">
            <div>
              <h3 class="font-bold text-xl">
                {{ slide.title }}
              </h3>
              <p>{{ slide.content }}</p>
            </div>
            <NuxtLink :to="slide.link" class="underline">Подробнее</NuxtLink>
          </div>
        </swiper-slide>
      </swiper-container>

      <div class="h-max flex gap-2 justify-end">
        <UiSwiperButton direction="left" @click="swiper.prev()" />
        <UiSwiperButton direction="right" @click="swiper.next()" />
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const containerRef = ref();
const swiper = useSwiper(containerRef);

const mockBanner = [
  {
    title: 'Режим работы НОМБ в праздничные дни',
    content: 'Режим работы НОМБ в праздничные дни',
    link: '/',
  },

  {
    title: 'Режим работы НОМБ в праздничные дни',
    content: 'Режим работы НОМБ в праздничные дни',
    link: '/',
  },
];
</script>

<style scoped></style>
