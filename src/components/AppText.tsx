import React from 'react';
import { TextProps } from 'react-native';
import styled from 'styled-components/native';

interface AppTextProps extends TextProps {
  variant?: 'body' | 'caption' | 'subtitle' | 'title' | 'headline';
  color?: 'primary' | 'secondary' | 'error' | 'success';
  bold?: boolean;
  center?: boolean;
}

const StyledText = styled.Text<AppTextProps>`
  font-size: ${({ theme, variant = 'body' }) => {
    switch (variant) {
      case 'headline':
        return theme.fontSizes.xl;
      case 'title':
        return theme.fontSizes.lg;
      case 'subtitle':
        return theme.fontSizes.md;
      case 'caption':
        return theme.fontSizes.xs;
      case 'body':
      default:
        return theme.fontSizes.sm;
    }
  }}px;

  font-weight: ${({ theme, bold, variant }) => {
    if (bold) return theme.fontWeights.bold;
    if (variant === 'headline' || variant === 'title') return theme.fontWeights.bold;
    if (variant === 'subtitle') return theme.fontWeights.medium;
    return theme.fontWeights.regular;
  }};

  color: ${({ theme, color = 'primary' }) => {
    switch (color) {
      case 'secondary':
        return theme.colors.text_secondary;
      case 'error':
        return theme.colors.error;
      case 'success':
        return theme.colors.success;
      case 'primary':
      default:
        return theme.colors.text_primary;
    }
  }};

  text-align: ${({ center }) => (center ? 'center' : 'left')};
`;

export const AppText: React.FC<AppTextProps> = ({ children, ...props }) => {
  return <StyledText {...props}>{children}</StyledText>;
};
