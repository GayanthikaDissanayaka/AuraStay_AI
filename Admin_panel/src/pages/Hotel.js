// Hotel.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import "./Hotel.css";

const Hotel = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [debug, setDebug] = useState("");

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebug("Fetching hotels from Firebase...");
      
      console.log("Fetching hotels collection...");
      const hotelsCollection = collection(db, "hotels");
      const hotelsSnapshot = await getDocs(hotelsCollection);
      
      console.log("Hotels found:", hotelsSnapshot.size);
      setDebug(`Found ${hotelsSnapshot.size} hotels in database`);
      
      const hotelsList = [];
      hotelsSnapshot.forEach((doc) => {
        hotelsList.push({ id: doc.id, ...doc.data() });
      });

      setHotels(hotelsList);
      setDebug(`Successfully loaded ${hotelsList.length} hotels`);
      
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setError("Failed to load hotels: " + err.message);
      setDebug("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await deleteDoc(doc(db, "hotels", id));
        fetchHotels();
      } catch (err) {
        console.error("Error deleting hotel:", err);
        setError("Failed to delete hotel: " + err.message);
      }
    }
  };

  const handleEditHotel = async () => {
    if (!selectedHotel) return;

    try {
      const hotelRef = doc(db, "hotels", selectedHotel.id);
      await updateDoc(hotelRef, {
        name: selectedHotel.name,
        location: selectedHotel.location,
        description: selectedHotel.description,
        totalRooms: selectedHotel.totalRooms,
        minPrice: selectedHotel.minPrice,
        maxPrice: selectedHotel.maxPrice,
        amenities: selectedHotel.amenities
      });
      setSelectedHotel(null);
      fetchHotels();
    } catch (err) {
      console.error("Error updating hotel:", err);
      setError("Failed to update hotel: " + err.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push("⭐");
    }
    return <span className="stars">{stars.join("")} {rating}</span>;
  };

  if (loading) {
    return (
      <div className="hotel-loading">
        <div className="spinner"></div>
        <p>Loading hotels from database...</p>
        <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>{debug}</p>
      </div>
    );
  }

  return (
    <div className="hotel">
      {/* Debug Panel */}
      <div className="debug-panel">
        <p><strong>Debug:</strong> {debug}</p>
        <button className="refresh-btn" onClick={fetchHotels}>
          🔄 Refresh Data
        </button>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏨</div>
          <div className="stat-info">
            <h3>Total Hotels</h3>
            <p className="stat-number">{hotels.length}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🛏️</div>
          <div className="stat-info">
            <h3>Total Rooms</h3>
            <p className="stat-number">{hotels.reduce((sum, h) => sum + (h.totalRooms || 0), 0)}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>Avg Rating</h3>
            <p className="stat-number">
              {hotels.length > 0 
                ? (hotels.reduce((sum, h) => sum + (h.rating || 0), 0) / hotels.length).toFixed(1)
                : 0}
            </p>
          </div>
        </div>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      {/* Hotels List */}
      <div className="hotels-list">
        <div className="hotel-header">
          <h2>🏨 Hotel Management</h2>
          <p>Manage hotel listings from registered hotels</p>
        </div>
        
        {hotels.length === 0 ? (
          <div className="no-hotels">
            <div className="no-hotels-icon">🏨</div>
            <h3>No Hotels Registered Yet</h3>
            <p>Hotels registered through the registration page will appear here.</p>
            <div className="no-hotels-actions">
              <button className="refresh-btn" onClick={fetchHotels}>
                🔄 Check Again
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="registered-hotels-info">
              <span className="info-badge">✓ Showing {hotels.length} registered hotels</span>
            </div>
            {hotels.map(hotel => (
              <div key={hotel.id} className="hotel-card">
                <div className="hotel-card-header">
                  <div className="hotel-icon">🏨</div>
                  <div className="hotel-basic-info">
                    <h3>{hotel.name || "No Name"}</h3>
                    <div className="hotel-rating">{renderStars(hotel.rating || 4.0)}</div>
                    <p className="hotel-location">📍 {hotel.location || `${hotel.city || "Unknown"}, ${hotel.country || "Unknown"}`}</p>
                  </div>
                </div>
                
                <p className="hotel-description">{hotel.description || "No description provided"}</p>
                
                <div className="hotel-details">
                  <div className="detail-item">
                    <span className="detail-label">Total Rooms:</span>
                    <span className="detail-value">{hotel.totalRooms || 0}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Available:</span>
                    <span className="detail-value available">{hotel.availableRooms || hotel.totalRooms || 0}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Price Range:</span>
                    <span className="detail-value">
                      {formatCurrency(hotel.minPrice || 0)} - {formatCurrency(hotel.maxPrice || 0)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Hotel Type:</span>
                    <span className="detail-value">{hotel.hotelType || "Mid-Range"}</span>
                  </div>
                </div>
                
                <div className="hotel-amenities">
                  {hotel.amenities && hotel.amenities.slice(0, 6).map((amenity, index) => (
                    <span key={index} className="amenity-tag">{amenity}</span>
                  ))}
                  {hotel.amenities && hotel.amenities.length > 6 && (
                    <span className="amenity-tag">+{hotel.amenities.length - 6} more</span>
                  )}
                </div>
                
                <div className="hotel-actions">
                  <button className="edit-btn" onClick={() => setSelectedHotel(hotel)}>✏️ Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteHotel(hotel.id)}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Edit Modal */}
      {selectedHotel && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Hotel</h3>
              <button className="close-modal" onClick={() => setSelectedHotel(null)}>×</button>
            </div>
            <div className="modal-body">
              <input 
                type="text" 
                placeholder="Hotel Name" 
                value={selectedHotel.name || ""} 
                onChange={(e) => setSelectedHotel({...selectedHotel, name: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Location" 
                value={selectedHotel.location || ""} 
                onChange={(e) => setSelectedHotel({...selectedHotel, location: e.target.value})}
              />
              <textarea 
                placeholder="Description" 
                value={selectedHotel.description || ""} 
                onChange={(e) => setSelectedHotel({...selectedHotel, description: e.target.value})}
                rows="3"
              />
              <div className="modal-row">
                <input 
                  type="number" 
                  placeholder="Total Rooms" 
                  value={selectedHotel.totalRooms || ""} 
                  onChange={(e) => setSelectedHotel({...selectedHotel, totalRooms: parseInt(e.target.value)})}
                />
                <input 
                  type="number" 
                  placeholder="Min Price (LKR)" 
                  value={selectedHotel.minPrice || ""} 
                  onChange={(e) => setSelectedHotel({...selectedHotel, minPrice: parseInt(e.target.value)})}
                />
                <input 
                  type="number" 
                  placeholder="Max Price (LKR)" 
                  value={selectedHotel.maxPrice || ""} 
                  onChange={(e) => setSelectedHotel({...selectedHotel, maxPrice: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setSelectedHotel(null)}>Cancel</button>
              <button className="save-btn" onClick={handleEditHotel}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotel;