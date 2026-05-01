import api from './api';

const zoneService = {
  getAllZones: () => api.get('/zone'),
  // You will add getById, create, update, delete here later!
};

export default zoneService;