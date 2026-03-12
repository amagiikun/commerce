<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';
import type { UserRole } from '@/types';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);

const formState = reactive({
  username: 'admin',
  password: '123456',
  role: 'admin' as UserRole,
});

const roleCards: Array<{ role: UserRole; title: string; desc: string }> = [
  { role: 'admin', title: '管理员', desc: '查看全局经营表现与品牌节奏。' },
  { role: 'operator', title: '订单运营', desc: '聚焦履约、异常订单与服务效率。' },
  { role: 'marketing', title: '营销专员', desc: '跟进预算、投放与转化表现。' },
];

const featureHighlights = [
  '统一整合数据概览、商品经营、订单履约与营销活动视图。',
  '品牌化视觉系统升级，更适合项目展示、面试讲解与作品集呈现。',
  '保留真实后台操作效率，兼顾表格可读性与筛选动作闭环。',
];

const entryMetrics = [
  { label: '近 7 日 GMV', value: '¥ 1,286,400' },
  { label: '在投活动', value: '08' },
  { label: '履约及时率', value: '98.4%' },
];

function selectRole(role: UserRole) {
  formState.role = role;
  formState.username = role;
  formState.password = '123456';
}

async function handleSubmit() {
  loading.value = true;

  try {
    await authStore.login({
      username: formState.username,
      password: formState.password,
    });
    ElMessage.success('登录成功');
    await router.push(String(route.query.redirect || '/dashboard'));
  } catch (error) {
    const message = error instanceof Error ? error.message : '登录失败，请稍后重试';
    ElMessage.error(message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <section class="login-page__hero">
      <el-tag effect="dark" round class="login-page__tag">Brand Console</el-tag>

      <div class="login-page__headline">
        <span class="login-page__eyebrow">Smart Commerce Admin</span>
        <h1>品牌化电商运营分析平台</h1>
        <p>
          品牌运营工作台。
          你可以用它讲清楚经营分析、商品管理、订单履约和营销投放之间的协同关系。
        </p>
      </div>

      <div class="login-page__metrics">
        <div v-for="item in entryMetrics" :key="item.label" class="login-page__metric">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </div>

      <div class="login-page__highlights">
        <div v-for="item in featureHighlights" :key="item" class="login-page__highlight">
          <i class="brand-dot" />
          <span>{{ item }}</span>
        </div>
      </div>
    </section>

    <section class="login-panel panel-card">
      <div class="login-panel__intro">
        <span class="login-panel__eyebrow">欢迎回来</span>
        <h2>登录品牌工作台</h2>
        <p>选择角色后可快速体验不同岗位下的页面信息结构与操作重点。</p>
      </div>

      <div class="login-panel__roles">
        <button
          v-for="item in roleCards"
          :key="item.role"
          type="button"
          class="login-role"
          :class="{ active: formState.role === item.role }"
          @click="selectRole(item.role)"
        >
          <strong>{{ item.title }}</strong>
          <span>{{ item.desc }}</span>
        </button>
      </div>

      <el-form label-position="top" @submit.prevent="handleSubmit">
        <el-form-item label="用户名">
          <el-input v-model="formState.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input
            v-model="formState.password"
            type="password"
            show-password
            placeholder="请输入密码"
          />
        </el-form-item>

        <el-button type="primary" size="large" class="login-panel__submit" :loading="loading" @click="handleSubmit">
          进入工作台
        </el-button>
      </el-form>

      <div class="login-panel__accounts">
        <span>演示账号</span>
        <p>`admin / operator / marketing`，默认密码统一为 `123456`。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.login-page,
.login-page__metrics,
.login-page__highlights,
.login-panel,
.login-panel__roles {
  display: grid;
}

.login-page {
  grid-template-columns: minmax(0, 1.2fr) minmax(380px, 0.88fr);
  gap: 24px;
  min-height: 100vh;
  padding: 28px;
  background:
    radial-gradient(circle at top left, rgba(99, 102, 241, 0.28), transparent 28%),
    radial-gradient(circle at bottom right, rgba(34, 211, 238, 0.18), transparent 22%),
    linear-gradient(135deg, #0f172a 0%, #131c31 48%, #1e1b4b 100%);
}

.login-page__hero,
.login-panel {
  position: relative;
  overflow: hidden;
}

.login-page__hero {
  padding: 28px;
  border: 1px solid rgba(191, 219, 254, 0.12);
  border-radius: 32px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.68), rgba(15, 23, 42, 0.42));
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24);
}

.login-page__tag,
.login-page__eyebrow,
.login-panel__eyebrow,
.login-panel__accounts span,
.login-page__metric span,
.login-role span {
  font-size: 12px;
}

.login-page__headline {
  margin: 26px 0 30px;
}

.login-page__eyebrow,
.login-panel__eyebrow {
  display: inline-flex;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(191, 219, 254, 0.82);
}

.login-page__headline h1 {
  margin: 16px 0 16px;
  max-width: 640px;
  font-size: clamp(34px, 5vw, 56px);
  line-height: 1.08;
  color: #f8fafc;
}

.login-page__headline p,
.login-page__highlight span {
  color: rgba(226, 232, 240, 0.84);
  line-height: 1.8;
}

.login-page__headline p {
  max-width: 640px;
  margin: 0;
}

.login-page__metrics {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.login-page__metric {
  padding: 18px;
  border: 1px solid rgba(191, 219, 254, 0.14);
  border-radius: 22px;
  background: rgba(15, 23, 42, 0.26);
}

.login-page__metric span,
.login-panel__accounts span,
.login-role span {
  color: rgba(191, 219, 254, 0.72);
}

.login-page__metric strong {
  display: block;
  margin-top: 10px;
  color: #fff;
  font-size: 24px;
}

.login-page__highlights {
  gap: 14px;
  margin-top: 28px;
}

.login-page__highlight {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.login-panel {
  align-content: start;
  gap: 22px;
  padding: 30px;
  border-radius: 32px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.96));
}

.login-panel__intro h2 {
  margin: 14px 0 10px;
  font-size: 30px;
  color: var(--text-primary);
}

.login-panel__intro p,
.login-panel__accounts p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.75;
}

.login-panel__roles {
  gap: 12px;
}

.login-role {
  display: grid;
  gap: 6px;
  padding: 16px 18px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  background: rgba(248, 250, 252, 0.9);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.login-role strong {
  color: var(--text-primary);
  font-size: 15px;
}

.login-role.active {
  border-color: rgba(99, 102, 241, 0.32);
  background: rgba(238, 242, 255, 0.88);
  box-shadow: 0 14px 24px rgba(99, 102, 241, 0.1);
}

.login-role:hover {
  transform: translateY(-1px);
}

.login-panel__submit {
  width: 100%;
  margin-top: 8px;
}

.login-panel__accounts {
  padding: 16px 18px;
  border-radius: 20px;
  background: rgba(241, 245, 249, 0.88);
}

@media (max-width: 1120px) {
  .login-page {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .login-page {
    padding: 18px;
  }

  .login-page__hero,
  .login-panel {
    padding: 22px;
    border-radius: 24px;
  }

  .login-page__metrics {
    grid-template-columns: 1fr;
  }
}
</style>
