<!-- Карточка «Есть вопрос?» — платформа обратной связи Госуслуг («Решаем вместе»).
     Скрипт Госуслуг вешает открытие формы на элемент с id="js-show-iframe-wrapper",
     поэтому этот id стоит на кнопке «Написать», а оформление — своё, в стиле сайта. -->
<script lang="ts" setup>
/** Скрипт виджета Госуслуг нужен только этой карточке — грузим его асинхронно здесь, а не глобально */
const GOSUSLUGI_SCRIPT = 'https://pos.gosuslugi.ru/bin/script.min.js';
const GOSUSLUGI_FORM = 'https://pos.gosuslugi.ru/form';
const GOSUSLUGI_OPA_ID = 348893;
const RUSTORE_URL = 'https://apps.rustore.ru/app/ru.gosuslugi.pos';

const ready = ref(false);

const loadGosuslugiScript = () =>
  new Promise<void>((resolve, reject) => {
    if ('Widget' in window) return resolve();

    const script = document.createElement('script');
    script.src = GOSUSLUGI_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Не удалось загрузить виджет Госуслуг'));
    document.body.appendChild(script);
  });

// Окно виджета закрывается только изнутри формы — добавляем закрытие по клику на фон и Esc
const closeWidget = () => {
  document.getElementById('js-iframe-wrapper')?.remove();
  document.getElementById('js-iframe-overlay')?.remove();
};

const onDocumentClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement | null)?.id === 'js-iframe-overlay')
    closeWidget();
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeWidget();
};

onMounted(async () => {
  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onKeydown);

  try {
    await loadGosuslugiScript();
    // @ts-expect-error Widget добавляет внешний скрипт Госуслуг
    Widget(GOSUSLUGI_FORM, GOSUSLUGI_OPA_ID);
    ready.value = true;
  }
  catch (error) {
    console.error(error);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
  document.removeEventListener('keydown', onKeydown);
  closeWidget();
});
</script>

<template>
  <article
    class="relative flex flex-col h-full overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8"
  >
    <!-- Декор в цветах Госуслуг -->
    <div
      class="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-[#38bafe]/15 blur-2xl"
      aria-hidden="true"
    />

    <div class="relative flex items-center gap-3 mb-5">
      <img
        src="https://pos.gosuslugi.ru/bin/banner-fluid/gosuslugi-logo-blue.svg"
        alt="Госуслуги"
        width="96"
        height="24"
        class="h-6 w-auto"
        loading="lazy"
      >
      <span class="text-xs font-semibold text-[#0d4cd3] bg-[#0d4cd3]/10 rounded-full px-2.5 py-1">
        Решаем вместе
      </span>
    </div>

    <h3 class="relative text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
      Есть вопрос или предложение?
    </h3>
    <p class="relative mt-2 text-sm sm:text-base text-gray-600 max-w-md">
      Напишите нам через платформу обратной связи Госуслуг — обращение
      зарегистрируют и ответят в установленный срок.
    </p>

    <div class="relative mt-6 sm:mt-auto sm:pt-6 flex flex-wrap items-center gap-3">
      <button
        id="js-show-iframe-wrapper"
        type="button"
        class="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#0d4cd3] text-white font-semibold text-sm shadow-sm hover:bg-[#1d5deb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d4cd3] transition-colors disabled:opacity-60"
        :disabled="!ready"
      >
        <Icon
          name="i-heroicons-chat-bubble-left-right"
          class="size-5"
        />
        Написать обращение
      </button>

      <a
        :href="RUSTORE_URL"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-2 h-11 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#0d4cd3] hover:text-[#0d4cd3] transition-colors"
      >
        <Icon
          name="i-heroicons-device-phone-mobile"
          class="size-5"
        />
        Приложение в RuStore
      </a>
    </div>
  </article>
</template>
