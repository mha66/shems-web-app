import api from './api';

const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  
  // A helper function to cleanly handle logging out on the frontend
  logout: () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    return api.post('/auth/logout'); 
  }
};

export default authService;