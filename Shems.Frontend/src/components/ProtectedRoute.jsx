import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    // If not logged in, redirect them to the Login page
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the requested page (the 'children')
  return children;
};

export default ProtectedRoute;