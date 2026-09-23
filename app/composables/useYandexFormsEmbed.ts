const YANDEX_FORMS_SCRIPT = 'https://forms.yandex.ru/_static/embed.js';

/**
 * Подключает скрипт Яндекс.Форм (подстраивает высоту iframe формы) только на страницах,
 * где в HTML из CMS действительно есть форма. `<script>` внутри v-html не выполняется,
 * поэтому скрипт подключаем сами — с defer, чтобы не блокировать отрисовку.
 */
export const useYandexFormsEmbed = (html: MaybeRefOrGetter<string | null | undefined>) => {
  const hasForm = computed(() => /forms\.yandex\.ru/i.test(toValue(html) ?? ''));

  useHead({
    script: computed(() =>
      hasForm.value
        ? [{ key: 'yandex-forms', src: YANDEX_FORMS_SCRIPT, defer: true }]
        : [],
    ),
  });
};
