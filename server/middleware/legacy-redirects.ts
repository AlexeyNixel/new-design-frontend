/**
 * Постоянные (301) редиректы со старых адресов сайта, по которым ещё приходят
 * люди и поисковики (список — из 404 в Umami). 301 передаёт новым страницам
 * вес старых ссылок.
 *
 * /document/<адрес>: эндпоинта документов в API нет, сами документы переехали
 * в страницы (/document/igrani-sibiri-2024-03-22 → /page/igrani-sibiri).
 * Если страница с таким адресом (или без даты в конце) есть — редирект туда.
 */

/** Сопоставление старого id игры (gm164, 393203…) с адресом новой страницы */
let gamesByExternalId: Map<string, string> | undefined;
let gamesLoadedAt = 0;
const GAMES_TTL = 60 * 60 * 1000;

const loadGames = async (baseApi: string) => {
  if (gamesByExternalId && Date.now() - gamesLoadedAt < GAMES_TTL) return gamesByExternalId;
  try {
    const response = await $fetch<{ data?: { slug: string; externalId: string | null }[] }>(
      `${baseApi}/api/games/`,
      { query: { limit: 2000 } },
    );
    gamesByExternalId = new Map(
      (response.data ?? [])
        .filter(game => game.externalId)
        .map(game => [game.externalId!.toLowerCase(), game.slug]),
    );
    gamesLoadedAt = Date.now();
  }
  catch (error) {
    console.error('[legacy-redirects] не удалось загрузить игры:', error);
  }
  return gamesByExternalId;
};

const RULES: { match: RegExp; to: (match: RegExpMatchArray) => string }[] = [
  // Старые новости: /news/<адрес>/ → /post/<адрес> (адреса совпадают)
  { match: /^\/news\/([^/]+)\/?$/, to: m => `/post/${m[1]}` },
  // Старый каталог литературы
  { match: /^\/lit\/view_lit\/?$/, to: () => '/books' },
  // Мобильное приложение добавляло хвост «&source=tabbar» к адресу диктанта
  { match: /^\/dictant\/&.*$/, to: () => '/dictant/' },
  // Страница была доступна и как /Information, и как /information — оставляем строчный.
  // Сравнение с учётом регистра, поэтому /information сам на себя не перенаправит.
  { match: /^\/Information\/?$/, to: () => '/information' },
];

export default defineEventHandler(async (event) => {
  const path = event.path.split('?')[0]!;

  for (const rule of RULES) {
    const match = path.match(rule.match);
    if (match) return sendRedirect(event, rule.to(match), 301);
  }

  const documentSlug = path.match(/^\/document\/([^/]+)\/?$/)?.[1];
  if (documentSlug) {
    const baseApi = useRuntimeConfig(event).public.apiBaseUrl;
    const slug = decodeURIComponent(documentSlug);
    for (const candidate of new Set([slug, slug.replace(/-\d{4}-\d{2}-\d{2}$/, '')])) {
      const page = await $fetch<{ id?: string } | null>(
        `${baseApi}/api/page/${encodeURIComponent(candidate)}`,
      ).catch(() => null);
      if (page?.id) return sendRedirect(event, `/page/${candidate}`, 301);
    }
    return;
  }

  // Старая игротека: /game/gm164 и правила /gamelibrary/files/rules/…game_gm101_rules.pdf
  const gameId
    = path.match(/^\/game\/([\w-]+)\/?$/)?.[1]
      ?? path.match(/^\/gamelibrary\/.*?game_(gm\d+)_rules\.pdf$/i)?.[1];
  if (gameId) {
    const games = await loadGames(useRuntimeConfig(event).public.apiBaseUrl);
    const slug = games?.get(gameId.toLowerCase());
    return sendRedirect(event, slug ? `/games/${slug}` : '/games', 301);
  }
});
