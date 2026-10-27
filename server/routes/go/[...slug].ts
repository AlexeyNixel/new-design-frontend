/**
 * Короткие ссылки для промо: /go/<адрес> → исходная ссылка (создаются в
 * админке, раздел «Инструменты → Короткие ссылки»). Бэкенд сам считает
 * переход при запросе resolve.
 *
 * 302, а не 301: браузеры и соцсети не запоминают редирект, поэтому смена
 * адреса в админке работает сразу, а каждый переход доходит до счётчика.
 * Скрытая или несуществующая ссылка ведёт на главную — листовки и QR-коды
 * живут дольше акций.
 */
export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store');

  const slug = getRouterParam(event, 'slug')?.replace(/\/+$/, '');
  if (!slug || slug.includes('/')) return sendRedirect(event, '/', 302);

  const baseApi = useRuntimeConfig(event).public.apiBaseUrl;
  const link = await $fetch<{ url?: string }>(
    `${baseApi}/api/short-link/resolve/${encodeURIComponent(slug)}`,
  ).catch(() => null);

  return sendRedirect(event, link?.url || '/', 302);
});
