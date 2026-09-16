import axios from 'axios';

// The FastAPI backend runs on 8000
export const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Mock interceptor for auth if needed later
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
