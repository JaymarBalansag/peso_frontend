<script setup>
import { ref } from 'vue'
import { navigation } from '@/data/navigation'

defineProps({ open: Boolean })
const emit = defineEmits(['close'])

const active = ref('Dashboard')
const select = (name) => {
  active.value = name
  emit('close')
}
</script>

<template>
  <aside class="sidebar" :class="{ 'is-open': open }" aria-label="Main navigation">
    <div class="brand">
      <div class="brand__logo">PM</div>
      <div><b>PESO · MSWD</b><small>Applicant Management</small></div>
    </div>

    <template v-for="group in navigation" :key="group.label">
      <div class="nav-label">{{ group.label }}</div>
      <button
        v-for="item in group.items"
        :key="item.name"
        class="nav-item"
        :class="{ 'is-active': active === item.name }"
        @click="select(item.name)"
      >
        <span>{{ item.icon }}</span>{{ item.name }}
        <span v-if="item.badge" class="nav-item__badge">{{ item.badge }}</span>
      </button>
    </template>
  </aside>
</template>
