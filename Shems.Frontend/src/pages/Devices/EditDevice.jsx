import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import deviceService from '../../services/deviceService';
import alertProfileService from '../../services/alertProfileService';

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

  const [alertProfiles, setAlertProfiles] = useState([]);
  const [selectedAlertId, setSelectedAlertId] = useState('');
  const [assignMessage, setAssignMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deviceRes = await deviceService.getDeviceById(id);
        
        // Populate the form with the existing data
        setDeviceName(deviceRes.data.name);
        setIsOn(deviceRes.data.isOn);
        setCurrentPowerDraw(deviceRes.data.currentPowerDraw);
        
        const alertsRes = await alertProfileService.getAllAlertProfiles();
        setAlertProfiles(alertsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch device', err);
        setError('Could not load device details. Make sure it exists.');
        setLoading(false);
      }
    };

    fetchData();
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
      await deviceService.updateDeviceStatus(id, {
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

  const handleAssignAlert = async () => {
    if (!selectedAlertId) return;
    
    setAssignMessage({ type: '', text: '' });

    try {
      await deviceService.assignAlertProfile(id, selectedAlertId);
      setAssignMessage({ type: 'success', text: 'Alert profile successfully assigned!' });
      setSelectedAlertId(''); // Reset the dropdown
    } catch (err) {
      console.error(err);
      setAssignMessage({ 
        type: 'danger', 
        text: err.response?.data || 'Failed to assign profile. It might already be linked.' 
      });
    }
  };

  const handleRemoveAlert = async () => {
    if (!selectedAlertId) return;
    
    setAssignMessage({ type: '', text: '' });

    try {
      await deviceService.removeAlertProfile(id, selectedAlertId);
      setAssignMessage({ type: 'success', text: 'Alert profile successfully unassigned!' });
      setSelectedAlertId(''); // Reset the dropdown
    } catch (err) {
      console.error(err);
      setAssignMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || err.response?.data || 'Failed to remove profile. It might not be linked.' 
      });
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
      <Card className="shadow-sm mt-4 border-info">
      <Card.Header className="bg-info text-dark fw-bold">
        Assign Monitoring Rule
      </Card.Header>
      <Card.Body>
        <p className="text-muted small mb-3">
          Select an Alert Profile to monitor this device's power consumption.
        </p>

        {assignMessage.text && (
          <Alert variant={assignMessage.type}>{assignMessage.text}</Alert>
        )}

        <div className="d-flex gap-2">
          <select 
            className="form-select" 
            value={selectedAlertId} 
            onChange={(e) => setSelectedAlertId(e.target.value)}
          >
            <option value="">-- Select an Alert Profile --</option>
            {alertProfiles.map(profile => (
              <option key={profile.id} value={profile.id}>
                {profile.alertType} (Limit: {profile.threshold}W)
              </option>
            ))}
          </select>
          
          <Button 
            variant="primary" 
            onClick={handleAssignAlert}
            disabled={!selectedAlertId} // Disables button if nothing is selected
          >
            Assign
          </Button>

          <Button 
            variant="danger" 
            onClick={handleRemoveAlert}
            disabled={!selectedAlertId} // Disables button if nothing is selected
          >
            Unassign
          </Button>
        </div>
      </Card.Body>
    </Card>
    </Container>
  );
};

export default EditDevice;