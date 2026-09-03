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

  return {
    get,
    getOne,
    getWithoutPagination,
  };
};
