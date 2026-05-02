import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import alertProfileService from '../../services/alertProfileService';

const CreateAlertProfile = () => {
  const [alertType, setAlertType] = useState('');
  const [threshold, setThreshold] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Send the payload matching your CreateAlertProfileDto
      await alertProfileService.createAlertProfile({
        alertType: alertType,
        threshold: parseFloat(threshold) // Ensure it is sent as a double/decimal
      });
      
      // Send the admin back to the list
      navigate('/alerts');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || err.response.data.title || 'Failed to create alert profile.');
      } else {
        setError('Failed to create alert profile. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Create Alert Profile</h2>
        <Link to="/alerts">
          <Button variant="outline-secondary">Back to List</Button>
        </Link>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Alert Type</Form.Label>
              <Form.Control 
                type="text" 
                value={alertType} 
                onChange={(e) => setAlertType(e.target.value)} 
                required 
                maxLength="100" // Matches your backend [MaxLength(100)]
                placeholder="e.g., High Power Draw, Offline Status"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Trigger Threshold</Form.Label>
              <Form.Control 
                type="number" 
                step="0.1" // Allows decimals
                value={threshold} 
                onChange={(e) => setThreshold(e.target.value)} 
                required 
                placeholder="Enter a numeric limit..."
              />
              <Form.Text className="text-muted">
                The numeric limit that will trigger this alert (e.g., 1500 for a 1500W limit).
              </Form.Text>
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              Save Alert Profile
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateAlertProfile;