const palette = {
  // Primary - Enhanced with gradients
  blue_600: '#0056D2',
  blue_500: '#007AFF',
  blue_400: '#3395FF',
  blue_300: '#66B3FF',
  blue_100: '#E5F2FF',

  // Purple accent
  purple_600: '#7C3AED',
  purple_500: '#9333EA',
  purple_400: '#A855F7',

  // Teal accent
  teal_600: '#0891B2',
  teal_500: '#14B8A6',
  teal_400: '#2DD4BF',

  // Neutrals - Light mode
  neutral_900: '#121212',
  neutral_800: '#2C2C2E',
  neutral_700: '#3A3A3C',
  neutral_600: '#48484A',
  neutral_500: '#8E8E93',
  neutral_300: '#C7C7CC',
  neutral_200: '#D1D1D6',
  neutral_100: '#F2F2F7',
  neutral_50: '#F9F9F9',
  neutral_0: '#FFFFFF',

  // Dark mode
  dark_900: '#000000',
  dark_800: '#0A0A0A',
  dark_700: '#1C1C1E',
  dark_600: '#2C2C2E',
  dark_500: '#3A3A3C',
  dark_400: '#48484A',

  // Status
  red_500: '#FF3B30',
  red_400: '#FF6259',
  green_500: '#34C759',
  green_400: '#5DD97C',
  yellow_500: '#FFCC00',
  yellow_400: '#FFD633',
};

export const lightTheme = {
  colors: {
    primary: palette.blue_500,
    primary_light: palette.blue_100,
    primary_dark: palette.blue_600,
    secondary: palette.purple_500,
    accent: palette.teal_500,
    
    // Gradients
    gradient_primary: [palette.blue_500, palette.purple_500],
    gradient_secondary: [palette.teal_400, palette.blue_400],
    gradient_accent: [palette.purple_400, palette.blue_300],
    gradient_dark: [palette.neutral_700, palette.neutral_900],
    
    background: palette.neutral_50,
    background_secondary: palette.neutral_100,
    surface: palette.neutral_0,
    surface_elevated: palette.neutral_0,
    
    text_primary: palette.neutral_900,
    text_secondary: palette.neutral_500,
    text_onPrimary: palette.neutral_0,
    text_onDark: palette.neutral_0,
    
    border: palette.neutral_200,
    border_light: palette.neutral_100,
    
    error: palette.red_500,
    success: palette.green_500,
    warning: palette.yellow_500,
    offline_banner: palette.neutral_700,
    
    card_shadow: 'rgba(0, 0, 0, 0.08)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 9999,
  },
  shadows: {
    subtle: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    standard: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    elevated: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const darkTheme: typeof lightTheme = {
  colors: {
    primary: palette.blue_400,
    primary_light: palette.blue_600,
    primary_dark: palette.blue_300,
    secondary: palette.purple_400,
    accent: palette.teal_400,
    
    // Gradients
    gradient_primary: [palette.blue_400, palette.purple_400],
    gradient_secondary: [palette.teal_500, palette.blue_500],
    gradient_accent: [palette.purple_500, palette.blue_400],
    gradient_dark: [palette.dark_700, palette.dark_900],
    
    background: palette.dark_900,
    background_secondary: palette.dark_800,
    surface: palette.dark_700,
    surface_elevated: palette.dark_600,
    
    text_primary: palette.neutral_0,
    text_secondary: palette.neutral_300,
    text_onPrimary: palette.neutral_900,
    text_onDark: palette.neutral_0,
    
    border: palette.dark_500,
    border_light: palette.dark_600,
    
    error: palette.red_400,
    success: palette.green_400,
    warning: palette.yellow_400,
    offline_banner: palette.neutral_300,
    
    card_shadow: 'rgba(0, 0, 0, 0.3)',
  },
  spacing: lightTheme.spacing,
  fontSizes: lightTheme.fontSizes,
  fontWeights: lightTheme.fontWeights,
  radii: lightTheme.radii,
  shadows: {
    subtle: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    standard: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    elevated: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

// Default theme (light)
export const theme = lightTheme;

// Re-export the theme object for use in styled.d.ts
export type AppTheme = typeof lightTheme;