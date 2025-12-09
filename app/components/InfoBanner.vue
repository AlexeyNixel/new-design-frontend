<template>
  <div>
    <UCarousel
      v-if="notifications"
      arrows
      loop
      :ui="ui"
      :items="notifications"
      v-slot="{ item }"
      class="h-full"
    >
      <div class="flex flex-col justify-between h-full">
        <div>
          <h3 class="font-bold text-xl mb-2">{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
        <NuxtLink>Подробнее</NuxtLink>
      </div>
    </UCarousel>
    <div v-else>
      <div class="flex flex-col justify-between h-full">
        <div>
          <h3 class="font-bold text-xl mb-2">Новых уведомлений нет</h3>
          <p>Тут может появиться важная информация</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationApi } from '~~/services/api/notification.api';

const notificationApi = useNotificationApi();

const { data: notifications } = await notificationApi.getAllNotifications();

const ui = {
  viewport: 'h-full rounded',
  item: 'h-full',
  container: 'h-full',
  arrows: 'absolute right-15 bottom-5',
  prev: ' rounded  bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  next: ' rounded  bg-primary text-white border-0 ring-0 hover:bg-primary-100 hover:cursor-pointer',
  dots: 'absolute bottom-5',
  dot: 'w-6 h-1',
};
</script>

<style scoped></style>
