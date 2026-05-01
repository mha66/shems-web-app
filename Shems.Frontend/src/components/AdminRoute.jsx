import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== 'Admin') {
    // If they are logged in but NOT an admin, kick them back to the list page
    return <Navigate to="/devices" replace />; 
  }

  return children;
};

export default AdminRoute;