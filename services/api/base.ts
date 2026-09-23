import type { UseFetchOptions } from 'nuxt/app';
import { useRuntimeConfig } from 'nuxt/app';

export type ApiRequestOptions = UseFetchOptions<unknown>;

/** Query-параметры запроса (?page=1&search=...) */
export type ApiQueryParams = Record<string, unknown>;

export interface ApiResponse<T = unknown> {
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
  };
  status?: number;
}

type ApiRecord = Record<string, unknown>;

/** Тяжёлые текстовые поля поста, которые не нужны карточкам и спискам */
export const POST_HEAVY_FIELDS = ['content', 'contentText'];

const omitFields = (item: ApiRecord, fields: string[]) =>
  Object.fromEntries(
    Object.entries(item).filter(([key]) => !fields.includes(key)),
  );

/**
 * transform для списков: убирает тяжёлые поля (например, полный HTML `content`),
 * которые не нужны карточкам. useFetch применяет его на сервере, поэтому поля
 * не попадают в payload страницы (__NUXT_DATA__).
 * `nested` — чистить не сам элемент, а вложенный объект (например, `post` у слайда).
 */
export const omitListFields
  = (fields: string[], nested?: string) => (response: unknown) => {
    const typed = response as ApiResponse<ApiRecord[]> | null;
    if (!typed || !Array.isArray(typed.data)) return typed;

    return {
      ...typed,
      data: typed.data.map((item) => {
        if (!nested) return omitFields(item, fields);

        const child = item[nested];
        return child && typeof child === 'object'
          ? { ...item, [nested]: omitFields(child as ApiRecord, fields) }
          : item;
      }),
    };
  };

export const useApi = () => {
  const config = useRuntimeConfig();

  const baseApi = config.public.apiBaseUrl;

  const get = async <T>(
    endpoint: string,
    options?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> => {
    try {
      const { data } = await useFetch(baseApi + endpoint, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      const response = data.value as ApiResponse<T>;

      return {
        data: response.data,
        meta: response.meta,
        status: 200,
      };
    }
    catch {
      throw 'Неправильный запрос';
    }
  };

  const getWithoutPagination = async <T>(
    endpoint: string,
    options?: ApiRequestOptions,
  ): Promise<T> => {
    try {
      const { data } = await useFetch(baseApi + endpoint, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });
      return data.value as T;
    }
    catch {
      throw 'Неправильный запрос';
    }
  };

  const getOne = async <T>(
    endpoint: string,
    slug: string,
    options?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> => {
    const { data } = await useFetch(baseApi + endpoint + slug, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    return {
      data: data.value as T,
      status: 200,
    };
  };

  const getOneWithoutId = async <T>(
    endpoint: string,
  ): Promise<ApiResponse<T>> => {
    const { data } = await useFetch(baseApi + endpoint, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return {
      data: data.value as T,
      status: 200,
    };
  };

  return {
    get,
    getOne,
    getOneWithoutId,
    getWithoutPagination,
  };
};
