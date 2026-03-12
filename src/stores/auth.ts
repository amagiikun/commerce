import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { login as loginRequest } from '@/api/auth';
import type { LoginRequest, UserInfo, UserRole } from '@/types';
import { clearAuthSession, loadAuthSession, saveAuthSession } from '@/utils/auth-storage';

export const useAuthStore = defineStore('auth', () => {
  const token = ref('');
  const role = ref<UserRole | null>(null);
  const userInfo = ref<UserInfo | null>(null);
  const initialized = ref(false);

  const isAuthenticated = computed(() => Boolean(token.value));

  function restoreSession() {
    const session = loadAuthSession();

    if (session) {
      token.value = session.token;
      role.value = session.role;
      userInfo.value = session.userInfo;
    }

    initialized.value = true;
  }

  async function login(payload: LoginRequest) {
    const result = await loginRequest(payload);

    token.value = result.token;
    role.value = result.role;
    userInfo.value = result.userInfo;
    saveAuthSession(result);
    return result;
  }

  function logout() {
    token.value = '';
    role.value = null;
    userInfo.value = null;
    clearAuthSession();
  }

  return {
    token,
    role,
    userInfo,
    initialized,
    isAuthenticated,
    restoreSession,
    login,
    logout,
  };
});
