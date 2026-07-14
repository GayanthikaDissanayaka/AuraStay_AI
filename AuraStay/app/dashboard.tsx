import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Define the Hotel interface
interface Hotel {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  // Add any other fields your hotel documents have
}

export default function Dashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "hotels"));
        const hotelList: Hotel[] = []; // Add explicit type here

        querySnapshot.forEach((doc) => {
          hotelList.push({ id: doc.id, ...doc.data() } as Hotel);
        });

        setHotels(hotelList);
      } catch (error) {
        console.log("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#4facfe", "#8e44ad"]} style={styles.header}>
        <Text style={styles.title}>AuraStay AI</Text>
        <Text style={styles.subtitle}>Select Your Perfect Stay</Text>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#777" />
          <TextInput
            placeholder="Search hotels by name or location..."
            style={styles.input}
          />
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Hotels</Text>
        <Text style={styles.subText}>{hotels.length} hotels found</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4facfe" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hotels.map((hotel) => (
              <View style={styles.card} key={hotel.id}>
                <Image source={{ uri: hotel.image }} style={styles.image} />

                <View style={styles.rating}>
                  <Text>⭐ {hotel.rating}</Text>
                </View>

                <Text style={styles.hotelName}>{hotel.name}</Text>
                <Text style={styles.location}>📍 {hotel.location}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  header: {
    padding: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#eee",
    marginBottom: 15,
  },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  input: {
    marginLeft: 10,
    flex: 1,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subText: {
    color: "#777",
    marginBottom: 10,
  },
  card: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginRight: 15,
    paddingBottom: 10,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  rating: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 8,
  },
  hotelName: {
    fontWeight: "bold",
    padding: 8,
  },
  location: {
    color: "#777",
    paddingHorizontal: 8,
  },
});