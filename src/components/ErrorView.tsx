import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

/**
 * Reusable Error View with Retry Trigger.
 * Provides a consistent way to handle failures with recovery options.
 */
export const ErrorView = ({ message, onRetry }: ErrorViewProps) => {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={64} color="#C62828" />
      <Text style={[styles.title, { color: themeColors.text }]}>Oops! Something went wrong</Text>
      <Text style={[styles.message, { color: themeColors.textSecondary }]}>{message}</Text>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#007AFF' }]} 
        onPress={onRetry}
      >
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: Spacing.three,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    marginTop: Spacing.one,
    textAlign: 'center',
    marginBottom: Spacing.four,
  },
  button: {
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.two,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
