import api from '@/controller/axios';

export async function getKoreaApplicants() {
  try {
    const response = await api.get('/korea-applicants');
    return response.data;
  } catch (error) {
    console.error('Error fetching Korea applicants:', error);
    throw error;
  }
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
    const response = await api.put(`/korea-applicants/${id}`, applicantData);
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

