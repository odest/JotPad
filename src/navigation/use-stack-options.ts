import { type Stack } from 'expo-router';
import { type ComponentProps } from 'react';

import { usePalette } from '@/theme';

type StackScreenOptions = ComponentProps<typeof Stack>['screenOptions'];

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
