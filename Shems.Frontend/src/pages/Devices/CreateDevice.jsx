import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import deviceService from '../../services/deviceService';
import zoneService from '../../services/zoneService'; 

const CreateDevice = () => {
  const [name, setName] = useState('');
  const [zoneId, setZoneId] = useState(''); 
  const [zones, setZones] = useState([]); // To store the list of zones for the dropdown
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch the available zones as soon as the page loads
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await zoneService.getAllZones();
        setZones(response.data);
      } catch (err) {
        console.error('Failed to fetch zones for dropdown', err);
        setError('Could not load zones. Make sure your backend is running.');
      }
    };

    fetchZones();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Extra validation just to be safe before hitting the backend
    if (!zoneId) {
      setError('Please select a Zone.');
      return;
    }

    try {
      // Send the data exactly as the CreateDeviceDto expects
      await deviceService.createDevice({
        name: name,
        zoneId: parseInt(zoneId) // Ensure it is sent as a number, not a string
      });
      
      navigate('/devices');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        // If the backend sends back the validation error (e.g., "Device name cannot exceed 100 characters")
        setError(err.response.data.message || err.response.data.title || 'Failed to create device.');
      } else {
        setError('Failed to create device. Please check your inputs and try again.');
      }
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Add New Device</h2>
        <Link to="/devices">
          <Button variant="outline-secondary">Back to List</Button>
        </Link>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Device Name</Form.Label>
              <Form.Control 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                maxLength="100" // Added to match [MaxLength(100)] data annotation
                placeholder="e.g., Living Room Thermostat"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Assign to Zone</Form.Label>
              <Form.Select 
                value={zoneId} 
                onChange={(e) => setZoneId(e.target.value)} 
                required
              >
                <option value="">Select a zone...</option>
                {/* Dynamically generate options based on backend data */}
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.zoneName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              Save Device
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateDevice;