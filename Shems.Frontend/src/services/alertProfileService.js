import api from './api';

const alertProfileService = {
  getAllAlertProfiles: () => api.get('/alert'),
  getAlertProfileById: (id) => api.get(`/alert/${id}`),
  createAlertProfile: (data) => api.post('/alert', data),
  updateAlertProfile: (id, data) => api.put(`/alert/${id}/threshold`, data),
  deleteAlertProfile: (id) => api.delete(`/alert/${id}`)
};

export default alertProfileService;