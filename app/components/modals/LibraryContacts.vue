<template>
  <div class="w-[min(92vw,380px)]">
    <div class="rounded-t-2xl bg-gradient-to-br from-primary-700 to-primary-800 px-5 pt-5 pb-4 text-white">
      <p class="text-xs font-semibold uppercase tracking-wider text-white/60">
        Связаться с нами
      </p>
      <p class="mt-1.5 text-lg font-bold leading-snug">
        Ответим на вопросы о библиотеке, книгах и мероприятиях
      </p>
    </div>

    <div class="p-3">
      <ul class="grid gap-1">
        <li
          v-for="contact in CONTACTS"
          :key="contact.href"
        >
          <a
            :href="contact.href"
            class="flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-[#eef5f6]"
          >
            <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#eef5f6] text-primary-700">
              <UIcon
                :name="contact.icon"
                class="size-5"
              />
            </span>
            <span class="min-w-0 leading-tight">
              <span class="block text-xs text-gray-500">{{ contact.label }}</span>
              <span class="block text-sm font-bold text-gray-900">{{ contact.value }}</span>
            </span>
          </a>
        </li>
      </ul>

      <div class="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
        <NuxtLink
          to="/page/struktura-biblioteki"
          class="flex items-center justify-center gap-1.5 rounded-xl bg-primary-700 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
          @click="emit('navigate')"
        >
          <UIcon
            name="i-heroicons-user-group"
            class="size-4"
          />
          Все контакты
        </NuxtLink>
        <NuxtLink
          to="/page/obratnaya-svyaz"
          class="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-100 px-3 py-2.5 text-sm font-semibold text-primary-800 transition-colors hover:bg-[#e2eef0]"
          @click="emit('navigate')"
        >
          <UIcon
            name="i-heroicons-chat-bubble-left-right"
            class="size-4"
          />
          Задать вопрос
        </NuxtLink>
      </div>

      <div class="mt-3 flex items-center justify-between gap-2 px-1">
        <NuxtLink
          to="/page/virtualnaya-spravka"
          class="text-sm font-medium text-primary-700 hover:text-primary-800 hover:underline underline-offset-4"
          @click="emit('navigate')"
        >
          Виртуальная справка
        </NuxtLink>

        <ul
          class="flex gap-1.5"
          aria-label="Мы в соцсетях"
        >
          <li
            v-for="social in SOCIALS"
            :key="social.label"
          >
            <a
              :href="social.href"
              target="_blank"
              rel="noopener"
              :title="social.label"
              :aria-label="social.label"
              class="flex size-9 items-center justify-center rounded-lg bg-neutral-100 text-gray-600 transition-colors hover:bg-[#eef5f6] hover:text-primary-800"
            >
              <UIcon
                v-if="social.icon"
                :name="social.icon"
                class="size-5"
              />
              <img
                v-else
                src="/max-dark.svg"
                alt=""
                class="size-5 brightness-0 opacity-60"
              >
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ navigate: [] }>();

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

// Номера и подписи — как на странице «Контактная информация»
const CONTACTS = [
  {
    label: 'Электронная почта',
    value: LIBRARY_INFO.email,
    href: `mailto:${LIBRARY_INFO.email}`,
    icon: 'i-heroicons-envelope',
  },
  {
    label: 'Справочно-сервисная служба',
    value: '+7 (383) 223-26-90',
    href: telHref('+7 (383) 223-26-90'),
    icon: 'i-heroicons-phone',
  },
  {
    label: 'Приёмная директора',
    value: LIBRARY_INFO.telephone,
    href: telHref(LIBRARY_INFO.telephone),
    icon: 'i-heroicons-phone',
  },
];

const SOCIALS = [
  { label: 'ВКонтакте', href: 'https://vk.ru/oub_nsk', icon: 'i-bxl-vk' },
  { label: 'Одноклассники', href: 'https://ok.ru/group/70000001168881', icon: 'bxl:ok-ru' },
  { label: 'MAX', href: 'https://max.ru/id5406132173_gos' },
];
</script>
