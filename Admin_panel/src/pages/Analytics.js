import React, { useState } from 'react';
import { auth } from "../firebase/firebase";
import './Analytics.css';

const Analytics = () => {
  const [period, setPeriod] = useState('month');
  
  const stats = {
    totalRevenue: 156780,
    averageDailyRate: 185.50,
    occupancyRate: 81.7,
    customerSatisfaction: 4.6,
    totalBookings: 845,
    cancellationRate: 8.2,
  };

  const monthlyData = [
    { month: 'Jan', revenue: 42500, occupancy: 75 },
    { month: 'Feb', revenue: 45200, occupancy: 78 },
    { month: 'Mar', revenue: 48900, occupancy: 82 },
    { month: 'Apr', revenue: 51200, occupancy: 84 },
    { month: 'May', revenue: 53500, occupancy: 86 },
    { month: 'Jun', revenue: 55800, occupancy: 85 },
  ];

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <div className="period-selector">
          <button className={period === 'week' ? 'active' : ''} onClick={() => setPeriod('week')}>Week</button>
          <button className={period === 'month' ? 'active' : ''} onClick={() => setPeriod('month')}>Month</button>
          <button className={period === 'year' ? 'active' : ''} onClick={() => setPeriod('year')}>Year</button>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-icon">💰</div>
          <div className="analytics-info">
            <h3>Total Revenue</h3>
            <p className="analytics-value">${stats.totalRevenue.toLocaleString()}</p>
            <p className="analytics-change positive">↑ 12.5% from last {period}</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">📊</div>
          <div className="analytics-info">
            <h3>Occupancy Rate</h3>
            <p className="analytics-value">{stats.occupancyRate}%</p>
            <p className="analytics-change positive">↑ 5.2% from last {period}</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">⭐</div>
          <div className="analytics-info">
            <h3>Customer Satisfaction</h3>
            <p className="analytics-value">{stats.customerSatisfaction}/5</p>
            <p className="analytics-change positive">↑ 0.3 points</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">📅</div>
          <div className="analytics-info">
            <h3>Total Bookings</h3>
            <p className="analytics-value">{stats.totalBookings}</p>
            <p className="analytics-change negative">↓ 2.1% from last {period}</p>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Revenue Trend</h3>
          <div className="bar-chart">
            {monthlyData.map(data => (
              <div key={data.month} className="bar-container">
                <div className="bar-label">{data.month}</div>
                <div className="bar-wrapper">
                  <div 
                    className="bar" 
                    style={{ 
                      height: `${(data.revenue / 60000) * 200}px`,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  ></div>
                </div>
                <div className="bar-value">${(data.revenue/1000).toFixed(0)}k</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Occupancy Rate Trend</h3>
          <div className="line-chart">
            {monthlyData.map(data => (
              <div key={data.month} className="line-point">
                <div className="point-label">{data.month}</div>
                <div className="point-value">{data.occupancy}%</div>
              </div>
            ))}
          </div>
          <div className="trend-line">
            <div className="line"></div>
          </div>
        </div>
      </div>

      <div className="insights-section">
        <h3>Key Insights</h3>
        <ul className="insights-list">
          <li>📈 Weekend occupancy rates are 15% higher than weekdays</li>
          <li>🍽️ Restaurant revenue increased by 22% after new menu launch</li>
          <li>🏊 Pool facility has highest booking rate among all amenities</li>
          <li>⭐ Guest satisfaction highest for room cleanliness (4.8/5)</li>
        </ul>
      </div>
    </div>
  );
};

export default Analytics;