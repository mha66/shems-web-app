import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Spinner } from 'react-bootstrap';
import deviceService from '../services/deviceService'; // Ensure path is correct!

const QuickActionCenter = ({refreshPage, refreshPageState}) => {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch devices on mount
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setIsLoading(true);
        const response = await deviceService.getAllDevices();
        
        // Assuming your backend returns camelCase (e.g., response.data = [{ id: 1, name: '...', isOn: true }])
        setDevices(response.data);
      } catch (err) {
        console.error("Error fetching devices:", err);
        setError("Failed to load quick actions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, []);

  // 2. Map device names to Bootstrap Icons dynamically
  const getDeviceIcon = (deviceName) => {
    const name = deviceName.toLowerCase();
    if (name.includes('air') || name.includes('ac')) return 'bi-snow';
    if (name.includes('fridge') || name.includes('refrigerator')) return 'bi-cup-straw'; // Or 'bi-door-closed'
    if (name.includes('fan')) return 'bi-fan';
    if (name.includes('tv') || name.includes('television')) return 'bi-tv';
    if (name.includes('light') || name.includes('lamp')) return 'bi-lightbulb';
    if (name.includes('heater')) return 'bi-fire';
    return 'bi-plug'; // Default fallback icon
  };

  // 3. Handle the toggle with Optimistic UI updates
  const handleToggle = async (id) => {
    const targetDevice = devices.find(d => d.id === id);
    if (!targetDevice) return;

    const newStatus = !targetDevice.isOn;

    // Optimistically update UI instantly for a snappy feel
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === id ? { ...device, isOn: newStatus } : device
      )
    );

    try {
      // Build the UpdateDeviceStatusDto payload
      // Note: Because CurrentPowerDraw is required by your DTO, we simulate passing 0W when turning off, 
      // and maintaining its existing draw (or a default) when turning on.
      const payload = {
        isOn: newStatus,
        currentPowerDraw: targetDevice.currentPowerDraw
      };

      await deviceService.updateDeviceStatus(id, payload);
    } catch (err) {
      console.error("Failed to update device status:", err);
      // If the API fails, revert the toggle switch back to its original state
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === id ? { ...device, isOn: !newStatus } : device
        )
      );
    }

    refreshPage(); // Force the parent component to refresh data after toggling a device
  };

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title mb-0 fw-bold">Quick Actions</h5>
          <span className="badge bg-primary rounded-pill text-black">
            {devices.filter(d => d.isOn).length} Active
          </span>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex-grow-1 d-flex justify-content-center align-items-center">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex-grow-1 d-flex justify-content-center align-items-center text-muted">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && devices.length === 0 && (
          <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-muted text-center">
            <i className="bi bi-x-circle fs-3 mb-2 opacity-50"></i>
            <small>No devices found.</small>
          </div>
        )}

        {/* Success State: A 2x2 Grid for the device cards */}
        {!isLoading && !error && devices.length > 0 && (
          <div className="flex-grow-1" style={{ overflowY: 'auto', paddingRight: '4px' }}>
            <Row className="g-3">
              {devices.map((device) => (
                <Col xs={6} key={device.id}>
                  <div 
                    className={`p-3 rounded h-100 d-flex flex-column justify-content-between transition-all ${device.isOn ? 'glass-card-active' : 'glass-card-inactive'}`}
                    style={{ 
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleToggle(device.id)}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <i 
                        className={`bi ${getDeviceIcon(device.name)} fs-4`} 
                        style={{ color: device.isOn ? 'var(--app-primary, #00d2ff)' : 'var(--bs-secondary)' }}
                      ></i>
                      <Form.Check 
                        type="switch"
                        id={`custom-switch-${device.id}`}
                        checked={device.isOn}
                        onChange={() => handleToggle(device.id)}
                        onClick={(e) => e.stopPropagation()} 
                        className="custom-neon-switch"
                        aria-label={`Toggle ${device.name}`}
                      />
                    </div>
                    
                    <div>
                      <div className="fw-bold text-truncate" style={{ fontSize: '0.9rem' }}>
                        {device.name} {/* Pulled from DeviceSummaryDto */}
                      </div>
                      <div className="text-muted small text-truncate">
                        {device.zoneName} {/* Pulled from DeviceSummaryDto */}
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}

      </Card.Body>
    </Card>
  );
};

export default QuickActionCenter;