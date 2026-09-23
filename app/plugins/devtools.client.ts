import type { AuthSession } from '~~/server/api/auth/session.get';

/**
 * Применяет сохранённые цвета dev-панели как можно раньше (до гидрации),
 * чтобы не было вспышки исходной палитры при перезагрузке.
 *
 * Только для авторизованных в админке — как и сама панель (см. app.vue).
 * Сессию берём из SSR-payload запроса `useAuth()` (ключ `auth-session`),
 * чтобы не делать отдельный запрос до гидрации.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const session = nuxtApp.payload.data['auth-session'] as
    | AuthSession
    | undefined;

  if (!session?.authenticated) return;

  useDevTheme().load();
});
