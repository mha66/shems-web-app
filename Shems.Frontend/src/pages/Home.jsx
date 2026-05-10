import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import residentService from '../services/residentService';

const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
     try {
        // Grab the ID from memory
        const userId = localStorage.getItem('userId');
        
        // Safety check: If for some reason the ID is missing, don't make a broken API call
        if (!userId) {
          setError('User ID not found. Please log out and log back in.');
          setLoading(false);
          return;
        }

        // Pass the ID to the service
        const response = await residentService.getDashboard(userId);
        
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard', err);
        setError('Could not load your dashboard. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
  if (!dashboardData) return null;

  return (
    <Container className="mt-4">
      {/* Welcome Banner */}
      <div 
        className="p-4 mb-4 rounded shadow-sm" 
        style={{ 
          backgroundColor: 'rgba(0, 210, 255, 0.05)', // A very faint tint of your neon blue
          borderLeft: '5px solid #00d2ff' // Thick neon accent line
        }}
      >
        <h2 className="mb-1 text-white">
          Welcome back, <span className="text-primary fw-bold">{dashboardData.firstName}</span>!
        </h2>
        <p className="mb-0 text-muted">Here is the current status of your smart home.</p>
      </div>

      {/* Dashboard Statistics Grid */}
      <Row className="g-4">
        
        {/* Power Draw Card */}
        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center">
              <h6 className="text-muted text-uppercase mb-3">Current Power Draw</h6>
              <h2 className="display-5 text-warning mb-0">
                {dashboardData.currentHomePowerDraw} <span className="fs-4 text-muted">W</span>
              </h2>
            </Card.Body>
          </Card>
        </Col>

        {/* Active Devices Card */}
        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center">
              <h6 className="text-muted text-uppercase mb-3">Active Devices</h6>
              <h2 className="display-5 text-info mb-0">
                {dashboardData.activeDevicesCount}
              </h2>
            </Card.Body>
          </Card>
        </Col>

        {/* Target Budget Card */}
        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center">
              <h6 className="text-muted text-uppercase mb-3">Monthly Budget</h6>
              <h2 className="display-5 bright-green mb-0">
                <span className="fs-4 text-muted">$</span>{dashboardData.targetMonthlyBudget}
              </h2>
            </Card.Body>
          </Card>
        </Col>

        {/* Preferred Temp Card */}
        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center">
              <h6 className="text-muted text-uppercase mb-3">Preferred Temp</h6>
              <h2 className="display-5 text-danger mb-0">
                {dashboardData.preferredTemperature}°
              </h2>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Container>
  );
};

export default Home;