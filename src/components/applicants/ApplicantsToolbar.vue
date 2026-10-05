<script setup>
import { computed } from 'vue'
import { STATUS_OPTIONS, PROGRAM_OPTIONS } from '@/constants/options'

const status = defineModel('status', { default: '' })
const program = defineModel('program', { default: '' })
const emit = defineEmits(['reset'])

const isFiltered = computed(() => Boolean(status.value || program.value))
</script>

<template>
  <div class="toolbar">
    <select v-model="status" class="field" aria-label="Filter by status">
      <option value="">All statuses</option>
      <option v-for="s in STATUS_OPTIONS" :key="s" :value="s">{{ s }}</option>
    </select>


    <button v-if="isFiltered" class="btn-app btn-app--ghost" @click="emit('reset')">Reset</button>
  </div>
</template>
