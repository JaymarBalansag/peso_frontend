<script setup>
defineProps({
  label: String,
  value: Number,
  trend: Number,
  up: Boolean,
  icon: String,
  tone: String
})
</script>

<template>
  <div class="panel stat" :class="`tone-${tone}`">
    <div class="stat__icon">{{ icon }}</div>
    <div>
      <div class="muted">{{ label }}</div>
      <div class="stat__value">{{ value.toLocaleString() }}</div>
      <span class="trend" :class="up ? 'trend--up' : 'trend--down'">{{ up ? '▲' : '▼' }} {{ trend }}%</span>
      <small class="muted d-none d-sm-inline"> vs last month</small>
    </div>
  </div>
</template>
