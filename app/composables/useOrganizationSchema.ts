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

/** Дни недели schema.org в порядке Date.getDay (0 — воскресенье) */
const SCHEMA_WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

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
        // Часы того расписания, что действует сейчас (обычное или летнее)
        'openingHoursSpecification': getWeekSchedule(getLibrarySeason())
          .filter(day => day.hours)
          .map(({ index, hours }) => ({
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': SCHEMA_WEEKDAYS[index],
            'opens': `${hours!.open}:00`,
            'closes': `${hours!.close}:00`,
          })),
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
