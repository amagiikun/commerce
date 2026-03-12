import type { AuthSession } from '@/types';
import {
  AUTH_SESSION_KEY,
  LEGACY_AUTH_SESSION_KEY,
  removeStorageItem,
  ROLE_KEY,
  setStorageItem,
  TOKEN_KEY,
  USER_KEY,
} from '@/utils/storage';

function parseValue<T>(raw: string | null): T | null {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function isLegacyMockToken(token: string) {
  return token.startsWith('mock-');
}

function isValidSession(session: AuthSession | null): session is AuthSession {
  return Boolean(session?.token && session.userInfo && session.role && !isLegacyMockToken(session.token));
}

function clearStoredSessionKeys() {
  removeStorageItem(AUTH_SESSION_KEY);
  removeStorageItem(LEGACY_AUTH_SESSION_KEY);
  removeStorageItem(TOKEN_KEY);
  removeStorageItem(USER_KEY);
  removeStorageItem(ROLE_KEY);
}

export function saveAuthSession(session: AuthSession) {
  setStorageItem(AUTH_SESSION_KEY, session);
  setStorageItem(LEGACY_AUTH_SESSION_KEY, session);
  setStorageItem(TOKEN_KEY, session.token);
  setStorageItem(USER_KEY, session.userInfo);
  setStorageItem(ROLE_KEY, session.role);
}

export function loadAuthSession(): AuthSession | null {
  const sessionRaw = localStorage.getItem(AUTH_SESSION_KEY);
  const session = parseValue<AuthSession>(sessionRaw);

  if (isValidSession(session)) {
    return session;
  }

  if (sessionRaw) {
    removeStorageItem(AUTH_SESSION_KEY);
  }

  const legacyRaw = localStorage.getItem(LEGACY_AUTH_SESSION_KEY);
  const legacySession = parseValue<AuthSession>(legacyRaw);

  if (isValidSession(legacySession)) {
    return legacySession;
  }

  if (legacyRaw) {
    removeStorageItem(LEGACY_AUTH_SESSION_KEY);
  }

  const token = parseValue<string>(localStorage.getItem(TOKEN_KEY));
  const userInfo = parseValue<AuthSession['userInfo']>(localStorage.getItem(USER_KEY));
  const role = parseValue<AuthSession['role']>(localStorage.getItem(ROLE_KEY));

  if (!token || !userInfo || !role || isLegacyMockToken(token)) {
    clearStoredSessionKeys();
    return null;
  }

  return {
    token,
    userInfo,
    role,
  };
}

export function clearAuthSession() {
  clearStoredSessionKeys();
}

export const saveLoginSession = saveAuthSession;
export const readLoginSession = loadAuthSession;
export const clearLoginSession = clearAuthSession;
