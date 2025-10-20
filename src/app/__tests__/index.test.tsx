import { ThemeProvider } from '@/contexts/ThemeContext';
import authReducer from '@/store/slices/authSlice';
import lockReducer from '@/store/slices/lockSlice';
import { lightTheme } from '@/theme/theme';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import Index from '../index';

// Mock MMKV storage
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => ({
    getString: jest.fn(() => 'light'),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock the useLoginMutation hook
const mockMutate = jest.fn();
jest.mock('@/hooks/useLoginMutation', () => ({
  useLoginMutation: jest.fn(() => ({
    mutate: mockMutate,
    isPending: false,
  })),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  Redirect: jest.fn(() => null),
  router: {
    replace: jest.fn(),
  },
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => children,
}));

// Helper to create a test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      lock: lockReducer,
    },
    preloadedState: initialState,
  });
};

// Helper to render with providers
const renderWithProviders = (
  component: React.ReactElement,
  { initialState = {} } = {}
) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <ThemeProvider>
        <StyledThemeProvider theme={lightTheme}>
          {component}
        </StyledThemeProvider>
      </ThemeProvider>
    </Provider>
  );
};

describe('LoginScreen', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render username input field', () => {
      renderWithProviders(<Index />);
      const usernameInput = screen.getByPlaceholderText('Enter your username');
      expect(usernameInput).toBeTruthy();
    });

    it('should render password input field', () => {
      renderWithProviders(<Index />);
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      expect(passwordInput).toBeTruthy();
    });

    it('should render sign in button', () => {
      renderWithProviders(<Index />);
      const signInButton = screen.getByText('Sign In');
      expect(signInButton).toBeTruthy();
    });
  });

  describe('form interactions', () => {
    it('should update username field when text is entered', () => {
      renderWithProviders(<Index />);
      const usernameInput = screen.getByPlaceholderText('Enter your username');

      fireEvent.changeText(usernameInput, 'testuser');

      expect(usernameInput.props.value).toBe('testuser');
    });

    it('should update password field when text is entered', () => {
      renderWithProviders(<Index />);
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      fireEvent.changeText(passwordInput, 'testpass123');

      expect(passwordInput.props.value).toBe('testpass123');
    });

    it('should have password field with secureTextEntry enabled by default', () => {
      renderWithProviders(<Index />);
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      // Initially, password should be hidden (secureTextEntry = true)
      expect(passwordInput.props.secureTextEntry).toBe(true);
    });
  });

  describe('form validation', () => {
    it('should show error when submitting empty username', () => {
      renderWithProviders(<Index />);

      const signInButton = screen.getByText('Sign In');
      fireEvent.press(signInButton);

      expect(screen.getByText('Username is required')).toBeTruthy();
    });

    it('should show error when submitting empty password', () => {
      renderWithProviders(<Index />);

      const usernameInput = screen.getByPlaceholderText('Enter your username');
      fireEvent.changeText(usernameInput, 'testuser');

      const signInButton = screen.getByText('Sign In');
      fireEvent.press(signInButton);

      expect(screen.getByText('Password is required')).toBeTruthy();
    });

    it('should show error when password is too short', () => {
      renderWithProviders(<Index />);

      const usernameInput = screen.getByPlaceholderText('Enter your username');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      fireEvent.changeText(usernameInput, 'testuser');
      fireEvent.changeText(passwordInput, 'ab'); // Less than 3 characters

      const signInButton = screen.getByText('Sign In');
      fireEvent.press(signInButton);

      expect(screen.getByText('Password must be at least 3 characters')).toBeTruthy();
    });

    it('should clear errors when user starts typing', () => {
      renderWithProviders(<Index />);

      const signInButton = screen.getByText('Sign In');
      fireEvent.press(signInButton);

      // Errors should be visible
      expect(screen.getByText('Username is required')).toBeTruthy();

      // Start typing in username field
      const usernameInput = screen.getByPlaceholderText('Enter your username');
      fireEvent.changeText(usernameInput, 'test');

      // Username error should be cleared
      expect(screen.queryByText('Username is required')).toBeNull();
    });
  });

  describe('login submission', () => {
    it('should call mutate function with correct credentials when form is submitted', () => {
      renderWithProviders(<Index />);

      // Fill in the form
      const usernameInput = screen.getByPlaceholderText('Enter your username');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      fireEvent.changeText(usernameInput, 'emilys');
      fireEvent.changeText(passwordInput, 'emilyspass');

      // Submit the form
      const signInButton = screen.getByText('Sign In');
      fireEvent.press(signInButton);

      // Assert that mutate was called with correct credentials
      expect(mockMutate).toHaveBeenCalledTimes(1);
      expect(mockMutate).toHaveBeenCalledWith({
        username: 'emilys',
        password: 'emilyspass',
      });
    });

    it('should trim whitespace from credentials before submission', () => {
      renderWithProviders(<Index />);

      const usernameInput = screen.getByPlaceholderText('Enter your username');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      fireEvent.changeText(usernameInput, '  testuser  ');
      fireEvent.changeText(passwordInput, '  testpass  ');

      const signInButton = screen.getByText('Sign In');
      fireEvent.press(signInButton);

      expect(mockMutate).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass',
      });
    });

    it('should not call mutate when form is invalid', () => {
      renderWithProviders(<Index />);

      const signInButton = screen.getByText('Sign In');
      fireEvent.press(signInButton);

      // mutate should not be called with empty form
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should show loading text when login is pending', () => {
      const { useLoginMutation } = require('@/hooks/useLoginMutation');
      useLoginMutation.mockImplementation(() => ({
        mutate: mockMutate,
        isPending: true,
      }));

      renderWithProviders(<Index />);

      expect(screen.getByText('Signing in...')).toBeTruthy();
    });

    it('should disable form inputs when login is pending', () => {
      const { useLoginMutation } = require('@/hooks/useLoginMutation');
      useLoginMutation.mockImplementation(() => ({
        mutate: mockMutate,
        isPending: true,
      }));

      renderWithProviders(<Index />);

      const usernameInput = screen.getByPlaceholderText('Enter your username');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      expect(usernameInput.props.editable).toBe(false);
      expect(passwordInput.props.editable).toBe(false);
    });

    it('should disable button when login is pending', () => {
      const { useLoginMutation } = require('@/hooks/useLoginMutation');
      useLoginMutation.mockImplementation(() => ({
        mutate: mockMutate,
        isPending: true,
      }));

      renderWithProviders(<Index />);

      const button = screen.getByText('Signing in...');
      fireEvent.press(button);

      // mutate should not be called when already pending
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('authentication redirect', () => {
    it('should redirect to products tab when user is already authenticated', () => {
      const { Redirect } = require('expo-router');

      const initialState = {
        auth: {
          token: 'test-token-123',
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            gender: 'male',
            image: 'https://example.com/avatar.jpg',
          },
          isSuperadmin: false,
        },
      };

      renderWithProviders(<Index />, { initialState });

      // Redirect component should be called
      expect(Redirect).toHaveBeenCalled();
    });

    it('should not redirect when user is not authenticated', () => {
      const { Redirect, useLoginMutation } = require('expo-router');
      const loginHook = require('@/hooks/useLoginMutation');
      
      // Reset the mock to default behavior
      loginHook.useLoginMutation.mockImplementation(() => ({
        mutate: mockMutate,
        isPending: false,
      }));
      
      Redirect.mockClear();

      renderWithProviders(<Index />);

      // Login form should be visible
      expect(screen.getByText('Sign In')).toBeTruthy();
    });
  });
});
