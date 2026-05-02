import api from './api';

const zoneService = {
  getAllZones: () => api.get('/zone'),
  getZoneById: (id) => api.get(`/zone/${id}`),
  createZone: (data) => api.post('/zone', data),
  deleteZone: (id) => api.delete(`/zone/${id}`)
};

export default zoneService;