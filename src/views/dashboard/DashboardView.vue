<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchDashboardSummary } from '@/api/dashboard';
import CampaignOverviewCard from '@/components/business/dashboard/CampaignOverviewCard.vue';
import HotProductsCard from '@/components/business/dashboard/HotProductsCard.vue';
import MetricCard from '@/components/business/dashboard/MetricCard.vue';
import TrendChartCard from '@/components/business/dashboard/TrendChartCard.vue';
import PageHero from '@/components/ui/PageHero.vue';
import type { DashboardSummary } from '@/types';
import { formatAmount, formatCount, formatPercent } from '@/utils/format';

const loading = ref(false);
const summary = ref<DashboardSummary | null>(null);

const heroMeta = computed(() => {
  if (!summary.value) {
    return ['经营数据加载中', '品牌化运营视图已启用'];
  }

  return [
    `GMV ${formatAmount(summary.value.metrics.gmv)}`,
    `订单 ${formatCount(summary.value.metrics.orders)}`,
    `退款率 ${formatPercent(summary.value.metrics.refundRate)}`,
  ];
});

const metricCards = computed(() => {
  if (!summary.value) {
    return [];
  }

  return [
    {
      title: 'GMV',
      value: formatAmount(summary.value.metrics.gmv),
      trend: '+12.8%',
      description: '品牌活动与高潜商品共同拉动整体成交额增长。',
      tone: 'brand' as const,
    },
    {
      title: '订单量',
      value: formatCount(summary.value.metrics.orders),
      trend: '+8.6%',
      description: '支付转化效率稳定提升，订单节奏保持健康。',
      tone: 'success' as const,
    },
    {
      title: '转化率',
      value: formatPercent(summary.value.metrics.conversionRate),
      trend: '+1.2%',
      description: '详情页到支付链路改善明显，活动流量质量更高。',
      tone: 'neutral' as const,
    },
    {
      title: '新增用户',
      value: formatCount(summary.value.metrics.newUsers),
      trend: '+5.4%',
      description: `当前退款率 ${formatPercent(summary.value.metrics.refundRate)}，需重点看异常订单。`,
      tone: 'warning' as const,
    },
  ];
});

const focusSignals = computed(() => {
  if (!summary.value) {
    return [];
  }

  const topProduct = summary.value.hotProducts[0];

  return [
    {
      label: '今日主推商品',
      value: topProduct?.name ?? '待分析',
      description: topProduct ? `贡献销售额 ${formatAmount(topProduct.revenue)}` : '等待数据同步',
    },
    {
      label: '活动转化效率',
      value: formatPercent(summary.value.campaignSummary.conversionRate),
      description: `在投活动 ${summary.value.campaignSummary.activeCount} 个，适合继续放量。`,
    },
    {
      label: '预算消耗',
      value: formatAmount(summary.value.campaignSummary.spend),
      description: '建议复盘高转化渠道，扩大品牌曝光与成交协同。',
    },
  ];
});

async function loadSummary() {
  loading.value = true;

  try {
    summary.value = await fetchDashboardSummary();
  } catch (error) {
    summary.value = null;
    const message = error instanceof Error ? error.message : '看板数据加载失败';
    ElMessage.error(message);
  } finally {
    loading.value = false;
  }
}

onMounted(loadSummary);
</script>

<template>
  <div class="page-shell dashboard-page">
    <PageHero
      eyebrow="Overview"
      title="品牌运营驾驶舱"
      description="统一查看近 7 日经营走势、活动投放表现和重点商品表现，让分析与动作在一个页面里闭环。"
      tag="Executive View"
      :meta="heroMeta"
    >
      <template #actions>
        <el-button plain>导出简报</el-button>
        <el-button type="primary" :loading="loading" @click="loadSummary">刷新数据</el-button>
      </template>

      <template #extra>
        <div class="dashboard-hero-card">
          <span class="dashboard-hero-card__label">经营摘要</span>
          <strong>品牌化工作台已启用</strong>
          <p>更强的视觉层级、更清晰的分析结构，适合项目演示与业务巡检。</p>
        </div>
      </template>
    </PageHero>

    <section class="stat-grid" v-loading="loading">
      <MetricCard
        v-for="metric in metricCards"
        :key="metric.title"
        :title="metric.title"
        :value="metric.value"
        :trend="metric.trend"
        :description="metric.description"
        :tone="metric.tone"
      />
    </section>

    <section v-if="summary" class="dashboard-grid dashboard-grid--primary">
      <TrendChartCard :data="summary.trend" />

      <div class="dashboard-side-stack">
        <HotProductsCard :list="summary.hotProducts" />

        <el-card shadow="never" class="panel-card signal-card">
          <div class="section-header">
            <div>
              <h3>运营动作提醒</h3>
              <p>把今天最需要关注的信号整理成面向动作的清单。</p>
            </div>
          </div>

          <div class="signal-list">
            <div v-for="item in focusSignals" :key="item.label" class="signal-item">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </el-card>
      </div>
    </section>

    <section v-if="summary" class="dashboard-grid">
      <CampaignOverviewCard :summary="summary.campaignSummary" />
    </section>

    <el-empty v-if="!loading && !summary" description="暂无可展示的数据" />
  </div>
</template>

<style scoped>
.dashboard-page,
.dashboard-side-stack,
.signal-list {
  display: grid;
}

.dashboard-page,
.dashboard-side-stack {
  gap: 16px;
}

.dashboard-grid {
  display: grid;
  gap: 16px;
}

.dashboard-grid--primary {
  grid-template-columns: minmax(0, 1.7fr) minmax(320px, 1fr);
}

.dashboard-hero-card {
  display: grid;
  gap: 10px;
  width: 100%;
  padding: 20px;
  border: 1px solid rgba(191, 219, 254, 0.16);
  border-radius: 22px;
  background: rgba(15, 23, 42, 0.28);
}

.dashboard-hero-card__label,
.signal-item span {
  color: var(--text-muted);
  font-size: 12px;
}

.dashboard-hero-card strong,
.signal-item strong {
  color: #f8fafc;
  font-size: 22px;
}

.dashboard-hero-card p {
  margin: 0;
  color: rgba(226, 232, 240, 0.82);
  line-height: 1.7;
}

.signal-card {
  border: none;
}

.signal-list {
  gap: 12px;
}

.signal-item {
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(238, 242, 255, 0.76), rgba(248, 250, 252, 0.92));
}

.signal-item strong {
  display: block;
  margin: 8px 0 10px;
  color: var(--text-primary);
  font-size: 18px;
}

.signal-item p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

@media (max-width: 1280px) {
  .dashboard-grid--primary {
    grid-template-columns: 1fr;
  }
}
</style>
