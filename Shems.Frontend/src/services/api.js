import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5133/api',
  withCredentials: true // CRITICAL FOR COOKIES
});

api.interceptors.response.use(
  (response) => {
    // If the request succeeds, just pass it through normally
    return response;
  },
  async (error) => {
    // Grab the original request that just failed
    const originalRequest = error.config;

    // Check if the error is a 401 (Unauthorized) AND refresh hasn't already been attempted for this request
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      
      // Mark this request as "retrying" to prevent infinite loops if the refresh also fails
      originalRequest._retry = true; 

      try {
        // 1. Tell the backend to refresh the tokens.
        // Because of withCredentials, the browser automatically sends the 7-day refresh cookie here
        await api.post('/auth/refresh');
        
        // 2. The backend returns fresh cookies
        // Re-run the original request that failed earlier
        return api(originalRequest);
        
      } catch (refreshError) {
        // 3. If the refresh request ALSO fails (e.g., the 7 days are up, or the user was deleted)
        console.error('Session expired. Please log in again.');
        
        // Clear out the frontend memory
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        
        // Force the browser back to the login page
        // (window.location is used because React Router's useNavigate can't be used outside of a component)
        window.location.href = '/login'; 
        
        return Promise.reject(refreshError);
      }
    }

    // If it's any other error (like a 404 or 500), just pass the error along
    return Promise.reject(error);
  }
);

export default api;