/** Сведения о выставке для страницы `/page/exhibition/[slug]` */
export interface ExhibitionInfo {
  slug: string;
  title: string;
  /** Адрес HTML-пакета (через прокси `/dev/**` — тот же origin, что у сайта) */
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
 * API отдаёт выставки только списком, без поиска по слагу и без названий —
 * название и размер слайда берём из самого `index.html` пакета (его собирает iSpring:
 * `<!-- 960 540 -->` в начале и `<title>` в шапке).
 */
export default defineCachedEventHandler(
  async (event): Promise<ExhibitionInfo> => {
    const slug = getRouterParam(event, 'slug') ?? '';
    if (!SLUG_PATTERN.test(slug)) {
      throw createError({ statusCode: 404, statusMessage: 'Выставка не найдена' });
    }

    const path = `/dev/exhibitions/${slug}/index.html`;
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
      title: title ? decodeEntities(title) : 'Виртуальная выставка',
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
