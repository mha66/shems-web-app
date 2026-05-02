import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import authService from './services/authService';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import DeviceList from './pages/Devices/DeviceList';
import CreateDevice from './pages/Devices/CreateDevice';
import EditDevice from './pages/Devices/EditDevice';
import ZoneList from './pages/Zones/ZoneList';
import CreateZone from './pages/Zones/CreateZone';
import AlertProfileList from './pages/AlertProfiles/AlertProfileList';
import CreateAlertProfile from './pages/AlertProfiles/CreateAlertProfile';
import EditAlertProfile from './pages/AlertProfiles/EditAlertProfile';

function App() {
  const navigate = useNavigate();
  // Initialize state based on localStorage so it survives page reloads
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const handleLogout = async () => {
    // Call your backend logout endpoint to clear the cookie
    await authService.logout();
    
    setIsAuthenticated(false);
    //localStorage.removeItem('isAuthenticated');
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
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setIsAuthenticated} />} 
        />

        <Route 
          path="/register" 
          element={<Register setIsAuthenticated={setIsAuthenticated} />} 
        />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
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

        <Route 
          path="/zones" 
          element={
            <ProtectedRoute>
              <ZoneList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/zones/new" 
          element={
            <AdminRoute>
              <CreateZone />
            </AdminRoute>
          } 
        />

        <Route 
          path="/alerts" 
          element={
            <ProtectedRoute>
              <AlertProfileList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/alerts/new" 
          element={
            <AdminRoute>
              <CreateAlertProfile />
            </AdminRoute>
          } 
        />
        <Route 
          path="/alerts/edit/:id" 
          element={
            <AdminRoute>
              <EditAlertProfile />
            </AdminRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;