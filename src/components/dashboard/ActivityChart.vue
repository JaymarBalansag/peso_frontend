<script setup>
import { computed, ref } from 'vue'
import SegmentedControl from '@/components/common/SegmentedControl.vue'

const props = defineProps({ data: { type: Object, required: true } })

const range = ref('6M')
const months = computed(() => props.data[range.value])
const max = computed(() => Math.max(...months.value.map((m) => m.received)))
const height = (value) => `${(value / max.value) * 100}%`
</script>

<template>
  <div class="panel">
    <div class="panel__head">
      <div>
        <h2>Applications vs. Placements</h2>
        <small class="muted">Monthly applicant activity</small>
      </div>
      <SegmentedControl v-model="range" :options="Object.keys(data)" />
    </div>

    <div class="legend">
      <span><i style="background: var(--primary)" />Received</span>
      <span><i style="background: var(--green)" />Placed</span>
    </div>

    <div class="chart" role="img" aria-label="Monthly applications received and placed">
      <div v-for="m in months" :key="m.month" class="chart__col">
        <div class="chart__bars">
          <div class="chart__bar chart__bar--received" :style="{ height: height(m.received) }" :title="m.received" />
          <div class="chart__bar chart__bar--placed" :style="{ height: height(m.placed) }" :title="m.placed" />
        </div>
        <small>{{ m.month }}</small>
      </div>
    </div>
  </div>
</template>
