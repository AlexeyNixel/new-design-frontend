/** Сведения о выставке для страницы `/page/exhibition/[slug]` */
export interface ExhibitionInfo {
  slug: string;
  title: string;
  /** Адрес HTML-пакета (через прокси `/dev/**` или `/site/**` — тот же origin, что у сайта) */
  path: string;
  cover: string;
  /** Размер слайда iSpring — по нему рамка на странице держит пропорции */
  width: number;
  height: number;
}

const STATIC_HOST = 'https://s3.infomania.ru';

/** Слаг — имя папки пакета в хранилище: `v_kohl_sep_oct` */
const SLUG_PATTERN = /^[\w-]+$/;

const decodeEntities = (text: string) =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, '\'')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

/**
 * Выставка по слагу. Пакеты лежат в разных местах: загруженные через CMS —
 * `/dev/exhibitions/<slug>/`, перенесённые со старого сайта — `/site/exhibition/<uuid>/<slug>/`,
 * поэтому путь берём из списка API. Скрытых выставок в списке нет — для них 404.
 * Если API недоступно — пробуем путь CMS.
 */
const resolvePackage = async (slug: string): Promise<{ path: string; title?: string | null } | undefined> => {
  const baseApi = useRuntimeConfig().public.apiBaseUrl;
  const list = await $fetch<{ data?: { path?: string; title?: string | null }[] }>(
    `${baseApi}/api/files/exhibitions/`,
    { query: { limit: 1000, page: 1 } },
  ).catch(() => undefined);

  if (!list) return { path: `/dev/exhibitions/${slug}/index.html` };
  const item = list.data?.find(entry => entry.path?.split('/').at(-2) === slug);
  return item?.path ? { path: item.path, title: item.title } : undefined;
};

/**
 * API отдаёт выставки только списком, без поиска по слагу. Размер слайда
 * (и название, если в CMS его нет) берём из самого `index.html` пакета (его собирает iSpring:
 * `<!-- 960 540 -->` в начале и `<title>` в шапке).
 */
export default defineCachedEventHandler(
  async (event): Promise<ExhibitionInfo> => {
    const slug = getRouterParam(event, 'slug') ?? '';
    if (!SLUG_PATTERN.test(slug)) {
      throw createError({ statusCode: 404, statusMessage: 'Выставка не найдена' });
    }

    const found = await resolvePackage(slug);
    if (!found) {
      throw createError({ statusCode: 404, statusMessage: 'Выставка не найдена' });
    }
    const { path } = found;
    const html = await $fetch<string>(STATIC_HOST + path, { responseType: 'text' }).catch(
      (error) => {
        const statusCode = error?.statusCode === 404 ? 404 : 502;
        throw createError({ statusCode, statusMessage: 'Выставка не найдена' });
      },
    );

    const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim();
    const size = html.match(/<!--\s*(\d+)\s+(\d+)\s*-->/);

    return {
      slug,
      // Название из CMS важнее <title> пакета: iSpring часто пишет туда имя папки
      title: found.title?.trim() || (title ? decodeEntities(title) : 'Виртуальная выставка'),
      path,
      cover: path.replace(/index\.html$/, 'cover.jpg'),
      width: Number(size?.[1]) || 16,
      height: Number(size?.[2]) || 9,
    };
  },
  {
    maxAge: 60 * 60,
    name: 'exhibition',
    getKey: event => getRouterParam(event, 'slug') ?? '',
  },
);
