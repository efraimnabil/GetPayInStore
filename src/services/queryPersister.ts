import { Persister } from '@tanstack/react-query-persist-client';
import { MMKV } from 'react-native-mmkv';

/**
 * IMPORTANT: react-native-mmkv is a native module.
 * After installing this package, you must run:
 * 
 *   npx expo prebuild
 * 
 * This generates the native iOS and Android projects with MMKV properly linked.
 * For development builds, rebuild your app after running prebuild.
 */

// Initialize MMKV storage instance with error handling
let storage: MMKV | null = null;

try {
  storage = new MMKV();
  console.log('✅ MMKV initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize MMKV:', error);
  console.error('The app will use in-memory storage instead. Please rebuild the app with New Architecture enabled.');
}

// Fallback in-memory storage for when MMKV is not available
const inMemoryStorage: { [key: string]: string } = {};

// Create a custom persister for React Query
export const mmkvPersister: Persister = {
  persistClient: (client) => {
    try {
      if (storage) {
        storage.set('reactQuery', JSON.stringify(client));
      } else {
        inMemoryStorage.reactQuery = JSON.stringify(client);
      }
    } catch (error) {
      console.error('Failed to persist client:', error);
    }
  },
  restoreClient: () => {
    try {
      const clientString = storage 
        ? storage.getString('reactQuery')
        : inMemoryStorage.reactQuery;
      
      if (!clientString) {
        return undefined;
      }
      return JSON.parse(clientString);
    } catch (error) {
      console.error('Failed to restore client:', error);
      return undefined;
    }
  },
  removeClient: () => {
    try {
      if (storage) {
        storage.delete('reactQuery');
      } else {
        delete inMemoryStorage.reactQuery;
      }
    } catch (error) {
      console.error('Failed to remove client:', error);
    }
  },
};