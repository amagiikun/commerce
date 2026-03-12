import request from 'supertest';
import { buildApp } from '../src/app.js';
import { createInMemoryRepository } from '../src/data/in-memory-repository.js';

async function loginAsAdmin(app: ReturnType<typeof buildApp>) {
  const response = await request(app).post('/api/auth/login').send({
    username: 'admin',
    password: '123456',
    role: 'admin',
  });

  return response.body.data.token as string;
}

describe('smart-commerce backend api', () => {
  it('登录成功返回 token、userInfo 和 role', async () => {
    const app = buildApp({ repository: createInMemoryRepository() });

    const response = await request(app).post('/api/auth/login').send({
      username: 'admin',
      password: '123456',
      role: 'admin',
    });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(0);
    expect(response.body.data.token).toBeTruthy();
    expect(response.body.data.role).toBe('admin');
    expect(response.body.data.userInfo.name).toContain('管理员');
  });

  it('登录失败返回 401 包装结构', async () => {
    const app = buildApp({ repository: createInMemoryRepository() });

    const response = await request(app).post('/api/auth/login').send({
      username: 'admin',
      password: 'wrong-password',
    });

    expect(response.status).toBe(401);
    expect(response.body.code).toBe(401);
    expect(response.body.data).toBeNull();
  });

  it('未登录访问受保护接口返回 401', async () => {
    const app = buildApp({ repository: createInMemoryRepository() });

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(401);
    expect(response.body.code).toBe(401);
  });

  it('商品列表支持关键字筛选与分页', async () => {
    const app = buildApp({ repository: createInMemoryRepository() });
    const token = await loginAsAdmin(app);

    const response = await request(app)
      .get('/api/products')
      .query({ page: 1, pageSize: 2, keyword: '蓝牙耳机' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.list).toHaveLength(1);
    expect(response.body.data.total).toBe(1);
    expect(response.body.data.list[0].name).toContain('蓝牙耳机');
  });

  it('更新商品后再次查询能看到持久化结果', async () => {
    const repository = createInMemoryRepository();
    const app = buildApp({ repository });
    const token = await loginAsAdmin(app);

    const patchResponse = await request(app)
      .patch('/api/products/p-1001')
      .set('Authorization', `Bearer ${token}`)
      .send({ stock: 999, status: 'draft' });

    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body.data.stock).toBe(999);
    expect(patchResponse.body.data.status).toBe('draft');

    const listResponse = await request(app)
      .get('/api/products')
      .query({ page: 1, pageSize: 10, keyword: '蓝牙耳机' })
      .set('Authorization', `Bearer ${token}`);

    expect(listResponse.body.data.list[0].stock).toBe(999);
    expect(repository.snapshot().products.find((item) => item.id === 'p-1001')?.stock).toBe(999);
  });

  it('订单和活动详情不存在时返回 404', async () => {
    const app = buildApp({ repository: createInMemoryRepository() });
    const token = await loginAsAdmin(app);

    const [orderResponse, campaignResponse] = await Promise.all([
      request(app)
        .get('/api/orders/not-found')
        .set('Authorization', `Bearer ${token}`),
      request(app)
        .get('/api/campaigns/not-found')
        .set('Authorization', `Bearer ${token}`),
    ]);

    expect(orderResponse.status).toBe(404);
    expect(orderResponse.body.code).toBe(404);
    expect(campaignResponse.status).toBe(404);
    expect(campaignResponse.body.code).toBe(404);
  });

  it('看板接口返回完整聚合结构', async () => {
    const app = buildApp({ repository: createInMemoryRepository() });
    const token = await loginAsAdmin(app);

    const response = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.metrics.gmv).toBeGreaterThan(0);
    expect(response.body.data.metrics.orders).toBeGreaterThan(0);
    expect(response.body.data.trend.length).toBeGreaterThan(0);
    expect(response.body.data.hotProducts.length).toBeGreaterThan(0);
    expect(response.body.data.campaignSummary.activeCount).toBeGreaterThan(0);
  });
});
