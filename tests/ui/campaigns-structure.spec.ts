import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp, nextTick } from 'vue';
import ElementPlus from 'element-plus';

import CampaignsView from '../../src/views/campaigns/CampaignsView.vue';

vi.mock('../../src/api/campaign', () => ({
  fetchCampaigns: vi.fn(async () => ({
    total: 2,
    list: [
      {
        id: 'c-1',
        name: '春季焕新周',
        status: 'running',
        budget: 80000,
        spend: 43600,
        conversionRate: 8.6,
        startAt: '2026-03-01',
        endAt: '2026-03-15',
        owner: '增长运营组',
      },
      {
        id: 'c-2',
        name: '会员复购激活计划',
        status: 'running',
        budget: 50000,
        spend: 28900,
        conversionRate: 11.2,
        startAt: '2026-03-05',
        endAt: '2026-03-20',
        owner: 'CRM 团队',
      },
    ],
  })),
  fetchCampaignDetail: vi.fn(async () => ({
    id: 'c-1',
    name: '春季焕新周',
    status: 'running',
    budget: 80000,
    spend: 43600,
    conversionRate: 8.6,
    startAt: '2026-03-01',
    endAt: '2026-03-15',
    owner: '增长运营组',
  })),
}));

const cleanupList: Array<() => void> = [];

afterEach(() => {
  while (cleanupList.length) {
    cleanupList.pop()?.();
  }
});

async function mountCampaignsView() {
  const host = document.createElement('div');
  document.body.appendChild(host);

  const app = createApp(CampaignsView);
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

describe('views/campaigns/CampaignsView', () => {
  it('渲染营销投放看板的摘要区、指标区和活动卡片区', async () => {
    const host = await mountCampaignsView();

    expect(host.textContent).toContain('营销投放看板');
    expect(host.textContent).toContain('在投活动');
    expect(host.textContent).toContain('活动总预算');
    expect(host.textContent).toContain('活动列表');
    expect(host.textContent).toContain('查看详情');
    expect(host.querySelector('.page-hero')).not.toBeNull();
    expect(host.querySelector('.campaign-metrics')).not.toBeNull();
    expect(host.querySelector('.campaign-grid')).not.toBeNull();
  });
});
