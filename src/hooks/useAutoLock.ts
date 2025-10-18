import { setLocked } from '@/store/slices/lockSlice';
import { RootState } from '@/store/store';
import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const INACTIVITY_TIMEOUT = 10000; // 10 seconds in milliseconds

/**
 * Custom hook to manage auto-lock functionality
 * 
 * Features:
 * - Auto-locks after 10 seconds of inactivity
 * - Locks immediately when app goes to background
 * - Provides resetTimer function to reset inactivity countdown
 * - Only locks if user is authenticated (has token)
 * 
 * Usage:
 * const { resetTimer } = useAutoLock();
 * // Call resetTimer() on user interaction to prevent auto-lock
 */
export function useAutoLock() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Resets the inactivity timer
   * Call this on any user interaction (touch, scroll, etc.)
   */
  const resetTimer = useCallback(() => {
    // Only set timer if user is logged in
    if (!token) return;

    // Clear existing timer
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    // Set new timer
    inactivityTimer.current = setTimeout(() => {
      dispatch(setLocked(true));
    }, INACTIVITY_TIMEOUT);
  }, [dispatch, token]);

  /**
   * Handle app state changes (foreground/background)
   */
  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      // Lock immediately when app goes to background
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (token) {
          dispatch(setLocked(true));
        }
        // Clear the inactivity timer
        if (inactivityTimer.current) {
          clearTimeout(inactivityTimer.current);
        }
      }

      // Reset timer when app becomes active
      if (nextAppState === 'active') {
        resetTimer();
      }
    },
    [dispatch, token, resetTimer]
  );

  // Set up AppState listener
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Start the initial timer
    resetTimer();

    // Cleanup
    return () => {
      subscription.remove();
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [handleAppStateChange, resetTimer]);

  // Clear timer when user logs out (token becomes null)
  useEffect(() => {
    if (!token && inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
  }, [token]);

  return { resetTimer };
}