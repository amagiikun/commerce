import { describe, expect, it } from 'vitest';

import { filterRoutesByRole, hasRouteAccess } from '../../src/router/permission';
import type { AppRouteRecord, UserRole } from '../../src/types';

const mockRoutes: AppRouteRecord[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: { title: '数据概览', icon: 'DataBoard', roles: ['admin', 'operator', 'marketing'] },
  },
  {
    path: '/products',
    name: 'Products',
    meta: { title: '商品管理', icon: 'Goods', roles: ['admin'] },
  },
  {
    path: '/orders',
    name: 'Orders',
    meta: { title: '订单管理', icon: 'Tickets', roles: ['admin', 'operator'] },
  },
  {
    path: '/campaigns',
    name: 'Campaigns',
    meta: { title: '营销活动', icon: 'Promotion', roles: ['admin', 'marketing'] },
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: { title: '系统设置', icon: 'Setting' },
    children: [
      {
        path: 'profile',
        name: 'Profile',
        meta: { title: '个人信息', icon: 'UserFilled', roles: ['admin', 'operator', 'marketing'] },
      },
      {
        path: 'audit',
        name: 'AuditLog',
        meta: { title: '审计日志', icon: 'Document', roles: ['admin'] },
      },
    ],
  },
];

describe('router/permission', () => {
  it('admin 可以访问全部路由', () => {
    const visibleRoutes = filterRoutesByRole(mockRoutes, 'admin');

    expect(visibleRoutes).toHaveLength(5);
    expect(visibleRoutes.find((route) => route.name === 'Settings')?.children).toHaveLength(2);
  });

  it('operator 只能看到允许访问的菜单', () => {
    const visibleRoutes = filterRoutesByRole(mockRoutes, 'operator');

    expect(visibleRoutes.map((route) => route.name)).toEqual(['Dashboard', 'Orders', 'Settings']);
    expect(visibleRoutes.find((route) => route.name === 'Settings')?.children?.map((route) => route.name)).toEqual([
      'Profile',
    ]);
  });

  it('marketing 只能访问营销相关菜单', () => {
    const visibleRoutes = filterRoutesByRole(mockRoutes, 'marketing');

    expect(visibleRoutes.map((route) => route.name)).toEqual(['Dashboard', 'Campaigns', 'Settings']);
  });

  it('meta.roles 缺失时默认所有角色可访问', () => {
    const roleList: UserRole[] = ['admin', 'operator', 'marketing'];

    roleList.forEach((role) => {
      expect(hasRouteAccess(mockRoutes[4], role)).toBe(true);
    });
  });

  it('未知角色无法访问受限路由', () => {
    expect(hasRouteAccess(mockRoutes[1], 'guest' as UserRole)).toBe(false);
  });
});
