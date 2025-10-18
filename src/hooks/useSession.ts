import { getCurrentUser } from '@/api/api';
import { clearCredentials, setCredentials } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';
import { useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const TOKEN_KEY = 'authToken';

// TODO: Replace with actual role/permission system from backend
// Currently using DummyJSON test username - not suitable for production
const SUPERADMIN_USERNAME = 'kminchelle'; 

/**
 * Helper function to save auth token to SecureStore
 * Call this after successful login
 */
export async function saveAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

/**
 * Custom hook to manage user session
 * 
 * On mount, this hook:
 * 1. Attempts to read the auth token from SecureStore
 * 2. If a token exists, validates it by calling getCurrentUser API
 * 3. Dispatches action to set user credentials in Redux store
 * 
 * Provides:
 * - user: Current user object (null if not authenticated)
 * - token: Current auth token (null if not authenticated)
 * - isLoading: Loading state during session restoration
 * - signOut: Function to clear session and cache
 */
export function useSession() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const signOut = useCallback(async () => {
    // Clear Redux state
    dispatch(clearCredentials());
    
    // Delete token from SecureStore
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to delete token from SecureStore:', error);
    }
    
    // Clear React Query cache
    queryClient.clear();
  }, [dispatch, queryClient]);

  useEffect(() => {
    async function restoreSession() {
      try {
        // Attempt to read token from SecureStore
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        
        if (storedToken) {
          // Temporarily set token (with null user) to enable authenticated API calls
          dispatch(setCredentials({ 
            token: storedToken, 
            user: null 
          }));
          
          // Validate token and fetch current user data
          const currentUser = await getCurrentUser();
          
          // Set full credentials with user data
          dispatch(setCredentials({ 
            token: storedToken, 
            user: currentUser, 
            superadminUser: SUPERADMIN_USERNAME 
          }));
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        // If session restoration fails, ensure state is cleared
        await signOut();
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return {
    user,
    token,
    isLoading,
    signOut,
  };
}