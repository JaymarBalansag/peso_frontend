<script setup>
import { computed, ref } from 'vue'
import SegmentedControl from '@/components/common/SegmentedControl.vue'
import { STATUS_TONE } from '@/constants/status'

const props = defineProps({
  applicants: { type: Array, required: true },
  search: { type: String, default: '' }
})

const filters = ['All', 'New', 'Interview', 'Placed']
const filter = ref('All')

const rows = computed(() => {
  const query = props.search.trim().toLowerCase()
  return props.applicants.filter((a) => {
    const matchesStatus = filter.value === 'All' || a.status === filter.value
    const matchesSearch = `${a.name} ${a.id} ${a.program}`.toLowerCase().includes(query)
    return matchesStatus && matchesSearch
  })
})
</script>

<template>
  <div class="panel">
    <div class="panel__head">
      <h2>Recent Applications</h2>
      <SegmentedControl v-model="filter" :options="filters" />
    </div>

    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Applicant</th><th>Applied For</th><th>Barangay</th><th>Date</th><th>Status</th><th />
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
            <td class="muted">{{ a.date }}</td>
            <td><span class="chip" :class="`tone-${STATUS_TONE[a.status]}`">{{ a.status }}</span></td>
            <td><button class="btn-app btn-app--ghost btn-app--sm">View</button></td>
          </tr>
          <tr v-if="!rows.length">
            <td colspan="6" class="data-table__empty">No matching records.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
