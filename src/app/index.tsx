import { LoginScreen } from '@/screens';
import { RootState } from '@/store/store';
import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';

/**
 * Root index route - handles authentication routing
 * - If user is authenticated (has token), redirect to main app
 * - If user is not authenticated, show login screen
 */
export default function Index() {
  const token = useSelector((state: RootState) => state.auth.token);

  // If user is already authenticated, redirect to main app
  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  // Otherwise, show login screen
  return <LoginScreen />;
}
