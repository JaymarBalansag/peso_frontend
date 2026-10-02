<script setup>
import WelcomeBanner from '@/components/dashboard/WelcomeBanner.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import PipelineCard from '@/components/dashboard/PipelineCard.vue'
import ActivityChart from '@/components/dashboard/ActivityChart.vue'
import ProgramDonut from '@/components/dashboard/ProgramDonut.vue'
import ApplicantsTable from '@/components/dashboard/ApplicantsTable.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import UpcomingInterviews from '@/components/dashboard/UpcomingInterviews.vue'
import {
  stats, pipeline, activity, programs, applicants, quickActions, interviews
} from '@/data/mock'

defineProps({ search: { type: String, default: '' } })
</script>

<template>
  <WelcomeBanner name="Maria" :pending="126" />

  <div class="row g-3">
    <div v-for="s in stats" :key="s.label" class="col-6 col-xl-3">
      <StatCard v-bind="s" />
    </div>

    <div class="col-12"><PipelineCard :stages="pipeline" /></div>
    <div class="col-lg-8"><ActivityChart :data="activity" /></div>
    <div class="col-lg-4"><ProgramDonut :programs="programs" /></div>
    <div class="col-lg-8"><ApplicantsTable :applicants="applicants" :search="search" /></div>
    <div class="col-lg-4 d-flex flex-column gap-3">
      <QuickActions :actions="quickActions" />
      <UpcomingInterviews :interviews="interviews" />
    </div>
  </div>
</template>
