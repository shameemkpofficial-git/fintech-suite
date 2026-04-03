import '@/global.css';

import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import APP_CONFIG from '../../global-config.json';

/**
 * Deep merge utility for theme objects.
 */
const deepMerge = (target: any, source: any) => {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
};


export const Colors = {
  light: {
    text: '#000000',
    background: APP_CONFIG.theme.backgroundLight,
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    tint: APP_CONFIG.theme.primaryLight,
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FFCC00',
    glass: 'rgba(255, 255, 255, 0.7)',
  },
  dark: {
    text: '#ffffff',
    background: APP_CONFIG.theme.backgroundDark,
    backgroundElement: '#1C1C1E',
    backgroundSelected: '#2C2C2E',
    textSecondary: '#8E8E93',
    tint: APP_CONFIG.theme.primaryDark,
    success: '#32D74B',
    danger: '#FF453A',
    warning: '#FFD60A',
    glass: 'rgba(0, 0, 0, 0.5)',
  },
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  medium: 12,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
};

/**
 * Update the global theme with custom overrides.
 */
export const updateTheme = (overrides: { Colors?: Partial<typeof Colors>, Spacing?: Partial<typeof Spacing> }) => {
  if (overrides.Colors) deepMerge(Colors, overrides.Colors);
  if (overrides.Spacing) deepMerge(Spacing, overrides.Spacing);
};

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

