<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import OrderDetailDrawer from '@/components/business/orders/OrderDetailDrawer.vue';
import OrderFilterBar from '@/components/business/orders/OrderFilterBar.vue';
import PageHero from '@/components/ui/PageHero.vue';
import InsightMetricCard from '@/components/ui/InsightMetricCard.vue';
import { fetchOrderDetail, fetchOrders } from '@/api/order';
import type { OrderFilter, OrderItem, OrderStatus } from '@/types';
import { buildListQueryParams } from '@/utils/query';
import { formatAmount, formatCount } from '@/utils/format';

const loading = ref(false);
const detailLoading = ref(false);
const total = ref(0);
const orders = ref<OrderItem[]>([]);
const detailVisible = ref(false);
const currentOrder = ref<OrderItem | null>(null);
let detailRequestId = 0;

const filters = reactive<OrderFilter>({
  page: 1,
  pageSize: 5,
  keyword: '',
  status: '',
  channel: '',
});

const statusLabelMap: Record<OrderStatus, string> = {
  pending: '待支付',
  paid: '已支付',
  shipping: '配送中',
  completed: '已完成',
  refund: '退款中',
};

const statusToneMap: Record<OrderStatus, 'info' | 'primary' | 'warning' | 'success' | 'danger'> = {
  pending: 'info',
  paid: 'primary',
  shipping: 'warning',
  completed: 'success',
  refund: 'danger',
};

function getStatusLabel(status: OrderStatus) {
  return statusLabelMap[status];
}

function getStatusTone(status: OrderStatus) {
  return statusToneMap[status];
}

const heroMeta = computed(() => [
  `订单总量 ${formatCount(total.value)}`,
  `筛选渠道 ${filters.channel || '全部渠道'}`,
  `页内同步 ${formatCount(orders.value.length)} 条`,
]);

const orderMetrics = computed(() => {
  const byStatus = (status: OrderStatus) => orders.value.filter((item) => item.status === status).length;
  const amount = orders.value.reduce((sum, item) => sum + item.amount, 0);

  return [
    {
      title: '待处理订单',
      value: formatCount(byStatus('pending') + byStatus('paid')),
      trend: '需跟进',
      description: '待支付与已支付订单建议优先核查，避免履约延迟。',
      tone: 'warning' as const,
    },
    {
      title: '配送中订单',
      value: formatCount(byStatus('shipping')),
      trend: '履约中',
      description: '重点关注节点超时与物流异常，必要时联动仓配。',
      tone: 'brand' as const,
    },
    {
      title: '已完成订单',
      value: formatCount(byStatus('completed')),
      trend: '稳定',
      description: '已签收闭环订单可作为复购触达的重点对象。',
      tone: 'success' as const,
    },
    {
      title: '当前页订单金额',
      value: formatAmount(amount),
      trend: '实时视图',
      description: '当前页订单金额合计，可用于快速评估履约优先级。',
      tone: 'neutral' as const,
    },
  ];
});

const focusSummary = computed(() => {
  const refundCount = orders.value.filter((item) => item.status === 'refund').length;
  const topChannel = orders.value.reduce(
    (acc, item) => {
      acc[item.channel] = (acc[item.channel] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const leadChannel = Object.entries(topChannel).sort((left, right) => right[1] - left[1])[0]?.[0] ?? '全部渠道';

  return {
    title: refundCount ? '异常订单需要优先处理' : '履约状态整体稳定',
    description: refundCount
      ? `当前有 ${formatCount(refundCount)} 笔退款中订单，建议优先检查客服与售后反馈。`
      : '当前页未发现退款中的订单，可继续关注支付到发货的转化效率。',
    leadChannel,
  };
});

async function loadOrders() {
  loading.value = true;

  try {
    const result = await fetchOrders(buildListQueryParams(filters));
    orders.value = result.list;
    total.value = result.total;
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  filters.page = 1;
  loadOrders();
}

function handleReset() {
  filters.keyword = '';
  filters.status = '';
  filters.channel = '';
  filters.page = 1;
  loadOrders();
}

async function openDetail(order: OrderItem) {
  const requestId = ++detailRequestId;

  currentOrder.value = order;
  detailVisible.value = true;
  detailLoading.value = true;

  try {
    const detail = await fetchOrderDetail(order.id);

    if (requestId === detailRequestId) {
      currentOrder.value = detail;
    }
  } catch (error) {
    if (requestId === detailRequestId) {
      const message = error instanceof Error ? error.message : '订单详情加载失败';
      ElMessage.error(message);
    }
  } finally {
    if (requestId === detailRequestId) {
      detailLoading.value = false;
    }
  }
}

function handleDetailVisibleChange(value: boolean) {
  detailVisible.value = value;

  if (!value) {
    detailRequestId += 1;
    detailLoading.value = false;
  }
}

onMounted(loadOrders);
</script>

<template>
  <div class="page-shell orders-page">
    <PageHero
      eyebrow="Orders"
      title="履约运营台"
      description="把待处理订单、履约状态、渠道分布和订单详情放在同一套视图里，方便运营快速做优先级判断。"
      tag="Fulfillment View"
      :meta="heroMeta"
    >
      <template #actions>
        <el-button plain>导出订单</el-button>
        <el-button type="primary" :loading="loading" @click="loadOrders">刷新列表</el-button>
      </template>

      <template #extra>
        <div class="orders-hero-card">
          <span class="orders-hero-card__label">履约焦点</span>
          <strong>{{ focusSummary.title }}</strong>
          <p>{{ focusSummary.description }}</p>
          <el-tag effect="plain" round>主渠道：{{ focusSummary.leadChannel }}</el-tag>
        </div>
      </template>
    </PageHero>

    <section class="orders-kpi-grid" v-loading="loading">
      <InsightMetricCard
        v-for="item in orderMetrics"
        :key="item.title"
        :title="item.title"
        :value="item.value"
        :trend="item.trend"
        :description="item.description"
        :tone="item.tone"
      />
    </section>

    <OrderFilterBar
      v-model:keyword="filters.keyword"
      v-model:status="filters.status"
      v-model:channel="filters.channel"
      :loading="loading"
      @search="handleSearch"
      @reset="handleReset"
    />

    <el-card shadow="never" class="panel-card orders-table-card" v-loading="loading">
      <template #header>
        <div class="section-header">
          <div>
            <h3>订单列表</h3>
            <p>按状态、渠道和金额快速筛选订单，进入详情抽屉查看完整履约视图。</p>
          </div>
          <el-tag effect="plain" round>{{ formatCount(total) }} 笔订单</el-tag>
        </div>
      </template>

      <el-table :data="orders" stripe>
        <el-table-column prop="orderNo" label="订单号" min-width="180" />

        <el-table-column label="客户与地址" min-width="240">
          <template #default="{ row }">
            <div class="customer-cell">
              <strong>{{ row.customerName }}</strong>
              <p>{{ row.address }}</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="渠道 / 商品" min-width="150">
          <template #default="{ row }">
            <div class="channel-cell">
              <strong>{{ row.channel }}</strong>
              <p>{{ formatCount(row.items.length) }} 个 SKU</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="履约状态" min-width="150">
          <template #default="{ row }">
            <div class="status-cell">
              <el-tag :type="getStatusTone(row.status)" effect="plain" round>{{ getStatusLabel(row.status) }}</el-tag>
              <p>{{ row.status === 'refund' ? '需售后介入' : '流程同步正常' }}</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="创建时间" min-width="170" />

        <el-table-column label="订单金额" min-width="140" align="right">
          <template #default="{ row }">
            <strong class="amount-cell">{{ formatAmount(row.amount) }}</strong>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" min-width="120">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <el-pagination
          v-model:current-page="filters.page"
          v-model:page-size="filters.pageSize"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="loadOrders"
          @size-change="loadOrders"
        />
      </div>
    </el-card>

    <OrderDetailDrawer
      :visible="detailVisible"
      :order="currentOrder"
      :loading="detailLoading"
      @update:visible="handleDetailVisibleChange"
    />
  </div>
</template>

<style scoped>
.orders-page,
.orders-kpi-grid {
  display: grid;
}

.orders-kpi-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.orders-hero-card {
  display: grid;
  gap: 10px;
  width: 100%;
  padding: 20px;
  border: 1px solid rgba(191, 219, 254, 0.16);
  border-radius: 22px;
  background: rgba(15, 23, 42, 0.28);
}

.orders-hero-card__label,
.customer-cell p,
.channel-cell p,
.status-cell p {
  color: var(--text-muted);
  font-size: 12px;
}

.orders-hero-card strong {
  color: #f8fafc;
  font-size: 22px;
}

.orders-hero-card p {
  margin: 0;
  color: rgba(226, 232, 240, 0.82);
  line-height: 1.7;
}

.orders-table-card {
  border: none;
}

.customer-cell strong,
.channel-cell strong,
.amount-cell {
  color: var(--text-primary);
}

.customer-cell p,
.channel-cell p,
.status-cell p {
  margin: 6px 0 0;
  line-height: 1.6;
}

.status-cell {
  display: grid;
  gap: 8px;
}

.amount-cell {
  font-size: 16px;
}

@media (max-width: 1280px) {
  .orders-kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .orders-kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
