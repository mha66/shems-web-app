import api from './api';

const residentService = {
  getDashboard: (id) => api.get(`/resident/${id}/dashboard`),
  updateProfile: (id, data) => api.put(`/resident/${id}/profile`, data),

  getAllResidents: () => api.get('/resident'),
  getSubscriptions: (residentId) => api.get(`/resident/${residentId}/subscriptions`),
  updateSubscriptions: (residentId, data) => api.post(`/resident/${residentId}/subscriptions`, data),
  getUnreadAlerts: (residentId) => api.get(`/resident/${residentId}/alerts/unread`),
  markAlertAsRead: (residentId, alertId) => api.put(`/resident/${residentId}/alerts/${alertId}/read`),
  markAllAlertsAsRead: (residentId) => api.put(`/resident/${residentId}/alerts/read-all`)
};

export default residentService;