<script setup lang="ts">
// Просмотр PDF через pdf.js — для браузеров без встроенного просмотрщика (Android, iOS-webview).
// Страницы рисуются на canvas по мере прокрутки; библиотека грузится только при открытии.
import type { PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';

const props = defineProps<{ url: string }>();
const emit = defineEmits<{ error: [] }>();

const ZOOM_LEVELS = [1, 1.5, 2, 3];

const scrollRef = ref<HTMLElement | null>(null);
const pageRefs = ref<HTMLCanvasElement[]>([]);
const pages = ref<{ ratio: number }[]>([]);
const loading = ref(true);
const zoomIndex = ref(0);
const zoom = computed(() => ZOOM_LEVELS[zoomIndex.value]!);

let pdf: PDFDocumentProxy | null = null;
let observer: IntersectionObserver | null = null;
// Какой масштаб уже нарисован на каждой странице — чтобы не перерисовывать зря
const renderedZoom = new Map<number, number>();

const renderPage = async (index: number) => {
  const canvas = pageRefs.value[index];
  if (!pdf || !canvas || renderedZoom.get(index) === zoom.value) return;
  renderedZoom.set(index, zoom.value);

  const page = await pdf.getPage(index + 1);
  const base = page.getViewport({ scale: 1 });
  pages.value[index]!.ratio = base.height / base.width;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const scale = (canvas.clientWidth / base.width) * pixelRatio;
  const viewport = page.getViewport({ scale });

  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  await page.render({ canvas, viewport }).promise;
};

const observePages = () => {
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        renderPage(Number((entry.target as HTMLElement).dataset.index));
      });
    },
    { root: scrollRef.value, rootMargin: '100% 0px' },
  );
  pageRefs.value.forEach(canvas => observer!.observe(canvas));
};

const changeZoom = async (step: number) => {
  zoomIndex.value = Math.min(ZOOM_LEVELS.length - 1, Math.max(0, zoomIndex.value + step));
  await nextTick();
  // Видимые страницы перерисуются в новом разрешении через observer
  observePages();
};

onMounted(async () => {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const { default: workerSrc } = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url');
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

    // Каталоги раздаются из node_modules/pdfjs-dist (nitro.publicAssets в nuxt.config.ts)
    pdf = await pdfjs.getDocument({
      url: props.url,
      wasmUrl: '/pdfjs/wasm/',
      cMapUrl: '/pdfjs/cmaps/',
      standardFontDataUrl: '/pdfjs/standard_fonts/',
      iccUrl: '/pdfjs/iccs/',
    }).promise;
    // Пропорции всех страниц берём по первой (в документах их бывают сотни),
    // точная подставится при отрисовке страницы
    const first = (await pdf.getPage(1)).getViewport({ scale: 1 });
    const ratio = first.height / first.width;
    pages.value = Array.from({ length: pdf.numPages }, () => ({ ratio }));
    loading.value = false;
    await nextTick();
    observePages();
  }
  catch {
    emit('error');
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
  pdf?.destroy();
});
</script>

<template>
  <div class="relative h-full">
    <div
      ref="scrollRef"
      class="h-full overflow-auto bg-gray-100 p-2 sm:p-4"
    >
      <div
        v-if="loading"
        class="flex h-full items-center justify-center text-gray-500"
      >
        <Icon
          name="i-heroicons-arrow-path"
          class="mr-2 h-5 w-5 animate-spin"
        />
        Загружаем документ…
      </div>

      <div
        v-else
        class="mx-auto flex flex-col gap-3"
        :style="{ width: `${zoom * 100}%`, maxWidth: zoom === 1 ? '56rem' : 'none' }"
      >
        <canvas
          v-for="(page, index) in pages"
          :key="index"
          ref="pageRefs"
          :data-index="index"
          class="block w-full bg-white shadow-sm"
          :style="{ aspectRatio: `1 / ${page.ratio}` }"
        />
      </div>
    </div>

    <div
      v-if="!loading"
      class="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-gray-900/80 p-1 text-white shadow-lg"
    >
      <UButton
        icon="i-heroicons-minus"
        color="neutral"
        variant="ghost"
        class="rounded-full text-white hover:bg-white/20"
        aria-label="Уменьшить"
        :disabled="zoomIndex === 0"
        @click="changeZoom(-1)"
      />
      <span class="w-12 text-center text-sm tabular-nums">{{ zoom * 100 }}%</span>
      <UButton
        icon="i-heroicons-plus"
        color="neutral"
        variant="ghost"
        class="rounded-full text-white hover:bg-white/20"
        aria-label="Увеличить"
        :disabled="zoomIndex === ZOOM_LEVELS.length - 1"
        @click="changeZoom(1)"
      />
    </div>
  </div>
</template>
