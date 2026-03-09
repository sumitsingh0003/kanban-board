// services/userApi.js
import API from './api';

export const getCurrentUser = () => API.get('/users/me');
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);