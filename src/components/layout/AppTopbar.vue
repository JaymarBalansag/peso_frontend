<script setup>
import { useTheme } from '@/composables/useTheme'

const search = defineModel('search', { default: '' })
defineEmits(['toggle-menu'])

const { dark, toggle } = useTheme()
</script>

<template>
  <header class="topbar">
    <button class="icon-btn menu-btn" aria-label="Open menu" @click="$emit('toggle-menu')">☰</button>

    <div class="topbar__search">
      <span>🔍</span>
      <input v-model="search" type="search" placeholder="Search name, ID, or program…" aria-label="Search" />
    </div>

    <div class="d-flex align-items-center gap-2 ms-auto">
      <button class="icon-btn" aria-label="Toggle theme" @click="toggle">{{ dark ? '☀️' : '🌙' }}</button>
      <button class="icon-btn" aria-label="Notifications">🔔<span class="icon-btn__dot" /></button>
      <div class="d-flex align-items-center gap-2">
        <div class="avatar">MR</div>
        <div class="d-none d-sm-block lh-sm">
          <b>Maria Reyes</b><br /><small class="muted">Administrator</small>
        </div>
      </div>
    </div>
  </header>
</template>
