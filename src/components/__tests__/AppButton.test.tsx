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
  describe('rendering', () => {
    it('should render button with title text', () => {
      renderWithTheme(<AppButton title="Click Me" />);
      expect(screen.getByText('Click Me')).toBeTruthy();
    });

    it('should render with different variants', () => {
      const { rerender } = renderWithTheme(<AppButton title="Primary" variant="primary" />);
      expect(screen.getByText('Primary')).toBeTruthy();

      rerender(
        <ThemeProvider theme={theme}>
          <AppButton title="Secondary" variant="secondary" />
        </ThemeProvider>
      );
      expect(screen.getByText('Secondary')).toBeTruthy();

      rerender(
        <ThemeProvider theme={theme}>
          <AppButton title="Outline" variant="outline" />
        </ThemeProvider>
      );
      expect(screen.getByText('Outline')).toBeTruthy();

      rerender(
        <ThemeProvider theme={theme}>
          <AppButton title="Danger" variant="danger" />
        </ThemeProvider>
      );
      expect(screen.getByText('Danger')).toBeTruthy();
    });

    it('should render with different sizes', () => {
      const { rerender } = renderWithTheme(<AppButton title="Small" size="small" />);
      expect(screen.getByText('Small')).toBeTruthy();

      rerender(
        <ThemeProvider theme={theme}>
          <AppButton title="Medium" size="medium" />
        </ThemeProvider>
      );
      expect(screen.getByText('Medium')).toBeTruthy();

      rerender(
        <ThemeProvider theme={theme}>
          <AppButton title="Large" size="large" />
        </ThemeProvider>
      );
      expect(screen.getByText('Large')).toBeTruthy();
    });

    it('should render full width button', () => {
      renderWithTheme(<AppButton title="Full Width" fullWidth />);
      expect(screen.getByText('Full Width')).toBeTruthy();
    });
  });

  describe('interactions', () => {
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

    it('should not call onPress when loading', () => {
      const onPressMock = jest.fn();
      renderWithTheme(<AppButton title="Click Me" isLoading onPress={onPressMock} />);

      const button = screen.getByText('Click Me');
      fireEvent.press(button);

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should show loading state with title visible', () => {
      renderWithTheme(<AppButton title="Loading..." isLoading />);
      expect(screen.getByText('Loading...')).toBeTruthy();
    });

    it('should disable button when loading', () => {
      const onPressMock = jest.fn();
      renderWithTheme(<AppButton title="Submit" isLoading onPress={onPressMock} />);

      const button = screen.getByText('Submit');
      fireEvent.press(button);

      // Button should not call onPress when loading
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('should render disabled button', () => {
      renderWithTheme(<AppButton title="Disabled" disabled />);
      expect(screen.getByText('Disabled')).toBeTruthy();
    });

    it('should not respond to press when disabled', () => {
      const onPressMock = jest.fn();
      renderWithTheme(<AppButton title="Disabled" disabled onPress={onPressMock} />);

      fireEvent.press(screen.getByText('Disabled'));

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });
});
