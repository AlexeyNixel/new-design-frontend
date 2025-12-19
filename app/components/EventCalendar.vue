<template>
  <client-only>
    <UCalendar />
  </client-only>
</template>

<script lang="ts" setup>
import { useEventApi } from '~~/services/api/eventService';

const eventApi = useEventApi();
// await eventApi.getAllEvents();
</script>
