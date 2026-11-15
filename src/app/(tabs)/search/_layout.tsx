import { Stack } from 'expo-router';

import { useStackOptions } from '@/navigation/use-stack-options';

export default function SearchLayout() {
  return (
    <Stack screenOptions={useStackOptions()}>
      <Stack.Screen name="index" options={{ title: 'Search', headerLargeTitleEnabled: true }} />
    </Stack>
  );
}
