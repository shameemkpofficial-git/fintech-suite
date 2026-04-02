import React, { ReactNode } from 'react';
import { StyleSheet, ViewStyle, ScrollView, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassView } from 'expo-glass-effect';

const { width } = Dimensions.get('window');

interface ScreenWrapperProps {
  children: ReactNode;
  style?: ViewStyle;
  withScroll?: boolean;
  withGlassEffect?: boolean;
}

export const ScreenWrapper = ({ children, style, withScroll = false, withGlassEffect = false }: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    { paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left + 12, paddingRight: insets.right + 12 },
    style,
  ];

  if (withScroll) {
    return (
      <ScrollView contentContainerStyle={containerStyle}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // Standard iOS light gray
  },
});
