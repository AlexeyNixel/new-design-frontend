<template>
  <!-- Картинка вместо иконки: путь из public (/max-dark.svg) или внешний URL -->
  <img
    v-if="resolved.image"
    :src="resolved.image"
    alt=""
    aria-hidden="true"
    class="object-contain"
  >
  <Icon
    v-else-if="resolved.name || fallback"
    :name="(resolved.name || fallback)!"
  />
</template>

<script setup lang="ts">
interface Props {
  // Поле icon из CMS: имя иконки Iconify или путь/URL картинки (см. utils/navIcon.ts)
  icon?: string;
  // Ссылка пункта — по ней подбирается картинка, если иконки в CMS нет
  to?: string;
  // Иконка на случай, если нет ни иконки, ни картинки
  fallback?: string;
}

const props = defineProps<Props>();

const resolved = computed(() => resolveNavIcon(props.icon, props.to));
</script>
