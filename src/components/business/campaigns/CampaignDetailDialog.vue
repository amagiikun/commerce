<script setup lang="ts">
import type { CampaignItem, CampaignStatus } from '@/types';
import { formatAmount, formatPercent } from '@/utils/format';

defineProps<{
  visible: boolean;
  campaign: CampaignItem | null;
}>();

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
}>();

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
</script>

<template>
  <el-dialog
    :model-value="visible"
    width="720px"
    class="campaign-dialog"
    @update:model-value="emit('update:visible', $event)"
  >
    <template #header>
      <div v-if="campaign" class="dialog-hero">
        <div>
          <span class="dialog-hero__eyebrow">Campaign Overview</span>
          <h3>{{ campaign.name }}</h3>
          <p>{{ campaign.owner }} · {{ campaign.startAt }} 至 {{ campaign.endAt }}</p>
        </div>
        <el-tag :type="statusToneMap[campaign.status]" effect="dark" round>
          {{ statusLabelMap[campaign.status] }}
        </el-tag>
      </div>
    </template>

    <template v-if="campaign">
      <section class="dialog-metrics">
        <div class="dialog-metric">
          <span>总预算</span>
          <strong>{{ formatAmount(campaign.budget) }}</strong>
        </div>
        <div class="dialog-metric">
          <span>已消耗</span>
          <strong>{{ formatAmount(campaign.spend) }}</strong>
        </div>
        <div class="dialog-metric">
          <span>转化率</span>
          <strong>{{ formatPercent(campaign.conversionRate) }}</strong>
        </div>
      </section>

      <section class="dialog-section">
        <div class="dialog-section__header">
          <h4>活动信息</h4>
          <span>策略与节奏</span>
        </div>

        <div class="dialog-info-grid">
          <div>
            <span>负责人</span>
            <strong>{{ campaign.owner }}</strong>
          </div>
          <div>
            <span>活动周期</span>
            <strong>{{ campaign.startAt }} 至 {{ campaign.endAt }}</strong>
          </div>
          <div>
            <span>预算剩余</span>
            <strong>{{ formatAmount(campaign.budget - campaign.spend) }}</strong>
          </div>
          <div>
            <span>阶段状态</span>
            <strong>{{ statusLabelMap[campaign.status] }}</strong>
          </div>
        </div>
      </section>

      <section class="dialog-section">
        <div class="dialog-section__header">
          <h4>运营建议</h4>
          <span>复盘方向</span>
        </div>

        <div class="dialog-note">
          <p>
            {{ campaign.status === 'running'
              ? '建议持续盯住预算消耗与转化效率的关系，优先追加表现稳定的渠道。'
              : campaign.status === 'upcoming'
                ? '活动即将启动，建议提前完成素材、渠道与目标人群的联调确认。'
                : '活动已结束，可复盘预算利用率、目标达成度与后续复用策略。'
            }}
          </p>
        </div>
      </section>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-hero,
.dialog-metrics,
.dialog-info-grid {
  display: grid;
}

.dialog-hero {
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: start;
}

.dialog-hero__eyebrow,
.dialog-section__header span,
.dialog-metric span,
.dialog-info-grid span {
  color: var(--text-muted);
  font-size: 12px;
}

.dialog-hero__eyebrow {
  display: inline-flex;
  margin-bottom: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.dialog-hero h3,
.dialog-section__header h4 {
  margin: 0;
}

.dialog-hero h3 {
  color: var(--text-primary);
  font-size: 28px;
}

.dialog-hero p,
.dialog-note p {
  margin: 10px 0 0;
  color: var(--text-secondary);
  line-height: 1.75;
}

.dialog-metrics {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.dialog-metric,
.dialog-section {
  border-radius: 20px;
}

.dialog-metric {
  padding: 18px;
  background: linear-gradient(135deg, rgba(238, 242, 255, 0.88), rgba(248, 250, 252, 0.94));
}

.dialog-metric strong,
.dialog-info-grid strong {
  display: block;
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 18px;
  line-height: 1.6;
}

.dialog-section {
  padding: 18px;
  margin-top: 18px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(248, 250, 252, 0.76);
}

.dialog-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.dialog-info-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.dialog-note {
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
}

@media (max-width: 768px) {
  .dialog-metrics,
  .dialog-info-grid,
  .dialog-hero {
    grid-template-columns: 1fr;
  }
}
</style>
