import { Stack } from 'expo-router';

import { tabRootOptions, useStackOptions } from '@/navigation/use-stack-options';

export default function TagsLayout() {
  return (
    <Stack screenOptions={useStackOptions()}>
      <Stack.Screen name="index" options={{ title: 'Tags', ...tabRootOptions }} />
    </Stack>
  );
}
