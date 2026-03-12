<script setup lang="ts">
import InsightMetricCard from '@/components/ui/InsightMetricCard.vue';

defineProps<{
  title: string;
  value: string;
  trend: string;
  description: string;
  tone?: 'brand' | 'success' | 'warning' | 'neutral';
}>();
</script>

<template>
  <InsightMetricCard
    :title="title"
    :value="value"
    :trend="trend"
    :description="description"
    :tone="tone"
  />
</template>
