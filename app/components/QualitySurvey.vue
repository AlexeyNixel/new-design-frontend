<!-- Баннер «Уважаемые посетители!» — опрос Минкультуры о качестве услуг.
     Тот же плакат (красный заголовок, книги, QR), но собран вёрсткой: текст чёткий,
     а весь баннер — ссылка на опрос, как и раньше. -->
<template>
  <NuxtLink
    :to="SURVEY_URL"
    target="_blank"
    class="survey group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-sm sm:p-8"
    aria-label="Оценить работу библиотеки — опрос Министерства культуры (откроется в новой вкладке)"
  >
    <span class="absolute right-5 top-4 text-xl sm:text-2xl text-gray-900">18+</span>

    <h3
      class="survey__title pr-12 text-[26px] sm:text-[34px] font-extrabold uppercase leading-[1.05]"
    >
      Уважаемые<br>посетители!
    </h3>

    <div class="mt-4 flex flex-1 gap-5">
      <div class="flex min-w-0 flex-1 flex-col">
        <p class="text-sm sm:text-base text-gray-800 max-w-sm">
          Просим вас оценить работу нашей организации, пройдя по QR-коду
          или по ссылке.
        </p>

        <span
          class="survey__button mt-4 inline-flex w-max items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          Пройти опрос
          <Icon
            name="i-heroicons-arrow-right-20-solid"
            class="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </span>

        <img
          src="/books-illustration.png"
          alt=""
          width="531"
          height="113"
          class="mt-auto pt-5 w-full max-w-[340px]"
          loading="lazy"
        >
      </div>

      <!-- QR — удобно, если сайт открыт на компьютере -->
      <img
        src="/qr-ocenka-kachestva.png"
        alt="QR-код опроса о качестве услуг"
        width="226"
        height="225"
        class="hidden self-end sm:block size-32 lg:size-36 shrink-0 [image-rendering:pixelated]"
        loading="lazy"
      >
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const SURVEY_URL = 'https://forms.mkrf.ru/e/2579/xTPLeBU7/?ap_orgcode=225601';
</script>

<style scoped>
/* Красный — из оригинального плаката */
.survey {
  --survey-red: #e43425;
  border: 1px solid var(--color-gray-100);
  transition: box-shadow 0.2s ease;
}

.survey:hover {
  box-shadow: 0 10px 30px -12px rgb(228 52 37 / 0.35);
}

.survey__title {
  color: var(--survey-red);
  letter-spacing: 0.01em;
}

.survey__button {
  background: var(--survey-red);
}

.survey:hover .survey__button {
  background: #c9281b;
}
</style>
