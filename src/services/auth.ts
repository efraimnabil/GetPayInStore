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
  await deleteToken();
  // Clear in-memory cache
  queryClient.clear();
  // Clear persisted cache
  try {
    await mmkvPersister.removeClient();
  } catch {}
  // Clear redux auth state (this triggers navigation in _layout.tsx)
  dispatch(clearCredentials());
}
