import '@/global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { useStackOptions } from '@/navigation/use-stack-options';
import { ThemeProvider, usePalette } from '@/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* The app draws edge to edge; without these the provider insets the whole app
          below the status bar on Android. */}
      <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
        <ThemeProvider>
          <StatusBar style="auto" />
          <RootStack />
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

function RootStack() {
  const palette = usePalette();
  const isIos = process.env.EXPO_OS === 'ios';

  return (
    <Stack screenOptions={useStackOptions()}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Opaque header: the inverted message list must not scroll under it. */}
      <Stack.Screen name="note/[id]" options={{ headerTransparent: false }} />
      <Stack.Screen
        name="new-note"
        options={{
          presentation: 'formSheet',
          headerShown: false,
          sheetAllowedDetents: 'fitToContents',
          sheetGrabberVisible: true,
          sheetCornerRadius: isIos ? undefined : 28,
          // Transparent content lets iOS 26 draw the sheet as Liquid Glass.
          contentStyle: {
            backgroundColor: isIos ? 'transparent' : palette['surface-container-low'],
          },
        }}
      />
    </Stack>
  );
}
