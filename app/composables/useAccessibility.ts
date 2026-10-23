/**
 * Версия для слабовидящих (ГОСТ Р 52872-2019): размер шрифта, цветовая схема,
 * изображения, межбуквенный и межстрочный интервалы.
 *
 * Настройки лежат в cookie, поэтому сервер сразу отдаёт страницу в нужном виде —
 * без вспышки обычной версии при загрузке. Сами стили — в `assets/css/a11y.css`,
 * они включаются атрибутами `data-a11y-*` на `<html>` (см. `useAccessibilityHead`).
 */

export const A11Y_FONT_SIZES = ['normal', 'large', 'xlarge'] as const;
export const A11Y_SCHEMES = ['bw', 'wb', 'blue', 'beige', 'green'] as const;
export const A11Y_SPACINGS = ['normal', 'wide', 'wider'] as const;

export type A11yFontSize = (typeof A11Y_FONT_SIZES)[number];
export type A11yScheme = (typeof A11Y_SCHEMES)[number];
export type A11ySpacing = (typeof A11Y_SPACINGS)[number];

export interface A11ySettings {
  enabled: boolean;
  fontSize: A11yFontSize;
  scheme: A11yScheme;
  images: boolean;
  letterSpacing: A11ySpacing;
  lineHeight: A11ySpacing;
}

/** С чего начинается режим при включении: крупный шрифт, чёрным по белому */
const DEFAULTS: A11ySettings = {
  enabled: false,
  fontSize: 'large',
  scheme: 'bw',
  images: true,
  letterSpacing: 'normal',
  lineHeight: 'normal',
};

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Cookie мог быть подделан или остаться от старой версии — берём только известные значения */
const sanitize = (value: Partial<A11ySettings> | null | undefined): A11ySettings => {
  const pick = <T extends string>(list: readonly T[], item: unknown, fallback: T) =>
    list.includes(item as T) ? (item as T) : fallback;
  return {
    enabled: value?.enabled === true,
    fontSize: pick(A11Y_FONT_SIZES, value?.fontSize, DEFAULTS.fontSize),
    scheme: pick(A11Y_SCHEMES, value?.scheme, DEFAULTS.scheme),
    images: value?.images !== false,
    letterSpacing: pick(A11Y_SPACINGS, value?.letterSpacing, DEFAULTS.letterSpacing),
    lineHeight: pick(A11Y_SPACINGS, value?.lineHeight, DEFAULTS.lineHeight),
  };
};

export const useAccessibility = () => {
  const cookie = useCookie<Partial<A11ySettings> | null>('a11y', {
    maxAge: ONE_YEAR,
    sameSite: 'lax',
    default: () => null,
  });

  // Общее состояние для шапки, панели и <html>; cookie только сохраняет его между визитами
  const settings = useState<A11ySettings>('a11y', () => sanitize(cookie.value));

  const save = (next: A11ySettings) => {
    settings.value = next;
    cookie.value = next;
  };

  const update = (patch: Partial<A11ySettings>) => save({ ...settings.value, ...patch });

  return {
    settings: readonly(settings),
    update,
    enable: () => update({ enabled: true }),
    disable: () => update({ enabled: false }),
    toggle: () => update({ enabled: !settings.value.enabled }),
    /** Вернуть настройки режима к исходным, не выходя из него */
    reset: () => save({ ...DEFAULTS, enabled: true }),
  };
};

/** Атрибуты на `<html>` — вызывается один раз в app.vue */
export const useAccessibilityHead = () => {
  const { settings } = useAccessibility();
  const on = computed(() => settings.value.enabled);

  useHead({
    htmlAttrs: {
      'data-a11y': computed(() => (on.value ? '' : undefined)),
      'data-a11y-font': computed(() => (on.value ? settings.value.fontSize : undefined)),
      'data-a11y-scheme': computed(() => (on.value ? settings.value.scheme : undefined)),
      'data-a11y-images': computed(() => (on.value && !settings.value.images ? 'off' : undefined)),
      'data-a11y-letter': computed(() => (on.value ? settings.value.letterSpacing : undefined)),
      'data-a11y-line': computed(() => (on.value ? settings.value.lineHeight : undefined)),
    },
  });
};
