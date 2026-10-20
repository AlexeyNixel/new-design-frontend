// Клик по ссылке на документ (PDF, Word, Excel, txt…) открывает его в модальном окне
// вместо скачивания или ухода с сайта. Работает для всех ссылок на странице, в том числе
// внутри CMS-контента (v-html). Обычное поведение остаётся:
// — при Ctrl/Cmd/Shift/Alt-клике и клике колесом (открыть в новой вкладке / сохранить);
// — для ссылок с атрибутом `download` или `data-no-preview`;
// — для файлов с других доменов.
import { filePreviewKind, fileNameFromPath } from '~/utils/filePreview';

export default defineNuxtPlugin(() => {
  const ModalsFilePreview = defineAsyncComponent(
    () => import('~/components/modals/FilePreview.vue'),
  );
  let modal: ReturnType<ReturnType<typeof useOverlay>['create']> | null = null;

  const handleClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = (event.target as Element | null)?.closest?.('a[href]');
    if (!(link instanceof HTMLAnchorElement)) return;
    if (link.hasAttribute('download') || link.hasAttribute('data-no-preview')) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;

    const kind = filePreviewKind(url.pathname);
    if (!kind) return;

    // Захват (capture) — чтобы успеть раньше NuxtLink/RouterLink, которые иначе
    // попытаются открыть файл как страницу сайта
    event.preventDefault();
    event.stopPropagation();

    const text = link.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    const title = text && text.length <= 200 ? text : fileNameFromPath(url.pathname);

    modal ??= useOverlay().create(ModalsFilePreview);
    modal.open({ url: url.pathname + url.search, title, kind });
  };

  document.addEventListener('click', handleClick, true);
});
