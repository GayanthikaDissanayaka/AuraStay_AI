import { router } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../firebase/config';

interface Hotel {
  id: string;
  adminName: string;
  city: string;
  country: string;
  category: string;
  availableRooms: number;
  amenities: string[];
  pricePerNight: number;
}

export default function HotelListScreen() {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    fetchHotels();
  }, []);

const fetchHotels = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'hotels'));
    
    console.log('Total docs:', snapshot.docs.length);

    // ✅ FIXED CODE
const data: Hotel[] = snapshot.docs.map(doc => {
  const { id, ...rest } = doc.data(); // ← strips the duplicate id
  return {
    id: doc.id,
    ...rest as Omit<Hotel, 'id'>
  };
});

    setHotels(data);
  } catch (error) {
    console.log('Fetch error:', error);
  }
};

  const openHotel = (id: string) => {
    router.push(`/hotels/${id}` as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mid-Range Hotels</Text>

      {hotels.length === 0 && (
        <Text style={styles.empty}>No hotels found.</Text>
      )}

      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => openHotel(item.id)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.adminName}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.category}</Text>
              </View>
            </View>

            <Text style={styles.location}>📍 {item.city}, {item.country}</Text>

            <Text style={styles.amenitiesLabel}>Amenities:</Text>
            <View style={styles.amenitiesRow}>
              {item.amenities?.map((amenity, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.rooms}>🛏 {item.availableRooms} rooms available</Text>
              {item.pricePerNight ? (
                <Text style={styles.price}>${item.pricePerNight}/night</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 20
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 16
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1
  },
  badge: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8
  },
  badgeText: {
    color: '#1e3c72',
    fontSize: 12,
    fontWeight: '600'
  },
  location: {
    color: '#555',
    fontSize: 14,
    marginBottom: 10
  },
  amenitiesLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12
  },
  amenityChip: {
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d0dce8'
  },
  amenityText: {
    fontSize: 12,
    color: '#444'
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10
  },
  rooms: {
    color: '#1e3c72',
    fontWeight: '500',
    fontSize: 13
  },
  price: {
    color: '#2ecc71',
    fontWeight: '700',
    fontSize: 15
  }
});