import api from '@/controller/axios';

export async function loginAdmin(credentials) {
  const response = await api.post('/login', credentials);
  return response.data.data;
}

export async function logoutAdmin() {
  const response = await api.post('/logout');
  return response.data;
}

export async function getKoreaApplicantOptions() {
  const response = await api.get('/korea-applicant-options');
  return response.data.data;
}

export async function getKoreaApplicants(params = {}) {
  try {
    const response = await api.get('/korea-applicants', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching Korea applicants:', error);
    throw error;
  }
}

export async function getKoreaApplicantReport(period = 'all') {
  const response = await api.get('/korea-applicant-report', { params: { period } });
  return response.data.data;
}

export async function getKoreaApplicantById(id) {
  try {
    const response = await api.get(`/korea-applicants/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Korea applicant with ID ${id}:`, error);
    throw error;
  }
}

export async function createKoreaApplicant(applicantData) {
  try {
    const response = await api.post('/korea-applicants', applicantData);
    return response.data;
  } catch (error) {
    console.error('Error creating Korea applicant:', error);
    throw error;
  }
}

export async function updateKoreaApplicant(id, applicantData) {
  try {
    const response = await api.post(`/korea-applicants/${id}`, applicantData);
    return response.data;
  } catch (error) {
    console.error(`Error updating Korea applicant with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteKoreaApplicant(id) {
  try {
    const response = await api.delete(`/korea-applicants/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting Korea applicant with ID ${id}:`, error);
    throw error;
  }
}
