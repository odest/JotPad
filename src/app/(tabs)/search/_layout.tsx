import { Stack } from 'expo-router';

import { tabRootOptions, useStackOptions } from '@/navigation/use-stack-options';

export default function SearchLayout() {
  return (
    <Stack screenOptions={useStackOptions()}>
      <Stack.Screen name="index" options={{ title: 'Search', ...tabRootOptions }} />
    </Stack>
  );
}
