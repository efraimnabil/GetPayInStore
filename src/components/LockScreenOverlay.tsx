import { setLocked } from '@/store/slices/lockSlice';
import { RootState } from '@/store/store';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// Dynamically import to prevent crash if module not found
let LocalAuthentication: any = null;
try {
  LocalAuthentication = require('expo-local-authentication');
} catch (error) {
  console.warn('expo-local-authentication not available. Please run: npx expo prebuild');
}

// You can customize this or move to environment variables
const FALLBACK_PASSWORD = '1234'; // Simple fallback for demo

export function LockScreenOverlay() {
  const dispatch = useDispatch();
  const isLocked = useSelector((state: RootState) => state.lock.isLocked);
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);

  // Check biometric availability
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    // If module not loaded, skip biometric check
    if (!LocalAuthentication) {
      console.warn('LocalAuthentication module not available');
      return;
    }
    
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (hasHardware && isEnrolled) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Fingerprint');
        } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
          setBiometricType('Iris');
        } else {
          setBiometricType('Biometric');
        }
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  // Auto-trigger biometric auth when lock screen appears
  useEffect(() => {
    if (isLocked && biometricType) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        handleBiometricAuth();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isLocked, biometricType]);

  const handleBiometricAuth = async () => {
    // If module not loaded, show error
    if (!LocalAuthentication) {
      Alert.alert(
        'Biometric Not Available',
        'Please run "npx expo prebuild" to enable biometric authentication.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    try {
      setIsAuthenticating(true);
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock GetPayInStore',
        fallbackLabel: 'Use Password',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        dispatch(setLocked(false));
        setPassword(''); // Clear password field
      } else {
        // User cancelled or failed
        if (result.error === 'user_cancel') {
          // User cancelled, they can try password instead
          console.log('User cancelled biometric auth');
        } else {
          Alert.alert('Authentication Failed', 'Please try again or use password');
        }
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      Alert.alert('Error', 'Could not authenticate. Please use password.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handlePasswordUnlock = () => {
    if (password === FALLBACK_PASSWORD) {
      dispatch(setLocked(false));
      setPassword('');
    } else {
      Alert.alert('Incorrect Password', 'Please try again');
      setPassword('');
    }
  };

  // Don't show lock screen if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <Modal
      visible={isLocked}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="lock" size={60} color="#007AFF" />
          <Text style={styles.title}>App Locked</Text>
          <Text style={styles.subtitle}>
            {user.firstName ? `Welcome back, ${user.firstName}` : 'Welcome back'}
          </Text>
        </View>

        {/* Biometric Authentication Button */}
        {biometricType && (
          <TouchableOpacity
            style={styles.biometricButton}
            onPress={handleBiometricAuth}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <MaterialIcons 
                  name={biometricType === 'Face ID' ? 'face' : 'fingerprint'} 
                  size={24} 
                  color="#FFF" 
                />
                <Text style={styles.biometricButtonText}>
                  Unlock with {biometricType}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Divider */}
        {biometricType && (
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>
        )}

        {/* Password Input */}
        <View style={styles.passwordContainer}>
          <Text style={styles.label}>Enter Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handlePasswordUnlock}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.unlockButton}
            onPress={handlePasswordUnlock}
          >
            <Text style={styles.unlockButtonText}>Unlock</Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <Text style={styles.helpText}>
          For demo: password is "1234"
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 20,
    minWidth: 250,
    gap: 12,
  },
  biometricButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  passwordContainer: {
    width: '100%',
    maxWidth: 350,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
  },
  unlockButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  unlockButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    marginTop: 30,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});