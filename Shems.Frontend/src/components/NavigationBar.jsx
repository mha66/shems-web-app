import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import authService from '../services/authService';
import NotificationBell from './NotificationBell';

const NavigationBar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  // Check localStorage for a saved theme, otherwise default to 'dark'
  const [theme, setTheme] = useState(localStorage.getItem('appTheme') || 'dark');

  // Grab the auth state and role to customize what the user sees
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  const handleLogout = async () => {
    // Call backend logout endpoint to clear the cookie
    await authService.logout();
    setIsAuthenticated(false);
    navigate('/login');
  };

  // This hook runs every time the `theme` variable changes
  useEffect(() => {
    // Tell the HTML document which theme to render
    document.documentElement.setAttribute('data-bs-theme', theme);
    // Save it so it survives a page refresh
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // If the user isn't logged in, don't show the navbar at all
  if (!isAuthenticated) return null;

  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-4 shadow-sm">
      <Container>
        {/* Brand Logo / Name */}
        <Navbar.Brand as={Link} to="/" className="fw-bold bright-green">
          <i className="bi bi-lightning-charge-fill me-2"></i> {/* Bootstrap icon */}
          Smart Home Hub
        </Navbar.Brand>
        
        {/* Mobile Toggle Button */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        {/* Navigation Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/devices">Devices</Nav.Link>
            <Nav.Link as={Link} to="/zones">Zones</Nav.Link>
            <Nav.Link as={Link} to="/alerts">Alerts</Nav.Link>
          </Nav>
          
          <Nav className="align-items-center">
            {/* Show an Admin Badge so the user knows their current privileges */}
            {userRole === 'Admin' && (
              <>
                <Badge className="bg-danger body-inverted me-3">Admin Mode</Badge>
                <Nav.Link as={Link} to="/alerts/subscriptions" className="me-3 text-warning">
                  <i className="bi bi-envelope-paper me-1"></i> Subscriptions
                </Nav.Link>
              </>
            )}
            
            <Nav.Link as={Link} to="/profile" className="me-3">
              Edit My Profile
            </Nav.Link>

            {/* The Theme Toggle Button */}
            <Button 
              variant="link" 
              className="text-secondary p-0 me-3 fs-5" 
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <i className="bi bi-moon-fill"></i> : <i className="bi bi-sun-fill text-warning"></i>}
            </Button>

            <NotificationBell />
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;