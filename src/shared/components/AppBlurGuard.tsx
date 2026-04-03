import React, { useEffect, useRef, useState } from 'react';
import { AppState, View, StyleSheet, Animated, AppStateStatus, Platform } from 'react-native';
import { GlassView } from 'expo-glass-effect';
import * as ScreenCapture from 'expo-screen-capture';
import { useStyles } from '../hooks/useStyles';
import { ThemedText } from './themed-text';

/**
 * AppBlurGuard hides the app's content when it moves to the background or becomes inactive.
 * This is a standard security feature for Fintech apps to prevent sensitive data from
 * being visible in the app switcher.
 * 
 * NOTE: For Android, we keep the overlay always mounted with 0 opacity to ensure
 * it captured by the system snapshot immediately when the app moves to background.
 */
export const AppBlurGuard = ({ children }: { children: React.ReactNode }) => {
  // Use the official expo library to secure the screen on Android (FLAG_SECURE)
  // and iOS. This prevents screenshots and hides content in the task switcher.
  ScreenCapture.usePreventScreenCapture();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);
  
  const styles = useStyles((theme) => ({
    container: {
      flex: 1,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 99999,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    logoText: {
      fontSize: 24,
      fontWeight: 'bold',
      letterSpacing: 2,
      opacity: 0.8,
    }
  }));

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    const isBackgrounding = nextAppState === 'inactive' || nextAppState === 'background';
    
    if (isBackgrounding) {
      setIsVisible(true);
      // On Android, we need it to be instant to catch the snapshot
      const duration = Platform.OS === 'android' ? 0 : 200;
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    } else if (nextAppState === 'active') {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    }
  };

  return (
    <View style={styles.container}>
      {children}
      <Animated.View 
        pointerEvents={isVisible ? 'auto' : 'none'}
        style={[
          styles.overlay, 
          { 
            opacity: fadeAnim,
            // Prevent any visibility if not active to save resources, but keep in tree
            transform: [{ scale: isVisible ? 1 : 0.95 }] 
          }
        ]}
      >
        <GlassView style={StyleSheet.absoluteFillObject} glassEffectStyle="regular" />
        <ThemedText style={styles.logoText}>FINTECH SUITE</ThemedText>
        <ThemedText type="small" style={{ marginTop: 10 }}>Secure Session</ThemedText>
      </Animated.View>
    </View>
  );
};

