import { LockScreenOverlay } from '@/components/LockScreenOverlay';
import { useAutoLock } from '@/hooks/useAutoLock';
import { queryClient } from '@/services/queryClient';
import { mmkvPersister } from '@/services/queryPersister';
import { RootState, store } from '@/store/store';
import { theme } from '@/theme/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useFonts } from 'expo-font';
import { Redirect, Stack, useRootNavigationState, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
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
  initialRouteName: 'index',
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
          <AppLocker />
        </ThemeProvider>
      </PersistQueryClientProvider>
    </Provider>
  );
}

// AppLocker component handles auto-lock functionality and lock screen overlay
function AppLocker() {
  const { resetTimer } = useAutoLock();
  const { isLocked } = useSelector((state: RootState) => state.lock);
  const authToken = useSelector((state: RootState) => state.auth.token);
  const navState = useRootNavigationState();
  const segments = useSegments();
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);

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

  // Single-source navigation: redirect to the correct branch when auth changes
  const lastAuthRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (!navState?.key) return; // wait until navigation is ready
    const isAuth = !!authToken;
    if (lastAuthRef.current === isAuth) return;
    lastAuthRef.current = isAuth;

    const first = (segments[0] as unknown as string | undefined) ?? undefined;
    const atTabs = first === '(tabs)';
    const atIndex = first == null || first === 'index';

    if (isAuth && !atTabs) {
      setShouldRedirect('/(tabs)/products');
    } else if (!isAuth && atTabs) {
      setShouldRedirect('/');
    } else {
      setShouldRedirect(null);
    }

  }, [authToken, navState?.key, segments]);

  // Handle redirect using Redirect component
  if (shouldRedirect) {
    return <Redirect href={shouldRedirect as any} />;
  }

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
      {isLocked && <LockScreenOverlay />}
    </View>
  );
}

// (Auth navigation is handled declaratively by the index route and tabs layout)
