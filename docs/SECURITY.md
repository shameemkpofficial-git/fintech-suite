# Security Documentation - Fintech Suite 🔐

The Fintech Suite implements a defense-in-depth security model to protect sensitive user financial data.

## 🔑 Data Protection

### AES-256 Local Encryption
All sensitive data persisted to the device (e.g., wallet balance, transaction history, auth tokens) is encrypted before storage.

- **Utility**: `src/shared/utils/crypto.ts`
- **Method**: AES-256-CBC (via `crypto-js`)
- **Key Storage**: The primary encryption key is stored in the **App Environment** (`EXPO_PUBLIC_ENCRYPTION_KEY`). This ensures that even if local storage is compromised, the payload remains undecipherable.
- **Polyfill**: We use `react-native-get-random-values` for secure cryptographic seed generation in the React Native environment.

### Secure Store Persistence
For high-sensitivity items like JWT tokens and private keys, we use **Expo SecureStore**, which utilizes the **iOS Keychain** and **Android Keystore** for hardware-level protection.

---

## 🤳 Identity & Access

### Biometric Authentication
We integrate with `expo-local-authentication` to support **FaceID** and **Fingerprint** login natively.

- **Automatic Detection**: The app identifies if biometric hardware is present and if the user has enrolled.
- **Fallbac Mechanism**: Users can always fallback to traditional login if biometric hardware fails.

### App Background Protection (`AppBlurGuard`)
When the application is moved to the background, a **Gaussian Blur Overlay** is automatically applied to hide sensitive balance information from the App Switcher.

---

## 🛰️ Network Security

### Auth Interceptors
The `useFintech` hook uses a **Proxy Interceptor** to monitor all API responses. 

- **Auto-Logout**: If any request returns a `401 Unauthorized` or `403 Forbidden` status, the app automatically triggers a `logout()` and redirects the user to the login screen, effectively killing the session.
- **Zero Hardcoding**: All API endpoints and secrets are managed via `global-config.json` and environmental variables.

---

## 🛡️ Best Practices
1. **Never Hardcode Keys**: Ensure `EXPO_PUBLIC_ENCRYPTION_KEY` is unique for each environment.
2. **Minify Native Code**: Use `npx expo prebuild` with production flags to obfuscate native logic.
3. **Audit Caches**: Regularly call `clearCache()` on the `useFintechStore` during logout to purge all local encrypted data.
