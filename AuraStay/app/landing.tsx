import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const [pressedCard, setPressedCard] = useState<string | null>(null);

  const handleGuestLogin = () => {
    router.push('/guest');
  };

  const handleBrowseHotels = () => {
    router.push('/browsehotel');
  };

  const handleAdminPanel = async () => {
    // Get the correct URL based on platform for Admin Panel
    let adminUrl: string;
    
    if (Platform.OS === 'android') {
      // For Android Emulator - use 10.0.2.2 for localhost
      adminUrl = 'http://10.0.2.2:4000/admin-panel.html';
    } else if (Platform.OS === 'ios') {
      // For iOS Simulator
      adminUrl = 'http://localhost:4000/admin-panel.html';
    } else {
      // For Web
      adminUrl = 'http://localhost:4000/admin-panel.html';
    }
    
    console.log('Opening admin panel at:', adminUrl);
    
    try {
      const supported = await Linking.canOpenURL(adminUrl);
      if (supported) {
        await Linking.openURL(adminUrl);
      } else {
        Alert.alert('Error', 'Cannot open the admin panel URL');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Connection Error',
        `Make sure the server is running:\n\nnpx serve . -p 4000\n\nThen try again.\n\nURL: ${adminUrl}`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop' }}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoSection}>
            <Text style={styles.logoIcon}>🏨</Text>
            <Text style={styles.mainTitle}>AuraStay AI</Text>
            <Text style={styles.tagline}>Contactless Hotel Experience</Text>
          </View>

          <View style={styles.cardsContainer}>
            {/* Browse Hotels */}
            <TouchableOpacity 
              style={[styles.featureCard, pressedCard === 'browse' && styles.featureCardPressed]}
              onPress={handleBrowseHotels}
              onPressIn={() => setPressedCard('browse')}
              onPressOut={() => setPressedCard(null)}
              activeOpacity={0.9}
            >
              <Text style={styles.cardIcon}>🔍</Text>
              <Text style={styles.cardTitle}>Browse Hotels</Text>
              <Text style={styles.cardDescription}>
                Explore our collection of luxury hotels and resorts
              </Text>
              <View style={[styles.cardBtn, styles.browseBtn]}>
                <Text style={styles.cardBtnText}>Explore Hotels</Text>
                <Text style={styles.btnArrow}>→</Text>
              </View>
            </TouchableOpacity>

            {/* Guest Login */}
            <TouchableOpacity 
              style={[styles.featureCard, pressedCard === 'guest' && styles.featureCardPressed]}
              onPress={handleGuestLogin}
              onPressIn={() => setPressedCard('guest')}
              onPressOut={() => setPressedCard(null)}
              activeOpacity={0.9}
            >
              <Text style={styles.cardIcon}>👤</Text>
              <Text style={styles.cardTitle}>Guest Login</Text>
              <Text style={styles.cardDescription}>
                Access your booking, request services, and manage your stay
              </Text>
              <View style={[styles.cardBtn, styles.guestBtn]}>
                <Text style={styles.cardBtnText}>Login as Guest</Text>
                <Text style={styles.btnArrow}>→</Text>
              </View>
            </TouchableOpacity>

            {/* Admin Panel */}
            <TouchableOpacity 
              style={[styles.featureCard, pressedCard === 'admin' && styles.featureCardPressed]}
              onPress={handleAdminPanel}
              onPressIn={() => setPressedCard('admin')}
              onPressOut={() => setPressedCard(null)}
              activeOpacity={0.9}
            >
              <Text style={styles.cardIcon}>👑</Text>
              <Text style={styles.cardTitle}>Admin Panel</Text>
              <Text style={styles.cardDescription}>
                Manage hotel operations, guests, and services
              </Text>
              <View style={[styles.cardBtn, styles.adminBtn]}>
                <Text style={styles.cardBtnText}>Access Admin Portal</Text>
                <Text style={styles.btnArrow}>→</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footerTagline}>
            <Text style={styles.footerText}>
              Experience the future of hospitality with AI-powered services
            </Text>
            <View style={styles.trustBadges}>
              <View style={styles.badge}><Text style={styles.badgeText}>✓ Secure Booking</Text></View>
              <View style={styles.badge}><Text style={styles.badgeText}>✓ 24/7 Support</Text></View>
              <View style={styles.badge}><Text style={styles.badgeText}>✓ Best Price Guarantee</Text></View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(30, 60, 114, 0.85)' },
  scrollContent: { flexGrow: 1, paddingVertical: 60, paddingHorizontal: 20, justifyContent: 'center', minHeight: height },
  logoSection: { alignItems: 'center', marginBottom: 60, marginTop: 40 },
  logoIcon: { fontSize: 80, marginBottom: 20 },
  mainTitle: { fontSize: 48, fontWeight: '700', color: '#ffffff', marginBottom: 10, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 5 },
  tagline: { fontSize: 18, color: 'rgba(255,255,255,0.9)', fontWeight: '300', letterSpacing: 1 },
  cardsContainer: { gap: 20, marginBottom: 60 },
  featureCard: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 40, elevation: 10 },
  featureCardPressed: { transform: [{ scale: 0.98 }], backgroundColor: '#ffffff' },
  cardIcon: { fontSize: 56, marginBottom: 20 },
  cardTitle: { fontSize: 24, fontWeight: '600', color: '#1e3c72', marginBottom: 15 },
  cardDescription: { fontSize: 14, color: '#666', lineHeight: 20, textAlign: 'center', marginBottom: 25 },
  cardBtn: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 40, alignItems: 'center', gap: 8 },
  guestBtn: { backgroundColor: '#667eea' },
  browseBtn: { backgroundColor: '#1e3c72' },
  adminBtn: { backgroundColor: '#f59e0b' },
  cardBtnText: { color: 'white', fontSize: 14, fontWeight: '600' },
  btnArrow: { color: 'white', fontSize: 16, marginLeft: 5 },
  footerTagline: { alignItems: 'center', marginBottom: 40 },
  footerText: { fontSize: 16, color: 'rgba(255,255,255,0.95)', fontStyle: 'italic', textAlign: 'center', marginBottom: 20 },
  trustBadges: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15 },
  badge: { backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20 },
  badgeText: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
});