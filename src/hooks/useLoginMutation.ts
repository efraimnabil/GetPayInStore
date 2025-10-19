import { login } from '@/api/api';
import { saveToken } from '@/services/auth';
import { setCredentials } from '@/store/slices/authSlice';
import { LoginCredentials, LoginResponse } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
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
        // Ensure token is a string
        const tokenString = String(data.accessToken || '');
        
        if (!tokenString) {
          throw new Error('No token received from server');
        }

        // On success, store token and user data
        await saveToken(tokenString);
        const { accessToken, refreshToken, ...user } = data;
        dispatch(setCredentials({ user, token: tokenString, superadminUser: SUPERADMIN_USERNAME }));

        // Show success toast
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: `Welcome back, ${user.firstName}!`,
        });


        // Navigate to login page
        router.replace('/(tabs)/products');
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