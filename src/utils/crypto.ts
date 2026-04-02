import CryptoJS from 'crypto-js';

// Access the encryption key from environment variables.
// Note: EXPO_PUBLIC_ prefix makes it accessible at runtime in Expo.
const ENCRYPTION_KEY = process.env.EXPO_PUBLIC_ENCRYPTION_KEY || 'default_fallback_key';

/**
 * Encrypts a string using AES-256.
 * Implements an application-level layer of security.
 */
export const encryptData = (data: string): string => {
  try {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption Failed:', error);
    return data; // Fallback to raw data for now (handle with care)
  }
};

/**
 * Decrypts an AES-256 encrypted string.
 * Uses the global application key for reversal.
 */
export const decryptData = (cipherText: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || cipherText; // Return original if decryption fails
  } catch (error) {
    console.error('Decryption Failed:', error);
    return cipherText;
  }
};
