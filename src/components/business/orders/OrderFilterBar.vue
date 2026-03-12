<script setup lang="ts">
import FilterToolbar from '@/components/ui/FilterToolbar.vue';

defineProps<{
  keyword: string;
  status: string;
  channel: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:keyword', value: string): void;
  (event: 'update:status', value: string): void;
  (event: 'update:channel', value: string): void;
  (event: 'search'): void;
  (event: 'reset'): void;
}>();
</script>

<template>
  <FilterToolbar title="查询条件" description="按订单号、客户、状态和渠道快速定位待处理订单。">
    <div class="filter-fields">
      <el-input
        :model-value="keyword"
        placeholder="按订单号或客户名搜索"
        clearable
        class="filter-item"
        @update:model-value="emit('update:keyword', $event)"
      />

      <el-select
        :model-value="status"
        placeholder="订单状态"
        clearable
        class="filter-item"
        @update:model-value="emit('update:status', $event || '')"
      >
        <el-option label="全部状态" value="" />
        <el-option label="待支付" value="pending" />
        <el-option label="已支付" value="paid" />
        <el-option label="配送中" value="shipping" />
        <el-option label="已完成" value="completed" />
        <el-option label="退款中" value="refund" />
      </el-select>

      <el-select
        :model-value="channel"
        placeholder="下单渠道"
        clearable
        class="filter-item"
        @update:model-value="emit('update:channel', $event || '')"
      >
        <el-option label="全部渠道" value="" />
        <el-option label="App" value="App" />
        <el-option label="Web" value="Web" />
        <el-option label="小程序" value="小程序" />
      </el-select>
    </div>

    <div class="filter-actions">
      <el-button type="primary" :loading="loading" @click="emit('search')">查询</el-button>
      <el-button @click="emit('reset')">重置</el-button>
    </div>
  </FilterToolbar>
</template>

<style scoped>
.filter-fields,
.filter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-fields {
  flex: 1;
}

.filter-actions {
  min-width: fit-content;
}

.filter-item {
  width: 220px;
}

@media (max-width: 768px) {
  .filter-actions,
  .filter-item {
    width: 100%;
  }
}
</style>
