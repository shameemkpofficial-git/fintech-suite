import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNetwork } from '../hooks/useNetwork';

/**
 * A notification banner that informs the user when the app is offline.
 * It's subtle and non-intrusive, appearing at the top of the screen.
 */
export const OfflineBanner = () => {
  const { isConnected } = useNetwork();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isConnected ? -100 : 0,
      useNativeDriver: true,
      tension: 20,
      friction: 7,
    }).start();
  }, [isConnected]);

  return (
    <Animated.View style={[
      styles.banner, 
      { 
        paddingTop: insets.top + (Platform.OS === 'ios' ? 10 : 20),
        transform: [{ translateY: slideAnim }]
      }
    ]}>
      <Ionicons name="cloud-offline-outline" size={18} color="#FFFFFF" />
      <Text style={styles.text}>You are currently offline. Viewing cached data.</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF3B30', // System red
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
    zIndex: 999,
    gap: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
