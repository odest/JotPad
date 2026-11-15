import '@/global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { applySavedTheme } from '@/data/preferences';
import { useDatabase } from '@/data/use-database';
import { useStackOptions } from '@/navigation/use-stack-options';
import { ThemeProvider } from '@/theme';

applySavedTheme();

export default function RootLayout() {
  // The splash screen stays up until the first render with content.
  const ready = useDatabase();
  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <StatusBar style="auto" />
        <RootStack />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootStack() {
  return (
    <Stack screenOptions={useStackOptions()}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Opaque header: the inverted message list must not scroll under it. */}
      <Stack.Screen name="note/[id]" options={{ headerTransparent: false }} />
    </Stack>
  );
}
