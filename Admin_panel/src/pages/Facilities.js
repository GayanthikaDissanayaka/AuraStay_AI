import React, { useState } from 'react';
import { auth } from "../firebase/firebase";
import './Facilities.css';

const Facilities = () => {
  const [facilities] = useState([
    { id: 1, name: 'Swimming Pool', icon: '🏊', status: 'Open', timing: '6 AM - 10 PM', capacity: 50 },
    { id: 2, name: 'Gym', icon: '💪', status: 'Open', timing: '24/7', capacity: 30 },
    { id: 3, name: 'Spa', icon: '💆', status: 'Open', timing: '9 AM - 9 PM', capacity: 20 },
    { id: 4, name: 'Business Center', icon: '💼', status: 'Open', timing: '8 AM - 8 PM', capacity: 15 },
    { id: 5, name: 'Restaurant', icon: '🍽️', status: 'Open', timing: '7 AM - 11 PM', capacity: 100 },
    { id: 6, name: 'Parking', icon: '🅿️', status: 'Open', timing: '24/7', capacity: 200 },
  ]);

  const [bookings, setBookings] = useState([
    { id: 1, facility: 'Swimming Pool', guest: 'John Doe', date: '2024-01-16', time: '2:00 PM' },
    { id: 2, facility: 'Gym', guest: 'Jane Smith', date: '2024-01-16', time: '10:00 AM' },
  ]);

  return (
    <div className="facilities">
      <h2>Hotel Facilities</h2>
      
      <div className="facilities-grid">
        {facilities.map(facility => (
          <div key={facility.id} className="facility-card">
            <div className="facility-icon">{facility.icon}</div>
            <h3>{facility.name}</h3>
            <div className="facility-details">
              <p>⏰ {facility.timing}</p>
              <p>👥 Capacity: {facility.capacity}</p>
              <p className={`facility-status ${facility.status.toLowerCase()}`}>
                {facility.status}
              </p>
            </div>
            <button className="book-btn">Book Now</button>
          </div>
        ))}
      </div>

      <div className="recent-bookings">
        <h3>Recent Facility Bookings</h3>
        <table className="bookings-table-facility">
          <thead>
            <tr>
              <th>Facility</th>
              <th>Guest</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.facility}</td>
                <td>{booking.guest}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Facilities;