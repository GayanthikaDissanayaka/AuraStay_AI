import React, { useState, useEffect } from 'react';
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where, updateDoc, doc, addDoc, serverTimestamp, orderBy, limit } from "firebase/firestore";
import './Guest.css';

const Guest = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchGuestsData();
  }, []);

  const fetchGuestsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const usersRef = collection(db, "users");
      const usersQuery = query(usersRef, where("role", "==", "guest"));
      const usersSnapshot = await getDocs(usersQuery);
      
      const bookingsRef = collection(db, "bookings");
      const bookingsSnapshot = await getDocs(bookingsRef);
      const bookingsMap = new Map();
      
      bookingsSnapshot.forEach((doc) => {
        const booking = { id: doc.id, ...doc.data() };
        const guestId = booking.guestId || booking.userId;
        if (!bookingsMap.has(guestId)) {
          bookingsMap.set(guestId, []);
        }
        bookingsMap.get(guestId).push(booking);
      });

      const serviceRequestsRef = collection(db, "serviceRequests");
      const serviceSnapshot = await getDocs(serviceRequestsRef);
      const serviceMap = new Map();
      
      serviceSnapshot.forEach((doc) => {
        const request = { id: doc.id, ...doc.data() };
        const guestId = request.guestId;
        if (!serviceMap.has(guestId)) {
          serviceMap.set(guestId, []);
        }
        serviceMap.get(guestId).push(request);
      });

      const guestsList = [];
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        const guestBookings = bookingsMap.get(doc.id) || [];
        const guestServices = serviceMap.get(doc.id) || [];
        
        const activeBooking = guestBookings.find(b => 
          b.status === 'confirmed' || b.status === 'checked_in'
        );
        
        const today = new Date();
        const isActiveToday = activeBooking && activeBooking.checkInDate && activeBooking.checkOutDate &&
          new Date(activeBooking.checkInDate.toDate()) <= today &&
          new Date(activeBooking.checkOutDate.toDate()) >= today;
        
        guestsList.push({
          id: doc.id,
          name: userData.fullName || userData.name || "Guest",
          email: userData.email,
          phone: userData.phone || "N/A",
          room: activeBooking?.roomNumber || "Not Assigned",
          roomId: activeBooking?.roomId,
          checkin: activeBooking?.checkInDate ? new Date(activeBooking.checkInDate.toDate()).toLocaleDateString() : "N/A",
          checkout: activeBooking?.checkOutDate ? new Date(activeBooking.checkOutDate.toDate()).toLocaleDateString() : "N/A",
          preferences: userData.preferences || [],
          loyaltyPoints: userData.loyaltyPoints || 0,
          status: isActiveToday ? "Active" : (activeBooking ? "Upcoming" : "Inactive"),
          bookings: guestBookings,
          serviceRequests: guestServices,
          registeredAt: userData.createdAt,
          totalSpent: guestBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
          avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || userData.name || 'Guest')}&background=667eea&color=fff`
        });
      });

      setGuests(guestsList);
    } catch (err) {
      console.error("Error fetching guests:", err);
      setError("Failed to load guest data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceRequest = async (guest) => {
    try {
      await addDoc(collection(db, "serviceRequests"), {
        guestId: guest.id,
        guestName: guest.name,
        roomNumber: guest.room,
        requestType: "General Service",
        description: `Service requested for ${guest.name}`,
        status: "pending",
        priority: "Medium",
        createdAt: serverTimestamp(),
        requestedBy: "admin"
      });
      alert(`✅ Service request sent for ${guest.name}`);
      fetchGuestsData();
    } catch (err) {
      console.error("Error creating service request:", err);
      alert("Failed to send service request");
    }
  };

  const handleHousekeeping = async (guest) => {
    try {
      await addDoc(collection(db, "serviceRequests"), {
        guestId: guest.id,
        guestName: guest.name,
        roomNumber: guest.room,
        requestType: "Housekeeping",
        description: `Housekeeping requested for room ${guest.room}`,
        status: "pending",
        priority: "High",
        createdAt: serverTimestamp(),
        requestedBy: "admin"
      });
      alert(`✅ Housekeeping requested for ${guest.name}`);
      fetchGuestsData();
    } catch (err) {
      console.error("Error creating housekeeping request:", err);
      alert("Failed to request housekeeping");
    }
  };

  const handleUpdateLoyaltyPoints = async (guest, newPoints) => {
    try {
      const userRef = doc(db, "users", guest.id);
      await updateDoc(userRef, { loyaltyPoints: newPoints });
      alert(`✅ Loyalty points updated for ${guest.name}`);
      fetchGuestsData();
      setShowDetailsModal(false);
    } catch (err) {
      console.error("Error updating loyalty points:", err);
      alert("Failed to update loyalty points");
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Active': return '🟢';
      case 'Upcoming': return '🟡';
      default: return '⚪';
    }
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || guest.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: guests.length,
    active: guests.filter(g => g.status === 'Active').length,
    upcoming: guests.filter(g => g.status === 'Upcoming').length,
    totalRevenue: guests.reduce((sum, g) => sum + g.totalSpent, 0),
    avgLoyalty: guests.length > 0 ? Math.floor(guests.reduce((sum, g) => sum + g.loyaltyPoints, 0) / guests.length) : 0
  };

  if (loading) {
    return (
      <div className="guest-loading">
        <div className="loading-spinner"></div>
        <p>Loading guest data...</p>
      </div>
    );
  }

  return (
    <div className="guest-container">
      {/* Header Section */}
      <div className="guest-header">
        <div className="header-left">
          <h1 className="page-title">
            <span className="title-icon">👥</span>
            Guest Management
          </h1>
          <p className="page-subtitle">Manage and monitor all hotel guests</p>
        </div>
        <button className="refresh-button" onClick={fetchGuestsData}>
          🔄 Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.total}</h3>
            <p className="stat-label">Total Guests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">🟢</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.active}</h3>
            <p className="stat-label">Active Stays</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">🟡</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.upcoming}</h3>
            <p className="stat-label">Upcoming</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">LKR {stats.totalRevenue.toLocaleString()}</h3>
            <p className="stat-label">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, room or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${selectedStatus === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('all')}
          >
            All ({stats.total})
          </button>
          <button 
            className={`filter-tab ${selectedStatus === 'Active' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('Active')}
          >
            🟢 Active ({stats.active})
          </button>
          <button 
            className={`filter-tab ${selectedStatus === 'Upcoming' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('Upcoming')}
          >
            🟡 Upcoming ({stats.upcoming})
          </button>
        </div>
      </div>

      {error && <div className="error-alert">⚠️ {error}</div>}

      {/* Guests Grid */}
      {filteredGuests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No guests found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="guests-grid">
          {filteredGuests.map(guest => (
            <div key={guest.id} className="guest-card">
              <div className="guest-card-header">
                <div className="guest-avatar">
                  <img src={guest.avatar} alt={guest.name} />
                  <span className={`status-indicator ${guest.status.toLowerCase()}`}></span>
                </div>
                <div className="guest-info">
                  <h3 className="guest-name">{guest.name}</h3>
                  <p className="guest-email">{guest.email}</p>
                </div>
                <div className="guest-loyalty">
                  <span className="loyalty-badge">⭐ {guest.loyaltyPoints} pts</span>
                </div>
              </div>

              <div className="guest-card-body">
                <div className="info-row">
                  <span className="info-label">Room:</span>
                  <span className="info-value room-number">{guest.room}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Stay:</span>
                  <span className="info-value">{guest.checkin} → {guest.checkout}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{guest.phone}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span className={`status-badge ${guest.status.toLowerCase()}`}>
                    {getStatusIcon(guest.status)} {guest.status}
                  </span>
                </div>
              </div>

              <div className="guest-card-footer">
                <button 
                  className="action-btn view-btn"
                  onClick={() => {
                    setSelectedGuest(guest);
                    setShowDetailsModal(true);
                  }}
                >
                  👁️ View Details
                </button>
                <button 
                  className="action-btn service-btn"
                  onClick={() => handleServiceRequest(guest)}
                >
                  🛎️ Service
                </button>
                <button 
                  className="action-btn housekeeping-btn"
                  onClick={() => handleHousekeeping(guest)}
                >
                  🧹 Housekeeping
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guest Details Modal */}
      {showDetailsModal && selectedGuest && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <div className="modal-avatar">
                  <img src={selectedGuest.avatar} alt={selectedGuest.name} />
                </div>
                <div>
                  <h2>{selectedGuest.name}</h2>
                  <p>{selectedGuest.email}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>×</button>
            </div>

            <div className="modal-tabs">
              <button className="modal-tab active">Personal Info</button>
              <button className="modal-tab">Bookings</button>
              <button className="modal-tab">Service History</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h4>📋 Personal Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{selectedGuest.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">{selectedGuest.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">{selectedGuest.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Loyalty Points</span>
                    <span className="detail-value loyalty-points">
                      {selectedGuest.loyaltyPoints}
                      <button 
                        className="edit-points"
                        onClick={() => {
                          const newPoints = prompt("Enter new loyalty points:", selectedGuest.loyaltyPoints);
                          if (newPoints && !isNaN(newPoints)) {
                            handleUpdateLoyaltyPoints(selectedGuest, parseInt(newPoints));
                          }
                        }}
                      >
                        ✏️ Edit
                      </button>
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>🏨 Current Stay</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Room Number</span>
                    <span className="detail-value highlight">{selectedGuest.room}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Check-in Date</span>
                    <span className="detail-value">{selectedGuest.checkin}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Check-out Date</span>
                    <span className="detail-value">{selectedGuest.checkout}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total Spent</span>
                    <span className="detail-value">LKR {selectedGuest.totalSpent.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>📅 Booking History</h4>
                {selectedGuest.bookings && selectedGuest.bookings.length > 0 ? (
                  <div className="booking-timeline">
                    {selectedGuest.bookings.map((booking, idx) => (
                      <div key={idx} className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <strong>Room {booking.roomNumber}</strong>
                            <span className={`booking-status ${booking.status}`}>{booking.status}</span>
                          </div>
                          <div className="timeline-details">
                            <span>📅 {booking.checkInDate?.toDate().toLocaleDateString()} → {booking.checkOutDate?.toDate().toLocaleDateString()}</span>
                            <span>💰 LKR {booking.totalAmount?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No booking history available</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="close-modal-btn" onClick={() => setShowDetailsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guest;