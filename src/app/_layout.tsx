import { LockScreenOverlay } from '@/components/LockScreenOverlay';
import { useAutoLock } from '@/hooks/useAutoLock';
import { queryClient } from '@/services/queryClient';
import { mmkvPersister } from '@/services/queryPersister';
import { RootState, store } from '@/store/store';
import { theme } from '@/theme/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { PanResponder, View } from 'react-native';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { Provider, useSelector } from 'react-redux';
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
          <AppContent />
        </ThemeProvider>
      </PersistQueryClientProvider>
    </Provider>
  );
}

// Separate component that can use Redux hooks
function AppContent() {
  const { resetTimer } = useAutoLock();
  const { isLocked } = useSelector((state: RootState) => state.lock);

  // Create PanResponder to detect any touch and reset the inactivity timer
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        resetTimer();
        return false; // Don't capture the touch, let it pass through
      },
      onMoveShouldSetPanResponder: () => {
        resetTimer();
        return false;
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
      
      {/* Conditionally render lock screen overlay */}
      {isLocked && <LockScreenOverlay />}
    </View>
  );
}
