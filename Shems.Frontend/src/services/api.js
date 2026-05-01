import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5133/api',
  withCredentials: true // THIS IS CRITICAL FOR COOKIES
});

export default api;