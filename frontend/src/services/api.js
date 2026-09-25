import axios from 'axios';

// Determine base URL dynamically with fallback to production Render API
const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');
  }
  // Check if running on localhost / local IP
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return 'http://localhost:5000';
    }
  }
  // In production deployments (e.g. Vercel), use live Render backend URL
  return 'https://property-rental-marketplace-3eto.onrender.com';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds to gracefully handle Render free tier spin-up / cold starts
});

// Request interceptor to automatically attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry mechanism for Render cold starts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Retry once on network error or timeout (Render cold starts)
    if (config && !config._retry && (!error.response || error.code === 'ECONNABORTED')) {
      config._retry = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return await api(config);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    // If backend returns 401 Unauthorized and user is not on login/register page, clear session
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (!path.includes('/login') && !path.includes('/register')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
