<template>
  <main class="applicants-page">
    <div class="applicants-content">
      <section class="page-heading">
        <div>
          <p class="eyebrow">PESO PROGRAMS / OVERSEAS EMPLOYMENT</p>
          <h1>Korea applicants</h1>
          <p class="page-description">Manage applicants preparing for employment opportunities in Korea.</p>
        </div>
        <button class="export-button" type="button" @click="showExportNotice = true">
          <i class="bi bi-download" aria-hidden="true"></i>
          Export list
        </button>
      </section>

      <section class="summary-grid" aria-label="Applicant totals">
        <article class="summary-card">
          <span class="summary-icon summary-icon-green"><i class="bi bi-people" aria-hidden="true"></i></span>
          <span class="summary-copy"><small>Total applicants</small><strong>{{ applicants.length }}</strong></span>
        </article>
        <article class="summary-card">
          <span class="summary-icon summary-icon-amber"><i class="bi bi-folder2-open" aria-hidden="true"></i></span>
          <span class="summary-copy"><small>Incomplete documents</small><strong>{{ countFor('incomplete') }}</strong></span>
        </article>
        <article class="summary-card">
          <span class="summary-icon summary-icon-blue"><i class="bi bi-send-check" aria-hidden="true"></i></span>
          <span class="summary-copy"><small>Referred</small><strong>{{ countFor('referred') }}</strong></span>
        </article>
        <article class="summary-card">
          <span class="summary-icon summary-icon-violet"><i class="bi bi-person-check" aria-hidden="true"></i></span>
          <span class="summary-copy"><small>Placed / hired</small><strong>{{ countFor('placed') }}</strong></span>
        </article>
      </section>

      <section class="applicant-panel" aria-labelledby="applicant-list-title">
        <div class="panel-heading">
          <div>
            <h2 id="applicant-list-title">Applicant registry</h2>
            <p>Review records and track each applicant’s progress.</p>
          </div>
          <span class="registry-count">{{ filteredApplicants.length }} records</span>
        </div>

        <div class="toolbar">
          <div class="filter-tabs" role="group" aria-label="Filter applicants">
            <button
              v-for="filter in filters"
              :key="filter.value"
              type="button"
              class="filter-tab"
              :class="{ 'is-selected': activeFilter === filter.value }"
              :aria-pressed="activeFilter === filter.value"
              @click="selectFilter(filter.value)"
            >
              {{ filter.label }}
              <span class="filter-count">{{ filterCount(filter.value) }}</span>
            </button>
          </div>
          <label class="search-box">
            <i class="bi bi-search" aria-hidden="true"></i>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search applicants..."
              aria-label="Search applicants by name or applicant number"
            >
          </label>
        </div>

        <div v-if="showExportNotice" class="export-notice" role="status">
          <i class="bi bi-info-circle" aria-hidden="true"></i>
          Export is a static preview. Applicant records have not been downloaded.
          <button type="button" aria-label="Dismiss export message" @click="showExportNotice = false">
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>

        <div class="table-wrap">
          <table class="applicants-table">
            <thead>
              <tr>
                <th scope="col">FULL NAME</th>
                <th scope="col">DATE OF BIRTH</th>
                <th scope="col">SEX</th>
                <th scope="col">AGE</th>
                <th scope="col" class="action-heading">ACTION</th>
              </tr>
            </thead>
            <tbody v-if="paginatedApplicants.length">
              <tr v-for="applicant in paginatedApplicants" :key="applicant.id">
                <td>
                  <div class="applicant-identity">
                    <span class="applicant-avatar" :class="applicant.avatarClass" aria-hidden="true">
                      {{ initials(applicant) }}
                    </span>
                    <span class="applicant-name">
                      <strong>{{ fullName(applicant) }}</strong>
                      <small>{{ applicant.id }}</small>
                    </span>
                  </div>
                </td>
                <td class="date-cell">{{ applicant.dateOfBirth }}</td>
                <td class="sex-cell">{{ applicant.sex }}</td>
                <td class="age-cell">{{ applicant.age }} <span>years</span></td>
                <td class="action-cell">
                  <button class="view-button" type="button" @click="selectedApplicant = applicant">
                    View <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5">
                  <div class="empty-state">
                    <span class="empty-icon"><i class="bi bi-search" aria-hidden="true"></i></span>
                    <strong>No applicants found</strong>
                    <span>Try another search term or choose a different filter.</span>
                    <button type="button" @click="clearFilters">Clear search and filters</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-footer">
          <span class="pagination-summary">
            Showing <strong>{{ showingStart }}–{{ showingEnd }}</strong> of
            <strong>{{ filteredApplicants.length }}</strong> applicants
          </span>
          <nav class="pagination" aria-label="Applicant list pages">
            <button
              type="button"
              class="page-button page-arrow"
              aria-label="Previous page"
              :disabled="currentPage === 1"
              @click="currentPage -= 1"
            >
              <i class="bi bi-chevron-left" aria-hidden="true"></i>
            </button>
            <button
              v-for="page in pageCount"
              :key="page"
              type="button"
              class="page-button"
              :class="{ 'is-current': currentPage === page }"
              :aria-label="`Page ${page}`"
              :aria-current="currentPage === page ? 'page' : undefined"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button
              type="button"
              class="page-button page-arrow"
              aria-label="Next page"
              :disabled="currentPage === pageCount"
              @click="currentPage += 1"
            >
              <i class="bi bi-chevron-right" aria-hidden="true"></i>
            </button>
          </nav>
        </div>
      </section>

      <footer class="page-footer">
        <span>PESO Administration</span>
        <span>Serving the community through meaningful employment</span>
      </footer>
    </div>

    <div v-if="selectedApplicant" class="detail-backdrop" @click.self="selectedApplicant = null">
      <section
        class="detail-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        @keydown.esc="selectedApplicant = null"
      >
        <div class="detail-header">
          <div>
            <p class="eyebrow">APPLICANT RECORD</p>
            <h2 id="detail-title">Applicant details</h2>
          </div>
          <button class="dialog-close" type="button" aria-label="Close applicant details" @click="selectedApplicant = null">
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>
        <div class="detail-profile">
          <span class="detail-avatar" :class="selectedApplicant.avatarClass" aria-hidden="true">
            {{ initials(selectedApplicant) }}
          </span>
          <span>
            <strong>{{ fullName(selectedApplicant) }}</strong>
            <small>{{ selectedApplicant.id }}</small>
          </span>
          <span class="status-pill" :class="statusClass(selectedApplicant.status)">
            {{ selectedApplicant.statusLabel }}
          </span>
        </div>
        <dl class="detail-grid">
          <div><dt>Date of birth</dt><dd>{{ selectedApplicant.dateOfBirth }}</dd></div>
          <div><dt>Sex</dt><dd>{{ selectedApplicant.sex }}</dd></div>
          <div><dt>Age</dt><dd>{{ selectedApplicant.age }} years</dd></div>
          <div><dt>Contact number</dt><dd>{{ selectedApplicant.contact }}</dd></div>
          <div><dt>Date registered</dt><dd>{{ selectedApplicant.dateRegistered }}</dd></div>
          <div><dt>Documents</dt><dd>{{ selectedApplicant.documents }}</dd></div>
        </dl>
        <div class="detail-footer">
          <span><i class="bi bi-info-circle" aria-hidden="true"></i> Static sample applicant record</span>
          <button type="button" class="close-detail-button" @click="selectedApplicant = null">Close</button>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
export default {
  name: 'KoreaApplicants',
  data() {
    return {
      searchQuery: '',
      activeFilter: 'all',
      currentPage: 1,
      pageSize: 5,
      selectedApplicant: null,
      showExportNotice: false,
      filters: [
        { label: 'All applicants', value: 'all' },
        { label: 'Incomplete documents', value: 'incomplete' },
        { label: 'Referred', value: 'referred' },
        { label: 'Placed / hired', value: 'placed' },
      ],
      applicants: [
        {
          id: 'KR-2026-1048', firstName: 'Andrea', middleName: 'Lopez', lastName: 'Villanueva',
          dateOfBirth: 'May 14, 1998', sex: 'Female', age: 28, contact: '+63 917 555 0148',
          dateRegistered: 'Oct 06, 2026', status: 'incomplete', statusLabel: 'Incomplete documents',
          documents: '2 of 4 submitted', avatarClass: 'avatar-rose',
        },
        {
          id: 'KR-2026-1047', firstName: 'Marco', middleName: 'Garcia', lastName: 'Dela Cruz',
          dateOfBirth: 'Nov 22, 1995', sex: 'Male', age: 30, contact: '+63 918 555 0127',
          dateRegistered: 'Oct 05, 2026', status: 'referred', statusLabel: 'Referred',
          documents: 'Complete', avatarClass: 'avatar-sand',
        },
        {
          id: 'KR-2026-1046', firstName: 'Sofia', middleName: 'Ramos', lastName: 'Reyes',
          dateOfBirth: 'Feb 03, 2000', sex: 'Female', age: 26, contact: '+63 917 555 0196',
          dateRegistered: 'Oct 04, 2026', status: 'placed', statusLabel: 'Placed / hired',
          documents: 'Complete', avatarClass: 'avatar-lilac',
        },
        {
          id: 'KR-2026-1045', firstName: 'Joshua', middleName: 'Cruz', lastName: 'Mendoza',
          dateOfBirth: 'Aug 19, 1997', sex: 'Male', age: 29, contact: '+63 920 555 0163',
          dateRegistered: 'Oct 03, 2026', status: 'incomplete', statusLabel: 'Incomplete documents',
          documents: '3 of 4 submitted', avatarClass: 'avatar-mint',
        },
        {
          id: 'KR-2026-1044', firstName: 'Camille', middleName: 'Santos', lastName: 'Bautista',
          dateOfBirth: 'Jan 08, 1999', sex: 'Female', age: 27, contact: '+63 905 555 0180',
          dateRegistered: 'Oct 02, 2026', status: 'referred', statusLabel: 'Referred',
          documents: 'Complete', avatarClass: 'avatar-blue',
        },
        {
          id: 'KR-2026-1043', firstName: 'Rafael', middleName: 'Lim', lastName: 'Santos',
          dateOfBirth: 'Jun 30, 1994', sex: 'Male', age: 32, contact: '+63 917 555 0102',
          dateRegistered: 'Oct 01, 2026', status: 'placed', statusLabel: 'Placed / hired',
          documents: 'Complete', avatarClass: 'avatar-sand',
        },
        {
          id: 'KR-2026-1042', firstName: 'Patricia', middleName: 'Flores', lastName: 'Garcia',
          dateOfBirth: 'Mar 17, 2001', sex: 'Female', age: 25, contact: '+63 916 555 0194',
          dateRegistered: 'Sep 30, 2026', status: 'incomplete', statusLabel: 'Incomplete documents',
          documents: '1 of 4 submitted', avatarClass: 'avatar-rose',
        },
        {
          id: 'KR-2026-1041', firstName: 'Daniel', middleName: 'Reyes', lastName: 'Navarro',
          dateOfBirth: 'Sep 11, 1996', sex: 'Male', age: 30, contact: '+63 917 555 0151',
          dateRegistered: 'Sep 29, 2026', status: 'referred', statusLabel: 'Referred',
          documents: 'Complete', avatarClass: 'avatar-blue',
        },
        {
          id: 'KR-2026-1040', firstName: 'Isabella', middleName: 'Mora', lastName: 'Ramos',
          dateOfBirth: 'Dec 02, 1999', sex: 'Female', age: 26, contact: '+63 918 555 0116',
          dateRegistered: 'Sep 28, 2026', status: 'placed', statusLabel: 'Placed / hired',
          documents: 'Complete', avatarClass: 'avatar-lilac',
        },
        {
          id: 'KR-2026-1039', firstName: 'Gabriel', middleName: 'Torres', lastName: 'Aquino',
          dateOfBirth: 'Apr 25, 1993', sex: 'Male', age: 33, contact: '+63 905 555 0174',
          dateRegistered: 'Sep 27, 2026', status: 'incomplete', statusLabel: 'Incomplete documents',
          documents: '2 of 4 submitted', avatarClass: 'avatar-mint',
        },
        {
          id: 'KR-2026-1038', firstName: 'Nicole', middleName: 'Diaz', lastName: 'Fernandez',
          dateOfBirth: 'Jul 06, 1998', sex: 'Female', age: 28, contact: '+63 920 555 0135',
          dateRegistered: 'Sep 26, 2026', status: 'referred', statusLabel: 'Referred',
          documents: 'Complete', avatarClass: 'avatar-rose',
        },
        {
          id: 'KR-2026-1037', firstName: 'Paolo', middleName: 'Castro', lastName: 'Rivera',
          dateOfBirth: 'Oct 13, 1997', sex: 'Male', age: 28, contact: '+63 917 555 0142',
          dateRegistered: 'Sep 25, 2026', status: 'incomplete', statusLabel: 'Incomplete documents',
          documents: '3 of 4 submitted', avatarClass: 'avatar-sand',
        },
      ],
    };
  },
  computed: {
    filteredApplicants() {
      const query = this.searchQuery.trim().toLocaleLowerCase();
      return this.applicants.filter((applicant) => {
        const matchesFilter = this.activeFilter === 'all' || applicant.status === this.activeFilter;
        const searchable = `${this.fullName(applicant)} ${applicant.id}`.toLocaleLowerCase();
        return matchesFilter && (!query || searchable.includes(query));
      });
    },
    pageCount() {
      return Math.max(1, Math.ceil(this.filteredApplicants.length / this.pageSize));
    },
    paginatedApplicants() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredApplicants.slice(start, start + this.pageSize);
    },
    showingStart() {
      return this.filteredApplicants.length ? (this.currentPage - 1) * this.pageSize + 1 : 0;
    },
    showingEnd() {
      return Math.min(this.currentPage * this.pageSize, this.filteredApplicants.length);
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
  },
  methods: {
    fullName(applicant) {
      return [applicant.firstName, applicant.middleName, applicant.lastName].filter(Boolean).join(' ');
    },
    initials(applicant) {
      return `${applicant.firstName.charAt(0)}${applicant.lastName.charAt(0)}`;
    },
    countFor(status) {
      return this.applicants.filter((applicant) => applicant.status === status).length;
    },
    filterCount(filter) {
      return filter === 'all' ? this.applicants.length : this.countFor(filter);
    },
    selectFilter(filter) {
      this.activeFilter = filter;
      this.currentPage = 1;
    },
    clearFilters() {
      this.searchQuery = '';
      this.activeFilter = 'all';
      this.currentPage = 1;
    },
    statusClass(status) {
      return {
        incomplete: 'status-amber',
        referred: 'status-blue',
        placed: 'status-green',
      }[status];
    },
  },
};
</script>

<style scoped>
.applicants-page {
  min-height: calc(100vh - 76px);
  background: #f6f8fa;
  color: #172b4d;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.applicants-content {
  width: min(1440px, 100%);
  margin: 0 auto;
  padding: 2.15rem clamp(1.25rem, 4vw, 3.5rem) 1.5rem;
}

.page-heading {
  margin-bottom: 1.5rem;
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
  font-size: 0.86rem;
}

.export-button,
.view-button,
.close-detail-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 600;
  transition: background-color 150ms ease, border-color 150ms ease;
}

.export-button {
  min-height: 39px;
  padding: 0 0.8rem;
  flex: 0 0 auto;
  border: 1px solid #e2e8ed;
  background: #fff;
  color: #526176;
}

.export-button:hover {
  border-color: #cfd9d3;
  background: #f9fbfa;
}

.export-button i {
  color: #397863;
}

.summary-grid {
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}

.summary-card {
  min-height: 92px;
  padding: 1rem 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border: 1px solid #e9edf1;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(23, 43, 77, 0.025);
}

.summary-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 11px;
  font-size: 1rem;
}

.summary-icon-green { background: #eaf3ef; color: #2b735d; }
.summary-icon-amber { background: #fbf3e8; color: #b8802d; }
.summary-icon-blue { background: #edf3fb; color: #5278ad; }
.summary-icon-violet { background: #f2effa; color: #7a69a7; }

.summary-copy {
  display: grid;
  gap: 0.15rem;
}

.summary-copy small {
  color: #788598;
  font-size: 0.68rem;
  font-weight: 550;
}

.summary-copy strong {
  color: #172b4d;
  font-size: 1.2rem;
  font-weight: 680;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.applicant-panel {
  overflow: hidden;
  border: 1px solid #e9edf1;
  border-radius: 13px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(23, 43, 77, 0.025);
}

.panel-heading {
  padding: 1.25rem 1.35rem 1.1rem;
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

.registry-count {
  padding: 0.32rem 0.55rem;
  border-radius: 7px;
  background: #f3f6f8;
  color: #788598;
  font-size: 0.65rem;
  font-weight: 600;
  white-space: nowrap;
}

.toolbar {
  min-height: 59px;
  padding: 0.65rem 1.35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid #f0f2f5;
  border-bottom: 1px solid #edf0f3;
}

.filter-tabs {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  overflow-x: auto;
  scrollbar-width: thin;
}

.filter-tab {
  min-height: 34px;
  padding: 0 0.6rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex: 0 0 auto;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #798699;
  font-size: 0.68rem;
  font-weight: 550;
  white-space: nowrap;
}

.filter-tab:hover {
  background: #f6f8f9;
  color: #45566c;
}

.filter-tab.is-selected {
  background: #eaf3ef;
  color: #1f5e4d;
  font-weight: 650;
}

.filter-count {
  color: #9aa4b2;
  font-size: 0.62rem;
  font-weight: 600;
}

.filter-tab.is-selected .filter-count {
  color: #4f8873;
}

.search-box {
  width: min(260px, 31%);
  height: 35px;
  padding: 0 0.55rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex: 0 0 auto;
  border: 1px solid #e7ebf0;
  border-radius: 8px;
  background: #fff;
  color: #9aa4b2;
}

.search-box:focus-within {
  border-color: #8bb7a5;
  box-shadow: 0 0 0 3px rgba(31, 94, 77, 0.09);
}

.search-box > i {
  font-size: 0.75rem;
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #344258;
  font: inherit;
  font-size: 0.68rem;
}

.search-box input::placeholder {
  color: #a0a9b5;
}

.search-box input::-webkit-search-cancel-button {
  cursor: pointer;
}

.search-box kbd {
  padding: 0.13rem 0.28rem;
  border: 1px solid #e8ecf0;
  border-radius: 4px;
  background: #fafbfc;
  color: #a0a9b5;
  font-family: inherit;
  font-size: 0.55rem;
  white-space: nowrap;
}

.export-notice {
  margin: 0.8rem 1.35rem 0;
  padding: 0.65rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #e6ede9;
  border-radius: 8px;
  background: #f5f8f6;
  color: #597364;
  font-size: 0.69rem;
}

.export-notice button {
  margin-left: auto;
  border: 0;
  background: transparent;
  color: #758a7e;
}

.table-wrap {
  overflow-x: auto;
}

.applicants-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  white-space: nowrap;
}

.applicants-table th {
  height: 43px;
  padding: 0 1.35rem;
  border-bottom: 1px solid #edf0f3;
  background: #fbfcfd;
  color: #9aa4b2;
  font-size: 0.59rem;
  font-weight: 700;
  letter-spacing: 0.075em;
}

.applicants-table td {
  height: 65px;
  padding: 0.55rem 1.35rem;
  border-bottom: 1px solid #f0f2f5;
  color: #68768a;
  font-size: 0.72rem;
}

.applicants-table tbody tr:last-child td {
  border-bottom: 0;
}

.applicants-table tbody tr:hover:not(:has(.empty-state)) {
  background: #fcfdfd;
}

.action-heading,
.action-cell {
  text-align: right;
}

.applicant-identity {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.applicant-avatar,
.detail-avatar {
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 50%;
  font-size: 0.62rem;
  font-weight: 700;
}

.avatar-rose { background: #f7e9e8; color: #a26b67; }
.avatar-sand { background: #f5eee1; color: #9a7b48; }
.avatar-lilac { background: #efebf7; color: #786a9b; }
.avatar-mint { background: #e8f2ec; color: #4d8067; }
.avatar-blue { background: #e8eff8; color: #5e7da5; }

.applicant-name {
  display: grid;
  gap: 0.15rem;
}

.applicant-name strong {
  color: #344258;
  font-size: 0.72rem;
  font-weight: 600;
}

.applicant-name small {
  color: #9aa4b2;
  font-size: 0.61rem;
}

.date-cell,
.sex-cell {
  color: #59677b !important;
}

.age-cell {
  color: #526176 !important;
  font-weight: 600;
}

.age-cell span {
  color: #a0a9b5;
  font-size: 0.64rem;
  font-weight: 400;
}

.view-button {
  min-height: 31px;
  padding: 0 0.55rem;
  border: 1px solid #e4e9ed;
  background: #fff;
  color: #53657a;
}

.view-button:hover {
  border-color: #b8d2c6;
  background: #f4f8f6;
  color: #1f5e4d;
}

.view-button i {
  color: #6f9988;
  font-size: 0.68rem;
}

.empty-state {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.45rem;
  text-align: center;
  white-space: normal;
}

.empty-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 0.2rem;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #f2f5f7;
  color: #8a96a7;
}

.empty-state strong {
  color: #344258;
  font-size: 0.8rem;
}

.empty-state > span:last-of-type {
  color: #929dad;
  font-size: 0.68rem;
}

.empty-state button {
  margin-top: 0.3rem;
  border: 0;
  background: transparent;
  color: #397863;
  font-size: 0.68rem;
  font-weight: 600;
}

.table-footer {
  min-height: 60px;
  padding: 0.7rem 1.35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid #edf0f3;
}

.pagination-summary {
  color: #8a96a7;
  font-size: 0.67rem;
}

.pagination-summary strong {
  color: #59677b;
  font-weight: 650;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.page-button {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: #738096;
  font-size: 0.68rem;
}

.page-button:hover:not(:disabled) {
  background: #f4f7f5;
  color: #1f5e4d;
}

.page-button.is-current {
  border-color: #dce9e3;
  background: #eaf3ef;
  color: #1f5e4d;
  font-weight: 650;
}

.page-button:disabled {
  color: #c4cbd3;
  cursor: not-allowed;
}

.page-arrow {
  font-size: 0.62rem;
}

.page-footer {
  padding: 1rem 0 0.2rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: #a0a9b5;
  font-size: 0.63rem;
}

.detail-backdrop {
  position: fixed;
  z-index: 1060;
  inset: 0;
  padding: 1rem;
  display: grid;
  place-items: center;
  background: rgba(19, 32, 50, 0.38);
  backdrop-filter: blur(3px);
}

.detail-dialog {
  width: min(520px, 100%);
  padding: 1.35rem;
  border: 1px solid #e9edf1;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 24px 80px rgba(23, 43, 77, 0.2);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.detail-header .eyebrow {
  margin-bottom: 0.35rem;
}

.detail-header h2 {
  margin: 0;
  color: #24344b;
  font-size: 1.1rem;
  font-weight: 650;
}

.dialog-close {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 9px;
  background: #f4f6f8;
  color: #738096;
}

.dialog-close:hover {
  background: #eaf3ef;
  color: #1f5e4d;
}

.detail-profile {
  margin: 1.25rem 0;
  padding-bottom: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  border-bottom: 1px solid #edf0f3;
}

.detail-avatar {
  width: 44px;
  height: 44px;
  font-size: 0.72rem;
}

.detail-profile > span:nth-child(2) {
  min-width: 0;
  display: grid;
  gap: 0.2rem;
}

.detail-profile strong {
  color: #344258;
  font-size: 0.8rem;
  font-weight: 650;
}

.detail-profile small {
  color: #929dad;
  font-size: 0.66rem;
}

.status-pill {
  margin-left: auto;
  padding: 0.32rem 0.5rem;
  border-radius: 6px;
  font-size: 0.6rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-amber { background: #faf3e8; color: #ae833f; }
.status-blue { background: #edf3fb; color: #6283b0; }
.status-green { background: #eaf4ee; color: #4d8769; }

.detail-grid {
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-grid div {
  display: grid;
  gap: 0.3rem;
}

.detail-grid dt {
  color: #9aa4b2;
  font-size: 0.62rem;
  font-weight: 550;
}

.detail-grid dd {
  margin: 0;
  color: #46566b;
  font-size: 0.72rem;
  font-weight: 550;
}

.detail-footer {
  margin-top: 1.35rem;
  padding-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid #edf0f3;
}

.detail-footer > span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #98a2af;
  font-size: 0.62rem;
}

.close-detail-button {
  min-height: 34px;
  padding: 0 0.8rem;
  border: 0;
  background: #1f5e4d;
  color: #fff;
}

.close-detail-button:hover {
  background: #174b3d;
}

@media (max-width: 850px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .search-box {
    width: 100%;
  }
}

@media (max-width: 575.98px) {
  .applicants-page {
    min-height: calc(100vh - 68px);
  }

  .applicants-content {
    padding: 1.5rem 1rem 1rem;
  }

  .page-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 1rem;
  }

  .page-heading h1 {
    font-size: 1.55rem;
  }

  .page-description {
    max-width: 330px;
    font-size: 0.8rem;
    line-height: 1.55;
  }

  .summary-grid {
    gap: 0.6rem;
  }

  .summary-card {
    min-height: 76px;
    padding: 0.7rem;
    gap: 0.55rem;
  }

  .summary-icon {
    width: 32px;
    height: 32px;
    font-size: 0.85rem;
  }

  .summary-copy small {
    font-size: 0.6rem;
    line-height: 1.25;
  }

  .summary-copy strong {
    font-size: 1.05rem;
  }

  .panel-heading {
    padding: 1rem;
  }

  .toolbar {
    padding-inline: 1rem;
  }

  .filter-tabs {
    margin-inline: -0.2rem;
  }

  .filter-tab {
    padding-inline: 0.45rem;
    font-size: 0.63rem;
  }

  .applicants-table {
    min-width: 640px;
  }

  .applicants-table th,
  .applicants-table td {
    padding-inline: 0.85rem;
  }

  .table-footer {
    padding-inline: 1rem;
  }

  .pagination-summary {
    font-size: 0.6rem;
    white-space: nowrap;
  }

  .pagination {
    gap: 0;
  }

  .page-button {
    width: 27px;
    height: 27px;
  }

  .page-footer {
    flex-direction: column;
    gap: 0.3rem;
  }

  .detail-dialog {
    padding: 1.1rem;
  }

  .detail-profile {
    flex-wrap: wrap;
  }

  .detail-profile .status-pill {
    margin-left: 3.2rem;
  }
}
</style>
