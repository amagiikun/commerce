import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types';
import { clearAuthSession, loadAuthSession } from '@/utils/auth-storage';

const BACKEND_UNAVAILABLE_MESSAGE = '后端服务暂未启动或不可用，请先运行 npm run dev:server';

const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const session = loadAuthSession();

  if (session?.token) {
    config.headers.set('Authorization', `Bearer ${session.token}`);
  }

  return config;
});

service.interceptors.response.use(
  ((response: AxiosResponse<ApiResponse<unknown>>) => {
    const result = response.data;

    if (result.code !== 0) {
      if (result.code === 401) {
        clearAuthSession();
      }

      return Promise.reject(new Error(result.message));
    }

    return result.data;
  }) as never,
  (error: AxiosError<ApiResponse<null>>) => {
    const statusCode = error.response?.status;
    const result = error.response?.data;
    const code = result?.code ?? statusCode;
    const message = !error.response || (statusCode === 500 && !result?.message)
      ? BACKEND_UNAVAILABLE_MESSAGE
      : result?.message ?? error.message ?? '请求失败';

    // 真实后端会返回 HTTP 401，这里继续复用前端已有的登录态清理逻辑。
    if (code === 401 || statusCode === 401) {
      clearAuthSession();
    }

    return Promise.reject(new Error(message));
  },
);

interface TypedRequestInstance {
  get<T = unknown, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;
  post<T = unknown, R = T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<R>;
  patch<T = unknown, R = T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<R>;
}

export default service as typeof service & TypedRequestInstance;
