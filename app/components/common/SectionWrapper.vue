<!-- components/common/SectionWrapper.vue -->
<template>
  <section :class="['w-full', bgGray ? 'bg-neutral-200' : 'bg-neutral-100']">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
      <!-- Максимальная ширина и центрирование -->
      <div class="max-w-[1700px] mx-auto">
        <!-- Заголовок: иконка в фирменной плашке, надпись-подзаголовок и ссылка-«пилюля» -->
        <div
          v-if="title || $slots.header"
          class="flex items-center justify-between gap-3 sm:gap-4 mb-6 md:mb-8"
        >
          <div
            v-if="title"
            class="flex items-center gap-3 md:gap-4 min-w-0"
          >
            <span
              v-if="icon"
              class="flex size-11 md:size-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#157486] to-[#0d4954] text-white shadow-[0_6px_16px_rgb(13_73_84/0.25)]"
              aria-hidden="true"
            >
              <Icon
                :name="icon"
                class="size-6 md:size-7"
              />
            </span>
            <div class="min-w-0">
              <p
                v-if="eyebrow"
                class="mb-0.5 text-[11px] md:text-xs font-bold uppercase tracking-[0.14em] text-[#157486]"
              >
                {{ eyebrow }}
              </p>
              <h2 class="text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-[#0d4954]">
                {{ title }}
              </h2>
            </div>
          </div>
          <slot name="header" />

          <NuxtLink
            v-if="link"
            :to="link"
            class="group inline-flex items-center gap-2 shrink-0 rounded-full bg-white p-1.5 sm:pl-4 text-sm font-bold text-[#0d4954] shadow-sm ring-1 ring-[#0d4954]/10 transition-colors hover:bg-[#0d4954] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d4954]"
          >
            <!-- На телефоне — только кнопка со стрелкой, подпись остаётся для скринридеров -->
            <span class="sr-only sm:not-sr-only">{{ linkLabel || 'Смотреть всё' }}</span>
            <span class="flex size-8 sm:size-7 items-center justify-center rounded-full bg-[#eef5f6] text-[#0d4954] transition-transform group-hover:translate-x-0.5">
              <Icon
                name="i-heroicons-arrow-right-20-solid"
                class="size-4"
              />
            </span>
          </NuxtLink>
        </div>

        <!-- Контент -->
        <div :class="contentClass">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  bgGray?: boolean;
  title?: string;
  /** Короткая надпись капсом над заголовком */
  eyebrow?: string;
  /** Иконка в плашке слева от заголовка */
  icon?: string;
  link?: string;
  linkLabel?: string;
  contentClass?: string;
}

withDefaults(defineProps<Props>(), {
  contentClass: '',
});
</script>
