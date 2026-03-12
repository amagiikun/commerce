import request from '@/utils/request';
import type { DashboardSummary } from '@/types';

export function fetchDashboardSummary() {
  return request.get<never, DashboardSummary>('/dashboard/summary');
}

export async function getDashboardMetrics() {
  const summary = await fetchDashboardSummary();

  return {
    summary: summary.metrics,
    salesTrend: summary.trend,
    topProducts: summary.hotProducts,
    campaignPerformance: [summary.campaignSummary],
  };
}
