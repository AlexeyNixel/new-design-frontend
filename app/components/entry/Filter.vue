<template>
  <div class="flex flex-col gap-5 w-80 p-4">
    <div class="flex items-center justify-between">
      <h3>Фильтры</h3>

      <UButton @click="handleResetFilters" variant="link">Очистить</UButton>
    </div>

    <USelect
      :items="departments"
      label-key="title"
      value-key="id"
      placeholder="Выберите отдел"
      v-model="localFilters.department"
    />
  </div>
</template>

<script setup lang="ts">
import { useDepartmentApi } from '~~/services/api/departmentService';

export interface Filters {
  department: string | undefined;
}

interface Props {
  filters: Filters;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:filters': [filter: Filters];
}>();

const departmentApi = useDepartmentApi();
const { data: departments } = await departmentApi.getAllDepartments();

const localFilters = reactive({ ...props.filters });

const handleResetFilters = () => {
  localFilters.department = undefined;
};

const handleApplyFilters = () => {
  emit('update:filters', { ...localFilters });
};

watch(localFilters, () => {
  handleApplyFilters();
});
</script>

<style scoped></style>
