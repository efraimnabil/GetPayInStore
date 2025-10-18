const palette = {
  // Primary
  blue_500: '#007AFF',
  blue_400: '#3395FF',
  blue_100: '#E5F2FF',

  // Neutrals
  neutral_900: '#121212',
  neutral_800: '#2C2C2E',
  neutral_700: '#3A3A3C',
  neutral_500: '#8E8E93',
  neutral_300: '#C7C7CC',
  neutral_100: '#F2F2F7',
  neutral_0: '#FFFFFF',

  // Status
  red_500: '#FF3B30',
  green_500: '#34C759',
  yellow_500: '#FFCC00',
};

export const theme = {
  colors: {
    primary: palette.blue_500,
    primary_light: palette.blue_100,
    background: palette.neutral_100,
    surface: palette.neutral_0,
    text_primary: palette.neutral_900,
    text_secondary: palette.neutral_500,
    text_onPrimary: palette.neutral_0,
    border: palette.neutral_300,
    error: palette.red_500,
    success: palette.green_500,
    warning: palette.yellow_500,
    offline_banner: palette.neutral_700,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 16,
    pill: 9999,
  },
  shadows: {
    subtle: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    standard: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
  },
};

// Re-export the theme object for use in styled.d.ts
export type AppTheme = typeof theme;