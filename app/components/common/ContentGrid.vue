<template>
  <div class="grid grid-cols-2"></div>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: Array<object>;
}>();

console.log(props.items);
</script>

<style scoped></style>
