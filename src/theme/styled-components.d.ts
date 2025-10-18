import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primary_light: string;
      background: string;
      surface: string;
      text_primary: string;
      text_secondary: string;
      text_onPrimary: string;
      border: string;
      error: string;
      success: string;
      warning: string;
      offline_banner: string;
    };
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    fontSizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    fontWeights: {
      regular: string;
      medium: string;
      bold: string;
    };
    radii: {
      sm: number;
      md: number;
      lg: number;
      pill: number;
    };
    shadows: {
      subtle: {
        shadowColor: string;
        shadowOffset: { width: number; height: number };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
      };
      standard: {
        shadowColor: string;
        shadowOffset: { width: number; height: number };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
      };
    };
  }
}
