import { describe, expect, it } from 'vitest';
import { appRoutes, filterRoutesByRole } from '../permission';

describe('filterRoutesByRole', () => {
  it('允许 admin 访问全部业务页面', () => {
    const routes = filterRoutesByRole(appRoutes, 'admin');

    expect(routes.map((route) => route.name)).toEqual([
      'dashboard',
      'products',
      'orders',
      'campaigns',
    ]);
  });

  it('限制 operator 只能访问看板和订单模块', () => {
    const routes = filterRoutesByRole(appRoutes, 'operator');

    expect(routes.map((route) => route.name)).toEqual(['dashboard', 'orders']);
  });

  it('限制 marketing 只能访问看板和营销模块', () => {
    const routes = filterRoutesByRole(appRoutes, 'marketing');

    expect(routes.map((route) => route.name)).toEqual(['dashboard', 'campaigns']);
  });
});
