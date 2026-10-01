<!-- Баннер «Госуслуги. Решаем вместе» — в фирменных цветах баннера платформы обратной связи,
     но своей вёрсткой (официальный виджет-баннер ломался и тянул ~250 строк стилей).
     Скрипт Госуслуг вешает открытие формы на элемент с id="js-show-iframe-wrapper" — он на кнопке. -->
<script lang="ts" setup>
/** Скрипт виджета Госуслуг нужен только этому баннеру — грузим его асинхронно здесь, а не глобально */
const GOSUSLUGI_SCRIPT = 'https://pos.gosuslugi.ru/bin/script.min.js';
const GOSUSLUGI_FORM = 'https://pos.gosuslugi.ru/form';
const GOSUSLUGI_LOGO
  = 'https://pos.gosuslugi.ru/bin/banner-fluid/gosuslugi-logo-blue.svg';
const GOSUSLUGI_OPA_ID = 348893;
const RUSTORE_URL = 'https://apps.rustore.ru/app/ru.gosuslugi.pos';

const ready = ref(false);
/** Если логотип с сервера Госуслуг не загрузился — показываем текстовый вариант */
const logoFailed = ref(false);

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
    class="gos-banner grid h-full overflow-hidden rounded-2xl shadow-sm sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]"
  >
    <!-- Текст и кнопки на фирменном голубом -->
    <div
      class="order-2 sm:order-1 flex flex-col justify-center gap-5 p-6 sm:p-8"
    >
      <div>
        <p class="text-2xl sm:text-3xl font-bold leading-tight text-[#0b1f33]">
          Есть вопрос?
        </p>
        <p class="mt-1 text-base sm:text-lg text-[#0b1f33]">
          Напишите нам — ответим через Госуслуги
        </p>
      </div>

      <div class="flex flex-col gap-2.5 w-full max-w-60">
        <button
          id="js-show-iframe-wrapper"
          type="button"
          class="h-12 rounded-lg bg-white text-[#0b1f33] text-base font-medium shadow-sm transition-colors hover:bg-[#e4ecfd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-70"
          :disabled="!ready"
        >
          Написать
        </button>
        <a
          :href="RUSTORE_URL"
          target="_blank"
          rel="noopener"
          class="block overflow-hidden rounded-lg bg-white shadow-sm transition-opacity hover:opacity-90"
          aria-label="Скачать приложение «Госуслуги. Решаем вместе» в RuStore"
        >
          <img
            src="/rustore.png"
            alt=""
            width="240"
            height="48"
            class="h-12 w-full object-contain p-1.5"
            loading="lazy"
          >
        </a>
      </div>
    </div>

    <!-- Иллюстрация и логотип на светлой панели, как в оригинальном баннере -->
    <div
      class="gos-banner__decor relative order-1 sm:order-2 min-h-40 sm:min-h-full"
    >
      <div
        class="absolute left-0 top-0 z-10 rounded-br-xl bg-white px-3.5 pt-3 pb-2.5 shadow-sm"
      >
        <img
          v-if="!logoFailed"
          :src="GOSUSLUGI_LOGO"
          alt="Госуслуги"
          width="78"
          height="20"
          class="block w-[72px] sm:w-[78px]"
          loading="lazy"
          @error="logoFailed = true"
        >
        <span
          v-else
          class="block text-lg font-bold leading-none tracking-tight"
        ><span class="text-[#0d4cd3]">гос</span><span class="text-[#ee3f58]">услуги</span></span>
        <span
          class="mt-1 block text-[13px] font-bold leading-none text-[#005ca9]"
        >Решаем вместе</span>
      </div>

      <!-- Обращения-«пузыри» в цветах Госуслуг -->
      <svg
        class="absolute inset-0 m-auto h-[78%] w-[86%] translate-y-[6%]"
        viewBox="0 0 240 180"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="196"
          cy="42"
          r="30"
          fill="#50b3ff"
          opacity=".18"
        />
        <circle
          cx="34"
          cy="150"
          r="20"
          fill="#ee3f58"
          opacity=".12"
        />
        <!-- Большой пузырь -->
        <path
          d="M40 48a16 16 0 0 1 16-16h96a16 16 0 0 1 16 16v52a16 16 0 0 1-16 16H86l-24 20v-20h-6a16 16 0 0 1-16-16V48Z"
          fill="#0d4cd3"
        />
        <circle
          cx="78"
          cy="74"
          r="7"
          fill="#fff"
        />
        <circle
          cx="104"
          cy="74"
          r="7"
          fill="#fff"
        />
        <circle
          cx="130"
          cy="74"
          r="7"
          fill="#fff"
        />
        <!-- Ответ -->
        <path
          d="M132 108a14 14 0 0 1 14-14h58a14 14 0 0 1 14 14v34a14 14 0 0 1-14 14h-4v16l-20-16h-34a14 14 0 0 1-14-14v-34Z"
          fill="#fff"
        />
        <path
          d="m160 126 10 10 20-20"
          stroke="#ee3f58"
          stroke-width="7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </article>
</template>

<style scoped>
/* Фирменные цвета баннера платформы обратной связи Госуслуг */
.gos-banner {
  background: linear-gradient(135deg, #50b3ff 0%, #38bafe 45%, #4aa3f0 100%);
}

.gos-banner__decor {
  background: #f8efec;
}
</style>
