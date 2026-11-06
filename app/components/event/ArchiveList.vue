<template>
  <ul class="divide-y divide-gray-100">
    <li
      v-for="event in events"
      :key="event.id"
      class="py-4 first:pt-0 last:pb-0"
    >
      <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <time
          :datetime="event.eventTime.toString()"
          class="shrink-0 text-sm font-semibold tabular-nums opacity-60"
        >
          {{ formatDate(event.eventTime) }}
        </time>
        <NuxtLink
          :to="`/afisha/${event.id}`"
          class="text-base font-bold leading-snug text-gray-900 underline-offset-4 hover:underline"
        >
          {{ event.title }}
        </NuxtLink>
        <span
          v-if="Number(event.age)"
          class="shrink-0 rounded-full border border-gray-300 px-2 py-0.5 text-xs font-semibold text-gray-600"
        >{{ Number(event.age) }}+</span>
      </div>

      <p
        v-if="description(event)"
        :id="descId(event)"
        class="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600"
        :class="{ 'line-clamp-2': !isOpen(event.id) }"
      >
        {{ description(event) }}
      </p>

      <button
        v-if="description(event) && description(event).length > CLAMP_CHARS"
        type="button"
        class="mt-1 text-sm font-semibold text-[#157486] underline decoration-1 underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d4954]"
        :aria-expanded="isOpen(event.id)"
        :aria-controls="descId(event)"
        @click="toggle(event.id)"
      >
        {{ isOpen(event.id) ? 'Свернуть' : 'Читать полностью' }}
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Event } from '~~/services/types/event.type';

/** Примерно две строки текста в этой колонке — длиннее показываем кнопку раскрытия */
const CLAMP_CHARS = 150;

const props = defineProps<{ events: Event[] }>();
void props;

const parseEventTime = useParseEventTime();

const formatDate = (value: Date | string) => parseEventTime(value).format('D MMMM YYYY');

/** Текст без добавленного бэкендом блока «На это событие можно купить билет …» */
const description = (event: Event) => {
  const text = stripHtml(event.content).replace(/На это событие можно купить билет[^.]*\./g, '').trim();
  return text.replace(/^Количество мест ограничено\.\s*/i, '');
};

const descId = (event: Event) => `archive-desc-${event.id}`;

const expanded = ref(new Set<string>());
const isOpen = (id: string) => expanded.value.has(id);
const toggle = (id: string) => {
  const next = new Set(expanded.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expanded.value = next;
};
</script>
