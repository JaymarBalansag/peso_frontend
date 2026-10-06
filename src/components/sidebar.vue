<template>
  <div
    id="pesoSidebar"
    class="offcanvas offcanvas-start peso-sidebar"
    tabindex="-1"
    aria-labelledby="pesoSidebarTitle"
  >
    <div class="sidebar-heading">
      <div class="brand-mark" aria-hidden="true">
        <img class="brand-logo" :src="pesoLogo" alt="">
      </div>
      <div class="brand-copy">
        <span class="brand-name">PESO</span>
        <span class="brand-description">Employment services</span>
      </div>
      <button
        class="sidebar-close"
        type="button"
        data-bs-dismiss="offcanvas"
        aria-label="Close navigation menu"
      >
        <i class="bi bi-x-lg" aria-hidden="true"></i>
      </button>
    </div>

    <div class="sidebar-content">
      <p class="sidebar-label">WORKSPACE</p>
      <nav class="sidebar-nav" aria-label="Main navigation">
        <a
          class="sidebar-link"
          :class="{ 'is-active': route.path === '/dashboard' }"
          :href="router.resolve('/dashboard').href"
          @click.prevent="navigateTo('/dashboard')"
        >
          <i class="bi bi-grid-1x2" aria-hidden="true"></i>
          <span>Overview</span>
        </a>
        <a
          class="sidebar-link"
          :class="{ 'is-active': route.path === '/korea-applicants' }"
          :href="router.resolve('/korea-applicants').href"
          @click.prevent="navigateTo('/korea-applicants')"
        >
          <i class="bi bi-person-lines-fill" aria-hidden="true"></i>
          <span>Korea Applicants</span>
          <span class="nav-count">12</span>
        </a>
        <!-- <a class="sidebar-link is-unavailable" href="#" aria-disabled="true" tabindex="-1">
          <i class="bi bi-briefcase" aria-hidden="true"></i>
          <span>Job vacancies</span>
        </a>
        <a class="sidebar-link is-unavailable" href="#" aria-disabled="true" tabindex="-1">
          <i class="bi bi-building" aria-hidden="true"></i>
          <span>Employers</span>
        </a>
        <a class="sidebar-link is-unavailable" href="#" aria-disabled="true" tabindex="-1">
          <i class="bi bi-calendar2-week" aria-hidden="true"></i>
          <span>Interviews</span>
        </a> -->
      </nav>

      <p class="sidebar-label sidebar-label-reports">INSIGHTS</p>
      <nav class="sidebar-nav" aria-label="Reports navigation">
        <a class="sidebar-link is-unavailable" href="#" aria-disabled="true" tabindex="-1">
          <i class="bi bi-bar-chart-line" aria-hidden="true"></i>
          <span>Reports</span>
        </a>
      </nav>

      <p class="sidebar-label sidebar-label-reports">Utility</p>
      <nav class="sidebar-nav" aria-label="Utility navigation">
        <button class="sidebar-link settings-link" type="button" data-bs-dismiss="offcanvas" @click="openSettings">
          <i class="bi bi-gear" aria-hidden="true"></i>
          <span>Settings</span>
        </button>
      </nav>
    </div>

    <div class="sidebar-footer">
      <div class="service-note">
        <span class="service-note-icon"><i class="bi bi-check2-circle" aria-hidden="true"></i></span>
        <span>
          <strong>Public service</strong>
          <small>Connecting people to work</small>
        </span>
      </div>
      <span class="sidebar-version">PESO ADMIN · STATIC PREVIEW</span>
    </div>
  </div>
</template>

<script setup>
import pesoLogo from '../assets/pics/image-Picsart-AiImageEnhancer.png';
import { useRoute, useRouter } from 'vue-router';

const emit = defineEmits(['open-settings']);
const route = useRoute();
const router = useRouter();

function navigateTo(path) {
  router.push(path);
  document.querySelector('#pesoSidebar .sidebar-close')?.click();
}

function openSettings() {
  const sidebar = document.getElementById('pesoSidebar');

  if (sidebar?.classList.contains('show')) {
    sidebar.addEventListener('hidden.bs.offcanvas', () => {
      emit('open-settings');
    }, { once: true });
    return;
  }

  emit('open-settings');
}
</script>

<style scoped>
.peso-sidebar {
  --bs-offcanvas-width: 280px;
  border: 0;
  color: #25344b;
  background: #fff;
  box-shadow: 16px 0 48px rgba(23, 43, 77, 0.12);
}

.sidebar-heading {
  min-height: 94px;
  padding: 1.35rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border-bottom: 1px solid #edf0f4;
}

.brand-mark {
  width: 58px;
  height: 52px;
  flex: 0 0 auto;
}

.brand-logo {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  object-position: center;
  mix-blend-mode: multiply;
}

.brand-copy {
  display: grid;
  gap: 0.18rem;
}

.brand-name {
  color: #172b4d;
  font-size: 0.95rem;
  font-weight: 750;
  letter-spacing: 0.1em;
  line-height: 1;
}

.brand-description {
  color: #8792a3;
  font-size: 0.69rem;
}

.sidebar-close {
  width: 34px;
  height: 34px;
  margin-left: auto;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #8390a1;
}

.sidebar-close:hover {
  background: #f3f5f7;
  color: #25344b;
}

.sidebar-content {
  padding: 1.8rem 1rem;
}

.sidebar-label {
  margin: 0 0 0.7rem 0.65rem;
  color: #9aa4b2;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.sidebar-label-reports {
  margin-top: 2rem;
}

.sidebar-nav {
  display: grid;
  gap: 0.3rem;
}

.sidebar-link {
  min-height: 44px;
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border-radius: 10px;
  color: #66748a;
  font-size: 0.86rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 150ms ease, color 150ms ease;
}

.settings-link {
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;
}

.settings-link:hover {
  background: #f4f7f5;
}

.sidebar-link > i {
  width: 19px;
  color: #8a96a7;
  font-size: 1rem;
  text-align: center;
}

.sidebar-link.is-active {
  background: #eaf3ef;
  color: #1f5e4d;
  font-weight: 650;
}

.sidebar-link.is-active > i {
  color: #1f5e4d;
}

.sidebar-link:not(.is-unavailable):hover {
  background: #f4f7f5;
}

.sidebar-link.is-unavailable {
  cursor: default;
  opacity: 0.78;
}

.nav-count {
  min-width: 23px;
  height: 21px;
  margin-left: auto;
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: #f0f3f6;
  color: #758196;
  font-size: 0.68rem;
  font-weight: 650;
}

.sidebar-footer {
  margin-top: auto;
  padding: 1rem 1.25rem 1.4rem;
  border-top: 1px solid #edf0f4;
}

.service-note {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.service-note-icon {
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #f0f6f3;
  color: #1f5e4d;
}

.service-note > span:last-child {
  display: grid;
  gap: 0.15rem;
}

.service-note strong {
  color: #344258;
  font-size: 0.75rem;
  font-weight: 650;
}

.service-note small {
  color: #8a96a7;
  font-size: 0.67rem;
}

.sidebar-version {
  display: block;
  margin-top: 1.35rem;
  color: #a4adba;
  font-size: 0.58rem;
  font-weight: 650;
  letter-spacing: 0.1em;
}
</style>
