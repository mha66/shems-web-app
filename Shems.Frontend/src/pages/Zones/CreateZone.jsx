import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import zoneService from '../../services/zoneService';

const CreateZone = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Send the payload matching your CreateZoneDto
      await zoneService.createZone({ name: name });
      
      // Send the admin back to the list to see their new zone
      navigate('/zones');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        // Capture backend validation errors (e.g., if the name exceeds 50 chars)
        setError(err.response.data.message || err.response.data.title || 'Failed to create zone.');
      } else {
        setError('Failed to create zone. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Add New Zone</h2>
        <Link to="/zones">
          <Button variant="outline-secondary">Back to List</Button>
        </Link>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Zone Name</Form.Label>
              <Form.Control 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                maxLength="50" // Matches your backend DTO
                placeholder="e.g., Master Bedroom, Kitchen, Garage"
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              Save Zone
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateZone;