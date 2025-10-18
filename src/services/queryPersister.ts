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

// Initialize MMKV storage instance
const storage = new MMKV();

// Create a custom persister for React Query
export const mmkvPersister: Persister = {
  persistClient: (client) => {
    storage.set('reactQuery', JSON.stringify(client));
  },
  restoreClient: () => {
    const clientString = storage.getString('reactQuery');
    if (!clientString) {
      return undefined;
    }
    return JSON.parse(clientString);
  },
  removeClient: () => {
    storage.delete('reactQuery');
  },
};