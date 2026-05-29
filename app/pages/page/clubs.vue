<script setup lang="ts">
import { useClubApi } from '~~/services/api/club.api';

const clubApi = useClubApi();

const { data: clubs } = await clubApi.getAllClubs({
  limit: 20,
  include: 'preview',
});
</script>

<template>
  <CommonContentContainer>
    <header class="mb-6 md:mb-8 pt-4 md:pt-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
        Клубы и творческие объединения
      </h1>
      <p class="text-gray-600 leading-relaxed text-sm md:text-base">
        Друзья, наша библиотека — это большое творческое пространство. На базе
        Новосибирской областной молодежной библиотеки осуществляют свою
        деятельность молодежные творческие и образовательные объединения.
      </p>
    </header>

    <div
      class="bg-gray-50 rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-200"
    >
      <p class="text-gray-700 leading-relaxed text-sm md:text-base mb-3">
        Если вы молоды, полны энергии и идей, то сможете найти у нас возможность
        для их реализации. Если вы видите в себе силы для создания собственного
        клуба, то мы всегда с радостью рассмотрим вашу идею. Все наши клубы —
        это активные участники наших совместных творческих мероприятий, и мы
        даем всем возможность для реализации своего потенциала.
      </p>
      <div
        class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-2"
      >
        <div class="flex items-center gap-2">
          <Icon name="lucide:phone" class="w-4 h-4 text-gray-500" />
          <span class="text-sm font-medium text-gray-700"
            >По всем вопросам:</span
          >
        </div>
        <a
          href="tel:210-11-08"
          class="text-indigo-600 hover:text-indigo-700 text-sm md:text-base transition-colors"
        >
          Центр поддержки культурных инициатив молодежи: 210-11-08
        </a>
      </div>
    </div>

    <section class="tiptap space-y-4 md:space-y-5">
      <article
        class="relative overflow-hidden flex flex-col gap-3 p-4 md:p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        v-for="item in clubs"
        :key="item.id"
      >
        <img
          class="gradient absolute right-0 bottom-0 w-1/3 m-0! pointer-events-none opacity-60"
          :src="item.preview.path"
          alt=""
        />

        <div class="relative z-10">
          <h2
            class="text-xl md:text-2xl font-semibold text-gray-900 mb-2 pr-16"
          >
            {{ item.name }}
          </h2>
          <div
            class="italic text-xs md:text-sm text-gray-600 ml-3 border-l-2 border-gray-300 pl-3"
          >
            {{ item.description }}
          </div>
        </div>

        <div class="relative z-10 space-y-2 text-sm md:text-base">
          <div class="flex items-start gap-2">
            <Icon
              name="lucide:users"
              class="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"
            />
            <div class="flex-1">
              <span class="font-medium text-gray-900">Участники:</span>
              <span class="text-gray-600 ml-1">{{ item.member }}</span>
            </div>
          </div>

          <div class="flex items-start gap-2">
            <Icon
              name="lucide:clock"
              class="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"
            />
            <div class="flex-1">
              <span class="font-medium text-gray-900">Время работы:</span>
              <span class="text-gray-600 ml-1">{{ item.worktime }}</span>
            </div>
          </div>

          <div class="flex items-start gap-2">
            <Icon
              name="lucide:target"
              class="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"
            />
            <div class="flex-1">
              <span class="font-medium text-gray-900">Направления:</span>
              <ul class="list-disc m-4!">
                <li
                  v-for="dir in item.workDirection"
                  class=""
                >
                  {{ dir }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </article>
    </section>
  </CommonContentContainer>
</template>

<style scoped>
.gradient {
  -webkit-mask-image: -webkit-gradient(
    330deg,
    rgba(0, 0, 0, 0.66),
    rgba(0, 0, 0, 0.3) 30%,
    rgba(0, 0, 0, 0) 40%
  );
  mask-image: linear-gradient(
    326deg,
    rgba(0, 0, 0, 0.66),
    rgba(0, 0, 0, 0.3) 30%,
    rgba(0, 0, 0, 0) 50%
  );
}
</style>
