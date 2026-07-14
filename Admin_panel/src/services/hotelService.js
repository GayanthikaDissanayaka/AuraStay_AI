/*
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const COLLECTION_NAME = "hotels";

// Get all hotels
export const getHotels = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const hotels = [];
    querySnapshot.forEach((doc) => {
      hotels.push({ id: doc.id, ...doc.data() });
    });
    return hotels;
  } catch (error) {
    console.error("Error getting hotels:", error);
    return [];
  }
};

// Add a new hotel
export const addHotel = async (hotelData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), hotelData);
    return { id: docRef.id, ...hotelData };
  } catch (error) {
    console.error("Error adding hotel:", error);
    throw error;
  }
};

// Update a hotel
export const updateHotel = async (id, hotelData) => {
  try {
    const hotelRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(hotelRef, hotelData);
    return { id, ...hotelData };
  } catch (error) {
    console.error("Error updating hotel:", error);
    throw error;
  }
};

// Delete a hotel
export const deleteHotel = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error("Error deleting hotel:", error);
    throw error;
  }
};
*/
