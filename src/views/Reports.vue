<template>
  <main class="reports-page">
    <div class="reports-content">
      <section class="page-heading">
        <div>
          <p class="eyebrow">PESO PROGRAMS / INSIGHTS</p>
          <h1>Reports</h1>
          <p class="page-description">A clear view of applicant progress and program outcomes.</p>
        </div>
        <div class="heading-actions">
          <label class="period-select">
            <i class="bi bi-calendar3" aria-hidden="true"></i>
            <span class="visually-hidden">Report period</span>
            <select v-model="selectedPeriod" aria-label="Report period">
              <option value="all">All records</option>
              <option v-for="period in periods" :key="period.value" :value="period.value">{{ period.label }}</option>
            </select>
            <i class="bi bi-chevron-down select-chevron" aria-hidden="true"></i>
          </label>
          <button class="export-button" type="button" :disabled="loading || !loaded" @click="exportReport">
            <i class="bi bi-download" aria-hidden="true"></i>
            Export
          </button>
          <button class="export-button refresh-button" type="button" :disabled="loading" @click="loadReport">
            <i class="bi bi-arrow-clockwise" :class="{ 'spin-icon': loading }" aria-hidden="true"></i>
            {{ loading ? 'Loading…' : 'Refresh' }}
          </button>
        </div>
      </section>

      <section class="program-switcher" aria-label="Report programs">
        <div class="program-switcher-copy">
          <span class="program-icon"><i class="bi bi-globe-asia-australia" aria-hidden="true"></i></span>
          <span><strong>Program report</strong><small>Choose a program to view its performance.</small></span>
        </div>
        <div class="program-switcher-controls">
          <label class="program-select">
            <span class="visually-hidden">Select a program</span>
            <select v-model="selectedProgram" aria-label="Select a program">
              <option v-for="program in programs" :key="program.id" :value="program.id">
                {{ program.label }}
              </option>
            </select>
            <i class="bi bi-chevron-down select-chevron" aria-hidden="true"></i>
          </label>
          <span class="program-status"><i class="bi bi-circle-fill" aria-hidden="true"></i> Active</span>
        </div>
      </section>

      <div v-if="errorMessage" class="report-message report-error" role="alert">
        {{ errorMessage }}
        <button type="button" :disabled="loading" @click="loadReport">Try again</button>
      </div>
      <div v-if="exportNotice" class="report-message report-success" role="status">{{ exportNotice }}</div>
      <div v-if="!loaded && loading" class="report-loading" role="status">Loading live report data…</div>

      <section v-if="loaded" class="metrics-grid" aria-label="Program summary">
        <article v-for="metric in metrics" :key="metric.label" class="metric-card">
          <div class="metric-top">
            <span class="metric-label">{{ metric.label }}</span>
            <span class="metric-icon" :class="metric.iconClass">
              <i :class="`bi ${metric.icon}`" aria-hidden="true"></i>
            </span>
          </div>
          <strong class="metric-value">{{ metric.value }}</strong>
          <span class="metric-caption">{{ metric.caption }}</span>
        </article>
      </section>

      <section v-if="loaded" class="reports-grid" aria-label="Korea applicant analysis">
        <article class="panel status-panel">
          <div class="panel-heading">
            <div>
              <h2>Applicant pipeline</h2>
              <p>Current stage breakdown for the selected period</p>
            </div>
            <span class="total-badge">{{ summary.total }} total</span>
          </div>

          <div class="pipeline-visual" role="img" :aria-label="pipelineDescription">
            <div class="pipeline-bar">
              <span
                v-for="stage in stages"
                :key="stage.value"
                :class="stage.barClass"
                :style="{ width: `${stage.percent}%` }"
              ></span>
            </div>
            <div class="stage-list">
              <div v-for="stage in stages" :key="stage.value" class="stage-row">
                <span class="stage-name">
                  <i class="stage-dot" :class="stage.dotClass" aria-hidden="true"></i>
                  {{ stage.label }}
                </span>
                <span class="stage-count">{{ stage.count }}</span>
                <span class="stage-percent">{{ stage.percent }}%</span>
              </div>
            </div>
          </div>
          <div class="panel-note">
            <i class="bi bi-info-circle" aria-hidden="true"></i>
            Counts reflect live records in the applicant registry.
          </div>
        </article>

        <article class="panel registration-panel">
          <div class="panel-heading">
            <div>
              <h2>New registrations</h2>
              <p>Applicants added by month</p>
            </div>
            <span class="chart-legend"><i></i> Applicants</span>
          </div>

          <div class="registration-chart">
            <div class="chart-y-axis" aria-hidden="true">
              <span>{{ chartMax }}</span>
              <span>{{ Math.ceil(chartMax / 2) }}</span>
              <span>0</span>
            </div>
            <div class="chart-plot">
              <div class="chart-gridlines" aria-hidden="true">
                <span></span><span></span><span></span>
              </div>
              <div class="bar-group-list">
                <div v-for="month in monthlyRegistrations" :key="month.label" class="bar-group">
                  <span class="bar-value">{{ month.count }}</span>
                  <div class="bar-track">
                    <span class="month-bar" :style="{ height: `${barHeight(month.count)}%` }"></span>
                  </div>
                  <span class="month-label">{{ month.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section v-if="loaded" class="reports-grid detail-grid">
        <article class="panel demographics-panel">
          <div class="panel-heading">
            <div>
              <h2>Applicant demographics</h2>
              <p>Age and sex profile of the selected records</p>
            </div>
          </div>

          <div class="demographic-summary">
            <div class="sex-stat">
              <span class="sex-mark sex-female"><i class="bi bi-gender-female" aria-hidden="true"></i></span>
              <span><small>Female applicants</small><strong>{{ femaleCount }} <em>({{ percentOfTotal(femaleCount) }}%)</em></strong></span>
            </div>
            <div class="sex-stat">
              <span class="sex-mark sex-male"><i class="bi bi-gender-male" aria-hidden="true"></i></span>
              <span><small>Male applicants</small><strong>{{ maleCount }} <em>({{ percentOfTotal(maleCount) }}%)</em></strong></span>
            </div>
          </div>

          <div class="age-list">
            <div v-for="group in ageGroups" :key="group.label" class="age-row">
              <div class="age-heading"><span>{{ group.label }}</span><strong>{{ group.count }}</strong></div>
              <div class="age-track"><span :style="{ width: `${percentOfTotal(group.count)}%` }"></span></div>
            </div>
          </div>
        </article>

        <article class="panel recent-panel">
          <div class="panel-heading">
            <div>
              <h2>Recently registered</h2>
              <p>Latest applicant records in the selected period</p>
            </div>
            <span class="recent-count">{{ recentApplicants.length }} shown</span>
          </div>

          <div v-if="recentApplicants.length" class="recent-list">
            <div v-for="applicant in recentApplicants" :key="applicant.id" class="recent-row">
              <div class="recent-person">
                <span class="recent-avatar" :class="applicant.avatarClass">{{ applicant.initials }}</span>
                <span><strong>{{ applicant.name }}</strong><small>{{ applicant.id }}</small></span>
              </div>
              <span class="status-pill" :class="applicant.statusClass">{{ applicant.statusLabel }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <i class="bi bi-inbox" aria-hidden="true"></i>
            <span>{{ loading ? 'Loading report data…' : 'No applicants found for this period.' }}</span>
          </div>
        </article>
      </section>

      <section v-if="loaded" class="future-program" aria-label="Future report programs">
        <span class="future-icon"><i class="bi bi-plus-lg" aria-hidden="true"></i></span>
        <span class="future-copy">
          <strong>More program reports can be added here</strong>
          <small>The report selector is ready to include additional applicant programs when they are introduced.</small>
        </span>
        <span class="future-badge">READY TO EXPAND</span>
      </section>

      <footer class="reports-footer">
        <span>PESO Administration · Korea applicant report</span>
        <span>Live data · Refreshed {{ lastUpdated || 'not yet' }}</span>
      </footer>
    </div>
  </main>
</template>

<script>
import { getKoreaApplicantReport } from '@/controller/KoreaApplicantController';

export default {
  name: 'Reports',
  data() {
    return {
      programs: [{ id: 'korea', label: 'Korea Applicants' }],
      selectedProgram: 'korea',
      selectedPeriod: 'all',
      periods: [],
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
      monthlyRegistrations: [],
      demographics: { female: 0, male: 0, age_groups: [] },
      recentApplicants: [],
      loading: false,
      loaded: false,
      errorMessage: '',
      exportNotice: '',
      lastUpdated: '',
      requestSequence: 0,
    };
  },
  mounted() {
    this.loadReport();
  },
  watch: {
    selectedPeriod() {
      this.loadReport();
    },
  },
  computed: {
    stages() {
      const definitions = [
        { value: 'qualified_for_further_screening', label: 'Qualified for screening', dotClass: 'dot-green', barClass: 'bar-green' },
        { value: 'for_verification', label: 'For verification', dotClass: 'dot-blue', barClass: 'bar-blue' },
        { value: 'not_qualified', label: 'Not qualified', dotClass: 'dot-amber', barClass: 'bar-amber' },
        { value: 'referred', label: 'Referred', dotClass: 'dot-blue', barClass: 'bar-blue' },
        { value: 'place_or_hired', label: 'Placed / hired', dotClass: 'dot-green', barClass: 'bar-green' },
      ];
      const assigned = definitions.reduce((total, stage) => total + this.summary[stage.value], 0);
      definitions.push({
        value: 'not_set',
        label: 'Not set',
        dotClass: 'dot-amber',
        barClass: 'bar-amber',
        count: Math.max(0, this.summary.total - assigned),
      });

      return definitions.map((stage) => {
        const count = stage.count ?? this.summary[stage.value];
        return {
          ...stage,
          count,
          percent: this.summary.total ? Math.round((count / this.summary.total) * 100) : 0,
        };
      });
    },
    chartMax() {
      const largest = Math.max(...this.monthlyRegistrations.map((month) => month.count), 0);
      return Math.max(4, Math.ceil(largest / 2) * 2);
    },
    femaleCount() {
      return this.demographics.female;
    },
    maleCount() {
      return this.demographics.male;
    },
    ageGroups() {
      return this.demographics.age_groups;
    },
    metrics() {
      return [
        { label: 'Total applicants', value: this.summary.total, caption: 'Registered in this period', icon: 'bi-people', iconClass: 'icon-green' },
        { label: 'Incomplete documents', value: this.summary.incomplete, caption: 'Require document follow-up', icon: 'bi-folder2-open', iconClass: 'icon-amber' },
        { label: 'Referred', value: this.summary.referred, caption: 'Referred for opportunities', icon: 'bi-send-check', iconClass: 'icon-blue' },
        { label: 'Placed / hired', value: this.summary.place_or_hired, caption: 'Successfully placed', icon: 'bi-person-check', iconClass: 'icon-violet' },
      ];
    },
    pipelineDescription() {
      return this.stages.map((stage) => `${stage.label}: ${stage.count}, ${stage.percent}%`).join('; ');
    },
  },
  methods: {
    async loadReport() {
      const sequence = ++this.requestSequence;
      this.loading = true;
      this.errorMessage = '';
      this.exportNotice = '';
      try {
        const report = await getKoreaApplicantReport(this.selectedPeriod);
        if (sequence !== this.requestSequence) return;
        this.periods = report.periods;
        this.summary = report.summary;
        this.monthlyRegistrations = report.monthly_registrations;
        this.demographics = report.demographics;
        this.recentApplicants = report.recent_applicants.map((applicant) => ({
          ...applicant,
          name: [applicant.first_name, applicant.middle_name, applicant.last_name].filter(Boolean).join(' '),
          initials: `${applicant.first_name?.charAt(0) || ''}${applicant.last_name?.charAt(0) || ''}`,
          avatarClass: ['avatar-rose', 'avatar-sand', 'avatar-lilac', 'avatar-mint', 'avatar-blue'][Number(applicant.id) % 5],
          statusLabel: this.interviewLabel(applicant.initial_interview_result),
          statusClass: this.interviewClass(applicant.initial_interview_result),
        }));
        this.loaded = true;
        this.lastUpdated = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date());
      } catch (error) {
        if (sequence === this.requestSequence) {
          this.errorMessage = error.response?.data?.message || 'Unable to load report data. Please try again.';
        }
      } finally {
        if (sequence === this.requestSequence) this.loading = false;
      }
    },
    percentOfTotal(value) {
      return this.summary.total
        ? Math.round((value / this.summary.total) * 100)
        : 0;
    },
    barHeight(value) {
      return this.chartMax ? Math.max((value / this.chartMax) * 100, value ? 8 : 0) : 0;
    },
    interviewLabel(value) {
      return {
        qualified_for_further_screening: 'Qualified for screening',
        for_verification: 'For verification',
        not_qualified: 'Not qualified',
        referred: 'Referred',
        place_or_hired: 'Placed / hired',
      }[value] || 'Not set';
    },
    interviewClass(value) {
      return {
        qualified_for_further_screening: 'status-green',
        place_or_hired: 'status-green',
        for_verification: 'status-blue',
        not_qualified: 'status-amber',
        referred: 'status-blue',
      }[value] || 'status-amber';
    },
    exportReport() {
      const rows = [
        ['Korea applicant report', this.selectedPeriod === 'all' ? 'All records' : this.periods.find((period) => period.value === this.selectedPeriod)?.label],
        [],
        ['Metric', 'Count'],
        ['Total applicants', this.summary.total],
        ['Complete documents', this.summary.complete],
        ['Incomplete documents', this.summary.incomplete],
        ['Qualified for screening', this.summary.qualified_for_further_screening],
        ['For verification', this.summary.for_verification],
        ['Not qualified', this.summary.not_qualified],
        ['Referred', this.summary.referred],
        ['Placed / hired', this.summary.place_or_hired],
        ['Female applicants', this.femaleCount],
        ['Male applicants', this.maleCount],
        [],
        ['Registration month', 'Applicants'],
        ...this.monthlyRegistrations.map((month) => [month.label, month.count]),
        [],
        ['Recent applicant', 'Registration date', 'Interview result'],
        ...this.recentApplicants.map((applicant) => [
          applicant.name,
          applicant.created_at ? new Date(applicant.created_at).toLocaleDateString() : '',
          applicant.statusLabel,
        ]),
      ];
      const csv = rows.map((row) => row.map((value) => {
        const text = String(value ?? '');
        const safeText = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
        return `"${safeText.replaceAll('"', '""')}"`;
      }).join(',')).join('\r\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `korea-applicant-report-${this.selectedPeriod}.csv`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 0);
      this.exportNotice = 'Live report exported as a CSV file.';
    },
  },
};
</script>

<style scoped>
.reports-page {
  min-height: calc(100vh - 76px);
  background: #f6f8fa;
  color: #172b4d;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.reports-content {
  width: min(1440px, 100%);
  margin: 0 auto;
  padding: 2.15rem clamp(1.25rem, 4vw, 3.5rem) 1.5rem;
}

.page-heading {
  margin-bottom: 1.35rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
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
  font-size: 0.86rem;
}

.heading-actions,
.period-select,
.program-switcher-controls {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.period-select,
.program-select {
  min-height: 39px;
  padding: 0 0.7rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #e3e8ed;
  border-radius: 8px;
  background: #fff;
  color: #397863;
}

.period-select select,
.program-select select {
  appearance: none;
  min-width: 100px;
  border: 0;
  outline: 0;
  background: transparent;
  color: #536277;
  font: inherit;
  font-size: 0.68rem;
  cursor: pointer;
}

.period-select select {
  min-width: 115px;
}

.select-chevron {
  color: #929dad;
  font-size: 0.58rem;
  pointer-events: none;
}

.export-button {
  min-height: 39px;
  padding: 0 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid #e2e8ed;
  border-radius: 8px;
  background: #fff;
  color: #526176;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}

.export-button:hover {
  border-color: #cfd9d3;
  background: #f9fbfa;
}

.export-button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.export-button i {
  color: #397863;
}

.program-switcher {
  min-height: 72px;
  margin-bottom: 1rem;
  padding: 0.85rem 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid #e9edf1;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(23, 43, 77, 0.025);
}

.program-switcher-copy,
.program-switcher-controls {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.program-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: #eaf3ef;
  color: #2b735d;
}

.program-switcher-copy > span:last-child {
  display: grid;
  gap: 0.2rem;
}

.program-switcher-copy strong {
  color: #344258;
  font-size: 0.74rem;
  font-weight: 650;
}

.program-switcher-copy small {
  color: #929dad;
  font-size: 0.65rem;
}

.program-select {
  min-width: 190px;
  justify-content: space-between;
}

.program-select select {
  width: 100%;
  color: #344258;
  font-size: 0.72rem;
  font-weight: 600;
}

.program-status {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: #4d8769;
  font-size: 0.64rem;
  font-weight: 600;
}

.program-status i {
  font-size: 0.4rem;
}

.report-message,
.report-loading {
  margin-bottom: 1rem;
  padding: 0.65rem 0.75rem;
  border: 1px solid #e6ede9;
  border-radius: 8px;
  background: #f5f8f6;
  color: #597364;
  font-size: 0.69rem;
}

.report-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.report-error {
  border-color: #f0d5d3;
  background: #fff5f4;
  color: #a63832;
}

.report-success {
  color: #236343;
}

.report-message button {
  margin-left: auto;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

.report-loading {
  text-align: center;
}

.metrics-grid {
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}

.metric-card,
.panel {
  min-width: 0;
  border: 1px solid #e9edf1;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(23, 43, 77, 0.025);
}

.metric-card {
  min-height: 132px;
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.metric-top {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.metric-label {
  color: #788598;
  font-size: 0.7rem;
  font-weight: 550;
}

.metric-icon {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 9px;
  font-size: 0.9rem;
}

.icon-green { background: #eaf3ef; color: #2b735d; }
.icon-amber { background: #fbf3e8; color: #b8802d; }
.icon-blue { background: #edf3fb; color: #5278ad; }
.icon-violet { background: #f2effa; color: #7a69a7; }

.metric-value {
  margin-top: 0.55rem;
  color: #172b4d;
  font-size: 1.65rem;
  font-weight: 680;
  letter-spacing: -0.05em;
  line-height: 1.1;
}

.metric-caption {
  margin-top: 0.35rem;
  color: #9aa4b2;
  font-size: 0.63rem;
}

.reports-grid {
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 1rem;
}

.panel {
  padding: 1.15rem 1.25rem;
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.8rem;
}

.panel-heading h2 {
  margin: 0;
  color: #24344b;
  font-size: 0.88rem;
  font-weight: 650;
  letter-spacing: -0.015em;
}

.panel-heading p {
  margin: 0.3rem 0 0;
  color: #929dad;
  font-size: 0.67rem;
}

.total-badge,
.recent-count {
  padding: 0.3rem 0.48rem;
  border-radius: 6px;
  background: #f3f6f8;
  color: #788598;
  font-size: 0.61rem;
  font-weight: 600;
  white-space: nowrap;
}

.pipeline-visual {
  margin-top: 1.45rem;
}

.pipeline-bar {
  height: 9px;
  overflow: hidden;
  display: flex;
  border-radius: 8px;
  background: #f0f2f5;
}

.pipeline-bar span {
  min-width: 0;
  height: 100%;
}

.bar-amber { background: #d9ae69; }
.bar-blue { background: #82a1cc; }
.bar-green { background: #55a287; }

.stage-list {
  margin-top: 1.05rem;
  display: grid;
  gap: 0.8rem;
}

.stage-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 45px 42px;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.69rem;
}

.stage-name {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #657388;
}

.stage-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 50%;
}

.dot-amber { background: #d3a152; }
.dot-blue { background: #7194c6; }
.dot-green { background: #3b9277; }

.stage-count,
.stage-percent {
  color: #344258;
  font-weight: 650;
  text-align: right;
}

.stage-percent {
  color: #929dad;
  font-size: 0.64rem;
  font-weight: 500;
}

.panel-note {
  margin-top: 1.15rem;
  padding-top: 0.75rem;
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  border-top: 1px solid #f0f2f5;
  color: #929dad;
  font-size: 0.62rem;
  line-height: 1.45;
}

.panel-note i {
  color: #769987;
}

.chart-legend {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #8792a3;
  font-size: 0.63rem;
}

.chart-legend i {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  background: #4d9279;
}

.registration-chart {
  height: 170px;
  margin-top: 1.15rem;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: 0.4rem;
}

.chart-y-axis {
  padding: 0 0 23px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #a0a9b5;
  font-size: 0.58rem;
  text-align: right;
}

.chart-plot {
  position: relative;
  min-width: 0;
  padding-bottom: 23px;
}

.chart-gridlines {
  position: absolute;
  inset: 0 0 23px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-gridlines span {
  border-top: 1px solid #edf0f3;
}

.bar-group-list {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  gap: 1.5rem;
}

.bar-group {
  min-width: 40px;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;
}

.bar-value {
  margin-bottom: 0.25rem;
  color: #718096;
  font-size: 0.6rem;
}

.bar-track {
  width: 30px;
  height: calc(100% - 23px);
  display: flex;
  align-items: flex-end;
}

.month-bar {
  width: 100%;
  min-height: 0;
  display: block;
  border-radius: 5px 5px 2px 2px;
  background: linear-gradient(180deg, #55a287, #347d65);
  transition: height 180ms ease;
}

.month-label {
  height: 23px;
  padding-top: 0.4rem;
  color: #9aa4b2;
  font-size: 0.59rem;
  white-space: nowrap;
}

.demographics-panel,
.recent-panel {
  min-height: 275px;
}

.demographic-summary {
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
}

.sex-stat {
  min-width: 0;
  padding: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  border: 1px solid #edf0f3;
  border-radius: 9px;
  background: #fcfdfd;
}

.sex-mark {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 9px;
  font-size: 0.95rem;
}

.sex-female { background: #f5eef5; color: #93759c; }
.sex-male { background: #edf3fb; color: #6481a9; }

.sex-stat > span:last-child {
  min-width: 0;
  display: grid;
  gap: 0.18rem;
}

.sex-stat small {
  overflow: hidden;
  color: #8792a3;
  font-size: 0.6rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sex-stat strong {
  color: #344258;
  font-size: 0.85rem;
  font-weight: 650;
}

.sex-stat em {
  color: #929dad;
  font-size: 0.6rem;
  font-style: normal;
  font-weight: 500;
}

.age-list {
  margin-top: 1.05rem;
  display: grid;
  gap: 0.7rem;
}

.age-heading {
  margin-bottom: 0.3rem;
  display: flex;
  justify-content: space-between;
  color: #788598;
  font-size: 0.63rem;
}

.age-heading strong {
  color: #46566b;
  font-weight: 650;
}

.age-track {
  height: 5px;
  overflow: hidden;
  border-radius: 5px;
  background: #f0f2f5;
}

.age-track span {
  height: 100%;
  display: block;
  border-radius: inherit;
  background: #739e8b;
}

.recent-list {
  margin-top: 0.7rem;
}

.recent-row {
  min-height: 47px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  border-bottom: 1px solid #f0f2f5;
}

.recent-row:last-child {
  border-bottom: 0;
}

.recent-person {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recent-avatar {
  width: 29px;
  height: 29px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 50%;
  font-size: 0.55rem;
  font-weight: 700;
}

.avatar-rose { background: #f7e9e8; color: #a26b67; }
.avatar-sand { background: #f5eee1; color: #9a7b48; }
.avatar-lilac { background: #efebf7; color: #786a9b; }
.avatar-mint { background: #e8f2ec; color: #4d8067; }
.avatar-blue { background: #e8eff8; color: #5e7da5; }

.recent-person > span:last-child {
  min-width: 0;
  display: grid;
  gap: 0.12rem;
}

.recent-person strong {
  overflow: hidden;
  color: #344258;
  font-size: 0.65rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-person small {
  color: #9aa4b2;
  font-size: 0.57rem;
}

.status-pill {
  padding: 0.27rem 0.42rem;
  border-radius: 6px;
  font-size: 0.56rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-amber { background: #faf3e8; color: #ae833f; }
.status-blue { background: #edf3fb; color: #6283b0; }
.status-green { background: #eaf4ee; color: #4d8769; }

.empty-state {
  min-height: 175px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
  color: #929dad;
  font-size: 0.68rem;
}

.empty-state i {
  color: #9aa4b2;
  font-size: 1.4rem;
}

.future-program {
  min-height: 76px;
  padding: 0.85rem 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px dashed #dce5e0;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.55);
}

.future-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 10px;
  background: #edf4f0;
  color: #4c806b;
}

.future-copy {
  display: grid;
  gap: 0.2rem;
}

.future-copy strong {
  color: #526b5e;
  font-size: 0.69rem;
  font-weight: 650;
}

.future-copy small {
  color: #8b9a91;
  font-size: 0.62rem;
}

.future-badge {
  margin-left: auto;
  color: #8a9a90;
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  white-space: nowrap;
}

.reports-footer {
  padding: 1rem 0 0.2rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: #a0a9b5;
  font-size: 0.61rem;
}

@media (max-width: 1000px) {
  .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .reports-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 575.98px) {
  .reports-page {
    min-height: calc(100vh - 68px);
  }

  .reports-content {
    padding: 1.5rem 1rem 1rem;
  }

  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .heading-actions {
    width: 100%;
  }

  .period-select {
    flex: 1;
  }

  .period-select select {
    min-width: 0;
    width: 100%;
  }

  .program-switcher {
    align-items: flex-start;
    flex-direction: column;
  }

  .program-switcher-controls,
  .program-select {
    width: 100%;
  }

  .program-select {
    flex: 1;
  }

  .metrics-grid {
    gap: 0.6rem;
  }

  .metric-card {
    min-height: 120px;
    padding: 0.8rem;
  }

  .metric-label {
    max-width: 110px;
    font-size: 0.64rem;
  }

  .metric-icon {
    width: 29px;
    height: 29px;
  }

  .metric-value {
    font-size: 1.45rem;
  }

  .metric-caption {
    font-size: 0.58rem;
  }

  .panel {
    padding: 1rem;
  }

  .demographic-summary {
    grid-template-columns: 1fr;
  }

  .future-badge {
    display: none;
  }

  .future-copy small {
    line-height: 1.45;
  }

  .reports-footer {
    flex-direction: column;
    gap: 0.3rem;
  }
}
</style>
