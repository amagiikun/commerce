# Smart Commerce Brand Console UI Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 `Smart Commerce Admin` 重构为深蓝紫品牌化运营工作台，统一全局设计系统并升级登录页、数据概览页、商品页、订单页和营销活动页。

**Architecture:** 先收敛全局设计 Token、布局骨架和通用页面容器，再按页面域拆分改造任务，避免多个任务同时改动共享基础设施。页面改造以复用通用摘要区、指标区、筛选区和内容卡片为核心，尽量不改变现有业务数据流和接口结构。

**Tech Stack:** Vue 3、Vite、TypeScript、Pinia、Vue Router、Element Plus、ECharts、Vitest、SCSS/CSS。

---

### Task 1: 全局设计 Token 与布局骨架

**Files:**
- Create: `src/components/ui/PageHero.vue`
- Create: `src/components/ui/InsightMetricCard.vue`
- Create: `src/components/ui/FilterToolbar.vue`
- Modify: `src/styles/index.scss`
- Modify: `src/layout/AppLayout.vue`
- Modify: `src/layout/components/AppHeader.vue`
- Modify: `src/layout/components/AppSidebar.vue`
- Test: `tests/ui/page-hero.spec.ts`

**Step 1: Write the failing test**

为新的 `PageHero` 编写测试，断言页面摘要头部能渲染标题、副标题、标签和操作区域。

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/ui/page-hero.spec.ts`

Expected: FAIL，因为 `PageHero.vue` 尚不存在。

**Step 3: Write minimal implementation**

- 新建 `PageHero.vue`，提供统一摘要头部结构。
- 新建 `InsightMetricCard.vue`，统一 KPI 卡片结构。
- 新建 `FilterToolbar.vue`，统一筛选条容器与插槽。
- 在 `src/styles/index.scss` 中建立全局色板、边框、间距、阴影与页面容器样式。
- 重构 `AppLayout.vue`、`AppHeader.vue`、`AppSidebar.vue` 为品牌化工作台骨架。

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/ui/page-hero.spec.ts`

Expected: PASS。

**Step 5: Commit**

仓库当前无 `.git`，跳过提交。

### Task 2: 登录页与数据概览页升级

**Files:**
- Modify: `src/views/login/LoginView.vue`
- Modify: `src/views/dashboard/DashboardView.vue`
- Modify: `src/components/business/dashboard/MetricCard.vue`
- Modify: `src/components/business/dashboard/TrendChartCard.vue`
- Modify: `src/components/business/dashboard/HotProductsCard.vue`
- Modify: `src/components/business/dashboard/CampaignOverviewCard.vue`
- Test: `tests/ui/login-layout.spec.ts`

**Step 1: Write the failing test**

为登录页编写测试，断言新品牌入口页包含品牌介绍区、角色快捷切换区和账号说明区。

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/ui/login-layout.spec.ts`

Expected: FAIL，现有登录页结构不匹配测试期望。

**Step 3: Write minimal implementation**

- 重构登录页为双栏品牌入口布局。
- 升级 Dashboard 页为摘要区 + KPI + 主分析区 + 辅助分析区。
- 升级相关仪表盘组件，使其视觉层次与文案结构统一。

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/ui/login-layout.spec.ts`

Expected: PASS。

**Step 5: Commit**

仓库当前无 `.git`，跳过提交。

### Task 3: 商品页经营台改造

**Files:**
- Modify: `src/views/products/ProductsView.vue`
- Modify: `src/components/business/products/ProductFilterBar.vue`
- Modify: `src/components/business/products/ProductEditDrawer.vue`
- Test: `tests/ui/products-summary.spec.ts`

**Step 1: Write the failing test**

为商品页编写测试，断言页面展示经营指标摘要与筛选操作区。

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/ui/products-summary.spec.ts`

Expected: FAIL，现有页面缺少目标结构。

**Step 3: Write minimal implementation**

- 增加商品经营指标区与更清晰的筛选条。
- 升级表格区外观与状态表达。
- 优化商品编辑抽屉的分组与信息层次。

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/ui/products-summary.spec.ts`

Expected: PASS。

**Step 5: Commit**

仓库当前无 `.git`，跳过提交。

### Task 4: 订单页与活动页并行升级

**Files:**
- Modify: `src/views/orders/OrdersView.vue`
- Modify: `src/components/business/orders/OrderFilterBar.vue`
- Modify: `src/components/business/orders/OrderDetailDrawer.vue`
- Modify: `src/views/campaigns/CampaignsView.vue`
- Modify: `src/components/business/campaigns/CampaignDetailDialog.vue`
- Test: `tests/ui/orders-campaigns-structure.spec.ts`

**Step 1: Write the failing test**

为订单页和活动页编写结构测试，断言两页都具备摘要区、指标区/总览区以及详情区入口。

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/ui/orders-campaigns-structure.spec.ts`

Expected: FAIL。

**Step 3: Write minimal implementation**

- 将订单页升级为履约运营台。
- 将活动页升级为营销投放看板。
- 统一详情抽屉 / 对话框的品牌化结构与视觉层次。

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/ui/orders-campaigns-structure.spec.ts`

Expected: PASS。

**Step 5: Commit**

仓库当前无 `.git`，跳过提交。

### Task 5: 响应式收口与最终验证

**Files:**
- Modify: `src/styles/index.scss`
- Modify: `src/components/business/dashboard/TrendChartCard.vue`
- Modify: `src/views/login/LoginView.vue`
- Modify: `src/views/dashboard/DashboardView.vue`
- Modify: `src/views/products/ProductsView.vue`
- Modify: `src/views/orders/OrdersView.vue`
- Modify: `src/views/campaigns/CampaignsView.vue`
- Test: `package.json`

**Step 1: Write the failing test**

补齐必要的结构测试或响应式断言，确保关键容器类在页面中稳定存在。

**Step 2: Run test to verify it fails**

Run: `npm run test`

Expected: 如存在未覆盖的新结构，则 FAIL。

**Step 3: Write minimal implementation**

- 调整页面在 `375px`、`768px`、`1024px`、`1440px` 下的栅格与间距。
- 收口 hover、focus、loading、空状态等交互细节。

**Step 4: Run test to verify it passes**

Run:
- `npm run test`
- `npm run typecheck`
- `npm run build`

Expected: 全部 PASS。

**Step 5: Commit**

仓库当前无 `.git`，跳过提交。
