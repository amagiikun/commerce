export const TOKEN_KEY = 'smart-commerce-token';
export const USER_KEY = 'smart-commerce-user';
export const ROLE_KEY = 'smart-commerce-role';
export const AUTH_SESSION_KEY = 'smart-commerce-session';
export const LEGACY_AUTH_SESSION_KEY = 'smart-commerce-auth';

export function getStorageItem<T>(key: string, fallback: T): T {
  const value = localStorage.getItem(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return (value as T) ?? fallback;
  }
}

export function setStorageItem(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorageItem(key: string) {
  localStorage.removeItem(key);
}
