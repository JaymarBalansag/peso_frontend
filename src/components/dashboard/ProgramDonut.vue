<script setup>
import { computed } from 'vue'

const props = defineProps({ programs: { type: Array, required: true } })

const total = computed(() => props.programs.reduce((sum, p) => sum + p.value, 0))

const gradient = computed(() => {
  let start = 0
  const stops = props.programs.map((p) => {
    const end = start + (p.value / total.value) * 100
    const stop = `var(--${p.tone}) ${start}% ${end}%`
    start = end
    return stop
  })
  return `conic-gradient(${stops.join(', ')})`
})
</script>

<template>
  <div class="panel">
    <h2 class="mb-3">Applicants by Program</h2>

    <div class="donut" :style="{ background: gradient }">
      <div class="donut__hole">
        <span><b>{{ total.toLocaleString() }}</b><br /><small class="muted">Applicants</small></span>
      </div>
    </div>

    <div class="mt-3">
      <div v-for="p in programs" :key="p.name" class="list-row" :class="`tone-${p.tone}`">
        <i class="swatch" />
        <span>{{ p.name }}</span>
        <b class="list-row__end">{{ p.value }}</b>
      </div>
    </div>
  </div>
</template>
