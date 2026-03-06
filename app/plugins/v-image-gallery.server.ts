// plugins/image-gallery-directive.server.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('image-gallery', {
    // Пустая директива для сервера, так как функциональность только клиентская
    getSSRProps(binding, vnode) {
      return {};
    },
  });
});
