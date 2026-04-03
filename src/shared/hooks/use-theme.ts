/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors, Spacing, Fonts } from '../constants/theme';
import { useColorScheme } from './use-color-scheme';

export type AppTheme = {
  colors: typeof Colors.light;
  spacing: typeof Spacing;
  fonts: typeof Fonts;
  isDark: boolean;
};

/**
 * Returns the current application theme, including colors, spacing, and fonts.
 * Reacts to light/dark mode changes automatically.
 */
export function useTheme(): AppTheme {
  const scheme = useColorScheme();
  const themeKey = scheme === 'dark' ? 'dark' : 'light';

  return {
    colors: Colors[themeKey],
    spacing: Spacing,
    fonts: Fonts,
    isDark: themeKey === 'dark',
  };
}
