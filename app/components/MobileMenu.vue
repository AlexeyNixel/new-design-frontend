<template>
  <Teleport to="body">
    <Transition name="menu">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-40 lg:hidden"
        @click.self="close"
      >
        <!-- Оверлей -->
        <div class="absolute inset-0 bg-black/50" @click="close" />

        <!-- Меню -->
        <div
          class="absolute top-0 right-0 bottom-0 w-80 max-w-[85%] bg-white shadow-xl"
        >
          <div class="flex flex-col h-full">
            <!-- Шапка меню -->
            <div class="flex items-center justify-between p-4 border-b">
              <span class="font-bold text-lg">Меню</span>
              <button
                @click="close"
                class="p-2 rounded-lg hover:bg-neutral-100"
              >
                <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
              </button>
            </div>

            <!-- Навигация -->
            <nav class="flex-1 p-4 overflow-y-auto">
              <div class="flex flex-col gap-2">
                <NuxtLink
                  v-for="item in menuItems"
                  :key="item.path"
                  :to="item.path"
                  class="px-4 py-3 rounded-lg hover:bg-neutral-100 font-medium"
                  @click="close"
                >
                  {{ item.name }}
                </NuxtLink>
              </div>
            </nav>

            <!-- Поиск в меню -->
            <div class="p-4 border-t">
              <CatalogSearch placeholder="Поиск..." class="w-full" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const close = () => {
  emit('update:modelValue', false);
};

const menuItems = [
  { name: 'Главная', path: '/' },
  { name: 'Игры', path: '/games' },
  { name: 'Книги', path: '/books' },
  { name: 'События', path: '/events' },
  { name: 'Новости', path: '/news' },
];

// Блокируем скролл body при открытом меню
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
);
</script>
