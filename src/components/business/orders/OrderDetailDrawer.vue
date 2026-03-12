<script setup lang="ts">
import { computed } from 'vue';
import type { OrderItem, OrderStatus } from '@/types';
import { formatAmount } from '@/utils/format';

const props = defineProps<{
  visible: boolean;
  loading?: boolean;
  order: OrderItem | null;
}>();

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
}>();

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

const itemCount = computed(() => props.order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0);

const progressSteps = computed(() => {
  if (!props.order) {
    return [];
  }

  const statusIndexMap: Record<OrderStatus, number> = {
    pending: 0,
    paid: 1,
    shipping: 2,
    completed: 3,
    refund: 2,
  };

  const activeIndex = statusIndexMap[props.order.status];

  return [
    { title: '订单创建', desc: props.order.createdAt, active: activeIndex >= 0 },
    { title: '支付确认', desc: props.order.status === 'pending' ? '等待支付完成' : '支付链路已确认', active: activeIndex >= 1 },
    {
      title: props.order.status === 'refund' ? '退款处理中' : '履约配送',
      desc: props.order.status === 'shipping' ? '仓配链路正在推进' : '系统按当前状态同步履约进度',
      active: activeIndex >= 2,
      warning: props.order.status === 'refund',
    },
    { title: '订单闭环', desc: props.order.status === 'completed' ? '已完成签收与服务确认' : '待最终完成', active: activeIndex >= 3 },
  ];
});
</script>

<template>
  <el-drawer
    :model-value="visible"
    size="520px"
    @close="emit('update:visible', false)"
    @update:model-value="emit('update:visible', $event)"
  >
    <template #header>
      <div v-if="order" class="drawer-hero">
        <div>
          <span class="drawer-hero__eyebrow">Order 360</span>
          <h3>{{ order.orderNo }}</h3>
          <p>{{ order.customerName }} · {{ order.channel }} 渠道 · {{ order.createdAt }}</p>
        </div>
        <el-tag :type="statusToneMap[order.status]" effect="dark" round>{{ statusLabelMap[order.status] }}</el-tag>
      </div>
      <div v-else class="drawer-empty-title">订单详情</div>
    </template>

    <div v-loading="loading" class="drawer-body">
      <template v-if="order">
        <section class="drawer-metrics">
          <div class="drawer-metric">
            <span>订单金额</span>
            <strong>{{ formatAmount(order.amount) }}</strong>
          </div>
          <div class="drawer-metric">
            <span>商品件数</span>
            <strong>{{ itemCount }}</strong>
          </div>
          <div class="drawer-metric">
            <span>履约状态</span>
            <strong>{{ statusLabelMap[order.status] }}</strong>
          </div>
        </section>

        <section class="drawer-section">
          <div class="drawer-section__header">
            <h4>客户与收货信息</h4>
            <span>履约视图</span>
          </div>
          <div class="drawer-info-grid">
            <div>
              <span>客户姓名</span>
              <strong>{{ order.customerName }}</strong>
            </div>
            <div>
              <span>下单渠道</span>
              <strong>{{ order.channel }}</strong>
            </div>
            <div class="drawer-info-grid__full">
              <span>收货地址</span>
              <strong>{{ order.address }}</strong>
            </div>
          </div>
        </section>

        <section class="drawer-section">
          <div class="drawer-section__header">
            <h4>商品清单</h4>
            <span>{{ order.items.length }} 个 SKU</span>
          </div>
          <div v-for="item in order.items" :key="item.name" class="item-row">
            <div>
              <strong>{{ item.name }}</strong>
              <p>履约已同步至订单明细</p>
            </div>
            <span>x{{ item.quantity }}</span>
          </div>
        </section>

        <section class="drawer-section">
          <div class="drawer-section__header">
            <h4>履约进度</h4>
            <span>订单全景</span>
          </div>
          <div class="progress-list">
            <div v-for="step in progressSteps" :key="step.title" class="progress-item" :class="{ active: step.active, warning: step.warning }">
              <i />
              <div>
                <strong>{{ step.title }}</strong>
                <p>{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </section>
      </template>

      <div v-else-if="loading" class="drawer-loading-state">
        <div class="drawer-loading-copy">
          <strong>订单详情加载中</strong>
          <p>正在同步最新履约信息，请稍候。</p>
        </div>
        <el-skeleton :rows="5" animated />
      </div>

      <el-empty v-else description="请选择订单查看详情" />
    </div>
  </el-drawer>
</template>

<style scoped>
.drawer-body,
.drawer-metrics,
.drawer-info-grid,
.progress-list,
.drawer-loading-state {
  display: grid;
}

.drawer-body,
.progress-list {
  gap: 18px;
}

.drawer-loading-state {
  gap: 16px;
}

.drawer-loading-copy strong {
  color: var(--text-primary);
  font-size: 16px;
}

.drawer-loading-copy p {
  margin: 8px 0 0;
  color: var(--text-muted);
  line-height: 1.7;
}

.drawer-hero h3,
.drawer-section__header h4,
.item-row strong {
  margin: 0;
}

.drawer-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.drawer-hero__eyebrow,
.drawer-section__header span,
.drawer-metric span,
.drawer-info-grid span,
.item-row p,
.progress-item p,
.drawer-empty-title {
  color: var(--text-muted);
  font-size: 12px;
}

.drawer-hero__eyebrow {
  display: inline-flex;
  margin-bottom: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.drawer-hero h3 {
  font-size: 24px;
  color: var(--text-primary);
}

.drawer-hero p,
.progress-item p,
.item-row p {
  margin: 8px 0 0;
  line-height: 1.7;
}

.drawer-metrics {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.drawer-metric,
.drawer-section {
  border-radius: 20px;
}

.drawer-metric {
  padding: 16px;
  background: linear-gradient(135deg, rgba(238, 242, 255, 0.84), rgba(248, 250, 252, 0.94));
}

.drawer-metric strong,
.drawer-info-grid strong,
.progress-item strong,
.item-row span {
  color: var(--text-primary);
}

.drawer-metric strong {
  display: block;
  margin-top: 10px;
  font-size: 18px;
}

.drawer-section {
  padding: 18px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(248, 250, 252, 0.72);
}

.drawer-section__header,
.item-row,
.progress-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.drawer-section__header {
  margin-bottom: 14px;
}

.drawer-info-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.drawer-info-grid__full {
  grid-column: 1 / -1;
}

.drawer-info-grid strong {
  display: block;
  margin-top: 8px;
  line-height: 1.7;
}

.item-row {
  padding: 14px 0;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.item-row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.progress-item i {
  width: 12px;
  height: 12px;
  margin-top: 4px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.42);
  box-shadow: 0 0 0 5px rgba(148, 163, 184, 0.12);
}

.progress-item.active i {
  background: #6366f1;
  box-shadow: 0 0 0 5px rgba(99, 102, 241, 0.14);
}

.progress-item.warning i {
  background: #f97316;
  box-shadow: 0 0 0 5px rgba(249, 115, 22, 0.14);
}

@media (max-width: 768px) {
  .drawer-metrics,
  .drawer-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
