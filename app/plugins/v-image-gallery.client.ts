// Директива v-image-gallery: клик (или Enter/пробел) по картинке внутри контейнера
// открывает модальную галерею со всеми картинками контейнера.
// Контейнер получает класс `image-gallery`, картинки — `is-zoomable`: по ним стили
// (main.css, editor.css) показывают, что изображение можно открыть.
type GalleryElement = HTMLElement & {
  _imageGalleryClick?: (event: MouseEvent) => void;
  _imageGalleryKeydown?: (event: KeyboardEvent) => void;
};

const ZOOMABLE_CLASS = 'is-zoomable';

/** Помечает картинки как кликабельные и доступные с клавиатуры (повторно не трогает) */
const markImages = (el: HTMLElement) => {
  el.querySelectorAll('img').forEach((img) => {
    if (img.classList.contains(ZOOMABLE_CLASS)) return;
    img.classList.add(ZOOMABLE_CLASS);
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    if (!img.getAttribute('aria-label')) {
      img.setAttribute(
        'aria-label',
        img.alt ? `Открыть изображение: ${img.alt}` : 'Открыть изображение в полном размере',
      );
    }
    if (!img.title) img.title = 'Нажмите, чтобы увеличить';
  });
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('image-gallery', {
    mounted(el: HTMLElement, binding) {
      const modal = binding.value?.modal;

      const open = (target: HTMLImageElement) => {
        const imgLinks = Array.from(el.querySelectorAll('img')).map(image => image.src);
        const startIndex = imgLinks.findIndex(src => src === target.src);
        modal?.open({ imgLinks, startIndex });
      };

      const handleClick = (event: MouseEvent) => {
        if (event.target instanceof HTMLImageElement) open(event.target);
      };

      const handleKeydown = (event: KeyboardEvent) => {
        if (!(event.target instanceof HTMLImageElement)) return;
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        open(event.target);
      };

      el.classList.add('image-gallery');
      markImages(el);

      (el as GalleryElement)._imageGalleryClick = handleClick;
      (el as GalleryElement)._imageGalleryKeydown = handleKeydown;
      el.addEventListener('click', handleClick);
      el.addEventListener('keydown', handleKeydown);
    },

    // Контент (v-html, карусель) может смениться — помечаем новые картинки
    updated(el: HTMLElement) {
      markImages(el);
    },

    unmounted(el: HTMLElement) {
      const gallery = el as GalleryElement;
      if (gallery._imageGalleryClick) {
        el.removeEventListener('click', gallery._imageGalleryClick);
        delete gallery._imageGalleryClick;
      }
      if (gallery._imageGalleryKeydown) {
        el.removeEventListener('keydown', gallery._imageGalleryKeydown);
        delete gallery._imageGalleryKeydown;
      }
    },

    getSSRProps() {
      return {};
    },
  });
});
