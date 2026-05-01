import api from './api';

const deviceService = {
  getAllDevices: () => api.get('/device'),
  getDeviceById: (id) => api.get(`/device/${id}`),
  createDevice: (data) => api.post('/device', data),
  
  // Notice how we abstract the logic so the component doesn't have to worry about parsing IDs
  updateDeviceStatus: (id, data) => api.put(`/device/${id}/status`, data),
  deleteDevice: (id) => api.delete(`/device/${id}`)
};

export default deviceService;