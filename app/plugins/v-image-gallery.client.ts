// plugins/image-gallery-directive.client.ts
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
            (image: HTMLImageElement) => image.src
          );

          const startIndex = arrImageLink.findIndex(
            (img) => img === target.src
          );

          if (modal) {
            modal.open({ imgLinks: arrImageLink, startIndex });
          }
        }
      };

      // Сохраняем обработчик на элементе для возможности удаления
      (el as any)._imageGalleryHandler = handleClick;
      el.addEventListener('click', handleClick);
    },

    unmounted(el: HTMLElement) {
      // Очищаем обработчик события при размонтировании
      if ((el as any)._imageGalleryHandler) {
        el.removeEventListener('click', (el as any)._imageGalleryHandler);
        delete (el as any)._imageGalleryHandler;
      }
    },

    // Опционально: можно добавить SSR поддержку
    getSSRProps(binding, vnode) {
      // Для SSR можно вернуть пустой объект, так как директива только клиентская
      return {};
    },
  });
});
