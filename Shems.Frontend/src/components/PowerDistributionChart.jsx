import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import zoneService from '../services/zoneService'; // Make sure this path is correct!

const PowerDistributionChart = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const BRAND_COLORS = [
    'var(--chart-color-1)',
    'var(--chart-color-2)',
    'var(--chart-color-3)',
    'var(--chart-color-4)',
    'var(--chart-color-5)',
    'var(--chart-color-6)',
  ];

  useEffect(() => {
    const fetchZoneData = async () => {
      try {
        setIsLoading(true);
        const response = await zoneService.getAllZones();
        
        // Note: C# DTOs (ZoneName) are usually serialized to camelCase (zoneName) in JSON.
        const activeZones = response.data
          .filter(zone => zone.totalCurrentWattage > 0) // Only map zones actively drawing power
          .map((zone, index) => ({
            name: zone.zoneName,
            value: zone.totalCurrentWattage,
            // Cycle through the brand colors array. If you have 7 zones, it loops back to color 0.
            color: BRAND_COLORS[index % BRAND_COLORS.length] 
          }));

        setChartData(activeZones);
      } catch (err) {
        console.error("Error fetching zone data for chart:", err);
        setError("Failed to load power data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchZoneData();
  }, []);

  // Custom Tooltip to look sleek in dark mode
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="px-3 py-2 rounded shadow" 
          style={{ 
            backgroundColor: 'var(--bs-card-bg)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--bs-body-color)'
          }}
        >
          <strong style={{ color: payload[0].payload.color }}>
            {payload[0].name}
          </strong>
          <div className="mt-1">{payload[0].value} W</div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <h5 className="card-title mb-4 fw-bold">Power Distribution by Zone</h5>
        
        <div style={{ flex: 1, minHeight: '300px' }} className="d-flex align-items-center justify-content-center">
          
          {/* 1. Loading State */}
          {isLoading && <Spinner animation="border" variant="primary" />}

          {/* 2. Error State */}
          {!isLoading && error && (
            <div className="text-muted small">{error}</div>
          )}

          {/* 3. Empty Data State (No devices drawing power) */}
          {!isLoading && !error && chartData.length === 0 && (
            <div className="text-muted small text-center">
              <i className="bi bi-plug fs-3 d-block mb-2 text-secondary"></i>
              No active power draw detected.
            </div>
          )}

          {/* 4. Success State */}
          {!isLoading && !error && chartData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80} 
                  outerRadius={110}
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none" 
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}

        </div>
      </Card.Body>
    </Card>
  );
};

export default PowerDistributionChart;