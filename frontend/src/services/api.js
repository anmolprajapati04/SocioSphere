// Service layer handling API communication with backend
// Improves separation between UI and data logic
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  try {
    const raw = window.localStorage.getItem('sociosphere_auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  } catch {
    // ignore
  }
  return config;
});

export default api;

