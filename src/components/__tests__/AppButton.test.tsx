import { theme } from '@/theme/theme';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { AppButton } from '../AppButton';

// Helper to render with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('AppButton', () => {
  it('should render button with text', () => {
    renderWithTheme(<AppButton title="Click Me" />);
    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    renderWithTheme(<AppButton title="Click Me" onPress={onPressMock} />);

    const button = screen.getByText('Click Me');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    renderWithTheme(<AppButton title="Click Me" onPress={onPressMock} disabled />);

    const button = screen.getByText('Click Me');
    fireEvent.press(button);

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should show loading state', () => {
    renderWithTheme(<AppButton title="Click Me" isLoading />);
    // When loading, both text and loading indicator should be visible
    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('should be disabled when loading', () => {
    const onPressMock = jest.fn();
    renderWithTheme(<AppButton title="Click Me" isLoading onPress={onPressMock} />);

    const button = screen.getByText('Click Me');
    fireEvent.press(button);

    // Button should not call onPress when loading
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
