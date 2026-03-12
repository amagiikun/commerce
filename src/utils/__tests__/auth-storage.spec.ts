import { describe, expect, it } from 'vitest';
import { clearLoginSession, readLoginSession, saveLoginSession } from '../auth-storage';
import type { LoginSession } from '@/types/auth';

describe('auth-storage', () => {
  it('能够持久化并恢复登录态', () => {
    const session: LoginSession = {
      token: 'token-admin',
      role: 'admin',
      userInfo: {
        id: 'u-001',
        name: '管理员',
        department: '平台运营部',
      },
    };

    saveLoginSession(session);

    expect(readLoginSession()).toEqual(session);
  });

  it('遇到非法缓存时返回空并清理缓存', () => {
    localStorage.setItem('smart-commerce-session', '{bad json');

    expect(readLoginSession()).toBeNull();
    expect(localStorage.getItem('smart-commerce-session')).toBeNull();
  });

  it('清理登录态后不再返回缓存', () => {
    const session: LoginSession = {
      token: 'token-operator',
      role: 'operator',
      userInfo: {
        id: 'u-002',
        name: '订单运营',
        department: '订单运营部',
      },
    };

    saveLoginSession(session);
    clearLoginSession();

    expect(readLoginSession()).toBeNull();
  });
});
