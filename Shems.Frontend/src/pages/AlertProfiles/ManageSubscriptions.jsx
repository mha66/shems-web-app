import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import residentService from '../../services/residentService';
import alertProfileService from '../../services/alertProfileService';

const ManageSubscriptions = () => {
  const [residents, setResidents] = useState([]);
  const [alertProfiles, setAlertProfiles] = useState([]);
  
  const [selectedResidentId, setSelectedResidentId] = useState('');
  const [subscribedIds, setSubscribedIds] = useState([]); // Array of checked profile IDs

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Initial Load: Fetch Users and Alert Profiles
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [resUsers, resProfiles] = await Promise.all([
          residentService.getAllResidents(),
          alertProfileService.getAllAlertProfiles()
        ]);
        setResidents(resUsers.data);
        setAlertProfiles(resProfiles.data);
      } catch (err) {
        setMessage({ type: 'danger', text: 'Failed to load system data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // 2. Fetch user's current subscriptions whenever the dropdown changes
  useEffect(() => {
    if (!selectedResidentId) {
      setSubscribedIds([]);
      return;
    }

    const fetchUserSubscriptions = async () => {
      try {
        const response = await residentService.getSubscriptions(selectedResidentId);
        setSubscribedIds(response.data); // e.g., [1, 3]
        setMessage({ type: '', text: '' });
      } catch (err) {
        setMessage({ type: 'danger', text: 'Failed to load user subscriptions.' });
      }
    };

    fetchUserSubscriptions();
  }, [selectedResidentId]);

  // 3. Handle checking/unchecking boxes
  const handleCheckboxChange = (profileId) => {
    setSubscribedIds(prevIds => {
      if (prevIds.includes(profileId)) {
        // If it's already checked, remove it
        return prevIds.filter(id => id !== profileId);
      } else {
        // If it's unchecked, add it
        return [...prevIds, profileId];
      }
    });
  };

  // 4. Save to Database
  const handleSave = async () => {
    try {
      await residentService.updateSubscriptions(selectedResidentId, {
        alertProfileIds: subscribedIds
      });
      setMessage({ type: 'success', text: 'Subscriptions successfully saved!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to save subscriptions.' });
    }
  };

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;

  return (
    <Container className="mt-4" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4">Manage Alert Subscriptions</h2>
      
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label className="fw-bold">Select Resident</Form.Label>
            <Form.Select 
              value={selectedResidentId} 
              onChange={(e) => setSelectedResidentId(e.target.value)}
            >
              <option value="">-- Choose a User --</option>
              {residents.map(r => (
                <option key={r.id} value={r.id}>
                  {r.userName} ({r.email})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Only show the checkboxes if a user is actually selected */}
      {selectedResidentId && (
        <Card className="shadow-sm border-primary">
          <Card.Header className="bg-primary text-black fw-bold">
            Assigned Alert Rules
          </Card.Header>
          <Card.Body>
            <p className="text-muted small mb-3">
              Check the boxes for the alerts this user should receive.
            </p>

            <Form>
              {alertProfiles.map(profile => (
                <div key={profile.id} className="mb-2 p-2 border rounded">
                  <Form.Check 
                    type="switch"
                    id={`profile-${profile.id}`}
                    label={<strong>{profile.alertType}</strong>}
                    checked={subscribedIds.includes(profile.id)}
                    onChange={() => handleCheckboxChange(profile.id)}
                  />
                  <div className="text-muted small ms-5">
                    Threshold: {profile.threshold}W
                  </div>
                </div>
              ))}
            </Form>

            <Button variant="success" className="w-100 mt-4" onClick={handleSave}>
              Save Subscriptions
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ManageSubscriptions;