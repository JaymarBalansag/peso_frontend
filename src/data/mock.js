export const stats = [
  { label: 'Total Applicants', value: 4820, trend: 8.2, up: true, icon: '🧑‍💼', tone: 'primary' },
  { label: 'New Applications', value: 126, trend: 12.4, up: true, icon: '📥', tone: 'amber' },
  { label: 'For Interview', value: 214, trend: 2.1, up: false, icon: '🗓️', tone: 'violet' },
  { label: 'Placed / Hired', value: 1038, trend: 6.7, up: true, icon: '✅', tone: 'green' }
]

export const pipeline = [
  { name: 'New', value: 126, tone: 'primary' },
  { name: 'Screening', value: 184, tone: 'amber' },
  { name: 'Interview', value: 214, tone: 'violet' },
  { name: 'Referred', value: 97, tone: 'cyan' },
  { name: 'Placed', value: 171, tone: 'green' }
]

const last6 = [
  { month: 'Apr', received: 210, placed: 96 },
  { month: 'May', received: 245, placed: 120 },
  { month: 'Jun', received: 190, placed: 88 },
  { month: 'Jul', received: 268, placed: 140 },
  { month: 'Aug', received: 290, placed: 152 },
  { month: 'Sep', received: 255, placed: 171 }
]
const previous6 = [
  { month: 'Oct', received: 180, placed: 70 },
  { month: 'Nov', received: 200, placed: 85 },
  { month: 'Dec', received: 150, placed: 60 },
  { month: 'Jan', received: 230, placed: 92 },
  { month: 'Feb', received: 215, placed: 101 },
  { month: 'Mar', received: 240, placed: 110 }
]
export const activity = { '6M': last6, '12M': [...previous6, ...last6] }

export const programs = [
  { name: 'Job Referral', value: 640, tone: 'primary' },
  { name: 'SPES', value: 312, tone: 'green' },
  { name: 'Emergency Employment', value: 198, tone: 'amber' },
  { name: 'Job Fair', value: 134, tone: 'violet' }
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
