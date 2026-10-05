<script setup>
import { RouterLink } from 'vue-router'
import { navigation } from '@/data/navigation'

defineProps({ open: Boolean })
defineEmits(['close'])

const linkProps = (item) => (item.to ? { to: item.to, exactActiveClass: 'is-active' } : {})
</script>

<template>
  <aside class="sidebar" :class="{ 'is-open': open }" aria-label="Main navigation">
    <div class="brand">
      <img src="../../assets/pics/image-Picsart-AiImageEnhancer.png" alt="PESO · MSWD" class="brand__logo" />
      <div><b>PESO · MSWD</b><small>Applicant Management</small></div>
    </div>

    <template v-for="group in navigation" :key="group.label">
      <div class="nav-label">{{ group.label }}</div>
      <component
        :is="item.to ? RouterLink : 'button'"
        v-for="item in group.items"
        :key="item.name"
        v-bind="linkProps(item)"
        class="nav-item"
        @click="$emit('close')"
      >
        <span>{{ item.icon }}</span>{{ item.name }}
        <span v-if="item.badge" class="nav-item__badge">{{ item.badge }}</span>
      </component>
    </template>
  </aside>
</template>
