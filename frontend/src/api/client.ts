import axios from 'axios';

// Use environment variable VITE_API_BASE_URL if set (for production deployment on Vercel),
// otherwise fall back to relative '/' which uses the local Vite proxy to localhost:8000
export const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || '/',
  timeout: 60000,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred.';
  const detail = err.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((d: any) => d.msg || JSON.stringify(d)).join('; ');
  }
  if (typeof detail === 'object' && detail !== null) {
    return JSON.stringify(detail);
  }
  return err.message || 'An unexpected error occurred.';
}
