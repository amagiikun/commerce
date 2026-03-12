import type { AxiosRequestConfig } from 'axios';
import type {
  ApiResponse,
  CampaignFilter,
  DashboardSummary,
  LoginRequest,
  LoginResponse,
  OrderFilter,
  PageResult,
  ProductFilter,
} from '@/types';
import { campaigns, orders, products, roleLabelMap, users } from '@/mock/database';

type MockPayload = Record<string, unknown>;

function success<T>(data: T, message = 'ok'): ApiResponse<T> {
  return {
    code: 0,
    message,
    data,
  };
}

function fail(message: string, code = 400): ApiResponse<null> {
  return {
    code,
    message,
    data: null,
  };
}

function sleep(ms = 200) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function parseBody(data: AxiosRequestConfig['data']) {
  if (!data) {
    return {} as MockPayload;
  }

  if (typeof data === 'string') {
    return JSON.parse(data) as MockPayload;
  }

  return data as MockPayload;
}

function paginate<T>(list: T[], page = 1, pageSize = 10): PageResult<T> {
  const start = (page - 1) * pageSize;
  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
  };
}

function createDashboardSummary(): DashboardSummary {
  const totalGMV = orders.reduce((sum, order) => sum + order.amount, 0) * 120;
  const totalOrders = 1832;

  return {
    metrics: {
      gmv: totalGMV,
      orders: totalOrders,
      conversionRate: 12.6,
      newUsers: 428,
      refundRate: 1.8,
    },
    trend: [
      { date: '03-03', gmv: 186000, orders: 240 },
      { date: '03-04', gmv: 208000, orders: 268 },
      { date: '03-05', gmv: 198000, orders: 254 },
      { date: '03-06', gmv: 226000, orders: 286 },
      { date: '03-07', gmv: 245000, orders: 310 },
      { date: '03-08', gmv: 238000, orders: 298 },
      { date: '03-09', gmv: 257000, orders: 332 },
    ],
    hotProducts: products
      .slice()
      .sort((left, right) => right.sales - left.sales)
      .slice(0, 4)
      .map((item) => ({
        id: item.id,
        name: item.name,
        sales: item.sales,
        revenue: item.sales * item.price,
      })),
    campaignSummary: {
      activeCount: campaigns.filter((campaign) => campaign.status === 'running').length,
      conversionRate: 9.3,
      spend: campaigns.reduce((sum, item) => sum + item.spend, 0),
    },
  };
}

function listProducts(params: ProductFilter) {
  const keyword = String(params.keyword ?? '').trim();
  const status = String(params.status ?? '').trim();
  const category = String(params.category ?? '').trim();

  const filtered = products.filter((item) => {
    const matchedKeyword = keyword ? item.name.includes(keyword) : true;
    const matchedStatus = status ? item.status === status : true;
    const matchedCategory = category ? item.category === category : true;
    return matchedKeyword && matchedStatus && matchedCategory;
  });

  return paginate(filtered, Number(params.page ?? 1), Number(params.pageSize ?? 10));
}

function listOrders(params: OrderFilter) {
  const keyword = String(params.keyword ?? '').trim();
  const status = String(params.status ?? '').trim();
  const channel = String(params.channel ?? '').trim();

  const filtered = orders.filter((item) => {
    const matchedKeyword = keyword
      ? item.orderNo.includes(keyword) || item.customerName.includes(keyword)
      : true;
    const matchedStatus = status ? item.status === status : true;
    const matchedChannel = channel ? item.channel === channel : true;
    return matchedKeyword && matchedStatus && matchedChannel;
  });

  return paginate(filtered, Number(params.page ?? 1), Number(params.pageSize ?? 10));
}

function listCampaigns(params: CampaignFilter) {
  const keyword = String(params.keyword ?? '').trim();
  const status = String(params.status ?? '').trim();

  const filtered = campaigns.filter((item) => {
    const matchedKeyword = keyword ? item.name.includes(keyword) : true;
    const matchedStatus = status ? item.status === status : true;
    return matchedKeyword && matchedStatus;
  });

  return paginate(filtered, Number(params.page ?? 1), Number(params.pageSize ?? 10));
}

export async function handleMockRequest(config: AxiosRequestConfig) {
  await sleep();

  const method = (config.method ?? 'get').toLowerCase();
  const url = (config.url ?? '').replace(/^\/api/, '');
  const body = parseBody(config.data);
  const params = (config.params ?? {}) as MockPayload;

  if (method === 'post' && url === '/auth/login') {
    const payload = body as LoginRequest;
    const currentUser = users.find(
      (item) => item.username === payload.username && item.password === payload.password,
    );

    if (!currentUser) {
      return fail('用户名或密码错误', 401);
    }

    const result: LoginResponse = {
      token: `mock-${currentUser.role}-token`,
      role: currentUser.role,
      userInfo: {
        id: currentUser.id,
        name: `${currentUser.name} · ${roleLabelMap[currentUser.role]}`,
        role: currentUser.role,
        avatar: currentUser.avatar,
      },
    };

    return success(result, '登录成功');
  }

  if (method === 'get' && url === '/dashboard/summary') {
    return success(createDashboardSummary());
  }

  if (method === 'get' && url === '/products') {
    return success(listProducts(params as unknown as ProductFilter));
  }

  if (method === 'patch' && /^\/products\/.+/.test(url)) {
    const productId = url.split('/').at(-1);
    const target = products.find((item) => item.id === productId);

    if (!target) {
      return fail('商品不存在', 404);
    }

    Object.assign(target, body, {
      updatedAt: '2026-03-09 20:00',
    });

    return success(target, '商品信息已更新');
  }

  if (method === 'get' && url === '/orders') {
    return success(listOrders(params as unknown as OrderFilter));
  }

  if (method === 'get' && /^\/orders\/.+/.test(url)) {
    const orderId = url.split('/').at(-1);
    const target = orders.find((item) => item.id === orderId);

    if (!target) {
      return fail('订单不存在', 404);
    }

    return success(target);
  }

  if (method === 'get' && url === '/campaigns') {
    return success(listCampaigns(params as unknown as CampaignFilter));
  }

  if (method === 'get' && /^\/campaigns\/.+/.test(url)) {
    const campaignId = url.split('/').at(-1);
    const target = campaigns.find((item) => item.id === campaignId);

    if (!target) {
      return fail('活动不存在', 404);
    }

    return success(target);
  }

  return fail('未匹配到 Mock 接口', 404);
}
