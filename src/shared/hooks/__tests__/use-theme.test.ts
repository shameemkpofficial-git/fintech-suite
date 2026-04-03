import { renderHook } from '@testing-library/react-native';
import { useTheme } from '../use-theme';
import { useColorScheme } from '../use-color-scheme';
import { Colors, Spacing, Fonts } from '../../constants/theme';

// Mock useColorScheme
jest.mock('../use-color-scheme', () => ({
  useColorScheme: jest.fn(),
}));

describe('useTheme', () => {
  const mockedUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;

  it('returns light theme when color scheme is light', () => {
    mockedUseColorScheme.mockReturnValue('light');
    const { result } = renderHook(() => useTheme());

    expect(result.current.colors).toEqual(Colors.light);
    expect(result.current.spacing).toEqual(Spacing);
    expect(result.current.fonts).toEqual(Fonts);
    expect(result.current.isDark).toBe(false);
  });

  it('returns dark theme when color scheme is dark', () => {
    mockedUseColorScheme.mockReturnValue('dark');
    const { result } = renderHook(() => useTheme());

    expect(result.current.colors).toEqual(Colors.dark);
    expect(result.current.isDark).toBe(true);
  });

  it('defaults to light theme when color scheme is null or undefined', () => {
    mockedUseColorScheme.mockReturnValue(null as any);
    const { result } = renderHook(() => useTheme());

    expect(result.current.colors).toEqual(Colors.light);
    expect(result.current.isDark).toBe(false);
  });
});
