import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../firebase/firebase';

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

export default function HotelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchHotelDetails();
    }
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      console.log('Fetching hotel details for ID:', id);
      const hotelDoc = await getDoc(doc(db, 'hotels', id));
      
      if (hotelDoc.exists()) {
        setHotel({
          id: hotelDoc.id,
          ...hotelDoc.data()
        } as Hotel);
      } else {
        console.log('Hotel not found');
        Alert.alert('Error', 'Hotel not found');
      }
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      Alert.alert('Error', 'Failed to load hotel details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    // Show alert instead of navigating
    Alert.alert(
      'Coming Soon',
      'Booking feature will be available soon!',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading hotel details...</Text>
      </View>
    );
  }

  if (!hotel) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Hotel not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image
        source={{ uri: hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500' }}
        style={styles.hotelImage}
      />
      
      <TouchableOpacity onPress={() => router.back()} style={styles.backButtonIcon}>
        <Text style={styles.backButtonIconText}>←</Text>
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text style={styles.hotelName}>{hotel.name}</Text>
        
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>📍 {hotel.location}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐ {hotel.rating} / 5</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price per night</Text>
          <Text style={styles.priceValue}>${hotel.price}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{hotel.description || 'No description available.'}</Text>
        </View>

        {hotel.amenities && hotel.amenities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {hotel.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityBadge}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  hotelImage: {
    width: width,
    height: 300,
  },
  backButtonIcon: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backButtonIconText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
  },
  hotelName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  locationContainer: {
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#666',
  },
  ratingContainer: {
    marginBottom: 15,
  },
  ratingText: {
    fontSize: 16,
    color: '#f59e0b',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  priceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#667eea',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  amenityText: {
    fontSize: 14,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});