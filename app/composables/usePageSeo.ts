interface PageSeoOptions {
  title?: string;
  description?: string;
  /** Путь или URL картинки для превью; по умолчанию — общая картинка сайта */
  image?: string | null;
  /** `website` для разделов, `article` для материалов */
  type?: 'website' | 'article';
  /** ISO-дата публикации (для `article`) */
  publishedTime?: string;
  /** ISO-дата изменения (для `article`) */
  modifiedTime?: string;
}

/** Общая картинка превью 1200×630, если у материала нет своей */
export const DEFAULT_OG_IMAGE = '/og-default.png';

/**
 * Единая точка SEO-мета для страницы: title, description, Open Graph и Twitter Card.
 * Картинка переводится в абсолютный URL — соцсети не принимают относительные пути.
 * canonical и og:url выставляются глобально в app.vue.
 */
export const usePageSeo = (options: PageSeoOptions) => {
  const toAbsolute = useAbsoluteUrl();
  const image = toAbsolute(options.image || DEFAULT_OG_IMAGE);
  const isArticle = options.type === 'article';

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogImage: image,
    ogType: options.type ?? 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: image,
    articlePublishedTime: isArticle ? options.publishedTime : undefined,
    articleModifiedTime: isArticle ? options.modifiedTime : undefined,
  });
};
