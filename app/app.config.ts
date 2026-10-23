export default defineAppConfig({
  css: ['../assets/css/main.css'],
  ui: {
    colors: {
      primary: 'primary',
    },
    navigationMenu: {
      slots: {
        root: 'w-full',
        list: 'flex justify-between w-full',
        viewport: 'z-100',
      },
    },
    // На узких экранах и в версии для слабовидящих (крупный шрифт) кнопки страниц
    // не помещаются в строку — переносим, а не выталкиваем за край экрана
    pagination: {
      slots: {
        root: 'flex-wrap justify-center',
        list: 'flex-wrap justify-center',
      },
    },
    tabs: {
      slots: {
        label: 'text-xl font-bold',
      },
    },
  },
});
