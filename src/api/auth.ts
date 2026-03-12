import type { LoginRequest, LoginResponse } from '@/types';
import request from '@/utils/request';

export function login(payload: LoginRequest) {
  return request.post<never, LoginResponse>('/auth/login', payload);
}
