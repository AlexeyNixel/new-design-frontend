<template>
  <ClientOnly>
    <swiper-container class="w-2/3 h-[600px] rounded-xl" ref="containerRef">
      <swiper-slide
        class="rounded-xl"
        v-for="item in slides.data"
        :key="item.id"
      >
        <img
          class="h-full object-cover rounded-xl"
          :src="`http://static.infomania.ru` + item.image.path"
          alt=""
        />
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<script setup lang="ts">
const containerRef = ref();

const slides = await $fetch('http://api.infomania.ru/api/slides', {
  params: {
    include: 'image',
    orderBy: '-createdAt',
  },
});

console.log(slides);
</script>

<style scoped></style>
