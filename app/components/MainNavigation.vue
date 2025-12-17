<template>
  <div class="w-full bg-primary">
    <div class="max-w-[1710px] mx-auto flex justify-between p-2">
      <div v-for="item in items" :key="item.id">
        <UDropdownMenu
          :items="item.children"
          label-key="title"
          class="bg-transparent border-0 ring-0 text-white hover:bg-primary/100"
        >
          <!--          <template #item="{ item }">-->
          <!--            <UButton-->
          <!--              variant="link"-->
          <!--              :icon="item.icon"-->
          <!--              :label="item.title"-->
          <!--              :to="item.url"-->
          <!--            ></UButton>-->
          <!--          </template>-->
          <UButton
            :label="item.title"
            color="neutral"
            variant="outline"
            :icon="item.icon"
          />
        </UDropdownMenu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavigationApi } from '~~/services/api/main-navigation.api';

interface Menu {
  id: string;
  oldId: number;
  title: string;
  isDeleted: boolean;
  menuType: string;
  menuItems: Array<any>;
}

interface MenuResponse {
  data: Menu[];
  meta: any;
}

const ui = {
  root: '[&>div]:w-full',
  label: 'text-white',
  item: '[&>button]:text-white [&>button]:font-bold',
  linkLeadingIcon: 'text-white',
};

const navigationApi = useNavigationApi();

const items = await navigationApi.getAllNavigation();
console.log(items);
</script>

<style scoped></style>
