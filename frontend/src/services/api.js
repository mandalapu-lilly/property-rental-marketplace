import axios from 'axios';

// Determine base URL dynamically with fallback to production Render API
const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // In production (e.g. Vercel, Netlify, custom domain), use live Render backend
  if (import.meta.env.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost')) {
    return 'https://property-rental-marketplace-3eto.onrender.com';
  }
  return 'http://localhost:5000';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45 seconds to gracefully handle Render free tier spin-up/cold starts
});

// Request interceptor to automatically attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthenticated 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend returns 401 Unauthorized and not on login page, optional cleanup
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        // Can optionally clear local session if token expired
      }
    }
    return Promise.reject(error);
  }
);

export default api;
