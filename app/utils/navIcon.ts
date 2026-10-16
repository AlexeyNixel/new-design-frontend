/**
 * Иконка пункта навигации. Поле icon из CMS может содержать:
 * - имя иконки Iconify (mdi:home) — рисуется через <Icon>;
 * - путь к картинке из public (/max-dark.svg) или внешний URL — рисуется через <img>.
 * Если icon пустой, картинка подбирается по домену ссылки (LINK_IMAGES).
 */

// Сервисы, которых нет в наборах Iconify: берём их логотипы из public
const LINK_IMAGES: { host: string; src: string }[] = [
  { host: 'max.ru', src: '/max-dark.svg' },
];

const IMAGE_RE = /^(\/|https?:\/\/|data:image\/)|\.(svg|png|jpe?g|webp|gif|avif)(\?.*)?$/i;

export interface NavIcon {
  image?: string;
  name?: string;
}

const linkImage = (to?: string) => {
  if (!to) return undefined;
  try {
    const { hostname } = new URL(to);
    return LINK_IMAGES.find(
      ({ host }) => hostname === host || hostname.endsWith(`.${host}`),
    )?.src;
  }
  catch {
    // Внутренняя ссылка (/page/...) — без хоста
    return undefined;
  }
};

export const resolveNavIcon = (icon?: string, to?: string): NavIcon => {
  const value = icon?.trim();
  if (value) return IMAGE_RE.test(value) ? { image: value } : { name: value };

  const image = linkImage(to);
  return image ? { image } : {};
};

export const hasNavIcon = (item: { icon?: string; to?: string }) => {
  const { image, name } = resolveNavIcon(item.icon, item.to);
  return !!(image || name);
};
