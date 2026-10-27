// Выбранный вариант главного меню (Вариант 2) — СОХРАНЁН, НО НА САЙТЕ НЕ ПОДКЛЮЧЁН.
// Сайт пока показывает меню из админки. Структура как у /api/navigation-item/.
// Чтобы опубликовать: перенести пункты в админку (или временно подставить
// NAV_VARIANT_REGROUPED вместо ответа API в Header.vue и MainNavigation.vue) и удалить этот файл.
import type { NavigationMenuItem } from '~~/services/api/main-navigation.api';

let nextId = 0;

const link = (title: string, to: string, icon?: string): NavigationMenuItem => ({
  id: `mock-${++nextId}`,
  title,
  to,
  icon,
  target: /^https?:\/\//.test(to) ? '_blank' : '_self',
});

const group = (
  title: string,
  icon: string,
  children: NavigationMenuItem[],
  to?: string,
): NavigationMenuItem => ({ id: `mock-${++nextId}`, title, icon, to, children });

/** Раздел верхнего уровня с описанием для карточки мега-меню */
const section = (description: string, ...args: Parameters<typeof group>): NavigationMenuItem => ({
  ...group(...args),
  description,
});

// Пункты, которые одинаково выглядят в обоих вариантах
const items = {
  answers: () => link('Ответы на вопросы', '/page/otvety-na-voprosy', 'mdi:help-circle'),
  cabinet: () => link('Личный кабинет', '/page/lichnyj-kabinet', 'mdi:account-cog'),
  pushkin: () =>
    link(
      'Пушкинская карта',
      '/post/molodezhnaya-na-krasnom-prisoedinyaetsya-k-proektu-pushkinskaya-karta-12-06-19-01-23',
      'mdi:ticket',
    ),
  assortment: () => link('Ассортимент услуг', '/page/assortiment-uslug', 'mdi:format-list-bulleted'),
  service: () => link('Сервисные услуги', '/page/servisnye-uslugi', 'mdi:wrench-cog'),
  reference: () => link('Виртуальная справка', '/page/virtualnaya-spravka', 'mdi:chat-processing'),
  rules: () => link('Правила пользования', '/page/pravila-polzovaniya', 'mdi:clipboard-list'),
  rulesLending: () =>
    link('Правила выдачи книг из фонда', '/page/pravila-vydachi-knig-iz-fonda', 'mdi:book-arrow-right'),
  worktime: () => link('Режим работы', '/page/rezhim-raboty', 'mdi:clock-outline'),
  contacts: () => link('Контакты', '/page/kontaktnaya-informaciya', 'mdi:card-account-phone'),

  afisha: () => link('Афиша', '/afisha', 'mdi:calendar-month-outline'),
  news: () => link('Новости и анонсы', '/post', 'mdi:newspaper-variant-outline'),
  plan: () => link('План основных мероприятий', '/page/plan-osnovnyh-meropriyatij', 'mdi:calendar-month'),
  igroteka: () => link('Игротека', 'https://vk.com/igroteki_nomb', 'mdi:puzzle'),
  bigEvents: () => [
    link('Библионочь', '/page/biblionoch', 'mdi:weather-night'),
    link('Городской пикник', '/page/gorodskoj-piknik', 'fluent:food-24-filled'),
    link('День абитуриента', '/page/den-abiturienta', 'mdi:account-school'),
    link('День игр', '/page/den-igr', 'mdi:dice-multiple'),
    link('Летний читальный зал', '/page/letnij-chitalnyj-zal', 'mdi:weather-sunny'),
  ],
  contestsActual: () =>
    link('Актуальные конкурсы', '/post?tags=8da916fd-c927-4217-8896-f8907705d2c4', 'mdi:trophy-variant'),
  contestsArchive: () =>
    link('Архив конкурсов', '/post?tags=0ad82318-87f3-4c0c-a0b2-a0d765f9d7e3', 'mdi:archive-outline'),
  quizzes: () => link('Викторины и выставки', '/page/exhibition', 'mdi:puzzle-star'),

  clubs: () => [
    link('Клубы', '/page/clubs', 'mdi:library'),
    link('Битый пиксель', '/page/bityj-piksel', 'mdi:gamepad'),
    link('Мультлаборатория «Сибириус»', '/page/multlaboratoriya-sibirius', 'mdi:animation-play'),
    link('Арт-платформа JAZZIUM', '/page/art-platforma-jazzium', 'mdi:music-note'),
    link('Молодёжная школа журналистики', 'https://infomania.ru/journalist/', 'mdi:newspaper-variant'),
    link('Волонтёрский центр НОМБ', '/page/dobrocentr', 'boxicons:happy-filled'),
  ],

  books: () => link('Каталог книг', '/books', 'mdi:book-search'),
  collections: () => link('Подборки книг', '/books/collections', 'mdi:bookmark-multiple'),
  comics: () => link('Комиксы и манга', '/comics', 'mdi:book-open-page-variant'),
  games: () => link('Настольные игры', '/games', 'mdi:cards-playing-spade-multiple'),
  periodicals: () => link('Газеты и журналы', '/page/katalog-gazet-i-zhurnalov', 'mdi:newspaper-variant-multiple'),
  ecatalog: () => link('Электронный каталог', 'https://search.infomania.ru/jirbis2/', 'mdi:database-search'),
  litmap: () => link('Литературная карта Новосибирска и НСО', 'https://infomania.ru/map/', 'mdi:map-search'),
  bibliography: () =>
    link('Рекомендательная библиография', '/page/bibliograficheskie-ukazateli', 'mdi:book-alphabet'),
  remote: () => [
    link('Библиотека ЛитРес', '/page/biblioteka-litres', 'mdi:tablet-cellphone'),
    link('eLIBRARY.RU', 'https://www.elibrary.ru/defaultx.asp', 'mdi:microscope'),
    link('НЭБ', 'https://rusneb.ru/', 'mdi:archive'),
    link('Консультант+', '/page/konsultant', 'mdi:scale-balance'),
    link('База данных «ИВИС»', '/page/baza-dannyh-ivis', 'mdi:database-cog'),
  ],

  departments: () => [
    link('Отдел отраслевой литературы', '/page/otdel-otraslevoj-literatury', 'mdi:bookshelf'),
    link('Центр графической культуры', '/page/centr-graficheskoj-kultury', 'mdi:palette'),
    link('Отдел художественной литературы', '/page/otdel-hudozhestvennoj-literatury', 'mdi:book-open-variant'),
    link('Медиатека', '/page/mediateka', 'mdi:play-box-multiple'),
    link('Отдел литературных программ', '/page/otdel-literaturnyh-programm', 'mdi:microphone-variant'),
    link(
      'Центр поддержки культурных инициатив молодёжи',
      '/page/centr-podderzhki-kulturnyh-iniciativ-molodyozhi',
      'mdi:lightbulb-on-outline',
    ),
  ],
  venues: () => link('Площадки', '/page/ploshadki', 'mdi:map-marker-radius'),

  projectsActual: () =>
    group('Актуальные проекты', 'mdi:rocket-launch', [
      link('Слушай Новосибирь', '/page/slushaj-novosibir', 'akar-icons:music-note'),
      link(
        'Открытое пространство',
        'https://vkvideo.ru/playlist/-5693391_55746422',
        'mdi:video',
      ),
      link('Сибирская литература от первого лица', 'https://vkvideo.ru/playlist/-114114598_8', 'mdi:video'),
    ], '/page/aktualnye-proekty'),
  projectsArchive: () =>
    group('Архив проектов', 'mdi:archive-clock', [
      link('Сибирские горизонты', '/page/sibirskie-gorizonty', 'mdi:image-filter-hdr'),
      link('ИГРАни Сибири', '/page/igrani-sibiri', 'mdi:dice-multiple'),
      link('Мульт-Сибирь', 'https://infomania.ru/mult/', 'mdi:animation-play'),
      link('Учимся СоциУму', '/page/uchimsya-sociumu', 'mdi:account-school'),
    ], '/page/arhiv-proektov'),

  partners: () =>
    group('Учредители и партнёры', 'mdi:handshake', [
      link('Учредительные документы', '/page/uchreditelnye-dokumenty', 'mdi:file-document-multiple'),
      link('Учредители', '/page/uchrediteli', 'mdi:office-building'),
      link('Партнёры', '/page/partnery', 'mdi:handshake'),
    ], '/page/uchrediteli-i-partnery'),
  history: () =>
    group('История', 'mdi:history', [
      link('Библиотека в СМИ', '/page/biblioteka-v-smi', 'mdi:newspaper-variant-outline'),
      link('Историческая справка', '/page/istoricheskaya-spravka', 'mdi:script-text'),
      link('Хронограф', '/page/hronograf', 'mdi:timeline-clock'),
      link('Достижения', '/page/dostizheniya', 'mdi:trophy-award'),
    ], '/page/istoriya'),
  nomb50: () => link('НОМБ 50 лет', '/page/nomb-50-let', 'i-heroicons-gift'),

  colleagues: () => [
    group('Издания', 'mdi:book-multiple', [
      link('Методические пособия', '/page/metodicheskie-posobiya', 'mdi:notebook'),
      link('Сценарии', '/page/scenarii', 'mdi:script-text'),
      link('Сборники материалов', '/page/sborniki-materialov', 'mdi:archive'),
      link('Календарь памятных дат', '/page/kalendar-pamyatnyh-dat', 'mdi:calendar-star'),
      link('Аналитические обзоры', '/page/analiticheskie-obzory', 'mdi:chart-box'),
      link('Заочный семинар', '/page/zaochnyj-seminar', 'mdi:laptop-account'),
      link('Практика в малом формате', '/page/praktika-v-malom-formate', 'i-heroicons-map'),
    ], '/page/izdaniya'),
    group('Мероприятия', 'mdi:account-group', [
      link('Профессиональные конкурсы', '/page/professionalnye-konkursy', 'mdi:trophy'),
      link(
        'План основных профессиональных мероприятий',
        '/page/plan-osnovnyh-professionalnyh-meropriyatij',
        'mdi:clipboard-list',
      ),
      link('Летняя школа молодых библиотекарей', '/page/letnyaya-shkola-molodyh-bibliotekarej', 'mdi:school-outline'),
      link('Библиотечный диктант', '/page/bibliotechnyj-diktant', 'mdi:lead-pencil'),
      link('Библио-инкубатор', '/page/biblio-inkubator', 'mdi:egg-easter'),
    ], '/page/mepopriyatiya'),
    group('Профессиональные объединения', 'mdi:account-network', [
      link(
        'Молодёжный совет при МК НСО',
        '/page/sovet-molodyh-specialistov-pri-min-kultury-nso',
        'mdi:government',
      ),
      link('Гильдия молодых библиотекарей', '/page/gildiya-molodyh-bibliotekarej', 'mdi:account-supervisor'),
      link(
        'Лига молодых специалистов сферы культуры',
        '/page/liga-molodyh-specialistov-sfery-kultury',
        'akar-icons:people-group',
      ),
    ], '/page/professionalnye-obuedineniya'),
    link('Портал библиотек Новосибирской области', 'https://infomania.ru/portal/', 'mdi:web'),
  ],

  documentsMain: () => [
    link('Гос. задание', '/page/gos-zadanie', 'mdi:file-check'),
    link('Отчёты', '/page/otchety', 'mdi:chart-box'),
    link('Контрольные мероприятия', 'https://bus.gov.ru/agency/106986/measures', 'mdi:clipboard-check'),
    link('Закупки', '/page/zakupki', 'mdi:cart-arrow-down'),
    link('Финансово-хозяйственная деятельность', '/page/finansovo-hozyajstvennaya-deyatelnost', 'mdi:calculator-variant'),
    link('Материально-техническая база', '/page/materialno-tehnicheskaya-baza', 'mdi:toolbox'),
  ],
  quality: () =>
    group('Управление качеством', 'mdi:chart-line', [
      link('Удовлетворённость пользователей', '/page/udovletvorennost-polzovatelej', 'mdi:account-heart'),
      link(
        'Независимая оценка качества оказания услуг',
        '/page/nezavisimaya-ocenka-kachestva-okazaniya-uslug',
        'mdi:scale-balance',
      ),
      link(
        'Система менеджмента качества',
        '/page/sistema-menedzhmenta-kachestva-v-biblioteke',
        'mdi:cog-transfer',
      ),
    ], '/page/upravlenie-kachestvom'),
  policy: () =>
    group('Политика библиотеки', 'mdi:book-open-variant', [
      link('Антитеррористическая политика', '/page/antiterroristicheskaya-politika', 'carbon:police'),
      link('Антикоррупционная политика', '/page/antikorrupcionnaya-politika', 'mdi:hand'),
      link('Обеспечение доступной среды', '/post/dostupnaya-sreda-03-32-22-10-22', 'ic:baseline-accessible'),
      link(
        'Обработка и защита персональных данных',
        '/page/politika-obrabotki-i-zashity-personalnyh-dannyh',
        'mdi:shield-lock',
      ),
      link('Кадровая политика', '/page/kadrovaya-politika', 'mdi:account-tie'),
    ], '/page/politika-biblioteki'),
};

/**
 * Вариант 2 — новая группировка. 7 разделов по задачам посетителя:
 * «Афиша и события» собирает мероприятия, конкурсы и выставки; «Каталоги и ресурсы» делятся
 * на «взять в библиотеке» и «онлайн»; клубы переехали к пространствам; «Документы» — группами
 * внутри «О библиотеке».
 */
export const NAV_VARIANT_REGROUPED: NavigationMenuItem[] = [
  section('Правила и личный кабинет, ответы на частые вопросы, услуги и Пушкинская карта, а ещё режим работы и как с нами связаться', 'Читателям', 'mdi:book-account', [
    group('Как пользоваться', 'mdi:account-check', [
      items.rules(),
      items.rulesLending(),
      items.cabinet(),
      items.answers(),
      items.reference(),
    ]),
    group('Услуги', 'mdi:hand-heart', [
      items.assortment(),
      items.service(),
      items.pushkin(),
    ], '/page/uslugi'),
    items.worktime(),
    items.contacts(),
  ], '/page/chitatelyam'),
  section('Что происходит в библиотеке: афиша, новости и план мероприятий, большие праздники вроде Библионочи, конкурсы, викторины и выставки', 'Афиша и события', 'mdi:calendar-star', [
    group('Что происходит', 'mdi:calendar-month-outline', [
      items.afisha(),
      items.news(),
      items.plan(),
    ]),
    group('Большие события', 'mdi:party-popper', items.bigEvents()),
    group('Конкурсы', 'mdi:trophy-award', [items.contestsActual(), items.contestsArchive()], '/page/konkursy'),
    items.quizzes(),
  ]),
  section('Книги, комиксы, настольные игры и периодика, которые можно взять в библиотеке, и бесплатный онлайн-доступ к ЛитРес, НЭБ и другим базам', 'Каталоги и ресурсы', 'mdi:bookshelf', [
    group('Взять в библиотеке', 'mdi:book-search', [
      items.books(),
      items.collections(),
      items.comics(),
      items.games(),
      items.periodicals(),
      items.ecatalog(),
    ]),
    group('Онлайн-доступ', 'mdi:cloud-braces', items.remote(), '/page/resursy-udalennogo-dostupa'),
    group('Полезное', 'mdi:lightbulb-outline', [items.bibliography(), items.litmap()]),
  ]),
  section('Отделы и площадки библиотеки, а ещё клубы и сообщества по интересам: игры, мультипликация, журналистика, музыка, волонтёрство', 'Пространства и клубы', 'mdi:floor-plan', [
    group('Отделы', 'mdi:office-building-cog', items.departments(), '/page/otdely'),
    group('Клубы и объединения', 'mdi:account-group', [...items.clubs(), items.igroteka()], '/page/obuedineniya'),
    items.venues(),
  ], '/page/prostranstva'),
  section('Собственные проекты НОМБ о Сибири, литературе и культуре: подкасты, видеоциклы и архив завершённых проектов', 'Проекты', 'mdi:lightbulb-on', [items.projectsActual(), items.projectsArchive()], '/page/proekty'),
  section('Кто мы и как устроены: руководство, история и достижения, учредители и партнёры, официальные документы и политики библиотеки', 'О библиотеке', 'mdi:information-box', [
    group('Библиотека сегодня', 'mdi:newspaper-variant', [
      link('О руководстве библиотеки', '/page/o-rukovodstve-biblioteki', 'mdi:account-tie'),
      link('Структура библиотеки', '/page/struktura-biblioteki', 'mdi:sitemap'),
      ...items.partners().children!,
      items.nomb50(),
    ], '/page/biblioteka-segodnya'),
    items.history(),
    group('Официальные документы', 'mdi:file-document-multiple', [
      link('Сведения об организации', '/information', 'mdi:domain'),
      ...items.documentsMain(),
    ], '/page/osnovnye-dokumenty'),
    items.quality(),
    items.policy(),
  ], '/page/o-biblioteke'),
  section('Для библиотекарей: методические пособия и сценарии, профессиональные конкурсы и обучение, сообщества молодых специалистов', 'Коллегам', 'mdi:account-group', items.colleagues(), '/page/kollegam'),
];
