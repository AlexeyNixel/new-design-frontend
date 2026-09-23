/** Реквизиты библиотеки — источник для JSON-LD (совпадают с шапкой и футером сайта) */
export const LIBRARY_INFO = {
  name: 'Новосибирская областная молодёжная библиотека',
  alternateName: 'НОМБ',
  telephone: '+7 (383) 210-10-53',
  email: 'noub@nso.ru',
  address: {
    streetAddress: 'Красный проспект, 26',
    addressLocality: 'Новосибирск',
    addressRegion: 'Новосибирская область',
    addressCountry: 'RU',
  },
  sameAs: [
    'https://vk.ru/oub_nsk',
    'https://t.me/oub_nsk',
    'https://max.ru/id5406132173_gos',
  ],
};

/**
 * Разметка организации (`Library`) и сайта (`WebSite`) — выводится на всех страницах.
 * На неё ссылаются материалы через `publisher: { '@id': .../#organization }`.
 */
export const useOrganizationSchema = () => {
  const toAbsolute = useAbsoluteUrl();
  const siteUrl = toAbsolute('/');

  useJsonLd('organization', {
    '@graph': [
      {
        '@type': 'Library',
        '@id': `${siteUrl}#organization`,
        'name': LIBRARY_INFO.name,
        'alternateName': LIBRARY_INFO.alternateName,
        'url': siteUrl,
        'logo': toAbsolute('/icon-512.png'),
        'image': toAbsolute(DEFAULT_OG_IMAGE),
        'telephone': LIBRARY_INFO.telephone,
        'email': LIBRARY_INFO.email,
        'address': { '@type': 'PostalAddress', ...LIBRARY_INFO.address },
        'openingHoursSpecification': [
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            'opens': '10:00',
            'closes': '20:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Saturday', 'Sunday'],
            'opens': '10:00',
            'closes': '19:00',
          },
        ],
        'sameAs': LIBRARY_INFO.sameAs,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}#website`,
        'url': siteUrl,
        'name': LIBRARY_INFO.alternateName,
        'alternateName': LIBRARY_INFO.name,
        'inLanguage': 'ru-RU',
        'publisher': { '@id': `${siteUrl}#organization` },
      },
    ],
  });
};
