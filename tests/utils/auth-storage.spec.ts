import { beforeEach, describe, expect, it } from 'vitest';

import { clearAuthSession, loadAuthSession, saveAuthSession } from '../../src/utils/auth-storage';
import type { AuthSession } from '../../src/types';

class MemoryStorage {
  private storage = new Map<string, string>();

  get length() {
    return this.storage.size;
  }

  clear() {
    this.storage.clear();
  }

  getItem(key: string) {
    return this.storage.has(key) ? this.storage.get(key)! : null;
  }

  key(index: number) {
    return Array.from(this.storage.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.storage.delete(key);
  }

  setItem(key: string, value: string) {
    this.storage.set(key, value);
  }
}

const storage = new MemoryStorage();

describe('utils/auth-storage', () => {
  beforeEach(() => {
    storage.clear();
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: storage,
    });
  });

  it('能够保存并读取登录态', () => {
    const session: AuthSession = {
      token: 'admin-token',
      role: 'admin',
      userInfo: {
        id: 'u-admin',
        name: '管理员',
        avatar: 'https://example.com/admin.png',
      },
    };

    saveAuthSession(session);

    expect(loadAuthSession()).toEqual(session);
  });

  it('能够清除登录态', () => {
    saveAuthSession({
      token: 'operator-token',
      role: 'operator',
      userInfo: {
        id: 'u-operator',
        name: '订单运营',
        avatar: 'https://example.com/operator.png',
      },
    });

    clearAuthSession();

    expect(loadAuthSession()).toBeNull();
  });

  it('存储内容损坏时返回 null 而不是抛错', () => {
    storage.setItem('smart-commerce-auth', '{invalid-json}');

    expect(loadAuthSession()).toBeNull();
  });

  it('遇到旧 Mock token 时会清空会话并返回 null', () => {
    storage.setItem('smart-commerce-session', JSON.stringify({
      token: 'mock-admin-token',
      role: 'admin',
      userInfo: {
        id: 'u-admin',
        name: '管理员',
        avatar: 'A',
      },
    }));

    expect(loadAuthSession()).toBeNull();
    expect(storage.getItem('smart-commerce-session')).toBeNull();
  });
});
