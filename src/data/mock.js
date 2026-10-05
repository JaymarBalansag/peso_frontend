export const stats = [
  { label: 'Total Applicants', value: 0, trend: 8.2, up: true, icon: '💼', tone: 'primary' },
  { label: 'Lacking of Requirements', value: 0, trend: 2.1, up: false, icon: '🗓️', tone: 'violet' },
  { label: 'Referred', value: 0, trend: 12.4, up: true, icon: '📥', tone: 'amber' },
  { label: 'Placed / Hired', value: 0, trend: 6.7, up: true, icon: '✅', tone: 'green' }
]

export const applicants = [
  { id: 'APL-2026-0412', name: 'Juan Dela Cruz', program: 'Job Referral', barangay: 'Brgy. San Roque', date: 'Oct 1', status: 'New' },
  { id: 'APL-2026-0411', name: 'Ana Santos', program: 'SPES', barangay: 'Brgy. Poblacion', date: 'Oct 1', status: 'Screening' },
  { id: 'APL-2026-0410', name: 'Pedro Ramos', program: 'Job Referral', barangay: 'Brgy. Bagong Silang', date: 'Sep 30', status: 'Interview' },
  { id: 'APL-2026-0409', name: 'Liza Mercado', program: 'Emergency Employment', barangay: 'Brgy. San Isidro', date: 'Sep 30', status: 'New' },
  { id: 'APL-2026-0408', name: 'Carlo Bautista', program: 'Job Fair', barangay: 'Brgy. Poblacion', date: 'Sep 29', status: 'Placed' },
  { id: 'APL-2026-0407', name: 'Rosa Villanueva', program: 'SPES', barangay: 'Brgy. Mabini', date: 'Sep 29', status: 'Rejected' }
]

export const quickActions = [
  { icon: '➕', label: 'Add Applicant' },
  { icon: '🗓️', label: 'Schedule Interview' },
  { icon: '📝', label: 'Post Vacancy' },
  { icon: '🖨️', label: 'Print Report' }
]

export const interviews = [
  { applicant: 'Juan Dela Cruz', detail: 'Job Referral · Sampaguita Mart', when: 'Oct 5, 9:00 AM', tone: 'primary' },
  { applicant: 'Pedro Ramos', detail: 'Job Referral · Metro Builders', when: 'Oct 5, 1:30 PM', tone: 'violet' },
  { applicant: 'Ana Santos', detail: 'SPES · Municipal Hall', when: 'Oct 6, 10:00 AM', tone: 'green' }
]
