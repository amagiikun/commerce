<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
}>();
</script>

<template>
  <el-card shadow="never" class="filter-toolbar panel-card">
    <div v-if="title || description" class="filter-toolbar__intro">
      <div>
        <h3 v-if="title">{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="filter-toolbar__top-actions">
        <slot name="actions" />
      </div>
    </div>

    <div class="filter-toolbar__body">
      <slot />
    </div>
  </el-card>
</template>

<style scoped>
.filter-toolbar {
  border: none;
}

.filter-toolbar__intro {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.filter-toolbar__intro h3 {
  margin: 0 0 6px;
  font-size: 16px;
  color: var(--text-primary);
}

.filter-toolbar__intro p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.filter-toolbar__body {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
