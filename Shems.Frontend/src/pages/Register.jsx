import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import api from '../services/api';

const Register = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Send registration data to backend
      await api.post('/auth/register', { 
        username: username, 
        firstName: firstName,
        lastName: lastName,
        email: email, 
        password: password
      });
     
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
        
    } catch (err) {
      console.error(err);
      // Check if the backend sent a specific error message (like "Username already taken")
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Registration failed. Please try again.');
      } else {
        setError('A network error occurred. Is your backend running?');
      }
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow-sm">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Register</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="Choose a username"
              />

            </Form.Group>
              <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control 
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Enter your first name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control 
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Enter your last name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="Enter your email"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Create a password"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Create Account
            </Button>
          </Form>

          <div className="text-center">
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" className="text-decoration-none">Log in here</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;