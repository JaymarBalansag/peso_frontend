<script setup>
defineProps({ icon: { type: String, default: '📭' }, title: String, text: String })
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon">{{ icon }}</div>
    <h2>{{ title }}</h2>
    <p class="muted mb-0">{{ text }}</p>
    <slot />
  </div>
</template>
