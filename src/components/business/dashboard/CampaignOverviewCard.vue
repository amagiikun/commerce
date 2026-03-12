<script setup lang="ts">
import { formatAmount, formatPercent } from '@/utils/format';

defineProps<{
  summary: {
    activeCount: number;
    conversionRate: number;
    spend: number;
  };
}>();
</script>

<template>
  <el-card shadow="never" class="panel-card campaign-card">
    <template #header>
      <div class="section-header">
        <div>
          <h3>活动投放总览</h3>
          <p>统一关注在投活动规模、整体转化效率与预算消耗情况。</p>
        </div>
        <el-tag effect="plain" round>营销驾驶舱</el-tag>
      </div>
    </template>

    <div class="campaign-grid">
      <div class="campaign-metric">
        <span>进行中活动</span>
        <strong>{{ summary.activeCount }}</strong>
      </div>
      <div class="campaign-metric">
        <span>整体转化率</span>
        <strong>{{ formatPercent(summary.conversionRate) }}</strong>
      </div>
      <div class="campaign-metric">
        <span>累计投放消耗</span>
        <strong>{{ formatAmount(summary.spend) }}</strong>
      </div>
    </div>

    <div class="campaign-note">
      <span>运营提示</span>
      <p>建议持续关注 ROI 高于均值的活动组，并对转化波动较大的渠道做分层复盘。</p>
    </div>
  </el-card>
</template>

<style scoped>
.campaign-card {
  border: none;
}

.campaign-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.campaign-metric,
.campaign-note {
  border-radius: 18px;
}

.campaign-metric {
  padding: 18px;
  background: linear-gradient(135deg, rgba(238, 242, 255, 0.9), rgba(248, 250, 252, 0.92));
}

.campaign-metric span,
.campaign-note span {
  display: block;
  margin-bottom: 8px;
  color: var(--text-muted);
}

.campaign-metric strong {
  font-size: 24px;
  color: var(--text-primary);
}

.campaign-note {
  margin-top: 16px;
  padding: 18px 20px;
  border: 1px solid rgba(99, 102, 241, 0.12);
  background: rgba(248, 250, 252, 0.72);
}

.campaign-note p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.75;
}

@media (max-width: 960px) {
  .campaign-grid {
    grid-template-columns: 1fr;
  }
}
</style>
