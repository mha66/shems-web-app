import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Alert, Spinner } from 'react-bootstrap';
import zoneService from '../../services/zoneService';

const ZoneList = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Grab the user role from local storage to hide admin buttons
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const response = await zoneService.getAllZones();
      setZones(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch zones. Check your backend connection.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this zone? All devices inside it may become unassigned.')) {
      try {
        await zoneService.deleteZone(id);
        fetchZones(); // Refresh the table after deleting
      } catch (err) {
        console.error(err);
        alert('Failed to delete the zone. It might contain active devices.');
      }
    }
  };

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Zone Management</h2>
        
        {/* Only Admins can add new zones */}
        {userRole === 'Admin' && (
          <Link to="/zones/new">
            <Button variant="primary">Add New Zone</Button>
          </Link>
        )}
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Zone Name</th>
            <th>Active Devices</th>
            <th>Total Power Draw</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {zones.length === 0 ? (
            <tr>
              {/* Updated colSpan from 3 to 5 to match the new columns */}
              <td colSpan="5" className="text-center">No zones found.</td>
            </tr>
          ) : (
            zones.map((zone) => (
              <tr key={zone.id}>
                <td>{zone.id}</td>
                <td className="fw-bold">{zone.zoneName}</td>
                
                {/* Added a nice badge to highlight how many devices are active */}
                <td>
                  <span className={`badge ${zone.activeDevicesCount > 0 ? 'bg-info text-dark' : 'bg-secondary'}`}>
                    {zone.activeDevicesCount} Device(s)
                  </span>
                </td>
                
                {/* Added the wattage with a 'W' for context */}
                <td>{zone.totalCurrentWattage} W</td>
                
                <td>
                  {userRole === 'Admin' ? (
                    <>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(zone.id)}>
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

export default ZoneList;