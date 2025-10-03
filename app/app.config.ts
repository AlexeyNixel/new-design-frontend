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
    tabs: {
      slots: {
        label: 'text-xl font-bold',
      },
    },
  },
});
