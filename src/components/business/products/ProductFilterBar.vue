<script setup lang="ts">
import FilterToolbar from '@/components/ui/FilterToolbar.vue';

defineProps<{
  keyword: string;
  category: string;
  status: string;
  categories: string[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:keyword', value: string): void;
  (event: 'update:category', value: string): void;
  (event: 'update:status', value: string): void;
  (event: 'search'): void;
  (event: 'reset'): void;
}>();
</script>

<template>
  <FilterToolbar title="筛选与经营动作" description="按类目、状态和关键词快速定位重点商品，缩短巡检和编辑路径。">
    <div class="product-filter-bar">
      <el-input
        :model-value="keyword"
        placeholder="按商品名称或 ID 搜索"
        clearable
        class="filter-item filter-item--wide"
        @update:model-value="emit('update:keyword', $event)"
      />

      <el-select
        :model-value="category"
        placeholder="商品类目"
        clearable
        class="filter-item"
        @update:model-value="emit('update:category', $event || '')"
      >
        <el-option label="全部类目" value="" />
        <el-option v-for="item in categories" :key="item" :label="item" :value="item" />
      </el-select>

      <el-select
        :model-value="status"
        placeholder="经营状态"
        clearable
        class="filter-item"
        @update:model-value="emit('update:status', $event || '')"
      >
        <el-option label="全部状态" value="" />
        <el-option label="在售中" value="on_sale" />
        <el-option label="待发布" value="draft" />
        <el-option label="已售罄" value="sold_out" />
      </el-select>

      <div class="filter-actions">
        <el-button type="primary" :loading="loading" @click="emit('search')">查询商品</el-button>
        <el-button @click="emit('reset')">重置筛选</el-button>
      </div>
    </div>

    <div class="filter-insights">
      <span>已识别 {{ categories.length }} 个重点类目</span>
      <span>适合日常巡检、库存排查与批量编辑</span>
    </div>
  </FilterToolbar>
</template>

<style scoped>
.product-filter-bar,
.filter-actions,
.filter-insights {
  display: flex;
  align-items: center;
}

.product-filter-bar,
.filter-insights {
  flex-wrap: wrap;
}

.product-filter-bar {
  gap: 12px;
  width: 100%;
}

.filter-item {
  width: 220px;
}

.filter-item--wide {
  width: 300px;
}

.filter-actions {
  gap: 12px;
  margin-left: auto;
}

.filter-insights {
  gap: 10px;
  width: 100%;
  margin-top: 2px;
}

.filter-insights span {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(238, 242, 255, 0.88);
  color: var(--text-secondary);
  font-size: 12px;
}

@media (max-width: 960px) {
  .filter-item,
  .filter-item--wide {
    width: 100%;
  }

  .filter-actions {
    margin-left: 0;
  }
}
</style>
