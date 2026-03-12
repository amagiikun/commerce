import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';
import { hasRouteAccess } from '@/router/permission';
import { routes } from '@/router/routes';

const router = createRouter({
  history: createWebHistory(),
  routes: routes as unknown as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (!authStore.initialized) {
    authStore.restoreSession();
  }

  if (to.path === '/login') {
    if (authStore.isAuthenticated) {
      next('/dashboard');
      return;
    }

    next();
    return;
  }

  if (!authStore.isAuthenticated || !authStore.role) {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  // 统一由路由守卫拦截未授权访问，菜单过滤与直链访问使用同一套规则。
  if (!hasRouteAccess(authStore.role, to)) {
    ElMessage.warning('当前角色无权访问该页面');
    next('/dashboard');
    return;
  }

  next();
});

export default router;
