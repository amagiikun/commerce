import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp, nextTick } from 'vue';
import ElementPlus from 'element-plus';

import OrdersView from '../../src/views/orders/OrdersView.vue';

vi.mock('../../src/api/order', () => ({
  fetchOrders: vi.fn(async () => ({
    total: 2,
    list: [
      {
        id: 'o-1',
        orderNo: 'SC20260309001',
        customerName: '陈晨',
        amount: 528,
        status: 'shipping',
        channel: 'App',
        address: '上海市浦东新区张江高科园区 88 号',
        createdAt: '2026-03-09 09:12',
        items: [
          { name: '新款蓝牙耳机 Pro', quantity: 1 },
          { name: '桌面氛围台灯', quantity: 1 },
        ],
      },
      {
        id: 'o-2',
        orderNo: 'SC20260309002',
        customerName: '李婉',
        amount: 129,
        status: 'paid',
        channel: '小程序',
        address: '杭州市西湖区文二路 18 号',
        createdAt: '2026-03-09 10:20',
        items: [{ name: '速干运动短袖', quantity: 1 }],
      },
    ],
  })),
  fetchOrderDetail: vi.fn(async () => ({
    id: 'o-1',
    orderNo: 'SC20260309001',
    customerName: '陈晨',
    amount: 528,
    status: 'shipping',
    channel: 'App',
    address: '上海市浦东新区张江高科园区 88 号',
    createdAt: '2026-03-09 09:12',
    items: [
      { name: '新款蓝牙耳机 Pro', quantity: 1 },
      { name: '桌面氛围台灯', quantity: 1 },
    ],
  })),
}));

const cleanupList: Array<() => void> = [];

afterEach(() => {
  while (cleanupList.length) {
    cleanupList.pop()?.();
  }
});

async function mountOrdersView() {
  const host = document.createElement('div');
  document.body.appendChild(host);

  const app = createApp(OrdersView);
  app.use(ElementPlus);
  app.mount(host);

  await Promise.resolve();
  await nextTick();
  await Promise.resolve();
  await nextTick();

  cleanupList.push(() => {
    app.unmount();
    host.remove();
  });

  return host;
}

describe('views/orders/OrdersView', () => {
  it('渲染履约运营台的摘要区、指标区和详情入口', async () => {
    const host = await mountOrdersView();

    expect(host.textContent).toContain('履约运营台');
    expect(host.textContent).toContain('待处理订单');
    expect(host.textContent).toContain('查询条件');
    expect(host.textContent).toContain('订单列表');
    expect(host.textContent).toContain('查看详情');
    expect(host.querySelector('.page-hero')).not.toBeNull();
    expect(host.querySelector('.orders-kpi-grid')).not.toBeNull();
    expect(host.querySelector('.orders-table-card')).not.toBeNull();
  });
});
