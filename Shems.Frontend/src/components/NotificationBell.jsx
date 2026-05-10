import { useState, useEffect } from 'react';
import { Dropdown, Badge, Button } from 'react-bootstrap';
import residentService from '../services/residentService';

const NotificationBell = () => {
  const [alerts, setAlerts] = useState([]);
  const userId = localStorage.getItem('userId');

  // Fetch unread alerts
  const fetchAlerts = async () => {
    if (!userId) return;
    try {
      const response = await residentService.getUnreadAlerts(userId);
      setAlerts(response.data);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    }
  };

  // The Polling Engine
  useEffect(() => {
    fetchAlerts(); // Fetch immediately on load
    
    // Set up the interval to poll every 15 seconds (15000 ms)
    const intervalId = setInterval(fetchAlerts, 15000); 

    // Cleanup function: Stops the timer if the user logs out or leaves the page
    return () => clearInterval(intervalId);
  }, [userId]);

  // Handle clicking an alert to mark it as read
  const handleAlertClick = async (alertId) => {
    try {
      await residentService.markAlertAsRead(userId, alertId);
      // Remove the clicked alert from the UI immediately without waiting for the next poll
      setAlerts(prevAlerts => prevAlerts.filter(a => a.id !== alertId));
    } catch (err) {
      console.error("Failed to mark alert as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await residentService.markAllAlertsAsRead(userId);
      setAlerts([]); // Instantly empty the UI array
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  return (
    <Dropdown align="end" className="me-3">
      <Dropdown.Toggle 
        variant="light" 
        id="dropdown-custom-components" 
        className="position-relative border-0 shadow-sm"
        title="Notifications"
        aria-label="Notifications"
      >
        <i className="bi bi-bell-fill fs-5 text-secondary"></i>
        
        {/* Only show the red badge if there are actually alerts */}
        {alerts.length > 0 && (
          <Badge 
            pill 
            className="position-absolute bg-dark-red top-0 start-100 translate-middle"
            style={{ fontSize: '0.65rem' }}
          >
            {alerts.length}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu variant="dark" className="shadow" style={{ minWidth: '300px', maxHeight: '400px', overflowY: 'auto' }}>
        <Dropdown.Header className="d-flex justify-content-between align-items-center fw-bold border-bottom pb-2 mb-2">
          <span>Notifications</span>
          {alerts.length > 0 && (
            <Button variant="link" className="p-0 text-decoration-none small text-primary" style={{ fontSize: '0.8rem' }} onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </Dropdown.Header>
        
        {alerts.length === 0 ? (
          <Dropdown.ItemText className="text-muted text-center py-3">
            No new alerts. You're all caught up!
          </Dropdown.ItemText>
        ) : (
          alerts.map(alert => (
            <Dropdown.Item 
              key={alert.id} 
              onClick={() => handleAlertClick(alert.id)}
              className="border-bottom py-2 text-wrap"
            >
              <div className="d-flex justify-content-between align-items-start">
                <strong className="bright-red small">{alert.deviceName}</strong>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="small mt-1">{alert.message}</div>
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationBell;