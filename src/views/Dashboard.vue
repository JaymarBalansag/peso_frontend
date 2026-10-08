<template>
  <main class="dashboard-page">
    <div class="dashboard-content">
      <section class="page-heading" aria-labelledby="dashboard-title">
        <div>
          <p class="eyebrow">{{ todayLabel }}</p>
          <h1 id="dashboard-title">Good {{ greeting }}, {{ firstName }}</h1>
          <p class="page-description">Here’s the latest overview of Korea applicants.</p>
        </div>
        <button class="report-period" type="button" :disabled="loading" @click="loadDashboard">
          <i class="bi bi-arrow-clockwise" :class="{ 'spin-icon': loading }" aria-hidden="true"></i>
          <span>{{ loading ? 'Refreshing…' : 'Refresh data' }}</span>
        </button>
      </section>

      <div v-if="errorMessage" class="dashboard-error" role="alert">
        <span><i class="bi bi-exclamation-circle" aria-hidden="true"></i> {{ errorMessage }}</span>
        <button type="button" :disabled="loading" @click="loadDashboard">Try again</button>
      </div>

      <section class="metrics-grid" aria-label="Key performance indicators">
        <article v-for="metric in metrics" :key="metric.label" class="metric-card">
          <div class="metric-top">
            <span class="metric-label">{{ metric.label }}</span>
            <span class="metric-icon" :class="metric.iconClass">
              <i :class="`bi ${metric.icon}`" aria-hidden="true"></i>
            </span>
          </div>
          <div class="metric-value">{{ formatCount(metric.value) }}</div>
          <div class="metric-foot">
            <span class="metric-change" :class="metric.changeClass">
              <i :class="`bi ${metric.changeIcon}`" aria-hidden="true"></i>
              {{ metric.change }}
            </span>
            <span class="metric-caption">{{ metric.caption }}</span>
          </div>
        </article>
      </section>

      <section class="insights-grid" aria-label="Program insights">
<article class="panel applicants-panel">
          <div class="panel-heading">
            <div>
              <h2>Recent applicants</h2>
              <p>Latest candidates added to your registry</p>
            </div>
            <RouterLink class="text-link" to="/korea-applicants">View all <i class="bi bi-arrow-right" aria-hidden="true"></i></RouterLink>
          </div>

          <div id="recent-applicants" class="table-responsive">
            <table class="applicants-table">
              <thead>
                <tr>
                  <th scope="col">APPLICANT</th>
                  <th scope="col">BARANGAY</th>
                  <th scope="col">DATE ADDED</th>
                  <th scope="col">STATUS</th>
                </tr>
              </thead>
              <tbody v-if="applicants.length">
                <tr v-for="applicant in applicants" :key="applicant.id">
                  <td>
                    <div class="applicant-identity">
                      <span class="applicant-avatar" :class="avatarClass(applicant.id)">{{ initials(applicant) }}</span>
                      <span><strong>{{ fullName(applicant) }}</strong><small>Applicant #{{ applicant.id }}</small></span>
                    </div>
                  </td>
                  <td class="position-cell">{{ applicant.barangay || '—' }}</td>
                  <td class="date-cell">{{ formatDate(applicant.created_at) }}</td>
                  <td><span class="status-pill" :class="statusClass(applicant.initial_interview_result)">{{ interviewLabel(applicant.initial_interview_result) }}</span></td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr><td colspan="4" class="dashboard-empty">{{ loading ? 'Loading recent applicants…' : 'No applicants have been registered yet.' }}</td></tr>
              </tbody>
            </table>
          </div>
        </article>

        <article class="panel pipeline-panel">
          <div class="panel-heading">
            <div>
              <h2>Interview outcomes</h2>
              <p>Current breakdown across Korea applicants</p>
            </div>
            <button class="quiet-icon" type="button" aria-label="More pipeline information">
              <i class="bi bi-three-dots" aria-hidden="true"></i>
            </button>
          </div>

          <div class="pipeline-total">
            <strong>{{ formatCount(summary.total) }}</strong>
            <span>registered applicants</span>
          </div>
          <div class="pipeline-list">
            <div v-for="stage in pipeline" :key="stage.label" class="pipeline-row">
              <div class="pipeline-row-heading">
                <span><i class="stage-dot" :class="stage.dotClass"></i>{{ stage.label }}</span>
                <strong>{{ formatCount(stage.count) }}</strong>
              </div>
              <div class="progress-track">
                <span :class="stage.barClass" :style="{ width: `${stagePercent(stage.count)}%` }"></span>
              </div>
            </div>
          </div>
          <div class="pipeline-note">
            <span class="note-icon"><i class="bi bi-lightbulb" aria-hidden="true"></i></span>
            <span><strong>Live applicant data</strong><small>Counts update from the applicant registry whenever you refresh.</small></span>
          </div>
        </article>
      </section>


      <footer class="dashboard-footer">
        <span>PESO Administration</span>
        <span>Serving the community through meaningful employment</span>
      </footer>
    </div>
  </main>
</template>

<script>
import { getKoreaApplicants } from '@/controller/KoreaApplicantController';

export default {
  name: 'Dashboard',
  data() {
    return {
      applicants: [],
      summary: {
        total: 0,
        complete: 0,
        incomplete: 0,
        qualified_for_further_screening: 0,
        for_verification: 0,
        not_qualified: 0,
        referred: 0,
        place_or_hired: 0,
      },
      loading: false,
      errorMessage: '',
      requestSequence: 0,
    };
  },
  computed: {
    metrics() {
      return [
        {
          label: 'Registered applicants',
          value: this.summary.total,
          change: 'All records',
          caption: 'in the registry',
          icon: 'bi-people',
          iconClass: 'icon-green',
          changeIcon: 'bi-database-check',
          changeClass: 'change-positive',
        },
        {
          label: 'Successfully placed',
          value: this.summary.place_or_hired,
          change: 'Place or hired',
          caption: 'interview result',
          icon: 'bi-person-check',
          iconClass: 'icon-blue',
          changeIcon: 'bi-check-circle',
          changeClass: 'change-positive',
        },
        {
          label: 'Referred applicants',
          value: this.summary.referred,
          change: 'Referred',
          caption: 'interview result',
          icon: 'bi-send',
          iconClass: 'icon-amber',
          changeIcon: 'bi-arrow-right-circle',
          changeClass: 'change-neutral',
        },
        {
          label: 'Qualified for screening',
          value: this.summary.qualified_for_further_screening,
          change: 'Qualified',
          caption: 'interview result',
          icon: 'bi-clipboard-check',
          iconClass: 'icon-violet',
          changeIcon: 'bi-check2',
          changeClass: 'change-neutral',
        },
      ];
    },
    pipeline() {
      return [
        { label: 'Qualified for screening', count: this.summary.qualified_for_further_screening, dotClass: 'dot-green', barClass: 'bar-green' },
        { label: 'For verification', count: this.summary.for_verification, dotClass: 'dot-blue', barClass: 'bar-blue' },
        { label: 'Referred', count: this.summary.referred, dotClass: 'dot-amber', barClass: 'bar-amber' },
        { label: 'Place or hired', count: this.summary.place_or_hired, dotClass: 'dot-violet', barClass: 'bar-violet' },
        { label: 'Not qualified', count: this.summary.not_qualified, dotClass: 'dot-rose', barClass: 'bar-rose' },
      ];
    },
    firstName() {
      const storedUser = window.sessionStorage.getItem('peso_admin_user')
        || window.localStorage.getItem('peso_admin_user');
      const name = storedUser ? JSON.parse(storedUser)?.name : '';
      return name?.trim().split(/\s+/)[0] || 'Administrator';
    },
    greeting() {
      const hour = new Date().getHours();
      return hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    },
    todayLabel() {
      return new Intl.DateTimeFormat(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date()).toLocaleUpperCase();
    },
  },
  mounted() {
    this.loadDashboard();
  },
  methods: {
    async loadDashboard() {
      const requestSequence = ++this.requestSequence;
      this.loading = true;
      this.errorMessage = '';
      try {
        const response = await getKoreaApplicants({ page: 1, per_page: 5 });
        if (requestSequence !== this.requestSequence) return;
        this.applicants = response.data.data || [];
        this.summary = response.summary;
      } catch (error) {
        if (requestSequence === this.requestSequence) {
          this.errorMessage = error.response?.data?.message || 'Unable to load live applicant data. Please try again.';
          console.error('Unable to load dashboard applicant data:', error);
        }
      } finally {
        if (requestSequence === this.requestSequence) this.loading = false;
      }
    },
    formatCount(value) {
      return Number(value || 0).toLocaleString();
    },
    fullName(applicant) {
      return [applicant.first_name, applicant.middle_name, applicant.last_name].filter(Boolean).join(' ');
    },
    initials(applicant) {
      return `${applicant.first_name?.charAt(0) || ''}${applicant.last_name?.charAt(0) || ''}`;
    },
    avatarClass(id) {
      return ['avatar-rose', 'avatar-sand', 'avatar-lilac', 'avatar-mint', 'avatar-blue'][Number(id) % 5];
    },
    formatDate(value) {
      if (!value) return '—';
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
    },
    interviewLabel(value) {
      return {
        qualified_for_further_screening: 'Qualified for screening',
        for_verification: 'For verification',
        not_qualified: 'Not qualified',
        referred: 'Referred',
        place_or_hired: 'Place or hired',
      }[value] || 'Not set';
    },
    statusClass(value) {
      return {
        qualified_for_further_screening: 'status-blue',
        for_verification: 'status-amber',
        not_qualified: 'status-red',
        referred: 'status-violet',
        place_or_hired: 'status-green',
      }[value] || 'status-neutral';
    },
    stagePercent(count) {
      return this.summary.total ? Math.min(100, (count / this.summary.total) * 100) : 0;
    },
  },
};
</script>

<style scoped>
.dashboard-page {
  min-height: calc(100vh - 76px);
  background: #f6f8fa;
  color: #172b4d;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.dashboard-content {
  width: min(1440px, 100%);
  margin: 0 auto;
  padding: 2.15rem clamp(1.25rem, 4vw, 3.5rem) 1.5rem;
}

.page-heading {
  margin-bottom: 1.65rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
}

.eyebrow {
  margin: 0 0 0.55rem;
  color: #7d8a9c;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.page-heading h1 {
  margin: 0;
  color: #172b4d;
  font-size: clamp(1.55rem, 2.2vw, 1.95rem);
  font-weight: 680;
  letter-spacing: -0.045em;
}

.page-description {
  margin: 0.5rem 0 0;
  color: #7b8798;
  font-size: 0.88rem;
}

.report-period {
  min-height: 40px;
  padding: 0 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  flex: 0 0 auto;
  border: 1px solid #e5eaf0;
  border-radius: 9px;
  background: #fff;
  color: #4f5e73;
  font-size: 0.76rem;
  font-weight: 550;
  font-family: inherit;
  cursor: pointer;
}

.report-period:disabled {
  cursor: wait;
  opacity: 0.75;
}

.spin-icon {
  animation: dashboard-spin 0.9s linear infinite;
}

@keyframes dashboard-spin {
  to { transform: rotate(360deg); }
}

.dashboard-error {
  margin: 0 0 1rem;
  padding: 0.75rem 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: 1px solid #f0d2cc;
  border-radius: 8px;
  background: #fff7f5;
  color: #914d43;
  font-size: 0.75rem;
}

.dashboard-error button {
  padding: 0.35rem 0.6rem;
  border: 1px solid #e4c2bb;
  border-radius: 6px;
  background: #fff;
  color: #914d43;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.dashboard-error button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.report-period > i:first-child {
  color: #1f5e4d;
}

.report-chevron {
  margin-left: 0.4rem;
  color: #9aa4b2;
  font-size: 0.6rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.metric-card,
.panel {
  border: 1px solid #e9edf1;
  border-radius: 13px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(23, 43, 77, 0.025);
}

.metric-card {
  min-height: 150px;
  padding: 1.1rem 1.2rem;
}

.metric-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.metric-label {
  color: #788598;
  font-size: 0.76rem;
  font-weight: 550;
}

.metric-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 10px;
  font-size: 0.95rem;
}

.icon-green { background: #eaf3ef; color: #2b735d; }
.icon-blue { background: #edf3fb; color: #5278ad; }
.icon-amber { background: #fbf3e8; color: #b8802d; }
.icon-violet { background: #f2effa; color: #7a69a7; }

.metric-value {
  margin-top: 0.58rem;
  color: #172b4d;
  font-size: 1.75rem;
  font-weight: 680;
  letter-spacing: -0.05em;
  line-height: 1.15;
}

.metric-foot {
  margin-top: 0.65rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}

.metric-change {
  display: inline-flex;
  align-items: center;
  gap: 0.12rem;
  font-size: 0.67rem;
  font-weight: 650;
}

.change-positive { color: #318267; }
.change-neutral { color: #66748a; }

.metric-caption {
  overflow: hidden;
  color: #a0a9b5;
  font-size: 0.67rem;
  text-overflow: ellipsis;
}

.insights-grid,
.activity-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.9fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.panel {
  min-width: 0;
  padding: 1.25rem 1.35rem;
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.panel-heading h2 {
  margin: 0;
  color: #24344b;
  font-size: 0.92rem;
  font-weight: 650;
  letter-spacing: -0.015em;
}

.panel-heading p {
  margin: 0.32rem 0 0;
  color: #929dad;
  font-size: 0.72rem;
}

.panel-menu-label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.38rem 0.55rem;
  border-radius: 7px;
  background: #f0f6f3;
  color: #39816a;
  font-size: 0.66rem;
  font-weight: 600;
  white-space: nowrap;
}

.chart-summary {
  margin: 1.1rem 0 0.2rem 2.35rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.chart-summary strong {
  color: #24344b;
  font-size: 1.15rem;
  font-weight: 680;
}

.chart-summary > span:nth-child(2) {
  color: #929dad;
  font-size: 0.68rem;
}

.chart-change {
  margin-left: auto;
  color: #318267;
  font-size: 0.69rem;
  font-weight: 650;
}

.chart-wrap {
  height: 158px;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 0.35rem;
  margin-top: 0.2rem;
}

.chart-y-labels {
  padding: 2px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #a0a9b5;
  font-size: 0.6rem;
  text-align: right;
}

.activity-chart {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.chart-gridline {
  stroke: #edf0f3;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.chart-area {
  fill: url(#activity-fill);
}

.chart-line {
  fill: none;
  stroke: #318267;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.5;
  vector-effect: non-scaling-stroke;
}

.chart-point {
  fill: #fff;
  stroke: #318267;
  stroke-width: 3;
  vector-effect: non-scaling-stroke;
}

.chart-x-labels {
  margin: 0.4rem 0 0 2.35rem;
  display: flex;
  justify-content: space-between;
  color: #9aa4b2;
  font-size: 0.62rem;
}

.quiet-icon {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #8490a1;
}

.quiet-icon:hover {
  background: #f4f6f8;
}

.pipeline-total {
  margin-top: 1.45rem;
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
}

.pipeline-total strong {
  color: #24344b;
  font-size: 1.45rem;
  font-weight: 680;
  letter-spacing: -0.04em;
}

.pipeline-total span {
  color: #929dad;
  font-size: 0.69rem;
}

.pipeline-list {
  margin-top: 0.85rem;
  display: grid;
  gap: 0.75rem;
}

.pipeline-row-heading {
  margin-bottom: 0.35rem;
  display: flex;
  justify-content: space-between;
  color: #657388;
  font-size: 0.7rem;
}

.pipeline-row-heading > span {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.pipeline-row-heading strong {
  color: #344258;
  font-size: 0.69rem;
  font-weight: 650;
}

.stage-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.dot-green { background: #3b9277; }
.dot-blue { background: #7194c6; }
.dot-amber { background: #d3a152; }
.dot-violet { background: #9a8bc4; }
.dot-rose { background: #c77c89; }

.progress-track {
  height: 5px;
  overflow: hidden;
  border-radius: 5px;
  background: #f0f2f5;
}

.progress-track > span {
  height: 100%;
  display: block;
  border-radius: inherit;
}

.bar-green { background: #55a287; }
.bar-blue { background: #82a1cc; }
.bar-amber { background: #d9ae69; }
.bar-violet { background: #a195c8; }
.bar-rose { background: #cf8793; }

.pipeline-note {
  margin-top: 1.05rem;
  padding: 0.7rem;
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  border-radius: 9px;
  background: #f5f8f6;
}

.note-icon {
  color: #47866f;
  font-size: 0.85rem;
}

.pipeline-note > span:last-child {
  display: grid;
  gap: 0.15rem;
}

.pipeline-note strong {
  color: #456b5d;
  font-size: 0.68rem;
  font-weight: 650;
}

.pipeline-note small {
  color: #87958e;
  font-size: 0.63rem;
  line-height: 1.4;
}

.applicants-panel {
  padding-bottom: 0.4rem;
}

.text-link,
.schedule-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #397863;
  font-size: 0.7rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.text-link:hover,
.schedule-link:hover {
  color: #225a47;
}

.applicants-table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
  white-space: nowrap;
}

.applicants-table th {
  padding: 0.65rem 0.55rem;
  border-bottom: 1px solid #edf0f3;
  color: #9aa4b2;
  font-size: 0.59rem;
  font-weight: 700;
  letter-spacing: 0.075em;
  text-align: left;
}

.applicants-table td {
  padding: 0.72rem 0.55rem;
  border-bottom: 1px solid #f0f2f5;
  color: #6c798c;
  font-size: 0.68rem;
}

.applicants-table tbody tr:last-child td {
  border-bottom: 0;
}

.dashboard-empty {
  padding: 1.5rem 0.55rem !important;
  color: #929dad !important;
  text-align: center;
}

.applicant-identity,
.interview-person {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.applicant-avatar,
.interview-avatar {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 50%;
  font-size: 0.57rem;
  font-weight: 700;
}

.avatar-rose { background: #f7e9e8; color: #a26b67; }
.avatar-sand { background: #f5eee1; color: #9a7b48; }
.avatar-lilac { background: #efebf7; color: #786a9b; }
.avatar-mint { background: #e8f2ec; color: #4d8067; }
.avatar-blue { background: #e8eff8; color: #5e7da5; }

.applicant-identity > span:last-child,
.interview-person > span:last-child {
  display: grid;
  gap: 0.12rem;
}

.applicant-identity strong,
.interview-person strong {
  color: #344258;
  font-size: 0.68rem;
  font-weight: 600;
}

.applicant-identity small,
.interview-person small {
  color: #9aa4b2;
  font-size: 0.6rem;
}

.position-cell {
  color: #59677b !important;
}

.date-cell {
  color: #8994a4 !important;
}

.status-pill {
  padding: 0.27rem 0.48rem;
  display: inline-block;
  border-radius: 6px;
  font-size: 0.59rem;
  font-weight: 600;
}

.status-blue { background: #edf3fb; color: #6283b0; }
.status-amber { background: #faf3e8; color: #ae833f; }
.status-green { background: #eaf4ee; color: #4d8769; }
.status-violet { background: #f2effa; color: #7a69a7; }
.status-red { background: #fbefed; color: #a9574c; }
.status-neutral { background: #f1f3f5; color: #68768a; }

.today-pill {
  padding: 0.35rem 0.55rem;
  border-radius: 7px;
  background: #f3f6f8;
  color: #748195;
  font-size: 0.64rem;
  font-weight: 600;
  white-space: nowrap;
}

.interview-list {
  margin-top: 1.2rem;
}

.interview-item {
  min-height: 64px;
  display: grid;
  grid-template-columns: 47px 1px minmax(0, 1fr);
  align-items: center;
  gap: 0.8rem;
  border-bottom: 1px solid #f0f2f5;
}

.interview-time {
  display: grid;
  gap: 0.12rem;
}

.interview-time strong {
  color: #344258;
  font-size: 0.72rem;
  font-weight: 650;
}

.interview-time span {
  color: #9aa4b2;
  font-size: 0.59rem;
}

.interview-divider {
  width: 1px;
  height: 29px;
  background: #e7ebef;
}

.schedule-link {
  margin-top: 1rem;
  font-size: 0.67rem;
}

.dashboard-footer {
  padding: 0.6rem 0 0.2rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: #a0a9b5;
  font-size: 0.63rem;
}

@media (max-width: 1100px) {
  .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .insights-grid,
  .activity-grid {
    grid-template-columns: minmax(0, 1.35fr) minmax(290px, 0.9fr);
  }

  .panel {
    padding-inline: 1rem;
  }
}

@media (max-width: 820px) {
  .insights-grid,
  .activity-grid {
    grid-template-columns: 1fr;
  }

  .pipeline-panel {
    min-height: 0;
  }
}

@media (max-width: 575.98px) {
  .dashboard-page {
    min-height: calc(100vh - 68px);
  }

  .dashboard-content {
    padding: 1.5rem 1rem 1rem;
  }

  .page-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .page-heading h1 {
    font-size: 1.55rem;
  }

  .page-description {
    max-width: 330px;
    font-size: 0.8rem;
    line-height: 1.55;
  }

  .report-period {
    min-height: 36px;
  }

  .metrics-grid {
    gap: 0.65rem;
    margin-bottom: 0.65rem;
  }

  .metric-card {
    min-height: 137px;
    padding: 0.85rem;
  }

  .metric-label {
    max-width: 105px;
    font-size: 0.66rem;
    line-height: 1.35;
  }

  .metric-icon {
    width: 30px;
    height: 30px;
  }

  .metric-value {
    font-size: 1.55rem;
  }

  .metric-foot {
    flex-wrap: wrap;
    gap: 0.2rem 0.35rem;
  }

  .metric-change,
  .metric-caption {
    font-size: 0.6rem;
  }

  .insights-grid,
  .activity-grid {
    gap: 0.65rem;
    margin-bottom: 0.65rem;
  }

  .panel {
    padding: 1rem;
  }

  .chart-wrap {
    height: 135px;
  }

  .applicants-table {
    min-width: 640px;
  }

  .dashboard-footer {
    flex-direction: column;
    gap: 0.3rem;
  }
}
</style>
