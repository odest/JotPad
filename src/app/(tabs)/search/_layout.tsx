import { Stack } from 'expo-router';

import { tabRootOptions, useStackOptions } from '@/navigation/use-stack-options';
import { useT } from '@/i18n';

export default function SearchLayout() {
  const t = useT();
  return (
    <Stack screenOptions={useStackOptions()}>
      <Stack.Screen name="index" options={{ title: t.tabs.search, ...tabRootOptions }} />
    </Stack>
  );
}
