import type { AppRouteRecord } from '@/types';
import AppLayout from '@/layout/AppLayout.vue';

export const businessRoutes: AppRouteRecord[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: {
      title: '数据概览',
      icon: 'DataLine',
      roles: ['admin', 'operator', 'marketing'],
    },
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/products/ProductsView.vue'),
    meta: {
      title: '商品管理',
      icon: 'Goods',
      roles: ['admin'],
    },
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/orders/OrdersView.vue'),
    meta: {
      title: '订单管理',
      icon: 'Tickets',
      roles: ['admin', 'operator'],
    },
  },
  {
    path: '/campaigns',
    name: 'campaigns',
    component: () => import('@/views/campaigns/CampaignsView.vue'),
    meta: {
      title: '营销活动',
      icon: 'Promotion',
      roles: ['admin', 'marketing'],
    },
  },
];

export const routes: AppRouteRecord[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/',
    name: 'root',
    component: AppLayout,
    redirect: '/dashboard',
    meta: {
      title: '工作台',
      hidden: true,
      roles: ['admin', 'operator', 'marketing'],
    },
    children: businessRoutes,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/dashboard',
    meta: {
      title: '404',
      hidden: true,
    },
  },
];
