export function omitEmptyFilters<T extends Record<string, unknown>>(payload: T) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== '' && value !== undefined && value !== null),
  ) as T;
}

export function buildListQueryParams<T extends Record<string, unknown>>(
  payload: T & { filters?: Record<string, unknown> },
) {
  const { filters, ...rest } = payload;

  return omitEmptyFilters({
    ...rest,
    ...(filters ?? {}),
  });
}
