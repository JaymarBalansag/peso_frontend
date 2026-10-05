<script setup>
import { computed, reactive, ref, watch } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import TablePagination from '@/components/common/TablePagination.vue'
import ApplicantsToolbar from '@/components/applicants/ApplicantsToolbar.vue'
import ApplicantsDataTable from '@/components/applicants/ApplicantsDataTable.vue'

const props = defineProps({ search: { type: String, default: '' } })

const applicants = ref([]) // replace with API data
const filters = reactive({ status: '', program: '' })
const page = ref(1)
const pageSize = ref(10)

const isFiltered = computed(() => Boolean(props.search || filters.status || filters.program))

const filtered = computed(() => {
  const query = props.search.trim().toLowerCase()
  return applicants.value.filter((a) =>
    (!filters.status || a.status === filters.status) &&
    (!filters.program || a.program === filters.program) &&
    `${a.name} ${a.id} ${a.program} ${a.barangay}`.toLowerCase().includes(query)
  )
})

const rows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

const resetFilters = () => Object.assign(filters, { status: '', program: '' })

watch([filters, () => props.search, pageSize], () => (page.value = 1))
</script>

<template>
  <PageHeader title="All Applicants" subtitle="Manage and review every applicant record.">
    <button class="btn-app btn-app--ghost">Export</button>
    <button class="btn-app btn-app--primary">➕ Add Applicant</button>
  </PageHeader>

  <div class="panel panel--auto">
    <ApplicantsToolbar v-model:status="filters.status" v-model:program="filters.program" @reset="resetFilters" />
    <ApplicantsDataTable :rows="rows" :filtered="isFiltered" />
    <TablePagination v-model:page="page" v-model:page-size="pageSize" :total="filtered.length" />
  </div>
</template>
