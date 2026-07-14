import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HotelRegisterScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Personal Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: Hotel Info
  const [hotelName, setHotelName] = useState("");
  const [hotelAddress, setHotelAddress] = useState("");
  const [hotelCity, setHotelCity] = useState("");
  const [hotelCountry, setHotelCountry] = useState("");

  // Step 3: Verification
  const [taxId, setTaxId] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  // Step 4: Payment
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const validateStep1 = () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return false;
    }
    if (!password) {
      Alert.alert("Error", "Please enter a password");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!hotelName.trim()) {
      Alert.alert("Error", "Please enter hotel name");
      return false;
    }
    if (!hotelAddress.trim()) {
      Alert.alert("Error", "Please enter hotel address");
      return false;
    }
    if (!hotelCity.trim()) {
      Alert.alert("Error", "Please enter hotel city");
      return false;
    }
    if (!hotelCountry.trim()) {
      Alert.alert("Error", "Please enter hotel country");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!taxId.trim()) {
      Alert.alert("Error", "Please enter Tax ID");
      return false;
    }
    if (!licenseNumber.trim()) {
      Alert.alert("Error", "Please enter license number");
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (!cardNumber.trim() || cardNumber.length < 16) {
      Alert.alert("Error", "Please enter valid card number");
      return false;
    }
    if (!cardExpiry.trim()) {
      Alert.alert("Error", "Please enter card expiry date");
      return false;
    }
    if (!cardCvv.trim() || cardCvv.length < 3) {
      Alert.alert("Error", "Please enter valid CVV");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
    }

    if (isValid) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Success",
        "Hotel registered successfully!\nWe'll review your application and contact you soon.",
        [{ text: "OK", onPress: () => router.replace("/login") }],
      );
    }, 2000);
  };

  const handleBack = () => {
    router.back();
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicatorContainer}>
        {[1, 2, 3, 4].map((step) => (
          <View key={step} style={styles.stepWrapper}>
            <View
              style={[
                styles.stepCircle,
                currentStep >= step && styles.stepCircleActive,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  currentStep >= step && styles.stepNumberActive,
                ]}
              >
                {step}
              </Text>
            </View>
            {step < 4 && (
              <View
                style={[
                  styles.stepLine,
                  currentStep > step && styles.stepLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderStepTitle = () => {
    const titles: Record<number, string> = {
      1: "Personal Details",
      2: "Hotel Information",
      3: "Verification",
      4: "Payment Details",
    };
    return (
      <Text style={styles.stepTitle}>
        Step {currentStep} of 4: {titles[currentStep]}
      </Text>
    );
  };

  const renderStep1 = () => (
    <View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          Full Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor="#9CA3AF"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          Email Address <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="john@hotel.com"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          Phone Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="+1 (555) 000-0000"
          placeholderTextColor="#9CA3AF"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          Password <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="**********"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.eyeText}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          Confirm Password <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="**********"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Text style={styles.eyeText}>
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          Hotel Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Grand Hotel"
          placeholderTextColor="#9CA3AF"
          value={hotelName}
          onChangeText={setHotelName}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          Hotel Address <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="123 Main Street"
          placeholderTextColor="#9CA3AF"
          value={hotelAddress}
          onChangeText={setHotelAddress}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          City <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="New York"
          placeholderTextColor="#9CA3AF"
          value={hotelCity}
          onChangeText={setHotelCity}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          Country <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="United States"
          placeholderTextColor="#9CA3AF"
          value={hotelCountry}
          onChangeText={setHotelCountry}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          Tax ID / VAT Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="TAX-123456789"
          placeholderTextColor="#9CA3AF"
          value={taxId}
          onChangeText={setTaxId}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          Business License Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="LIC-987654321"
          placeholderTextColor="#9CA3AF"
          value={licenseNumber}
          onChangeText={setLicenseNumber}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          Bank Account Number <Text style={styles.optional}>(Optional)</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="US1234567890"
          placeholderTextColor="#9CA3AF"
          value={bankAccount}
          onChangeText={setBankAccount}
        />
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          Card Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor="#9CA3AF"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View style={styles.rowContainer}>
        <View style={[styles.inputWrapper, styles.halfWidth]}>
          <Text style={styles.label}>
            Expiry Date <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="MM/YY"
            placeholderTextColor="#9CA3AF"
            value={cardExpiry}
            onChangeText={setCardExpiry}
            maxLength={5}
          />
        </View>

        <View style={[styles.inputWrapper, styles.halfWidth]}>
          <Text style={styles.label}>
            CVV <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            placeholderTextColor="#9CA3AF"
            value={cardCvv}
            onChangeText={setCardCvv}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header with Back Button */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Register Your Hotel</Text>
          </View>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Step Title */}
          {renderStepTitle()}

          {/* Form Content */}
          <View style={styles.formContainer}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={[styles.button, styles.previousButton]}
                onPress={handlePrevious}
              >
                <Text style={styles.previousButtonText}>← Previous</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                styles.nextButton,
                currentStep === 1 && styles.fullWidthButton,
              ]}
              onPress={handleNext}
              disabled={isLoading}
            >
              {isLoading && currentStep === 4 ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.nextButtonText}>
                  {currentStep === 4 ? "Submit" : "Next →"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
  },
  backButton: {
    width: 60,
  },
  backButtonText: {
    fontSize: 16,
    color: "#004D4D",
    fontWeight: "600",
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#004D4D",
    textAlign: "center",
    marginRight: 60,
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  stepWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: {
    backgroundColor: "#004D4D",
    borderColor: "#004D4D",
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  stepNumberActive: {
    color: "#ffffff",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: "#004D4D",
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 24,
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  optional: {
    color: "#9CA3AF",
    fontWeight: "400",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1F2937",
    backgroundColor: "#F9FAFB",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1F2937",
  },
  eyeText: {
    paddingHorizontal: 12,
    fontSize: 18,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  previousButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#004D4D",
    shadowColor: "#004D4D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  fullWidthButton: {
    flex: 1,
  },
  previousButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButtonText: {
    color: "#F3E5AB",
    fontSize: 16,
    fontWeight: "600",
  },
});
