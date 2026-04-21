<template>
  <div class="h-full bg-white rounded-xl shadow">
    <header
      class="flex items-center gap-3 rounded-t-xl bg-gradient-to-r from-amber-500 to-amber-400 p-2 xl:px-4 xl:py-3 text-white"
    >
      <Icon class="text-xl" name="i-heroicons-bell-alert" />
      <div class="font-bold text-lg 3xl:text-2xl">Важные уведомления</div>
    </header>
    <!--    <div class="p-4 flex flex-col gap-4 3xl:h-[170px]">-->
    <!--      <template v-if="notifications.data">-->
    <!--
<!--      </template>-->
    <!--      <template v-else>-->
    <!--        <div-->
    <!--          class="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-4"-->
    <!--        >-->
    <!--          <div-->
    <!--            class="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mb-4"-->
    <!--          >-->
    <!--            <Icon-->
    <!--              name="i-heroicons-bell-snooze"-->
    <!--              class="w-6 h-6 text-neutral-400"-->
    <!--            />-->
    <!--          </div>-->
    <!--          <div>-->
    <!--            <h4 class="text-lg font-medium text-neutral-700 mb-2">-->
    <!--              Новых уведомлений нет-->
    <!--            </h4>-->
    <!--            <p class="text-sm text-neutral-500 max-w-sm mx-auto">-->
    <!--              Пока всё тихо и спокойно. Загляните позже — здесь появятся важные-->
    <!--              новости и события библиотеки.-->
    <!--            </p>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </div>-->
    <!--    3xl:h-[117px]-->
    <UCarousel
      v-slot="{ item }"
      orientation="vertical"
      :items="notifications.data"
      :ui="{
        container: 'h-[117px] 3xl:h-[184px] w-full ',
        item: 'basis-1/3  w-full',
      }"
      class="p-3"
    >
      <NuxtLink
        class="p-2 flex rounded-lg w-full"
        :class="`bg-${item.type}/10`"
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
            <div class="flex items-center text-sm" v-if="item.postId">
              <div>Подробнее</div>
              <Icon name="mingcute:arrow-right-line"></Icon>
            </div>
          </div>
        </div>
      </NuxtLink>
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
import { useNotificationApi } from '~~/services/api/notification.api';

const notificationApi = useNotificationApi();

const notifications = await notificationApi.getAllNotifications({
  limit: 5,
});

const ICON_BY_TYPE = {
  success: 'i-heroicons-calendar',
  warning: 'qlementine-icons:tool-16',
  error: 'i-heroicons-exclamation-triangle',
};
</script>

<style scoped></style>
