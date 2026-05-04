import { Navigate } from 'react-router-dom';

const AdminRoute = ({ redirectPath, children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== 'Admin') {
    return <Navigate to={redirectPath} replace />; 
  }

  return children;
};

export default AdminRoute;