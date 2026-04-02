import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, Animated } from 'react-native';

import { componentRegistry } from './ComponentRegistry';

interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Base Button Implementation.
 */
export const BaseButton = ({ onPress, title, style, textStyle, disabled = false, loading = false }: ButtonProps) => {

  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button, 
          disabled && styles.disabled, 
          loading && styles.loading,
          style
        ]}
        disabled={disabled || loading}
        activeOpacity={1} // Handled by scale animation
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={[styles.text, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabled: {
    backgroundColor: '#D1D1D6',
    shadowOpacity: 0,
    elevation: 0,
  },
  loading: {
    opacity: 0.8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

/**
 * Registry-aware Button Component.
 * Can be overridden globally via componentRegistry.register({ Button: MyCustomButton })
 */
export const Button = (props: ButtonProps) => {
  const RegisteredButton = componentRegistry.resolve('Button') || BaseButton;
  return <RegisteredButton {...props} />;
};

// Auto-register the default implementation if not already set
if (!componentRegistry.resolve('Button')) {
  componentRegistry.register({ Button: BaseButton });
}


