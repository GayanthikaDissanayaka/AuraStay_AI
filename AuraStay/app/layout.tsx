import { Stack } from 'expo-router';
import { HotelProvider } from '../context/HotelContext';

export default function Layout() {
  return (
    <HotelProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1e3c72',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="landing" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            title: 'Login' 
          }} 
        />
        <Stack.Screen 
          name="signup" 
          options={{ 
            title: 'Sign Up' 
          }} 
        />
        <Stack.Screen 
          name="home" 
          options={{ 
            title: 'Browse Hotels' 
          }} 
        />
        <Stack.Screen 
          name="hotel" 
          options={{ 
            title: 'Hotels' 
          }} 
        />
        <Stack.Screen 
          name="hotel/[id]" 
          options={{ 
            title: 'Hotel Details',
            headerShown: true
          }} 
        />
      </Stack>
    </HotelProvider>
  );
}