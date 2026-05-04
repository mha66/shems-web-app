import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
// Services
import authService from './services/authService';
// Components
import NavigationBar from './components/NavigationBar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
// Pages
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


  return (
    <div>
      {/* Only show navigation bar if the user is logged in */}
      <NavigationBar setIsAuthenticated={setIsAuthenticated} />

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
            <AdminRoute redirectPath="/devices">
              <CreateDevice />
            </AdminRoute>
          } 
        />
        <Route 
          path="/devices/edit/:id" 
          element={
            <AdminRoute redirectPath="/devices">
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
            <AdminRoute redirectPath="/zones">
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
            <AdminRoute redirectPath="/alerts">
              <CreateAlertProfile />
            </AdminRoute>
          } 
        />
        <Route 
          path="/alerts/edit/:id" 
          element={
            <AdminRoute redirectPath="/alerts">
              <EditAlertProfile />
            </AdminRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;