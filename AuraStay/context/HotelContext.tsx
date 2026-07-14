import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BookedDate, Facility, Hotel, Room, Service, VisitingPlace } from '../types/hotel';

interface HotelContextType {
  hotels: Hotel[];
  addHotel: (hotel: Hotel) => void;
  updateHotel: (hotelId: string, updates: Partial<Hotel>) => void;
  deleteHotel: (hotelId: string) => void;
  getHotelById: (hotelId: string) => Hotel | undefined;
  addRoom: (hotelId: string, room: Room) => void;
  updateRoom: (hotelId: string, roomId: string, updates: Partial<Room>) => void;
  bookRoom: (hotelId: string, roomId: string, startDate: string, endDate: string, guestName: string) => boolean;
  getAvailableRooms: (hotelId: string, startDate: string, endDate: string) => Room[];
  addService: (hotelId: string, service: Service) => void;
  addFacility: (hotelId: string, facility: Facility) => void;
  addVisitingPlace: (hotelId: string, place: VisitingPlace) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

// Sample initial hotels
const initialHotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Plaza Hotel',
    description: 'Luxury hotel in the heart of the city with stunning views',
    location: 'Downtown City Center',
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
    rooms: [
      {
        id: 'r1',
        roomNumber: '101',
        type: 'deluxe',
        pricePerNight: 250,
        capacity: 2,
        isAvailable: true,
        amenities: ['Free WiFi', 'Mini Bar', 'King Bed', 'City View'],
        images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39'],
        bookedDates: []
      },
      {
        id: 'r2',
        roomNumber: '102',
        type: 'suite',
        pricePerNight: 450,
        capacity: 4,
        isAvailable: true,
        amenities: ['Free WiFi', 'Mini Bar', 'Living Room', 'Jacuzzi', 'Ocean View'],
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'],
        bookedDates: []
      }
    ],
    services: [
      {
        id: 's1',
        name: 'Spa Treatment',
        description: 'Full body massage and relaxation therapy',
        price: 120,
        isAvailable: true,
        icon: '💆'
      },
      {
        id: 's2',
        name: 'Room Service',
        description: '24/7 in-room dining service',
        price: 0,
        isAvailable: true,
        icon: '🍽️'
      }
    ],
    facilities: [
      {
        id: 'f1',
        name: 'Swimming Pool',
        description: 'Infinity pool with city views',
        isFree: true,
        operatingHours: '6 AM - 10 PM',
        icon: '🏊'
      },
      {
        id: 'f2',
        name: 'Fitness Center',
        description: 'Modern gym equipment',
        isFree: true,
        operatingHours: '24/7',
        icon: '💪'
      }
    ],
    visitingPlaces: [
      {
        id: 'v1',
        name: 'Central Park',
        description: 'Beautiful urban park',
        distance: '500m',
        estimatedTime: '5 min walk',
        rating: 4.7
      },
      {
        id: 'v2',
        name: 'City Museum',
        description: 'Historical museum',
        distance: '2km',
        estimatedTime: '10 min drive',
        entryFee: 15,
        rating: 4.5
      }
    ],
    contactNumber: '+1 234-567-8900',
    email: 'contact@grandplaza.com',
    checkInTime: '14:00',
    checkOutTime: '11:00'
  }
];

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const storedHotels = await AsyncStorage.getItem('hotels');
      if (storedHotels) {
        setHotels(JSON.parse(storedHotels));
      }
    } catch (error) {
      console.error('Error loading hotels:', error);
    }
  };

  const saveHotels = async (updatedHotels: Hotel[]) => {
    try {
      await AsyncStorage.setItem('hotels', JSON.stringify(updatedHotels));
      setHotels(updatedHotels);
    } catch (error) {
      console.error('Error saving hotels:', error);
    }
  };

  const addHotel = (hotel: Hotel) => {
    const updatedHotels = [...hotels, hotel];
    saveHotels(updatedHotels);
  };

  const updateHotel = (hotelId: string, updates: Partial<Hotel>) => {
    const updatedHotels = hotels.map(hotel =>
      hotel.id === hotelId ? { ...hotel, ...updates } : hotel
    );
    saveHotels(updatedHotels);
  };

  const deleteHotel = (hotelId: string) => {
    const updatedHotels = hotels.filter(hotel => hotel.id !== hotelId);
    saveHotels(updatedHotels);
  };

  const getHotelById = (hotelId: string) => {
    return hotels.find(hotel => hotel.id === hotelId);
  };

  const addRoom = (hotelId: string, room: Room) => {
    const updatedHotels = hotels.map(hotel =>
      hotel.id === hotelId
        ? { ...hotel, rooms: [...hotel.rooms, room] }
        : hotel
    );
    saveHotels(updatedHotels);
  };

  const updateRoom = (hotelId: string, roomId: string, updates: Partial<Room>) => {
    const updatedHotels = hotels.map(hotel =>
      hotel.id === hotelId
        ? {
            ...hotel,
            rooms: hotel.rooms.map((room: Room) =>
              room.id === roomId ? { ...room, ...updates } : room
            )
          }
        : hotel
    );
    saveHotels(updatedHotels);
  };

  const bookRoom = (hotelId: string, roomId: string, startDate: string, endDate: string, guestName: string): boolean => {
    let bookingSuccessful = false;
    
    const updatedHotels = hotels.map(hotel => {
      if (hotel.id === hotelId) {
        return {
          ...hotel,
          rooms: hotel.rooms.map((room: Room) => {
            if (room.id === roomId) {
              const isAvailable = !room.bookedDates?.some((booking: BookedDate) =>
                (startDate >= booking.startDate && startDate < booking.endDate) ||
                (endDate > booking.startDate && endDate <= booking.endDate) ||
                (startDate <= booking.startDate && endDate >= booking.endDate)
              );
              
              if (isAvailable) {
                bookingSuccessful = true;
                return {
                  ...room,
                  bookedDates: [
                    ...(room.bookedDates || []),
                    { startDate, endDate, guestName }
                  ]
                };
              }
            }
            return room;
          })
        };
      }
      return hotel;
    });
    
    if (bookingSuccessful) {
      saveHotels(updatedHotels);
    }
    return bookingSuccessful;
  };

  const getAvailableRooms = (hotelId: string, startDate: string, endDate: string): Room[] => {
    const hotel = getHotelById(hotelId);
    if (!hotel) return [];
    
    return hotel.rooms.filter((room: Room) => {
      return !room.bookedDates?.some((booking: BookedDate) =>
        (startDate >= booking.startDate && startDate < booking.endDate) ||
        (endDate > booking.startDate && endDate <= booking.endDate) ||
        (startDate <= booking.startDate && endDate >= booking.endDate)
      );
    });
  };

  const addService = (hotelId: string, service: Service) => {
    const updatedHotels = hotels.map(hotel =>
      hotel.id === hotelId
        ? { ...hotel, services: [...hotel.services, service] }
        : hotel
    );
    saveHotels(updatedHotels);
  };

  const addFacility = (hotelId: string, facility: Facility) => {
    const updatedHotels = hotels.map(hotel =>
      hotel.id === hotelId
        ? { ...hotel, facilities: [...hotel.facilities, facility] }
        : hotel
    );
    saveHotels(updatedHotels);
  };

  const addVisitingPlace = (hotelId: string, place: VisitingPlace) => {
    const updatedHotels = hotels.map(hotel =>
      hotel.id === hotelId
        ? { ...hotel, visitingPlaces: [...hotel.visitingPlaces, place] }
        : hotel
    );
    saveHotels(updatedHotels);
  };

  return (
    <HotelContext.Provider value={{
      hotels,
      addHotel,
      updateHotel,
      deleteHotel,
      getHotelById,
      addRoom,
      updateRoom,
      bookRoom,
      getAvailableRooms,
      addService,
      addFacility,
      addVisitingPlace
    }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotels = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotels must be used within a HotelProvider');
  }
  return context;
};