import api from './api';

const residentService = {
  getDashboard: (id) => api.get(`/resident/${id}/dashboard`),
  updateProfile: (id, data) => api.put(`/resident/${id}/profile`, data)
};

export default residentService;