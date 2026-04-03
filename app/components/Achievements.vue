<script setup lang="ts">
import { useAchievements } from '~~/services/api/achievment.api';

const achievementApi = useAchievements();

const achievements = await achievementApi.getAllAchievements();
</script>

<template>
  <div
    class="bg-gradient-to-r from-primary to-primary/70 p-8 rounded-xl shadow-xl"
  >
    <div class="flex justify-between mx-10">
      <div
        class="text-white text-center"
        v-for="item in achievements"
        :key="item.id"
      >
        <div class="text-4xl font-bold mb-2">{{ item.count }}</div>
        <div class="text-sm">
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
