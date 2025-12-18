import { useRuntimeConfig } from 'nuxt/app';

export interface ApiResponse<T = any> {
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
    options?: any
  ): Promise<ApiResponse<T>> => {
    try {
      const { data } = await useFetch(baseApi + endpoint, {
        method: 'GET',
        ...options,
      });

      return {
        data: data.value.data,
        meta: data.value.meta,
        status: 200,
      };
    } catch (e) {
      throw 'Неправильный запрос';
    }
  };

  const getWithoutPagination = async <T>(
    endpoint: string,
    options?: any
  ): Promise<ApiResponse<T>> => {
    try {
      const { data } = await useFetch(baseApi + endpoint, {
        method: 'GET',
        ...options,
      });
      return data.value as ApiResponse<T>;
    } catch (e) {
      throw 'Неправильный запрос';
    }
  };

  const getOne = async <T>(
    endpoint: string,
    slug: string,
    options: any
  ): Promise<ApiResponse<T>> => {
    try {
      const { data }: any = await useFetch(baseApi + endpoint + slug, {
        method: 'GET',
        ...options,
      });
      return {
        data: data.value,
        status: 200,
      };
    } catch (e) {
      throw e;
    }
  };

  return {
    get,
    getOne,
    getWithoutPagination,
  };
};
