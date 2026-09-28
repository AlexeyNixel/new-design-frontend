<template>
  <!-- Превью новости целиком: основная картинка в object-contain, а поля (если формат
       не совпал с контейнером) закрывает размытая копия той же картинки -->
  <div class="relative w-full h-full overflow-hidden bg-gray-100">
    <img
      class="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-60"
      :src="imgSrc"
      :srcset="imgSrcset"
      :sizes="sizes"
      alt=""
      aria-hidden="true"
      :loading="loading"
    >
    <img
      class="relative w-full h-full object-contain transition-transform"
      :class="imgClass"
      :src="imgSrc"
      :srcset="imgSrcset"
      :sizes="sizes"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      @error="notFoundImage"
    >
  </div>
</template>

<script setup lang="ts">
import type { File } from '~~/services/types/file.type';

interface Props {
  file?: File | null;
  alt: string;
  sizes: string;
  width: number;
  height: number;
  loading?: 'lazy' | 'eager';
  imgClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  file: null,
  loading: 'lazy',
  imgClass: '',
});

const DEFAULT_IMAGE = '/placeholder.jpg';

const imgSrc = ref(props.file?.path || DEFAULT_IMAGE);
// После подмены на заглушку srcset убираем — иначе браузер продолжит брать картинку из него
const imgSrcset = computed(() =>
  imgSrc.value === DEFAULT_IMAGE ? undefined : imageSrcset(props.file),
);

const notFoundImage = () => {
  if (imgSrc.value !== DEFAULT_IMAGE) {
    imgSrc.value = DEFAULT_IMAGE;
  }
};
</script>
