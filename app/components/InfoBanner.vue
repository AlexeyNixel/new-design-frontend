<template>
  <div class="h-full bg-white rounded-xl shadow">
    <header
      class="flex items-center gap-3 rounded-t-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 text-white"
    >
      <Icon class="text-xl" name="i-heroicons-bell-alert" />
      <h3 class="!m-0">Важные уведомления</h3>
    </header>
    <div class="p-4 flex flex-col gap-4">
      <div class="p-2 flex items-center gap-3 bg-warning-400/10 rounded-lg">
        <div class="w-10 h-10 flex items-center justify-center">
          <Icon
            class="w-6 h-6 text-warning-600"
            name="qlementine-icons:tool-16"
          />
        </div>
        <div>
          <div>Технические работы</div>
          <div class="text-sm text-neutral-500">Завтра с 10:00 до 12:00</div>
        </div>
      </div>
      <div class="p-2 flex items-center gap-3 bg-error-400/10 rounded-lg">
        <div class="w-10 h-10 flex items-center justify-center">
          <Icon
            class="w-6 h-6 text-error-600"
            name="i-heroicons-exclamation-triangle"
          />
        </div>
        <div>
          <div>Библиотека не работает</div>
          <div class="text-sm text-neutral-500">Завтра весь день</div>
        </div>
      </div>
      <div class="p-2 flex items-center gap-3 bg-success/10 rounded-lg">
        <div class="w-10 h-10 flex items-center justify-center">
          <Icon class="w-6 h-6 text-success" name="i-heroicons-calendar" />
        </div>
        <div>
          <div>Турнир по настолкам</div>
          <div class="text-sm text-neutral-500">Регистрация открыта</div>
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
