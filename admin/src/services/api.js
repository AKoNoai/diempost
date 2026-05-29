import axios from 'axios';

const API_URL = import.meta.env.MODE === 'production' ? 'https://diempost-back.vercel.app/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add debug logging for requests
api.interceptors.request.use((config) => {
  console.log('📤 API Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    params: config.params
  });
  return config;
}, (error) => Promise.reject(error));

// Add debug logging for responses
api.interceptors.response.use((response) => {
  console.log('📥 API Response:', response.status, response.data);
  return response;
}, (error) => {
  console.log('❌ API Error:', error.response?.status, error.response?.data);
  return Promise.reject(error);
});

export const adminAPI = {
  login: (email, password) => 
    api.post('/admin/login', { email, password }),
  createSubmission: (data) =>
    api.post('/submissions', data),
  getAdminPosts: (limit = 8) =>
    api.get('/submissions/posts', { params: { limit } }),
  getSubmissions: (token, status = '', search = '', limit = 20, page = 1) =>
    api.get('/admin/submissions', {
      params: { status, search, limit, page },
      headers: { Authorization: `Bearer ${token}` }
    }),
  getSubmission: (token, id) =>
    api.get(`/admin/submissions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  updateSubmission: (token, id, data) =>
    api.put(`/admin/submissions/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  deleteSubmission: (token, id) =>
    api.delete(`/admin/submissions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  exportExcel: (token) =>
    api.get('/admin/export/excel', {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    }),
  getStats: (token) =>
    api.get('/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
};

export default api;
