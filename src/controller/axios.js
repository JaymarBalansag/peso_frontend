import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = window.sessionStorage.getItem('peso_admin_token')
    || window.localStorage.getItem('peso_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;