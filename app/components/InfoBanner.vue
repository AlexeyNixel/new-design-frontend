<template>
  <div class="h-full bg-white rounded-xl shadow">
    <header
      class="flex items-center gap-3 rounded-t-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 text-white"
    >
      <Icon class="text-xl" name="i-heroicons-bell-alert" />
      <h3 class="!m-0">Важные уведомления</h3>
    </header>
    <div class="p-4 flex flex-col gap-4 h-[170px]">
      <template v-if="notifications.data">
        <NuxtLink
          v-for="item in notifications.data"
          class="p-2 flex items-center gap-3 rounded-lg"
          :class="`bg-${item.type}/10`"
          :to="item.postId ? '/entry/' + item.postId : null"
        >
          <div class="w-10 h-10 flex items-center justify-center">
            <Icon
              :class="`text-${item.type}`"
              class="w-6 h-6"
              :name="ICON_BY_TYPE[item.type]"
            />
          </div>
          <div class="w-full">
            <div>{{ item.title }}</div>
            <div class="flex justify-between">
              <div class="text-sm text-neutral-500">
                {{ item.description }}
              </div>
              <div class="flex gap-2 items-center text-sm" v-if="item.postId">
                <div>Подробнее</div>
                <Icon name="mingcute:arrow-right-line"></Icon>
              </div>
            </div>
          </div>
        </NuxtLink>
      </template>
      <template v-else>
        <div
          class="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-4"
        >
          <div
            class="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mb-4"
          >
            <Icon
              name="i-heroicons-bell-snooze"
              class="w-6 h-6 text-neutral-400"
            />
          </div>
          <div>
            <h4 class="text-lg font-medium text-neutral-700 mb-2">
              Новых уведомлений нет
            </h4>
            <p class="text-sm text-neutral-500 max-w-sm mx-auto">
              Пока всё тихо и спокойно. Загляните позже — здесь появятся важные
              новости и события библиотеки.
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationApi } from '~~/services/api/notification.api';

const notificationApi = useNotificationApi();

const notifications = await notificationApi.getAllNotifications({
  limit: 2,
});
console.log(notifications);

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

const ICON_BY_TYPE = {
  success: 'i-heroicons-calendar',
  warning: 'qlementine-icons:tool-16',
  error: 'i-heroicons-exclamation-triangle',
};
</script>

<style scoped></style>
