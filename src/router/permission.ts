import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router';
import type { AppRouteRecord, UserRole } from '@/types';
import { filterRoutesByRole, hasPermission } from '@/utils/permission';
import { businessRoutes } from '@/router/routes';

function readRoles(route: Pick<RouteLocationNormalizedLoaded, 'meta'> | Pick<RouteRecordRaw, 'meta'> | AppRouteRecord) {
  return route.meta?.roles as UserRole[] | undefined;
}

export function hasRouteAccess(
  first: UserRole | (Pick<RouteLocationNormalizedLoaded, 'meta'> | Pick<RouteRecordRaw, 'meta'> | AppRouteRecord),
  second: UserRole | (Pick<RouteLocationNormalizedLoaded, 'meta'> | Pick<RouteRecordRaw, 'meta'> | AppRouteRecord),
) {
  if (typeof first === 'string') {
    return hasPermission(first, readRoles(second as AppRouteRecord));
  }

  return hasPermission(second as UserRole, readRoles(first));
}

export function buildRoleMenus(routes: AppRouteRecord[], role: UserRole) {
  return filterRoutesByRole(routes, role).filter((route) => !route.meta.hidden);
}

export const appRoutes = businessRoutes;

export { filterRoutesByRole };
