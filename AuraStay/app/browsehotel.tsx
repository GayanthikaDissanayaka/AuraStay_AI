import { router } from 'expo-router';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../firebase/firebase';

const { width } = Dimensions.get('window');

interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  amenities?: string[];
}

const newHotels = [
  {
    name: "Manthally Cabanas - Superior King Room",
    location: "Hikkaduwa",
    price: 12000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
    description: "A cozy superior king cabana retreat close to Hikkaduwa's beaches, blending comfort with coastal charm.",
    amenities: ["Free WiFi", "Air Conditioning", "Breakfast Included", "Pool Access"],
  },
  {
    name: "Leafy Cave Luxury Cabana",
    location: "Wellawaya",
    price: 15000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500",
    description: "A unique luxury cabana nestled in nature near Wellawaya, offering privacy and scenic forest views.",
    amenities: ["Free WiFi", "Nature View", "Private Deck", "Breakfast Included"],
  },
  {
    name: "Greenacres Leisure Resort",
    location: "Kandy",
    price: 18000,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500",
    description: "A leisure resort in the heart of Kandy offering relaxation, greenery, and easy access to the city.",
    amenities: ["Free WiFi", "Swimming Pool", "Restaurant", "Parking"],
  },
  {
    name: "Forest View Cabana Resort",
    location: "Haputhale",
    price: 14000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500",
    description: "Perched with sweeping forest views in Haputhale, ideal for travelers seeking cool climate and tranquility.",
    amenities: ["Mountain View", "Free WiFi", "Bonfire Area", "Breakfast Included"],
  },
  {
    name: "Sudagala Jungle Glamping",
    location: "Kuruvita",
    price: 10000,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500",
    description: "An immersive jungle glamping experience in Kuruvita, combining adventure with comfortable outdoor stays.",
    amenities: ["Jungle View", "Camping Setup", "Guided Tours", "Bonfire Area"],
  },
];

export default function BrowseHotelScreen() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      console.log('Fetching hotels from Firebase...');
      const hotelsCollection = collection(db, 'hotels');
      const hotelSnapshot = await getDocs(hotelsCollection);
      console.log('Number of hotels found:', hotelSnapshot.size);

      const hotelList = hotelSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Hotel[];

      console.log('Hotels loaded:', hotelList);
      setHotels(hotelList);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotels = async () => {
    setSeeding(true);
    try {
      for (const hotel of newHotels) {
        await addDoc(collection(db, 'hotels'), hotel);
        console.log(`Added: ${hotel.name}`);
      }
      Alert.alert('Success', 'All 5 hotels added!');
      fetchHotels();
    } catch (error) {
      console.error('Error adding hotels:', error);
      Alert.alert('Error', 'Failed to add hotels. Check console.');
    } finally {
      setSeeding(false);
    }
  };

  const filteredHotels = hotels.filter(hotel =>
    hotel.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleHotelPress = (hotel: Hotel) => {
    router.push(`/hotel/${hotel.id}` as any);
  };

  const renderHotelCard = ({ item }: { item: Hotel }) => (
    <TouchableOpacity
      style={styles.hotelCard}
      onPress={() => handleHotelPress(item)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500' }}
        style={styles.hotelImage}
      />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name || 'Hotel Name'}</Text>
        <Text style={styles.hotelLocation}>📍 {item.location || 'Unknown Location'}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating || 4.5} / 5</Text>
        </View>
        <Text style={styles.hotelPrice}>${item.price || 0}/night</Text>
        <Text style={styles.hotelDescription} numberOfLines={2}>
          {item.description || 'Luxury hotel with premium amenities and excellent service.'}
        </Text>
        <View style={styles.bookButton}>
          <Text style={styles.bookButtonText}>View Details →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading hotels...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Browse Hotels</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by hotel name or location..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Temporary seed button — remove after running once */}
      <TouchableOpacity
        style={styles.seedButton}
        onPress={handleAddHotels}
        disabled={seeding}
      >
        <Text style={styles.seedButtonText}>
          {seeding ? 'Adding Hotels...' : 'Add 5 New Hotels (run once)'}
        </Text>
      </TouchableOpacity>

      {filteredHotels.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noHotelsText}>No hotels found</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchHotels}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredHotels}
          renderItem={renderHotelCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1e3c72',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
  },
  seedButton: {
    backgroundColor: '#f59e0b',
    marginHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  seedButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
  },
  hotelCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hotelImage: {
    width: '100%',
    height: 200,
  },
  hotelInfo: {
    padding: 15,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  hotelLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: '#f59e0b',
  },
  hotelPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
  },
  hotelDescription: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
    marginBottom: 12,
  },
  bookButton: {
    backgroundColor: '#667eea',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noHotelsText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});