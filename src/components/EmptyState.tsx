import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  children?: React.ReactNode;
}

/**
 * Premium Empty State Component.
 * Provides consistent, high-quality feedback when no data is available.
 */
export const EmptyState = ({ icon, title, description, children }: EmptyStateProps) => {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: (themeColors as any).tint + '15' }]}>
        <Ionicons name={icon} size={48} color={(themeColors as any).tint} />
      </View>
      <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: themeColors.textSecondary }]}>{description}</Text>
      {children && <View style={styles.action}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.four,
  },
  iconContainer: {
    padding: Spacing.four,
    borderRadius: 30,
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.four,
  },
  action: {
    marginTop: Spacing.four,
    width: '100%',
    alignItems: 'center',
  },
});
