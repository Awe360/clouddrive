import axios from 'axios';

// Get backend API URL from Environment Variables (in development)
// In production, Nginx proxies requests on same host under /api
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically add authorization JWT token to headers
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authorization token expiration (401 error)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized. Clearing credentials.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if user is on dashboard
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
export { baseURL };
