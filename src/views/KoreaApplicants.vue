<template>
  <main class="applicants-page">
    <div class="applicants-content">
      <section class="page-heading">
        <div>
          <p class="eyebrow">PESO PROGRAMS / OVERSEAS EMPLOYMENT</p>
          <h1>Korea applicants</h1>
          <p class="page-description">Manage applicants preparing for employment opportunities in Korea.</p>
        </div>
        <button class="export-button" type="button" @click="openCreate">
          <i class="bi bi-plus-lg" aria-hidden="true"></i>
          Add applicant
        </button>
      </section>

      <section class="summary-grid" aria-label="Applicant totals">
        <article class="summary-card">
          <span class="summary-icon summary-icon-green"><i class="bi bi-people" aria-hidden="true"></i></span>
          <span class="summary-copy"><small>Total applicants</small><strong>{{ summary.total }}</strong></span>
        </article>
        <article class="summary-card">
          <span class="summary-icon summary-icon-amber"><i class="bi bi-folder2-open" aria-hidden="true"></i></span>
          <span class="summary-copy"><small>Incomplete documents</small><strong>{{ summary.incomplete }}</strong></span>
        </article>
        <article class="summary-card">
          <span class="summary-icon summary-icon-blue"><i class="bi bi-send-check" aria-hidden="true"></i></span>
          <span class="summary-copy"><small>Qualified for screening</small><strong>{{ summary.qualified_for_further_screening }}</strong></span>
        </article>
        <article class="summary-card">
          <span class="summary-icon summary-icon-violet"><i class="bi bi-person-check" aria-hidden="true"></i></span>
          <span class="summary-copy"><small>For verification</small><strong>{{ summary.for_verification }}</strong></span>
        </article>
      </section>

      <section class="applicant-panel" aria-labelledby="applicant-list-title">
        <div class="panel-heading">
          <div>
            <h2 id="applicant-list-title">Applicant registry</h2>
            <p>Review records and track document and interview status.</p>
          </div>
          <span class="registry-count">{{ pagination.total || 0 }} records</span>
        </div>

        <div class="toolbar">
          <div class="filter-tabs">
            <label class="list-filter">
              Documents
              <select v-model="documentFilter" @change="applyFilters">
                <option value="">All</option>
                <option value="incomplete">Incomplete</option>
                <option value="complete">Complete</option>
              </select>
            </label>
            <label class="list-filter">
              Interview
              <select v-model="interviewFilter" @change="applyFilters">
                <option value="">All results</option>
                <option value="qualified_for_further_screening">Qualified for screening</option>
                <option value="for_verification">For verification</option>
                <option value="not_qualified">Not qualified</option>
              </select>
            </label>
          </div>
          <label class="search-box">
            <i class="bi bi-search" aria-hidden="true"></i>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search name, contact, or ID..."
              aria-label="Search applicants by name, contact, or ID"
            >
          </label>
        </div>

        <div v-if="errorMessage" class="request-message request-error" role="alert">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="request-message request-success" role="status">
          {{ successMessage }}
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
            <tbody v-if="applicants.length">
              <tr v-for="applicant in applicants" :key="applicant.id">
                <td>
                  <div class="applicant-identity">
                    <span class="applicant-avatar" :class="avatarClass(applicant.id)" aria-hidden="true">
                      {{ initials(applicant) }}
                    </span>
                    <span class="applicant-name">
                      <strong>{{ fullName(applicant) }}</strong>
                      <small>Applicant #{{ applicant.id }}</small>
                    </span>
                  </div>
                </td>
                <td class="date-cell">{{ formatDate(applicant.date_of_birth) }}</td>
                <td class="sex-cell">{{ applicant.sex || '—' }}</td>
                <td class="age-cell">{{ applicant.age }} <span>years</span></td>
                <td class="action-cell">
                  <button class="view-button" type="button" @click="openDetails(applicant.id)">
                    View <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
                  </button>
                  <button class="view-button" type="button" @click="openEdit(applicant.id)">Edit</button>
                  <button class="view-button action-delete" type="button" @click="removeApplicant(applicant)">Delete</button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5">
                  <div class="empty-state">
                    <span class="empty-icon"><i class="bi bi-search" aria-hidden="true"></i></span>
                    <strong>No applicants found</strong>
                    <span>{{ loading ? 'Loading applicant records…' : 'Try another search term or adjust the filters.' }}</span>
                    <button type="button" @click="clearFilters">Clear search and filters</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-footer">
          <span class="pagination-summary">
            Showing <strong>{{ pagination.from || 0 }}–{{ pagination.to || 0 }}</strong> of
            <strong>{{ pagination.total || 0 }}</strong> applicants
          </span>
          <nav class="pagination" aria-label="Applicant list pages">
            <button
              type="button"
              class="page-button page-arrow"
              aria-label="Previous page"
              :disabled="currentPage === 1 || loading"
              @click="changePage(currentPage - 1)"
            >
              <i class="bi bi-chevron-left" aria-hidden="true"></i>
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              type="button"
              class="page-button"
              :class="{ 'is-current': currentPage === page }"
              :aria-label="`Page ${page}`"
              :aria-current="currentPage === page ? 'page' : undefined"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
            <button
              type="button"
              class="page-button page-arrow"
              aria-label="Next page"
              :disabled="currentPage === pageCount || loading"
              @click="changePage(currentPage + 1)"
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

    <div v-if="selectedApplicant" class="detail-backdrop">
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
          <span class="detail-avatar avatar-mint" aria-hidden="true">
            {{ initials(selectedApplicant) }}
          </span>
          <span>
            <strong>{{ fullName(selectedApplicant) }}</strong>
            <small>Applicant #{{ selectedApplicant.id }}</small>
          </span>
          <span class="status-pill" :class="statusClass(selectedApplicant.document_completeness)">
            {{ selectedApplicant.document_completeness || 'Status not set' }}
          </span>
        </div>
        <dl class="detail-grid">
          <div><dt>Date of birth</dt><dd>{{ formatDate(selectedApplicant.date_of_birth) }}</dd></div>
          <div><dt>Sex</dt><dd>{{ selectedApplicant.sex }}</dd></div>
          <div><dt>Age</dt><dd>{{ selectedApplicant.age }} years</dd></div>
          <div><dt>Contact number</dt><dd>{{ selectedApplicant.contact_number }}</dd></div>
          <div><dt>Barangay</dt><dd>{{ selectedApplicant.barangay }}</dd></div>
          <div><dt>Civil status</dt><dd>{{ selectedApplicant.civil_status }}</dd></div>
          <div><dt>Interview result</dt><dd>{{ interviewLabel(selectedApplicant.initial_interview_result) }}</dd></div>
          <div><dt>Education</dt><dd>{{ selectedApplicant.educational_attainment }}</dd></div>
          <div><dt>Valid ID</dt><dd>{{ selectedApplicant.valid_id }} — {{ selectedApplicant.valid_id_number }}</dd></div>
          <div><dt>Residency certificate</dt><dd>{{ selectedApplicant.barangay_residency_certificate ? 'Submitted' : 'Not submitted' }}</dd></div>
          <div><dt>Passport</dt><dd>{{ selectedApplicant.passport ? selectedApplicant.passport_number || 'Yes' : 'No' }}</dd></div>
          <div><dt>Passport expiry</dt><dd>{{ formatDate(selectedApplicant.passport_expiry) }}</dd></div>
          <div><dt>Korean language ability</dt><dd>{{ selectedApplicant.korean_language_ability || '—' }}</dd></div>
          <div><dt>Farm experience</dt><dd>{{ selectedApplicant.farm_experience ? `${selectedApplicant.farm_experience_duration || 0} ${selectedApplicant.farm_experience_units || ''}` : 'No' }}</dd></div>
          <div><dt>Farm skills</dt><dd>{{ relationNames(selectedApplicant.farm_skills, 'farmSkill', 'skill_name') }}</dd></div>
          <div><dt>Farm work</dt><dd>{{ relationNames(selectedApplicant.farm_works, 'farmWork', 'work_name') }}</dd></div>
          <div><dt>Crops handled</dt><dd>{{ relationNames(selectedApplicant.crops_handled, null, 'crop_name') }}</dd></div>
          <div><dt>Equipment skills</dt><dd>{{ relationNames(selectedApplicant.equipment_skills, null, 'equipment_skills') }}</dd></div>
          <div><dt>Previous employment</dt><dd>{{ selectedApplicant.previous_employment || '—' }}</dd></div>
          <div><dt>Korea work experience</dt><dd>{{ selectedApplicant.korea_work_experience || '—' }}</dd></div>
          <div><dt>Previous overseas employment</dt><dd>{{ selectedApplicant.previous_overseas_employment || '—' }}</dd></div>
          <div><dt>Remarks</dt><dd>{{ selectedApplicant.remarks || '—' }}</dd></div>
        </dl>
        <section class="detail-records">
          <h3>TESDA certifications</h3>
          <p v-for="record in selectedApplicant.tesda_ncs || []" :key="record.id">
            {{ record.tesda_nc }}
            <a v-if="record.tesda_nc_document_url" :href="record.tesda_nc_document_url" target="_blank" rel="noopener">View file</a>
          </p>
          <p v-if="!selectedApplicant.tesda_ncs || selectedApplicant.tesda_ncs.length === 0">No TESDA certifications recorded.</p>
          <h3>Relevant training</h3>
          <p v-for="record in selectedApplicant.relevant_trainings || []" :key="record.id">
            {{ record.training_name }}
            <a v-if="record.training_document_url" :href="record.training_document_url" target="_blank" rel="noopener">View file</a>
          </p>
          <p v-if="!selectedApplicant.relevant_trainings || selectedApplicant.relevant_trainings.length === 0">No relevant training recorded.</p>
          <h3>Applicant documents</h3>
          <div class="document-links">
            <template v-for="(url, name) in selectedApplicant.document_urls" :key="name">
              <a v-if="url" :href="url" target="_blank" rel="noopener">{{ documentLabel(name) }}</a>
            </template>
          </div>
        </section>
        <div class="detail-footer">
          <span>Created {{ formatDate(selectedApplicant.created_at) }}</span>
          <div class="detail-actions">
            <button type="button" class="view-button" @click="openEdit(selectedApplicant.id)">Edit</button>
            <button type="button" class="close-detail-button" @click="selectedApplicant = null">Close</button>
          </div>
        </div>
      </section>
    </div>

    <div v-if="showForm" class="detail-backdrop">
      <section class="detail-dialog applicant-form-dialog" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div class="detail-header">
          <div>
            <p class="eyebrow">KOREA APPLICANT</p>
            <h2 id="form-title">{{ editingId ? 'Edit applicant' : 'Add applicant' }}</h2>
          </div>
          <button class="dialog-close" type="button" aria-label="Close applicant form" @click="closeForm">
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>
        <form class="applicant-form" @submit.prevent="saveApplicant">
          <p v-if="formError" class="request-message request-error" role="alert">{{ formError }}</p>
          <h3>Personal information</h3>
          <div class="form-grid">
            <label>First name<input v-model.trim="form.first_name" required maxlength="255"></label>
            <label>Middle name<input v-model.trim="form.middle_name" maxlength="255"></label>
            <label>Last name<input v-model.trim="form.last_name" required maxlength="255"></label>
            <label>Date of birth<input v-model="form.date_of_birth" type="date" required></label>
            <label>Sex<input v-model.trim="form.sex" required maxlength="50"></label>
            <label>Age<input v-model.number="form.age" type="number" min="0" max="120" required></label>
            <label>Barangay<input v-model.trim="form.barangay" required maxlength="255"></label>
            <label>Contact number<input v-model.trim="form.contact_number" required maxlength="50"></label>
            <label>Civil status<input v-model.trim="form.civil_status" required maxlength="50"></label>
            <label>Educational attainment<input v-model.trim="form.educational_attainment" required maxlength="255"></label>
          </div>

          <h3>Identity and travel documents</h3>
          <div class="form-grid">
            <label>Government-issued ID type
              <select v-model="form.valid_id" required>
                <option disabled value="">Select an ID type</option>
                <option v-for="idType in validIdTypes" :key="idType" :value="idType">{{ idType }}</option>
                <option v-if="form.valid_id && !validIdTypes.includes(form.valid_id)" :value="form.valid_id">{{ form.valid_id }}</option>
              </select>
            </label>
            <label>Valid ID number<input v-model.trim="form.valid_id_number" required maxlength="255"></label>
            <label>Valid ID image or PDF<input type="file" accept="image/*,.pdf" @change="setApplicantFile($event, 'valid_id_document')"></label>
            <label class="form-checkbox"><input v-model="form.barangay_residency_certificate" type="checkbox"> Barangay residency certificate submitted</label>
            <label>Residency certificate image or PDF<input type="file" accept="image/*,.pdf" @change="setApplicantFile($event, 'barangay_residency_certificate_document')"></label>
            <label class="form-checkbox"><input v-model="form.passport" type="checkbox"> Has passport</label>
            <label>Passport number<input v-model.trim="form.passport_number" maxlength="255"></label>
            <label>Passport expiry<input v-model="form.passport_expiry" type="date"></label>
            <label>Passport image or PDF<input type="file" accept="image/*,.pdf" @change="setApplicantFile($event, 'passport_document')"></label>
          </div>

          <h3>Experience and screening</h3>
          <div class="form-grid">
            <label class="form-checkbox"><input v-model="form.farm_experience" type="checkbox"> Has farm experience</label>
            <label>Farm experience duration<input v-model.number="form.farm_experience_duration" type="number" min="0"></label>
            <label>Duration unit<select v-model="form.farm_experience_units"><option value="">Choose unit</option><option value="months">Months</option><option value="years">Years</option></select></label>
            <label>Previous employment<textarea v-model="form.previous_employment" rows="2"></textarea></label>
            <label>Korea work experience<textarea v-model="form.korea_work_experience" rows="2"></textarea></label>
            <label>Previous overseas employment<textarea v-model="form.previous_overseas_employment" rows="2"></textarea></label>
            <label>Korean language ability<input v-model.trim="form.korean_language_ability" maxlength="255"></label>
            <label>Korean ability proof image or PDF<input type="file" accept="image/*,.pdf" @change="setApplicantFile($event, 'korean_language_ability_document')"></label>
            <label>Document completeness<select v-model="form.document_completeness"><option value="">Not set</option><option value="complete">Complete</option><option value="incomplete">Incomplete</option></select></label>
            <label>Initial interview result<select v-model="form.initial_interview_result"><option value="">Not set</option><option value="qualified_for_further_screening">Qualified for further screening</option><option value="for_verification">For verification</option><option value="not_qualified">Not qualified</option></select></label>
            <label>Remarks<textarea v-model="form.remarks" rows="2"></textarea></label>
          </div>

          <h3>Farm skills</h3>
          <div class="form-grid">
            <fieldset class="choice-field">
              <legend>Farm skills <span>Select all that apply</span></legend>
              <label v-for="skill in options.farm_skills" :key="skill.id" class="choice-option">
                <input v-model="form.farm_skills" type="checkbox" :value="Number(skill.id)">
                {{ skill.skill_name }}
              </label>
              <p v-if="options.farm_skills.length === 0" class="choice-empty">No farm skills are available.</p>
            </fieldset>
            <fieldset class="choice-field">
              <legend>Farm work <span>Select all that apply</span></legend>
              <label v-for="work in options.farm_works" :key="work.id" class="choice-option">
                <input v-model="form.farm_works" type="checkbox" :value="Number(work.id)">
                {{ work.work_name }}
              </label>
              <p v-if="options.farm_works.length === 0" class="choice-empty">No farm work options are available.</p>
            </fieldset>
            <div class="repeatable-field">
              <div class="repeatable-heading">
                <span>Crops handled</span>
                <button type="button" class="view-button" @click="addListItem('crops_handled')">Add crop</button>
              </div>
              <div v-for="(crop, index) in form.crops_handled" :key="crop._key" class="repeatable-row">
                <input v-model.trim="crop.value" :aria-label="`Crop ${index + 1}`" maxlength="255" placeholder="Enter crop name">
                <button v-if="form.crops_handled.length > 1" type="button" class="action-delete" :aria-label="`Remove crop ${index + 1}`" @click="removeListItem('crops_handled', index)">Remove</button>
              </div>
            </div>
            <div class="repeatable-field">
              <div class="repeatable-heading">
                <span>Equipment skills</span>
                <button type="button" class="view-button" @click="addListItem('equipment_skills')">Add equipment</button>
              </div>
              <div v-for="(equipment, index) in form.equipment_skills" :key="equipment._key" class="repeatable-row">
                <input v-model.trim="equipment.value" :aria-label="`Equipment skill ${index + 1}`" maxlength="255" placeholder="Enter equipment or machine">
                <button v-if="form.equipment_skills.length > 1" type="button" class="action-delete" :aria-label="`Remove equipment skill ${index + 1}`" @click="removeListItem('equipment_skills', index)">Remove</button>
              </div>
            </div>
          </div>

          <div class="designation-heading">
            <h3>Relevant training and documents</h3>
            <button type="button" class="view-button" @click="addTraining">Add training</button>
          </div>
          <div v-for="(training, index) in form.relevant_trainings" :key="training._key" class="designation-row">
            <label>Training name<input v-model.trim="training.training_name" required maxlength="255"></label>
            <label>Training image or PDF<input type="file" accept="image/*,.pdf" @change="setDesignationFile($event, 'relevant_trainings', training._key)"></label>
            <a v-if="training.training_document_url" :href="training.training_document_url" target="_blank" rel="noopener">Current file</a>
            <button type="button" class="action-delete" @click="removeDesignation('relevant_trainings', index)">Remove</button>
          </div>

          <div class="designation-heading">
            <h3>TESDA NC and documents</h3>
            <button type="button" class="view-button" @click="addTesda">Add TESDA NC</button>
          </div>
          <div v-for="(tesda, index) in form.tesda_ncs" :key="tesda._key" class="designation-row">
            <label>TESDA NC<input v-model.trim="tesda.tesda_nc" required maxlength="255"></label>
            <label>TESDA NC image or PDF<input type="file" accept="image/*,.pdf" @change="setDesignationFile($event, 'tesda_ncs', tesda._key)"></label>
            <a v-if="tesda.tesda_nc_document_url" :href="tesda.tesda_nc_document_url" target="_blank" rel="noopener">Current file</a>
            <button type="button" class="action-delete" @click="removeDesignation('tesda_ncs', index)">Remove</button>
          </div>

          <div class="form-actions">
            <button class="view-button" type="button" @click="closeForm">Cancel</button>
            <button class="close-detail-button" type="submit" :disabled="saving">
              {{ saving ? 'Saving…' : editingId ? 'Save changes' : 'Create applicant' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<script>
import {
  createKoreaApplicant,
  deleteKoreaApplicant,
  getKoreaApplicantById,
  getKoreaApplicantOptions,
  getKoreaApplicants,
  updateKoreaApplicant,
} from '@/controller/KoreaApplicantController';

const validIdTypes = [
  'Philippine National ID (PhilID/ePhilID)',
  'Philippine Passport',
  'Driver’s License',
  'Unified Multi-Purpose ID (UMID)',
  'SSS ID',
  'GSIS eCard',
  'PRC ID',
  'PhilHealth ID',
  'Postal ID',
  'Voter’s Certification (COMELEC)',
  'Senior Citizen ID',
  'PWD ID',
  'Seafarer’s Identification and Record Book',
  'Alien Certificate of Registration Identity Card (ACR I-Card)',
  'Barangay ID',
  'Other government-issued ID',
];

function newListItem(value = '') {
  return { _key: `item-${Date.now()}-${Math.random()}`, value };
}

function emptyApplicant() {
  return {
    first_name: '', middle_name: '', last_name: '', date_of_birth: '', sex: '', age: '',
    barangay: '', contact_number: '', valid_id: '', valid_id_number: '',
    barangay_residency_certificate: false, passport: false, passport_number: '', passport_expiry: '',
    civil_status: '', educational_attainment: '', farm_experience: false,
    farm_experience_units: '', farm_experience_duration: '', previous_employment: '',
    korea_work_experience: '', previous_overseas_employment: '', korean_language_ability: '',
    document_completeness: 'incomplete', initial_interview_result: '', remarks: '',
    farm_skills: [], farm_works: [], relevant_trainings: [], tesda_ncs: [],
    crops_handled: [newListItem()], equipment_skills: [newListItem()],
  };
}

function requestError(error) {
  const errors = error?.response?.data?.errors;
  if (errors) return Object.values(errors).flat().join(' ');
  return error?.response?.data?.message || error?.message || 'The request could not be completed.';
}

export default {
  name: 'KoreaApplicants',
  data() {
    return {
      applicants: [],
      summary: { total: 0, complete: 0, incomplete: 0, qualified_for_further_screening: 0, for_verification: 0, not_qualified: 0 },
      pagination: { current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 },
      options: { farm_skills: [], farm_works: [] },
      validIdTypes,
      searchQuery: '',
      documentFilter: '',
      interviewFilter: '',
      currentPage: 1,
      pageSize: 10,
      loading: false,
      saving: false,
      showForm: false,
      editingId: null,
      selectedApplicant: null,
      form: emptyApplicant(),
      formFiles: { applicant: {}, relevant_trainings: {}, tesda_ncs: {} },
      errorMessage: '',
      formError: '',
      successMessage: '',
      fetchSequence: 0,
      searchTimer: null,
    };
  },
  computed: {
    pageCount() { return Math.max(1, this.pagination.last_page || 1); },
    visiblePages() {
      const first = Math.max(1, this.currentPage - 2);
      const last = Math.min(this.pageCount, first + 4);
      return Array.from({ length: last - first + 1 }, (_, index) => first + index);
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => this.loadApplicants(), 300);
    },
  },
  mounted() {
    this.loadApplicants();
    this.loadOptions();
  },
  beforeUnmount() { clearTimeout(this.searchTimer); },
  methods: {
    async loadOptions() {
      try { this.options = await getKoreaApplicantOptions(); }
      catch (error) { this.errorMessage = requestError(error); }
    },
    async loadApplicants() {
      const sequence = ++this.fetchSequence;
      this.loading = true;
      this.errorMessage = '';
      const params = {
        page: this.currentPage,
        per_page: this.pageSize,
        search: this.searchQuery.trim(),
        document_completeness: this.documentFilter,
        initial_interview_result: this.interviewFilter,
      };
      Object.keys(params).forEach((key) => { if (params[key] === '') delete params[key]; });
      try {
        const response = await getKoreaApplicants(params);
        if (sequence !== this.fetchSequence) return;
        this.applicants = response.data.data || [];
        this.pagination = response.data;
        this.summary = response.summary;
        if (this.currentPage > this.pageCount) {
          this.currentPage = this.pageCount;
          return this.loadApplicants();
        }
      } catch (error) {
        if (sequence === this.fetchSequence) this.errorMessage = requestError(error);
      } finally {
        if (sequence === this.fetchSequence) this.loading = false;
      }
    },
    applyFilters() { this.currentPage = 1; this.loadApplicants(); },
    changePage(page) {
      if (page < 1 || page > this.pageCount || page === this.currentPage) return;
      this.currentPage = page;
      this.loadApplicants();
    },
    clearFilters() {
      clearTimeout(this.searchTimer);
      const searchChanged = this.searchQuery !== '';
      this.searchQuery = '';
      this.documentFilter = '';
      this.interviewFilter = '';
      this.currentPage = 1;
      if (!searchChanged) this.loadApplicants();
    },
    fullName(applicant) { return [applicant.first_name, applicant.middle_name, applicant.last_name].filter(Boolean).join(' '); },
    initials(applicant) { return `${applicant.first_name?.charAt(0) || ''}${applicant.last_name?.charAt(0) || ''}`; },
    avatarClass(id) { return ['avatar-rose', 'avatar-sand', 'avatar-lilac', 'avatar-mint', 'avatar-blue'][Number(id) % 5]; },
    relationNames(records, relation, field) {
      return (records || []).map((record) => (relation ? record[relation]?.[field] : record[field])).filter(Boolean).join(', ') || '—';
    },
    formatDate(value) {
      if (!value) return '—';
      const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
      const date = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(value);
      return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
    },
    interviewLabel(value) {
      return { qualified_for_further_screening: 'Qualified for further screening', for_verification: 'For verification', not_qualified: 'Not qualified' }[value] || 'Not set';
    },
    statusClass(status) { return status === 'complete' ? 'status-green' : status === 'incomplete' ? 'status-amber' : 'status-blue'; },
    documentLabel(name) { return name.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()); },
    async openDetails(id) {
      this.errorMessage = '';
      try { this.selectedApplicant = (await getKoreaApplicantById(id)).data; }
      catch (error) { this.errorMessage = requestError(error); }
    },
    openCreate() {
      this.editingId = null;
      this.form = emptyApplicant();
      this.formFiles = { applicant: {}, relevant_trainings: {}, tesda_ncs: {} };
      this.formError = '';
      this.selectedApplicant = null;
      this.showForm = true;
    },
    async openEdit(id) {
      this.formError = '';
      this.errorMessage = '';
      try {
        const applicant = (await getKoreaApplicantById(id)).data;
        this.editingId = applicant.id;
        this.selectedApplicant = null;
        this.form = {
          ...emptyApplicant(), ...applicant,
          farm_skills: (applicant.farm_skills || []).map((record) => Number(record.farm_skill_id)),
          farm_works: (applicant.farm_works || []).map((record) => Number(record.farm_work_id)),
          crops_handled: (applicant.crops_handled || []).map((record) => newListItem(record.crop_name)),
          equipment_skills: (applicant.equipment_skills || []).map((record) => newListItem(record.equipment_skills)),
          relevant_trainings: (applicant.relevant_trainings || []).map((record) => ({ ...record, _key: `training-${record.id}` })),
          tesda_ncs: (applicant.tesda_ncs || []).map((record) => ({ ...record, _key: `tesda-${record.id}` })),
        };
        if (this.form.crops_handled.length === 0) this.form.crops_handled = [newListItem()];
        if (this.form.equipment_skills.length === 0) this.form.equipment_skills = [newListItem()];
        this.formFiles = { applicant: {}, relevant_trainings: {}, tesda_ncs: {} };
        this.showForm = true;
      } catch (error) { this.errorMessage = requestError(error); }
    },
    closeForm() { if (!this.saving) this.showForm = false; },
    setApplicantFile(event, field) { this.formFiles.applicant[field] = event.target.files?.[0] || null; },
    setDesignationFile(event, group, key) { this.formFiles[group][key] = event.target.files?.[0] || null; },
    addTraining() {
      const key = `training-new-${Date.now()}-${Math.random()}`;
      this.form.relevant_trainings.push({ _key: key, training_name: '', training_document_url: null });
    },
    addTesda() {
      const key = `tesda-new-${Date.now()}-${Math.random()}`;
      this.form.tesda_ncs.push({ _key: key, tesda_nc: '', tesda_nc_document_url: null });
    },
    removeDesignation(group, index) {
      const [record] = this.form[group].splice(index, 1);
      if (record) delete this.formFiles[group][record._key];
    },
    addListItem(field) { this.form[field].push(newListItem()); },
    removeListItem(field, index) { this.form[field].splice(index, 1); },
    buildFormData() {
      const body = new FormData();
      const fields = [
        'first_name', 'middle_name', 'last_name', 'date_of_birth', 'sex', 'age', 'barangay', 'contact_number',
        'valid_id', 'valid_id_number', 'barangay_residency_certificate', 'passport', 'passport_number', 'passport_expiry',
        'civil_status', 'educational_attainment', 'farm_experience', 'farm_experience_units', 'farm_experience_duration',
        'previous_employment', 'korea_work_experience', 'previous_overseas_employment', 'korean_language_ability',
        'document_completeness', 'initial_interview_result', 'remarks',
      ];
      fields.forEach((field) => {
        const value = this.form[field];
        body.append(field, typeof value === 'boolean' ? (value ? '1' : '0') : value ?? '');
      });
      if (this.editingId) body.append('_method', 'PUT');
      const arrays = {
        crops_handled: this.form.crops_handled.map(({ value }) => value.trim()).filter(Boolean).map((crop_name) => ({ crop_name })),
        equipment_skills: this.form.equipment_skills.map(({ value }) => value.trim()).filter(Boolean).map((equipment_skills) => ({ equipment_skills })),
        farm_skills: this.form.farm_skills.map((farm_skill_id) => ({ farm_skill_id })),
        farm_works: this.form.farm_works.map((farm_work_id) => ({ farm_work_id })),
        relevant_trainings: this.form.relevant_trainings.map(({ id, training_name }) => ({ ...(id ? { id } : {}), training_name })),
        tesda_ncs: this.form.tesda_ncs.map(({ id, tesda_nc }) => ({ ...(id ? { id } : {}), tesda_nc })),
      };
      Object.entries(arrays).forEach(([field, values]) => body.append(`${field}_json`, JSON.stringify(values)));
      Object.entries(this.formFiles.applicant).forEach(([field, file]) => { if (file) body.append(field, file); });
      ['relevant_trainings', 'tesda_ncs'].forEach((group) => {
        this.form[group].forEach((record, index) => {
          const fileField = group === 'relevant_trainings' ? 'training_document' : 'tesda_nc_document';
          const file = this.formFiles[group][record._key];
          if (file) body.append(`${group}[${index}][${fileField}]`, file);
        });
      });
      return body;
    },
    async saveApplicant() {
      this.saving = true;
      this.formError = '';
      try {
        const body = this.buildFormData();
        if (this.editingId) await updateKoreaApplicant(this.editingId, body);
        else await createKoreaApplicant(body);
        this.showForm = false;
        this.successMessage = this.editingId ? 'Applicant updated successfully.' : 'Applicant created successfully.';
        this.currentPage = 1;
        await this.loadApplicants();
      } catch (error) { this.formError = requestError(error); }
      finally { this.saving = false; }
    },
    async removeApplicant(applicant) {
      if (!window.confirm(`Delete ${this.fullName(applicant)}? This cannot be undone.`)) return;
      this.errorMessage = '';
      this.successMessage = '';
      try {
        await deleteKoreaApplicant(applicant.id);
        this.successMessage = 'Applicant deleted successfully.';
        if (this.selectedApplicant?.id === applicant.id) this.selectedApplicant = null;
        await this.loadApplicants();
      } catch (error) { this.errorMessage = requestError(error); }
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

.list-filter {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: #798699;
  font-size: 0.68rem;
  white-space: nowrap;
}

.list-filter select {
  min-height: 34px;
  padding: 0 1.7rem 0 0.55rem;
  border: 1px solid #e7ebf0;
  border-radius: 7px;
  background: #fff;
  color: #45566c;
  font: inherit;
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

.action-cell {
  white-space: nowrap;
}

.action-delete {
  color: #a44c4c !important;
}

.action-delete:hover {
  border-color: #e8caca !important;
  background: #fff7f7 !important;
}

.request-message {
  margin: 0.8rem 1.35rem;
  padding: 0.7rem 0.8rem;
  border-radius: 8px;
  font-size: 0.72rem;
  line-height: 1.5;
}

.request-error {
  border: 1px solid #f0d1d1;
  background: #fff7f7;
  color: #954343;
}

.request-success {
  border: 1px solid #d8e9df;
  background: #f4faf6;
  color: #39745c;
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

.detail-records {
  margin-top: 1.2rem;
}

.detail-records h3 {
  margin: 1rem 0 0.35rem;
  color: #526176;
  font-size: 0.7rem;
  font-weight: 650;
}

.detail-records p,
.document-links a {
  color: #68768a;
  font-size: 0.68rem;
}

.detail-records p {
  margin: 0.25rem 0;
}

.detail-records a,
.document-links a {
  margin-left: 0.4rem;
  color: #397863;
}

.document-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.document-links a {
  margin: 0;
}

.detail-actions,
.form-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.applicant-form-dialog {
  width: min(860px, 100%);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
}

.applicant-form {
  margin-top: 1rem;
}

.applicant-form h3,
.designation-heading h3 {
  margin: 1.2rem 0 0.7rem;
  color: #344258;
  font-size: 0.78rem;
  font-weight: 650;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.form-grid label,
.designation-row label {
  min-width: 0;
  display: grid;
  gap: 0.35rem;
  color: #65748a;
  font-size: 0.66rem;
  font-weight: 550;
}

.form-grid input:not([type="checkbox"]),
.form-grid select,
.form-grid textarea,
.designation-row input {
  width: 100%;
  min-height: 36px;
  padding: 0.45rem 0.55rem;
  border: 1px solid #e2e8ed;
  border-radius: 7px;
  background: #fff;
  color: #344258;
  font: inherit;
  font-size: 0.7rem;
}

.form-grid textarea {
  resize: vertical;
}

.choice-field {
  min-width: 0;
  margin: 0;
  padding: 0.7rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 0.5rem;
  border: 1px solid #e2e8ed;
  border-radius: 8px;
}

.choice-field legend {
  float: left;
  width: 100%;
  margin: 0 0 0.25rem;
  color: #65748a;
  font-size: 0.68rem;
  font-weight: 600;
}

.choice-field legend span {
  margin-left: 0.3rem;
  color: #9aa4b2;
  font-size: 0.61rem;
  font-weight: 400;
}

.form-grid label.choice-option {
  padding: 0.35rem 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid #edf0f3;
  border-radius: 6px;
  color: #526176;
  font-size: 0.66rem;
  cursor: pointer;
}

.choice-option input {
  accent-color: #397863;
}

.choice-empty {
  margin: 0;
  color: #9aa4b2;
  font-size: 0.66rem;
}

.form-checkbox {
  align-content: center;
  grid-template-columns: auto 1fr;
  align-items: center;
}

.form-checkbox input {
  accent-color: #397863;
}

.repeatable-field {
  min-width: 0;
  display: grid;
  align-content: start;
  gap: 0.45rem;
}

.repeatable-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  color: #65748a;
  font-size: 0.68rem;
  font-weight: 600;
}

.repeatable-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.repeatable-row input {
  width: 100%;
  min-width: 0;
  min-height: 36px;
  padding: 0.45rem 0.55rem;
  border: 1px solid #e2e8ed;
  border-radius: 7px;
  background: #fff;
  color: #344258;
  font: inherit;
  font-size: 0.7rem;
}

.repeatable-row button {
  flex: 0 0 auto;
  border: 0;
  background: transparent;
  font-size: 0.66rem;
  cursor: pointer;
}

.designation-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.designation-row {
  margin-bottom: 0.55rem;
  padding: 0.7rem;
  display: grid;
  grid-template-columns: 1fr 1fr auto auto;
  align-items: end;
  gap: 0.65rem;
  border: 1px solid #edf0f3;
  border-radius: 8px;
}

.designation-row > a {
  padding-bottom: 0.55rem;
  color: #397863;
  font-size: 0.67rem;
  white-space: nowrap;
}

.designation-row > button {
  min-height: 32px;
  border: 0;
  background: transparent;
  font-size: 0.68rem;
  cursor: pointer;
}

.form-actions {
  margin-top: 1.3rem;
  padding-top: 0.9rem;
  justify-content: flex-end;
  border-top: 1px solid #edf0f3;
}

.form-actions button:disabled {
  opacity: 0.65;
  cursor: wait;
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

  .filter-tabs {
    flex-wrap: wrap;
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

  .form-grid,
  .designation-row {
    grid-template-columns: 1fr;
  }

  .designation-row > a {
    padding: 0;
  }

  .detail-profile {
    flex-wrap: wrap;
  }

  .detail-profile .status-pill {
    margin-left: 3.2rem;
  }
}
</style>
