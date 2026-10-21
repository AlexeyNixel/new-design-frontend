/**
 * Единый адрес для служебных страниц, у которых на сайте есть двойники:
 * - старые адреса прошлого сайта (/entry/2021-10-11-vopros-otvet), на которые
 *   ещё ссылаются карта сайта и тексты страниц в CMS;
 * - посты, оставшиеся от импорта и повторяющие страницу (/post/dostupnaya-sreda-…);
 * - старые /document/… адреса, которые не сводятся к странице автоматически
 *   (см. server/middleware/legacy-redirects.ts).
 *
 * Используется в глобальном route middleware (301 на канонический адрес),
 * при выводе меню и HTML из CMS (ссылки сразу ведут куда нужно) и в sitemap
 * (двойники в него не попадают).
 */
const PAGE_ALIASES: Record<string, string> = {
  // Посты-двойники служебных страниц
  '/post/dostupnaya-sreda-03-32-22-10-22': 'dostupnaya-sreda',
  '/post/struktura-biblioteki-03-16-22-10-22': 'struktura-biblioteki',
  '/post/2021-10-11-obratnaja-svjaz': 'obratnaya-svyaz',
  '/post/2021-02-19-sborniki-materialov': 'sborniki-materialov',
  '/post/2014-12-24-polpredcom-obzor-smi': 'polpredcom-obzor-smi',
  '/post/2021-10-11-virtualnye-vystavki': 'exhibition',
  '/post/universitetskaya-biblioteka-online-dlya-chitatelej-nomb-07-48-10-03-23':
    'universitetskaya-biblioteka-online-dlya-chitatelej-nomb-2026-05-20-16-44',

  // Адреса прошлого сайта (/entry/… → /post/…), постов по ним больше нет
  '/post/feedback': 'obratnaya-svyaz',
  '/post/struktura-biblioteki': 'struktura-biblioteki',
  '/post/2019-03-29-dostupnaja-sreda': 'dostupnaya-sreda',
  '/post/2021-09-15-kontaktnaja-informatsija': 'kontaktnaya-informaciya',
  '/post/2021-10-11-assortiment-uslug': 'assortiment-uslug',
  '/post/2021-10-11-biblionoch': 'biblionoch',
  '/post/2021-10-11-biblioteka-litres': 'biblioteka-litres',
  '/post/2021-10-11-katalog-gazet-i-zhurnalov': 'katalog-gazet-i-zhurnalov',
  '/post/2021-10-11-kluby': 'clubs',
  '/post/2021-10-11-konsultant': 'konsultant',
  '/post/2021-10-11-letnij-chitalnyj-zal': 'letnij-chitalnyj-zal',
  '/post/2021-10-11-lichnyj-kabinet': 'lichnyj-kabinet',
  '/post/2021-10-11-otdel-literaturnyh-programm': 'otdel-literaturnyh-programm',
  '/post/2021-10-11-plan-osnovnyh-meroprijatij': 'plan-osnovnyh-meropriyatij',
  '/post/2021-10-11-podrobnee-o-rukovodstve-biblioteki': 'o-rukovodstve-biblioteki',
  '/post/2021-10-11-polpredcom-obzor-smi': 'polpredcom-obzor-smi',
  '/post/2021-10-11-pravila-polzovanija-bibliotekoj': 'pravila-polzovaniya',
  '/post/2021-10-11-prodlenie-on-line': 'prodlenie-onlajn',
  '/post/2021-10-11-rezhim-raboty-biblioteki': 'rezhim-raboty',
  '/post/2021-10-11-servisnye-uslugi': 'servisnye-uslugi',
  '/post/2021-10-11-uchrediteli': 'uchrediteli',
  '/post/2021-10-11-uchreditelnye-dokumenty': 'uchreditelnye-dokumenty',
  '/post/2021-10-11-viktoriny-i-igry': 'exhibition',
  '/post/2021-10-11-virtualnaja-spravka': 'virtualnaya-spravka',
  '/post/2021-10-11-vopros-otvet': 'otvety-na-voprosy',
  '/post/2021-11-14-antikorruptsionnaja-politika': 'antikorrupcionnaya-politika',
  '/post/2021-11-14-dorozhnaja-karta': 'dorozhnaya-karta',
  '/post/2021-11-14-kadrovaja-politika': 'kadrovaya-politika',
  '/post/2021-11-14-kontseptsija-razvitija-gbuk-nso-nojub': 'koncepciya-razvitiya-gbuk-nso-noyub',
  '/post/2021-11-14-nezavisimaja-otsenka-kachestva-okazanija-uslug':
    'nezavisimaya-ocenka-kachestva-okazaniya-uslug',
  '/post/2021-11-14-partnery': 'partnery',
  '/post/2021-11-14-politika-obrabotki-i-zaschity-personalnyh-dannyh':
    'politika-obrabotki-i-zashity-personalnyh-dannyh',
  '/post/2021-11-14-proverki': 'proverki',
  '/post/2021-11-14-sistema-menedzhmenta-kachestva-v-biblioteke':
    'sistema-menedzhmenta-kachestva-v-biblioteke',
  '/post/2021-11-14-udovletvorennost-polzovatelej': 'udovletvorennost-polzovatelej',
  '/post/2021-11-17-kalendar-pamjatnyh-dat': 'kalendar-pamyatnyh-dat',
  '/post/2021-11-17-metodicheskie-posobija': 'metodicheskie-posobiya',
  '/post/2021-11-17-sborniki-materialov': 'sborniki-materialov',
  '/post/2021-11-17-serija-zaochnyj-seminar': 'zaochnyj-seminar',
  '/post/2021-11-25-biblio-inkubator': 'biblio-inkubator',
  '/post/2021-11-25-finansovo-hozjajstvennaja-dejatelnost': 'finansovo-hozyajstvennaya-deyatelnost',
  '/post/2021-11-25-gildija-molodyh-bibliotekarej': 'gildiya-molodyh-bibliotekarej',
  '/post/2021-11-25-letnjaja-shkola-molodyh-bibliotekarej': 'letnyaya-shkola-molodyh-bibliotekarej',
  '/post/2021-11-25-materialno-tehnicheskaja-baza': 'materialno-tehnicheskaya-baza',
  '/post/2021-11-25-otchety': 'otchety',
  '/post/2021-11-25-plan-osnovnyh-professionalnyh-meroprijatij-gbuk-nso':
    'plan-osnovnyh-professionalnyh-meropriyatij',
  '/post/2021-11-25-polozhenie-o-zakupkah': 'zakupki',
  '/post/2021-11-26-dostizhenija': 'dostizheniya',
  '/post/2021-11-26-istorija': 'istoricheskaya-spravka',
  '/post/2021-12-03-otdel-otraslevoj-literatury': 'otdel-otraslevoj-literatury',
  '/post/2021-12-25-biblioteka-v-smi': 'biblioteka-v-smi',
  '/post/2022-01-24-videoarhiv': 'videoarhiv',

  // Страница «Клубы» в CMS удалена, но по адресу ещё открывается; актуальная — app/pages/page/clubs.vue
  '/page/kluby': 'clubs',

  // Старые /document/… с другим адресом, чем у страницы
  '/document/kluby': 'clubs',
  '/document/pravila-polzovaniya-bibliotekoj': 'pravila-polzovaniya',
  '/document/ocenka-kachestva-uslug-nomb-10-23-11-01-23': 'ocenka-kachestva-uslug-nomb',
  '/document/professionalьnye-konkursy-09-30-27-10-23': 'professionalnye-konkursy',
};

/** Ссылки на свой сайт, которые обрабатывает Nuxt (остальное на infomania.ru — отдельные приложения) */
const OWN_LINK = /^(?:https?:)?\/\/(?:www\.|dev\.|alt\.)?infomania\.ru(?=\/(?:page|post|entry|news|document|books|games|comics|afisha|information)(?:[/?#]|$))/i;

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  }
  catch {
    return value;
  }
};

/** Канонический путь страницы (без query и hash); если двойника нет — сам путь */
export const canonicalPath = (path: string): string => {
  // /entry и /news — старые названия раздела новостей
  const legacySection = /^\/(entry|news)(?=\/|$)/;
  const normalized = safeDecode(path).replace(/\/+$/, '').replace(legacySection, '/post') || '/';
  const slug = PAGE_ALIASES[normalized];
  if (slug) return `/page/${slug}`;
  return legacySection.test(path) ? normalized : path;
};

/** Ссылка из CMS (меню, HTML): свой домен → внутренний путь, двойник → канонический адрес */
export const canonicalHref = (href: string): string => {
  const value = href.trim();
  const local = value.replace(OWN_LINK, '');
  if (!local.startsWith('/') || local.startsWith('//')) return href;

  const [, path = '', rest = ''] = local.match(/^([^?#]*)(.*)$/) ?? [];
  // Документы переехали в страницы с тем же адресом (без даты в конце) — как в legacy-redirects
  const target = canonicalPath(path).replace(
    /^\/document\/([^/]+?)(?:-\d{4}-\d{2}-\d{2})?$/,
    '/page/$1',
  );
  return target === path && local === value ? href : target + rest;
};

/** Применяет canonicalHref ко всем href в HTML из CMS */
export const canonicalizeLinks = (html?: string | null): string =>
  (html ?? '').replace(
    /(<a\b[^>]*?\shref\s*=\s*)(["'])(.*?)\2/gi,
    (match, prefix: string, quote: string, href: string) => {
      const target = canonicalHref(href.replace(/&amp;/g, '&'));
      return target === href.replace(/&amp;/g, '&')
        ? match
        : `${prefix}${quote}${target.replace(/&/g, '&amp;')}${quote}`;
    },
  );
