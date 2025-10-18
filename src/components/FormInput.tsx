import React, { useState } from 'react';
import { TextInputProps, View } from 'react-native';
import styled from 'styled-components/native';
import { AppText } from './AppText';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const InputContainer = styled(View)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Label = styled(AppText)`
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const InputWrapper = styled(View)<{ isFocused: boolean; hasError: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme, isFocused, hasError }) => {
    if (hasError) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  }};
  border-radius: ${({ theme }) => theme.radii.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
`;

const StyledTextInput = styled.TextInput`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  color: ${({ theme }) => theme.colors.text_primary};
  padding: ${({ theme }) => theme.spacing.xs}px 0;
`;

const IconWrapper = styled(View)<{ position: 'left' | 'right' }>`
  margin-${({ position }) => position}: ${({ theme }) => theme.spacing.sm}px;
`;

const ErrorText = styled(AppText)`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <InputContainer>
      {label && (
        <Label variant="caption" bold>
          {label}
        </Label>
      )}
      <InputWrapper isFocused={isFocused} hasError={!!error}>
        {leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}
        <StyledTextInput
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="#8E8E93"
          {...props}
        />
        {rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
      </InputWrapper>
      {error && (
        <ErrorText variant="caption" color="error">
          {error}
        </ErrorText>
      )}
    </InputContainer>
  );
};
