# Fintech Suite 💎

A premium, modular, and security-hardened financial application built with **React Native & Expo**. Designed for high-end performance, resilience, and real-world fintech requirements.

[![Expo SDK](https://img.shields.io/badge/Expo-SDK_55-blue.svg)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Performance](https://img.shields.io/badge/Performance-Optimized-green.svg)](https://reactnative.dev)

## 🚀 Key Features

- 🏗️ **Plug-n-Play Architecture**: Feature-based modularity using Component & Module Registries.
- 🔒 **Military-Grade Security**: AES-256 local storage encryption and secure biometric authentication.
- 🌐 **Global Reach**: Full i18n support with persistence and automatic device language detection.
- 📶 **Resilient Data**: `useSafeRequest` hook with offline fallback, exponential backoff retries, and local caching.
- ✨ **Premium Aesthetics**: High-end glassmorphism, Reanimated-driven micro-interactions, and a custom theme-aware `useStyles` design system.
- 🛡️ **Privacy Guard**: Native `FLAG_SECURE` integration to mask sensitive data in the Android/iOS task switcher.

---

## 🔒 Security & Privacy Spotlight

### **AppBlurGuard**
A cross-platform drop-in component that secures your app's visibility in the background.
- ✨ **Zero-Latency Masking**: Always-mounted overlay for instant privacy.
- 🔐 **Native Protection**: Leverages `expo-screen-capture` to prevent unauthorized screenshots and task-switcher leaks.
- 🎨 **Gaussian Blur**: Implements a high-end blur effect for iOS while enforcing strict native security on Android.

---

## 🛠️ Technology Stack

- **Core**: React Native (Expo SDK 55), Expo Router
- **State**: Zustand (Persisted & Encrypted)
- **Styling**: Custom `useStyles` Hook (Stable & Memoized), Vanilla CSS
- **Security**: AES-256 (Crypto-JS), Expo SecureStore, Local Authentication
- **Internationalization**: i18next, react-i18next
- **Animations**: React Native Reanimated, Expo Symbols

---

## 📁 Project Structure

```text
├── app/                  # File-based routing (Expo Router)
├── src/
│   ├── features/         # Isolated feature modules (Auth, Wallet, Payments)
│   ├── shared/
│   │   ├── api/          # Provider abstraction & interceptors
│   │   ├── components/   # Registry-aware UI components
│   │   ├── hooks/        # Foundational hooks (useStyles, useSafeRequest)
│   │   ├── constants/    # Global Theme tokens (Colors, Spacing)
│   │   ├── i18n/         # Multi-language configuration
│   │   └── utils/        # Crypto, random values, and helpers
└── assets/               # Branding & visual assets
```

---

## 📦 Getting Started

### 🔌 Prerequisites
- Node.js & npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / iOS Simulator (for native features)

### 🛠️ Installation
1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Environment**:
   Set `EXPO_PUBLIC_ENCRYPTION_KEY` in your `.env` file for AES-256 operations.

3. **Prebuild & Start**:
   ```bash
   npx expo prebuild   # Generates native project files
   npm run android     # or npm run ios
   ```

---

## 📖 In-Depth Documentation

- 🗺️ **[Architecture Overview](file:///Users/shameem/Documents/FintechSuite/docs/ARCHITECTURE.md)**
- 🔐 **[Security & Resilience](file:///Users/shameem/Documents/FintechSuite/docs/SECURITY.md)**
- 🎨 **[Design System & Styling](file:///Users/shameem/Documents/FintechSuite/docs/STYLING.md)**

---

## 🤝 Contributing
Fintech Suite is designed to be easily extensible. Learn how to add new modules in our **[Architecture Guide](file:///Users/shameem/Documents/FintechSuite/docs/ARCHITECTURE.md)**.
