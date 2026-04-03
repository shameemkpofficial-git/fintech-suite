import { type TextProps, Text } from 'react-native';

import { ThemeColor } from '../constants/theme';
import { useStyles } from '../hooks/useStyles';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

/**
 * A themed text component that uses the useStyles hook to stay reactive to theme changes.
 * Supports various typography styles and theme colors.
 */
export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const styles = useStyles((theme) => ({
    text: {
      color: theme.colors[themeColor ?? 'text'],
    },
    small: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
    },
    smallBold: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '700',
    },
    default: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
    },
    title: {
      fontSize: 48,
      fontWeight: '600',
      lineHeight: 52,
    },
    subtitle: {
      fontSize: 32,
      lineHeight: 44,
      fontWeight: '600',
    },
    link: {
      lineHeight: 30,
      fontSize: 14,
    },
    linkPrimary: {
      lineHeight: 30,
      fontSize: 14,
      color: theme.colors.tint,
    },
    code: {
      fontFamily: theme.fonts.mono,
      fontWeight: '500',
      fontSize: 12,
    },
  }));

  return (
    <Text
      style={[
        styles.text,
        styles[type],
        style,
      ]}
      {...rest}
    />
  );
}

