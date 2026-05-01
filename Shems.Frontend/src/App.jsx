import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import api from './services/api';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import DeviceList from './pages/Devices/DeviceList';
import CreateDevice from './pages/Devices/CreateDevice';
import EditDevice from './pages/Devices/EditDevice';

function App() {
  const navigate = useNavigate();
  // Initialize state based on localStorage so it survives page reloads
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const handleLogout = async () => {
    // Call your backend logout endpoint to clear the cookie
    await api.post('/auth/logout'); 
    
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div>
      {/* Only show navigation if the user is logged in */}
      {isAuthenticated && (
        <nav style={{ padding: '10px', background: '#eee', marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '10px' }}>Dashboard</Link>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      )}

      <Routes>
        {/* Public Route */}
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setIsAuthenticated} />} 
        />

        <Route 
          path="/register" 
          element={<Register setIsAuthenticated={setIsAuthenticated} />} 
        />

        {/* Protected Route Example (Dashboard) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/devices" 
          element={
            <ProtectedRoute>
              <DeviceList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/devices/new" 
          element={
            <AdminRoute>
              <CreateDevice />
            </AdminRoute>
          } 
        />
        <Route 
          path="/devices/edit/:id" 
          element={
            <AdminRoute>
              <EditDevice />
            </AdminRoute>
          } 
        />

        
      </Routes>
    </div>
  );
}

export default App;