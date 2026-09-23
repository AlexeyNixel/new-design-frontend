import type { SitemapUrlInput } from '#sitemap/types';

/** Элемент списка из API — нас интересуют только поля для построения URL */
interface ListItem {
  id: string;
  slug?: string;
  isDeleted?: boolean;
  updatedAt?: string;
  publishedAt?: string;
}

interface ListResponse {
  data?: ListItem[];
  meta?: { totalPages?: number };
}

/** Размер страницы при выгрузке — бэкенд отдаёт до 1000 записей за запрос */
const PAGE_LIMIT = 1000;

/**
 * Разделы сайта, которые попадают в sitemap.
 * `path` строит URL страницы из записи API (книги открываются по id, остальное по slug).
 */
const SOURCES: {
  endpoint: string;
  path: (item: ListItem) => string | undefined;
}[] = [
  { endpoint: '/api/posts/', path: item => item.slug && `/post/${item.slug}` },
  { endpoint: '/api/book/', path: item => `/books/${item.id}` },
  { endpoint: '/api/games/', path: item => item.slug && `/games/${item.slug}` },
  { endpoint: '/api/comics/', path: item => item.slug && `/comics/${item.slug}` },
  { endpoint: '/api/page/', path: item => item.slug && `/page/${item.slug}` },
];

/** Выгружает все записи раздела, проходя по страницам пагинации */
const fetchAll = async (baseApi: string, endpoint: string) => {
  const items: ListItem[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await $fetch<ListResponse>(baseApi + endpoint, {
      query: { limit: PAGE_LIMIT, page },
    });
    items.push(...(response.data ?? []));
    totalPages = response.meta?.totalPages ?? 1;
    page++;
  } while (page <= totalPages);

  return items;
};

export default defineSitemapEventHandler(async () => {
  const baseApi = useRuntimeConfig().public.apiBaseUrl;

  const results = await Promise.allSettled(
    SOURCES.map(async ({ endpoint, path }) => {
      const items = await fetchAll(baseApi, endpoint);

      return items
        .filter(item => !item.isDeleted)
        .map((item): SitemapUrlInput | undefined => {
          const loc = path(item);
          if (!loc) return undefined;
          return {
            loc,
            lastmod: item.updatedAt || item.publishedAt,
          };
        })
        .filter((url): url is SitemapUrlInput => !!url);
    }),
  );

  // Падение одного раздела не должно ломать весь sitemap
  return results.flatMap((result, index) => {
    if (result.status === 'fulfilled') return result.value;
    console.error(
      `[sitemap] не удалось загрузить ${SOURCES[index]?.endpoint}:`,
      result.reason,
    );
    return [];
  });
});
