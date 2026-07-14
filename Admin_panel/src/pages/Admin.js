// Admin.jsx - Complete Hotel Admin Panel with Working Logout
import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import "./Admin.css";

// Sample hotel images for the dashboard
const hotelImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop",
    title: "Luxury Presidential Suite",
    description: "Ocean view with private balcony"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop",
    title: "Infinity Pool",
    description: "Heated pool with swim-up bar"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=500&fit=crop",
    title: "Fine Dining Restaurant",
    description: "Michelin star chef experience"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=500&fit=crop",
    title: "Wellness Spa",
    description: "Traditional Ayurvedic treatments"
  }
];

const Admin = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Rotate hero image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % hotelImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: "📊", end: true },
    { path: "/admin/hotel", label: "Hotel Management", icon: "🏨" },
    { path: "/admin/guest", label: "Guest Management", icon: "👥" },
    { path: "/admin/servicerequest", label: "Service Request", icon: "🛎️" },
    { path: "/admin/foodmenu", label: "Food Menu", icon: "🍽️" },
    { path: "/admin/housekeeping", label: "Housekeeping", icon: "🧹" },
    { path: "/admin/chatbot", label: "Chatbot Assistant", icon: "🤖" },
    { path: "/admin/facilities", label: "Facilities", icon: "🏊" },
    { path: "/admin/analytics", label: "Analytics", icon: "📈" }
  ];

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear local storage
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
      
      // Clear session storage if any
      sessionStorage.clear();
      
      // Navigate to login page
      navigate("/login", { replace: true });
      
    } catch (error) {
      console.error("Logout error:", error);
      // Even if Firebase signout fails, still redirect to login
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isActivePath = (path, end = false) => {
    if (end && path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname === path;
  };

  // Dashboard stats
  const stats = [
    { value: "156", label: "Active Bookings", change: "+12%", icon: "📅", color: "#667eea" },
    { value: "89", label: "Current Guests", change: "+5%", icon: "👥", color: "#f59e0b" },
    { value: "78%", label: "Occupancy Rate", change: "+3%", icon: "🏨", color: "#10b981" },
    { value: "$48.2K", label: "Revenue (MTD)", change: "+18%", icon: "💰", color: "#ef4444" }
  ];

  const recentActivities = [
    { id: 1, action: "New booking", guest: "John Smith", room: "Presidential Suite", time: "2 min ago", icon: "📝" },
    { id: 2, action: "Check-in", guest: "Emma Watson", room: "Ocean View", time: "15 min ago", icon: "✅" },
    { id: 3, action: "Service Request", guest: "Michael Chen", room: "Deluxe King", time: "1 hour ago", icon: "🛎️" },
    { id: 4, action: "Check-out", guest: "Sarah Johnson", room: "Executive Suite", time: "2 hours ago", icon: "🚪" }
  ];

  const upcomingCheckins = [
    { guest: "Robert Downey", room: "Penthouse", time: "2:00 PM", status: "confirmed" },
    { guest: "Scarlett Johansson", room: "Luxury Suite", time: "3:30 PM", status: "pending" },
    { guest: "Chris Evans", room: "Family Room", time: "5:00 PM", status: "confirmed" }
  ];

  return (
    <div className="admin-container">
      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-toggle" onClick={() => setShowMobileMenu(!showMobileMenu)}>
        ☰
      </button>

      {/* SIDEBAR */}
      <aside className={`sidebar ${showMobileMenu ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-area">
            <h2>🌙 Aura Stay</h2>
            <span className="admin-badge">Luxury Hotel Management</span>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name || "Administrator"}</p>
              <p className="user-role">General Manager</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActivePath(item.path, item.end) ? 'active' : ''}`}
              onClick={() => setShowMobileMenu(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="system-status">
            <span className="status-dot online"></span>
            <span>System Online</span>
          </div>
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <>
                <span className="logout-spinner"></span>
                Logging out...
              </>
            ) : (
              <>
                <span>🚪</span> Logout
              </>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="content-header">
          <div className="header-left">
            <h1>Welcome to Aura Stay</h1>
            <p className="greeting">Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0] || 'Admin'}</p>
          </div>
          
          <div className="header-right">
            <div className="date-time">
              <div className="date">{formatDate()}</div>
              <div className="time">{formatTime()}</div>
            </div>
          </div>
        </div>

        {/* Hero Image Carousel - Only on Dashboard */}
        {location.pathname === "/admin" && (
          <div className="hero-carousel">
            <div className="carousel-slide">
              <img src={hotelImages[currentImageIndex].url} alt={hotelImages[currentImageIndex].title} />
              <div className="carousel-caption">
                <h3>{hotelImages[currentImageIndex].title}</h3>
                <p>{hotelImages[currentImageIndex].description}</p>
              </div>
            </div>
            <div className="carousel-dots">
              {hotelImages.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${currentImageIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Content - Only shows on main admin route */}
        {location.pathname === "/admin" ? (
          <div className="dashboard-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card" style={{ borderTopColor: stat.color }}>
                  <div className="stat-icon" style={{ background: `${stat.color}15` }}>
                    {stat.icon}
                  </div>
                  <div className="stat-info">
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                    <span className="stat-change positive">{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Two Column Layout */}
            <div className="dashboard-two-column">
              {/* Recent Activities */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>📋 Recent Activities</h3>
                  <button className="view-all">View All</button>
                </div>
                <div className="activity-list">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">{activity.icon}</div>
                      <div className="activity-details">
                        <div className="activity-title">
                          <strong>{activity.action}</strong> - {activity.guest}
                        </div>
                        <div className="activity-subtitle">Room: {activity.room}</div>
                      </div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Check-ins */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>🕐 Today's Check-ins</h3>
                  <button className="view-all">Schedule</button>
                </div>
                <div className="checkin-list">
                  {upcomingCheckins.map((checkin, index) => (
                    <div key={index} className="checkin-item">
                      <div className="checkin-info">
                        <div className="guest-name">{checkin.guest}</div>
                        <div className="room-type">{checkin.room}</div>
                      </div>
                      <div className="checkin-time">
                        <span className={`status-badge ${checkin.status}`}>{checkin.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hotel Image Gallery */}
            <div className="gallery-section">
              <div className="section-header">
                <h3>🏨 Hotel Highlights</h3>
                <p>Experience luxury at Aura Stay</p>
              </div>
              <div className="image-gallery">
                {hotelImages.map((image, index) => (
                  <div key={index} className="gallery-item">
                    <img src={image.url} alt={image.title} />
                    <div className="gallery-overlay">
                      <h4>{image.title}</h4>
                      <p>{image.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="outlet-content">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;