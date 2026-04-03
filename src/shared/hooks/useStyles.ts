import { useMemo, useRef, useEffect } from 'react';
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useTheme, AppTheme } from './use-theme';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Custom hook to generate theme-aware and memoized React Native StyleSheets.
 */
export const useStyles = <T extends NamedStyles<T> | NamedStyles<any>>(
  factory: (theme: AppTheme) => T
) => {
  const theme = useTheme();
  
  // Track the factory function in a ref so we can call the latest version 
  // without triggering useMemo re-runs.
  const factoryRef = useRef(factory);
  
  useEffect(() => {
    factoryRef.current = factory;
  }, [factory]);

  // We only want to recreate the StyleSheet when the theme changes (e.g. Dark Mode toggle).
  return useMemo(() => {
    return StyleSheet.create(factoryRef.current(theme));
  }, [theme]);
};
