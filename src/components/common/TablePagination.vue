<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: { type: Number, default: 0 },
  pageSizes: { type: Array, default: () => [10, 25, 50] }
})
const page = defineModel('page', { default: 1 })
const pageSize = defineModel('pageSize', { default: 10 })

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / pageSize.value)))
const from = computed(() => (props.total ? (page.value - 1) * pageSize.value + 1 : 0))
const to = computed(() => Math.min(page.value * pageSize.value, props.total))
</script>

<template>
  <div class="pagination-bar">
    <span class="muted">Showing {{ from }}–{{ to }} of {{ total }}</span>

    <div class="d-flex align-items-center gap-2">
      <label class="muted d-none d-sm-inline" for="page-size">Rows</label>
      <select id="page-size" v-model.number="pageSize" class="field field--sm">
        <option v-for="n in pageSizes" :key="n" :value="n">{{ n }}</option>
      </select>
      <button class="btn-app btn-app--ghost btn-app--sm" :disabled="page <= 1" @click="page--">Previous</button>
      <span class="muted">{{ page }} / {{ pageCount }}</span>
      <button class="btn-app btn-app--ghost btn-app--sm" :disabled="page >= pageCount" @click="page++">Next</button>
    </div>
  </div>
</template>
