import { login } from '@/api/api';
import { setCredentials } from '@/store/slices/authSlice';
import { LoginCredentials, LoginResponse } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';

const SUPERADMIN_USERNAME = 'emilys'; // As per DummyJSON docs
const TOKEN_KEY = 'authToken';

export function useLoginMutation() {
  const dispatch = useDispatch();

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: login,
    onSuccess: async (data) => {
      try {
        console.log('Login response data:', data);
        
        // Ensure token is a string
        const tokenString = String(data.accessToken || '');
        
        if (!tokenString) {
          throw new Error('No token received from server');
        }

        // On success, store token and user data
        await SecureStore.setItemAsync(TOKEN_KEY, tokenString);
        const { accessToken, refreshToken, ...user } = data;
        dispatch(setCredentials({ user, token: tokenString, superadminUser: SUPERADMIN_USERNAME }));

        // Show success toast
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: `Welcome back, ${user.firstName}!`,
        });

        // Navigate to the main app screen
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Error saving token:', error);
        Toast.show({
          type: 'error',
          text1: 'Login Error',
          text2: 'Failed to save authentication data',
        });
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        'Invalid username or password';

      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
      });
    },
  });
}