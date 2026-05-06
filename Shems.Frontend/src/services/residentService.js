import api from './api';

const residentService = {
  getDashboard: (id) => api.get(`/resident/${id}/dashboard`),
  updateProfile: (id, data) => api.put(`/resident/${id}/profile`, data),

  getAllResidents: () => api.get('/resident'),
  getSubscriptions: (residentId) => api.get(`/resident/${residentId}/subscriptions`),
  updateSubscriptions: (residentId, data) => api.post(`/resident/${residentId}/subscriptions`, data)
};

export default residentService;