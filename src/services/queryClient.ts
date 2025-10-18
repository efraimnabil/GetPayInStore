import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default staleTime can be configured here if needed
      // e.g., staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
  queryCache: new QueryCache({
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message ||
        'A query error occurred';
      Toast.show({ type: 'error', text1: 'Error', text2: errorMessage });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message ||
        'An error occurred';
      Toast.show({ type: 'error', text1: 'Error', text2: errorMessage });
    },
  }),
});
