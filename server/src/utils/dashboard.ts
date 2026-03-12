import type { CampaignItem, DashboardSummary, OrderItem, OrderStatus, ProductItem, StoredUser } from '../contracts.js';
import { formatDate, parseDateTime, roundTo } from './date.js';

const SUCCESSFUL_ORDER_STATUSES = new Set<OrderStatus>(['paid', 'shipping', 'completed']);

function getLatestOrderDate(orders: OrderItem[]) {
  if (orders.length === 0) {
    return new Date();
  }

  return orders.reduce((latest, order) => {
    const current = parseDateTime(order.createdAt);
    return current > latest ? current : latest;
  }, parseDateTime(orders[0].createdAt));
}

export function buildDashboardSummary(options: {
  users: StoredUser[];
  products: ProductItem[];
  orders: OrderItem[];
  campaigns: CampaignItem[];
}): DashboardSummary {
  const { users, products, orders, campaigns } = options;
  const orderCount = orders.length;
  const gmv = orders.reduce((sum, order) => sum + order.amount, 0);
  const successfulOrders = orders.filter((order) => SUCCESSFUL_ORDER_STATUSES.has(order.status)).length;
  const refundOrders = orders.filter((order) => order.status === 'refund').length;
  const uniqueCustomers = new Set(orders.map((order) => order.customerName)).size;
  const latestOrderDate = getLatestOrderDate(orders);

  // 这里按最近 7 天动态聚合订单金额和订单数，替代原来的前端硬编码看板数据。
  const buckets = new Map<string, { gmv: number; orders: number }>();
  for (let offset = 6; offset >= 0; offset -= 1) {
    const current = new Date(latestOrderDate);
    current.setDate(latestOrderDate.getDate() - offset);
    buckets.set(formatDate(current), { gmv: 0, orders: 0 });
  }

  for (const order of orders) {
    const bucketKey = formatDate(parseDateTime(order.createdAt));
    const bucket = buckets.get(bucketKey);

    if (bucket) {
      bucket.gmv += order.amount;
      bucket.orders += 1;
    }
  }

  const runningCampaigns = campaigns.filter((item) => item.status === 'running');
  const averageCampaignConversion = runningCampaigns.length
    ? roundTo(
        runningCampaigns.reduce((sum, item) => sum + item.conversionRate, 0)
          / runningCampaigns.length,
        1,
      )
    : 0;

  return {
    metrics: {
      gmv,
      orders: orderCount,
      conversionRate: orderCount ? roundTo((successfulOrders / orderCount) * 100, 1) : 0,
      newUsers: uniqueCustomers || users.length,
      refundRate: orderCount ? roundTo((refundOrders / orderCount) * 100, 1) : 0,
    },
    trend: Array.from(buckets.entries()).map(([date, bucket]) => ({
      date: date.slice(5),
      gmv: bucket.gmv,
      orders: bucket.orders,
    })),
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
      activeCount: runningCampaigns.length,
      conversionRate: averageCampaignConversion,
      spend: campaigns.reduce((sum, item) => sum + item.spend, 0),
    },
  };
}
