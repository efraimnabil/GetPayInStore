import React from 'react';
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import styled from 'styled-components/native';
import { AppText } from './AppText';

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const ButtonContainer = styled(TouchableOpacity)<{
  variant: 'primary' | 'secondary' | 'outline' | 'danger';
  size: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
}>`
  background-color: ${({ theme, variant, disabled }) => {
    if (disabled) return theme.colors.border;
    switch (variant) {
      case 'secondary':
        return theme.colors.primary_light;
      case 'outline':
        return 'transparent';
      case 'danger':
        return theme.colors.error;
      case 'primary':
      default:
        return theme.colors.primary;
    }
  }};
  
  border-width: ${({ variant }) => (variant === 'outline' ? '2px' : '0px')};
  border-color: ${({ theme, variant, disabled }) => {
    if (disabled) return theme.colors.border;
    return variant === 'outline' ? theme.colors.primary : 'transparent';
  }};
  
  border-radius: ${({ theme }) => theme.radii.md}px;
  
  padding: ${({ theme, size }) => {
    switch (size) {
      case 'small':
        return `${theme.spacing.sm}px ${theme.spacing.md}px`;
      case 'large':
        return `${theme.spacing.lg}px ${theme.spacing.xl}px`;
      case 'medium':
      default:
        return `${theme.spacing.md}px ${theme.spacing.lg}px`;
    }
  }};
  
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  onPress,
  ...props
}) => {
  const getTextColor = () => {
    if (disabled) return 'secondary';
    if (variant === 'outline' || variant === 'secondary') return 'primary';
    return undefined; // Will use default from AppText
  };

  return (
    <ButtonContainer
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      onPress={onPress}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading && (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'secondary' ? '#007AFF' : '#FFFFFF'}
        />
      )}
      <AppText
        bold
        style={{
          color:
            variant === 'outline' || variant === 'secondary'
              ? '#007AFF'
              : disabled
              ? '#8E8E93'
              : '#FFFFFF',
          fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
        }}
      >
        {title}
      </AppText>
    </ButtonContainer>
  );
};
