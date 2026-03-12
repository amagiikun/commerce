import { afterEach, describe, expect, it } from 'vitest';
import { createApp, h, nextTick } from 'vue';
import ElementPlus from 'element-plus';

import PageHero from '../../src/components/ui/PageHero.vue';

const cleanupList: Array<() => void> = [];

afterEach(() => {
  while (cleanupList.length) {
    cleanupList.pop()?.();
  }
});

async function mountHero() {
  const host = document.createElement('div');
  document.body.appendChild(host);

  const app = createApp({
    render() {
      return h(
        PageHero,
        {
          eyebrow: 'Smart Commerce',
          title: '数据概览',
          description: '聚焦近 7 日经营趋势与重点运营动作。',
          tag: '品牌工作台',
          meta: ['昨日 GMV +12.8%', '履约及时率 98.4%'],
        },
        {
          actions: () => h('button', { type: 'button' }, '刷新数据'),
          extra: () => h('div', { class: 'hero-extra' }, 'Admin View'),
        },
      );
    },
  });

  app.use(ElementPlus);
  app.mount(host);
  await nextTick();

  cleanupList.push(() => {
    app.unmount();
    host.remove();
  });

  return host;
}

describe('ui/PageHero', () => {
  it('渲染统一的页面摘要头部结构', async () => {
    const host = await mountHero();

    expect(host.textContent).toContain('Smart Commerce');
    expect(host.textContent).toContain('数据概览');
    expect(host.textContent).toContain('品牌工作台');
    expect(host.textContent).toContain('昨日 GMV +12.8%');
    expect(host.textContent).toContain('刷新数据');
    expect(host.querySelector('.page-hero')).not.toBeNull();
    expect(host.querySelector('.page-hero__meta')).not.toBeNull();
    expect(host.querySelector('.page-hero__actions')).not.toBeNull();
  });
});
