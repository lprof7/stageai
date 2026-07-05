import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 15000,
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      if (token) {
        const role = localStorage.getItem('role');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        if (role === 'admin') {
          window.location.href = '/auth/student/login';
        } else if (role === 'company') {
          window.location.href = '/auth/company/login';
        } else {
          window.location.href = '/auth/student/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;
