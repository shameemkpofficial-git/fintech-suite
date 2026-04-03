import { renderHook } from '@testing-library/react-native';
import { useStyles } from '../useStyles';
import { useTheme } from '../use-theme';

// Mock useTheme to control the theme values in tests
jest.mock('../use-theme', () => ({
  useTheme: jest.fn(),
}));

describe('useStyles', () => {
  const mockTheme = {
    colors: {
      background: '#ffffff',
      text: '#000000',
    },
    spacing: {
      medium: 12,
    },
    isDark: false,
  };

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue(mockTheme);
  });

  it('generates a React Native StyleSheet from a factory function', () => {
    const factory = (theme: any) => ({
      container: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.medium,
      },
    });

    const { result } = renderHook(() => useStyles(factory));

    expect(result.current.container).toBeDefined();
    expect(result.current.container.backgroundColor).toBe('#ffffff');
    expect(result.current.container.padding).toBe(12);
  });

  it('reacts to theme changes', () => {
    const factory = (theme: any) => ({
      container: {
        backgroundColor: theme.colors.background,
      },
    });

    const { result, rerender } = renderHook(() => useStyles(factory));

    expect(result.current.container.backgroundColor).toBe('#ffffff');

    // Change theme to dark mode
    (useTheme as jest.Mock).mockReturnValue({
      ...mockTheme,
      colors: { ...mockTheme.colors, background: '#000000' },
      isDark: true,
    });

    rerender({});

    expect(result.current.container.backgroundColor).toBe('#000000');
  });

  it('memoizes the StyleSheet and only re-calculates when factory or theme changes', () => {
    const factory = (theme: any) => ({
      container: { backgroundColor: theme.colors.background },
    });

    const { result, rerender } = renderHook<any, { factoryFn: any }>(
      ({ factoryFn }) => useStyles(factoryFn),
      { initialProps: { factoryFn: factory } }
    );

    const firstStyles = result.current;

    // Rerender with same factory and same theme
    rerender({ factoryFn: factory });
    expect(result.current).toBe(firstStyles); // Same instance

    // Rerender with different factory
    const newFactory = (theme: any) => ({
      box: { backgroundColor: theme.colors.background },
    });
    rerender({ factoryFn: newFactory });
    expect(result.current).not.toBe(firstStyles); // New instance
  });
});
