import { jwtDecode } from 'jwt-decode';

/** Полезная нагрузка JWT, который выдаёт бэкенд админки */
interface TokenPayload {
  username: string;
  sub: string;
  name: string;
  iat: number;
  exp: number;
}

export interface AuthSession {
  /** Токен есть и ещё не истёк */
  authenticated: boolean;
  /** Кука присутствует (пользователь когда-то авторизовывался) */
  hasToken: boolean;
  user: {
    id: string;
    username: string;
    name: string;
  } | null;
}

/**
 * Читает HttpOnly-куку `access_token` (домен `.infomania.ru`, ставит бэкенд
 * админки) на сервере и отдаёт состояние авторизации. Сам токен на клиент
 * не передаётся.
 */
export default defineEventHandler((event): AuthSession => {
  const token = getCookie(event, 'access_token');

  if (!token) {
    return { authenticated: false, hasToken: false, user: null };
  }

  try {
    const payload = jwtDecode<TokenPayload>(token);
    const authenticated = payload.exp > Math.floor(Date.now() / 1000);

    return {
      authenticated,
      hasToken: true,
      user: authenticated
        ? {
            id: payload.sub,
            username: payload.username,
            name: payload.name,
          }
        : null,
    };
  }
  catch {
    return { authenticated: false, hasToken: true, user: null };
  }
});
