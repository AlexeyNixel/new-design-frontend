type JsonLd = Record<string, unknown>;

interface BreadcrumbItem {
  label: string;
  to?: string;
}

/**
 * Добавляет на страницу блок структурированных данных `<script type="application/ld+json">`.
 * `key` не даёт дублировать блок при повторном вызове (например, разметка организации).
 */
export const useJsonLd = (key: string, data: JsonLd | (() => JsonLd | undefined)) => {
  useHead({
    script: computed(() => {
      const value = typeof data === 'function' ? data() : data;
      // Нет данных — не выводим тег вовсе (пустой ld+json валидаторы считают ошибкой)
      if (!value) return [];

      return [
        {
          key: `ld-${key}`,
          type: 'application/ld+json',
          // `<` экранируем, чтобы строка из CMS не могла закрыть тег script
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            ...value,
          }).replace(/</g, '\\u003c'),
        },
      ];
    }),
  });
};

/** Разметка BreadcrumbList из тех же пунктов, что показываются в UBreadcrumb */
export const useBreadcrumbSchema = (
  items: BreadcrumbItem[] | Ref<BreadcrumbItem[]> | ComputedRef<BreadcrumbItem[]>,
) => {
  const toAbsolute = useAbsoluteUrl();

  useJsonLd('breadcrumbs', () => {
    const list = unref(items);
    if (!list.length) return undefined;

    return {
      '@type': 'BreadcrumbList',
      'itemListElement': list.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.label,
        'item': toAbsolute(item.to),
      })),
    };
  });
};
