import { NativeTabs } from 'expo-router/native-tabs';

import { usePalette } from '@/theme';

/** The system tab bar, untouched so it keeps Liquid Glass on iOS 26. */
export function AppTabs() {
  const palette = usePalette();

  return (
    <NativeTabs minimizeBehavior="onScrollDown" tintColor={palette.primary}>
      <NativeTabs.Trigger name="(notes)">
        <NativeTabs.Trigger.Icon
          sf={{
            default: 'bubble.left.and.bubble.right',
            selected: 'bubble.left.and.bubble.right.fill',
          }}
        />
        <NativeTabs.Trigger.Label>Notes</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Icon sf="magnifyingglass" />
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tags">
        <NativeTabs.Trigger.Icon sf={{ default: 'tag', selected: 'tag.fill' }} />
        <NativeTabs.Trigger.Label>Tags</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
