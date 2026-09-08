import { generateScale, normalizeHex, PRIMARY_STEPS } from '~/utils/colorScale';

/**
 * Движок цветов dev-панели.
 * Правит CSS-переменные --color-primary-* и --color-link-500 инлайново на <html>,
 * персистит изменения в localStorage и умеет отдавать готовый CSS-блок для вставки в theme.css.
 */

const STORAGE_KEY = 'dev:theme-overrides';
const LINK_VAR = '--color-link-500';

interface PersistShape {
  overrides: Record<string, string>;
  base: string;
}

const primaryVar = (step: number | string) => `--color-primary-${step}`;

export const useDevTheme = () => {
  const overrides = useState<Record<string, string>>(
    'dev:theme:overrides',
    () => ({}),
  );
  const defaults = useState<Record<string, string>>(
    'dev:theme:defaults',
    () => ({}),
  );
  const base = useState<string>('dev:theme:base', () => '#7592dc');
  const loaded = useState<boolean>('dev:theme:loaded', () => false);

  const allVars = [...PRIMARY_STEPS.map(s => primaryVar(s)), LINK_VAR];

  function readDefaults() {
    if (!import.meta.client) return;
    const cs = getComputedStyle(document.documentElement);
    const next: Record<string, string> = { ...defaults.value };
    for (const v of allVars) {
      const raw = cs.getPropertyValue(v);
      const hex = normalizeHex(raw);
      if (hex) next[v] = hex;
    }
    defaults.value = next;
  }

  function applyToDom() {
    if (!import.meta.client) return;
    const root = document.documentElement;
    for (const v of allVars) {
      if (overrides.value[v]) root.style.setProperty(v, overrides.value[v]);
      else root.style.removeProperty(v);
    }
  }

  function persist() {
    if (!import.meta.client) return;
    try {
      const payload: PersistShape = {
        overrides: overrides.value,
        base: base.value,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
    catch {
      /* localStorage недоступен — игнорируем */
    }
  }

  function load() {
    if (!import.meta.client) return;
    readDefaults();
    if (!loaded.value) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PersistShape>;
          if (parsed.overrides) overrides.value = { ...parsed.overrides };
          if (parsed.base) base.value = parsed.base;
        }
      }
      catch {
        /* повреждённые данные — игнорируем */
      }
      loaded.value = true;
    }
    applyToDom();
  }

  function setVar(cssVar: string, hex: string) {
    const norm = normalizeHex(hex);
    if (!norm) return;
    overrides.value = { ...overrides.value, [cssVar]: norm };
    applyToDom();
    persist();
  }

  function applyBase(hex: string) {
    const norm = normalizeHex(hex);
    if (!norm) return;
    base.value = norm;
    const scale = generateScale(norm);
    const next = { ...overrides.value };
    for (const step of PRIMARY_STEPS) next[primaryVar(step)] = scale[step];
    overrides.value = next;
    applyToDom();
    persist();
  }

  function reset() {
    overrides.value = {};
    applyToDom();
    persist();
  }

  function currentValue(cssVar: string): string {
    return overrides.value[cssVar] || defaults.value[cssVar] || '#000000';
  }

  function exportCss(): string {
    const lines = allVars
      .filter(v => overrides.value[v])
      .map(v => `  ${v}: ${overrides.value[v]};`);
    if (!lines.length) return '/* нет изменений */';
    return `:root {\n${lines.join('\n')}\n}`;
  }

  return {
    overrides,
    defaults,
    base,
    load,
    setVar,
    applyBase,
    reset,
    currentValue,
    exportCss,
    primaryVar,
    LINK_VAR,
    PRIMARY_STEPS,
  };
};
