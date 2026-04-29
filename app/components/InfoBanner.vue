<template>
  <UCarousel
    dots
    v-slot="{ item }"
    :items="notifications.data"
    :ui="{
      dots: 'bottom-2 sm:bottom-3',
      dot: 'w-1.5 h-1.5 sm:w-2 sm:h-2 data-[state=active]:bg-primary mx-0.5',
      container: 'h-full',
      item: 'h-full',
    }"
    class="h-full flex"
  >
    <div
      class="rounded-2xl p-3 sm:p-4 text-white shadow flex items-center justify-between gap-3 h-full"
      :class="STYLE_BY_TYPE[item.type]"
    >
      <div class="flex-1 min-w-0">
        <div
          class="font-bold text-sm sm:text-base md:text-lg 4xl:text-xl uppercase tracking-wider truncate"
        >
          {{ item.title }}
        </div>
        <p
          class="text-xs sm:text-sm opacity-80 mt-1 line-clamp-2 sm:line-clamp-3"
        >
          {{ item.description }}
        </p>
        <UButton
          label="Подробнее"
          variant="soft"
          :color="item.type"
          class="mt-2 sm:mt-3 bg-white text-black text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md hover:scale-105 transition-transform"
        />
      </div>
      <div class="text-3xl sm:text-4xl md:text-5xl flex-shrink-0">
        <Icon :name="ICON_BY_TYPE[item.type]" />
      </div>
    </div>
  </UCarousel>
</template>

<script setup lang="ts">
import { useNotificationApi } from '~~/services/api/notification.api';

const notificationApi = useNotificationApi();

const STYLE_BY_TYPE = {
  success: 'bg-gradient-to-br from-success-600 to-success-400',
  warning: 'bg-gradient-to-br from-warning-600 to-warning-400',
  error: 'bg-gradient-to-br from-error-600 to-error-400',
};

const notifications = await notificationApi.getAllNotifications({
  limit: 5,
});

const ICON_BY_TYPE = {
  success: 'i-heroicons-calendar',
  warning: 'qlementine-icons:tool-16',
  error: 'i-heroicons-exclamation-triangle',
};

const carouselUI = {
  dots: 'bottom-2',
  dot: 'w-1.5 h-1.5 data-[state=active]:w-3 data-[state=active]:bg-white data-[state=active]:rounded-full transition-all',
  container: 'h-full',
  item: 'h-full',
};
</script>
