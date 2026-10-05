<script setup>
defineProps({ title: String, subtitle: String })
</script>

<template>
  <div class="page-head">
    <div>
      <h1>{{ title }}</h1>
      <p class="muted mb-0">{{ subtitle }}</p>
    </div>
    <div class="d-flex gap-2"><slot /></div>
  </div>
</template>
