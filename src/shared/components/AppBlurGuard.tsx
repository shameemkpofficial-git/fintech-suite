import React, { useEffect, useState, useRef } from 'react';
import { AppState, View, StyleSheet, Animated, AppStateStatus } from 'react-native';
import { GlassView } from 'expo-glass-effect';
import { useStyles } from '../hooks/useStyles';
import { ThemedText } from './themed-text';

/**
 * AppBlurGuard hides the app's content when it moves to the background or becomes inactive.
 * This is a standard security feature for Fintech apps to prevent sensitive data from
 * being visible in the app switcher.
 */
export const AppBlurGuard = ({ children }: { children: React.ReactNode }) => {
  const [shouldBlur, setShouldBlur] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
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
    // Blur when moving away from 'active'
    if (nextAppState === 'inactive' || nextAppState === 'background') {
      setShouldBlur(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (nextAppState === 'active') {
      // Unblur when returning to 'active'
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShouldBlur(false));
    }
  };

  return (
    <View style={styles.container}>
      {children}
      {shouldBlur && (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <GlassView style={StyleSheet.absoluteFillObject} glassEffectStyle="regular" />
          <ThemedText style={styles.logoText}>FINTECH SUITE</ThemedText>
          <ThemedText type="small" style={{ marginTop: 10 }}>Secure Session</ThemedText>
        </Animated.View>
      )}
    </View>
  );
};
