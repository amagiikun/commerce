import type { PageResult } from '../contracts.js';

export function parsePositiveInteger(value: unknown, fallback: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export function paginateArray<T>(list: T[], page: number, pageSize: number): PageResult<T> {
  const start = (page - 1) * pageSize;

  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
  };
}
