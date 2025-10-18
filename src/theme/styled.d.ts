import 'styled-components/native';
import { theme } from './theme';

// Infer the theme type from the theme object
type AppTheme = typeof theme;

// Extend the DefaultTheme to use our AppTheme
declare module 'styled-components/native' {
  export interface DefaultTheme extends AppTheme {}
}