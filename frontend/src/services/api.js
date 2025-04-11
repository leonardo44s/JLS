// src/services/api.js
import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: (credentials) => api.post('/auth/signin', credentials),
  register: (userData) => api.post('/auth/signup', userData),
  getCurrentUser: () => api.get('/auth/me')
};

// Servicios de zonas
export const zonasService = {
  getAll: () => api.get('/zonas'),
  getById: (id) => api.get(`/zonas/${id}`),
  create: (data) => api.post('/zonas', data),
  update: (id, data) => api.put(`/zonas/${id}`, data),
  delete: (id) => api.delete(`/zonas/${id}`)
};

// Servicios de equipos
export const equiposService = {
  getAll: () => api.get('/equipos'),
  getById: (id) => api.get(`/equipos/${id}`),
  create: (data) => api.post('/equipos', data),
  update: (id, data) => api.put(`/equipos/${id}`, data),
  delete: (id) => api.delete(`/equipos/${id}`)
};

// Servicios de reservas
export const reservasService = {
  getAll: () => api.get('/reservas'),
  getById: (id) => api.get(`/reservas/${id}`),
  create: (data) => api.post('/reservas', data),
  update: (id, data) => api.put(`/reservas/${id}`, data),
  delete: (id) => api.delete(`/reservas/${id}`)
};

export default api;
