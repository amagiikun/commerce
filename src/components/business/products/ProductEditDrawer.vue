<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import type { ProductItem, ProductStatus } from '@/types';
import { formatAmount, formatCount } from '@/utils/format';

const props = defineProps<{
  visible: boolean;
  product: ProductItem | null;
  saving?: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'save', value: Partial<ProductItem>): void;
}>();

const formState = reactive<Partial<ProductItem>>({
  id: '',
  name: '',
  category: '',
  price: 0,
  stock: 0,
  sales: 0,
  status: 'draft',
  updatedAt: '',
});

const statusOptions: Array<{ label: string; value: ProductStatus }> = [
  { label: '在售中', value: 'on_sale' },
  { label: '待发布', value: 'draft' },
  { label: '已售罄', value: 'sold_out' },
];

const statusText = computed(() => {
  const map: Record<ProductStatus, string> = {
    on_sale: '当前正在销售，适合持续观察转化与库存。',
    draft: '当前处于待发布状态，可先整理文案和价格。',
    sold_out: '当前已售罄，建议评估补货与活动联动。',
  };

  return map[(formState.status as ProductStatus) || 'draft'];
});

watch(
  () => props.product,
  (product) => {
    if (!product) {
      Object.assign(formState, {
        id: '',
        name: '',
        category: '',
        price: 0,
        stock: 0,
        sales: 0,
        status: 'draft',
        updatedAt: '',
      });
      return;
    }

    Object.assign(formState, product);
  },
  { immediate: true },
);

function closeDrawer() {
  emit('update:visible', false);
}

function handleSave() {
  emit('save', { ...formState });
}
</script>

<template>
  <el-drawer
    :model-value="visible"
    size="480px"
    :with-header="false"
    @close="closeDrawer"
    @update:model-value="emit('update:visible', $event)"
  >
    <div class="product-drawer">
      <div class="product-drawer__hero">
        <span class="product-drawer__eyebrow">Product Console</span>
        <h2>{{ formState.name || '编辑商品' }}</h2>
        <p>{{ statusText }}</p>

        <div class="product-drawer__chips">
          <el-tag effect="dark" round>{{ formState.category || '待补充类目' }}</el-tag>
          <el-tag round type="primary">{{ formState.id || '未分配 ID' }}</el-tag>
        </div>
      </div>

      <div class="product-drawer__summary">
        <div class="product-drawer__summary-item">
          <span>当前售价</span>
          <strong>{{ formatAmount(Number(formState.price || 0)) }}</strong>
        </div>
        <div class="product-drawer__summary-item">
          <span>累计销量</span>
          <strong>{{ formatCount(Number(formState.sales || 0)) }}</strong>
        </div>
        <div class="product-drawer__summary-item">
          <span>最近更新</span>
          <strong>{{ formState.updatedAt || '待更新' }}</strong>
        </div>
      </div>

      <el-form label-position="top" class="product-drawer__form">
        <section class="product-drawer__section">
          <div class="product-drawer__section-title">
            <h3>商品基础信息</h3>
            <p>补充商品名称与类目，保证列表呈现和搜索识别稳定。</p>
          </div>

          <div class="product-drawer__grid">
            <el-form-item label="商品名称">
              <el-input v-model="formState.name" />
            </el-form-item>
            <el-form-item label="商品类目">
              <el-input v-model="formState.category" />
            </el-form-item>
          </div>
        </section>

        <section class="product-drawer__section">
          <div class="product-drawer__section-title">
            <h3>价格与库存</h3>
            <p>让价格、库存与活动节奏保持同步，降低售罄和积压风险。</p>
          </div>

          <div class="product-drawer__grid">
            <el-form-item label="销售价格">
              <el-input-number v-model="formState.price" :min="0" :step="10" class="full-width" />
            </el-form-item>
            <el-form-item label="库存数量">
              <el-input-number v-model="formState.stock" :min="0" class="full-width" />
            </el-form-item>
          </div>
        </section>

        <section class="product-drawer__section">
          <div class="product-drawer__section-title">
            <h3>经营状态</h3>
            <p>根据库存和投放节奏调整商品状态，保持商品池质量。</p>
          </div>

          <el-form-item>
            <el-radio-group v-model="formState.status" class="product-drawer__status-group">
              <el-radio-button v-for="item in statusOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </section>
      </el-form>
    </div>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="closeDrawer">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存调整</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.product-drawer,
.product-drawer__summary,
.product-drawer__grid,
.product-drawer__chips {
  display: grid;
}

.product-drawer {
  gap: 20px;
}

.product-drawer__hero {
  padding: 20px;
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(99, 102, 241, 0.16), transparent 36%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98));
}

.product-drawer__eyebrow,
.product-drawer__summary-item span {
  color: rgba(191, 219, 254, 0.78);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.product-drawer__hero h2 {
  margin: 14px 0 10px;
  color: #f8fafc;
  font-size: 28px;
}

.product-drawer__hero p {
  margin: 0;
  color: rgba(226, 232, 240, 0.82);
  line-height: 1.75;
}

.product-drawer__chips {
  grid-auto-flow: column;
  justify-content: start;
  gap: 10px;
  margin-top: 16px;
}

.product-drawer__summary {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.product-drawer__summary-item {
  padding: 16px;
  border-radius: 18px;
  background: rgba(238, 242, 255, 0.82);
}

.product-drawer__summary-item strong {
  display: block;
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.5;
}

.product-drawer__form,
.product-drawer__section {
  display: grid;
  gap: 14px;
}

.product-drawer__section {
  padding: 18px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.68);
}

.product-drawer__section-title h3 {
  margin: 0 0 6px;
  color: var(--text-primary);
  font-size: 16px;
}

.product-drawer__section-title p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.product-drawer__grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.product-drawer__status-group {
  width: 100%;
}

.full-width {
  width: 100%;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .product-drawer__summary,
  .product-drawer__grid {
    grid-template-columns: 1fr;
  }
}
</style>
