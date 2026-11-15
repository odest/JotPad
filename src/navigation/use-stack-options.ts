import { type Stack } from 'expo-router';
import { type ComponentProps } from 'react';

import { usePalette } from '@/theme';

type StackScreenOptions = ComponentProps<typeof Stack>['screenOptions'];

/**
 * Options for the first screen of each tab. iOS uses the system large title; Android
 * gives the title the larger, heavier type of Material 3 Expressive app bars.
 */
export const tabRootOptions: ComponentProps<typeof Stack.Screen>['options'] =
  process.env.EXPO_OS === 'ios'
    ? { headerLargeTitleEnabled: true }
    : { headerTitleStyle: { fontSize: 28, fontWeight: '600' } };

/**
 * Header styling shared by every stack. iOS keeps the system header (large title,
 * transparent so content scrolls under the glass); Android gets a flat Material top
 * app bar on the surface color.
 */
export function useStackOptions(): StackScreenOptions {
  const palette = usePalette();

  if (process.env.EXPO_OS === 'ios') {
    return {
      headerTransparent: true,
      headerShadowVisible: false,
      headerLargeTitleShadowVisible: false,
      headerLargeStyle: { backgroundColor: 'transparent' },
      headerBackButtonDisplayMode: 'minimal',
      contentStyle: { backgroundColor: palette.surface },
    };
  }

  return {
    headerStyle: { backgroundColor: palette.surface },
    headerTintColor: palette['on-surface'],
    headerShadowVisible: false,
    contentStyle: { backgroundColor: palette.surface },
  };
}
