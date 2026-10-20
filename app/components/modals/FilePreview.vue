<script setup lang="ts">
// Модальный просмотр документа по ссылке. Открывается плагином file-preview.client.ts.
import type { FilePreviewKind } from '~/utils/filePreview';

const props = defineProps<{
  url: string;
  title: string;
  kind: FilePreviewKind;
}>();

const ICONS: Record<FilePreviewKind, string> = {
  pdf: 'i-heroicons-document-text',
  office: 'i-heroicons-document',
  text: 'i-heroicons-document-text',
};

const { public: { siteUrl } } = useRuntimeConfig();

const failed = ref(false);

// Встроенный просмотрщик PDF есть в десктопных браузерах; на Android его нет —
// там iframe просто скачал бы файл, поэтому рисуем страницы сами (pdf.js)
const nativePdf = ref(
  navigator.pdfViewerEnabled !== false && window.matchMedia('(pointer: fine)').matches,
);

// Word/Excel/PowerPoint — через просмотрщик Microsoft: ему нужен публичный адрес файла,
// поэтому берём адрес прода (в dev файлы те же — общее хранилище)
const officeSrc = computed(
  () => `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(new URL(props.url, siteUrl).href)}`,
);

// Старые txt бывают в windows-1251: если UTF-8 не читается — пробуем её
const text = ref<string | null>(null);
if (props.kind === 'text') {
  $fetch<ArrayBuffer>(props.url, { responseType: 'arrayBuffer' })
    .then((buffer) => {
      try {
        text.value = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
      }
      catch {
        text.value = new TextDecoder('windows-1251').decode(buffer);
      }
    })
    .catch(() => {
      failed.value = true;
    });
}
</script>

<template>
  <UModal
    :title="title"
    description="Просмотр документа"
    :ui="{
      content: 'max-w-none w-full h-dvh max-h-dvh rounded-none sm:w-[calc(100vw-4rem)] sm:max-w-6xl sm:h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-4rem)] sm:rounded-xl',
    }"
  >
    <template #content="{ close }">
      <div class="flex h-full min-h-0 flex-col">
        <header class="flex shrink-0 items-center gap-3 border-b border-gray-200 px-3 py-2 sm:px-5 sm:py-3">
          <Icon
            :name="ICONS[kind]"
            class="hidden h-6 w-6 shrink-0 text-primary-700 sm:block"
          />
          <h2 class="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900 sm:text-base">
            {{ title }}
          </h2>
          <UButton
            :to="url"
            external
            target="_blank"
            data-no-preview
            icon="i-heroicons-arrow-top-right-on-square"
            color="neutral"
            variant="ghost"
            aria-label="Открыть в новой вкладке"
            title="Открыть в новой вкладке"
          />
          <UButton
            :href="url"
            download
            icon="i-heroicons-arrow-down-tray"
            color="primary"
            variant="soft"
            aria-label="Скачать"
          >
            <span class="hidden sm:inline">Скачать</span>
          </UButton>
          <UButton
            icon="i-heroicons-x-mark"
            color="neutral"
            variant="ghost"
            aria-label="Закрыть"
            @click="close"
          />
        </header>

        <div class="relative min-h-0 flex-1">
          <div
            v-if="failed"
            class="flex h-full flex-col items-center justify-center gap-4 p-6 text-center text-gray-600"
          >
            <Icon
              name="i-heroicons-exclamation-triangle"
              class="h-10 w-10 text-gray-400"
            />
            <p>Не удалось показать документ. Его можно скачать и открыть на устройстве.</p>
            <UButton
              :href="url"
              download
              icon="i-heroicons-arrow-down-tray"
            >
              Скачать файл
            </UButton>
          </div>

          <template v-else-if="kind === 'pdf'">
            <iframe
              v-if="nativePdf"
              :src="`${url}#navpanes=0`"
              :title="title"
              class="h-full w-full border-0"
            />
            <CommonPdfViewer
              v-else
              :url="url"
              @error="failed = true"
            />
          </template>

          <iframe
            v-else-if="kind === 'office'"
            :src="officeSrc"
            :title="title"
            class="h-full w-full border-0"
          />

          <div
            v-else
            class="h-full overflow-auto bg-gray-50 p-4 sm:p-6"
          >
            <pre
              v-if="text !== null"
              class="whitespace-pre-wrap break-words font-mono text-sm text-gray-800"
            >{{ text }}</pre>
            <div
              v-else
              class="flex h-full items-center justify-center text-gray-500"
            >
              Загружаем документ…
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
