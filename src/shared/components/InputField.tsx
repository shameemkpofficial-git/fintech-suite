import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

/**
 * Standardized Input Component with Icon and Label.
 * Follows the FintechSuite design language.
 */
export const InputField = ({ label, icon, style, ...props }: InputFieldProps) => {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[colorScheme];

  return (
    <View style={styles.group}>
      <Text style={[styles.label, { color: themeColors.textSecondary }]}>{label}</Text>
      <View style={[styles.container, { backgroundColor: themeColors.backgroundElement }]}>
        {icon && <Ionicons name={icon} size={20} color={themeColors.textSecondary} style={styles.icon} />}
        <TextInput
          placeholderTextColor={themeColors.textSecondary}
          style={[styles.input, { color: themeColors.text }, style]}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  group: { 
    gap: Spacing.two, 
    marginBottom: Spacing.four,
    width: '100%',
  },
  label: { 
    fontSize: 13, 
    fontWeight: '600', 
    marginLeft: Spacing.one, 
    textTransform: 'uppercase', 
    letterSpacing: 0.5 
  },
  container: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    height: 64, 
    borderRadius: 16, 
    paddingHorizontal: Spacing.three 
  },
  icon: { 
    marginRight: Spacing.two 
  },
  input: { 
    flex: 1, 
    fontSize: 16, 
    height: '100%' 
  },
});
