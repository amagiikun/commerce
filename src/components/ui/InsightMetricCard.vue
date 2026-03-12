<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    value: string;
    trend?: string;
    description?: string;
    tone?: 'brand' | 'success' | 'warning' | 'neutral';
  }>(),
  {
    trend: '',
    description: '',
    tone: 'brand',
  },
);

const toneClassMap = {
  brand: 'metric-card--brand',
  success: 'metric-card--success',
  warning: 'metric-card--warning',
  neutral: 'metric-card--neutral',
} as const;
</script>

<template>
  <el-card shadow="never" class="metric-card panel-card" :class="toneClassMap[props.tone]">
    <div class="metric-card__header">
      <span>{{ title }}</span>
      <el-tag v-if="trend" effect="plain" round class="metric-card__trend">{{ trend }}</el-tag>
    </div>

    <div class="metric-card__value">{{ value }}</div>
    <p v-if="description" class="metric-card__desc">{{ description }}</p>
  </el-card>
</template>

<style scoped>
.metric-card {
  border: none;
  min-height: 164px;
}

.metric-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 13px;
}

.metric-card__trend {
  border-color: transparent;
}

.metric-card__value {
  margin: 18px 0 10px;
  font-size: clamp(28px, 3vw, 34px);
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-primary);
}

.metric-card__desc {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.metric-card--brand {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96)),
    linear-gradient(120deg, rgba(99, 102, 241, 0.08), transparent 35%);
}

.metric-card--success .metric-card__trend {
  color: #166534;
  background: rgba(34, 197, 94, 0.12);
}

.metric-card--warning .metric-card__trend {
  color: #9a3412;
  background: rgba(249, 115, 22, 0.12);
}

.metric-card--neutral .metric-card__trend {
  color: #334155;
  background: rgba(148, 163, 184, 0.14);
}
</style>
