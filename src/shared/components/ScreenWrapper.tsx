import React, { ReactNode } from 'react';
import { ViewStyle, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassView } from 'expo-glass-effect';
import { useStyles } from '../hooks/useStyles';

interface ScreenWrapperProps {
  children: ReactNode;
  style?: ViewStyle;
  withScroll?: boolean;
  withGlassEffect?: boolean;
  refreshControl?: any;
}

/**
 * A layout wrapper that handles safe area insets and theme-aware backgrounds.
 * Uses the useStyles hook to ensure consistency across the app.
 */
export const ScreenWrapper = ({ children, style, withScroll = false, withGlassEffect = false, refreshControl }: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles((theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left + theme.spacing.medium,
      paddingRight: insets.right + theme.spacing.medium,
    },
  }));

  const containerStyle = [
    styles.container,
    style,
  ];

  if (withScroll) {
    return (
      <ScrollView 
        contentContainerStyle={containerStyle} 
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  if (withGlassEffect) {
    return (
      <GlassView style={containerStyle} glassEffectStyle="regular">
        {children}
      </GlassView>
    );
  }

  return (
    <Animated.View style={containerStyle}>
      {children}
    </Animated.View>
  );
};

