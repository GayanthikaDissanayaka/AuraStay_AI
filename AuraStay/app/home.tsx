import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Chatbot from '../components/Chatbot';

// Define interfaces for type safety
interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  totalRooms: number;
  availableRooms: number;
  price: string;
  rating: number;
  amenities: string[];
  images: string[];
  foodMenu: FoodItem[];
  housekeeping: ServiceItem[];
}

interface FoodItem {
  id: number;
  name: string;
  price: string;
  description: string;
}

interface ServiceItem {
  id: number;
  name: string;
  price: string;
  description: string;
}

interface Booking {
  id: number;
  hotelId: number;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: string;
  status: string;
  qrCode: string;
  roomNumber: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  loyaltyPoints: number;
  profileImage: string | null;
}

export default function HomeDashboard() {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showHotelDetails, setShowHotelDetails] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('hotels');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Sample Hotels Data
  const hotels: Hotel[] = [
    {
      id: 1,
      name: '🏝️ Ivory Safari',
      location: 'Udawalawe, Sri Lanka',
      description: 'Peaceful eco-lodge close to Udawalawe National Park, ideal for wildlife lovers.',
      totalRooms: 20,
      availableRooms: 8,
      price: '$10 - $50',
      rating: 4.6,
      amenities: ['Safari Tours', 'Outdoor Pool', 'Restaurant', 'Free WiFi', 'Garden'],
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
      foodMenu: [
        { id: 1, name: 'Sri Lankan Breakfast', price: '$8', description: 'Traditional rice and curry' },
        { id: 2, name: 'Grilled Seafood', price: '$15', description: 'Fresh catch of the day' },
        { id: 3, name: 'Tropical Fruit Platter', price: '$5', description: 'Seasonal fruits' },
      ],
      housekeeping: [
        { id: 1, name: 'Room Cleaning', price: 'Free', description: 'Daily cleaning service' },
        { id: 2, name: 'Laundry Service', price: '$5', description: 'Wash and fold' },
        { id: 3, name: 'Turndown Service', price: 'Free', description: 'Evening service' },
      ]
    },
    {
      id: 2,
      name: '🌄 98 Acres Resort & Spa',
      location: 'Ella, Sri Lanka',
      description: 'Luxury eco-friendly resort in a scenic tea estate with breathtaking views.',
      totalRooms: 36,
      availableRooms: 12,
      price: '$250 - $600',
      rating: 4.8,
      amenities: ['Spa', 'Infinity Pool', 'Yoga', 'Restaurant', 'Hiking'],
      images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d'],
      foodMenu: [
        { id: 1, name: 'High Tea', price: '$12', description: 'With panoramic view' },
        { id: 2, name: 'Sri Lankan Curry', price: '$18', description: 'Authentic flavors' },
        { id: 3, name: 'Wine Selection', price: '$25', description: 'Premium wines' },
      ],
      housekeeping: [
        { id: 1, name: 'Premium Cleaning', price: '$10', description: 'Deep cleaning' },
        { id: 2, name: 'Spa Robe Service', price: '$8', description: 'Luxury robes' },
      ]
    },
    {
      id: 3,
      name: '🌊 Trinco Blu by Cinnamon',
      location: 'Trincomalee, Sri Lanka',
      description: 'Beachfront hotel with stunning ocean views and water activities.',
      totalRooms: 81,
      availableRooms: 20,
      price: '$120 - $350',
      rating: 4.3,
      amenities: ['Beachfront', 'Pool', 'Diving Center', 'Bar', 'Restaurant'],
      images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd'],
      foodMenu: [
        { id: 1, name: 'Seafood Platter', price: '$20', description: 'Fresh seafood' },
        { id: 2, name: 'BBQ Night', price: '$15', description: 'Grill specialties' },
      ],
      housekeeping: [
        { id: 1, name: 'Beach Towel Service', price: 'Free', description: 'Daily towels' },
      ]
    },
    {
      id: 4,
      name: '🌴 Club Hotel Dolphin',
      location: 'Negombo, Sri Lanka',
      description: 'Popular beachfront resort with longest pool in Sri Lanka.',
      totalRooms: 150,
      availableRooms: 35,
      price: '$100 - $300',
      rating: 4.4,
      amenities: ['Pool', 'Spa', 'Beach Access', 'Kids Club', 'Sports Facilities'],
      images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7'],
      foodMenu: [
        { id: 1, name: 'Buffet Dinner', price: '$25', description: 'International cuisine' },
      ],
      housekeeping: [
        { id: 1, name: 'Kids Room Service', price: '$5', description: 'Special service' },
      ]
    },
    {
      id: 5,
      name: '🌿 Belihuloya Hideout Villa',
      location: 'Belihuloya, Sri Lanka',
      description: 'Quiet getaway surrounded by mountains and forests.',
      totalRooms: 12,
      availableRooms: 5,
      price: '$80 - $200',
      rating: 4.5,
      amenities: ['Mountain View', 'Hiking', 'Garden', 'BBQ Area', 'Free WiFi'],
      images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'],
      foodMenu: [
        { id: 1, name: 'BBQ Dinner', price: '$12', description: 'Grill under stars' },
      ],
      housekeeping: [
        { id: 1, name: 'Nature Cleaning', price: '$8', description: 'Eco-friendly' },
      ]
    },
  ];

  // Sample User Bookings
  const [userBookings, setUserBookings] = useState<Booking[]>([
    {
      id: 1,
      hotelId: 1,
      hotelName: '🏝️ Ivory Safari',
      roomType: 'Deluxe Room',
      checkIn: '2024-12-20',
      checkOut: '2024-12-25',
      guests: 2,
      totalPrice: '$250',
      status: 'confirmed',
      qrCode: 'IVORY123456',
      roomNumber: '205',
    }
  ]);

  const [userProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+94 77 123 4567',
    memberSince: '2024-01-15',
    loyaltyPoints: 1250,
    profileImage: null,
  });

  const handleBookHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (!selectedHotel) return;
    
    const newBooking: Booking = {
      id: userBookings.length + 1,
      hotelId: selectedHotel.id,
      hotelName: selectedHotel.name,
      roomType: 'Standard Room',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      guests: 2,
      totalPrice: selectedHotel.price.split(' - ')[0],
      status: 'confirmed',
      qrCode: `${selectedHotel.name.substring(0, 4).toUpperCase()}${Math.floor(Math.random() * 10000)}`,
      roomNumber: String(Math.floor(Math.random() * 300) + 100),
    };
    
    setUserBookings([...userBookings, newBooking]);
    setShowBookingModal(false);
    Alert.alert('Success', 'Hotel booked successfully!');
    setActiveTab('bookings');
  };

  const handleViewQR = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowQRModal(true);
  };

  const handleRequestService = (service: ServiceItem) => {
    Alert.alert('Service Requested', `${service.name} has been requested. Staff will assist shortly.`);
  };

  const handleOrderFood = (item: FoodItem) => {
    Alert.alert('Food Ordered', `${item.name} has been added to your order.`);
  };

  const renderHotelCard = ({ item }: { item: Hotel }) => (
    <TouchableOpacity 
      style={styles.hotelCard}
      onPress={() => {
        setSelectedHotel(item);
        setShowHotelDetails(true);
      }}
    >
      <View style={styles.hotelImagePlaceholder}>
        <Text style={styles.hotelImageIcon}>🏨</Text>
      </View>
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <Text style={styles.hotelLocation}>📍 {item.location}</Text>
        <View style={styles.hotelRating}>
          <Text style={styles.ratingStars}>⭐ {item.rating}</Text>
          <Text style={styles.hotelPrice}>{item.price}/night</Text>
        </View>
        <View style={styles.hotelAvailability}>
          <Text style={styles.availableText}>✓ {item.availableRooms} rooms available</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBookingCard = ({ item }: { item: Booking }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingHotel}>{item.hotelName}</Text>
        <View style={[styles.bookingStatus, { backgroundColor: '#d4edda' }]}>
          <Text style={[styles.statusText, { color: '#155724' }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.bookingRoom}>Room {item.roomNumber} • {item.roomType}</Text>
      <Text style={styles.bookingDates}>📅 {item.checkIn} → {item.checkOut}</Text>
      <Text style={styles.bookingGuests}>👥 {item.guests} guests</Text>
      <Text style={styles.bookingPrice}>💰 {item.totalPrice}</Text>
      <TouchableOpacity 
        style={styles.qrButton}
        onPress={() => handleViewQR(item)}
      >
        <Text style={styles.qrButtonText}>📱 View Room Access QR</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHotelDetails = () => (
    <Modal
      visible={showHotelDetails}
      animationType="slide"
      onRequestClose={() => setShowHotelDetails(false)}
    >
      <View style={styles.modalContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowHotelDetails(false)}>
              <Text style={styles.closeButton}>← Back</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.hotelDetailContent}>
            <Text style={styles.detailHotelName}>{selectedHotel?.name}</Text>
            <Text style={styles.detailLocation}>📍 {selectedHotel?.location}</Text>
            <Text style={styles.detailRating}>⭐ {selectedHotel?.rating} ★</Text>
            <Text style={styles.detailDescription}>{selectedHotel?.description}</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesList}>
                {selectedHotel?.amenities.map((item: string, index: number) => (
                  <View key={index} style={styles.amenityTag}>
                    <Text style={styles.amenityText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🍽️ Food Menu</Text>
              {selectedHotel?.foodMenu.map((item: FoodItem) => (
                <View key={item.id} style={styles.menuItem}>
                  <View style={styles.menuItemInfo}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemDesc}>{item.description}</Text>
                  </View>
                  <View style={styles.menuItemRight}>
                    <Text style={styles.menuItemPrice}>{item.price}</Text>
                    <TouchableOpacity 
                      style={styles.orderButton}
                      onPress={() => handleOrderFood(item)}
                    >
                      <Text style={styles.orderButtonText}>Order</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🧹 Housekeeping Services</Text>
              {selectedHotel?.housekeeping.map((item: ServiceItem) => (
                <View key={item.id} style={styles.serviceItem}>
                  <View>
                    <Text style={styles.serviceName}>{item.name}</Text>
                    <Text style={styles.serviceDesc}>{item.description}</Text>
                  </View>
                  <View style={styles.serviceRight}>
                    <Text style={styles.servicePrice}>{item.price}</Text>
                    <TouchableOpacity 
                      style={styles.requestButton}
                      onPress={() => handleRequestService(item)}
                    >
                      <Text style={styles.requestButtonText}>Request</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
            
            <View style={styles.bookingSection}>
              <Text style={styles.priceText}>Price: {selectedHotel?.price} / night</Text>
              <TouchableOpacity 
                style={styles.bookNowButton}
                onPress={() => {
                  setShowHotelDetails(false);
                  handleBookHotel(selectedHotel!);
                }}
              >
                <Text style={styles.bookNowText}>Book Now →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderBookingModal = () => (
    <Modal
      visible={showBookingModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowBookingModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.bookingModalContent}>
          <Text style={styles.bookingModalTitle}>Confirm Booking</Text>
          <Text style={styles.bookingHotelName}>{selectedHotel?.name}</Text>
          <Text style={styles.bookingDetail}>📅 Check-in: Today</Text>
          <Text style={styles.bookingDetail}>📅 Check-out: {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</Text>
          <Text style={styles.bookingDetail}>👥 Guests: 2 Adults</Text>
          <Text style={styles.bookingDetail}>💰 Total: {selectedHotel?.price?.split(' - ')[0]}</Text>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowBookingModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.confirmButton]}
              onPress={confirmBooking}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderQRModal = () => (
    <Modal
      visible={showQRModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowQRModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.qrModalContent}>
          <Text style={styles.qrModalTitle}>Room Access QR Code</Text>
          <View style={styles.qrCodeBox}>
            <Text style={styles.qrCodeIcon}>📱</Text>
            <Text style={styles.qrCodeText}>{selectedBooking?.qrCode}</Text>
            <View style={styles.qrCodePattern}>
              <View style={styles.qrCorner} />
              <View style={styles.qrCorner2} />
              <View style={styles.qrCorner3} />
              <View style={styles.qrCorner4} />
            </View>
          </View>
          <Text style={styles.qrHotelName}>{selectedBooking?.hotelName}</Text>
          <Text style={styles.qrRoomInfo}>Room Number: {selectedBooking?.roomNumber}</Text>
          <Text style={styles.qrInstruction}>Show this QR code at the reception or scan at room door</Text>
          <TouchableOpacity 
            style={styles.closeQRButton}
            onPress={() => setShowQRModal(false)}
          >
            <Text style={styles.closeQRButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderProfile = () => (
    <View style={styles.profileContainer}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileImagePlaceholder}>👤</Text>
        </View>
        <Text style={styles.profileName}>{userProfile.name}</Text>
        <Text style={styles.profileEmail}>{userProfile.email}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userProfile.loyaltyPoints}</Text>
          <Text style={styles.statLabel}>Loyalty Points</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userBookings.length}</Text>
          <Text style={styles.statLabel}>Total Bookings</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>⭐ 4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Contact Information</Text>
        <Text style={styles.infoText}>📧 {userProfile.email}</Text>
        <Text style={styles.infoText}>📱 {userProfile.phone}</Text>
        <Text style={styles.infoText}>📅 Member since {userProfile.memberSince}</Text>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/')}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AuraStay AI</Text>
        <TouchableOpacity onPress={() => setShowChatbot(true)} style={styles.chatbotIcon}>
          <Text style={styles.chatbotIconText}>🤖</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'hotels' && styles.activeTab]}
          onPress={() => setActiveTab('hotels')}
        >
          <Text style={[styles.tabText, activeTab === 'hotels' && styles.activeTabText]}>🏨 Hotels</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'bookings' && styles.activeTab]}
          onPress={() => setActiveTab('bookings')}
        >
          <Text style={[styles.tabText, activeTab === 'bookings' && styles.activeTabText]}>📅 Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>👤 Profile</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} />
        }
      >
        {activeTab === 'hotels' && (
          <>
            <Text style={styles.welcomeText}>Welcome back, {userProfile.name}! 👋</Text>
            <Text style={styles.sectionHeaderText}>Available Hotels</Text>
            <FlatList
              data={hotels}
              renderItem={renderHotelCard}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </>
        )}
        
        {activeTab === 'bookings' && (
          <>
            <Text style={styles.sectionHeaderText}>My Bookings</Text>
            {userBookings.length > 0 ? (
              <FlatList
                data={userBookings}
                renderItem={renderBookingCard}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📅</Text>
                <Text style={styles.emptyStateText}>No bookings yet</Text>
                <Text style={styles.emptyStateSubtext}>Book your first hotel to get started</Text>
              </View>
            )}
          </>
        )}
        
        {activeTab === 'profile' && renderProfile()}
      </ScrollView>
      
      {renderHotelDetails()}
      {renderBookingModal()}
      {renderQRModal()}
      
      <Chatbot visible={showChatbot} onClose={() => setShowChatbot(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { backgroundColor: '#1e3c72', padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  chatbotIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  chatbotIconText: { fontSize: 24 },
  tabBar: { flexDirection: 'row', backgroundColor: 'white', paddingVertical: 12, paddingHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  activeTab: { backgroundColor: '#667eea20' },
  tabText: { fontSize: 14, color: '#666' },
  activeTabText: { color: '#667eea', fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  welcomeText: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  sectionHeaderText: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 16 },
  hotelCard: { backgroundColor: 'white', borderRadius: 12, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, flexDirection: 'row' },
  hotelImagePlaceholder: { width: 100, height: 100, backgroundColor: '#667eea20', alignItems: 'center', justifyContent: 'center' },
  hotelImageIcon: { fontSize: 40 },
  hotelInfo: { flex: 1, padding: 12 },
  hotelName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  hotelLocation: { fontSize: 12, color: '#666', marginTop: 2 },
  hotelRating: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  ratingStars: { fontSize: 12, color: '#f59e0b' },
  hotelPrice: { fontSize: 12, color: '#28a745', fontWeight: '600' },
  hotelAvailability: { marginTop: 6 },
  availableText: { fontSize: 11, color: '#28a745' },
  bookingCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  bookingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  bookingHotel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  bookingStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '600' },
  bookingRoom: { fontSize: 13, color: '#666', marginBottom: 6 },
  bookingDates: { fontSize: 12, color: '#666', marginBottom: 4 },
  bookingGuests: { fontSize: 12, color: '#666', marginBottom: 4 },
  bookingPrice: { fontSize: 14, fontWeight: 'bold', color: '#28a745', marginBottom: 12 },
  qrButton: { backgroundColor: '#667eea', padding: 10, borderRadius: 8, alignItems: 'center' },
  qrButtonText: { color: 'white', fontSize: 12, fontWeight: '600' },
  profileContainer: { flex: 1 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  profileImageContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#667eea20', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profileImagePlaceholder: { fontSize: 50 },
  profileName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  profileEmail: { fontSize: 14, color: '#666', marginTop: 4 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#667eea' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  infoCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 24 },
  infoTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  infoText: { fontSize: 14, color: '#666', marginBottom: 8 },
  logoutButton: { backgroundColor: '#dc3545', padding: 14, borderRadius: 12, alignItems: 'center' },
  logoutButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  modalContainer: { flex: 1, backgroundColor: '#f5f7fa' },
  modalHeader: { padding: 20, paddingTop: 50, backgroundColor: '#1e3c72' },
  closeButton: { fontSize: 16, color: 'white', fontWeight: '500' },
  hotelDetailContent: { padding: 20 },
  detailHotelName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  detailLocation: { fontSize: 14, color: '#666', marginTop: 4 },
  detailRating: { fontSize: 14, color: '#f59e0b', marginTop: 4 },
  detailDescription: { fontSize: 14, color: '#666', lineHeight: 20, marginTop: 12 },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  amenitiesList: { flexDirection: 'row', flexWrap: 'wrap' },
  amenityTag: { backgroundColor: '#667eea20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  amenityText: { fontSize: 12, color: '#667eea' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e1e5e9' },
  menuItemInfo: { flex: 1 },
  menuItemName: { fontSize: 14, fontWeight: '600', color: '#333' },
  menuItemDesc: { fontSize: 12, color: '#666', marginTop: 2 },
  menuItemRight: { alignItems: 'flex-end' },
  menuItemPrice: { fontSize: 14, fontWeight: '600', color: '#28a745' },
  orderButton: { marginTop: 4, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#667eea', borderRadius: 6 },
  orderButtonText: { fontSize: 11, color: 'white' },
  serviceItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e1e5e9' },
  serviceName: { fontSize: 14, fontWeight: '600', color: '#333' },
  serviceDesc: { fontSize: 12, color: '#666', marginTop: 2 },
  serviceRight: { alignItems: 'flex-end' },
  servicePrice: { fontSize: 12, color: '#28a745' },
  requestButton: { marginTop: 4, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#f59e0b', borderRadius: 6 },
  requestButtonText: { fontSize: 11, color: 'white' },
  bookingSection: { marginTop: 24, padding: 20, backgroundColor: '#f0f0f0', borderRadius: 12, alignItems: 'center' },
  priceText: { fontSize: 18, fontWeight: 'bold', color: '#28a745', marginBottom: 12 },
  bookNowButton: { backgroundColor: '#667eea', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  bookNowText: { color: 'white', fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  bookingModalContent: { backgroundColor: 'white', borderRadius: 16, padding: 24, width: '85%' },
  bookingModalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16, textAlign: 'center' },
  bookingHotelName: { fontSize: 16, fontWeight: '600', color: '#667eea', marginBottom: 12, textAlign: 'center' },
  bookingDetail: { fontSize: 14, color: '#666', marginBottom: 8 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 6 },
  cancelButton: { backgroundColor: '#e1e5e9' },
  cancelButtonText: { color: '#666', fontWeight: '600' },
  confirmButton: { backgroundColor: '#28a745' },
  confirmButtonText: { color: 'white', fontWeight: '600' },
  qrModalContent: { backgroundColor: 'white', borderRadius: 16, padding: 24, width: '85%', alignItems: 'center' },
  qrModalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  qrCodeBox: { width: 200, height: 200, backgroundColor: '#f0f0f0', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative' },
  qrCodeIcon: { fontSize: 60, marginBottom: 10 },
  qrCodeText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  qrCodePattern: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  qrCorner: { position: 'absolute', top: 10, left: 10, width: 30, height: 30, borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#667eea' },
  qrCorner2: { position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderTopWidth: 3, borderRightWidth: 3, borderColor: '#667eea' },
  qrCorner3: { position: 'absolute', bottom: 10, left: 10, width: 30, height: 30, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: '#667eea' },
  qrCorner4: { position: 'absolute', bottom: 10, right: 10, width: 30, height: 30, borderBottomWidth: 3, borderRightWidth: 3, borderColor: '#667eea' },
  qrHotelName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  qrRoomInfo: { fontSize: 14, color: '#666', marginBottom: 12 },
  qrInstruction: { fontSize: 12, color: '#999', textAlign: 'center', marginBottom: 20 },
  closeQRButton: { backgroundColor: '#667eea', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  closeQRButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyStateIcon: { fontSize: 60, marginBottom: 16 },
  emptyStateText: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 },
  emptyStateSubtext: { fontSize: 14, color: '#666', textAlign: 'center' },
});