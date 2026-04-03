import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Animated, ViewStyle, TextStyle } from 'react-native';

import { componentRegistry } from './ComponentRegistry';
import { useStyles } from '../hooks/useStyles';

interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'clear';
}

/**
 * Base Button Implementation optimized with useStyles.
 */
export const BaseButton = ({ onPress, title, style, textStyle, disabled = false, loading = false, variant = 'primary' }: ButtonProps) => {
  const styles = useStyles((theme) => ({
    button: {
      backgroundColor: theme.colors.tint,
      paddingVertical: theme.spacing.medium,
      paddingHorizontal: theme.spacing.four,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.tint,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.isDark ? 0.4 : 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.tint,
      shadowOpacity: 0,
      elevation: 0,
    },
    clear: {
      backgroundColor: 'transparent',
      shadowOpacity: 0,
      elevation: 0,
    },
    disabled: {
      backgroundColor: theme.isDark ? '#3A3A3C' : '#D1D1D6',
      borderColor: theme.isDark ? '#3A3A3C' : '#D1D1D6',
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
    textOutline: {
      color: theme.colors.tint,
    },
    textClear: {
      color: theme.colors.tint,
    },
  }));

  const scaleAnim = React.useRef(new Animated.Value(1)).current;

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
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          variant === 'outline' && styles.outline,
          variant === 'clear' && styles.clear,
          disabled && styles.disabled,
          loading && styles.loading,
          { width: '100%' } // Fill the wrapper's width (layout handled by style prop on wrapper)
        ]}
        disabled={disabled || loading}
        activeOpacity={1}
        testID="base-button"
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator 
            color={variant === 'primary' ? '#FFFFFF' : styles.textOutline.color} 
            size="small" 
          />
        ) : (
          <Text 
            numberOfLines={1} 
            ellipsizeMode="tail"
            style={[
              styles.text,
              variant === 'outline' && styles.textOutline,
              variant === 'clear' && styles.textClear,
              textStyle
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

/**
 * Registry-aware Button Component.
 * Can be overridden globally via componentRegistry.register({ Button: MyCustomButton })
 */
export const Button = (props: ButtonProps) => {
  const RegisteredButton = componentRegistry.resolve('Button') || BaseButton;
  return <RegisteredButton {...props} />;
};

// Auto-register the default implementation if nothing is registered yet
if (!componentRegistry.has('Button')) {
  componentRegistry.register({ Button: BaseButton });
}
