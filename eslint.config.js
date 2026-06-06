import nuxt from '@nuxt/eslint-config/flat';

export default nuxt(
  {
    features: {
      // Включить TypeScript поддержку
      typescript: true,
      // Настройки для стилистических правил
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: true,
      },
    },
  },
  {
    rules: {
      // Кастомные правила
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  }
);
