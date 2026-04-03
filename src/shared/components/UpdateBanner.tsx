import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, Platform, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUpdates } from '../hooks/useUpdates';

/**
 * A notification banner that informs the user when a new update is available.
 * It provides progress and a restart button.
 */
export const UpdateBanner = () => {
  const { isDownloading, isUpdateDownloaded, applyUpdate } = useUpdates();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-200)).current;

  const isVisible = isDownloading || isUpdateDownloaded;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isVisible ? 0 : -200,
      useNativeDriver: true,
      tension: 20,
      friction: 7,
    }).start();
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Animated.View style={[
      styles.banner, 
      { 
        paddingTop: insets.top + (Platform.OS === 'ios' ? 10 : 20),
        transform: [{ translateY: slideAnim }],
        backgroundColor: isUpdateDownloaded ? '#34C759' : '#007AFF', // Green for success, Blue for downloading
      }
    ]}>
      <View style={styles.content}>
        {isDownloading ? (
          <>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.text}>Downloading update...</Text>
          </>
        ) : (
          <>
            <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
            <Text style={styles.text}>Update ready to apply!</Text>
            <TouchableOpacity style={styles.button} onPress={applyUpdate}>
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
