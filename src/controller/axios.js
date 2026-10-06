import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // Use the environment variable or fallback to localhost
  timeout: 10000, // Set a timeout for requests (in milliseconds)
    headers: {
    'Content-Type': 'application/json',
    },
});

export default api;