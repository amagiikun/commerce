<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
  eyebrow?: string;
  tag?: string;
  meta?: string[];
}>();
</script>

<template>
  <section class="page-hero">
    <div class="page-hero__content">
      <div class="page-hero__eyebrow-row">
        <span v-if="eyebrow" class="page-hero__eyebrow">{{ eyebrow }}</span>
        <el-tag v-if="tag" effect="dark" round class="page-hero__tag">{{ tag }}</el-tag>
      </div>

      <div class="page-hero__main">
        <div>
          <h1 class="page-hero__title">{{ title }}</h1>
          <p v-if="description" class="page-hero__description">{{ description }}</p>
        </div>

        <div v-if="$slots.actions" class="page-hero__actions">
          <slot name="actions" />
        </div>
      </div>

      <ul v-if="meta?.length" class="page-hero__meta">
        <li v-for="item in meta" :key="item">{{ item }}</li>
      </ul>
    </div>

    <div v-if="$slots.extra" class="page-hero__extra">
      <slot name="extra" />
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.8fr);
  gap: 20px;
  padding: 28px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 28px;
  background:
    radial-gradient(circle at top right, rgba(99, 102, 241, 0.18), transparent 34%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
  overflow: hidden;
}

.page-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.08), transparent 35%);
  pointer-events: none;
}

.page-hero__content,
.page-hero__extra {
  position: relative;
  z-index: 1;
}

.page-hero__content {
  display: grid;
  gap: 16px;
}

.page-hero__eyebrow-row,
.page-hero__main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.page-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(191, 219, 254, 0.92);
}

.page-hero__title {
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.12;
  font-weight: 700;
  color: #f8fafc;
}

.page-hero__description {
  margin: 10px 0 0;
  max-width: 720px;
  font-size: 15px;
  line-height: 1.75;
  color: rgba(226, 232, 240, 0.82);
}

.page-hero__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-width: fit-content;
}

.page-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.page-hero__meta li {
  padding: 10px 14px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.26);
  color: rgba(226, 232, 240, 0.88);
  font-size: 13px;
}

.page-hero__extra {
  display: flex;
  align-items: stretch;
}

@media (max-width: 1100px) {
  .page-hero {
    grid-template-columns: 1fr;
  }

  .page-hero__main {
    flex-direction: column;
  }

  .page-hero__actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .page-hero {
    padding: 22px;
    border-radius: 24px;
  }
}
</style>
