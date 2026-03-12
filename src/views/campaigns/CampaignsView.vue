<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import CampaignDetailDialog from '@/components/business/campaigns/CampaignDetailDialog.vue';
import InsightMetricCard from '@/components/ui/InsightMetricCard.vue';
import FilterToolbar from '@/components/ui/FilterToolbar.vue';
import PageHero from '@/components/ui/PageHero.vue';
import { fetchCampaignDetail, fetchCampaigns } from '@/api/campaign';
import type { CampaignFilter, CampaignItem, CampaignStatus } from '@/types';
import { buildListQueryParams } from '@/utils/query';
import { formatAmount, formatPercent } from '@/utils/format';

const loading = ref(false);
const total = ref(0);
const campaigns = ref<CampaignItem[]>([]);
const detailVisible = ref(false);
const currentCampaign = ref<CampaignItem | null>(null);

const filters = reactive<CampaignFilter>({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: '',
});

const statusLabelMap: Record<CampaignStatus, string> = {
  upcoming: '待启动',
  running: '进行中',
  ended: '已结束',
};

const statusToneMap: Record<CampaignStatus, 'info' | 'success' | 'warning'> = {
  upcoming: 'info',
  running: 'success',
  ended: 'warning',
};

const heroMeta = computed(() => [
  `活动总数 ${total.value}`,
  `状态筛选 ${filters.status ? statusLabelMap[filters.status as CampaignStatus] : '全部活动'}`,
  `当前页 ${campaigns.value.length} 个活动`,
]);

const activeCount = computed(() => campaigns.value.filter((item) => item.status === 'running').length);
const totalBudget = computed(() => campaigns.value.reduce((sum, item) => sum + item.budget, 0));
const totalSpend = computed(() => campaigns.value.reduce((sum, item) => sum + item.spend, 0));
const avgConversion = computed(() => {
  if (!campaigns.value.length) {
    return 0;
  }

  return campaigns.value.reduce((sum, item) => sum + item.conversionRate, 0) / campaigns.value.length;
});

const campaignMetrics = computed(() => [
  {
    title: '在投活动',
    value: String(activeCount.value),
    trend: activeCount.value ? '保持投放' : '待启动',
    description: '优先查看正在放量的活动组，保证预算和转化节奏同步。',
    tone: 'brand' as const,
  },
  {
    title: '活动总预算',
    value: formatAmount(totalBudget.value),
    trend: '预算视图',
    description: '从总预算判断当前营销动作的资源规模和计划上限。',
    tone: 'neutral' as const,
  },
  {
    title: '累计消耗',
    value: formatAmount(totalSpend.value),
    trend: '+9.4%',
    description: '结合活动阶段与渠道表现，评估投放效率和节奏是否均衡。',
    tone: 'warning' as const,
  },
  {
    title: '平均转化率',
    value: formatPercent(avgConversion.value),
    trend: '+1.1%',
    description: '可优先复盘高于均值的活动打法，提炼为通用模板。',
    tone: 'success' as const,
  },
]);

const spotlightCampaign = computed(() => {
  if (!campaigns.value.length) {
    return null;
  }

  return [...campaigns.value].sort((left, right) => right.conversionRate - left.conversionRate)[0];
});

async function loadCampaigns() {
  loading.value = true;

  try {
    const result = await fetchCampaigns(buildListQueryParams(filters));
    campaigns.value = result.list;
    total.value = result.total;
  } finally {
    loading.value = false;
  }
}

async function openDetail(campaignId: string) {
  currentCampaign.value = await fetchCampaignDetail(campaignId);
  detailVisible.value = true;
}

function handleSearch() {
  filters.page = 1;
  loadCampaigns();
}

function handleReset() {
  filters.keyword = '';
  filters.status = '';
  filters.page = 1;
  loadCampaigns();
}

onMounted(loadCampaigns);
</script>

<template>
  <div class="page-shell campaigns-page">
    <PageHero
      eyebrow="Campaigns"
      title="营销投放看板"
      description="把预算、消耗、阶段状态和转化结果收敛到一套品牌化视图里，方便从数据直接落到营销动作。"
      tag="Growth View"
      :meta="heroMeta"
    >
      <template #actions>
        <el-button plain>导出周报</el-button>
        <el-button type="primary" :loading="loading" @click="loadCampaigns">刷新活动</el-button>
      </template>

      <template #extra>
        <div class="campaigns-focus-card">
          <span class="campaigns-focus-card__label">本期推荐复盘</span>
          <strong>{{ spotlightCampaign?.name ?? '等待活动数据' }}</strong>
          <p>
            {{ spotlightCampaign
              ? `当前转化率 ${formatPercent(spotlightCampaign.conversionRate)}，建议沉淀渠道策略与素材打法。`
              : '活动数据加载后，这里会展示当前最值得重点复盘的活动。'
            }}
          </p>
        </div>
      </template>
    </PageHero>

    <section class="campaign-metrics" v-loading="loading">
      <InsightMetricCard
        v-for="item in campaignMetrics"
        :key="item.title"
        :title="item.title"
        :value="item.value"
        :trend="item.trend"
        :description="item.description"
        :tone="item.tone"
      />
    </section>

    <FilterToolbar title="活动筛选" description="按活动名称、负责人和状态快速定位重点投放动作。">
      <div class="campaign-filter-bar">
        <el-input v-model="filters.keyword" placeholder="按活动名称或负责人搜索" clearable class="filter-item filter-item--wide" />

        <el-select v-model="filters.status" placeholder="活动状态" clearable class="filter-item">
          <el-option label="全部状态" value="" />
          <el-option label="待启动" value="upcoming" />
          <el-option label="进行中" value="running" />
          <el-option label="已结束" value="ended" />
        </el-select>

        <div class="campaign-filter-actions">
          <el-button type="primary" :loading="loading" @click="handleSearch">查询活动</el-button>
          <el-button @click="handleReset">重置筛选</el-button>
        </div>
      </div>
    </FilterToolbar>

    <el-card shadow="never" class="panel-card campaigns-list-card" v-loading="loading">
      <template #header>
        <div class="section-header">
          <div>
            <h3>活动列表</h3>
            <p>关注预算剩余、负责人、活动周期和转化结果，进入详情面板查看完整活动概览。</p>
          </div>
          <el-tag effect="plain" round>{{ total }} 个活动</el-tag>
        </div>
      </template>

      <section class="campaign-grid">
        <article v-for="campaign in campaigns" :key="campaign.id" class="campaign-card">
          <div class="campaign-card__header">
            <div>
              <h3>{{ campaign.name }}</h3>
              <p>{{ campaign.owner }} · {{ campaign.startAt }} 至 {{ campaign.endAt }}</p>
            </div>
            <el-tag :type="statusToneMap[campaign.status]" effect="plain" round>
              {{ statusLabelMap[campaign.status] }}
            </el-tag>
          </div>

          <div class="campaign-card__metrics">
            <div>
              <span>总预算</span>
              <strong>{{ formatAmount(campaign.budget) }}</strong>
            </div>
            <div>
              <span>已消耗</span>
              <strong>{{ formatAmount(campaign.spend) }}</strong>
            </div>
            <div>
              <span>转化率</span>
              <strong>{{ formatPercent(campaign.conversionRate) }}</strong>
            </div>
          </div>

          <div class="campaign-card__footer">
            <div>
              <span>剩余预算</span>
              <strong>{{ formatAmount(campaign.budget - campaign.spend) }}</strong>
            </div>

            <el-button type="primary" link @click="openDetail(campaign.id)">查看详情</el-button>
          </div>
        </article>
      </section>

      <div class="table-footer">
        <el-pagination
          v-model:current-page="filters.page"
          v-model:page-size="filters.pageSize"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="loadCampaigns"
          @size-change="loadCampaigns"
        />
      </div>
    </el-card>

    <CampaignDetailDialog v-model:visible="detailVisible" :campaign="currentCampaign" />
  </div>
</template>

<style scoped>
.campaigns-page,
.campaign-metrics,
.campaign-filter-bar,
.campaign-filter-actions,
.campaign-grid,
.campaign-card__metrics,
.campaign-card__footer {
  display: grid;
}

.campaign-metrics {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.campaigns-focus-card {
  width: 100%;
  padding: 20px;
  border: 1px solid rgba(191, 219, 254, 0.16);
  border-radius: 22px;
  background: rgba(15, 23, 42, 0.28);
}

.campaigns-focus-card__label,
.campaign-card__metrics span,
.campaign-card__footer span {
  font-size: 12px;
  color: rgba(191, 219, 254, 0.76);
}

.campaigns-focus-card strong {
  display: block;
  margin: 10px 0;
  color: #f8fafc;
  font-size: 22px;
}

.campaigns-focus-card p {
  margin: 0;
  color: rgba(226, 232, 240, 0.84);
  line-height: 1.75;
}

.campaign-filter-bar {
  grid-template-columns: minmax(0, 1fr) 220px auto;
  gap: 12px;
  width: 100%;
}

.filter-item--wide {
  width: 100%;
}

.campaign-filter-actions {
  grid-auto-flow: column;
  gap: 12px;
}

.campaigns-list-card {
  border: none;
}

.campaign-grid {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.campaign-card {
  padding: 22px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.94));
}

.campaign-card__header,
.campaign-card__footer {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 12px;
}

.campaign-card__header h3 {
  margin: 0 0 8px;
  color: var(--text-primary);
}

.campaign-card__header p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

.campaign-card__metrics {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 18px 0;
}

.campaign-card__metrics strong,
.campaign-card__footer strong {
  display: block;
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 18px;
}

.campaign-card__metrics span,
.campaign-card__footer span {
  color: var(--text-muted);
}

@media (max-width: 1280px) {
  .campaign-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 960px) {
  .campaign-filter-bar,
  .campaign-card__metrics {
    grid-template-columns: 1fr;
  }

  .campaign-filter-actions {
    grid-auto-flow: row;
  }
}

@media (max-width: 768px) {
  .campaign-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
