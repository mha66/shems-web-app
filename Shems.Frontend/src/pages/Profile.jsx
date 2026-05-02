import { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import residentService from '../services/residentService';

const Profile = () => {
  const [targetMonthlyBudget, setTargetMonthlyBudget] = useState('');
  const [preferredTemperature, setPreferredTemperature] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) {
        setError('User ID not found. Please log out and log in again.');
        setLoading(false);
        return;
      }

      try {
        // Fetch existing preferences to pre-fill the form
        const response = await residentService.getDashboard(userId);
        
        setTargetMonthlyBudget(response.data.targetMonthlyBudget);
        setPreferredTemperature(response.data.preferredTemperature);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setError('Could not load profile details. Make sure the backend is running.');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Double-check validation before sending to backend
    if (targetMonthlyBudget < 10 || targetMonthlyBudget > 1000) {
      setError('Please set a realistic monthly budget between $10 and $1,000.');
      return;
    }
    if (preferredTemperature < 5 || preferredTemperature > 45) {
      setError('Preferred temperature must be between 5°C and 45°C.');
      return;
    }

    try {
      // Send the payload matching your UpdateProfileDto
      await residentService.updateProfile(userId, {
        targetMonthlyBudget: parseFloat(targetMonthlyBudget),
        preferredTemperature: parseFloat(preferredTemperature)
      });
      
      setSuccess('Your preferences have been successfully updated!');
      
      // Optional: Automatically clear the success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || err.response.data.title || 'Failed to update profile.');
      } else {
        setError('Failed to update profile. Please try again.');
      }
    }
  };

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <div className="mb-4">
        <h2>My Settings</h2>
        <p className="text-muted">Adjust your smart home preferences and target budget.</p>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Target Monthly Budget</Form.Label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <Form.Control 
                  type="number" 
                  step="1" // Whole dollars
                  min="10"
                  max="1000"
                  value={targetMonthlyBudget} 
                  onChange={(e) => setTargetMonthlyBudget(e.target.value)} 
                  required 
                />
              </div>
              <Form.Text className="text-muted">
                Set a realistic goal between $10 and $1,000.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Preferred Home Temperature</Form.Label>
              <div className="input-group">
                <Form.Control 
                  type="number" 
                  step="0.5" // Allows for half-degree increments like 22.5
                  min="5"
                  max="45"
                  value={preferredTemperature} 
                  onChange={(e) => setPreferredTemperature(e.target.value)} 
                  required 
                />
                <span className="input-group-text">°C</span>
              </div>
              <Form.Text className="text-muted">
                Set a baseline temperature between 5°C and 45°C.
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Save Preferences
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;