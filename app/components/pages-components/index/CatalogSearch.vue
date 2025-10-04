<template>
  <UInput
    size="xl"
    placeholder="Поиск по электронному каталогу"
    v-model="searchText"
    @keydown.enter="handleSearchBook()"
    variant="none"
    class="shadow rounded-xl bg-white"
  >
    <template #trailing>
      <UButton variant="link" icon="i-heroicons-outline-search" />
    </template>
  </UInput>
</template>

<script setup lang="ts">
const ui = {
  base: '',
};

const searchText = ref<string>('');

const handleSearchBook = () => {
  navigateTo(
    `http://opac.infomania.ru/cgi-bin/koha/opac-search.pl?idx=&q=${searchText.value}&weight_search=1`,
    { external: true, open: { target: '_blank' } }
  );
};
</script>

<style scoped></style>
