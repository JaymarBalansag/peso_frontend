<script setup>
import { computed } from 'vue'

const props = defineProps({ stages: { type: Array, required: true } })
const max = computed(() => Math.max(...props.stages.map((s) => s.value)))
</script>

<template>
  <div class="panel">
    <div class="panel__head">
      <h2>Application Pipeline</h2>
      <small class="muted">Where open applications are right now</small>
    </div>
    <div class="pipeline">
      <div v-for="(stage, i) in stages" :key="stage.name" :class="`tone-${stage.tone}`">
        <div class="muted">{{ i + 1 }}. {{ stage.name }}</div>
        <div class="pipeline__count">{{ stage.value }}</div>
        <div class="meter"><div class="meter__fill" :style="{ width: `${(stage.value / max) * 100}%` }" /></div>
      </div>
    </div>
  </div>
</template>
