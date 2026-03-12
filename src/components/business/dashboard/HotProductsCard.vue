<script setup lang="ts">
import type { HotProduct } from '@/types';
import { formatAmount, formatCount } from '@/utils/format';

defineProps<{
  list: HotProduct[];
}>();
</script>

<template>
  <el-card shadow="never" class="panel-card hot-card">
    <template #header>
      <div class="section-header">
        <div>
          <h3>热销商品排行</h3>
          <p>按销售额与销量筛选出当前最值得持续加码的核心商品。</p>
        </div>
        <el-tag effect="plain" round>商品经营</el-tag>
      </div>
    </template>

    <div v-for="(item, index) in list" :key="item.id" class="hot-item">
      <div class="hot-item__left">
        <div class="hot-item__rank">{{ String(index + 1).padStart(2, '0') }}</div>
        <div>
          <strong>{{ item.name }}</strong>
          <p>销量 {{ formatCount(item.sales) }} · 销售额 {{ formatAmount(item.revenue) }}</p>
        </div>
      </div>

      <span class="hot-item__value">{{ formatAmount(item.revenue) }}</span>
    </div>
  </el-card>
</template>

<style scoped>
.hot-card {
  border: none;
}

.hot-item,
.hot-item__left {
  display: flex;
  align-items: center;
}

.hot-item {
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.hot-item:last-child {
  border-bottom: none;
}

.hot-item__left {
  gap: 14px;
}

.hot-item__rank {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(34, 211, 238, 0.12));
  color: #4338ca;
  font-weight: 700;
}

.hot-item strong {
  display: block;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.hot-item p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.hot-item__value {
  font-weight: 700;
  color: var(--text-primary);
}
</style>
