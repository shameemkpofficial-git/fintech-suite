import React, { useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, ViewStyle } from 'react-native';
import { GlassView } from 'expo-glass-effect';
import { useStyles } from '../hooks/useStyles';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'glass' | 'elevated' | 'outline';
  delay?: number;
}

/**
 * A premium, animated card component that supports multiple visual variants.
 * Features a soft scale animation on press and a fade-in entry animation.
 */
export const AnimatedCard = ({ 
  children, 
  onPress, 
  style, 
  variant = 'elevated',
  delay = 0 
}: AnimatedCardProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const styles = useStyles((theme) => ({
    card: {
      borderRadius: 24,
      padding: theme.spacing.three,
      backgroundColor: theme.colors.backgroundElement,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 12,
      elevation: 6,
      overflow: 'hidden',
    },
    glass: {
      backgroundColor: theme.colors.glass,
      borderWidth: 1,
      borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.backgroundSelected,
      shadowOpacity: 0,
      elevation: 0,
    },
  }));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  const handlePressIn = () => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }, style]}>
      <CardWrapper
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          variant === 'glass' && styles.glass,
          variant === 'outline' && styles.outline,
        ]}
      >
        {variant === 'glass' && (
          <GlassView style={StyleSheet.absoluteFillObject} glassEffectStyle="regular" />
        )}
        {children}
      </CardWrapper>
    </Animated.View>
  );
};
