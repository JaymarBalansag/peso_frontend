<script setup>
defineProps({ name: String, pending: Number })

const today = new Date().toLocaleDateString('en-PH', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
})
</script>

<template>
  <section class="banner d-flex flex-wrap align-items-center justify-content-between gap-3">
    <div>
      <h1>Magandang araw, {{ name }}! 👋</h1>
      <p>{{ today }} · {{ pending }} new applications are waiting for screening.</p>
    </div>
    <button class="btn-app">Review applications</button>
  </section>
</template>
