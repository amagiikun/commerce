import { beforeEach, describe, expect, it, vi } from 'vitest';
import { login } from '@/api/auth';
import { getCampaignList } from '@/api/campaign';
import { getDashboardMetrics } from '@/api/dashboard';
import { getOrderList } from '@/api/order';
import { getProductList, updateProduct } from '@/api/product';
import request from '@/utils/request';

vi.mock('@/utils/request', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockedRequest = request as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
};

describe('api-shapes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('登录接口透传 token、userInfo 和 role 结构', async () => {
    mockedRequest.post.mockResolvedValue({
      token: 'mock-token',
      role: 'admin',
      userInfo: {
        id: 'u-001',
        name: '平台管理员 · 管理员',
        role: 'admin',
        avatar: 'A',
      },
    });

    const payload = {
      username: 'admin',
      password: '123456',
      role: 'admin' as const,
    };
    const result = await login(payload);

    expect(mockedRequest.post).toHaveBeenCalledWith('/auth/login', payload);
    expect(result.token).toBeTruthy();
    expect(result.userInfo.name).toBeTruthy();
    expect(result.role).toBe('admin');
  });

  it('列表型接口统一透传 list 和 total 字段', async () => {
    mockedRequest.get
      .mockResolvedValueOnce({ list: [{ id: 'p-1', name: '商品 A' }], total: 1 })
      .mockResolvedValueOnce({ list: [{ id: 'o-1', orderNo: 'NO-1' }], total: 1 })
      .mockResolvedValueOnce({ list: [{ id: 'c-1', name: '活动 A' }], total: 1 });

    const [products, orders, campaigns] = await Promise.all([
      getProductList({ page: 1, pageSize: 10 }),
      getOrderList({ page: 1, pageSize: 10 }),
      getCampaignList({ page: 1, pageSize: 10 }),
    ]);

    expect(products.list.length).toBeGreaterThan(0);
    expect(products.total).toBeGreaterThan(0);
    expect(orders.list.length).toBeGreaterThan(0);
    expect(orders.total).toBeGreaterThan(0);
    expect(campaigns.list.length).toBeGreaterThan(0);
    expect(campaigns.total).toBeGreaterThan(0);
  });

  it('商品接口保留关键字筛选参数并调用 patch 更新', async () => {
    mockedRequest.get.mockResolvedValue({
      list: [{ id: 'p-1001', name: '新款蓝牙耳机 Pro' }],
      total: 1,
    });
    mockedRequest.patch.mockResolvedValue({
      id: 'p-1001',
      name: '新款蓝牙耳机 Pro',
      category: '数码配件',
      price: 399,
      stock: 320,
      sales: 1240,
      status: 'on_sale',
      updatedAt: '2026-03-10 10:00',
    });

    const filter = {
      page: 1,
      pageSize: 10,
      keyword: '蓝牙耳机',
    };
    const updatePayload = { stock: 320 };

    const result = await getProductList(filter);
    const updated = await updateProduct('p-1001', updatePayload);

    expect(mockedRequest.get).toHaveBeenCalledWith('/products', { params: filter });
    expect(mockedRequest.patch).toHaveBeenCalledWith('/products/p-1001', updatePayload);
    expect(result.list.every((item: { name: string }) => item.name.includes('蓝牙耳机'))).toBe(true);
    expect(updated.stock).toBe(320);
  });

  it('看板接口继续转换为页面所需字段', async () => {
    mockedRequest.get.mockResolvedValue({
      metrics: {
        gmv: 2314,
        orders: 5,
        conversionRate: 60,
        newUsers: 5,
        refundRate: 20,
      },
      trend: [{ date: '03-09', gmv: 657, orders: 2 }],
      hotProducts: [{ id: 'p-1004', name: '联名咖啡杯礼盒', sales: 1580, revenue: 140620 }],
      campaignSummary: {
        activeCount: 2,
        conversionRate: 9.9,
        spend: 115700,
      },
    });

    const metrics = await getDashboardMetrics();

    expect(mockedRequest.get).toHaveBeenCalledWith('/dashboard/summary');
    expect(metrics.summary.gmv).toBeGreaterThan(0);
    expect(metrics.salesTrend.length).toBeGreaterThan(0);
    expect(metrics.topProducts.length).toBeGreaterThan(0);
    expect(metrics.campaignPerformance.length).toBeGreaterThan(0);
  });
});
