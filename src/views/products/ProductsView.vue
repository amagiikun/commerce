<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import ProductEditDrawer from '@/components/business/products/ProductEditDrawer.vue';
import ProductFilterBar from '@/components/business/products/ProductFilterBar.vue';
import InsightMetricCard from '@/components/ui/InsightMetricCard.vue';
import PageHero from '@/components/ui/PageHero.vue';
import { fetchProducts, updateProduct } from '@/api/product';
import type { ProductFilter, ProductItem, ProductStatus } from '@/types';
import { buildListQueryParams } from '@/utils/query';
import { formatAmount, formatCount } from '@/utils/format';

const loading = ref(false);
const saving = ref(false);
const total = ref(0);
const products = ref<ProductItem[]>([]);
const drawerVisible = ref(false);
const currentProduct = ref<ProductItem | null>(null);

const filters = reactive<ProductFilter>({
  page: 1,
  pageSize: 8,
  keyword: '',
  category: '',
  status: '',
});

const categories = computed(() => Array.from(new Set(products.value.map((item) => item.category))));

const heroMeta = computed(() => {
  const activeFilterCount = [filters.keyword, filters.category, filters.status].filter(Boolean).length;

  return [
    `商品总量 ${formatCount(total.value)}`,
    `重点类目 ${formatCount(categories.value.length)}`,
    activeFilterCount ? `已启用 ${activeFilterCount} 个筛选条件` : '当前为全量经营视图',
  ];
});

const productMetrics = computed(() => {
  const onSaleCount = products.value.filter((item) => item.status === 'on_sale').length;
  const lowStockCount = products.value.filter((item) => item.stock > 0 && item.stock <= 100).length;
  const soldOutCount = products.value.filter((item) => item.status === 'sold_out' || item.stock === 0).length;
  const salesValue = products.value.reduce((sum, item) => sum + item.sales, 0);

  return [
    {
      title: '在售商品',
      value: formatCount(onSaleCount),
      trend: '+6.3%',
      description: '在售池保持稳定，适合继续关注高转化单品。',
      tone: 'brand' as const,
    },
    {
      title: '库存预警',
      value: formatCount(lowStockCount),
      trend: lowStockCount ? '需补货' : '库存健康',
      description: '库存低于 100 的商品需要及时评估补货节奏。',
      tone: lowStockCount ? ('warning' as const) : ('success' as const),
    },
    {
      title: '售罄商品',
      value: formatCount(soldOutCount),
      trend: soldOutCount ? '待处理' : '已清零',
      description: '售罄商品建议联动营销排期与复购活动。',
      tone: soldOutCount ? ('neutral' as const) : ('success' as const),
    },
    {
      title: '累计销量',
      value: formatCount(salesValue),
      trend: '+11.4%',
      description: '用销量变化判断主推单品与低效 SKU 的去留。',
      tone: 'success' as const,
    },
  ];
});

const topProduct = computed(() => {
  if (!products.value.length) {
    return null;
  }

  return [...products.value].sort((left, right) => right.sales - left.sales)[0];
});

async function loadProducts() {
  loading.value = true;

  try {
    const result = await fetchProducts(buildListQueryParams(filters));
    products.value = result.list;
    total.value = result.total;
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  filters.page = 1;
  loadProducts();
}

function handleReset() {
  filters.keyword = '';
  filters.category = '';
  filters.status = '';
  filters.page = 1;
  loadProducts();
}

function openEditDrawer(product: ProductItem) {
  currentProduct.value = { ...product };
  drawerVisible.value = true;
}

async function handleSave(payload: Partial<ProductItem>) {
  if (!currentProduct.value) {
    return;
  }

  saving.value = true;

  try {
    await updateProduct(currentProduct.value.id, payload);
    ElMessage.success('商品信息已更新');
    drawerVisible.value = false;
    await loadProducts();
  } finally {
    saving.value = false;
  }
}

async function handleToggleStatus(row: ProductItem, enabled: boolean | string | number) {
  const status: ProductStatus = enabled ? 'on_sale' : 'draft';
  await updateProduct(row.id, { status });
  ElMessage.success('商品经营状态已更新');
  loadProducts();
}

function resolveStatusConfig(status: ProductStatus) {
  const map = {
    on_sale: { text: '在售中', type: 'success' },
    draft: { text: '待发布', type: 'info' },
    sold_out: { text: '已售罄', type: 'warning' },
  } as const;

  return map[status];
}

onMounted(loadProducts);
</script>

<template>
  <div class="page-shell products-page">
    <PageHero
      eyebrow="Products"
      title="品牌商品经营台"
      description="把商品巡检、库存风险、经营状态与编辑动作收拢到一个页面里，提升运营排查和动作转化效率。"
      tag="Merch Ops"
      :meta="heroMeta"
    >
      <template #actions>
        <el-button plain>导出商品概览</el-button>
        <el-button type="primary" disabled>新增商品</el-button>
      </template>

      <template #extra>
        <div class="products-focus-card">
          <span class="products-focus-card__label">今日经营关注</span>
          <strong>{{ topProduct?.name || '等待商品数据' }}</strong>
          <p>
            {{
              topProduct
                ? `销量 ${formatCount(topProduct.sales)}，库存 ${formatCount(topProduct.stock)}，适合持续关注补货与活动配合。`
                : '待数据返回后展示重点商品。'
            }}
          </p>
        </div>
      </template>
    </PageHero>

    <section class="products-metrics">
      <InsightMetricCard
        v-for="metric in productMetrics"
        :key="metric.title"
        :title="metric.title"
        :value="metric.value"
        :trend="metric.trend"
        :description="metric.description"
        :tone="metric.tone"
      />
    </section>

    <ProductFilterBar
      v-model:keyword="filters.keyword"
      v-model:category="filters.category"
      v-model:status="filters.status"
      :categories="categories"
      :loading="loading"
      @search="handleSearch"
      @reset="handleReset"
    />

    <el-card shadow="never" class="panel-card table-card" v-loading="loading">
      <div class="section-header table-card__header">
        <div>
          <h3>商品经营列表</h3>
          <p>从列表中快速识别高销量、低库存和待处理状态，减少逐行排查成本。</p>
        </div>
        <el-tag effect="plain" round>当前结果 {{ formatCount(total) }}</el-tag>
      </div>

      <el-table :data="products" stripe>
        <el-table-column label="商品信息" min-width="280">
          <template #default="{ row }">
            <div class="products-table__name">
              <strong>{{ row.name }}</strong>
              <span>{{ row.id }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="类目 / 定价" min-width="180">
          <template #default="{ row }">
            <div class="products-table__meta">
              <el-tag effect="plain" round>{{ row.category }}</el-tag>
              <strong>{{ formatAmount(row.price) }}</strong>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="库存状态" min-width="160">
          <template #default="{ row }">
            <div class="products-table__stock">
              <strong>{{ formatCount(row.stock) }}</strong>
              <span :class="{ warning: row.stock > 0 && row.stock <= 100, danger: row.stock === 0 }">
                {{ row.stock === 0 ? '已售罄' : row.stock <= 100 ? '库存预警' : '库存充足' }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="经营信号" min-width="160">
          <template #default="{ row }">
            <div class="products-table__sales">
              <strong>{{ formatCount(row.sales) }}</strong>
              <span>{{ row.sales >= 1000 ? '主推单品' : row.sales >= 500 ? '稳定动销' : '待提升' }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="经营状态" min-width="170">
          <template #default="{ row }">
            <div class="products-table__status">
              <el-tag :type="resolveStatusConfig(row.status).type" effect="light">
                {{ resolveStatusConfig(row.status).text }}
              </el-tag>
              <el-switch
                :model-value="row.status === 'on_sale'"
                inline-prompt
                active-text="在售"
                inactive-text="暂停"
                @change="handleToggleStatus(row, $event)"
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="updatedAt" label="最近更新" min-width="170" />

        <el-table-column label="操作" fixed="right" min-width="120">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEditDrawer(row)">编辑商品</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <el-pagination
          v-model:current-page="filters.page"
          v-model:page-size="filters.pageSize"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="loadProducts"
          @size-change="loadProducts"
        />
      </div>
    </el-card>

    <ProductEditDrawer
      v-model:visible="drawerVisible"
      :product="currentProduct"
      :saving="saving"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.products-page,
.products-metrics,
.products-table__name,
.products-table__meta,
.products-table__stock,
.products-table__sales,
.products-table__status {
  display: grid;
}

.products-page,
.products-metrics {
  gap: 16px;
}

.products-metrics {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.products-focus-card {
  width: 100%;
  padding: 20px;
  border: 1px solid rgba(191, 219, 254, 0.16);
  border-radius: 22px;
  background: rgba(15, 23, 42, 0.28);
}

.products-focus-card__label,
.products-table__name span,
.products-table__stock span,
.products-table__sales span {
  font-size: 12px;
}

.products-focus-card__label {
  color: rgba(191, 219, 254, 0.78);
}

.products-focus-card strong {
  display: block;
  margin: 10px 0;
  color: #f8fafc;
  font-size: 22px;
}

.products-focus-card p {
  margin: 0;
  color: rgba(226, 232, 240, 0.82);
  line-height: 1.75;
}

.table-card {
  border: none;
}

.table-card__header {
  margin-bottom: 18px;
}

.products-table__name,
.products-table__meta,
.products-table__stock,
.products-table__sales,
.products-table__status {
  gap: 6px;
}

.products-table__name strong,
.products-table__meta strong,
.products-table__stock strong,
.products-table__sales strong {
  color: var(--text-primary);
}

.products-table__name span,
.products-table__stock span,
.products-table__sales span {
  color: var(--text-muted);
}

.products-table__stock span.warning {
  color: #b45309;
}

.products-table__stock span.danger {
  color: #dc2626;
}

.products-table__status {
  align-items: start;
}

@media (max-width: 1280px) {
  .products-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .products-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
