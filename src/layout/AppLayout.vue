<template>
  <div class="layout-shell">
    <aside :class="['layout-aside', { collapsed: appStore.sidebarCollapsed }]">
      <AppSidebar />
    </aside>

    <div class="layout-main-shell">
      <header class="layout-header">
        <AppHeader />
      </header>

      <main class="layout-main">
        <div class="layout-main__inner">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/layout/components/AppHeader.vue';
import AppSidebar from '@/layout/components/AppSidebar.vue';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
</script>

<style scoped>
.layout-shell {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  min-height: 100vh;
}

.layout-aside {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 280px;
  padding: 20px 18px;
  transition: width 0.24s ease;
}

.layout-aside.collapsed {
  width: 112px;
}

.layout-main-shell {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-width: 0;
}

.layout-header {
  padding: 20px 24px 0;
}

.layout-main {
  min-width: 0;
  padding: 18px 24px 28px;
}

.layout-main__inner {
  min-width: 0;
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.2s ease;
}

.fade-transform-enter-from,
.fade-transform-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 1024px) {
  .layout-shell {
    grid-template-columns: 1fr;
  }

  .layout-aside {
    position: static;
    width: 100%;
    height: auto;
    padding: 18px 18px 0;
  }

  .layout-aside.collapsed {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .layout-header,
  .layout-main {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
