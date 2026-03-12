<template>
  <div class="sidebar-shell panel-card">
    <div class="sidebar-brand" :class="{ collapsed: appStore.sidebarCollapsed }">
      <div class="brand-logo">SC</div>

      <div v-if="!appStore.sidebarCollapsed" class="brand-text">
        <strong>Smart Commerce</strong>
        <span>品牌运营工作台</span>
      </div>
    </div>

    <div v-if="!appStore.sidebarCollapsed" class="sidebar-intro">
      <el-tag effect="dark" round>Live Console</el-tag>
      <p>把经营分析、商品运营、订单履约和营销动作放进同一套品牌化界面。</p>
    </div>

    <el-menu
      :default-active="route.path"
      router
      class="sidebar-menu"
      background-color="transparent"
      text-color="#94a3b8"
      active-text-color="#f8fafc"
      :collapse="appStore.sidebarCollapsed"
      :collapse-transition="false"
    >
      <el-menu-item v-for="item in menus" :key="item.path" :index="item.path">
        <el-icon><component :is="resolveIcon(item.meta.icon)" /></el-icon>
        <template #title>{{ item.meta.title }}</template>
      </el-menu-item>
    </el-menu>

    <div v-if="!appStore.sidebarCollapsed" class="sidebar-footnote">
      <span>Workspace Status</span>
      <strong>Ready for showcase</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue';
import { computed } from 'vue';
import type { Component } from 'vue';
import { useRoute } from 'vue-router';
import { buildRoleMenus } from '@/router/permission';
import { businessRoutes } from '@/router/routes';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const appStore = useAppStore();
const authStore = useAuthStore();

const menus = computed(() => buildRoleMenus(businessRoutes, authStore.role ?? 'admin'));

function resolveIcon(icon?: string): Component {
  if (!icon) {
    return Icons.Menu;
  }

  return (Icons[icon as keyof typeof Icons] as Component) || Icons.Menu;
}
</script>

<style scoped>
.sidebar-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 18px 14px;
  border: 1px solid rgba(99, 102, 241, 0.16);
  background:
    radial-gradient(circle at top left, rgba(99, 102, 241, 0.18), transparent 32%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(17, 24, 39, 0.98) 100%);
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.24);
}

.sidebar-brand,
.sidebar-footnote {
  display: flex;
  align-items: center;
}

.sidebar-brand {
  gap: 12px;
  padding: 8px 10px 18px;
  color: #fff;
}

.sidebar-brand.collapsed {
  justify-content: center;
}

.brand-logo {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #818cf8, #22d3ee);
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.08em;
  box-shadow: 0 14px 30px rgba(56, 189, 248, 0.2);
}

.brand-text {
  display: grid;
  gap: 4px;
}

.brand-text strong {
  font-size: 16px;
}

.brand-text span,
.sidebar-intro p,
.sidebar-footnote span {
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.7;
}

.sidebar-intro {
  margin: 2px 10px 18px;
  padding: 14px;
  border: 1px solid rgba(99, 102, 241, 0.16);
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.28);
}

.sidebar-intro p {
  margin: 10px 0 0;
}

.sidebar-menu {
  border-right: none;
  flex: 1;
  padding: 8px;
}

:deep(.sidebar-menu .el-menu-item) {
  height: 48px;
  margin-bottom: 8px;
  border-radius: 16px;
}

:deep(.sidebar-menu .el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.85), rgba(76, 29, 149, 0.85));
  box-shadow: 0 14px 24px rgba(79, 70, 229, 0.24);
}

.sidebar-footnote {
  justify-content: space-between;
  gap: 12px;
  margin: 14px 10px 4px;
  padding-top: 16px;
  border-top: 1px solid rgba(148, 163, 184, 0.14);
}

.sidebar-footnote strong {
  color: #f8fafc;
  font-size: 13px;
}

@media (max-width: 1024px) {
  .sidebar-shell {
    height: auto;
  }
}
</style>
