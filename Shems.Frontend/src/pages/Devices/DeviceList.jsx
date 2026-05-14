import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Alert, Spinner } from 'react-bootstrap';
import deviceService from '../../services/deviceService';

const DeviceList = () => {
  const userRole = localStorage.getItem('userRole');
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect runs this code automatically as soon as the page loads
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await deviceService.getAllDevices();
      setDevices(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch devices. Check your backend connection.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        await deviceService.deleteDevice(id);
        // Refresh the list after deleting
        fetchDevices(); 
      } catch (err) {
        console.error(err);
        alert('Failed to delete the device.');
      }
    }
  };

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Device Management</h2>
        {userRole === 'Admin' && (
          <Link to="/devices/new">
            <Button variant="primary">Add New Device</Button>
          </Link>
        )}
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Device Name</th>
            <th>Zone</th>
            <th>Status</th>
            <th>Power Draw</th>
            <th>Alerts</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No devices found.</td>
            </tr>
          ) : (
            devices.map((device) => (
              <tr key={device.id}>
                <td>{device.id}</td>
                <td className="fw-bold">{device.name}</td>
                
                {/* Fallback to 'Unassigned' if the device doesn't have a zone yet */}
                <td>{device.zoneName ? device.zoneName : <span className="text-muted">Unassigned</span>}</td>
                
                <td>
                  <span className={`badge ${device.isOn ? 'bg-success' : 'bg-secondary'}`}>
                    {device.isOn ? 'On' : 'Off'}
                  </span>
                </td>
                
                <td>{device.currentPowerDraw} W</td>
                
                {/* Shows a red badge if there are alerts, or 'None' if empty */}
                <td>
                  {device.activeAlerts && device.activeAlerts.length > 0 ? (
                    <span className="badge bg-danger body-inverted">
                      {device.activeAlerts.length} Alert(s)
                    </span>
                  ) : (
                    <span className="text-muted">None</span>
                  )}
                </td>

                <td>
                  {userRole === 'Admin' ? (
                    <>
                      <Link to={`/devices/edit/${device.id}`}>
                        <Button variant="outline-warning" size="sm" className="me-2">Edit</Button>
                      </Link>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(device.id)}>
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

export default DeviceList;