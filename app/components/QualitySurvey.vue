<!-- Карточка «Оцените работу библиотеки» — независимая оценка качества услуг (Минкультуры).
     Раньше была картинкой-баннером; теперь кнопка + QR-код для телефона. -->
<template>
  <article
    class="relative flex flex-col sm:flex-row gap-6 h-full overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8"
  >
    <div
      class="pointer-events-none absolute -bottom-20 -left-16 size-56 rounded-full bg-primary/10 blur-2xl"
      aria-hidden="true"
    />

    <div class="relative flex flex-col flex-1 min-w-0">
      <div class="flex items-center gap-3 mb-5">
        <span class="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
          <Icon
            name="i-heroicons-star"
            class="size-5"
          />
        </span>
        <span class="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
          Для посетителей 18+
        </span>
      </div>

      <h3 class="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
        Оцените работу библиотеки
      </h3>
      <p class="mt-2 text-sm sm:text-base text-gray-600 max-w-md">
        Ваше мнение важно не только для нас, но и для Министерства культуры РФ:
        оно учитывается при независимой оценке качества услуг.
      </p>

      <div class="mt-6 sm:mt-auto sm:pt-6">
        <UButton
          :to="SURVEY_URL"
          target="_blank"
          size="lg"
          class="rounded-xl px-5"
          icon="i-heroicons-arrow-top-right-on-square"
          trailing
          label="Пройти опрос"
        />
      </div>
    </div>

    <!-- QR — удобно, если сайт открыт на компьютере, а опрос хочется пройти с телефона -->
    <div class="relative hidden sm:flex flex-col items-center justify-center shrink-0">
      <div class="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
        <img
          src="/qr-ocenka-kachestva.png"
          alt="QR-код опроса о качестве услуг"
          width="132"
          height="132"
          class="size-32 [image-rendering:pixelated]"
          loading="lazy"
        >
      </div>
      <span class="mt-2 text-xs text-gray-500 text-center max-w-36">
        или наведите камеру телефона
      </span>
    </div>
  </article>
</template>

<script setup lang="ts">
const SURVEY_URL = 'https://forms.mkrf.ru/e/2579/xTPLeBU7/?ap_orgcode=225601';
</script>
