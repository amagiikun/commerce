<template>
  <div class="header-shell panel-card">
    <div class="header-context">
      <div class="header-context__top">
        <el-button circle plain class="header-context__toggle" @click="appStore.toggleSidebar">
          <el-icon><component :is="appStore.sidebarCollapsed ? Expand : Fold" /></el-icon>
        </el-button>
        <span class="header-context__eyebrow">
          <i class="brand-dot" />
          Smart Commerce Brand Console
        </span>
      </div>

      <div class="header-context__title-group">
        <div>
          <h1>{{ currentTitle }}</h1>
          <p>{{ currentDescription }}</p>
        </div>

        <el-breadcrumb separator="/" class="header-context__breadcrumb">
          <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
            {{ item.meta.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <div class="header-actions">
      <div class="header-actions__status">
        <span>当前角色</span>
        <strong>{{ roleText }}</strong>
      </div>

      <el-button circle plain aria-label="通知中心">
        <el-icon><Bell /></el-icon>
      </el-button>

      <el-dropdown>
        <button class="user-box" type="button">
          <el-avatar :size="42" class="user-box__avatar">{{ avatarText }}</el-avatar>
          <span class="user-box__meta">
            <strong>{{ authStore.userInfo?.name ?? '未登录用户' }}</strong>
            <span>品牌运营工作台</span>
          </span>
        </button>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goProfileHint">查看说明</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bell, Expand, Fold } from '@element-plus/icons-vue';
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();

const routeDescriptionMap = {
  dashboard: '聚焦近 7 日交易趋势、活动投放与重点商品表现。',
  products: '管理商品生命周期、库存状态与重点经营信号。',
  orders: '追踪履约进度、订单状态与异常订单处理节奏。',
  campaigns: '查看预算消耗、活动阶段与整体转化表现。',
} as const;

const breadcrumbs = computed(() => route.matched.filter((item) => !item.meta.hidden));
const currentTitle = computed(() => {
  const lastBreadcrumb = breadcrumbs.value[breadcrumbs.value.length - 1];
  return String(lastBreadcrumb?.meta.title ?? '品牌工作台');
});
const currentDescription = computed(
  () => routeDescriptionMap[route.name as keyof typeof routeDescriptionMap] ?? '统一管理经营分析、商品履约与营销动作。',
);
const avatarText = computed(() => authStore.userInfo?.avatar || authStore.userInfo?.name?.slice(0, 1) || 'U');
const roleText = computed(() => {
  const map = {
    admin: '管理员视角',
    operator: '订单运营视角',
    marketing: '营销运营视角',
  } as const;

  return authStore.role ? map[authStore.role] : '访客';
});

function goProfileHint() {
  ElMessage.info('当前项目已升级为品牌化运营工作台，可用于多角色演示与页面作品展示。');
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.header-shell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 22px;
}

.header-context {
  display: grid;
  gap: 14px;
  min-width: 0;
}

.header-context__top,
.header-context__title-group,
.header-actions,
.user-box {
  display: flex;
  align-items: center;
}

.header-context__top,
.header-actions {
  gap: 12px;
}

.header-context__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.header-context__title-group {
  justify-content: space-between;
  gap: 24px;
}

.header-context h1 {
  margin: 0;
  font-size: 24px;
  color: var(--text-primary);
}

.header-context p {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.header-context__breadcrumb {
  min-width: fit-content;
}

.header-actions {
  justify-content: flex-end;
}

.header-actions__status {
  display: grid;
  gap: 4px;
  min-width: 112px;
  padding: 10px 12px;
  border: 1px solid rgba(99, 102, 241, 0.12);
  border-radius: 18px;
  background: rgba(238, 242, 255, 0.72);
}

.header-actions__status span {
  font-size: 12px;
  color: var(--text-muted);
}

.header-actions__status strong {
  font-size: 13px;
  color: var(--brand-strong);
}

.user-box {
  gap: 12px;
  padding: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.user-box__avatar {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #fff;
}

.user-box__meta {
  display: grid;
  text-align: left;
}

.user-box__meta strong {
  color: var(--text-primary);
  font-size: 14px;
}

.user-box__meta span {
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 12px;
}

@media (max-width: 1024px) {
  .header-shell,
  .header-context__title-group {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .header-shell {
    padding: 16px;
  }

  .header-context h1 {
    font-size: 22px;
  }
}
</style>
