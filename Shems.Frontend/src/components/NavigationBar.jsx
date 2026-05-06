import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import authService from '../services/authService';

const NavigationBar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  
  // Grab the auth state and role to customize what the user sees
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

   const handleLogout = async () => {
    // Call backend logout endpoint to clear the cookie
    await authService.logout();
    setIsAuthenticated(false);
    navigate('/login');
  };

  // If the user isn't logged in, don't show the navbar at all
  if (!isAuthenticated) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
      <Container>
        {/* Brand Logo / Name */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-success">
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
                <Badge bg="danger" className="me-3">Admin Mode</Badge>
                <Nav.Link as={Link} to="/alerts/subscriptions" className="me-3 text-warning">
                  <i className="bi bi-envelope-paper me-1"></i> Subscriptions
                </Nav.Link>
              </>
            )}
            
            <Nav.Link as={Link} to="/profile" className="me-3">
              Edit My Profile
            </Nav.Link>
            
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;