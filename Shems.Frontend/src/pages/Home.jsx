import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import residentService from '../services/residentService';

import PowerDistributionChart from '../components/PowerDistributionChart';

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
      <div className="welcome-banner p-4 mb-4 rounded shadow-sm">
        <h2 className="mb-1 text-body">
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
      
      {/* Dashboard Widgets Row */}
      <Row className="mt-4">
        
        {/* Left Column: The Donut Chart (takes up 8 of 12 grid spaces) */}
        <Col lg={8} className="mb-4">
          <PowerDistributionChart />
        </Col>

        {/* Right Column: Placeholder for the next widget! (takes up 4 of 12 spaces) */}
        <Col lg={4} className="mb-4">
          <Card className="h-100 border-0 shadow-sm d-flex align-items-center justify-content-center text-muted p-4">
            <p className="mb-0">Quick Actions Coming Soon...</p>
          </Card>
        </Col>

      </Row>
    </Container>
  );
};

export default Home;