import { jwtDecode } from 'jwt-decode';

/** Полезная нагрузка JWT, который выдаёт бэкенд админки */
interface TokenPayload {
  username: string;
  sub: number;
  name: string;
  iat: number;
  exp: number;
}

export interface AuthUser {
  id: number;
  username: string;
  name: string;
}

/** Базовый URL админки */
const ADMIN_URL = 'http://adminnew.infomania.ru';

/**
 * Авторизация на основе общей куки `access_token` (домен `.infomania.ru`),
 * которую ставит бэкенд админки. Форма логина живёт в самой админке —
 * здесь только чтение токена и переход туда.
 */
export const useAuth = () => {
  const token = useCookie<string | null>('access_token', {
    domain: '.infomania.ru',
    path: '/',
    sameSite: 'lax',
  });

  const payload = computed<TokenPayload | null>(() => {
    if (!token.value) {
      return null;
    }

    try {
      return jwtDecode<TokenPayload>(token.value);
    }
    catch {
      return null;
    }
  });

  /** Токен есть и ещё не истёк */
  const isTokenValid = computed<boolean>(() => {
    if (!payload.value) {
      return false;
    }

    return payload.value.exp > Math.floor(Date.now() / 1000);
  });

  /** Кука присутствует — пользователь когда-то авторизовывался */
  const hasSession = computed<boolean>(() => Boolean(token.value));

  const user = computed<AuthUser | null>(() => {
    if (!payload.value) {
      return null;
    }

    return {
      id: payload.value.sub,
      username: payload.value.username,
      name: payload.value.name,
    };
  });

  /** Убрать протухший/битый токен */
  const clearAuth = () => {
    token.value = null;
  };

  /**
   * Перейти в админку. Если токен валиден — открываем нужный раздел,
   * иначе чистим куку и отправляем на форму логина админки с возвратом назад.
   */
  const goToAdmin = (path = '/') => {
    if (isTokenValid.value) {
      window.location.href = `${ADMIN_URL}${path}`;
      return;
    }

    clearAuth();
    const back = encodeURIComponent(window.location.href);
    window.location.href = `${ADMIN_URL}/login?redirect=${back}`;
  };

  return {
    token,
    user,
    hasSession,
    isTokenValid,
    clearAuth,
    goToAdmin,
  };
};
