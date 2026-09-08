/**
 * Состояние dev-панели: открыта/закрыта, активный таб, настройки оверлея сетки.
 * init() вызывается один раз из plugins/devtools.client.ts — навешивает персист,
 * инъекцию outline-стилей и горячую клавишу Ctrl+Shift+D.
 */

export type DevTab = 'colors' | 'grid' | 'page';

const UI_KEY = 'dev:tools-ui';
const OUTLINE_STYLE_ID = 'dev-outline-style';

let started = false;

export const useDevTools = () => {
  const open = useState('dev:open', () => false);
  const tab = useState<DevTab>('dev:tab', () => 'colors');
  const outline = useState('dev:grid-outline', () => false);
  const guides = useState('dev:grid-guides', () => false);
  const columns = useState('dev:grid-columns', () => 12);
  const maxWidth = useState('dev:grid-maxwidth', () => 1236);

  const toggle = () => {
    open.value = !open.value;
  };

  function init() {
    if (!import.meta.client || started) return;
    started = true;

    try {
      const raw = localStorage.getItem(UI_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Record<string, unknown>;
        if (typeof p.open === 'boolean') open.value = p.open;
        if (p.tab === 'colors' || p.tab === 'grid' || p.tab === 'page')
          tab.value = p.tab;
        if (typeof p.columns === 'number') columns.value = p.columns;
        if (typeof p.maxWidth === 'number') maxWidth.value = p.maxWidth;
      }
    }
    catch {
      /* игнорируем повреждённые данные */
    }

    watch([open, tab, columns, maxWidth], () => {
      try {
        localStorage.setItem(
          UI_KEY,
          JSON.stringify({
            open: open.value,
            tab: tab.value,
            columns: columns.value,
            maxWidth: maxWidth.value,
          }),
        );
      }
      catch {
        /* localStorage недоступен */
      }
    });

    watch(
      outline,
      (v) => {
        document.getElementById(OUTLINE_STYLE_ID)?.remove();
        if (v) {
          const el = document.createElement('style');
          el.id = OUTLINE_STYLE_ID;
          el.textContent
            = '*,*::before,*::after{outline:1px solid rgba(255,60,60,.28)!important}'
              + '.dev-root,.dev-root *,.dev-grid-overlay,.dev-grid-overlay *{outline:none!important}';
          document.head.appendChild(el);
        }
      },
      { immediate: true },
    );

    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
        e.preventDefault();
        toggle();
      }
    });
  }

  return { open, tab, toggle, init, outline, guides, columns, maxWidth };
};
