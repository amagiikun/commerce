import type { AppRouteRecord } from '@/types';
import { filterRoutesByRole, hasPermission } from '@/utils/permission';

describe('permission utils', () => {
  const routes: AppRouteRecord[] = [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: {} as never,
      meta: {
        title: '数据概览',
        roles: ['admin', 'operator', 'marketing'],
      },
    },
    {
      path: '/products',
      name: 'products',
      component: {} as never,
      meta: {
        title: '商品管理',
        roles: ['admin'],
      },
    },
  ];

  it('管理员应拥有全部菜单权限', () => {
    expect(hasPermission('admin', ['admin'])).toBe(true);
    expect(filterRoutesByRole(routes, 'admin')).toHaveLength(2);
  });

  it('运营角色只保留被授权页面', () => {
    const matched = filterRoutesByRole(routes, 'operator');

    expect(matched).toHaveLength(1);
    expect(matched[0].path).toBe('/dashboard');
  });
});
