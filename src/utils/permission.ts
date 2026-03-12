import type { AppRouteRecord, UserRole } from '@/types';

export function hasPermission(role: UserRole, roles?: UserRole[]) {
  if (!roles || roles.length === 0) {
    return true;
  }

  return roles.includes(role);
}

export function filterRoutesByRole(routes: AppRouteRecord[], role: UserRole): AppRouteRecord[] {
  return routes.reduce<AppRouteRecord[]>((result, route) => {
    if (!hasPermission(role, route.meta.roles)) {
      return result;
    }

    const nextRoute: AppRouteRecord = {
      ...route,
      children: route.children ? filterRoutesByRole(route.children, role) : undefined,
    };

    result.push(nextRoute);
    return result;
  }, []);
}
