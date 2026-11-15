import { Stack } from 'expo-router';

import { tabRootOptions, useStackOptions } from '@/navigation/use-stack-options';
import { t } from '@/i18n';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={useStackOptions()}>
      <Stack.Screen name="index" options={{ title: t.tabs.settings, ...tabRootOptions }} />
    </Stack>
  );
}
