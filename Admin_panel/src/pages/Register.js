import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hotelName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    adminName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
    hotelType: "MidScale",
    totalRooms: "",
    description: "",
    minPrice: "",
    maxPrice: "",
    amenities: [],
    agreeTerms: false
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [customAmenity, setCustomAmenity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const MAX_IMAGES = 6;
  const MIN_IMAGES = 3;

  const commonAmenities = [
    { name: "Free WiFi", icon: "📶", category: "Basic" },
    { name: "Restaurant", icon: "🍽️", category: "Dining" },
    { name: "Swimming Pool", icon: "🏊", category: "Recreation" },
    { name: "Free Parking", icon: "🅿️", category: "Basic" },
    { name: "Room Service", icon: "🛎️", category: "Service" },
    { name: "Air Conditioning", icon: "❄️", category: "Basic" },
    { name: "24/7 Reception", icon: "🕐", category: "Service" },
    { name: "Breakfast Included", icon: "🍳", category: "Dining" },
    { name: "Laundry Service", icon: "👕", category: "Service" },
    { name: "Luggage Storage", icon: "🧳", category: "Service" },
    { name: "TV in Rooms", icon: "📺", category: "Basic" },
    { name: "Hot Water", icon: "🚿", category: "Basic" },
    { name: "Elevator", icon: "🛗", category: "Accessibility" },
    { name: "Family Rooms", icon: "👨‍👩‍👧‍👦", category: "Family" },
    { name: "Non-Smoking Rooms", icon: "🚭", category: "Basic" },
    { name: "Daily Housekeeping", icon: "🧹", category: "Service" },
    { name: "Tour Desk", icon: "🗺️", category: "Service" },
    { name: "Airport Shuttle", icon: "🚌", category: "Transport" },
    { name: "Concierge Service", icon: "🎫", category: "Service" },
    { name: "Business Center", icon: "💼", category: "Business" },
    { name: "Meeting Rooms", icon: "📊", category: "Business" },
    { name: "Tea/Coffee Maker", icon: "☕", category: "Basic" },
    { name: "Mini Fridge", icon: "🧊", category: "Basic" },
    { name: "Safe Deposit Box", icon: "🔐", category: "Security" }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    setError("");
  };

  const handleAmenityToggle = (amenityName) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityName)
        ? prev.amenities.filter(a => a !== amenityName)
        : [...prev.amenities, amenityName]
    }));
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !formData.amenities.includes(customAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, customAmenity.trim()]
      }));
      setCustomAmenity("");
    }
  };

  const removeCustomAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const getAmenityIcon = (amenityName) => {
    const found = commonAmenities.find(a => a.name === amenityName);
    return found ? found.icon : "✨";
  };

  const filteredAmenities = commonAmenities.filter(amenity =>
    amenity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedAmenities = filteredAmenities.reduce((groups, amenity) => {
    if (!groups[amenity.category]) {
      groups[amenity.category] = [];
    }
    groups[amenity.category].push(amenity);
    return groups;
  }, {});

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const combined = [...selectedImages, ...files];

    if (combined.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} photos.`);
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));

    setSelectedImages(combined);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setError("");
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToStorage = async (userId) => {
    const storage = getStorage();
    const uploadedUrls = [];

    for (let i = 0; i < selectedImages.length; i++) {
      const file = selectedImages[i];
      const storageRef = ref(storage, `hotels/${userId}/image_${i}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      uploadedUrls.push(url);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setDebugInfo("");

    const { password, confirmPassword, agreeTerms, hotelName, email, totalRooms, minPrice, maxPrice } = formData;

    if (!agreeTerms) {
      setError("Please accept the Terms & Conditions");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!hotelName) {
      setError("Please enter hotel name");
      return;
    }
    if (!email) {
      setError("Please enter hotel email");
      return;
    }
    if (!totalRooms || totalRooms < 1) {
      setError("Please enter valid number of rooms (10-80 rooms recommended)");
      return;
    }
    if (minPrice && (minPrice < 1000 || minPrice > 3000)) {
      setError("Min price should be between LKR 1,000 - LKR 3,000 for medium-range hotels");
      return;
    }
    if (maxPrice && (maxPrice < 3000 || maxPrice > 6000)) {
      setError("Max price should be between LKR 3,000 - LKR 6,000 for medium-range hotels");
      return;
    }
    if (selectedImages.length < MIN_IMAGES) {
      setError(`Please upload at least ${MIN_IMAGES} hotel photos.`);
      return;
    }
    if (selectedImages.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} hotel photos.`);
      return;
    }

    setLoading(true);
    setDebugInfo("Starting registration...");

    try {
      setDebugInfo(prev => prev + "\n✓ Creating user account...");

      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, password);
      const user = userCredential.user;

      setDebugInfo(prev => prev + `\n✓ User created: ${user.uid}`);

      setDebugInfo(prev => prev + "\n✓ Uploading hotel photos...");
      setUploadingImages(true);
      const imageUrls = await uploadImagesToStorage(user.uid);
      setUploadingImages(false);
      setDebugInfo(prev => prev + `\n✓ ${imageUrls.length} photos uploaded`);

      const minPriceNum = parseFloat(minPrice) || 2500;
      const maxPriceNum = parseFloat(maxPrice) || 5500;
      const totalRoomsNum = parseInt(totalRooms);

      const hotelData = {
        id: user.uid,
        name: formData.hotelName,
        location: `${formData.city}, ${formData.country}`,
        city: formData.city,
        country: formData.country,
        description: formData.description || "A comfortable mid-range hotel offering great value with modern amenities.",
        totalRooms: totalRoomsNum,
        availableRooms: Math.floor(totalRoomsNum * 0.7),
        minPrice: minPriceNum,
        maxPrice: maxPriceNum,
        rating: 4.2,
        amenities: formData.amenities.length > 0 ? formData.amenities : ["Free WiFi", "Breakfast Included", "Free Parking"],
        currency: "LKR",
        hotelType: formData.hotelType,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        status: "active",
        category: "Mid-Range",
        createdAt: serverTimestamp(),
        role: "hotel_admin",
        images: imageUrls,
        image: imageUrls[0],
      };

      setDebugInfo(prev => prev + "\n✓ Saving to database...");

      await setDoc(doc(db, "hotels", user.uid), hotelData);

      setDebugInfo(prev => prev + "\n✓ Registration complete!");
      setSuccess("Hotel registered successfully! 🎉 Redirecting to login...");

      setTimeout(() => navigate("/"), 2000);

    } catch (err) {
      console.error("Registration error:", err);
      setDebugInfo(prev => prev + `\n❌ Error: ${err.message}`);

      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered. Please use a different email.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError("Registration failed: " + err.message);
      }
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back to Login
        </button>

        <div className="register-header">
          <h1>🏨 Register Your Hotel</h1>
          <p>Join Aura Stay - Perfect for medium-range hotels in Sri Lanka</p>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}
        {success && <div className="success-message">✅ {success}</div>}

        {debugInfo && (
          <div className="debug-info">
            <strong>🔍 Debug Information:</strong>
            <pre>{debugInfo}</pre>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          {/* HOTEL INFORMATION */}
          <div className="form-section">
            <h3>📋 Hotel Information</h3>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">Hotel Name *</label>
                <input
                  name="hotelName"
                  placeholder="e.g., Sunrise Comfort Inn"
                  value={formData.hotelName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Hotel Email *</label>
                <input
                  name="email"
                  type="email"
                  placeholder="hotel@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">Phone Number *</label>
                <input
                  name="phone"
                  placeholder="+94 XX XXX XXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">City *</label>
                <input
                  name="city"
                  placeholder="e.g., Kandy, Ella, Negombo"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">Country *</label>
                <input
                  name="country"
                  placeholder="Sri Lanka"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Hotel Type *</label>
                <div className="select-wrapper">
                  <select name="hotelType" value={formData.hotelType} onChange={handleChange} className="hotel-type-select">
                    <option value="MidScale">🏨 Mid-Scale Hotel - Best for comfort & value</option>
                    <option value="Comfort">😊 Comfort Hotel - Relaxing family atmosphere</option>
                    <option value="BusinessLodge">💼 Business Lodge - Perfect for business travelers</option>
                    <option value="FamilyInn">👨‍👩‍👧‍👦 Family Inn - Great for families</option>
                    <option value="CityHotel">🏙️ City Hotel - Urban convenience</option>
                    <option value="Express">⚡ Express Hotel - Quick comfortable stays</option>
                    <option value="GardenHotel">🌿 Garden Hotel - Peaceful nature retreat</option>
                    <option value="LakeView">🌅 Lake View Hotel - Scenic waterfront views</option>
                    <option value="MountainInn">⛰️ Mountain Inn - Cozy mountain getaway</option>
                    <option value="EcoLodge">🍃 Eco Lodge - Sustainable eco-friendly stay</option>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">Total Rooms * (10-80 rooms)</label>
                <input
                  name="totalRooms"
                  type="number"
                  placeholder="e.g., 25"
                  value={formData.totalRooms}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Min Price (LKR) * (1,000 - 3,000)</label>
                <input
                  name="minPrice"
                  type="number"
                  placeholder="e.g., 2500"
                  value={formData.minPrice}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Max Price (LKR) * (3,000 - 6,000)</label>
                <input
                  name="maxPrice"
                  type="number"
                  placeholder="e.g., 5500"
                  value={formData.maxPrice}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Hotel Description</label>
              <textarea
                name="description"
                placeholder="Describe your hotel - mention your unique features, location benefits, nearby attractions..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="description-input"
              />
            </div>
          </div>

          {/* HOTEL PHOTOS */}
          <div className="form-section">
            <h3>📸 Hotel Photos</h3>
            <p className="amenities-subtitle">
              Upload {MIN_IMAGES}–{MAX_IMAGES} photos of your hotel (exteriors, rooms, facilities)
            </p>

            <div className="photo-input-wrapper">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                disabled={selectedImages.length >= MAX_IMAGES}
                className="photo-file-input"
              />
            </div>

            <div className="photo-previews-grid">
              {imagePreviews.map((src, index) => (
                <div key={index} className="photo-preview-item">
                  <img
                    src={src}
                    alt={`Hotel photo ${index + 1}`}
                    className="photo-preview-img"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="photo-remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <p className="photo-counter">
              {selectedImages.length} / {MAX_IMAGES} photos selected
              {selectedImages.length < MIN_IMAGES && (
                <span className="photo-counter-warning">
                  {" "}(minimum {MIN_IMAGES} required)
                </span>
              )}
            </p>
          </div>

          {/* AMENITIES & SERVICES */}
          <div className="form-section amenities-section">
            <h3>✨ Amenities & Services</h3>
            <p className="amenities-subtitle">Select the amenities your hotel offers (Essential for medium-range hotels)</p>

            <div className="amenities-search">
              <input
                type="text"
                placeholder="🔍 Search amenities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="amenities-categories">
              {Object.keys(groupedAmenities).map(category => (
                <div key={category} className="amenity-category">
                  <h4 className="category-title">{category}</h4>
                  <div className="amenities-grid">
                    {groupedAmenities[category].map(amenity => (
                      <label
                        key={amenity.name}
                        className={`amenity-card ${formData.amenities.includes(amenity.name) ? 'selected' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity.name)}
                          onChange={() => handleAmenityToggle(amenity.name)}
                          hidden
                        />
                        <span className="amenity-icon">{amenity.icon}</span>
                        <span className="amenity-name">{amenity.name}</span>
                        {formData.amenities.includes(amenity.name) && (
                          <span className="check-mark">✓</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="custom-amenity-section">
              <h4 className="category-title">➕ Add Custom Amenity</h4>
              <div className="custom-amenity-input">
                <input
                  type="text"
                  placeholder="e.g., Rooftop Terrace, BBQ Area, Game Room..."
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()}
                />
                <button type="button" onClick={addCustomAmenity} className="add-amenity-btn">
                  + Add
                </button>
              </div>
            </div>

            {formData.amenities.length > 0 && (
              <div className="selected-amenities-section">
                <h4 className="category-title">✅ Selected Amenities ({formData.amenities.length})</h4>
                <div className="selected-amenities-list">
                  {formData.amenities.map(amenity => (
                    <div key={amenity} className="selected-amenity-tag">
                      <span className="tag-icon">{getAmenityIcon(amenity)}</span>
                      <span className="tag-name">{amenity}</span>
                      <button
                        type="button"
                        className="remove-tag"
                        onClick={() => removeCustomAmenity(amenity)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="amenities-stats">
              <div className="stat-badge">
                <span className="stat-number">{formData.amenities.length}</span>
                <span className="stat-label">Amenities Selected</span>
              </div>
              <div className="stat-badge">
                <span className="stat-number">{commonAmenities.length}</span>
                <span className="stat-label">Available Options</span>
              </div>
            </div>
          </div>

          {/* ADMINISTRATOR DETAILS */}
          <div className="form-section">
            <h3>👤 Administrator Details</h3>
            <div className="form-row">
              <div className="input-group">
                <label className="input-label">Admin Name *</label>
                <input
                  name="adminName"
                  placeholder="Full name"
                  value={formData.adminName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Admin Email *</label>
                <input
                  name="adminEmail"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* SECURITY */}
          <div className="form-section">
            <h3>🔒 Security</h3>
            <div className="form-row">
              <div className="input-group">
                <label className="input-label">Password * (min 6 characters)</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <span>I agree to the Terms & Conditions and Privacy Policy</span>
            </label>
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {uploadingImages
              ? "📸 Uploading photos..."
              : loading
              ? "⏳ Registering..."
              : "🏨 Register Hotel"}
          </button>
        </form>

        <div className="login-prompt">
          <p>Already have an account? <button className="login-link" onClick={() => navigate("/")}>Sign In</button></p>
        </div>
      </div>
    </div>
  );
};

export default Register;