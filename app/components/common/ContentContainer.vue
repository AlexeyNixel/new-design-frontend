<!-- components/common/SectionWrapper.vue -->
<template>
  <section :class="['w-full', bgGray ? 'bg-neutral-200' : 'bg-neutral-100']">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10 3xl:py-12">
      <!-- Максимальная ширина и центрирование -->
      <div class="max-w-[1236px] 3xl:max-w-[1710px] mx-auto">
        <!-- Заголовок -->
        <div
          v-if="title || $slots.header"
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 md:mb-8 3xl:mb-10"
        >
          <h2
            v-if="title"
            class="text-xl sm:text-2xl md:text-3xl 3xl:text-4xl font-bold text-gray-900 tracking-tight"
          >
            {{ title }}
          </h2>
          <slot name="header" />

          <NuxtLink
            v-if="link"
            :to="link"
            class="group flex items-center gap-1 text-sm sm:text-base 3xl:text-lg font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            <span>{{ linkLabel || 'Смотреть всё' }}</span>
            <Icon
              name="mingcute:arrow-right-line"
              class="group-hover:translate-x-1 transition-transform duration-200 w-4 h-4 sm:w-5 sm:h-5"
            />
          </NuxtLink>
        </div>

        <!-- Контент -->
        <div :class="contentClass">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  bgGray?: boolean;
  title?: string;
  link?: string;
  linkLabel?: string;
  contentClass?: string;
}

withDefaults(defineProps<Props>(), {
  bgGray: false,
  contentClass: '',
});
</script>
