import { NativeTabs } from 'expo-router/native-tabs';

import { usePalette } from '@/theme';

export default function TabsLayout() {
  const palette = usePalette();

  // iOS keeps the system tab bar untouched (Liquid Glass on iOS 26). Android's
  // navigation bar takes the Material 3 roles so it follows the dynamic palette.
  const androidColors =
    process.env.EXPO_OS === 'android'
      ? {
          backgroundColor: palette['surface-container'],
          indicatorColor: palette['secondary-container'],
          rippleColor: palette['secondary-container'],
          iconColor: {
            default: palette['on-surface-variant'],
            selected: palette['on-secondary-container'],
          },
          labelStyle: {
            default: { color: palette['on-surface-variant'] },
            selected: { color: palette['on-surface'] },
          },
        }
      : null;

  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      tintColor={palette.primary}
      // Material 3 navigation bars label every destination, not only the selected one.
      labelVisibilityMode="labeled"
      {...androidColors}
    >
      <NativeTabs.Trigger name="(notes)">
        <NativeTabs.Trigger.Icon
          sf={{
            default: 'bubble.left.and.bubble.right',
            selected: 'bubble.left.and.bubble.right.fill',
          }}
          md="chat"
        />
        <NativeTabs.Trigger.Label>Notes</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tags">
        <NativeTabs.Trigger.Icon sf={{ default: 'tag', selected: 'tag.fill' }} md="sell" />
        <NativeTabs.Trigger.Label>Tags</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'gearshape', selected: 'gearshape.fill' }}
          md="settings"
        />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
