import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp, nextTick } from 'vue';
import ElementPlus from 'element-plus';

import ProductsView from '../../src/views/products/ProductsView.vue';

vi.mock('../../src/api/product', () => {
  const products = [
    {
      id: 'p-1001',
      name: '新款蓝牙耳机 Pro',
      category: '数码配件',
      price: 399,
      stock: 280,
      sales: 1240,
      status: 'on_sale',
      updatedAt: '2026-03-08 18:20',
    },
    {
      id: 'p-1003',
      name: '桌面氛围台灯',
      category: '家居生活',
      price: 229,
      stock: 86,
      sales: 410,
      status: 'draft',
      updatedAt: '2026-03-07 16:10',
    },
  ];

  return {
    fetchProducts: vi.fn().mockResolvedValue({
      list: products,
      total: products.length,
    }),
    updateProduct: vi.fn(),
  };
});

const cleanupList: Array<() => void> = [];

afterEach(() => {
  while (cleanupList.length) {
    cleanupList.pop()?.();
  }
});

async function mountProductsView() {
  const host = document.createElement('div');
  document.body.appendChild(host);

  const app = createApp(ProductsView);
  app.use(ElementPlus);
  app.mount(host);

  await Promise.resolve();
  await nextTick();
  await nextTick();

  cleanupList.push(() => {
    app.unmount();
    host.remove();
  });

  return host;
}

describe('views/products/ProductsView', () => {
  it('渲染商品经营台摘要、指标条和品牌化筛选区', async () => {
    const host = await mountProductsView();

    expect(host.textContent).toContain('商品经营台');
    expect(host.textContent).toContain('在售商品');
    expect(host.textContent).toContain('库存预警');
    expect(host.textContent).toContain('筛选与经营动作');
    expect(host.querySelector('.products-metrics')).not.toBeNull();
    expect(host.querySelector('.products-table__name')).not.toBeNull();
    expect(host.querySelector('.products-focus-card')).not.toBeNull();
  });
});
