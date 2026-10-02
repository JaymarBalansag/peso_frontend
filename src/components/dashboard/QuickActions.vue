<script setup>
defineProps({ actions: { type: Array, required: true } })
</script>

<template>
  <div class="panel">
    <h2 class="mb-3">Quick Actions</h2>
    <div class="quick">
      <button v-for="a in actions" :key="a.label">
        <span>{{ a.icon }}</span>{{ a.label }}
      </button>
    </div>
  </div>
</template>
