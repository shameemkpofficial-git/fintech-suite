import { useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

/**
 * Custom hook for biometric authentication (FaceID, TouchID, Iris, Fingerprint).
 */
export const useBiometrics = () => {
  const [isCompatible, setIsCompatible] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [authType, setAuthType] = useState<LocalAuthentication.AuthenticationType[]>([]);

  useEffect(() => {
    checkDeviceSupport();
  }, []);

  const checkDeviceSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    setIsCompatible(compatible);
    setIsEnrolled(enrolled);
    setAuthType(types);
  };

  /**
   * Triggers the biometric authentication prompt.
   * @param reason The message to display in the system prompt.
   * @returns boolean indicating success or failure.
   */
  const authenticate = useCallback(async (reason: string = 'Confirm your identity') => {
    if (!isCompatible || !isEnrolled) {
      Alert.alert('Error', 'Biometric authentication is not available or not set up on this device.');
      return false;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        return true;
      } else {
        if (result.error !== 'user_cancel' && result.error !== 'app_cancel') {
          Alert.alert('Authentication Failed', `Error: ${result.error}`);
        }
        return false;
      }
    } catch (error) {
      console.error('Biometric Auth Error:', error);
      Alert.alert('Error', 'An unexpected error occurred during biometric authentication.');
      return false;
    }
  }, [isCompatible, isEnrolled]);

  return {
    isCompatible,
    isEnrolled,
    authType,
    authenticate,
    checkDeviceSupport,
  };
};
