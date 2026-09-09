export interface AuthUser {
  id: string;
  username: string;
  name: string;
}

/**
 * Базовый URL админки.
 * ВНИМАНИЕ: используем https. Если админка реально по http — поменяй здесь.
 */
const ADMIN_URL = 'http://adminnew.infomania.ru';

/**
 * Авторизация на основе HttpOnly-куки `access_token` (домен `.infomania.ru`),
 * которую ставит бэкенд админки. Форма логина живёт в самой админке.
 *
 * Куку читает серверный роут `/api/auth/session` — на клиент токен не попадает.
 */
export const useAuth = () => {
  const { data, refresh, status } = useFetch('/api/auth/session', {
    key: 'auth-session',
  });

  /** Кука присутствует — пользователь когда-то авторизовывался */
  const hasSession = computed<boolean>(() => Boolean(data.value?.hasToken));

  /** Токен есть и ещё не истёк */
  const isAuthenticated = computed<boolean>(() =>
    Boolean(data.value?.authenticated),
  );

  const user = computed<AuthUser | null>(() => data.value?.user ?? null);

  /**
   * Перейти в админку. Перед переходом перепроверяем сессию:
   * валидна — открываем нужный раздел, иначе — на форму логина админки
   * с возвратом на текущую страницу.
   */
  const goToAdmin = async (path = '/') => {
    await refresh();

    if (data.value?.authenticated) {
      window.location.href = `${ADMIN_URL}${path}`;
      return;
    }

    const back = encodeURIComponent(window.location.href);
    window.location.href = `${ADMIN_URL}/login?redirect=${back}`;
  };

  return {
    user,
    hasSession,
    isAuthenticated,
    status,
    refresh,
    goToAdmin,
  };
};
