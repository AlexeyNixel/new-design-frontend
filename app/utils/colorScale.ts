/**
 * Генерация палитры оттенков 50…900 из одного базового цвета (ступень 500).
 *
 * Работаем в HSL: тон и насыщенность базового цвета сохраняются на всех
 * ступенях, меняется только светлота. Это важно для «ярких» палитр вроде
 * этого проекта, где primary-50/100 используются как насыщенный фон
 * (см. градиент hero-блока в pages/index.vue), а не как почти-белый тон.
 *
 * Используется dev-панелью (см. useDevTheme).
 */

export const PRIMARY_STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
] as const;
export type PrimaryStep = (typeof PRIMARY_STEPS)[number];

/**
 * Насколько светлота ступени смещена от базовой к светлому (положительные)
 * или тёмному (отрицательные) полюсу. 0 — ступень 500 (сам базовый цвет).
 */
const LIGHTNESS_MIX: Record<PrimaryStep, number> = {
  50: 0.62,
  100: 0.42,
  200: 0.26,
  300: 0.14,
  400: 0.06,
  500: 0,
  600: -0.16,
  700: -0.34,
  800: -0.52,
  900: -0.7,
};

const LIGHT_POLE = 0.95;
const DARK_POLE = 0.1;

export function normalizeHex(input: string): string | null {
  if (!input) return null;
  let h = input.trim().toLowerCase();
  if (!h.startsWith('#')) h = `#${h}`;
  if (/^#[0-9a-f]{3}$/.test(h)) {
    h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }
  return /^#[0-9a-f]{6}$/.test(h) ? h : null;
}

function hexToHsl(hex: string): [number, number, number] {
  const norm = normalizeHex(hex) ?? '#000000';
  const r = parseInt(norm.slice(1, 3), 16) / 255;
  const g = parseInt(norm.slice(3, 5), 16) / 255;
  const b = parseInt(norm.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  let r: number;
  let g: number;
  let b: number;
  if (s === 0) {
    r = l;
    g = l;
    b = l;
  }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n * 255)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function generateScale(baseHex: string): Record<PrimaryStep, string> {
  const [h, s, l] = hexToHsl(baseHex);
  const out = {} as Record<PrimaryStep, string>;
  for (const step of PRIMARY_STEPS) {
    const mix = LIGHTNESS_MIX[step];
    const pole = mix >= 0 ? LIGHT_POLE : DARK_POLE;
    const nextL = l + (pole - l) * Math.abs(mix);
    out[step] = hslToHex(h, s, nextL);
  }
  return out;
}
