<template>
  <Sidebar />
  <header class="topbar">
    <div class="topbar-start">
      <button
        class="sidebar-toggle"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#pesoSidebar"
        aria-controls="pesoSidebar"
        aria-label="Open navigation menu"
      >
        <i class="bi bi-list" aria-hidden="true"></i>
      </button>
    </div>

    <div class="topbar-profile" aria-label="Signed in as Maria Santos, Administrator">
      <div class="topbar-identity">
        <span class="topbar-name">Maria Santos</span>
        <span class="topbar-role">Administrator</span>
      </div>
      <div class="topbar-avatar" aria-hidden="true">MS</div>
    </div>
  </header>
</template>

<script>
import Sidebar from './sidebar.vue';

export default {
  name: 'Topbar',
  components: {
    Sidebar,
  },
};
</script>

<style scoped>
.topbar {
  height: 76px;
  padding: 0 clamp(1.25rem, 4vw, 3.5rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e9edf2;
}

.topbar-start,
.topbar-profile {
  display: flex;
  align-items: center;
}

.topbar-start {
  gap: 1rem;
}

.sidebar-toggle {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid #e7ebf0;
  border-radius: 12px;
  background: #fff;
  color: #172b4d;
  font-size: 1.35rem;
  transition: background-color 150ms ease, border-color 150ms ease;
}

.sidebar-toggle:hover {
  background: #f5f7fa;
  border-color: #d7dee8;
}

.sidebar-toggle:focus-visible {
  outline: 3px solid rgba(31, 94, 77, 0.24);
  outline-offset: 2px;
}

.topbar-profile {
  gap: 0.85rem;
}

.topbar-identity {
  display: grid;
  gap: 0.15rem;
  text-align: right;
}

.topbar-name {
  color: #172b4d;
  font-size: 0.88rem;
  font-weight: 650;
  line-height: 1.2;
}

.topbar-role {
  color: #8792a3;
  font-size: 0.75rem;
  line-height: 1.2;
}

.topbar-avatar {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid #dce9e4;
  border-radius: 50%;
  background: #eaf3ef;
  color: #1f5e4d;
  font-size: 0.82rem;
  font-weight: 700;
}

@media (max-width: 575.98px) {
  .topbar {
    height: 68px;
    padding-inline: 1rem;
  }

  .topbar-profile {
    gap: 0.65rem;
  }
}
</style>
