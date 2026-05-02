import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import alertProfileService from '../../services/alertProfileService';

const EditAlertProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State to display the read-only alert type
  const [alertType, setAlertType] = useState('');
  
  // State for the editable threshold matching the DTO
  const [threshold, setThreshold] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await alertProfileService.getAlertProfileById(id);
        
        setAlertType(response.data.alertType);
        setThreshold(response.data.threshold);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch alert profile', err);
        setError('Could not load alert profile details. Make sure it exists.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Send only the threshold as required by your UpdateAlertProfileDto
      await alertProfileService.updateAlertProfile(id, {
        threshold: parseFloat(threshold)
      });
      
      navigate('/alerts');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || err.response.data.title || 'Failed to update alert profile.');
      } else {
        setError('Failed to update alert profile. Please try again.');
      }
    }
  };

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Edit Alert Threshold</h2>
        <Link to="/alerts">
          <Button variant="outline-secondary">Back to List</Button>
        </Link>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-muted">Alert Type (Read-Only)</Form.Label>
              <Form.Control 
                type="text" 
                value={alertType} 
                disabled 
                className="bg-light text-muted"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Trigger Threshold</Form.Label>
              <Form.Control 
                type="number" 
                step="0.1" 
                value={threshold} 
                onChange={(e) => setThreshold(e.target.value)} 
                required 
              />
              <Form.Text className="text-muted">
                Update the numeric limit that triggers this alert.
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Update Threshold
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditAlertProfile;