// plugins/image-gallery-directive.client.ts
type GalleryElement = HTMLElement & {
  _imageGalleryHandler?: (event: MouseEvent) => void;
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('image-gallery', {
    mounted(el: HTMLElement, binding) {
      // Получаем modal из значения директивы
      const modal = binding.value?.modal;

      // Сохраняем обработчик для возможности удаления
      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        if (target.tagName === 'IMG' && target instanceof HTMLImageElement) {
          const images = el.querySelectorAll('img');
          const arrImageLink: string[] = Array.from(images).map(
            (image: HTMLImageElement) => image.src,
          );

          const startIndex = arrImageLink.findIndex(
            img => img === target.src,
          );

          if (modal) {
            modal.open({ imgLinks: arrImageLink, startIndex });
          }
        }
      };

      // Сохраняем обработчик на элементе для возможности удаления
      (el as GalleryElement)._imageGalleryHandler = handleClick;
      el.addEventListener('click', handleClick);
    },

    unmounted(el: HTMLElement) {
      // Очищаем обработчик события при размонтировании
      const handler = (el as GalleryElement)._imageGalleryHandler;
      if (handler) {
        el.removeEventListener('click', handler);
        delete (el as GalleryElement)._imageGalleryHandler;
      }
    },

    // Опционально: можно добавить SSR поддержку
    getSSRProps(_binding, _vnode) {
      return {};
    },
  });
});
