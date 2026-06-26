<template>
  <Teleport to="body">
    <Transition name="menu">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-40 lg:hidden"
        @click.self="close"
      >
        <div
          class="absolute inset-0 bg-black/50"
          @click="close"
        />

        <div class="absolute top-0 right-0 bottom-0 w-80 max-w-[85%] bg-white shadow-xl flex flex-col">
          <!-- Шапка шторки -->
          <div class="flex items-center justify-between px-4 py-3 border-b">
            <span class="font-bold text-lg text-gray-900">Меню</span>
            <button
              class="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              @click="close"
            >
              <Icon
                name="heroicons:x-mark-20-solid"
                class="w-5 h-5 text-gray-600"
              />
            </button>
          </div>

          <!-- Навигация -->
          <nav class="flex-1 overflow-y-auto">
            <div class="p-3 space-y-0.5">
              <template
                v-for="item in items"
                :key="item.id"
              >
                <div
                  v-if="item.type === 'separator'"
                  class="border-t border-gray-100 my-2"
                />

                <NuxtLink
                  v-else-if="!item.children?.length"
                  :to="item.to"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary font-medium text-gray-800 transition-colors"
                  @click="close"
                >
                  <Icon
                    v-if="item.icon"
                    :name="item.icon"
                    class="w-4 h-4 shrink-0 text-gray-400"
                  />
                  <span>{{ item.title }}</span>
                </NuxtLink>

                <div
                  v-else
                  class="space-y-0.5"
                >
                  <button
                    class="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-100 font-medium text-gray-800 transition-colors"
                    @click="toggleItem(item.id)"
                  >
                    <div class="flex items-center gap-3">
                      <Icon
                        v-if="item.icon"
                        :name="item.icon"
                        class="w-4 h-4 shrink-0 text-gray-400"
                      />
                      <span>{{ item.title }}</span>
                    </div>
                    <Icon
                      name="i-heroicons-chevron-down-16-solid"
                      class="w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200"
                      :class="{ 'rotate-180': openItems.has(item.id) }"
                    />
                  </button>

                  <div
                    v-if="openItems.has(item.id)"
                    class="ml-4 border-l-2 border-primary/20 pl-3 space-y-0.5 pb-1"
                  >
                    <template
                      v-for="child in item.children"
                      :key="child.id"
                    >
                      <div
                        v-if="child.type === 'separator'"
                        class="border-t border-gray-100 my-1"
                      />
                      <NuxtLink
                        v-else
                        :to="child.to"
                        :target="child.target"
                        class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary text-sm text-gray-700 transition-colors"
                        @click="close"
                      >
                        <Icon
                          v-if="child.icon"
                          :name="child.icon"
                          class="w-3.5 h-3.5 shrink-0 text-gray-400"
                        />
                        <span>{{ child.title }}</span>
                      </NuxtLink>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </nav>

          <!-- Контакты -->
          <div class="p-4 border-t bg-gray-50 space-y-2">
            <a
              href="tel:+73832101053"
              class="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-primary/5 transition-colors shadow-sm"
            >
              <div class="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Icon
                  name="ic:outline-phone"
                  class="w-4 h-4 text-primary"
                />
              </div>
              <div>
                <p class="text-xs text-gray-500">Позвоните нам</p>
                <p class="text-sm font-bold text-gray-900">+7 (383) 210-10-53</p>
              </div>
            </a>
            <a
              href="mailto:noub@nso.ru"
              class="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-primary/5 transition-colors shadow-sm"
            >
              <div class="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <Icon
                  name="material-symbols:mail-outline"
                  class="w-4 h-4 text-gray-600"
                />
              </div>
              <div>
                <p class="text-xs text-gray-500">Напишите нам</p>
                <p class="text-sm font-bold text-gray-900">noub@nso.ru</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface NavigationItem {
  id: string | number;
  title: string;
  icon?: string;
  to?: string;
  target?: string;
  type?: string;
  children?: NavigationItem[];
}

const props = defineProps<{
  modelValue: boolean;
  items: NavigationItem[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const close = () => {
  emit('update:modelValue', false);
};

const openItems = ref<Set<string | number>>(new Set());

const toggleItem = (id: string | number) => {
  if (openItems.value.has(id)) {
    openItems.value.delete(id);
  }
  else {
    openItems.value.add(id);
  }
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    else {
      document.body.style.overflow = '';
      openItems.value.clear();
    }
  },
);
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.25s ease;
}

.menu-enter-active .absolute.top-0,
.menu-leave-active .absolute.top-0 {
  transition: transform 0.25s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}

.menu-enter-from .absolute.top-0,
.menu-leave-to .absolute.top-0 {
  transform: translateX(100%);
}
</style>
