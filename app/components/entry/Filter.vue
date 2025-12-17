<template>
  <div class="news-filters">
    <div class="p-4 w-80">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold text-lg">Фильтры</h3>
        <UButton
          color="neutral"
          variant="ghost"
          label="Сбросить"
          size="xs"
          @click="handleResetFilters"
        />
      </div>

      <div class="mb-4">
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Отдел
        </label>
        <USelect
          class="w-full"
          placeholder="Отдел"
          :items="departments"
          label-key="title"
          value-key="id"
          v-model="localFilters.department"
        />
      </div>

      <!--      <div class="mb-4">-->
      <!--        <label-->
      <!--          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"-->
      <!--        >-->
      <!--          Год публикации-->
      <!--        </label>-->
      <!--        <USelect-->
      <!--          v-model="localFilters.year"-->
      <!--          :items="yearOptions"-->
      <!--          placeholder="Все годы"-->
      <!--          class="w-full"-->
      <!--        />-->
      <!--      </div>-->

      <!--      <div class="mb-4">-->
      <!--        <label-->
      <!--          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"-->
      <!--        >-->
      <!--          Сортировка-->
      <!--        </label>-->
      <!--        <URadioGroup :items="sortOptions" v-model="localFilters.sort" />-->
      <!--      </div>-->

      <!--      <div-->
      <!--        class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700"-->
      <!--      >-->
      <!--        <UButton-->
      <!--          label="Применить"-->
      <!--          color="primary"-->
      <!--          class="flex-1"-->
      <!--          @click="handleApplyFilters"-->
      <!--        />-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDepartmentApi } from '~~/services/api/departmentService';
import type { SelectItem } from '#ui/components/Select.vue';

export interface Filters {
  sort: string | undefined;
  department: string | undefined;
  year: string | undefined;
}

interface Props {
  filters: Filters;
}

const props = defineProps<Props>();

const localFilters = ref<Filters>({ ...props.filters });
//
// const emit = defineEmits<{
//   'update:filters': [filters: Filters];
// }>();
//
const departmentApi = useDepartmentApi();
const { data: departments } = await departmentApi.getAllDepartments();
const departmentOptions = ref<SelectItem[]>([]);

//
// const sortOptions = ref<SelectItem[]>([
//   {
//     label: 'Сначала новые',
//     value: '-createdAt',
//   },
//   {
//     label: 'Сначала старые',
//     value: 'createdAt',
//   },
// ]);
//
// const yearOptions = computed(() => {
//   const currentYear = new Date().getFullYear();
//   return Array.from({ length: currentYear - 2009 }, (_, i) => {
//     const year = currentYear - i;
//     return { label: year.toString(), value: year.toString() };
//   });
// });
//
// departments.forEach((department) => {
//   departmentOptions.value.push({
//     label: department.title,
//     value: department.slug || department.id,
//   });
// });
//
const handleResetFilters = () => {
  localFilters.value.department = undefined;
  localFilters.value.year = undefined;
  localFilters.value.sort = '-createdAt';
};
//
// const handleApplyFilters = () => {
//   emit('update:filters', { ...localFilters.value });
// };
</script>

<style scoped></style>
