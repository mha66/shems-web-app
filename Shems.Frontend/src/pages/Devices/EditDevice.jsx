import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import api from '../../services/api';

const EditDevice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for display purposes
  const [deviceName, setDeviceName] = useState('');
  
  // State matching the UpdateDeviceStatusDto
  const [isOn, setIsOn] = useState(false);
  const [currentPowerDraw, setCurrentPowerDraw] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await api.get(`/device/${id}`);
        
        // Populate the form with the existing data
        setDeviceName(response.data.name);
        setIsOn(response.data.isOn);
        setCurrentPowerDraw(response.data.currentPowerDraw);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch device', err);
        setError('Could not load device details. Make sure it exists.');
        setLoading(false);
      }
    };

    fetchDevice();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation to match the [Range(0, 5000)] backend annotation
    if (currentPowerDraw < 0 || currentPowerDraw > 5000) {
      setError('Power draw must be between 0 and 5000 watts.');
      return;
    }

    try {
      // Send the payload matching the UpdateDeviceStatusDto
      await api.put(`/device/${id}/status`, {
        isOn: isOn,
        currentPowerDraw: parseFloat(currentPowerDraw) // Ensure it is sent as a decimal/double
      });
      
      navigate('/devices');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || err.response.data.title || 'Failed to update device status.');
      } else {
        setError('Failed to update device. Please try again.');
      }
    }
  };

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Edit Status: <span className="text-muted">{deviceName}</span></h2>
        <Link to="/devices">
          <Button variant="outline-secondary">Back to List</Button>
        </Link>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Device Power Status</Form.Label>
              <Form.Check 
                type="switch"
                id="power-switch"
                label={isOn ? "Device is currently ON" : "Device is currently OFF"}
                checked={isOn}
                onChange={(e) => setIsOn(e.target.checked)}
                className="fs-5"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Current Power Draw (Watts)</Form.Label>
              <Form.Control 
                type="number" 
                step="0.1" // Allows decimals
                min="0"
                max="5000"
                value={currentPowerDraw} 
                onChange={(e) => setCurrentPowerDraw(e.target.value)} 
                required 
              />
              <Form.Text className="text-muted">
                Must be between 0 and 5000 W.
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Update Status
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditDevice;