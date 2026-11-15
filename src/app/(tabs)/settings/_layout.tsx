import { Stack } from 'expo-router';

import { tabRootOptions, useStackOptions } from '@/navigation/use-stack-options';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={useStackOptions()}>
      <Stack.Screen name="index" options={{ title: 'Settings', ...tabRootOptions }} />
    </Stack>
  );
}
