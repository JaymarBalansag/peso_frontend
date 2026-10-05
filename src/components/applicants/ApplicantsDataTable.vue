<script setup>
import EmptyState from '@/components/common/EmptyState.vue'
import { STATUS_TONE } from '@/constants/status'

defineProps({
  rows: { type: Array, required: true },
  filtered: Boolean
})
</script>

<template>
  <div class="table-responsive">
    <table class="data-table data-table--wide">
      <thead>
        <tr>
          <th>Applicant</th>
          <th>Applied For</th>
          <th>Barangay</th>
          <th>Contact No.</th>
          <th>Date Applied</th>
          <th>Status</th>
          <th class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in rows" :key="a.id">
          <td>
            <div class="d-flex align-items-center gap-2" :class="`tone-${STATUS_TONE[a.status]}`">
              <div class="avatar">{{ a.name[0] }}</div>
              <div>
                <div class="fw-semibold">{{ a.name }}</div>
                <small class="muted">{{ a.id }}</small>
              </div>
            </div>
          </td>
          <td>{{ a.program }}</td>
          <td>{{ a.barangay }}</td>
          <td>{{ a.contact }}</td>
          <td class="muted">{{ a.date }}</td>
          <td><span class="chip" :class="`tone-${STATUS_TONE[a.status]}`">{{ a.status }}</span></td>
          <td class="text-end">
            <button class="btn-app btn-app--ghost btn-app--sm">View</button>
          </td>
        </tr>

        <tr v-if="!rows.length" class="data-table__empty-row">
          <td colspan="7">
            <EmptyState
              :icon="filtered ? '🔍' : '✈'"
              :title="filtered ? 'No matching applicants' : 'No applicants yet'"
              :text="filtered ? 'Try changing or resetting your filters.' : 'Applicant records will appear here once they are added.'"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
