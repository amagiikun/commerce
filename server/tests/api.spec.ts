import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { createInMemoryRepository } from '../src/testing/create-in-memory-repository.js';

describe('smart-commerce server api', () => {
  let repository: ReturnType<typeof createInMemoryRepository>;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    repository = createInMemoryRepository();
    app = createApp({
      repository,
    });
  });

  async function loginAs(username = 'admin', password = '123456') {
    const response = await request(app).post('/api/auth/login').send({
      username,
      password,
    });

    expect(response.status).toBe(200);
    return response.body.data.token as string;
  }

  it('登录成功时返回 token、userInfo 和 role', async () => {
    const response = await request(app).post('/api/auth/login').send({
      username: 'admin',
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(0);
    expect(response.body.data.token).toBeTruthy();
    expect(response.body.data.role).toBe('admin');
    expect(response.body.data.userInfo.name).toContain('平台管理员');
  });

  it('登录失败时返回 401 与明确错误信息', async () => {
    const response = await request(app).post('/api/auth/login').send({
      username: 'admin',
      password: 'wrong-password',
    });

    expect(response.status).toBe(401);
    expect(response.body.code).toBe(401);
    expect(response.body.message).toBe('用户名或密码错误');
  });

  it('未携带 token 访问受保护接口时返回 401', async () => {
    const response = await request(app).get('/api/products').query({
      page: 1,
      pageSize: 10,
    });

    expect(response.status).toBe(401);
    expect(response.body.code).toBe(401);
  });

  it('商品列表支持关键字、状态、类目筛选与分页', async () => {
    const token = await loginAs();
    const response = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .query({
        page: 1,
        pageSize: 2,
        keyword: '蓝牙耳机',
        status: 'on_sale',
        category: '数码配件',
      });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(0);
    expect(response.body.data.total).toBe(1);
    expect(response.body.data.list).toHaveLength(1);
    expect(response.body.data.list[0].name).toContain('蓝牙耳机');
  });

  it('商品更新会持久化并刷新 updatedAt', async () => {
    const token = await loginAs();

    const updateResponse = await request(app)
      .patch('/api/products/p-1003')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '桌面氛围台灯 MAX',
        stock: 120,
        status: 'on_sale',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.code).toBe(0);
    expect(updateResponse.body.data.name).toBe('桌面氛围台灯 MAX');
    expect(updateResponse.body.data.stock).toBe(120);
    expect(updateResponse.body.data.status).toBe('on_sale');
    expect(updateResponse.body.data.updatedAt).toBeTruthy();

    const listResponse = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: 1, pageSize: 10, keyword: '桌面氛围台灯 MAX' });

    expect(listResponse.body.data.total).toBe(1);
    expect(listResponse.body.data.list[0].name).toBe('桌面氛围台灯 MAX');
  });

  it('订单列表支持关键字、状态与渠道筛选', async () => {
    const token = await loginAs();
    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .query({
        page: 1,
        pageSize: 10,
        keyword: '陈晨',
        status: 'shipping',
        channel: 'App',
      });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(0);
    expect(response.body.data.total).toBe(1);
    expect(response.body.data.list[0].orderNo).toBe('SC20260309001');
  });

  it('订单详情命中时返回明细，未命中时返回 404', async () => {
    const token = await loginAs();
    const hitResponse = await request(app)
      .get('/api/orders/o-9001')
      .set('Authorization', `Bearer ${token}`);

    expect(hitResponse.status).toBe(200);
    expect(hitResponse.body.code).toBe(0);
    expect(hitResponse.body.data.items).toHaveLength(2);

    const missResponse = await request(app)
      .get('/api/orders/o-404')
      .set('Authorization', `Bearer ${token}`);

    expect(missResponse.status).toBe(404);
    expect(missResponse.body.code).toBe(404);
  });

  it('活动列表支持关键字与状态筛选', async () => {
    const token = await loginAs();
    const response = await request(app)
      .get('/api/campaigns')
      .set('Authorization', `Bearer ${token}`)
      .query({
        page: 1,
        pageSize: 10,
        keyword: '会员复购',
        status: 'running',
      });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(0);
    expect(response.body.data.total).toBe(1);
    expect(response.body.data.list[0].id).toBe('c-3002');
  });

  it('活动详情命中时返回明细，未命中时返回 404', async () => {
    const token = await loginAs();
    const hitResponse = await request(app)
      .get('/api/campaigns/c-3001')
      .set('Authorization', `Bearer ${token}`);

    expect(hitResponse.status).toBe(200);
    expect(hitResponse.body.code).toBe(0);
    expect(hitResponse.body.data.owner).toBe('增长运营组');

    const missResponse = await request(app)
      .get('/api/campaigns/c-404')
      .set('Authorization', `Bearer ${token}`);

    expect(missResponse.status).toBe(404);
    expect(missResponse.body.code).toBe(404);
  });

  it('看板接口返回聚合后的完整结构', async () => {
    const token = await loginAs();
    const response = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(0);
    expect(response.body.data.metrics.gmv).toBeGreaterThan(0);
    expect(response.body.data.metrics.orders).toBe(5);
    expect(response.body.data.trend.length).toBeGreaterThan(0);
    expect(response.body.data.hotProducts).toHaveLength(4);
    expect(response.body.data.campaignSummary.activeCount).toBe(2);
  });
});
