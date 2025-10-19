import { clearCredentials } from '@/store/slices/authSlice';
import type { AppDispatch } from '@/store/store';
import { QueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { mmkvPersister } from './queryPersister';

export const TOKEN_KEY = 'authToken';

export async function getStoredToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function deleteToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {}
}

/**
 * Single, centralized sign-out. No navigation here; UI responds to auth state.
 */
export async function signOutApp(queryClient: QueryClient, dispatch: AppDispatch): Promise<void> {
  console.log('SignOut: Starting sign out process...');
  await deleteToken();
  console.log('SignOut: Token deleted from SecureStore');
  // Clear in-memory cache
  queryClient.clear();
  console.log('SignOut: Query client cache cleared');
  // Clear persisted cache
  try {
    await mmkvPersister.removeClient();
    console.log('SignOut: MMKV persisted cache cleared');
  } catch (error) {
    console.log('SignOut: Error clearing MMKV cache:', error);
  }
  // Clear redux auth state (this triggers navigation in _layout.tsx)
  dispatch(clearCredentials());
  console.log('SignOut: Redux auth state cleared - token should now be null');
}
