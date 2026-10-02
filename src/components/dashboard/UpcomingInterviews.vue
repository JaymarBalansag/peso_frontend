<script setup>
defineProps({ interviews: { type: Array, required: true } })
</script>

<template>
  <div class="panel">
    <h2 class="mb-3">Upcoming Interviews</h2>
    <div v-for="i in interviews" :key="i.applicant + i.when" class="list-row" :class="`tone-${i.tone}`">
      <div class="avatar">{{ i.applicant[0] }}</div>
      <div class="min-w-0">
        <div class="fw-semibold">{{ i.applicant }}</div>
        <small class="muted">{{ i.detail }}</small>
      </div>
      <span class="chip list-row__end">{{ i.when }}</span>
    </div>
  </div>
</template>
