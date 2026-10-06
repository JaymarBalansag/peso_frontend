<script>
import Topbar from './components/topbar.vue';
export default {
  name: 'App',
  components: {
    Topbar,
  },
};

</script>

<template>
  <Topbar v-if="this.$route.path !== '/login'" />
  <RouterView />
  
</template>

<style scoped></style>
