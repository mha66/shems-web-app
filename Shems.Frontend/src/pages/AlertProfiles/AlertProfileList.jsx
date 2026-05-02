import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import alertProfileService from '../../services/alertProfileService';

const AlertProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await alertProfileService.getAllAlertProfiles();
      setProfiles(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch alert profiles. Check your backend connection.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this alert profile?')) {
      try {
        await alertProfileService.deleteAlertProfile(id);
        fetchProfiles(); 
      } catch (err) {
        console.error(err);
        alert('Failed to delete the alert profile.');
      }
    }
  };

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Alert Profiles Management</h2>
        
        {userRole === 'Admin' && (
          <Link to="/alerts/new">
            <Button variant="primary">Create Alert Profile</Button>
          </Link>
        )}
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Alert Type</th>
            <th>Threshold Limit</th>
            <th>Monitored Devices</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No alert profiles configured.</td>
            </tr>
          ) : (
             profiles.map((profile) => (
              <tr key={profile.id}>
                <td>{profile.id}</td>
                
                {/* e.g., "High Power Draw" or "Temperature Spike" */}
                <td className="fw-bold">{profile.alertType}</td>
                
                {/* Formats the threshold in red text to signify a limit */}
                <td className="text-danger fw-bold">{profile.threshold}</td>
                
                <td>
                  <div className="mb-1">
                    <span className="text-muted small">
                      {profile.monitoredDeviceCount} device(s) assigned:
                    </span>
                  </div>
                  {/* Maps the list of strings into clean UI badges */}
                  <div>
                    {profile.monitoredDevices && profile.monitoredDevices.length > 0 ? (
                      profile.monitoredDevices.map((deviceName, index) => (
                        <Badge bg="secondary" className="me-1 mb-1" key={index}>
                          {deviceName}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted fst-italic">None</span>
                    )}
                  </div>
                </td>
                
                <td>
                  {userRole === 'Admin' ? (
                    <>
                      <Link to={`/alerts/edit/${profile.id}`}>
                        <Button variant="outline-warning" size="sm" className="me-2">Edit</Button>
                      </Link>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(profile.id)}>
                        Delete
                      </Button>
                    </>
                  ) : (
                    <span className="text-muted">View Only</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default AlertProfileList;