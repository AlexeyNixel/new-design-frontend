export type RgbColor = { r: number; g: number; b: number };

// Смешивает все пиксели картинки в один средний цвет через уменьшенный canvas.
export const useAverageColor = (src: Ref<string | undefined>) => {
  const color = ref<RgbColor | null>(null);

  const compute = (url: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const size = 32;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let r = 0;
        let g = 0;
        let b = 0;
        const pixelCount = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        color.value = {
          r: Math.round(r / pixelCount),
          g: Math.round(g / pixelCount),
          b: Math.round(b / pixelCount),
        };
      }
      catch {
        // Например, картинка с чужого домена без CORS-заголовков.
        color.value = null;
      }
    };

    img.onerror = () => {
      color.value = null;
    };

    img.src = url;
  };

  watch(
    src,
    (url) => {
      if (url && import.meta.client) compute(url);
    },
    { immediate: true },
  );

  return color;
};
