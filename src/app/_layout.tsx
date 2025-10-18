import { queryClient } from '@/services/queryClient';
import { mmkvPersister } from '@/services/queryPersister';
import { store } from '@/store/store';
import { theme } from '@/theme/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components/native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {

  return (
    <Provider store={store}>
      <PersistQueryClientProvider 
        client={queryClient} 
        persistOptions={{ persister: mmkvPersister }}
      >
        <ThemeProvider theme={theme}>
          <Stack>
            <Stack.Screen name="index" options={{ title: 'Login' }} />
          </Stack>
          <Toast />
        </ThemeProvider>
      </PersistQueryClientProvider>
    </Provider>
  );
}
