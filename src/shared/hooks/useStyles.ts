import { useMemo } from 'react';
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useTheme, AppTheme } from './use-theme';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Custom hook to generate theme-aware and memoized React Native StyleSheets.
 * 
 * @param factory A function that receives the current theme and returns a style object.
 * @returns A memoized StyleSheet object.
 * 
 * @example
 * const styles = useStyles((theme) => ({
 *   container: {
 *     backgroundColor: theme.colors.background,
 *     padding: theme.spacing.three,
 *   },
 * }));
 */
export const useStyles = <T extends NamedStyles<T> | NamedStyles<any>>(
  factory: (theme: AppTheme) => T
) => {
  const theme = useTheme();

  // We memoize the stylesheet creation because it's an expensive operation
  // and we only want to re-run it when the theme changes (e.g. appearance toggle).
  return useMemo(() => {
    return StyleSheet.create(factory(theme));
  }, [factory, theme]);
};
