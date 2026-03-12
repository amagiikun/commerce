import { afterEach, describe, expect, it } from 'vitest';
import { createApp, nextTick } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import ElementPlus from 'element-plus';

import LoginView from '../../src/views/login/LoginView.vue';

const cleanupList: Array<() => void> = [];

afterEach(() => {
  while (cleanupList.length) {
    cleanupList.pop()?.();
  }
});

async function mountLoginView() {
  const host = document.createElement('div');
  document.body.appendChild(host);

  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/', component: LoginView }],
  });

  const app = createApp(LoginView);
  app.use(createPinia());
  app.use(router);
  app.use(ElementPlus);
  await router.push('/');
  await router.isReady();
  app.mount(host);
  await nextTick();

  cleanupList.push(() => {
    app.unmount();
    host.remove();
  });

  return host;
}

describe('views/login/LoginView', () => {
  it('渲染品牌介绍区、角色切换和账号说明', async () => {
    const host = await mountLoginView();

    expect(host.textContent).toContain('Smart Commerce Admin');
    expect(host.textContent).toContain('运营分析');
    expect(host.textContent).toContain('管理员');
    expect(host.textContent).toContain('订单运营');
    expect(host.textContent).toContain('营销专员');
    expect(host.textContent).toContain('演示账号');
    expect(host.querySelector('.login-page__hero')).not.toBeNull();
    expect(host.querySelector('.login-panel')).not.toBeNull();
  });
});
