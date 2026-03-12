<script setup lang="ts">
import * as echarts from 'echarts';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { TrendPoint } from '@/types';

const props = defineProps<{
  data: TrendPoint[];
}>();

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | null = null;

function renderChart() {
  if (!chartRef.value) {
    return;
  }

  if (!chart) {
    chart = echarts.init(chartRef.value);
  }

  chart.setOption({
    color: ['#6366f1', '#22c55e'],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      borderWidth: 0,
      textStyle: { color: '#f8fafc' },
    },
    legend: {
      top: 0,
      right: 0,
      textStyle: { color: '#64748b' },
    },
    grid: { top: 54, left: 18, right: 18, bottom: 18, containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data.map((item) => item.date),
      axisLine: { lineStyle: { color: '#dbe3ef' } },
      axisLabel: { color: '#64748b' },
    },
    yAxis: [
      {
        type: 'value',
        name: 'GMV',
        nameTextStyle: { color: '#64748b' },
        axisLabel: { color: '#64748b' },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.12)' } },
      },
      {
        type: 'value',
        name: '订单量',
        nameTextStyle: { color: '#64748b' },
        axisLabel: { color: '#64748b' },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'GMV',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(99, 102, 241, 0.22)' },
            { offset: 1, color: 'rgba(99, 102, 241, 0.02)' },
          ]),
        },
        lineStyle: { width: 3 },
        data: props.data.map((item) => item.gmv),
      },
      {
        name: '订单量',
        type: 'bar',
        yAxisIndex: 1,
        barMaxWidth: 22,
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          color: 'rgba(34, 197, 94, 0.78)',
        },
        data: props.data.map((item) => item.orders),
      },
    ],
  });
}

function handleResize() {
  chart?.resize();
}

onMounted(async () => {
  await nextTick();
  renderChart();
  window.addEventListener('resize', handleResize);
});

watch(
  () => props.data,
  async () => {
    await nextTick();
    renderChart();
  },
  { deep: true },
);

onBeforeUnmount(() => {
  chart?.dispose();
  chart = null;
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <el-card shadow="never" class="panel-card chart-card">
    <template #header>
      <div class="section-header">
        <div>
          <h3>近 7 日交易趋势</h3>
          <p>同步观察 GMV 与订单量变化，识别活动带来的经营抬升与波动点。</p>
        </div>
        <el-tag effect="plain" round>核心经营面板</el-tag>
      </div>
    </template>

    <div ref="chartRef" class="chart-body" />
  </el-card>
</template>

<style scoped>
.chart-card {
  border: none;
}

.chart-body {
  height: 360px;
}
</style>
