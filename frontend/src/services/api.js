import axios from 'axios';

const API_URL = import.meta.env.MODE === 'production' ? 'https://diempost-back.vercel.app/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
const POKEMON_API_URL = 'https://thangtinshop.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

const pokemonApi = axios.create({
  baseURL: POKEMON_API_URL,
  timeout: 10000,
});

// Submissions API
export const submissionsAPI = {
  create: (data) => api.post('/submissions', data),
  getAll: (limit = 10, page = 1) =>
    api.get('/submissions', { params: { limit, page } }),
  getAdminPosts: (limit = 8) =>
    api.get('/submissions/posts', { params: { limit } }),
};

// Admin API
export const adminAPI = {
  login: (email, password) =>
    api.post('/admin/login', { email, password }),
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

export const pokemonAPI = {
  getWeek: (week) => pokemonApi.get('/pokemon/search', { params: { week } }),
};

export default api;
