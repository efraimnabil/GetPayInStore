import { getCurrentUser } from '@/api/api';
import { deleteToken, getStoredToken, saveToken, signOutApp } from '@/services/auth';
import { clearCredentials, setCredentials } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';
import { useQueryClient } from '@tanstack/react-query';
// SecureStore usage is centralized in services/auth
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// TOKEN_KEY centralized in services/auth

// Global guard to avoid re-running session restoration on every hook remount
// This persists for the JS runtime lifetime (until app reload)
let hasRestoredSessionGlobal = false;

// TODO: Replace with actual role/permission system from backend
// Currently using DummyJSON test username - not suitable for production
const SUPERADMIN_USERNAME = 'kminchelle'; 

/**
 * Helper function to save auth token to SecureStore
 * Call this after successful login
 */
export async function saveAuthToken(token: string): Promise<void> {
  await saveToken(token);
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
  // Initialize based on global restoration flag to prevent flashing/loading loops
  const [isLoading, setIsLoading] = useState(!hasRestoredSessionGlobal);
  const [sessionRestored, setSessionRestored] = useState(hasRestoredSessionGlobal);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  console.log('🔄 useSession called - isLoading:', isLoading, 'sessionRestored:', sessionRestored, 'user:', user ? 'exists' : 'null', 'token:', token ? 'exists' : 'null');

  const signOut = useCallback(async () => {
    await signOutApp(queryClient, dispatch as any);
  }, [dispatch, queryClient]);

  useEffect(() => {
    // Run session restoration only once per app runtime
    if (hasRestoredSessionGlobal) return;

    console.log('🔍 Starting session restoration...');

    async function restoreSession() {
      try {
        // Attempt to read token from SecureStore
  const storedToken = await getStoredToken();
        
        console.log('🔑 Stored token:', storedToken ? 'exists' : 'null');
        
        if (storedToken) {
          // Temporarily set token (with null user) to enable authenticated API calls
          dispatch(setCredentials({ 
            token: storedToken, 
            user: null 
          }));
          
          // Validate token and fetch current user data
          try {
            const currentUser = await getCurrentUser();
            
            // Set full credentials with user data
            dispatch(setCredentials({ 
              token: storedToken, 
              user: currentUser, 
              superadminUser: SUPERADMIN_USERNAME 
            }));
            console.log('✅ Session restored successfully');
          } catch (apiError) {
            // If API call fails (network error, invalid token, etc.), clear session
            console.log('Session validation failed - clearing credentials');
            dispatch(clearCredentials());
            await deleteToken();
          }
        } else {
          console.log('📭 No stored token - user not logged in');
        }
      } catch (error) {
        // If session restoration fails, ensure state is cleared
        console.log('Session restore:', error);
        dispatch(clearCredentials());
      } finally {
        console.log('✅ Session restoration complete - setting isLoading to false');
        setIsLoading(false);
        setSessionRestored(true);
        hasRestoredSessionGlobal = true;
      }
    }

    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on first app mount

  // CRITICAL: When user logs out (token becomes null after session was restored),
  // ensure isLoading is false so TabLayout can properly redirect
  useEffect(() => {
    if (sessionRestored && token === null && user === null) {
      console.log('🚪 User logged out - ensuring isLoading is false');
      setIsLoading(false);
    }
  }, [token, user, sessionRestored]);

  return {
    user,
    token,
    isLoading,
    signOut,
  };
}