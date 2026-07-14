import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../firebase/firebase";

export default function LoginScreen() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      // Check if input is email
      const isEmail = emailOrPhone.includes("@");
      
      if (!isEmail) {
        Alert.alert("Error", "Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, emailOrPhone, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        Alert.alert("Login Successful", `Welcome back, ${userData.fullName || "Guest"}!`);
      } else {
        Alert.alert("Login Successful", "Welcome back!");
      }
      
      // Navigate to home screen for ALL users (including admins)
      router.replace("/home");
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific Firebase errors with user-friendly messages
      switch (error.code) {
        case "auth/user-not-found":
          Alert.alert("Login Failed", "No account found with this email. Please sign up first.");
          break;
        case "auth/wrong-password":
          Alert.alert("Login Failed", "Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          Alert.alert("Login Failed", "Invalid email format. Please enter a valid email.");
          break;
        case "auth/too-many-requests":
          Alert.alert("Login Failed", "Too many failed attempts. Please try again later.");
          break;
        case "auth/user-disabled":
          Alert.alert("Login Failed", "This account has been disabled. Please contact support.");
          break;
        default:
          Alert.alert("Login Failed", "Invalid credentials. Please check your email and password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Google authentication coming soon!");
  };

  const handleGuestLogin = () => {
    Alert.alert("Guest Mode", "Continue as guest");
    router.replace("/home");
  };

  const handleQRCode = () => {
    Alert.alert("QR Code", "Scan QR to access room");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.logo}>AuraStay AI</Text>
          <Text style={styles.welcomeText}>Welcome back, Guest</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#F3E5AB" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or Login With</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Login Options */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestLogin}
            disabled={loading}
          >
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>

        {/* QR Code Section */}
        <TouchableOpacity style={styles.qrContainer} onPress={handleQRCode} disabled={loading}>
          <Text style={styles.qrText}>Scan QR to Access Room</Text>
          <Text style={styles.qrIcon}>📱</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUp} disabled={loading}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 40,
    backgroundColor: "#FDFDFD",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    fontSize: 36,
    fontWeight: "800",
    color: "#004D4D",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  welcomeText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  formContainer: {
    width: "100%",
    marginBottom: 32,
  },
  input: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#1F2937",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#004D4D",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#004D4D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonText: {
    color: "#F3E5AB",
    fontWeight: "bold",
    fontSize: 18,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
  },
  socialContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  socialButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  guestButton: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  guestButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  qrContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
  },
  qrText: {
    color: "#004D4D",
    fontSize: 16,
    fontWeight: "600",
  },
  qrIcon: {
    fontSize: 20,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "#6B7280",
    fontSize: 14,
  },
  signUpText: {
    color: "#004D4D",
    fontSize: 14,
    fontWeight: "bold",
  },
});