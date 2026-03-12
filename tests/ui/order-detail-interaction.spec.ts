import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp, nextTick } from 'vue';
import ElementPlus from 'element-plus';

import OrdersView from '../../src/views/orders/OrdersView.vue';
import * as orderApi from '../../src/api/order';
import type { OrderItem } from '../../src/types';

vi.mock('../../src/api/order', () => ({
  fetchOrders: vi.fn(),
  fetchOrderDetail: vi.fn(),
}));

const cleanupList: Array<() => void> = [];

afterEach(() => {
  vi.clearAllMocks();

  while (cleanupList.length) {
    cleanupList.pop()?.();
  }
});

async function flushView() {
  await Promise.resolve();
  await nextTick();
  await Promise.resolve();
  await nextTick();
}

async function mountOrdersView() {
  const host = document.createElement('div');
  document.body.appendChild(host);

  const app = createApp(OrdersView);
  app.use(ElementPlus);
  app.mount(host);

  await flushView();

  cleanupList.push(() => {
    app.unmount();
    host.remove();
  });

  return host;
}

describe('views/orders/OrdersView detail drawer', () => {
  it('点击查看详情后先显示当前行订单信息，不再闪出空态文案', async () => {
    const baseOrder: OrderItem = {
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
    };

    let resolveDetail!: (value: OrderItem) => void;
    const detailPromise = new Promise<OrderItem>((resolve) => {
      resolveDetail = resolve;
    });

    vi.mocked(orderApi.fetchOrders).mockResolvedValue({
      total: 1,
      list: [baseOrder],
    });
    vi.mocked(orderApi.fetchOrderDetail).mockImplementation(() => detailPromise);

    await mountOrdersView();
    await flushView();

    const detailButton = Array.from(document.body.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('查看详情'),
    );

    expect(detailButton).toBeTruthy();

    detailButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flushView();

    expect(document.body.textContent).toContain('Order 360');
    expect(document.body.textContent).toContain('SC20260309001');
    expect(document.body.textContent).not.toContain('请选择订单查看详情');

    resolveDetail({
      ...baseOrder,
      address: '上海市静安区南京西路 88 号',
    });
    await flushView();

    expect(document.body.textContent).toContain('上海市静安区南京西路 88 号');
  });
});