<script setup lang="ts">
/**
 * «Поделиться»: ВКонтакте, Telegram, Одноклассники и копирование ссылки.
 * В ссылки для соцсетей добавляется UTM-метка — в Umami видно, сколько людей
 * пришло по репостам (utm_campaign=share). Скопированная ссылка — чистая.
 * На телефоне дополнительно системное меню «Поделиться» (navigator.share).
 */
const props = withDefaults(
  defineProps<{
    title: string;
    /** Путь страницы; по умолчанию текущий */
    path?: string;
    /** Кнопки на тёмном фоне (шапки афиши, книг, подборок) */
    dark?: boolean;
  }>(),
  { path: undefined, dark: false },
);

const route = useRoute();
const toAbsolute = useAbsoluteUrl();

const pageUrl = computed(() => toAbsolute(props.path ?? route.path));

const withUtm = (source: string) =>
  `${pageUrl.value}?utm_source=${source}&utm_medium=social&utm_campaign=share`;

const networks = computed(() => {
  const title = encodeURIComponent(props.title);
  return [
    {
      label: 'ВКонтакте',
      icon: 'i-bxl-vk',
      href: `https://vk.com/share.php?url=${encodeURIComponent(withUtm('vk'))}&title=${title}`,
    },
    {
      label: 'Telegram',
      icon: 'i-ix-telegram-logo',
      href: `https://t.me/share/url?url=${encodeURIComponent(withUtm('telegram'))}&text=${title}`,
    },
    {
      label: 'Одноклассники',
      icon: 'bxl:ok-ru',
      href: `https://connect.ok.ru/offer?url=${encodeURIComponent(withUtm('ok'))}&title=${title}`,
    },
  ];
});

// Системное меню есть не во всех браузерах — проверяем только в браузере
const canNativeShare = ref(false);
onMounted(() => {
  canNativeShare.value = typeof navigator.share === 'function';
});

const nativeShare = async () => {
  try {
    await navigator.share({ title: props.title, url: withUtm('native') });
  }
  catch {
    // Посетитель закрыл меню — ничего не делаем
  }
};

const copied = ref(false);
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(pageUrl.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  }
  catch {
    useToast().add({ title: 'Не удалось скопировать — скопируйте адрес из строки браузера', color: 'error' });
  }
};

const buttonClass = computed(() =>
  props.dark
    ? 'bg-white/10 text-white ring-white/20 hover:bg-white/20 focus-visible:outline-white'
    : 'bg-white text-gray-700 ring-gray-200 hover:bg-gray-50 hover:text-[#157486] focus-visible:outline-[#157486]',
);
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <span
      class="mr-1 text-sm"
      :class="dark ? 'text-white/70' : 'text-gray-500'"
    >
      Поделиться:
    </span>

    <a
      v-for="network in networks"
      :key="network.label"
      :href="network.href"
      target="_blank"
      rel="noopener"
      :title="`Поделиться — ${network.label}`"
      :aria-label="`Поделиться — ${network.label}`"
      class="flex size-9 items-center justify-center rounded-full ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      :class="buttonClass"
    >
      <Icon
        :name="network.icon"
        class="size-5"
      />
    </a>

    <button
      type="button"
      class="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      :class="buttonClass"
      @click="copyLink"
    >
      <Icon
        :name="copied ? 'i-heroicons-check' : 'i-heroicons-link'"
        class="size-4"
      />
      {{ copied ? 'Ссылка скопирована' : 'Скопировать ссылку' }}
    </button>

    <button
      v-if="canNativeShare"
      type="button"
      class="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:hidden"
      :class="buttonClass"
      @click="nativeShare"
    >
      <Icon
        name="i-heroicons-share"
        class="size-4"
      />
      Ещё
    </button>
  </div>
</template>
