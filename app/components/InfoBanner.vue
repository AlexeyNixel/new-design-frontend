<template>
  <UCarousel
    v-slot="{ item }"
    dots
    :items="displayItems"
    :ui="{
      dots: 'bottom-2 sm:bottom-3',
      dot: 'w-1.5 h-1.5 sm:w-2 sm:h-2 data-[state=active]:bg-white bg-white/35 mx-0.5 transition-colors duration-200',
      viewport: 'h-full',
      container: 'h-full',
      item: 'h-full',
    }"
    class="h-full"
  >
    <div
      class="relative rounded-2xl p-3 sm:p-4 text-white shadow-lg flex items-center justify-between gap-3 h-full overflow-hidden"
      :class="STYLE_BY_TYPE[item.type]"
    >
      <div
        v-if="item.type === 'festive'"
        class="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none"
      />
      <div
        v-if="item.type === 'festive'"
        class="absolute -bottom-4 right-8 w-16 h-16 rounded-full bg-white/5 pointer-events-none"
      />

      <div class="flex-1 min-w-0 relative z-10">
        <span class="text-[10px] sm:text-xs font-semibold uppercase tracking-widest opacity-70 block mb-0.5">
          {{ LABEL_BY_TYPE[item.type] }}
        </span>
        <div class="font-bold text-sm sm:text-base md:text-lg 4xl:text-xl line-clamp-2 leading-tight">
          {{ item.title }}
        </div>
        <p class="text-xs sm:text-sm opacity-90 mt-1 line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {{ item.description }}
        </p>
        <NuxtLink
          v-if="item.postId"
          :to="`/post/${item.postId}`"
          class="inline-flex items-center gap-1 mt-2 sm:mt-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          Подробнее
          <Icon name="i-heroicons-arrow-right" class="w-3 h-3" />
        </NuxtLink>
      </div>

      <div
        class="text-3xl sm:text-4xl md:text-5xl flex-shrink-0 relative z-10 opacity-90"
        :class="{
          'animate-pulse': item.type === 'error',
          'animate-bounce': item.type === 'festive',
        }"
      >
        <Icon :name="ICON_BY_TYPE[item.type]" />
      </div>
    </div>
  </UCarousel>
</template>

<script setup lang="ts">
import { useNotificationApi } from '~~/services/api/notification.api';
import type { Notification } from '~~/services/types/notification.type';

type NotificationItem = Notification | typeof empty;

const notificationApi = useNotificationApi();

const STYLE_BY_TYPE: Record<Notification['type'], string> = {
  success: 'bg-gradient-to-br from-emerald-600 to-teal-400',
  warning: 'bg-gradient-to-br from-amber-500 to-orange-400',
  error: 'bg-gradient-to-br from-red-600 to-rose-500',
  festive: 'bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-500',
};

const ICON_BY_TYPE: Record<Notification['type'], string> = {
  success: 'i-heroicons-calendar-days',
  warning: 'i-heroicons-wrench-screwdriver',
  error: 'i-heroicons-shield-exclamation',
  festive: 'i-heroicons-sparkles',
};

const LABEL_BY_TYPE: Record<Notification['type'], string> = {
  success: 'Мероприятие',
  warning: 'Техработы',
  error: 'Важно',
  festive: 'Праздник',
};

const empty = {
  id: 'empty',
  title: 'Сегодня уведомлений нет',
  description: 'Это значит, что сегодня вы можете взять книги',
  type: 'success' as const,
  postId: '',
};

const notifications = await notificationApi.getAllNotifications({ limit: 5 });

const displayItems = computed<NotificationItem[]>(() => {
  if (notifications.data?.length) return notifications.data;
  return [empty];
});
</script>
