/**
 * Превращает путь (`/site/image/...`, `/post/slug`) в абсолютный URL на домене сайта.
 * Нужен для canonical, og:url и og:image — соцсети и поисковики не принимают относительные пути.
 * Абсолютные URL (`http(s)://...`) возвращаются как есть.
 */
export const useAbsoluteUrl = () => {
  const siteUrl = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '');

  return (path?: string | null) => {
    if (!path) return undefined;
    if (/^https?:\/\//.test(path)) return path;
    return `${siteUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };
};
