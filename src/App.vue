<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import DashboardView from '@/views/DashboardView.vue'

const menuOpen = ref(false)
const search = ref('')

</script>

<template>
  <div v-if="menuOpen" class="scrim" @click="menuOpen = false" />
  <AppSidebar :open="menuOpen" @close="menuOpen = false" />

  <div class="main">
    <AppTopbar v-model:search="search" @toggle-menu="menuOpen = true" />
    <main class="content">
      <RouterView v-slot="{ Component }">
        <component :is="Component" :search="search" />
      </RouterView>
    </main>
  </div>
</template>

<style scoped></style>
