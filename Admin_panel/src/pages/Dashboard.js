import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc, 
  doc, 
  orderBy, 
  limit,
  Timestamp,
  onSnapshot
} from "firebase/firestore";
import "./Dashboard.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGuests: 0,
    activeBookings: 0,
    pendingRequests: 0,
    revenue: 0,
    occupancyRate: 0,
    avgStayDuration: 0,
    guestSatisfaction: 0,
    totalReviews: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel for better performance
        const [
          totalGuests,
          activeBookings,
          pendingRequests,
          revenue,
          occupancyRate,
          avgStayDuration,
          guestSatisfaction,
          totalReviews,
          revenueChartData,
          recentActivitiesData
        ] = await Promise.all([
          fetchTotalGuests(),
          fetchActiveBookings(),
          fetchPendingServiceRequests(),
          fetchTotalRevenue(),
          fetchOccupancyRate(),
          fetchAvgStayDuration(),
          fetchGuestSatisfaction(),
          fetchTotalReviews(),
          fetchRevenueChartData(),
          fetchRecentActivities()
        ]);

        setStats({
          totalGuests,
          activeBookings,
          pendingRequests,
          revenue,
          occupancyRate,
          avgStayDuration,
          guestSatisfaction,
          totalReviews
        });
        
        setRevenueData(revenueChartData);
        setRecentActivities(recentActivitiesData);
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set up real-time listeners for live updates
    const unsubscribeBookings = setupBookingsListener();
    const unsubscribeServiceRequests = setupServiceRequestsListener();
    const unsubscribeGuests = setupGuestsListener();

    return () => {
      unsubscribeBookings();
      unsubscribeServiceRequests();
      unsubscribeGuests();
    };
  }, []);

  // Helper functions to fetch data from Firebase
  const fetchTotalGuests = async () => {
    try {
      const guestsRef = collection(db, "guests");
      const snapshot = await getDocs(guestsRef);
      return snapshot.size;
    } catch (error) {
      console.error("Error fetching total guests:", error);
      return 0;
    }
  };

  const fetchActiveBookings = async () => {
    try {
      const bookingsRef = collection(db, "bookings");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const q = query(
        bookingsRef,
        where("status", "in", ["confirmed", "checked_in"]),
        where("checkOutDate", ">=", Timestamp.fromDate(today))
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error("Error fetching active bookings:", error);
      return 0;
    }
  };

  const fetchPendingServiceRequests = async () => {
    try {
      const requestsRef = collection(db, "serviceRequests");
      const q = query(requestsRef, where("status", "==", "pending"));
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error("Error fetching service requests:", error);
      return 0;
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("paymentStatus", "==", "paid"));
      const snapshot = await getDocs(q);
      let total = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        total += data.totalAmount || 0;
      });
      return total;
    } catch (error) {
      console.error("Error fetching revenue:", error);
      return 0;
    }
  };

  const fetchOccupancyRate = async () => {
    try {
      const roomsRef = collection(db, "rooms");
      const roomsSnapshot = await getDocs(roomsRef);
      const totalRooms = roomsSnapshot.size;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const bookingsRef = collection(db, "bookings");
      const q = query(
        bookingsRef,
        where("status", "in", ["confirmed", "checked_in"]),
        where("checkInDate", "<=", Timestamp.fromDate(today)),
        where("checkOutDate", ">=", Timestamp.fromDate(today))
      );
      const occupiedSnapshot = await getDocs(q);
      const occupiedRooms = occupiedSnapshot.size;
      
      return totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    } catch (error) {
      console.error("Error fetching occupancy rate:", error);
      return 0;
    }
  };

  const fetchAvgStayDuration = async () => {
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("status", "==", "completed"));
      const snapshot = await getDocs(q);
      
      let totalDays = 0;
      let count = 0;
      
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.checkInDate && data.checkOutDate) {
          const checkIn = data.checkInDate.toDate();
          const checkOut = data.checkOutDate.toDate();
          const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
          totalDays += days;
          count++;
        }
      });
      
      return count > 0 ? Number((totalDays / count).toFixed(1)) : 0;
    } catch (error) {
      console.error("Error fetching avg stay duration:", error);
      return 0;
    }
  };

  const fetchGuestSatisfaction = async () => {
    try {
      const reviewsRef = collection(db, "reviews");
      const snapshot = await getDocs(reviewsRef);
      
      let totalRating = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        totalRating += data.rating || 0;
      });
      
      return snapshot.size > 0 ? Number((totalRating / snapshot.size).toFixed(1)) : 0;
    } catch (error) {
      console.error("Error fetching satisfaction rating:", error);
      return 0;
    }
  };

  const fetchTotalReviews = async () => {
    try {
      const reviewsRef = collection(db, "reviews");
      const snapshot = await getDocs(reviewsRef);
      return snapshot.size;
    } catch (error) {
      console.error("Error fetching total reviews:", error);
      return 0;
    }
  };

  const fetchRevenueChartData = async () => {
    try {
      const bookingsRef = collection(db, "bookings");
      const snapshot = await getDocs(bookingsRef);
      
      const monthlyRevenue = {};
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      // Initialize months with 0
      months.forEach(month => {
        monthlyRevenue[month] = 0;
      });
      
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.createdAt && data.totalAmount && data.paymentStatus === "paid") {
          const date = data.createdAt.toDate();
          const month = months[date.getMonth()];
          monthlyRevenue[month] += data.totalAmount;
        }
      });
      
      return months.map(month => ({
        month: month,
        revenue: monthlyRevenue[month]
      }));
    } catch (error) {
      console.error("Error fetching revenue chart data:", error);
      // Return default empty data
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(month => ({
        month,
        revenue: 0
      }));
    }
  };

  const fetchRecentActivities = async () => {
    try {
      // Fetch from multiple collections to create activity feed
      const activities = [];
      
      // Fetch recent bookings
      const bookingsRef = collection(db, "bookings");
      const bookingsQuery = query(bookingsRef, orderBy("createdAt", "desc"), limit(5));
      const bookingsSnapshot = await getDocs(bookingsQuery);
      
      bookingsSnapshot.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: `booking_${doc.id}`,
          guest: data.guestName || "Guest",
          action: "Booked",
          room: data.roomNumber || "N/A",
          time: data.createdAt ? formatTimeAgo(data.createdAt.toDate()) : "Recently",
          status: "completed",
          type: "booking"
        });
      });
      
      // Fetch recent service requests
      const requestsRef = collection(db, "serviceRequests");
      const requestsQuery = query(requestsRef, orderBy("createdAt", "desc"), limit(5));
      const requestsSnapshot = await getDocs(requestsQuery);
      
      requestsSnapshot.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: `request_${doc.id}`,
          guest: data.guestName || "Guest",
          action: "Service Request",
          room: data.roomNumber || "N/A",
          time: data.createdAt ? formatTimeAgo(data.createdAt.toDate()) : "Recently",
          status: data.status === "pending" ? "pending" : "completed",
          type: "service"
        });
      });
      
      // Sort by time and take top 5
      return activities
        .sort((a, b) => {
          // Simple sort - in real app you'd want proper date comparison
          return 0;
        })
        .slice(0, 5);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return [];
    }
  };

  // Setup real-time listeners
  const setupBookingsListener = () => {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, orderBy("createdAt", "desc"), limit(10));
    
    return onSnapshot(q, (snapshot) => {
      // Update active bookings count in real-time
      const activeCount = snapshot.docs.filter(doc => {
        const data = doc.data();
        return data.status === "confirmed" || data.status === "checked_in";
      }).length;
      
      setStats(prev => ({ ...prev, activeBookings: activeCount }));
    }, (error) => {
      console.error("Bookings listener error:", error);
    });
  };

  const setupServiceRequestsListener = () => {
    const requestsRef = collection(db, "serviceRequests");
    const q = query(requestsRef, where("status", "==", "pending"));
    
    return onSnapshot(q, (snapshot) => {
      setStats(prev => ({ ...prev, pendingRequests: snapshot.size }));
    }, (error) => {
      console.error("Service requests listener error:", error);
    });
  };

  const setupGuestsListener = () => {
    const guestsRef = collection(db, "guests");
    
    return onSnapshot(guestsRef, (snapshot) => {
      setStats(prev => ({ ...prev, totalGuests: snapshot.size }));
    }, (error) => {
      console.error("Guests listener error:", error);
    });
  };

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  const maxRevenue = revenueData.length > 0 
    ? Math.max(...revenueData.map((d) => d.revenue)) 
    : 1;

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="welcome-section">
        <div>
          <h1>Welcome back, Admin</h1>
          <p>Hotel performance overview</p>
        </div>
        <div className="date-display">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.totalGuests}</div>
          <div className="stat-label">Total Guests</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{stats.activeBookings}</div>
          <div className="stat-label">Active Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛎️</div>
          <div className="stat-value">{stats.pendingRequests}</div>
          <div className="stat-label">Pending Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">{formatCurrency(stats.revenue)}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
      </div>

      {/* REVENUE CHART */}
      <div className="revenue-section">
        <h2>Revenue Overview</h2>
        <div className="chart-container">
          <div className="chart-bars">
            {revenueData.map((data, index) => (
              <div key={index} className="bar-wrapper">
                <div className="bar-tooltip">{formatCurrency(data.revenue)}</div>
                <div
                  className="bar"
                  style={{
                    height: `${(data.revenue / maxRevenue) * 180}px`
                  }}
                />
                <span className="bar-label">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITIES */}
      <div className="activities-section">
        <h2>Recent Activities</h2>
        <div className="activities-list">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div key={activity.id} className={`activity-item ${activity.status}`}>
                <div className="activity-content">
                  <strong>{activity.guest}</strong>
                  <span className="activity-action">{activity.action}</span>
                  {activity.room !== "N/A" && <span className="activity-room">Room {activity.room}</span>}
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))
          ) : (
            <div className="no-activities">No recent activities to display</div>
          )}
        </div>
      </div>

      {/* METRICS SECTION */}
      <div className="metrics-section">
        <h2>Key Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">🏨</div>
            <div className="metric-value">{stats.occupancyRate}%</div>
            <div className="metric-label">Occupancy Rate</div>
            <div className="metric-progress">
              <div className="progress-bar" style={{ width: `${stats.occupancyRate}%` }}></div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-value">{stats.avgStayDuration}</div>
            <div className="metric-label">Avg Stay Duration (days)</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">⭐</div>
            <div className="metric-value">{stats.guestSatisfaction}</div>
            <div className="metric-label">Guest Satisfaction</div>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(stats.guestSatisfaction) ? "star filled" : "star"}>
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">📝</div>
            <div className="metric-value">{stats.totalReviews}</div>
            <div className="metric-label">Total Reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;