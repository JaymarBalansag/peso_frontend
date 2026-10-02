<script setup>
defineProps({ options: { type: Array, required: true } })
const model = defineModel({ required: true })
</script>

<template>
  <div class="segmented">
    <button
      v-for="option in options"
      :key="option"
      :class="{ 'is-active': model === option }"
      @click="model = option"
    >
      {{ option }}
    </button>
  </div>
</template>
