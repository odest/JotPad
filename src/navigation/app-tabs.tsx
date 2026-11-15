import { NativeTabs } from 'expo-router/native-tabs';

import { usePalette } from '@/theme';
import { t } from '@/i18n';

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
        <NativeTabs.Trigger.Label>{t.tabs.notes}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Icon sf="magnifyingglass" />
        <NativeTabs.Trigger.Label>{t.tabs.search}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tags">
        <NativeTabs.Trigger.Icon sf={{ default: 'tag', selected: 'tag.fill' }} />
        <NativeTabs.Trigger.Label>{t.tabs.tags}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} />
        <NativeTabs.Trigger.Label>{t.tabs.settings}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
