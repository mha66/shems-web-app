import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import authService from '../services/authService';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    setError(''); // Clear any previous errors

    try {
      // Send the data to your backend AuthController
      const response = await authService.login({ username: username, password: password });
      
      // If successful, the backend automatically attaches the secure cookie to your browser.
      // Now we just update our React state to unlock the protected routes.
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true'); // Keeps you logged in if you refresh the page
      localStorage.setItem('userRole', response.data.role); // Store the user role for later use (like showing/hiding admin features)
      //console.log('role from login response:', response.data.role); // Debugging line to check the role value
      navigate('/'); // Send the user to the Home/Dashboard
    } catch (err) {
      console.error(err);
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow-sm">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Login</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="Enter username"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Enter password"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Log In
            </Button>
          </Form>

          <div className="text-center">
            <span className="text-muted">Don't have an account? </span>
            <Link to="/register" className="text-decoration-none">Register here</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;