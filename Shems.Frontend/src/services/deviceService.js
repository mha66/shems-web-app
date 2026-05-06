import api from './api';

const deviceService = {
  getAllDevices: () => api.get('/device'),
  getDeviceById: (id) => api.get(`/device/${id}`),
  createDevice: (data) => api.post('/device', data),
  
  updateDeviceStatus: (id, data) => api.put(`/device/${id}/status`, data),
  deleteDevice: (id) => api.delete(`/device/${id}`),
  assignAlertProfile: (deviceId, alertProfileId) => api.post(`/device/${deviceId}/alerts/${alertProfileId}`)
};

export default deviceService;