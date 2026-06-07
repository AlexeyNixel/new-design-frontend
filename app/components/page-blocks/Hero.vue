<script setup lang="ts">
import type { PageHeroBlockContacts } from '~~/services/types/page.type';

defineProps<{
  icon?: string;
  label?: string;
  title: string;
  subtitle?: string;
  contacts?: PageHeroBlockContacts;
}>();
</script>

<template>
  <div class="relative overflow-hidden bg-primary">
    <div class="absolute inset-0 bg-black opacity-20" />
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl" />
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl" />

    <div class="container mx-auto px-4 py-16 md:py-24 max-w-7xl relative">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div class="flex-1">
          <div
            v-if="label"
            class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
          >
            <UIcon
              v-if="icon"
              :name="icon"
              class="w-5 h-5 text-white"
            />
            <span class="text-white text-sm font-medium">{{ label }}</span>
          </div>
          <h1 class="text-5xl md:text-7xl font-bold text-white mb-4">
            {{ title }}
          </h1>
          <p
            v-if="subtitle"
            class="text-xl text-white/80 max-w-2xl"
          >
            {{ subtitle }}
          </p>
        </div>

        <div
          v-if="contacts"
          class="lg:w-96"
        >
          <div class="bg-white rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
            <div
              v-if="contacts.phone"
              class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100"
            >
              <div class="flex items-center justify-center bg-primary/10 rounded-full p-2">
                <UIcon
                  name="i-heroicons-phone"
                  class="w-7 h-7 text-primary"
                />
              </div>
              <div>
                <p class="text-sm text-gray-500">
                  Свяжитесь с нами
                </p>
                <a
                  :href="`tel:${contacts.phone.replace(/[^+\d]/g, '')}`"
                  class="text-xl font-semibold text-gray-900 hover:text-primary transition"
                >
                  {{ contacts.phone }}
                </a>
              </div>
            </div>

            <div class="space-y-3">
              <div
                v-if="contacts.address"
                class="flex items-center gap-3 text-gray-600"
              >
                <UIcon
                  name="i-heroicons-map-pin"
                  class="w-5 h-5 flex-shrink-0"
                />
                <span class="text-sm">{{ contacts.address }}</span>
              </div>
              <div
                v-if="contacts.email"
                class="flex items-center gap-3 text-gray-600"
              >
                <UIcon
                  name="i-heroicons-envelope"
                  class="w-5 h-5 flex-shrink-0"
                />
                <span class="text-sm">{{ contacts.email }}</span>
              </div>
              <div
                v-if="contacts.workHours"
                class="flex items-center gap-3 text-gray-600"
              >
                <UIcon
                  name="i-heroicons-clock"
                  class="w-5 h-5 flex-shrink-0"
                />
                <span class="text-sm">{{ contacts.workHours }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
