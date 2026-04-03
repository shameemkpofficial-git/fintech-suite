# Sharing Fintech Suite 💎

Want to showcase the high-end security and aesthetics of the Fintech Suite? Here is a resource pack to help you share your project's features with the open-source community!

---

## 🚀 Social Media Spotlight

If you're posting on **Twitter (X)**, **LinkedIn**, or **Threads**, here are some curated templates!

### **Option 1: The "Security First" Developer**
> Just open-sourced the latest security update for **Fintech Suite**! 💎
>
> 🔒 Implemented a zero-latency `AppBlurGuard` for @Expo projects.
> ✨ Native `FLAG_SECURE` integration to mask sensitive data in the task switcher.
> 📱 Gaussian blurs on iOS + strict native security on Android.
> 
> Check it out on GitHub! 
> [link] #ReactNative #Expo #Fintech #OpenSource

### **Option 2: Aesthetic x Security**
> Security doesn't have to be ugly. ✨
>
> In **Fintech Suite**, we've integrated a premium glassmorphic privacy overlay that activates the second you leave the app.
>
> 🚀 Built with React Native Reanimated & Expo. 
> 🛡️ 100% privacy-compliant by masking the "Recent Apps" switcher.
> 
> [GIF/Image of App Switcher]
> [link] #UI #UX #MobileAppDev

---

## 🛠️ Standalone Snippet: `PrivacyGuard.tsx`
For those who just want to copy-paste this one specific feature into their own projects!

> [!NOTE]
> Ensure you have `expo-screen-capture` installed: `npx expo install expo-screen-capture`

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { AppState, View, StyleSheet, Animated, AppStateStatus, Platform } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';

/**
 * PrivacyGuard prevents sensitive data from being visible in the App Switcher.
 */
export const PrivacyGuard = ({ children }: { children: React.ReactNode }) => {
  ScreenCapture.usePreventScreenCapture();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      const isOut = next === 'inactive' || next === 'background';
      if (isOut) {
        setIsVisible(true);
        Animated.timing(fadeAnim, { toValue: 1, duration: Platform.OS === 'android' ? 0 : 200, useNativeDriver: true }).start();
      } else if (next === 'active') {
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setIsVisible(false));
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {children}
      <Animated.View 
        pointerEvents={isVisible ? 'auto' : 'none'}
        style={[styles.overlay, { opacity: fadeAnim }]}
      >
        <View style={styles.blurContainer} />
        {/* Add your logo or "Secure Session" text here */}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 99999, backgroundColor: '#000' },
  blurContainer: { ...StyleSheet.absoluteFillObject, opacity: 0.8 },
});
```

---

## 🎨 Branding Assets
-   **Icon**: `assets/images/icon.png` (High-res logo)
-   **Splash**: `assets/images/splash-icon.png` (Designed for prebuilds)
-   **Theme**: Use the tokens in `shared/constants/Theme.ts` for consistent colors.

Happy sharing! 💎
