<template>
  <Sidebar @open-settings="openSettings" />
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

    <div class="profile-display" aria-label="Signed in as Maria Santos, Administrator">
      <span class="topbar-identity">
        <span class="topbar-name">Maria Santos</span>
        <span class="topbar-role">Administrator</span>
      </span>
      <span class="topbar-avatar" aria-hidden="true">MS</span>
    </div>
  </header>

  <Teleport to="body">
    <div v-if="showSettings" class="settings-backdrop" @click.self="closeSettings">
      <section
        class="settings-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        tabindex="-1"
        @keydown.esc="closeSettings"
      >
        <div class="settings-heading">
          <div>
            <p class="settings-eyebrow">ACCOUNT PREFERENCES</p>
            <h2 id="settings-title">Profile &amp; settings</h2>
            <p>Manage your profile and account access.</p>
          </div>
          <button class="dialog-close" type="button" aria-label="Close settings" @click="closeSettings">
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>

        <div class="account-summary">
          <span class="settings-avatar" aria-hidden="true">{{ avatarInitials }}</span>
          <span class="account-summary-copy">
            <strong>{{ profileName }}</strong>
            <small>{{ profileEmail }} · Administrator</small>
          </span>
          <span class="account-status"><i class="bi bi-circle-fill" aria-hidden="true"></i> Active</span>
        </div>

        <form class="settings-section" @submit.prevent="saveProfile">
          <div class="section-heading">
            <span class="section-icon"><i class="bi bi-person" aria-hidden="true"></i></span>
            <span><strong>Personal information</strong><small>Update how your name appears in the workspace.</small></span>
          </div>
          <label class="field-label" for="profile-name">Display name</label>
          <input id="profile-name" v-model.trim="nameDraft" class="settings-input" type="text" autocomplete="name" required>
          <label class="field-label email-label" for="profile-email">Work email</label>
          <input id="profile-email" class="settings-input" type="email" :value="profileEmail" disabled>
          <p v-if="profileNotice" class="form-notice" role="status">
            <i class="bi bi-info-circle" aria-hidden="true"></i>{{ profileNotice }}
          </p>
          <button class="save-button" type="submit">Save name</button>
        </form>

        <form class="settings-section password-section" @submit.prevent="savePassword">
          <div class="section-heading">
            <span class="section-icon section-icon-blue"><i class="bi bi-shield-lock" aria-hidden="true"></i></span>
            <span><strong>Password &amp; security</strong><small>Change your account password.</small></span>
          </div>
          <div class="password-fields">
            <label>
              <span class="field-label">Current password</span>
              <input v-model="currentPassword" class="settings-input" type="password" autocomplete="current-password" required>
            </label>
            <label>
              <span class="field-label">New password</span>
              <input v-model="newPassword" class="settings-input" type="password" autocomplete="new-password" minlength="8" required>
            </label>
          </div>
          <p v-if="passwordNotice" class="form-notice" role="status">
            <i class="bi bi-info-circle" aria-hidden="true"></i>{{ passwordNotice }}
          </p>
          <button class="save-button" type="submit">Update password</button>
        </form>

        <div class="settings-footer">
          <span class="static-note"><i class="bi bi-info-circle" aria-hidden="true"></i> Static preview — changes are not saved to an account.</span>
          <button class="logout-button" type="button" @click="logout">
            <i class="bi bi-box-arrow-right" aria-hidden="true"></i>
            Log out
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script>
import Sidebar from './sidebar.vue';
import { logoutAdmin } from '@/controller/KoreaApplicantController';

export default {
  name: 'Topbar',
  components: {
    Sidebar,
  },
  data() {
    const storedUser = window.sessionStorage.getItem('peso_admin_user')
      || window.localStorage.getItem('peso_admin_user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    return {
      showSettings: false,
      profileName: user?.name || 'Administrator',
      profileEmail: user?.email || '',
      nameDraft: user?.name || 'Administrator',
      currentPassword: '',
      newPassword: '',
      profileNotice: '',
      passwordNotice: '',
    };
  },
  computed: {
    avatarInitials() {
      return this.profileName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toLocaleUpperCase())
        .join('');
    },
  },
  methods: {
    openSettings() {
      this.nameDraft = this.profileName;
      this.profileNotice = '';
      this.passwordNotice = '';
      this.showSettings = true;
    },
    closeSettings() {
      this.showSettings = false;
      this.currentPassword = '';
      this.newPassword = '';
    },
    saveProfile() {
      if (!this.nameDraft) return;
      this.profileName = this.nameDraft;
      this.profileNotice = 'Name updated for this preview only.';
    },
    savePassword() {
      this.passwordNotice = 'Password changes are not connected in this static preview.';
      this.currentPassword = '';
      this.newPassword = '';
    },
    async logout() {
      this.closeSettings();
      try {
        await logoutAdmin();
      } catch (error) {
        console.error('Unable to revoke the administrator API token:', error);
      } finally {
        window.sessionStorage.removeItem('peso_admin_token');
        window.sessionStorage.removeItem('peso_admin_user');
        window.localStorage.removeItem('peso_admin_token');
        window.localStorage.removeItem('peso_admin_user');
        await this.$router.push('/login');
      }
    },
  },
};
</script>

<style scoped>
.topbar {
  position: relative;
  z-index: 10;
  height: 76px;
  padding: 0 clamp(1.25rem, 4vw, 3.5rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e9edf2;
}

.topbar-start,
.topbar-identity {
  display: flex;
  align-items: center;
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

.sidebar-toggle:focus-visible,
.dialog-close:focus-visible {
  outline: 3px solid rgba(31, 94, 77, 0.24);
  outline-offset: 2px;
}

.profile-display {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  text-align: right;
}

.topbar-identity {
  display: grid;
  gap: 0.15rem;
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

.topbar-avatar,
.settings-avatar {
  display: grid;
  place-items: center;
  border: 1px solid #dce9e4;
  border-radius: 50%;
  background: #eaf3ef;
  color: #1f5e4d;
  font-weight: 700;
}

.topbar-avatar {
  width: 42px;
  height: 42px;
  font-size: 0.82rem;
}

.settings-backdrop {
  position: fixed;
  z-index: 1080;
  inset: 0;
  padding: 1rem;
  display: grid;
  place-items: center;
  overflow-y: auto;
  background: rgba(19, 32, 50, 0.42);
  backdrop-filter: blur(3px);
}

.settings-dialog {
  width: min(520px, 100%);
  max-height: min(92vh, 820px);
  overflow-y: auto;
  padding: 1.4rem;
  border: 1px solid #e9edf1;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 24px 80px rgba(23, 43, 77, 0.2);
}

.settings-heading {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.settings-eyebrow {
  margin: 0 0 0.35rem;
  color: #7d8a9c;
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.settings-heading h2 {
  margin: 0;
  color: #24344b;
  font-size: 1.15rem;
  font-weight: 650;
}

.settings-heading p:last-child {
  margin: 0.35rem 0 0;
  color: #929dad;
  font-size: 0.7rem;
}

.dialog-close {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border: 0;
  border-radius: 9px;
  background: #f4f6f8;
  color: #738096;
}

.dialog-close:hover {
  background: #eaf3ef;
  color: #1f5e4d;
}

.account-summary {
  margin-top: 1.1rem;
  padding: 0.85rem 0;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  border-top: 1px solid #edf0f3;
  border-bottom: 1px solid #edf0f3;
}

.settings-avatar {
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  font-size: 0.75rem;
}

.account-summary-copy {
  min-width: 0;
  display: grid;
  gap: 0.18rem;
}

.account-summary-copy strong {
  color: #344258;
  font-size: 0.73rem;
  font-weight: 650;
}

.account-summary-copy small {
  overflow: hidden;
  color: #929dad;
  font-size: 0.62rem;
  text-overflow: ellipsis;
}

.account-status {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: #4d8769;
  font-size: 0.62rem;
  font-weight: 600;
  white-space: nowrap;
}

.account-status i {
  font-size: 0.4rem;
}

.settings-section {
  padding: 1rem 0;
  border-bottom: 1px solid #edf0f3;
}

.section-heading {
  margin-bottom: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.section-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 10px;
  background: #eaf3ef;
  color: #397863;
  font-size: 0.9rem;
}

.section-icon-blue {
  background: #edf3fb;
  color: #5278ad;
}

.section-heading > span:last-child {
  display: grid;
  gap: 0.15rem;
}

.section-heading strong {
  color: #344258;
  font-size: 0.72rem;
  font-weight: 650;
}

.section-heading small {
  color: #929dad;
  font-size: 0.62rem;
}

.field-label {
  margin-bottom: 0.35rem;
  display: block;
  color: #66748a;
  font-size: 0.65rem;
  font-weight: 600;
}

.email-label {
  margin-top: 0.7rem;
}

.settings-input {
  width: 100%;
  min-height: 37px;
  padding: 0.45rem 0.65rem;
  border: 1px solid #e3e8ed;
  border-radius: 7px;
  background: #fff;
  color: #344258;
  font: inherit;
  font-size: 0.68rem;
}

.settings-input:focus {
  border-color: #8bb7a5;
  outline: 0;
  box-shadow: 0 0 0 3px rgba(31, 94, 77, 0.09);
}

.settings-input:disabled {
  background: #f7f8f9;
  color: #929dad;
  cursor: not-allowed;
}

.password-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.7rem;
}

.password-fields label {
  min-width: 0;
}

.save-button {
  min-height: 34px;
  margin-top: 0.65rem;
  padding: 0 0.75rem;
  border: 0;
  border-radius: 7px;
  background: #1f5e4d;
  color: #fff;
  font-size: 0.66rem;
  font-weight: 600;
  transition: background-color 150ms ease;
}

.save-button:hover {
  background: #174b3d;
}

.form-notice {
  margin: 0.65rem 0 0;
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  color: #597364;
  font-size: 0.63rem;
  line-height: 1.4;
}

.settings-footer {
  padding-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.static-note {
  display: inline-flex;
  align-items: flex-start;
  gap: 0.3rem;
  color: #98a2af;
  font-size: 0.59rem;
  line-height: 1.4;
}

.logout-button {
  min-height: 34px;
  padding: 0 0.65rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex: 0 0 auto;
  border: 1px solid #f0dedd;
  border-radius: 7px;
  background: #fffafa;
  color: #a75f5c;
  font-size: 0.66rem;
  font-weight: 600;
}

.logout-button:hover {
  background: #fff1f0;
}

@media (max-width: 575.98px) {
  .topbar {
    height: 68px;
    padding-inline: 1rem;
  }

  .profile-display {
    gap: 0.65rem;
  }

  .settings-dialog {
    padding: 1.1rem;
  }

  .password-fields {
    grid-template-columns: 1fr;
  }
}
</style>
