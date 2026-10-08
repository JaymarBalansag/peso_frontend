<template>
  <main class="users-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">UTILITY / ACCESS CONTROL</p>
        <h1>User Management</h1>
        <p class="page-description">Add accounts and manage names, email addresses, passwords, and access roles.</p>
      </div>
      <button class="primary-button" type="button" @click="openCreate">
        <i class="bi bi-plus-lg" aria-hidden="true"></i>
        Add user
      </button>
    </section>

    <section class="users-panel" aria-labelledby="user-list-title">
      <div class="panel-heading">
        <div>
          <h2 id="user-list-title">System users</h2>
          <p>Only administrators can manage accounts and roles.</p>
        </div>
        <span class="user-count">{{ users.length }} {{ users.length === 1 ? 'account' : 'accounts' }}</span>
      </div>

      <p v-if="errorMessage" class="notice notice-error" role="alert">{{ errorMessage }}</p>
      <p v-if="successMessage" class="notice notice-success" role="status">{{ successMessage }}</p>

      <div class="table-wrap">
        <table class="users-table">
          <thead>
            <tr>
              <th scope="col">NAME</th>
              <th scope="col">EMAIL</th>
              <th scope="col">ROLE</th>
              <th scope="col">DATE ADDED</th>
              <th scope="col" class="actions-heading">ACTIONS</th>
            </tr>
          </thead>
          <tbody v-if="users.length">
            <tr v-for="user in users" :key="user.id">
              <td>
                <div class="user-identity">
                  <span class="user-avatar" aria-hidden="true">{{ initials(user.name) }}</span>
                  <strong>{{ user.name }}</strong>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td><span class="role-badge" :class="`role-${user.role}`">{{ user.role }}</span></td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td class="actions-cell">
                <button class="text-button" type="button" @click="openEdit(user)">Edit</button>
                <button
                  class="text-button delete-button"
                  type="button"
                  :disabled="user.id === currentUserId"
                  :aria-label="`Delete ${user.name}`"
                  @click="removeUser(user)"
                >Delete</button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="5">
                <div class="empty-state">
                  <i class="bi bi-people" aria-hidden="true"></i>
                  <strong>{{ loading ? 'Loading users…' : 'No user accounts found' }}</strong>
                  <span v-if="!loading">Create a user account to give a team member access.</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="showForm" class="dialog-backdrop" @click.self="closeForm">
        <section
          class="user-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-form-title"
          @keydown.esc="closeForm"
        >
          <div class="dialog-heading">
            <div>
              <p class="eyebrow">ACCOUNT DETAILS</p>
              <h2 id="user-form-title">{{ editingId ? 'Edit user' : 'Add user' }}</h2>
              <p>{{ editingId ? 'Update the account information and access role.' : 'Create an account for a PESO team member.' }}</p>
            </div>
            <button class="close-button" type="button" aria-label="Close form" @click="closeForm">
              <i class="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          </div>

          <form class="user-form" @submit.prevent="saveUser">
            <label>
              <span>Name / username</span>
              <input v-model.trim="draft.name" type="text" autocomplete="name" maxlength="255" required>
            </label>
            <label>
              <span>Email address</span>
              <input v-model.trim="draft.email" type="email" autocomplete="email" maxlength="255" required>
            </label>
            <label>
              <span>Password {{ editingId ? '(leave blank to keep current)' : '' }}</span>
              <span class="password-control">
                <input
                  v-model="draft.password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  :required="!editingId"
                  minlength="8"
                >
                <button
                  class="show-password-button"
                  type="button"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  :aria-pressed="showPassword"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" aria-hidden="true"></i>
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </span>
            </label>
            <label>
              <span>Role</span>
              <select v-model="draft.role" required>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <p v-if="formError" class="notice notice-error" role="alert">{{ formError }}</p>
            <div class="dialog-actions">
              <button class="secondary-button" type="button" @click="closeForm">Cancel</button>
              <button class="primary-button" type="submit" :disabled="saving">
                {{ saving ? 'Saving…' : editingId ? 'Save changes' : 'Create user' }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { createUser, deleteUser, getUsers, updateUser } from '@/controller/UserManagementController';

const users = ref([]);
const loading = ref(true);
const saving = ref(false);
const showForm = ref(false);
const showPassword = ref(false);
const editingId = ref(null);
const errorMessage = ref('');
const successMessage = ref('');
const formError = ref('');
const draft = reactive({ name: '', email: '', password: '', role: 'staff' });
const storedUser = window.sessionStorage.getItem('peso_admin_user')
  || window.localStorage.getItem('peso_admin_user');
const currentUser = storedUser ? JSON.parse(storedUser) : null;
const currentUserId = computed(() => currentUser?.id);

onMounted(loadUsers);

async function loadUsers() {
  loading.value = true;
  errorMessage.value = '';
  try {
    users.value = await getUsers();
  } catch (error) {
    errorMessage.value = describeError(error);
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  showPassword.value = false;
  Object.assign(draft, { name: '', email: '', password: '', role: 'staff' });
  formError.value = '';
  showForm.value = true;
}

function openEdit(user) {
  editingId.value = user.id;
  showPassword.value = false;
  Object.assign(draft, { name: user.name, email: user.email, password: '', role: user.role });
  formError.value = '';
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
}

async function saveUser() {
  saving.value = true;
  formError.value = '';
  errorMessage.value = '';
  successMessage.value = '';
  try {
    const payload = { name: draft.name, email: draft.email, role: draft.role };
    if (draft.password) payload.password = draft.password;

    if (editingId.value) {
      await updateUser(editingId.value, payload);
      successMessage.value = 'User account updated.';
    } else {
      payload.password = draft.password;
      await createUser(payload);
      successMessage.value = 'User account created.';
    }
    closeForm();
    await loadUsers();
  } catch (error) {
    formError.value = describeError(error);
  } finally {
    saving.value = false;
  }
}

async function removeUser(user) {
  if (!window.confirm(`Delete the account for ${user.name}? This cannot be undone.`)) return;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await deleteUser(user.id);
    successMessage.value = 'User account deleted.';
    await loadUsers();
  } catch (error) {
    errorMessage.value = describeError(error);
  }
}

function describeError(error) {
  const errors = error.response?.data?.errors;
  if (errors) return Object.values(errors).flat().join(' ');
  return error.response?.data?.message || 'Unable to complete the request. Please try again.';
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
}

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value));
}
</script>

<style scoped>
.users-page {
  min-height: calc(100vh - 76px);
  padding: clamp(1.5rem, 4vw, 3rem);
  background: #f6f8fa;
  color: #25344b;
}

.page-heading,
.panel-heading,
.dialog-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.25rem;
}

.page-heading {
  max-width: 1200px;
  margin: 0 auto 1.75rem;
}

.eyebrow {
  margin: 0 0 0.5rem;
  color: #1f5e4d;
  font-size: 0.68rem;
  font-weight: 750;
  letter-spacing: 0.12em;
}

h1 {
  margin: 0;
  color: #172b4d;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 750;
}

.page-description,
.panel-heading p,
.dialog-heading p:last-child {
  margin: 0.45rem 0 0;
  color: #7b8798;
  font-size: 0.9rem;
}

.primary-button,
.secondary-button {
  min-height: 42px;
  padding: 0.65rem 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: 9px;
  font-size: 0.85rem;
  font-weight: 650;
  cursor: pointer;
}

.primary-button {
  background: #1f5e4d;
  color: #fff;
}

.primary-button:hover:not(:disabled) {
  background: #174a3d;
}

.primary-button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.secondary-button {
  border-color: #dce2e9;
  background: #fff;
  color: #536176;
}

.users-panel {
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid #e9edf2;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 26px rgba(29, 45, 69, 0.04);
}

.panel-heading {
  padding: 1.35rem 1.5rem;
  align-items: center;
  border-bottom: 1px solid #edf0f4;
}

.panel-heading h2,
.dialog-heading h2 {
  margin: 0;
  color: #25344b;
  font-size: 1.1rem;
  font-weight: 700;
}

.panel-heading p {
  font-size: 0.82rem;
}

.user-count {
  color: #728096;
  font-size: 0.8rem;
  font-weight: 650;
  white-space: nowrap;
}

.table-wrap {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

.users-table th {
  padding: 0.9rem 1.25rem;
  background: #fafbfc;
  color: #8a96a7;
  font-size: 0.65rem;
  font-weight: 750;
  letter-spacing: 0.07em;
  text-align: left;
}

.users-table td {
  padding: 0.95rem 1.25rem;
  border-top: 1px solid #f0f2f5;
  color: #536176;
  font-size: 0.85rem;
}

.user-identity {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: #25344b;
}

.user-avatar {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #eaf3ef;
  color: #1f5e4d;
  font-size: 0.72rem;
  font-weight: 750;
}

.role-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 99px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: capitalize;
}

.role-admin {
  background: #eaf0ff;
  color: #3656a8;
}

.role-staff {
  background: #eaf5ef;
  color: #27704f;
}

.actions-heading,
.actions-cell {
  text-align: right !important;
}

.text-button {
  padding: 0.4rem 0.5rem;
  border: 0;
  background: transparent;
  color: #1f5e4d;
  font-size: 0.8rem;
  font-weight: 650;
  cursor: pointer;
}

.text-button:disabled {
  color: #aab2bd;
  cursor: not-allowed;
}

.delete-button {
  color: #b34444;
}

.empty-state {
  min-height: 190px;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 0.5rem;
  color: #8390a1;
  text-align: center;
}

.empty-state i {
  color: #a9b5c3;
  font-size: 1.5rem;
}

.empty-state strong {
  color: #435169;
  font-size: 0.9rem;
}

.empty-state span {
  font-size: 0.8rem;
}

.notice {
  margin: 1rem 1.5rem;
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  font-size: 0.82rem;
}

.notice-error {
  background: #fff1f0;
  color: #a63832;
}

.notice-success {
  background: #edf8f1;
  color: #236343;
}

.dialog-backdrop {
  position: fixed;
  z-index: 1050;
  inset: 0;
  padding: 1rem;
  display: grid;
  place-items: center;
  background: rgba(15, 29, 47, 0.48);
}

.user-dialog {
  width: min(100%, 520px);
  max-height: min(90vh, 760px);
  overflow-y: auto;
  padding: 1.5rem;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 24px 80px rgba(12, 28, 49, 0.25);
}

.dialog-heading {
  align-items: flex-start;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid #edf0f4;
}

.close-button {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  background: #f4f6f8;
  color: #6d7888;
  cursor: pointer;
}

.user-form {
  padding-top: 1.15rem;
  display: grid;
  gap: 1rem;
}

.user-form label {
  display: grid;
  gap: 0.42rem;
  color: #536176;
  font-size: 0.78rem;
  font-weight: 650;
}

.user-form input,
.user-form select {
  width: 100%;
  min-height: 43px;
  padding: 0.65rem 0.75rem;
  border: 1px solid #dce2e9;
  border-radius: 8px;
  background: #fff;
  color: #25344b;
  font: inherit;
}

.user-form input:focus,
.user-form select:focus {
  border-color: #5a927f;
  outline: 3px solid rgba(31, 94, 77, 0.12);
}

.password-control {
  position: relative;
  display: flex;
  align-items: center;
}

.password-control input {
  padding-right: 5.25rem;
}

.show-password-button {
  position: absolute;
  right: 0.7rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0;
  border: 0;
  background: transparent;
  color: #536176;
  font-size: 0.75rem;
  font-weight: 650;
  cursor: pointer;
}

.show-password-button:hover {
  color: #1f5e4d;
}

.show-password-button:focus-visible {
  border-radius: 3px;
  outline: 2px solid #5a927f;
  outline-offset: 3px;
}

.user-form .notice {
  margin: 0;
}

.dialog-actions {
  padding-top: 0.3rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
}

@media (max-width: 640px) {
  .users-page {
    padding: 1.25rem 0.85rem;
  }

  .page-heading {
    flex-direction: column;
  }

  .panel-heading {
    padding: 1.1rem;
  }

  .users-table th,
  .users-table td {
    padding-right: 0.85rem;
    padding-left: 0.85rem;
  }
}
</style>
